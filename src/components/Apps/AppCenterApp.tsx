import React, { useState } from 'react'
import {
  Download,
  CheckCircle2,
  Shield,
  MessageSquare,
  Landmark,
  Mail,
  Server,
  Terminal,
  Cpu,
  Trophy,
  StickyNote,
  Gamepad2,
  Package,
  HardDrive,
  RefreshCw,
  ExternalLink,
  Utensils
} from 'lucide-react'
import { useGame } from '../../context/GameContext'
import { AppId } from '../../types/os'
import { soundEngine } from '../../utils/soundEngine'

interface InstallableSoftware {
  id: AppId
  name: string
  category: string
  size: string
  version: string
  desc: string
  badge?: string
  icon: React.ReactNode
  accentColor: string
}

const SOFTWARE_CATALOG: InstallableSoftware[] = [
  {
    id: 'iscord',
    name: 'Iscord - Moderatör İstemcisi',
    category: 'Temel Moderasyon',
    size: '84.2 MB',
    version: 'v4.8.2',
    desc: 'Sunucu kanallarını, destek biletlerini (Ticket), üye rollerini ve özel mesajları (DM) yönetmek için zorunlu moderatör istemcisi.',
    badge: 'ZORUNLU',
    icon: <MessageSquare className="w-6 h-6 text-[#5865F2]" />,
    accentColor: 'border-[#5865F2]/40 bg-[#5865F2]/10'
  },
  {
    id: 'bank',
    name: 'NeoBank Dijital Finans',
    category: 'Finans & Bankacılık',
    size: '42.0 MB',
    version: 'v3.1.0',
    desc: 'Şahsi vadesiz hesabınızı, sunucu kasasını, FAST IBAN transferlerini, kripto (ModCoin) borsasını ve kredileri yönetin.',
    badge: 'ÖNERİLEN',
    icon: <Landmark className="w-6 h-6 text-emerald-400" />,
    accentColor: 'border-emerald-500/40 bg-emerald-500/10'
  },
  {
    id: 'fooddelivery',
    name: 'Yemek Poşeti — Lezzet & Kahve',
    category: 'Yaşam & İkram',
    size: '31.2 MB',
    version: 'v2.1.0',
    desc: 'Vardiya sırasında akıl sağlığını tazelemek için taze filtre kahve, espresso, Paspas için somonlu yaş mama ve gece atıştırmalıkları siparişi verin.',
    badge: 'LEZZET',
    icon: <Utensils className="w-6 h-6 text-orange-400" />,
    accentColor: 'border-orange-500/40 bg-orange-500/10'
  },
  {
    id: 'rdp',
    name: 'Uzaktan Masaüstü Bağlantısı (VDS)',
    category: 'Sunucu & Bot Altyapısı',
    size: '61.5 MB',
    version: 'v2.4.0',
    desc: 'Kiraladığınız VDS sunucusuna uzaktan bağlanarak uzak sunucu masaüstüne erişin, bot satın alın ve botları aktif edin.',
    badge: 'BOTLAR İÇİN ŞART',
    icon: <Server className="w-6 h-6 text-cyan-400" />,
    accentColor: 'border-cyan-500/40 bg-cyan-500/10'
  },
  {
    id: 'mail',
    name: 'ModMail Kurumsal E-Posta',
    category: 'İletişim & Teklifler',
    size: '28.4 MB',
    version: 'v2.0.1',
    desc: 'Sponsorluk tekliflerini, VIP rüşvet postalarını, gelen/gönderilen/yıldızlı ve çöp kutusu klasörlerini takip edin.',
    icon: <Mail className="w-6 h-6 text-amber-400" />,
    accentColor: 'border-amber-500/40 bg-amber-500/10'
  },
  {
    id: 'terminal',
    name: 'ModOS Root Terminal (/root)',
    category: 'Siber Savunma',
    size: '19.8 MB',
    version: 'v1.9.5',
    desc: 'Baskın (Raid) anında trace_ip ve nuke_botnet komutlarıyla karşı saldırı yapın, çöken botları restart_bots ile sıfırlayın.',
    icon: <Terminal className="w-6 h-6 text-green-400" />,
    accentColor: 'border-green-500/40 bg-green-500/10'
  },
  {
    id: 'store',
    name: 'Donanım & Setup Yöneticisi',
    category: 'Sistem & Donanım',
    size: '35.1 MB',
    version: 'v1.4.2',
    desc: 'Sahip olduğunuz masaüstü ekipmanlarını, çift monitör ve kahve makinesi yükseltmelerini görüntüleyin.',
    icon: <Cpu className="w-6 h-6 text-purple-400" />,
    accentColor: 'border-purple-500/40 bg-purple-500/10'
  },
  {
    id: 'notes',
    name: 'Mod Notları & Rehber',
    category: 'Araçlar',
    size: '12.0 MB',
    version: 'v1.1.0',
    desc: 'Şüpheli kullanıcıları, VDS erişim kodlarını ve kurucu talimatlarını not almak için masaüstü not defteri.',
    icon: <StickyNote className="w-6 h-6 text-yellow-400" />,
    accentColor: 'border-yellow-500/40 bg-yellow-500/10'
  },
  {
    id: 'achievements',
    name: 'Başarımlar & Rozet Merkezi',
    category: 'Profil',
    size: '16.5 MB',
    version: 'v1.2.0',
    desc: 'Moderatörlük kariyerinizde açtığınız ve kilitli olan tüm başarımları takip edin.',
    icon: <Trophy className="w-6 h-6 text-orange-400" />,
    accentColor: 'border-orange-500/40 bg-orange-500/10'
  }
]

