import React, { useState } from 'react'
import { ShieldAlert, Zap, Check, Minus } from 'lucide-react'
import { useGame } from '../../context/GameContext'

export const RaidAlertBanner: React.FC = () => {
  const { 
    isRaidActive, 
    isSlowModeActive, 
    toggleSlowMode, 
    activeRaiders, 
    totalRaidBotsCount, 
    bannedRaidersCount 
  } = useGame()

  const [isMinimized, setIsMinimized] = useState(false)

  if (!isRaidActive) return null

  const remaining = activeRaiders.length
  const total = totalRaidBotsCount || 20
  const progressPercent = Math.min(100, Math.round(((total - remaining) / total) * 100))

  if (isMinimized) {
    return (
      <div className="fixed top-3 left-1/2 -translate-x-1/2 z-[9990] flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-950/95 border border-red-500 shadow-2xl text-xs font-mono select-none pointer-events-auto">
        <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
        <span className="font-bold text-red-200">🚨 Baskın: {remaining} Bot Kaldı</span>
        <button
          onClick={() => setIsMinimized(false)}
          className="ml-1 text-[11px] text-amber-300 hover:text-white font-bold bg-red-900/80 hover:bg-red-800 px-2 py-0.5 rounded transition-colors cursor-pointer"
        >
          Genişlet ▾
        </button>
      </div>
    )
  }

  return (
    <div className="fixed top-12 left-1/2 -translate-x-1/2 z-[9990] w-[660px] max-w-[95vw] pointer-events-auto select-none">
      <div className="relative bg-red-950/95 border-2 border-red-500 rounded-xl shadow-2xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        {/* Minimize Button */}
        <button
          onClick={() => setIsMinimized(true)}
          className="absolute top-2 right-2 p-1 rounded text-red-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          title="Bildirimi Küçült (Ekranı Kapatmasın)"
        >
          <Minus className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3 pr-6">
          <div className="p-2.5 rounded-lg bg-red-600 text-white animate-pulse shrink-0">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <div className="font-black text-red-200 tracking-wider flex items-center gap-2">
              <span>🚨 ACİL DURUM: AKTİF BASKIN (RAID)</span>
              <span className="font-mono text-xs bg-red-700/80 border border-red-500/50 px-2 py-0.5 rounded text-white font-bold animate-pulse">
                {remaining} Saldırgan Kaldı
              </span>
            </div>
            <div className="text-[11px] text-red-300 mt-1 leading-tight">
              Sunucuya saldırgan botlar girdi! Sağdaki üye listesinden veya chate sağ tıklayarak botları <strong>BANLAYIN</strong>!
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-red-900/60 rounded-full h-2 mt-2 overflow-hidden border border-red-500/30">
              <div 
                className="bg-gradient-to-r from-amber-500 to-emerald-400 h-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <div className="text-[10px] text-zinc-300 font-mono mt-0.5 flex justify-between">
              <span>Temizlenen: {bannedRaidersCount} / {total}</span>
              <span className="font-bold text-emerald-400">%{progressPercent} Temizlendi</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
          <button
            onClick={toggleSlowMode}
            className={`px-3 py-2 rounded-lg font-bold text-xs flex items-center gap-1.5 transition-all shadow cursor-pointer ${
              isSlowModeActive
                ? 'bg-emerald-600 text-white'
                : 'bg-red-600 hover:bg-red-500 text-white animate-pulse'
            }`}
          >
            {isSlowModeActive ? (
              <>
                <Check className="w-4 h-4" />
                <span>Yavaş Mod Açık</span>
              </>
            ) : (
              <>
                <Zap className="w-4 h-4" />
                <span>Slow Mode Aç</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
