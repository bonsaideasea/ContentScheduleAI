import { redirect } from "next/navigation"

export default function ApiDashboardRedirect() {
  redirect("/create?section=api")
}



