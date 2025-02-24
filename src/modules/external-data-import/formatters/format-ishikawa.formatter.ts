export const formatIshikawa = (ishikawa: any) => {
  return {
    userId: ishikawa.responsavel,
    taskId: ishikawa.task,
    method: ishikawa?.metodo ?? '',
    date: ishikawa?.data ?? '',
    machine: ishikawa?.maquina ?? '',
    material: ishikawa?.material ?? '',
    workHand: ishikawa?.mao_de_obra ?? '',
    measure: ishikawa?.medida ?? '',
    environment: ishikawa?.meio_ambiente ?? '',
  };
};
