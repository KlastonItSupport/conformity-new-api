import { CreateUserDto } from 'src/modules/users/dtos/create-user.dto';

const formatAccessRule = (access: string): string => {
  if (access == 'super-usuario') {
    return 'super-user';
  }
  if (access == 'usuario') {
    return 'user';
  }

  return 'super-admin';
};

const formatAccess = (access: string): boolean => {
  if (access === 'bloqueado') {
    return false;
  }
  if (access === 'ativo') {
    return true;
  }
  return false;
};

const formatStatus = (status: string): string => {
  if (status === 'ativo') {
    return 'active';
  }

  return 'inactive';
};

export const formatUser = (data) => {
  return {
    id: data?.id,
    name: data?.nome,
    email: data?.email,
    password: data?.senha,
    companyId: data?.empresa,
    access: formatAccess(data?.acesso),
    accessRule: formatAccessRule(data?.regra),
    status: formatStatus(data?.status),
    birthday: data?.aniversario,
    departament: '1',
    // celphone: data?.telefone,
    // departament: data?.departamento,
    // cargo: data?.cargo,
  };
};
