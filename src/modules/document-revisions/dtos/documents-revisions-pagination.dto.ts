import { DocumentRevision } from '../entities/document-revision.entity';

export class Links {
  first: number;
  last: number;
  next: number;
  previous: number;
  totalPages: number;
  currentPage: number;
  totalItems: number;
}

export class PaginationDocumentRevisionsDto {
  pages: Links;
  items: DocumentRevision[];
}
