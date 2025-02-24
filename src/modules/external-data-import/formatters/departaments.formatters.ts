export const formatDepartament = (departament: any) => {
  return {
    companyId: departament.empresa,
    name: departament.nome,
    id: departament.id,
  };
};
