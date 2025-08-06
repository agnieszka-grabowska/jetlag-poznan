import { redirect } from "next/navigation";

type Params = Promise<{ gameId: string; roundId: string }>;

export default async function Page({ params }: { params: Params }) {
  const { gameId, roundId } = await params;

  redirect(`/game/${gameId}/rounds/${roundId}/rules`);
}
