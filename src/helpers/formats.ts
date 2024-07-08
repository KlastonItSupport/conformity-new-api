import { format } from 'date-fns';

export const currentDayOfWeek = () => {
  return format(new Date(), 'i');
};

export const currentDayName = (): string => {
  const days = [
    'DOMINGO',
    'SEGUNDA',
    'TERÇA',
    'QUARTA',
    'QUINTA',
    'SEXTA',
    'SÁBADO',
  ];
  return days[new Date().getDay()];
};
