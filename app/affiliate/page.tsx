"use client"

import Header from "@/components/header"
import ShaderBackground from "@/components/shader-background"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, DollarSign, TrendingUp, Gift } from "lucide-react"
import Link from "next/link"

export default function AffiliatePage() {
  return (
    <ShaderBackground>
      <Header />

      <div className="relative z-10 min-h-screen pt-20">
        <div className="container mx-auto px-6">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-black/20 text-white border-white/20">Affiliate Program</Badge>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Earn with{" "}
              <span className="bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">
                MarketAI
              </span>
            </h1>
            <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto leading-relaxed">
              Join our affiliate program and earn up to 40% commission for every customer you refer. Help marketers
              discover the power of AI automation.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-black hover:bg-white/90 font-medium">
                Join Program
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10 bg-transparent"
              >
                Learn More
              </Button>
            </div>
          </div>

          {/* Commission Structure */}
          <div className="grid md:grid-cols-3 gap-6 mb-16">
            <Card className="bg-black/20 border-white/10 text-white">
              <CardHeader className="text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <DollarSign className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-2xl">30% Commission</CardTitle>
                <CardDescription className="text-white/60">First 3 months</CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-white/80">Earn 30% on all new customer subscriptions for their first quarter</p>
              </CardContent>
            </Card>

            <Card className="bg-black/20 border-white/10 text-white">
              <CardHeader className="text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-2xl">40% Commission</CardTitle>
                <CardDescription className="text-white/60">Top performers</CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-white/80">Unlock higher rates when you refer 10+ customers per month</p>
              </CardContent>
            </Card>

            <Card className="bg-black/20 border-white/10 text-white">
              <CardHeader className="text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Gift className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-2xl">Bonus Rewards</CardTitle>
                <CardDescription className="text-white/60">Extra incentives</CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-white/80">Monthly bonuses, exclusive swag, and early access to new features</p>
              </CardContent>
            </Card>
          </div>

          {/* Benefits */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-white text-center mb-12">Why Join Our Program?</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <CheckCircle className="w-6 h-6 text-green-400 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">High Converting Product</h3>
                    <p className="text-white/70">
                      MarketAI has a proven track record with 15% conversion rates and low churn
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <CheckCircle className="w-6 h-6 text-green-400 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">Marketing Materials</h3>
                    <p className="text-white/70">
                      Access to banners, email templates, social media assets, and landing pages
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <CheckCircle className="w-6 h-6 text-green-400 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">Real-time Analytics</h3>
                    <p className="text-white/70">
                      Track clicks, conversions, and earnings with our comprehensive dashboard
                    </p>
                  </div>
                </div>
              </div>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <CheckCircle className="w-6 h-6 text-green-400 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">Dedicated Support</h3>
                    <p className="text-white/70">
                      Personal affiliate manager and priority support for all your questions
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <CheckCircle className="w-6 h-6 text-green-400 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">Monthly Payouts</h3>
                    <p className="text-white/70">Reliable payments via PayPal, Stripe, or bank transfer every month</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <CheckCircle className="w-6 h-6 text-green-400 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">No Minimum Threshold</h3>
                    <p className="text-white/70">Get paid from your first referral - no waiting for minimum amounts</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">500+</div>
              <div className="text-white/60">Active Affiliates</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">$2M+</div>
              <div className="text-white/60">Paid Out</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">15%</div>
              <div className="text-white/60">Avg Conversion</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">$180</div>
              <div className="text-white/60">Avg Commission</div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center mb-16">
            <Card className="bg-gradient-to-r from-violet-500/20 to-purple-500/20 border-white/20 max-w-2xl mx-auto">
              <CardHeader>
                <CardTitle className="text-2xl text-white">Ready to Start Earning?</CardTitle>
                <CardDescription className="text-white/70">
                  Join thousands of affiliates already earning with MarketAI
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button size="lg" className="bg-white text-black hover:bg-white/90 font-medium">
                  Apply Now - It's Free
                </Button>
                <Link href="/affiliate/dashboard">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-white/20 text-white hover:bg-white/10 bg-transparent"
                  >
                    View Dashboard
                  </Button>
                </Link>
                <p className="text-sm text-white/60 mt-4">Application review typically takes 24-48 hours</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </ShaderBackground>
  )
}
