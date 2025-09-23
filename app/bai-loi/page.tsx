import { redirect } from "next/navigation"

export default function FailedRedirect() {
  redirect("/create?section=failed")
}



