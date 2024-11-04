export const formatTraining = (training) => {
  return {
    id: training.id,
    companyId: training.empresa,
    schoolId: training.escola,
    name: training.nome,
    expirationInMonths:
      training?.validade === 'N/A' ? null : Number(training.validade),
  };
};
