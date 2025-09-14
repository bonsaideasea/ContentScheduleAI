"use client"

import Header from "@/components/header"
import ShaderBackground from "@/components/shader-background"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  DollarSign,
  TrendingUp,
  BarChart3,
  Gift,
  HelpCircle,
  Calendar,
  LinkIcon,
  CheckCircle,
  Clock,
} from "lucide-react"
import Link from "next/link"

export default function AffiliateCommissions() {
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
                className="flex items-center space-x-3 px-3 py-2 rounded-lg bg-white/10 text-white"
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
              <h1 className="text-3xl font-bold text-white mb-2">Commissions</h1>
              <p className="text-white/70">Track your earnings and commission history</p>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card className="bg-black/20 border-white/10 text-white">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">This Month</CardTitle>
                  <DollarSign className="h-4 w-4 text-green-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">$847.50</div>
                  <p className="text-xs text-green-400">+23% from last month</p>
                </CardContent>
              </Card>

              <Card className="bg-black/20 border-white/10 text-white">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Pending</CardTitle>
                  <Clock className="h-4 w-4 text-yellow-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">$234.75</div>
                  <p className="text-xs text-yellow-400">Awaiting approval</p>
                </CardContent>
              </Card>

              <Card className="bg-black/20 border-white/10 text-white">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Earned</CardTitle>
                  <TrendingUp className="h-4 w-4 text-blue-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">$12,847.50</div>
                  <p className="text-xs text-blue-400">All time earnings</p>
                </CardContent>
              </Card>
            </div>

            <Tabs defaultValue="recent" className="space-y-6">
              <TabsList className="bg-black/20 border-white/10">
                <TabsTrigger value="recent" className="data-[state=active]:bg-white/10 text-white">
                  Recent Commissions
                </TabsTrigger>
                <TabsTrigger value="pending" className="data-[state=active]:bg-white/10 text-white">
                  Pending Approval
                </TabsTrigger>
                <TabsTrigger value="history" className="data-[state=active]:bg-white/10 text-white">
                  Payment History
                </TabsTrigger>
              </TabsList>

              <TabsContent value="recent" className="space-y-6">
                <Card className="bg-black/20 border-white/10 text-white">
                  <CardHeader>
                    <CardTitle>Recent Commissions</CardTitle>
                    <CardDescription className="text-white/60">Your latest commission earnings</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow className="border-white/10">
                          <TableHead className="text-white/70">Customer</TableHead>
                          <TableHead className="text-white/70">Plan</TableHead>
                          <TableHead className="text-white/70">Date</TableHead>
                          <TableHead className="text-white/70">Commission</TableHead>
                          <TableHead className="text-white/70">Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow className="border-white/10">
                          <TableCell className="text-white">Sarah Johnson</TableCell>
                          <TableCell className="text-white/70">Pro Plan</TableCell>
                          <TableCell className="text-white/70">Dec 15, 2024</TableCell>
                          <TableCell className="text-white font-medium">$34.65</TableCell>
                          <TableCell>
                            <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Paid
                            </Badge>
                          </TableCell>
                        </TableRow>
                        <TableRow className="border-white/10">
                          <TableCell className="text-white">Mike Chen</TableCell>
                          <TableCell className="text-white/70">Starter Plan</TableCell>
                          <TableCell className="text-white/70">Dec 14, 2024</TableCell>
                          <TableCell className="text-white font-medium">$10.15</TableCell>
                          <TableCell>
                            <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Paid
                            </Badge>
                          </TableCell>
                        </TableRow>
                        <TableRow className="border-white/10">
                          <TableCell className="text-white">Lisa Rodriguez</TableCell>
                          <TableCell className="text-white/70">Enterprise Plan</TableCell>
                          <TableCell className="text-white/70">Dec 13, 2024</TableCell>
                          <TableCell className="text-white font-medium">$104.65</TableCell>
                          <TableCell>
                            <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Paid
                            </Badge>
                          </TableCell>
                        </TableRow>
                        <TableRow className="border-white/10">
                          <TableCell className="text-white">David Kim</TableCell>
                          <TableCell className="text-white/70">Pro Plan</TableCell>
                          <TableCell className="text-white/70">Dec 12, 2024</TableCell>
                          <TableCell className="text-white font-medium">$34.65</TableCell>
                          <TableCell>
                            <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                              <Clock className="w-3 h-3 mr-1" />
                              Pending
                            </Badge>
                          </TableCell>
                        </TableRow>
                        <TableRow className="border-white/10">
                          <TableCell className="text-white">Emma Wilson</TableCell>
                          <TableCell className="text-white/70">Starter Plan</TableCell>
                          <TableCell className="text-white/70">Dec 11, 2024</TableCell>
                          <TableCell className="text-white font-medium">$10.15</TableCell>
                          <TableCell>
                            <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Paid
                            </Badge>
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="pending" className="space-y-6">
                <Card className="bg-black/20 border-white/10 text-white">
                  <CardHeader>
                    <CardTitle>Pending Commissions</CardTitle>
                    <CardDescription className="text-white/60">
                      Commissions awaiting approval (typically processed within 48 hours)
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow className="border-white/10">
                          <TableHead className="text-white/70">Customer</TableHead>
                          <TableHead className="text-white/70">Plan</TableHead>
                          <TableHead className="text-white/70">Date</TableHead>
                          <TableHead className="text-white/70">Commission</TableHead>
                          <TableHead className="text-white/70">Expected Approval</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow className="border-white/10">
                          <TableCell className="text-white">David Kim</TableCell>
                          <TableCell className="text-white/70">Pro Plan</TableCell>
                          <TableCell className="text-white/70">Dec 12, 2024</TableCell>
                          <TableCell className="text-white font-medium">$34.65</TableCell>
                          <TableCell className="text-white/70">Dec 16, 2024</TableCell>
                        </TableRow>
                        <TableRow className="border-white/10">
                          <TableCell className="text-white">Alex Thompson</TableCell>
                          <TableCell className="text-white/70">Enterprise Plan</TableCell>
                          <TableCell className="text-white/70">Dec 13, 2024</TableCell>
                          <TableCell className="text-white font-medium">$104.65</TableCell>
                          <TableCell className="text-white/70">Dec 17, 2024</TableCell>
                        </TableRow>
                        <TableRow className="border-white/10">
                          <TableCell className="text-white">Rachel Green</TableCell>
                          <TableCell className="text-white/70">Pro Plan</TableCell>
                          <TableCell className="text-white/70">Dec 14, 2024</TableCell>
                          <TableCell className="text-white font-medium">$34.65</TableCell>
                          <TableCell className="text-white/70">Dec 18, 2024</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="history" className="space-y-6">
                <Card className="bg-black/20 border-white/10 text-white">
                  <CardHeader>
                    <CardTitle>Payment History</CardTitle>
                    <CardDescription className="text-white/60">Your commission payment history</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow className="border-white/10">
                          <TableHead className="text-white/70">Payment Date</TableHead>
                          <TableHead className="text-white/70">Period</TableHead>
                          <TableHead className="text-white/70">Amount</TableHead>
                          <TableHead className="text-white/70">Method</TableHead>
                          <TableHead className="text-white/70">Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow className="border-white/10">
                          <TableCell className="text-white">Dec 1, 2024</TableCell>
                          <TableCell className="text-white/70">November 2024</TableCell>
                          <TableCell className="text-white font-medium">$1,247.85</TableCell>
                          <TableCell className="text-white/70">PayPal</TableCell>
                          <TableCell>
                            <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Completed
                            </Badge>
                          </TableCell>
                        </TableRow>
                        <TableRow className="border-white/10">
                          <TableCell className="text-white">Nov 1, 2024</TableCell>
                          <TableCell className="text-white/70">October 2024</TableCell>
                          <TableCell className="text-white font-medium">$987.50</TableCell>
                          <TableCell className="text-white/70">Bank Transfer</TableCell>
                          <TableCell>
                            <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Completed
                            </Badge>
                          </TableCell>
                        </TableRow>
                        <TableRow className="border-white/10">
                          <TableCell className="text-white">Oct 1, 2024</TableCell>
                          <TableCell className="text-white/70">September 2024</TableCell>
                          <TableCell className="text-white font-medium">$1,456.20</TableCell>
                          <TableCell className="text-white/70">PayPal</TableCell>
                          <TableCell>
                            <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Completed
                            </Badge>
                          </TableCell>
                        </TableRow>
                        <TableRow className="border-white/10">
                          <TableCell className="text-white">Sep 1, 2024</TableCell>
                          <TableCell className="text-white/70">August 2024</TableCell>
                          <TableCell className="text-white font-medium">$834.75</TableCell>
                          <TableCell className="text-white/70">Stripe</TableCell>
                          <TableCell>
                            <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Completed
                            </Badge>
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
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
