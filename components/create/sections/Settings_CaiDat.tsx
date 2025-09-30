"use client"

/**
 * Settings section component for social media account connections
 * Displays a grid of social media platforms with connection status
 */
export default function SettingsSection() {
  // Social media platforms configuration
  const socialPlatforms = [
    { name: 'Twitter (X)', icon: '/x.png', url: 'https://twitter.com/login', connected: true },
    { name: 'LinkedIn', icon: '/link.svg', url: 'https://www.linkedin.com/login', connected: false },
    { name: 'Facebook', icon: '/fb.svg', url: 'https://www.facebook.com/login', connected: false },
    { name: 'TikTok', icon: '/tiktok.png', url: 'https://www.tiktok.com/login', connected: false },
    { name: 'Instagram', icon: '/instagram.png', url: 'https://www.instagram.com/accounts/login/', connected: false },
    { name: 'Threads', icon: '/threads.png', url: 'https://www.threads.net/login', connected: false },
    { name: 'Bluesky', icon: '/bluesky.png', url: 'https://bsky.app', connected: false },
    { name: 'YouTube', icon: '/ytube.png', url: 'https://accounts.google.com/signin/v2/identifier', connected: false },
  ]

  return (
    <div className="w-full max-w-none mx-4 mt-4">
      <h2 className="text-2xl font-bold mb-6">Kết nối mạng xã hội và đăng nhập</h2>
      <p className="text-white/70 mb-6">Kết nối với mạng xã hội và đăng nhập.</p>
      
      <div className="grid sm:grid-cols-2 gap-4">
        {socialPlatforms.map((platform, idx) => (
          <button
            key={idx}
            onClick={() => window.open(platform.url, '_blank')}
            className="flex items-center justify-between px-4 py-3 rounded-md hover:bg-white/5 transition-colors"
          >
            <div className="flex items-center gap-3">
              <img 
                src={platform.icon} 
                alt={platform.name} 
                className={`w-[36px] h-[36px] ${
                  ['Twitter (X)','Threads','TikTok'].includes(platform.name) 
                    ? 'filter brightness-0 invert' 
                    : ''
                } cursor-pointer hover:opacity-80 transition-opacity`} 
              />
              <span className="text-[#F5F5F7] font-medium">{platform.name}</span>
            </div>
            <div className={`w-3 h-3 rounded-full ${
              platform.connected ? 'bg-green-500' : 'bg-red-500'
            }`}></div>
          </button>
        ))}
      </div>
    </div>
  )
}
