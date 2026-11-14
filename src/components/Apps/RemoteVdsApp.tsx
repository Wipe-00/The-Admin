import React, { useState } from 'react'
import {
  Server,
  Bot,
  Power,
  Cpu,
  Shield,
  Music,
  Coins,
  UserPlus,
  ShieldAlert,
  Download,
  CheckCircle2,
  Play,
  Square,
  RefreshCw,
  LogOut,
  KeyRound,
  Monitor,
  Sliders,
  Plus,
  X,
  Activity
} from 'lucide-react'
import { useGame } from '../../context/GameContext'
import { soundEngine } from '../../utils/soundEngine'

interface VdsBotCatalogItem {
  id: string
  name: string
  cost: number
  ramUsage: string
  desc: string
  icon: React.ReactNode
  badge: string
}

const VDS_BOT_CATALOG: VdsBotCatalogItem[] = [
  {
    id: 'automod_bot',
    name: 'AutoMod Güvenlik Botu',
    cost: 800,
    ramUsage: '512 MB RAM',
    desc: 'Sohbetteki reklam linklerini, küfürleri ve aktif baskın (Raid) botlarını VDS üzerinden otomatik tespit edip siler/banlar.',
    icon: <Shield className="w-6 h-6 text-blue-400" />,
    badge: 'GÜVENLİK ŞARTI'
  },
  {
    id: 'music_bot',
    name: 'RitimBot 7/24 Müzik',
    cost: 650,
    ramUsage: '768 MB RAM',
    desc: 'Üyelerin !play komutuyla ses kanalında Phonk ve Synthwave dinlemesini sağlar. Sunucu Hype değerini sürekli artırır (+3 Hype).',
    icon: <Music className="w-6 h-6 text-pink-400" />,
    badge: 'HYPE MOTORU'
  },
  {
    id: 'casino_bot',
    name: 'KasaBot Ekonomi & Slot',
    cost: 1100,
    ramUsage: '1.0 GB RAM',
    desc: 'Üyeler sohbette !slot oynar. Her oyundan kesilen +15₺ kasa komisyonu doğrudan sunucu fonuna pasif gelir olarak akar!',
    icon: <Coins className="w-6 h-6 text-amber-400" />,
    badge: 'PASİF GELİR'
  },
  {
    id: 'welcome_bot',
    name: 'GirişBot Otomatik Karşılama',
    cost: 450,
    ramUsage: '256 MB RAM',
    desc: 'Yeni katılan üyeleri otomatik karşılar ve topluluk sadakatini korur.',
    icon: <UserPlus className="w-6 h-6 text-emerald-400" />,
    badge: 'BAŞLANGIÇ'
  },
  {
    id: 'antiraid_bot',
    name: 'AntiRaid Kalkan Pro',
    cost: 1500,
    ramUsage: '1.5 GB RAM',
    desc: 'Yüksek boyutlu botnet saldırılarına karşı gelişmiş VDS güvenlik duvarı sağlar.',
    icon: <ShieldAlert className="w-6 h-6 text-red-400" />,
    badge: 'ELİT KORUMA'
  }
]

const VDS_APPLICATIONS = [
  {
    id: 'bot_controller',
    name: 'BotMarket & Aktivatör',
    desc: 'Sunucu için bot satın alın ve VDS üzerinde botları Aktif / Pasif duruma getirin.',
    size: '45 MB'
  },
  {
    id: 'vds_botbuilder',
    name: 'BotBuilder Kural IDE',
    desc: 'AutoMod küfür filtrelerini ve reklam link engelleme kurallarını kodlayın.',
    size: '32 MB'
  },
  {
    id: 'vds_monitor',
    name: 'VDS Sistem Monitörü',
    desc: 'VDS RAM/CPU yükünü izleyin ve çöken (Glitch) botları yeniden başlatın.',
    size: '18 MB'
  }
]

