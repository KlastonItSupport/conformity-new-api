export const formatDocument = (document: any) => {
  const documentFormatted = {
    id: document.id.toString(),
    companyId: document.empresa.toString(),
    categoryId: (document.categoria as string) ?? null,
    departamentId: (document.departamento as string) ?? null,
    // projectId: (document.projeto as string) ?? null, // TODO FAZER MIGRAÇÃO DOS PROJETOS
    projectId: null,
    name: document.nome as string,
    status: (document.status == 'ativo' ? 'active' : 'inactive') as string,
    author: document.autor as string,
    owner: document.autor as string,
    revision: document.revisao as number,
    validity: document.validade as string,
    revisionDate: document.data_revisao_documento,
    description: document.descricao,
    type: document.tipo,
    local: document.local,
    identification: document.identificacao,
    protection: document.protecao,
    createdAt: document.data_envio,
    recovery: document.recuperacao,
    minimumRetention: document.retencao_minima,
    document: [],
    inclusionDate: document.data_revisao,
    physicalDocumentCreatedDate: document.data_criacao,
  };
  return documentFormatted;
};
