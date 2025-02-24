export const formatClassification = (classification) => {
  return {
    id: classification?.id,
    name: classification?.nome,
    createdAt: classification?.data_criacao,
    companyId: classification?.empresa,
  };
};
