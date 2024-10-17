import { capitalizeFirstLetter } from 'src/helpers/string';

export const formatLead = (lead) => {
  return {
    id: lead.id,
    companyId: lead.empresa,
    userId: lead.usuario_id,
    crmCompanyId: lead.cliente,
    type: lead.tipo,
    status: lead.status?.toLowerCase(),
    responsable: lead.responsavel,
    reference: lead.referencia,
    description: lead.descricao,
    date: lead.date,
    contact: lead.contato,
    contract: capitalizeFirstLetter(lead.contrato?.toLowerCase()),
    value: lead.valor,
    email: lead.email,
    celphone: lead.telefone,
    solicitationMonth: formatMonth(lead.mes_solicitacao),
    solicitationYear: lead.ano_solicitacao,
    updatedAt: lead.dt_atualizacao,
    userCompanyId: lead.usuarioEmpresa,
  };
};

const formatMonth = (month?: number) => {
  if (!month) return;
  if (month === 1) return 'janeiro';
  if (month === 2) return 'fevereiro';
  if (month === 3) return 'março';
  if (month === 4) return 'abril';
  if (month === 5) return 'maio';
  if (month === 6) return 'junho';
  if (month === 7) return 'julho';
  if (month === 8) return 'agosto';
  if (month === 9) return 'setembro';
  if (month === 10) return 'outubro';
  if (month === 11) return 'novembro';
  return 'dezembro';
};
