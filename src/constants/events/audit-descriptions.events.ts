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

  // Categorias
  DOCUMENTS_ADD_CATEGORY: 'Adicionou uma categoria',
  DOCUMENTS_LIST_CATEGORIES: 'Accesou a lista de categorias',
  DOCUMENTS_DELETE_CATEGORY: 'Deletou uma categoria $complement',
  DOCUMENTS_UPDATE_CATEGORY: 'Editou a categoria $complement',
};

const TASKS_EVENTS = {
  TASKS_LIST: 'Acessou a lista de tarefas',
  TASKS_ADD: 'Criou uma tarefa',
  TASKS_UPDATED:
    'Editou um item do módulo de tasks de código #$id ($complement)',
  TASKS_DELETED:
    'Deletou um item do módulo de tasks de código #$id ($complement)',

  // Detalhes da tarefa
  TASKS_DETAILS_GET: 'Acessou os detalhes da tarefa #$id $complement',

  //Alterar previsão
  TASKS_DETAILS_CHANGE_STATUS: '$complement a tarefa #$id',
  TASKS_DETAILS_CHANGE_PREVISION: 'Alterou o prazo da tarefa #$complement',

  //Avaliadores
  TASKS_DETAILS_ADD_EVALUATOR:
    'Adicionou o(s) seguinte(s) avaliador(es) $complement ',
  TASKS_DETAILS_DELETE_EVALUATOR: 'Deletou o avaliador $complement',

  //Anexos
  TASKS_DETAILS_ADD_ATTACHMENT: 'Adicionou anexos a tarefa #$complement',
  TASKS_DETAILS_DELETE_ATTACHMENT: 'Deletou o anexo $complement',

  // Feed
  TASKS_DETAILS_FEED_CREATED: 'Criou um item no feed da task #$complement',
  TASKS_DETAILS_FEED_DELETED: 'Deletou um item no feed da task #$complement',
  TASKS_DETAILS_FEED_UPDATED: 'Editou um item no feed da task #$complement',

  // 5 Whys
  TASKS_DETAILS_5WHY_CREATED: 'Adicionou 5 Whys a tarefa #$complement',
  TASKS_DETAILS_5WHY_DELETED: 'Deletou 5 Whys a tarefa #$complement',
  TASKS_DETAILS_5WHY_UPDATED: 'Editou 5 Whys a tarefa #$complement',

  // Causa Raiz
  TASKS_DETAILS_ROOT_CAUSE_CREATED:
    'Adicionou Causa Raiz a tarefa #$complement',
  TASKS_DETAILS_ROOT_CAUSE_DELETED: 'Deletou Causa Raiz a tarefa #$complement',
  TASKS_DETAILS_ROOT_CAUSE_UPDATED: 'Editou Causa Raiz a tarefa #$complement',

  // Ações Imediatas
  TASKS_DETAILS_IMMEDIATE_ACTIONS_CREATED:
    'Adicionou Ação Imediata a tarefa #$complement',
  TASKS_DETAILS_IMMEDIATE_ACTIONS_DELETED:
    'Deletou Ação Imediata a tarefa #$complement',
  TASKS_DETAILS_IMMEDIATE_ACTIONS_UPDATED:
    'Editou Ação Imediata a tarefa #$complement',

  // Açoes corretivas
  TASKS_DETAILS_CORRECTIVE_ACTIONS_CREATED:
    'Adicionou Ação Corretiva a tarefa #$complement',
  TASKS_DETAILS_CORRECTIVE_ACTIONS_DELETED:
    'Deletou Ação Corretiva a tarefa #$complement',
  TASKS_DETAILS_CORRECTIVE_ACTIONS_UPDATED:
    'Editou Ação Corretiva a tarefa #$complement',

  // Lembretes
  TASKS_DETAILS_REMINDER_CREATED: 'Criou um lembrete para o módulo $complement',
  TASKS_DETAILS_REMINDER_UPDATED:
    'Atualizou um lembrete para o módulo $complement',
  TASKS_DETAILS_REMINDER_DELETED:
    'Deletou um lembrete no módulo de $complement',

  // Origens
  TASKS_ORIGENS_LIST: 'Resgatou a lista de origens',
  TASKS_ORIGENS_CREATED: 'Criou uma origem no módulo de tasks',
  TASKS_ORIGENS_DELETED: 'Deletou uma origem de código #$id',
  TASKS_ORIGENS_UPDATED: 'Editou uma origem de código #$id',

  // Tipos
  TASKS_TYPES_LIST: 'Resgatou a lista de tipos',
  TASKS_TYPES_CREATED: 'Criou um tipo',
  TASKS_TYPES_DELETED: 'Deletou um tipo de código #$id',
  TASKS_TYPES_UPDATED: 'Editou um tipo de código #$id',

  // Classificações
  TASKS_CLASSIFICATIONS_LIST: 'Resgatou a lista de classificações',
  TASKS_CLASSIFICATIONS_CREATED: 'Criou uma classificação',
  TASKS_CLASSIFICATIONS_DELETED: 'Deletou uma classificação de código #$id',
  TASKS_CLASSIFICATIONS_UPDATED: 'Editou uma classificação de código #$id',
};

export const eventDescriptions = {
  ...USER_EVENTS,
  ...TASKS_EVENTS,
  ...COMPANY_EVENTS,
  ...DOCUMENTS_EVENTS,
} as const;
