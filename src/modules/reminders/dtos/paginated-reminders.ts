import { Reminder } from '../entities/reminder.entity';

class Links {
  first: number;
  last: number;
  next: number;
  previous: number;
  totalPages: number;
  currentPage: number;
  totalItems: number;
}
export class PaginationRemindersDto {
  pages: Links;
  items: Reminder[];
}
