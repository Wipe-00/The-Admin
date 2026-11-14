import React, { useState } from 'react'
import { 
  Play, 
  RotateCcw, 
  Settings, 
  BookOpen, 
  Power, 
  Terminal, 
  Volume2, 
  VolumeX
} from 'lucide-react'
import { soundEngine } from '../../utils/soundEngine'

interface MainMenuProps {
  onStartGame: () => void
  onContinueGame: () => void
  hasSaveGame: boolean
  crtEffect: boolean
  onToggleCrt: () => void
  sfxMuted: boolean
  onToggleSfx: () => void
}

export const MainMenu: React.FC<MainMenuProps> = ({
  onStartGame,
  onContinueGame,
  hasSaveGame,
  crtEffect,
  onToggleCrt,
  sfxMuted,
  onToggleSfx
}) => {
  const [view, setView] = useState<'main' | 'settings' | 'guide'>('main')

  const handleHover = () => {
    if (!sfxMuted) soundEngine.playKeyClick()
  }

  const handleAction = (callback: () => void) => {
    if (!sfxMuted) soundEngine.playCoinChime()
    callback()
  }

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-[#08090c] text-zinc-200 select-none flex flex-col justify-between p-8 font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Background Matrix/Grid Texture */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.04]"
        style={{
          backgroundImage: `linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)`,
          backgroundSize: '36px 36px'
        }}
      />
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,_transparent_0%,_#050608_90%)]" />

      {/* Top Header Status */}
      <div className="relative z-10 flex items-center justify-between text-xs font-mono text-zinc-500 border-b border-[#1b1d24] pb-3">
        <div className="flex items-center gap-3">
          <Terminal className="w-4 h-4 text-emerald-400" />
          <span className="text-zinc-300 font-bold">DARK QUERY CORP // OVERLORD OS</span>
          <span className="text-zinc-600">|</span>
          <span>BUILD 4.2.19045-PROD</span>
        </div>
        <div className="flex items-center gap-4">
          <span>PORT: 8080 (SECURE)</span>
          <span className="flex items-center gap-1.5 text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            ROOT ACCESS READY
          </span>
        </div>
      </div>

      {/* Center Hero & Menu Options */}
      <div className="relative z-10 max-w-xl mx-auto my-auto w-full">
        {view === 'main' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            {/* Logo / Title */}
            <div className="space-y-2 text-center">
              <div className="inline-block px-3 py-1 rounded bg-[#161820] border border-[#2b2e38] text-[11px] font-mono text-emerald-400 uppercase tracking-widest font-semibold mb-2">
                Topluluk Moderasyon & Güç Simülatörü
              </div>
              <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight font-mono">
                ROOT://ACCESS
              </h1>
              <p className="text-sm text-zinc-400 tracking-wide font-medium">
                THE ADMIN • SERVER OVERLORD
              </p>
            </div>

            {/* Menu Buttons */}
            <div className="space-y-2.5 max-w-sm mx-auto">
              <button
                onMouseEnter={handleHover}
                onClick={() => handleAction(onStartGame)}
                className="w-full py-3 px-4 rounded bg-[#5865F2] hover:bg-[#4752c4] text-white font-bold text-sm flex items-center justify-between transition-all group shadow-lg"
              >
                <div className="flex items-center gap-2.5">
                  <Play className="w-4 h-4 fill-current" />
                  <span>Vardiyaya Başla</span>
                </div>
                <span className="text-[10px] font-mono opacity-60 group-hover:opacity-100">ENTER</span>
              </button>

              {hasSaveGame && (
                <button
                  onMouseEnter={handleHover}
                  onClick={() => handleAction(onContinueGame)}
                  className="w-full py-3 px-4 rounded bg-[#191b22] hover:bg-[#252833] border border-[#2d313d] text-zinc-200 font-semibold text-sm flex items-center justify-between transition-all group"
                >
                  <div className="flex items-center gap-2.5">
                    <RotateCcw className="w-4 h-4 text-emerald-400" />
                    <span>Oturuma Devam Et</span>
                  </div>
                  <span className="text-[10px] font-mono text-zinc-500">GÜN 1</span>
                </button>
              )}

              <button
                onMouseEnter={handleHover}
                onClick={() => {
                  handleHover()
                  setView('settings')
                }}
                className="w-full py-2.5 px-4 rounded bg-[#14151a] hover:bg-[#1f222b] border border-[#262832] text-zinc-300 font-medium text-xs flex items-center gap-2.5 transition-colors"
              >
                <Settings className="w-4 h-4 text-zinc-400" />
                <span>Sistem & Ekran Ayarları</span>
              </button>

              <button
                onMouseEnter={handleHover}
                onClick={() => {
                  handleHover()
                  setView('guide')
                }}
                className="w-full py-2.5 px-4 rounded bg-[#14151a] hover:bg-[#1f222b] border border-[#262832] text-zinc-300 font-medium text-xs flex items-center gap-2.5 transition-colors"
              >
                <BookOpen className="w-4 h-4 text-zinc-400" />
                <span>Moderatör El Kitabı & Kısayollar</span>
              </button>

              <button
                onMouseEnter={handleHover}
                onClick={() => window.close()}
                className="w-full py-2.5 px-4 rounded bg-transparent hover:bg-red-500/10 text-zinc-500 hover:text-red-400 font-medium text-xs flex items-center gap-2.5 transition-colors"
              >
                <Power className="w-4 h-4" />
                <span>Sistemden Çık</span>
              </button>
            </div>
          </div>
        )}

        {/* Settings View */}
        {view === 'settings' && (
          <div className="p-6 rounded-xl bg-[#12141a] border border-[#242732] space-y-5 animate-in fade-in duration-200">
            <div className="flex items-center justify-between border-b border-[#242732] pb-3">
              <div className="flex items-center gap-2 font-bold text-white text-sm">
                <Settings className="w-4 h-4 text-zinc-400" />
                <span>Sistem Ayarları</span>
              </div>
              <button
                onClick={() => setView('main')}
                className="text-xs text-zinc-400 hover:text-white"
              >
                Geri Dön
              </button>
            </div>

            <div className="space-y-4 text-xs">
              {/* Audio Toggle */}
              <div className="flex items-center justify-between p-3 rounded bg-[#181a22] border border-[#272a38]">
                <div>
                  <div className="font-bold text-white">Ses Efektleri & Bildirimler</div>
                  <div className="text-[11px] text-zinc-400">Discord bildirimleri, klavye switch klikleri ve foley sesleri.</div>
                </div>
                <button
                  onClick={onToggleSfx}
                  className={`p-2 rounded transition-colors ${
                    !sfxMuted ? 'bg-[#5865F2] text-white' : 'bg-zinc-800 text-zinc-500'
                  }`}
                >
                  {!sfxMuted ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                </button>
              </div>

              {/* CRT Scanline Toggle */}
              <div className="flex items-center justify-between p-3 rounded bg-[#181a22] border border-[#272a38]">
                <div>
                  <div className="font-bold text-white">CRT Monitör Efekti</div>
                  <div className="text-[11px] text-zinc-400">Retro ekran tarama çizgileri ve hafif diegetik parlama.</div>
                </div>
                <button
                  onClick={onToggleCrt}
                  className={`px-3 py-1.5 rounded text-xs font-bold transition-colors ${
                    crtEffect ? 'bg-emerald-600 text-white' : 'bg-zinc-800 text-zinc-400'
                  }`}
                >
                  {crtEffect ? 'AÇIK' : 'KAPALI'}
                </button>
              </div>
            </div>

            <button
              onClick={() => setView('main')}
              className="w-full py-2 bg-[#1f222d] hover:bg-[#2b2f3d] text-white font-bold text-xs rounded transition-colors"
            >
              Kaydet ve Ana Menüye Dön
            </button>
          </div>
        )}

        {/* Guide & Shortcuts View */}
        {view === 'guide' && (
          <div className="p-6 rounded-xl bg-[#12141a] border border-[#242732] space-y-4 animate-in fade-in duration-200">
            <div className="flex items-center justify-between border-b border-[#242732] pb-3">
              <div className="flex items-center gap-2 font-bold text-white text-sm">
                <BookOpen className="w-4 h-4 text-emerald-400" />
                <span>Moderatör El Kitabı & Kısayollar</span>
              </div>
              <button
                onClick={() => setView('main')}
                className="text-xs text-zinc-400 hover:text-white"
              >
                Geri Dön
              </button>
            </div>

            <div className="space-y-2.5 text-xs text-zinc-300">
              <div className="p-2.5 rounded bg-[#181a22] border border-[#272a38]">
                <strong className="text-white block font-mono">Ctrl + Shift + S</strong>
                <span className="text-[11px] text-zinc-400">Acil Durum Yavaş Modunu (Slow Mode) anında açar veya kapatır.</span>
              </div>
              <div className="p-2.5 rounded bg-[#181a22] border border-[#272a38]">
                <strong className="text-white block font-mono">Sağ Tık (Kullanıcı / Mesaj)</strong>
                <span className="text-[11px] text-zinc-400">Hızlı Ban, Mute veya Mesaj Silme menüsünü açar.</span>
              </div>
              <div className="p-2.5 rounded bg-[#181a22] border border-[#272a38]">
                <strong className="text-white block font-mono">Kahve Fincanı & Kedi Paspas</strong>
                <span className="text-[11px] text-zinc-400">Stres anlarında akıl sağlığını (Sanity) doldurmak için masaüstünden tıkla.</span>
              </div>
            </div>

            <button
              onClick={() => setView('main')}
              className="w-full py-2 bg-[#1f222d] hover:bg-[#2b2f3d] text-white font-bold text-xs rounded transition-colors"
            >
              Anladım
            </button>
          </div>
        )}
      </div>

      {/* Bottom Footer Info */}
      <div className="relative z-10 flex items-center justify-between text-[11px] font-mono text-zinc-600 border-t border-[#1b1d24] pt-3">
        <div>&copy; 2026 Dark Query Studios. Tüm hakları saklıdır.</div>
        <div className="flex items-center gap-3">
          <span>STEAM EDITION</span>
          <span>DISCLORD CLIENT v4.2</span>
        </div>
      </div>
    </div>
  )
}
