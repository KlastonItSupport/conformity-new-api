import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { ContractsService } from 'src/modules/contracts/services/contracts.service';
import { DataSource } from 'typeorm';
import { formatContract } from '../formatters/contract.formatter';
import { ServiceService } from 'src/modules/services/services/service.service';
import { formatService } from '../formatters/services.formatter';
import { CrmServices } from 'src/modules/crm-companies/services/crm-companies.service';
import { formatCrm } from '../formatters/crm.formatter';
import { formatProject } from '../formatters/project.formatter';
import { ProjectService } from 'src/modules/projects/services/project.service';
import { formatLead } from '../formatters/leads.formatter';
import { LeadsService } from 'src/modules/leads/services/leads.service';
import { formatTaskLead } from '../formatters/tasks-leads.formatter';
import { TasksLeadsService } from 'src/modules/leads/services/tasks-leads.service';

@Injectable()
export class CrmImportServices {
  constructor(
    @InjectDataSource('externalConnection')
    private connection: DataSource,

    private readonly contractServices: ContractsService,
    private readonly serviceServices: ServiceService,
    private readonly crmServices: CrmServices,
    private readonly projectServices: ProjectService,
    private readonly leadsServices: LeadsService,
    private readonly leadsTasksService: TasksLeadsService,
  ) {}

  async getContracts(companyId: string) {
    const rawQuery = `
      SELECT crm_empresas.nome_fantasia, a.*
      FROM contratos a
      LEFT JOIN crm_empresas ON crm_empresas.id = a.cliente
      WHERE a.empresa = ?
    `;

    const contracts = await this.connection.query(rawQuery, [companyId]);
    const contractsFormatted = contracts.map((contract: any) => {
      const contractFormatted = formatContract(contract);
      return contractFormatted;
    });

    const contractsCreatedPromise = contractsFormatted.map(async (contract) => {
      try {
        const contractCreated =
          await this.contractServices.createContract(contract);
        return contractCreated;
      } catch (e) {
        console.log('Erro ao criar contrato Id: -', e);
      }
    });

    const contractsCreated = await Promise.all(contractsCreatedPromise);

    return {
      toImport: contracts.length,
      imported: contractsCreated.length,
      contracts: contractsCreated,
    };
  }

  async getServices(companyId: string) {
    const rawQuery = `
      SELECT servicos.*
      FROM servicos
      WHERE servicos.empresa = ?
    `;

    const services = await this.connection.query(rawQuery, [companyId]);
    const formattedServices = services.map((service: any) => {
      const serviceFormatted = formatService(service);
      return serviceFormatted;
    });

    const servicesCreatedPromise = formattedServices.map(async (service) => {
      try {
        const serviceCreated = await this.serviceServices.create(service);
        return serviceCreated;
      } catch (e) {
        console.log('Erro ao criar serviço Id: -', e);
      }
    });

    const servicesCreated = await Promise.all(servicesCreatedPromise);

    return {
      toImport: services.length,
      imported: servicesCreated.length,
      services: servicesCreated,
    };
  }

  async getCrm(companyId: string) {
    const rawQuery = `
        SELECT crm_empresas.*, 
          CASE 
            WHEN crm_empresas.cf = 1 THEN 'Cliente' 
            WHEN crm_empresas.cf = 2 THEN 'Fornecedor' 
          END as tipo
        FROM crm_empresas
        WHERE crm_empresas.cliente = 1 
          AND crm_empresas.empresa = ?
      `;

    const companies = await this.connection.query(rawQuery, [companyId]);
    const formatCompanies = companies.map((company) => formatCrm(company));

    const createCrmPromise = formatCompanies.map(async (company) => {
      const crm = await this.crmServices.create(company);
      return crm;
    });

    const created = await Promise.all(createCrmPromise);

    return {
      toImport: companies.length,
      imported: created.length,
      crm: created,
    };
  }

  async getProjects(companyId: string) {
    const rawQuery = `
      SELECT crm_empresas.nome_fantasia, a.*,
        CASE
          WHEN a.status LIKE 'iniciado' THEN 'Iniciado'
          WHEN a.status LIKE 'parado' THEN 'Parado'
          WHEN a.status LIKE 'finalizado' THEN 'Finalizado'
          WHEN a.status LIKE 'andamento' THEN 'Em andamento'
        END as status
      FROM projetos a
      LEFT JOIN crm_empresas ON crm_empresas.id = a.cliente
      WHERE a.empresa = ?
    `;

    const projects = await this.connection.query(rawQuery, [companyId]);
    const projectsFormatted = projects.map((project) =>
      formatProject(project, companyId),
    );

    const errors = [];
    const promiseProjects = projectsFormatted.map(async (project) => {
      try {
        if (!project.crmCompanyId) {
          errors.push({ error: 'Crm not found', id: project.id });
          return;
        }
        return await this.projectServices.create(project);
      } catch (e) {
        errors.push({ error: e, id: project.id });
      }
    });

    const projectsCreated = await Promise.all(promiseProjects);
    return {
      toImport: projects.length,
      imported: projectsCreated.length - errors.length,
      errors,
      projects: projectsCreated,
    };
  }

