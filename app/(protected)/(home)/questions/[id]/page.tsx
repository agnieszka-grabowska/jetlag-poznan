import { QuestionForm } from "@/app/(protected)/(home)/questions/QuestionForm";
import { db } from "@/app/api/db";
import { validateSession } from "@/app/api/auth";
import Card from "@/app/ui/components/card/card";

type Params = Promise<{ id: string }>;

export default async function Page({ params }: { params: Params }) {
  const { id } = await params;

  const userId = await validateSession();
  const initialValues = await db.question.findFirstOrThrow({
    where: {
      id,
      ownerId: userId,
    },
  });
  console.log("initial", initialValues);
  return (
    <Card title="Edit question">
      <QuestionForm type="edit" initialValues={initialValues} id={id} />
    </Card>
  );
}
