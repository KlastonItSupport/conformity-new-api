import { Document } from '../entities/document.entity';

class Links {
  first: number;
  last: number;
  next: number;
  previous: number;
  totalPages: number;
  currentPage: number;
  totalItems: number;
}
export class PaginationDocumentsDto {
  pages: Links;
  items: Document[];
}
