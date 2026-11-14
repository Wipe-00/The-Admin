import React from 'react'
import { 
  MessageSquare, 
  Globe, 
  Terminal, 
  ShoppingBag, 
  FileText, 
  Trash2,
  Bot,
  Mail,
  Landmark,
  Trophy,
  Gamepad2,
  DownloadCloud,
  Server,
  Utensils
} from 'lucide-react'
import type { DesktopShortcut } from '../../types/os'

interface DesktopIconProps {
  shortcut: DesktopShortcut
  isSelected: boolean
  onSelect: () => void
  onOpen: () => void
}

const iconMap: Record<string, React.ReactNode> = {
  appcenter: <DownloadCloud className="w-9 h-9 text-sky-400" />,
  fooddelivery: <Utensils className="w-9 h-9 text-orange-400" />,
  rdp: <Server className="w-9 h-9 text-purple-400" />,
  iscord: <MessageSquare className="w-9 h-9 text-[#5865F2]" />,
  browser: <Globe className="w-9 h-9 text-sky-400" />,
  terminal: <Terminal className="w-9 h-9 text-emerald-400" />,
  store: <ShoppingBag className="w-9 h-9 text-amber-400" />,
  botbuilder: <Bot className="w-9 h-9 text-sky-400" />,
  mail: <Mail className="w-9 h-9 text-amber-400" />,
  bank: <Landmark className="w-9 h-9 text-emerald-400" />,
  achievements: <Trophy className="w-9 h-9 text-amber-400" />,
  retrogame: <Gamepad2 className="w-9 h-9 text-pink-400" />,
  stam: <Gamepad2 className="w-9 h-9 text-emerald-400" />,
  snake98: <span className="text-3xl">🐍</span>,
  minesweeper: <span className="text-3xl">💣</span>,
  notes: <FileText className="w-9 h-9 text-zinc-300" />,
  trash: <Trash2 className="w-9 h-9 text-zinc-400" />
}

export const DesktopIcon: React.FC<DesktopIconProps> = ({
  shortcut,
  isSelected,
  onSelect,
  onOpen
}) => {
  return (
    <button
      onClick={(e) => {
        e.stopPropagation()
        onSelect()
      }}
      onDoubleClick={(e) => {
        e.stopPropagation()
        onOpen()
      }}
      className={`group relative flex flex-col items-center justify-center w-28 h-28 p-2 rounded-xl transition-all text-center cursor-pointer outline-none ${
        isSelected
          ? 'bg-white/15 ring-1 ring-white/30 scale-105'
          : 'hover:bg-white/10 hover:scale-105'
      }`}
    >
      <div className="relative mb-1.5 flex items-center justify-center w-16 h-16 rounded-2xl bg-[#181a22]/95 border border-[#2e3240] shadow-lg group-hover:border-sky-500/50 transition-colors">
        {iconMap[shortcut.id] || <FileText className="w-9 h-9 text-zinc-400" />}
        {shortcut.badge !== undefined && (
          <span className="absolute -top-1.5 -right-1.5 px-2 py-0.5 text-[11px] font-extrabold bg-[#f23f43] text-white rounded-full leading-none shadow-md">
            {shortcut.badge}
          </span>
        )}
      </div>
      <span className="text-xs text-zinc-100 line-clamp-2 px-1 font-semibold tracking-tight drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]">
        {shortcut.title}
      </span>
    </button>
  )
}
