export const formatEquipment = (equipment: any) => {
  return {
    id: equipment.id,
    name: equipment.nome,
    companyId: equipment?.empresa,
    description: equipment?.descricao,
    model: equipment?.modelo,
    series: equipment?.numero_serie,
    manufacturer: equipment?.fabricante,
    certified: equipment?.certificado,
    type: equipment?.tipo,
    range: equipment?.vrange,
    tolerancy: equipment?.tolerancia,
    createdAt: equipment?.created_at,
    updatedAt: equipment?.updated_at,
  };
};
