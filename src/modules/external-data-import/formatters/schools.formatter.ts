export const formatSchool = (school) => {
  return {
    id: school?.id,
    companyId: school?.empresa,
    name: school?.nome,
    celphone: school?.telefone,
    email: school?.email,
    state: school?.estado,
    city: school?.cidade,
  };
};