interface AppCenterProps {
  onOpenApp?: (id: AppId) => void
}

export const AppCenterApp: React.FC<AppCenterProps> = ({ onOpenApp }) => {
  const { installedApps, installApp } = useGame()
  const [downloadingMap, setDownloadingMap] = useState<Record<string, number>>({})
  const [installingAll, setInstallingAll] = useState(false)

  const handleInstall = (appId: AppId) => {
    if (installedApps.includes(appId) || downloadingMap[appId] !== undefined) return
    soundEngine.playKeyClick()
    setDownloadingMap((prev) => ({ ...prev, [appId]: 10 }))

    const interval = setInterval(() => {
      setDownloadingMap((prev) => {
        const current = prev[appId] ?? 0
        if (current >= 100) {
          clearInterval(interval)
          return prev
        }
        const next = Math.min(100, current + Math.floor(25 + Math.random() * 25))
        if (next >= 100) {
          clearInterval(interval)
          setTimeout(() => {
            installApp(appId)
            setDownloadingMap((d) => {
              const copy = { ...d }
              delete copy[appId]
              return copy
            })
          }, 250)
        }
        return { ...prev, [appId]: next }
      })
    }, 220)
  }

  const handleInstallAll = () => {
    const missing = SOFTWARE_CATALOG.filter((s) => !installedApps.includes(s.id))
    if (missing.length === 0 || installingAll) return
    setInstallingAll(true)
    missing.forEach((soft, idx) => {
      setTimeout(() => {
        handleInstall(soft.id)
        if (idx === missing.length - 1) {
          setTimeout(() => setInstallingAll(false), 1200)
        }
      }, idx * 350)
    })
  }

  const installedCount = SOFTWARE_CATALOG.filter((s) => installedApps.includes(s.id)).length

  return (
    <div className="flex flex-col h-full bg-[#0b0e17] text-zinc-100 select-none overflow-hidden">
      {/* Header Banner */}
      <div className="p-5 bg-gradient-to-r from-indigo-950/80 via-[#111625] to-slate-900 border-b border-white/10 flex flex-wrap items-center justify-between gap-4 shrink-0">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center shadow-lg">
            <Package className="w-7 h-7 text-indigo-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-black tracking-tight text-white">ModOS Yazılım Kurulum Merkezi</h1>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                RESMİ DEPO
              </span>
            </div>
            <p className="text-xs text-zinc-400 mt-0.5">
              Yeni kurulan işletim sisteminize moderasyon, finans ve VDS uzak bağlantı araçlarını indirin.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3.5 py-2 rounded-xl bg-black/40 border border-white/10 text-xs flex items-center gap-2">
            <HardDrive className="w-4 h-4 text-emerald-400" />
            <span className="text-zinc-400">Kurulu Paket:</span>
            <span className="font-mono font-bold text-white">
              {installedCount} / {SOFTWARE_CATALOG.length}
            </span>
          </div>

          {installedCount < SOFTWARE_CATALOG.length && (
            <button
              onClick={handleInstallAll}
              disabled={installingAll}
              className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-indigo-600/25 transition-all cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Tümünü Tek Tıkla Kur</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Grid */}
      <div className="flex-1 overflow-y-auto p-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {SOFTWARE_CATALOG.map((item) => {
            const isInstalled = installedApps.includes(item.id)
            const progress = downloadingMap[item.id]
            const isDownloading = progress !== undefined

            return (
              <div
                key={item.id}
                className={`p-4 rounded-2xl border transition-all flex flex-col justify-between gap-3 ${
                  isInstalled
                    ? 'bg-zinc-900/50 border-emerald-500/30'
                    : 'bg-zinc-900/90 border-white/10 hover:border-indigo-500/40'
                }`}
              >
                <div className="flex items-start gap-3.5">
                  <div className={`w-12 h-12 rounded-xl border flex items-center justify-center shrink-0 ${item.accentColor}`}>
                    {item.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-bold text-sm text-white truncate">{item.name}</h3>
                      {item.badge && (
                        <span className="text-[9px] font-black px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                          {item.badge}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-zinc-500 font-mono mt-0.5">
                      <span>{item.category}</span>
                      <span>•</span>
                      <span>{item.size}</span>
                      <span>•</span>
                      <span>{item.version}</span>
                    </div>
                    <p className="text-xs text-zinc-400 mt-2 leading-relaxed">{item.desc}</p>
                  </div>
                </div>

                {/* Bottom Action / Progress Bar */}
                <div className="pt-2 border-t border-white/5 flex items-center justify-between gap-3">
                  {isDownloading ? (
                    <div className="w-full">
                      <div className="flex justify-between text-[11px] font-mono text-indigo-300 mb-1">
                        <span className="flex items-center gap-1.5">
                          <RefreshCw className="w-3 h-3 animate-spin" /> Masaüstüne kuruluyor...
                        </span>
                        <span>%{progress}</span>
                      </div>
                      <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400 transition-all duration-200"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
                  ) : isInstalled ? (
                    <div className="w-full flex items-center justify-between">
                      <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4" /> Masaüstüne Yüklendi
                      </span>
                      {onOpenApp && (
                        <button
                          onClick={() => onOpenApp(item.id)}
                          className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          <span>Uygulamayı Aç</span>
                        </button>
                      )}
                    </div>
                  ) : (
                    <div className="w-full flex items-center justify-between">
                      <span className="text-[11px] text-zinc-500 flex items-center gap-1">
                        <Shield className="w-3.5 h-3.5 text-emerald-500" /> Doğrulanmış Paket
                      </span>
                      <button
                        onClick={() => handleInstall(item.id)}
                        className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 shadow transition-all cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Yükle ({item.size})</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {/* Stam Games Note */}
        <div className="mt-5 p-4 rounded-2xl bg-gradient-to-r from-purple-950/40 to-zinc-900 border border-purple-500/20 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Gamepad2 className="w-6 h-6 text-purple-400 shrink-0" />
            <div className="text-xs text-zinc-300">
              <strong className="text-white">Stam Oyun İstemcisi (Retro Oyunlar):</strong> Stam masaüstü uygulamasını indirmek için{' '}
              <span className="text-purple-300 font-bold">Web Tarayıcı → Stam Games</span> adresini ziyaret edin.
            </div>
          </div>
          {installedApps.includes('stam') && (
            <span className="text-xs font-bold text-emerald-400 shrink-0">✓ Stam Kurulu</span>
          )}
        </div>
      </div>
    </div>
  )
}
