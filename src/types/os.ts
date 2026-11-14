export type AppId = 'iscord' | 'browser' | 'terminal' | 'store' | 'notes' | 'trash' | 'botbuilder' | 'mail' | 'bank' | 'achievements' | 'retrogame' | 'stam' | 'snake98' | 'minesweeper' | 'appcenter' | 'rdp' | 'fooddelivery'

export interface WindowState {
  id: AppId
  title: string
  iconName: string
  isMinimized: boolean
  isMaximized: boolean
  position: { x: number; y: number }
  size: { width: number; height: number }
  zIndex: number
  minSize?: { width: number; height: number }
}

export interface DesktopShortcut {
  id: AppId
  title: string
  iconName: string
  badge?: number | string
}

export type DesktopWallpaper = 'default' | 'matrix' | 'synthwave' | 'win98' | 'cyberpunk'

export interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  isUnlocked: boolean
  unlockedAt?: string
}
