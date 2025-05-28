import { redirect } from "next/navigation";
import { isLoggedIn } from "@/utils/auth";
import { Form } from "@/components/Create/Form";

export default async function CreatePage() {
  const loggedIn = await isLoggedIn();
  if (!loggedIn) {
    redirect("/login");
  }

  return (
      <Form/>
  );
}
