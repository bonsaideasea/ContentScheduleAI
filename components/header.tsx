"use client"

import Link from "next/link"

export default function Header() {
  return (
    <header className="relative z-20 flex items-center justify-between p-6">
      {/* Logo */}
      <div className="flex items-center">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <Link href="/" className="text-white font-medium text-lg hover:text-white/90 transition-colors">
            MarketAI
          </Link>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex items-center space-x-2">
        <Link
          href="/features"
          className="text-white/80 hover:text-white text-s font-light px-3 py-2 rounded-full hover:bg-white/10 transition-all duration-200"
        >
          Features
        </Link>
        <Link
          href="/pricing"
          className="text-white/80 hover:text-white text-s font-light px-3 py-2 rounded-full hover:bg-white/10 transition-all duration-200"
        >
          Pricing
        </Link>
        <Link
          href="/faq"
          className="text-white/80 hover:text-white text-s font-light px-3 py-2 rounded-full hover:bg-white/10 transition-all duration-200"
        >
          FAQ
        </Link>
        <Link
          href="/affiliate"
          className="text-white/80 hover:text-white text-s font-light px-3 py-2 rounded-full hover:bg-white/10 transition-all duration-200"
        >
          Affiliate
        </Link>

      </nav>

      {/* Right actions: Sign In (plain text) + Free Trial button */}
      <div className="flex items-center gap-4">
        {/* Plain text Sign In link - always visible */}
        <Link
          href="/signin"
          className="text-white text-sm font-light hover:text-white/90 px-0 py-0"
        >
          Sign In
        </Link>

        {/* Login Button Group with Arrow for Free Trial only */}
        <div id="gooey-btn" className="relative flex items-center group" style={{ filter: "url(#gooey-filter)" }}>
          <button className="absolute right-0 px-2.5 py-2 rounded-full bg-white text-black font-normal text-xs transition-all duration-300 hover:bg-white/90 cursor-pointer h-8 flex items-center justify-center -translate-x-10 group-hover:-translate-x-19 z-0">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17L17 7M17 7H7M17 7V17" />
            </svg>
          </button>
          <Link
            href="/create"
            className="px-6 py-2 rounded-full bg-white text-black font-normal text-sm transition-all duration-300 hover:bg-white/90 cursor-pointer h-8 flex items-center z-10"
          >
            Free Demo
          </Link>
        </div>
      </div>
    </header>
  )
}
