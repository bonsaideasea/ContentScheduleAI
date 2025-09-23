"use client"

import { useMemo, useState } from "react"
import { useSearchParams } from "next/navigation"
import Header from "@/components/header"
import ShaderBackground from "@/components/shader-background"

export default function CheckoutPage() {
  const params = useSearchParams()
  const plan = params.get("plan") || "individual"
  const period = params.get("period") || "monthly"

  const price = useMemo(() => {
    if (plan === "individual") return period === "annual" ? 288 : 30
    if (plan === "agency") return period === "annual" ? 960 : 100
    return 0
  }, [plan, period])

  const [method, setMethod] = useState<"card" | "paypal">("card")

  return (
    <ShaderBackground>
      <Header />
      <div className="relative z-10 container mx-auto px-6 py-10 text-white grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Left: Billing summary */}
        <div className="bg-gray-900/50 border border-white/10 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-6">Billing summary</h2>
          <div className="text-4xl font-bold mb-2">${price.toFixed(0)}<span className="text-base font-normal ml-2">Per {period === 'annual' ? 'Year' : 'Month'}</span></div>
          <div className="border-t border-white/10 my-6"></div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-white/70">Subtotal</span>
            <span className="text-white/90">${price.toFixed(2)}</span>
          </div>
          <button className="text-sm text-[#7aa2ff] hover:underline">Add promotion code</button>
          <div className="border-t border-white/10 my-6"></div>
          <div className="flex items-center justify-between">
            <span className="text-white/90">Total due today</span>
            <span className="text-white font-semibold">${price.toFixed(2)}</span>
          </div>
        </div>

        {/* Right: Payment details */}
        <div className="bg-gray-900/50 border border-white/10 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-6">Payment details</h2>
          <div className="flex gap-3 mb-6">
            <button
              onClick={() => setMethod("card")}
              className={`px-4 py-2 rounded border  bg-white/5 transition-colors ${
                method === "card" ? "border-[#E33265] ring-1 ring-[#E33265]" : "border-white/20 hover:border-white/40"
              }`}
            >
              Card
            </button>
            <button
              onClick={() => setMethod("paypal")}
              className={`px-4 py-2 rounded border  bg-white/5 transition-colors ${
                method === "paypal" ? "border-[#E33265] ring-1 ring-[#E33265]" : "border-white/20 hover:border-white/40"
              }`}
            >
              PayPal
            </button>
          </div>

          <div className="space-y-4">
            {method === "card" && (
              <>
                <div>
                  <label className="block text-sm text-white/70 mb-1">Tên trên thẻ</label>
                  <input className="w-full bg-black/30 border border-white/10 rounded px-3 py-2 outline-none focus:ring-2 focus:ring-[#E33265]" placeholder="Nguyễn Văn A" />
                </div>
                <div className="grid grid-cols-[2fr_1fr] gap-3">
                  <input className="bg-black/30 border border-white/10 rounded px-3 py-2 outline-none focus:ring-2 focus:ring-[#E33265]" placeholder="4135 3456 6578 3345" />
                  <div className="grid grid-cols-2 gap-3">
                    <input className="bg-black/30 border border-white/10 rounded px-3 py-2 outline-none focus:ring-2 focus:ring-[#E33265]" placeholder="12/24" />
                    <input className="bg-black/30 border border-white/10 rounded px-3 py-2 outline-none focus:ring-2 focus:ring-[#E33265]" placeholder="CVV" />
                  </div>
                </div>
              </>
            )}

            {method === "paypal" && (
              <p className="text-white/80">Bạn sẽ được chuyển hướng đến PayPal để hoàn tất thanh toán.</p>
            )}

            <div>
              <label className="block text-sm text-white/70 mb-1">Quốc gia</label>
              <select className="w-full bg-black/30 border border-white/10 rounded px-3 py-2 outline-none focus:ring-2 focus:ring-[#E33265]" defaultValue="VN">
                <option value="VN">Việt Nam</option>
              </select>
            </div>

            {/* Vietnamese address fields */}
            <div>
              <label className="block text-sm text-white/70 mb-1">Địa chỉ (Số nhà, tên đường)</label>
              <input className="w-full bg-black/30 border border-white/10 rounded px-3 py-2 outline-none focus:ring-2 focus:ring-[#E33265]" placeholder="Số 10, Đường Lê Lợi" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="block text-sm text-white/70 mb-1">Tỉnh/Thành phố</label>
                <input className="w-full bg-black/30 border border-white/10 rounded px-3 py-2 outline-none focus:ring-2 focus:ring-[#E33265]" placeholder="TP. Hồ Chí Minh" />
              </div>
              <div>
                <label className="block text-sm text-white/70 mb-1">Quận/Huyện</label>
                <input className="w-full bg-black/30 border border-white/10 rounded px-3 py-2 outline-none focus:ring-2 focus:ring-[#E33265]" placeholder="Quận 1" />
              </div>
              <div>
                <label className="block text-sm text-white/70 mb-1">Phường/Xã</label>
                <input className="w-full bg-black/30 border border-white/10 rounded px-3 py-2 outline-none focus:ring-2 focus:ring-[#E33265]" placeholder="Phường Bến Nghé" />
              </div>
            </div>
            <div>
              <label className="block text-sm text-white/70 mb-1">Mã bưu chính (nếu có)</label>
              <input className="w-full bg-black/30 border border-white/10 rounded px-3 py-2 outline-none focus:ring-2 focus:ring-[#E33265]" placeholder="700000" />
            </div>

            <p className="text-xs text-white/60">
              Bằng cách nhấn đăng ký, bạn đồng ý với Điều khoản sử dụng và Chính sách bảo mật. Gói sẽ tự động gia hạn theo chu kỳ {period === 'annual' ? 'năm' : 'tháng'}.
            </p>
            <button className="w-full bg-[#E33265] hover:bg-[#c52b57] text-white px-6 py-3 rounded">Đăng ký</button>
          </div>
        </div>
      </div>
    </ShaderBackground>
  )
}


