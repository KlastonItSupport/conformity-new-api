export const formatUsersTrainings = (userTraining) => {
  return {
    id: userTraining?.id,
    userId: userTraining?.usuario,
    certificateId: userTraining?.certificado,
    trainingId: userTraining?.treinamento,
    date: userTraining?.data,
  };
};
