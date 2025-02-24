export const formatRootCauseWhy = (rootCauseWhy: any) => {
  return {
    userId: rootCauseWhy.usuario,
    taskId: rootCauseWhy.task,
    why: rootCauseWhy.porque,
    answer: rootCauseWhy.resposta,
    date: rootCauseWhy.data,
  };
};
