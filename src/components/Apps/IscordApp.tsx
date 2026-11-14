import React, { useState, useRef, useEffect } from 'react'
import { 
  Hash, 
  Volume2, 
  Settings, 
  Mic, 
  Headphones, 
  ChevronDown, 
  Plus, 
  Users, 
  Trash2,
  VolumeX,
  Edit2,
  Check,
  X,
  AlertCircle,
  ShieldAlert,
  LogIn,
  UserCheck,
  Lock,
  Search,
  Image as ImageIcon,
  CheckCircle2,
  Flame,
  Radio,
  PhoneOff,
  MicOff,
  Sliders,
  Shield
} from 'lucide-react'
import { useGame, ServerMember } from '../../context/GameContext'
import { getScenarioEvidence, EvidenceDetails } from '../../data/ticketScenarios'
import { getModeratorChannelChoices } from '../../data/massiveScenarioPool'
import { soundEngine } from '../../utils/soundEngine'

export const IscordApp: React.FC = () => {
  const {
    members,
    activeChannelId,
    setActiveChannelId,
    channelNames,
    updateChannelName,
    createChannel,
    deleteChannel,
    voiceUsers,
    connectedVoiceChannel,
    voiceTranscripts,
    kickVoiceUser,
    muteVoiceUser,
    joinVoiceChannel,
    leaveVoiceChannel,
    messages,
    sendMessage,
    deleteMessage,
    activeTickets,
    resolveTicket,
    closeTicket,
    summonAccusedToTicket,
    acceptTicketBribe,
    rejectTicketBribeAndBan,
    sendTicketMessage,
    banMember,
    muteMember,
    changeMemberRole,
    auditLogs,
    isRaidActive,
    activeRaiders,
    triggerRaid,
    dmConversations,
    sendDmMessage,
    openUserDm,
    iscordAccount,
    registerIscordAccount,
    setHype,
    botRules,
    updateBotRules
  } = useGame()

  // Item #10: Custom Account Registration Form State
  const [regUsername, setRegUsername] = useState('')
  const [regEmail, setRegEmail] = useState('')
  const [regPassword, setRegPassword] = useState('')
  const [regColor, setRegColor] = useState('#5865F2')

  // Item #11: Green "+" Server Discovery / Partner Modal State
  const [isDiscoverModalOpen, setIsDiscoverModalOpen] = useState(false)
  const [partneredServers, setPartneredServers] = useState<string[]>([])

  // Server Settings Modal State (Item #6)
  const [isServerSettingsOpen, setIsServerSettingsOpen] = useState(false)
  const [serverSettingsTab, setServerSettingsTab] = useState<'overview' | 'roles' | 'automod' | 'audit'>('overview')
  const [isServerDropdownOpen, setIsServerDropdownOpen] = useState(false)
  const [serverTitleName, setServerTitleName] = useState('Root Topluluk Sunucusu')
  const [verificationLevel, setVerificationLevel] = useState<'low' | 'medium' | 'high'>('medium')
  const [newBannedWordInput, setNewBannedWordInput] = useState('')

  const [auditSearchQuery, setAuditSearchQuery] = useState('')
  const [auditActionFilter, setAuditActionFilter] = useState<'all' | 'ban' | 'mute' | 'role' | 'ticket'>('all')

  const [editingChannelId, setEditingChannelId] = useState<string | null>(null)
  const [editNameVal, setEditNameVal] = useState('')
  const [newChannelModal, setNewChannelModal] = useState<'text' | 'voice' | null>(null)
  const [newChannelName, setNewChannelName] = useState('')

  const [contextMenu, setContextMenu] = useState<{
    x: number
    y: number
    targetUsername?: string
    targetMessageId?: string
    isVoiceKick?: boolean
    voiceMemberId?: string
  } | null>(null)

  const [roleEditModalUser, setRoleEditModalUser] = useState<ServerMember | null>(null)
  const [profileModalUser, setProfileModalUser] = useState<ServerMember | null>(null)
  const [filterQuery, setFilterQuery] = useState('')
  const chatScrollRef = useRef<HTMLDivElement>(null)

  // Evidence Viewer Modal State
  const [selectedEvidence, setSelectedEvidence] = useState<EvidenceDetails | null>(null)
  const [isEvidenceModalOpen, setIsEvidenceModalOpen] = useState(false)

  // Interactive Dynamic Direct Messages (DM) State
  const [serverViewMode, setServerViewMode] = useState<'server' | 'dms'>('server')
  const [activeDmId, setActiveDmId] = useState<string>('karanlik')

  useEffect(() => {
    chatScrollRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, activeChannelId])

  // Active channel messages (shows deleted messages as crossed out line-through)
  const currentMessages = messages.filter(
    (m) => m.channelId === activeChannelId
  )

  // Current active ticket if ticket channel
  const currentTicket = activeTickets.find((t) => t.channelId === activeChannelId)

  // Filtered audit logs for the Audit Log Inspector
  const filteredAuditLogs = auditLogs.filter((log) => {
    const q = auditSearchQuery.toLowerCase().trim()
    const matchesQuery =
      !q ||
      log.target.toLowerCase().includes(q) ||
      log.action.toLowerCase().includes(q) ||
      log.details.toLowerCase().includes(q) ||
      log.moderator.toLowerCase().includes(q)

    if (!matchesQuery) return false

    if (auditActionFilter === 'ban') return log.action.includes('BAN')
    if (auditActionFilter === 'mute') return log.action.includes('MUTE') || log.action.includes('SUSTURMA')
    if (auditActionFilter === 'role') return log.action.includes('ROL')
    if (auditActionFilter === 'ticket') return log.action.includes('TICKET')

    return true
  })

  // Categorize members by role (Kurucu is supreme at top)
  const rolesOrder: ServerMember['role'][] = ['Kurucu', 'Yönetici', 'Moderatör', 'VIP Balina', 'Kıdemli Üye', 'Üye']
  const onlineMembers = members.filter((m) => m.isOnline && m.username.toLowerCase().includes(filterQuery.toLowerCase()))
  const offlineMembers = members.filter((m) => !m.isOnline && m.username.toLowerCase().includes(filterQuery.toLowerCase()))

  // Save edited channel name
  const saveChannelName = (id: string) => {
    if (editNameVal.trim()) {
      updateChannelName(id, editNameVal.trim())
    }
    setEditingChannelId(null)
  }

  // Dynamic Interactive DM Message Handler (Persistent via GameContext)
  const handleSendDmMessage = (rawText: string) => {
    sendDmMessage(activeDmId, rawText)
  }

  // Handle create new channel
  const handleCreateChannelSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newChannelName.trim() || !newChannelModal) return
    createChannel(newChannelModal, newChannelName.trim())
    setNewChannelModal(null)
    setNewChannelName('')
  }

  // Clamped context menu coordinates: opens UPWARDS if near bottom of screen
  const getClampedMenuPos = () => {
    if (!contextMenu) return { top: 0, left: 0 }
    const menuEstimatedHeight = 320
    const menuWidth = 210
    const opensUpward = contextMenu.y + menuEstimatedHeight > window.innerHeight - 50

    const top = opensUpward
      ? Math.max(10, contextMenu.y - menuEstimatedHeight)
      : Math.min(contextMenu.y, window.innerHeight - menuEstimatedHeight - 10)
    const left = Math.max(10, Math.min(contextMenu.x, window.innerWidth - menuWidth - 10))

    return { top: `${top}px`, left: `${left}px` }
  }

  // ITEM #10: Custom Iscord Account Registration Screen when opening Iscord for the first time
  if (!iscordAccount.isRegistered) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-[#1e1f22] text-[#dbdee1] font-['Plus_Jakarta_Sans',sans-serif] select-none p-6 relative overflow-y-auto">
        <div className="w-full max-w-md bg-[#313338] border border-[#3f4147] rounded-2xl shadow-2xl p-6 space-y-5">
          <div className="text-center space-y-1.5">
            <div className="w-14 h-14 rounded-2xl bg-[#5865F2] mx-auto flex items-center justify-center text-white font-black text-2xl shadow-lg">
              IS
            </div>
            <h1 className="text-xl font-black text-white">Iscord Hesabını Oluştur</h1>
            <p className="text-xs text-[#949ba4]">
              Root Topluluk Sunucusunda Baş Moderatör olarak göreve başlamak için kullanıcı adını ve şifreni belirle.
            </p>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault()
              if (!regUsername.trim() || !regPassword.trim()) return
              registerIscordAccount(regUsername, regEmail, regPassword, regColor)
            }}
            className="space-y-4"
          >
            <div>
              <label className="block text-[11px] font-bold text-[#b5bac1] uppercase tracking-wider mb-1.5">
                KULLANICI ADINIZ (ADMİN İSMİ) *
              </label>
              <input
                type="text"
                required
                value={regUsername}
                onChange={(e) => setRegUsername(e.target.value)}
                placeholder="Örn: Admin_Kaan, CyberMod, GeceBekcisi..."
                className="w-full px-3.5 py-2.5 rounded-lg bg-[#1e1f22] border border-[#3f4147] text-sm text-white focus:outline-none focus:border-[#5865F2]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#b5bac1] uppercase tracking-wider mb-1.5">
                E-POSTA ADRESİ (İSTEĞE BAĞLI)
              </label>
              <input
                type="email"
                value={regEmail}
                onChange={(e) => setRegEmail(e.target.value)}
                placeholder="admin@modos.net"
                className="w-full px-3.5 py-2.5 rounded-lg bg-[#1e1f22] border border-[#3f4147] text-sm text-white focus:outline-none focus:border-[#5865F2]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#b5bac1] uppercase tracking-wider mb-1.5">
                HESAP ŞİFRESİ *
              </label>
              <input
                type="password"
                required
                value={regPassword}
                onChange={(e) => setRegPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 rounded-lg bg-[#1e1f22] border border-[#3f4147] text-sm text-white focus:outline-none focus:border-[#5865F2]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#b5bac1] uppercase tracking-wider mb-1.5">
                PROFİL AVATAR RENGİ
              </label>
              <div className="flex items-center gap-2.5">
                {['#5865F2', '#23a55a', '#f23f43', '#f0b232', '#eb459e', '#00b894'].map((clr) => (
                  <button
                    key={clr}
                    type="button"
                    onClick={() => setRegColor(clr)}
                    className={`w-8 h-8 rounded-full transition-transform cursor-pointer ${
                      regColor === clr ? 'scale-125 ring-2 ring-white' : 'opacity-70 hover:opacity-100'
                    }`}
                    style={{ backgroundColor: clr }}
                  />
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={!regUsername.trim() || !regPassword.trim()}
              className="w-full py-3 rounded-lg bg-[#5865F2] hover:bg-[#4752c4] disabled:opacity-40 text-white font-bold text-sm transition-all shadow-lg cursor-pointer"
            >
              Hesabı Oluştur ve Sunucuya Bağlan
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div 
      className="flex h-full w-full bg-[#313338] text-[#dbdee1] font-['Plus_Jakarta_Sans',sans-serif] select-none overflow-hidden relative"
      onClick={() => setContextMenu(null)}
      onContextMenu={(e) => {
        e.preventDefault()
        e.stopPropagation()
      }}
    >
      {/* 1. Discord Leftmost Server List (#1e1f22) */}
      <div className="w-[72px] bg-[#1e1f22] flex flex-col items-center py-3 space-y-2 select-none border-r border-[#141517] shrink-0">
        <button 
          title="Direkt Mesajlar"
          onClick={() => setServerViewMode('dms')}
          className={`relative group w-12 h-12 rounded-[24px] hover:rounded-[16px] flex items-center justify-center transition-all duration-200 cursor-pointer ${
            serverViewMode === 'dms' ? 'bg-[#5865F2] rounded-[16px]' : 'bg-[#2b2d31] hover:bg-[#5865F2]'
          }`}
        >
          {serverViewMode === 'dms' && <div className="absolute -left-3 w-2 h-10 bg-white rounded-r-full" />}
          <span className="font-black text-white text-base">IS</span>
          {Object.values(dmConversations).some((c) => c.stage === 'waiting_for_iban' || c.stage === 'initial') && (
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-[#f23f43] rounded-full border-2 border-[#1e1f22]" />
          )}
        </button>

        <div className="w-8 h-[2px] bg-[#35363c] rounded" />

        <button 
          title="Root Topluluk Sunucusu"
          onClick={() => setServerViewMode('server')}
          className={`relative group w-12 h-12 rounded-[16px] flex items-center justify-center transition-all duration-200 border border-[#35373c] cursor-pointer ${
            serverViewMode === 'server' ? 'bg-[#5865F2]' : 'bg-[#2b2d31] hover:bg-[#5865F2]'
          }`}
        >
          {serverViewMode === 'server' && <div className="absolute -left-3 w-2 h-10 bg-white rounded-r-full" />}
          <span className="font-bold text-xs text-zinc-100">OVER</span>
        </button>

        {/* Item #11: Active Green "+" Button */}
        <button 
          title="Sunucu Ekle / Partner Topluluk Bağla"
          onClick={() => {
            soundEngine.playKeyClick()
            setIsDiscoverModalOpen(true)
          }}
          className="w-12 h-12 rounded-[24px] hover:rounded-[16px] bg-[#2b2d31] hover:bg-[#23a55a] flex items-center justify-center text-[#23a55a] hover:text-white transition-all duration-200 cursor-pointer shadow-md"
        >
          <Plus className="w-6 h-6" />
        </button>
      </div>

      {/* 2. Channel Sidebar (#2b2d31) */}
      <div className="w-60 bg-[#2b2d31] flex flex-col border-r border-[#202225] shrink-0">
        {serverViewMode === 'dms' ? (
          <>
            {/* DM Header */}
            <div className="h-12 px-4 border-b border-[#1f2023] flex items-center justify-between font-bold text-sm text-white shadow-sm bg-[#2b2d31]">
              <span className="truncate">Direkt Mesajlar</span>
              <span className="text-[10px] text-zinc-400 bg-[#1e1f22] px-1.5 py-0.5 rounded font-mono">
                {Object.keys(dmConversations).length} Sohbet
              </span>
            </div>

            {/* DM Contacts List */}
            <div className="flex-1 overflow-y-auto px-2 py-3 space-y-1.5">
              <div className="px-2 mb-1 text-[11px] font-bold text-[#949ba4] uppercase tracking-wider">
                GELEN KUTUSU & TALEPLER
              </div>
              {Object.values(dmConversations).map((dm) => {
                const memberObj = members.find((m) => m.username.toLowerCase() === dm.name.toLowerCase())
                return (
                <button
                  key={dm.id}
                  onClick={() => setActiveDmId(dm.id)}
                  className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded text-left transition-colors ${
                    activeDmId === dm.id
                      ? 'bg-[#35373c] text-white font-semibold'
                      : 'text-[#949ba4] hover:bg-[#35373c]/50 hover:text-[#dbdee1]'
                  }`}
                >
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0 shadow-inner overflow-hidden"
                    style={{ backgroundColor: dm.avatarColor }}
                  >
                    {memberObj?.avatarUrl ? (
                      <img src={memberObj.avatarUrl} alt={dm.name} className="w-full h-full object-cover" />
                    ) : (
                      dm.name.substring(0, 2).toUpperCase()
                    )}
                  </div>
                  <div className="truncate min-w-0 flex-1">
                    <div className="text-xs truncate font-medium text-zinc-200">{dm.name}</div>
                    <div className="text-[10px] text-zinc-400 truncate flex items-center gap-1">
                      {dm.stage === 'waiting_for_iban' && <span className="text-amber-400 font-semibold">💳 IBAN Bekliyor</span>}
                      {dm.stage === 'payment_sent' && <span className="text-emerald-400 font-semibold">💰 FAST Geldi</span>}
                      {dm.stage === 'completed' && <span className="text-zinc-400">Tamamlandı</span>}
                      {dm.stage === 'rejected' && <span className="text-red-400">Reddedildi</span>}
                      {dm.stage === 'initial' && <span>{dm.status}</span>}
                    </div>
                  </div>
                  {dm.stage === 'completed' ? (
                    <span className="text-[10px] text-emerald-400 font-bold">✓</span>
                  ) : (
                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                  )}
                </button>
              )})}
            </div>
          </>
        ) : (
          <>
            {/* Server Header with Dropdown (Item #6) */}
            <div className="relative">
              <div
                onClick={() => setIsServerDropdownOpen(!isServerDropdownOpen)}
                className="h-12 px-4 border-b border-[#1f2023] flex items-center justify-between font-bold text-sm text-white shadow-sm hover:bg-[#35373c] cursor-pointer transition-colors select-none"
              >
                <span className="truncate">{serverTitleName}</span>
                <ChevronDown className={`w-4 h-4 text-zinc-400 transition-transform ${isServerDropdownOpen ? 'rotate-180' : ''}`} />
              </div>

              {isServerDropdownOpen && (
                <div className="absolute top-12 left-2 right-2 z-50 bg-[#111214] border border-[#2b2d31] rounded-xl shadow-2xl p-1.5 space-y-1 text-xs animate-in fade-in zoom-in-95 duration-100 select-none">
                  <button
                    onClick={() => {
                      setIsServerDropdownOpen(false)
                      setIsServerSettingsOpen(true)
                    }}
                    className="w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-zinc-200 hover:bg-[#5865F2] hover:text-white font-medium transition-colors cursor-pointer text-left"
                  >
                    <span>⚙️ Sunucu Ayarları</span>
                    <Settings className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => {
                      setIsServerDropdownOpen(false)
                      setNewChannelModal('text')
                    }}
                    className="w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-zinc-200 hover:bg-[#5865F2] hover:text-white font-medium transition-colors cursor-pointer text-left"
                  >
                    <span>➕ Metin Kanalı Oluştur</span>
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => {
                      setIsServerDropdownOpen(false)
                      setNewChannelModal('voice')
                    }}
                    className="w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-zinc-200 hover:bg-[#5865F2] hover:text-white font-medium transition-colors cursor-pointer text-left"
                  >
                    <span>🔊 Ses Kanalı Oluştur</span>
                    <Volume2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => {
                      setIsServerDropdownOpen(false)
                      setServerSettingsTab('automod')
                      setIsServerSettingsOpen(true)
                    }}
                    className="w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-amber-300 hover:bg-[#5865F2] hover:text-white font-medium transition-colors cursor-pointer text-left"
                  >
                    <span>🛡️ AutoMod & Güvenlik</span>
                    <Shield className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>

            {/* Channels List with Enhanced Categories (Item #7 & #8) */}
            <div className="flex-1 overflow-y-auto px-2 py-3 space-y-4">
              {/* 1. BİLGİ & DUYURULAR */}
              <div>
                <div className="px-2 mb-1 text-[11px] font-bold text-[#949ba4] uppercase tracking-wider">
                  📢 BİLGİ & DUYURULAR
                </div>
                <div className="space-y-0.5">
                  {['kurallar', 'duyurular', 'gelen-giden', 'denetim-kaydi']
                    .filter((cId) => channelNames[cId] !== undefined)
                    .map((cId) => (
                      <button
                        key={cId}
                        onClick={() => setActiveChannelId(cId)}
                        className={`w-full flex items-center gap-1.5 px-2 py-1.5 rounded text-sm transition-colors cursor-pointer ${
                          activeChannelId === cId
                            ? 'bg-[#35373c] text-white font-semibold'
                            : 'text-[#949ba4] hover:bg-[#35373c] hover:text-[#dbdee1]'
                        }`}
                      >
                        {cId === 'denetim-kaydi' ? (
                          <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
                        ) : (
                          <Hash className="w-4 h-4 text-[#80848e] shrink-0" />
                        )}
                        <span className="font-medium truncate">{channelNames[cId] || cId}</span>
                      </button>
                    ))}
                </div>
              </div>

              {/* 2. METİN SOHBETLERİ */}
              <div>
                <div className="px-2 mb-1 flex items-center justify-between text-[11px] font-bold text-[#949ba4] uppercase tracking-wider">
                  <span>💬 METİN SOHBETLERİ</span>
                  <button 
                    onClick={() => setNewChannelModal('text')}
                    className="hover:text-white p-0.5 cursor-pointer" 
                    title="Metin Kanalı Oluştur"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="space-y-0.5">
                  {Object.keys(channelNames)
                    .filter(
                      (cId) =>
                        !cId.startsWith('ses-') &&
                        !cId.startsWith('voice-') &&
                        !['kurallar', 'duyurular', 'gelen-giden', 'denetim-kaydi', 'vip-lounge', 'yetkili-sohbet'].includes(cId)
                    )
                    .map((cId) => {
                      const isEditing = editingChannelId === cId
                      const isCore = ['genel-sohbet'].includes(cId)
                      return (
                        <div key={cId} className="group relative flex items-center">
                          {isEditing ? (
                            <div className="flex items-center gap-1 w-full px-2 py-1 bg-[#1e1f22] rounded">
                              <input
                                type="text"
                                value={editNameVal}
                                onChange={(e) => setEditNameVal(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && saveChannelName(cId)}
                                autoFocus
                                className="bg-transparent text-xs text-white outline-none flex-1 font-mono"
                              />
                              <button onClick={() => saveChannelName(cId)} className="text-emerald-400 p-0.5">
                                <Check className="w-3.5 h-3.5" />
                              </button>
                              <button onClick={() => setEditingChannelId(null)} className="text-red-400 p-0.5">
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => setActiveChannelId(cId)}
                              className={`w-full flex items-center justify-between px-2 py-1.5 rounded text-sm transition-colors cursor-pointer ${
                                activeChannelId === cId
                                  ? 'bg-[#35373c] text-white font-semibold'
                                  : 'text-[#949ba4] hover:bg-[#35373c] hover:text-[#dbdee1]'
                              }`}
                            >
                              <div className="flex items-center gap-1.5 truncate">
                                <Hash className="w-4 h-4 text-[#80848e] shrink-0" />
                                <span className="truncate">{channelNames[cId] || cId}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <span
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    setEditingChannelId(cId)
                                    setEditNameVal(channelNames[cId] || cId)
                                  }}
                                  className="opacity-0 group-hover:opacity-100 hover:text-white p-0.5"
                                  title="Kanal Adını Düzenle"
                                >
                                  <Edit2 className="w-3 h-3 text-[#949ba4]" />
                                </span>
                                {!isCore && (
                                  <span
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      deleteChannel(cId)
                                    }}
                                    className="opacity-0 group-hover:opacity-100 hover:text-red-400 p-0.5 transition-opacity"
                                    title="Kanalı Sil"
                                  >
                                    <Trash2 className="w-3 h-3 text-[#949ba4] hover:text-red-400" />
                                  </span>
                                )}
                              </div>
                            </button>
                          )}
                        </div>
                      )
                    })}
                </div>
              </div>

              {/* 3. ÖZEL ODALAR (VIP & YETKİLİ) */}
              <div>
                <div className="px-2 mb-1 text-[11px] font-bold text-[#949ba4] uppercase tracking-wider">
                  🏆 ÖZEL ODALAR
                </div>
                <div className="space-y-0.5">
                  {['vip-lounge', 'yetkili-sohbet']
                    .filter((cId) => channelNames[cId] !== undefined)
                    .map((cId) => (
                      <button
                        key={cId}
                        onClick={() => setActiveChannelId(cId)}
                        className={`w-full flex items-center gap-1.5 px-2 py-1.5 rounded text-sm transition-colors cursor-pointer ${
                          activeChannelId === cId
                            ? 'bg-[#35373c] text-white font-semibold'
                            : 'text-[#949ba4] hover:bg-[#35373c] hover:text-[#dbdee1]'
                        }`}
                      >
                        <Lock className={`w-3.5 h-3.5 shrink-0 ${cId === 'vip-lounge' ? 'text-amber-400' : 'text-red-400'}`} />
                        <span className="font-medium truncate">{channelNames[cId] || cId}</span>
                      </button>
                    ))}
                </div>
              </div>

              {/* 4. TICKETS */}
              <div>
                <div className="px-2 mb-1 flex items-center justify-between text-[11px] font-bold text-[#949ba4] uppercase tracking-wider">
                  <span>TICKETS ({activeTickets.length})</span>
                </div>
                {activeTickets.length === 0 ? (
                  <div className="px-2 py-1 text-[11px] text-[#80848e] italic">
                    Açık destek talebi yok
                  </div>
                ) : (
                  <div className="space-y-0.5">
                    {activeTickets.map((t) => {
                      const isActive = activeChannelId === t.channelId
                      return (
                        <div key={t.channelId} className="group relative flex items-center">
                          <button
                            onClick={() => setActiveChannelId(t.channelId)}
                            className={`w-full flex items-center justify-between px-2 py-1.5 rounded text-xs transition-colors cursor-pointer ${
                              isActive
                                ? 'bg-[#f23f43]/20 text-[#f23f43] font-bold'
                                : 'text-[#dbdee1] hover:bg-[#35373c] font-medium'
                            }`}
                          >
                            <div className="flex items-center gap-1.5 truncate">
                              <Lock className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-[#f23f43]' : 'text-[#80848e]'}`} />
                              <span className="truncate">#{t.channelId}</span>
                            </div>
                            {t.step === 'waiting_for_moderator' ? (
                              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse shrink-0" title="İnceleme bekliyor" />
                            ) : (
                              <div className="flex items-center gap-1 shrink-0 text-emerald-400 text-[10px] font-mono">
                                <Check className="w-3 h-3" />
                                <span>{t.autoCloseSeconds ?? 0}s</span>
                              </div>
                            )}
                          </button>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>

              {/* 5. SES KANALLARI (Item C: Interactive Voice Channels) */}
              <div>
                <div className="px-2 mb-1 flex items-center justify-between text-[11px] font-bold text-[#949ba4] uppercase tracking-wider">
                  <span>🎙️ SES KANALLARI</span>
                  <button 
                    onClick={() => setNewChannelModal('voice')}
                    className="hover:text-white p-0.5 cursor-pointer" 
                    title="Ses Kanalı Oluştur"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="space-y-1">
                  {Object.keys(channelNames)
                    .filter((vId) => vId.startsWith('ses-') || vId.startsWith('voice-'))
                    .map((vId) => {
                      const isEditing = editingChannelId === vId
                      const occupants = voiceUsers.filter((u) => u.channelId === vId)
                      const isConnectedToThis = connectedVoiceChannel === vId

                      return (
                        <div key={vId} className="space-y-0.5">
                          {isEditing ? (
                            <div className="flex items-center gap-1 px-2 py-1 bg-[#1e1f22] rounded">
                              <input
                                type="text"
                                value={editNameVal}
                                onChange={(e) => setEditNameVal(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && saveChannelName(vId)}
                                autoFocus
                                className="bg-transparent text-xs text-white outline-none flex-1 font-mono"
                              />
                              <button onClick={() => saveChannelName(vId)} className="text-emerald-400 p-0.5">
                                <Check className="w-3.5 h-3.5" />
                              </button>
                              <button onClick={() => setEditingChannelId(null)} className="text-red-400 p-0.5">
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ) : (
                            <div 
                              onClick={() => {
                                setActiveChannelId(vId)
                                if (connectedVoiceChannel !== vId) {
                                  joinVoiceChannel(vId)
                                }
                              }}
                              className={`group flex items-center justify-between px-2 py-1.5 rounded text-sm transition-colors cursor-pointer ${
                                activeChannelId === vId || isConnectedToThis
                                  ? 'bg-[#35373c] text-white font-semibold'
                                  : 'text-[#949ba4] hover:bg-[#35373c] hover:text-[#dbdee1]'
                              }`}
                            >
                              <div className="flex items-center gap-1.5 truncate">
                                <Volume2 className={`w-4 h-4 shrink-0 ${isConnectedToThis ? 'text-emerald-400 animate-pulse' : 'text-[#80848e]'}`} />
                                <span className="truncate text-xs font-medium">{channelNames[vId] || vId}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                {occupants.length > 0 && (
                                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-black/40 text-emerald-300">
                                    {occupants.length}
                                  </span>
                                )}
                                <span
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    joinVoiceChannel(vId)
                                  }}
                                  className="opacity-0 group-hover:opacity-100 hover:text-emerald-400 p-0.5"
                                  title="Sese Katıl"
                                >
                                  <LogIn className="w-3 h-3" />
                                </span>
                                <span
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    setEditingChannelId(vId)
                                    setEditNameVal(channelNames[vId] || vId)
                                  }}
                                  className="opacity-0 group-hover:opacity-100 hover:text-white p-0.5"
                                  title="Ses Kanalı Adını Düzenle"
                                >
                                  <Edit2 className="w-3 h-3" />
                                </span>
                                <span
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    deleteChannel(vId)
                                  }}
                                  className="opacity-0 group-hover:opacity-100 hover:text-red-400 p-0.5"
                                  title="Ses Kanalını Sil"
                                >
                                  <Trash2 className="w-3 h-3 text-[#949ba4] hover:text-red-400" />
                                </span>
                              </div>
                            </div>
                          )}

                          {/* Occupants in voice channel */}
                          {occupants.map((occ) => (
                            <div
                              key={occ.member.id}
                              onContextMenu={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                                setContextMenu({
                                  x: e.clientX,
                                  y: e.clientY,
                                  targetUsername: occ.member.username,
                                  isVoiceKick: true,
                                  voiceMemberId: occ.member.id
                                })
                              }}
                              className="group flex items-center justify-between pl-6 pr-2 py-1 rounded hover:bg-[#35373c] text-xs cursor-context-menu"
                            >
                              <div className="flex items-center gap-2 truncate">
                                <div 
                                  className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] text-white font-bold overflow-hidden transition-all ${
                                    occ.isSpeaking ? 'ring-2 ring-emerald-400 animate-pulse' : ''
                                  }`}
                                  style={{ backgroundColor: occ.member.avatarColor }}
                                >
                                  {occ.member.avatarUrl ? (
                                    <img src={occ.member.avatarUrl} alt={occ.member.username} className="w-full h-full object-cover" />
                                  ) : (
                                    occ.member.username.substring(0, 2).toUpperCase()
                                  )}
                                </div>
                                <span className={`truncate text-xs font-medium ${occ.isSpeaking ? 'text-emerald-300 font-bold' : 'text-zinc-300'}`}>
                                  {occ.member.username}
                                </span>
                                {occ.isMuted && <span className="text-[9px] text-red-400">🔇</span>}
                              </div>
                              <button
                                onClick={() => kickVoiceUser(occ.member.id)}
                                title="Sesten At"
                                className="opacity-0 group-hover:opacity-100 hover:text-red-400 p-1 cursor-pointer"
                              >
                                <VolumeX className="w-3.5 h-3.5 text-zinc-400 hover:text-red-400" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )
                    })}
                </div>
              </div>
            </div>

            {/* Active Connected Voice Bar (Discord style) */}
            {connectedVoiceChannel && (
              <div className="bg-[#111214] border-t border-[#1f2023] px-3 py-2 flex items-center justify-between text-xs select-none">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping shrink-0" />
                  <div className="min-w-0">
                    <div className="text-emerald-400 font-bold truncate text-[11px] flex items-center gap-1">
                      <span>Ses Bağlandı</span>
                      <span className="text-[9px] font-mono text-zinc-500">18ms</span>
                    </div>
                    <div className="text-zinc-400 truncate text-[10px]">
                      {channelNames[connectedVoiceChannel] || connectedVoiceChannel}
                    </div>
                  </div>
                </div>
                <button
                  onClick={leaveVoiceChannel}
                  className="p-1.5 rounded-lg bg-red-950/70 hover:bg-red-600 text-red-300 hover:text-white transition-colors cursor-pointer"
                  title="Bağlantıyı Kes"
                >
                  <PhoneOff className="w-4 h-4" />
                </button>
              </div>
            )}
          </>
        )}

        {/* User Footer (#232428) */}
        <div className="h-[52px] bg-[#232428] px-2 flex items-center justify-between shrink-0">
          <div 
            onClick={() => setProfileModalUser(members[1] || members[0] || null)}
            className="flex items-center gap-2 min-w-0 hover:bg-[#35373c] p-1 rounded cursor-pointer transition-colors flex-1 mr-1"
          >
            <div
              className="relative w-8 h-8 rounded-full flex items-center justify-center font-bold text-white text-xs shrink-0 overflow-hidden"
              style={{ backgroundColor: iscordAccount.avatarColor || '#5865F2' }}
            >
              {members[1]?.avatarUrl ? (
                <img src={members[1].avatarUrl} alt={iscordAccount.username} className="w-full h-full object-cover" />
              ) : (
                (iscordAccount.username || 'AD').substring(0, 2).toUpperCase()
              )}
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-[#23a55a] border-2 border-[#232428]" />
            </div>
            <div className="min-w-0">
              <div className="text-xs font-bold text-white truncate leading-tight">
                {iscordAccount.username || 'Admin_Overlord'}
              </div>
              <div className="text-[10px] text-[#949ba4] truncate leading-tight">Baş Moderatör</div>
            </div>
          </div>

          <div className="flex items-center text-[#b5bac1]">
            <button className="p-1.5 rounded hover:bg-[#35373c] hover:text-white transition-colors" title="Sustur">
              <Mic className="w-4 h-4" />
            </button>
            <button className="p-1.5 rounded hover:bg-[#35373c] hover:text-white transition-colors" title="Sağırlaştır">
              <Headphones className="w-4 h-4" />
            </button>
            <button className="p-1.5 rounded hover:bg-[#35373c] hover:text-white transition-colors" title="Kullanıcı Ayarları">
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 3. Main Chat View (#313338) */}
      <div className="flex-1 flex flex-col bg-[#313338] min-w-0 overflow-hidden">
        {serverViewMode === 'dms' ? (
          /* DYNAMIC INTERACTIVE DM CHAT VIEW (CHOICE BUTTONS ONLY - ITEM #7) */
          <div className="flex-1 flex flex-col h-full overflow-hidden">
            {(() => {
              const cur = dmConversations[activeDmId] || dmConversations['karanlik']
              const curMember = members.find((m) => m.username.toLowerCase() === cur.name.toLowerCase())
              return (
                <>
                  {/* Top DM Header */}
                  <div className="h-12 px-4 border-b border-[#202225] flex items-center justify-between shadow-sm shrink-0 bg-[#2b2d31]">
                    <div className="flex items-center gap-2.5 truncate">
                      <div
                        className="w-7 h-7 rounded-full flex items-center justify-center font-bold text-white text-xs shrink-0 shadow-inner overflow-hidden"
                        style={{ backgroundColor: cur.avatarColor }}
                      >
                        {curMember?.avatarUrl ? (
                          <img src={curMember.avatarUrl} alt={cur.name} className="w-full h-full object-cover" />
                        ) : (
                          cur.name.substring(0, 2).toUpperCase()
                        )}
                      </div>
                      <span className="font-bold text-sm text-white">{cur.name}</span>
                      <span className="text-xs text-[#949ba4] font-mono">{cur.tag}</span>
                      <span className="text-[11px] px-2 py-0.5 rounded bg-[#1e1f22] text-zinc-300 font-medium border border-[#35373c]">
                        {cur.status}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-xs">
                      {cur.stage === 'waiting_for_iban' && (
                        <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 font-semibold animate-pulse">
                          💳 IBAN Seçimi Bekliyor
                        </span>
                      )}
                      {cur.stage === 'payment_sent' && (
                        <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-semibold">
                          💰 FAST Ödemesi Geldi
                        </span>
                      )}
                      {cur.stage === 'completed' && (
                        <span className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 border border-zinc-700 font-semibold">
                          ✓ Sohbet Tamamlandı
                        </span>
                      )}
                      {cur.stage === 'rejected' && (
                        <span className="px-2 py-0.5 rounded bg-red-950/40 text-red-400 border border-red-800/40 font-semibold">
                          ⛔ Reddedildi
                        </span>
                      )}
                    </div>
                  </div>

                  {/* DM Messages Scroll Area */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
                    {cur.messages.map((m) => (
                      <div 
                        key={m.id} 
                        className={`flex gap-3 ${m.sender === 'me' ? 'flex-row-reverse' : ''}`}
                      >
                        <div
                          className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-xs shrink-0 shadow overflow-hidden"
                          style={{ backgroundColor: m.sender === 'user' ? cur.avatarColor : (iscordAccount.avatarColor || '#5865F2') }}
                        >
                          {m.sender === 'user' ? (
                            curMember?.avatarUrl ? (
                              <img src={curMember.avatarUrl} alt={cur.name} className="w-full h-full object-cover" />
                            ) : (
                              cur.name.substring(0, 2).toUpperCase()
                            )
                          ) : (
                            members[1]?.avatarUrl ? (
                              <img src={members[1].avatarUrl} alt={iscordAccount.username} className="w-full h-full object-cover" />
                            ) : (
                              (iscordAccount.username || 'AD').substring(0, 2).toUpperCase()
                            )
                          )}
                        </div>
                        <div className={`max-w-[80%] min-w-0 ${m.sender === 'me' ? 'text-right' : ''}`}>
                          <div className={`flex items-baseline gap-2 mb-1 ${m.sender === 'me' ? 'justify-end' : ''}`}>
                            <span className="font-bold text-xs text-white">
                              {m.sender === 'user' ? cur.name : (iscordAccount.username || 'Admin_Overlord')}
                            </span>
                            <span className="text-[10px] text-[#949ba4] font-mono">{m.time}</span>
                          </div>
                          <div 
                            className={`text-xs leading-relaxed p-3 rounded-xl border select-text ${
                              m.sender === 'me'
                                ? 'bg-[#5865F2] text-white border-[#5865F2]/40 rounded-tr-none'
                                : 'bg-[#2b2d31] text-[#dbdee1] border-[#35373c] rounded-tl-none'
                            }`}
                          >
                            {m.text}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* ITEM #7: DM Choice Buttons Only (No Free-Text Input) */}
                  <div className="p-3.5 bg-[#2b2d31] border-t border-[#202225] space-y-2 shrink-0">
                    <div className="text-[10px] font-bold text-[#949ba4] uppercase tracking-wider">
                      ⚡ Diyalog Seçenekleri (@{cur.name} kişisine yanıt seçin):
                    </div>
                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      {cur.id === 'karanlik' && cur.stage === 'initial' && (
                        <>
                          <button
                            onClick={() => handleSendDmMessage('Tamam, 250₺ karşılığında anlaşalım. IBAN atayım mı?')}
                            className="px-3 py-1.5 rounded-lg bg-emerald-950/60 hover:bg-emerald-800 border border-emerald-600/60 text-emerald-200 font-semibold transition-colors cursor-pointer"
                          >
                            💬 "Tamam, 250₺ gönderirsen banını açarım. IBAN atayım mı?"
                          </button>
                          <button
                            onClick={() => handleSendDmMessage('Rüşvet teklif etmeyi kes, kural ihlalinden banlı kalacaksın!')}
                            className="px-3 py-1.5 rounded-lg bg-red-950/60 hover:bg-red-800 border border-red-600/60 text-red-200 font-semibold transition-colors cursor-pointer"
                          >
                            🚫 "Rüşvet yemem, banlı kalacaksın!"
                          </button>
                        </>
                      )}

                      {(cur.id === 'karanlik' || cur.id === 'cagan') && cur.stage === 'waiting_for_iban' && (
                        <>
                          <button
                            onClick={() => handleSendDmMessage('TR64 0006 1000 4589 1234 5678 01 - ADMIN OVERLORD')}
                            className="px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
                          >
                            <span>📋 Şahsi NeoBank IBAN'ımı Gönder (TR64...4589)</span>
                          </button>
                          <button
                            onClick={() => handleSendDmMessage('Vazgeçtim, rüşvet kabul etmiyorum.')}
                            className="px-3 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-semibold border border-zinc-600 cursor-pointer"
                          >
                            🚫 Vazgeç ve Reddet
                          </button>
                        </>
                      )}

                      {cur.id === 'karanlik' && (cur.stage === 'payment_sent' || cur.stage === 'unban_pending') && (
                        <>
                          <button
                            onClick={() => handleSendDmMessage('Parayı aldım, söz verdiğim gibi banını açtım. Genel sohbete girebilirsin.')}
                            className="px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition-all shadow flex items-center gap-1 cursor-pointer"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>"Sözümü tuttum, banını açtım. Kontrol et"</span>
                          </button>
                          <button
                            onClick={() => handleSendDmMessage('Parayı aldım ama kural kuraldır, banın kalıcı kalıyor :D')}
                            className="px-3.5 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold transition-all shadow cursor-pointer"
                          >
                            😈 "Parayı aldım ama banı yine de açmıyorum"
                          </button>
                        </>
                      )}

                      {cur.id === 'cagan' && cur.stage === 'initial' && (
                        <>
                          <button
                            onClick={() => handleSendDmMessage('Tamam kabul, IBAN atıyorum 400₺ gönder VIP Balina rolünü vereyim.')}
                            className="px-3 py-1.5 rounded-lg bg-amber-950/60 hover:bg-amber-800 border border-amber-600/60 text-amber-200 font-semibold transition-colors cursor-pointer"
                          >
                            💎 "Kabul, şahsi IBAN'ıma 400₺ at VIP Balina rolünü vereyim"
                          </button>
                          <button
                            onClick={() => handleSendDmMessage('Sunucuda el altından rol satılmaz, teklifini reddediyorum.')}
                            className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-semibold transition-colors cursor-pointer"
                          >
                            🚫 "El altından rol satmıyoruz, reddet"
                          </button>
                        </>
                      )}

                      {cur.id === 'cagan' && cur.stage === 'role_pending' && (
                        <button
                          onClick={() => handleSendDmMessage('VIP Balina rolünü sağ listeden hesabına verdim, hayırlı olsun!')}
                          className="px-3.5 py-2 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-bold transition-all shadow flex items-center gap-1.5 cursor-pointer"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>"VIP Balina rolünü tanımladım, kontrol edebilirsin!"</span>
                        </button>
                      )}

                      {cur.id === 'selo' && cur.stage === 'initial' && (
                        <>
                          <button
                            onClick={() => handleSendDmMessage('Tamam 150₺ parayı gönderdim, sahte logları sil ve sesini kes.')}
                            className="px-3 py-1.5 rounded-lg bg-amber-950/60 hover:bg-amber-800 border border-amber-600/60 text-amber-200 font-semibold cursor-pointer"
                          >
                            💸 "Al 150₺ sus payı, logları sil (-150₺)"
                          </button>
                          <button
                            onClick={() => handleSendDmMessage('Bana şantaj sökmez, defol git kurucuya ne atarsan at!')}
                            className="px-3 py-1.5 rounded-lg bg-red-950/60 hover:bg-red-800 border border-red-600/60 text-red-200 font-semibold cursor-pointer"
                          >
                            🛡️ "Bana şantaj sökmez, elinden geleni ardına koyma!"
                          </button>
                        </>
                      )}

                      {cur.id === 'kerem' && cur.stage === 'initial' && (
                        <>
                          <button
                            onClick={() => handleSendDmMessage('Tamam eski dostum, banını açıyorum 100₺ kahve paranı alırım.')}
                            className="px-3 py-1.5 rounded-lg bg-emerald-950/60 hover:bg-emerald-800 border border-emerald-600/60 text-emerald-200 font-semibold cursor-pointer"
                          >
                            ☕ "Tamam dostum, banını açıyorum (+100₺)"
                          </button>
                          <button
                            onClick={() => handleSendDmMessage('Kusura bakma Kerem, kurallar herkes için geçerli banını açamam.')}
                            className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-semibold cursor-pointer"
                          >
                            🚫 "Kusura bakma, kurallar gereği banını açamam"
                          </button>
                        </>
                      )}

                      {cur.id === 'gizemli' && cur.stage === 'initial' && (
                        <>
                          <button
                            onClick={() => handleSendDmMessage('Olur anlaşalım, 350₺ hesaba yolla yetkiyi hemen vereyim.')}
                            className="px-3 py-1.5 rounded-lg bg-amber-950/60 hover:bg-amber-800 border border-amber-600/60 text-amber-200 font-semibold cursor-pointer"
                          >
                            🤫 "Anlaştık, 350₺ gönder yetkiyi vereyim"
                          </button>
                          <button
                            onClick={() => handleSendDmMessage('Kesinlikle olmaz! Sunucu yetkileri parayla satılmaz, kural dışı teklif yapma!')}
                            className="px-3 py-1.5 rounded-lg bg-emerald-950/60 hover:bg-emerald-800 border border-emerald-600/60 text-emerald-200 font-semibold cursor-pointer"
                          >
                            ⚖️ "Reddediyorum! Sunucu yetkileri asla satılık değildir!"
                          </button>
                        </>
                      )}

                      {cur.id === 'efe' && (
                        <>
                          <button
                            onClick={() => handleSendDmMessage('Teşekkür ederim Efe Bey, sunucu güvenliği ve biletler kontrolüm altında.')}
                            className="px-3 py-1.5 rounded-lg bg-[#383a40] hover:bg-[#5865F2] text-white font-medium cursor-pointer transition-colors"
                          >
                            🫡 "Teşekkürler Kurucu Efe, nöbete tam gaz devam ediyorum."
                          </button>
                          <button
                            onClick={() => handleSendDmMessage('Sunucu seviyesini ve boostları en kısa sürede yükselteceğiz patron.')}
                            className="px-3 py-1.5 rounded-lg bg-[#383a40] hover:bg-[#5865F2] text-white font-medium cursor-pointer transition-colors"
                          >
                            🚀 "Sunucu kasasını biriktirip Seviye Boost açacağız patron."
                          </button>
                          <button
                            onClick={() => handleSendDmMessage('Kusura bakmayın patron, bir daha gecikme veya hata olmayacak.')}
                            className="px-3 py-1.5 rounded-lg bg-[#383a40] hover:bg-[#5865F2] text-white font-medium cursor-pointer transition-colors"
                          >
                            🙏 "Kusura bakmayın patron, daha dikkatli olacağım."
                          </button>
                        </>
                      )}

                      {/* Generic Member DM Choices (including right-clicked members & completed conversations) */}
                      {(cur.id === 'ali' || cur.id.startsWith('user_') || cur.stage === 'completed' || cur.stage === 'rejected') && (
                        <>
                          <button
                            onClick={() => handleSendDmMessage('Selam, sunucuda her şey yolunda mı? Bir sıkıntı olursa bilet açabilirsin.')}
                            className="px-3 py-1.5 rounded-lg bg-[#383a40] hover:bg-[#5865F2] text-white font-medium cursor-pointer transition-colors"
                          >
                            👋 "Selam, sunucuda her şey yolunda mı?"
                          </button>
                          <button
                            onClick={() => handleSendDmMessage('Lütfen sohbet kanallarında kurallara ve üsluba dikkat edelim, resmi uyarıdır.')}
                            className="px-3 py-1.5 rounded-lg bg-amber-950/60 hover:bg-amber-800 border border-amber-600/50 text-amber-200 font-medium cursor-pointer transition-colors"
                          >
                            ⚠️ "Sohbet kurallarına dikkat edelim (Sözlü Uyarı)"
                          </button>
                          <button
                            onClick={() => handleSendDmMessage('Sunucumuza katkıların ve aktifliğin için teşekkür ederiz, iyi eğlenceler!')}
                            className="px-3 py-1.5 rounded-lg bg-emerald-950/60 hover:bg-emerald-800 border border-emerald-600/50 text-emerald-200 font-medium cursor-pointer transition-colors"
                          >
                            🌟 "Sunucudaki aktifliğin için teşekkürler!"
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </>
              )
            })()}
          </div>
        ) : (
          /* Normal Channel / Ticket Chat Flow */
          <>
            {/* Top Channel Header */}
            <div className="h-12 px-4 border-b border-[#202225] flex items-center justify-between shadow-sm shrink-0 bg-[#2b2d31]">
          <div className="flex items-center gap-2.5 truncate">
            {currentTicket ? (
              <>
                <div className="w-6 h-6 rounded bg-[#f23f43]/20 flex items-center justify-center text-[#f23f43]">
                  <Lock className="w-3.5 h-3.5" />
                </div>
                <span className="font-bold text-sm text-white truncate">
                  #{currentTicket.channelId}
                </span>
                <span className="text-[11px] px-2 py-0.5 rounded bg-[#1e1f22] text-[#949ba4] font-medium border border-[#35373c]">
                  {currentTicket.scenario.category || 'Destek'}
                </span>
                {currentTicket.step === 'resolved' ? (
                  <span className="text-[11px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold flex items-center gap-1 border border-emerald-500/30">
                    <Check className="w-3 h-3" />
                    Çözüldü ({currentTicket.autoCloseSeconds ?? 0}s)
                  </span>
                ) : (
                  <span className="text-[11px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 font-bold flex items-center gap-1 border border-amber-500/30 animate-pulse">
                    <AlertCircle className="w-3 h-3" />
                    İnceleme Bekliyor
                  </span>
                )}
              </>
            ) : (
              <>
                <Hash className="w-5 h-5 text-[#80848e]" />
                <span className="font-bold text-sm text-white">
                  {channelNames[activeChannelId] || activeChannelId}
                </span>
              </>
            )}
          </div>

          <div className="flex items-center gap-2.5 text-[#b5bac1]">
            {currentTicket && (
              <button
                onClick={() => closeTicket(currentTicket.channelId)}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-red-600/80 hover:bg-red-600 text-white text-xs font-semibold transition-colors shadow-sm"
                title="Talebi Kapat ve Arşivle"
              >
                <X className="w-3.5 h-3.5" />
                <span>Talebi Kapat</span>
              </button>
            )}
            {!isRaidActive && (
              <button
                onClick={() => triggerRaid()}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-red-950/70 hover:bg-red-600 text-red-300 hover:text-white text-xs font-semibold border border-red-500/40 transition-all shadow-sm"
                title="20 Botluk Baskını Başlat (Test)"
              >
                <Flame className="w-3.5 h-3.5 text-red-400" />
                <span>Baskın Testi</span>
              </button>
            )}
            <div className="relative">
              <input 
                type="text" 
                placeholder="Üye ara..." 
                value={filterQuery}
                onChange={(e) => setFilterQuery(e.target.value)}
                className="w-28 h-6 px-2 text-xs bg-[#1e1f22] rounded text-white placeholder-[#80848e] outline-none" 
              />
            </div>
            <div title="Üye Listesi" className="cursor-pointer hover:text-white">
              <Users className="w-4 h-4" />
            </div>
          </div>
        </div>

        {/* Chat Body OR Special Channels */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3">
          {/* Audit Log Inspector View */}
          {activeChannelId === 'denetim-kaydi' ? (
            <div className="max-w-4xl mx-auto space-y-4 py-3">
              {/* Header & Filter Controls */}
              <div className="p-4 rounded-lg bg-[#2b2d31] border border-[#35373c] space-y-3 shadow-md">
                <div className="flex items-center justify-between border-b border-[#35373c] pb-2">
                  <div className="flex items-center gap-2">
                    <ShieldAlert className="w-5 h-5 text-amber-400" />
                    <div>
                      <h3 className="font-bold text-white text-sm">Sunucu Denetim Kayıtları (Audit Log)</h3>
                      <p className="text-[11px] text-[#949ba4]">Moderatör işlemleri, kural cezaları ve bilet hareketleri</p>
                    </div>
                  </div>
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-[#1e1f22] text-amber-400 border border-amber-500/20">
                    Toplam {auditLogs.length} Kayıt
                  </span>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                  {/* Search Bar */}
                  <div className="relative flex-1 min-w-[200px]">
                    <Search className="w-4 h-4 text-[#949ba4] absolute left-3 top-2.5" />
                    <input
                      type="text"
                      placeholder="Kullanıcı adı, eylem veya detay ara..."
                      value={auditSearchQuery}
                      onChange={(e) => setAuditSearchQuery(e.target.value)}
                      className="w-full h-9 pl-9 pr-8 rounded bg-[#1e1f22] border border-[#35373c] text-xs text-white placeholder-[#80848e] outline-none focus:border-[#5865F2]"
                    />
                    {auditSearchQuery && (
                      <button
                        onClick={() => setAuditSearchQuery('')}
                        className="absolute right-2.5 top-2.5 text-zinc-400 hover:text-white"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  {/* Filter Pills */}
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {[
                      { id: 'all', label: 'Tümü' },
                      { id: 'ban', label: '🔨 Ban' },
                      { id: 'mute', label: '🔇 Mute' },
                      { id: 'role', label: '👑 Rol' },
                      { id: 'ticket', label: '📋 Bilet' }
                    ].map((pill) => (
                      <button
                        key={pill.id}
                        onClick={() => setAuditActionFilter(pill.id as any)}
                        className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                          auditActionFilter === pill.id
                            ? 'bg-[#5865F2] text-white font-bold'
                            : 'bg-[#1e1f22] text-[#949ba4] hover:bg-[#35373c] hover:text-white'
                        }`}
                      >
                        {pill.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Log Entries List */}
              <div className="space-y-2">
                {filteredAuditLogs.length === 0 ? (
                  <div className="p-8 text-center text-zinc-400 text-xs rounded-lg bg-[#2b2d31]/40 border border-[#35373c]">
                    Arama kriterine uygun denetim kaydı bulunamadı.
                  </div>
                ) : (
                  filteredAuditLogs.map((log) => {
                    const isBan = log.action.includes('BAN')
                    const isMute = log.action.includes('MUTE') || log.action.includes('SUSTURMA')
                    const isTicket = log.action.includes('TICKET')
                    const isRole = log.action.includes('ROL')

                    return (
                      <div
                        key={log.id}
                        className="p-3 rounded-lg bg-[#2b2d31] border border-[#35373c] hover:border-[#4e5058] transition-all text-xs space-y-1.5 shadow-sm"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono ${
                                isBan
                                  ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                                  : isMute
                                  ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                                  : isTicket
                                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                  : isRole
                                  ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                                  : 'bg-zinc-800 text-zinc-300'
                              }`}
                            >
                              {log.action}
                            </span>
                            <span className="font-bold text-white">
                              Hedef: <span className="text-[#5865F2]">@{log.target}</span>
                            </span>
                          </div>
                          <span className="text-[11px] text-[#949ba4] font-mono">
                            {log.timestamp}
                          </span>
                        </div>

                        <div className="text-zinc-300 text-[11px] leading-relaxed bg-[#1e1f22] p-2 rounded border border-[#35373c]/50">
                          {log.details}
                        </div>

                        <div className="text-[10px] text-zinc-400 flex items-center justify-between pt-0.5">
                          <span>Yetkili / Fail: <strong className="text-zinc-200">{log.moderator}</strong></span>
                        </div>
                      </div>
                    )
                  })
                )}
              </div>
            </div>
          ) : activeChannelId === 'kurallar' ? (
            <div className="max-w-2xl mx-auto space-y-4 py-4">
              <div className="p-5 rounded-lg bg-[#2b2d31] border border-[#383a40] space-y-4">
                <div className="flex items-center gap-2 border-b border-[#383a40] pb-3">
                  <ShieldAlert className="w-6 h-6 text-[#f23f43]" />
                  <h2 className="text-lg font-bold text-white">Root Topluluk Kuralları</h2>
                </div>
                <div className="space-y-3 text-xs leading-relaxed text-[#dbdee1]">
                  <div className="p-2.5 rounded bg-[#1e1f22]">
                    <span className="font-bold text-[#f23f43]">Kural 1 — Saygı ve Küfür:</span> Ailevi, dini veya ırki hakaret kesinlikle yasaktır. İhlal durumunda 6 saat ile kalıcı ban uygulanır.
                  </div>
                  <div className="p-2.5 rounded bg-[#1e1f22]">
                    <span className="font-bold text-amber-400">Kural 2 — Reklam ve Oltalama:</span> DM veya kanallar üzerinden harici sunucu daveti veya sahte Nitro linki atmak doğrudan kalıcı uzaklaştırmadır.
                  </div>
                  <div className="p-2.5 rounded bg-[#1e1f22]">
                    <span className="font-bold text-sky-400">Kural 3 — Ses Kanalları:</span> Sesli odalarda mikrofon basmak, çığlık atmak ve troll ses yazılımları kullanmak yasaktır.
                  </div>
                  <div className="p-2.5 rounded bg-[#1e1f22]">
                    <span className="font-bold text-emerald-400">Kural 4 — Destek Talepleri:</span> Yetkililerle saygılı konuşulmalı ve şikayetlerde kanıt (ekran görüntüsü/saat) sunulmalıdır.
                  </div>
                </div>
              </div>
            </div>
          ) : currentTicket ? (
            /* Streamlined & Authentic Discord Ticket Channel View (Exact Discord Bot Format) */
            <div className="max-w-3xl mx-auto space-y-4 py-1">
              {/* Top Date Divider */}
              <div className="relative flex items-center justify-center my-2 select-none">
                <div className="border-t border-[#3f4147]/60 w-full" />
                <span className="bg-[#313338] px-3 text-[11px] font-bold text-[#949ba4] font-mono shrink-0">
                  8 Kasım 2026
                </span>
              </div>

              {/* Chat Stream */}
              <div className="space-y-4">
                {/* 1. Bot Welcome & Embed Message (Exact match to Last | Moderation Bot) */}
                <div className="flex gap-3 px-1 py-1 hover:bg-[#2e3035]/40 rounded-lg group transition-colors">
                  <div className="w-10 h-10 rounded-full bg-[#ed4245] flex items-center justify-center text-white shrink-0 shadow font-bold text-base">
                    🤖
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="font-bold text-sm text-white hover:underline cursor-pointer">
                        Last | Moderation
                      </span>
                      <span className="bg-[#5865F2] text-white text-[9px] font-bold px-1.5 py-0.2 rounded uppercase tracking-wider">
                        UYG
                      </span>
                      <span className="text-[11px] text-[#949ba4] ml-1">
                        {currentTicket.createdAt || '22:42'}
                      </span>
                    </div>

                    {/* Mentions line */}
                    <div className="text-xs text-[#949ba4] mb-2 flex items-center gap-1.5 font-medium">
                      <span className="bg-[#5865f2]/20 text-[#c9cdfb] px-1.5 py-0.5 rounded font-mono">@{currentTicket.creatorName}</span>
                      <span className="bg-[#5865f2]/20 text-[#c9cdfb] px-1.5 py-0.5 rounded font-mono">@Last Yt</span>
                    </div>

                    {/* Embed Card */}
                    <div className="max-w-xl rounded-md bg-[#2b2d31] border-l-4 border-[#5865F2] p-4 text-xs text-[#dbdee1] space-y-3 shadow-lg">
                      {/* Embed Title */}
                      <div className="font-bold text-sm text-white flex items-center gap-1.5">
                        <span>💬</span>
                        <span>DC Destek - #{currentTicket.channelId}</span>
                      </div>
                      <p className="text-[12px] text-[#dbdee1]">
                        Merhaba <strong className="text-white">@{currentTicket.creatorName}</strong>! Destek talebiniz yetkili ekibimize iletilmiştir.
                      </p>

                      {/* Problem Box */}
                      <div className="space-y-1">
                        <div className="font-bold text-white flex items-center gap-1 text-[11px]">
                          <span>📝</span>
                          <span>Sorun Açıklaması:</span>
                        </div>
                        <div className="bg-[#1e1f22] border border-[#35373c] rounded p-2.5 text-xs text-white leading-relaxed">
                          {currentTicket.scenario.userIssue || currentTicket.scenario.subject}
                        </div>
                      </div>

                      <p className="text-[11px] text-[#949ba4]">
                        Yetkilimiz en kısa sürede sizinle ilgilenecektir. Lütfen gereksiz etiket atmayınız.
                      </p>

                      {/* 3 Columns */}
                      <div className="grid grid-cols-3 gap-2 pt-2 border-t border-[#35373c]/60 text-[11px]">
                        <div>
                          <span className="text-[#949ba4] block font-bold text-[10px]">Talep Sahibi</span>
                          <span className="text-[#5865F2] font-mono truncate block font-semibold">@{currentTicket.creatorName}</span>
                          <span className="text-[9px] text-[#80848e] font-mono">( 1234072927121 )</span>
                        </div>
                        <div>
                          <span className="text-[#949ba4] block font-bold text-[10px]">Kategori</span>
                          <span className="text-zinc-200 font-medium">{currentTicket.scenario.category || 'DC Destek'}</span>
                        </div>
                        <div>
                          <span className="text-[#949ba4] block font-bold text-[10px]">İlgili Yetkili Rolü</span>
                          <span className="text-[#5865F2] font-semibold">@Last Yt</span>
                        </div>
                      </div>

                      {/* Footer */}
                      <div className="text-[10px] text-[#80848e] pt-1">
                        LastGun Ticket Core • bugün saat {currentTicket.createdAt || '22:42'}
                      </div>
                    </div>

                    {/* Discord Action Row Buttons */}
                    <div className="flex flex-wrap items-center gap-2 mt-2.5">
                      <button
                        onClick={() => closeTicket(currentTicket.channelId)}
                        className="px-3 py-1.5 rounded bg-[#da373c] hover:bg-[#a1282c] text-white text-xs font-bold transition-colors flex items-center gap-1.5 shadow cursor-pointer"
                      >
                        <span>🔒</span>
                        <span>Kapat</span>
                      </button>
                      <button
                        onClick={() => {
                          soundEngine.playCoinChime()
                          sendTicketMessage(currentTicket.channelId, 'Bileti ben üstlendim, inceliyorum.')
                        }}
                        className="px-3 py-1.5 rounded bg-[#5865F2] hover:bg-[#4752c4] text-white text-xs font-bold transition-colors flex items-center gap-1.5 shadow cursor-pointer"
                      >
                        <span>👤</span>
                        <span>Bileti Üstlen</span>
                      </button>
                      <button
                        onClick={() => {
                          soundEngine.playKeyClick()
                          alert(`Transkript ID: TX-LOG-${currentTicket.ticketNumber} başarıyla panoya kopyalandı.`)
                        }}
                        className="px-3 py-1.5 rounded bg-[#4e5058] hover:bg-[#6d6f78] text-white text-xs font-bold transition-colors flex items-center gap-1.5 shadow cursor-pointer"
                      >
                        <span>📜</span>
                        <span>Transkript Al</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* 2. Ticket Creator User Message */}
                <div className="flex gap-3 px-1 py-1 hover:bg-[#2e3035]/40 rounded-lg group transition-colors">
                  <div className="w-10 h-10 rounded-full bg-[#f26522] flex items-center justify-center font-bold text-white text-sm shrink-0 shadow">
                    {currentTicket.creatorName.substring(0, 2).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-sm text-white">
                        {currentTicket.creatorName}
                      </span>
                      <span className="text-[11px] text-[#949ba4] font-mono">
                        {currentTicket.createdAt || '22:43'}
                      </span>
                    </div>

                    <div className="text-xs text-[#dbdee1] leading-relaxed">
                      {currentTicket.scenario.userIssue}
                    </div>

                    {/* Discord Inset Quote / Evidence Card (Exact match to screenshot) */}
                    {currentTicket.scenario.evidenceProvided && (
                      <div
                        onClick={() => {
                          const ev = getScenarioEvidence(currentTicket.scenario)
                          setSelectedEvidence(ev)
                          setIsEvidenceModalOpen(true)
                        }}
                        className="mt-2.5 max-w-lg rounded-lg bg-[#232428] border border-[#35373c] p-3 text-xs space-y-2 hover:border-[#5865F2] transition-colors cursor-pointer group shadow-md"
                        title="Kanıt görselini büyütmek için tıkla"
                      >
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-[#da373c] flex items-center justify-center text-[10px] font-bold text-white shadow">
                            {(currentTicket.scenario.accusedUsername || 'BE').substring(0, 2).toUpperCase()}
                          </div>
                          <span className="font-bold text-white text-xs">
                            {currentTicket.scenario.accusedUsername || 'Berk_06'}
                          </span>
                          <span className="bg-red-500/20 text-red-300 border border-red-500/30 text-[9px] font-bold px-1.5 py-0.2 rounded uppercase">
                            ŞÜPHELİ
                          </span>
                          <span className="text-[10px] text-[#949ba4] font-mono ml-auto">
                            Bugün, 14:18:22
                          </span>
                        </div>

                        <div className="text-zinc-300 text-[11px] font-mono bg-[#1b1c20] p-2.5 rounded border border-[#2e3035] leading-relaxed italic">
                          "{currentTicket.scenario.evidenceDetails?.reportedContent || currentTicket.scenario.userIssue}"
                        </div>

                        <div className="flex items-center justify-between text-[10px] font-mono text-[#949ba4] pt-1 border-t border-[#2e3035]">
                          <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
                            <ImageIcon className="w-3.5 h-3.5" /> Ekran Kanıtı Eklendi
                          </span>
                          <span className="text-[#5865F2] group-hover:underline flex items-center gap-1">
                            Büyüt & İncele 🔍
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* 3. Conversation Messages (Mod, Accused, User, Bot Closing) */}
                {(currentTicket.ticketMessages || []).map((tMsg) => {
                  const isAccused = tMsg.sender === 'accused'
                  const isMod = tMsg.sender === 'mod'
                  const isBot = tMsg.sender === 'bot'
                  const isBribe = tMsg.isBribe

                  if (isBot) {
                    return (
                      <div key={tMsg.id} className="flex gap-3 px-1 py-1 hover:bg-[#2e3035]/40 rounded-lg transition-colors">
                        <div className="w-10 h-10 rounded-full bg-[#ed4245] flex items-center justify-center text-white shrink-0 shadow font-bold text-base">
                          🤖
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5 mb-1">
                            <span className="font-bold text-sm text-white">Last | Moderation</span>
                            <span className="bg-[#5865F2] text-white text-[9px] font-bold px-1.5 py-0.2 rounded uppercase tracking-wider">UYG</span>
                            <span className="text-[11px] text-[#949ba4] font-mono ml-1">{tMsg.time}</span>
                          </div>
                          <div className="text-xs text-[#dbdee1] flex items-center gap-1.5 bg-[#2b2d31]/50 border border-[#35373c] p-2 rounded-lg">
                            <span>📁</span>
                            <span className="font-medium">{tMsg.text}</span>
                          </div>
                        </div>
                      </div>
                    )
                  }

                  return (
                    <div
                      key={tMsg.id}
                      className={`flex gap-3 p-3 rounded-xl border transition-all ${
                        isBribe
                          ? 'bg-amber-950/30 border-amber-500/50 shadow-md'
                          : isMod
                          ? 'bg-[#5865F2]/10 border-[#5865F2]/30'
                          : isAccused
                          ? 'bg-rose-950/20 border-rose-500/30'
                          : 'bg-[#2b2d31]/50 border-[#35373c]'
                      }`}
                    >
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white text-sm shrink-0 shadow"
                        style={{
                          backgroundColor: isMod ? '#5865F2' : isAccused ? '#f23f43' : '#23a55a'
                        }}
                      >
                        {isMod ? '🛡️' : tMsg.senderName.substring(0, 2).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span
                            className={`font-bold text-sm ${
                              isMod ? 'text-[#5865F2]' : isAccused ? 'text-red-400' : 'text-white'
                            }`}
                          >
                            {isMod ? `${tMsg.senderName} 🛡️` : tMsg.senderName}
                          </span>
                          <span
                            className={`text-[9px] px-1.5 py-0.2 rounded font-bold uppercase tracking-wider ${
                              isMod
                                ? 'bg-[#5865F2] text-white'
                                : isAccused
                                ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                                : 'bg-zinc-800 text-zinc-400'
                            }`}
                          >
                            {isMod ? 'YÖNETİCİ' : isAccused ? 'ŞÜPHELİ' : 'ŞİKAYETÇİ'}
                          </span>
                          {isBribe && (
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold border border-amber-500/40">
                                💰 Rüşvet Teklifi ({tMsg.bribeAmount}₺)
                              </span>
                              {currentTicket.step !== 'resolved' && (
                                <div className="flex items-center gap-1.5 ml-2">
                                  <button
                                    onClick={() => acceptTicketBribe(currentTicket.channelId, tMsg.bribeAmount || 150)}
                                    className="px-2 py-0.5 rounded bg-amber-600 hover:bg-amber-500 text-black text-[11px] font-bold transition-all shadow cursor-pointer"
                                  >
                                    💵 Kabul Et (+{tMsg.bribeAmount}₺)
                                  </button>
                                  <button
                                    onClick={() => rejectTicketBribeAndBan(currentTicket.channelId)}
                                    className="px-2 py-0.5 rounded bg-red-700 hover:bg-red-600 text-white text-[11px] font-bold transition-all shadow cursor-pointer"
                                  >
                                    ⚖️ Reddet & Banla
                                  </button>
                                </div>
                              )}
                            </div>
                          )}
                          <span className="text-[11px] text-[#949ba4] font-mono ml-auto">
                            {tMsg.time}
                          </span>
                        </div>
                        <div className="text-xs text-[#dbdee1] leading-relaxed">
                          {tMsg.text}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* 3. Action Area (Quick Decision Pills & Chat Input) */}
              {currentTicket.step !== 'resolved' ? (
                <div className="p-3 bg-[#2b2d31] rounded-xl border border-[#383a40] space-y-2.5 shadow-md">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                      <span>⚡ Yetkili Karar Seçenekleri (Tıkla ve Yanıtla):</span>
                    </span>
                    {!currentTicket.accusedPresent && currentTicket.scenario.accusedUsername && (
                      <button
                        onClick={() => summonAccusedToTicket(currentTicket.channelId)}
                        className="px-2.5 py-1 rounded bg-red-950/70 hover:bg-red-800 text-red-200 border border-red-500/40 text-xs font-bold transition-all cursor-pointer flex items-center gap-1 shadow-sm"
                      >
                        <span>⚖️</span>
                        <span>@{currentTicket.scenario.accusedUsername} Şüpheliyi Çağır</span>
                      </button>
                    )}
                  </div>

                  {/* Choice Buttons Pills */}
                  <div className="flex flex-wrap gap-2">
                    {currentTicket.scenario.choices.map((choice) => (
                      <button
                        key={choice.id}
                        onClick={() => resolveTicket(currentTicket.channelId, choice.id)}
                        className="p-2.5 px-3 rounded-lg bg-[#1e1f22] hover:bg-[#5865F2] hover:text-white text-zinc-200 border border-[#383a40] text-xs font-medium transition-all cursor-pointer text-left shadow-sm group flex-1 min-w-[200px]"
                      >
                        <div className="font-bold group-hover:text-white flex items-center gap-1 text-[12px]">
                          <span>💬</span>
                          <span>{choice.label}</span>
                        </div>
                        <div className="text-[11px] text-zinc-400 group-hover:text-zinc-200 truncate mt-0.5">
                          "{choice.replyText}"
                        </div>
                      </button>
                    ))}
                  </div>

                  {/* Item #7: Interrogation / Question Choice Buttons instead of free-text input */}
                  <div className="pt-2 border-t border-[#383a40]/60 space-y-1.5">
                    <div className="text-[10px] font-bold text-[#949ba4] uppercase tracking-wider">
                      🔍 Sorgulama Seçenekleri (Karar vermeden önce soru sor):
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {[
                        'Ekran görüntüsü kanıtını ve saat bilgisini inceliyorum.',
                        'Denetim kayıtlarından (Audit Log) geçmiş siciline bakıyorum.',
                        'Olayın tam olarak hangi kanalda başladığını anlatır mısın?'
                      ].map((qText, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => sendTicketMessage(currentTicket.channelId, qText)}
                          className="px-2.5 py-1.5 rounded-lg bg-[#1e1f22] hover:bg-[#35373c] text-zinc-300 hover:text-white border border-[#383a40] text-[11px] font-medium transition-colors cursor-pointer"
                        >
                          💬 "{qText}"
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                /* Resolved Status & Manual Punishment Reminder */
                <div className="p-4 rounded-xl bg-emerald-950/30 border-2 border-emerald-500/40 space-y-2 shadow-lg">
                  <div className="flex items-center justify-between border-b border-emerald-500/30 pb-2">
                    <div className="flex items-center gap-2 font-bold text-xs text-emerald-400">
                      <Check className="w-4 h-4" />
                      <span>TALEP RESMEN KARARA BAĞLANDI</span>
                    </div>
                    <span className="text-[10px] text-zinc-400 font-mono">
                      Otomatik Kapanış: {currentTicket.autoCloseSeconds ?? 12}s
                    </span>
                  </div>

                  <p className="text-xs text-zinc-200 leading-relaxed bg-[#111215]/80 p-3 rounded-lg border border-emerald-500/20">
                    {currentTicket.resolutionText}
                  </p>

                  <div className="flex items-center justify-between pt-1 text-xs">
                    <span className="text-amber-300 text-[11px] font-medium">
                      👉 <strong>Manuel İşlem:</strong> Şüpheliyi banlamak veya susturmak için sağdaki üye listesinden veya genel sohbetten kullanıcıya sağ tıklayıp Ban Hammer veya Mute uygulayın!
                    </span>
                    <button
                      onClick={() => closeTicket(currentTicket.channelId)}
                      className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow transition-colors cursor-pointer shrink-0"
                    >
                      Talebi Şimdi Kapat
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : activeChannelId.startsWith('ses-') || activeChannelId.startsWith('voice-') ? (
            /* CANLI SESLİ ODA & GİZLİCE DİNLEME (EAVESDROPPING - Item C) */
            <div className="flex-1 flex flex-col p-4 space-y-4 overflow-y-auto">
              {/* Voice Room Top Banner */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-[#182820] via-[#111c16] to-[#0c1510] border border-emerald-500/40 flex flex-wrap items-center justify-between gap-3 shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                    <Radio className="w-6 h-6 animate-pulse" />
                  </div>
                  <div>
                    <h2 className="text-base font-black text-white flex items-center gap-2">
                      <span>{channelNames[activeChannelId] || activeChannelId}</span>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800/40 text-[10px] font-mono font-bold">
                        96 Kbps • RTC Canlı Dinleme
                      </span>
                    </h2>
                    <p className="text-xs text-zinc-400 mt-0.5">
                      Seste {voiceUsers.filter(u => u.channelId === activeChannelId).length} kullanıcı bağlı. Mikrofon ve telsiz konuşmalarını gerçek zamanlı dinleyebilirsiniz.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {connectedVoiceChannel === activeChannelId ? (
                    <button
                      onClick={leaveVoiceChannel}
                      className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-lg shadow-red-950/40 cursor-pointer"
                    >
                      <PhoneOff className="w-4 h-4" />
                      <span>Odadan Ayrıl (Bağlantıyı Kes)</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => joinVoiceChannel(activeChannelId)}
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-lg shadow-emerald-950/40 cursor-pointer"
                    >
                      <Volume2 className="w-4 h-4" />
                      <span>Odaya Bağlan & Canlı Dinle</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Occupants Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {voiceUsers.filter(u => u.channelId === activeChannelId).length === 0 ? (
                  <div className="col-span-full py-12 text-center text-zinc-500 text-xs italic bg-[#1e1f22]/60 rounded-xl border border-dashed border-zinc-700">
                    Bu ses odasında şu an kimse bulunmuyor. Diğer odalara göz atın veya kullanıcıları davet edin.
                  </div>
                ) : (
                  voiceUsers.filter(u => u.channelId === activeChannelId).map((vUser) => {
                    const isSelf = vUser.member.username.toLowerCase() === (iscordAccount?.username || 'admin_overlord').toLowerCase() || vUser.member.username.toLowerCase() === 'admin_overlord'
                    const isKurucu = vUser.member.role === 'Kurucu' || vUser.member.username.toLowerCase() === 'kurucu_efe'

                    return (
                      <div
                        key={vUser.member.id}
                        className={`p-4 rounded-2xl bg-[#1e1f22] border transition-all flex flex-col items-center justify-between text-center relative group min-h-[190px] ${
                          vUser.isSpeaking
                            ? 'border-emerald-400 bg-emerald-950/20 shadow-[0_0_25px_rgba(52,211,153,0.25)]'
                            : 'border-[#33353b]'
                        }`}
                      >
                        {/* Avatar with dynamic talking ring */}
                        <div className="relative my-2">
                          <div
                            className={`w-16 h-16 rounded-full flex items-center justify-center text-white font-black text-xl overflow-hidden shadow-lg transition-all ${
                              vUser.isSpeaking
                                ? 'ring-4 ring-emerald-400 scale-105 shadow-[0_0_20px_#34d399]'
                                : vUser.isMuted
                                ? 'ring-2 ring-red-500 opacity-60'
                                : 'ring-2 ring-zinc-700'
                            }`}
                            style={{ backgroundColor: vUser.member.avatarColor }}
                          >
                            {vUser.member.avatarUrl ? (
                              <img src={vUser.member.avatarUrl} alt={vUser.member.username} className="w-full h-full object-cover" />
                            ) : (
                              vUser.member.username.substring(0, 2).toUpperCase()
                            )}
                          </div>

                          {vUser.isMuted && (
                            <div className="absolute -bottom-1 -right-1 p-1 rounded-full bg-red-600 text-white shadow">
                              <MicOff className="w-3 h-3" />
                            </div>
                          )}
                        </div>

                        <div>
                          <div className="font-bold text-white text-xs truncate max-w-[140px]">
                            {vUser.member.username}
                          </div>
                          <div className="text-[10px] text-zinc-400 mt-0.5">
                            {vUser.member.role}
                          </div>
                          <div className="mt-1">
                            {vUser.isSpeaking ? (
                              <span className="text-emerald-400 font-mono font-bold text-[10px] animate-pulse">
                                🎙️ Konuşuyor...
                              </span>
                            ) : vUser.isMuted ? (
                              <span className="text-red-400 font-mono text-[10px]">
                                🔇 Susturuldu
                              </span>
                            ) : (
                              <span className="text-zinc-500 font-mono text-[10px]">
                                Dinliyor
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Mod Action Buttons (Only for other members, not self or kurucu) */}
                        {!isSelf && !isKurucu && (
                          <div className="flex items-center gap-1.5 mt-3 pt-2 border-t border-[#2e3037] w-full justify-center">
                            <button
                              onClick={() => muteVoiceUser(vUser.member.id)}
                              className={`px-2 py-1 rounded text-[10px] font-bold transition-colors cursor-pointer ${
                                vUser.isMuted
                                  ? 'bg-zinc-800 text-zinc-400 hover:text-white'
                                  : 'bg-amber-950/60 hover:bg-amber-600 text-amber-300 hover:text-white border border-amber-600/30'
                              }`}
                              title={vUser.isMuted ? 'Susturmayı Kaldır' : 'Sunucuda Sustur (Server Mute)'}
                            >
                              {vUser.isMuted ? 'Aç' : 'Sustur'}
                            </button>
                            <button
                              onClick={() => kickVoiceUser(vUser.member.id)}
                              className="px-2 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white text-[10px] font-bold transition-colors cursor-pointer"
                              title="Odadan Çıkar (Disconnect)"
                            >
                              At
                            </button>
                            <button
                              onClick={() => banMember(vUser.member.username, 'Ses odasında kural ihlali / raid planlama')}
                              className="px-2 py-1 rounded bg-red-950/80 hover:bg-red-600 text-red-300 hover:text-white text-[10px] font-bold transition-colors cursor-pointer"
                              title="Sunucudan Yasakla"
                            >
                              Ban
                            </button>
                          </div>
                        )}
                      </div>
                    )
                  })
                )}
              </div>

              {/* Canlı Dinleme & Telsiz Transkripti (Live Eavesdrop Ticker) */}
              <div className="p-4 rounded-2xl bg-[#141518] border border-[#2b2e35] space-y-3 shadow-inner">
                <div className="flex items-center justify-between border-b border-[#242730] pb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                    <span className="text-xs font-bold text-white uppercase tracking-wider">
                      🎙️ Canlı Dinleme & Telsiz Konuşma Akışı (Gizli Dinleme)
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-zinc-400 text-[10px] font-mono">
                    <span className="h-3 w-1 bg-emerald-500 animate-pulse" />
                    <span className="h-4 w-1 bg-emerald-400 animate-pulse" />
                    <span className="h-2 w-1 bg-emerald-600 animate-pulse" />
                    <span className="h-5 w-1 bg-emerald-400 animate-pulse" />
                    <span>CANLI SES DALGASI</span>
                  </div>
                </div>

                <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                  {voiceTranscripts.filter(t => t.channelId === activeChannelId).length === 0 ? (
                    <div className="text-zinc-500 text-xs italic text-center py-6">
                      Henüz bir konuşma yakalanmadı. Üyeler konuştukça telsiz dökümü buraya akacaktır.
                    </div>
                  ) : (
                    voiceTranscripts.filter(t => t.channelId === activeChannelId).map((item) => (
                      <div
                        key={item.id}
                        className={`p-3 rounded-xl border transition-all flex items-start justify-between gap-3 ${
                          item.type === 'raid_plot'
                            ? 'bg-red-950/60 border-red-500/70 shadow-lg animate-in slide-in-from-right-4'
                            : item.type === 'earrape'
                            ? 'bg-amber-950/60 border-amber-500/70 shadow animate-pulse'
                            : item.type === 'cheat'
                            ? 'bg-purple-950/60 border-purple-500/70 shadow'
                            : 'bg-[#1b1d22] border-[#292b33]'
                        }`}
                      >
                        <div className="flex items-start gap-2.5 min-w-0">
                          <div
                            className="w-7 h-7 rounded-full flex items-center justify-center font-bold text-white text-xs shrink-0 overflow-hidden shadow"
                            style={{ backgroundColor: item.avatarColor }}
                          >
                            {item.avatarUrl ? (
                              <img src={item.avatarUrl} alt={item.username} className="w-full h-full object-cover" />
                            ) : (
                              item.username.substring(0, 2).toUpperCase()
                            )}
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-xs text-white">
                                {item.username}
                              </span>
                              <span className="text-[10px] text-zinc-400 font-mono">{item.time}</span>
                              {item.type === 'raid_plot' && (
                                <span className="px-2 py-0.5 rounded bg-red-600 text-white font-bold text-[9px] uppercase tracking-wider animate-bounce">
                                  🚨 ŞÜPHELİ BASKIN / RAID FISILTISI
                                </span>
                              )}
                              {item.type === 'earrape' && (
                                <span className="px-2 py-0.5 rounded bg-amber-500 text-black font-bold text-[9px] uppercase tracking-wider">
                                  🔊 AŞIRI SES / EARRAPE
                                </span>
                              )}
                              {item.type === 'cheat' && (
                                <span className="px-2 py-0.5 rounded bg-purple-600 text-white font-bold text-[9px] uppercase tracking-wider">
                                  ⚠️ HİLE İTİRAFI
                                </span>
                              )}
                            </div>
                            <div className="text-xs text-zinc-200 mt-1 leading-relaxed">
                              "{item.text}"
                            </div>
                          </div>
                        </div>

                        {(item.type === 'raid_plot' || item.type === 'earrape' || item.type === 'cheat') && (
                          <div className="flex items-center gap-1.5 shrink-0">
                            {item.type === 'earrape' && (
                              <button
                                onClick={() => {
                                  const occ = voiceUsers.find(u => u.member.username === item.username)
                                  if (occ) muteVoiceUser(occ.member.id)
                                }}
                                className="px-2.5 py-1 rounded bg-amber-500 hover:bg-amber-400 text-black font-bold text-[10px] cursor-pointer shadow"
                              >
                                Sustur (Mute)
                              </button>
                            )}
                            {(item.type === 'raid_plot' || item.type === 'cheat') && (
                              <button
                                onClick={() => banMember(item.username, `Ses odasında tespit edildi: ${item.text}`)}
                                className="px-2.5 py-1 rounded bg-red-600 hover:bg-red-500 text-white font-bold text-[10px] cursor-pointer shadow"
                              >
                                Anında Banla 🔨
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          ) : (
            /* Standard Channel Chat Flow */
            <>
              {currentMessages.length === 0 ? (
                <div className="text-center py-12 text-zinc-500 text-xs">
                  Bu kanalda henüz mesaj bulunmuyor.
                </div>
              ) : (
                currentMessages.map((msg) => (
                  <div
                    key={msg.id}
                    onContextMenu={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      setContextMenu({
                        x: e.clientX,
                        y: e.clientY,
                        targetUsername: msg.author.username,
                        targetMessageId: msg.id
                      })
                    }}
                    className="group flex gap-3 hover:bg-[#2e3035] -mx-4 px-4 py-1.5 rounded transition-colors cursor-context-menu"
                  >
                    <div 
                      onClick={() => setProfileModalUser(msg.author)}
                      className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0 cursor-pointer hover:opacity-90 transition-opacity overflow-hidden"
                      style={{ backgroundColor: msg.author.avatarColor }}
                    >
                      {msg.author.avatarUrl ? (
                        <img src={msg.author.avatarUrl} alt={msg.author.username} className="w-full h-full object-cover" />
                      ) : (
                        msg.author.username.substring(0, 2).toUpperCase()
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span 
                          onClick={() => setProfileModalUser(msg.author)}
                          className="font-semibold text-sm hover:underline cursor-pointer"
                          style={{
                            color: msg.author.role === 'Kurucu' ? '#ff4757' : msg.author.role === 'Yönetici' ? '#f23f43' : msg.author.role === 'Moderatör' ? '#3ba55d' : msg.author.role === 'VIP Balina' ? '#f0b232' : '#dbdee1'
                          }}
                        >
                          {msg.author.username}
                        </span>
                        <span className="text-[10px] text-[#949ba4]">{msg.timestamp}</span>
                      </div>
                      {msg.isDeleted ? (
                        <div className="flex flex-wrap items-center gap-2 mt-0.5 py-0.5">
                          <span className="text-xs line-through text-zinc-500 font-mono italic select-none break-words">
                            {msg.content}
                          </span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-red-950/60 text-red-400 border border-red-900/40 font-bold tracking-tight">
                            🚫 Mesaj Silindi (Moderatör)
                          </span>
                        </div>
                      ) : (
                        <>
                          <p className="text-sm text-[#dbdee1] leading-relaxed mt-0.5 select-text break-words">
                            {msg.content}
                          </p>
                          {/* Item #8: Render Screenshot Media Card in #ekran-goruntuleri and channels */}
                          {msg.screenshot && (
                            <div
                              onClick={() => {
                                setSelectedEvidence({
                                  type: 'image_ss',
                                  title: msg.screenshot!.title,
                                  subtitle: msg.screenshot!.subtitle,
                                  channelName: `#${channelNames[msg.channelId] || msg.channelId}`,
                                  timestamp: `${msg.timestamp} • ${msg.screenshot!.resolution}`,
                                  authorName: msg.author.username,
                                  reportedContent: msg.screenshot!.description,
                                  extraNotes: 'Üye tarafından #ekran-görüntüleri kanalında paylaşılan medya dosyası.'
                                })
                                setIsEvidenceModalOpen(true)
                              }}
                              className="mt-2 max-w-md rounded-xl overflow-hidden border border-[#3f4147] bg-[#1e1f22] hover:border-[#5865F2] transition-all cursor-pointer shadow-lg group/ss"
                            >
                              <div
                                className="h-28 p-3 flex flex-col justify-between relative"
                                style={{
                                  background:
                                    msg.screenshot.previewTheme === 'scoreboard'
                                      ? 'linear-gradient(135deg, #1e293b 0%, #0f172a 50%, #3b0764 100%)'
                                      : msg.screenshot.previewTheme === 'setup'
                                      ? 'linear-gradient(135deg, #311042 0%, #0f172a 50%, #064e3b 100%)'
                                      : 'linear-gradient(135deg, #1e1b4b 0%, #111827 60%, #1f2937 100%)'
                                }}
                              >
                                <div className="flex items-center justify-between text-[10px] font-mono text-zinc-300">
                                  <span className="px-2 py-0.5 rounded bg-black/50 border border-white/10 text-emerald-300 font-bold">
                                    📷 {msg.screenshot.title}
                                  </span>
                                  <span className="px-1.5 py-0.5 rounded bg-black/50 text-zinc-400">
                                    {msg.screenshot.resolution}
                                  </span>
                                </div>
                                <div className="text-xs font-bold text-white drop-shadow">
                                  {msg.screenshot.subtitle}
                                </div>
                              </div>
                              <div className="px-3 py-1.5 bg-[#2b2d31] flex items-center justify-between text-[10px] text-[#949ba4]">
                                <span>Boyut: {msg.screenshot.fileSize}</span>
                                <span className="text-[#5865F2] font-bold group-hover/ss:underline">
                                  Tam Ekran Görüntüle 🔍
                                </span>
                              </div>
                            </div>
                          )}
                        </>
                      )}
                    </div>

                    <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1 shrink-0 self-start">
                      <button
                        onClick={() => deleteMessage(msg.id)}
                        title="Mesajı Sil"
                        className="p-1 rounded hover:bg-[#35373c] text-zinc-400 hover:text-red-400"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
              <div ref={chatScrollRef} />
            </>
          )}
        </div>

        {/* Item #7: Channel Choice Buttons Only (For non-voice text channels) */}
        {!currentTicket &&
          activeChannelId !== 'kurallar' &&
          activeChannelId !== 'denetim-kaydi' &&
          !activeChannelId.startsWith('ses-') &&
          !activeChannelId.startsWith('voice-') && (
          <div className="p-3 bg-[#2b2d31] border-t border-[#202225] shrink-0 space-y-1.5">
            <div className="text-[10px] font-bold text-[#949ba4] uppercase tracking-wider flex items-center justify-between">
              <span>⚡ Moderatör Mesaj Seçenekleri (#{channelNames[activeChannelId] || activeChannelId}):</span>
              <span className="text-[#5865F2] font-mono">Tıkla & Gönder</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {getModeratorChannelChoices(activeChannelId, channelNames[activeChannelId] || activeChannelId).map((choiceObj) => (
                <button
                  key={choiceObj.id}
                  type="button"
                  onClick={() => sendMessage(activeChannelId, choiceObj.text)}
                  className="px-3 py-1.5 rounded-lg bg-[#1e1f22] hover:bg-[#5865F2] text-zinc-200 hover:text-white border border-[#383a40] text-xs font-medium transition-all cursor-pointer text-left"
                >
                  {choiceObj.label}
                </button>
              ))}
            </div>
          </div>
        )}
        </>
        )}
      </div>

      {/* 4. Categorized Members Sidebar Right (#2b2d31) */}
      {serverViewMode !== 'dms' && (
      <div className="w-60 bg-[#2b2d31] flex flex-col border-l border-[#202225] p-3 overflow-y-auto shrink-0 select-none">
        {/* Active Raiders Section */}
        {isRaidActive && activeRaiders.length > 0 && (
          <div className="mb-4 p-2 rounded-lg bg-red-950/70 border border-red-500/40 shadow-lg">
            <div className="flex items-center justify-between text-[11px] font-bold text-red-300 uppercase tracking-wider mb-2">
              <span className="flex items-center gap-1.5 animate-pulse">
                <Flame className="w-3.5 h-3.5 text-red-400 animate-bounce" />
                🚨 BASKINCI BOTLAR ({activeRaiders.length})
              </span>
            </div>
            <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
              {activeRaiders.map((raiderUsername) => {
                return (
                  <div
                    key={raiderUsername}
                    onContextMenu={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      setContextMenu({
                        x: e.clientX,
                        y: e.clientY,
                        targetUsername: raiderUsername
                      })
                    }}
                    className="flex items-center justify-between gap-1.5 px-2 py-1 rounded bg-red-900/30 hover:bg-red-900/60 border border-red-500/20 group transition-colors"
                  >
                    <div className="flex items-center gap-1.5 min-w-0">
                      <div className="w-5 h-5 rounded-full bg-red-600 flex items-center justify-center font-black text-white text-[9px] shrink-0">
                        ⚡
                      </div>
                      <span className="text-xs font-semibold text-red-200 truncate">
                        {raiderUsername}
                      </span>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        banMember(raiderUsername, '🚨 Aktif Baskın / Spam Botu')
                      }}
                      className="px-2 py-0.5 rounded bg-red-600 hover:bg-red-500 text-white font-bold text-[10px] shadow transition-transform active:scale-95 shrink-0"
                      title="Saldırganı Derhal Sunucudan Yasakla"
                    >
                      BAN
                    </button>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {rolesOrder.map((role) => {
          const roleMembers = onlineMembers.filter((m) => m.role === role && (!isRaidActive || !activeRaiders.includes(m.username)))
          if (roleMembers.length === 0) return null

          return (
            <div key={role} className="mb-3">
              <div className="text-[11px] font-bold text-[#949ba4] uppercase tracking-wider mb-1">
                {role.toUpperCase()} — {roleMembers.length}
              </div>
              <div className="space-y-0.5">
                {roleMembers.map((m) => (
                  <div
                    key={m.id}
                    onContextMenu={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      setContextMenu({
                        x: e.clientX,
                        y: e.clientY,
                        targetUsername: m.username
                      })
                    }}
                    onClick={() => setProfileModalUser(m)}
                    className="flex items-center gap-2.5 px-2 py-1.5 rounded hover:bg-[#35373c] cursor-pointer group"
                  >
                    <div className="relative w-8 h-8 rounded-full flex items-center justify-center font-bold text-white text-xs shrink-0 overflow-hidden" style={{ backgroundColor: m.avatarColor }}>
                      {m.avatarUrl ? (
                        <img src={m.avatarUrl} alt={m.username} className="w-full h-full object-cover" />
                      ) : (
                        m.username.substring(0, 2).toUpperCase()
                      )}
                      <div 
                        className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-[#2b2d31] ${
                          m.isMuted && m.mutedUntil && m.mutedUntil > Date.now() ? 'bg-[#da373c]' : 'bg-[#23a55a]'
                        }`} 
                      />
                    </div>
                    <div className="truncate min-w-0">
                      <div 
                        className="text-xs font-semibold truncate flex items-center gap-1"
                        style={{
                          color: m.role === 'Yönetici' ? '#f23f43' : m.role === 'Moderatör' ? '#3ba55d' : m.role === 'VIP Balina' ? '#f0b232' : '#dbdee1'
                        }}
                      >
                        <span className="truncate">{m.username}</span>
                        {m.isMuted && m.mutedUntil && m.mutedUntil > Date.now() && (
                          <span title="Susturuldu (Mesaj yazamaz)">
                            <VolumeX className="w-3 h-3 text-red-400 shrink-0" />
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-[#949ba4] truncate">
                        {m.isMuted && m.mutedUntil && m.mutedUntil > Date.now()
                          ? <span className="text-red-400/90 font-medium">Susturuldu (Mute)</span>
                          : (m.activity || 'Çevrimiçi')}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        })}

        {offlineMembers.length > 0 && (
          <div className="mt-2 pt-2 border-t border-[#35373c]">
            <div className="text-[11px] font-bold text-[#949ba4] uppercase tracking-wider mb-1">
              ÇEVRİMDIŞI — {offlineMembers.length}
            </div>
            <div className="space-y-0.5 opacity-60">
              {offlineMembers.map((m) => (
                <div
                  key={m.id}
                  onContextMenu={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    setContextMenu({
                      x: e.clientX,
                      y: e.clientY,
                      targetUsername: m.username
                    })
                  }}
                  onClick={() => setProfileModalUser(m)}
                  className="flex items-center gap-2.5 px-2 py-1 rounded hover:bg-[#35373c] cursor-pointer"
                >
                  <div className="w-7 h-7 rounded-full bg-zinc-600 flex items-center justify-center font-bold text-white text-xs shrink-0">
                    {m.username.substring(0, 2).toUpperCase()}
                  </div>
                  <span className="text-xs text-[#949ba4] truncate">{m.username}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      )}

      {/* Clamped Context Menu */}
      {contextMenu && (
        <div
          style={getClampedMenuPos()}
          className="fixed z-[99999] w-52 bg-[#111214] border border-[#232428] rounded-md shadow-2xl p-1 text-xs select-none"
          onClick={(e) => e.stopPropagation()}
        >
          {contextMenu.isVoiceKick ? (
            <button
              onClick={() => {
                if (contextMenu.voiceMemberId) kickVoiceUser(contextMenu.voiceMemberId)
                setContextMenu(null)
              }}
              className="w-full text-left px-2 py-1.5 rounded hover:bg-[#da373c] text-white flex items-center justify-between"
            >
              <span>Sesten At (Bağlantıyı Kes)</span>
              <VolumeX className="w-3.5 h-3.5" />
            </button>
          ) : (
            <>
              {contextMenu.targetUsername && (
                <>
                  <div className="px-2 py-1.5 text-[10px] font-bold text-zinc-400 uppercase border-b border-[#232428] mb-1 flex items-center justify-between">
                    <span className="truncate max-w-[120px]">@{contextMenu.targetUsername}</span>
                    <span className="text-[9px] text-[#5865F2] font-mono">ISCORD</span>
                  </div>
                  {/* Item #6: Send DM on Right-Click */}
                  <button
                    onClick={() => {
                      soundEngine.playKeyClick()
                      const dmId = openUserDm(contextMenu.targetUsername!)
                      setActiveDmId(dmId)
                      setServerViewMode('dms')
                      setContextMenu(null)
                    }}
                    className="w-full text-left px-2 py-1.5 rounded bg-[#5865F2]/20 hover:bg-[#5865F2] text-[#c9cdfb] hover:text-white font-bold flex items-center gap-2 mb-0.5 cursor-pointer"
                  >
                    <span>💬 DM'den Mesaj Gönder</span>
                  </button>
                  <button
                    onClick={() => {
                      const u = members.find((m) => m.username === contextMenu.targetUsername)
                      if (u) setProfileModalUser(u)
                      setContextMenu(null)
                    }}
                    className="w-full text-left px-2 py-1.5 rounded hover:bg-[#35373c] text-zinc-200 hover:text-white flex items-center gap-2 cursor-pointer"
                  >
                    <span>👤 Profil & Ceza Sicili</span>
                  </button>
                  <button
                    onClick={() => {
                      setAuditSearchQuery(contextMenu.targetUsername!)
                      setActiveChannelId('denetim-kaydi')
                      setContextMenu(null)
                    }}
                    className="w-full text-left px-2 py-1.5 rounded hover:bg-[#35373c] text-indigo-300 hover:text-white flex items-center gap-2 cursor-pointer"
                  >
                    <span>🔍 Loglarını İncele</span>
                  </button>
                  <button
                    onClick={() => {
                      const u = members.find((m) => m.username === contextMenu.targetUsername)
                      if (u) setRoleEditModalUser(u)
                      setContextMenu(null)
                    }}
                    className="w-full text-left px-2 py-1.5 rounded hover:bg-[#35373c] text-zinc-200 hover:text-white flex items-center gap-2 cursor-pointer"
                  >
                    <span>👑 Rolleri Yönet</span>
                  </button>
                  <div className="my-1 border-t border-[#232428]" />
                  {contextMenu.targetUsername === 'Admin_Overlord' || (iscordAccount && contextMenu.targetUsername === iscordAccount.username) ? (
                    <div className="px-2 py-1.5 rounded bg-indigo-950/50 border border-indigo-500/40 text-[11px] text-indigo-300 font-bold flex items-center gap-1.5">
                      <span>🛡️</span>
                      <span>Kendi Hesabın (Yönetici)</span>
                    </div>
                  ) : contextMenu.targetUsername === 'Kurucu_Efe' || members.find((m) => m.username === contextMenu.targetUsername)?.role === 'Kurucu' ? (
                    <div className="px-2 py-1.5 rounded bg-amber-950/40 border border-amber-500/40 text-[11px] text-amber-300 font-bold flex items-center gap-1.5">
                      <span>👑</span>
                      <span>Sunucu Kurucusu (Dokunulmaz)</span>
                    </div>
                  ) : (
                    <>
                      <button
                        onClick={() => {
                          muteMember(contextMenu.targetUsername!, 15)
                          setContextMenu(null)
                        }}
                        className="w-full text-left px-2 py-1.5 rounded hover:bg-amber-600/30 text-amber-300 hover:text-amber-200 cursor-pointer"
                      >
                        15 Dk Sustur (Mute)
                      </button>
                      <button
                        onClick={() => {
                          muteMember(contextMenu.targetUsername!, 60)
                          setContextMenu(null)
                        }}
                        className="w-full text-left px-2 py-1.5 rounded hover:bg-amber-600 text-amber-300 hover:text-white cursor-pointer"
                      >
                        1 Saat Sustur (Mute)
                      </button>
                      <button
                        onClick={() => {
                          banMember(contextMenu.targetUsername!, 'Moderatör tarafından kural ihlali nedeniyle banlandı.')
                          setContextMenu(null)
                        }}
                        className="w-full text-left px-2 py-1.5 rounded hover:bg-[#da373c] text-red-400 hover:text-white font-medium cursor-pointer"
                      >
                        Sunucudan Yasakla (Ban)
                      </button>
                    </>
                  )}
                </>
              )}
              {contextMenu.targetMessageId && (
                <button
                  onClick={() => {
                    deleteMessage(contextMenu.targetMessageId!)
                    setContextMenu(null)
                  }}
                  className="w-full text-left px-2 py-1.5 rounded hover:bg-[#da373c] text-zinc-300 hover:text-white mt-1 border-t border-[#232428] cursor-pointer"
                >
                  Mesajı Sil
                </button>
              )}
            </>
          )}
        </div>
      )}

      {/* User Profile Popout Modal */}
      {profileModalUser && (
        <div 
          className="fixed inset-0 z-[99999] bg-black/60 flex items-center justify-center p-4"
          onClick={() => setProfileModalUser(null)}
        >
          <div 
            className="w-80 bg-[#232428] border border-[#383a40] rounded-xl shadow-2xl overflow-hidden text-xs select-none animate-in fade-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="h-20 bg-[#5865F2] relative p-3 flex justify-end">
              <button onClick={() => setProfileModalUser(null)} className="text-white/80 hover:text-white">
                <X className="w-4 h-4" />
              </button>
              <div 
                className="absolute -bottom-7 left-4 w-16 h-16 rounded-full border-4 border-[#232428] flex items-center justify-center font-bold text-white text-lg shadow-md overflow-hidden"
                style={{ backgroundColor: profileModalUser.avatarColor }}
              >
                {profileModalUser.avatarUrl ? (
                  <img src={profileModalUser.avatarUrl} alt={profileModalUser.username} className="w-full h-full object-cover" />
                ) : (
                  profileModalUser.username.substring(0, 2).toUpperCase()
                )}
              </div>
            </div>

            <div className="pt-9 p-4 space-y-3 bg-[#111214]">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-base font-bold text-white">{profileModalUser.username}</div>
                  <div className="text-[11px] text-[#949ba4]">{profileModalUser.activity || 'Çevrimiçi'}</div>
                </div>
                <button
                  onClick={() => {
                    const dmId = openUserDm(profileModalUser.username)
                    setActiveDmId(dmId)
                    setServerViewMode('dms')
                    setProfileModalUser(null)
                  }}
                  className="px-2.5 py-1.5 rounded-lg bg-[#5865F2] hover:bg-[#4752c4] text-white font-bold text-xs cursor-pointer"
                >
                  💬 DM Gönder
                </button>
              </div>

              {/* User Bio (Hakkında) */}
              {profileModalUser.bio && (
                <div className="border-t border-[#232428] pt-2 space-y-1">
                  <div className="text-[10px] font-bold text-zinc-400 uppercase">Hakkında</div>
                  <div className="text-zinc-200 text-xs italic bg-[#1e1f22] p-2 rounded border border-[#2b2d31] leading-relaxed">
                    "{profileModalUser.bio}"
                  </div>
                </div>
              )}

              {/* Personality / Topluluk Tavrı */}
              {profileModalUser.personality && (
                <div className="border-t border-[#232428] pt-2 space-y-1">
                  <div className="text-[10px] font-bold text-zinc-400 uppercase">Kişilik & Topluluk Tavrı</div>
                  <span className="inline-block text-[11px] font-bold px-2.5 py-1 rounded-full bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
                    {profileModalUser.personality}
                  </span>
                </div>
              )}

              {/* Sunucu İtibarı (Reputation Bar) */}
              <div className="border-t border-[#232428] pt-2 space-y-1">
                <div className="text-[10px] font-bold text-zinc-400 uppercase flex items-center justify-between">
                  <span>Sunucu İtibarı</span>
                  <span className="font-mono text-emerald-400 font-bold">%{profileModalUser.reputation ?? 85}</span>
                </div>
                <div className="w-full h-1.5 bg-[#232428] rounded-full overflow-hidden border border-white/5">
                  <div 
                    className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all" 
                    style={{ width: `${profileModalUser.reputation ?? 85}%` }}
                  />
                </div>
              </div>

              <div className="border-t border-[#232428] pt-2 space-y-1">
                <div className="text-[10px] font-bold text-zinc-400 uppercase">Rol</div>
                <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-[#232428] text-white font-medium text-xs">
                  <UserCheck className="w-3.5 h-3.5 text-[#5865F2]" />
                  <span>{profileModalUser.role}</span>
                </div>
              </div>

              <div className="border-t border-[#232428] pt-2 space-y-1">
                <div className="text-[10px] font-bold text-zinc-400 uppercase">Katılma Tarihi</div>
                <div className="text-zinc-300 font-mono text-[11px]">{profileModalUser.joinedAt}</div>
              </div>

              {/* Dossier / Infractions History */}
              <div className="border-t border-[#232428] pt-2 space-y-1">
                <div className="text-[10px] font-bold text-zinc-400 uppercase flex items-center justify-between">
                  <span>Denetim / Ceza Geçmişi</span>
                  {(() => {
                    const count = auditLogs.filter(
                      (l) => l.target.toLowerCase() === profileModalUser.username.toLowerCase()
                    ).length
                    return (
                      <span
                        className={`text-[9px] font-mono px-1.5 py-0.5 rounded ${
                          count > 0 ? 'bg-red-500/20 text-red-400 font-bold' : 'bg-emerald-500/20 text-emerald-400'
                        }`}
                      >
                        {count > 0 ? `${count} İhlal` : 'Temiz Sicil'}
                      </span>
                    )
                  })()}
                </div>
                {(() => {
                  const userLogs = auditLogs.filter(
                    (l) => l.target.toLowerCase() === profileModalUser.username.toLowerCase()
                  )
                  if (userLogs.length === 0) {
                    return <div className="text-[10px] text-zinc-500 italic">Kayıtlı ceza veya ihlal bulunmuyor.</div>
                  }
                  return (
                    <div className="space-y-1 max-h-20 overflow-y-auto pr-1">
                      {userLogs.slice(0, 3).map((l) => (
                        <div key={l.id} className="text-[10px] p-1.5 rounded bg-[#1e1f22] border border-[#2b2e37]">
                          <div className="text-amber-400 font-bold">{l.action}</div>
                          <div className="text-zinc-400 text-[9px] truncate">{l.details}</div>
                        </div>
                      ))}
                    </div>
                  )
                })()}
              </div>

              <div className="flex gap-2 pt-2 border-t border-[#232428]">
                {profileModalUser.username === 'Admin_Overlord' || (iscordAccount && profileModalUser.username === iscordAccount.username) ? (
                  <div className="w-full py-2 px-3 rounded bg-indigo-950/60 border border-indigo-500/40 text-center text-xs font-bold text-indigo-300">
                    🛡️ Bu Senin Yönetici Hesabın (İşlem Yapılamaz)
                  </div>
                ) : profileModalUser.username === 'Kurucu_Efe' || profileModalUser.role === 'Kurucu' ? (
                  <div className="w-full py-2 px-3 rounded bg-amber-950/60 border border-amber-500/40 text-center text-xs font-bold text-amber-300">
                    👑 Sunucu Kurucusu Dokunulmazdır
                  </div>
                ) : (
                  <>
                    <button
                      onClick={() => {
                        setRoleEditModalUser(profileModalUser)
                        setProfileModalUser(null)
                      }}
                      className="flex-1 py-1.5 rounded bg-[#35373c] hover:bg-[#5865F2] text-white font-semibold text-xs transition-colors"
                    >
                      Rolleri Düzenle
                    </button>
                    <button
                      onClick={() => {
                        muteMember(profileModalUser.username, 60)
                        setProfileModalUser(null)
                      }}
                      className="px-2.5 py-1.5 rounded bg-amber-950/80 hover:bg-amber-600 text-amber-300 hover:text-white font-semibold text-xs transition-colors"
                      title="1 Saat Sustur"
                    >
                      Mute
                    </button>
                    <button
                      onClick={() => {
                        banMember(profileModalUser.username, 'Profil üzerinden banlandı.')
                        setProfileModalUser(null)
                      }}
                      className="px-3 py-1.5 rounded bg-red-950/80 hover:bg-red-600 text-red-300 hover:text-white font-semibold text-xs transition-colors"
                    >
                      Banla
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Item #11: Green "+" Button Modal (Sunucu Ekle / Ortak Topluluk Bağla) */}
      {isDiscoverModalOpen && (
        <div
          className="fixed inset-0 z-[99999] bg-black/70 flex items-center justify-center p-4"
          onClick={() => setIsDiscoverModalOpen(false)}
        >
          <div
            className="w-full max-w-md bg-[#2b2d31] border border-[#383a40] rounded-2xl shadow-2xl p-5 text-xs select-none space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-[#383a40] pb-3">
              <div>
                <h3 className="text-base font-black text-white">🌐 Partner Sunucu Bağla & Kanal Ekle</h3>
                <p className="text-[11px] text-[#949ba4]">
                  Diğer topluluklarla partnerlik kurarak sunucu Hype'ını artırın veya yeni kanal açın.
                </p>
              </div>
              <button
                onClick={() => setIsDiscoverModalOpen(false)}
                className="text-zinc-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2">
              <div className="text-[11px] font-bold text-zinc-300 uppercase">
                Önerilen Partner Topluluklar
              </div>
              {[
                { id: 'val-tr', name: 'Valorant Türkiye Rekabetçi', members: '14.2K Üye', bonus: 5 },
                { id: 'cs2-pro', name: 'CS2 Faceit & Turnuva Ligi', members: '9.8K Üye', bonus: 5 },
                { id: 'dev-hub', name: 'Yazılım & Oyun Geliştiricileri', members: '6.4K Üye', bonus: 5 }
              ].map((srv) => {
                const isPartnered = partneredServers.includes(srv.id)
                return (
                  <div
                    key={srv.id}
                    className="p-3 rounded-xl bg-[#1e1f22] border border-[#383a40] flex items-center justify-between"
                  >
                    <div>
                      <div className="font-bold text-white text-xs">{srv.name}</div>
                      <div className="text-[10px] text-[#949ba4]">{srv.members} • Partnerlik Bonusu: +{srv.bonus} Hype</div>
                    </div>
                    {isPartnered ? (
                      <span className="text-xs font-bold text-emerald-400">✓ Partner Olundu</span>
                    ) : (
                      <button
                        onClick={() => {
                          soundEngine.playCoinChime()
                          setPartneredServers((prev) => [...prev, srv.id])
                          setHype((h) => Math.min(100, h + srv.bonus))
                        }}
                        className="px-3 py-1.5 rounded-lg bg-[#23a55a] hover:bg-[#1a8245] text-white font-bold text-xs cursor-pointer"
                      >
                        Partner Ol (+{srv.bonus} Hype)
                      </button>
                    )}
                  </div>
                )
              })}
            </div>

            <div className="pt-2 border-t border-[#383a40] flex items-center justify-between">
              <button
                onClick={() => {
                  setIsDiscoverModalOpen(false)
                  setNewChannelModal('text')
                }}
                className="px-3.5 py-2 rounded-lg bg-[#5865F2] hover:bg-[#4752c4] text-white font-bold text-xs cursor-pointer"
              >
                + Yeni Metin Kanalı Aç
              </button>
              <button
                onClick={() => setIsDiscoverModalOpen(false)}
                className="px-4 py-2 rounded-lg bg-zinc-700 hover:bg-zinc-600 text-white font-bold text-xs cursor-pointer"
              >
                Kapat
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Channel Modal */}
      {newChannelModal && (
        <div 
          className="fixed inset-0 z-[99999] bg-black/60 flex items-center justify-center p-4"
          onClick={() => setNewChannelModal(null)}
        >
          <form 
            onSubmit={handleCreateChannelSubmit}
            className="w-88 bg-[#2b2d31] border border-[#383a40] rounded-lg shadow-2xl p-5 text-xs select-none space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-[#383a40] pb-2">
              <span className="font-bold text-white text-sm">
                Yeni {newChannelModal === 'text' ? 'Metin' : 'Ses'} Kanalı Oluştur
              </span>
              <button type="button" onClick={() => setNewChannelModal(null)} className="text-zinc-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-[#dbdee1] uppercase">Kanal Adı</label>
              <div className="flex items-center gap-2 bg-[#1e1f22] border border-[#383a40] rounded px-2.5 py-1.5">
                {newChannelModal === 'text' ? (
                  <Hash className="w-4 h-4 text-[#80848e]" />
                ) : (
                  <Volume2 className="w-4 h-4 text-[#80848e]" />
                )}
                <input 
                  type="text" 
                  value={newChannelName}
                  onChange={(e) => setNewChannelName(e.target.value)}
                  placeholder={newChannelModal === 'text' ? 'yeni-kanal' : 'Oyun Odası'}
                  autoFocus
                  className="bg-transparent text-white outline-none flex-1 text-xs"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setNewChannelModal(null)}
                className="px-3 py-1.5 rounded text-zinc-400 hover:text-white"
              >
                İptal
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 bg-[#5865F2] hover:bg-[#4752c4] text-white rounded font-bold"
              >
                Kanalı Oluştur
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Role Edit Modal */}
      {roleEditModalUser && (
        <div 
          className="fixed inset-0 z-[99999] bg-black/60 flex items-center justify-center p-4"
          onClick={() => setRoleEditModalUser(null)}
        >
          <div 
            className="w-96 bg-[#2b2d31] border border-[#383a40] rounded-lg shadow-2xl p-4 text-xs select-none"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-[#383a40] pb-2 mb-3">
              <span className="font-bold text-white text-sm">
                Rolleri Düzenle: @{roleEditModalUser.username}
              </span>
              <button onClick={() => setRoleEditModalUser(null)} className="text-zinc-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-1.5 mb-4">
              {roleEditModalUser.role === 'Kurucu' || roleEditModalUser.username === 'Kurucu_Efe' ? (
                <div className="p-3 rounded-lg bg-amber-950/40 border border-amber-500/40 text-amber-300 text-xs">
                  👑 <strong>Dokunulmaz Rol:</strong> Sunucu Kurucusunun rolü değiştirilemez veya geri alınamaz!
                </div>
              ) : (
                rolesOrder
                  .filter((role) => role !== 'Kurucu')
                  .map((role) => {
                    const isCurrent = roleEditModalUser.role === role
                    return (
                      <button
                        key={role}
                        onClick={() => {
                          changeMemberRole(roleEditModalUser.username, role)
                          setRoleEditModalUser((prev) => prev ? { ...prev, role } : null)
                        }}
                        className={`w-full flex items-center justify-between p-2 rounded transition-colors ${
                          isCurrent
                            ? 'bg-[#5865F2] text-white font-bold'
                            : 'bg-[#1e1f22] text-zinc-300 hover:bg-[#35373c]'
                        }`}
                      >
                        <span>{role}</span>
                        {isCurrent && <Check className="w-4 h-4" />}
                      </button>
                    )
                  })
              )}
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setRoleEditModalUser(null)}
                className="px-4 py-1.5 bg-[#5865F2] hover:bg-[#4752c4] text-white rounded font-bold"
              >
                Tamam
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Evidence Viewer (Delil & Ekran Görüntüsü İnceleme Masası) Modal */}
      {isEvidenceModalOpen && selectedEvidence && (
        <div 
          className="fixed inset-0 z-[99999] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150"
          onClick={() => setIsEvidenceModalOpen(false)}
        >
          <div 
            className="w-full max-w-2xl bg-[#1e2025] border border-[#35373c] rounded-xl shadow-2xl overflow-hidden text-xs select-none relative animate-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Top Bar */}
            <div className="h-12 px-4 bg-[#15171b] border-b border-[#2b2e37] flex items-center justify-between text-zinc-200">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <ImageIcon className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-white text-xs flex items-center gap-2">
                    <span>{selectedEvidence.title}</span>
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-1.5 py-0.2 rounded font-mono">
                      PNG (1920x1080)
                    </span>
                  </div>
                  <div className="text-[10px] text-zinc-400">{selectedEvidence.subtitle}</div>
                </div>
              </div>
              <button 
                onClick={() => setIsEvidenceModalOpen(false)}
                className="p-1 rounded text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body: Realistic Discord Screenshot Simulation */}
            <div className="p-5 space-y-4 bg-[#111215]">
              <div className="text-[11px] text-zinc-400 font-mono flex items-center justify-between border-b border-[#232428] pb-2">
                <span>📎 ŞİKAYETÇİ TARAFINDAN YÜKLENEN DELİL DOSYASI</span>
                <span className="text-emerald-400">Durum: Doğrulanabilir Dijital İz</span>
              </div>

              {/* Discord Screenshot Card Window Mockup */}
              <div className="rounded-lg bg-[#313338] border-2 border-[#232428] shadow-inner overflow-hidden font-sans">
                {/* Simulated Discord Window Top */}
                <div className="h-8 px-3 bg-[#2b2d31] border-b border-[#202225] flex items-center justify-between text-[11px] text-zinc-400">
                  <div className="flex items-center gap-1.5 font-bold text-zinc-300">
                    <Hash className="w-3.5 h-3.5 text-zinc-400" />
                    <span>{selectedEvidence.channelName.replace('#', '')}</span>
                  </div>
                  <span className="font-mono text-[10px] text-zinc-500">Iscord Desktop Client — Alıntı</span>
                </div>

                {/* Simulated Discord Chat Message */}
                <div className="p-4 flex gap-3.5 bg-[#313338]">
                  <div 
                    className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white text-sm shrink-0 shadow-md"
                    style={{ backgroundColor: '#f23f43' }}
                  >
                    {selectedEvidence.authorName.substring(0, 2).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline gap-2 mb-1">
                      <span className="font-bold text-sm text-red-400">
                        {selectedEvidence.authorName}
                      </span>
                      <span className="text-[10px] px-1 rounded bg-[#1e1f22] text-zinc-400 font-mono">
                        ŞÜPHELİ
                      </span>
                      <span className="text-[11px] text-[#949ba4] font-mono">
                        {selectedEvidence.timestamp}
                      </span>
                    </div>

                    <div className="text-sm text-[#dbdee1] leading-relaxed bg-[#2b2d31] p-3 rounded border border-[#383a40] select-text">
                      "{selectedEvidence.reportedContent}"
                    </div>
                  </div>
                </div>
              </div>

              {/* Detective Note & Verification Advice */}
              <div className="p-3 rounded-lg bg-[#181a20] border border-[#262a35] flex items-start gap-3">
                <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div className="text-[11px] text-zinc-300 leading-relaxed">
                  <span className="font-bold text-amber-400">Dedektiflik İpucu:</span> {selectedEvidence.extraNotes}
                </div>
              </div>
            </div>

            {/* Modal Bottom Actions */}
            <div className="h-12 px-4 bg-[#15171b] border-t border-[#2b2e37] flex items-center justify-between">
              <button
                onClick={() => {
                  setAuditSearchQuery(selectedEvidence.authorName)
                  setActiveChannelId('denetim-kaydi')
                  setIsEvidenceModalOpen(false)
                }}
                className="px-3 py-1.5 rounded bg-[#35373c] hover:bg-[#5865F2] text-white font-semibold text-xs flex items-center gap-1.5 transition-colors shadow"
              >
                <Search className="w-3.5 h-3.5" />
                <span>Audit Log'da @{selectedEvidence.authorName} Sicilini Doğrula</span>
              </button>

              <button
                onClick={() => setIsEvidenceModalOpen(false)}
                className="px-4 py-1.5 rounded bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs transition-colors"
              >
                İncelemeyi Kapat
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Item #6: Sunucu Ayarları Modalı (Full Discord Server Settings) */}
      {isServerSettingsOpen && (
        <div 
          className="fixed inset-0 z-[999999] bg-[#313338] flex select-none animate-in fade-in duration-150"
          onClick={() => setIsServerSettingsOpen(false)}
        >
          {/* Settings Left Navigation Sidebar */}
          <div 
            className="w-60 bg-[#2b2d31] p-6 pr-4 flex flex-col justify-between border-r border-[#1f2023]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="space-y-4">
              <div className="text-xs font-bold text-zinc-400 uppercase tracking-wider px-2">
                {serverTitleName}
              </div>

              <div className="space-y-1">
                {[
                  { id: 'overview', label: 'Genel Bakış', icon: Sliders },
                  { id: 'roles', label: 'Roller & Yetkiler', icon: UserCheck },
                  { id: 'automod', label: 'AutoMod & Güvenlik', icon: Shield },
                  { id: 'audit', label: 'Denetim Kaydı (Audit)', icon: ShieldAlert },
                ].map((item) => {
                  const Icon = item.icon
                  const active = serverSettingsTab === item.id
                  return (
                    <button
                      key={item.id}
                      onClick={() => setServerSettingsTab(item.id as any)}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold transition-colors text-left ${
                        active 
                          ? 'bg-[#404249] text-white shadow-sm' 
                          : 'text-[#949ba4] hover:bg-[#35373c] hover:text-zinc-200'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            <div className="pt-4 border-t border-[#383a40]">
              <button
                onClick={() => setIsServerSettingsOpen(false)}
                className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 font-semibold text-xs border border-red-500/20 transition-all cursor-pointer"
              >
                <span>Ayarları Kapat</span>
                <span className="text-[10px] bg-red-500/20 px-1.5 py-0.5 rounded font-mono">ESC</span>
              </button>
            </div>
          </div>

          {/* Settings Main Content Area */}
          <div 
            className="flex-1 bg-[#313338] p-8 overflow-y-auto max-w-3xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* TAB: Genel Bakış */}
            {serverSettingsTab === 'overview' && (
              <div className="space-y-6 animate-in fade-in duration-150">
                <div>
                  <h2 className="text-xl font-black text-white">Sunucuya Genel Bakış</h2>
                  <p className="text-xs text-[#949ba4] mt-0.5">Topluluğun temel kimliğini ve güvenlik standartlarını yapılandırın.</p>
                </div>

                <div className="bg-[#2b2d31] p-4 rounded-xl border border-[#383a40] space-y-4">
                  <div>
                    <label className="block text-[11px] font-bold text-zinc-300 uppercase mb-1.5">Sunucu Adı</label>
                    <input 
                      type="text" 
                      value={serverTitleName}
                      onChange={(e) => setServerTitleName(e.target.value)}
                      className="w-full px-3 py-2 bg-[#1e1f22] border border-[#383a40] rounded-lg text-white text-xs focus:outline-none focus:border-[#5865F2]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-zinc-300 uppercase mb-1.5">Doğrulama Seviyesi</label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { id: 'low', label: 'Düşük', desc: 'E-posta doğrulaması yeterli' },
                        { id: 'medium', label: 'Orta', desc: '5 dakikadan uzun süredir kayıtlı' },
                        { id: 'high', label: 'Yüksek', desc: 'Telefon + E-posta doğrulaması zorunlu' }
                      ].map((lvl) => (
                        <button
                          key={lvl.id}
                          onClick={() => setVerificationLevel(lvl.id as any)}
                          className={`p-3 rounded-lg border text-left cursor-pointer transition-all ${
                            verificationLevel === lvl.id
                              ? 'bg-[#5865F2]/20 border-[#5865F2] text-white'
                              : 'bg-[#1e1f22] border-[#383a40] text-zinc-400 hover:text-zinc-200'
                          }`}
                        >
                          <div className="font-bold text-xs">{lvl.label}</div>
                          <div className="text-[10px] text-[#949ba4] mt-0.5 leading-snug">{lvl.desc}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3 pt-2 border-t border-[#383a40]">
                    <div className="bg-[#1e1f22] p-3 rounded-lg border border-[#383a40]">
                      <div className="text-[10px] text-zinc-400 font-bold uppercase">Toplam Üye</div>
                      <div className="text-lg font-black text-white mt-1">{members.length}</div>
                    </div>
                    <div className="bg-[#1e1f22] p-3 rounded-lg border border-[#383a40]">
                      <div className="text-[10px] text-zinc-400 font-bold uppercase">Metin / Ses Kanalı</div>
                      <div className="text-lg font-black text-emerald-400 mt-1">{Object.keys(channelNames).length}</div>
                    </div>
                    <div className="bg-[#1e1f22] p-3 rounded-lg border border-[#383a40]">
                      <div className="text-[10px] text-zinc-400 font-bold uppercase">Aktif Ticket</div>
                      <div className="text-lg font-black text-amber-400 mt-1">{activeTickets.length}</div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={() => {
                      soundEngine.playSuccess()
                      setIsServerSettingsOpen(false)
                    }}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold text-xs shadow-lg transition-colors cursor-pointer"
                  >
                    Değişiklikleri Kaydet & Kapat
                  </button>
                </div>
              </div>
            )}

            {/* TAB: Roller & Yetkiler */}
            {serverSettingsTab === 'roles' && (
              <div className="space-y-6 animate-in fade-in duration-150">
                <div>
                  <h2 className="text-xl font-black text-white">Roller & İzin Hiyerarşisi</h2>
                  <p className="text-xs text-[#949ba4] mt-0.5">Topluluk rollerini ve yetki sınırlarını yapılandırın.</p>
                </div>

                <div className="space-y-2">
                  {[
                    { name: 'Kurucu', color: '#f59e0b', perms: 'Tam Erişim, Sunucu Mülkiyeti, Mali Kontrol', count: members.filter(m => m.role === 'Kurucu').length },
                    { name: 'Yönetici', color: '#5865F2', perms: 'Ban, Kick, Mute, Kanal Yönetimi, Ticket İnceleme', count: members.filter(m => m.role === 'Yönetici').length },
                    { name: 'Moderatör', color: '#10b981', perms: 'Mute, Mesaj Silme, Slowmode Kontrolü, Ticket Yanıtlama', count: members.filter(m => m.role === 'Moderatör').length },
                    { name: 'VIP Balina', color: '#ec4899', perms: 'VIP Lounge Girişi, Renkli İsim, Öncelikli Destek', count: members.filter(m => m.role === 'VIP Balina').length },
                    { name: 'Kıdemli Üye', color: '#38bdf8', perms: 'Görsel Yükleme, Sesli Kanalda Ekran Paylaşımı', count: members.filter(m => m.role === 'Kıdemli Üye').length },
                    { name: 'Üye', color: '#94a3b8', perms: 'Genel Sohbet Mesaj Gönderme, Reaksiyon Ekleme', count: members.filter(m => m.role === 'Üye').length },
                  ].map((role) => (
                    <div 
                      key={role.name}
                      className="p-3 rounded-xl bg-[#2b2d31] border border-[#383a40] flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-3.5 h-3.5 rounded-full shrink-0 shadow-sm"
                          style={{ backgroundColor: role.color }}
                        />
                        <div>
                          <div className="font-bold text-white text-xs flex items-center gap-2">
                            <span>{role.name}</span>
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-zinc-400 font-mono">
                              {role.count} Üye
                            </span>
                          </div>
                          <div className="text-[10px] text-[#949ba4] mt-0.5">{role.perms}</div>
                        </div>
                      </div>
                      <button 
                        onClick={() => soundEngine.playClick()}
                        className="px-2.5 py-1 rounded bg-[#35373c] hover:bg-[#5865F2] text-white text-[11px] font-semibold transition-colors cursor-pointer"
                      >
                        İzinler
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB: AutoMod & Güvenlik */}
            {serverSettingsTab === 'automod' && (
              <div className="space-y-6 animate-in fade-in duration-150">
                <div>
                  <h2 className="text-xl font-black text-white">🤖 AutoMod & Güvenlik Filtreleri</h2>
                  <p className="text-xs text-[#949ba4] mt-0.5">Zararlı linkleri, spamı ve kara listedeki yasaklı kelimeleri otomatik engelleyin.</p>
                </div>

                <div className="bg-[#2b2d31] p-4 rounded-xl border border-[#383a40] space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-[#383a40]">
                    <div>
                      <div className="font-bold text-white text-xs">Phishing & Discord Davet Linklerini Engelle</div>
                      <div className="text-[10px] text-[#949ba4]">discord.gg, steam-gift veya şüpheli link içeren mesajları sil</div>
                    </div>
                    <input 
                      type="checkbox"
                      checked={botRules.linkFilterEnabled}
                      onChange={(e) => updateBotRules({ linkFilterEnabled: e.target.checked })}
                      className="w-4 h-4 accent-[#5865F2] cursor-pointer"
                    />
                  </div>

                  <div className="flex items-center justify-between pb-3 border-b border-[#383a40]">
                    <div>
                      <div className="font-bold text-white text-xs">Aşırı Büyük Harf (CAPS) ve Spam Koruması</div>
                      <div className="text-[10px] text-[#949ba4]">%70'den fazla büyük harf içeren mesajları uyar</div>
                    </div>
                    <input 
                      type="checkbox"
                      checked={botRules.capsFilterEnabled}
                      onChange={(e) => updateBotRules({ capsFilterEnabled: e.target.checked })}
                      className="w-4 h-4 accent-[#5865F2] cursor-pointer"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-zinc-300 uppercase mb-2">
                      Yasaklı Kelime Kara Listesi ({(botRules.customWords || []).length})
                    </label>

                    <div className="flex gap-2 mb-3">
                      <input 
                        type="text"
                        placeholder="Yeni yasaklı kelime ekle..."
                        value={newBannedWordInput}
                        onChange={(e) => setNewBannedWordInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && newBannedWordInput.trim()) {
                            e.preventDefault()
                            const w = newBannedWordInput.trim().toLowerCase()
                            const current = botRules.customWords || []
                            if (!current.includes(w)) {
                              updateBotRules({ customWords: [...current, w] })
                            }
                            setNewBannedWordInput('')
                          }
                        }}
                        className="flex-1 px-3 py-2 bg-[#1e1f22] border border-[#383a40] rounded-lg text-white text-xs focus:outline-none focus:border-[#5865F2]"
                      />
                      <button
                        onClick={() => {
                          if (newBannedWordInput.trim()) {
                            const w = newBannedWordInput.trim().toLowerCase()
                            const current = botRules.customWords || []
                            if (!current.includes(w)) {
                              updateBotRules({ customWords: [...current, w] })
                            }
                            setNewBannedWordInput('')
                          }
                        }}
                        className="px-4 py-2 bg-[#5865F2] hover:bg-[#4752c4] text-white rounded-lg font-bold text-xs cursor-pointer"
                      >
                        Ekle
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-1.5 max-h-48 overflow-y-auto p-2 bg-[#1e1f22] rounded-lg border border-[#383a40]">
                      {(botRules.customWords || []).map((word: string) => (
                        <span 
                          key={word}
                          className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-red-500/15 border border-red-500/30 text-red-300 text-[11px] font-medium"
                        >
                          <span>{word}</span>
                          <button
                            onClick={() => {
                              updateBotRules({
                                customWords: (botRules.customWords || []).filter((w: string) => w !== word)
                              })
                            }}
                            className="hover:text-white cursor-pointer"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB: Denetim Kaydı (Audit) */}
            {serverSettingsTab === 'audit' && (
              <div className="space-y-6 animate-in fade-in duration-150">
                <div>
                  <h2 className="text-xl font-black text-white">📜 Sunucu Denetim Kaydı (Audit Log)</h2>
                  <p className="text-xs text-[#949ba4] mt-0.5">Yetkililerin ve botların gerçekleştirdiği tüm eylemlerin kayıtları.</p>
                </div>

                <div className="bg-[#2b2d31] p-4 rounded-xl border border-[#383a40] space-y-2 max-h-[460px] overflow-y-auto">
                  {auditLogs.slice(0, 20).map((log) => (
                    <div 
                      key={log.id}
                      className="p-2.5 rounded-lg bg-[#1e1f22] border border-[#383a40] flex items-center justify-between text-xs"
                    >
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-[#5865F2]">@{log.moderator}</span>
                          <span className="text-zinc-400">eylem uyguladı:</span>
                          <span className="px-1.5 py-0.5 rounded bg-red-500/10 text-red-400 font-bold font-mono text-[10px]">
                            {log.action}
                          </span>
                          <span className="font-bold text-white">@{log.target}</span>
                        </div>
                        <div className="text-[11px] text-zinc-400 italic">"{log.details}"</div>
                      </div>
                      <span className="text-[10px] text-zinc-500 font-mono shrink-0">{log.timestamp}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
