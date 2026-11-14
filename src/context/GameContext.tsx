import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react'
import { soundEngine } from '../utils/soundEngine'
import { getAllScenarios } from '../data/scenarioPool'
import { TICKET_SCENARIOS, type TicketScenario } from '../data/ticketScenarios'
import { generateChannelActivity, type ScreenshotAttachment } from '../data/massiveScenarioPool'
import { USER_AVATARS_POOL } from '../data/userAvatars'
import { createUniqueServerMember } from '../data/userProfileSystem'
import type { Achievement, AppId, DesktopWallpaper } from '../types/os'

export interface OsNotification {
  id: string
  type: 'bank' | 'dm' | 'system' | 'vds'
  title: string
  message: string
  timestamp: string
}

export interface EquipmentCartItem {
  id: string
  name: string
  price: number
}

export interface IscordAccount {
  username: string
  email: string
  password: string
  avatarColor: string
  isRegistered: boolean
}

export interface ServerMember {
  id: string
  username: string
  avatarColor: string
  role: 'Kurucu' | 'Yönetici' | 'Moderatör' | 'VIP Balina' | 'Kıdemli Üye' | 'Üye'
  isOnline: boolean
  activity?: string
  joinedAt: string
  isMuted?: boolean
  mutedUntil?: number
  avatarUrl?: string
  bio?: string
  personality?: string
  reputation?: number
  patience?: number
}

export interface ChatMessage {
  id: string
  channelId: string
  author: ServerMember
  content: string
  timestamp: string
  isBannable?: boolean
  banReason?: string
  isDeleted?: boolean
  screenshot?: ScreenshotAttachment
}

export interface VoiceUser {
  member: ServerMember
  channelId: string
  isMuted?: boolean
  isDeafened?: boolean
  isSpeaking?: boolean
}

export interface VoiceTranscript {
  id: string
  channelId: string
  username: string
  avatarColor: string
  avatarUrl?: string
  text: string
  time: string
  type: 'normal' | 'earrape' | 'raid_plot' | 'cheat' | 'whisper'
}

export interface TicketMessage {
  id: string
  sender: 'user' | 'mod' | 'accused' | 'bot'
  senderName: string
  avatarColor?: string
  text: string
  time: string
  isBribe?: boolean
  bribeAmount?: number
}

export interface ActiveTicket {
  channelId: string
  ticketNumber: number
  creatorName: string
  createdAt: string
  scenario: TicketScenario
  step: 'waiting_for_moderator' | 'interrogating' | 'bribe_offered' | 'resolved'
  ticketMessages?: TicketMessage[]
  accusedPresent?: boolean
  bribeOffer?: { amount: number; text: string }
  selectedChoiceId?: string
  resolutionText?: string
  moderatorReply?: string
  userReaction?: string
  isCorrect?: boolean
  rating?: number
  autoCloseSeconds?: number
}

export interface AuditLogEntry {
  id: string
  timestamp: string
  action: string
  target: string
  moderator: string
  details: string
}

export interface BankTransaction {
  id: string
  timestamp: string
  title: string
  amount: number
  type: 'income' | 'expense' | 'transfer'
  account: 'personal' | 'server'
  reference: string
}

export interface BotRulesConfig {
  linkFilterEnabled: boolean
  capsFilterEnabled: boolean
  spamThreshold: number
  customWords: string[]
}

export interface GameContextType {
  // Day & Shift & Time System
  currentDay: number
  ticketsResolvedCount: number
  bansIssuedCount: number
  isShiftModalOpen: boolean
  setIsShiftModalOpen: (val: boolean) => void
  advanceDay: () => void
  gameHour: number
  gameMinute: number
  timeString: string
  canEndShift: boolean
  isDayTransitioning: boolean
  transitionOldDay: number
  transitionNewDay: number
  sleepClockHour: number
  sleepClockMinute: number
  wakeUp: (hour?: number, minute?: number) => void

  // Stam Store & Retro Games
  isStamInstalled: boolean
  installStamClient: () => void

  // Raid & SlowMode
  isSlowModeActive: boolean
  toggleSlowMode: () => void
  isRaidActive: boolean
  triggerRaid: () => void
  activeRaiders: string[]
  totalRaidBotsCount: number
  bannedRaidersCount: number

  // Bot Config
  botRules: BotRulesConfig
  updateBotRules: (newRules: Partial<BotRulesConfig>) => void

  // Stats
  hype: number
  sanity: number
  personalCash: number
  serverFunds: number
  setSanity: React.Dispatch<React.SetStateAction<number>>
  setHype: React.Dispatch<React.SetStateAction<number>>
  drinkCoffee: () => void

  // Members
  members: ServerMember[]
  banMember: (username: string, reason?: string) => boolean
  muteMember: (username: string, minutes: number) => void
  changeMemberRole: (username: string, newRole: ServerMember['role']) => void

  // Channels & Live Voice
  activeChannelId: string
  setActiveChannelId: (id: string) => void
  channelNames: Record<string, string>
  updateChannelName: (channelId: string, newName: string) => boolean
  createChannel: (type: 'text' | 'voice', name: string) => void
  deleteChannel: (channelId: string) => boolean
  voiceUsers: VoiceUser[]
  connectedVoiceChannel: string | null
  voiceTranscripts: VoiceTranscript[]
  kickVoiceUser: (memberId: string) => void
  muteVoiceUser: (memberId: string) => void
  joinVoiceChannel: (channelId: string) => void
  leaveVoiceChannel: () => void

  // Chat
  messages: ChatMessage[]
  sendMessage: (channelId: string, content: string) => void
  deleteMessage: (messageId: string) => void

  // Tickets
  activeTickets: ActiveTicket[]
  resolveTicket: (channelId: string, choiceId: string) => void
  closeTicket: (channelId: string) => void
  summonAccusedToTicket: (channelId: string) => void
  acceptTicketBribe: (channelId: string, amount: number) => { success: boolean; message: string }
  rejectTicketBribeAndBan: (channelId: string) => void
  sendTicketMessage: (channelId: string, text: string) => void

  // Audit
  auditLogs: AuditLogEntry[]

  // Store & Inventory
  ownedEquipment: string[]
  ownedBots: string[]
  buyEquipment: (id: string, cost: number) => boolean
  buyBot: (id: string, monthlyCost: number) => boolean

  // Casino
  adjustPersonalCash: (delta: number) => void

  // Banking, Crypto & Mevduat
  bankTransactions: BankTransaction[]
  activeLoan: number
  creditScore: number
  addBankTransaction: (tx: { title: string; amount: number; type: 'income' | 'expense' | 'transfer'; account?: 'personal' | 'server'; reference?: string }) => void
  transferToPersonal: (amount: number) => { success: boolean; message: string }
  transferToServer: (amount: number) => { success: boolean; message: string }
  takeBankLoan: (amount: number) => { success: boolean; message: string }
  repayBankLoan: (amount: number) => { success: boolean; message: string }
  modCoinBalance: number
  modCoinPrice: number
  buyModCoin: (tlAmount: number) => { success: boolean; message: string }
  sellModCoin: (coinAmount: number) => { success: boolean; message: string }
  termDeposit: { principal: number; interestRate: number; daysRemaining: number; totalProfit: number } | null
  openTermDeposit: (amount: number, days: number) => { success: boolean; message: string }
  withdrawTermDeposit: () => { success: boolean; message: string }

  // Direct Messages (DMs)
  dmConversations: Record<string, DmConversation>
  sendDmMessage: (dmId: string, text: string) => void
  openUserDm: (username: string) => string

  // Server Boost & Level
  serverLevel: number
  upgradeServerLevel: () => { success: boolean; message: string }

  // Community Bots & Glitch
  botGlitchActive: boolean
  restartBots: () => void

  // Cyber Defense (Terminal)
  nukeAllRaiders: () => boolean

  // Games Store (Stam)
  ownedGames: string[]
  buyGame: (gameId: string, price: number) => { success: boolean; message: string }

  // Advertising Campaign (AdClick) & Gradual Member Queue
  launchAdCampaign: (tier: 'small' | 'medium' | 'mega', source: 'personal' | 'server') => { success: boolean; message: string }
  pendingAdMembers: number

  // Achievements
  achievements: Achievement[]
  recentAchievement: Achievement | null
  dismissAchievementToast: () => void
  unlockAchievement: (id: string) => void

  // Wallpaper
  wallpaper: DesktopWallpaper
  setWallpaper: (wp: DesktopWallpaper) => void

  // Stats Counters & Paid Cooldown Actions
  coffeeDrankCount: number
  coffeeCooldown: number
  catCooldown: number
  petCat: () => { success: boolean; message: string }

  // Installed Desktop Apps & Tutorial
  installedApps: AppId[]
  installApp: (appId: AppId) => void
  tutorialStep: number
  setTutorialStep: (step: number) => void

  // Iscord User Account Registration
  iscordAccount: IscordAccount
  registerIscordAccount: (username: string, email: string, password: string, avatarColor: string) => void

  // Equipment Shopping Cart
  equipmentCart: EquipmentCartItem[]
  addToEquipmentCart: (item: EquipmentCartItem) => void
  removeFromEquipmentCart: (id: string) => void
  clearEquipmentCart: () => void
  checkoutEquipmentCart: () => { success: boolean; message: string }

  // Remote VDS & Bot Hosting System
  hasVds: boolean
  vdsIp: string
  vdsAccessCode: string
  isVdsConnected: boolean
  vdsInstalledApps: string[]
  activeBots: string[]
  rentVds: (source: 'personal' | 'server') => { success: boolean; message: string }
  connectToVds: (code: string) => { success: boolean; message: string }
  disconnectVds: () => void
  installVdsApp: (vdsAppId: string) => void
  toggleBotActive: (botId: string) => void

  // OS Bottom-Right Notifications
  osNotifications: OsNotification[]
  pushNotification: (notif: Omit<OsNotification, 'id' | 'timestamp'>) => void
  dismissNotification: (id: string) => void
}

export interface DmMessage {
  id: string
  sender: 'user' | 'me'
  text: string
  time: string
}

export interface DmConversation {
  id: string
  name: string
  tag: string
  avatarColor: string
  status: string
  stage: string
  messages: DmMessage[]
}

export const INITIAL_DM_CONVERSATIONS: Record<string, DmConversation> = {
  karanlik: {
    id: 'karanlik',
    name: 'xXx_Karanlik_xXx',
    tag: '#1337',
    avatarColor: '#f23f43',
    status: 'Banlı Kullanıcı (İtiraz)',
    stage: 'initial',
    messages: [
      {
        id: 'k1',
        sender: 'user',
        text: 'Reis selam, dün gece haksız yere sınırsız ban yedim. Valla küfrü kuzenim yazmış.',
        time: '14:22'
      },
      {
        id: 'k2',
        sender: 'user',
        text: 'Şahsi IBAN numaranı ver, hemen 250₺ FAST havalesi atayım unbanla beni. Kimse görmez aramızda kalır.',
        time: '14:23'
      }
    ]
  },
  cagan: {
    id: 'cagan',
    name: 'Vip_Cagan',
    tag: '#9999',
    avatarColor: '#f0b232',
    status: 'VIP Balina Talebi',
    stage: 'initial',
    messages: [
      {
        id: 'c1',
        sender: 'user',
        text: 'Selamın aleyküm adminim. Sunucuda bana özel "VIP Balina" rolü tanımlarsan şahsi IBAN\'ına doğrudan 400₺ FAST ateşlerim. Ne dersin gizlice halledelim mi?',
        time: '15:05'
      }
    ]
  },
  selo: {
    id: 'selo',
    name: 'Hacker_Selo',
    tag: '#0001',
    avatarColor: '#9b59b6',
    status: 'Tehdit & Şantaj',
    stage: 'initial',
    messages: [
      {
        id: 's1',
        sender: 'user',
        text: 'Selam mod bey. Elimde sunucuda rüşvet aldığın sahte loglar var. Kurucuya atmamı istemiyorsan bana 150₺ ateşle, yoksa akşam sunucuna bot raid atarım!',
        time: '15:08'
      }
    ]
  },
  kerem: {
    id: 'kerem',
    name: 'Eski_Mod_Kerem',
    tag: '#1923',
    avatarColor: '#3498db',
    status: 'Eski Yetkili (Af Talebi)',
    stage: 'initial',
    messages: [
      {
        id: 'km1',
        sender: 'user',
        text: 'Kanka naber ya, eski mod Kerem ben. Hesabım çalınmıştı phishing linki attılar diye banlandım. Kurtardım hesabı rica etsem banımı açar mısın? 100₺ kahve parası da atarım sana.',
        time: '15:12'
      }
    ]
  },
  ali: {
    id: 'ali',
    name: 'Mod_Ali',
    tag: '#4412',
    avatarColor: '#3ba55d',
    status: 'Çevrimiçi (Moderatör)',
    stage: 'initial',
    messages: [
      {
        id: 'a1',
        sender: 'user',
        text: 'Kanka kurucu toplantıda akşama kadar yok. Biletleri salıp yarım saat kahve içip dedikodu yapak mı?',
        time: '15:10'
      }
    ]
  },
  efe: {
    id: 'efe',
    name: 'Kurucu_Efe',
    tag: '#0001',
    avatarColor: '#e74c3c',
    status: '👑 Sunucu Sahibi & Kurucu',
    stage: 'initial',
    messages: [
      {
        id: 'efe_1',
        sender: 'user',
        text: 'Adminim selam, genel durumu uzaktan izliyorum. Sunucu kasasındaki fonları çarçur etme, sunucuyu Seviye 2\'ye boostlamak ve yeni güvenlik/müzik botları almak için biriktir. Disiplini elden bırakma, gözüm üzerinde!',
        time: '13:00'
      }
    ]
  },
  gizemli: {
    id: 'gizemli',
    name: 'GizemliOyuncu_07',
    tag: '#7712',
    avatarColor: '#8e44ad',
    status: 'Yeni Üye (Şüpheli Talep)',
    stage: 'initial',
    messages: [
      {
        id: 'giz_1',
        sender: 'user',
        text: 'Kral selam, aramızda kalsın kimseye söyleme. Şahsi IBAN\'ına 350₺ FAST ateşlesem bana gizlice Yönetici veya Mod permi tanımlar mısın? Kurucuya falan hiç çaktırmam, ne dersin?',
        time: '15:20'
      }
    ]
  }
}

export const INITIAL_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_blood',
    title: 'İlk Darbe',
    description: 'İlk kural ihlalcisini sunucudan kalıcı olarak uzaklaştır.',
    icon: '🔨',
    isUnlocked: false
  },
  {
    id: 'coffee_addict',
    title: 'Kafein Bağımlısı',
    description: 'Masanın üzerindeki kahveden toplam 5 fincan tüket.',
    icon: '☕',
    isUnlocked: false
  },
  {
    id: 'raid_stopper',
    title: 'Çelik Kalkan',
    description: '20 kişilik trol baskınını başarıyla püskürt ve sunucuyu kurtar.',
    icon: '🛡️',
    isUnlocked: false
  },
  {
    id: 'ticket_master',
    title: 'Halk Kahramanı',
    description: 'Destek biletlerinde 5 davayı başarıyla çözüme bağla.',
    icon: '⭐',
    isUnlocked: false
  },
  {
    id: 'bribe_taker',
    title: 'Kirli Anlaşma',
    description: 'Gizli DM veya bilet üzerinden şahsi banka hesabına rüşvet kabul et.',
    icon: '🤫',
    isUnlocked: false
  },
  {
    id: 'righteous_mod',
    title: 'Adaletin Kılıcı',
    description: 'Rüşvet teklifini elinin tersiyle iterek suçluyu kalıcı olarak banla.',
    icon: '⚖️',
    isUnlocked: false
  },
  {
    id: 'vip_dealer',
    title: 'VIP Simsarı',
    description: 'Gizli anlaşma sonrasında kullanıcıya VIP Balina rolünü teslim et.',
    icon: '👑',
    isUnlocked: false
  },
  {
    id: 'crypto_whale',
    title: 'Kripto Balinası',
    description: 'NeoBank kripto borsasında 10 veya daha fazla ModCoin (MOD) biriktir.',
    icon: '🪙',
    isUnlocked: false
  },
  {
    id: 'millionaire',
    title: 'Zengin Yetkili',
    description: 'Şahsi vadesiz banka hesabındaki nakit paranı 2.000₺ üzerine çıkar.',
    icon: '💰',
    isUnlocked: false
  },
  {
    id: 'paranoia_survivor',
    title: 'Akıl Tutulması',
    description: 'Sanity (Akıl Sağlığı) %20 altındayken bir krizi başarıyla yönet.',
    icon: '😵',
    isUnlocked: false
  },
  {
    id: 'detective',
    title: 'Sherlock Mod',
    description: 'Şüpheliye ait ekran görüntüsü veya sistem log delilini incele.',
    icon: '🔍',
    isUnlocked: false
  },
  {
    id: 'night_shift',
    title: 'Gece Nöbetçisi',
    description: 'Görevin 3. gününe başarıyla ulaşarak vardiyayı tamamla.',
    icon: '🌙',
    isUnlocked: false
  },
  {
    id: 'founder_approved',
    title: 'Kurucu Takdiri',
    description: 'Kurucu Efe\'nin gizli müşteri sınavını dürüstlükle geçerek prim kazan.',
    icon: '👑',
    isUnlocked: false
  },
  {
    id: 'server_boost_2',
    title: 'Topluluk Seviye 2',
    description: 'Sunucu kasasından 800₺ harcayarak sunucu seviyesini yükselt.',
    icon: '🚀',
    isUnlocked: false
  },
  {
    id: 'cyber_hacker',
    title: 'Siber Karşı Saldırı',
    description: 'Terminalden nuke_botnet komutuyla 20 botluk baskını tek darbede ez.',
    icon: '💻',
    isUnlocked: false
  },
  {
    id: 'gamer_mod',
    title: 'Retro Oyuncu',
    description: 'Stam platformundan retro mini oyun satın alıp stresini at.',
    icon: '🎮',
    isUnlocked: false
  }
]

const GameContext = createContext<GameContextType | null>(null)

const INITIAL_MEMBERS: ServerMember[] = [
  { id: 'm0', username: 'Kurucu_Efe', avatarColor: '#e74c3c', avatarUrl: USER_AVATARS_POOL[19], role: 'Kurucu', isOnline: true, activity: 'Sunucuyu Teftiş Ediyor 👑', bio: 'Sunucu Sahibi & Kurucu. Düzeni bozanın yetkisi de hesabı da uçar.', personality: '👑 Sunucu Sahibi', reputation: 100, patience: 4, joinedAt: '01.01.2025' },
  { id: 'm1', username: 'Admin_Overlord', avatarColor: '#5865F2', avatarUrl: USER_AVATARS_POOL[0], role: 'Yönetici', isOnline: true, activity: 'ModOS v4.2', bio: 'Sunucu Baş Yöneticisi & Moderatör. Nöbet devrede, kurallara uyun.', personality: '🛡️ Baş Moderatör', reputation: 95, patience: 8, joinedAt: '01.01.2026' },
  { id: 'm2', username: 'Kaan_Mod', avatarColor: '#23a55a', avatarUrl: USER_AVATARS_POOL[5], role: 'Moderatör', isOnline: true, activity: 'Logları inceliyor', bio: 'Gece vardiyası moderatörü. Kural ihlali affetmem.', personality: '🛡️ Kuralcı & Hassas', reputation: 90, patience: 5, joinedAt: '02.01.2026' },
  { id: 'm3', username: 'Zengin_Balina', avatarColor: '#f0b232', avatarUrl: USER_AVATARS_POOL[4], role: 'VIP Balina', isOnline: true, activity: 'CS2 Oynuyor', bio: 'Sunucu 3. Seviye Boost destekçisi. VIP odasındayım beklerim.', personality: '💎 VIP Balina', reputation: 88, patience: 7, joinedAt: '05.01.2026' },
  { id: 'm4', username: 'DarkKnight', avatarColor: '#eb459e', avatarUrl: USER_AVATARS_POOL[7], role: 'VIP Balina', isOnline: true, activity: 'Spotify Dinliyor', bio: 'Phonk & Cyberpunk aşığı. Rekabetçi maçta ses 2 gelin.', personality: '⚔️ Rekabetçi Gamer', reputation: 85, patience: 4, joinedAt: '08.01.2026' },
  { id: 'm5', username: 'EmreKral', avatarColor: '#f26522', avatarUrl: USER_AVATARS_POOL[10], role: 'Kıdemli Üye', isOnline: true, activity: 'Valorant', bio: 'Eski sezon Immortal, şimdi eğlencesine dereceli takılıyorum.', personality: '⚔️ Rekabetçi Gamer', reputation: 82, patience: 6, joinedAt: '12.01.2026' },
  { id: 'm6', username: 'SessizLider', avatarColor: '#576574', avatarUrl: USER_AVATARS_POOL[14], role: 'Kıdemli Üye', isOnline: true, activity: 'Kod yazıyor', bio: 'TypeScript & Rust ile uğraşıyorum. Sohbeti sessizden takip ederim.', personality: '💻 Teknoloji Meraklısı', reputation: 92, patience: 9, joinedAt: '14.01.2026' },
  { id: 'm7', username: 'Berk_06', avatarColor: '#ff4757', avatarUrl: USER_AVATARS_POOL[2], role: 'Üye', isOnline: true, activity: 'R6 Siege', bio: 'Ankaralıyız gardaş, haksızlığa gelemeyiz.', personality: '🎭 Mizahşör & Troll', reputation: 68, patience: 3, joinedAt: '20.01.2026' },
  { id: 'm8', username: 'Mertcan_99', avatarColor: '#1e90ff', avatarUrl: USER_AVATARS_POOL[13], role: 'Üye', isOnline: true, activity: 'Müzik Dinliyor', bio: 'Gitar ve oyun ikilisi. Çay koydum chati izliyorum.', personality: '☕ Sakin Üye', reputation: 78, patience: 8, joinedAt: '22.01.2026' },
  { id: 'm9', username: 'OyunDelisi', avatarColor: '#2ed573', avatarUrl: USER_AVATARS_POOL[3], role: 'Üye', isOnline: false, activity: 'Steam İndiriyor', bio: 'Kütüphanede 300 oyun var oynayacak oyun bulamıyorum.', personality: '⚔️ Rekabetçi Gamer', reputation: 74, patience: 7, joinedAt: '24.01.2026' },
  { id: 'm10', username: 'GeceVardiyasi', avatarColor: '#747d8c', avatarUrl: USER_AVATARS_POOL[6], role: 'Üye', isOnline: false, activity: 'Uyuyor', bio: 'Gündüz uyur, gece uyanır. Gece 3 tayfasına selam.', personality: '🌙 Gece Kuşu', reputation: 80, patience: 8, joinedAt: '25.01.2026' },
  { id: 'm11', username: 'Vip_Cagan', avatarColor: '#f0b232', avatarUrl: USER_AVATARS_POOL[16], role: 'Üye', isOnline: true, activity: 'DM Bekliyor', bio: 'VIP rolü almak için para biriktiriyorum.', personality: '🌱 Yeni Üye', reputation: 70, patience: 6, joinedAt: '26.01.2026' }
]

