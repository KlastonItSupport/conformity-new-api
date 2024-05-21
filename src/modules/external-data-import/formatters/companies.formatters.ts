import { CreateCompanyDto } from 'src/modules/companies/dtos/create-company.dto';

export const formatCompany = (data): CreateCompanyDto => {
  return {
    name: data?.nome,
    contact: data?.contato,
    email: data?.email,
    celphone: data?.telefone,
    zipCode: data?.cep,
    city: data?.cidade,
    neighborhood: data?.bairro,
    address: data?.endereco,
    number: data?.numero,
    complement: data?.complemento,
    usersLimit: data?.limite_usuarios,
    memoryLimit: data?.limite_espaco,
    status: data?.status == 'ativa' ? 'ativo' : data?.status,
  };
};
