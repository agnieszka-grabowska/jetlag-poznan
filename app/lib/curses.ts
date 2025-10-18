import { DeleteCursesResponse } from "../api/curses/[curseId]/route";
import { fetcherDelete } from "../helpers";

export function deleteCurse(id: string): Promise<DeleteCursesResponse> {
  return fetcherDelete(`api/curses/${id}`);
}