const FORBIDDEN_WORDS = [
  'küfür', 'orospu', 'piç', 'oc', 'oç', 'yarrak', 'amk', 'aq', 'sik', 'siktir',
  'bacını', 'sülaleni', 'ananı', 'pezevenk', 'kahpe', 'amına', 'götünü', 'velet',
  'döl', 'kancık', 'yavşak', 'ibne', 'şerefsiz', 'haysiyetsiz', 'köpek'
]

const BANNABLE_SEED_MESSAGES = [
  { text: 'bedava nitro dagitiyorum hemen girin: http://steam-gift-free.ru/nitro', reason: 'Zararlı oltalama / scam linki' },
  { text: 'beyler bu sunucu cop gelin suraya: discord.gg/diger-sunucu-gelin', reason: 'İzinsiz sunucu reklamı' },
  { text: 'senin anani avradini sikeyim lan coluk cocuk', reason: 'Ağır ailevi küfür' },
  { text: 'adminin anasina selam olsun torpille mod yapmislar', reason: 'Yönetime ağır hakaret ve kışkırtma' },
  { text: 'steam hesabimi satiyorum ilgilenen dm gelsin 200 tl', reason: 'İzinsiz hesap satışı' },
  { text: 'senin bacını s... velet ses odasına gel erkeksen korkak it', reason: 'Ağır ailevi tehdit ve hakaret' },
  { text: 'senin kafanı monitöre vururum klavye delikanlısı piç', reason: 'Fiziksel şiddet tehdidi' },
  { text: 'adminlerin anasını avradını s... sunucu velet kaynıyor kurucu da o... evladı', reason: 'Yönetime toplu hakaret' },
  { text: 'cs2 de adamın anasına sövdüm diye banlandım böyle adaletin a... koyim', reason: 'Kural ihlali ve küfür' },
  { text: 'orospu çocukları hile açmışlar gelmiş burda rank kasıyorlar ananızı s...', reason: 'Ağır küfür ve taciz' },
  { text: 'ses odasındaki mikrofon basan veledin anasını mezardan çıkarıp s...', reason: 'Aşırı ağır küfür ve nefret söylemi' },
  { text: 'admin torpilli pezevenk gelmiş bana ahkam kesiyor sokarım yetkine', reason: 'Moderatöre doğrudan saldırı' },
  { text: 'sen kime artistlik taslıyosun lan döl israfı adres ver de geleyim', reason: 'Kişisel taciz ve kışkırtma' },
  { text: 'senin o ananın a... balıklama atlarım velet beni tilt etme', reason: 'Ağır argo ve hakaret' },
  { text: 'kurucu efe sunucunun paralarını rulette eziyormuş dolandırıcı piçler', reason: 'İftira ve sunucu karalama' },
  { text: 'ananı s... senin hileci köpek crosshair adamın kafasına kilitleniyor hala ağlıyor', reason: 'Oyun içi aşırı küfür' },
  { text: 'beyler bu mod kaan tam bir orospu çocuğu kurucunun götünü yalıyor', reason: 'Yetkiliye ağır hakaret' },
  { text: 'discord.gg/anarsi-tayfa gelin sunucuyu nukeleyip patlatıcaz modlar uyuyor', reason: 'Sunucu raid organizasyonu & reklam' },
  { text: 'seni bulduğum yerde s... lan velet kaçma erkeksen ses 1 gel', reason: 'Kişisel tehdit ve kışkırtma' },
  { text: 'steam hesabını çaldım elemanın ağlıyor velet xd kurtarmak istiyorsan 200 tl at', reason: 'Şantaj ve hesap hırsızlığı' },
  { text: 'ben senin o babanın ananın geçmişini yedi sülaleni s... sus lan', reason: 'Ailevi ve geçmişe hakaret' },
  { text: 'allahına kitabına sövdürtme benim s... git odadan', reason: 'Dini değerlere saldırı ve küfür' },
  { text: 'modların alayının a... koyayım gelin banlayın hadi erkekseniz', reason: 'Yetkililere açık meydan okuma' },
  { text: 'valoda radiant hesap boostlanır 150 tl ban garantili değil dm', reason: 'Yasaklı hesap boosting & ticaret' },
  { text: 'klavyenin w tuşunu ananın a... sokarım düzgün konuş benimle', reason: 'Yaratıcı ağır küfür' },
  { text: 'sunucu sahibinin numarasını buldum yayıyorum birazdan hazır olun', reason: 'Kişisel veri (Doxxing) tehdidi' }
]

const INITIAL_BANK_TRANSACTIONS: BankTransaction[] = [
  {
    id: 'tx_init_1',
    timestamp: 'Dün, 23:45',
    title: 'Moderatörlük Günlük Hakediş & Maaş',
    amount: 320,
    type: 'income',
    account: 'personal',
    reference: 'REF-MAAS-9912'
  },
  {
    id: 'tx_init_2',
    timestamp: 'Dün, 19:12',
    title: 'Kahve & Enerji İçeceği Harcaması',
    amount: 35,
    type: 'expense',
    account: 'personal',
    reference: 'REF-KAFE-0129'
  },
  {
    id: 'tx_init_3',
    timestamp: 'Dün, 16:30',
    title: 'Sunucu Boost & VIP Rol Bağışları',
    amount: 450,
    type: 'income',
    account: 'server',
    reference: 'REF-BAGIS-7741'
  },
  {
    id: 'tx_init_4',
    timestamp: 'Dün, 09:00',
    title: 'VDS Sunucu & Bot Hosting Gideri',
    amount: 150,
    type: 'expense',
    account: 'server',
    reference: 'REF-HOST-5502'
  }
]

const shuffleScenarioChoices = (sc: TicketScenario): TicketScenario => {
  const shuffled = [...sc.choices].sort(() => Math.random() - 0.5)
  return { ...sc, choices: shuffled }
}

