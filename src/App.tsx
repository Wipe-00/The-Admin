import React, { useState, useEffect } from 'react'
import type { AppId, WindowState, DesktopShortcut } from './types/os'
import { DesktopIcon } from './components/OS/DesktopIcon'
import { WindowFrame } from './components/OS/WindowFrame'
import { Taskbar } from './components/OS/Taskbar'
import { StartMenu } from './components/OS/StartMenu'
import { GameProvider, useGame } from './context/GameContext'
import { soundEngine } from './utils/soundEngine'

// App components
import { IscordApp } from './components/Apps/IscordApp'
import { WebBrowserApp } from './components/Apps/WebBrowserApp'
import { TerminalApp } from './components/Apps/TerminalApp'
import { NotesApp } from './components/Apps/NotesApp'
import { BotBuilderApp } from './components/Apps/BotBuilderApp'
import { MailApp } from './components/Apps/MailApp'
import { BankApp } from './components/Apps/BankApp'
import { AchievementsApp } from './components/Apps/AchievementsApp'
import { RetroGameApp } from './components/Apps/RetroGameApp'
import { AppCenterApp } from './components/Apps/AppCenterApp'
import { RemoteVdsApp } from './components/Apps/RemoteVdsApp'
import { FoodDeliveryApp } from './components/Apps/FoodDeliveryApp'
import { ShiftSummaryModal } from './components/OS/ShiftSummaryModal'
import { RaidAlertBanner } from './components/OS/RaidAlertBanner'
import { MainMenu } from './components/Menu/MainMenu'
import {
  X,
  ChevronLeft,
  ChevronRight,
  AlarmClock,
  Moon,
  GraduationCap,
  CheckCircle2,
  Bell,
  Landmark,
  MessageSquare
} from 'lucide-react'

const ALL_SHORTCUTS: DesktopShortcut[] = [
  { id: 'appcenter', title: 'Yazılım Kurulum Merkezi', iconName: 'appcenter' },
  { id: 'fooddelivery', title: 'Yemek Poşeti', iconName: 'fooddelivery' },
  { id: 'browser', title: 'Web Tarayıcı', iconName: 'browser' },
  { id: 'iscord', title: 'Iscord', iconName: 'iscord' },
  { id: 'rdp', title: 'Uzaktan Bağlantı (VDS)', iconName: 'rdp' },
  { id: 'bank', title: 'NeoBank Finans', iconName: 'bank' },
  { id: 'mail', title: 'ModMail (İletiler)', iconName: 'mail', badge: 1 },
  { id: 'terminal', title: 'Terminal (/root)', iconName: 'terminal' },
  { id: 'store', title: 'Donanım & Setup', iconName: 'store' },
  { id: 'achievements', title: 'Başarımlar', iconName: 'achievements' },
  { id: 'notes', title: 'Mod Notları', iconName: 'notes' },
  { id: 'trash', title: 'Geri Dönüşüm', iconName: 'trash' }
]

const APP_CONFIG: Record<AppId, { title: string; defaultSize: { width: number; height: number }; defaultPos: { x: number; y: number } }> = {
  fooddelivery: {
    title: 'Yemek Poşeti — Lezzet & Kahve Kapında',
    defaultSize: { width: 940, height: 620 },
    defaultPos: { x: 120, y: 45 }
  },
  appcenter: {
    title: 'ModOS Yazılım Kurulum Merkezi (Paket Yöneticisi)',
    defaultSize: { width: 880, height: 600 },
    defaultPos: { x: 140, y: 60 }
  },
  rdp: {
    title: 'Uzaktan Masaüstü Bağlantısı (CloudVDS Server OS)',
    defaultSize: { width: 980, height: 640 },
    defaultPos: { x: 110, y: 45 }
  },
  iscord: {
    title: 'Iscord - Moderatör İstemcisi',
    defaultSize: { width: 1040, height: 680 },
    defaultPos: { x: 80, y: 30 }
  },
  bank: {
    title: 'NeoBank ModFinans - Bireysel & Kurumsal Kasa Portalı',
    defaultSize: { width: 920, height: 600 },
    defaultPos: { x: 130, y: 70 }
  },
  mail: {
    title: 'ModMail - İletiler & Teklifler',
    defaultSize: { width: 920, height: 580 },
    defaultPos: { x: 140, y: 50 }
  },
  browser: {
    title: 'Web Tarayıcı (ModNet)',
    defaultSize: { width: 980, height: 640 },
    defaultPos: { x: 120, y: 60 }
  },
  botbuilder: {
    title: 'BotBuilder IDE v2.1 (Oto-Mod Editörü)',
    defaultSize: { width: 880, height: 580 },
    defaultPos: { x: 160, y: 80 }
  },
  terminal: {
    title: 'Terminal - /root@overlord',
    defaultSize: { width: 680, height: 440 },
    defaultPos: { x: 260, y: 140 }
  },
  retrogame: {
    title: 'Stam RetroGames Hub (Snake 98 & Minesweeper)',
    defaultSize: { width: 440, height: 570 },
    defaultPos: { x: 300, y: 60 }
  },
  stam: {
    title: 'Stam Store & Retro Games Kütüphanesi',
    defaultSize: { width: 860, height: 600 },
    defaultPos: { x: 180, y: 70 }
  },
  snake98: {
    title: 'Retro Snake 98 (Nokia 3310 Edition)',
    defaultSize: { width: 440, height: 570 },
    defaultPos: { x: 280, y: 80 }
  },
  minesweeper: {
    title: 'Cyber Minesweeper 2000 (Win98 Edition)',
    defaultSize: { width: 440, height: 570 },
    defaultPos: { x: 320, y: 100 }
  },
  store: {
    title: 'Donanım & Battlestation Sepeti',
    defaultSize: { width: 980, height: 640 },
    defaultPos: { x: 120, y: 55 }
  },
  notes: {
    title: 'Mod Rehberi & Görev Notları',
    defaultSize: { width: 560, height: 420 },
    defaultPos: { x: 300, y: 100 }
  },
  achievements: {
    title: 'ModOS Başarımlar & Madalyalar (Trophy Hall)',
    defaultSize: { width: 780, height: 560 },
    defaultPos: { x: 180, y: 70 }
  },
  trash: {
    title: 'Geri Dönüşüm Kutusu',
    defaultSize: { width: 480, height: 320 },
    defaultPos: { x: 360, y: 160 }
  }
}

