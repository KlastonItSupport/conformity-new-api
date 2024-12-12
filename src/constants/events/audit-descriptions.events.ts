const USER_EVENTS = {
  USER_SIGNED_IN: 'Usuário acessou o sistema',
  USER_SIGNED_OUT: 'Desconectou-se do sistema',
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

  // Analise
  DOCUMENTS_ANALYSIS_LIST: 'Acessou a lista de analises',
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

const EQUIPMENT_EVENTS = {
  EQUIPMENTS_LIST: 'Resgatou a lista de equipamentos',
  EQUIPMENTS_CREATED: 'Criou um equipamento',
  EQUIPMENTS_DELETED: 'Deletou um equipamento de código #$id',
  EQUIPMENTS_UPDATED: 'Editou um equipamento de código #$id',
  EQUIPMENTS_GET_ACTIONS: 'Acessou a lista de de ações do equipamento #$id',
  EQUIPMENTS_CREATE_ACTIONS:
    'Adicionou uma nova ação ao equipamento #$complement',
  EQUIPMENTS_DELETE_ACTIONS: 'Deletou uma ação do equipamento #$id',
  EQUIPMENTS_UPDATE_ACTIONS: 'Atualizou uma ação do equipamento $complement',

  EQUIPMENTS_DOCUMENTS_ADD: 'Adicionou um documento a ação #$complement',
  EQUIPMENTS_DOCUMENTS_DELETED: 'Deletou um documento a ação #$complement',
};

const INDICATORS_EVENTS = {
  INDICATORS_CREATED: 'Criou um novo indicador',
  INDICATORS_DELETED: 'Deletou o indicador #$id',
  INDICATORS_UPDATED: 'Editou o indicador #$id',
  INDICATORS_LIST: 'Acessou o dashboard dos indicadores',

  // Graficos
  INDICATORS_GRAPHS: 'Acessou o gráfico de indicador #$complement',
  INDICATORS_GRAPHS_CREATE: 'Adicionou um novo dado ao indicador #$complement',
  INDICATORS_GRAPHS_DELETE: 'Deletou um dado do indicador #$complement',
  INDICATORS_GRAPHS_UPDATE: 'Atualizou um dado do indicador #$complement',
};

const CRM_EVENTS = {
  // Clientes Fornecedores
  CRM_SUPPLIERS_CREATED: 'Criou um novo fornecedor',
  CRM_SUPPLIERS_UPDATED: 'Editou um cliente/fornecedor de código #$complement',
  CRM_SUPPLIERS_DELETED: 'Deletou um cliente/fornecedor de código #$complement',
  CRM_SUPPLIERS_LIST: 'Acessou a lista de clientes/fornecedores',

  // Leads
  CRM_LEADS_LIST: 'Accesou a lista de Leads',
  CRM_LEADS_CREATE: 'Criou um lead',
  CRM_LEADS_EDIT: 'Editou um lead de código #$id',
  CRM_LEADS_DELETE: 'Deletou um lead de código #$id',

  // Tarefas do lead
  TASKS_LEADS_LIST: 'Acessou a lista de tarefas do lead de código #$complement',
  TASKS_LEADS_CREATE: 'Criou uma tarefa no lead de código #$complement',
  TASKS_LEADS_EDIT:
    'Editou uma tarefa de código #$id que possui um lead com o código #$complement',
  TASKS_LEADS_DELETE:
    'Deletou uma tarefa de código #$id que possui um lead com o código #$complement',

  // projetos
  CRM_PROJECTS_LIST: 'Acessou a lista de projetos',
  CRM_PROJECTS_CREATE: 'Criou um projeto',
  CRM_PROJECTS_EDIT: 'Editou um projeto de código #$id',
  CRM_PROJECTS_DELETE: 'Deletou um projeto de código #$id',

  // Contratos
  CRM_CONTRACTS_LIST: 'Acessou a lista de contratos',
  CRM_CONTRACTS_CREATE: 'Criou um contrato',
  CRM_CONTRACTS_EDIT: 'Editou um contrato de código #$id',
  CRM_CONTRACTS_DELETE: 'Deletou um contrato de código #$id',

  // Serviços
  CRM_SERVICES_LIST: 'Acessou a lista de serviços',
  CRM_SERVICES_CREATE: 'Criou um serviço',
  CRM_SERVICES_EDIT: 'Editou um serviço de código #$id',
  CRM_SERVICES_DELETE: 'Deletou um serviço de código #$id',
};

const TRAININGS_EVENTS = {
  TRAININGS_LIST: 'Acessou a lista de treinamentos',
  TRAININGS_CREATED: 'Criou um treinamento',
  TRAININGS_DELETED: 'Deletou um treinamento de código #$id',
  TRAININGS_UPDATED: 'Editou um treinamento de código #$id',

  // Treinamentos do usuário
  TRAININGS_USER_LIST: 'Acessou a lista de treinamentos do usuário',
  TRAININGS_USER_CREATED:
    'Atrelou um treinamento ao usuário. Código do treinamento #$complement',
  TRAININGS_USER_DELETED:
    'Deletou um treinamento do usuário. Código do treinamento #$complement',
  TRAININGS_USER_UPDATED:
    'Editou um treinamento do usuário. Código do treinamento #$complement',

  // Certificados do treinamento do usuário
  TRAININGS_USER_CERTIFICATES_LIST:
    'Acessou os certificados do treinamento do usuário',
  TRAININGS_USER_CERTIFICATES_CREATED:
    'Criou um certificado no treinamento do $complement',
  TRAININGS_USER_CERTIFICATES_DELETED:
    'Deletou um certificado no treinamento do usuário #$complement',

  // Escolas
  TRAININGS_SCHOOL_LIST: 'Acessou a lista de escolas',
  TRAININGS_SCHOOL_CREATED: 'Criou uma escola',
  TRAININGS_SCHOOL_DELETED: 'Deletou uma escola de código #$id',
  TRAININGS_SCHOOL_UPDATED: 'Editou uma escola de código #$id',

  // Matriz
  TRAININGS_MATRIX_LIST: 'Acessou a lista de matrizes',
};

const COMPANY_EVENTS = {
  //Users
  COMPANY_USERS_LIST: 'Acessou a listagem de usuários',
  COMPANY_USERS_CREATED: 'Criou um novo usuário',
  COMPANY_USERS_DELETED: 'Deletou um usuário de código #$id',
  COMPANY_USERS_UPDATED: 'Editou um usuário de código #$id',
  COMPANY_USERS_CHANGE_PASSWORD: 'Alterou a senha do usuário #$complement',

  // Cargos
  COMPANY_ROLES_LIST: 'Acessou a listagem de Cargos',
  COMPANY_ROLES_CREATED: 'Criou um novo cargo',
  COMPANY_ROLES_DELETED: 'Deletou um cargo de código #$id',
  COMPANY_ROLES_UPDATED: 'Editou um cargo de código #$id',

  // Avisos
  COMPANY_WARNINGS_LIST: 'Acessou a listagem de Avisos',
  COMPANY_WARNINGS_CREATED: 'Criou um novo aviso',

  // Empresas
  COMPANY_LIST: 'Acessou a listagem de empresas',
  COMPANY_CREATED: 'Criou uma nova empresa',
  COMPANY_UPDATED: 'Editou uma empresa de código #$id',

  // Blog
  COMPANY_BLOG_CATEGORIES_LIST: 'Acessou a listagem de categorias do Blog',
  COMPANY_BLOG_CATEGORIES_CREATED: 'Criou uma nova categoria do Blog',
  COMPANY_BLOG_CATEGORIES_DELETED:
    'Deletou uma categoria do Blog de código #$id',
  COMPANY_BLOG_CATEGORIES_UPDATED:
    'Atualizou uma categoria do Blog de código #$id',

  COMPANY_BLOG_LIST: 'Acessou a lista de Conteúdo(Blog)',
  COMPANY_BLOG_CREATED: 'Criou um conteúdo(Blog)',
  COMPANY_BLOG_DELETED: 'Deletou um conteúdo(Blog) de código #$id',
  COMPANY_BLOG_UPDATED: 'Atualizou um conteúdo(Blog) de código #$id',

  // Monitoramento
  COMPANY_MONITORING_LIST: 'Acessou a listagem de monitoramento',
};

export const eventDescriptions = {
  ...USER_EVENTS,
  ...TASKS_EVENTS,
  ...COMPANY_EVENTS,
  ...EQUIPMENT_EVENTS,
  ...DOCUMENTS_EVENTS,
  ...INDICATORS_EVENTS,
  ...CRM_EVENTS,
  ...TRAININGS_EVENTS,
} as const;
