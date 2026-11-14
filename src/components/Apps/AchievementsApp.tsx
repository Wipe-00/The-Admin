import React, { useState } from 'react'
import { 
  Trophy, 
  Lock, 
  CheckCircle2, 
  Sparkles, 
  Search
} from 'lucide-react'
import { useGame } from '../../context/GameContext'
import { soundEngine } from '../../utils/soundEngine'

export const AchievementsApp: React.FC = () => {
  const { achievements } = useGame()
  const [filter, setFilter] = useState<'all' | 'unlocked' | 'locked'>('all')
  const [searchQuery, setSearchQuery] = useState('')

  const unlockedCount = achievements.filter((a) => a.isUnlocked).length
  const totalCount = achievements.length
  const progressPercent = Math.round((unlockedCount / totalCount) * 100)

  // Mod title based on progress
  let modRank = 'Çaylak Moderatör'
  let rankBadgeColor = 'text-zinc-400 bg-zinc-800 border-zinc-700'
  if (progressPercent >= 75) {
    modRank = 'Sunucu Tanrısı (Efsanevi)'
    rankBadgeColor = 'text-amber-400 bg-amber-500/10 border-amber-500/30'
  } else if (progressPercent >= 50) {
    modRank = 'Kıdemli Başgardiyan'
    rankBadgeColor = 'text-purple-400 bg-purple-500/10 border-purple-500/30'
  } else if (progressPercent >= 25) {
    modRank = 'Disiplinli Asayiş Modu'
    rankBadgeColor = 'text-blue-400 bg-blue-500/10 border-blue-500/30'
  }

  const filteredAchievements = achievements.filter((a) => {
    if (filter === 'unlocked' && !a.isUnlocked) return false
    if (filter === 'locked' && a.isUnlocked) return false
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim()
      return a.title.toLowerCase().includes(q) || a.description.toLowerCase().includes(q)
    }
    return true
  })

  return (
    <div 
      className="flex flex-col h-full w-full bg-[#0d1017] text-zinc-200 font-sans select-none overflow-hidden"
      onContextMenu={(e) => {
        e.preventDefault()
        e.stopPropagation()
      }}
    >
      {/* Top Header */}
      <div className="h-16 px-6 bg-[#151922] border-b border-[#232936] flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-yellow-300 flex items-center justify-center text-zinc-950 shadow-lg shadow-amber-500/20">
            <Trophy className="w-6 h-6 fill-zinc-950" />
          </div>
          <div>
            <div className="text-sm font-bold text-white flex items-center gap-2">
              <span>ModOS Başarımlar & Madalyalar</span>
              <span className={`text-[10px] px-2 py-0.5 rounded-full border font-semibold ${rankBadgeColor}`}>
                {modRank}
              </span>
            </div>
            <div className="text-[11px] text-zinc-400">
              Sunucu kariyerinizde açtığınız rozetler ve kilitli sırlar
            </div>
          </div>
        </div>

        {/* Global Progress Pill */}
        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <div className="text-[10px] text-zinc-400 font-semibold uppercase">Tamamlanma Oranı</div>
            <div className="text-xs font-mono font-bold text-amber-400">
              {unlockedCount} / {totalCount} Rozet (%{progressPercent})
            </div>
          </div>
          <div className="w-24 sm:w-32 h-2.5 bg-[#1b202c] rounded-full overflow-hidden border border-[#2e3748]">
            <div 
              className="h-full bg-gradient-to-r from-amber-500 to-yellow-400 rounded-full transition-all duration-500 shadow-sm"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="h-12 px-6 bg-[#11141c] border-b border-[#1f2430] flex items-center justify-between gap-3 shrink-0">
        {/* Filter Buttons */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => {
              setFilter('all')
              soundEngine.playKeyClick()
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              filter === 'all'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                : 'text-zinc-400 hover:text-white hover:bg-white/5'
            }`}
          >
            Tümü ({totalCount})
          </button>
          <button
            onClick={() => {
              setFilter('unlocked')
              soundEngine.playKeyClick()
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              filter === 'unlocked'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                : 'text-zinc-400 hover:text-white hover:bg-white/5'
            }`}
          >
            Açılanlar ({unlockedCount})
          </button>
          <button
            onClick={() => {
              setFilter('locked')
              soundEngine.playKeyClick()
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              filter === 'locked'
                ? 'bg-zinc-700/40 text-zinc-300 border border-zinc-600/50 shadow-sm'
                : 'text-zinc-400 hover:text-white hover:bg-white/5'
            }`}
          >
            Kilitli ({totalCount - unlockedCount})
          </button>
        </div>

        {/* Search Input */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Başarım ara..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-36 sm:w-48 h-7 pl-8 pr-3 text-xs bg-[#181d28] border border-[#2b3345] rounded-lg text-white placeholder-zinc-500 outline-none focus:border-amber-500/60 transition-colors"
          />
        </div>
      </div>

      {/* Achievements Cards Grid */}
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-5xl mx-auto">
          {filteredAchievements.map((ach) => {
            if (ach.isUnlocked) {
              return (
                <div
                  key={ach.id}
                  onClick={() => soundEngine.playKeyClick()}
                  className="relative p-4 rounded-xl bg-gradient-to-br from-[#161b24] via-[#12151d] to-[#0e1117] border border-amber-500/30 hover:border-amber-400/60 shadow-lg shadow-black/40 flex items-start gap-4 transition-all hover:scale-[1.01] cursor-pointer group"
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-amber-500/20 to-yellow-500/10 border border-amber-500/30 flex items-center justify-center text-2xl shrink-0 shadow-inner group-hover:scale-105 transition-transform">
                    {ach.icon}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <div className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors truncate flex items-center gap-1.5">
                        <span>{ach.title}</span>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      </div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 shrink-0">
                        AÇILDI {ach.unlockedAt ? `(${ach.unlockedAt})` : ''}
                      </span>
                    </div>

                    <p className="text-xs text-zinc-300 mt-1 leading-relaxed">
                      {ach.description}
                    </p>

                    <div className="mt-2.5 pt-2 border-t border-white/5 flex items-center justify-between text-[10px] text-zinc-500 font-mono">
                      <span className="flex items-center gap-1 text-amber-400/80">
                        <Sparkles className="w-3 h-3 text-amber-400" />
                        Kazanılan Başarım
                      </span>
                      <span>ID: #{ach.id}</span>
                    </div>
                  </div>
                </div>
              )
            }

            // Locked Achievement Card
            return (
              <div
                key={ach.id}
                onClick={() => soundEngine.playKeyClick()}
                className="relative p-4 rounded-xl bg-[#11141c]/80 border border-[#202533] shadow-md flex items-start gap-4 opacity-75 hover:opacity-100 transition-all hover:border-zinc-600 cursor-pointer group"
              >
                <div className="w-12 h-12 rounded-xl bg-[#161a24] border border-[#272e3d] flex items-center justify-center text-xl shrink-0 text-zinc-500 group-hover:text-zinc-400 transition-colors">
                  <Lock className="w-5 h-5 text-zinc-500" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <div className="text-sm font-bold text-zinc-300 truncate flex items-center gap-1.5">
                      <span>{ach.title}</span>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-400 border border-zinc-700 shrink-0 flex items-center gap-1">
                      <Lock className="w-2.5 h-2.5" />
                      KİLİTLİ
                    </span>
                  </div>

                  <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                    {ach.description}
                  </p>

                  <div className="mt-2.5 pt-2 border-t border-white/5 flex items-center justify-between text-[10px] text-zinc-500 font-mono">
                    <span className="text-zinc-500 italic">
                      İpucu: Görevi sunucuda yerine getirerek kilidi aç
                    </span>
                    <span>ID: #{ach.id}</span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {filteredAchievements.length === 0 && (
          <div className="text-center py-12 text-zinc-500 space-y-2">
            <Trophy className="w-8 h-8 mx-auto opacity-30" />
            <div className="text-sm">Aradığınız kriterlere uygun başarım bulunamadı.</div>
          </div>
        )}
      </div>
    </div>
  )
}
