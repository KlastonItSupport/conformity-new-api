export const formatService = (service: any) => {
  return {
    id: service.id,
    companyId: service.empresa,
    service: service.servico,
    value: service.valor,
  };
};
