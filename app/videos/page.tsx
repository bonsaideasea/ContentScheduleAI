import { redirect } from "next/navigation"

export default function VideosRedirect() {
  redirect("/create?section=videos")
}



