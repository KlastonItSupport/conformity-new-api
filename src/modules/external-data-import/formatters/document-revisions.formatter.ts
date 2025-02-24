export const formatDocumentRevision = (documentRevision: any) => {
  return {
    id: documentRevision.id,
    revisionDate: documentRevision.data,
    description: documentRevision.descricao,
    documentId: documentRevision.documento_id,
    userId: documentRevision.usuario_id,
  };
};
