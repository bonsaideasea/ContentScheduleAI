import { redirect } from "next/navigation"

export default function DraftsRedirect() {
  redirect("/create?section=drafts")
}



