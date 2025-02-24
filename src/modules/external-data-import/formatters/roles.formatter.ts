export const formatRole = (role: any) => {
  return {
    companyId: role.empresa,
    name: role.nome,
    id: role.id,
  };
};
