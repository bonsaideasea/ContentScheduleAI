import { redirect } from "next/navigation"

export default function CalendarRedirect() {
  redirect("/create?section=calendar")
}