const TUTORIAL_STEPS = [
  {
    step: 1,
    title: '1. Adım: Uygulamaları Kendimiz Kuruyoruz',
    desc: 'Bilgisayarınızda başlangıçta sadece Web Tarayıcı ve Yazılım Kurulum Merkezi yüklüdür. Masaüstündeki "Yazılım Kurulum Merkezi"ni açarak Iscord, NeoBank, Uzaktan Bağlantı (VDS) ve diğer araçları indirin!',
    actionLabel: 'Yazılım Kurulum Merkezini Aç',
    targetApp: 'appcenter' as AppId
  },
  {
    step: 2,
    title: '2. Adım: Kendi Iscord Hesabınızı Oluşturun',
    desc: 'Iscord uygulamasını kurduktan sonra açın. İlk girişte kendi moderatör kullanıcı adınızı, şifrenizi ve avatar renginizi belirleyerek sunucuya giriş yapın.',
    actionLabel: 'Iscord İstemcisini Aç',
    targetApp: 'iscord' as AppId
  },
  {
    step: 3,
    title: '3. Adım: Kanallar, Seçenekli Mesajlar, Sağ Tık DM & Biletler',
    desc: 'Sunucuda #genel-sohbet, #oyun-sohbeti, #ekran-goruntuleri ve yeni açtığınız kanallarda üyeler aktif konuşur. Herhangi bir üyeye Sağ Tık yaparak DM gönderebilir veya yasaklayabilirsiniz. Tüm sohbetlerde hazır seçenek butonlarıyla konuşursunuz!',
    actionLabel: 'Iscord’a Göz At',
    targetApp: 'iscord' as AppId
  },
  {
    step: 4,
    title: '4. Adım: VDS Sunucu Kiralama & Uzaktan Bot Aktivasyonu',
    desc: 'Bot çalıştırmak için önce Web Tarayıcı -> CloudVDS & BotHub adresinden VDS kiralamalısınız. Ardından "Uzaktan Bağlantı (VDS)" uygulamasını açıp VDS IP ve şifrenizle VDS masaüstüne bağlanarak botları oradaki BotMarket’ten satın alıp aktif edebilirsiniz!',
    actionLabel: 'Web Tarayıcıyı Aç',
    targetApp: 'browser' as AppId
  },
  {
    step: 5,
    title: '5. Adım: Performansa Göre Maaş & Kahve/Kedi Molası',
    desc: 'Sol üstten Kahve (25₺) ve Paspas’ı Sev (15₺) ile akıl sağlığınızı koruyun. Saat 20:00 olduğunda nöbeti bitirin; Kurucu_Efe o gün çözdüğünüz bilet ve attığınız ban sayısına göre maaşınızı hesaplayıp DM’den bildirir ve bankaya yatırır!',
    actionLabel: 'Eğitimi Tamamla',
    targetApp: undefined
  }
]

interface DesktopContentProps {
  onReturnToMenu: () => void
  crtEffect: boolean
}

