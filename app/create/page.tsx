"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  PlusIcon,
  ImageIcon,
  VideoIcon,
  CalendarIcon,
  SparklesIcon,
  LightbulbIcon as LightBulbIcon,
  SendIcon,
  CopyIcon,
  SettingsIcon,
  HelpCircleIcon,
  SunIcon,
  PlayIcon,
  BarChart3Icon,
  TrendingUpIcon,
  CheckCircleIcon,
  XCircleIcon,
  SearchIcon,
} from "lucide-react"

export default function CreatePage() {
  const [activeSection, setActiveSection] = useState("create")
  const [selectedPlatform, setSelectedPlatform] = useState("Facebook")
  const [postContent, setPostContent] = useState("")
  const [chatMessages, setChatMessages] = useState([
    {
      role: "assistant",
      content: "I am your new writing assistant. What would you like to write about? Or, select a prompt below.",
    },
  ])

  const platforms = ["Facebook", "Instagram", "Twitter", "LinkedIn", "TikTok"]
  const characterLimits = {
    Facebook: 63206,
    Instagram: 2200,
    Twitter: 280,
    LinkedIn: 3000,
    TikTok: 2200,
  }

  const inspirationPosts = [
    {
      id: 1,
      content: "Just launched our new AI-powered marketing tool! 🚀",
      platform: "Twitter",
      engagement: "2.3K likes",
    },
    { id: 2, content: "Behind the scenes of our latest campaign...", platform: "Instagram", engagement: "1.8K likes" },
    { id: 3, content: "5 tips for better social media engagement", platform: "LinkedIn", engagement: "892 likes" },
  ]

  const promptTemplates = [
    { id: 1, title: "Product Launch", prompt: "Create an exciting announcement for our new product launch..." },
    { id: 2, title: "Behind the Scenes", prompt: "Share a behind-the-scenes look at our company culture..." },
    { id: 3, title: "Tips & Advice", prompt: "Write a helpful tip post about [topic] for our audience..." },
    { id: 4, title: "User Generated Content", prompt: "Create a post encouraging user-generated content..." },
  ]

  const publishedPosts = [
    {
      id: 1,
      content: "Excited to announce our Q4 results!",
      platform: "LinkedIn",
      date: "2024-01-15",
      status: "published",
    },
    {
      id: 2,
      content: "New feature alert! Check out our latest update",
      platform: "Twitter",
      date: "2024-01-14",
      status: "published",
    },
    {
      id: 3,
      content: "Team building day was amazing!",
      platform: "Instagram",
      date: "2024-01-13",
      status: "published",
    },
  ]

  const failedPosts = [
    {
      id: 1,
      content: "This post failed to publish due to API limits",
      platform: "Twitter",
      date: "2024-01-12",
      error: "Rate limit exceeded",
    },
    { id: 2, content: "Image upload failed", platform: "Instagram", date: "2024-01-11", error: "File too large" },
  ]

  const renderMainContent = () => {
    switch (activeSection) {
      case "inspiration":
        return (
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">Content Inspiration</h2>
            <div className="grid gap-4">
              {inspirationPosts.map((post) => (
                <Card key={post.id} className="bg-gray-900/50 border-white/10 p-4">
                  <div className="flex justify-between items-start mb-2">
                    <Badge variant="outline" className="text-xs">
                      {post.platform}
                    </Badge>
                    <span className="text-sm text-gray-400">{post.engagement}</span>
                  </div>
                  <p className="text-white mb-3">{post.content}</p>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      Use as Template
                    </Button>
                    <Button size="sm" variant="ghost">
                      <CopyIcon className="w-4 h-4" />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )

      case "prompts":
        return (
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">Content Prompts</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {promptTemplates.map((template) => (
                <Card key={template.id} className="bg-gray-900/50 border-white/10 p-4">
                  <h3 className="font-semibold mb-2">{template.title}</h3>
                  <p className="text-gray-400 text-sm mb-4">{template.prompt}</p>
                  <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                    Use Prompt
                  </Button>
                </Card>
              ))}
            </div>
          </div>
        )

      case "sources":
        return (
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">Content Sources</h2>
            <div className="mb-4">
              <div className="relative">
                <SearchIcon className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <Input placeholder="Search sources..." className="pl-10 bg-gray-900/50 border-white/10" />
              </div>
            </div>
            <div className="grid gap-4">
              <Card className="bg-gray-900/50 border-white/10 p-4">
                <h3 className="font-semibold mb-2">Industry News</h3>
                <p className="text-gray-400 text-sm mb-2">Latest updates from your industry</p>
                <Button size="sm" variant="outline">
                  Connect RSS Feed
                </Button>
              </Card>
              <Card className="bg-gray-900/50 border-white/10 p-4">
                <h3 className="font-semibold mb-2">Competitor Analysis</h3>
                <p className="text-gray-400 text-sm mb-2">Track competitor content and trends</p>
                <Button size="sm" variant="outline">
                  Add Competitors
                </Button>
              </Card>
            </div>
          </div>
        )

      case "calendar":
        return (
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">Content Calendar</h2>
            <div className="grid grid-cols-7 gap-2 mb-4">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <div key={day} className="text-center text-sm font-medium text-gray-400 p-2">
                  {day}
                </div>
              ))}
              {Array.from({ length: 35 }, (_, i) => (
                <Card key={i} className="bg-gray-900/50 border-white/10 p-2 h-20 text-xs">
                  <div className="text-gray-400">{(i % 31) + 1}</div>
                  {i === 15 && <div className="bg-purple-600 rounded px-1 mt-1">Post</div>}
                  {i === 22 && <div className="bg-blue-600 rounded px-1 mt-1">Story</div>}
                </Card>
              ))}
            </div>
          </div>
        )

      case "published":
        return (
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">Published Posts</h2>
            <div className="space-y-4">
              {publishedPosts.map((post) => (
                <Card key={post.id} className="bg-gray-900/50 border-white/10 p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      <CheckCircleIcon className="w-4 h-4 text-green-400" />
                      <Badge variant="outline">{post.platform}</Badge>
                    </div>
                    <span className="text-sm text-gray-400">{post.date}</span>
                  </div>
                  <p className="text-white mb-3">{post.content}</p>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      View Analytics
                    </Button>
                    <Button size="sm" variant="ghost">
                      Duplicate
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )

      case "failed":
        return (
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">Failed Posts</h2>
            <div className="space-y-4">
              {failedPosts.map((post) => (
                <Card key={post.id} className="bg-gray-900/50 border-white/10 p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      <XCircleIcon className="w-4 h-4 text-red-400" />
                      <Badge variant="outline">{post.platform}</Badge>
                    </div>
                    <span className="text-sm text-gray-400">{post.date}</span>
                  </div>
                  <p className="text-white mb-2">{post.content}</p>
                  <p className="text-red-400 text-sm mb-3">Error: {post.error}</p>
                  <div className="flex gap-2">
                    <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                      Retry
                    </Button>
                    <Button size="sm" variant="outline">
                      Edit & Retry
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )

      case "videos":
        return (
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">Video Content</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6].map((video) => (
                <Card key={video} className="bg-gray-900/50 border-white/10 p-4">
                  <div className="bg-gray-800 rounded-lg h-32 flex items-center justify-center mb-3">
                    <PlayIcon className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="font-semibold mb-1">Video Title {video}</h3>
                  <p className="text-gray-400 text-sm mb-3">Duration: 1:30</p>
                  <Button size="sm" variant="outline" className="w-full bg-transparent">
                    Edit Video
                  </Button>
                </Card>
              ))}
            </div>
          </div>
        )

      case "api":
        return (
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">API Dashboard</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <Card className="bg-gray-900/50 border-white/10 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <BarChart3Icon className="w-4 h-4 text-blue-400" />
                  <span className="text-sm text-gray-400">API Calls</span>
                </div>
                <div className="text-2xl font-bold">1,247</div>
                <div className="text-sm text-green-400">+12% from last month</div>
              </Card>
              <Card className="bg-gray-900/50 border-white/10 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUpIcon className="w-4 h-4 text-green-400" />
                  <span className="text-sm text-gray-400">Success Rate</span>
                </div>
                <div className="text-2xl font-bold">98.5%</div>
                <div className="text-sm text-green-400">+0.3% from last month</div>
              </Card>
              <Card className="bg-gray-900/50 border-white/10 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <SparklesIcon className="w-4 h-4 text-purple-400" />
                  <span className="text-sm text-gray-400">Rate Limit</span>
                </div>
                <div className="text-2xl font-bold">750/1000</div>
                <div className="text-sm text-gray-400">Resets in 2h 15m</div>
              </Card>
            </div>
            <Card className="bg-gray-900/50 border-white/10 p-4">
              <h3 className="font-semibold mb-4">API Keys</h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center p-2 bg-gray-800/50 rounded">
                  <span>Production Key</span>
                  <Button size="sm" variant="outline">
                    Regenerate
                  </Button>
                </div>
                <div className="flex justify-between items-center p-2 bg-gray-800/50 rounded">
                  <span>Development Key</span>
                  <Button size="sm" variant="outline">
                    Regenerate
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        )

      case "coach":
        return (
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">Viral AI Coach</h2>
            <Card className="bg-gray-900/50 border-white/10 p-6 mb-6">
              <h3 className="font-semibold mb-4">Content Performance Analysis</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Engagement Rate</span>
                  <span className="text-green-400">+15%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Optimal Posting Time</span>
                  <span className="text-blue-400">2:00 PM - 4:00 PM</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Top Performing Hashtags</span>
                  <span className="text-purple-400">#marketing #AI #growth</span>
                </div>
              </div>
            </Card>
            <Card className="bg-gray-900/50 border-white/10 p-6">
              <h3 className="font-semibold mb-4">AI Recommendations</h3>
              <div className="space-y-3">
                <div className="p-3 bg-purple-500/10 border border-purple-500/20 rounded">
                  <p className="text-sm">Try adding more visual content to increase engagement by 23%</p>
                </div>
                <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded">
                  <p className="text-sm">Your audience is most active on weekdays between 1-3 PM</p>
                </div>
                <div className="p-3 bg-green-500/10 border border-green-500/20 rounded">
                  <p className="text-sm">Consider using trending hashtags: #TechTrends #Innovation</p>
                </div>
              </div>
            </Card>
          </div>
        )

      default:
        return (
          <div className="max-w-4xl mx-auto">
            {/* Platform Tabs */}
            <div className="flex items-center gap-2 mb-6">
              {platforms.map((platform) => (
                <Button
                  key={platform}
                  variant={selectedPlatform === platform ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => setSelectedPlatform(platform)}
                  className={`transition-all duration-200 relative ${
                    selectedPlatform === platform 
                      ? "bg-purple-600 hover:bg-purple-700 text-white border-purple-500 shadow-lg ring-2 ring-purple-500/30 scale-105" 
                      : "bg-transparent hover:bg-white/5 text-gray-300 hover:text-white border-white/10 hover:scale-105"
                  }`}
                >
                  {platform}
                </Button>
              ))}
              <Button variant="ghost" size="sm" className="ml-auto">
                <PlusIcon className="w-4 h-4 mr-1" />
                Add Post
              </Button>
            </div>

            {/* Content Editor */}
            <Card className="bg-gray-900/50 border-white/10 p-6">
              <Textarea
                placeholder="Write your post here..."
                value={postContent}
                onChange={(e) => setPostContent(e.target.value)}
                className="min-h-[200px] bg-transparent border-none resize-none text-white placeholder:text-gray-500 focus:ring-0"
              />

              <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/10">
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm">
                    <ImageIcon className="w-4 h-4 mr-1" />
                    Add Media
                  </Button>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="bg-purple-500/20 text-purple-300 border-purple-500/30">
                      {selectedPlatform}
                    </Badge>
                    <span className="text-sm text-gray-400">
                      {postContent.length}/{characterLimits[selectedPlatform]} characters
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm">
                    <CopyIcon className="w-4 h-4 mr-1" />
                    Clone
                  </Button>
                  <Button className="bg-purple-600 hover:bg-purple-700">
                    <SendIcon className="w-4 h-4 mr-1" />
                    Publish
                  </Button>
                </div>
              </div>
            </Card>

            <div className="text-right mt-2">
              <span className="text-sm text-gray-400">1/1</span>
            </div>
          </div>
        )
    }
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-white/10 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-semibold">MarketingAI Studio</h1>
            <Badge variant="secondary" className="bg-purple-500/20 text-purple-300 border-purple-500/30">
              Pro
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm">
              <HelpCircleIcon className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <SettingsIcon className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-73px)]">
        {/* Left Sidebar */}
        <div className="w-64 border-r border-white/10 p-4">
          <nav className="space-y-2">
            <Button
              variant={activeSection === "create" ? "secondary" : "ghost"}
              className={`w-full justify-start ${
                activeSection === "create"
                  ? "bg-purple-500/20 text-purple-300 border-purple-500/30"
                  : "text-gray-400 hover:text-white"
              }`}
              onClick={() => setActiveSection("create")}
            >
              <PlusIcon className="w-4 h-4 mr-2" />
              Create Post
            </Button>
            <Button
              variant="ghost"
              className={`w-full justify-start ${
                activeSection === "inspiration" ? "text-purple-300 bg-purple-500/10" : "text-gray-400 hover:text-white"
              }`}
              onClick={() => setActiveSection("inspiration")}
            >
              <SparklesIcon className="w-4 h-4 mr-2" />
              Inspiration
            </Button>
            <Button
              variant="ghost"
              className={`w-full justify-start ${
                activeSection === "prompts" ? "text-purple-300 bg-purple-500/10" : "text-gray-400 hover:text-white"
              }`}
              onClick={() => setActiveSection("prompts")}
            >
              <LightBulbIcon className="w-4 h-4 mr-2" />
              Prompts
            </Button>
            <Button
              variant="ghost"
              className={`w-full justify-start ${
                activeSection === "sources" ? "text-purple-300 bg-purple-500/10" : "text-gray-400 hover:text-white"
              }`}
              onClick={() => setActiveSection("sources")}
            >
              <ImageIcon className="w-4 h-4 mr-2" />
              Sources
            </Button>
            <Button
              variant="ghost"
              className={`w-full justify-start ${
                activeSection === "calendar" ? "text-purple-300 bg-purple-500/10" : "text-gray-400 hover:text-white"
              }`}
              onClick={() => setActiveSection("calendar")}
            >
              <CalendarIcon className="w-4 h-4 mr-2" />
              Calendar
            </Button>
            <Button
              variant="ghost"
              className={`w-full justify-start ${
                activeSection === "published" ? "text-purple-300 bg-purple-500/10" : "text-gray-400 hover:text-white"
              }`}
              onClick={() => setActiveSection("published")}
            >
              <SendIcon className="w-4 h-4 mr-2" />
              Published Posts
            </Button>
            <Button
              variant="ghost"
              className={`w-full justify-start ${
                activeSection === "failed" ? "text-purple-300 bg-purple-500/10" : "text-gray-400 hover:text-white"
              }`}
              onClick={() => setActiveSection("failed")}
            >
              <span className="w-4 h-4 mr-2 text-red-400">⚠</span>
              Failed Posts
            </Button>
            <Button
              variant="ghost"
              className={`w-full justify-start ${
                activeSection === "videos" ? "text-purple-300 bg-purple-500/10" : "text-gray-400 hover:text-white"
              }`}
              onClick={() => setActiveSection("videos")}
            >
              <VideoIcon className="w-4 h-4 mr-2" />
              Videos
            </Button>
            <Button
              variant="ghost"
              className={`w-full justify-start ${
                activeSection === "api" ? "text-purple-300 bg-purple-500/10" : "text-gray-400 hover:text-white"
              }`}
              onClick={() => setActiveSection("api")}
            >
              <span className="w-4 h-4 mr-2">⚡</span>
              API Dashboard
            </Button>
            <Button
              variant="ghost"
              className={`w-full justify-start ${
                activeSection === "coach" ? "text-purple-300 bg-purple-500/10" : "text-gray-400 hover:text-white"
              }`}
              onClick={() => setActiveSection("coach")}
            >
              <SparklesIcon className="w-4 h-4 mr-2" />
              Viral AI Coach
            </Button>
          </nav>

          <div className="absolute bottom-4 left-4">
            <Button variant="ghost" size="sm">
              <SunIcon className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex">
          {/* Content Creation */}
          <div className="flex-1 p-6">{renderMainContent()}</div>

          {/* AI Assistant Panel */}
          <div className="w-80 border-l border-white/10 p-4">
            <Card className="bg-gray-900/50 border-white/10 h-full flex flex-col">
              <div className="p-4 border-b border-white/10">
                <h3 className="font-semibold flex items-center gap-2">
                  <SparklesIcon className="w-4 h-4" />
                  ChatGPT
                </h3>
              </div>

              <div className="flex-1 p-4 overflow-y-auto">
                <div className="space-y-4">
                  {chatMessages.map((message, index) => (
                    <div key={index} className="text-sm">
                      <div className="bg-gray-800/50 rounded-lg p-3">{message.content}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-4 border-t border-white/10">
                <Button variant="ghost" className="w-full justify-start text-gray-400">
                  <LightBulbIcon className="w-4 h-4 mr-2" />
                  Prompts
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