  async getLeads(companyId: string) {
    const rawQuery = `
        SELECT crm_empresas.nome_fantasia as nomecli, atividades_comerciais.*, usuarios.nome as usuario, usuarios.empresa as usuarioEmpresa
        FROM atividades_comerciais
        LEFT JOIN crm_empresas ON crm_empresas.id = atividades_comerciais.cliente
        LEFT JOIN usuarios ON usuarios.id = atividades_comerciais.usuario_id
        WHERE atividades_comerciais.empresa = ?
        ORDER BY atividades_comerciais.dt_atualizacao DESC
      `;

    const leads = await this.connection.query(rawQuery, [companyId]);
    const formattedLeads = leads.map((lead) => formatLead(lead));
    const errors = [];

    const createLeadsPromise = formattedLeads.map(async (lead) => {
      try {
        if (lead.userCompanyId != companyId) return;
        const leadCreated = await this.leadsServices.create(lead);
        return leadCreated;
      } catch (e) {
        console.log('Erro no lead:', lead);
        console.log('Erro: ', e);
        errors.push({ error: e, lead });
      }
    });

    const created = await Promise.all(createLeadsPromise);

    return {
      imported: created.length - errors.length,
      toImport: leads.length,
      leads,
      errors,
    };
  }

  async getLeadsTasks(companyId: string) {
    const pageSize = 2000;
    let currentPage = 0;
    let tasksLeads = [];
    const errors = [];

    let connection;

    try {
      connection = this.connection.createQueryRunner();

      const countQuery = `
        SELECT COUNT(*) as total
        FROM atividades_tarefas
        INNER JOIN atividades_comerciais ON atividades_comerciais.id = atividades_tarefas.atividade
        WHERE atividades_comerciais.empresa = ?
      `;

      const result = await connection.query(countQuery, [companyId]);
      const totalTasks = result[0].total;

      const totalPages = Math.ceil(totalTasks / pageSize);

      console.log('Total de tarefas:', totalTasks);
      console.log('Total de páginas:', totalPages);

      while (currentPage < totalPages) {
        const offset = currentPage * pageSize;
        const rawQuery = `
          SELECT atividades_tarefas.*, usuarios.nome, crm_empresas.nome_fantasia AS nomecli
          FROM atividades_tarefas
          INNER JOIN atividades_comerciais ON atividades_comerciais.id = atividades_tarefas.atividade
          INNER JOIN crm_empresas ON crm_empresas.id = atividades_comerciais.cliente
          LEFT JOIN usuarios ON usuarios.id = atividades_tarefas.usuario
          WHERE atividades_comerciais.empresa = ?
          LIMIT ? OFFSET ?
        `;

        const tasks = await connection.query(rawQuery, [
          companyId,
          pageSize,
          offset,
        ]);

        console.log(
          `Tarefas obtidas para a página ${currentPage}:`,
          tasks.length,
        );

        if (tasks.length === 0) break;

        const formattedTasks = tasks.map((task: any) => formatTaskLead(task));

        const tasksPromise = formattedTasks.map(async (task) => {
          try {
            const taskLead = await this.leadsTasksService.createTask(
              task,
              true,
            );
            return taskLead;
          } catch (e) {
            if (e.driverError.code === 'ER_NO_REFERENCED_ROW_2') {
              errors.push(task.id);
            }
          }
        });

        const tasksInCurrentPage = (await Promise.all(tasksPromise)).filter(
          (task) => task != null,
        );

        console.log(
          'Tarefas processadas na página:',
          tasksInCurrentPage.length,
        );

        tasksLeads = tasksLeads.concat(tasksInCurrentPage);

        console.log('Página alterada - Página atual:', currentPage);
        currentPage++;
      }

      console.log('Tarefas Leads finalizadas:', tasksLeads.length);

      return {
        errors,
        totalTasks,
        totalPages,
        imported: tasksLeads.length,
        tasks: tasksLeads,
      };
    } catch (error) {
      console.error('Erro ao buscar tarefas: ', error);
      throw error;
    } finally {
      if (connection) {
        await connection.release();
      }
    }
  }

  async getCrmModule(companyId: string) {
    const crm = await this.getCrm(companyId);
    const projects = await this.getProjects(companyId);
    const services = await this.getServices(companyId);
    const contracts = await this.getContracts(companyId);
    const leads = await this.getLeads(companyId);
    const leadsTasks = await this.getLeadsTasks(companyId);
    return {
      crm,
      projects,
      services,
      contracts,
      leads,
      leadsTasks,
    };

    // return await this.getLeadsTasks(companyId);
  }
}
