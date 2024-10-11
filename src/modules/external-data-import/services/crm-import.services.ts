import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { ContractsService } from 'src/modules/contracts/services/contracts.service';
import { DataSource } from 'typeorm';
import { formatContract } from '../formatters/contract.formatter';

@Injectable()
export class CrmImportServices {
  constructor(
    @InjectDataSource('externalConnection')
    private connection: DataSource,

    private readonly contractServices: ContractsService,
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

  async getCrm(companyId: string) {
    return await this.getContracts(companyId);
  }
}
