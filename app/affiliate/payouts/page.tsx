"use client"

import Header from "@/components/header"
import ShaderBackground from "@/components/shader-background"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  DollarSign,
  TrendingUp,
  BarChart3,
  Gift,
  HelpCircle,
  Calendar,
  LinkIcon,
  CreditCard,
  Banknote,
} from "lucide-react"
import Link from "next/link"

export default function AffiliatePayouts() {
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
                className="flex items-center space-x-3 px-3 py-2 rounded-lg bg-white/10 text-white"
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
              <h1 className="text-3xl font-bold text-white mb-2">Payouts</h1>
              <p className="text-white/70">Manage your payment methods and request payouts</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Current Balance */}
              <Card className="bg-black/20 border-white/10 text-white">
                <CardHeader>
                  <CardTitle>Available Balance</CardTitle>
                  <CardDescription className="text-white/60">Ready for withdrawal</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold mb-4">$847.50</div>
                  <Button className="w-full bg-violet-500 hover:bg-violet-600 text-white">Request Payout</Button>
                  <p className="text-xs text-white/60 mt-2 text-center">
                    Minimum payout: $50 • Processing time: 2-5 business days
                  </p>
                </CardContent>
              </Card>

              {/* Payment Methods */}
              <Card className="bg-black/20 border-white/10 text-white">
                <CardHeader>
                  <CardTitle>Payment Methods</CardTitle>
                  <CardDescription className="text-white/60">Manage how you receive payments</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-black/20 rounded-lg border border-white/10">
                    <div className="flex items-center space-x-3">
                      <CreditCard className="w-5 h-5 text-blue-400" />
                      <div>
                        <p className="font-medium">PayPal</p>
                        <p className="text-sm text-white/60">john.doe@email.com</p>
                      </div>
                    </div>
                    <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Primary</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-black/20 rounded-lg border border-white/10">
                    <div className="flex items-center space-x-3">
                      <Banknote className="w-5 h-5 text-green-400" />
                      <div>
                        <p className="font-medium">Bank Transfer</p>
                        <p className="text-sm text-white/60">****1234</p>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-white/20 text-white hover:bg-white/10 bg-transparent"
                    >
                      Edit
                    </Button>
                  </div>
                  <Button
                    variant="outline"
                    className="w-full border-white/20 text-white hover:bg-white/10 bg-transparent"
                  >
                    Add Payment Method
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Payout Settings */}
            <Card className="bg-black/20 border-white/10 text-white mt-8">
              <CardHeader>
                <CardTitle>Payout Settings</CardTitle>
                <CardDescription className="text-white/60">Configure automatic payouts and preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="frequency" className="text-white">
                      Payout Frequency
                    </Label>
                    <Select>
                      <SelectTrigger className="bg-black/20 border-white/20 text-white">
                        <SelectValue placeholder="Select frequency" />
                      </SelectTrigger>
                      <SelectContent className="bg-black border-white/20">
                        <SelectItem value="manual">Manual</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="minimum" className="text-white">
                      Minimum Payout Amount
                    </Label>
                    <Input
                      id="minimum"
                      placeholder="$50.00"
                      className="bg-black/20 border-white/20 text-white placeholder:text-white/40"
                    />
                  </div>
                </div>
                <Button className="bg-violet-500 hover:bg-violet-600 text-white">Save Settings</Button>
              </CardContent>
            </Card>

            {/* Recent Payouts */}
            <Card className="bg-black/20 border-white/10 text-white mt-8">
              <CardHeader>
                <CardTitle>Recent Payouts</CardTitle>
                <CardDescription className="text-white/60">Your payout history</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-black/20 rounded-lg border border-white/10">
                    <div>
                      <p className="font-medium">December 1, 2024</p>
                      <p className="text-sm text-white/60">PayPal • john.doe@email.com</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">$1,247.85</p>
                      <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Completed</Badge>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-black/20 rounded-lg border border-white/10">
                    <div>
                      <p className="font-medium">November 1, 2024</p>
                      <p className="text-sm text-white/60">Bank Transfer • ****1234</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">$987.50</p>
                      <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Completed</Badge>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-black/20 rounded-lg border border-white/10">
                    <div>
                      <p className="font-medium">October 1, 2024</p>
                      <p className="text-sm text-white/60">PayPal • john.doe@email.com</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">$1,456.20</p>
                      <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Completed</Badge>
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
