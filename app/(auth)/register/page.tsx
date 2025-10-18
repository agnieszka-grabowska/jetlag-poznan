"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import Card from "../../ui/components/card/card";
import Form from "../../ui/components/Form/Form";
import { Button } from "../../ui/components/button/button";
import useSWRMutation from "swr/mutation";
import CardError from "@/app/ui/components/card/CardError";
import Spinner from "@/app/ui/components/spinner/spinner";
import { register } from "@/app/lib/register";
import { RegisterRequest } from "@/app/api/register/route";

export default function Page() {
  const router = useRouter();
  const { trigger, isMutating, error } = useSWRMutation(
    "/api/register",
    (key, { arg }: { arg: RegisterRequest }) => register(arg)
  );

  return (
    <Card title="Register">
      <Form
        onSubmit={(e) => {
          e.preventDefault();
          trigger({
            username: e.currentTarget.username.value,
            password: e.currentTarget.password.value,
          }).then((_) => router.push("/"));
        }}
      >
        <label>
          Username
          <input type="text" name="username" required autoComplete="username" />
        </label>
        <label>
          Password
          <input type="password" name="password" required autoComplete="new-password" />
        </label>
        <Button type="submit" disabled={isMutating}>
          {isMutating ? <Spinner /> : "Register"}
        </Button>
        <Link href="/login">I already have an account</Link>
      </Form>
      {error && <CardError>{error.message}</CardError>}
    </Card>
  );
}
