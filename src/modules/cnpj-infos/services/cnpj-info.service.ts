import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class CnpjInfoService {
  constructor() {}

  async getCnpjInfo(cnpj: string) {
    try {
      const cnpjInfo = await axios.get(
        `https://www.receitaws.com.br/v1/cnpj/${cnpj}`,
      );

      return {
        cnpj: cnpjInfo.data.cnpj,
        celphone: cnpjInfo.data.telefone,
        email: cnpjInfo.data.email,
        cep: cnpjInfo.data.cep,
        number: cnpjInfo.data.numero,
        socialReason: cnpjInfo.data.nome,
      };
    } catch (error) {
      console.error('Erro ao buscar CNPJ:', error);
      throw error;
    }
  }
}
