"use client"

import Header from "@/components/header"
import ShaderBackground from "@/components/shader-background"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useState } from "react"

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission here
    console.log("Form submitted:", formData)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  return (
    <ShaderBackground>
      <Header />

      <div className="relative z-10 min-h-screen pt-20">
        <div className="container mx-auto px-6">
          {/* Main Content */}
          <div className="max-w-6xl mx-auto">
            {/* Title and Introduction */}
            <div className="mb-16">
              <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight font-serif">
                Contact Us
              </h1>
              <p className="text-xl text-white/80 max-w-2xl leading-relaxed">
                Please feel free to contact us and we will get back to you as soon as we can.
              </p>
            </div>

            {/* Two Column Layout */}
            <div className="grid md:grid-cols-2 gap-16">
              {/* Left Column - Contact Form */}
              <div>
                <form onSubmit={handleSubmit} className="space-y-8">
                  {/* Name Field */}
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-white text-sm font-medium">
                      Name
                    </Label>
                    <div className="relative">
                      <Input
                        id="name"
                        name="name"
                        type="text"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="bg-transparent border-0 border-b border-white/30 rounded-none px-0 py-3 text-white placeholder-white/50 focus:border-white/60 focus:ring-0 focus:outline-none"
                        placeholder=""
                        required
                      />
                    </div>
                  </div>

                  {/* Email Field */}
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-white text-sm font-medium">
                      Email
                    </Label>
                    <div className="relative">
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="bg-transparent border-0 border-b border-white/30 rounded-none px-0 py-3 text-white placeholder-white/50 focus:border-white/60 focus:ring-0 focus:outline-none"
                        placeholder=""
                        required
                      />
                    </div>
                  </div>

                  {/* Message Field */}
                  <div className="space-y-2">
                    <Label htmlFor="message" className="text-white text-sm font-medium">
                      Message
                    </Label>
                    <div className="relative">
                      <Textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        className="bg-transparent border-0 border-b border-white/30 rounded-none px-0 py-3 text-white placeholder-white/50 focus:border-white/60 focus:ring-0 focus:outline-none resize-none min-h-[120px]"
                        placeholder=""
                        required
                      />
                    </div>
                  </div>

                  {/* Send Button */}
                  <div className="pt-4">
                    <Button
                      type="submit"
                      className="bg-gray-600 hover:bg-gray-500 text-white px-8 py-3 rounded-none font-medium"
                    >
                      Send
                    </Button>
                  </div>
                </form>
              </div>

              {/* Right Column - Contact Information */}
              <div className="space-y-12">
                {/* Visit Us */}
                <div>
                  <h3 className="text-white text-lg font-medium mb-4">Visit us</h3>
                  <div className="space-y-1 text-white/80">
                    <p>263 Homebush Road</p>
                    <p>Strathfield South 2136</p>
                  </div>
                </div>

                {/* Talk to Us */}
                <div>
                  <h3 className="text-white text-lg font-medium mb-4">Talk to us</h3>
                  <div className="space-y-1 text-white/80">
                    <p>+61 421 307 998</p>
                    <p>helen@helenarvan.com</p>
                  </div>
                </div>

                {/* Social Media Icons */}
                <div className="flex items-center space-x-6">
                  {/* Twitter */}
                  <button className="text-white hover:text-white/70 transition-colors">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                    </svg>
                  </button>

                  {/* LinkedIn */}
                  <button className="text-white hover:text-white/70 transition-colors">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                  </button>

                  {/* Instagram */}
                  <button className="text-white hover:text-white/70 transition-colors">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987s11.987-5.367 11.987-11.987C24.014 5.367 18.647.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.323-1.297C4.198 14.895 3.708 13.744 3.708 12.447s.49-2.448 1.297-3.323c.875-.807 2.026-1.297 3.323-1.297s2.448.49 3.323 1.297c.807.875 1.297 2.026 1.297 3.323s-.49 2.448-1.297 3.323c-.875.807-2.026 1.297-3.323 1.297zm7.718-1.297c-.875.807-2.026 1.297-3.323 1.297s-2.448-.49-3.323-1.297c-.807-.875-1.297-2.026-1.297-3.323s.49-2.448 1.297-3.323c.875-.807 2.026-1.297 3.323-1.297s2.448.49 3.323 1.297c.807.875 1.297 2.026 1.297 3.323s-.49 2.448-1.297 3.323z"/>
                    </svg>
                  </button>

                  {/* Globe/Website */}
                  <button className="text-white hover:text-white/70 transition-colors">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ShaderBackground>
  )
}
