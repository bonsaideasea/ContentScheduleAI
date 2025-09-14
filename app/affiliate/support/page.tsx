"use client"

import Header from "@/components/header"
import ShaderBackground from "@/components/shader-background"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  DollarSign,
  TrendingUp,
  BarChart3,
  Gift,
  HelpCircle,
  Calendar,
  LinkIcon,
  MessageCircle,
  Mail,
  Phone,
} from "lucide-react"
import Link from "next/link"

export default function AffiliateSupport() {
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
                className="flex items-center space-x-3 px-3 py-2 rounded-lg text-white/70 hover:bg-white/5 hover:text-white transition-colors"
              >
                <Calendar className="w-4 h-4" />
                <span>Resources</span>
              </Link>
              <Link
                href="/affiliate/support"
                className="flex items-center space-x-3 px-3 py-2 rounded-lg bg-white/10 text-white"
              >
                <HelpCircle className="w-4 h-4" />
                <span>Support</span>
              </Link>
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1 p-8">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-white mb-2">Support</h1>
              <p className="text-white/70">Get help with your affiliate account and marketing efforts</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Contact Form */}
              <Card className="bg-black/20 border-white/10 text-white">
                <CardHeader>
                  <CardTitle>Contact Support</CardTitle>
                  <CardDescription className="text-white/60">
                    Send us a message and we'll get back to you within 24 hours
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name" className="text-white">
                        Name
                      </Label>
                      <Input
                        id="name"
                        placeholder="Your name"
                        className="bg-black/20 border-white/20 text-white placeholder:text-white/40"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email" className="text-white">
                        Email
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="your@email.com"
                        className="bg-black/20 border-white/20 text-white placeholder:text-white/40"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="subject" className="text-white">
                      Subject
                    </Label>
                    <Select>
                      <SelectTrigger className="bg-black/20 border-white/20 text-white">
                        <SelectValue placeholder="Select a topic" />
                      </SelectTrigger>
                      <SelectContent className="bg-black border-white/20">
                        <SelectItem value="general">General Question</SelectItem>
                        <SelectItem value="technical">Technical Issue</SelectItem>
                        <SelectItem value="payment">Payment Issue</SelectItem>
                        <SelectItem value="marketing">Marketing Support</SelectItem>
                        <SelectItem value="account">Account Management</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="message" className="text-white">
                      Message
                    </Label>
                    <Textarea
                      id="message"
                      placeholder="Describe your question or issue..."
                      rows={4}
                      className="bg-black/20 border-white/20 text-white placeholder:text-white/40"
                    />
                  </div>
                  <Button className="w-full bg-violet-500 hover:bg-violet-600 text-white">Send Message</Button>
                </CardContent>
              </Card>

              {/* Contact Information */}
              <div className="space-y-6">
                <Card className="bg-black/20 border-white/10 text-white">
                  <CardHeader>
                    <CardTitle>Get in Touch</CardTitle>
                    <CardDescription className="text-white/60">
                      Multiple ways to reach our affiliate support team
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <Mail className="w-5 h-5 text-blue-400" />
                      <div>
                        <p className="font-medium">Email Support</p>
                        <p className="text-sm text-white/60">affiliates@marketai.com</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <MessageCircle className="w-5 h-5 text-green-400" />
                      <div>
                        <p className="font-medium">Live Chat</p>
                        <p className="text-sm text-white/60">Available 9 AM - 6 PM EST</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Phone className="w-5 h-5 text-purple-400" />
                      <div>
                        <p className="font-medium">Phone Support</p>
                        <p className="text-sm text-white/60">+1 (555) 123-4567</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-black/20 border-white/10 text-white">
                  <CardHeader>
                    <CardTitle>Your Account Manager</CardTitle>
                    <CardDescription className="text-white/60">
                      Dedicated support for high-performing affiliates
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-violet-400 to-purple-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-medium">SM</span>
                      </div>
                      <div>
                        <p className="font-medium">Sarah Mitchell</p>
                        <p className="text-sm text-white/60">Senior Affiliate Manager</p>
                        <p className="text-sm text-white/60">sarah.mitchell@marketai.com</p>
                      </div>
                    </div>
                    <Button className="w-full mt-4 bg-violet-500 hover:bg-violet-600 text-white">Schedule Call</Button>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* FAQ Section */}
            <Card className="bg-black/20 border-white/10 text-white mt-8">
              <CardHeader>
                <CardTitle>Frequently Asked Questions</CardTitle>
                <CardDescription className="text-white/60">Quick answers to common affiliate questions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="font-medium mb-2">How long does it take to get approved?</h3>
                    <p className="text-sm text-white/70">
                      Most affiliate applications are reviewed within 24-48 hours. You'll receive an email notification
                      once your application is processed.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-medium mb-2">When do I get paid?</h3>
                    <p className="text-sm text-white/70">
                      Commissions are paid monthly on the 1st of each month for the previous month's earnings. There's
                      no minimum payout threshold.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-medium mb-2">Can I promote MarketAI on social media?</h3>
                    <p className="text-sm text-white/70">
                      Yes! We encourage social media promotion. Just make sure to use your unique affiliate links and
                      follow FTC guidelines for disclosure.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-medium mb-2">How do I track my performance?</h3>
                    <p className="text-sm text-white/70">
                      Your affiliate dashboard provides real-time tracking of clicks, conversions, and earnings. You can
                      also set up custom campaigns to track different traffic sources.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-medium mb-2">What marketing materials are available?</h3>
                    <p className="text-sm text-white/70">
                      We provide banners, email templates, product screenshots, demo videos, and detailed product
                      information. All materials are available in the Resources section.
                    </p>
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