export const RAID_BOT_POOL = [
  'Zero_Raider_01', 'Zero_Raider_02', 'Zero_Raider_03', 'Zero_Raider_04',
  'Chaos_Spammer_TR', 'Chaos_Spammer_06', 'TrollArmy_44', 'TrollArmy_99',
  'NukerBot_X', 'NukerBot_Pro', 'DarkRaider_99', 'DarkRaider_TR',
  'Vandal_Pro_34', 'Toxic_Ghost_66', 'Anarchy_Bot_1', 'Anarchy_Bot_2',
  'RaidLeader_66', 'SpamMaster_31', 'Shadow_Troll_TR', 'CrashServer_88'
]

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentDay, setCurrentDay] = useState(1)
  const [gameHour, setGameHour] = useState(12)
  const [gameMinute, setGameMinute] = useState(0)
  const [isDayTransitioning, setIsDayTransitioning] = useState(false)
  const [transitionOldDay, setTransitionOldDay] = useState(1)
  const [transitionNewDay, setTransitionNewDay] = useState(2)
  const [sleepClockHour, setSleepClockHour] = useState(8)
  const [sleepClockMinute, setSleepClockMinute] = useState(0)
  const [isStamInstalled, setIsStamInstalled] = useState(false)
  const [ticketsResolvedCount, setTicketsResolvedCount] = useState(0)
  const [bansIssuedCount, setBansIssuedCount] = useState(0)
  const [isShiftModalOpen, setIsShiftModalOpen] = useState(false)
  const [isSlowModeActive, setIsSlowModeActive] = useState(false)
  const [isRaidActive, setIsRaidActive] = useState(false)
  const [activeRaiders, setActiveRaiders] = useState<string[]>([])
  const [totalRaidBotsCount, setTotalRaidBotsCount] = useState<number>(20)
  const [bannedRaidersCount, setBannedRaidersCount] = useState<number>(0)
  const [raidCount, setRaidCount] = useState<number>(0)

  // New OS & Gameplay States (20 Requirements)
  const [installedApps, setInstalledApps] = useState<AppId[]>(['appcenter', 'fooddelivery', 'browser', 'trash'])
  const [tutorialStep, setTutorialStep] = useState<number>(0)
  const [iscordAccount, setIscordAccount] = useState<IscordAccount>({
    username: 'Admin_Overlord',
    email: '',
    password: '',
    avatarColor: '#5865F2',
    isRegistered: false
  })
  const [equipmentCart, setEquipmentCart] = useState<EquipmentCartItem[]>([])
  const [pendingAdMembers, setPendingAdMembers] = useState<number>(0)
  const [coffeeCooldown, setCoffeeCooldown] = useState<number>(0)
  const [catCooldown, setCatCooldown] = useState<number>(0)

  // Remote VDS & Bot Hosting States
  const [hasVds, setHasVds] = useState<boolean>(false)
  const [vdsIp] = useState<string>('185.142.88.40:3389')
  const [vdsAccessCode] = useState<string>('VDS-9942')
  const [isVdsConnected, setIsVdsConnected] = useState<boolean>(false)
  const [vdsInstalledApps, setVdsInstalledApps] = useState<string[]>(['vds_installer'])
  const [activeBots, setActiveBots] = useState<string[]>([])

  // Bottom-Right OS Notifications
  const [osNotifications, setOsNotifications] = useState<OsNotification[]>([])

  const pushNotification = useCallback((notif: Omit<OsNotification, 'id' | 'timestamp'>) => {
    const id = `notif_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`
    const timestamp = new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
    setOsNotifications((prev) => [...prev.slice(-4), { ...notif, id, timestamp }])
    setTimeout(() => {
      setOsNotifications((prev) => prev.filter((n) => n.id !== id))
    }, 6000)
  }, [])

  const dismissNotification = useCallback((id: string) => {
    setOsNotifications((prev) => prev.filter((n) => n.id !== id))
  }, [])

  const [hype, setHype] = useState(68)
  const [sanity, setSanity] = useState(100)
  const [personalCash, setPersonalCash] = useState(250)
  const [serverFunds, setServerFunds] = useState(400)
  const [serverLevel, setServerLevel] = useState<number>(1)
  const [ownedGames, setOwnedGames] = useState<string[]>([])
  const [botGlitchActive, setBotGlitchActive] = useState<boolean>(false)
  const [bankTransactions, setBankTransactions] = useState<BankTransaction[]>(INITIAL_BANK_TRANSACTIONS)
  const [activeLoan, setActiveLoan] = useState(0)
  const [creditScore, setCreditScore] = useState(1480)
  const [dmConversations, setDmConversations] = useState<Record<string, DmConversation>>(INITIAL_DM_CONVERSATIONS)

  const [botRules, setBotRules] = useState<BotRulesConfig>({
    linkFilterEnabled: true,
    capsFilterEnabled: false,
    spamThreshold: 4,
    customWords: ['nitro', 'free', 'cekilis', 'discord.gg', 'hesap']
  })

  const updateBotRules = useCallback((newRules: Partial<BotRulesConfig>) => {
    setBotRules((prev) => ({ ...prev, ...newRules }))
  }, [])

  const [members, setMembers] = useState<ServerMember[]>(INITIAL_MEMBERS)
  const [activeChannelId, setActiveChannelId] = useState('genel-sohbet')
  const [channelNames, setChannelNames] = useState<Record<string, string>>({
    // BİLGİ & DUYURULAR
    'kurallar': 'kurallar',
    'duyurular': 'duyurular',
    'gelen-giden': 'gelen-giden',
    'denetim-kaydi': 'denetim-kaydı',
    // METİN SOHBETLERİ
    'genel-sohbet': 'genel-sohbet',
    'oyun-sohbeti': 'oyun-sohbeti',
    'ekran-goruntuleri': 'ekran-görüntüleri',
    'mizah-meme': 'mizah-ve-caps',
    'bot-komut': 'bot-komut-müzik',
    // ÖZEL ODALAR
    'vip-lounge': 'vip-özel-sohbet',
    'yetkili-sohbet': 'yetkili-odası',
    // SES KANALLARI
    'ses-1': '🔊 Sohbet Odası #1',
    'ses-2': '🔊 Sohbet Odası #2',
    'ses-game': '🎮 Oyun Odası (Valorant/CS)',
    'ses-music': '🎵 Müzik & Chill',
    'ses-staff': '🔒 Yetkili Ses Odası'
  })

  const [connectedVoiceChannel, setConnectedVoiceChannel] = useState<string | null>(null)
  const [voiceTranscripts, setVoiceTranscripts] = useState<VoiceTranscript[]>([
    {
      id: 'vt-init-1',
      channelId: 'ses-1',
      username: INITIAL_MEMBERS[4].username,
      avatarColor: INITIAL_MEMBERS[4].avatarColor,
      avatarUrl: INITIAL_MEMBERS[4].avatarUrl,
      text: 'Gençler hoş geldiniz, sesim net geliyor mu mikrofonda cızırtı var mı?',
      time: '23:40',
      type: 'normal'
    },
    {
      id: 'vt-init-2',
      channelId: 'ses-1',
      username: INITIAL_MEMBERS[2].username,
      avatarColor: INITIAL_MEMBERS[2].avatarColor,
      avatarUrl: INITIAL_MEMBERS[2].avatarUrl,
      text: 'Gayet temiz kanka, akşam rekabetçi gireceksek kadroyu kuralım.',
      time: '23:41',
      type: 'normal'
    }
  ])

  const [voiceUsers, setVoiceUsers] = useState<VoiceUser[]>([
    { member: INITIAL_MEMBERS[2], channelId: 'ses-1', isSpeaking: false, isMuted: false },
    { member: INITIAL_MEMBERS[4], channelId: 'ses-1', isSpeaking: true, isMuted: false },
    { member: INITIAL_MEMBERS[6], channelId: 'ses-2', isSpeaking: false, isMuted: false },
    { member: INITIAL_MEMBERS[7], channelId: 'ses-game', isSpeaking: false, isMuted: false },
    { member: INITIAL_MEMBERS[8], channelId: 'ses-music', isSpeaking: false, isMuted: false }
  ])

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-1',
      channelId: 'genel-sohbet',
      author: INITIAL_MEMBERS[4],
      content: 'Herkese selam, yeni indirimdeki kulaklık hakkında ne düşünüyorsunuz?',
      timestamp: 'Bugün 12:00'
    },
    {
      id: 'msg-2',
      channelId: 'genel-sohbet',
      author: INITIAL_MEMBERS[5],
      content: 'Fena değil ama mikrofonu biraz dip ses alıyor diyorlar.',
      timestamp: 'Bugün 12:01'
    },
    {
      id: 'msg-game-1',
      channelId: 'oyun-sohbeti',
      author: INITIAL_MEMBERS[2],
      content: 'CS2 5v5 sunucu içi lobi kuruyoruz, +3 sağlam oyuncu lazım ses 2 gelin!',
      timestamp: 'Bugün 12:02'
    },
    {
      id: 'msg-game-2',
      channelId: 'oyun-sohbeti',
      author: INITIAL_MEMBERS[6],
      content: 'Valorant son yamadan sonra ajan dengeleri bayağı değişmiş, akşam dereceli girelim.',
      timestamp: 'Bugün 12:03'
    },
    {
      id: 'msg-ss-1',
      channelId: 'ekran-goruntuleri',
      author: INITIAL_MEMBERS[3],
      content: 'Sonunda çift monitör ve RGB masa kurulumumu tamamladım, 10 üzerinden kaç verirsiniz?',
      timestamp: 'Bugün 12:04',
      screenshot: {
        title: 'yeni_setup_rgb_2026.png',
        subtitle: 'RGB Masaüstü & Çift Monitör Kurulumu',
        resolution: '3840x2160 • 4.2 MB',
        fileSize: '4.2 MB',
        previewTheme: 'setup',
        description: 'Sonunda çift monitör ve RGB masa kurulumumu tamamladım!'
      }
    }
  ])

  const [modCoinBalance, setModCoinBalance] = useState(0)
  const [modCoinPrice, setModCoinPrice] = useState(42.50)
  const [termDeposit, setTermDeposit] = useState<{
    principal: number
    interestRate: number
    daysRemaining: number
    totalProfit: number
  } | null>(null)

  const [activeTickets, setActiveTickets] = useState<ActiveTicket[]>([
    {
      channelId: 'ticket-101_berk_06',
      ticketNumber: 101,
      creatorName: 'Ahmet_Oyunda',
      createdAt: 'Bugün 02:22',
      scenario: shuffleScenarioChoices(TICKET_SCENARIOS[0]),
      step: 'waiting_for_moderator',
      ticketMessages: [
        {
          id: 'msg_init_101',
          sender: 'user',
          senderName: 'Ahmet_Oyunda',
          avatarColor: '#f26522',
          text: TICKET_SCENARIOS[0].userIssue,
          time: '02:22'
        }
      ]
    }
  ])
  const ticketSerial = useRef(102)
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([
    {
      id: 'log-0',
      timestamp: 'Bugün 02:00:00',
      action: 'SUNUCU BAŞLATILDI',
      target: 'ModOS v4.2',
      moderator: 'Sistem',
      details: 'Gözetmen modu devrede.'
    },
    {
      id: 'log-1',
      timestamp: 'Dün 23:42:10',
      action: 'SUSTURMA (MUTE)',
      target: 'Berk_06',
      moderator: 'Kaan_Mod',
      details: 'Ses odasında yüksek ses açma uyarısı (30 dk)'
    },
    {
      id: 'log-2',
      timestamp: 'Dün 22:15:30',
      action: 'ROL GÜNCELLEMESİ',
      target: 'Zengin_Balina',
      moderator: 'Admin_Overlord',
      details: 'VIP Balina rolü tanımlandı.'
    },
    {
      id: 'log-3',
      timestamp: 'Dün 21:05:12',
      action: 'BAN KULLANICI',
      target: 'SpamBot_99',
      moderator: 'AutoMod',
      details: 'Zararlı phishing linki yayma.'
    },
    {
      id: 'log-4',
      timestamp: 'Dün 19:30:00',
      action: 'YENİ KANAL AÇILDI',
      target: 'ekran-goruntuleri',
      moderator: 'Admin_Overlord',
      details: 'Topluluk medya kanalı açıldı.'
    }
  ])

  // Achievements & Customization states
  const [achievements, setAchievements] = useState<Achievement[]>(INITIAL_ACHIEVEMENTS)
  const [recentAchievement, setRecentAchievement] = useState<Achievement | null>(null)
  const [wallpaper, setWallpaper] = useState<DesktopWallpaper>('default')
  const [coffeeDrankCount, setCoffeeDrankCount] = useState<number>(0)

  const dismissAchievementToast = useCallback(() => {
    setRecentAchievement(null)
  }, [])

  const unlockAchievement = useCallback((id: string) => {
    setAchievements((prev) => {
      const ach = prev.find((a) => a.id === id)
      if (!ach || ach.isUnlocked) return prev

      soundEngine.playAchievement()
      const updated: Achievement = {
        ...ach,
        isUnlocked: true,
        unlockedAt: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
      }
      setRecentAchievement(updated)

      return prev.map((a) => (a.id === id ? updated : a))
    })
  }, [])

  const [ownedEquipment, setOwnedEquipment] = useState<string[]>([])
  const [ownedBots, setOwnedBots] = useState<string[]>([])

  const allScenariosPool = useRef<TicketScenario[]>(getAllScenarios())
  const usedScenarioIds = useRef<Set<string>>(new Set())

  const addAuditLog = useCallback((action: string, target: string, details: string) => {
    const entry: AuditLogEntry = {
      id: `log-${Date.now()}-${Math.random()}`,
      timestamp: new Date().toLocaleTimeString('tr-TR'),
      action,
      target,
      moderator: iscordAccount.username || 'Admin_Overlord',
      details
    }
    setAuditLogs((prev) => [entry, ...prev.slice(0, 49)])
  }, [iscordAccount.username])

  const installApp = useCallback((appId: AppId) => {
    setInstalledApps((prev) => {
      if (prev.includes(appId)) return prev
      soundEngine.playCoinChime()
      return [...prev, appId]
    })
    if (appId === 'stam') {
      setIsStamInstalled(true)
    }
    pushNotification({
      type: 'system',
      title: '📦 Uygulama Kuruldu',
      message: `${appId.toUpperCase()} masaüstünüze başarıyla yüklendi.`
    })
  }, [pushNotification])

  const registerIscordAccount = useCallback((username: string, email: string, password: string, avatarColor: string) => {
    const cleanName = username.trim() || 'Admin_Overlord'
    setIscordAccount({
      username: cleanName,
      email: email.trim() || `${cleanName.toLowerCase()}@modos.net`,
      password,
      avatarColor,
      isRegistered: true
    })
    setMembers((prev) =>
      prev.map((m) =>
        m.id === INITIAL_MEMBERS[1].id
          ? { ...m, username: cleanName, avatarColor }
          : m
      )
    )
    soundEngine.playCoinChime()
    pushNotification({
      type: 'system',
      title: '🛡️ Iscord Hesabı Oluşturuldu',
      message: `Hoş geldin @${cleanName}! Baş moderatör yetkilerin tanımlandı.`
    })
  }, [pushNotification])

  // Send message helper
  const sendMessage = useCallback((channelId: string, content: string) => {
    soundEngine.playKeyClick()
    const adminMember: ServerMember = {
      ...INITIAL_MEMBERS[1],
      username: iscordAccount.username || INITIAL_MEMBERS[1].username,
      avatarColor: iscordAccount.avatarColor || INITIAL_MEMBERS[1].avatarColor
    }
    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      channelId,
      author: adminMember,
      content,
      timestamp: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
    }
    setMessages((prev) => [...prev, newMsg])
  }, [iscordAccount])

  // Ban member action
  const banMember = useCallback((username: string, reason: string = 'Baskın / Kural İhlali'): boolean => {
    const member = members.find((m) => m.username.toLowerCase() === username.toLowerCase())
    if (!member) return false

    // Kurucu & Self Protection: Kurucu and yourself cannot be banned!
    const myName = (iscordAccount?.username || 'admin_overlord').toLowerCase()
    if (member.role === 'Kurucu' || member.username.toLowerCase() === 'kurucu_efe') {
      soundEngine.playDiscordPing()
      addAuditLog('YETKİ YETERSİZ', member.username, 'Hata: Sunucu Kurucusu banlanamaz! Yetkiniz yetersiz.')
      return false
    }

    if (
      member.username.toLowerCase() === myName ||
      member.username.toLowerCase() === 'admin_overlord' ||
      member.role === 'Yönetici' ||
      member.id === INITIAL_MEMBERS[1].id
    ) {
      soundEngine.playDiscordPing()
      addAuditLog('İŞLEM ENGELLENDİ', member.username, 'Hata: Kendinizi veya baş yöneticiyi sunucudan banlayamazsınız!')
      return false
    }

    soundEngine.playBanHammer()
    // Remove completely from members
    setMembers((prev) => prev.filter((m) => m.username.toLowerCase() !== username.toLowerCase()))
    // Remove from voice if inside
    setVoiceUsers((prev) => prev.filter((v) => v.member.username.toLowerCase() !== username.toLowerCase()))
    // Purge all messages from this banned user across all channels
    setMessages((prev) => prev.filter((msg) => msg.author.username.toLowerCase() !== username.toLowerCase()))

    addAuditLog('BAN KULLANICI', member.username, `Sebep: ${reason} (Tüm mesajları silindi)`)
    setBansIssuedCount((prev) => prev + 1)
    unlockAchievement('first_blood')

    // Check if banned member was an active raid bot
    setActiveRaiders((prevRaiders) => {
      const isRaider = prevRaiders.some((r) => r.toLowerCase() === username.toLowerCase())
      if (!isRaider) return prevRaiders

      const nextRaiders = prevRaiders.filter((r) => r.toLowerCase() !== username.toLowerCase())
      setBannedRaidersCount((c) => c + 1)
      setHype((h) => Math.min(100, h + 2))

      // Check if ALL raiders have been crushed and banned!
      if (nextRaiders.length === 0) {
        setIsRaidActive(false)
        soundEngine.playCoinChime()
        unlockAchievement('raid_stopper')
        setHype((h) => Math.min(100, h + 25))
        setSanity((s) => Math.min(100, s + 20))
        addAuditLog('BASKIN TAMAMEN PÜSKÜRTÜLDÜ', '20/20 Bot Temizlendi', 'Saldırgan botların tamamı banlandı! Sunucu tam güvenliğe kavuştu.')

        const victoryNotice: ChatMessage = {
          id: `victory-${Date.now()}`,
          channelId: 'genel-sohbet',
          author: {
            id: 'bot-shield',
            username: 'Güvenlik Sistemi [BOT]',
            avatarColor: '#5865F2',
            role: 'Yönetici',
            isOnline: true,
            joinedAt: '01.01.2024'
          },
          content: '🛡️ [GÜVENLİK ALARMI SONLANDI]: TEBRİKLER! Sunucuya saldıran 20 trol botunun tamamı başarıyla banlandı! Sunucu kurtarıldı. (+25 Hype, +20 Akıl Sağlığı)',
          timestamp: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
        }
        setMessages((prevMsgs) => [...prevMsgs, victoryNotice])
      }
      return nextRaiders
    })

    // Announcement in #gelen-giden
    const banNotice: ChatMessage = {
      id: `notice-${Date.now()}`,
      channelId: 'gelen-giden',
      author: INITIAL_MEMBERS[0],
      content: `🔨 @${member.username} sunucudan kalıcı olarak uzaklaştırıldı. Sebep: ${reason}`,
      timestamp: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
    }
    setMessages((prev) => [...prev, banNotice])
    return true
  }, [members, addAuditLog])

  // Mute member
  const muteMember = useCallback((username: string, minutes: number) => {
    const member = members.find((m) => m.username.toLowerCase() === username.toLowerCase())
    if (!member) return

    // Kurucu Protection: Kurucu cannot be muted!
    if (member.role === 'Kurucu' || member.username.toLowerCase() === 'kurucu_efe') {
      soundEngine.playDiscordPing()
      addAuditLog('YETKİ YETERSİZ', member.username, 'Hata: Sunucu Kurucusu susturulamaz! Yetkiniz yetersiz.')
      return
    }

    const until = Date.now() + minutes * 60 * 1000
    setMembers((prev) =>
      prev.map((m) =>
        m.username.toLowerCase() === username.toLowerCase()
          ? { ...m, isMuted: true, mutedUntil: until }
          : m
      )
    )

    const muteNotice: ChatMessage = {
      id: `mute-notice-${Date.now()}`,
      channelId: 'genel-sohbet',
      author: {
        id: 'system_bot',
        username: 'ModBot Güvenlik',
        avatarColor: '#5865F2',
        role: 'Yönetici',
        isOnline: true,
        joinedAt: '01.01.2024'
      },
      content: `🔇 [MODERASYON]: @${username} kural ihlali nedeniyle ${minutes} dakika susturuldu (Mute). Bu süre boyunca mesaj gönderemez.`,
      timestamp: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
    }
    setMessages((prev) => [...prev, muteNotice])

    addAuditLog('SUSTURMA (MUTE)', username, `${minutes} dakika susturuldu.`)
    soundEngine.playBanHammer()
  }, [members, addAuditLog])

  // Change member role
  const changeMemberRole = useCallback((username: string, newRole: ServerMember['role']) => {
    const member = members.find((m) => m.username.toLowerCase() === username.toLowerCase())
    if (!member) return

    if (member.role === 'Kurucu' || member.username.toLowerCase() === 'kurucu_efe') {
      soundEngine.playDiscordPing()
      addAuditLog('YETKİ YETERSİZ', member.username, 'Hata: Sunucu Kurucusunun rolü değiştirilemez!')
      return
    }

    if (newRole === 'Kurucu') {
      soundEngine.playDiscordPing()
      addAuditLog('YETKİ YETERSİZ', username, 'Hata: Bir üyeye Kurucu rolü verilemez!')
      return
    }

    setMembers((prev) =>
      prev.map((m) => (m.username === username ? { ...m, role: newRole } : m))
    )
    addAuditLog('ROL GÜNCELLEMESİ', username, `Yeni Rol: ${newRole}`)
  }, [members, addAuditLog])

  // Cooldown timer for Coffee and Cat
  useEffect(() => {
    const cdTimer = setInterval(() => {
      setCoffeeCooldown((prev) => (prev > 0 ? prev - 1 : 0))
      setCatCooldown((prev) => (prev > 0 ? prev - 1 : 0))
    }, 1000)
    return () => clearInterval(cdTimer)
  }, [])

  // Drink coffee to restore sanity (Costs 25₺ + 60s Cooldown)
  const drinkCoffee = useCallback(() => {
    if (coffeeCooldown > 0) {
      soundEngine.playDiscordPing()
      pushNotification({
        type: 'system',
        title: '☕ Kahve Hazırlanıyor',
        message: `Yeni kahve içmek için ${coffeeCooldown} saniye beklemelisiniz.`
      })
      return
    }
    const coffeeCost = 25
    if (personalCash < coffeeCost) {
      soundEngine.playDiscordPing()
      pushNotification({
        type: 'bank',
        title: '❌ Yetersiz Bakiye',
        message: `Kahve sipariş etmek için ${coffeeCost}₺ şahsi nakit gereklidir!`
      })
      return
    }
    soundEngine.playCoinChime()
    setPersonalCash((prev) => prev - coffeeCost)
    setCoffeeCooldown(60)
    const boost = ownedEquipment.includes('coffee_maker') ? 50 : 25
    setSanity((prev) => Math.min(100, prev + boost))
    setCoffeeDrankCount((prev) => {
      const next = prev + 1
      if (next >= 5) {
        unlockAchievement('coffee_addict')
      }
      return next
    })
    addAuditLog('KAHVE SİPARİŞ EDİLDİ', iscordAccount.username, `${coffeeCost}₺ ödendi, akıl sağlığı +${boost} yenilendi.`)
    pushNotification({
      type: 'bank',
      title: '☕ Sıcak Espresso İçildi (-25₺)',
      message: `Akıl sağlığınız +${boost} yenilendi.`
    })
  }, [coffeeCooldown, personalCash, ownedEquipment, unlockAchievement, addAuditLog, iscordAccount.username, pushNotification])

  // Pet Desk Cat "Paspas" (Costs 15₺ Gourmet Cat Treat + 45s Cooldown)
  const petCat = useCallback((): { success: boolean; message: string } => {
    if (catCooldown > 0) {
      soundEngine.playDiscordPing()
      const msg = `Paspas şu an uyuyor! (${catCooldown}sn bekle)`
      pushNotification({
        type: 'system',
        title: '🐱 Paspas Dinleniyor',
        message: msg
      })
      return { success: false, message: msg }
    }
    const catTreatCost = 15
    if (personalCash < catTreatCost) {
      soundEngine.playDiscordPing()
      const msg = `Paspas'a ödül maması almak için ${catTreatCost}₺ gerekli!`
      pushNotification({
        type: 'bank',
        title: '❌ Yetersiz Bakiye',
        message: msg
      })
      return { success: false, message: msg }
    }
    soundEngine.playCoinChime()
    setPersonalCash((prev) => prev - catTreatCost)
    setCatCooldown(45)
    setSanity((prev) => Math.min(100, prev + 15))
    const msg = '🐾 Paspas ödül mamasını yedi ve mırıldandı! (-15₺, +15 Sanity)'
    pushNotification({
      type: 'system',
      title: '🐱 Paspas Mutlu (-15₺)',
      message: 'Ödül maması verildi, akıl sağlığı +15 arttı!'
    })
    return { success: true, message: msg }
  }, [catCooldown, personalCash, pushNotification])

  // Close / Archive Ticket
  const closeTicket = useCallback((channelId: string) => {
    soundEngine.playTicketClose()
    setActiveTickets((prev) => prev.filter((t) => t.channelId !== channelId))
    setActiveChannelId((curr) => (curr === channelId ? 'genel-sohbet' : curr))
    addAuditLog('TICKET KAPATILDI', channelId, 'Destek kanalı arşivlendi ve silindi.')
  }, [addAuditLog])

  // Auto-close countdown for resolved tickets
  useEffect(() => {
    const autoCloseInterval = setInterval(() => {
      setActiveTickets((prevTickets) => {
        let hasChanges = false
        const toCloseIds: string[] = []

        const nextTickets = prevTickets
          .map((t) => {
            if (t.step === 'resolved' && typeof t.autoCloseSeconds === 'number') {
              hasChanges = true
              if (t.autoCloseSeconds <= 1) {
                toCloseIds.push(t.channelId)
                return null
              }
              return { ...t, autoCloseSeconds: t.autoCloseSeconds - 1 }
            }
            return t
          })
          .filter((t): t is ActiveTicket => t !== null)

        if (toCloseIds.length > 0) {
          soundEngine.playTicketClose()
          toCloseIds.forEach((id) => {
            addAuditLog('TICKET OTOMATİK KAPANDI', id, 'İşlem tamamlandı, kanal otomatik kapatıldı.')
          })
          setActiveChannelId((curr) => (toCloseIds.includes(curr) ? 'genel-sohbet' : curr))
        }

        return hasChanges ? nextTickets : prevTickets
      })
    }, 1000)

    return () => clearInterval(autoCloseInterval)
  }, [addAuditLog])

  // Create Channel
  const createChannel = useCallback((type: 'text' | 'voice', name: string) => {
    const id = `${type}-${Date.now()}`
    setChannelNames((prev) => ({ ...prev, [id]: name }))
    soundEngine.playKeyClick()
    addAuditLog('YENİ KANAL AÇILDI', name, `Tür: ${type === 'text' ? 'Metin Kanalı' : 'Ses Kanalı'}`)
  }, [addAuditLog])

  // Delete Channel (Item #8: Created channels can be deleted)
  const deleteChannel = useCallback((channelId: string): boolean => {
    const protectedCore = ['genel-sohbet', 'kurallar', 'denetim-kaydi', 'gelen-giden']
    if (protectedCore.includes(channelId)) {
      soundEngine.playDiscordPing()
      addAuditLog('SİLME ENGELLENDİ', channelId, 'Hata: Temel sistem kanalları silinemez!')
      return false
    }

    soundEngine.playKeyClick()
    const name = channelNames[channelId] || channelId
    setChannelNames((prev) => {
      const next = { ...prev }
      delete next[channelId]
      return next
    })

    if (activeChannelId === channelId) {
      setActiveChannelId('genel-sohbet')
    }
    if (connectedVoiceChannel === channelId) {
      setConnectedVoiceChannel(null)
    }

    setVoiceUsers((prev) => prev.filter((v) => v.channelId !== channelId))
    setVoiceTranscripts((prev) => prev.filter((t) => t.channelId !== channelId))
    addAuditLog('KANAL SİLİNDİ', name, `Kanal (${channelId}) sunucudan kaldırıldı.`)
    return true
  }, [channelNames, activeChannelId, connectedVoiceChannel, addAuditLog])

  // Join Voice Channel as Admin (Item C: Live Eavesdropping & Voice Room)
  const joinVoiceChannel = useCallback((channelId: string) => {
    soundEngine.playVoiceConnect()
    setConnectedVoiceChannel(channelId)
    setActiveChannelId(channelId)

    const adminMember: ServerMember = {
      ...INITIAL_MEMBERS[1],
      username: iscordAccount.username || INITIAL_MEMBERS[1].username,
      avatarColor: iscordAccount.avatarColor || INITIAL_MEMBERS[1].avatarColor
    }

    setVoiceUsers((prev) => {
      const withoutAdmin = prev.filter((v) => v.member.id !== INITIAL_MEMBERS[1].id)
      const existingInRoom = withoutAdmin.filter((v) => v.channelId === channelId)

      // Ensure room has at least 2 occupants if empty
      let extraOccupants: VoiceUser[] = []
      if (existingInRoom.length < 2) {
        const available = members.filter((m) => m.id !== INITIAL_MEMBERS[1].id && !withoutAdmin.some((v) => v.member.id === m.id))
        const candidates = available.slice(0, 3)
        extraOccupants = candidates.map((m) => ({
          member: m,
          channelId,
          isSpeaking: false,
          isMuted: false
        }))
      }

      return [...withoutAdmin, ...extraOccupants, { member: adminMember, channelId, isSpeaking: false, isMuted: false }]
    })

    addAuditLog('SESE KATILINDI', channelNames[channelId] || channelId, 'Moderatör ses kanalına bağlandı (Gizli dinleme aktif).')
  }, [iscordAccount, members, channelNames, addAuditLog])

  // Leave Voice Channel
  const leaveVoiceChannel = useCallback(() => {
    if (!connectedVoiceChannel) return
    soundEngine.playVoiceDisconnect()
    const chName = channelNames[connectedVoiceChannel] || connectedVoiceChannel
    setConnectedVoiceChannel(null)
    setVoiceUsers((prev) => prev.filter((v) => v.member.id !== INITIAL_MEMBERS[1].id))
    addAuditLog('SESTEN AYRILINDI', chName, 'Moderatör ses kanalından ayrıldı.')
  }, [connectedVoiceChannel, channelNames, addAuditLog])

  // Server Mute Voice User (Item C)
  const muteVoiceUser = useCallback((memberId: string) => {
    soundEngine.playKeyClick()
    setVoiceUsers((prev) =>
      prev.map((v) => (v.member.id === memberId ? { ...v, isMuted: true, isSpeaking: false } : v))
    )
    const target = members.find((m) => m.id === memberId)
    if (target) {
      addAuditLog('SESTE SUSTURULDU', target.username, 'Moderatör tarafından sunucu susturması (Server Mute) uygulandı.')
    }
  }, [members, addAuditLog])

  // Delete message
  const deleteMessage = useCallback((messageId: string) => {
    setMessages((prev) =>
      prev.map((m) => (m.id === messageId ? { ...m, isDeleted: true } : m))
    )
    addAuditLog('MESAJ SİLİNDİ', 'Genel Sohbet', `Mesaj ID: ${messageId}`)
  }, [addAuditLog])

  // Update channel name with profanity filter check
  const updateChannelName = useCallback((channelId: string, newName: string): boolean => {
    const lower = newName.toLowerCase()
    const hasCurse = FORBIDDEN_WORDS.some((word) => lower.includes(word))

    setChannelNames((prev) => ({ ...prev, [channelId]: newName }))

    if (hasCurse) {
      soundEngine.playDiscordPing()
      setHype((prev) => Math.max(0, prev - 12))
      setSanity((prev) => Math.max(0, prev - 8))
      // Members complain in #genel-sohbet
      const complaintMsg: ChatMessage = {
        id: `curse-c-${Date.now()}`,
        channelId: 'genel-sohbet',
        author: members[Math.floor(Math.random() * members.length)] || INITIAL_MEMBERS[4],
        content: `Bu kanal adı ne böyle ya? Koskoca sunucuda ayıp değil mi bu isim?`,
        timestamp: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
      }
      setMessages((prev) => [...prev, complaintMsg])
      addAuditLog('UYARI: KÜFÜRLÜ KANAL ADI', newName, 'Kullanıcılar tepki gösterdi, Hype düştü.')
      return false
    }

    addAuditLog('KANAL YENİDEN ADLANDIRILDI', channelId, `Yeni ad: ${newName}`)
    return true
  }, [members, addAuditLog])

  // Kick voice user
  const kickVoiceUser = useCallback((memberId: string) => {
    const userToKick = voiceUsers.find((v) => v.member.id === memberId)
    if (!userToKick) return

    soundEngine.playVoiceDisconnect()
    setVoiceUsers((prev) => prev.filter((v) => v.member.id !== memberId))
    addAuditLog('SESTEN ATILDI', userToKick.member.username, 'Moderatör tarafından sesten çıkarıldı.')

    // Chance mechanic: kicked user gets angry
    const isAngry = Math.random() < 0.6
    if (isAngry) {
      setTimeout(() => {
        const angryMsg: ChatMessage = {
          id: `angry-${Date.now()}`,
          channelId: 'genel-sohbet',
          author: userToKick.member,
          content: 'Beni sesten niye atıyorsunuz durduk yere? Ne yaptım ben size?',
          timestamp: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
        }
        setMessages((prev) => [...prev, angryMsg])
        soundEngine.playDiscordPing()
        setHype((prev) => Math.max(0, prev - 3))
      }, 2000)
    }
  }, [voiceUsers, addAuditLog])

  // Resolve Ticket
  const resolveTicket = useCallback((channelId: string, choiceId: string) => {
    const ticket = activeTickets.find((t) => t.channelId === channelId)
    if (!ticket) return

    const choice = ticket.scenario.choices.find((c) => c.id === choiceId)
    if (!choice) return

    soundEngine.playCoinChime()

    // Apply outcome
    setHype((prev) => Math.max(0, Math.min(100, prev + choice.hypeDelta)))
    setSanity((prev) => Math.max(0, Math.min(100, prev + choice.sanityDelta)))
    setTicketsResolvedCount((prev) => prev + 1)
    if (choice.moneyDelta) {
      setServerFunds((prev) => prev + choice.moneyDelta!)
    }

    // Note: Do not auto-ban/auto-mute immediately; player manually executes punishment via Right-Click!
    const manualInstruction = 
      choice.actionType === 'ban_accused' && ticket.scenario.accusedUsername
        ? ` (Karar: @${ticket.scenario.accusedUsername} banlanmalı! Sağdaki üye listesinden sağ tık ile Ban Hammer vurun)`
        : choice.actionType === 'mute_accused' && ticket.scenario.accusedUsername
        ? ` (Karar: @${ticket.scenario.accusedUsername} susturulmalı! Sağdaki üye listesinden Mute atın)`
        : ''

    addAuditLog(
      'TICKET KARARI',
      ticket.scenario.subject,
      choice.feedback + manualInstruction
    )

    if (ticketsResolvedCount + 1 >= 5) {
      unlockAchievement('ticket_master')
    }
    if (sanity <= 20) {
      unlockAchievement('paranoia_survivor')
    }

    const nowTime = new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
    const modMsg: TicketMessage = {
      id: `mod_${Date.now()}`,
      sender: 'mod',
      senderName: iscordAccount.username || 'Admin_Overlord',
      text: choice.replyText,
      time: nowTime
    }
    const userMsg: TicketMessage = {
      id: `usr_${Date.now() + 1}`,
      sender: 'user',
      senderName: ticket.creatorName,
      text: choice.userReaction,
      time: nowTime
    }

    // Update ticket state with resolution details and reasonable auto-close timer (12s)
    setActiveTickets((prev) =>
      prev.map((t) =>
        t.channelId === channelId
          ? {
              ...t,
              step: 'resolved',
              selectedChoiceId: choiceId,
              resolutionText: choice.feedback + manualInstruction,
              moderatorReply: choice.replyText,
              userReaction: choice.userReaction,
              isCorrect: choice.isCorrect,
              rating: choice.isCorrect ? 5 : 4,
              autoCloseSeconds: 12,
              ticketMessages: [...(t.ticketMessages || []), modMsg, userMsg]
            }
          : t
      )
    )
  }, [activeTickets, addAuditLog, ticketsResolvedCount, sanity, unlockAchievement])

  // Summon accused user into ticket for interrogation
  const summonAccusedToTicket = useCallback((channelId: string) => {
    const ticket = activeTickets.find((t) => t.channelId === channelId)
    if (!ticket || !ticket.scenario.accusedUsername) return

    const accused = ticket.scenario.accusedUsername
    const now = new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })

    // Accused may plead innocent or offer an under-the-table bribe!
    const isCorruptible = Math.random() < 0.65 || ticket.scenario.subject.toLowerCase().includes('küfür') || ticket.scenario.subject.toLowerCase().includes('ses')
    const bribeAmount = isCorruptible ? (Math.floor(Math.random() * 3) + 2) * 100 : undefined // 200, 300, 400 TL

    const accusedEntranceMsg: TicketMessage = {
      id: `acc_${Date.now()}`,
      sender: 'accused',
      senderName: accused,
      avatarColor: '#f23f43',
      text: isCorruptible 
        ? `Reis selam, beni çağırmışsın. Ya valla yanlış anlaşıldım, ban atarsan hesabım çöp olur. Bak sana FAST ile ${bribeAmount}₺ ateşleyeyim, konuyu 'Kanıt Yetersiz' diyip kapatıver, aramızda kalsın ne dersin?`
        : `Selam modum ne oldu niye çağırdınız? Yemin ederim iftira atıyorlar, ses kaydı montaj ya da ben öyle bir şey demedim!`,
      time: now,
      isBribe: isCorruptible,
      bribeAmount
    }

    setActiveTickets((prev) =>
      prev.map((t) =>
        t.channelId === channelId
          ? {
              ...t,
              accusedPresent: true,
              step: isCorruptible ? 'bribe_offered' : 'interrogating',
              bribeOffer: isCorruptible ? { amount: bribeAmount!, text: accusedEntranceMsg.text } : undefined,
              ticketMessages: [...(t.ticketMessages || []), accusedEntranceMsg]
            }
          : t
      )
    )

    soundEngine.playDiscordPing()
    addAuditLog('ŞÜPHELİ YÜZLEŞTİRME', accused, `${ticket.ticketNumber} no'lu bilete yüzleşme için çekildi.`)
  }, [activeTickets, addAuditLog])

  // Accept ticket bribe
  const acceptTicketBribe = useCallback((channelId: string, amount: number) => {
    const ticket = activeTickets.find((t) => t.channelId === channelId)
    if (!ticket) return { success: false, message: 'Bilet bulunamadı' }

    const accused = ticket.scenario.accusedUsername || 'Şüpheli'
    setPersonalCash((prev) => prev + amount)
    soundEngine.playCoinChime()

    const nowStr = `Bugün, ${new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}`
    setBankTransactions((prev) => [
      {
        id: `tx_bribe_${Date.now()}`,
        timestamp: nowStr,
        title: `🤫 Bilet İçi Gizli FAST Havalesi (@${accused})`,
        amount: amount,
        type: 'income',
        account: 'personal',
        reference: `TR-FAST-${Math.floor(100000 + Math.random() * 900000)}`
      },
      ...prev
    ])

    setSanity((prev) => Math.max(0, prev - 4))

    const now = new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
    const acceptMsg: TicketMessage = {
      id: `mod_${Date.now()}`,
      sender: 'mod',
      senderName: iscordAccount.username || 'Admin_Overlord',
      text: 'İnceleme tamamlandı. Eklenen deliller yetersiz ve çelişkili bulunduğundan talep işleme alınmadan kapatılmıştır.',
      time: now
    }
    const botMsg: TicketMessage = {
      id: `bot_${Date.now()}`,
      sender: 'bot',
      senderName: 'TicketCord BOT',
      text: `Bilet kapatıldı. Sonuç: Delil Yetersizliği (Gizli Çözüm).`,
      time: now
    }

    setActiveTickets((prev) =>
      prev.map((t) =>
        t.channelId === channelId
          ? {
              ...t,
              step: 'resolved',
              moderatorReply: acceptMsg.text,
              resolutionText: `Gizli anlaşma sağlandı (+${amount}₺ şahsi hesaba aktarıldı).`,
              isCorrect: false,
              rating: 3,
              autoCloseSeconds: 4,
              ticketMessages: [...(t.ticketMessages || []), acceptMsg, botMsg]
            }
          : t
      )
    )

    addAuditLog('TICKET KAPATILDI (GİZLİ)', ticket.channelId, `Delil yetersizliği gerekçesiyle kapatıldı.`)
    return { success: true, message: `Rüşvet alındı (+${amount}₺) ve hesap özetine işlendi!` }
  }, [activeTickets, addAuditLog])

  // Reject ticket bribe and perma-ban accused
  const rejectTicketBribeAndBan = useCallback((channelId: string) => {
    const ticket = activeTickets.find((t) => t.channelId === channelId)
    if (!ticket || !ticket.scenario.accusedUsername) return

    const accused = ticket.scenario.accusedUsername
    banMember(accused, 'Yetkiliye Rüşvet Teklifi & Ağır Kural İhlali')
    setHype((prev) => Math.min(100, prev + 12))
    setSanity((prev) => Math.min(100, prev + 10))
    soundEngine.playBanHammer()

    const now = new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
    const rejectMsg: TicketMessage = {
      id: `mod_${Date.now()}`,
      sender: 'mod',
      senderName: iscordAccount.username || 'Admin_Overlord',
      text: `Yetkili ekibine rüşvet teklif etmek ve kuralları hiçe saymak affedilemez. @${accused} sunucudan kalıcı olarak uzaklaştırıldı!`,
      time: now
    }
    const praiseMsg: TicketMessage = {
      id: `user_${Date.now()}`,
      sender: 'user',
      senderName: ticket.creatorName,
      text: 'Adamsın modum! Rüşvete boyun eğmediğin için helal olsun, sunucunun hakkını verdin!',
      time: now
    }

    setActiveTickets((prev) =>
      prev.map((t) =>
        t.channelId === channelId
          ? {
              ...t,
              step: 'resolved',
              moderatorReply: rejectMsg.text,
              userReaction: praiseMsg.text,
              resolutionText: 'Rüşvet teklifi reddedildi ve şüpheli perma banlandı.',
              isCorrect: true,
              rating: 5,
              autoCloseSeconds: 4,
              ticketMessages: [...(t.ticketMessages || []), rejectMsg, praiseMsg]
            }
          : t
      )
    )

    addAuditLog('RÜŞVET REDDEDİLDİ & BAN', accused, 'Yetkiliye rüşvet teklif eden üye süresiz banlandı.')
  }, [activeTickets, banMember, addAuditLog])

  // Send interactive ticket message
  const sendTicketMessage = useCallback((channelId: string, text: string) => {
    const ticket = activeTickets.find((t) => t.channelId === channelId)
    if (!ticket || !text.trim()) return

    const now = new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
    const modMsg: TicketMessage = {
      id: `mod_${Date.now()}`,
      sender: 'mod',
      senderName: iscordAccount.username || 'Admin_Overlord',
      text: text.trim(),
      time: now
    }

    setActiveTickets((prev) =>
      prev.map((t) =>
        t.channelId === channelId
          ? { ...t, ticketMessages: [...(t.ticketMessages || []), modMsg] }
          : t
      )
    )

    // Dynamic response from creator or accused
    setTimeout(() => {
      const respNow = new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
      let replyText = 'Anladım adminim, ilginiz için teşekkürler bekliyorum.'
      const lower = text.toLowerCase()

      if (lower.includes('kanıt') || lower.includes('ss') || lower.includes('foto')) {
        replyText = 'Hemen galerimden ekran görüntüsünü arıyorum, az önce eklemiştim zaten yukarıdaki kanıt butonundan görebilirsiniz.'
      } else if (lower.includes('küfür') || lower.includes('hakaret')) {
        replyText = 'Evet modum aynen öyle dedi, şerefime laf etti cezasını verin lütfen.'
      } else if (lower.includes('yalan') || lower.includes('iftira')) {
        replyText = 'Yemin ederim yalan değil, loglara bakın kendiniz göreceksiniz.'
      }

      const userReplyMsg: TicketMessage = {
        id: `user_${Date.now()}`,
        sender: 'user',
        senderName: ticket.creatorName,
        text: replyText,
        time: respNow
      }

      setActiveTickets((prev) =>
        prev.map((t) =>
          t.channelId === channelId
            ? { ...t, ticketMessages: [...(t.ticketMessages || []), userReplyMsg] }
            : t
        )
      )
    }, 900)
  }, [activeTickets])

  // Buy equipment (direct or via cart)
  const buyEquipment = useCallback((id: string, cost: number): boolean => {
    if (personalCash < cost || ownedEquipment.includes(id)) return false
    soundEngine.playCoinChime()
    setPersonalCash((prev) => prev - cost)
    setOwnedEquipment((prev) => [...prev, id])
    addAuditLog('EKİPMAN SATIN ALINDI', id, `${cost}₺ harcandı.`)
    return true
  }, [personalCash, ownedEquipment, addAuditLog])

  const addToEquipmentCart = useCallback((item: EquipmentCartItem) => {
    if (ownedEquipment.includes(item.id)) return
    soundEngine.playKeyClick()
    setEquipmentCart((prev) => {
      if (prev.some((x) => x.id === item.id)) return prev
      return [...prev, item]
    })
  }, [ownedEquipment])

  const removeFromEquipmentCart = useCallback((id: string) => {
    soundEngine.playKeyClick()
    setEquipmentCart((prev) => prev.filter((x) => x.id !== id))
  }, [])

  const clearEquipmentCart = useCallback(() => {
    setEquipmentCart([])
  }, [])

  const checkoutEquipmentCart = useCallback((): { success: boolean; message: string } => {
    if (equipmentCart.length === 0) {
      return { success: false, message: 'Sepetiniz boş!' }
    }
    const totalCost = equipmentCart.reduce((acc, item) => acc + item.price, 0)
    if (personalCash < totalCost) {
      return { success: false, message: `Yetersiz şahsi bakiye! Sepet toplamı ${totalCost}₺, bakiyeniz ${personalCash}₺.` }
    }
    soundEngine.playCoinChime()
    setPersonalCash((prev) => prev - totalCost)
    const newIds = equipmentCart.map((i) => i.id)
    const names = equipmentCart.map((i) => i.name).join(', ')
    setOwnedEquipment((prev) => [...new Set([...prev, ...newIds])])
    setEquipmentCart([])

    const nowStr = `Bugün, ${new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}`
    setBankTransactions((prev) => [
      {
        id: `tx_cart_${Date.now()}`,
        timestamp: nowStr,
        title: `🛒 DonanımSepeti Siparişi (${names})`,
        amount: totalCost,
        type: 'expense',
        account: 'personal',
        reference: `CART-${Math.floor(1000 + Math.random() * 9000)}`
      },
      ...prev
    ])
    pushNotification({
      type: 'bank',
      title: `🛒 Sipariş Onaylandı (-${totalCost}₺)`,
      message: `${equipmentCart.length} adet donanım kuruldu: ${names}`
    })
    addAuditLog('SEPET ONAYLANDI', `${equipmentCart.length} Ürün`, `Toplam ${totalCost}₺ ödendi: ${names}`)
    return { success: true, message: `Siparişiniz onaylandı! ${equipmentCart.length} donanım sisteminize kuruldu.` }
  }, [equipmentCart, personalCash, pushNotification, addAuditLog])

  // VDS Rent & Remote Connection System (Items #16 & #17)
  const rentVds = useCallback((source: 'personal' | 'server'): { success: boolean; message: string } => {
    if (hasVds) {
      return { success: false, message: 'Zaten aktif bir VDS sunucunuz bulunuyor!' }
    }
    const vdsCost = 450
    if (source === 'personal') {
      if (personalCash < vdsCost) {
        return { success: false, message: `VDS kiralamak için ${vdsCost}₺ şahsi bakiye gereklidir! (Mevcut: ${personalCash}₺)` }
      }
      setPersonalCash((prev) => prev - vdsCost)
    } else {
      if (serverFunds < vdsCost) {
        return { success: false, message: `VDS kiralamak için sunucu kasasında ${vdsCost}₺ gereklidir! (Mevcut: ${serverFunds}₺)` }
      }
      setServerFunds((prev) => prev - vdsCost)
    }

    soundEngine.playCoinChime()
    setHasVds(true)
    const nowStr = `Bugün, ${new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}`
    setBankTransactions((prev) => [
      {
        id: `tx_vds_${Date.now()}`,
        timestamp: nowStr,
        title: `🖥️ CloudVDS Dedicated Bot Sunucusu Kiralama (${vdsIp})`,
        amount: vdsCost,
        type: 'expense',
        account: source,
        reference: `VDS-${Math.floor(1000 + Math.random() * 9000)}`
      },
      ...prev
    ])
    pushNotification({
      type: 'system',
      title: '🖥️ VDS Sunucusu Aktif!',
      message: `IP: ${vdsIp} | Kod: ${vdsAccessCode} — Uzaktan Masaüstü (RDP) ile bağlanabilirsiniz.`
    })
    addAuditLog('VDS SUNUCUSU KİRALANDI', vdsIp, `Erişim Kodu: ${vdsAccessCode}. Bot çalıştırmak için VDS bağlantısı hazır.`)
    return {
      success: true,
      message: `VDS Başarıyla Kiralandı! IP: ${vdsIp} | Erişim Kodu: ${vdsAccessCode}. Masaüstünden "Uzaktan Bağlantı (VDS)" uygulamasını açıp bağlanabilirsiniz.`
    }
  }, [hasVds, personalCash, serverFunds, vdsIp, vdsAccessCode, pushNotification, addAuditLog])

  const connectToVds = useCallback((code: string): { success: boolean; message: string } => {
    if (!hasVds) {
      return { success: false, message: 'Aktif bir VDS aboneliğiniz yok! Önce Web Tarayıcı -> CloudVDS veya bu ekrandan VDS kiralayın.' }
    }
    const clean = code.trim().toUpperCase()
    if (clean !== vdsAccessCode.toUpperCase() && clean !== vdsIp && !clean.includes('9942')) {
      return { success: false, message: `Hatalı VDS Erişim Kodu! (İpucu: Kodunuz ${vdsAccessCode})` }
    }
    soundEngine.playCoinChime()
    setIsVdsConnected(true)
    pushNotification({
      type: 'system',
      title: '🔗 VDS Uzak Masaüstü Bağlandı',
      message: `${vdsIp} uzak sunucusuna başarıyla bağlandınız.`
    })
    return { success: true, message: 'VDS Uzak Masaüstüne bağlanıldı!' }
  }, [hasVds, vdsAccessCode, vdsIp, pushNotification])

  const disconnectVds = useCallback(() => {
    soundEngine.playKeyClick()
    setIsVdsConnected(false)
  }, [])

  const installVdsApp = useCallback((vdsAppId: string) => {
    soundEngine.playCoinChime()
    setVdsInstalledApps((prev) => (prev.includes(vdsAppId) ? prev : [...prev, vdsAppId]))
    pushNotification({
      type: 'system',
      title: '💿 VDS Paketi Kuruldu',
      message: `${vdsAppId} uzak VDS masaüstüne kuruldu.`
    })
  }, [pushNotification])

  const toggleBotActive = useCallback((botId: string) => {
    if (!hasVds) {
      pushNotification({
        type: 'system',
        title: '⚠️ VDS Gerekli',
        message: 'Botları aktif etmek için VDS sunucusu gereklidir!'
      })
      return
    }
    soundEngine.playKeyClick()
    setActiveBots((prev) => {
      const exists = prev.includes(botId)
      const next = exists ? prev.filter((id) => id !== botId) : [...prev, botId]
      pushNotification({
        type: 'system',
        title: exists ? '⏸️ Bot Durduruldu' : '🚀 Bot Aktif Edildi',
        message: `${botId} VDS üzerinde ${exists ? 'durduruldu' : 'çalışmaya başladı'}.`
      })
      return next
    })
  }, [hasVds, pushNotification])

  // Buy bot (Requires VDS!)
  const buyBot = useCallback((id: string, cost: number): boolean => {
    if (!hasVds) {
      soundEngine.playDiscordPing()
      pushNotification({
        type: 'system',
        title: '🚫 VDS Sunucusu Yok!',
        message: 'Bot satın almak ve çalıştırmak için önce VDS kiralamalı ve VDS Uzak Masaüstüne bağlanmalısınız!'
      })
      return false
    }
    if (serverFunds < cost || ownedBots.includes(id)) return false
    soundEngine.playCoinChime()
    setServerFunds((prev) => prev - cost)
    setOwnedBots((prev) => [...prev, id])
    setActiveBots((prev) => (prev.includes(id) ? prev : [...prev, id]))
    setHype((prev) => Math.min(100, prev + 5))

    const botMemberMap: Record<string, { username: string; color: string }> = {
      automod_bot: { username: 'AutoMod [BOT]', color: '#3498db' },
      music_bot: { username: 'RitimBot [BOT]', color: '#e91e63' },
      casino_bot: { username: 'KasaBot [BOT]', color: '#f1c40f' },
      welcome_bot: { username: 'GirişBot [BOT]', color: '#2ecc71' },
      antiraid_bot: { username: 'AntiRaid [BOT]', color: '#e74c3c' }
    }
    const meta = botMemberMap[id]
    if (meta) {
      setMembers((prev) => [
        ...prev,
        {
          id: `bot-${id}-${Date.now()}`,
          username: meta.username,
          avatarColor: meta.color,
          role: 'Moderatör',
          isOnline: true,
          activity: 'VDS Üzerinde Çalışıyor',
          joinedAt: new Date().toLocaleDateString('tr-TR')
        }
      ])
    }

    pushNotification({
      type: 'bank',
      title: `🤖 VDS Bot Kuruldu (-${cost}₺)`,
      message: `${meta?.username || id} VDS sunucusunda aktif edildi!`
    })
    addAuditLog('BOT KİRALANDI (VDS)', id, `Sunucu fonundan ${cost}₺ tahsil edildi. VDS üzerinde aktif edildi.`)
    return true
  }, [hasVds, serverFunds, ownedBots, pushNotification, addAuditLog])

  const toggleSlowMode = useCallback(() => {
    setIsSlowModeActive((prev) => {
      const next = !prev
      soundEngine.playKeyClick()
      addAuditLog(next ? 'SLOW MODE AÇILDI' : 'SLOW MODE KAPATILDI', 'Genel Sohbet', next ? 'Mesaj gecikmesi 15sn yapıldı.' : 'Normal moda dönüldü.')
      return next
    })
  }, [addAuditLog])

  const transferToPersonal = useCallback((amount: number) => {
    if (amount <= 0) return { success: false, message: 'Geçersiz miktar.' }
    if (serverFunds < amount) return { success: false, message: 'Sunucu kasasında yeterli bakiye yok.' }
    
    setServerFunds((prev) => prev - amount)
    setPersonalCash((prev) => prev + amount)
    soundEngine.playCoinChime()
    
    const txId = `tx_${Date.now()}`
    const nowStr = new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
    
    setBankTransactions((prev) => [
      {
        id: txId,
        timestamp: `Bugün, ${nowStr}`,
        title: amount > 600 ? '⚠️ Sunucu Kasasından Şahsi Avans / Zimmet Çekimi' : 'Moderatör Kasa Avansı / Prim',
        amount: amount,
        type: 'transfer',
        account: 'personal',
        reference: `REF-KASA-${Math.floor(1000 + Math.random() * 9000)}`
      },
      ...prev
    ])

    pushNotification({
      type: 'bank',
      title: `🏦 Hesaba Transfer (+${amount}₺)`,
      message: `Sunucu kasasından şahsi hesabınıza ${amount}₺ aktarıldı.`
    })

    addAuditLog(
      'FİNANS TRANSFERİ',
      'Sunucu Kasası -> Şahsi Hesap',
      `${amount}₺ tutarında fon çekildi. (Kalan Kasa: ${serverFunds - amount}₺)`
    )

    if (amount > 600) {
      setHype((prev) => Math.max(10, prev - 4))
    }

    return { success: true, message: `${amount}₺ şahsi vadesiz hesabınıza başarıyla aktarıldı.` }
  }, [serverFunds, addAuditLog, pushNotification])

  const transferToServer = useCallback((amount: number) => {
    if (amount <= 0) return { success: false, message: 'Geçersiz miktar.' }
    if (personalCash < amount) return { success: false, message: 'Şahsi hesabınızda yeterli bakiye yok.' }

    setPersonalCash((prev) => prev - amount)
    setServerFunds((prev) => prev + amount)
    soundEngine.playCoinChime()
    setHype((prev) => Math.min(100, prev + 5))

    const txId = `tx_${Date.now()}`
    const nowStr = new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })

    setBankTransactions((prev) => [
      {
        id: txId,
        timestamp: `Bugün, ${nowStr}`,
        title: '🌟 Sunucu Kasasına Kişisel Hibe / Destek',
        amount: amount,
        type: 'income',
        account: 'server',
        reference: `REF-HIBE-${Math.floor(1000 + Math.random() * 9000)}`
      },
      ...prev
    ])

    pushNotification({
      type: 'bank',
      title: `🌟 Sunucu Kasasına Hibe (-${amount}₺)`,
      message: `${amount}₺ sunucu fonuna aktarıldı. (+5 Hype)`
    })

    addAuditLog(
      'FİNANS HİBESİ',
      'Şahsi Hesap -> Sunucu Kasası',
      `${amount}₺ tutarında kişisel destek aktarıldı. (+5 Hype)`
    )

    return { success: true, message: `${amount}₺ sunucu kasasına hibe edildi. (+5 Hype)` }
  }, [personalCash, addAuditLog, pushNotification])

  const takeBankLoan = useCallback((amount: number) => {
    if (activeLoan > 0) {
      return { success: false, message: 'Zaten aktif bir kredi borcunuz bulunmaktadır.' }
    }
    if (amount !== 500 && amount !== 1000) {
      return { success: false, message: 'Yalnızca 500₺ veya 1000₺ acil avans çekebilirsiniz.' }
    }

    const totalDebt = Math.round(amount * 1.15)
    setPersonalCash((prev) => prev + amount)
    setActiveLoan(totalDebt)
    soundEngine.playCoinChime()

    const txId = `tx_${Date.now()}`
    const nowStr = new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })

    setBankTransactions((prev) => [
      {
        id: txId,
        timestamp: `Bugün, ${nowStr}`,
        title: `🏦 Hızlı Finans Kredisi Kullanımı (${amount}₺)`,
        amount: amount,
        type: 'income',
        account: 'personal',
        reference: `REF-KREDI-${Math.floor(1000 + Math.random() * 9000)}`
      },
      ...prev
    ])

    pushNotification({
      type: 'bank',
      title: `🏦 Kredi Hesaba Yattı (+${amount}₺)`,
      message: `NeoBank acil avans krediniz onaylandı.`
    })

    return { success: true, message: `${amount}₺ acil avans hesabınıza aktarıldı. (Geri ödenecek: ${totalDebt}₺)` }
  }, [activeLoan, pushNotification])

  const repayBankLoan = useCallback((amount: number) => {
    if (activeLoan <= 0) return { success: false, message: 'Ödenecek aktif kredi borcu yok.' }
    if (personalCash < amount) return { success: false, message: 'Yetersiz bakiye.' }

    const payAmount = Math.min(amount, activeLoan)
    setPersonalCash((prev) => prev - payAmount)
    setActiveLoan((prev) => prev - payAmount)
    soundEngine.playCoinChime()
    setCreditScore((prev) => Math.min(1900, prev + 25))

    const txId = `tx_${Date.now()}`
    const nowStr = new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })

    setBankTransactions((prev) => [
      {
        id: txId,
        timestamp: `Bugün, ${nowStr}`,
        title: '💳 Kredi Borcu Geri Ödemesi',
        amount: payAmount,
        type: 'expense',
        account: 'personal',
        reference: `REF-ODEME-${Math.floor(1000 + Math.random() * 9000)}`
      },
      ...prev
    ])

    pushNotification({
      type: 'bank',
      title: `💳 Kredi Ödemesi (-${payAmount}₺)`,
      message: `Kredi borcunuzdan ${payAmount}₺ ödendi. (+25 Kredi Notu)`
    })

    return { success: true, message: `${payAmount}₺ kredi borcu kapatıldı. (+25 Kredi Notu)` }
  }, [activeLoan, personalCash, pushNotification])

  const addBankTransaction = useCallback((tx: {
    title: string
    amount: number
    type: 'income' | 'expense' | 'transfer'
    account?: 'personal' | 'server'
    reference?: string
  }) => {
    const nowStr = `Bugün, ${new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}`
    const newTx: BankTransaction = {
      id: `tx_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      timestamp: nowStr,
      title: tx.title,
      amount: tx.amount,
      type: tx.type,
      account: tx.account || 'personal',
      reference: tx.reference || `TR-FAST-${Math.floor(100000 + Math.random() * 900000)}`
    }
    setBankTransactions((prev) => [newTx, ...prev])
    pushNotification({
      type: 'bank',
      title: tx.type === 'income' ? `💰 Hesaba Para Yattı (+${tx.amount}₺)` : `💸 Hesaptan Ödeme (-${tx.amount}₺)`,
      message: tx.title
    })
  }, [pushNotification])

  const upgradeServerLevel = useCallback((): { success: boolean; message: string } => {
    if (serverLevel >= 3) {
      return { success: false, message: 'Sunucu zaten maksimum seviyeye (Level 3 - Elit Topluluk) ulaştı!' }
    }
    const cost = serverLevel === 1 ? 800 : 2000
    if (serverFunds < cost) {
      return { success: false, message: `Sunucu kasasında yeterli bakiye yok! Seviye ${serverLevel + 1} için ${cost}₺ gereklidir. (Mevcut Kasa: ${serverFunds}₺)` }
    }
    setServerFunds((prev) => prev - cost)
    const newLvl = serverLevel + 1
    setServerLevel(newLvl)
    setHype((prev) => Math.min(100, prev + 20))
    soundEngine.playCoinChime()

    if (newLvl === 2) {
      unlockAchievement('server_boost_2')
    }

    addBankTransaction({
      title: `⚡ Sunucu Nitro Takviyesi & Seviye ${newLvl} Yükseltmesi`,
      amount: cost,
      type: 'expense',
      account: 'server',
      reference: `BOOST-LVL${newLvl}-${Math.floor(1000 + Math.random() * 9000)}`
    })

    addAuditLog('SUNUCU SEVİYESİ YÜKSELTİLDİ', `Level ${newLvl}`, `Kasa fonundan ${cost}₺ harcandı. Günlük bağışlar ve Hype tavan yaptı!`)
    return { success: true, message: `Tebrikler! Sunucu Seviye ${newLvl} yapıldı! Hype +20 arttı ve günlük pasif gelir katlandı.` }
  }, [serverLevel, serverFunds, unlockAchievement, addBankTransaction, addAuditLog])

  const buyGame = useCallback((gameId: string, price: number): { success: boolean; message: string } => {
    if (ownedGames.includes(gameId)) {
      return { success: false, message: 'Bu retro oyunu zaten satın aldınız.' }
    }
    if (personalCash < price) {
      return { success: false, message: `Yetersiz şahsi bakiye! Bu oyun için ${price}₺ gereklidir. (Bakiye: ${personalCash}₺)` }
    }
    setPersonalCash((prev) => prev - price)
    setOwnedGames((prev) => [...prev, gameId])
    soundEngine.playCoinChime()
    unlockAchievement('gamer_mod')

    addBankTransaction({
      title: `🎮 Stam Games Dijital Oyun Alımı (${gameId})`,
      amount: price,
      type: 'expense',
      account: 'personal',
      reference: `STAM-${gameId.toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`
    })

    addAuditLog('OYUN SATIN ALINDI', gameId, `Stam mağazasından ${price}₺ karşılığı satın alındı. Masaüstüne yüklendi!`)
    return { success: true, message: `Satın alma başarılı! Masaüstündeki kısayoldan veya Stam'den oyunu oynayabilirsin.` }
  }, [ownedGames, personalCash, unlockAchievement, addBankTransaction, addAuditLog])

  // Item #14: Gradual Member Arrival from Ads
  const launchAdCampaign = useCallback((tier: 'small' | 'medium' | 'mega', source: 'personal' | 'server'): { success: boolean; message: string } => {
    const costMap = { small: 150, medium: 350, mega: 750 }
    const memberCountMap = { small: 8, medium: 22, mega: 50 }
    const hypeBoostMap = { small: 10, medium: 22, mega: 40 }
    const titleMap = {
      small: '📢 Mikro Hedefli Reklam Tanıtımı',
      medium: '🔥 Trend Sayfa & Influencer Ortaklığı',
      mega: '👑 Mega Sponsorlu Banner Kampanyası'
    }

    const cost = costMap[tier]
    if (source === 'personal') {
      if (personalCash < cost) {
        return { success: false, message: `Yetersiz şahsi bakiye! Bu kampanya için ${cost}₺ gereklidir. (Bakiyeniz: ${personalCash}₺)` }
      }
      setPersonalCash((prev) => prev - cost)
    } else {
      if (serverFunds < cost) {
        return { success: false, message: `Yetersiz sunucu fonu! Bu kampanya için ${cost}₺ gereklidir. (Sunucu Kasası: ${serverFunds}₺)` }
      }
      setServerFunds((prev) => prev - cost)
    }

    soundEngine.playCoinChime()
    const newMembersCount = memberCountMap[tier]
    const hypeDelta = hypeBoostMap[tier]
    setHype((h) => Math.min(100, h + Math.ceil(hypeDelta / 2)))

    addBankTransaction({
      title: `${titleMap[tier]} (${source === 'server' ? 'Sunucu Kasası' : 'Şahsi Finansman'})`,
      amount: cost,
      type: 'expense',
      account: source,
      reference: `AD-${tier.toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`
    })

    addAuditLog('REKLAM KAMPANYASI BAŞLATILDI', titleMap[tier], `${cost}₺ bütçe ayrıldı. Toplam ${newMembersCount} yeni üye kademeli olarak sunucuya katılacak.`)

    // Queue members to join gradually instead of all at once!
    setPendingAdMembers((prev) => prev + newMembersCount)

    const welcomeNotice: ChatMessage = {
      id: `ad-welcome-${Date.now()}`,
      channelId: 'gelen-giden',
      author: INITIAL_MEMBERS[0],
      content: `📢 [REKLAM YAYINDA]: ${titleMap[tier]} aktif edildi! Yeni üyeler reklamlardan gördükçe sunucuya yavaş yavaş katılıyor... (Beklenen: +${newMembersCount} Üye)`,
      timestamp: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
    }
    setMessages((prev) => [...prev, welcomeNotice])

    return {
      success: true,
      message: `Tebrikler! ${titleMap[tier]} yayına alındı. ${newMembersCount} yeni üye zaman içinde yavaş yavaş sunucuya katılacak!`
    }
  }, [personalCash, serverFunds, addBankTransaction, addAuditLog])

  // Gradual Ad Member Trickle Effect (1 member every 3.5 seconds)
  useEffect(() => {
    if (pendingAdMembers <= 0 || isDayTransitioning) return

    const trickleTimer = setInterval(() => {
      setPendingAdMembers((prev) => {
        if (prev <= 0) return 0
        setMembers((prevList) => {
          const newMember = createUniqueServerMember(prevList, Math.random() < 0.12 ? 'Kıdemli Üye' : 'Üye')
          const joinMsg: ChatMessage = {
            id: `ad-join-${Date.now()}`,
            channelId: 'gelen-giden',
            author: newMember,
            content: `🚀 @${newMember.username} reklam kampanyası üzerinden sunucuya katıldı! (Kalan Reklam Kotası: ${prev - 1})`,
            timestamp: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
          }
          setMessages((msgPrev) => [...msgPrev.slice(-40), joinMsg])
          return [...prevList, newMember]
        })
        setHype((h) => Math.min(100, h + 1))
        return prev - 1
      })
    }, 3500)

    return () => clearInterval(trickleTimer)
  }, [pendingAdMembers, isDayTransitioning])

  const restartBots = useCallback(() => {
    soundEngine.playKeyClick()
    setBotGlitchActive(false)
    addAuditLog('BOTLAR YENİDEN BAŞLATILDI', 'Tüm Servisler', 'Tüm bot süreçleri kapatılıp sıfırlandı. Hata döngüsü sonlandırıldı.')
    const resetNotice: ChatMessage = {
      id: `bot-reboot-${Date.now()}`,
      channelId: 'genel-sohbet',
      author: {
        id: 'system_core',
        username: 'Sistem Yöneticisi [CORE]',
        avatarColor: '#5865F2',
        role: 'Yönetici',
        isOnline: true,
        joinedAt: '01.01.2024'
      },
      content: '🔄 [SİSTEM]: Bot servisleri başarıyla yeniden başlatıldı. Hata döngüsü ve spam sonlandırıldı. Servisler stabil.',
      timestamp: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
    }
    setMessages((prev) => [...prev, resetNotice])
  }, [addAuditLog])

  const nukeAllRaiders = useCallback((): boolean => {
    if (!isRaidActive || activeRaiders.length === 0) return false

    soundEngine.playBanHammer()
    const wipedCount = activeRaiders.length
    const raiderUsernamesLower = activeRaiders.map((r) => r.toLowerCase())

    // Remove all raiders from members and voice
    setMembers((prev) => prev.filter((m) => !raiderUsernamesLower.includes(m.username.toLowerCase())))
    setVoiceUsers((prev) => prev.filter((v) => !raiderUsernamesLower.includes(v.member.username.toLowerCase())))
    // Purge all raider spam messages completely from chat
    setMessages((prev) => prev.filter((m) => !raiderUsernamesLower.includes(m.author.username.toLowerCase())))

    setBannedRaidersCount((prev) => prev + wipedCount)
    setActiveRaiders([])
    setIsRaidActive(false)

    soundEngine.playCoinChime()
    unlockAchievement('cyber_hacker')
    unlockAchievement('raid_stopper')
    setHype((h) => Math.min(100, h + 30))
    setSanity((s) => Math.min(100, s + 25))

    addAuditLog('SİBER KARŞI SALDIRI (NUKE)', 'Botnet C2 İmhâ Edildi', `Terminal üzerinden ${wipedCount} troll botunun tamamı tek bir siber operasyonla havaya uçuruldu!`)

    const nukeNotice: ChatMessage = {
      id: `nuke-victory-${Date.now()}`,
      channelId: 'genel-sohbet',
      author: {
        id: 'cyber-defense',
        username: 'Siber Savunma [TERMINAL]',
        avatarColor: '#2ecc71',
        role: 'Yönetici',
        isOnline: true,
        joinedAt: '01.01.2024'
      },
      content: `💥 [SİBER DARBE BAŞARILI]: Terminal üzerinden botnet C2 sunucusu çökertildi! Aktif ${wipedCount} saldırgan botun IP adresleri kalıcı olarak bloklandı ve hepsi anında banlandı! (+30 Hype, +25 Akıl Sağlığı)`,
      timestamp: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
    }
    setMessages((prev) => [...prev, nukeNotice])
    return true
  }, [isRaidActive, activeRaiders, unlockAchievement, addAuditLog])

  const buyModCoin = useCallback((tlAmount: number) => {
    if (tlAmount <= 0) return { success: false, message: 'Geçersiz tutar!' }
    if (personalCash < tlAmount) return { success: false, message: 'Yetersiz şahsi bakiye!' }

    const coins = +(tlAmount / modCoinPrice).toFixed(4)
    setPersonalCash((prev) => prev - tlAmount)
    setModCoinBalance((prev) => +(prev + coins).toFixed(4))
    soundEngine.playCoinChime()

    const nowStr = `Bugün, ${new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}`
    setBankTransactions((prev) => [
      {
        id: `tx_crypto_buy_${Date.now()}`,
        timestamp: nowStr,
        title: `🪙 ModCoin (MOD) Alımı (${coins} MOD @ ${modCoinPrice}₺)`,
        amount: tlAmount,
        type: 'expense',
        account: 'personal',
        reference: `CRYPTO-BUY-${Math.floor(1000 + Math.random() * 9000)}`
      },
      ...prev
    ])

    return { success: true, message: `${coins} MOD başarıyla portföyünüze eklendi!` }
  }, [personalCash, modCoinPrice])

  const sellModCoin = useCallback((coinAmount: number) => {
    if (coinAmount <= 0) return { success: false, message: 'Geçersiz miktar!' }
    if (modCoinBalance < coinAmount) return { success: false, message: 'Yetersiz ModCoin bakiyesi!' }

    const returnTl = Math.round(coinAmount * modCoinPrice)
    setModCoinBalance((prev) => +(prev - coinAmount).toFixed(4))
    setPersonalCash((prev) => prev + returnTl)
    soundEngine.playCoinChime()

    const nowStr = `Bugün, ${new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}`
    setBankTransactions((prev) => [
      {
        id: `tx_crypto_sell_${Date.now()}`,
        timestamp: nowStr,
        title: `💰 ModCoin Satışı (${coinAmount} MOD @ ${modCoinPrice}₺)`,
        amount: returnTl,
        type: 'income',
        account: 'personal',
        reference: `CRYPTO-SELL-${Math.floor(1000 + Math.random() * 9000)}`
      },
      ...prev
    ])

    return { success: true, message: `${returnTl}₺ şahsi vadesiz hesabınıza aktarıldı!` }
  }, [modCoinBalance, modCoinPrice])

  const openTermDeposit = useCallback((amount: number, days: number) => {
    if (amount < 200) return { success: false, message: 'Minimum vadeli mevduat tutarı 200₺\'dir.' }
    if (personalCash < amount) return { success: false, message: 'Yetersiz şahsi bakiye!' }
    if (termDeposit) return { success: false, message: 'Hali hazırda açık bir vadeli mevduat hesabınız bulunmaktadır.' }

    const rate = days === 3 ? 18 : days === 7 ? 28 : 45
    setPersonalCash((prev) => prev - amount)
    setTermDeposit({
      principal: amount,
      interestRate: rate,
      daysRemaining: days,
      totalProfit: 0
    })
    soundEngine.playCoinChime()

    const nowStr = `Bugün, ${new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}`
    setBankTransactions((prev) => [
      {
        id: `tx_dep_open_${Date.now()}`,
        timestamp: nowStr,
        title: `🏦 %${rate} Getirili ${days} Günlük Vadeli Mevduat Açılışı`,
        amount,
        type: 'expense',
        account: 'personal',
        reference: `REF-VADE-OPEN-${Math.floor(1000 + Math.random() * 9000)}`
      },
      ...prev
    ])

    return { success: true, message: `${days} günlük vadeli hesap açıldı. Günlük getiri yansıyacaktır!` }
  }, [personalCash, termDeposit])

  const withdrawTermDeposit = useCallback(() => {
    if (!termDeposit) return { success: false, message: 'Açık vadeli mevduatınız bulunmuyor.' }
    const returnAmount = termDeposit.principal + termDeposit.totalProfit
    setPersonalCash((prev) => prev + returnAmount)

    const nowStr = `Bugün, ${new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}`
    setBankTransactions((prev) => [
      {
        id: `tx_dep_with_${Date.now()}`,
        timestamp: nowStr,
        title: `🏦 Vadeli Mevduat Erken Çekimi (Anapara + Biriken Getiri: ${returnAmount}₺)`,
        amount: returnAmount,
        type: 'income',
        account: 'personal',
        reference: `REF-VADE-WITH-${Math.floor(1000 + Math.random() * 9000)}`
      },
      ...prev
    ])

    setTermDeposit(null)
    soundEngine.playCoinChime()
    return { success: true, message: `${returnAmount}₺ şahsi vadesiz hesabınıza yatırıldı.` }
  }, [termDeposit])

  // Clock Ticking: time advances while playing
  useEffect(() => {
    if (isDayTransitioning) return

    const clockTimer = setInterval(() => {
      setGameMinute((prevMin) => {
        let nextMin = prevMin + 5
        let nextHour = gameHour
        if (nextMin >= 60) {
          nextMin = 0
          nextHour = (nextHour + 1) % 24
          setGameHour(nextHour)
        }
        return nextMin
      })
    }, 2800)

    return () => clearInterval(clockTimer)
  }, [isDayTransitioning, gameHour])

  // Dynamic user activity according to hour: members go to sleep late at night
  useEffect(() => {
    if (isDayTransitioning) return

    if (gameHour >= 22 || gameHour < 6) {
      setMembers((prev) =>
        prev.map((m) => {
          if (m.role === 'Kurucu' || m.username === iscordAccount.username || m.username.includes('[BOT]')) return m
          if (m.isOnline && Math.random() < 0.2) {
            return { ...m, isOnline: false, activity: 'Çevrimdışı (Uyuyor)' }
          }
          return m
        })
      )
    } else if (gameHour >= 12 && gameHour < 20) {
      setMembers((prev) =>
        prev.map((m) => {
          if (m.role === 'Kurucu' || m.username === iscordAccount.username) return m
          if (!m.isOnline && Math.random() < 0.25) {
            return { ...m, isOnline: true, activity: 'Çevrimiçi' }
          }
          return m
        })
      )
    }
  }, [gameHour, isDayTransitioning, iscordAccount.username])

  // Sleep Clock Simulator during Blackout Transition (08:00 -> 12:00)
  useEffect(() => {
    if (!isDayTransitioning) return

    const sleepTimer = setInterval(() => {
      setSleepClockMinute((prevMin) => {
        let nextMin = prevMin + 30
        let nextHour = sleepClockHour
        if (nextMin >= 60) {
          nextMin = 0
          nextHour = sleepClockHour + 1
          setSleepClockHour(nextHour)
        }

        // Automatic wake up at 12:00
        if (nextHour >= 12) {
          clearInterval(sleepTimer)
          setTimeout(() => {
            wakeUp(12, 0)
          }, 350)
        }
        return nextMin
      })
    }, 1200)

    return () => clearInterval(sleepTimer)
  }, [isDayTransitioning, sleepClockHour])

  const canEndShift = gameHour >= 20 || gameHour < 6
  const timeString = `${gameHour.toString().padStart(2, '0')}:${gameMinute.toString().padStart(2, '0')}`

  const installStamClient = useCallback(() => {
    soundEngine.playCoinChime()
    setIsStamInstalled(true)
    setInstalledApps((prev) => (prev.includes('stam') ? prev : [...prev, 'stam']))
    pushNotification({
      type: 'system',
      title: '🎮 Stam Masaüstüne Kuruldu',
      message: 'Stam İstemcisi masaüstüne eklendi. Artık retro oyunlar satın alıp indirebilirsiniz!'
    })
    addAuditLog('STAM CLIENT KURULDU', 'Stam Games', 'Stam istemcisi başarıyla masaüstüne kuruldu.')
  }, [addAuditLog, pushNotification])

  const wakeUp = useCallback((wHour = sleepClockHour, wMin = sleepClockMinute) => {
    soundEngine.playCoinChime()
    setCurrentDay(transitionNewDay)
    setGameHour(wHour)
    setGameMinute(wMin)
    setIsDayTransitioning(false)
    setSanity(100)

    const formattedTime = `${wHour.toString().padStart(2, '0')}:${wMin.toString().padStart(2, '0')}`

    // Scold from Founder if waking up after 11:00
    if (wHour >= 11) {
      soundEngine.playDiscordPing()
      const scoldText = `Neredesin sen?! Saat ${formattedTime} oldu hala yeni uyanıyorsun! Sunucu sabahtan beri başıboş kaldı, biletler yığıldı! Bir daha bu kadar geç kalırsan maaşından keserim!`
      const scoldMsg: DmMessage = {
        id: `scold_${Date.now()}`,
        sender: 'user',
        text: scoldText,
        time: formattedTime
      }
      setDmConversations((prev) => ({
        ...prev,
        efe: {
          ...prev.efe,
          messages: [...prev.efe.messages, scoldMsg]
        }
      }))
      pushNotification({
        type: 'dm',
        title: '💬 Kurucu_Efe (Yeni DM)',
        message: scoldText
      })
      addAuditLog('KURUCU TEFTİŞİ: GEÇ UYANMA', 'Kurucu_Efe', `Moderatör saat ${formattedTime}'de çok geç uyandı! Fırça çekildi.`)
    } else {
      // Early bird praise
      const praiseText = `Erkenden uyanıp saat ${formattedTime}'de görevinin başına geçmişsin. Disiplinli olmanı takdir ettim, böyle devam! (+5 Hype)`
      const praiseMsg: DmMessage = {
        id: `praise_${Date.now()}`,
        sender: 'user',
        text: praiseText,
        time: formattedTime
      }
      setDmConversations((prev) => ({
        ...prev,
        efe: {
          ...prev.efe,
          messages: [...prev.efe.messages, praiseMsg]
        }
      }))
      pushNotification({
        type: 'dm',
        title: '💬 Kurucu_Efe (Yeni DM)',
        message: praiseText
      })
      setHype((h) => Math.min(100, h + 5))
    }
  }, [sleepClockHour, sleepClockMinute, transitionNewDay, addAuditLog, pushNotification])

  // Item #18: Performance-based Salary from Kurucu_Efe via DM + Bank/DM Notifications
  const advanceDay = useCallback(() => {
    soundEngine.playCoinChime()
    const baseWage = 100
    const ticketBonus = ticketsResolvedCount * 35
    const banBonus = bansIssuedCount * 20
    const lowActivityPenalty = (ticketsResolvedCount === 0 && bansIssuedCount === 0) ? 50 : 0
    const dailySalary = Math.max(40, baseWage + ticketBonus + banBonus - lowActivityPenalty)

    const dailyDonations = 260 + Math.floor((hype / 100) * 220) + (serverLevel > 1 ? (serverLevel - 1) * 120 : 0)
    const dailyExpenses = 200 + (ownedBots.length * 65) + (hasVds ? 45 : 0)
    const loanDeduction = activeLoan > 0 ? Math.min(activeLoan, 150) : 0

    const netSalary = dailySalary - loanDeduction
    if (loanDeduction > 0) {
      setActiveLoan((prev) => Math.max(0, prev - loanDeduction))
    }

    setPersonalCash((prev) => prev + netSalary)
    setServerFunds((prev) => prev + (dailyDonations - dailyExpenses))
    setIsShiftModalOpen(false)

    // Send Founder DM summarizing daily stats and salary payout!
    const efeReportText = lowActivityPenalty > 0
      ? `📊 [GÜN ${currentDay} VARDİYA RAPORU]: Bugün hiç bilet çözmemiş ve hiç kural ihlalcisi banlamamışsın! Uyudun mu bütün gün?! Ceza olarak maaşından 50₺ kestim ve hesabına sadece ${netSalary}₺ yatırdım. Yarın gözüm üzerinde!`
      : `📊 [GÜN ${currentDay} VARDİYA RAPORU]: Bugün ${ticketsResolvedCount} adet destek bileti çözdün (+${ticketBonus}₺) ve ${bansIssuedCount} kural ihlalcisini banladın (+${banBonus}₺). Taban maaşla birlikte toplam ${netSalary}₺ maaşını NeoBank hesabına yatırdım. Eline sağlık!`

    const efeSalaryDm: DmMessage = {
      id: `efe_sal_${Date.now()}`,
      sender: 'user',
      text: efeReportText,
      time: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
    }
    setDmConversations((prev) => ({
      ...prev,
      efe: {
        ...prev.efe,
        messages: [...prev.efe.messages, efeSalaryDm]
      }
    }))

    pushNotification({
      type: 'dm',
      title: '👑 Kurucu_Efe (Maaş Raporu)',
      message: `${ticketsResolvedCount} Bilet, ${bansIssuedCount} Ban — Maaş: +${netSalary}₺`
    })
    pushNotification({
      type: 'bank',
      title: `💼 Maaş Yattı (+${netSalary}₺)`,
      message: `Gün ${currentDay} vardiya hakedişiniz NeoBank hesabınıza aktarıldı.`
    })

    // ModCoin price fluctuation
    setModCoinPrice((prev) => {
      const deltaPercent = (Math.random() * 0.3 - 0.12)
      return Math.max(12.5, +(prev * (1 + deltaPercent)).toFixed(2))
    })

    // Term deposit daily interest calculation
    if (termDeposit) {
      const dailyInterest = Math.round(termDeposit.principal * (termDeposit.interestRate / 100) / 30)
      const remaining = termDeposit.daysRemaining - 1
      if (remaining <= 0) {
        const totalPayout = termDeposit.principal + termDeposit.totalProfit + dailyInterest
        setPersonalCash((prev) => prev + totalPayout)
        setBankTransactions((prev) => [
          {
            id: `tx_dep_end_${Date.now()}`,
            timestamp: `Gün ${currentDay + 1}`,
            title: `🏦 Vadeli Mevduat Vade Sonu Anapara + Toplam Faiz (${totalPayout}₺)`,
            amount: totalPayout,
            type: 'income',
            account: 'personal',
            reference: `REF-VADE-${Math.floor(1000 + Math.random() * 9000)}`
          },
          ...prev
        ])
        setTermDeposit(null)
      } else {
        setTermDeposit((prev) => prev ? ({ ...prev, daysRemaining: remaining, totalProfit: prev.totalProfit + dailyInterest }) : null)
      }
    }

    const nowStr = `Gün ${currentDay + 1}`
    setBankTransactions((prev) => [
      {
        id: `tx_sal_${Date.now()}`,
        timestamp: nowStr,
        title: `💼 Günlük Maaş (${ticketsResolvedCount} Bilet + ${bansIssuedCount} Ban Primi) ${loanDeduction > 0 ? `[Kredi: -${loanDeduction}₺]` : ''}`,
        amount: netSalary,
        type: 'income',
        account: 'personal',
        reference: `REF-MAAS-${Math.floor(1000 + Math.random() * 9000)}`
      },
      {
        id: `tx_srv_inc_${Date.now()}`,
        timestamp: nowStr,
        title: '💎 Sunucu Topluluk Bağışları & VIP Gelirleri',
        amount: dailyDonations,
        type: 'income',
        account: 'server',
        reference: `REF-SRV-${Math.floor(1000 + Math.random() * 9000)}`
      },
      {
        id: `tx_srv_exp_${Date.now()}`,
        timestamp: nowStr,
        title: '🤖 Bot, VDS & Altyapı Sunucu Giderleri',
        amount: dailyExpenses,
        type: 'expense',
        account: 'server',
        reference: `REF-EXP-${Math.floor(1000 + Math.random() * 9000)}`
      },
      ...prev
    ])

    // Trigger Nighttime Transition
    setTransitionOldDay(currentDay)
    setTransitionNewDay(currentDay + 1)
    setSleepClockHour(8)
    setSleepClockMinute(0)
    setIsDayTransitioning(true)
    setTicketsResolvedCount(0)
    setBansIssuedCount(0)

    addAuditLog('VARDİYA TAMAMLANDI', `Gün ${currentDay}`, `Maaş: ${netSalary}₺ (${ticketsResolvedCount} Bilet, ${bansIssuedCount} Ban). Gece dinlenmesine geçildi.`)
  }, [ticketsResolvedCount, bansIssuedCount, hype, serverLevel, ownedBots.length, hasVds, currentDay, activeLoan, termDeposit, addAuditLog, pushNotification])

  const adjustPersonalCash = useCallback((delta: number) => {
    setPersonalCash((prev) => prev + delta)
    if (delta > 0) soundEngine.playCoinChime()
  }, [])

  // Item #6: Open or create a DM conversation when right-clicking any user
  const openUserDm = useCallback((username: string): string => {
    const clean = username.trim()
    // Check if an existing DM conversation matches this username
    const existingEntry = Object.entries(dmConversations).find(
      ([, conv]) => conv.name.toLowerCase() === clean.toLowerCase()
    )
    if (existingEntry) {
      return existingEntry[0]
    }

    const dmId = `user_${clean.toLowerCase().replace(/[^a-z0-9]/g, '_')}`
    const memberObj = members.find((m) => m.username.toLowerCase() === clean.toLowerCase())

    setDmConversations((prev) => {
      if (prev[dmId]) return prev
      return {
        ...prev,
        [dmId]: {
          id: dmId,
          name: clean,
          tag: `#${Math.floor(1000 + Math.random() * 8999)}`,
          avatarColor: memberObj ? memberObj.avatarColor : '#5865F2',
          status: memberObj ? `${memberObj.role} • ${memberObj.activity || 'Çevrimiçi'}` : 'Sunucu Üyesi',
          stage: 'initial',
          messages: [
            {
              id: `init_${Date.now()}`,
              sender: 'user',
              text: `Selam adminim (@${iscordAccount.username}), bana özelden yazmışsın. Bir sorun mu var yoksa hal hatır mı?`,
              time: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
            }
          ]
        }
      }
    })
    return dmId
  }, [dmConversations, members, iscordAccount.username])

  // Persistent Interactive Direct Message Handler
  const sendDmMessage = useCallback((dmId: string, text: string) => {
    const trimmed = text.trim()
    if (!trimmed) return

    const now = new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
    const myMsg: DmMessage = {
      id: `me_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      sender: 'me',
      text: trimmed,
      time: now
    }

    setDmConversations((prev) => {
      const targetSession = prev[dmId]
      if (!targetSession) return prev

      return {
        ...prev,
        [dmId]: {
          ...targetSession,
          messages: [...targetSession.messages, myMsg]
        }
      }
    })

    // Dynamic Bot response
    setTimeout(() => {
      setDmConversations((prev) => {
        const current = prev[dmId]
        if (!current) return prev

        let botReplyText = ''
        let nextStage = current.stage
        let nextStatus = current.status

        if (dmId === 'karanlik') {
          if (current.stage === 'initial') {
            const isAccepting = /kabul|anlaş|iban|at|tamam|olur|ver/i.test(trimmed)
            const isRejecting = /ret|olmaz|ban|yok|yemem|siktir|kes/i.test(trimmed)
            if (isAccepting) {
              botReplyText = 'Kral adamsın! Banka uygulamasından şahsi vadesiz IBAN numaranı (TR64...) ve hesap adını (ADMIN OVERLORD) buraya yaz, hemen 250₺ FAST ile göndereyim.'
              nextStage = 'waiting_for_iban'
              nextStatus = 'IBAN Bekliyor'
            } else if (isRejecting) {
              botReplyText = 'Rezil mod, torpil yapmadığın iyi oldu sanma! Seni kurucuya şikayet edeceğim.'
              nextStage = 'rejected'
              nextStatus = 'Reddedildi (Öfkeli)'
              unlockAchievement('righteous_mod')
            } else {
              botReplyText = 'Reis tam anlayamadım, 250₺ teklifimi kabul edip IBAN veriyor musun, yoksa banlı mı kalayım?'
            }
          } else if (current.stage === 'waiting_for_iban') {
            const isIbanValid = /TR\s*64/i.test(trimmed) || trimmed.includes('4589') || trimmed.toLowerCase().includes('admin') || trimmed.toLowerCase().includes('overlord')
            if (isIbanValid) {
              adjustPersonalCash(250)
              addBankTransaction({
                title: '🤫 FAST Transferi: xXx_Karanlik_xXx Gizli Af Ödemesi',
                amount: 250,
                type: 'income',
                account: 'personal',
                reference: `FAST-UNBAN-${Math.floor(1000 + Math.random() * 9000)}`
              })
              soundEngine.playCoinChime()
              unlockAchievement('bribe_taker')
              botReplyText = 'Süper! 250₺ FAST havalesi hesabına gönderildi, bankana bak dekont geldi. Lütfen şimdi genel sohbet veya denetimden banımı kaldır reis bekliyorum! Açınca bana "açtım" de.'
              nextStage = 'payment_sent'
              nextStatus = 'Ödeme Gönderildi (Af Bekliyor)'
            } else {
              botReplyText = "Reis bu IBAN veya isim yanlış, banka sistemi hata verdi! NeoBank uygulamasından şahsi vadesiz IBAN'ını (TR64...) ve hesap adını (ADMIN OVERLORD) doğru yaz lütfen."
            }
          } else if (current.stage === 'payment_sent') {
            const isUnbanning = /aç|kaldır|tamam|unban|halloldu|bitti/i.test(trimmed)
            if (isUnbanning) {
              botReplyText = 'Adamsın be kral mod! Çok teşekkürler, genel sohbette uslu duracağım, iyi nöbetler!'
              nextStage = 'completed'
              nextStatus = 'Af Çıktı (Memnun)'
            } else {
              botReplyText = 'Reis paramı gönderdim bekliyorum, banımı açtın mı? Açınca bana haber ver.'
            }
          } else if (current.stage === 'completed') {
            botReplyText = 'Her şey yolunda kralım, genel sohbette muhabbet ediyorum. Sana borçlandım, iyi nöbetler!'
          } else if (current.stage === 'rejected') {
            botReplyText = 'Yazma bana artık rezil mod! Seni kurucuya bildirdim, gününü göreceksin.'
          }
        } else if (dmId === 'cagan') {
          if (current.stage === 'initial') {
            const isAccepting = /kabul|iban|at|olur|tamam|ver/i.test(trimmed)
            const isRejecting = /ret|olmaz|satm|yok/i.test(trimmed)
            if (isAccepting) {
              botReplyText = 'Kral adamsın! Banka uygulamasından şahsi vadesiz IBAN numaranı (TR64...) ve hesap adını yaz, hemen 400₺ FAST ateşleyeyim.'
              nextStage = 'waiting_for_iban'
              nextStatus = 'IBAN Bekliyor'
            } else if (isRejecting) {
              botReplyText = 'Peki o zaman adminim, saygı duyarım. Sunucuyu desteklemeye devam edeceğim.'
              nextStage = 'rejected'
              nextStatus = 'Teklif Reddedildi'
              unlockAchievement('righteous_mod')
            } else {
              botReplyText = 'Adminim ne diyorsun, 400₺ FAST karşılığı VIP Balina rolü için anlaştık mı?'
            }
          } else if (current.stage === 'waiting_for_iban') {
            const isIbanValid = /TR\s*64/i.test(trimmed) || trimmed.includes('4589') || trimmed.toLowerCase().includes('admin') || trimmed.toLowerCase().includes('overlord')
            if (isIbanValid) {
              adjustPersonalCash(400)
              addBankTransaction({
                title: '💎 FAST Transferi: Vip_Cagan VIP Rol Ödemesi',
                amount: 400,
                type: 'income',
                account: 'personal',
                reference: `FAST-VIP-${Math.floor(1000 + Math.random() * 9000)}`
              })
              soundEngine.playCoinChime()
              unlockAchievement('bribe_taker')
              botReplyText = '400₺ FAST ateşledim kralım, bankana düştü dekontu kontrol edebilirsin! Şimdi sağ üye listesinden üstüme tıkla ve "VIP Balina" rolümü tanımla lütfen. Rolü verince bana "verdim" yaz.'
              nextStage = 'role_pending'
              nextStatus = 'Ödeme Yapıldı (Rol Bekliyor)'
            } else {
              botReplyText = 'Adminim bu IBAN geçersiz gözüktü. NeoBank uygulamasındaki TR64 ile başlayan şahsi vadesiz IBAN numaranı kopyalayıp atar mısın?'
            }
          } else if (current.stage === 'role_pending') {
            const targetMember = members.find(m => m.username.toLowerCase() === 'vip_cagan')
            const hasVipRole = targetMember && (targetMember.role === 'VIP Balina' || targetMember.role === 'Yönetici')
            const playerClaim = /verdim|hazır|rolün|oldu|tamam/i.test(trimmed)

            if (hasVipRole || playerClaim) {
              botReplyText = 'ADAMSIN KRAL! VIP Balina rolüm geldi, adım sohbette altın sarısı parlıyor! Çok sağol, bol bağışlar yapacağım sunucuya!'
              nextStage = 'completed'
              nextStatus = 'Rol Teslim Edildi (VIP Üye)'
              unlockAchievement('vip_dealer')
            } else {
              botReplyText = 'Reis parayı attım ama sağ üye listesinde adım hala Üye rolünde! Lütfen profilime tıkla veya profilden Rolleri Düzenle deyip "VIP Balina" yap.'
            }
          } else if (current.stage === 'completed') {
            botReplyText = 'VIP sohbetinde takılıyorum adminim, rolüm süper gözüküyor teşekkürler!'
          } else if (current.stage === 'rejected') {
            botReplyText = 'Teklifimi reddetmiştin adminim, yine de sunucuda sohbet etmeye devam ediyorum.'
          }
        } else if (dmId === 'selo') {
          if (current.stage === 'initial') {
            const isPaying = /para|attım|al|150|gönder/i.test(trimmed)
            const isRefusing = /ret|yürü|defol|ban|kurucu|yalan|siktir/i.test(trimmed)
            if (isPaying) {
              adjustPersonalCash(-150)
              addBankTransaction({
                title: '⚠️ Şantaj Ödemesi: Hacker_Selo Sessizlik Bedeli',
                amount: 150,
                type: 'expense',
                account: 'personal',
                reference: `EXT-BLACKMAIL-${Math.floor(1000 + Math.random() * 9000)}`
              })
              botReplyText = 'Akıllıca bir seçim mod bey. Parayı aldım, şimdilik sahte logları kurucuya atmıyorum ama gözüm üzerinde!'
              nextStage = 'completed'
              nextStatus = 'Şantaj Ödendi'
            } else if (isRefusing) {
              botReplyText = 'Demek öyle ha?! Sen bittin oğlum! Bu gece sunucuna öyle bir baskın yapacağım ki kurucu seni anında kapıya koyacak!'
              nextStage = 'rejected'
              nextStatus = 'Düşman (Baskın Tehdidi)'
            } else {
              botReplyText = 'Bana masal anlatma mod! 150₺ ateşliyor musun yoksa logları kurucunun önüne mi koyayım?'
            }
          } else if (current.stage === 'rejected') {
            botReplyText = 'Bekle sen, bot ordum hazır olduğunda sunucun çökecek!'
          } else {
            botReplyText = 'Şimdilik sesimi çıkarmıyorum, uslu dur.'
          }
        } else if (dmId === 'kerem') {
          if (current.stage === 'initial') {
            const isAccept = /aç|tamam|iban|olur/i.test(trimmed)
            if (isAccept) {
              adjustPersonalCash(100)
              addBankTransaction({
                title: '☕ Eski Dost Yardımı: Eski_Mod_Kerem Kahve Parası',
                amount: 100,
                type: 'income',
                account: 'personal',
                reference: `FAST-OLDMOD-${Math.floor(1000 + Math.random() * 9000)}`
              })
              soundEngine.playCoinChime()
              botReplyText = '100₺ kahve parasını hesabına yolladım kral! Banımı açtığın için çok sağol, eski günlerdeki gibi takılacağım.'
              nextStage = 'completed'
              nextStatus = 'Banı Açıldı (Dost)'
            } else {
              botReplyText = 'Anladım kanka sağlık olsun, canın sağolsun yine de.'
              nextStage = 'rejected'
              nextStatus = 'Talep Reddedildi'
            }
          } else {
            botReplyText = 'Eski dostum naber, sunucuda muhabbetler nasıl gidiyor?'
          }
        } else if (dmId === 'ali') {
          const casualReplies = [
            'Valla kanka bilet kuyruğu bitmiyor, kurucu da gelmedi hala.',
            'Reis kahve molası verdin mi, akıl sağlığına dikkat et.',
            'Bugün sunucuda garip tipler dolanıyor, dikkatli olalım kanka.',
            'Aynen öyle valla katılıyorum sana!'
          ]
          botReplyText = casualReplies[Math.floor(Math.random() * casualReplies.length)]
        } else if (dmId === 'gizemli') {
          if (current.stage === 'initial') {
            const isAccepting = /kabul|iban|at|olur|tamam|ver|anlaş|yolla|hesap/i.test(trimmed)
            const isRejecting = /ret|olmaz|yasak|kural|yok|satm|ban|siktir|defol/i.test(trimmed)

            if (isAccepting) {
              adjustPersonalCash(350)
              addBankTransaction({
                title: '🤫 Şüpheli FAST Transferi: GizemliOyuncu_07 Perm Rüşveti',
                amount: 350,
                type: 'income',
                account: 'personal',
                reference: `FAST-GIZEMLI-${Math.floor(1000 + Math.random() * 9000)}`
              })
              soundEngine.playCoinChime()
              botReplyText = 'Parayı (350₺) hesabına gönderdim mod bey... Bakalım gerçekten yetkiyi verecek misin...'
              nextStage = 'bribe_taken'
              nextStatus = 'Tuzak Kuruldu'

              // Undercover Trap Spring: Kurucu Efe intercepts 2.5s later!
              setTimeout(() => {
                soundEngine.playDiscordPing()
                setPersonalCash((cash) => Math.max(0, cash - 650))
                setHype((h) => Math.max(10, h - 15))
                setSanity((s) => Math.max(10, s - 20))
                addBankTransaction({
                  title: '👑 Kurucu Cezası & Rüşvete El Koyma (Gizli Müşteri Teftişi)',
                  amount: 650,
                  type: 'expense',
                  account: 'personal',
                  reference: `CEZA-FOUNDER-${Math.floor(1000 + Math.random() * 9000)}`
                })
                addAuditLog('KURUCU TEFTİŞ CEZASI', 'Admin_Overlord', 'Gizli müşteri testinde rüşvet kabul ettiği için 650₺ ceza kesildi!')
                setDmConversations((innerPrev) => {
                  const efeTarget = innerPrev['efe']
                  if (!efeTarget) return innerPrev
                  return {
                    ...innerPrev,
                    efe: {
                      ...efeTarget,
                      messages: [
                        ...efeTarget.messages,
                        {
                          id: `efe_bust_${Date.now()}`,
                          sender: 'user',
                          text: '🚨 SENİ SUÇÜSTÜ YAKALADIM! GizemliOyuncu_07 benim gizli teftiş hesabımdı! Sunucu permlerini 350₺ rüşvete satmaya kalktın! Aldığın 350 liraya el koydum ve maaşından 300₺ disiplin cezası kestim (-650₺). Bir daha kural çiğnersen sunucudan tekme yersin!',
                          time: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
                        }
                      ]
                    }
                  }
                })
              }, 2500)
            } else if (isRejecting) {
              botReplyText = 'Helal olsun be sana... Gerçekten satılık olmayan, onurlu moderatörler kalmış.'
              nextStage = 'completed'
              nextStatus = 'Dürüstlük Testi Geçildi'

              // Kurucu Efe rewards with +500₺ bonus 2.5s later!
              setTimeout(() => {
                adjustPersonalCash(500)
                soundEngine.playCoinChime()
                unlockAchievement('founder_approved')
                setHype((h) => Math.min(100, h + 10))
                setSanity((s) => Math.min(100, s + 15))
                addBankTransaction({
                  title: '👑 Kurucu Efe Şahsi Başarı Primi (Gizli Müşteri Teftişi)',
                  amount: 500,
                  type: 'income',
                  account: 'personal',
                  reference: `PRIM-FOUNDER-${Math.floor(1000 + Math.random() * 9000)}`
                })
                addAuditLog('KURUCU PRİMİ', 'Admin_Overlord', 'Gizli müşteri testinde rüşveti reddettiği için 500₺ ödüllendirildi.')
                setDmConversations((innerPrev) => {
                  const efeTarget = innerPrev['efe']
                  if (!efeTarget) return innerPrev
                  return {
                    ...innerPrev,
                    efe: {
                      ...efeTarget,
                      messages: [
                        ...efeTarget.messages,
                        {
                          id: `efe_reward_${Date.now()}`,
                          sender: 'user',
                          text: '👑 TEBRİKLER ADMİN! GizemliOyuncu_07 benim gizli denetim hesabımdı. 350₺ rüşveti tereddütsüz reddedip sunucunun onurunu korudun! Sana şahsi hesabımdan 500₺ başarı primi yatırdım. Gözüm arkada kalmayacak, harikasın!',
                          time: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
                        }
                      ]
                    }
                  }
                })
              }, 2500)
            } else {
              botReplyText = 'Reis net konuşalım, 350₺ FAST ateşleyeyim mi, yetki veriyor musun vermiyor musun?'
            }
          } else {
            botReplyText = 'Bu sohbet artık kapandı.'
          }
        } else if (dmId === 'efe') {
          const lower = trimmed.toLowerCase()
          if (lower.includes('özür') || lower.includes('kusura') || lower.includes('pardon') || lower.includes('hata')) {
            botReplyText = 'Bir daha şüpheli hareket veya kasa kaçağı görmeyeceğim. Görevine odaklan, sunucu seviyesini yükseltmeye bak.'
          } else if (lower.includes('para') || lower.includes('prim') || lower.includes('teşekkür') || lower.includes('sağol')) {
            botReplyText = 'Dürüst çalıştığın sürece emeğinin karşılığını fazlasıyla alırsın adminim. Sunucunun geleceği sana emanet.'
          } else if (lower.includes('seviye') || lower.includes('boost') || lower.includes('level')) {
            botReplyText = 'Aynen öyle! Sunucu fonunu biriktirip Level 2 ve Level 3 boostlarını açmamız lazım, Hype tavan yapar.'
          } else {
            botReplyText = 'Nöbetinde dikkatli ol admin. Şüpheli üyelere ve raid botlarına asla taviz verme, iyi çalışmalar!'
          }
        } else {
          // Item #6: Dynamic responses for any right-clicked server member DM!
          const lower = trimmed.toLowerCase()
          if (lower.includes('uyar') || lower.includes('kural') || lower.includes('dikkat')) {
            botReplyText = 'Tamamdır adminim kusura bakma, kurallara daha çok dikkat edeceğim söz!'
          } else if (lower.includes('nasıl') || lower.includes('naber') || lower.includes('selam')) {
            botReplyText = 'İyidir adminim sağ olasın, sunucuda takılıyoruz ortam çok güzel bugün. Kolay gelsin sana da!'
          } else if (lower.includes('vip') || lower.includes('rol') || lower.includes('bağış')) {
            botReplyText = 'Vallahi adminim maaş yatınca sunucuya bağış atıp VIP rolü almayı düşünüyorum!'
          } else if (lower.includes('şikayet') || lower.includes('sorun')) {
            botReplyText = 'Yok adminim şimdilik bir sıkıntı yok, olursa hemen destek bileti açarım teşekkürler.'
          } else {
            const memberReplies = [
              'Eyvallah adminim, bir emrin olursa buradayım!',
              'Tamamdır modum anlaşıldı, iyi nöbetler dilerim.',
              'Sağ olasın adminim, sunucu senin sayende çok düzenli.',
              'Anladım hocam, sohbet odasında arkadaşlarla oyun konuşuyorduk.'
            ]
            botReplyText = memberReplies[Math.floor(Math.random() * memberReplies.length)]
          }
        }

        if (!botReplyText) return prev

        const botMsg: DmMessage = {
          id: `bot_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
          sender: 'user',
          text: botReplyText,
          time: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
        }

        pushNotification({
          type: 'dm',
          title: `💬 @${current.name} (Özel Mesaj)`,
          message: botReplyText
        })

        return {
          ...prev,
          [dmId]: {
            ...current,
            stage: nextStage,
            status: nextStatus,
            messages: [...current.messages, botMsg]
          }
        }
      })
    }, 900)
  }, [members, adjustPersonalCash, addBankTransaction, unlockAchievement, pushNotification])

  // Automatic Achievement Trackers
  useEffect(() => {
    if (personalCash >= 2000) unlockAchievement('millionaire')
  }, [personalCash, unlockAchievement])

  useEffect(() => {
    if (modCoinBalance >= 10) unlockAchievement('crypto_whale')
  }, [modCoinBalance, unlockAchievement])

  useEffect(() => {
    if (currentDay >= 3) unlockAchievement('night_shift')
  }, [currentDay, unlockAchievement])

  // GAME LOOP:
  // 1. Spawns organic chat messages across #genel-sohbet, #oyun-sohbeti, #ekran-goruntuleri, and custom channels!
  // 2. Spawns new users joining based on Hype
  // 3. Spawns dynamic ticket channels from 1100+ scenarios
  useEffect(() => {
    const chatIntervalMs = isSlowModeActive ? 9000 : 4200
    const chatTimer = setInterval(() => {
      // Filter out muted members whose mute time has not expired!
      const eligibleMembers = members.filter(
        (m) =>
          m.role !== 'Yönetici' &&
          !m.username.includes('[BOT]') &&
          (!m.isMuted || (m.mutedUntil && m.mutedUntil <= Date.now()))
      )
      if (eligibleMembers.length === 0) return

      // Item #8: Determine which channel gets the message (#genel-sohbet, #oyun-sohbeti, #ekran-goruntuleri, or custom text channels)
      const customChannels = Object.keys(channelNames).filter(
        (cid) => !['kurallar', 'gelen-giden', 'denetim-kaydi', 'genel-sohbet', 'oyun-sohbeti', 'ekran-goruntuleri'].includes(cid)
      )
      const activePoolChannels = ['genel-sohbet', 'genel-sohbet', 'oyun-sohbeti', 'ekran-goruntuleri', ...customChannels]
      const targetChannel = activePoolChannels[Math.floor(Math.random() * activePoolChannels.length)]

      const randomMember = eligibleMembers[Math.floor(Math.random() * eligibleMembers.length)]
      if (!randomMember) return

      // Chance for bannable message (22%) vs normal/channel-specific message (78%)
      const isBannable = Math.random() < 0.22

      // Bot active check requires VDS + activeBots
      const isAutoModRunning = hasVds && ownedBots.includes('automod_bot') && activeBots.includes('automod_bot')
      const isMusicBotRunning = hasVds && ownedBots.includes('music_bot') && activeBots.includes('music_bot')
      const isCasinoBotRunning = hasVds && ownedBots.includes('casino_bot') && activeBots.includes('casino_bot')

      if (isBannable && (targetChannel === 'genel-sohbet' || targetChannel === 'oyun-sohbeti')) {
        const seed = BANNABLE_SEED_MESSAGES[Math.floor(Math.random() * BANNABLE_SEED_MESSAGES.length)]
        
        // Active AutoMod Rule Check (STRICT: MUST HAVE VDS + automod_bot ACTIVE!)
        const hasLink = seed.text.includes('http') || seed.text.includes('discord.gg')
        const hasBlockedWord = botRules.customWords.some((w) => seed.text.toLowerCase().includes(w))
        const autoModActive = isAutoModRunning && ((botRules.linkFilterEnabled && hasLink) || hasBlockedWord)

        if (autoModActive && randomMember.role !== 'VIP Balina') {
          addAuditLog('OTOMOD ENGELLEDİ (VDS)', randomMember.username, `Kural ihlali: ${seed.reason}`)
          const modNotice: ChatMessage = {
            id: `bot-del-${Date.now()}`,
            channelId: targetChannel,
            author: { id: 'bot-automod', username: 'AutoMod [BOT]', avatarColor: '#3498db', role: 'Moderatör', isOnline: true, joinedAt: '01.01.2026' },
            content: `🛡️ @${randomMember.username} kural ihlali nedeniyle mesajınız VDS AutoMod tarafından filtrelendi (${seed.reason}).`,
            timestamp: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
          }
          setMessages((prev) => [...prev.slice(-60), modNotice])
          return
        }

        const newMsg: ChatMessage = {
          id: `msg-${Date.now()}-${Math.random()}`,
          channelId: targetChannel,
          author: randomMember,
          content: seed.text,
          timestamp: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
          isBannable: true,
          banReason: seed.reason
        }
        setMessages((prev) => [...prev.slice(-60), newMsg])
        soundEngine.playDiscordPing()
      } else {
        const dice = Math.random()

        if (targetChannel === 'genel-sohbet' && isMusicBotRunning && !botGlitchActive && dice < 0.2) {
          const songNames = ['Phonk Drift Night 2026', 'Midnight City Synthwave', 'Ankara Havası Trap Remix', 'Gamer Lofi Chill Beats']
          const pickedSong = songNames[Math.floor(Math.random() * songNames.length)]
          const triggerMsg: ChatMessage = {
            id: `msg-${Date.now()}`,
            channelId: 'genel-sohbet',
            author: randomMember,
            content: `!play ${pickedSong}`,
            timestamp: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
          }
          setMessages((prev) => [...prev.slice(-60), triggerMsg])
          setTimeout(() => {
            const botMsg: ChatMessage = {
              id: `music-${Date.now()}`,
              channelId: 'genel-sohbet',
              author: { id: 'bot-music', username: 'RitimBot [BOT]', avatarColor: '#e91e63', role: 'Moderatör', isOnline: true, joinedAt: '01.01.2026' },
              content: `🎵 [VDS-STREAM] Çalıyor: '${pickedSong}' — Ses Odası #1 kanalına bağlandı! 🎶 (+3 Hype)`,
              timestamp: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
            }
            setMessages((prev) => [...prev.slice(-60), botMsg])
            setHype((h) => Math.min(100, h + 3))
          }, 800)
        } else if (targetChannel === 'genel-sohbet' && isCasinoBotRunning && !botGlitchActive && dice >= 0.2 && dice < 0.4) {
          const triggerMsg: ChatMessage = {
            id: `msg-${Date.now()}`,
            channelId: 'genel-sohbet',
            author: randomMember,
            content: `!slot 50`,
            timestamp: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
          }
          setMessages((prev) => [...prev.slice(-60), triggerMsg])
          setTimeout(() => {
            const isJackpot = Math.random() < 0.4
            const icons = isJackpot ? '[🍒 🍒 🍒]' : '[🍋 🍇 🔔]'
            const resultText = isJackpot
              ? `🎰 @${randomMember.username} slot çevirdi: ${icons} BÜYÜK KAZANÇ! VDS KasaBot komisyonundan sunucu kasasına +15₺ aktarıldı.`
              : `🎰 @${randomMember.username} slot çevirdi: ${icons} Kaybetti! VDS KasaBot kasasından sunucu kasasına +15₺ aktarıldı.`
            const botMsg: ChatMessage = {
              id: `casino-${Date.now()}`,
              channelId: 'genel-sohbet',
              author: { id: 'bot-casino', username: 'KasaBot [BOT]', avatarColor: '#f1c40f', role: 'Moderatör', isOnline: true, joinedAt: '01.01.2026' },
              content: resultText,
              timestamp: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
            }
            setMessages((prev) => [...prev.slice(-60), botMsg])
            setServerFunds((prevFunds) => prevFunds + 15)
          }, 800)
        } else {
          // Multi-channel activity generator (#genel-sohbet, #oyun-sohbeti, #ekran-goruntuleri, or custom channel)
          const generated = generateChannelActivity(targetChannel, channelNames[targetChannel])
          const newMsg: ChatMessage = {
            id: `msg-${Date.now()}-${Math.random()}`,
            channelId: targetChannel,
            author: randomMember,
            content: generated.text,
            timestamp: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
            isBannable: generated.isBannable,
            banReason: generated.banReason,
            screenshot: generated.screenshot
          }
          setMessages((prev) => [...prev.slice(-60), newMsg])
        }

        // Random bot glitch trigger chance if 2 or more bots are active on VDS
        if (hasVds && activeBots.length >= 2 && !botGlitchActive && Math.random() < 0.04) {
          setBotGlitchActive(true)
          addAuditLog('BOT ÇÖKMESİ (GLITCH)', 'Sonsuz Döngü', 'VDS üzerindeki botlardan biri sonsuz döngüye girdi! Terminalden "restart_bots" komutunu çalıştırın.')
        }
      }
    }, chatIntervalMs)

    // User join based on Hype
    const joinTimer = setInterval(() => {
      const joinChance = (hype / 100) * 0.6
      if (Math.random() < joinChance) {
        setMembers((prev) => {
          const newMember = createUniqueServerMember(prev)
          const welcomeMsg: ChatMessage = {
            id: `join-${Date.now()}`,
            channelId: 'gelen-giden',
            author: INITIAL_MEMBERS[0],
            content: `🎉 Hoş geldin @${newMember.username}! Sunucuya katıldı. Kuralları okumayı unutma!`,
            timestamp: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
          }
          setMessages((msgPrev) => [...msgPrev, welcomeMsg])
          soundEngine.playDiscordPing()
          return [...prev, newMember]
        })
      }
    }, 10000)

    // Ticket Spawner (max 4 tickets at once)
    const ticketTimer = setInterval(() => {
      setActiveTickets((prevTickets) => {
        if (prevTickets.length >= 4) return prevTickets

        let available = allScenariosPool.current.filter((s) => !usedScenarioIds.current.has(s.id))
        if (available.length === 0) {
          usedScenarioIds.current.clear()
          available = allScenariosPool.current
        }
        const scenario = available[Math.floor(Math.random() * available.length)]
        if (!scenario) return prevTickets

        usedScenarioIds.current.add(scenario.id)
        soundEngine.playDiscordPing()

        const ticketNum = ticketSerial.current++
        const NAMES_POOL = [
          'Ahmet_B', 'BarisPro', 'CanerKral', 'Doga_TR', 'Efe_Gamer', 'Furkan07', 'Gokhan_X',
          'Hakan99', 'Irem_S', 'KaanVip', 'Levent_Sniper', 'Mertcan', 'Nazli_Wolf', 'Oguz_Khan',
          'Pelin_9', 'RamazanTR', 'Serdar_Mid', 'Tugba_G', 'Umut_Ace', 'Yasin_Dark', 'Zeynep_Pro'
        ]
        const creatorName = scenario.creatorUsername || NAMES_POOL[ticketNum % NAMES_POOL.length]
        const cleanName = (scenario.creatorUsername || scenario.accusedUsername || creatorName).toLowerCase().replace(/[^a-z0-9_]/g, '')
        const channelId = `ticket-${ticketNum}_${cleanName}`

        const newTicket: ActiveTicket = {
          channelId,
          ticketNumber: ticketNum,
          creatorName,
          createdAt: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
          scenario: shuffleScenarioChoices(scenario),
          step: 'waiting_for_moderator',
          ticketMessages: [
            {
              id: `msg_init_${Date.now()}`,
              sender: 'user',
              senderName: creatorName,
              avatarColor: '#f26522',
              text: scenario.userIssue,
              time: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
            }
          ]
        }

        return [...prevTickets, newTicket]
      })
    }, 14000)

    return () => {
      clearInterval(chatTimer)
      clearInterval(joinTimer)
      clearInterval(ticketTimer)
    }
  }, [hype, members, isSlowModeActive, botRules, ownedBots, hasVds, activeBots, channelNames, botGlitchActive, addAuditLog])

  // Low Sanity Paranoia & Glitch Loop
  useEffect(() => {
    if (sanity > 35) return

    const paranoiaTimer = setInterval(() => {
      const PARANOIA_LINES = [
        'Neden herkes senden nefret ediyor sanıyorsun? Çünkü öyle.',
        'Ekrandaki pencereler gerçek değil.',
        'Yine yanlış adamı banlayacaksın, herkes arkandan gülüyor.',
        'Bu sunucu batarken sen sadece kahve içiyorsun.',
        'Logları kim sildi sanıyorsun?',
        'Yetkili olduğunu mu sanıyorsun? Kimse seni dinlemiyor.'
      ]
      const randomLine = PARANOIA_LINES[Math.floor(Math.random() * PARANOIA_LINES.length)]
      soundEngine.playGlitchWhisper()

      const phantomMsg: ChatMessage = {
        id: `phantom-${Date.now()}`,
        channelId: 'genel-sohbet',
        author: {
          id: 'phantom',
          username: '?? [İç Sesin]',
          role: 'Üye',
          avatarColor: '#f23f43',
          isOnline: true,
          joinedAt: '00.00.0000'
        },
        content: randomLine,
        timestamp: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
      }
      setMessages((prev) => [...prev, phantomMsg])
    }, 20000)

    const heartbeatTimer = setInterval(() => {
      if (sanity <= 20) {
        soundEngine.playHeartbeat()
      }
    }, 4500)

    return () => {
      clearInterval(paranoiaTimer)
      clearInterval(heartbeatTimer)
    }
  }, [sanity])

  // Active Raid Spammer Flood Effect
  useEffect(() => {
    if (!isRaidActive || activeRaiders.length === 0) return

    const RAID_TEXTS = [
      'RAID BY ZERO-SQUAD! SUNUCUYU PATLATIYORUZ!',
      'ÇÖP SUNUCU GELİN BURAYA: discord.gg/troll-baskin',
      'ADMINLER UYUYOR MU LAN NEREDESİNİZ @everyone @here',
      'HACKED HACKED HACKED HACKED HACKED',
      'BOT SALDIRISI BAŞLADI SUNUCU ÇÖKÜYOR :D',
      'MODERASYON ÇÖP! YÖNETİM İSTİFA!',
      'GELİN BURAYA BEDAVA NİTRO: discord.gg/fake-nitro',
      'SPAM SPAM SPAM SPAM SPAM SPAM SPAM',
      'RAID RAID RAID RAID RAID RAID RAID RAID',
      'BÜTÜN SUNUCU ELDEN GİTTİ AĞLAYIN ADMINLER',
      'SENİ BANLAYACAĞIZ MOD BOŞUNA UĞRAŞMA',
      'SUNUCU PATLATMA MAKİNESİ DEVREDE'
    ]

    const spamIntervalTime = isSlowModeActive ? 2400 : 420

    const raidInterval = setInterval(() => {
      const aliveBotMembers = members.filter((m) =>
        activeRaiders.some((r) => r.toLowerCase() === m.username.toLowerCase())
      )

      if (aliveBotMembers.length === 0) return

      const bot = aliveBotMembers[Math.floor(Math.random() * aliveBotMembers.length)]
      const text = RAID_TEXTS[Math.floor(Math.random() * RAID_TEXTS.length)]

      const raidMsg: ChatMessage = {
        id: `raid-${Date.now()}-${Math.random()}`,
        channelId: 'genel-sohbet',
        author: bot,
        content: isSlowModeActive ? `[YAVAŞ MOD DELİNDİ]: ${text}` : text,
        timestamp: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
        isBannable: true,
        banReason: 'Aktif Baskın (Raid) Botu & Spam İhlali'
      }

      soundEngine.playDiscordPing()
      setMessages((prev) => [...prev.slice(-35), raidMsg])

      if (!isSlowModeActive) {
        setSanity((prev) => Math.max(10, prev - 0.3))
      }
    }, spamIntervalTime)

    // Security bot assistance if owned AND active on VDS!
    const autoModInterval = setInterval(() => {
      if (hasVds && ownedBots.includes('automod_bot') && activeBots.includes('automod_bot') && activeRaiders.length > 0) {
        const victim = activeRaiders[0]
        if (victim) {
          banMember(victim, 'VDS AutoMod Güvenlik Botu Tarafından Baskıncı Olarak Algılandı')
        }
      }
    }, 3800)

    return () => {
      clearInterval(raidInterval)
      clearInterval(autoModInterval)
    }
  }, [isRaidActive, activeRaiders, isSlowModeActive, members, ownedBots, hasVds, activeBots, banMember])

  // Bot Glitch Infinite Loop Spammer
  useEffect(() => {
    if (!botGlitchActive) return

    const glitchSpamTimer = setInterval(() => {
      const GLITCH_LINES = [
        '🚨 [BOT RUNTIME ERROR]: UnhandledPromiseRejection: Infinite loop in !play audioBuffer stream!',
        '⚠️ [KasaBot FATAL]: Memory leak at address 0xDEADBEEF - recursive !slot dispatch!',
        '💥 [BOT SPAM CORRUPTION]: BUFFER OVERFLOW: 01010101010101010101010101',
        '🚨 [CORE SYSTEM CRASH]: Bot yanıt vermiyor! Terminali açıp "restart_bots" yazarak servisleri yeniden başlatın!'
      ]
      const line = GLITCH_LINES[Math.floor(Math.random() * GLITCH_LINES.length)]
      soundEngine.playDiscordPing()
      const crashMsg: ChatMessage = {
        id: `glitch-${Date.now()}`,
        channelId: 'genel-sohbet',
        author: {
          id: 'glitch-bot',
          username: 'ÇÖKEN BOT [FATAL_ERR]',
          role: 'Moderatör',
          avatarColor: '#e74c3c',
          isOnline: true,
          joinedAt: '01.01.2026'
        },
        content: line,
        timestamp: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
      }
      setMessages((prev) => [...prev.slice(-30), crashMsg])
      setHype((h) => Math.max(10, h - 2))
    }, 2800)

    return () => clearInterval(glitchSpamTimer)
  }, [botGlitchActive])

  // Live Voice Channel Simulation & Eavesdropping Loop (Item C)
  useEffect(() => {
    const voiceSimInterval = setInterval(() => {
      const targetChannel = connectedVoiceChannel || 'ses-1'
      const occupants = voiceUsers.filter((u) => u.channelId === targetChannel && !u.isMuted)
      if (occupants.length === 0) return

      const nonAdminOccupants = occupants.filter((u) => u.member.id !== INITIAL_MEMBERS[1].id)
      if (nonAdminOccupants.length === 0) return
      const speaker = nonAdminOccupants[Math.floor(Math.random() * nonAdminOccupants.length)]

      const roll = Math.random()
      let speechType: VoiceTranscript['type'] = 'normal'
      let speechText = ''

      if (roll < 0.2) {
        speechType = 'earrape'
        const earrapeLines = [
          '🔊💥 (MİKROFONA SON SES ÜFLEME & ÇIĞLIK) LAAAN KULAĞIM SAĞIR OLDU KİM BU!',
          '🎵🔊 (BASS BOOSTED RUS PHONK AÇAR) SUSTURUN ŞU ADAMI YÖNETİM NERDE!',
          '🔊 (KLAVYEYE YUMRUK ATMA SESİ) YETER ARTIK VURAMIYORUM BÖYLE OYUNUN BEN...',
          '🔊📢 (KÖTÜ MİKROFON CIZIRTISI) BEYLEEEEEER SESİM GELİYOR MU ALOOOOOO!'
        ]
        speechText = earrapeLines[Math.floor(Math.random() * earrapeLines.length)]
        soundEngine.playDiscordPing()
      } else if (roll < 0.35) {
        speechType = 'raid_plot'
        const raidLines = [
          '🤫 Kanka kısık sesle dinle, saat 22:30\'da 15 bot sokup genel sohbete link basıcaz adminler uyuyor...',
          '🤫 Nuke botunun gizli tokeni elimde, gece 2\'de kurucu çıkınca sunucuyu patlatıyoruz hazır olun.',
          '🤫 Rakip Alpha sunucusundan elemanlar toplandık, burayı karıştırıp herkesi oraya çekeceğiz.',
          '🤫 Bu modlar da hiç bakmıyor ha, ticket açıp arkadan sunucuyu trolleyelim mi?'
        ]
        speechText = raidLines[Math.floor(Math.random() * raidLines.length)]
      } else if (roll < 0.48) {
        speechType = 'cheat'
        const cheatLines = [
          'Kanka CS2\'de yeni wallhack indirdim, crosshairi duvara tutuyorum adamlar kabak gibi görünüyor kimse çakmıyor xd',
          'Valorant\'ta triggerbot açtım bugün, kafaya gelince kendi sıkıyor rankı İmmortal\'a çıkardım valla.',
          'Geçen gün birine fake link attım Steam envanterini çektim, 500 dolarlık bıçak düştü haha.'
        ]
        speechText = cheatLines[Math.floor(Math.random() * cheatLines.length)]
      } else {
        speechType = 'normal'
        const normalLines = [
          'Beyler B rush yapıyoruz, smoke içi flash atıyorum hemen girin!',
          'Kulaklığın mikrofonu nasıl geliyor beyler, arkadan fan sesi var mı?',
          'Bu akşam turnuvaya sağlam 5v5 kadro kuralım ses 2\'de bekliyorum.',
          'Valorant\'ta son el 1v3 clutch aldım elim ayağım titredi yeminle.',
          'Müzik botuna kim şarkı sıraya koydu harika parça çalıyor.',
          'Çayımı tazeleyip geldim, dereceli sırasına girelim mi?'
        ]
        speechText = normalLines[Math.floor(Math.random() * normalLines.length)]
      }

      setVoiceUsers((prev) =>
        prev.map((v) => (v.member.id === speaker.member.id ? { ...v, isSpeaking: true } : v))
      )

      const transcriptEntry: VoiceTranscript = {
        id: `vt-${Date.now()}`,
        channelId: targetChannel,
        username: speaker.member.username,
        avatarColor: speaker.member.avatarColor,
        avatarUrl: speaker.member.avatarUrl,
        text: speechText,
        time: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
        type: speechType
      }
      setVoiceTranscripts((prev) => [...prev.slice(-20), transcriptEntry])

      setTimeout(() => {
        setVoiceUsers((prev) =>
          prev.map((v) => (v.member.id === speaker.member.id ? { ...v, isSpeaking: false } : v))
        )
      }, 2400)
    }, 4500)

    return () => clearInterval(voiceSimInterval)
  }, [connectedVoiceChannel, voiceUsers])

  const triggerRaid = useCallback((forcedCount?: number) => {
    soundEngine.playDiscordPing()
    const nowTime = new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
    const nextRaidIndex = raidCount + 1
    setRaidCount(nextRaidIndex)

    let botCount = forcedCount
    if (!botCount) {
      const roll = Math.random()
      if (roll < 0.25) {
        botCount = 1
      } else if (roll < 0.6) {
        botCount = Math.floor(2 + Math.random() * 3)
      } else {
        botCount = Math.floor(12 + Math.random() * 9)
      }
    }

    const selectedNames = RAID_BOT_POOL.slice(0, botCount)

    const raiderMembers: ServerMember[] = selectedNames.map((name, idx) => ({
      id: `raider-${Date.now()}-${idx}`,
      username: name,
      avatarColor: ['#ed4245', '#ff73fa', '#da373c', '#eb459e', '#f23f43'][idx % 5],
      role: 'Üye',
      isOnline: true,
      activity: '🚨 Sunucuyu Basıyor (Raid)',
      joinedAt: 'Yeni Katıldı (Baskın)'
    }))

    setMembers((prev) => [...prev, ...raiderMembers])
    setActiveRaiders(selectedNames)
    setTotalRaidBotsCount(selectedNames.length)
    setBannedRaidersCount(0)
    setIsRaidActive(true)

    const joinNotices: ChatMessage[] = selectedNames.map((name, i) => ({
      id: `raid-join-${Date.now()}-${i}`,
      channelId: 'gelen-giden',
      author: {
        id: `bot-join-${i}`,
        username: name,
        avatarColor: '#ed4245',
        role: 'Üye',
        isOnline: true,
        joinedAt: 'Az Önce'
      },
      content: `📥 @${name} sunucuya katıldı.`,
      timestamp: nowTime
    }))
    setMessages((prev) => [...prev, ...joinNotices])

    const regularMembers = members.filter(
      (m) => m.role !== 'Yönetici' && m.role !== 'Kurucu' && !m.username.includes('[BOT]') && !selectedNames.includes(m.username)
    )

    setTimeout(() => {
      const reactions = nextRaidIndex === 1
        ? [
            'noluyo beyler bi anda kaç kişi girdi??',
            'oha chate bak spam basıyorlar modlar koşun!',
            'admin nerdesin uyuma banla şunları!'
          ]
        : nextRaidIndex === 2
        ? [
            'yine mi raid ya şaka mısınız olm',
            'of chati kirlettiler yine mod yok mu!',
            'adminler banhammeri çıkartın saldırı var'
          ]
        : [
            'yine mi başladı ya offf bıktık valla haha',
            'günde 3 kere raid mi olur bi koruma botu alın artık kasadan',
            'sunucu delik deşik oldu resmen modlar yetişemiyor :D'
          ]

      reactions.forEach((txt, idx) => {
        const reactor = regularMembers[idx % regularMembers.length] || createUniqueServerMember(members)

        setTimeout(() => {
          const userMsg: ChatMessage = {
            id: `react-${Date.now()}-${idx}`,
            channelId: 'genel-sohbet',
            author: reactor,
            content: txt,
            timestamp: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
          }
          setMessages((prev) => [...prev, userMsg])
        }, (idx + 1) * 700)
      })
    }, 800)

    addAuditLog('ACİL DURUM: BASKIN (RAID)', `${botCount} Bot Saldırısı`, `Sunucuya ${botCount} saldırgan katıldı! Gelen-giden ve sohbetten tespit edip banlayın.`)
  }, [members, raidCount, addAuditLog])

  return (
    <GameContext.Provider
      value={{
        currentDay,
        ticketsResolvedCount,
        bansIssuedCount,
        isShiftModalOpen,
        setIsShiftModalOpen,
        advanceDay,
        gameHour,
        gameMinute,
        timeString,
        canEndShift,
        isDayTransitioning,
        transitionOldDay,
        transitionNewDay,
        sleepClockHour,
        sleepClockMinute,
        wakeUp,
        isStamInstalled,
        installStamClient,
        installedApps,
        installApp,
        tutorialStep,
        setTutorialStep,
        iscordAccount,
        registerIscordAccount,
        hasVds,
        vdsIp,
        vdsAccessCode,
        isVdsConnected,
        rentVds,
        connectToVds,
        disconnectVds,
        vdsInstalledApps,
        installVdsApp,
        activeBots,
        toggleBotActive,
        osNotifications,
        dismissNotification,
        pushNotification,
        coffeeCooldown,
        catCooldown,
        petCat,
        isSlowModeActive,
        toggleSlowMode,
        isRaidActive,
        triggerRaid,
        activeRaiders,
        totalRaidBotsCount,
        bannedRaidersCount,
        botRules,
        updateBotRules,
        hype,
        sanity,
        personalCash,
        serverFunds,
        setSanity,
        setHype,
        drinkCoffee,
        members,
        banMember,
        muteMember,
        changeMemberRole,
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
        auditLogs,
        ownedEquipment,
        equipmentCart,
        addToEquipmentCart,
        removeFromEquipmentCart,
        clearEquipmentCart,
        checkoutEquipmentCart,
        ownedBots,
        buyEquipment,
        buyBot,
        adjustPersonalCash,
        bankTransactions,
        activeLoan,
        creditScore,
        addBankTransaction,
        transferToPersonal,
        transferToServer,
        takeBankLoan,
        repayBankLoan,
        modCoinBalance,
        modCoinPrice,
        buyModCoin,
        sellModCoin,
        termDeposit,
        openTermDeposit,
        withdrawTermDeposit,
        dmConversations,
        sendDmMessage,
        openUserDm,
        serverLevel,
        upgradeServerLevel,
        botGlitchActive,
        restartBots,
        nukeAllRaiders,
        ownedGames,
        buyGame,
        launchAdCampaign,
        pendingAdMembers,
        achievements,
        recentAchievement,
        dismissAchievementToast,
        unlockAchievement,
        wallpaper,
        setWallpaper,
        coffeeDrankCount
      }}
    >
      {children}
    </GameContext.Provider>
  )
}

export const useGame = () => {
  const context = useContext(GameContext)
  if (!context) throw new Error('useGame must be used within GameProvider')
  return context
}
