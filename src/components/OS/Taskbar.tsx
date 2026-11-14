import React, { useState, useEffect } from 'react'
import { 
  Terminal, 
  Globe, 
  MessageSquare, 
  ShoppingBag, 
  FileText, 
  Wifi, 
  Volume2, 
  ShieldCheck,
  Activity,
  Bot,
  Moon,
  Mail,
  Landmark,
  Trophy,
  Gamepad2,
  Maximize2,
  Minimize2,
  DownloadCloud,
  Server,
  Utensils
} from 'lucide-react'
import type { WindowState, AppId } from '../../types/os'

interface TaskbarProps {
  windows: WindowState[]
  activeWindowId: AppId | null
  onToggleWindow: (id: AppId) => void
  onToggleStartMenu: () => void
  isStartMenuOpen: boolean
  sanity: number
  onEndShift?: () => void
  isFullscreen?: boolean
  onToggleFullscreen?: () => void
  gameTimeString?: string
  currentDay?: number
  canEndShift?: boolean
}

const appIconMap: Record<string, React.ReactNode> = {
  appcenter: <DownloadCloud className="w-4 h-4 text-sky-400" />,
  fooddelivery: <Utensils className="w-4 h-4 text-orange-400" />,
  rdp: <Server className="w-4 h-4 text-purple-400" />,
  iscord: <MessageSquare className="w-4 h-4 text-[#5865F2]" />,
  browser: <Globe className="w-4 h-4 text-sky-400" />,
  terminal: <Terminal className="w-4 h-4 text-emerald-400" />,
  store: <ShoppingBag className="w-4 h-4 text-amber-400" />,
  botbuilder: <Bot className="w-4 h-4 text-sky-400" />,
  mail: <Mail className="w-4 h-4 text-amber-400" />,
  bank: <Landmark className="w-4 h-4 text-emerald-400" />,
  achievements: <Trophy className="w-4 h-4 text-amber-400" />,
  retrogame: <Gamepad2 className="w-4 h-4 text-pink-400" />,
  stam: <Gamepad2 className="w-4 h-4 text-emerald-400" />,
  snake98: <span className="text-xs">🐍</span>,
  minesweeper: <span className="text-xs">💣</span>,
  notes: <FileText className="w-4 h-4 text-zinc-300" />
}

