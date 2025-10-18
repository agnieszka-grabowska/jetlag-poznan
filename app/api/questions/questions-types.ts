export interface QuestionRequest {
  content: string;
  details: string | undefined | null;
  cost: number;
  type: string;
}
