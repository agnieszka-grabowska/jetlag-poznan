import { DeleteQuestionsResponse, PutQuestionsResponse } from "../api/questions/[id]/route";
import { QuestionRequest } from "../api/questions/questions-types";
import { PostQuestionsResponse } from "../api/questions/route";
import { fetcherPut, fetcherDelete, fetcherPost } from "../helpers";

export async function createQuestion(requestBody: QuestionRequest): Promise<PostQuestionsResponse> {
  return fetcherPost(`/api/questions`, { arg: requestBody });
}

export async function editQuestion(
  id: string,
  requestBody: QuestionRequest
): Promise<PutQuestionsResponse> {
  return fetcherPut(`/api/questions/${id}`, { arg: requestBody });
}

export async function deleteQuestion(id: string): Promise<DeleteQuestionsResponse> {
  return fetcherDelete(`api/questions/${id}`);
}
