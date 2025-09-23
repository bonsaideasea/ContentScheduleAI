"use client"

import React, { useState } from "react"
import Link from "next/link"
import Header from "../../components/header"
import ShaderBackground from "@/components/shader-background"

/**
 * FAQ Page
 * Renders the Frequently Asked Questions content as requested.
 * This page is accessible at /faq. Ensure any FAQ buttons/links point here.
 */
export default function FAQPage() {
  // FAQ data derived from your previous content
  const faqs: Array<{ q: string; a: React.ReactNode }> = [
    {
      q: "What exactly does your service do?",
      a: (
        <div>
          <p className="mb-2">We help content creators streamline their social media presence by scheduling, scripting, and generating content across TikTok, YouTube, and Instagram. Our platform can:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Write scripts for your videos.</li>
            <li>Generate captions and hashtags tailored for engagement.</li>
            <li>Create short-form video drafts (ready for you to edit or post).</li>
            <li>Schedule everything so you can stay consistent without burning out.</li>
          </ul>
        </div>
      ),
    },
    {
      q: "How does it work?",
      a: (
        <div>
          <ol className="list-decimal list-inside space-y-1">
            <li>You tell us your niche, target audience, and preferred platforms.</li>
            <li>Our AI and creative team generate scripts, captions, and/or video drafts for you.</li>
            <li>You review, approve, or request edits.</li>
            <li>We help you schedule your content so it goes live at the best times for engagement.</li>
          </ol>
          <p className="mt-2">Think of it as having a content studio on autopilot.</p>
        </div>
      ),
    },
    { q: "Who owns the content you create for me?", a: <p>You do. 100%. Everything we generate—scripts, captions, videos—belongs to you once delivered.</p> },
    { q: "Can I make edits to the scripts or videos?", a: <p>Absolutely. You can edit scripts, captions, and video drafts directly in our platform before posting. We encourage customization so your unique voice shines through.</p> },
    { q: "How much does it cost?", a: <ul className="list-disc list-inside space-y-1"><li>Monthly ($30/month Individual, $100/month Agency)</li><li>Annual ($288/year Individual, $960/year Agency)</li></ul> },
    { q: "Do you offer a free trial?", a: <p>Yes! We offer a 7-day free trial so you can test the workflow before committing.</p> },
    { q: "What platforms do you support?", a: <p>Currently: TikTok, YouTube Shorts, and Instagram Reels. We’re working on expanding to LinkedIn and X (Twitter).</p> },
    { q: "How do you ensure the scripts and captions match my style?", a: <p>During onboarding, we’ll ask about your tone, niche, and audience preferences. Our system then learns your style and generates drafts tailored to your voice. You can always provide feedback to fine-tune results.</p> },
    { q: "Do you guarantee growth?", a: <div><p className="mb-2">We can’t guarantee a specific number of followers or views—social media algorithms are unpredictable. What we do guarantee is:</p><ul className="list-disc list-inside space-y-1"><li>Consistent content output.</li><li>High-quality scripts and captions tailored for engagement.</li><li>A streamlined workflow that saves you time.</li></ul><p className="mt-2">Consistency + quality = the foundation for growth.</p></div> },
    { q: "Can I cancel anytime?", a: <p>Yes, all subscriptions are month-to-month. Cancel anytime with no hidden fees.</p> },
    { q: "Do you offer refunds?", a: <p>We provide refunds within the first 14 days of your first paid plan if you’re not satisfied.</p> },
    { q: "What if I need human help?", a: <p>We have a support team (real humans!) available via chat and email. For Pro and Agency plans, we also offer one-on-one onboarding calls.</p> },
  ]

  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <ShaderBackground>
      <Header />

      <div className="relative z-10 container mx-auto px-6 py-12 max-w-5xl text-white">
        {/* Big Title */}
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-10">BEFORE YOU ASK</h1>

        {/* FAQ List */}
        <div className="space-y-[5px]">
          {faqs.map((item, idx) => {
            const isOpen = openIndex === idx
            return (
              <div key={idx} className="flex rounded-md overflow-hidden border-2 border-gray-700 bg-gray-900/50">
                {/* Left content */}
                <button
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="flex-1 text-left p-5 hover:bg-white/10 transition-colors"
                  aria-expanded={isOpen}
                >
                  <div className="text-lg md:text-xl font-extrabold tracking-wide mb-2">
                    {item.q}
                  </div>
                  {isOpen && (
                    <div className="text-white/80 text-sm md:text-base leading-relaxed">
                      {item.a}
                    </div>
                  )}
                </button>
                {/* Right action column */}
                <button
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  aria-label={isOpen ? 'Collapse' : 'Expand'}
                  className="w-16 md:w-24 bg-[#E33265] flex items-center justify-center text-2xl font-bold"
                >
                  {isOpen ? '×' : '+'}
                </button>
              </div>
            )
          })}
        </div>
      </div>
    </ShaderBackground>
  )
}


