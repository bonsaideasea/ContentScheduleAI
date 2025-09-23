import { redirect } from "next/navigation"

export default function PublishedRedirect() {
  redirect("/create?section=published")
}



