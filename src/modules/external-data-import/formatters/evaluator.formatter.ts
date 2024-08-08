export const formatEvaluator = (evaluator: any) => {
  return {
    id: evaluator.id,
    taskId: evaluator.task,
    usersIds: [evaluator.usuario],
    analyzed: evaluator.analyzed,
    data: evaluator.data,
  };
};
