import { USER_NICKNAMES_POOL } from './userNicknames'
import { USER_AVATARS_POOL } from './userAvatars'
import type { ServerMember } from '../context/GameContext'

export interface PersonalityProfile {
  type: string
  badge: string
  chatStyle: 'funny' | 'competitive' | 'strict' | 'chill' | 'veteran' | 'night' | 'tech' | 'toxic' | 'novice'
  patience: number // 1 to 10
  attitudeToMods: 'friendly' | 'neutral' | 'rebellious' | 'paranoid'
  defaultBios: string[]
  activities: string[]
}

export const PERSONALITY_PROFILES: Record<string, PersonalityProfile> = {
  competitive: {
    type: 'Rekabetçi Gamer',
    badge: '⚔️ Rekabetçi Gamer',
    chatStyle: 'competitive',
    patience: 3,
    attitudeToMods: 'neutral',
    defaultBios: [
      'CS2 5v5 rekabetçi lobi arıyorum, mikrofon şart rank min Master.',
      'Valorant son yamadan sonra ajan dengeleri çöp oldu ama kasmaya devam.',
      'Aim yerinde, takım çöp. 1v5 clutch atmaktan belim ağrıdı.',
      'Turnuva ekibi kuruyoruz +1 sağlam duelist lazım.'
    ],
    activities: [
      'CS2 • Rekabetçi (14-12)',
      'Valorant • Dereceli (Ascendant 2)',
      'Apex Legends • Ranked Trio',
      'Deadlock • Maçta'
    ]
  },
  funny: {
    type: 'Mizahşör & Troll',
    badge: '🎭 Mizahşör & Troll',
    chatStyle: 'funny',
    patience: 6,
    attitudeToMods: 'rebellious',
    defaultBios: [
      'Lag olmasa hepinizi vurmuştum da Türk Telekom izin vermiyor.',
      'Karpuz kabuğundan mousepad yaptım sorusu olan?',
      'Modlar yine mesaide, ban hammerları bilemişler haha.',
      'Bedava Nitro linki atmayın yemiyorum artık fakirim ama gururluyum.'
    ],
    activities: [
      'Tost Makinesinde FPS Kasıyor',
      'YouTube • Komik CS2 Anları',
      'Chate Troll Caps Atıyor',
      'Alt+F4 Çekti'
    ]
  },
  strict: {
    type: 'Kuralcı & Hassas',
    badge: '🛡️ Kuralcı & Hassas',
    chatStyle: 'strict',
    patience: 2,
    attitudeToMods: 'friendly',
    defaultBios: [
      'Kural 1: Saygı. Kural ihlali yapanı anında ticketla raporlarım.',
      'Sunucu düzenini bozan troller derhal uzaklaştırılmalı.',
      'Özelden gereksiz etiket atmayın lütfen, log tutuyorum.',
      'Yetkili ekibine teşekkürler, sunucu temiz kalmalı.'
    ],
    activities: [
      'Kuralları İnceliyor',
      'Ticket Durumunu Bekliyor',
      'Log Takibi Yapıyor',
      'Genel Sohbeti Gözetliyor'
    ]
  },
  chill: {
    type: 'Sakin Topluluk Üyesi',
    badge: '☕ Sakin Üye',
    chatStyle: 'chill',
    patience: 9,
    attitudeToMods: 'friendly',
    defaultBios: [
      'Bir kahve, bir müzik, bir de güzel sohbet.',
      'Herkese iyi oyunlar, kalp kırmaya gerek yok.',
      'Akşamları seslide chill takılan tayfadayım.',
      'Spotify listesi için DM gelebilirsiniz, müziksiz hayat olmaz.'
    ],
    activities: [
      'Spotify • Lofi Beats & Chill',
      'Kahve Molasında',
      'Sohbet Odası #1 • Muhabbet',
      'Minecraft • Sakin Maden'
    ]
  },
  veteran: {
    type: 'Eski Kurt (Sunucu Kıdemlisi)',
    badge: '👑 Eski Kurt',
    chatStyle: 'veteran',
    patience: 7,
    attitudeToMods: 'neutral',
    defaultBios: [
      'Sunucu ilk açıldığında biz vardık, ortam eskiden daha samimiydi.',
      'Kurucu Efe ile eski sesli sohbet anıları...',
      'Eski moderatörlerin gözü yaşlı, şimdiki gençler hızlı.',
      'VIP Balina rolümüzü zamanında hak ederek aldık.'
    ],
    activities: [
      'Sunucu Anılarını Hatırlıyor',
      'Eski Klipleri İzliyor',
      'Kıdemli Üyelerle Muhabbet',
      'Çay Yudumluyor'
    ]
  },
  night: {
    type: 'Gece Kuşu',
    badge: '🌙 Gece Kuşu',
    chatStyle: 'night',
    patience: 8,
    attitudeToMods: 'neutral',
    defaultBios: [
      'Gece 3’te chate akan tayfaya selam olsun.',
      'Güneş doğana kadar PC başındayız, uyku düzeni iflas.',
      'Gece vardiyası moderatörlerine kolay gelsin.',
      'Karanlık tema ve Synthwave olmadan yaşayamam.'
    ],
    activities: [
      'Gece Vardiyasında',
      'Synthwave Radyosu Dinliyor',
      'Gece 03:00 Dereceli Maç',
      'Karanlıkta Kod Yazıyor'
    ]
  },
  tech: {
    type: 'Teknoloji & Donanımcı',
    badge: '💻 Teknoloji Meraklısı',
    chatStyle: 'tech',
    patience: 8,
    attitudeToMods: 'neutral',
    defaultBios: [
      'RTX 4070 mi RX 7800 XT mi? Bence VRAM her şeydir.',
      'Mekanik klavyede lubed switch farkını bilmeyenle tartışmam.',
      'Linux dağıtımı kurmaktan oyun oynamaya vakit kalmadı.',
      'Donanım tavsiyesi lazım olan DM atabilir.'
    ],
    activities: [
      'VS Code • TypeScript Projesi',
      'Cinebench Testi Yapıyor',
      'Termal Macun Değiştiriyor',
      'Klavye Switchlerini Yağlıyor'
    ]
  }
}

