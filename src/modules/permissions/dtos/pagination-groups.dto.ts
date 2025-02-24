import { Groups } from '../entities/groups.entity';

class Links {
  first: number;
  last: number;
  next: number;
  previous: number;
  totalPages: number;
  currentPage: number;
  totalItems: number;
}
export class PaginationGroupsDto {
  pages: Links;
  items: Groups[];
}
