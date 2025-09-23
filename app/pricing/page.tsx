"use client"

import { useState } from "react"
import { Card } from "../../components/ui/card"
import { Button } from "../../components/ui/button"
import Header from "../../components/header"
import ShaderBackground from "@/components/shader-background"
import Link from "next/link"

export default function PricingPage() {
  const [selectedPlan, setSelectedPlan] = useState('Individual')
  const [isAnnual, setIsAnnual] = useState(false)

  const handleCardClick = (plan: string) => {
    setSelectedPlan(plan)
    console.log(`Clicked on ${plan} plan`)
  }

  return (
    <ShaderBackground>
      <Header />
      <div className="relative z-10 container mx-auto px-6 pt-[4px] pb-16 text-white">
        {/* Header & Toggle */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-4xl font-bold mb-4">Flexible Plans to Fuel your Ambition</h1>
          {/* Toggle */}
          <div className="flex items-center justify-center gap-4">
            <span className={`text-lg ${!isAnnual ? 'text-white' : 'text-gray-400'}`}>Monthly</span>
            <button
              aria-label="Toggle billing period"
              onClick={() => setIsAnnual(v => !v)}
              className={`relative w-16 h-8 rounded-full transition-colors ${isAnnual ? 'bg-purple-600' : 'bg-[#E33265]'}`}
            >
              <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-transform ${isAnnual ? 'translate-x-9' : 'translate-x-1'}`} />
            </button>
            <span className={`text-lg ${isAnnual ? 'text-white' : 'text-gray-400'}`}>Yearly (Save 20%)</span>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Personal Plan */}
          <Card 
            className={`relative bg-gray-900/50 border-2 p-8 cursor-pointer transition-all duration-300 hover:scale-105 ${
              selectedPlan === 'Personal' 
                ? 'border-purple-500 hover:border-purple-400' 
                : 'border-gray-700 hover:border-gray-600'
            }`}
            onClick={() => handleCardClick('Personal')}
          >
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <div className="w-8 h-8 bg-gray-400 rounded-full"></div>
              </div>
              
              <h3 className="text-2xl font-bold mb-4 text-white">Personal</h3>
              <p className="text-gray-400 mb-6">
                For curious content creators who would like to try our services.
              </p>
              
              <div className="mb-8">
                <span className="text-4xl font-bold text-white">Free</span>
              </div>
              
              <div className="mb-8">
                <span className="text-gray-300">3 credits</span>
              </div>
              
              <Button className={`w-full text-white py-3 ${
                selectedPlan === 'Personal' 
                  ? 'bg-purple-600 hover:bg-purple-700' 
                  : 'bg-gray-700 hover:bg-gray-600'
              }`}>
                Try Now
              </Button>
            </div>
          </Card>

          {/* Individual Plan */}
          <Card 
            className={`relative bg-gray-900/50 border-2 p-8 cursor-pointer transition-all duration-300 hover:scale-105 ${
              selectedPlan === 'Individual' 
                ? 'border-purple-500 hover:border-purple-400' 
                : 'border-gray-700 hover:border-gray-600'
            }`}
            onClick={() => handleCardClick('Individual')}
          >
            
            
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-600 rounded-lg flex items-center justify-center mx-auto mb-6">
                <div className="w-8 h-8 bg-white rounded"></div>
              </div>
              
              <h3 className="text-2xl font-bold mb-4 text-white">Individual</h3>
              <p className="text-gray-400 mb-6">
                For solo creators who operate by themselves.
              </p>
              
              <div className="mb-2">
                <span className="text-4xl font-bold text-white">{isAnnual ? '$288' : '$30'}</span>
                <span className="text-white"> {isAnnual ? '/year' : '/month'}</span>
              </div>
              
              <div className="mb-8">
                <span className="text-gray-300">300 credits</span>
              </div>
              
              <Link
                href={{
                  pathname: "/checkout",
                  query: { plan: "individual", period: isAnnual ? "annual" : "monthly" }
                }}
                className={`block text-center w-full text-white py-3 mb-4 rounded ${
                  selectedPlan === 'Individual' 
                    ? 'bg-purple-600 hover:bg-purple-700' 
                    : 'bg-gray-700 hover:bg-gray-600'
                }`}
              >
                Subscribe Now
              </Link>
              
              <div className="flex items-center justify-center gap-2 text-sm text-gray-400">
                <span>🛡️</span>
                <span>30-day money-back guarantee</span>
              </div>
            </div>
          </Card>

          {/* Agency Plan */}
          <Card 
            className={`relative bg-gray-900/50 border-2 p-8 cursor-pointer transition-all duration-300 hover:scale-105 ${
              selectedPlan === 'Agency' 
                ? 'border-purple-500 hover:border-purple-400' 
                : 'border-gray-700 hover:border-gray-600'
            }`}
            onClick={() => handleCardClick('Agency')}
          >
            
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center mx-auto mb-6 transform rotate-45">
                <div className="w-8 h-8 bg-white rounded transform -rotate-45"></div>
              </div>
              
              <h3 className="text-2xl font-bold mb-4 text-white">Agency</h3>
              <p className="text-gray-400 mb-6">
                For agencies or bigger teams producing content for businesses.
              </p>
              
              <div className="mb-2">
                <span className="text-4xl font-bold text-white">{isAnnual ? '$960' : '$100'}</span>
                <span className="text-white"> {isAnnual ? '/year' : '/month'}</span>
              </div>
              
              <div className="mb-8">
                <span className="text-gray-300">Covers 2000 credits/year</span>
              </div>
              
              <Link
                href={{
                  pathname: "/checkout",
                  query: { plan: "agency", period: isAnnual ? "annual" : "monthly" }
                }}
                className={`block text-center w-full text-white py-3 mb-4 rounded ${
                  selectedPlan === 'Agency' 
                    ? 'bg-purple-600 hover:bg-purple-700' 
                    : 'bg-gray-700 hover:bg-gray-600'
                }`}
              >
                Subscribe Now
              </Link>
              
              <div className="flex items-center justify-center gap-2 text-sm text-gray-400">
                <span>🛡️</span>
                <span>30-day money-back guarantee</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </ShaderBackground>
  )
}