export const RemoteVdsApp: React.FC = () => {
  const {
    hasVds,
    vdsIp,
    vdsAccessCode,
    isVdsConnected,
    rentVds,
    connectToVds,
    disconnectVds,
    vdsInstalledApps,
    installVdsApp,
    ownedBots,
    buyBot,
    activeBots,
    toggleBotActive,
    serverFunds,
    personalCash,
    botRules,
    updateBotRules,
    botGlitchActive,
    restartBots
  } = useGame()

  const [inputIp, setInputIp] = useState(vdsIp)
  const [inputCode, setInputCode] = useState('')
  const [statusMessage, setStatusMessage] = useState<{ type: 'ok' | 'err'; text: string } | null>(null)
  const [activeVdsWindow, setActiveVdsWindow] = useState<string>('bot_controller')
  const [newWordInput, setNewWordInput] = useState('')

  const handleRent = (source: 'server' | 'personal') => {
    const res = rentVds(source)
    setStatusMessage({ type: res.success ? 'ok' : 'err', text: res.message })
    if (res.success) {
      setInputCode(vdsAccessCode)
    }
  }

  const handleConnect = (e: React.FormEvent) => {
    e.preventDefault()
    const res = connectToVds(inputCode)
    setStatusMessage({ type: res.success ? 'ok' : 'err', text: res.message })
  }

  const handleAddWord = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = newWordInput.trim().toLowerCase()
    if (!trimmed || botRules.customWords.includes(trimmed)) return
    soundEngine.playKeyClick()
    updateBotRules({
      ...botRules,
      customWords: [...botRules.customWords, trimmed]
    })
    setNewWordInput('')
  }

  const handleRemoveWord = (w: string) => {
    soundEngine.playKeyClick()
    updateBotRules({
      ...botRules,
      customWords: botRules.customWords.filter((item) => item !== w)
    })
  }

  // 1. NOT CONNECTED YET -> RDP LOGIN & VDS RENTAL SCREEN
  if (!isVdsConnected) {
    return (
      <div className="flex flex-col h-full bg-[#090d16] text-zinc-100 select-none overflow-y-auto p-6 items-center justify-center">
        <div className="w-full max-w-xl bg-[#111827] border border-cyan-500/30 rounded-2xl shadow-2xl overflow-hidden">
          {/* Top Header */}
          <div className="p-5 bg-gradient-to-r from-cyan-950/80 via-slate-900 to-indigo-950/80 border-b border-white/10 flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center">
              <Monitor className="w-7 h-7 text-cyan-400" />
            </div>
            <div>
              <h1 className="text-lg font-black text-white tracking-tight">
                ModOS Uzaktan Masaüstü Bağlantısı (RDP)
              </h1>
              <p className="text-xs text-cyan-300/80">
                Bot satın almak ve 7/24 çalıştırmak için uzak VDS sunucu masaüstüne bağlanın.
              </p>
            </div>
          </div>

          <div className="p-6 space-y-5">
            {statusMessage && (
              <div
                className={`p-3.5 rounded-xl border text-xs font-bold flex items-center justify-between ${
                  statusMessage.type === 'ok'
                    ? 'bg-emerald-950/70 border-emerald-500/50 text-emerald-200'
                    : 'bg-red-950/70 border-red-500/50 text-red-200'
                }`}
              >
                <span>{statusMessage.text}</span>
                <button onClick={() => setStatusMessage(null)} className="text-zinc-400 hover:text-white ml-2">
                  ✕
                </button>
              </div>
            )}

            {/* Step 1: VDS Rental Status */}
            {!hasVds ? (
              <div className="p-5 rounded-xl bg-amber-950/30 border border-amber-500/40 space-y-4">
                <div className="flex items-start gap-3">
                  <Server className="w-6 h-6 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-sm font-black text-amber-200">
                      ⚠️ Aktif VDS Sunucunuz Bulunmuyor!
                    </h3>
                    <p className="text-xs text-zinc-300 mt-1 leading-relaxed">
                      Sunucuya bot kurabilmek ve botları aktif edebilmek için önce bir{' '}
                      <strong className="text-white">CloudVDS Sanal Sunucu (450₺)</strong> kiralamalısınız. VDS olmadan bot satın alınamaz ve çalıştırılamaz.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <button
                    onClick={() => handleRent('server')}
                    className="py-3 px-4 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs flex flex-col items-center gap-1 shadow-lg cursor-pointer transition-all"
                  >
                    <span>🏢 Sunucu Kasasından VDS Kirala (450₺)</span>
                    <span className="text-[10px] text-cyan-100 font-mono">Mevcut Kasa: {serverFunds}₺</span>
                  </button>
                  <button
                    onClick={() => handleRent('personal')}
                    className="py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex flex-col items-center gap-1 shadow-lg cursor-pointer transition-all"
                  >
                    <span>💳 Şahsi Nakitten VDS Kirala (450₺)</span>
                    <span className="text-[10px] text-indigo-100 font-mono">Şahsi Bakiye: {personalCash}₺</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/40 flex items-center justify-between gap-4">
                <div>
                  <div className="text-xs font-bold text-emerald-300 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" /> Aktif VDS Sunucu Bilgileriniz:
                  </div>
                  <div className="mt-1.5 flex flex-wrap items-center gap-3 font-mono text-xs">
                    <span className="px-2.5 py-1 rounded bg-black/50 text-cyan-300 border border-cyan-500/30">
                      IP: <strong>{vdsIp}</strong>
                    </span>
                    <span className="px-2.5 py-1 rounded bg-black/50 text-amber-300 border border-amber-500/30">
                      VDS Kodu: <strong>{vdsAccessCode}</strong>
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    soundEngine.playKeyClick()
                    setInputIp(vdsIp)
                    setInputCode(vdsAccessCode)
                  }}
                  className="px-3 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shrink-0 cursor-pointer"
                >
                  Kodu Otomatik Doldur
                </button>
              </div>
            )}

            {/* Step 2: RDP Connection Form */}
            <form onSubmit={handleConnect} className="space-y-4 pt-2 border-t border-white/10">
              <div>
                <label className="block text-xs font-bold text-zinc-400 mb-1.5">
                  Uzak VDS IP Adresi:
                </label>
                <input
                  type="text"
                  value={inputIp}
                  onChange={(e) => setInputIp(e.target.value)}
                  placeholder="185.142.88.40:3389"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/15 text-sm font-mono text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-400 mb-1.5">
                  VDS Güvenlik & Erişim Kodu:
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    value={inputCode}
                    onChange={(e) => setInputCode(e.target.value)}
                    placeholder={hasVds ? `Erişim kodunuzu girin (${vdsAccessCode})` : 'Önce VDS kiralayın...'}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-black/50 border border-white/15 text-sm font-mono text-amber-300 focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={!hasVds}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 disabled:opacity-40 text-white font-black text-sm shadow-lg shadow-cyan-600/25 flex items-center justify-center gap-2 cursor-pointer transition-all"
              >
                <Power className="w-4 h-4" />
                <span>Uzak VDS Masaüstüne Bağlan</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    )
  }

  // 2. CONNECTED TO VDS -> FULL REMOTE VDS DESKTOP ENVIRONMENT!
  const cpuLoad = Math.min(98, 14 + activeBots.length * 16 + (botGlitchActive ? 45 : 0))
  const ramUsedGb = +(0.8 + activeBots.length * 0.75).toFixed(1)

  return (
    <div
      className="flex flex-col h-full text-zinc-100 select-none overflow-hidden relative"
      style={{
        background: 'radial-gradient(circle at 20% 20%, #0d2b3e 0%, #07131d 55%, #04090e 100%)'
      }}
    >
      {/* Remote VDS Top Status Bar */}
      <div className="h-11 px-4 bg-black/70 backdrop-blur-md border-b border-cyan-500/30 flex items-center justify-between gap-4 shrink-0 z-20">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 text-xs font-mono font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            VDS-OS // {vdsIp}
          </span>
          <span className="text-xs text-zinc-400 hidden sm:inline">
            Ubuntu Server 24.04 LTS (Uzak Masaüstü Oturumu)
          </span>
        </div>

        <div className="flex items-center gap-3 text-xs font-mono">
          <div className="px-2.5 py-1 rounded bg-zinc-900/90 border border-white/10 text-zinc-300">
            CPU: <strong className={cpuLoad > 80 ? 'text-red-400' : 'text-emerald-400'}>%{cpuLoad}</strong>
          </div>
          <div className="px-2.5 py-1 rounded bg-zinc-900/90 border border-white/10 text-zinc-300">
            RAM: <strong className="text-cyan-300">{ramUsedGb} / 8.0 GB</strong>
          </div>
          <div className="px-2.5 py-1 rounded bg-zinc-900/90 border border-white/10 text-zinc-300">
            Sunucu Kasası: <strong className="text-emerald-400">{serverFunds}₺</strong>
          </div>
          <button
            onClick={disconnectVds}
            className="px-3 py-1 rounded-lg bg-red-600/80 hover:bg-red-600 text-white font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>VDS Bağlantısını Kes</span>
          </button>
        </div>
      </div>

      {/* Main VDS Desktop Workspace */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Left VDS Desktop Shortcuts Column */}
        <div className="w-36 p-3 flex flex-col gap-3 border-r border-white/5 bg-black/25 shrink-0 z-10">
          <div className="text-[10px] font-mono uppercase tracking-wider text-cyan-400/80 px-1">
            VDS Masaüstü
          </div>

          {/* Always installed on VDS: VDS Paket Kurucu */}
          <button
            onClick={() => {
              soundEngine.playKeyClick()
              setActiveVdsWindow('vds_installer')
            }}
            className={`p-2.5 rounded-xl border flex flex-col items-center text-center gap-1.5 transition-all cursor-pointer ${
              activeVdsWindow === 'vds_installer'
                ? 'bg-cyan-500/25 border-cyan-400 shadow-lg'
                : 'bg-black/40 border-white/10 hover:bg-white/10'
            }`}
          >
            <Download className="w-7 h-7 text-cyan-400" />
            <span className="text-[11px] font-bold text-white leading-tight">
              VDS Paket Yükleyici
            </span>
          </button>

          {/* Installed VDS Apps */}
          {vdsInstalledApps.includes('bot_controller') && (
            <button
              onClick={() => {
                soundEngine.playKeyClick()
                setActiveVdsWindow('bot_controller')
              }}
              className={`p-2.5 rounded-xl border flex flex-col items-center text-center gap-1.5 transition-all cursor-pointer ${
                activeVdsWindow === 'bot_controller'
                  ? 'bg-emerald-500/25 border-emerald-400 shadow-lg'
                  : 'bg-black/40 border-white/10 hover:bg-white/10'
              }`}
            >
              <Bot className="w-7 h-7 text-emerald-400" />
              <span className="text-[11px] font-bold text-white leading-tight">
                BotMarket & Aktivatör
              </span>
            </button>
          )}

          {vdsInstalledApps.includes('vds_botbuilder') && (
            <button
              onClick={() => {
                soundEngine.playKeyClick()
                setActiveVdsWindow('vds_botbuilder')
              }}
              className={`p-2.5 rounded-xl border flex flex-col items-center text-center gap-1.5 transition-all cursor-pointer ${
                activeVdsWindow === 'vds_botbuilder'
                  ? 'bg-indigo-500/25 border-indigo-400 shadow-lg'
                  : 'bg-black/40 border-white/10 hover:bg-white/10'
              }`}
            >
              <Sliders className="w-7 h-7 text-indigo-400" />
              <span className="text-[11px] font-bold text-white leading-tight">
                BotBuilder Kural IDE
              </span>
            </button>
          )}

          {vdsInstalledApps.includes('vds_monitor') && (
            <button
              onClick={() => {
                soundEngine.playKeyClick()
                setActiveVdsWindow('vds_monitor')
              }}
              className={`p-2.5 rounded-xl border flex flex-col items-center text-center gap-1.5 transition-all cursor-pointer ${
                activeVdsWindow === 'vds_monitor'
                  ? 'bg-amber-500/25 border-amber-400 shadow-lg'
                  : 'bg-black/40 border-white/10 hover:bg-white/10'
              }`}
            >
              <Activity className="w-7 h-7 text-amber-400" />
              <span className="text-[11px] font-bold text-white leading-tight">
                VDS Sistem Monitörü
              </span>
            </button>
          )}
        </div>

        {/* Right VDS Active Application Window */}
        <div className="flex-1 p-4 overflow-y-auto">
          {/* WINDOW 1: VDS PACKAGE INSTALLER */}
          {activeVdsWindow === 'vds_installer' && (
            <div className="bg-[#0b131e]/95 border border-cyan-500/30 rounded-2xl p-5 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2.5">
                  <Download className="w-5 h-5 text-cyan-400" />
                  <h2 className="text-base font-black text-white">
                    VDS Sunucu Yazılım & Paket Yöneticisi
                  </h2>
                </div>
                <span className="text-xs text-cyan-300 font-mono">apt-get vds-repo</span>
              </div>
              <p className="text-xs text-zinc-300">
                Uzak VDS sunucunuzda kullanmak istediğiniz bot yönetim ve izleme araçlarını VDS masaüstüne kurun:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {VDS_APPLICATIONS.map((app) => {
                  const isInstalled = vdsInstalledApps.includes(app.id)
                  return (
                    <div
                      key={app.id}
                      className="p-4 rounded-xl bg-black/40 border border-white/10 flex flex-col justify-between gap-3"
                    >
                      <div>
                        <div className="font-bold text-sm text-white">{app.name}</div>
                        <div className="text-[11px] text-cyan-400 font-mono mt-0.5">{app.size}</div>
                        <p className="text-xs text-zinc-400 mt-2">{app.desc}</p>
                      </div>
                      {isInstalled ? (
                        <button
                          onClick={() => setActiveVdsWindow(app.id)}
                          className="w-full py-2 rounded-lg bg-emerald-600/30 border border-emerald-500/40 text-emerald-300 text-xs font-bold cursor-pointer"
                        >
                          ✓ Kurulu (Aç)
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            installVdsApp(app.id)
                            setActiveVdsWindow(app.id)
                          }}
                          className="w-full py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold cursor-pointer"
                        >
                          VDS Masaüstüne Kur
                        </button>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* WINDOW 2: BOT MARKET & BOT ACTIVATOR (ONLY PLACE TO BUY & ACTIVATE BOTS) */}
          {activeVdsWindow === 'bot_controller' && (
            <div className="bg-[#0b131e]/95 border border-emerald-500/30 rounded-2xl p-5 shadow-2xl space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-3">
                <div className="flex items-center gap-2.5">
                  <Bot className="w-6 h-6 text-emerald-400" />
                  <div>
                    <h2 className="text-base font-black text-white">
                      VDS BotMarket & Servis Aktivatörü
                    </h2>
                    <p className="text-xs text-zinc-400">
                      Botlar yalnızca bu VDS konsolundan satın alınabilir ve aktif/pasif yapılabilir.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs font-mono">
                  <span className="px-3 py-1.5 rounded-lg bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 font-bold">
                    Aktif Bot: {activeBots.length} / {ownedBots.length}
                  </span>
                  <span className="px-3 py-1.5 rounded-lg bg-zinc-900 border border-white/10 text-white font-bold">
                    Sunucu Kasası: {serverFunds}₺
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {VDS_BOT_CATALOG.map((bot) => {
                  const isOwned = ownedBots.includes(bot.id)
                  const isActive = activeBots.includes(bot.id)

                  return (
                    <div
                      key={bot.id}
                      className={`p-4 rounded-xl border transition-all flex flex-col justify-between gap-3 ${
                        isOwned
                          ? isActive
                            ? 'bg-emerald-950/30 border-emerald-500/50'
                            : 'bg-zinc-900/70 border-amber-500/40'
                          : 'bg-black/40 border-white/10'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="p-2.5 rounded-xl bg-black/50 border border-white/10 shrink-0">
                          {bot.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <h3 className="font-bold text-sm text-white truncate">{bot.name}</h3>
                            <span className="text-[9px] font-black px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 shrink-0">
                              {bot.badge}
                            </span>
                          </div>
                          <div className="text-[11px] text-zinc-400 font-mono mt-0.5">
                            Kaynak: {bot.ramUsage} • Lisans: {bot.cost}₺
                          </div>
                          <p className="text-xs text-zinc-300 mt-2 leading-relaxed">{bot.desc}</p>
                        </div>
                      </div>

                      <div className="pt-2.5 border-t border-white/10 flex items-center justify-between gap-2">
                        {!isOwned ? (
                          <>
                            <span className="text-xs font-mono font-bold text-amber-300">
                              Ücret: {bot.cost}₺ (Sunucu Kasası)
                            </span>
                            <button
                              onClick={() => buyBot(bot.id, bot.cost)}
                              disabled={serverFunds < bot.cost}
                              className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all"
                            >
                              <Download className="w-3.5 h-3.5" />
                              <span>VDS'e Satın Al & Kur</span>
                            </button>
                          </>
                        ) : (
                          <>
                            <div className="flex items-center gap-2">
                              <span
                                className={`w-2.5 h-2.5 rounded-full ${
                                  isActive ? 'bg-emerald-400 animate-ping' : 'bg-amber-400'
                                }`}
                              />
                              <span
                                className={`text-xs font-bold ${
                                  isActive ? 'text-emerald-400' : 'text-amber-300'
                                }`}
                              >
                                {isActive ? 'ÇALIŞIYOR (AKTİF)' : 'DURDURULDU (PASİF)'}
                              </span>
                            </div>

                            <button
                              onClick={() => toggleBotActive(bot.id)}
                              className={`px-4 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all ${
                                isActive
                                  ? 'bg-red-600/80 hover:bg-red-600 text-white'
                                  : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                              }`}
                            >
                              {isActive ? (
                                <>
                                  <Square className="w-3.5 h-3.5" />
                                  <span>Botu Durdur</span>
                                </>
                              ) : (
                                <>
                                  <Play className="w-3.5 h-3.5" />
                                  <span>Botu Aktif Et</span>
                                </>
                              )}
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* WINDOW 3: VDS BOTBUILDER IDE */}
          {activeVdsWindow === 'vds_botbuilder' && (
            <div className="bg-[#0b131e]/95 border border-indigo-500/30 rounded-2xl p-5 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2.5">
                  <Sliders className="w-5 h-5 text-indigo-400" />
                  <h2 className="text-base font-black text-white">
                    VDS BotBuilder Kural & Filtre Yapılandırması
                  </h2>
                </div>
                <span className="text-xs font-mono text-indigo-300">
                  AutoMod Durumu:{' '}
                  {ownedBots.includes('automod_bot') && activeBots.includes('automod_bot')
                    ? '🟢 AKTİF'
                    : '🔴 PASİF'}
                </span>
              </div>

              <div className="p-4 rounded-xl bg-black/40 border border-white/10 flex items-center justify-between">
                <div>
                  <div className="text-sm font-bold text-white">Sahte Link & Discord Davet Engeli</div>
                  <div className="text-xs text-zinc-400">
                    http:// ve discord.gg içeren tüm izinsiz reklam mesajlarını VDS üzerinde anında siler.
                  </div>
                </div>
                <button
                  onClick={() =>
                    updateBotRules({ ...botRules, linkFilterEnabled: !botRules.linkFilterEnabled })
                  }
                  className={`px-4 py-2 rounded-xl font-bold text-xs cursor-pointer ${
                    botRules.linkFilterEnabled
                      ? 'bg-emerald-600 text-white'
                      : 'bg-zinc-800 text-zinc-400'
                  }`}
                >
                  {botRules.linkFilterEnabled ? 'AÇIK' : 'KAPALI'}
                </button>
              </div>

              <div className="p-4 rounded-xl bg-black/40 border border-white/10 space-y-3">
                <div className="text-sm font-bold text-white">Yasaklı Kelime Havuzu (AutoMod)</div>
                <form onSubmit={handleAddWord} className="flex gap-2">
                  <input
                    type="text"
                    value={newWordInput}
                    onChange={(e) => setNewWordInput(e.target.value)}
                    placeholder="Yasaklanacak kelimeyi girin..."
                    className="flex-1 px-3 py-2 rounded-lg bg-zinc-900 border border-white/15 text-xs text-white"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" /> Ekle
                  </button>
                </form>

                <div className="flex flex-wrap gap-2 pt-1">
                  {botRules.customWords.map((word) => (
                    <span
                      key={word}
                      className="px-2.5 py-1 rounded-lg bg-indigo-950/80 border border-indigo-500/40 text-xs text-indigo-200 flex items-center gap-1.5"
                    >
                      <span>{word}</span>
                      <button
                        onClick={() => handleRemoveWord(word)}
                        className="text-indigo-400 hover:text-red-400 cursor-pointer"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* WINDOW 4: VDS SYSTEM MONITOR */}
          {activeVdsWindow === 'vds_monitor' && (
            <div className="bg-[#0b131e]/95 border border-amber-500/30 rounded-2xl p-5 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2.5">
                  <Cpu className="w-5 h-5 text-amber-400" />
                  <h2 className="text-base font-black text-white">
                    VDS Sistem & Servis Sağlığı Monitörü
                  </h2>
                </div>
                <button
                  onClick={restartBots}
                  className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Tüm VDS Bot Servislerini Yeniden Başlat</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-black/40 border border-white/10">
                  <div className="text-xs text-zinc-400">VDS CPU Kullanımı</div>
                  <div className="text-2xl font-black text-emerald-400 font-mono mt-1">%{cpuLoad}</div>
                  <div className="w-full h-2 bg-zinc-800 rounded-full mt-2 overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 transition-all"
                      style={{ width: `${cpuLoad}%` }}
                    />
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-black/40 border border-white/10">
                  <div className="text-xs text-zinc-400">VDS Bellek (RAM)</div>
                  <div className="text-2xl font-black text-cyan-400 font-mono mt-1">
                    {ramUsedGb} GB / 8.0 GB
                  </div>
                  <div className="w-full h-2 bg-zinc-800 rounded-full mt-2 overflow-hidden">
                    <div
                      className="h-full bg-cyan-500 transition-all"
                      style={{ width: `${(ramUsedGb / 8) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
