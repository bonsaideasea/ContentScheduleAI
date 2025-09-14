"use client"

import Header from "@/components/header"
import ShaderBackground from "@/components/shader-background"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Copy,
  Download,
  Eye,
  DollarSign,
  TrendingUp,
  Users,
  BarChart3,
  Gift,
  HelpCircle,
  Calendar,
  LinkIcon,
  ImageIcon,
} from "lucide-react"
import Link from "next/link"

export default function AffiliateLinks() {
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
                className="flex items-center space-x-3 px-3 py-2 rounded-lg bg-white/10 text-white"
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
                className="flex items-center space-x-3 px-3 py-2 rounded-lg text-white/70 hover:bg-white/5 hover:text-white transition-colors"
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
              <h1 className="text-3xl font-bold text-white mb-2">Links & Banners</h1>
              <p className="text-white/70">Generate custom affiliate links and download marketing materials</p>
            </div>

            <Tabs defaultValue="links" className="space-y-6">
              <TabsList className="bg-black/20 border-white/10">
                <TabsTrigger value="links" className="data-[state=active]:bg-white/10 text-white">
                  Affiliate Links
                </TabsTrigger>
                <TabsTrigger value="banners" className="data-[state=active]:bg-white/10 text-white">
                  Marketing Banners
                </TabsTrigger>
              </TabsList>

              <TabsContent value="links" className="space-y-6">
                {/* Link Generator */}
                <Card className="bg-black/20 border-white/10 text-white">
                  <CardHeader>
                    <CardTitle>Generate Custom Link</CardTitle>
                    <CardDescription className="text-white/60">
                      Create trackable affiliate links for different campaigns
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="campaign" className="text-white">
                          Campaign Name
                        </Label>
                        <Input
                          id="campaign"
                          placeholder="e.g., Holiday Sale 2024"
                          className="bg-black/20 border-white/20 text-white placeholder:text-white/40"
                        />
                      </div>
                      <div>
                        <Label htmlFor="source" className="text-white">
                          Traffic Source
                        </Label>
                        <Input
                          id="source"
                          placeholder="e.g., email, social, blog"
                          className="bg-black/20 border-white/20 text-white placeholder:text-white/40"
                        />
                      </div>
                    </div>
                    <Button className="bg-violet-500 hover:bg-violet-600 text-white">Generate Link</Button>
                  </CardContent>
                </Card>

                {/* Existing Links */}
                <Card className="bg-black/20 border-white/10 text-white">
                  <CardHeader>
                    <CardTitle>Your Affiliate Links</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-black/20 rounded-lg border border-white/10">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h3 className="font-medium">Default Link</h3>
                            <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">Active</Badge>
                          </div>
                          <p className="text-sm text-white/60 font-mono">https://marketai.com/ref/john-doe-123</p>
                          <div className="flex items-center space-x-4 mt-2 text-xs text-white/50">
                            <span className="flex items-center space-x-1">
                              <Eye className="w-3 h-3" />
                              <span>234 clicks</span>
                            </span>
                            <span className="flex items-center space-x-1">
                              <Users className="w-3 h-3" />
                              <span>12 conversions</span>
                            </span>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-white/20 text-white hover:bg-white/10 bg-transparent"
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>

                      <div className="flex items-center justify-between p-4 bg-black/20 rounded-lg border border-white/10">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h3 className="font-medium">Email Campaign</h3>
                            <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                              High Converting
                            </Badge>
                          </div>
                          <p className="text-sm text-white/60 font-mono">
                            https://marketai.com/ref/john-doe-123?utm_source=email
                          </p>
                          <div className="flex items-center space-x-4 mt-2 text-xs text-white/50">
                            <span className="flex items-center space-x-1">
                              <Eye className="w-3 h-3" />
                              <span>89 clicks</span>
                            </span>
                            <span className="flex items-center space-x-1">
                              <Users className="w-3 h-3" />
                              <span>8 conversions</span>
                            </span>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-white/20 text-white hover:bg-white/10 bg-transparent"
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>

                      <div className="flex items-center justify-between p-4 bg-black/20 rounded-lg border border-white/10">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h3 className="font-medium">Social Media</h3>
                            <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">New</Badge>
                          </div>
                          <p className="text-sm text-white/60 font-mono">
                            https://marketai.com/ref/john-doe-123?utm_source=social
                          </p>
                          <div className="flex items-center space-x-4 mt-2 text-xs text-white/50">
                            <span className="flex items-center space-x-1">
                              <Eye className="w-3 h-3" />
                              <span>45 clicks</span>
                            </span>
                            <span className="flex items-center space-x-1">
                              <Users className="w-3 h-3" />
                              <span>3 conversions</span>
                            </span>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-white/20 text-white hover:bg-white/10 bg-transparent"
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="banners" className="space-y-6">
                {/* Banner Categories */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <Card className="bg-black/20 border-white/10 text-white">
                    <CardHeader>
                      <div className="w-full h-32 bg-gradient-to-r from-violet-500 to-purple-600 rounded-lg flex items-center justify-center mb-4">
                        <span className="text-white font-bold text-lg">MarketAI</span>
                      </div>
                      <CardTitle className="text-lg">Hero Banners</CardTitle>
                      <CardDescription className="text-white/60">
                        Large format banners for websites and blogs
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex space-x-2">
                        <Button size="sm" className="bg-violet-500 hover:bg-violet-600 text-white">
                          <Download className="w-4 h-4 mr-2" />
                          Download
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-white/20 text-white hover:bg-white/10 bg-transparent"
                        >
                          Preview
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-black/20 border-white/10 text-white">
                    <CardHeader>
                      <div className="w-full h-32 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center mb-4">
                        <ImageIcon className="w-8 h-8 text-white" />
                      </div>
                      <CardTitle className="text-lg">Square Banners</CardTitle>
                      <CardDescription className="text-white/60">
                        Perfect for social media posts and ads
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex space-x-2">
                        <Button size="sm" className="bg-violet-500 hover:bg-violet-600 text-white">
                          <Download className="w-4 h-4 mr-2" />
                          Download
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-white/20 text-white hover:bg-white/10 bg-transparent"
                        >
                          Preview
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-black/20 border-white/10 text-white">
                    <CardHeader>
                      <div className="w-full h-32 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center mb-4">
                        <span className="text-white font-bold">728x90</span>
                      </div>
                      <CardTitle className="text-lg">Leaderboard</CardTitle>
                      <CardDescription className="text-white/60">Standard web advertising format</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex space-x-2">
                        <Button size="sm" className="bg-violet-500 hover:bg-violet-600 text-white">
                          <Download className="w-4 h-4 mr-2" />
                          Download
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-white/20 text-white hover:bg-white/10 bg-transparent"
                        >
                          Preview
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Email Templates */}
                <Card className="bg-black/20 border-white/10 text-white">
                  <CardHeader>
                    <CardTitle>Email Templates</CardTitle>
                    <CardDescription className="text-white/60">
                      Ready-to-use email templates for your campaigns
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 bg-black/20 rounded-lg border border-white/10">
                        <h3 className="font-medium mb-2">Welcome Series</h3>
                        <p className="text-sm text-white/60 mb-4">
                          3-part email sequence introducing MarketAI to new subscribers
                        </p>
                        <Button size="sm" className="bg-violet-500 hover:bg-violet-600 text-white">
                          <Download className="w-4 h-4 mr-2" />
                          Download HTML
                        </Button>
                      </div>
                      <div className="p-4 bg-black/20 rounded-lg border border-white/10">
                        <h3 className="font-medium mb-2">Product Launch</h3>
                        <p className="text-sm text-white/60 mb-4">Announcement template for new features and updates</p>
                        <Button size="sm" className="bg-violet-500 hover:bg-violet-600 text-white">
                          <Download className="w-4 h-4 mr-2" />
                          Download HTML
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </ShaderBackground>
  )
}
