import * as moment from 'moment';

const transformDate = (dateString?: string): string => {
  try {
    if (!dateString) {
      return null;
    }
    const formattedDate = moment(dateString).format('YYYY-MM-DD');
    if (formattedDate === 'Invalid date') {
      return null;
    }
    return formattedDate;
  } catch (e) {
    return null;
  }
};

export const formatContract = (contract: any) => {
  console.log('contract', contract.descricao);
  const contractFormatted = {
    id: contract.id,
    companyId: contract.empresa,
    title: contract.titulo,
    details: contract.detalhes,
    initialDate: transformDate(contract.data_inicial),
    endDate: transformDate(contract.data_final),
    crmCompaniesId: contract.cliente,
    status: contract.status,
    link: contract.link,
    value: contract.valor,
  };
  return contractFormatted;
};
