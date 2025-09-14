"use client"

import Header from "@/components/header"
import ShaderBackground from "@/components/shader-background"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DollarSign,
  TrendingUp,
  BarChart3,
  Gift,
  HelpCircle,
  Calendar,
  LinkIcon,
  Download,
  FileText,
  Video,
  BookOpen,
} from "lucide-react"
import Link from "next/link"

export default function AffiliateResources() {
  return (
    <ShaderBackground>
      <Header />

      <div className="relative z-10 min-h-screen pt-20">
        <div className="flex">
          {/* Sidebar */}
          <div className="w-64 bg-black/20 backdrop-blur-sm border-r border-white/10 min-h-screen p-6">
            <div className="mb-8">
              <h2 className="text-xl font-bold text-white mb-2">Affiliate Portal</h2>
              <p className="text-white/60 text-sm">Welcome back, John!</p>
            </div>

            <nav className="space-y-2">
              <Link
                href="/affiliate/dashboard"
                className="flex items-center space-x-3 px-3 py-2 rounded-lg text-white/70 hover:bg-white/5 hover:text-white transition-colors"
              >
                <BarChart3 className="w-4 h-4" />
                <span>Dashboard</span>
              </Link>
              <Link
                href="/affiliate/links"
                className="flex items-center space-x-3 px-3 py-2 rounded-lg text-white/70 hover:bg-white/5 hover:text-white transition-colors"
              >
                <LinkIcon className="w-4 h-4" />
                <span>Links & Banners</span>
              </Link>
              <Link
                href="/affiliate/commissions"
                className="flex items-center space-x-3 px-3 py-2 rounded-lg text-white/70 hover:bg-white/5 hover:text-white transition-colors"
              >
                <DollarSign className="w-4 h-4" />
                <span>Commissions</span>
              </Link>
              <Link
                href="/affiliate/analytics"
                className="flex items-center space-x-3 px-3 py-2 rounded-lg text-white/70 hover:bg-white/5 hover:text-white transition-colors"
              >
                <TrendingUp className="w-4 h-4" />
                <span>Analytics</span>
              </Link>
              <Link
                href="/affiliate/payouts"
                className="flex items-center space-x-3 px-3 py-2 rounded-lg text-white/70 hover:bg-white/5 hover:text-white transition-colors"
              >
                <Gift className="w-4 h-4" />
                <span>Payouts</span>
              </Link>
              <Link
                href="/affiliate/resources"
                className="flex items-center space-x-3 px-3 py-2 rounded-lg bg-white/10 text-white"
              >
                <Calendar className="w-4 h-4" />
                <span>Resources</span>
              </Link>
              <Link
                href="/affiliate/support"
                className="flex items-center space-x-3 px-3 py-2 rounded-lg text-white/70 hover:bg-white/5 hover:text-white transition-colors"
              >
                <HelpCircle className="w-4 h-4" />
                <span>Support</span>
              </Link>
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1 p-8">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-white mb-2">Resources</h1>
              <p className="text-white/70">Marketing materials, guides, and training resources</p>
            </div>

            {/* Quick Downloads */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              <Card className="bg-black/20 border-white/10 text-white">
                <CardHeader>
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center mb-4">
                    <Download className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-lg">Marketing Kit</CardTitle>
                  <CardDescription className="text-white/60">
                    Complete set of banners, logos, and assets
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full bg-violet-500 hover:bg-violet-600 text-white">Download ZIP</Button>
                </CardContent>
              </Card>

              <Card className="bg-black/20 border-white/10 text-white">
                <CardHeader>
                  <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-lg flex items-center justify-center mb-4">
                    <FileText className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-lg">Product Guide</CardTitle>
                  <CardDescription className="text-white/60">Detailed feature overview and benefits</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full bg-violet-500 hover:bg-violet-600 text-white">Download PDF</Button>
                </CardContent>
              </Card>

              <Card className="bg-black/20 border-white/10 text-white">
                <CardHeader>
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-lg flex items-center justify-center mb-4">
                    <Video className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-lg">Demo Videos</CardTitle>
                  <CardDescription className="text-white/60">Product demonstrations and tutorials</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full bg-violet-500 hover:bg-violet-600 text-white">View Library</Button>
                </CardContent>
              </Card>
            </div>

            {/* Training Materials */}
            <Card className="bg-black/20 border-white/10 text-white mb-8">
              <CardHeader>
                <CardTitle>Training & Education</CardTitle>
                <CardDescription className="text-white/60">
                  Learn how to maximize your affiliate success
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-start space-x-4">
                      <BookOpen className="w-6 h-6 text-blue-400 mt-1 flex-shrink-0" />
                      <div>
                        <h3 className="font-medium mb-2">Affiliate Marketing 101</h3>
                        <p className="text-sm text-white/60 mb-3">
                          Complete beginner's guide to affiliate marketing success
                        </p>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-white/20 text-white hover:bg-white/10 bg-transparent"
                        >
                          Read Guide
                        </Button>
                      </div>
                    </div>
                    <div className="flex items-start space-x-4">
                      <Video className="w-6 h-6 text-green-400 mt-1 flex-shrink-0" />
                      <div>
                        <h3 className="font-medium mb-2">Email Marketing Masterclass</h3>
                        <p className="text-sm text-white/60 mb-3">Learn to create high-converting email campaigns</p>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-white/20 text-white hover:bg-white/10 bg-transparent"
                        >
                          Watch Video
                        </Button>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-4">
                      <FileText className="w-6 h-6 text-purple-400 mt-1 flex-shrink-0" />
                      <div>
                        <h3 className="font-medium mb-2">Content Creation Templates</h3>
                        <p className="text-sm text-white/60 mb-3">
                          Ready-to-use blog posts, social media content, and more
                        </p>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-white/20 text-white hover:bg-white/10 bg-transparent"
                        >
                          Download
                        </Button>
                      </div>
                    </div>
                    <div className="flex items-start space-x-4">
                      <TrendingUp className="w-6 h-6 text-orange-400 mt-1 flex-shrink-0" />
                      <div>
                        <h3 className="font-medium mb-2">Advanced Strategies</h3>
                        <p className="text-sm text-white/60 mb-3">Pro tips for scaling your affiliate business</p>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-white/20 text-white hover:bg-white/10 bg-transparent"
                        >
                          Learn More
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Product Information */}
            <Card className="bg-black/20 border-white/10 text-white">
              <CardHeader>
                <CardTitle>Product Information</CardTitle>
                <CardDescription className="text-white/60">Everything you need to know about MarketAI</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-medium mb-3">Key Features</h3>
                      <ul className="space-y-2 text-sm text-white/70">
                        <li>• AI-powered content generation</li>
                        <li>• Multi-platform social media management</li>
                        <li>• Advanced analytics and reporting</li>
                        <li>• Automated posting and scheduling</li>
                        <li>• Team collaboration tools</li>
                        <li>• Custom brand voice training</li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="font-medium mb-3">Pricing Plans</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-white/70">Starter Plan</span>
                          <span className="text-white">$29/month</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-white/70">Pro Plan</span>
                          <span className="text-white">$99/month</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-white/70">Enterprise Plan</span>
                          <span className="text-white">$299/month</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-medium mb-3">Common Objections & Responses</h3>
                    <div className="space-y-3 text-sm">
                      <div>
                        <p className="text-white/70 mb-1">
                          <strong>Q:</strong> "Is this just another AI tool?"
                        </p>
                        <p className="text-white/60">
                          <strong>A:</strong> MarketAI is specifically designed for marketers, with features like brand
                          voice training and multi-platform management that generic AI tools don't offer.
                        </p>
                      </div>
                      <div>
                        <p className="text-white/70 mb-1">
                          <strong>Q:</strong> "How is this different from ChatGPT?"
                        </p>
                        <p className="text-white/60">
                          <strong>A:</strong> While ChatGPT is general-purpose, MarketAI includes specialized marketing
                          templates, social media scheduling, analytics, and team collaboration features.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </ShaderBackground>
  )
}
