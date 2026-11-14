import React from 'react'
import { 
  MessageSquare, 
  Globe, 
  Terminal, 
  ShoppingBag, 
  FileText, 
  Power, 
  RotateCcw,
  UserCheck,
  TrendingUp,
  Wallet,
  Mail,
  Landmark,
  Trophy,
  Maximize2,
  Minimize2,
  DownloadCloud,
  Server,
  Utensils
} from 'lucide-react'
import type { AppId } from '../../types/os'
import { useGame } from '../../context/GameContext'

interface StartMenuProps {
  isOpen: boolean
  onClose: () => void
  onLaunchApp: (id: AppId) => void
  hype: number
  balance: number
  serverFunds: number
  onReturnToMenu?: () => void
  isFullscreen?: boolean
  onToggleFullscreen?: () => void
}

export const StartMenu: React.FC<StartMenuProps> = ({
  isOpen,
  onClose,
  onLaunchApp,
  hype,
  balance,
  serverFunds,
  onReturnToMenu,
  isFullscreen,
  onToggleFullscreen
}) => {
  const { installedApps, iscordAccount } = useGame()

  if (!isOpen) return null

  const allApps: { id: AppId; name: string; desc: string; icon: React.ReactNode }[] = [
    {
      id: 'appcenter',
      name: 'Yazılım Kurulum Merkezi',
      desc: 'Masaüstü Uygulamalarını İndir ve Kur',
      icon: <DownloadCloud className="w-6 h-6 text-sky-400" />
    },
    {
      id: 'iscord',
      name: 'Iscord',
      desc: 'Topluluk Moderasyon İstemcisi',
      icon: <MessageSquare className="w-6 h-6 text-[#5865F2]" />
    },
    {
      id: 'fooddelivery',
      name: 'Yemek Poşeti',
      desc: 'Kahve, Kedi Maması & Gece Atıştırmalıkları',
      icon: <Utensils className="w-6 h-6 text-orange-400" />
    },
    {
      id: 'rdp',
      name: 'Uzaktan Bağlantı (VDS)',
      desc: 'Uzak VDS Masaüstü & Bot Aktivatörü',
      icon: <Server className="w-6 h-6 text-purple-400" />
    },
    {
      id: 'bank',
      name: 'NeoBank ModFinans',
      desc: 'Bireysel & Sunucu Kasa Portalı, Kredi, Havale',
      icon: <Landmark className="w-6 h-6 text-emerald-400" />
    },
    {
      id: 'mail',
      name: 'ModMail (İletiler)',
      desc: 'Gelen Kutusu, Yıldızlı, Gönderilen & Çöp',
      icon: <Mail className="w-6 h-6 text-amber-400" />
    },
    {
      id: 'browser',
      name: 'Web Tarayıcı',
      desc: 'İnternet, CloudVDS, DonanımSepeti, Kumar',
      icon: <Globe className="w-6 h-6 text-sky-400" />
    },
    {
      id: 'terminal',
      name: 'Terminal (/root)',
      desc: 'Hızlı CLI Komut & Anti-Raid Sistemi',
      icon: <Terminal className="w-6 h-6 text-emerald-400" />
    },
    {
      id: 'store',
      name: 'Donanım & Setup',
      desc: 'Battlestation Yükseltmeleri & Sepet',
      icon: <ShoppingBag className="w-6 h-6 text-amber-400" />
    },
    {
      id: 'achievements',
      name: 'Başarımlar & Madalyalar',
      desc: 'Kazanılan Rozetler ve Kilitli Sırlar',
      icon: <Trophy className="w-6 h-6 text-amber-400" />
    },
    {
      id: 'notes',
      name: 'Görev & Notlar',
      desc: 'Günün Hedefleri ve Kurallar',
      icon: <FileText className="w-6 h-6 text-zinc-300" />
    }
  ]

  const visibleApps = allApps.filter((a) => installedApps.includes(a.id))

  return (
    <>
      {/* Backdrop to close when clicking outside */}
      <div 
        className="fixed inset-0 z-[9990]" 
        onClick={onClose} 
      />

      <div className="absolute bottom-[46px] left-2 w-80 sm:w-96 bg-[#14161b] border border-[#2b2e37] rounded-xl shadow-2xl z-[9995] overflow-hidden flex flex-col animate-in fade-in slide-in-from-bottom-2 duration-150">
        {/* Header / Admin Identity */}
        <div className="p-3.5 bg-[#181a20] border-b border-[#262932] flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center font-bold text-white shadow-inner"
              style={{ backgroundColor: iscordAccount.avatarColor || '#5865F2' }}
            >
              <UserCheck className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="text-xs font-bold text-zinc-100 flex items-center gap-1.5">
                <span>{iscordAccount.isRegistered ? iscordAccount.username : 'Yeni Moderatör'}</span>
                <span className="text-[10px] px-1.5 py-0.2 bg-emerald-950 text-emerald-400 border border-emerald-800 rounded font-mono">
                  ONLINE
                </span>
              </div>
              <div className="text-[11px] text-zinc-400">ModOS Workstation v4.5</div>
            </div>
          </div>
        </div>

        {/* Live Stats Row */}
        <div className="grid grid-cols-3 gap-1.5 p-2.5 bg-[#111215] border-b border-[#22242b] text-[10px]">
          <div className="p-1.5 rounded bg-[#181a20] border border-[#242730] flex flex-col justify-between">
            <span className="text-zinc-400 flex items-center gap-1">
              <TrendingUp className="w-3 h-3 text-amber-400" /> Hype
            </span>
            <span className="font-mono font-bold text-amber-300 mt-1">%{hype}</span>
          </div>
          <button 
            onClick={() => {
              if (installedApps.includes('bank')) {
                onLaunchApp('bank')
              } else {
                onLaunchApp('appcenter')
              }
              onClose()
            }}
            title="Banka Hesabını Aç"
            className="p-1.5 rounded bg-[#181a20] hover:bg-[#20242e] border border-[#242730] hover:border-emerald-500/50 flex flex-col justify-between text-left transition-colors cursor-pointer group"
          >
            <span className="text-zinc-400 flex items-center gap-1 group-hover:text-emerald-300">
              <Wallet className="w-3 h-3 text-emerald-400" /> Bakiye
            </span>
            <span className="font-mono font-bold text-emerald-300 mt-1">{balance}₺</span>
          </button>
          <button 
            onClick={() => {
              if (installedApps.includes('bank')) {
                onLaunchApp('bank')
              } else {
                onLaunchApp('appcenter')
              }
              onClose()
            }}
            title="Sunucu Kasasını Aç"
            className="p-1.5 rounded bg-[#181a20] hover:bg-[#20242e] border border-[#242730] hover:border-sky-500/50 flex flex-col justify-between text-left transition-colors cursor-pointer group"
          >
            <span className="text-zinc-400 flex items-center gap-1 group-hover:text-sky-300">
              <span className="text-sky-400 font-bold">₺</span> Kasa
            </span>
            <span className="font-mono font-bold text-sky-300 mt-1">{serverFunds}₺</span>
          </button>
        </div>

        {/* App list with Larger Icons */}
        <div className="p-2.5 space-y-1 max-h-[380px] overflow-y-auto">
          <div className="px-2 py-1 text-[10px] font-bold text-zinc-500 uppercase tracking-wider flex items-center justify-between">
            <span>Kurulu Uygulamalar ({visibleApps.length})</span>
            {visibleApps.length < allApps.length && (
              <span className="text-sky-400 text-[9px]">Eksikleri Kurulum Merkezinden Yükleyin</span>
            )}
          </div>
          {visibleApps.map((app) => (
            <button
              key={app.id}
              onClick={() => {
                onLaunchApp(app.id)
                onClose()
              }}
              className="w-full flex items-center space-x-3 p-2.5 rounded-lg hover:bg-[#20222a] text-left transition-colors group cursor-pointer"
            >
              <div className="w-11 h-11 flex items-center justify-center rounded-xl bg-[#181a20] border border-[#262932] group-hover:border-[#3e4552] shadow-sm shrink-0">
                {app.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-bold text-zinc-100 group-hover:text-white">
                  {app.name}
                </div>
                <div className="text-[11px] text-zinc-400 truncate">
                  {app.desc}
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Footer controls */}
        <div className="p-2.5 bg-[#101114] border-t border-[#22242b] flex items-center justify-between text-xs text-zinc-400">
          <div className="flex items-center gap-1">
            <button 
              onClick={() => window.location.reload()} 
              className="flex items-center gap-1.5 px-2 py-1 rounded hover:bg-white/5 text-zinc-300 hover:text-white cursor-pointer"
              title="Sistemi Yeniden Başlat"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="text-[11px]">Yeniden Başlat</span>
            </button>
            {onToggleFullscreen && (
              <button 
                onClick={onToggleFullscreen} 
                className="flex items-center gap-1.5 px-2 py-1 rounded hover:bg-white/5 text-zinc-300 hover:text-white cursor-pointer"
                title="Tam Ekran Modunu Değiştir (F11)"
              >
                {isFullscreen ? <Minimize2 className="w-3.5 h-3.5 text-sky-400" /> : <Maximize2 className="w-3.5 h-3.5" />}
                <span className="text-[11px]">Tam Ekran</span>
              </button>
            )}
          </div>
          <button 
            onClick={() => {
              onClose()
              if (onReturnToMenu) onReturnToMenu()
            }}
            className="flex items-center gap-1.5 px-2 py-1 rounded hover:bg-red-500/10 text-zinc-400 hover:text-red-400 cursor-pointer"
            title="Oturumu Kapat ve Ana Menüye Dön"
          >
            <Power className="w-3.5 h-3.5" />
            <span className="text-[11px]">Ana Menü</span>
          </button>
        </div>
      </div>
    </>
  )
}
