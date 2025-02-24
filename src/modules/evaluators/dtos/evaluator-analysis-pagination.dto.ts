import { EvaluatorForAnalysis } from './evaluator-for-analysis';

class Links {
  first: number;
  last: number;
  next: number;
  previous: number;
  totalPages: number;
  currentPage: number;
  totalItems: number;
}
export class PaginationEvaluatorDto {
  pages: Links;
  items: EvaluatorForAnalysis[];
}
