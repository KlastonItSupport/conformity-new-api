import { User } from '../entities/users.entity';

class Links {
  first: number;
  last: number;
  next: number;
  previous: number;
  totalPages: number;
  currentPage: number;
  totalItems: number;
}
export class PaginationUsersDto {
  pages: Links;
  items: User[];
}
