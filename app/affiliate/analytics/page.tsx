"use client"

import Header from "@/components/header"
import ShaderBackground from "@/components/shader-background"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  DollarSign,
  TrendingUp,
  BarChart3,
  Gift,
  HelpCircle,
  Calendar,
  LinkIcon,
  MousePointer,
  Globe,
} from "lucide-react"
import Link from "next/link"

export default function AffiliateAnalytics() {
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
                className="flex items-center space-x-3 px-3 py-2 rounded-lg bg-white/10 text-white"
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
              <h1 className="text-3xl font-bold text-white mb-2">Analytics</h1>
              <p className="text-white/70">Detailed performance metrics and insights</p>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card className="bg-black/20 border-white/10 text-white">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Clicks</CardTitle>
                  <MousePointer className="h-4 w-4 text-blue-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">12,847</div>
                  <p className="text-xs text-blue-400">+15.2% this month</p>
                </CardContent>
              </Card>

              <Card className="bg-black/20 border-white/10 text-white">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
                  <TrendingUp className="h-4 w-4 text-green-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">23.4%</div>
                  <p className="text-xs text-green-400">Above average</p>
                </CardContent>
              </Card>

              <Card className="bg-black/20 border-white/10 text-white">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Avg. Commission</CardTitle>
                  <DollarSign className="h-4 w-4 text-purple-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">$67.50</div>
                  <p className="text-xs text-purple-400">Per conversion</p>
                </CardContent>
              </Card>

              <Card className="bg-black/20 border-white/10 text-white">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Top Source</CardTitle>
                  <Globe className="h-4 w-4 text-orange-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">Email</div>
                  <p className="text-xs text-orange-400">45% of traffic</p>
                </CardContent>
              </Card>
            </div>

            <Tabs defaultValue="overview" className="space-y-6">
              <TabsList className="bg-black/20 border-white/10">
                <TabsTrigger value="overview" className="data-[state=active]:bg-white/10 text-white">
                  Overview
                </TabsTrigger>
                <TabsTrigger value="traffic" className="data-[state=active]:bg-white/10 text-white">
                  Traffic Sources
                </TabsTrigger>
                <TabsTrigger value="performance" className="data-[state=active]:bg-white/10 text-white">
                  Link Performance
                </TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card className="bg-black/20 border-white/10 text-white">
                    <CardHeader>
                      <CardTitle>Monthly Performance</CardTitle>
                      <CardDescription className="text-white/60">Your earnings and conversion trends</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-white/70">December 2024</span>
                          <span className="font-medium">$847.50</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-white/70">November 2024</span>
                          <span className="font-medium">$1,247.85</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-white/70">October 2024</span>
                          <span className="font-medium">$987.50</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-white/70">September 2024</span>
                          <span className="font-medium">$1,456.20</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-black/20 border-white/10 text-white">
                    <CardHeader>
                      <CardTitle>Top Performing Content</CardTitle>
                      <CardDescription className="text-white/60">Your best converting campaigns</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-medium">Email Newsletter</p>
                            <p className="text-sm text-white/60">89 clicks, 8 conversions</p>
                          </div>
                          <span className="text-green-400">9.0%</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-medium">Blog Post Review</p>
                            <p className="text-sm text-white/60">156 clicks, 12 conversions</p>
                          </div>
                          <span className="text-green-400">7.7%</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-medium">Social Media</p>
                            <p className="text-sm text-white/60">234 clicks, 15 conversions</p>
                          </div>
                          <span className="text-green-400">6.4%</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="traffic" className="space-y-6">
                <Card className="bg-black/20 border-white/10 text-white">
                  <CardHeader>
                    <CardTitle>Traffic Sources Breakdown</CardTitle>
                    <CardDescription className="text-white/60">
                      Where your affiliate traffic is coming from
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Email Marketing</span>
                          <span>45%</span>
                        </div>
                        <div className="w-full bg-black/20 rounded-full h-2">
                          <div className="bg-blue-500 h-2 rounded-full" style={{ width: "45%" }}></div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Social Media</span>
                          <span>28%</span>
                        </div>
                        <div className="w-full bg-black/20 rounded-full h-2">
                          <div className="bg-green-500 h-2 rounded-full" style={{ width: "28%" }}></div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Blog/Website</span>
                          <span>18%</span>
                        </div>
                        <div className="w-full bg-black/20 rounded-full h-2">
                          <div className="bg-purple-500 h-2 rounded-full" style={{ width: "18%" }}></div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Direct Links</span>
                          <span>9%</span>
                        </div>
                        <div className="w-full bg-black/20 rounded-full h-2">
                          <div className="bg-orange-500 h-2 rounded-full" style={{ width: "9%" }}></div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="performance" className="space-y-6">
                <Card className="bg-black/20 border-white/10 text-white">
                  <CardHeader>
                    <CardTitle>Link Performance Analysis</CardTitle>
                    <CardDescription className="text-white/60">
                      Detailed metrics for each of your affiliate links
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="p-4 bg-black/20 rounded-lg border border-white/10">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-medium">Default Link</h3>
                          <span className="text-green-400 text-sm">High Performer</span>
                        </div>
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div>
                            <p className="text-white/60">Clicks</p>
                            <p className="font-medium">234</p>
                          </div>
                          <div>
                            <p className="text-white/60">Conversions</p>
                            <p className="font-medium">12</p>
                          </div>
                          <div>
                            <p className="text-white/60">Rate</p>
                            <p className="font-medium">5.1%</p>
                          </div>
                        </div>
                      </div>
                      <div className="p-4 bg-black/20 rounded-lg border border-white/10">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-medium">Email Campaign</h3>
                          <span className="text-blue-400 text-sm">Top Converter</span>
                        </div>
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div>
                            <p className="text-white/60">Clicks</p>
                            <p className="font-medium">89</p>
                          </div>
                          <div>
                            <p className="text-white/60">Conversions</p>
                            <p className="font-medium">8</p>
                          </div>
                          <div>
                            <p className="text-white/60">Rate</p>
                            <p className="font-medium">9.0%</p>
                          </div>
                        </div>
                      </div>
                      <div className="p-4 bg-black/20 rounded-lg border border-white/10">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-medium">Social Media</h3>
                          <span className="text-yellow-400 text-sm">Needs Optimization</span>
                        </div>
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div>
                            <p className="text-white/60">Clicks</p>
                            <p className="font-medium">45</p>
                          </div>
                          <div>
                            <p className="text-white/60">Conversions</p>
                            <p className="font-medium">3</p>
                          </div>
                          <div>
                            <p className="text-white/60">Rate</p>
                            <p className="font-medium">6.7%</p>
                          </div>
                        </div>
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
