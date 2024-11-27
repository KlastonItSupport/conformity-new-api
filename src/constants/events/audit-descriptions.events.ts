const USER_EVENTS = {
  USER_CREATED: 'Usuário Criado',
  USER_UPDATED: 'Usuário Atualizado',
  USER_DELETED: 'Usuário Excluído',
  USER_SIGNED_IN: 'Usuário Logado',
};

const COMPANY_EVENTS = {
  COMPANY_CREATED: 'Empresa Criada',
  COMPANY_UPDATED: 'Empresa Atualizada',
  COMPANY_DELETED: 'Empresa Excluída',
};

const DOCUMENTS_EVENTS = {
  DOCUMENTS_GET: 'Resgatou a lista de documentos',
  DOCUMENT_DELETED:
    'Deletou um item do módulo de documentos de código $id ($complement)',
  DOCUMENT_CREATED: 'Criou um documento no módulo de documentos',
  DOCUMENT_UPDATED:
    'Editou um item do módulo de documentos de código $id ($complement)',

  // Detalhes do documento
  DOCUMENTS_DETAILS_GET: 'Acessou os detalhes do documento $id ($complement)',
  DOCUMENT_DETAILS_FEED_CREATED: 'Criou um item no feed do documento $id',
  DOCUMENT_DETAILS_FEED_DELETED: 'Deletou um item no feed do documento $id',
  DOCUMENT_DETAILS_FEED_UPDATED: 'Editou um item no feed do documento $id',
  DOCUMENTS_DETAILS_ADD_ADDITIONAL_DOCUMENT:
    'Adicionou um anexo ao documento de código $complement',

  //Revisoes
  DOCUMENTS_DETAILS_DELETE_ADDITIONAL_DOCUMENT:
    'Deletou um anexo ao documento de código $complement',
  DOCUMENTS_DETAILS_ADD_REVISION:
    'Adicionou uma revisão, código do documento $complement',
  DOCUMENTS_DETAILS_EDIT_REVISION:
    'Editou uma revisão, código do documento $complement',
  DOCUMENTS_DETAILS_DELETE_REVISION:
    'Deletou uma revisão, código do documento $id',

  //Avaliadores
  DOCUMENTS_DETAILS_ADD_EVALUATOR:
    'Adicionou um avaliador ao documento $complement',
  DOCUMENTS_DETAILS_DELETE_EVALUATOR:
    'Deletou um avaliador ao documento $complement',

  // Relacionados
  DOCUMENTS_DETAILS_ADD_RELATED:
    'Adicionou um documento relacionado ao documento de código $complement',

  DOCUMENTS_DETAILS_DELETE_RELATED:
    'Deletou um documento relacionado ao documento de código $complement',

  // Permissoes
  DOCUMENTS_DETAILS_ADD_DEPARTAMENT_PERMISSION:
    'Deu permissão para o(s) departamento(s) $complement',
  DOCUMENTS_DETAILS_DELETE_DEPARTAMENT_PERMISSION:
    'Removeu o departameto $complement',
};
export const eventDescriptions = {
  ...USER_EVENTS,
  ...COMPANY_EVENTS,
  ...DOCUMENTS_EVENTS,
} as const;
