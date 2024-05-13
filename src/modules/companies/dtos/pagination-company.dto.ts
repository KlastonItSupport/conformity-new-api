import { Company } from '../entities/company.entity';

class Links {
  first: number;
  last: number;
  next: number;
  previous: number;
  totalPages: number;
  currentPage: number;
  totalItems: number;
}
export class PaginationCompanyDto {
  pages: Links;
  items: Company[];
}
