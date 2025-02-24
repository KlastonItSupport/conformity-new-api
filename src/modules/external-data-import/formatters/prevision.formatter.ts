export const formatPrevision = (prevision: any) => {
  return {
    userId: prevision.usuario,
    taskId: prevision.task,
    oldDate: prevision.prazo_antigo,
    newDate: prevision.prazo_novo,
    description: prevision.descricao,
  };
};
