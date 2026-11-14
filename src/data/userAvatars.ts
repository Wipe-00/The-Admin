// ============================================================================
// THE ADMIN - KULLANICI 1:1 PROFİL AVATARLARI HAVUZU
// ============================================================================
// Bu dosya, sunucudaki üyelerin 1:1 yuvarlak profil fotoğraflarını içerir.
// Her avatar 1:1 kare SVG data URI veya doğrudan görsel linki (URL) olabilir.
//
// 💡 İleride istediğiniz yeni avatar görsellerini (https://resim-linki.png veya
// data:image/svg+xml;utf8,<svg...>) bu listeye doğrudan ekleyebilirsiniz!
// Sistem, sunucudaki her kullanıcıya benzersiz bir avatar atar. Eğer havuza ekli
// avatar sayısı tükenirse ancak o zaman tekrar başa döner.
// ============================================================================

const createSvgAvatar = (bg1: string, bg2: string, innerSvg: string): string => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
    <defs>
      <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${bg1}" />
        <stop offset="100%" stop-color="${bg2}" />
      </linearGradient>
    </defs>
    <rect width="100" height="100" rx="50" fill="url(#g)" />
    ${innerSvg}
  </svg>`
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`
}

export const USER_AVATARS_POOL: string[] = [
  // 1. Cyber Headset Gamer
  createSvgAvatar('#1e1b4b', '#4338ca', `
    <circle cx="50" cy="46" r="20" fill="#c7d2fe"/>
    <path d="M22 46 C22 28, 78 28, 78 46" stroke="#818cf8" stroke-width="6" fill="none" stroke-linecap="round"/>
    <rect x="20" y="38" width="8" height="18" rx="4" fill="#6366f1"/>
    <rect x="72" y="38" width="8" height="18" rx="4" fill="#6366f1"/>
    <circle cx="43" cy="46" r="3" fill="#1e1b4b"/>
    <circle cx="57" cy="46" r="3" fill="#1e1b4b"/>
    <path d="M46 54 Q50 58 54 54" stroke="#1e1b4b" stroke-width="2" fill="none" stroke-linecap="round"/>
    <path d="M72 50 Q66 68 52 68" stroke="#312e81" stroke-width="3" fill="none" stroke-linecap="round"/>
    <circle cx="50" cy="68" r="4" fill="#f43f5e"/>
  `),

  // 2. Cool Neon Cat
  createSvgAvatar('#09090b', '#27272a', `
    <polygon points="30,22 42,42 22,40" fill="#a855f7"/>
    <polygon points="70,22 78,40 58,42" fill="#a855f7"/>
    <circle cx="50" cy="52" r="26" fill="#18181b"/>
    <polygon points="32,26 40,38 27,37" fill="#f472b6"/>
    <polygon points="68,26 73,37 60,38" fill="#f472b6"/>
    <circle cx="41" cy="50" r="5" fill="#a855f7"/>
    <circle cx="59" cy="50" r="5" fill="#a855f7"/>
    <circle cx="42" cy="49" r="1.5" fill="#ffffff"/>
    <circle cx="60" cy="49" r="1.5" fill="#ffffff"/>
    <polygon points="50,56 46,60 54,60" fill="#f472b6"/>
    <path d="M30 56 L15 54 M30 60 L14 62 M70 56 L85 54 M70 60 L86 62" stroke="#a855f7" stroke-width="2" stroke-linecap="round"/>
  `),

  // 3. Cyberpunk Samurai / Oni Mask
  createSvgAvatar('#450a0a', '#991b1b', `
    <polygon points="50,15 80,45 68,85 32,85 20,45" fill="#1c1917"/>
    <circle cx="38" cy="46" r="6" fill="#ef4444"/>
    <circle cx="62" cy="46" r="6" fill="#ef4444"/>
    <circle cx="38" cy="46" r="2" fill="#ffffff"/>
    <circle cx="62" cy="46" r="2" fill="#ffffff"/>
    <path d="M34 68 L42 60 L50 68 L58 60 L66 68" stroke="#f87171" stroke-width="3" fill="none" stroke-linejoin="round"/>
    <polygon points="50,22 44,38 56,38" fill="#f59e0b"/>
  `),

  // 4. Retro Arcade Joystick
  createSvgAvatar('#14532d', '#15803d', `
    <rect x="25" y="45" width="50" height="35" rx="8" fill="#18181b"/>
    <circle cx="40" cy="42" r="9" fill="#ef4444"/>
    <path d="M40 42 L40 55" stroke="#71717a" stroke-width="4" stroke-linecap="round"/>
    <circle cx="62" cy="58" r="4" fill="#3b82f6"/>
    <circle cx="68" cy="66" r="4" fill="#eab308"/>
    <rect x="30" y="66" width="14" height="4" rx="2" fill="#22c55e"/>
  `),

  // 5. Crowned VIP Gold Whale / Balina
  createSvgAvatar('#78350f', '#d97706', `
    <ellipse cx="48" cy="55" rx="28" ry="18" fill="#fef08a"/>
    <circle cx="34" cy="50" r="3.5" fill="#1c1917"/>
    <path d="M32 58 Q40 64 48 58" stroke="#1c1917" stroke-width="2" fill="none" stroke-linecap="round"/>
    <path d="M72 50 Q86 42 82 58 Q86 72 72 62 Z" fill="#fde047"/>
    <path d="M32 34 L38 24 L48 30 L58 24 L64 34 Z" fill="#fbbf24" stroke="#b45309" stroke-width="2"/>
    <circle cx="48" cy="30" r="2" fill="#ef4444"/>
  `),

  // 6. Cyber Hacker in Hoodie
  createSvgAvatar('#052e16', '#14532d', `
    <path d="M25 78 C25 40 32 25 50 25 C68 25 75 40 75 78 Z" fill="#0f172a"/>
    <ellipse cx="50" cy="52" rx="16" ry="18" fill="#020617"/>
    <rect x="38" y="48" width="10" height="4" rx="2" fill="#22c55e"/>
    <rect x="52" y="48" width="10" height="4" rx="2" fill="#22c55e"/>
    <path d="M44 60 L56 60" stroke="#16a34a" stroke-width="2" stroke-linecap="round"/>
  `),

  // 7. Vaporwave Sunset & Palm
  createSvgAvatar('#3b0764', '#c026d3', `
    <circle cx="50" cy="52" r="24" fill="#fbbf24"/>
    <path d="M26 52 H74 M28 58 H72 M34 64 H66 M40 70 H60" stroke="#3b0764" stroke-width="2.5"/>
    <path d="M68 76 Q64 54 56 46 Q52 42 46 42 Q50 38 60 42 Q68 46 72 76 Z" fill="#0f172a"/>
    <path d="M56 46 Q46 40 38 46 Q48 48 54 49 Z" fill="#0f172a"/>
  `),

  // 8. Cybernetic Blue Visor Soldier
  createSvgAvatar('#082f49', '#0284c7', `
    <ellipse cx="50" cy="50" rx="25" ry="28" fill="#1e293b"/>
    <path d="M25 46 Q50 38 75 46 L73 58 Q50 50 27 58 Z" fill="#38bdf8"/>
    <ellipse cx="50" cy="51" rx="18" ry="4" fill="#ffffff" opacity="0.4"/>
    <rect x="42" y="66" width="16" height="3" rx="1.5" fill="#64748b"/>
  `),

  // 9. Retro Pixel Red Heart
  createSvgAvatar('#4c0519', '#e11d48', `
    <rect x="35" y="30" width="12" height="12" fill="#ffffff"/>
    <rect x="53" y="30" width="12" height="12" fill="#ffffff"/>
    <rect x="29" y="36" width="42" height="16" fill="#ffffff"/>
    <rect x="35" y="52" width="30" height="10" fill="#ffffff"/>
    <rect x="41" y="62" width="18" height="8" fill="#ffffff"/>
    <rect x="47" y="70" width="6" height="6" fill="#ffffff"/>
    <rect x="38" y="36" width="4" height="4" fill="#fda4af"/>
  `),

  // 10. Space Galaxy Astronaut
  createSvgAvatar('#111827', '#1f2937', `
    <circle cx="50" cy="50" r="28" fill="#e2e8f0"/>
    <ellipse cx="50" cy="48" rx="18" ry="14" fill="#0f172a"/>
    <path d="M36 44 Q50 38 64 44" stroke="#f59e0b" stroke-width="3" fill="none" stroke-linecap="round"/>
    <circle cx="60" cy="44" r="2" fill="#ffffff"/>
    <rect x="42" y="74" width="16" height="6" rx="2" fill="#94a3b8"/>
  `),

  // 11. Fiery Dragon Crest
  createSvgAvatar('#7c2d12', '#ea580c', `
    <path d="M30 70 Q45 20 65 30 Q55 45 70 50 Q55 60 50 80 Q40 65 30 70 Z" fill="#fef08a"/>
    <circle cx="50" cy="38" r="3" fill="#b91c1c"/>
    <path d="M36 60 Q26 65 20 60 Q24 72 36 68 Z" fill="#fdba74"/>
  `),

  // 12. Toxic Biohazard Gamer
  createSvgAvatar('#14532d', '#84cc16', `
    <circle cx="50" cy="50" r="10" fill="#0f172a"/>
    <circle cx="50" cy="50" r="6" fill="#a3e635"/>
    <path d="M50 34 A14 14 0 0 1 62 44 L56 46 A8 8 0 0 0 50 42 Z" fill="#0f172a"/>
    <path d="M38 56 A14 14 0 0 1 42 42 L46 46 A8 8 0 0 0 44 54 Z" fill="#0f172a"/>
    <path d="M62 56 A14 14 0 0 1 48 64 L50 58 A8 8 0 0 0 56 54 Z" fill="#0f172a"/>
  `),

  // 13. Cozy Coffee Bean & Steam
  createSvgAvatar('#3e2723', '#6d4c41', `
    <rect x="30" y="45" width="40" height="30" rx="8" fill="#d7ccc8"/>
    <path d="M70 50 Q82 50 82 60 Q82 70 70 70" stroke="#d7ccc8" stroke-width="4" fill="none" stroke-linecap="round"/>
    <path d="M38 36 Q42 26 38 20 M50 36 Q54 26 50 20 M62 36 Q66 26 62 20" stroke="#ffccbc" stroke-width="3" fill="none" stroke-linecap="round"/>
  `),

  // 14. Neon Cyan Controller
  createSvgAvatar('#042f2e', '#0d9488', `
    <rect x="22" y="36" width="56" height="34" rx="14" fill="#134e4a"/>
    <circle cx="34" cy="50" r="4" fill="#2dd4bf"/>
    <path d="M30 50 H38 M34 46 V54" stroke="#115e59" stroke-width="2"/>
    <circle cx="60" cy="46" r="3" fill="#f43f5e"/>
    <circle cx="66" cy="52" r="3" fill="#eab308"/>
    <circle cx="54" cy="52" r="3" fill="#3b82f6"/>
    <circle cx="60" cy="58" r="3" fill="#22c55e"/>
  `),

  // 15. Glitch Dark Skull
  createSvgAvatar('#09090b', '#18181b', `
    <path d="M30 45 C30 30 70 30 70 45 C70 56 64 62 60 64 L60 74 L40 74 L40 64 C36 62 30 56 30 45 Z" fill="#e4e4e7"/>
    <circle cx="42" cy="48" r="5" fill="#09090b"/>
    <circle cx="58" cy="48" r="5" fill="#09090b"/>
    <path d="M44 68 L44 74 M50 68 L50 74 M56 68 L56 74" stroke="#09090b" stroke-width="2"/>
    <line x1="20" y1="42" x2="80" y2="42" stroke="#06b6d4" stroke-width="2" opacity="0.6"/>
    <line x1="16" y1="52" x2="84" y2="52" stroke="#f43f5e" stroke-width="2" opacity="0.6"/>
  `),

  // 16. Purple Magic Crystal Orb
  createSvgAvatar('#2e1065', '#581c87', `
    <polygon points="50,18 72,40 64,74 36,74 28,40" fill="#c084fc"/>
    <polygon points="50,18 64,40 50,74 36,40" fill="#e9d5ff"/>
    <circle cx="48" cy="36" r="3" fill="#ffffff"/>
  `),

  // 17. Electric Lightning Bolt
  createSvgAvatar('#1c1917', '#44403c', `
    <polygon points="56,15 28,48 48,48 40,85 72,44 52,44" fill="#facc15" stroke="#ca8a04" stroke-width="2"/>
  `),

  // 18. Cute Shiba Inu Doge
  createSvgAvatar('#451a03', '#9a3412', `
    <circle cx="50" cy="52" r="26" fill="#fb923c"/>
    <polygon points="26,30 38,42 24,44" fill="#ea580c"/>
    <polygon points="74,30 76,44 62,42" fill="#ea580c"/>
    <ellipse cx="50" cy="60" rx="14" ry="10" fill="#fed7aa"/>
    <circle cx="40" cy="50" r="3.5" fill="#1c1917"/>
    <circle cx="60" cy="50" r="3.5" fill="#1c1917"/>
    <ellipse cx="50" cy="57" rx="3.5" ry="2.5" fill="#1c1917"/>
  `),

  // 19. Ghost Pac-Man Retro
  createSvgAvatar('#1e1b4b', '#312e81', `
    <path d="M28 72 L28 45 C28 32 72 32 72 45 L72 72 L62 64 L52 72 L42 64 L32 72 Z" fill="#38bdf8"/>
    <circle cx="42" cy="46" r="6" fill="#ffffff"/>
    <circle cx="58" cy="46" r="6" fill="#ffffff"/>
    <circle cx="44" cy="46" r="3" fill="#1e3a8a"/>
    <circle cx="60" cy="46" r="3" fill="#1e3a8a"/>
  `),

  // 20. Golden Laurel Crown / Winner
  createSvgAvatar('#713f12', '#a16207', `
    <circle cx="50" cy="50" r="24" fill="#fef08a"/>
    <polygon points="50,30 54,42 66,42 56,50 60,62 50,54 40,62 44,50 34,42 46,42" fill="#eab308"/>
    <circle cx="50" cy="50" r="4" fill="#ffffff"/>
  `),

  // 21. Emerald Matrix Code
  createSvgAvatar('#022c22', '#064e3b', `
    <text x="50" y="58" font-family="monospace" font-size="34" font-weight="900" text-anchor="middle" fill="#34d399">#_</text>
    <circle cx="28" cy="30" r="2" fill="#10b981"/>
    <circle cx="70" cy="35" r="2" fill="#10b981"/>
    <circle cx="34" cy="70" r="2" fill="#10b981"/>
    <circle cx="65" cy="68" r="2" fill="#10b981"/>
  `),

  // 22. Sound Wave Audio Equalizer
  createSvgAvatar('#18181b', '#27272a', `
    <rect x="24" y="42" width="6" height="16" rx="3" fill="#ec4899"/>
    <rect x="34" y="32" width="6" height="36" rx="3" fill="#d946ef"/>
    <rect x="44" y="22" width="6" height="56" rx="3" fill="#a855f7"/>
    <rect x="54" y="36" width="6" height="28" rx="3" fill="#8b5cf6"/>
    <rect x="64" y="28" width="6" height="44" rx="3" fill="#6366f1"/>
    <rect x="74" y="44" width="6" height="12" rx="3" fill="#3b82f6"/>
  `),

  // 23. Violet Lotus Flower
  createSvgAvatar('#3b0764', '#701a75', `
    <path d="M50 24 C40 40 40 60 50 74 C60 60 60 40 50 24 Z" fill="#f472b6"/>
    <path d="M50 36 C34 46 30 64 46 72 C42 56 46 44 50 36 Z" fill="#ec4899"/>
    <path d="M50 36 C66 46 70 64 54 72 C58 56 54 44 50 36 Z" fill="#ec4899"/>
    <circle cx="50" cy="64" r="5" fill="#fde047"/>
  `),

  // 24. Cyber Shuriken / Ninja Star
  createSvgAvatar('#111827', '#374151', `
    <path d="M50 18 L55 42 L78 40 L58 55 L70 76 L50 62 L30 76 L42 55 L22 40 L45 42 Z" fill="#94a3b8" stroke="#38bdf8" stroke-width="2"/>
    <circle cx="50" cy="50" r="5" fill="#0f172a"/>
  `),

  // 25. Golden Trophy Champion
  createSvgAvatar('#422006', '#854d0e', `
    <path d="M34 28 H66 V44 C66 54 58 60 50 60 C42 60 34 54 34 44 Z" fill="#facc15"/>
    <path d="M34 32 H24 C24 42 34 44 34 44 M66 32 H76 C76 42 66 44 66 44" stroke="#eab308" stroke-width="3" fill="none" stroke-linecap="round"/>
    <rect x="46" y="60" width="8" height="12" fill="#ca8a04"/>
    <rect x="36" y="72" width="28" height="6" rx="2" fill="#a16207"/>
  `)
]
