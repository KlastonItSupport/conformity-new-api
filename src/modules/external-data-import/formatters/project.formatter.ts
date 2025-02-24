export const formatProject = (project, companyId) => {
  return {
    id: project.id,
    progress: project.progresso,
    title: project.titulo,
    text: project.texto,
    status: project.status,
    initialDate: project.data_inicial,
    finalDate: project.data_final,
    crmCompanyId: project.cliente,
    updateProgressAutomatically: false,
    companyId,
  };
};
