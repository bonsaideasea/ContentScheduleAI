"use client"

import Header from "@/components/header"
import ShaderBackground from "@/components/shader-background"

export default function FeaturesPage() {
  return (
    <ShaderBackground>
      <Header />
      <div className="relative z-10 container mx-auto px-6 py-16 text-white">
        <h1 className="text-4xl md:text-5xl font-bold mb-8">Features</h1>
        <p className="text-white/80">Coming soon. We will showcase key features here.</p>
      </div>
    </ShaderBackground>
  )
}



