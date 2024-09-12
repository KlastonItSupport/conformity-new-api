export const formatIndicator = (indicator: any) => {
  return {
    id: indicator.id,
    companyId: indicator.empresa, // ok
    departamentId: indicator.departamento, // ok
    collectDay: indicator.data,
    responsable: indicator.responsavel, // ok
    goal: indicator.objetivo, // ok
    frequency: formatFrequency(indicator.frequencia),
    facts: indicator.fatos,
    meta: indicator.meta, // ok
    howToMeasure: indicator.como_mede, // ok,
    whatToMeasure: indicator.resultante,
    deadline: indicator.prazo, // ok
    direction: indicator.direcao, // ok
    dataType: indicator.nome_dado,
  };
};

const formatFrequency = (frequency: string) => {
  if (frequency === '422') {
    return 'DIÁRIO';
  }

  if (frequency === '423') {
    return 'SEMANAL';
  }

  if (frequency === '424') {
    return 'MENSAL';
  }

  if (frequency === '425') {
    return 'BIMENSAL';
  }

  if (frequency === '426') {
    return 'TRIMESTRAL';
  }

  if (frequency === '427') {
    return 'SEMESTRAL';
  }

  if (frequency === '428') {
    return 'ANUAL';
  }
};

export const formatIndicatorAnswer = (answer: any) => {
  return {
    id: answer.id,
    companyId: answer.empresa,
    indicatorId: answer.indicador,
    goal: answer.meta,
    answer: answer.resposta,
    date: answer.data,
    reason: answer.justificativa,
    tasks: answer.resp_tarefas,
  };
};
