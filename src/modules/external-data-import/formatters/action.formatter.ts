export const formatAction = (action) => {
  return {
    id: action.id,
    type: action.tipo,
    equipmentId: action.equipamento,
    validity: action.validade,
    nextDate: action.data_proxima,
    date: action.data,
  };
};
