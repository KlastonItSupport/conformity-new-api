export const formatTask = (task) => {
  return {
    // project: null,
    user: task.usuario,
    id: task?.id,
    title: task?.titulo,
    status: task?.status.toLowerCase() === 'fechada' ? 'Fechada' : 'Aberta',
    origin: task?.origem,
    type: task?.tipo,
    departamentId: task?.departamento,
    classification: task?.classificacao,
    company: task?.empresa,
    datePrevision: task?.data_previsao,
    dateConclusion: task?.data_conclusao,
    createdAt: task?.data_criacao,
    description: task?.descricao,
    resultRootCause: task?.resultado_causa_raiz,
    correctiveAction: task?.acao_correctiva,
    dateCorrectiveAction: task?.data_acao_correctiva,
    immediateAction: task?.data_acao_imediata,
    responsable: task?.responsavel,
  };
};
