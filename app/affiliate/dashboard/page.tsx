"use client"

import Link from "next/link"

import Header from "@/components/header"
import ShaderBackground from "@/components/shader-background"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { DollarSign, TrendingUp, Users, MousePointer, Calendar, BarChart3, Gift, HelpCircle } from "lucide-react"

export default function AffiliateDashboard() {
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
                className="flex items-center space-x-3 px-3 py-2 rounded-lg bg-white/10 text-white"
              >
                <BarChart3 className="w-4 h-4" />
                <span>Dashboard</span>
              </Link>
              <Link
                href="/affiliate/links"
                className="flex items-center space-x-3 px-3 py-2 rounded-lg text-white/70 hover:bg-white/5 hover:text-white transition-colors"
              >
                <span className="w-4 h-4" />
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
              <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
              <p className="text-white/70">Track your affiliate performance and earnings</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card className="bg-black/20 border-white/10 text-white">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
                  <DollarSign className="h-4 w-4 text-green-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">$2,847.50</div>
                  <p className="text-xs text-green-400">+12.5% from last month</p>
                </CardContent>
              </Card>

              <Card className="bg-black/20 border-white/10 text-white">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Referrals</CardTitle>
                  <Users className="h-4 w-4 text-blue-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">47</div>
                  <p className="text-xs text-blue-400">+8 this month</p>
                </CardContent>
              </Card>

              <Card className="bg-black/20 border-white/10 text-white">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Clicks</CardTitle>
                  <MousePointer className="h-4 w-4 text-purple-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">1,234</div>
                  <p className="text-xs text-purple-400">+23% conversion rate</p>
                </CardContent>
              </Card>

              <Card className="bg-black/20 border-white/10 text-white">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Commission Rate</CardTitle>
                  <TrendingUp className="h-4 w-4 text-orange-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">35%</div>
                  <p className="text-xs text-orange-400">Tier 2 status</p>
                </CardContent>
              </Card>
            </div>

            {/* Progress to Next Tier */}
            <Card className="bg-black/20 border-white/10 text-white mb-8">
              <CardHeader>
                <CardTitle>Progress to Tier 3 (40% Commission)</CardTitle>
                <CardDescription className="text-white/60">
                  Refer 3 more customers this month to unlock higher commission rates
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>7 of 10 referrals</span>
                    <span>70%</span>
                  </div>
                  <Progress value={70} className="h-2" />
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card className="bg-black/20 border-white/10 text-white">
                <CardHeader>
                  <CardTitle>Recent Referrals</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Sarah Johnson</p>
                        <p className="text-sm text-white/60">Pro Plan - $99/month</p>
                      </div>
                      <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Active</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Mike Chen</p>
                        <p className="text-sm text-white/60">Starter Plan - $29/month</p>
                      </div>
                      <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">Trial</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Lisa Rodriguez</p>
                        <p className="text-sm text-white/60">Enterprise Plan - $299/month</p>
                      </div>
                      <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Active</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-black/20 border-white/10 text-white">
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button className="w-full bg-violet-500 hover:bg-violet-600 text-white">Generate New Link</Button>
                  <Button
                    variant="outline"
                    className="w-full border-white/20 text-white hover:bg-white/10 bg-transparent"
                  >
                    Download Marketing Kit
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full border-white/20 text-white hover:bg-white/10 bg-transparent"
                  >
                    Request Payout
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full border-white/20 text-white hover:bg-white/10 bg-transparent"
                  >
                    Contact Support
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </ShaderBackground>
  )
}