const DesktopContent: React.FC<DesktopContentProps> = ({ onReturnToMenu, crtEffect }) => {
  const {
    currentDay,
    ticketsResolvedCount,
    bansIssuedCount,
    isShiftModalOpen,
    setIsShiftModalOpen,
    advanceDay,
    toggleSlowMode,
    triggerRaid,
    isRaidActive,
    hype,
    sanity,
    personalCash,
    serverFunds,
    drinkCoffee,
    petCat,
    activeTickets,
    ownedBots,
    recentAchievement,
    dismissAchievementToast,
    achievements,
    wallpaper,
    setWallpaper,
    timeString,
    canEndShift,
    isDayTransitioning,
    transitionOldDay,
    transitionNewDay,
    sleepClockHour,
    sleepClockMinute,
    wakeUp,
    isStamInstalled,
    ownedGames,
    installedApps,
    tutorialStep,
    setTutorialStep,
    osNotifications,
    dismissNotification
  } = useGame()

  const [selectedIconId, setSelectedIconId] = useState<AppId | null>(null)
  const [isWidgetOpen, setIsWidgetOpen] = useState(true)
  // Item #1: Do NOT auto-open Iscord when starting the game!
  const [windows, setWindows] = useState<WindowState[]>([])
  const [activeWindowId, setActiveWindowId] = useState<AppId | null>(null)
  const [highestZIndex, setHighestZIndex] = useState(10)
  const [isStartMenuOpen, setIsStartMenuOpen] = useState(false)
  const [desktopContextMenu, setDesktopContextMenu] = useState<{ x: number; y: number } | null>(null)
  const [isFullscreen, setIsFullscreen] = useState(false)

  // Fullscreen toggle logic
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {})
      setIsFullscreen(true)
    } else {
      document.exitFullscreen().catch(() => {})
      setIsFullscreen(false)
    }
  }

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }
    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange)
  }, [])

  // Focus a window
  const bringToFront = (id: AppId) => {
    setHighestZIndex((prev) => {
      const nextZ = prev + 1
      setWindows((prevWins) =>
        prevWins.map((w) =>
          w.id === id ? { ...w, zIndex: nextZ, isMinimized: false } : w
        )
      )
      return nextZ
    })
    setActiveWindowId(id)
  }

  // Open / Launch app
  const launchApp = (id: AppId) => {
    const existing = windows.find((w) => w.id === id)
    if (existing) {
      if (existing.isMinimized) {
        setWindows((prev) =>
          prev.map((w) => (w.id === id ? { ...w, isMinimized: false } : w))
        )
      }
      bringToFront(id)
      return
    }

    const cfg = APP_CONFIG[id]
    if (!cfg) return
    const nextZ = highestZIndex + 1
    setHighestZIndex(nextZ)

    const newWindow: WindowState = {
      id,
      title: cfg.title,
      iconName: id,
      isMinimized: false,
      isMaximized: false,
      position: { ...cfg.defaultPos },
      size: { ...cfg.defaultSize },
      zIndex: nextZ
    }

    setWindows((prev) => [...prev, newWindow])
    setActiveWindowId(id)
  }

  // Quick Coffee & Cat shortcuts
  const handleDrinkCoffeeAction = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation()
    drinkCoffee()
  }

  const handlePetCatAction = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation()
    petCat()
  }

  // Global Keyboard Shortcuts (Hotkeys)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 's') {
        e.preventDefault()
        toggleSlowMode()
      }
      if (e.altKey && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        handleDrinkCoffeeAction()
      }
      if (e.key === 'F11') {
        e.preventDefault()
        toggleFullscreen()
      }
      if (e.altKey && e.key === '1') {
        e.preventDefault()
        if (installedApps.includes('iscord')) launchApp('iscord')
      }
      if (e.altKey && e.key === '2') {
        e.preventDefault()
        launchApp('browser')
      }
      if (e.altKey && e.key === '3') {
        e.preventDefault()
        if (installedApps.includes('mail')) launchApp('mail')
      }
      if (e.altKey && e.key === '4') {
        e.preventDefault()
        if (installedApps.includes('rdp')) launchApp('rdp')
      }
      if (e.altKey && e.key === '5') {
        e.preventDefault()
        if (installedApps.includes('terminal')) launchApp('terminal')
      }
      if (e.key === 'Escape') {
        setIsStartMenuOpen(false)
        setDesktopContextMenu(null)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [toggleSlowMode, drinkCoffee, installedApps])

  // Random Raid Event Generator
  useEffect(() => {
    const raidTimer = setInterval(() => {
      if (!isRaidActive && hype > 45 && Math.random() < 0.35) {
        soundEngine.playRaidAlarm()
        triggerRaid()
      }
    }, 45000)
    return () => clearInterval(raidTimer)
  }, [isRaidActive, hype, triggerRaid])

  // Toggle window from taskbar
  const toggleWindowFromTaskbar = (id: AppId) => {
    const win = windows.find((w) => w.id === id)
    if (!win) return

    if (activeWindowId === id && !win.isMinimized) {
      setWindows((prev) =>
        prev.map((w) => (w.id === id ? { ...w, isMinimized: true } : w))
      )
      setActiveWindowId(null)
    } else {
      bringToFront(id)
    }
  }

  // Close window
  const closeWindow = (id: AppId) => {
    setWindows((prev) => prev.filter((w) => w.id !== id))
    if (activeWindowId === id) {
      const remaining = windows.filter((w) => w.id !== id && !w.isMinimized)
      if (remaining.length > 0) {
        const topWin = remaining.reduce((max, w) => (w.zIndex > max.zIndex ? w : max))
        setActiveWindowId(topWin.id)
      } else {
        setActiveWindowId(null)
      }
    }
  }

  // Minimize window
  const minimizeWindow = (id: AppId) => {
    setWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, isMinimized: true } : w))
    )
    if (activeWindowId === id) {
      setActiveWindowId(null)
    }
  }

  // Maximize window
  const toggleMaximizeWindow = (id: AppId) => {
    setWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, isMaximized: !w.isMaximized } : w))
    )
  }

  // Update window position
  const updateWindowPosition = (id: AppId, pos: { x: number; y: number }) => {
    setWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, position: pos } : w))
    )
  }

  // Update window size
  const updateWindowSize = (id: AppId, size: { width: number; height: number }) => {
    setWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, size: size } : w))
    )
  }

  // Render app content
  const renderAppContent = (id: AppId) => {
    switch (id) {
      case 'appcenter':
        return <AppCenterApp onOpenApp={launchApp} />
      case 'fooddelivery':
        return <FoodDeliveryApp />
      case 'rdp':
        return <RemoteVdsApp />
      case 'iscord':
        return <IscordApp />
      case 'bank':
        return <BankApp />
      case 'mail':
        return <MailApp />
      case 'browser':
        return <WebBrowserApp />
      case 'store':
        return <WebBrowserApp initialUrl="https://donanimsepeti.com" />
      case 'botbuilder':
        return <BotBuilderApp />
      case 'terminal':
        return <TerminalApp />
      case 'retrogame':
      case 'stam':
        return <RetroGameApp initialGame="store" />
      case 'snake98':
        return <RetroGameApp initialGame="snake" />
      case 'minesweeper':
        return <RetroGameApp initialGame="minesweeper" />
      case 'notes':
        return <NotesApp />
      case 'achievements':
        return <AchievementsApp />
      case 'trash':
        return (
          <div className="p-6 text-xs text-zinc-400 font-mono">
            Geri dönüşüm kutusu boş. Silinen loglar ve kayıtlar burada arşivlenir.
          </div>
        )
      default:
        return null
    }
  }

  const isSanityLow = sanity < 35

  const getWallpaperStyle = () => {
    switch (wallpaper) {
      case 'matrix':
        return 'bg-[#030d07] bg-[radial-gradient(#00ff6622_1px,transparent_1px)] [background-size:16px_16px]'
      case 'synthwave':
        return 'bg-[#180928] bg-[linear-gradient(to_right,#ff007f20_1px,transparent_1px),linear-gradient(to_bottom,#ff007f20_1px,transparent_1px)] [background-size:32px_32px]'
      case 'win98':
        return 'bg-[#008080]'
      case 'cyberpunk':
        return 'bg-[#11100d] bg-[radial-gradient(#f0b23220_1px,transparent_1px)] [background-size:20px_20px]'
      default:
        return 'bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#181c26] via-[#0d1017] to-[#07090d]'
    }
  }

  // Filter desktop shortcuts by installedApps (Item #2)
  const visibleShortcuts = [
    ...ALL_SHORTCUTS.filter((s) => installedApps.includes(s.id)),
    ...(isStamInstalled ? [{ id: 'stam' as AppId, title: 'Stam Store', iconName: 'stam' }] : []),
    ...(ownedGames.includes('snake98') ? [{ id: 'snake98' as AppId, title: 'Retro Snake 98', iconName: 'snake98' }] : []),
    ...(ownedGames.includes('minesweeper') ? [{ id: 'minesweeper' as AppId, title: 'Minesweeper 2000', iconName: 'minesweeper' }] : [])
  ]

  const activeTutorialObj = TUTORIAL_STEPS.find((s) => s.step === tutorialStep)

  return (
    <div 
      className={`relative h-screen w-screen overflow-hidden select-none transition-filter duration-700 ${
        isSanityLow ? 'filter blur-[0.6px] contrast-125 ring-2 ring-red-600/30' : ''
      }`}
      onClick={() => {
        setSelectedIconId(null)
        setDesktopContextMenu(null)
        if (isStartMenuOpen) setIsStartMenuOpen(false)
      }}
      onContextMenu={(e) => {
        e.preventDefault()
        setDesktopContextMenu({ x: e.clientX, y: e.clientY })
      }}
    >
      {/* Desktop Background / Diegetic Ambient Wallpaper */}
      <div className={`absolute inset-0 pointer-events-none transition-colors duration-500 ${getWallpaperStyle()}`} />
      
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `radial-gradient(circle, #ffffff 1px, transparent 1px)`,
          backgroundSize: '24px 24px'
        }}
      />

      {/* CRT Scanlines Overlay if enabled */}
      {crtEffect && <div className="absolute inset-0 crt-overlay z-[99999] pointer-events-none" />}

      {/* Emergency Raid Alert Banner (Fixed Position - Item #19) */}
      <RaidAlertBanner />

      {/* Top-Right Collapsible Daily Status & Objectives Widget */}
      <div className="absolute top-3 right-4 z-20 flex flex-col items-end select-none">
        {isWidgetOpen ? (
          <div 
            onClick={(e) => e.stopPropagation()}
            className="w-72 bg-[#12141a]/95 backdrop-blur-md border border-[#2b2e39] rounded-xl p-3 shadow-2xl text-xs space-y-2.5 animate-in fade-in duration-200"
          >
            <div className="flex items-center justify-between border-b border-[#262833] pb-1.5">
              <div className="flex items-center gap-1.5 font-bold text-white text-[12px]">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Nöbet Özeti & Hedefler</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="font-mono text-[11px] text-amber-400 font-bold bg-[#1d1f27] px-2 py-0.5 rounded border border-[#303340]">
                  Gün {currentDay} • {timeString}
                </span>
                <button
                  onClick={() => setIsWidgetOpen(false)}
                  className="p-1 rounded text-zinc-400 hover:text-white hover:bg-white/10"
                  title="Özet Panelini Gizle"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Quick Balance & Stats */}
            <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
              <div className="p-1.5 rounded-lg bg-[#181a22] border border-[#262836]">
                <span className="text-zinc-400 text-[10px] block">💵 Şahsi Nakit</span>
                <span className="text-emerald-400 font-bold text-xs">{personalCash}₺</span>
              </div>
              <div className="p-1.5 rounded-lg bg-[#181a22] border border-[#262836]">
                <span className="text-zinc-400 text-[10px] block">🏦 Sunucu Kasası</span>
                <span className="text-sky-400 font-bold text-xs">{serverFunds}₺</span>
              </div>
            </div>

            {/* Hype & Sanity Mini Barları */}
            <div className="space-y-1.5 pt-0.5">
              <div className="flex items-center justify-between text-[10px] font-mono">
                <span className="text-zinc-400">Sunucu Hype:</span>
                <span className="text-amber-400 font-bold">%{hype}</span>
              </div>
              <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-amber-500 to-yellow-400 rounded-full" style={{ width: `${hype}%` }} />
              </div>

              <div className="flex items-center justify-between text-[10px] font-mono pt-1">
                <span className="text-zinc-400">Akıl Sağlığı (Sanity):</span>
                <span className={sanity > 50 ? 'text-emerald-400 font-bold' : 'text-red-400 font-bold'}>%{sanity}</span>
              </div>
              <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                <div className={`h-full rounded-full ${sanity > 50 ? 'bg-emerald-500' : 'bg-red-500'}`} style={{ width: `${sanity}%` }} />
              </div>
            </div>

            {/* Mini Objectives Checklist */}
            <div className="border-t border-[#262833] pt-2 space-y-1 text-[11px] text-zinc-300">
              <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1">
                GÜNLÜK GÖREVLER (MAAŞ KRİTERİ)
              </div>
              <div className="flex items-center gap-1.5">
                <span className={ticketsResolvedCount >= 2 ? 'text-emerald-400 font-bold' : 'text-zinc-500'}>
                  {ticketsResolvedCount >= 2 ? '✓' : '○'}
                </span>
                <span>Biletleri İncele & Çöz ({ticketsResolvedCount} • +45₺/bilet)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className={bansIssuedCount >= 1 ? 'text-emerald-400 font-bold' : 'text-zinc-500'}>
                  {bansIssuedCount >= 1 ? '✓' : '○'}
                </span>
                <span>İhlalcileri Banla ({bansIssuedCount} • +35₺/ban)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className={canEndShift ? 'text-emerald-400 font-bold' : 'text-amber-400 font-bold'}>
                  {canEndShift ? '✓' : '○'}
                </span>
                <span>Akşam 20:00 Nöbetini Bitir ({canEndShift ? 'Hazır' : `${timeString} Sürüyor`})</span>
              </div>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setIsWidgetOpen(true)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#12141a]/90 backdrop-blur-md border border-[#2b2e39] text-xs font-mono text-zinc-300 hover:text-white shadow-lg cursor-pointer"
            title="Nöbet Özeti & Görevleri Aç"
          >
            <ChevronLeft className="w-3.5 h-3.5 text-amber-400" />
            <span className="font-bold text-amber-400 font-mono">{timeString}</span>
            <span>• Görevler ({ticketsResolvedCount}/2)</span>
          </button>
        )}
      </div>

      {/* Desktop Icons Column (Filtered by installedApps - Item #2 & Larger Icons - Item #4) */}
      <div className="relative z-10 pt-6 p-4 flex flex-col flex-wrap gap-3 h-[calc(100vh-42px)] content-start">
        {visibleShortcuts.map((shortcut) => {
          const badgeCount =
            shortcut.id === 'iscord'
              ? (activeTickets.length > 0 ? activeTickets.length : undefined)
              : shortcut.id === 'achievements'
              ? `${achievements.filter((a) => a.isUnlocked).length}/${achievements.length}`
              : shortcut.id === 'appcenter' && installedApps.length < 6
              ? 'YENİ'
              : shortcut.badge
          return (
            <DesktopIcon
              key={shortcut.id}
              shortcut={{ ...shortcut, badge: badgeCount }}
              isSelected={selectedIconId === shortcut.id}
              onSelect={() => setSelectedIconId(shortcut.id)}
              onOpen={() => launchApp(shortcut.id)}
            />
          )
        })}
      </div>

      {/* Interactive Tutorial Prompt & Step-by-Step Guide (Item #5) */}
      {tutorialStep === 0 && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="fixed inset-0 z-[99990] bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
        >
          <div className="max-w-lg w-full bg-[#141720] border-2 border-sky-500/50 rounded-2xl p-6 shadow-[0_0_60px_rgba(14,165,233,0.25)] space-y-5 text-center">
            <div className="w-16 h-16 rounded-2xl bg-sky-500/15 border border-sky-500/40 flex items-center justify-center mx-auto text-sky-400">
              <GraduationCap className="w-9 h-9" />
            </div>
            <div className="space-y-2">
              <div className="text-[11px] font-mono uppercase tracking-widest text-sky-400 font-bold">
                MODOS WORKSTATION v4.5 — İLK KURULUM
              </div>
              <h2 className="text-xl font-black text-white">
                Moderatör Eğitimini Yapmak İster misiniz?
              </h2>
              <p className="text-xs text-zinc-300 leading-relaxed">
                Oyun sistemleri tamamen yenilendi! Uygulamaları <strong>Yazılım Kurulum Merkezi</strong>'nden kendiniz kuracak, <strong>Iscord</strong> hesabınızı oluşturacak ve botlar için <strong>VDS Uzak Masaüstü</strong> bağlantısı yapacaksınız. Kısa interaktif eğitimi başlatabilir veya doğrudan atlayabilirsiniz.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={() => setTutorialStep(1)}
                className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-black text-xs uppercase tracking-wider shadow-lg cursor-pointer transition-all"
              >
                🎓 Eğitimi Başlat (Adım Adım)
              </button>
              <button
                onClick={() => setTutorialStep(-1)}
                className="py-3 px-5 rounded-xl bg-[#1f2330] hover:bg-[#282d3d] border border-[#32384c] text-zinc-300 hover:text-white font-bold text-xs cursor-pointer transition-all"
              >
                ⏭️ Eğitimi Atla
              </button>
            </div>
          </div>
        </div>
      )}

      {activeTutorialObj && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="fixed bottom-14 left-1/2 -translate-x-1/2 z-[99985] w-full max-w-xl px-4 animate-in slide-in-from-bottom-5 duration-200"
        >
          <div className="bg-[#12151e]/95 backdrop-blur-md border-2 border-sky-500/60 rounded-2xl p-4 shadow-[0_15px_50px_rgba(0,0,0,0.85)] space-y-3">
            <div className="flex items-center justify-between border-b border-[#242938] pb-2">
              <div className="flex items-center gap-2 text-xs font-black text-sky-400 uppercase tracking-wider">
                <GraduationCap className="w-4 h-4" />
                <span>MODOS EĞİTİM REHBERİ ({activeTutorialObj.step} / {TUTORIAL_STEPS.length})</span>
              </div>
              <button
                onClick={() => setTutorialStep(-1)}
                className="text-[11px] text-zinc-400 hover:text-white px-2 py-0.5 rounded bg-white/5 hover:bg-white/10 cursor-pointer"
              >
                Eğitimi Kapat ✕
              </button>
            </div>

            <div>
              <h3 className="text-sm font-bold text-white">{activeTutorialObj.title}</h3>
              <p className="text-xs text-zinc-300 mt-1 leading-relaxed">{activeTutorialObj.desc}</p>
            </div>

            <div className="flex items-center justify-between pt-1">
              <div className="flex gap-1.5">
                {TUTORIAL_STEPS.map((s) => (
                  <span
                    key={s.step}
                    className={`w-6 h-1.5 rounded-full ${
                      s.step === tutorialStep ? 'bg-sky-400' : s.step < tutorialStep ? 'bg-emerald-500' : 'bg-zinc-700'
                    }`}
                  />
                ))}
              </div>

              <div className="flex items-center gap-2">
                {activeTutorialObj.targetApp && (
                  <button
                    onClick={() => {
                      if (activeTutorialObj.targetApp) {
                        launchApp(activeTutorialObj.targetApp)
                      }
                    }}
                    className="px-3 py-1.5 rounded-lg bg-sky-600/30 hover:bg-sky-600/50 border border-sky-500/50 text-sky-200 text-xs font-bold cursor-pointer"
                  >
                    {activeTutorialObj.actionLabel}
                  </button>
                )}
                <button
                  onClick={() => {
                    if (tutorialStep >= TUTORIAL_STEPS.length) {
                      setTutorialStep(-1)
                    } else {
                      setTutorialStep(tutorialStep + 1)
                    }
                  }}
                  className="px-4 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-black cursor-pointer flex items-center gap-1"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{tutorialStep >= TUTORIAL_STEPS.length ? 'Eğitimi Bitir' : 'Sonraki Adım ➔'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Window Manager Layer */}
      {windows.map((win) => (
        <WindowFrame
          key={win.id}
          windowData={win}
          isActive={activeWindowId === win.id}
          onFocus={() => bringToFront(win.id)}
          onClose={() => closeWindow(win.id)}
          onMinimize={() => minimizeWindow(win.id)}
          onMaximize={() => toggleMaximizeWindow(win.id)}
          onUpdatePosition={(pos) => updateWindowPosition(win.id, pos)}
          onUpdateSize={(size) => updateWindowSize(win.id, size)}
        >
          {renderAppContent(win.id)}
        </WindowFrame>
      ))}

      {/* Start Menu */}
      <StartMenu
        isOpen={isStartMenuOpen}
        onClose={() => setIsStartMenuOpen(false)}
        onLaunchApp={launchApp}
        hype={hype}
        balance={personalCash}
        serverFunds={serverFunds}
        onReturnToMenu={onReturnToMenu}
        isFullscreen={isFullscreen}
        onToggleFullscreen={toggleFullscreen}
      />

      {/* Taskbar */}
      <Taskbar
        windows={windows}
        activeWindowId={activeWindowId}
        onToggleWindow={toggleWindowFromTaskbar}
        onToggleStartMenu={() => setIsStartMenuOpen(!isStartMenuOpen)}
        isStartMenuOpen={isStartMenuOpen}
        sanity={sanity}
        onEndShift={() => {
          if (!canEndShift) {
            alert(`Vardiyanız akşam saat 20:00'den önce bitirilemez! Görevinizin başında kalmalısınız.\n(Şu anki saat: ${timeString})`)
            return
          }
          setIsShiftModalOpen(true)
        }}
        isFullscreen={isFullscreen}
        onToggleFullscreen={toggleFullscreen}
        gameTimeString={timeString}
        currentDay={currentDay}
        canEndShift={canEndShift}
      />

      {/* Shift End / Daily Summary Modal */}
      <ShiftSummaryModal
        isOpen={isShiftModalOpen}
        onClose={() => setIsShiftModalOpen(false)}
        onAdvanceDay={advanceDay}
        currentDay={currentDay}
        ticketsResolved={ticketsResolvedCount}
        bansIssued={bansIssuedCount}
        dailyDonations={220 + Math.floor((hype / 100) * 180)}
        dailyExpenses={110 + (ownedBots.length * 45)}
        salary={120 + (ticketsResolvedCount * 45) + (bansIssuedCount * 35)}
        hype={hype}
      />

      {/* Bottom-Right OS Toast Notifications Stack (Bank Deposits, Founder Salary DMs, User DMs - Item #18) */}
      {osNotifications.length > 0 && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="fixed bottom-14 right-4 z-[99995] flex flex-col gap-2 max-w-sm w-full pointer-events-auto"
        >
          {osNotifications.map((notif) => (
            <div
              key={notif.id}
              onClick={() => {
                if (notif.type === 'dm' && installedApps.includes('iscord')) {
                  launchApp('iscord')
                } else if (notif.type === 'bank' && installedApps.includes('bank')) {
                  launchApp('bank')
                }
                dismissNotification(notif.id)
              }}
              className={`flex items-start gap-3 p-3.5 rounded-xl border shadow-2xl cursor-pointer transition-all animate-in slide-in-from-right-5 duration-200 ${
                notif.type === 'bank'
                  ? 'bg-[#0f1915]/95 border-emerald-500/60 text-white'
                  : notif.type === 'dm'
                  ? 'bg-[#141624]/95 border-[#5865F2]/70 text-white'
                  : 'bg-[#15171e]/95 border-amber-500/60 text-white'
              }`}
            >
              <div
                className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                  notif.type === 'bank'
                    ? 'bg-emerald-500/20 text-emerald-400'
                    : notif.type === 'dm'
                    ? 'bg-[#5865F2]/20 text-[#5865F2]'
                    : 'bg-amber-500/20 text-amber-400'
                }`}
              >
                {notif.type === 'bank' ? (
                  <Landmark className="w-5 h-5" />
                ) : notif.type === 'dm' ? (
                  <MessageSquare className="w-5 h-5" />
                ) : (
                  <Bell className="w-5 h-5" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-extrabold truncate">{notif.title}</div>
                <div className="text-[11px] text-zinc-300 mt-0.5 line-clamp-2 leading-relaxed">
                  {notif.message}
                </div>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  dismissNotification(notif.id)
                }}
                className="p-1 text-zinc-400 hover:text-white rounded"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Desktop Right-Click Context Menu */}
      {desktopContextMenu && (
        <div
          className="fixed z-[9999] w-56 bg-[#181a20]/95 backdrop-blur-md border border-[#2b2e37] rounded-lg shadow-2xl py-1 text-xs text-zinc-300 font-sans animate-in fade-in zoom-in-95 duration-100"
          style={{
            left: Math.max(10, Math.min(desktopContextMenu.x, window.innerWidth - 230)),
            top: desktopContextMenu.y + 300 > window.innerHeight - 40
              ? Math.max(10, desktopContextMenu.y - 300)
              : Math.min(desktopContextMenu.y, window.innerHeight - 300)
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="px-3 py-1.5 text-[10px] font-bold text-zinc-500 uppercase tracking-wider border-b border-[#2b2e37]/60">
            Masaüstü Seçenekleri
          </div>
          <button
            onClick={() => {
              launchApp('appcenter')
              setDesktopContextMenu(null)
            }}
            className="w-full text-left px-3 py-1.5 hover:bg-white/10 text-sky-400 font-semibold flex items-center justify-between"
          >
            <span>Yazılım Kurulum Merkezi</span>
          </button>
          <button
            onClick={() => {
              toggleFullscreen()
              setDesktopContextMenu(null)
            }}
            className="w-full text-left px-3 py-1.5 hover:bg-white/10 hover:text-white flex items-center justify-between"
          >
            <span>{isFullscreen ? 'Tam Ekrandan Çık' : 'Tam Ekran Modu'}</span>
            <span className="text-[10px] text-zinc-500 font-mono">F11</span>
          </button>
          <button
            onClick={() => {
              handleDrinkCoffeeAction()
              setDesktopContextMenu(null)
            }}
            className="w-full text-left px-3 py-1.5 hover:bg-white/10 hover:text-white flex items-center justify-between"
          >
            <span>Kahve İç (25₺)</span>
            <span className="text-[10px] text-zinc-500 font-mono">Alt+K</span>
          </button>
          <button
            onClick={() => {
              handlePetCatAction()
              setDesktopContextMenu(null)
            }}
            className="w-full text-left px-3 py-1.5 hover:bg-white/10 hover:text-white"
          >
            Paspas'ı Sev (15₺)
          </button>
          <div className="my-1 border-t border-[#2b2e37]/60" />
          <div className="px-3 py-1 text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
            Duvar Kağıdı
          </div>
          {[
            { id: 'default', label: 'ModOS Klasik' },
            { id: 'matrix', label: 'Matrix Terminali' },
            { id: 'synthwave', label: 'Synthwave Izgarası' },
            { id: 'cyberpunk', label: 'Sarı Amber Sibernetik' },
            { id: 'win98', label: 'Klasik Teal 98' }
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setWallpaper(item.id as any)
                setDesktopContextMenu(null)
              }}
              className={`w-full text-left px-3 py-1 text-xs hover:bg-white/10 flex items-center justify-between ${
                wallpaper === item.id ? 'text-indigo-400 font-semibold' : 'text-zinc-400'
              }`}
            >
              <span>{item.label}</span>
              {wallpaper === item.id && <span>✓</span>}
            </button>
          ))}
          <div className="my-1 border-t border-[#2b2e37]/60" />
          <button
            onClick={() => {
              setWindows((prev) => prev.map((w) => ({ ...w, isMinimized: true })))
              setDesktopContextMenu(null)
            }}
            className="w-full text-left px-3 py-1.5 text-zinc-400 hover:bg-white/10 hover:text-white"
          >
            Masaüstünü Göster
          </button>
        </div>
      )}

      {/* Night Shift Blackout Transition Overlay */}
      {isDayTransitioning && (
        <div className="fixed inset-0 z-[9999999] bg-black/95 backdrop-blur-xl flex flex-col items-center justify-center select-none text-white overflow-hidden p-6 animate-in fade-in duration-500">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(245,158,11,0.08)_0%,transparent_70%)] pointer-events-none" />

          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-[0.3em] text-amber-400/90 font-bold mb-6">
            <Moon className="w-4 h-4 text-amber-400 animate-pulse" />
            <span>Gece Dinlenmesi & Vardiya Sonu</span>
          </div>

          <div className="flex items-center justify-center gap-3 my-4">
            <span className="text-5xl md:text-7xl font-black font-mono tracking-tight text-zinc-400">
              GÜN
            </span>
            <div className="relative w-24 h-28 md:w-32 md:h-36 overflow-hidden flex items-center justify-center bg-[#101218] border border-amber-500/30 rounded-2xl shadow-2xl">
              <span className="absolute text-6xl md:text-8xl font-black font-mono text-zinc-600 animate-out slide-out-to-bottom-28 fade-out duration-1000 fill-mode-forwards select-none">
                {transitionOldDay}
              </span>
              <span className="absolute text-6xl md:text-8xl font-black font-mono text-amber-400 drop-shadow-[0_0_35px_rgba(245,158,11,0.8)] animate-in slide-in-from-top-28 duration-700 ease-out fill-mode-forwards select-none">
                {transitionNewDay}
              </span>
            </div>
          </div>

          <p className="text-xs text-zinc-400 font-mono mt-2 mb-8 text-center max-w-md">
            Günün yorgunluğu atılıyor, sunucu gece moduna geçti. Yeni vardiya için alarm kuruluyor...
          </p>

          <div className="bg-[#0b0c10] border-2 border-[#2b2e3a] rounded-2xl p-6 shadow-[0_0_50px_rgba(0,0,0,0.9)] flex flex-col items-center max-w-sm w-full space-y-4">
            <div className="text-[10px] uppercase font-mono tracking-widest text-zinc-500 flex items-center gap-1.5">
              <AlarmClock className="w-3.5 h-3.5 text-zinc-400" />
              <span>DİJİTAL ÇALAR SAAT</span>
            </div>

            <div className="font-mono text-5xl md:text-6xl font-black tracking-widest text-emerald-400 drop-shadow-[0_0_25px_rgba(52,211,153,0.6)] py-2">
              {String(sleepClockHour).padStart(2, '0')}
              <span className="animate-pulse">:</span>
              {String(sleepClockMinute).padStart(2, '0')}
            </div>

            <div className="w-full text-center">
              {sleepClockHour >= 11 ? (
                <div className="text-xs font-mono text-red-400 bg-red-950/40 border border-red-500/40 px-3 py-2 rounded-lg animate-pulse">
                  ⚠️ DİKKAT: Saat 11:00'i geçti! Kurucu_Efe çok geç kalktığın için DM'den fırça çekecek!
                </div>
              ) : sleepClockHour < 10 ? (
                <div className="text-xs font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-500/40 px-3 py-2 rounded-lg">
                  ✨ Erken kalkış (08:00 - 10:00). Kurucu Efe disiplininiz için teşekkür edip Hype verecek!
                </div>
              ) : (
                <div className="text-xs font-mono text-zinc-400 bg-[#14161f] border border-[#232634] px-3 py-2 rounded-lg">
                  Normal uyanma saati (12:00'de mecburi uyanılacaktır).
                </div>
              )}
            </div>

            <button
              onClick={() => wakeUp(sleepClockHour, sleepClockMinute)}
              className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-black text-xs uppercase tracking-wider shadow-lg shadow-amber-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <AlarmClock className="w-4 h-4 text-black" />
              <span>⏰ Uyan ve Göreve Başla ({String(sleepClockHour).padStart(2, '0')}:{String(sleepClockMinute).padStart(2, '0')})</span>
            </button>
          </div>
        </div>
      )}

      {/* Steam-Style Achievement Unlock Toast */}
      {recentAchievement && (
        <div 
          className="fixed bottom-14 left-4 z-[99999] flex items-center gap-3 bg-[#13151b] border-2 border-amber-500/80 shadow-[0_10px_30px_rgba(0,0,0,0.8)] text-white px-4 py-3 rounded-lg animate-in slide-in-from-bottom-5 duration-300 max-w-sm"
          role="alert"
        >
          <div className="w-10 h-10 rounded-md bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-xl shrink-0 shadow-inner">
            {recentAchievement.icon}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[10px] font-bold text-amber-400 uppercase tracking-widest flex items-center gap-1">
              <span>★ BAŞARIM KAZANILDI!</span>
            </div>
            <div className="text-xs font-bold text-zinc-100 truncate">
              {recentAchievement.title}
            </div>
            <div className="text-[11px] text-zinc-400 line-clamp-2">
              {recentAchievement.description}
            </div>
          </div>
          <button
            onClick={dismissAchievementToast}
            className="p-1 text-zinc-400 hover:text-white rounded hover:bg-white/10 shrink-0"
            title="Kapat"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  )
}

export const App: React.FC = () => {
  const [isInGame, setIsInGame] = useState(false)
  const [hasStartedBefore, setHasStartedBefore] = useState(false)
  const [crtEffect, setCrtEffect] = useState(false)
  const [sfxMuted, setSfxMuted] = useState(false)

  useEffect(() => {
    soundEngine.setMuted(sfxMuted)
  }, [sfxMuted])

  const handleStartGame = () => {
    setIsInGame(true)
    setHasStartedBefore(true)
  }

  const handleContinueGame = () => {
    setIsInGame(true)
  }

  const handleReturnToMenu = () => {
    setIsInGame(false)
  }

  return (
    <GameProvider>
      {isInGame ? (
        <DesktopContent 
          onReturnToMenu={handleReturnToMenu}
          crtEffect={crtEffect}
        />
      ) : (
        <MainMenu
          onStartGame={handleStartGame}
          onContinueGame={handleContinueGame}
          hasSaveGame={hasStartedBefore}
          crtEffect={crtEffect}
          onToggleCrt={() => setCrtEffect(!crtEffect)}
          sfxMuted={sfxMuted}
          onToggleSfx={() => setSfxMuted(!sfxMuted)}
        />
      )}
    </GameProvider>
  )
}
