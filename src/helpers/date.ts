export const formatDate = (dateString) => {
  // Formata data -> dd/mm/aaaa para  yyyy-mm-dd
  const dateParts = dateString.split('/');
  const formatted = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
  return formatted;
};
