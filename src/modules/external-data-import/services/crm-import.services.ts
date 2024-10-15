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

@Injectable()
export class CrmImportServices {
  constructor(
    @InjectDataSource('externalConnection')
    private connection: DataSource,

    private readonly contractServices: ContractsService,
    private readonly serviceServices: ServiceService,
    private readonly crmServices: CrmServices,
    private readonly projectServices: ProjectService,
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
          AND crm_empresas.status = 'ativa' 
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

  async getCrmModule(companyId: string) {
    return await this.getProjects(companyId);
    // return await this.getServices(companyId);
    // return await this.getContracts(companyId);
  }
}
