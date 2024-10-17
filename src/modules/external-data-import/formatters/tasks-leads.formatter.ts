export const formatTaskLead = (taskLead) => {
  return {
    id: taskLead.id,
    leadId: taskLead.atividade,
    userId: taskLead.usuario,
    type: taskLead.tipo,
    description: taskLead.descricao,
    date: taskLead.data,
    isReminder: taskLead.lembrete,
    hasBeenReminded: taskLead.lembrado,
    time: taskLead.horario,
    completed: taskLead.concluido,
  };
};
