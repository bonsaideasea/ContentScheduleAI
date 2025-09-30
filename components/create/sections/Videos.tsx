"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { SearchIcon, PlayIcon, ScissorsIcon, FilmIcon } from "lucide-react"

interface VideoProject {
  id: string
  title: string
  thumbnail: string
  duration: string
  createdAt: string
  status: 'processing' | 'completed' | 'failed'
}

interface VideosSectionProps {
  videoProjects: VideoProject[]
  onVideoUpload: () => void
  onVideoEdit: (projectId: string) => void
  onVideoDelete: (projectId: string) => void
}

/**
 * Videos section component for managing video projects
 * Displays video creation tools and project management interface
 */
export default function VideosSection({ 
  videoProjects, 
  onVideoUpload, 
  onVideoEdit, 
  onVideoDelete 
}: VideosSectionProps) {
  const [searchTerm, setSearchTerm] = useState("")

  // Filter projects based on search term
  const filteredProjects = videoProjects.filter(project =>
    project.title.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="w-full max-w-none mx-4 mt-4">
      {/* Quick start section */}
      <h2 className="text-lg font-semibold mb-3">Bắt đầu nhanh</h2>

      {/* Feature tiles */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
        <Card 
          className="bg-[#180F2E] border-white/10 p-4 flex items-center gap-3 hover:bg-[#EA638A] hover:border-[#E33265] transition-all duration-200 cursor-pointer"
          onClick={onVideoUpload}
        >
          <div className="w-8 h-8 rounded-lg bg-orange-500/10 text-orange-300 flex items-center justify-center text-sm">
            cc
          </div>
          <div>
            <div className="text-m font-medium text-white">Tạo phụ đề</div>
            <div className="text-sm text-white mt-[10px]">Thêm phụ đề và b-rolls</div>
          </div>
        </Card>
        
        <Card 
          className="bg-[#180F2E] border-white/10 p-4 flex items-center gap-3 hover:bg-[#EA638A] hover:border-[#E33265] transition-all duration-200 cursor-pointer"
          onClick={onVideoUpload}
        >
          <div className="w-8 h-8 rounded-lg bg-orange-500/10 text-orange-300 flex items-center justify-center text-sm">
            ✂
          </div>
          <div>
            <div className="text-m font-medium text-white">Cắt ghép video</div>
            <div className="text-sm text-white mt-[10px]">Kết hợp nhiều clip</div>
          </div>
        </Card>
        
        <Card 
          className="bg-[#180F2E] border-white/10 p-4 flex items-center gap-3 hover:bg-[#EA638A] hover:border-[#E33265] transition-all duration-200 cursor-pointer"
          onClick={onVideoUpload}
        >
          <div className="w-8 h-8 rounded-lg bg-orange-500/10 text-orange-300 flex items-center justify-center text-sm">
            🎞
          </div>
          <div>
            <div className="text-m font-medium text-white">Extract Video Clips</div>
            <div className="text-sm text-white mt-[10px]">Trích clip từ video dài</div>
          </div>
        </Card>
      </div>

      {/* Action chips row */}
      <div className="flex justify-center mb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-2xl">
          <Card 
            className="bg-[#180F2E] border-white/10 p-3 flex items-center gap-2 hover:bg-[#EA638A] hover:border-[#E33265] transition-all duration-200 cursor-pointer"
            onClick={onVideoUpload}
          >
            <div className="w-6 h-6 rounded-md bg-orange-500/10 text-orange-300 flex items-center justify-center text-xs">
              ◎
            </div>
            <div className="text-sm text-white">Tạo B-rolls</div>
          </Card>
          
          <Card 
            className="bg-[#180F2E] border-white/10 p-3 flex items-center gap-2 hover:bg-[#EA638A] hover:border-[#E33265] transition-all duration-200 cursor-pointer"
            onClick={onVideoUpload}
          >
            <div className="w-6 h-6 rounded-md bg-orange-500/10 text-orange-300 flex items-center justify-center text-xs">
              译
            </div>
            <div className="text-sm text-white">Dịch phụ đề</div>
          </Card>
        </div>
      </div>

      {/* Projects header with search */}
      <div className="flex items-center justify-between mb-3">
        <div className="text-sm">{videoProjects.length} Dự án</div>
        <div className="relative w-60">
          <SearchIcon className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
          <Input 
            placeholder="Tìm kiếm..." 
            className="pl-9 bg-gray-900/50 border-white/10 h-9 text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Project list */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredProjects.map((project) => (
          <Card 
            key={project.id}
            className="bg-[#180F2E] border-white/10 p-0 overflow-hidden hover:bg-[#EA638A] hover:border-[#E33265] transition-all duration-200 cursor-pointer"
            onClick={() => onVideoEdit(project.id)}
          >
            <div className="relative w-full h-32 bg-gray-800">
              {project.thumbnail ? (
                <img 
                  src={project.thumbnail} 
                  alt={project.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <PlayIcon className="w-8 h-8 text-gray-400" />
                </div>
              )}
              
              {/* Status indicator */}
              <div className="absolute top-2 right-2">
                <div className={`w-2 h-2 rounded-full ${
                  project.status === 'completed' ? 'bg-green-500' :
                  project.status === 'processing' ? 'bg-yellow-500' :
                  'bg-red-500'
                }`} />
              </div>
              
              {/* Duration */}
              <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                {project.duration}
              </div>
            </div>
            
            <div className="p-3">
              <h3 className="text-sm font-medium text-white truncate mb-1">
                {project.title}
              </h3>
              <p className="text-xs text-gray-400">
                {new Date(project.createdAt).toLocaleDateString('vi-VN')}
              </p>
            </div>
          </Card>
        ))}
        
        {/* Upload new video card */}
        <Card 
          className="bg-[#180F2E] border-white/10 p-0 overflow-hidden hover:bg-[#EA638A] hover:border-[#E33265] transition-all duration-200 cursor-pointer border-dashed"
          onClick={onVideoUpload}
        >
          <div className="w-full h-32 bg-gray-800/50 flex items-center justify-center">
            <div className="text-center">
              <FilmIcon className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-400">Tải video lên</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
