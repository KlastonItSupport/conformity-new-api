import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { ContractsService } from 'src/modules/contracts/services/contracts.service';
import { DataSource } from 'typeorm';
import { formatContract } from '../formatters/contract.formatter';
import { ServiceService } from 'src/modules/services/services/service.service';
import { formatService } from '../formatters/services.formatter';

@Injectable()
export class CrmImportServices {
  constructor(
    @InjectDataSource('externalConnection')
    private connection: DataSource,

    private readonly contractServices: ContractsService,
    private readonly serviceServices: ServiceService,
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
    return await this.getServices(companyId);
    // return await this.getContracts(companyId);
  }
}