export const Taskbar: React.FC<TaskbarProps> = ({
  windows,
  activeWindowId,
  onToggleWindow,
  onToggleStartMenu,
  isStartMenuOpen,
  sanity,
  onEndShift,
  isFullscreen,
  onToggleFullscreen,
  gameTimeString,
  currentDay,
  canEndShift
}) => {
  const [timeStr, setTimeStr] = useState('')
  const [dateStr, setDateStr] = useState('')

  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      setTimeStr(
        gameTimeString || now.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
      )
      setDateStr(
        currentDay ? `Gün ${currentDay}` : now.toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric' })
      )
    }
    updateTime()
    const timer = setInterval(updateTime, 1000)
    return () => clearInterval(timer)
  }, [gameTimeString, currentDay])

  return (
    <footer className="absolute bottom-0 left-0 right-0 h-[42px] bg-[#111215]/95 backdrop-blur-md border-t border-[#23262e] flex items-center justify-between px-2 z-[9999] select-none">
      {/* Left: Start button & Open windows */}
      <div className="flex items-center space-x-1.5 h-full py-1">
        {/* Start Button */}
        <button
          onClick={onToggleStartMenu}
          className={`flex items-center gap-2 h-full px-3 rounded text-xs font-semibold tracking-wide transition-colors ${
            isStartMenuOpen
              ? 'bg-[#282b33] text-white border border-[#3b3f4b]'
              : 'hover:bg-white/5 text-zinc-200 border border-transparent'
          }`}
        >
          <div className="w-4 h-4 rounded bg-[#5865F2] flex items-center justify-center text-[10px] text-white font-black">
            M
          </div>
          <span>ModOS</span>
        </button>

        <div className="w-[1px] h-5 bg-[#262932] mx-1" />

        {/* Running Window Tabs */}
        <div className="flex items-center space-x-1 h-full">
          {windows.map((win) => {
            const isActive = activeWindowId === win.id && !win.isMinimized
            return (
              <button
                key={win.id}
                onClick={() => onToggleWindow(win.id)}
                className={`group relative flex items-center gap-2 h-full px-3 rounded text-xs transition-all max-w-[170px] truncate ${
                  isActive
                    ? 'bg-[#22252c] text-white border border-[#363a45]'
                    : win.isMinimized
                    ? 'hover:bg-white/5 text-zinc-400 opacity-70'
                    : 'hover:bg-white/5 text-zinc-300'
                }`}
              >
                {appIconMap[win.id]}
                <span className="truncate font-medium">{win.title}</span>
                {/* Active indicator bar */}
                <div
                  className={`absolute bottom-0 left-2 right-2 h-[2px] rounded-full transition-colors ${
                    isActive ? 'bg-[#5865F2]' : 'bg-transparent group-hover:bg-zinc-600'
                  }`}
                />
              </button>
            )
          })}
        </div>
      </div>

      {/* Right: System Tray */}
      <div className="flex items-center space-x-3 text-zinc-300 text-xs px-2">
        {/* End Shift Button */}
        {onEndShift && (
          <button
            onClick={() => {
              if (canEndShift === false) {
                alert(`Vardiyanız akşam saat 20:00'den önce bitirilemez! Görevinizin başında kalmalısınız.\n(Şu anki saat: ${gameTimeString || '12:00'})`)
                return
              }
              onEndShift()
            }}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded transition-colors text-[11px] font-bold cursor-pointer ${
              canEndShift === false
                ? 'bg-zinc-800/80 text-zinc-500 border border-zinc-700/50'
                : 'bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/20 animate-pulse'
            }`}
            title={canEndShift === false ? `Vardiya akşam saat 20:00'den önce bitirilemez! (Şu an: ${gameTimeString})` : "Günü Bitir ve Vardiya Raporunu Aç"}
          >
            <Moon className="w-3.5 h-3.5" />
            <span>Vardiyayı Bitir {canEndShift === false ? '(20:00 Bekleniyor)' : ''}</span>
          </button>
        )}

        {/* Sanity / Akıl Sağlığı Barı */}
        <div 
          className="flex items-center gap-1.5 px-2 py-1 rounded bg-[#181a20] border border-[#262932]"
          title={`Akıl Sağlığı (Sanity): %${sanity}`}
        >
          <Activity className={`w-3.5 h-3.5 ${sanity > 50 ? 'text-emerald-400' : sanity > 25 ? 'text-amber-400' : 'text-red-400 animate-pulse'}`} />
          <span className="font-mono text-[11px] font-medium">%{sanity}</span>
        </div>

        {/* Security / Overlord Status */}
        <div 
          className="flex items-center gap-1 text-zinc-400"
          title="Root Erişimi: Aktif (Gözetmen Modu)"
        >
          <ShieldCheck className="w-3.5 h-3.5 text-sky-400" />
        </div>

        {/* Network & Audio & Fullscreen */}
        <div className="flex items-center space-x-2 text-zinc-400">
          {onToggleFullscreen && (
            <button
              onClick={onToggleFullscreen}
              className="p-1 rounded hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
              title={isFullscreen ? "Tam Ekrandan Çık (F11)" : "Tam Ekran Yap (F11)"}
            >
              {isFullscreen ? <Minimize2 className="w-3.5 h-3.5 text-sky-400" /> : <Maximize2 className="w-3.5 h-3.5" />}
            </button>
          )}
          <span title="Bağlantı: 1 Gbps Fiber (12ms)">
            <Wifi className="w-3.5 h-3.5" />
          </span>
          <span title="Ses: %80">
            <Volume2 className="w-3.5 h-3.5" />
          </span>
        </div>

        {/* Real-time Clock */}
        <div className="flex flex-col items-end leading-tight pl-2 border-l border-[#262932]">
          <span className="font-mono text-xs font-semibold text-zinc-200">{timeStr}</span>
          <span className="text-[10px] text-zinc-500 font-mono">{dateStr}</span>
        </div>
      </div>
    </footer>
  )
}
