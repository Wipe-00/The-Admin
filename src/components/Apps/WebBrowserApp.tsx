import React, { useState, useRef } from 'react'
import { 
  ArrowLeft, 
  ArrowRight, 
  RotateCw, 
  Home, 
  Lock, 
  Plus, 
  X, 
  Search, 
  ShoppingBag, 
  Tv, 
  Coins, 
  Bot, 
  MessageSquareText, 
  TrendingUp, 
  Play, 
  Pause,
  Volume2, 
  Check,
  Gamepad2,
  Megaphone,
  Sparkles,
  Monitor,
  Keyboard,
  Headphones,
  Coffee,
  Wifi,
  Layers,
  Skull,
  Terminal,
  AlertTriangle,
  ShoppingCart,
  Trash2,
  Server,
  Star
} from 'lucide-react'
import { useGame } from '../../context/GameContext'
import { soundEngine } from '../../utils/soundEngine'

interface BrowserTab {
  id: string
  title: string
  url: string
  favicon: 'search' | 'video' | 'shop' | 'casino' | 'forum' | 'bot' | 'bank' | 'game' | 'ad'
}

interface WebBrowserAppProps {
  initialUrl?: string
}

export const WebBrowserApp: React.FC<WebBrowserAppProps> = ({ initialUrl }) => {
  const {
    personalCash,
    serverFunds,
    ownedEquipment,
    equipmentCart,
    addToEquipmentCart,
    removeFromEquipmentCart,
    checkoutEquipmentCart,
    ownedBots,
    activeBots,
    hasVds,
    vdsIp,
    vdsAccessCode,
    rentVds,
    adjustPersonalCash,
    launchAdCampaign,
    isStamInstalled,
    installStamClient,
    setHype,
    setSanity,
    addBankTransaction
  } = useGame()

  const [isDownloadingStam, setIsDownloadingStam] = useState(false)
  const [downloadProgress, setDownloadProgress] = useState(0)
  const [stamNotice, setStamNotice] = useState<string | null>(null)
  const [darkWebFeedback, setDarkWebFeedback] = useState<string | null>(null)
  const [shopFeedback, setShopFeedback] = useState<string | null>(null)
  const [vdsFeedback, setVdsFeedback] = useState<string | null>(null)

  // DarkWeb Underground Operations State
  const [isAttackingRival, setIsAttackingRival] = useState(false)
  const [rivalAttackLogs, setRivalAttackLogs] = useState<string[]>([])
  const [efeLeaksPurchased, setEfeLeaksPurchased] = useState(false)
  const [efeLeaksDecision, setEfeLeaksDecision] = useState<'blackmail' | 'archive' | null>(null)

  const defaultStartUrl = initialUrl || 'https://modgle.com'
  const defaultTitle = initialUrl?.includes('donanimsepeti') ? 'DonanımSepeti' : 'Modgle Arama Motoru'
  const defaultFavicon: BrowserTab['favicon'] = initialUrl?.includes('donanimsepeti') ? 'shop' : 'search'

  const [tabs, setTabs] = useState<BrowserTab[]>([
    { id: 'tab-1', title: defaultTitle, url: defaultStartUrl, favicon: defaultFavicon },
    { id: 'tab-2', title: 'YouVids - Canlı Yayın & Klipler', url: 'https://youvids.tv', favicon: 'video' }
  ])
  const [activeTabId, setActiveTabId] = useState<string>('tab-1')
  const [urlInput, setUrlInput] = useState<string>(defaultStartUrl)

  // Search input on Modgle homepage
  const [searchQuery, setSearchQuery] = useState('')

  // Video player state
  const [activeVideoId, setActiveVideoId] = useState('v1')
  const [isPlaying, setIsPlaying] = useState(true)

  // Casino State (Vegas 777)
  const [casinoView, setCasinoView] = useState<'lobby' | 'slots' | 'blackjack' | 'roulette'>('lobby')

  // Slot machine state with individual reel animation
  const [slotReels, setSlotReels] = useState<string[]>(['🍒', '🍋', '7️⃣'])
  const [reelSpinning, setReelSpinning] = useState<[boolean, boolean, boolean]>([false, false, false])
  const [slotBet, setSlotBet] = useState(25)
  const [slotResultMsg, setSlotResultMsg] = useState('Kollu makineyi çevir, 3 aynı sembolü yakala!')
  const [isSpinning, setIsSpinning] = useState(false)
  const [slotWinGlow, setSlotWinGlow] = useState(false)
  const slotTimerRef = useRef<any>(null)

  // Roulette (Rulet) State with real wheel rotation & full table betting
  const [rouletteWinningNum, setRouletteWinningNum] = useState<number | null>(null)
  const [isRouletteSpinning, setIsRouletteSpinning] = useState(false)
  const [wheelRotation, setWheelRotation] = useState(0)
  const [rouletteHistory, setRouletteHistory] = useState<number[]>([17, 0, 24, 9, 32, 11, 26, 7, 20, 3])
  const [rouletteMsg, setRouletteMsg] = useState('Bahis masasına çiplerini yerleştir ve Rulet Çarkını çevir!')
  const [tableBets, setTableBets] = useState<Record<string, number>>({})
  const [selectedChip, setSelectedChip] = useState<number>(50)
  const [rouletteStats, setRouletteStats] = useState({ totalSpins: 10, totalWon: 0, wins: 4, losses: 6 })

  // Donanım Sepeti (Shop) state
  const [shopCategory, setShopCategory] = useState<'all' | 'display' | 'peripherals' | 'audio' | 'comfort' | 'network'>('all')
  const [shopSearch, setShopSearch] = useState('')

  // Ad Campaign state (ModAds)
  const [adTier, setAdTier] = useState<'small' | 'medium' | 'mega'>('medium')
  const [adSource, setAdSource] = useState<'personal' | 'server'>('server')
  const [adFeedback, setAdFeedback] = useState<string | null>(null)

  // Crypto / Bank state
  const [cryptoAmount, setCryptoAmount] = useState(0.25)
  const [cryptoPrice] = useState(4250)
  const [cryptoFeedback, setCryptoFeedback] = useState('')

  // Blackjack State with suits & animated dealing
  interface PlayingCard {
    value: number
    label: string
    suit: '♠' | '♥' | '♦' | '♣'
  }
  const [bjBet, setBjBet] = useState(50)
  const [bjPlayerCards, setBjPlayerCards] = useState<PlayingCard[]>([
    { value: 10, label: 'K', suit: '♠' },
    { value: 8, label: '8', suit: '♥' }
  ])
  const [bjDealerCards, setBjDealerCards] = useState<PlayingCard[]>([
    { value: 7, label: '7', suit: '♦' }
  ])
  const [bjStatus, setBjStatus] = useState<'idle' | 'playing' | 'dealing' | 'won' | 'lost' | 'push'>('idle')
  const [bjMessage, setBjMessage] = useState('Bahis miktarını seç ve Kartları Dağıt butonuna bas.')
  const [bjStats, setBjStats] = useState({ won: 3, lost: 2, push: 1 })

  const activeTab = tabs.find((t) => t.id === activeTabId) || tabs[0]

  const navigateTo = (url: string, title?: string, favicon?: BrowserTab['favicon']) => {
    setUrlInput(url)
    setTabs((prev) =>
      prev.map((t) =>
        t.id === activeTabId
          ? {
              ...t,
              url,
              title: title || url.replace('https://', ''),
              favicon: favicon || t.favicon
            }
          : t
      )
    )
  }

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    let target = urlInput.trim()
    if (!target) return
    if (target.toLowerCase().includes('darkweb')) {
      navigateTo('https://darkweb.onion', 'DarkWeb .onion Engine', 'search')
      return
    }
    if (!target.startsWith('http://') && !target.startsWith('https://')) {
      target = `https://${target}`
    }
    navigateTo(target)
  }

  const openNewTab = (url = 'https://modgle.com', title = 'Yeni Sekme', favicon: BrowserTab['favicon'] = 'search') => {
    const newId = `tab-${Date.now()}`
    const newTab: BrowserTab = { id: newId, title, url, favicon }
    setTabs([...tabs, newTab])
    setActiveTabId(newId)
    setUrlInput(url)
  }

  const closeTab = (e: React.MouseEvent, id: string) => {
    e.stopPropagation()
    if (tabs.length === 1) return
    const remaining = tabs.filter((t) => t.id !== id)
    setTabs(remaining)
    if (activeTabId === id) {
      setActiveTabId(remaining[0].id)
      setUrlInput(remaining[0].url)
    }
  }

  // Spin Slot Machine with Sequential Reel Stopping Animation
  const spinSlotMachine = () => {
    if (personalCash < slotBet || isSpinning) return
    adjustPersonalCash(-slotBet)
    setIsSpinning(true)
    setSlotWinGlow(false)
    setReelSpinning([true, true, true])
    setSlotResultMsg('🎰 Makaralar dönüyor... Şansın bol olsun!')

    const symbols = ['🍒', '🍋', '🍇', '🔔', '⭐', '7️⃣']
    const r1 = symbols[Math.floor(Math.random() * symbols.length)]
    const r2 = symbols[Math.floor(Math.random() * symbols.length)]
    const r3 = symbols[Math.floor(Math.random() * symbols.length)]

    let ticks = 0
    if (slotTimerRef.current) clearInterval(slotTimerRef.current)

    slotTimerRef.current = setInterval(() => {
      ticks++
      soundEngine.playKeyClick()

      setSlotReels(() => [
        ticks < 10 ? symbols[Math.floor(Math.random() * symbols.length)] : r1,
        ticks < 16 ? symbols[Math.floor(Math.random() * symbols.length)] : r2,
        ticks < 22 ? symbols[Math.floor(Math.random() * symbols.length)] : r3
      ])

      if (ticks === 10) {
        setReelSpinning([false, true, true])
      } else if (ticks === 16) {
        setReelSpinning([false, false, true])
      } else if (ticks >= 22) {
        clearInterval(slotTimerRef.current)
        setReelSpinning([false, false, false])
        setSlotReels([r1, r2, r3])
        setIsSpinning(false)

        if (r1 === r2 && r2 === r3) {
          soundEngine.playCoinChime()
          setSlotWinGlow(true)
          const win = r1 === '7️⃣' ? slotBet * 12 : slotBet * 5
          adjustPersonalCash(win)
          setSlotResultMsg(`🎉 BÜYÜK JACKPOT! 3x ${r1} yakaladın, +${win}₺ kazandın!`)
        } else if (r1 === r2 || r2 === r3 || r1 === r3) {
          soundEngine.playCoinChime()
          setSlotWinGlow(true)
          const win = Math.floor(slotBet * 1.5)
          adjustPersonalCash(win)
          setSlotResultMsg(`✨ İkili Eşleşme! +${win}₺ kazandın.`)
        } else {
          setSlotResultMsg('Kazanamadın! Kolu tekrar çevir.')
        }
      }
    }, 65)
  }

  // European Roulette Numbers (Red, Black, Green 0)
  const RED_NUMS = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36]

  const placeTableChip = (key: string) => {
    if (isRouletteSpinning) return
    const currentTotal = Object.values(tableBets).reduce((a, b) => a + b, 0)
    if (personalCash < currentTotal + selectedChip) {
      soundEngine.playDiscordPing()
      return
    }
    soundEngine.playKeyClick()
    setTableBets((prev) => ({
      ...prev,
      [key]: (prev[key] || 0) + selectedChip
    }))
  }

  const clearTableBets = () => {
    if (isRouletteSpinning) return
    soundEngine.playKeyClick()
    setTableBets({})
  }

  const doubleTableBets = () => {
    if (isRouletteSpinning) return
    const currentTotal = Object.values(tableBets).reduce((a, b) => a + b, 0)
    if (currentTotal === 0) return
    if (personalCash < currentTotal * 2) {
      soundEngine.playDiscordPing()
      return
    }
    soundEngine.playKeyClick()
    setTableBets((prev) => {
      const next: Record<string, number> = {}
      for (const k in prev) {
        next[k] = prev[k] * 2
      }
      return next
    })
  }

  const spinRoulette = () => {
    const totalTableBet = Object.values(tableBets).reduce((a, b) => a + b, 0)
    const effectiveBet = totalTableBet > 0 ? totalTableBet : selectedChip
    if (personalCash < effectiveBet || isRouletteSpinning) return

    adjustPersonalCash(-effectiveBet)
    setIsRouletteSpinning(true)
    setRouletteMsg('🎡 Rulet çarkı dönüyor... Top cepte durmak üzere...')

    const nextRotation = wheelRotation + 1440 + Math.floor(Math.random() * 720)
    setWheelRotation(nextRotation)

    let spinTicks = 0
    const spinInterval = setInterval(() => {
      spinTicks++
      soundEngine.playKeyClick()
      setRouletteWinningNum(Math.floor(Math.random() * 37))

      if (spinTicks >= 22) {
        clearInterval(spinInterval)
        const finalNum = Math.floor(Math.random() * 37)
        setRouletteWinningNum(finalNum)
        setRouletteHistory((prev) => [finalNum, ...prev.slice(0, 9)])
        setIsRouletteSpinning(false)

        const isRed = RED_NUMS.includes(finalNum)
        const isBlack = finalNum !== 0 && !isRed
        const colorName = finalNum === 0 ? 'YEŞİL (0)' : isRed ? 'KIRMIZI' : 'SİYAH'

        let totalWin = 0

        if (totalTableBet > 0) {
          // 1. Direct Number Hit (36x)
          if (tableBets[`num_${finalNum}`]) {
            totalWin += tableBets[`num_${finalNum}`] * 36
          }
          // 2. Red / Black (2x)
          if (isRed && tableBets['red']) totalWin += tableBets['red'] * 2
          if (isBlack && tableBets['black']) totalWin += tableBets['black'] * 2
          // 3. Green 0 (36x)
          if (finalNum === 0 && tableBets['green']) totalWin += tableBets['green'] * 36
          // 4. Even / Odd (2x)
          if (finalNum !== 0 && finalNum % 2 === 0 && tableBets['even']) totalWin += tableBets['even'] * 2
          if (finalNum % 2 === 1 && tableBets['odd']) totalWin += tableBets['odd'] * 2
          // 5. Low 1-18 / High 19-36 (2x)
          if (finalNum >= 1 && finalNum <= 18 && tableBets['low']) totalWin += tableBets['low'] * 2
          if (finalNum >= 19 && finalNum <= 36 && tableBets['high']) totalWin += tableBets['high'] * 2
          // 6. Dozens (3x)
          if (finalNum >= 1 && finalNum <= 12 && tableBets['doz_1']) totalWin += tableBets['doz_1'] * 3
          if (finalNum >= 13 && finalNum <= 24 && tableBets['doz_2']) totalWin += tableBets['doz_2'] * 3
          if (finalNum >= 25 && finalNum <= 36 && tableBets['doz_3']) totalWin += tableBets['doz_3'] * 3
          // 7. Columns (3x)
          if (finalNum > 0 && finalNum % 3 === 0 && tableBets['col_3']) totalWin += tableBets['col_3'] * 3
          if (finalNum > 0 && finalNum % 3 === 2 && tableBets['col_2']) totalWin += tableBets['col_2'] * 3
          if (finalNum > 0 && finalNum % 3 === 1 && tableBets['col_1']) totalWin += tableBets['col_1'] * 3
        } else {
          // If no specific table bets were placed, default bet is on RED (2x)
          if (isRed) totalWin = effectiveBet * 2
        }

        if (totalWin > 0) {
          soundEngine.playCoinChime()
          adjustPersonalCash(totalWin)
          setRouletteMsg(`🎉 TEBRİKLER! ${finalNum} (${colorName}) geldi! Toplam +${totalWin}₺ KAZANDIN!`)
          setRouletteStats((s) => ({ ...s, totalSpins: s.totalSpins + 1, totalWon: s.totalWon + totalWin, wins: s.wins + 1 }))
        } else {
          setRouletteMsg(`Kaybettin! Çark ${finalNum} (${colorName}) geldi. Tekrar dene.`)
          setRouletteStats((s) => ({ ...s, totalSpins: s.totalSpins + 1, losses: s.losses + 1 }))
        }
      }
    }, 90)
  }

  // Blackjack helpers with realistic cards
  const drawRandomCard = (): PlayingCard => {
    const suits: ('♠' | '♥' | '♦' | '♣')[] = ['♠', '♥', '♦', '♣']
    const suit = suits[Math.floor(Math.random() * suits.length)]
    const ranks = [
      { label: '2', value: 2 },
      { label: '3', value: 3 },
      { label: '4', value: 4 },
      { label: '5', value: 5 },
      { label: '6', value: 6 },
      { label: '7', value: 7 },
      { label: '8', value: 8 },
      { label: '9', value: 9 },
      { label: '10', value: 10 },
      { label: 'J', value: 10 },
      { label: 'Q', value: 10 },
      { label: 'K', value: 10 },
      { label: 'A', value: 11 }
    ]
    const picked = ranks[Math.floor(Math.random() * ranks.length)]
    return { value: picked.value, label: picked.label, suit }
  }

  const getHandTotal = (cards: PlayingCard[]) => {
    let sum = 0
    let aces = 0
    for (const c of cards) {
      if (c.value === 11) aces++
      sum += c.value
    }
    while (sum > 21 && aces > 0) {
      sum -= 10
      aces--
    }
    return sum
  }

  const startBlackjack = () => {
    if (personalCash < bjBet || bjStatus === 'dealing') {
      if (personalCash < bjBet) setBjMessage('Yetersiz bakiye!')
      return
    }
    adjustPersonalCash(-bjBet)
    setBjStatus('dealing')
    setBjPlayerCards([])
    setBjDealerCards([])
    setBjMessage('🃏 Kurpiyer kartları dağıtıyor...')

    const p1 = drawRandomCard()
    const d1 = drawRandomCard()
    const p2 = drawRandomCard()

    setTimeout(() => {
      soundEngine.playKeyClick()
      setBjPlayerCards([p1])
    }, 180)

    setTimeout(() => {
      soundEngine.playKeyClick()
      setBjDealerCards([d1])
    }, 380)

    setTimeout(() => {
      soundEngine.playKeyClick()
      const finalP = [p1, p2]
      setBjPlayerCards(finalP)
      if (getHandTotal(finalP) === 21) {
        soundEngine.playCoinChime()
        const win = Math.floor(bjBet * 2.5)
        adjustPersonalCash(win)
        setBjStatus('won')
        setBjMessage(`🎉 BLACKJACK! 21 yakaladın ve +${win}₺ kazandın!`)
      } else {
        setBjStatus('playing')
        setBjMessage('Hamleni seç: Kart İste (Hit) veya Kal (Stand).')
      }
    }, 600)
  }

  const hitBlackjack = () => {
    if (bjStatus !== 'playing') return
    soundEngine.playKeyClick()
    const next = [...bjPlayerCards, drawRandomCard()]
    setBjPlayerCards(next)
    const tot = getHandTotal(next)
    if (tot > 21) {
      setBjStatus('lost')
      setBjMessage(`💥 BUST! (${tot}) 21'i aştın ve kaybettin.`)
    } else if (tot === 21) {
      standBlackjackWithCards(next)
    }
  }

  const standBlackjackWithCards = (playerHand: PlayingCard[]) => {
    setBjStatus('dealing')
    setBjMessage('Kurpiyer kart çekiyor...')
    let d = [...bjDealerCards]

    const stepDealer = () => {
      if (getHandTotal(d) < 17) {
        soundEngine.playKeyClick()
        d = [...d, drawRandomCard()]
        setBjDealerCards([...d])
        setTimeout(stepDealer, 380)
      } else {
        const pTot = getHandTotal(playerHand)
        const dTot = getHandTotal(d)

        if (dTot > 21 || pTot > dTot) {
          soundEngine.playCoinChime()
          const win = bjBet * 2
          adjustPersonalCash(win)
          setBjStatus('won')
          setBjMessage(`🎉 KAZANDIN! (+${win}₺) Senin Elin: ${pTot} — Kurpiyer: ${dTot}`)
          setBjStats((s) => ({ ...s, won: s.won + 1 }))
        } else if (pTot === dTot) {
          adjustPersonalCash(bjBet)
          setBjStatus('push')
          setBjMessage(`🤝 Berabere (Push)! Bahsin (${bjBet}₺) iade edildi.`)
          setBjStats((s) => ({ ...s, push: s.push + 1 }))
        } else {
          setBjStatus('lost')
          setBjMessage(`Kaybettin! Kurpiyer: ${dTot} — Senin Elin: ${pTot}`)
          setBjStats((s) => ({ ...s, lost: s.lost + 1 }))
        }
      }
    }

    setTimeout(stepDealer, 320)
  }

  const standBlackjack = () => {
    if (bjStatus !== 'playing') return
    standBlackjackWithCards(bjPlayerCards)
  }

  const doubleBlackjack = () => {
    if (bjStatus !== 'playing' || personalCash < bjBet) return
    adjustPersonalCash(-bjBet)
    setBjBet((prev) => prev * 2)
    soundEngine.playKeyClick()
    const next = [...bjPlayerCards, drawRandomCard()]
    setBjPlayerCards(next)
    const tot = getHandTotal(next)
    if (tot > 21) {
      setBjStatus('lost')
      setBjMessage(`💥 BUST! (${tot}) 21'i aştın ve kaybettin.`)
      setBjStats((s) => ({ ...s, lost: s.lost + 1 }))
    } else {
      standBlackjackWithCards(next)
    }
  }

  const videoList = [
    {
      id: 'v1',
      title: 'Topluluk Sunucusunda 1v5 Clutch Anı (Sesli İletişim Patlaması)',
      channel: 'ProFPS_TR',
      views: '142B Görüntülenme',
      date: '2 saat önce',
      duration: '04:12',
      badge: 'CANLI',
      comments: [
        { user: 'Kaan_Mod', text: 'Ses odasında çığlık atan bendim kusura bakmayın haha' },
        { user: 'Berk_06', text: 'Hile bu adam banlayın diyenler beğensin' },
        { user: 'EmreKral', text: 'Temiz vuruş, tebrikler.' }
      ]
    },
    {
      id: 'v2',
      title: 'Moderatör Çıldırdı: Trolleri Banlarken Gelen Zevk',
      channel: 'OverlordClips',
      views: '88B Görüntülenme',
      date: '1 gün önce',
      duration: '08:45',
      badge: 'TREND',
      comments: [
        { user: 'Zengin_Balina', text: 'Benim banı açtığı için admin adamsın' },
        { user: 'SessizLider', text: 'Audit logları izlemek gibisi yok' }
      ]
    },
    {
      id: 'v3',
      title: 'Yeni Mekanik Klavye İncelemesi: Blue Switch vs Red Switch',
      channel: 'TechHardwareTR',
      views: '54B Görüntülenme',
      date: '3 gün önce',
      duration: '12:00',
      badge: 'DONANIM',
      comments: [
        { user: 'OyunDelisi', text: 'Blue switch sesi çok tatmin edici sepete ekledim' }
      ]
    }
  ]

  const selectedVideo = videoList.find((v) => v.id === activeVideoId) || videoList[0]
  const cartTotal = equipmentCart.reduce((acc, item) => acc + item.price, 0)

  return (
    <div className="flex flex-col h-full w-full bg-[#1e2025] text-zinc-200 select-none font-['Plus_Jakarta_Sans',sans-serif]">
      {/* 1. Multi-Tab Bar Header */}
      <div className="h-10 bg-[#121316] border-b border-[#252831] flex items-center px-2 space-x-1 shrink-0 overflow-x-auto">
        {tabs.map((tab) => {
          const isActive = tab.id === activeTabId
          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTabId(tab.id)
                setUrlInput(tab.url)
              }}
              className={`group flex items-center gap-2 h-8 px-3 rounded-t-md text-xs font-medium border-t border-x transition-colors max-w-[190px] truncate ${
                isActive
                  ? 'bg-[#1e2025] border-[#2b2e37] text-white shadow-sm'
                  : 'border-transparent text-zinc-400 hover:bg-white/5'
              }`}
            >
              {tab.favicon === 'search' && <Search className="w-3.5 h-3.5 text-sky-400 shrink-0" />}
              {tab.favicon === 'video' && <Tv className="w-3.5 h-3.5 text-red-500 shrink-0" />}
              {tab.favicon === 'shop' && <ShoppingBag className="w-3.5 h-3.5 text-amber-400 shrink-0" />}
              {tab.favicon === 'casino' && <Coins className="w-3.5 h-3.5 text-emerald-400 shrink-0" />}
              {tab.favicon === 'forum' && <MessageSquareText className="w-3.5 h-3.5 text-indigo-400 shrink-0" />}
              {tab.favicon === 'bot' && <Bot className="w-3.5 h-3.5 text-purple-400 shrink-0" />}
              {tab.favicon === 'bank' && <TrendingUp className="w-3.5 h-3.5 text-emerald-400 shrink-0" />}

              <span className="truncate">{tab.title}</span>

              {tabs.length > 1 && (
                <span
                  onClick={(e) => closeTab(e, tab.id)}
                  className="opacity-0 group-hover:opacity-100 hover:text-white p-0.5 rounded hover:bg-white/10"
                >
                  <X className="w-3 h-3" />
                </span>
              )}
            </button>
          )
        })}

        <button
          onClick={() => openNewTab()}
          className="w-7 h-7 flex items-center justify-center rounded hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
          title="Yeni Sekme"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* 2. Navigation & Address Bar */}
      <div className="h-11 bg-[#181a20] border-b border-[#262832] flex items-center px-3 space-x-2 shrink-0">
        <div className="flex items-center space-x-1 text-zinc-400">
          <button 
            onClick={() => navigateTo('https://modgle.com', 'Modgle')}
            className="p-1.5 rounded hover:bg-white/10 hover:text-white transition-colors" 
            title="Geri"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <button 
            className="p-1.5 rounded hover:bg-white/10 hover:text-white transition-colors" 
            title="İleri"
          >
            <ArrowRight className="w-4 h-4" />
          </button>
          <button 
            onClick={() => navigateTo(activeTab.url, activeTab.title)}
            className="p-1.5 rounded hover:bg-white/10 hover:text-white transition-colors" 
            title="Yenile"
          >
            <RotateCw className="w-4 h-4" />
          </button>
          <button 
            onClick={() => navigateTo('https://modgle.com', 'Modgle Arama')}
            className="p-1.5 rounded hover:bg-white/10 hover:text-white transition-colors" 
            title="Ana Sayfa"
          >
            <Home className="w-4 h-4" />
          </button>
        </div>

        {/* URL Input Bar */}
        <form onSubmit={handleUrlSubmit} className="flex-1 h-8 bg-[#111215] border border-[#2c2f3a] rounded-lg flex items-center px-3 text-xs text-zinc-300 space-x-2 focus-within:border-sky-500 transition-colors">
          <Lock className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <input
            type="text"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            className="w-full bg-transparent outline-none font-mono text-[11px] text-zinc-200"
          />
        </form>

        <div className="flex items-center gap-2 text-xs font-mono text-zinc-400 border-l border-[#262832] pl-3">
          <span className="text-emerald-400 font-bold">{personalCash}₺</span>
        </div>
      </div>

      {/* 3. Bookmarks / Quick Access Bar */}
      <div className="h-8 bg-[#14161a] border-b border-[#23262f] flex items-center px-3 space-x-2 text-[11px] font-medium text-zinc-400 shrink-0 overflow-x-auto">
        <button 
          onClick={() => navigateTo('https://modgle.com', 'Modgle Portal', 'search')} 
          className="flex items-center gap-1.5 px-2 py-1 rounded hover:bg-white/5 hover:text-white transition-colors"
        >
          <Search className="w-3 h-3 text-sky-400" />
          <span>Modgle</span>
        </button>
        <button 
          onClick={() => navigateTo('https://youvids.tv', 'YouVids TV', 'video')} 
          className="flex items-center gap-1.5 px-2 py-1 rounded hover:bg-white/5 hover:text-white transition-colors"
        >
          <Tv className="w-3 h-3 text-red-500" />
          <span>YouVids (Klipler)</span>
        </button>
        <button 
          onClick={() => navigateTo('https://donanimsepeti.com', 'DonanımSepeti', 'shop')} 
          className="flex items-center gap-1.5 px-2 py-1 rounded hover:bg-white/5 hover:text-white transition-colors"
        >
          <ShoppingBag className="w-3 h-3 text-amber-400" />
          <span>DonanımSepeti ({equipmentCart.length})</span>
        </button>
        <button 
          onClick={() => navigateTo('https://vegas777.com', 'Vegas 777 Casino', 'casino')} 
          className="flex items-center gap-1.5 px-2 py-1 rounded hover:bg-white/5 hover:text-white transition-colors"
        >
          <Coins className="w-3 h-3 text-emerald-400" />
          <span>Vegas 777 (Kumarhane)</span>
        </button>
        <button 
          onClick={() => navigateTo('https://bothub.io', 'CloudVDS & BotHub', 'bot')} 
          className="flex items-center gap-1.5 px-2 py-1 rounded hover:bg-white/5 hover:text-white transition-colors text-purple-300 font-semibold"
        >
          <Server className="w-3 h-3 text-purple-400" />
          <span>CloudVDS & BotHub</span>
        </button>
        <button 
          onClick={() => navigateTo('https://darkforum.net', 'DarkForum', 'forum')} 
          className="flex items-center gap-1.5 px-2 py-1 rounded hover:bg-white/5 hover:text-white transition-colors"
        >
          <MessageSquareText className="w-3 h-3 text-indigo-400" />
          <span>DarkForum</span>
        </button>
        <button 
          onClick={() => navigateTo('https://cryptopay.local', 'CryptoPay Bank', 'bank')} 
          className="flex items-center gap-1.5 px-2 py-1 rounded hover:bg-white/5 hover:text-white transition-colors"
        >
          <TrendingUp className="w-3 h-3 text-emerald-400" />
          <span>CryptoPay</span>
        </button>
        <button 
          onClick={() => navigateTo('https://stam.games', 'Stam Dijital Oyun Mağazası', 'game')} 
          className="flex items-center gap-1.5 px-2 py-1 rounded hover:bg-white/5 hover:text-white transition-colors"
        >
          <Gamepad2 className="w-3 h-3 text-pink-400" />
          <span>Stam Games</span>
        </button>
        <button 
          onClick={() => navigateTo('https://adclick.mod', 'ModAds Sunucu Reklam Portalı', 'ad')} 
          className="flex items-center gap-1.5 px-2 py-1 rounded hover:bg-white/5 hover:text-white transition-colors text-yellow-400 font-bold"
        >
          <Megaphone className="w-3 h-3 text-yellow-400" />
          <span>Reklam Ver (Hype & Üye)</span>
        </button>
      </div>

      {/* 4. Active Website Page Viewport */}
      <div className="flex-1 overflow-y-auto bg-[#101115]">
        {/* SITE 1: Modgle Search & Portal */}
        {activeTab.url.includes('modgle.com') && (
          <div className="max-w-3xl mx-auto py-16 px-6 space-y-8 text-center animate-in fade-in duration-150">
            <div>
              <div className="text-4xl md:text-5xl font-black font-mono text-white tracking-tight flex items-center justify-center gap-2">
                <span className="text-sky-400">M</span>
                <span className="text-red-400">o</span>
                <span className="text-amber-400">d</span>
                <span className="text-sky-400">g</span>
                <span className="text-emerald-400">l</span>
                <span className="text-red-400">e</span>
              </div>
              <p className="text-xs text-zinc-400 mt-2 font-mono">Topluluk Ağı & İnternet Portalı</p>
            </div>

            {/* Search Input Box */}
            <form 
              onSubmit={(e) => {
                e.preventDefault()
                if (searchQuery.toLowerCase().includes('darkweb')) {
                  navigateTo('https://darkweb.onion', 'DarkWeb .onion Engine', 'search')
                } else if (searchQuery.toLowerCase().includes('vds') || searchQuery.toLowerCase().includes('bot')) {
                  navigateTo('https://bothub.io', 'CloudVDS & BotHub', 'bot')
                } else if (searchQuery.toLowerCase().includes('video') || searchQuery.toLowerCase().includes('izle')) {
                  navigateTo('https://youvids.tv', 'YouVids', 'video')
                } else if (searchQuery.toLowerCase().includes('kumar') || searchQuery.toLowerCase().includes('slot') || searchQuery.toLowerCase().includes('bj')) {
                  navigateTo('https://vegas777.com', 'Vegas 777', 'casino')
                } else if (searchQuery.toLowerCase().includes('forum') || searchQuery.toLowerCase().includes('reddit')) {
                  navigateTo('https://darkforum.net', 'DarkForum', 'forum')
                } else {
                  navigateTo('https://donanimsepeti.com', 'DonanımSepeti', 'shop')
                }
              }}
              className="max-w-lg mx-auto"
            >
              <div className="h-11 bg-[#181a20] border border-[#2b2e38] rounded-full px-4 flex items-center gap-3 shadow-lg focus-within:ring-2 focus-within:ring-sky-500 transition-all">
                <Search className="w-4 h-4 text-zinc-400" />
                <input
                  type="text"
                  placeholder="İnternette ara veya siteye git (örn: vds, donanım, kumar, darkweb)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent text-xs text-white placeholder-zinc-500 outline-none flex-1"
                />
              </div>
            </form>

            {/* Quick Links Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-xl mx-auto pt-4 text-left">
              <button
                onClick={() => navigateTo('https://bothub.io', 'CloudVDS & BotHub', 'bot')}
                className="p-3 rounded-lg bg-[#181a20] border border-[#262832] hover:border-purple-500/50 transition-colors group"
              >
                <Server className="w-5 h-5 text-purple-400 mb-2" />
                <div className="text-xs font-bold text-white group-hover:text-purple-400">CloudVDS</div>
                <div className="text-[10px] text-zinc-400">VDS Sunucu Kirala</div>
              </button>

              <button
                onClick={() => navigateTo('https://donanimsepeti.com', 'DonanımSepeti', 'shop')}
                className="p-3 rounded-lg bg-[#181a20] border border-[#262832] hover:border-amber-500/50 transition-colors group"
              >
                <ShoppingBag className="w-5 h-5 text-amber-400 mb-2" />
                <div className="text-xs font-bold text-white group-hover:text-amber-400">DonanımSepeti</div>
                <div className="text-[10px] text-zinc-400">Sepet & Setup</div>
              </button>

              <button
                onClick={() => navigateTo('https://vegas777.com', 'Vegas 777', 'casino')}
                className="p-3 rounded-lg bg-[#181a20] border border-[#262832] hover:border-emerald-500/50 transition-colors group"
              >
                <Coins className="w-5 h-5 text-emerald-400 mb-2" />
                <div className="text-xs font-bold text-white group-hover:text-emerald-400">Vegas 777</div>
                <div className="text-[10px] text-zinc-400">Slot, Rulet & 21</div>
              </button>

              <button
                onClick={() => navigateTo('https://adclick.mod', 'ModAds Reklam', 'ad')}
                className="p-3 rounded-lg bg-[#181a20] border border-[#262832] hover:border-yellow-500/50 transition-colors group"
              >
                <Megaphone className="w-5 h-5 text-yellow-400 mb-2" />
                <div className="text-xs font-bold text-white group-hover:text-yellow-400">ModAds</div>
                <div className="text-[10px] text-zinc-400">Üye & Hype Çek</div>
              </button>
            </div>
          </div>
        )}

        {/* SITE 2: YouVids (YouTube / Streamer Platform) */}
        {activeTab.url.includes('youvids.tv') && (
          <div className="max-w-5xl mx-auto p-6 space-y-6 animate-in fade-in duration-150">
            <div className="flex items-center justify-between border-b border-[#252831] pb-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded bg-red-600 flex items-center justify-center text-white font-black text-xs">
                  YV
                </div>
                <span className="font-bold text-base text-white">YouVids Network</span>
              </div>
              <span className="text-xs text-zinc-400 font-mono">14,280 Canlı İzleyici</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Active Player */}
              <div className="lg:col-span-2 space-y-4">
                <div className="relative aspect-video rounded-xl bg-[#0c0d10] border border-[#242730] flex flex-col justify-between p-4 overflow-hidden shadow-2xl">
                  <div className="absolute inset-0 bg-gradient-to-tr from-purple-950/20 via-black to-sky-950/20 pointer-events-none" />
                  
                  <div className="flex items-center justify-between z-10">
                    <span className="px-2 py-0.5 rounded bg-red-600 text-white font-bold text-[10px] tracking-wider animate-pulse">
                      {selectedVideo.badge}
                    </span>
                    <span className="text-xs font-mono text-zinc-400">{selectedVideo.duration}</span>
                  </div>

                  <div className="text-center z-10 py-6">
                    <div className="w-14 h-14 rounded-full bg-white/10 hover:bg-white/20 mx-auto flex items-center justify-center cursor-pointer transition-colors"
                      onClick={() => setIsPlaying(!isPlaying)}
                    >
                      {isPlaying ? (
                        <Pause className="w-6 h-6 text-white" />
                      ) : (
                        <Play className="w-6 h-6 text-white fill-current ml-1" />
                      )}
                    </div>
                    <div className="text-xs text-zinc-300 font-mono mt-3">
                      {isPlaying ? '[ Oynatılıyor: 1080p60 Stream ]' : '[ Duraklatıldı ]'}
                    </div>
                  </div>

                  <div className="flex items-center justify-between z-10 text-xs text-zinc-400 border-t border-white/5 pt-2">
                    <div className="flex items-center gap-3">
                      <Volume2 className="w-4 h-4 text-white" />
                      <span>Ses: %100</span>
                    </div>
                    <span>{selectedVideo.views}</span>
                  </div>
                </div>

                <div>
                  <h1 className="text-base font-bold text-white">{selectedVideo.title}</h1>
                  <div className="text-xs text-zinc-400 mt-1 flex items-center gap-2">
                    <strong className="text-zinc-200">{selectedVideo.channel}</strong>
                    <span>•</span>
                    <span>{selectedVideo.date}</span>
                  </div>
                </div>

                {/* Comments Section */}
                <div className="p-4 rounded-xl bg-[#15171d] border border-[#232630] space-y-3">
                  <div className="text-xs font-bold text-white uppercase tracking-wider">
                    Yorumlar ({selectedVideo.comments.length})
                  </div>
                  <div className="space-y-2">
                    {selectedVideo.comments.map((c, i) => (
                      <div key={i} className="text-xs flex gap-2">
                        <strong className="text-sky-400 shrink-0">@{c.user}:</strong>
                        <span className="text-zinc-300">{c.text}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Video Playlist Sidebar */}
              <div className="space-y-3">
                <div className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Sıradaki Klipler</div>
                {videoList.map((v) => (
                  <button
                    key={v.id}
                    onClick={() => setActiveVideoId(v.id)}
                    className={`w-full text-left p-3 rounded-lg border transition-all ${
                      v.id === activeVideoId
                        ? 'bg-[#1e2027] border-red-500/50 text-white'
                        : 'bg-[#15171d] border-[#232630] text-zinc-400 hover:bg-[#1a1c22]'
                    }`}
                  >
                    <div className="text-xs font-bold truncate text-zinc-200">{v.title}</div>
                    <div className="text-[11px] text-zinc-500 mt-1 flex items-center justify-between">
                      <span>{v.channel}</span>
                      <span>{v.duration}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* SITE 3: DonanımSepeti with Categories Sidebar + Shopping Cart Confirmation (Item #12) */}
        {activeTab.url.includes('donanimsepeti.com') && (
          <div className="max-w-6xl mx-auto p-4 space-y-4 animate-in fade-in duration-150">
            {/* Header */}
            <div className="border-b border-[#252831] pb-3 flex items-center justify-between">
              <div>
                <h1 className="text-xl font-black text-white flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-amber-400" />
                  DonanımSepeti.com — Profesyonel Battlestation & Setup Mağazası
                </h1>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Ürünlere tıklayarak sepetine ekle, ardından sağdaki sepeti onaylayarak satın al!
                </p>
              </div>
              <div className="flex items-center gap-2">
                <div className="px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-xs font-mono font-bold text-amber-300 flex items-center gap-1.5">
                  <ShoppingCart className="w-3.5 h-3.5" />
                  <span>Sepet: {equipmentCart.length} Ürün ({cartTotal}₺)</span>
                </div>
                <div className="px-3 py-1.5 rounded-lg bg-[#181a20] border border-[#272a38] text-xs font-mono font-bold text-emerald-400">
                  Şahsi Bakiye: {personalCash}₺
                </div>
              </div>
            </div>

            {shopFeedback && (
              <div className="p-3 rounded-xl bg-amber-500/15 border border-amber-500/40 text-xs font-semibold text-amber-300 flex items-center justify-between animate-in fade-in">
                <span>{shopFeedback}</span>
                <button onClick={() => setShopFeedback(null)} className="text-zinc-400 hover:text-white">✕</button>
              </div>
            )}

            {/* Layout: Sidebar + Catalog + Cart Sidebar */}
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Category Sidebar */}
              <div className="w-full lg:w-48 shrink-0 bg-[#14161c] border border-[#232630] rounded-xl p-3 space-y-1 h-fit">
                <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider px-2 py-1">Kategoriler</div>
                {[
                  { id: 'all', label: 'Tüm Donanımlar', icon: <Layers className="w-3.5 h-3.5 text-amber-400" /> },
                  { id: 'display', label: 'Monitör & Panel', icon: <Monitor className="w-3.5 h-3.5 text-sky-400" /> },
                  { id: 'peripherals', label: 'Klavye & Fare', icon: <Keyboard className="w-3.5 h-3.5 text-emerald-400" /> },
                  { id: 'audio', label: 'Kulaklık & Ses', icon: <Headphones className="w-3.5 h-3.5 text-purple-400" /> },
                  { id: 'comfort', label: 'Konfor & Yaşam', icon: <Coffee className="w-3.5 h-3.5 text-amber-500" /> },
                  { id: 'network', label: 'Ağ & Altyapı', icon: <Wifi className="w-3.5 h-3.5 text-rose-400" /> }
                ].map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setShopCategory(cat.id as any)}
                    className={`w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-xs text-left transition-colors cursor-pointer ${
                      shopCategory === cat.id
                        ? 'bg-amber-500/15 text-amber-300 font-bold border border-amber-500/30'
                        : 'text-zinc-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {cat.icon}
                    <span>{cat.label}</span>
                  </button>
                ))}
              </div>

              {/* Product Grid */}
              <div className="flex-1 space-y-3">
                <div className="relative">
                  <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={shopSearch}
                    onChange={(e) => setShopSearch(e.target.value)}
                    placeholder="Ürün adı veya özellik ara..."
                    className="w-full pl-9 pr-3 py-2 bg-[#14161c] border border-[#232630] rounded-lg text-xs text-zinc-200 placeholder-zinc-500 outline-none focus:border-amber-500/50"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {[
                    { id: 'keyboard_mech', cat: 'peripherals', title: 'Mekanik Klavye (Blue Switch)', desc: 'Sesli tuş tıklaması. Komut ve ban hızını %30 artırır.', price: 180, badge: 'Çok Satan' },
                    { id: 'mouse_ultralight', cat: 'peripherals', title: '58g Delikli Espor Mouse & Pad', desc: 'Saniyenin onda birinde ban atmayı kolaylaştırır.', price: 140, badge: 'Hız' },
                    { id: 'monitor_27', cat: 'display', title: '27" IPS 165Hz Oyuncu Paneli', desc: 'Aynı anda birden fazla sohbeti ve bileti rahatça izle.', price: 420, badge: 'Görüntü' },
                    { id: 'monitor_arm', cat: 'display', title: 'Amortisörlü İkili Monitör Kolu', desc: 'Masa alanını ikiye katlar, ergonomiyi zirveye çıkarır.', price: 190, badge: 'Ergonomi' },
                    { id: 'headset_studio', cat: 'audio', title: 'Stüdyo 7.1 Dip Ses Filtreli Kulaklık', desc: 'Ses odalarındaki trollerin dip seslerini ve gürültüyü engeller.', price: 290, badge: 'Net Ses' },
                    { id: 'mic_streamer', cat: 'audio', title: 'Kardioid Masaüstü Mikrofon', desc: 'Yönetici sesini netleştirir, topluluk toplantılarında saygınlık sağlar.', price: 250, badge: 'Yayıncı' },
                    { id: 'coffee_maker', cat: 'comfort', title: 'Espresso Kahve Makinesi', desc: 'Kahve içildiğinde Akıl Sağlığı (Sanity) yenilemesini 2x yapar.', price: 240, badge: 'Stres Savar' },
                    { id: 'rgb_lights', cat: 'comfort', title: 'RGB Ambiance Masa Aydınlatma Şeridi', desc: 'Gece nöbetlerinde oda atmosferini yumuşatır, göz yorgunluğunu önler.', price: 95, badge: 'Aura' },
                    { id: 'fiber_net', cat: 'network', title: '1 Gbps Simetrik Fiber İnternet', desc: 'Raid saldırısı altındayken ping ve bağlantı kopmasını sıfırlar.', price: 490, badge: 'Altyapı' },
                    { id: 'ups_power', cat: 'network', title: 'Kesintisiz Güç Kaynağı (UPS)', desc: 'Ani elektrik kesintilerinde nöbetin bölünmesini engeller.', price: 380, badge: 'Güvenlik' }
                  ]
                    .filter((item) => shopCategory === 'all' || item.cat === shopCategory)
                    .filter((item) => item.title.toLowerCase().includes(shopSearch.toLowerCase()) || item.desc.toLowerCase().includes(shopSearch.toLowerCase()))
                    .map((item) => {
                      const isOwned = ownedEquipment.includes(item.id)
                      const isInCart = equipmentCart.some((c) => c.id === item.id)
                      return (
                        <div key={item.id} className="p-3.5 rounded-xl bg-[#14161c] border border-[#232630] hover:border-[#333845] flex flex-col justify-between transition-colors">
                          <div>
                            <div className="flex items-center justify-between mb-1.5">
                              <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">{item.badge}</span>
                              {isOwned ? (
                                <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                                  <Check className="w-3 h-3" /> Sahipsin
                                </span>
                              ) : isInCart ? (
                                <span className="text-[10px] text-amber-300 font-bold flex items-center gap-1">
                                  <ShoppingCart className="w-3 h-3" /> Sepette
                                </span>
                              ) : null}
                            </div>
                            <h3 className="text-xs font-bold text-white">{item.title}</h3>
                            <p className="text-[11px] text-zinc-400 mt-1 leading-relaxed">{item.desc}</p>
                          </div>

                          <div className="mt-3 pt-2.5 border-t border-[#232630] flex items-center justify-between">
                            <span className="font-mono text-sm font-bold text-emerald-400">{item.price}₺</span>
                            <button
                              disabled={isOwned || isInCart}
                              onClick={() => {
                                addToEquipmentCart({ id: item.id, name: item.title, price: item.price })
                                setShopFeedback(`🛒 "${item.title}" sepete eklendi! Sağ taraftaki sepetten onaylayarak satın alabilirsiniz.`)
                              }}
                              className={`px-3 py-1.5 rounded text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                                isOwned
                                  ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                                  : isInCart
                                  ? 'bg-amber-950/60 text-amber-300 border border-amber-500/40 cursor-default'
                                  : 'bg-amber-500 hover:bg-amber-400 text-black shadow'
                              }`}
                            >
                              <ShoppingCart className="w-3.5 h-3.5" />
                              <span>{isOwned ? 'Satın Alındı' : isInCart ? 'Sepette Eklendi' : 'Sepete Ekle'}</span>
                            </button>
                          </div>
                        </div>
                      )
                    })}
                </div>
              </div>

              {/* Shopping Cart Confirmation Panel (Item #12) */}
              <div className="w-full lg:w-72 shrink-0 bg-[#14161c] border border-[#282c3a] rounded-xl p-4 flex flex-col justify-between h-fit space-y-4 shadow-xl">
                <div className="space-y-3">
                  <div className="flex items-center justify-between border-b border-[#232630] pb-2.5">
                    <div className="flex items-center gap-2 text-xs font-black text-white uppercase tracking-wider">
                      <ShoppingCart className="w-4 h-4 text-amber-400" />
                      <span>Alışveriş Sepeti</span>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono text-[10px] font-bold">
                      {equipmentCart.length} Ürün
                    </span>
                  </div>

                  {equipmentCart.length === 0 ? (
                    <div className="py-8 text-center space-y-2 text-zinc-500">
                      <ShoppingCart className="w-8 h-8 mx-auto opacity-30" />
                      <p className="text-xs">Sepetiniz şu an boş.</p>
                      <p className="text-[10px]">Soldaki donanımlardan "Sepete Ekle" butonuna tıklayarak ürün ekleyin.</p>
                    </div>
                  ) : (
                    <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                      {equipmentCart.map((cartItem) => (
                        <div
                          key={cartItem.id}
                          className="p-2.5 rounded-lg bg-[#191c24] border border-[#272b38] flex items-center justify-between gap-2"
                        >
                          <div className="min-w-0">
                            <div className="text-xs font-bold text-white truncate">{cartItem.name}</div>
                            <div className="text-[11px] font-mono text-emerald-400 font-bold">{cartItem.price}₺</div>
                          </div>
                          <button
                            onClick={() => removeFromEquipmentCart(cartItem.id)}
                            className="p-1.5 rounded hover:bg-red-500/20 text-zinc-400 hover:text-red-400 transition-colors cursor-pointer"
                            title="Sepetten Çıkar"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="border-t border-[#232630] pt-3 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-zinc-400">Sepet Toplamı:</span>
                    <span className="font-mono text-base font-black text-amber-400">{cartTotal}₺</span>
                  </div>
                  <button
                    disabled={equipmentCart.length === 0}
                    onClick={() => {
                      const res = checkoutEquipmentCart()
                      setShopFeedback(res.message)
                    }}
                    className={`w-full py-2.5 rounded-lg font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
                      equipmentCart.length === 0
                        ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                        : personalCash < cartTotal
                        ? 'bg-red-950 text-red-300 border border-red-700/40 cursor-pointer'
                        : 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-black shadow-lg shadow-emerald-500/20 cursor-pointer'
                    }`}
                  >
                    <Check className="w-4 h-4" />
                    <span>Sepeti Onayla ve Satın Al</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SITE 4: Vegas 777 Casino (Animated Lobby, Slots, Blackjack, Roulette - Item #13) */}
        {activeTab.url.includes('vegas777.com') && (
          <div className={`${casinoView === 'roulette' || casinoView === 'blackjack' ? 'w-full max-w-[1400px] mx-auto' : 'max-w-5xl mx-auto'} p-3 md:p-5 space-y-4 animate-in fade-in duration-150`}>
            {/* Casino Header */}
            <div className="border-b border-[#252831] pb-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-600 via-yellow-500 to-amber-300 flex items-center justify-center text-black font-black shadow-lg shadow-amber-500/20">
                  <Star className="w-6 h-6 fill-black text-black" />
                </div>
                <div>
                  <h1 className="text-lg font-black text-white flex items-center gap-2 tracking-wide">
                    ROYAL VEGAS 777 — VIP CASINO & LOUNGE
                  </h1>
                  <p className="text-xs text-zinc-400">Canlı Avrupa Ruleti Tablası, VIP 21 Blackjack ve Lucky 777 Slotları</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {casinoView !== 'lobby' && (
                  <button
                    onClick={() => setCasinoView('lobby')}
                    className="px-3 py-1.5 rounded-lg bg-[#20222a] hover:bg-[#282b35] border border-[#2f3240] text-xs font-bold text-zinc-300 hover:text-white transition-colors cursor-pointer flex items-center gap-1.5 shadow"
                  >
                    ← Casino Lobisi
                  </button>
                )}
                <div className="px-3.5 py-1.5 rounded-lg bg-[#181a20] border border-[#272a38] text-xs font-mono font-bold text-emerald-400 flex items-center gap-1.5 shadow">
                  <span className="text-zinc-500">Bakiye:</span>
                  <span>{personalCash}₺</span>
                </div>
              </div>
            </div>

            {/* 1. LOBBY VIEW */}
            {casinoView === 'lobby' && (
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-950/40 via-[#181a22] to-purple-950/40 border border-amber-500/30 flex items-center justify-between">
                  <div>
                    <div className="text-[10px] text-amber-400 font-mono uppercase font-bold tracking-wider">CANLI MEGA JACKPOT HAVUZU</div>
                    <div className="text-2xl font-black font-mono text-yellow-300 mt-0.5">84,520₺</div>
                    <p className="text-xs text-zinc-400 mt-1">Günün en şanslı moderatörünü bekliyor!</p>
                  </div>
                  <Sparkles className="w-10 h-10 text-amber-400 animate-spin opacity-80" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Card 1: Slots */}
                  <div className="p-4 rounded-xl bg-[#14161d] border border-[#252835] hover:border-amber-500/50 transition-all flex flex-col justify-between group">
                    <div>
                      <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-2xl mb-3 group-hover:scale-110 transition-transform">
                        🎰
                      </div>
                      <h3 className="text-sm font-bold text-white">Lucky 777 Neon Slots</h3>
                      <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                        Sıralı duran 3 makaralı neon slot makinesi. 7️⃣ 7️⃣ 7️⃣ yakala ve 12x mega çarpanı kap!
                      </p>
                    </div>
                    <button
                      onClick={() => setCasinoView('slots')}
                      className="mt-4 w-full py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs transition-colors cursor-pointer shadow"
                    >
                      Slot Oyna ➔
                    </button>
                  </div>

                  {/* Card 2: Blackjack */}
                  <div className="p-4 rounded-xl bg-[#14161d] border border-[#252835] hover:border-emerald-500/50 transition-all flex flex-col justify-between group">
                    <div>
                      <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-2xl mb-3 group-hover:scale-110 transition-transform">
                        🃏
                      </div>
                      <h3 className="text-sm font-bold text-white">VIP Blackjack 21</h3>
                      <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                        Animasyonlu kart dağıtımı, gerçek iskambil sembolleri (♠ ♥ ♦ ♣) ile krupiyeye karşı 21 mücadelesi!
                      </p>
                    </div>
                    <button
                      onClick={() => setCasinoView('blackjack')}
                      className="mt-4 w-full py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors cursor-pointer shadow"
                    >
                      Masaya Otur ➔
                    </button>
                  </div>

                  {/* Card 3: Roulette */}
                  <div className="p-4 rounded-xl bg-[#14161d] border border-[#252835] hover:border-red-500/50 transition-all flex flex-col justify-between group">
                    <div>
                      <div className="w-12 h-12 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-2xl mb-3 group-hover:scale-110 transition-transform">
                        🎡
                      </div>
                      <h3 className="text-sm font-bold text-white">Avrupa Ruleti (Roulette)</h3>
                      <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                        Gerçek dönen rulet çarkı animasyonu! Kırmızı / Siyah, Tek / Çift veya tek sayıya 36x jackpot oyna!
                      </p>
                    </div>
                    <button
                      onClick={() => setCasinoView('roulette')}
                      className="mt-4 w-full py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold text-xs transition-colors cursor-pointer shadow"
                    >
                      Rulet Oyna ➔
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* 2. SLOTS VIEW WITH SEQUENTIAL REEL ANIMATION */}
            {casinoView === 'slots' && (
              <div className={`max-w-md mx-auto p-6 rounded-2xl bg-[#14161d] border-2 transition-all space-y-4 text-center ${
                slotWinGlow ? 'border-yellow-400 shadow-[0_0_40px_rgba(250,204,21,0.35)]' : 'border-amber-500/30'
              }`}>
                <div className="flex items-center justify-between border-b border-[#242732] pb-2">
                  <span className="text-xs font-bold text-white uppercase tracking-wider">🎰 Lucky 777 Neon Makinesi</span>
                  <span className="text-[11px] font-mono text-amber-400 font-bold">12x Jackpot</span>
                </div>

                {/* Neon Light Strip */}
                <div className="flex justify-center gap-2">
                  {[0, 1, 2, 3, 4, 5, 6].map((bulb) => (
                    <span
                      key={bulb}
                      className={`w-2.5 h-2.5 rounded-full transition-all ${
                        isSpinning || slotWinGlow
                          ? bulb % 2 === 0
                            ? 'bg-yellow-400 shadow-[0_0_8px_#facc15] animate-ping'
                            : 'bg-rose-500 shadow-[0_0_8px_#f43f5e] animate-pulse'
                          : 'bg-zinc-700'
                      }`}
                    />
                  ))}
                </div>

                {/* Animated Slot Reels */}
                <div className="flex justify-center gap-3 py-6 bg-[#0a0b0f] rounded-xl border-2 border-[#252834] shadow-inner relative overflow-hidden">
                  {slotReels.map((s, idx) => {
                    const spinningThis = reelSpinning[idx]
                    return (
                      <div 
                        key={idx} 
                        className={`w-24 h-28 rounded-xl bg-gradient-to-b from-[#1e212b] via-[#15171f] to-[#1e212b] border-2 flex items-center justify-center text-5xl shadow-xl transition-all duration-150 ${
                          spinningThis
                            ? 'border-amber-400 -translate-y-1 scale-95 blur-[1px] animate-bounce'
                            : slotWinGlow
                            ? 'border-yellow-400 scale-105 shadow-[0_0_20px_rgba(250,204,21,0.4)]'
                            : 'border-amber-500/40 scale-100'
                        }`}
                      >
                        <span className="drop-shadow">{s}</span>
                      </div>
                    )
                  })}
                </div>

                <div className={`text-xs font-bold min-h-[22px] transition-colors ${
                  slotWinGlow ? 'text-yellow-300 text-sm animate-bounce' : 'text-zinc-300'
                }`}>
                  {slotResultMsg}
                </div>

                <div className="flex items-center justify-center gap-2">
                  <span className="text-xs text-zinc-400">Bahis Çipi:</span>
                  {[10, 25, 50, 100, 250].map((b) => (
                    <button
                      key={b}
                      disabled={isSpinning}
                      onClick={() => setSlotBet(b)}
                      className={`px-2.5 py-1 rounded text-xs font-mono font-bold cursor-pointer transition-colors ${
                        slotBet === b ? 'bg-amber-500 text-black shadow' : 'bg-[#22242b] text-zinc-300 hover:bg-[#2b2e38]'
                      }`}
                    >
                      {b}₺
                    </button>
                  ))}
                </div>

                <button
                  disabled={isSpinning || personalCash < slotBet}
                  onClick={spinSlotMachine}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-400 hover:to-yellow-300 disabled:from-zinc-800 disabled:to-zinc-800 disabled:text-zinc-600 text-black font-black text-xs uppercase tracking-wider transition-all shadow-lg cursor-pointer active:scale-95"
                >
                  {isSpinning ? '🎰 Makaralar Dönüyor...' : `🕹️ Kolu Çek ve Çevir (${slotBet}₺)`}
                </button>
              </div>
            )}

            {/* 3. VIP BLACKJACK 21 TABLE (WIDESCREEN EXPANDED FELT) */}
            {casinoView === 'blackjack' && (
              <div className="w-full rounded-2xl bg-gradient-to-b from-[#0a1610] via-[#07130d] to-[#040806] border-2 border-emerald-600/50 p-4 md:p-6 space-y-4 shadow-2xl relative overflow-hidden">
                {/* Top Bar: Logo & Status & Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-center border-b border-emerald-900/60 pb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-black font-black text-xl shadow-lg shadow-emerald-500/20">
                      🃏
                    </div>
                    <div>
                      <div className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-1.5">
                        VIP ROYALE 21 BLACKJACK
                      </div>
                      <div className="text-[10px] text-emerald-400 font-medium">Kurpiyer 17'de durur • BJ 2.5x öder</div>
                    </div>
                  </div>

                  {/* Center Result Message Banner */}
                  <div className={`text-center px-3 py-2 rounded-xl border font-bold text-xs transition-all ${
                    bjStatus === 'won'
                      ? 'bg-emerald-950/80 border-emerald-400 text-yellow-300 shadow-[0_0_15px_rgba(16,185,129,0.3)] animate-pulse'
                      : bjStatus === 'lost'
                      ? 'bg-rose-950/80 border-rose-500 text-rose-300'
                      : bjStatus === 'push'
                      ? 'bg-amber-950/80 border-amber-500 text-amber-300'
                      : 'bg-emerald-950/30 border-emerald-800/40 text-emerald-200'
                  }`}>
                    {bjMessage}
                  </div>

                  {/* Right: Stats Counter */}
                  <div className="flex items-center justify-end gap-3 text-xs font-mono">
                    <div className="px-2.5 py-1 rounded-lg bg-emerald-950/50 border border-emerald-800/50 text-emerald-300">
                      <span className="text-[10px] text-zinc-400 mr-1">Galibiyet:</span>
                      <strong className="text-emerald-400">{bjStats.won}</strong>
                    </div>
                    <div className="px-2.5 py-1 rounded-lg bg-rose-950/50 border border-rose-800/50 text-rose-300">
                      <span className="text-[10px] text-zinc-400 mr-1">Mağlubiyet:</span>
                      <strong className="text-rose-400">{bjStats.lost}</strong>
                    </div>
                    <div className="px-2.5 py-1 rounded-lg bg-amber-950/50 border border-amber-800/50 text-amber-300">
                      <span className="text-[10px] text-zinc-400 mr-1">Berabere:</span>
                      <strong className="text-amber-400">{bjStats.push}</strong>
                    </div>
                  </div>
                </div>

                {/* Main Curved Velvet Table Surface */}
                <div className="relative rounded-2xl bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#0d3820] via-[#092b18] to-[#04130a] p-6 border-4 border-emerald-700/60 shadow-inner min-h-[360px] flex flex-col justify-between overflow-hidden">
                  {/* Decorative Felt Watermark & Semi-Circle Line */}
                  <div className="absolute inset-x-8 top-12 bottom-6 border-2 border-dashed border-emerald-400/20 rounded-b-[180px] pointer-events-none flex flex-col items-center justify-center">
                    <span className="text-[11px] font-black tracking-[0.3em] text-emerald-300/15 uppercase">
                      INSURANCE PAYS 2 TO 1 • DEALER MUST STAND ON 17
                    </span>
                  </div>

                  {/* Dealer Area (Top) */}
                  <div className="relative z-10 flex flex-col items-center space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-300">Kurpiyerin Eli</span>
                      <span className="px-2 py-0.5 rounded-full bg-black/60 border border-emerald-500/40 font-mono text-xs font-black text-emerald-400">
                        {bjStatus === 'playing' && bjDealerCards.length === 1 ? '?' : getHandTotal(bjDealerCards)}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 min-h-[105px]">
                      {bjDealerCards.map((c, idx) => {
                        const isRed = c.suit === '♥' || c.suit === '♦'
                        return (
                          <div
                            key={idx}
                            className={`w-18 h-26 md:w-20 md:h-28 bg-gradient-to-b from-white to-zinc-100 rounded-xl p-2 flex flex-col justify-between shadow-2xl border-2 border-zinc-300 animate-in zoom-in-75 slide-in-from-top-6 duration-200 select-none ${
                              isRed ? 'text-red-600' : 'text-zinc-900'
                            }`}
                          >
                            <div className="text-xs md:text-sm font-black leading-none">{c.label}{c.suit}</div>
                            <div className="text-3xl text-center leading-none drop-shadow">{c.suit}</div>
                            <div className="text-xs md:text-sm font-black leading-none self-end rotate-180">{c.label}{c.suit}</div>
                          </div>
                        )
                      })}
                      {bjStatus === 'playing' && bjDealerCards.length === 1 && (
                        <div className="w-18 h-26 md:w-20 md:h-28 rounded-xl bg-gradient-to-br from-red-900 via-rose-950 to-amber-950 border-2 border-amber-400/80 shadow-2xl flex flex-col items-center justify-center text-amber-300 font-black animate-in zoom-in-75">
                          <span className="text-2xl">⚜️</span>
                          <span className="text-[9px] uppercase tracking-wider text-amber-200/80 mt-1 font-mono">KAPALI</span>
                        </div>
                      )}
                      {bjDealerCards.length === 0 && (
                        <div className="w-18 h-26 md:w-20 md:h-28 rounded-xl border-2 border-dashed border-emerald-400/30 flex items-center justify-center text-emerald-400/40 text-xs">
                          Kart Yok
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Center Bet Chip Placard */}
                  <div className="relative z-10 flex items-center justify-center my-2">
                    <div className="px-4 py-1.5 rounded-full bg-black/60 border border-amber-500/50 shadow-lg flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-300 text-black font-black text-[10px] flex items-center justify-center shadow">
                        ₺
                      </span>
                      <span className="text-xs font-mono font-bold text-amber-300">
                        Mevcut Bahis: <strong className="text-white font-black">{bjBet}₺</strong>
                      </span>
                    </div>
                  </div>

                  {/* Player Area (Bottom) */}
                  <div className="relative z-10 flex flex-col items-center space-y-2">
                    <div className="flex items-center gap-3 min-h-[105px]">
                      {bjPlayerCards.map((c, idx) => {
                        const isRed = c.suit === '♥' || c.suit === '♦'
                        return (
                          <div
                            key={idx}
                            className={`w-18 h-26 md:w-20 md:h-28 bg-gradient-to-b from-white to-zinc-100 rounded-xl p-2 flex flex-col justify-between shadow-2xl border-2 border-amber-400 animate-in zoom-in-75 slide-in-from-bottom-6 duration-200 select-none ${
                              isRed ? 'text-red-600' : 'text-zinc-900'
                            }`}
                          >
                            <div className="text-xs md:text-sm font-black leading-none">{c.label}{c.suit}</div>
                            <div className="text-3xl text-center leading-none drop-shadow">{c.suit}</div>
                            <div className="text-xs md:text-sm font-black leading-none self-end rotate-180">{c.label}{c.suit}</div>
                          </div>
                        )
                      })}
                      {bjPlayerCards.length === 0 && (
                        <div className="w-18 h-26 md:w-20 md:h-28 rounded-xl border-2 border-dashed border-amber-400/30 flex items-center justify-center text-amber-400/40 text-xs">
                          Kart Bekleniyor
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-amber-300">Senin Elin</span>
                      <span className="px-2.5 py-0.5 rounded-full bg-black/60 border border-amber-400 font-mono text-xs font-black text-amber-400">
                        Toplam: {getHandTotal(bjPlayerCards)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Bottom Control Bar: Chips & Actions */}
                <div className="bg-[#0e1117] rounded-xl border border-emerald-900/60 p-3 flex flex-wrap items-center justify-between gap-3">
                  {/* Chip Denominations */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-bold text-zinc-400 mr-1">Jeton:</span>
                    {[25, 50, 100, 250, 500, 1000].map((b) => (
                      <button
                        key={b}
                        disabled={bjStatus === 'playing' || bjStatus === 'dealing'}
                        onClick={() => {
                          soundEngine.playKeyClick()
                          setBjBet(b)
                        }}
                        className={`w-11 h-11 rounded-full font-mono font-black text-xs cursor-pointer transition-all border-2 flex items-center justify-center shadow-lg active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed ${
                          bjBet === b
                            ? 'bg-gradient-to-tr from-amber-500 to-yellow-300 text-black border-white ring-2 ring-amber-400 scale-105'
                            : 'bg-gradient-to-tr from-[#1b222a] to-[#252f3a] text-zinc-200 border-zinc-600 hover:border-amber-400'
                        }`}
                      >
                        {b}₺
                      </button>
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 flex-1 md:flex-initial justify-end">
                    {bjStatus !== 'playing' ? (
                      <button
                        disabled={bjStatus === 'dealing' || personalCash < bjBet}
                        onClick={startBlackjack}
                        className="px-8 py-3 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-400 hover:to-teal-400 disabled:from-zinc-800 disabled:to-zinc-800 disabled:text-zinc-500 text-black font-black text-xs uppercase tracking-wider shadow-lg shadow-emerald-500/20 cursor-pointer transition-all active:scale-95 flex items-center gap-2"
                      >
                        <span>🃏</span>
                        <span>{bjStatus === 'dealing' ? 'Dağıtılıyor...' : `KARTLARI DAĞIT (${bjBet}₺)`}</span>
                      </button>
                    ) : (
                      <>
                        <button
                          onClick={hitBlackjack}
                          className="px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-black text-xs uppercase tracking-wider cursor-pointer shadow-lg active:scale-95 flex items-center gap-1.5"
                        >
                          <span>➕</span>
                          <span>Kart İste (Hit)</span>
                        </button>
                        <button
                          onClick={standBlackjack}
                          className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-black text-xs uppercase tracking-wider cursor-pointer shadow-lg active:scale-95 flex items-center gap-1.5"
                        >
                          <span>✋</span>
                          <span>Kal (Stand)</span>
                        </button>
                        <button
                          disabled={personalCash < bjBet}
                          onClick={doubleBlackjack}
                          className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:bg-zinc-800 disabled:text-zinc-500 text-white font-black text-xs uppercase tracking-wider cursor-pointer shadow-lg active:scale-95 flex items-center gap-1.5"
                        >
                          <span>⚡</span>
                          <span>2x İkiye Katla</span>
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* 4. ROULETTE VIEW (FULL-SCREEN VIP WIDESCREEN LAYOUT FROM DIAGRAM) */}
            {casinoView === 'roulette' && (() => {
              const totalTableBet = Object.values(tableBets).reduce((a, b) => a + b, 0)
              const redCount = rouletteHistory.filter((n) => RED_NUMS.includes(n)).length
              const blackCount = rouletteHistory.filter((n) => n !== 0 && !RED_NUMS.includes(n)).length
              const zeroCount = rouletteHistory.filter((n) => n === 0).length

              const renderChip = (key: string) => {
                const amount = tableBets[key]
                if (!amount) return null
                return (
                  <span className="absolute z-20 w-6 h-6 rounded-full bg-gradient-to-tr from-amber-400 to-yellow-200 border-2 border-black text-black font-black text-[9px] flex items-center justify-center shadow-md animate-in zoom-in-75 pointer-events-none">
                    {amount}
                  </span>
                )
              }

              return (
                <div className="w-full rounded-2xl bg-gradient-to-b from-[#161214] via-[#110e10] to-[#0a0809] border-2 border-amber-600/40 p-4 md:p-6 space-y-4 shadow-2xl relative">
                  {/* TOP ROW: [Logo & VIP] - [Sonuç Banner] - [Loglar & İstatistik] */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-stretch">
                    {/* Top-Left: Logo & Cash & Quick Info */}
                    <div className="md:col-span-3 p-3 rounded-xl bg-[#1c1417] border border-amber-500/30 flex flex-col justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 via-yellow-400 to-amber-600 flex items-center justify-center text-black font-black shadow-lg">
                          <Star className="w-5 h-5 fill-black text-black" />
                        </div>
                        <div>
                          <div className="text-xs font-black text-white uppercase tracking-wider">
                            ROYAL VEGAS VIP
                          </div>
                          <div className="text-[10px] text-amber-400 font-mono font-bold">Avrupa Rulet Masası (37 Cep)</div>
                        </div>
                      </div>
                      <div className="mt-2 pt-2 border-t border-zinc-800 flex items-center justify-between text-xs font-mono">
                        <span className="text-zinc-400">Aktif Masa Bahsi:</span>
                        <span className="font-bold text-amber-300">{totalTableBet}₺</span>
                      </div>
                    </div>

                    {/* Top-Center: Sonuç Banner */}
                    <div className="md:col-span-5 p-3 rounded-xl bg-gradient-to-r from-[#1f1618] via-[#241318] to-[#1f1618] border border-amber-500/40 flex items-center gap-4 shadow-inner">
                      <div className={`w-14 h-14 shrink-0 rounded-2xl border-2 flex flex-col items-center justify-center font-mono font-black shadow-xl transition-all ${
                        rouletteWinningNum === 0
                          ? 'bg-emerald-600 border-emerald-300 text-white shadow-emerald-500/30 animate-bounce'
                          : rouletteWinningNum !== null && RED_NUMS.includes(rouletteWinningNum)
                          ? 'bg-rose-600 border-rose-300 text-white shadow-rose-500/30 animate-bounce'
                          : rouletteWinningNum !== null
                          ? 'bg-zinc-900 border-zinc-500 text-white shadow-zinc-500/30 animate-bounce'
                          : 'bg-[#15171e] border-amber-500/40 text-amber-400'
                      }`}>
                        <span className="text-xl leading-none">
                          {rouletteWinningNum !== null ? rouletteWinningNum : '?'}
                        </span>
                        <span className="text-[8px] uppercase tracking-wider text-zinc-200 mt-0.5">
                          {rouletteWinningNum === 0
                            ? 'YEŞİL'
                            : rouletteWinningNum !== null && RED_NUMS.includes(rouletteWinningNum)
                            ? 'KIRMIZI'
                            : rouletteWinningNum !== null
                            ? 'SİYAH'
                            : 'BEKLİYOR'}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-[10px] text-amber-400 font-bold uppercase tracking-wider">MASA DURUMU & SONUÇ</div>
                        <div className="text-xs font-bold text-white truncate mt-0.5">{rouletteMsg}</div>
                        <div className="text-[10px] text-zinc-400 mt-1 flex items-center gap-2">
                          <span>Kazanma Oranı: %{rouletteStats.totalSpins > 0 ? Math.round((rouletteStats.wins / rouletteStats.totalSpins) * 100) : 0}</span>
                          <span>•</span>
                          <span>Toplam Kazanç: +{rouletteStats.totalWon}₺</span>
                        </div>
                      </div>
                    </div>

                    {/* Top-Right: Loglar & İstatistik */}
                    <div className="md:col-span-4 p-3 rounded-xl bg-[#1c1417] border border-amber-500/30 flex flex-col justify-between">
                      <div className="flex items-center justify-between text-[11px] font-bold text-zinc-300 border-b border-zinc-800 pb-1">
                        <span>SON GELENLER (LOGLAR)</span>
                        <span className="text-[10px] font-mono text-amber-400">{rouletteHistory.length} Tur</span>
                      </div>
                      <div className="flex items-center gap-1.5 py-1.5 overflow-x-auto min-h-[32px]">
                        {rouletteHistory.length === 0 ? (
                          <span className="text-[10px] text-zinc-500 italic">Henüz çark çevrilmedi</span>
                        ) : (
                          rouletteHistory.map((num, i) => (
                            <span
                              key={i}
                              className={`w-6 h-6 shrink-0 rounded-full text-[10px] font-mono font-black flex items-center justify-center text-white shadow ${
                                num === 0
                                  ? 'bg-emerald-600 ring-1 ring-emerald-300'
                                  : RED_NUMS.includes(num)
                                  ? 'bg-rose-600 ring-1 ring-rose-300'
                                  : 'bg-zinc-800 ring-1 ring-zinc-500'
                              }`}
                            >
                              {num}
                            </span>
                          ))
                        )}
                      </div>
                      <div className="flex items-center justify-between text-[10px] font-mono text-zinc-400 pt-1 border-t border-zinc-800">
                        <span className="text-rose-400">Kırmızı: {redCount}</span>
                        <span className="text-zinc-300">Siyah: {blackCount}</span>
                        <span className="text-emerald-400">Sıfır: {zeroCount}</span>
                      </div>
                    </div>
                  </div>

                  {/* MAIN BODY: Rulet Tablası (Center-Left) + Bahis Masası (Center-Right) */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
                    {/* CENTER-LEFT: Rulet Tablası (Large Wheel) */}
                    <div className="lg:col-span-5 flex flex-col items-center justify-center p-4 rounded-2xl bg-gradient-to-b from-[#140e11] to-[#0d090b] border-2 border-amber-500/40 relative">
                      <div className="text-[10px] text-amber-400 font-mono font-black uppercase tracking-widest mb-2 flex items-center gap-1">
                        <span>▼</span>
                        <span>RULET ÇARKI (AVRUPA)</span>
                        <span>▼</span>
                      </div>

                      {/* Grand Roulette Wheel Assembly */}
                      <div className="relative w-64 h-64 md:w-72 md:h-72 flex items-center justify-center">
                        {/* Outer Wooden/Mahogany Ring with Gold Rivets */}
                        <div className="w-full h-full rounded-full border-8 border-[#3d2314] ring-4 ring-amber-500/70 p-2 shadow-[0_0_40px_rgba(0,0,0,0.9)] bg-gradient-to-b from-[#26150c] to-[#120a06] flex items-center justify-center relative">
                          {/* Inner Conic Number Ring */}
                          <div
                            style={{
                              transform: `rotate(${wheelRotation}deg)`,
                              transition: isRouletteSpinning ? 'transform 2.2s cubic-bezier(0.12, 0.88, 0.22, 1)' : 'none',
                              background:
                                'conic-gradient(#10b981 0deg 9.7deg, #dc2626 9.7deg 19.4deg, #18181b 19.4deg 29.1deg, #dc2626 29.1deg 38.8deg, #18181b 38.8deg 48.5deg, #dc2626 48.5deg 58.2deg, #18181b 58.2deg 67.9deg, #dc2626 67.9deg 77.6deg, #18181b 77.6deg 87.3deg, #dc2626 87.3deg 97deg, #18181b 97deg 106.7deg, #dc2626 106.7deg 116.4deg, #18181b 116.4deg 126.1deg, #dc2626 126.1deg 135.8deg, #18181b 135.8deg 145.5deg, #dc2626 145.5deg 155.2deg, #18181b 155.2deg 164.9deg, #dc2626 164.9deg 174.6deg, #18181b 174.6deg 184.3deg, #dc2626 184.3deg 194deg, #18181b 194deg 203.7deg, #dc2626 203.7deg 213.4deg, #18181b 213.4deg 223.1deg, #dc2626 223.1deg 232.8deg, #18181b 232.8deg 242.5deg, #dc2626 242.5deg 252.2deg, #18181b 252.2deg 261.9deg, #dc2626 261.9deg 271.6deg, #18181b 271.6deg 281.3deg, #dc2626 281.3deg 291deg, #18181b 291deg 300.7deg, #dc2626 300.7deg 310.4deg, #18181b 310.4deg 320.1deg, #dc2626 320.1deg 329.8deg, #18181b 329.8deg 339.5deg, #dc2626 339.5deg 349.2deg, #18181b 349.2deg 360deg)'
                            }}
                            className="w-full h-full rounded-full border-4 border-amber-400/80 shadow-inner flex items-center justify-center relative"
                          >
                            {/* Inner Fretwork Brass Spoke Ring */}
                            <div className="w-40 h-40 md:w-44 md:h-44 rounded-full border-2 border-amber-300/40 bg-[#0d090a]/80 shadow-2xl flex items-center justify-center">
                              <div className="w-24 h-24 rounded-full border border-amber-400/30 bg-gradient-to-tr from-[#1b120c] to-[#3a2213] flex items-center justify-center shadow-inner" />
                            </div>
                          </div>

                          {/* Center Golden Turret Hub */}
                          <div className="absolute w-20 h-20 md:w-22 md:h-22 rounded-full bg-gradient-to-tr from-amber-600 via-yellow-400 to-amber-700 border-4 border-amber-200 shadow-2xl flex flex-col items-center justify-center text-black pointer-events-none z-10">
                            <span className="text-xl leading-none">👑</span>
                            <span className="text-[8px] font-black tracking-widest uppercase mt-0.5">VEGAS</span>
                          </div>

                          {/* Ball Indicator (Top) */}
                          <div className={`absolute -top-1 left-1/2 -translate-x-1/2 z-20 w-4 h-4 rounded-full bg-white shadow-[0_0_12px_#fff] border-2 border-zinc-400 ${
                            isRouletteSpinning ? 'animate-ping' : ''
                          }`} />
                        </div>
                      </div>

                      <div className="text-[11px] text-zinc-400 mt-2 text-center">
                        Top durduğunda kazanan sayı belirlenir.
                      </div>
                    </div>

                    {/* CENTER-RIGHT: Bahis Masası (European Green Felt Table Grid) */}
                    <div className="lg:col-span-7 rounded-2xl bg-gradient-to-b from-[#083b23] via-[#052b19] to-[#031d11] p-3 md:p-4 border-4 border-emerald-600/60 shadow-2xl space-y-2 select-none overflow-x-auto">
                      <div className="flex items-center justify-between text-emerald-300 text-xs font-bold border-b border-emerald-500/30 pb-1.5">
                        <span className="flex items-center gap-1.5">
                          <span>🟢</span>
                          <span className="uppercase tracking-wider">Avrupa Rulet Bahis Masası (Felt Table)</span>
                        </span>
                        <span className="text-[10px] font-mono text-amber-300">
                          Jeton Yerleştirmek İçin Hücreye Tıklayın
                        </span>
                      </div>

                      {/* Numbers Grid (0 on left, 3 rows x 12 cols of numbers 1-36, + 2 to 1 column bets) */}
                      <div className="flex gap-1.5 items-stretch min-w-[560px]">
                        {/* ZERO (0) - Spans all 3 rows */}
                        <button
                          onClick={() => placeTableChip('green')}
                          className="w-12 rounded-lg bg-emerald-700 hover:bg-emerald-600 border-2 border-emerald-400/80 text-white font-mono font-black text-lg flex flex-col items-center justify-center relative cursor-pointer shadow-lg active:scale-95 transition-all"
                        >
                          {renderChip('green')}
                          <span>0</span>
                          <span className="text-[8px] font-sans font-bold opacity-80">36x</span>
                        </button>

                        {/* 3 Rows of 12 Columns */}
                        <div className="flex-1 space-y-1">
                          {/* Row 1: 3, 6, 9, 12, 15, 18, 21, 24, 27, 30, 33, 36 */}
                          <div className="grid grid-cols-12 gap-1">
                            {[3, 6, 9, 12, 15, 18, 21, 24, 27, 30, 33, 36].map((num) => {
                              const isRed = RED_NUMS.includes(num)
                              const key = `num_${num}`
                              return (
                                <button
                                  key={num}
                                  onClick={() => placeTableChip(key)}
                                  className={`h-10 rounded-md font-mono font-black text-xs flex flex-col items-center justify-center relative border cursor-pointer active:scale-95 transition-all shadow ${
                                    isRed
                                      ? 'bg-rose-700 hover:bg-rose-600 border-rose-400 text-white'
                                      : 'bg-zinc-900 hover:bg-zinc-800 border-zinc-600 text-white'
                                  }`}
                                >
                                  {renderChip(key)}
                                  <span>{num}</span>
                                </button>
                              )
                            })}
                          </div>

                          {/* Row 2: 2, 5, 8, 11, 14, 17, 20, 23, 26, 29, 32, 35 */}
                          <div className="grid grid-cols-12 gap-1">
                            {[2, 5, 8, 11, 14, 17, 20, 23, 26, 29, 32, 35].map((num) => {
                              const isRed = RED_NUMS.includes(num)
                              const key = `num_${num}`
                              return (
                                <button
                                  key={num}
                                  onClick={() => placeTableChip(key)}
                                  className={`h-10 rounded-md font-mono font-black text-xs flex flex-col items-center justify-center relative border cursor-pointer active:scale-95 transition-all shadow ${
                                    isRed
                                      ? 'bg-rose-700 hover:bg-rose-600 border-rose-400 text-white'
                                      : 'bg-zinc-900 hover:bg-zinc-800 border-zinc-600 text-white'
                                  }`}
                                >
                                  {renderChip(key)}
                                  <span>{num}</span>
                                </button>
                              )
                            })}
                          </div>

                          {/* Row 3: 1, 4, 7, 10, 13, 16, 19, 22, 25, 28, 31, 34 */}
                          <div className="grid grid-cols-12 gap-1">
                            {[1, 4, 7, 10, 13, 16, 19, 22, 25, 28, 31, 34].map((num) => {
                              const isRed = RED_NUMS.includes(num)
                              const key = `num_${num}`
                              return (
                                <button
                                  key={num}
                                  onClick={() => placeTableChip(key)}
                                  className={`h-10 rounded-md font-mono font-black text-xs flex flex-col items-center justify-center relative border cursor-pointer active:scale-95 transition-all shadow ${
                                    isRed
                                      ? 'bg-rose-700 hover:bg-rose-600 border-rose-400 text-white'
                                      : 'bg-zinc-900 hover:bg-zinc-800 border-zinc-600 text-white'
                                  }`}
                                >
                                  {renderChip(key)}
                                  <span>{num}</span>
                                </button>
                              )
                            })}
                          </div>
                        </div>

                        {/* 2 to 1 Column Bets */}
                        <div className="w-14 space-y-1">
                          <button
                            onClick={() => placeTableChip('col_3')}
                            className="w-full h-10 rounded-md bg-emerald-900/60 hover:bg-emerald-800/80 border border-emerald-500/50 text-emerald-200 font-mono font-bold text-[10px] flex items-center justify-center relative cursor-pointer active:scale-95"
                          >
                            {renderChip('col_3')}
                            2 to 1
                          </button>
                          <button
                            onClick={() => placeTableChip('col_2')}
                            className="w-full h-10 rounded-md bg-emerald-900/60 hover:bg-emerald-800/80 border border-emerald-500/50 text-emerald-200 font-mono font-bold text-[10px] flex items-center justify-center relative cursor-pointer active:scale-95"
                          >
                            {renderChip('col_2')}
                            2 to 1
                          </button>
                          <button
                            onClick={() => placeTableChip('col_1')}
                            className="w-full h-10 rounded-md bg-emerald-900/60 hover:bg-emerald-800/80 border border-emerald-500/50 text-emerald-200 font-mono font-bold text-[10px] flex items-center justify-center relative cursor-pointer active:scale-95"
                          >
                            {renderChip('col_1')}
                            2 to 1
                          </button>
                        </div>
                      </div>

                      {/* Dozen Bets (1st 12, 2nd 12, 3rd 12 - 3x) */}
                      <div className="grid grid-cols-3 gap-1.5 pt-1 min-w-[560px]">
                        <button
                          onClick={() => placeTableChip('doz_1')}
                          className="py-2 rounded-lg bg-emerald-900/50 hover:bg-emerald-800/70 border border-emerald-500/40 text-emerald-200 font-bold text-xs uppercase tracking-wider relative cursor-pointer active:scale-95"
                        >
                          {renderChip('doz_1')}
                          1st 12 (1 - 12) • 3x
                        </button>
                        <button
                          onClick={() => placeTableChip('doz_2')}
                          className="py-2 rounded-lg bg-emerald-900/50 hover:bg-emerald-800/70 border border-emerald-500/40 text-emerald-200 font-bold text-xs uppercase tracking-wider relative cursor-pointer active:scale-95"
                        >
                          {renderChip('doz_2')}
                          2nd 12 (13 - 24) • 3x
                        </button>
                        <button
                          onClick={() => placeTableChip('doz_3')}
                          className="py-2 rounded-lg bg-emerald-900/50 hover:bg-emerald-800/70 border border-emerald-500/40 text-emerald-200 font-bold text-xs uppercase tracking-wider relative cursor-pointer active:scale-95"
                        >
                          {renderChip('doz_3')}
                          3rd 12 (25 - 36) • 3x
                        </button>
                      </div>

                      {/* Outside Bets (1-18, ÇİFT, KIRMIZI, SİYAH, TEK, 19-36 - 2x) */}
                      <div className="grid grid-cols-6 gap-1.5 pt-1 min-w-[560px]">
                        <button
                          onClick={() => placeTableChip('low')}
                          className="py-2 rounded-lg bg-emerald-950/70 hover:bg-emerald-900/80 border border-emerald-500/40 text-zinc-200 font-bold text-xs relative cursor-pointer active:scale-95"
                        >
                          {renderChip('low')}
                          1 - 18
                        </button>
                        <button
                          onClick={() => placeTableChip('even')}
                          className="py-2 rounded-lg bg-emerald-950/70 hover:bg-emerald-900/80 border border-emerald-500/40 text-zinc-200 font-bold text-xs relative cursor-pointer active:scale-95"
                        >
                          {renderChip('even')}
                          ÇİFT
                        </button>
                        <button
                          onClick={() => placeTableChip('red')}
                          className="py-2 rounded-lg bg-rose-700/80 hover:bg-rose-600 border border-rose-400 text-white font-bold text-xs flex items-center justify-center gap-1 relative cursor-pointer active:scale-95"
                        >
                          {renderChip('red')}
                          <span>◆ KIRMIZI</span>
                        </button>
                        <button
                          onClick={() => placeTableChip('black')}
                          className="py-2 rounded-lg bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-500 text-white font-bold text-xs flex items-center justify-center gap-1 relative cursor-pointer active:scale-95"
                        >
                          {renderChip('black')}
                          <span>◆ SİYAH</span>
                        </button>
                        <button
                          onClick={() => placeTableChip('odd')}
                          className="py-2 rounded-lg bg-emerald-950/70 hover:bg-emerald-900/80 border border-emerald-500/40 text-zinc-200 font-bold text-xs relative cursor-pointer active:scale-95"
                        >
                          {renderChip('odd')}
                          TEK
                        </button>
                        <button
                          onClick={() => placeTableChip('high')}
                          className="py-2 rounded-lg bg-emerald-950/70 hover:bg-emerald-900/80 border border-emerald-500/40 text-zinc-200 font-bold text-xs relative cursor-pointer active:scale-95"
                        >
                          {renderChip('high')}
                          19 - 36
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* BOTTOM: JETONLAR & AKSİYONLAR */}
                  <div className="bg-[#120f11] rounded-xl border border-amber-500/30 p-3 flex flex-wrap items-center justify-between gap-3">
                    {/* Chip Selector Bar */}
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-black text-amber-400 uppercase tracking-wider mr-1">
                        Jeton Seç:
                      </span>
                      {[10, 25, 50, 100, 250, 500, 1000].map((chip) => (
                        <button
                          key={chip}
                          disabled={isRouletteSpinning}
                          onClick={() => {
                            soundEngine.playKeyClick()
                            setSelectedChip(chip)
                          }}
                          className={`w-11 h-11 rounded-full font-mono font-black text-xs cursor-pointer transition-all border-2 flex items-center justify-center shadow-lg active:scale-95 disabled:opacity-40 ${
                            selectedChip === chip
                              ? 'bg-gradient-to-tr from-amber-400 via-yellow-300 to-amber-500 text-black border-white ring-2 ring-amber-400 scale-105'
                              : 'bg-gradient-to-tr from-[#251b20] to-[#34242c] text-amber-200 border-amber-600/40 hover:border-amber-400'
                          }`}
                        >
                          {chip}₺
                        </button>
                      ))}
                    </div>

                    {/* Table Bet Actions: Clear, Double, SPIN */}
                    <div className="flex items-center gap-2 flex-1 md:flex-initial justify-end">
                      <button
                        disabled={isRouletteSpinning || totalTableBet === 0}
                        onClick={clearTableBets}
                        className="px-3.5 py-2.5 rounded-lg bg-[#251d20] hover:bg-[#34292d] disabled:opacity-40 text-zinc-300 hover:text-white border border-[#3e2e34] text-xs font-bold cursor-pointer transition-colors"
                      >
                        Bahisleri Temizle
                      </button>

                      <button
                        disabled={isRouletteSpinning || totalTableBet === 0 || personalCash < totalTableBet * 2}
                        onClick={doubleTableBets}
                        className="px-3.5 py-2.5 rounded-lg bg-amber-950/40 hover:bg-amber-900/50 disabled:opacity-40 text-amber-300 border border-amber-700/40 text-xs font-bold cursor-pointer transition-colors"
                      >
                        2x Katla
                      </button>

                      <button
                        disabled={isRouletteSpinning || personalCash < (totalTableBet > 0 ? totalTableBet : selectedChip)}
                        onClick={spinRoulette}
                        className="px-7 py-3 rounded-xl bg-gradient-to-r from-red-600 via-rose-500 to-red-600 hover:from-red-500 hover:to-rose-400 disabled:from-zinc-800 disabled:to-zinc-800 disabled:text-zinc-600 text-white font-black text-xs uppercase tracking-wider transition-all shadow-xl shadow-red-600/30 cursor-pointer active:scale-95 flex items-center gap-2"
                      >
                        <span>🎡</span>
                        <span>
                          {isRouletteSpinning
                            ? 'ÇARK DÖNÜYOR...'
                            : totalTableBet > 0
                            ? `ÇARKI ÇEVİR (${totalTableBet}₺)`
                            : `ÇARKI ÇEVİR (${selectedChip}₺)`}
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              )
            })()}
          </div>
        )}

        {/* SITE 5: DarkForum */}
        {activeTab.url.includes('darkforum.net') && (
          <div className="max-w-4xl mx-auto p-6 space-y-4 animate-in fade-in duration-150">
            <div className="border-b border-[#252831] pb-3 flex items-center justify-between">
              <div>
                <h1 className="text-lg font-bold text-white flex items-center gap-2">
                  <MessageSquareText className="w-5 h-5 text-indigo-400" />
                  DarkForum — Moderatör & Topluluk Tartışmaları
                </h1>
                <p className="text-xs text-zinc-400 mt-0.5">Topluluk yöneticilerinin anonim paylaşımları ve sızdırılan dramalar.</p>
              </div>
              <span className="text-xs text-indigo-400 font-mono">r/ServerMod</span>
            </div>

            <div className="space-y-3">
              {[
                { title: '[Rehber] Bot çalıştırmak için VDS kiralamak şart! Uzak Masaüstü (RDP) kurulumu', author: 'SysAdmin_TR', replies: 64, upvotes: 285, tag: 'ÖNEMLİ' },
                { title: '[Tavsiye] Balina VIP üye küfür edince nasıl davranıyorsunuz?', author: 'Mod_Kadir', replies: 34, upvotes: 142, tag: 'TARTIŞMA' },
                { title: '[İfşa] Dün geceki raid saldırısını rakip sunucu organize etmiş kanıtlar burada', author: 'AnonimDedektif', replies: 58, upvotes: 310, tag: 'KRİZ' },
                { title: 'Kedi beslemek gerçekten Sanity düşüşünü yavaşlatıyor mu?', author: 'PaspasFan', replies: 45, upvotes: 220, tag: 'MİZAH' }
              ].map((post, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-[#15171d] border border-[#242732] hover:border-[#383d4e] transition-colors cursor-pointer">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                      {post.tag}
                    </span>
                    <span className="text-[11px] text-zinc-500">Gönderen: u/{post.author}</span>
                  </div>
                  <h3 className="text-xs font-bold text-white hover:underline">{post.title}</h3>
                  <div className="text-[11px] text-zinc-400 mt-2 flex items-center gap-4">
                    <span>▲ {post.upvotes} beğeni</span>
                    <span>💬 {post.replies} yorum</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SITE 6: CloudVDS & BotHub (Items #16 & #17: VDS Required, Bots Purchased & Activated via RDP VDS Desktop) */}
        {activeTab.url.includes('bothub.io') && (
          <div className="max-w-5xl mx-auto p-6 space-y-6 animate-in fade-in duration-150">
            <div className="border-b border-[#252831] pb-3 flex items-center justify-between">
              <div>
                <h1 className="text-xl font-bold text-white flex items-center gap-2">
                  <Server className="w-5 h-5 text-purple-400" />
                  CloudVDS & BotHub.io — Uzak Sunucu & Bot Otomasyon Merkezi
                </h1>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Botların 7/24 çalışabilmesi için önce VDS Sunucu kiralamanız ve Uzaktan Masaüstü (RDP) ile VDS'e bağlanmanız gerekir!
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-3 py-1.5 rounded-lg bg-[#181a20] border border-[#272a38] text-xs font-mono font-bold text-sky-400">
                  Sunucu Kasası: {serverFunds}₺
                </span>
                <span className="px-3 py-1.5 rounded-lg bg-[#181a20] border border-[#272a38] text-xs font-mono font-bold text-emerald-400">
                  Şahsi: {personalCash}₺
                </span>
              </div>
            </div>

            {vdsFeedback && (
              <div className="p-3 rounded-xl bg-purple-950/50 border border-purple-500/50 text-xs text-purple-200 font-semibold">
                {vdsFeedback}
              </div>
            )}

            {/* Step 1: Rent VDS Server Card */}
            <div className={`p-5 rounded-2xl border-2 transition-all ${
              hasVds ? 'bg-emerald-950/20 border-emerald-500/50' : 'bg-[#151722] border-purple-500/50'
            }`}>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1.5">
                  <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-[10px] font-bold uppercase">
                    {hasVds ? '✅ VDS SUNUCU AKTİF' : '⚠️ ZORUNLU ALTYAPI (ADIM 1)'}
                  </div>
                  <h2 className="text-base font-black text-white">
                    CloudVDS Pro — 4 vCPU / 8 GB RAM / NVMe Bot Sunucusu
                  </h2>
                  <p className="text-xs text-zinc-300 leading-relaxed max-w-2xl">
                    Sunucu botları kendi bilgisayarınızda çalıştırılamaz. VDS kiraladıktan sonra masaüstündeki <strong>"Uzaktan Bağlantı (VDS)"</strong> uygulamasını açıp aşağıdaki VDS IP ve Erişim Kodunu girerek VDS masaüstüne bağlanın. Botlar sadece VDS masaüstündeki <strong>BotMarket & Aktivatör</strong> uygulamasından satın alınıp aktif edilebilir!
                  </p>
                </div>

                {!hasVds ? (
                  <div className="flex flex-col gap-2 shrink-0">
                    <button
                      onClick={() => {
                        const res = rentVds('server')
                        setVdsFeedback(res.message)
                      }}
                      className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-black text-xs cursor-pointer shadow-lg"
                    >
                      Sunucu Kasasıyla VDS Kirala (450₺)
                    </button>
                    <button
                      onClick={() => {
                        const res = rentVds('personal')
                        setVdsFeedback(res.message)
                      }}
                      className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-emerald-300 font-bold text-xs cursor-pointer border border-emerald-500/30"
                    >
                      Şahsi Cüzdandan Kirala (450₺)
                    </button>
                  </div>
                ) : (
                  <div className="p-3.5 rounded-xl bg-[#0d0f14] border border-emerald-500/40 font-mono text-xs space-y-1.5 shrink-0">
                    <div className="text-[10px] text-emerald-400 font-bold uppercase">🔑 VDS Uzak Bağlantı Bilgileriniz:</div>
                    <div className="text-zinc-300">IP Adresi: <strong className="text-white select-all">{vdsIp}</strong></div>
                    <div className="text-zinc-300">Erişim Kodu: <strong className="text-amber-400 select-all">{vdsAccessCode}</strong></div>
                    <div className="text-[10px] text-sky-400 pt-1">
                      ➔ Masaüstünden "Uzaktan Bağlantı (VDS)" uygulamasını açıp bağlanın!
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Bot Catalog Preview (Directs player to VDS Desktop) */}
            <div className="space-y-3">
              <div className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                VDS Üzerinden Kurulabilir Bot Kataloğu (Satın Alma ve Aktivasyon VDS Masaüstünden Yapılır)
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { id: 'automod_bot', title: 'AutoMod Guardian v2', desc: 'Aşırı spam ve zararlı linkleri yakalayıp uyarır. Küfürleri otomatik filtreler.', cost: 800 },
                  { id: 'music_bot', title: 'RitimBot (Müzik & Hype)', desc: 'Ses odalarını müzikle doldurur, !play komutlarıyla sunucu Hype oranını artırır.', cost: 650 },
                  { id: 'casino_bot', title: 'KasaBot (Kumarhane & Pasif Gelir)', desc: 'Üyelerin chatte !slot oynamasını sağlar; her bahisten +15₺ kasa komisyonu sunucuya akar.', cost: 1100 },
                  { id: 'antiraid_bot', title: 'Anti-Raid DDoS Kalkanı', desc: 'Toplu bot saldırılarını ve ani baskınları engeller.', cost: 1500 }
                ].map((bot) => {
                  const isOwned = ownedBots.includes(bot.id)
                  const isActive = activeBots.includes(bot.id)
                  return (
                    <div key={bot.id} className="p-4 rounded-xl bg-[#15171d] border border-[#242732] flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between">
                          <h3 className="text-xs font-bold text-white">{bot.title}</h3>
                          <span className="font-mono text-xs font-bold text-purple-300">{bot.cost}₺</span>
                        </div>
                        <p className="text-[11px] text-zinc-400 mt-1">{bot.desc}</p>
                      </div>
                      <div className="mt-4 pt-3 border-t border-[#232630] flex items-center justify-between">
                        <span className="font-mono text-[10px] text-zinc-400">
                          {isActive ? '🟢 VDS Üzerinde Aktif' : isOwned ? '🟡 VDS’de Kurulu (Pasif)' : '🔒 VDS Masaüstünden Alınır'}
                        </span>
                        <span className="px-2.5 py-1 rounded bg-[#1d202a] border border-[#2e3344] text-[10px] font-mono text-purple-300">
                          {hasVds ? 'Uzaktan Bağlantı (VDS) ➔ BotMarket' : 'Önce VDS Kirala'}
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )}

        {/* SITE 7: CryptoPay Bank */}
        {activeTab.url.includes('cryptopay.local') && (
          <div className="max-w-3xl mx-auto p-6 space-y-6 animate-in fade-in duration-150">
            <div className="border-b border-[#252831] pb-3 flex items-center justify-between">
              <div>
                <h1 className="text-xl font-bold text-white flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-emerald-400" />
                  CryptoPay — Dijital Cüzdan & Borsa
                </h1>
                <p className="text-xs text-zinc-400 mt-0.5">Kişisel kazançlarını güvenle sakla veya kripto para ticareti yap.</p>
              </div>
              <span className="font-mono text-xs font-bold text-emerald-400">{personalCash}₺</span>
            </div>

            <div className="p-5 rounded-xl bg-[#15171d] border border-[#242732] space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs text-zinc-400">Bitcoin (BTC) Fiyatı:</div>
                  <div className="text-xl font-mono font-bold text-white mt-1">{cryptoPrice}₺</div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-zinc-400">Cüzdanındaki BTC:</div>
                  <div className="text-xl font-mono font-bold text-amber-400 mt-1">{cryptoAmount.toFixed(4)} BTC</div>
                </div>
              </div>

              {cryptoFeedback && (
                <div className="text-xs font-mono text-emerald-400 bg-emerald-950/30 p-2 rounded border border-emerald-900/40">
                  {cryptoFeedback}
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => {
                    if (personalCash >= 100) {
                      adjustPersonalCash(-100)
                      setCryptoAmount((prev) => prev + (100 / cryptoPrice))
                      setCryptoFeedback('100₺ karşılığında BTC satın alındı.')
                    }
                  }}
                  className="flex-1 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors shadow"
                >
                  100₺ Değerinde BTC Al
                </button>
                <button
                  onClick={() => {
                    if (cryptoAmount >= 0.05) {
                      const soldCash = Math.floor(0.05 * cryptoPrice)
                      setCryptoAmount((prev) => prev - 0.05)
                      adjustPersonalCash(soldCash)
                      setCryptoFeedback(`0.05 BTC bozduruldu, +${soldCash}₺ nakit aktarıldı.`)
                    }
                  }}
                  className="flex-1 py-2.5 rounded-lg bg-zinc-700 hover:bg-zinc-600 text-white font-bold text-xs transition-colors"
                >
                  0.05 BTC Sat ve Bozdur
                </button>
              </div>
            </div>
          </div>
        )}

        {/* SITE 8: Stam Games Official & Scammy Download Portal */}
        {activeTab.url.includes('stam.games') && (
          <div className="w-full h-full min-h-[560px] flex flex-col items-center justify-center bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#112419] via-[#09110d] to-black p-8 text-center select-none relative overflow-hidden animate-in fade-in duration-200">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/20 border border-amber-400 text-amber-300 text-xs font-black tracking-wider uppercase animate-bounce mb-6">
              <span>🚨 DİKKAT:</span>
              <span>1.000.000'UNCU ZİYARETÇİMİZ SİZSİNİZ! BUGÜNE ÖZEL TAMAMEN ÜCRETSİZ!</span>
            </div>

            <div className="space-y-3 mb-8">
              <h1 className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-yellow-300 to-lime-400 uppercase tracking-tight drop-shadow-[0_0_35px_rgba(34,197,94,0.5)]">
                STAM CLIENT v4.9 FINAL
              </h1>
              <p className="text-sm font-bold text-zinc-300 tracking-wide font-mono">
                🛡️ %100 ONAYLI KURULUM • VIRUS_FREE_CLEAN • TÜM RETRO OYUNLARI AÇAR
              </p>
            </div>

            {stamNotice && (
              <div className="max-w-md mx-auto mb-6 p-3 rounded-xl bg-amber-950/80 border-2 border-amber-500 text-amber-200 text-xs font-mono font-bold animate-in zoom-in-95 duration-200 shadow-2xl flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                <span>{stamNotice}</span>
              </div>
            )}

            <div className="w-full max-w-lg mx-auto">
              {isDownloadingStam ? (
                <div className="space-y-3 p-6 bg-[#0c0e14] rounded-2xl border border-emerald-500/50 shadow-2xl">
                  <div className="flex items-center justify-between text-xs font-mono font-bold text-emerald-400">
                    <span>İndiriliyor: StamSetup_v4.9.exe</span>
                    <span>%{downloadProgress}</span>
                  </div>
                  <div className="w-full h-4 bg-zinc-800 rounded-full overflow-hidden p-0.5 border border-emerald-500/30">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-500 to-lime-400 rounded-full transition-all duration-300"
                      style={{ width: `${downloadProgress}%` }}
                    />
                  </div>
                  <p className="text-[11px] text-zinc-400 font-mono animate-pulse">
                    Dosyalar doğrulanıyor ve masaüstüne kısayol kuruluyor...
                  </p>
                </div>
              ) : (
                <button
                  onClick={() => {
                    if (isStamInstalled) {
                      soundEngine.playDiscordPing()
                      setStamNotice("⚠️ Bu uygulama zaten bilgisayarınızda yüklü! Masaüstündeki 'Stam' kısayolunu açarak retro oyunları kütüphanenize ekleyebilir ve oynayabilirsiniz.")
                      setTimeout(() => setStamNotice(null), 5000)
                      return
                    }
                    setIsDownloadingStam(true)
                    setDownloadProgress(15)
                    soundEngine.playKeyClick()
                    setTimeout(() => setDownloadProgress(55), 350)
                    setTimeout(() => setDownloadProgress(90), 750)
                    setTimeout(() => {
                      setDownloadProgress(100)
                      setIsDownloadingStam(false)
                      installStamClient()
                      setStamNotice("✅ Kurulum tamamlandı! Stam istemcisi masaüstüne başarıyla kuruldu. Masaüstünden açabilirsiniz.")
                      setTimeout(() => setStamNotice(null), 5000)
                    }, 1100)
                  }}
                  className="w-full py-6 px-8 rounded-2xl bg-gradient-to-r from-emerald-500 via-lime-400 to-green-500 hover:from-emerald-400 hover:to-lime-300 text-black font-black text-2xl tracking-wide shadow-[0_0_60px_rgba(34,197,94,0.6)] animate-pulse hover:animate-none hover:scale-105 active:scale-95 transition-all transform cursor-pointer border-4 border-yellow-300 flex flex-col items-center justify-center gap-1"
                >
                  <span className="flex items-center gap-2">
                    <span>⬇️</span>
                    <span>HEMEN İNDİR (DOWNLOAD FREE)</span>
                    <span>⬇️</span>
                  </span>
                  <span className="text-[11px] font-mono font-bold text-emerald-950 uppercase tracking-widest">
                    [ StamSetup_v4.9_Final.exe • 42.8 MB • TEK TIKLA KURULUM ]
                  </span>
                </button>
              )}
            </div>

            <div className="grid grid-cols-3 gap-6 max-w-lg mx-auto mt-8 font-mono text-xs text-zinc-400 border-t border-zinc-800/80 pt-4">
              <div className="flex items-center justify-center gap-2">
                <span className="text-emerald-400 font-bold text-base">✓</span>
                <span>Antivirüs Temiz</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <span className="text-emerald-400 font-bold text-base">✓</span>
                <span>Sıfır Reklam</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <span className="text-emerald-400 font-bold text-base">✓</span>
                <span>Snake & Mayın Tarlası</span>
              </div>
            </div>
          </div>
        )}

        {/* SITE 10: DarkWeb Onion Search Engine */}
        {(activeTab.url.includes('darkweb') || activeTab.url.includes('onion')) && (
          <div className="w-full h-full min-h-[580px] bg-[#07080c] text-zinc-200 p-6 font-mono select-none overflow-y-auto animate-in fade-in duration-200">
            <div className="max-w-4xl mx-auto space-y-6">
              <div className="text-center space-y-2 py-4 border-b border-red-950/60">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-950/50 border border-red-700/60 text-red-400 text-xs font-bold uppercase tracking-widest">
                  <Skull className="w-3.5 h-3.5 text-red-500 animate-pulse" />
                  <span>TOR DARKNET PROTOCOL v3.9 • ONION ROUTING</span>
                </div>
                <h1 className="text-3xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-rose-400 to-amber-500 uppercase tracking-wider font-mono">
                  DARKNET SEARCH & UNDERGROUND
                </h1>
                <p className="text-xs text-zinc-400">
                  Anonim arama motoru • Sıfır log politikası • Derin ağ hizmetleri & Discord araçları
                </p>
              </div>

              <div className="max-w-xl mx-auto">
                <div className="h-12 bg-[#0e1017] border-2 border-red-900/60 rounded-xl px-4 flex items-center gap-3 shadow-[0_0_30px_rgba(239,68,68,0.2)] focus-within:border-red-500 transition-colors">
                  <Terminal className="w-4 h-4 text-red-400" />
                  <span className="text-red-400 font-bold text-xs">[root@onion ~]#</span>
                  <input
                    type="text"
                    placeholder="hizmet veya araç ara (örn: raid, botnet, exploit, token)..."
                    className="bg-transparent text-xs text-white placeholder-zinc-600 outline-none flex-1 font-mono"
                  />
                </div>
              </div>

              {darkWebFeedback && (
                <div className="max-w-xl mx-auto p-3 rounded-lg bg-red-950/60 border border-red-500/60 text-xs font-mono text-red-200 text-center animate-in fade-in">
                  {darkWebFeedback}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                {/* 1. Operation Rival Down (Rakip Sunucuya DDoS & Bot Saldırısı) */}
                <div className="p-4 rounded-xl bg-[#0c0d13] border border-red-900/40 hover:border-red-500/60 transition-colors flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="px-2 py-0.5 rounded bg-red-950 text-red-400 text-[10px] font-bold border border-red-800/40 uppercase">
                        💥 SABOTAJ & DDOS
                      </span>
                      <span className="font-bold text-red-400 text-sm">300₺</span>
                    </div>
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <span>Operasyon: Rakip Sunucuyu Çökert (DDoS)</span>
                    </h3>
                    <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                      Rakip topluluk "Alpha Gaming TR" sunucusunu 128 zombi node ile çökertin. Hype'larını sıfırlayın ve dağılan 30+ üyeyi Root Topluluk'a göç ettirin!
                    </p>
                  </div>

                  <button
                    disabled={isAttackingRival}
                    onClick={() => {
                      if (personalCash < 300) {
                        setDarkWebFeedback('❌ Yetersiz şahsi bakiye! 300₺ gereklidir.')
                        setTimeout(() => setDarkWebFeedback(null), 3500)
                        return
                      }
                      adjustPersonalCash(-300)
                      soundEngine.playCoinChime()
                      setIsAttackingRival(true)
                      setRivalAttackLogs([
                        '[*] Hedef: Alpha Gaming TR (guild_id: 8849102941)',
                        '[*] 128 Zombi Node ile SYN-Flood saldırısı başlatıldı...'
                      ])

                      setTimeout(() => {
                        setRivalAttackLogs((prev) => [
                          ...prev,
                          '[!] 4.8 Gbps UDP junk traffic basılıyor... Ping: 1200ms+'
                        ])
                      }, 1000)

                      setTimeout(() => {
                        setRivalAttackLogs((prev) => [
                          ...prev,
                          '[+] HEDEF SUNUCU ÇÖKTÜ! Discord bağlantısı koptu.',
                          '[+] 35 rakip üye kaçarak Root Topluluk Sunucusu\'na göç ediyor!'
                        ])
                        soundEngine.playSuccess()
                        launchAdCampaign('medium', 'personal')
                        setHype((h) => Math.min(100, h + 22))
                        setDarkWebFeedback('💥 Rakip sunucu yerle bir edildi! +35 yeni üye sunucumuza katılıyor, Hype +%22 arttı!')
                        setTimeout(() => {
                          setIsAttackingRival(false)
                          setTimeout(() => setDarkWebFeedback(null), 5000)
                        }, 2500)
                      }, 2500)
                    }}
                    className={`w-full py-2.5 rounded-lg text-white font-bold text-xs transition-colors flex items-center justify-center gap-2 shadow-lg shadow-red-900/40 cursor-pointer ${
                      isAttackingRival ? 'bg-zinc-800 text-zinc-400 cursor-wait' : 'bg-red-700 hover:bg-red-600'
                    }`}
                  >
                    <Skull className="w-4 h-4 text-white" />
                    <span>{isAttackingRival ? 'Saldırı Sürüyor...' : 'Rakip Sunucuyu Çökert (300₺)'}</span>
                  </button>
                </div>

                {/* 2. Efe_Leaks.zip (Kurucu Efe'nin Eski İfşaları) */}
                <div className="p-4 rounded-xl bg-[#0c0d13] border border-amber-900/40 hover:border-amber-500/60 transition-colors flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="px-2 py-0.5 rounded bg-amber-950 text-amber-400 text-[10px] font-bold border border-amber-800/40 uppercase">
                        📁 SIZINTI VERİ (LEAKS)
                      </span>
                      <span className="font-bold text-amber-400 text-sm">350₺</span>
                    </div>
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <span>Efe_Leaks.zip (Kurucu'nun Gizli Ses Kayıtları)</span>
                    </h3>
                    <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                      Kurucu Efe'nin eski sunucusundaki sahte çekiliş itirafları ve ifşaları. Kurucuya karşı elinde şantaj kozu tut!
                    </p>
                  </div>

                  {!efeLeaksPurchased ? (
                    <button
                      onClick={() => {
                        if (personalCash < 350) {
                          setDarkWebFeedback('❌ Yetersiz şahsi bakiye! 350₺ gereklidir.')
                          setTimeout(() => setDarkWebFeedback(null), 3500)
                          return
                        }
                        adjustPersonalCash(-350)
                        soundEngine.playSuccess()
                        setEfeLeaksPurchased(true)
                        setDarkWebFeedback('📂 Efe_Leaks.zip indirildi ve şifresi çözüldü! Aşağıdan ne yapacağını seç.')
                      }}
                      className="w-full py-2.5 rounded-lg bg-amber-700 hover:bg-amber-600 text-white font-bold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer shadow"
                    >
                      <Terminal className="w-4 h-4 text-white" />
                      <span>İfşa Dosyasını Satın Al (350₺)</span>
                    </button>
                  ) : (
                    <div className="space-y-2 pt-1 border-t border-amber-900/40">
                      <div className="text-[10px] text-amber-300 font-bold uppercase">Koz Hazır: Eylem Seçin</div>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          disabled={efeLeaksDecision !== null}
                          onClick={() => {
                            setEfeLeaksDecision('blackmail')
                            adjustPersonalCash(350)
                            soundEngine.playCoinChime()
                            addBankTransaction({
                              title: '🤫 Kurucu Efe Sessizlik Ödemesi (Şantaj Primi)',
                              amount: 350,
                              type: 'income',
                              account: 'personal'
                            })
                            setDarkWebFeedback('💸 Kurucu Efe paniğe kapıldı! "Tamam sus sakın yayma!" diyerek hesabına anında 350₺ sessiz prim yatırdı.')
                          }}
                          className={`p-2 rounded text-[11px] font-bold border transition-colors ${
                            efeLeaksDecision === 'blackmail'
                              ? 'bg-emerald-900/60 border-emerald-500 text-emerald-300'
                              : 'bg-zinc-900 hover:bg-amber-900/50 border-amber-700/50 text-amber-200'
                          }`}
                        >
                          🤫 Şantaj Yap (+350₺)
                        </button>
                        <button
                          disabled={efeLeaksDecision !== null}
                          onClick={() => {
                            setEfeLeaksDecision('archive')
                            setSanity((s) => Math.min(100, s + 35))
                            soundEngine.playSuccess()
                            setDarkWebFeedback('🛡️ Dosyayı kasaya kilitledin. Kurucuya sadık kalarak vicdanın rahatladı (+%35 Akıl Sağlığı).')
                          }}
                          className={`p-2 rounded text-[11px] font-bold border transition-colors ${
                            efeLeaksDecision === 'archive'
                              ? 'bg-sky-900/60 border-sky-500 text-sky-300'
                              : 'bg-zinc-900 hover:bg-sky-900/50 border-sky-700/50 text-sky-200'
                          }`}
                        >
                          🛡️ Kasaya Kilitle (+35 Ruh)
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* 3. Shadow Swarm (50 Hayalet Hype Botu) */}
                <div className="p-4 rounded-xl bg-[#0c0d13] border border-indigo-900/40 hover:border-indigo-500/60 transition-colors flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="px-2 py-0.5 rounded bg-indigo-950 text-indigo-400 text-[10px] font-bold border border-indigo-800/40 uppercase">
                        🤖 HAYALET BOT AĞI
                      </span>
                      <span className="font-bold text-indigo-400 text-sm">200₺</span>
                    </div>
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <span>Shadow Swarm: 50 Hayalet Hype Botu</span>
                    </h3>
                    <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                      Sunucuyu kalabalık göstermek için 50 gerçekçi hayalet üyeyi kanallara akıtın. Hype oranınızı anında şaha kaldırır!
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      if (personalCash < 200) {
                        setDarkWebFeedback('❌ Yetersiz şahsi bakiye! 200₺ gereklidir.')
                        setTimeout(() => setDarkWebFeedback(null), 3500)
                        return
                      }
                      adjustPersonalCash(-200)
                      soundEngine.playSuccess()
                      launchAdCampaign('mega', 'personal')
                      setHype((h) => Math.min(100, h + 15))
                      setDarkWebFeedback('🤖 50 Hayalet Bot sunucuya sızdırıldı! Hype +%15 arttı ve online üye sayısı katlandı.')
                      setTimeout(() => setDarkWebFeedback(null), 4500)
                    }}
                    className="w-full py-2.5 rounded-lg bg-indigo-700 hover:bg-indigo-600 text-white font-bold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer shadow"
                  >
                    <span>Hayalet Ağı Devreye Al (200₺)</span>
                  </button>
                </div>

                {/* 4. Crypto Mixer (Kara Para / Kripto Aklama) */}
                <div className="p-4 rounded-xl bg-[#0c0d13] border border-emerald-900/40 hover:border-emerald-500/60 transition-colors flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 text-[10px] font-bold border border-emerald-800/40 uppercase">
                        🧼 TOR CRYPTO MIXER
                      </span>
                      <span className="font-bold text-emerald-400 text-sm">150₺</span>
                    </div>
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <span>Tor Kripto & Kara Para Mikseri</span>
                    </h3>
                    <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                      Elde edilen şüpheli rüşvet veya kaçak paraları 16 ara cüzdandan geçirerek aklayın. Tertemiz 280₺ olarak NeoBank hesabınıza aktarır!
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      if (personalCash < 150) {
                        setDarkWebFeedback('❌ Yetersiz şahsi bakiye! 150₺ gereklidir.')
                        setTimeout(() => setDarkWebFeedback(null), 3500)
                        return
                      }
                      adjustPersonalCash(-150)
                      soundEngine.playCoinChime()
                      setDarkWebFeedback('🔄 Kripto mikser çalışıyor: 16 ara cüzdanda coinler karıştırılıyor...')

                      setTimeout(() => {
                        adjustPersonalCash(280)
                        setSanity((s) => Math.min(100, s + 25))
                        soundEngine.playSuccess()
                        addBankTransaction({
                          title: '💎 Tor Mixer: Aklanmış Temiz Kripto Ödemesi',
                          amount: 280,
                          type: 'income',
                          account: 'personal'
                        })
                        setDarkWebFeedback('✅ Para başarıyla aklandı! +280₺ temiz nakit NeoBank hesabınıza yattı, stresiniz azaldı.')
                        setTimeout(() => setDarkWebFeedback(null), 4500)
                      }, 1800)
                    }}
                    className="w-full py-2.5 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer shadow"
                  >
                    <span>Parayı Akla & Çevir (150₺ ➔ 280₺)</span>
                  </button>
                </div>
              </div>

              {/* Terminal Attack Live Output Display */}
              {rivalAttackLogs.length > 0 && (
                <div className="max-w-2xl mx-auto p-4 rounded-xl bg-black border border-red-500/50 font-mono text-[11px] space-y-1 shadow-2xl text-red-400">
                  <div className="text-[10px] text-zinc-500 uppercase tracking-widest border-b border-red-900/50 pb-1 mb-2 flex items-center justify-between">
                    <span>LIVE DDOS CONSOLE</span>
                    <span className="animate-pulse text-red-400">● RUNNING</span>
                  </div>
                  {rivalAttackLogs.map((log, i) => (
                    <div key={i} className="leading-snug">{log}</div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* SITE 9: ModAds — Sunucu Reklam & Büyütme Portalı (Gradual Trickle - Item #14) */}
        {activeTab.url.includes('adclick.mod') && (
          <div className="max-w-4xl mx-auto p-6 space-y-6 animate-in fade-in duration-150">
            <div className="border-b border-[#252831] pb-3 flex items-center justify-between">
              <div>
                <h1 className="text-xl font-bold text-white flex items-center gap-2">
                  <Megaphone className="w-6 h-6 text-yellow-400" />
                  ModAds Network — Sunucu Reklam & Büyütme Portalı
                </h1>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Sponsorlu reklamlar vererek sunucunun Hype'ını artır; yeni üyeler kampanya boyunca yavaş yavaş sunucuya katılır!
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="px-3 py-1.5 rounded-lg bg-[#181a20] border border-[#272a38] text-right">
                  <span className="text-[10px] text-zinc-400 block font-mono">Sunucu Kasası</span>
                  <span className="font-mono text-xs font-bold text-sky-400">{serverFunds}₺</span>
                </div>
                <div className="px-3 py-1.5 rounded-lg bg-[#181a20] border border-[#272a38] text-right">
                  <span className="text-[10px] text-zinc-400 block font-mono">Şahsi Cüzdan</span>
                  <span className="font-mono text-xs font-bold text-emerald-400">{personalCash}₺</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div
                onClick={() => setAdTier('small')}
                className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                  adTier === 'small'
                    ? 'bg-yellow-950/20 border-yellow-500 ring-2 ring-yellow-500/30'
                    : 'bg-[#15171d] border-[#252834] hover:border-zinc-600'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 font-mono text-[10px] font-bold">
                      MİKRO SPONSORLUK
                    </span>
                    <span className="font-mono text-base font-black text-yellow-400">150₺</span>
                  </div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                    📢 Hedefli Topluluk İlanı
                  </h3>
                  <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                    Oyun sunucularının duyuru panolarında kısa süreli sponsorluk. Üyeler kademeli olarak giriş yapar.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-[#20232c] flex items-center justify-between text-[11px] font-mono text-zinc-300">
                  <span className="text-emerald-400 font-bold">+8 Üye (Kademeli)</span>
                  <span className="text-amber-400 font-bold">+10 Hype</span>
                </div>
              </div>

              <div
                onClick={() => setAdTier('medium')}
                className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between relative ${
                  adTier === 'medium'
                    ? 'bg-yellow-950/30 border-yellow-400 ring-2 ring-yellow-500/40 shadow-lg shadow-yellow-500/10'
                    : 'bg-[#15171d] border-[#252834] hover:border-zinc-600'
                }`}
              >
                <div className="absolute -top-2.5 right-3 px-2 py-0.5 rounded-full bg-yellow-500 text-black text-[9px] font-extrabold tracking-wider uppercase">
                  En Popüler
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-2 py-0.5 rounded bg-amber-950 text-amber-300 font-mono text-[10px] font-bold border border-amber-800/40">
                      TREND ORTAKLIĞI
                    </span>
                    <span className="font-mono text-base font-black text-yellow-400">350₺</span>
                  </div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                    🔥 Influencer & Yayıncı Desteği
                  </h3>
                  <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                    Popüler yayıncı Discord'larında ortak çekiliş duyurusu. Yeni üyeler yavaş yavaş akın eder!
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-[#20232c] flex items-center justify-between text-[11px] font-mono text-zinc-300">
                  <span className="text-emerald-400 font-bold">+22 Üye (Kademeli)</span>
                  <span className="text-amber-400 font-bold">+22 Hype</span>
                </div>
              </div>

              <div
                onClick={() => setAdTier('mega')}
                className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                  adTier === 'mega'
                    ? 'bg-yellow-950/20 border-yellow-500 ring-2 ring-yellow-500/30'
                    : 'bg-[#15171d] border-[#252834] hover:border-zinc-600'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-2 py-0.5 rounded bg-purple-950 text-purple-300 font-mono text-[10px] font-bold border border-purple-800/40">
                      MANŞET BLAST
                    </span>
                    <span className="font-mono text-base font-black text-yellow-400">750₺</span>
                  </div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                    👑 Keşfet Vitrini & Mega Blast
                  </h3>
                  <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                    Keşfet vitrininde en tepeye sabitlenir. Toplam 50 yeni üye zaman içinde sunucuya katılır!
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-[#20232c] flex items-center justify-between text-[11px] font-mono text-zinc-300">
                  <span className="text-emerald-400 font-bold">+50 Üye (Kademeli)</span>
                  <span className="text-amber-400 font-bold">+40 Hype</span>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#15171d] border border-[#252834] space-y-3">
              <div className="text-xs font-bold text-white flex items-center gap-2">
                <span>💳 Bütçe Kaynağı Belirle:</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setAdSource('server')}
                  className={`p-3 rounded-lg border text-left transition-all cursor-pointer flex items-center justify-between ${
                    adSource === 'server'
                      ? 'bg-sky-950/30 border-sky-500 text-sky-200'
                      : 'bg-[#111217] border-[#242732] text-zinc-400 hover:text-white'
                  }`}
                >
                  <div>
                    <div className="text-xs font-bold">Sunucu Kasasından Karşıla</div>
                    <div className="text-[11px] text-zinc-500 mt-0.5">Topluluk fonu harcanır</div>
                  </div>
                  <span className="font-mono text-xs font-bold text-sky-400">{serverFunds}₺</span>
                </button>

                <button
                  type="button"
                  onClick={() => setAdSource('personal')}
                  className={`p-3 rounded-lg border text-left transition-all cursor-pointer flex items-center justify-between ${
                    adSource === 'personal'
                      ? 'bg-emerald-950/30 border-emerald-500 text-emerald-200'
                      : 'bg-[#111217] border-[#242732] text-zinc-400 hover:text-white'
                  }`}
                >
                  <div>
                    <div className="text-xs font-bold">Kişisel Cebimden Karşıla</div>
                    <div className="text-[11px] text-zinc-500 mt-0.5">Maaş & rüşvet bakiyesi harcanır</div>
                  </div>
                  <span className="font-mono text-xs font-bold text-emerald-400">{personalCash}₺</span>
                </button>
              </div>
            </div>

            {adFeedback && (
              <div className="p-3 rounded-lg bg-yellow-950/30 border border-yellow-800/40 text-yellow-300 text-xs font-medium flex items-center gap-2 animate-in fade-in">
                <Sparkles className="w-4 h-4 text-yellow-400 shrink-0" />
                <span>{adFeedback}</span>
              </div>
            )}

            <div>
              <button
                onClick={() => {
                  const res = launchAdCampaign(adTier, adSource)
                  setAdFeedback(res.message)
                }}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-400 hover:to-amber-500 text-black font-extrabold text-sm transition-all shadow-lg shadow-yellow-500/20 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Megaphone className="w-4 h-4" />
                {adTier === 'small' ? '150₺ Karşılığı' : adTier === 'medium' ? '350₺ Karşılığı' : '750₺ Karşılığı'} Kampanyayı Başlat ve Üyeleri Çek!
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
