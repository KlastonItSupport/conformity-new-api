class Links {
  first: number;
  last: number;
  next: number;
  previous: number;
  totalPages: number;
  currentPage: number;
  totalItems: number;
}
export class PaginationTasksDto {
  pages: Links;
  items: any[];
}