const AVATAR_COLORS = [
  '#5865F2', '#57F287', '#FEE75C', '#EB459E', '#ED4245',
  '#3ba55d', '#faa81a', '#e67e22', '#2ecc71', '#9b59b6',
  '#3498db', '#e74c3c', '#1abc9c', '#f1c40f', '#00b894',
  '#6c5ce7', '#d63031', '#fdcb6e', '#0984e3', '#e84393'
]

// Pick an unused nickname from USER_NICKNAMES_POOL
export function getUniqueUserNickname(existingMembers: { username: string }[]): string {
  const usedSet = new Set(existingMembers.map((m) => m.username.toLowerCase()))
  const available = USER_NICKNAMES_POOL.filter((name) => !usedSet.has(name.toLowerCase()))

  if (available.length > 0) {
    const randomIndex = Math.floor(Math.random() * available.length)
    return available[randomIndex]
  }

  // Fallback if pool is exhausted: pick from pool with subtle random numeral suffix
  const baseName = USER_NICKNAMES_POOL[Math.floor(Math.random() * USER_NICKNAMES_POOL.length)] || 'Gamer'
  const suffix = Math.floor(10 + Math.random() * 90)
  return `${baseName}_${suffix}`
}

// Pick an unused avatar from USER_AVATARS_POOL
export function getUniqueUserAvatar(existingMembers: { avatarUrl?: string }[]): string {
  const usedSet = new Set(existingMembers.map((m) => m.avatarUrl).filter(Boolean))
  const available = USER_AVATARS_POOL.filter((av) => !usedSet.has(av))

  if (available.length > 0) {
    const randomIndex = Math.floor(Math.random() * available.length)
    return available[randomIndex]
  }

  // Fallback if pool is exhausted: cycle through pool
  return USER_AVATARS_POOL[Math.floor(Math.random() * USER_AVATARS_POOL.length)]
}

// Create a rich, authentic ServerMember with guaranteed unique nickname and avatar
export function createUniqueServerMember(
  existingMembers: ServerMember[],
  forcedRole?: ServerMember['role']
): ServerMember {
  const username = getUniqueUserNickname(existingMembers)
  const avatarUrl = getUniqueUserAvatar(existingMembers)
  const avatarColor = AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)]

  const personalityKeys = Object.keys(PERSONALITY_PROFILES)
  const chosenKey = personalityKeys[Math.floor(Math.random() * personalityKeys.length)]
  const profile = PERSONALITY_PROFILES[chosenKey]

  const bio = profile.defaultBios[Math.floor(Math.random() * profile.defaultBios.length)]
  const activity = profile.activities[Math.floor(Math.random() * profile.activities.length)]
  const reputation = Math.floor(65 + Math.random() * 32) // 65% to 97% reputation

  const defaultRole: ServerMember['role'] = forcedRole || (Math.random() < 0.12 ? 'Kıdemli Üye' : 'Üye')

  const now = new Date()
  const daysAgo = Math.floor(1 + Math.random() * 60)
  const joinedDate = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000).toLocaleDateString('tr-TR')

  return {
    id: `m-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    username,
    avatarUrl,
    avatarColor,
    role: defaultRole,
    isOnline: true,
    activity,
    bio,
    personality: profile.badge,
    reputation,
    patience: profile.patience,
    joinedAt: joinedDate
  }
}
