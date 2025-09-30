"use client"

import { ReactNode } from "react"
import SettingsSection from "./Settings_CaiDat"
import CalendarSection from "./Calendar_Lich"
import DraftsSection from "./Drafts_BanNhap"
import PublishedSection from "./Published_BaiDaDang"
import FailedSection from "./Failed_BaiDangThatBai"
import VideosSection from "./Videos"
import ApiDashboardSection from "./ApiDashboard"
import CreateSection from "./Create_ThaoBaiViet"

// Import types from other components
interface Post {
  id: number
  type: string
}

interface DraftPost {
  id: number
  platform: string
  platformIcon?: string
  content: string
  time: string
  status: string
  media?: string[]
}

interface PublishedPost {
  id: number
  platform: string
  content: string
  time: string
  status: string
  url: string
  profileName?: string
  profilePic?: string
  engagement?: {
    likes: number
    comments: number
    shares: number
  }
}

interface FailedPost {
  id: number
  platform: string
  content: string
  date: string
  time: string
  error?: string
  profileName?: string
  profilePic?: string
  url?: string
}

interface VideoProject {
  id: string
  title: string
  thumbnail: string
  duration: string
  createdAt: string
  status: 'processing' | 'completed' | 'failed'
}

interface CalendarEvent {
  platform: string
  time: string
  status: string
  noteType: 'green' | 'yellow' | 'red'
}

interface ApiStats {
  apiCalls: number
  successRate: number
  rateLimit: {
    used: number
    total: number
    resetTime: string
  }
}

interface ApiKey {
  id: string
  name: string
  type: 'production' | 'development'
  lastUsed: string
  isActive: boolean
}


interface SectionsManagerProps {
  activeSection: string
  // Data props
  posts: Post[]
  selectedPostId: number
  postContents: Record<number, string>
  draftPosts: DraftPost[]
  publishedPosts: PublishedPost[]
  failedPosts: FailedPost[]
  videoProjects: VideoProject[]
  calendarEvents: Record<string, CalendarEvent[]>
  apiStats: ApiStats
  apiKeys: ApiKey[]
  // Event handlers
  onPostSelect: (id: number) => void
  onPostCreate: (type: string) => void
  onPostDelete: (id: number) => void
  onPostContentChange: (id: number, content: string) => void
  onClonePost: (postId: number) => void
  onSaveDraft: (postId: number) => void
  onMediaUpload: (files: File[]) => void
  onMediaRemove: (mediaId: string) => void
  onPublish: (postId: number) => void
  onEditDraft: (post: DraftPost) => void
  onDeleteDraft: (id: number) => void
  onPublishDraft: (id: number) => void
  onViewPost: (url: string) => void
  onRetryPost: (id: number) => void
  onDeletePost: (id: number) => void
  onVideoUpload: () => void
  onVideoEdit: (projectId: string) => void
  onVideoDelete: (projectId: string) => void
  onEventAdd: (year: number, month: number, day: number, platform: string) => void
  onClearAll: () => void
  onRegenerateKey: (keyId: string) => void
  onCreateKey: () => void
}

/**
 * Main sections manager component that renders the appropriate section based on activeSection
 * Centralizes all section components and their props
 */
export default function SectionsManager(props: SectionsManagerProps) {
  const { activeSection } = props

  switch (activeSection) {
    case "settings":
      return <SettingsSection />
      
    case "calendar":
      return (
        <CalendarSection 
          calendarEvents={props.calendarEvents}
          onEventAdd={props.onEventAdd}
          onClearAll={props.onClearAll}
        />
      )
      
    case "drafts":
      return (
        <DraftsSection 
          draftPosts={props.draftPosts}
          onEditDraft={props.onEditDraft}
          onDeleteDraft={props.onDeleteDraft}
          onPublishDraft={props.onPublishDraft}
        />
      )
      
    case "published":
      return (
        <PublishedSection 
          publishedPosts={props.publishedPosts}
          onViewPost={props.onViewPost}
          onRetryPost={props.onRetryPost}
          onDeletePost={props.onDeletePost}
        />
      )
      
    case "failed":
      return (
        <FailedSection 
          failedPosts={props.failedPosts}
          onRetryPost={props.onRetryPost}
          onDeletePost={props.onDeletePost}
          onViewPost={props.onViewPost}
        />
      )
      
    case "videos":
      return (
        <VideosSection 
          videoProjects={props.videoProjects}
          onVideoUpload={props.onVideoUpload}
          onVideoEdit={props.onVideoEdit}
          onVideoDelete={props.onVideoDelete}
        />
      )
      
    case "api":
      return (
        <ApiDashboardSection 
          stats={props.apiStats}
          apiKeys={props.apiKeys}
          onRegenerateKey={props.onRegenerateKey}
          onCreateKey={props.onCreateKey}
        />
      )
      
    case "create":
    default:
      return (
        <CreateSection 
          posts={props.posts}
          selectedPostId={props.selectedPostId}
          postContents={props.postContents}
          onPostSelect={props.onPostSelect}
          onPostCreate={props.onPostCreate}
          onPostDelete={props.onPostDelete}
          onPostContentChange={props.onPostContentChange}
          onClonePost={props.onClonePost}
          onSaveDraft={props.onSaveDraft}
          onMediaUpload={props.onMediaUpload}
          onMediaRemove={props.onMediaRemove}
          onPublish={props.onPublish}
        />
      )
  }
}
