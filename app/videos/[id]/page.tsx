import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

/**
 * Video Detail Page
 * Layout inspired by a search results-like two-column layout:
 * - Left: main video player area and metadata
 * - Right: related items / actions
 */
export default function VideoDetail({ params }: { params: { id: string } }) {
  const { id } = params

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="border-b border-white/10 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/create" className="text-sm text-gray-300 hover:text-white">
            ← Back to Videos
          </Link>
          <div className="text-sm text-gray-400">Video ID: {id}</div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main column */}
        <div className="lg:col-span-2 space-y-4">
          <Card className="bg-gray-900/50 border-white/10 overflow-hidden">
            <div className="aspect-video bg-gray-800 flex items-center justify-center">
              <div className="text-gray-500">Video Player Placeholder</div>
            </div>
            <div className="p-4">
              <h1 className="text-xl font-semibold mb-2">Video Title {id}</h1>
              <p className="text-gray-400 text-sm">
                Description for video {id}. Replace with real data and an embedded player.
              </p>
            </div>
          </Card>

          <Card className="bg-gray-900/50 border-white/10 p-4">
            <h2 className="font-semibold mb-3">Transcript</h2>
            <div className="text-sm text-gray-300 space-y-2">
              <p>[00:00] Intro...</p>
              <p>[00:15] Key point...</p>
              <p>[01:20] Demo segment...</p>
            </div>
          </Card>
        </div>

        {/* Sidebar column */}
        <div className="space-y-4">
          <Card className="bg-gray-900/50 border-white/10 p-4">
            <h3 className="font-semibold mb-3">Actions</h3>
            <div className="space-y-2">
              <Button className="w-full bg-purple-600 hover:bg-purple-700">Publish</Button>
              <Button variant="outline" className="w-full bg-transparent">Download</Button>
              <Button variant="outline" className="w-full bg-transparent">Duplicate</Button>
            </div>
          </Card>

          <Card className="bg-gray-900/50 border-white/10 p-4">
            <h3 className="font-semibold mb-3">Related Videos</h3>
            <div className="space-y-2 text-sm">
              {Array.from({ length: 5 }, (_, i) => i + 1).map((v) => (
                <Link key={v} href={`/videos/${v}`} className="block text-gray-300 hover:text-white">
                  Video Title {v}
                </Link>
              ))}
            </div>
          </Card>
        </div>
      </main>
    </div>
  )
}



