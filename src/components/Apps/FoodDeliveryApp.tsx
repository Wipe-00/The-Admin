import React, { useState } from 'react'
import {
  Utensils,
  Coffee,
  Cat,
  ShoppingBag,
  Plus,
  Minus,
  Trash2,
  CheckCircle2,
  Bike,
  Sparkles,
  ReceiptText
} from 'lucide-react'
import { useGame } from '../../context/GameContext'
import { soundEngine } from '../../utils/soundEngine'

interface FoodItem {
  id: string
  name: string
  category: 'coffee' | 'cat' | 'food'
  price: number
  sanityBonus: number
  imageEmoji: string
  desc: string
  isCatItem?: boolean
}

const MENU_ITEMS: FoodItem[] = [
  // 1. Kahve & Kafein
  {
    id: 'filter-coffee',
    name: 'Taze Filtre Kahve (Sert)',
    category: 'coffee',
    price: 25,
    sanityBonus: 20,
    imageEmoji: '☕',
    desc: 'Taze çekilmiş Kolombiya çekirdekleri. Gece uykusunu anında dağıtır ve odağı artırır.'
  },
  {
    id: 'double-espresso',
    name: 'Double Espresso Shot',
    category: 'coffee',
    price: 30,
    sanityBonus: 30,
    imageEmoji: '⚡',
    desc: 'Konsantre yüksek kafein patlaması. Aşırı stresli kriz anları için acil durum iksiri.'
  },
  {
    id: 'caramel-macchiato',
    name: 'Buzlu Karamel Macchiato',
    category: 'coffee',
    price: 35,
    sanityBonus: 25,
    imageEmoji: '🧋',
    desc: 'Tatlı karamel şurubu ve soğuk süt köpüğü. Morali ve enerjiyi tavan yaptırır.'
  },
  {
    id: 'energy-drink',
    name: 'Canavar Enerji İçeceği (Mango)',
    category: 'coffee',
    price: 40,
    sanityBonus: 35,
    imageEmoji: '🔋',
    desc: 'Taurin ve B vitaminleri bombası. Bilgisayar başındaki uzun nöbetler için birebir.'
  },

  // 2. Paspas Gurme Köşesi (Masa Kedimiz İçin)
  {
    id: 'cat-salmon',
    name: 'Somonlu Gurme Yaş Kedi Maması',
    category: 'cat',
    price: 15,
    sanityBonus: 15,
    imageEmoji: '🐟',
    desc: 'Paspas için lezzetli somon fileto konservesi. Yediğinde masaya uzanıp mırıldanır.',
    isCatItem: true
  },
  {
    id: 'cat-crunch',
    name: 'Çıtır Tavuklu Ödül Krakerleri',
    category: 'cat',
    price: 20,
    sanityBonus: 20,
    imageEmoji: '🍗',
    desc: 'Paspas bu krakerlerin sesini duyunca klavyenin üzerine atlar ve kendini sevdirir.',
    isCatItem: true
  },
  {
    id: 'cat-catnip',
    name: 'Organik Kedi Nanesi (Catnip) Topu',
    category: 'cat',
    price: 35,
    sanityBonus: 30,
    imageEmoji: '🌿',
    desc: 'Paspas\'ın mutluluktan kendinden geçmesini sağlayan doğal eğlence topu.',
    isCatItem: true
  },

  // 3. Gece Vardiyası Mutfağı
  {
    id: 'smash-burger',
    name: 'Çift Köfteli Smash Cheddar Burger',
    category: 'food',
    price: 85,
    sanityBonus: 45,
    imageEmoji: '🍔',
    desc: 'Köz patlıcan sosu, erimiş çedar ve çıtır patates eşliğinde muazzam bir ziyafet.'
  },
  {
    id: 'pepperoni-pizza',
    name: 'Büyük Dilim Bol Malzemos Pizza',
    category: 'food',
    price: 65,
    sanityBonus: 35,
    imageEmoji: '🍕',
    desc: 'Fırından yeni çıkmış çıtır kenarlı, bol peynirli ve baharatlı sucuklu pizza.'
  },
  {
    id: 'crispy-fries',
    name: 'Çıtır Baharatlı Patates & Soğan Halkası',
    category: 'food',
    price: 45,
    sanityBonus: 25,
    imageEmoji: '🍟',
    desc: 'Kajun baharatlı altın sarısı patatesler ve çıtır soğan halkaları.'
  },
  {
    id: 'kumru-toast',
    name: 'Gece Kaşarlı Tost & Demleme Çay',
    category: 'food',
    price: 35,
    sanityBonus: 25,
    imageEmoji: '🥪',
    desc: 'Sanayi tostu lezzetinde bol kaşarlı sıcak tost ve taze demlenmiş bardak çay.'
  }
]

interface CartItem {
  item: FoodItem
  quantity: number
}

interface OrderRecord {
  id: string
  items: CartItem[]
  totalPrice: number
  date: string
}

export const FoodDeliveryApp: React.FC = () => {
  const {
    personalCash,
    adjustPersonalCash,
    setSanity,
    addBankTransaction,
    pushNotification
  } = useGame()

  const [activeCategory, setActiveCategory] = useState<'all' | 'coffee' | 'cat' | 'food'>('all')
  const [cart, setCart] = useState<CartItem[]>([])
  const [activeTab, setActiveTab] = useState<'menu' | 'orders'>('menu')
  const [orderHistory, setOrderHistory] = useState<OrderRecord[]>([])
  const [isDelivering, setIsDelivering] = useState(false)
  const [deliveryProgress, setDeliveryProgress] = useState(0)
  const [lastDeliveredNotice, setLastDeliveredNotice] = useState<string | null>(null)

  // Filter items
  const filteredItems = MENU_ITEMS.filter((m) => {
    if (activeCategory === 'all') return true
    return m.category === activeCategory
  })

  // Add to cart
  const addToCart = (item: FoodItem) => {
    soundEngine.playKeyClick()
    setCart((prev) => {
      const existing = prev.find((c) => c.item.id === item.id)
      if (existing) {
        return prev.map((c) =>
          c.item.id === item.id ? { ...c, quantity: c.quantity + 1 } : c
        )
      }
      return [...prev, { item, quantity: 1 }]
    })
  }

  // Update quantity
  const updateQuantity = (itemId: string, delta: number) => {
    soundEngine.playKeyClick()
    setCart((prev) =>
      prev
        .map((c) => {
          if (c.item.id === itemId) {
            const nextQty = c.quantity + delta
            return nextQty > 0 ? { ...c, quantity: nextQty } : null
          }
          return c
        })
        .filter(Boolean) as CartItem[]
    )
  }

  // Clear cart
  const clearCart = () => {
    soundEngine.playKeyClick()
    setCart([])
  }

  // Calculate totals
  const subtotal = cart.reduce((acc, c) => acc + c.item.price * c.quantity, 0)
  const deliveryFee = subtotal >= 100 || subtotal === 0 ? 0 : 10
  const grandTotal = subtotal + deliveryFee

  // Checkout order
  const handleCheckout = () => {
    if (cart.length === 0) return

    if (personalCash < grandTotal) {
      soundEngine.playDiscordPing()
      pushNotification({
        type: 'bank',
        title: '❌ Yetersiz Bakiye',
        message: `Yemek Poşeti siparişiniz için ${grandTotal}₺ gerekli! (Şahsi Bakiye: ${personalCash}₺)`
      })
      return
    }

    // Deduct cash and start courier delivery
    adjustPersonalCash(-grandTotal)
    soundEngine.playCoinChime()
    setIsDelivering(true)
    setDeliveryProgress(0)

    addBankTransaction({
      title: `🛵 Yemek Poşeti Siparişi (${cart.length} çeşit ürün)`,
      amount: grandTotal,
      type: 'expense',
      account: 'personal'
    })

    // Simulate courier ride
    const interval = setInterval(() => {
      setDeliveryProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          return 100
        }
        return prev + 35
      })
    }, 400)

    setTimeout(() => {
      clearInterval(interval)
      setIsDelivering(false)
      soundEngine.playMailChime()

      // Calculate total sanity gained
      const totalSanity = cart.reduce((acc, c) => acc + c.item.sanityBonus * c.quantity, 0)
      setSanity((s) => Math.min(100, s + totalSanity))

      const hasCatFood = cart.some((c) => c.item.isCatItem)
      const noticeText = hasCatFood
        ? `🛵 Kurye siparişinizi getirdi! Afiyet olsun (+${totalSanity} Akıl Sağlığı). Paspas somonlu mamayı görünce keyifle mırıldandı!`
        : `🛵 Kurye sıcacık siparişinizi teslim etti! (+${totalSanity} Akıl Sağlığı yenilendi).`

      setLastDeliveredNotice(noticeText)
      pushNotification({
        type: 'system',
        title: '🛵 Siparişiniz Kapıda!',
        message: noticeText
      })

      // Add to history
      const newRecord: OrderRecord = {
        id: `ord-${Date.now()}`,
        items: [...cart],
        totalPrice: grandTotal,
        date: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
      }
      setOrderHistory((prev) => [newRecord, ...prev])
      setCart([])

      setTimeout(() => setLastDeliveredNotice(null), 6000)
    }, 1600)
  }

  return (
    <div className="flex h-full w-full bg-[#121318] text-zinc-200 font-['Plus_Jakarta_Sans',sans-serif] select-none">
      {/* Left Menu / Catalog */}
      <div className="flex-1 flex flex-col min-w-0 border-r border-[#262833]">
        {/* Top Header */}
        <div className="p-4 bg-[#181920] border-b border-[#262833] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-orange-600 to-amber-500 flex items-center justify-center text-white shadow-lg shadow-orange-950/40">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <div className="text-base font-black text-white flex items-center gap-2">
                <span>Yemek Poşeti</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-400 border border-orange-500/30 font-bold">
                  Hızlı Teslimat
                </span>
              </div>
              <p className="text-xs text-zinc-400">
                Gece vardiyası için taze kahve, atıştırmalık ve Paspas'a mama kapında!
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('menu')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'menu'
                  ? 'bg-orange-600 text-white shadow-md shadow-orange-900/30'
                  : 'bg-[#22242f] text-zinc-400 hover:text-white'
              }`}
            >
              Menü
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'orders'
                  ? 'bg-orange-600 text-white shadow-md shadow-orange-900/30'
                  : 'bg-[#22242f] text-zinc-400 hover:text-white'
              }`}
            >
              <ReceiptText className="w-3.5 h-3.5" />
              <span>Siparişlerim ({orderHistory.length})</span>
            </button>
          </div>
        </div>

        {/* Notice alert */}
        {lastDeliveredNotice && (
          <div className="mx-4 mt-3 p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/50 text-xs font-medium text-emerald-300 flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{lastDeliveredNotice}</span>
          </div>
        )}

        {activeTab === 'menu' ? (
          <>
            {/* Category Filter Pills */}
            <div className="px-4 py-3 border-b border-[#262833] flex items-center gap-2 overflow-x-auto">
              {[
                { id: 'all', label: 'Tüm Ürünler', icon: Sparkles },
                { id: 'coffee', label: 'Kahve & Kafein Barı', icon: Coffee },
                { id: 'cat', label: "Paspas Gurme Köşesi", icon: Cat },
                { id: 'food', label: 'Gece Vardiyası Mutfağı', icon: Utensils }
              ].map((cat) => {
                const Icon = cat.icon
                const active = activeCategory === cat.id
                return (
                  <button
                    key={cat.id}
                    onClick={() => {
                      soundEngine.playKeyClick()
                      setActiveCategory(cat.id as any)
                    }}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                      active
                        ? 'bg-gradient-to-r from-orange-600 to-amber-600 text-white shadow'
                        : 'bg-[#1b1d25] text-zinc-400 hover:text-white hover:bg-[#252833]'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{cat.label}</span>
                  </button>
                )
              })}
            </div>

            {/* Menu Grid */}
            <div className="flex-1 p-4 overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {filteredItems.map((item) => {
                const inCart = cart.find((c) => c.item.id === item.id)
                return (
                  <div
                    key={item.id}
                    className="p-3.5 rounded-xl bg-[#181922] border border-[#262834] hover:border-orange-500/40 transition-all flex flex-col justify-between space-y-3 group"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-14 h-14 rounded-xl bg-[#22242f] flex items-center justify-center text-3xl shrink-0 group-hover:scale-105 transition-transform shadow-inner">
                        {item.imageEmoji}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-1">
                          <h3 className="font-bold text-white text-xs truncate">{item.name}</h3>
                          <span className="font-black text-amber-400 text-xs shrink-0 font-mono">
                            {item.price}₺
                          </span>
                        </div>
                        <p className="text-[11px] text-zinc-400 line-clamp-2 mt-0.5 leading-relaxed">
                          {item.desc}
                        </p>
                        <div className="mt-1.5 flex items-center gap-2">
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-bold">
                            +{item.sanityBonus} Akıl Sağlığı
                          </span>
                          {item.isCatItem && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-500/15 text-purple-400 border border-purple-500/30 font-bold">
                              🐱 Paspas Özel
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-[#252834]">
                      <span className="text-[10px] text-zinc-500 font-mono">Kurye: ~30sn</span>
                      {inCart ? (
                        <div className="flex items-center gap-2 bg-[#232633] px-2 py-1 rounded-lg border border-[#34384a]">
                          <button
                            onClick={() => updateQuantity(item.id, -1)}
                            className="text-zinc-300 hover:text-white cursor-pointer"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="font-bold text-white text-xs font-mono px-1">
                            {inCart.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, 1)}
                            className="text-orange-400 hover:text-orange-300 cursor-pointer"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => addToCart(item)}
                          className="px-3 py-1.5 rounded-lg bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs flex items-center gap-1 shadow-md shadow-orange-900/30 transition-all cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Sepete Ekle</span>
                        </button>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </>
        ) : (
          /* Order History Tab */
          <div className="flex-1 p-5 overflow-y-auto space-y-3">
            {orderHistory.length === 0 ? (
              <div className="text-center py-20 text-zinc-500 text-xs">
                Henüz verilmiş bir siparişiniz bulunmuyor.
              </div>
            ) : (
              orderHistory.map((ord) => (
                <div
                  key={ord.id}
                  className="p-4 rounded-xl bg-[#181922] border border-[#262834] space-y-2 text-xs"
                >
                  <div className="flex items-center justify-between border-b border-[#262834] pb-2">
                    <span className="font-mono text-zinc-400 text-[11px]">{ord.id}</span>
                    <span className="font-bold text-emerald-400">{ord.date} • Teslim Edildi ✓</span>
                  </div>
                  <div className="space-y-1">
                    {ord.items.map((ci) => (
                      <div key={ci.item.id} className="flex justify-between text-zinc-300">
                        <span>
                          {ci.item.imageEmoji} {ci.item.name} x{ci.quantity}
                        </span>
                        <span className="font-mono">{ci.item.price * ci.quantity}₺</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between font-bold text-white pt-2 border-t border-[#262834]">
                    <span>Toplam Ödenen:</span>
                    <span className="text-amber-400 font-mono">{ord.totalPrice}₺</span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Right Side: Live Shopping Cart Panel */}
      <div className="w-80 bg-[#16171f] flex flex-col justify-between shrink-0 p-4">
        <div>
          <div className="flex items-center justify-between pb-3 border-b border-[#282a36]">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-orange-400" />
              <h2 className="font-bold text-white text-xs">Sepetim ({cart.reduce((a, b) => a + b.quantity, 0)})</h2>
            </div>
            {cart.length > 0 && (
              <button
                onClick={clearCart}
                className="text-[10px] text-red-400 hover:text-red-300 font-bold flex items-center gap-1 cursor-pointer"
              >
                <Trash2 className="w-3 h-3" />
                <span>Temizle</span>
              </button>
            )}
          </div>

          {/* Cart Item List */}
          <div className="py-3 space-y-2 max-h-72 overflow-y-auto">
            {cart.length === 0 ? (
              <div className="text-center py-12 text-zinc-500 text-xs space-y-2">
                <div className="text-3xl">🛍️</div>
                <p>Sepetiniz şu an boş.</p>
                <p className="text-[10px] text-zinc-600">
                  Uykunuz geldiyse kahve, Paspas miyavlıyorsa mama ekleyin!
                </p>
              </div>
            ) : (
              cart.map((ci) => (
                <div
                  key={ci.item.id}
                  className="p-2.5 rounded-lg bg-[#1c1d27] border border-[#2b2e3e] flex items-center justify-between text-xs"
                >
                  <div className="min-w-0 pr-2">
                    <div className="font-bold text-white truncate">{ci.item.name}</div>
                    <div className="text-[10px] text-amber-400 font-mono mt-0.5">
                      {ci.item.price}₺ x {ci.quantity} = {ci.item.price * ci.quantity}₺
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0 bg-[#252837] px-1.5 py-0.5 rounded">
                    <button
                      onClick={() => updateQuantity(ci.item.id, -1)}
                      className="text-zinc-400 hover:text-white cursor-pointer"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="font-bold text-white text-[11px] font-mono px-1">
                      {ci.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(ci.item.id, 1)}
                      className="text-orange-400 hover:text-orange-300 cursor-pointer"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Order Summary & Checkout */}
        <div className="border-t border-[#282a36] pt-3 space-y-3">
          <div className="space-y-1.5 text-xs text-zinc-400">
            <div className="flex justify-between">
              <span>Ara Toplam:</span>
              <span className="font-mono text-white">{subtotal}₺</span>
            </div>
            <div className="flex justify-between">
              <span>Kurye Teslimatı:</span>
              <span className="font-mono text-emerald-400">
                {deliveryFee === 0 ? 'ÜCRETSİZ' : `${deliveryFee}₺`}
              </span>
            </div>
            {subtotal > 0 && subtotal < 100 && (
              <div className="text-[10px] text-zinc-500 italic">
                *100₺ üzeri siparişlerde kurye ücretsizdir!
              </div>
            )}
            <div className="flex justify-between text-sm font-black text-white pt-1.5 border-t border-[#282a36]">
              <span>Toplam Tutar:</span>
              <span className="font-mono text-orange-400">{grandTotal}₺</span>
            </div>
          </div>

          {/* Courier Delivering Animation Bar */}
          {isDelivering ? (
            <div className="p-3 rounded-xl bg-orange-950/60 border border-orange-500/50 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-orange-300">
                <span className="flex items-center gap-1.5">
                  <Bike className="w-4 h-4 animate-bounce text-orange-400" />
                  <span>Kurye Yolda...</span>
                </span>
                <span className="font-mono text-[11px]">%{deliveryProgress}</span>
              </div>
              <div className="w-full h-1.5 bg-[#252837] rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-orange-500 to-amber-400 rounded-full transition-all duration-300"
                  style={{ width: `${deliveryProgress}%` }}
                />
              </div>
            </div>
          ) : (
            <button
              disabled={cart.length === 0}
              onClick={handleCheckout}
              className={`w-full py-3 rounded-xl font-black text-xs flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer ${
                cart.length === 0
                  ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed shadow-none'
                  : 'bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white shadow-orange-950/50'
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Sepeti Onayla & Sipariş Ver ({grandTotal}₺)</span>
            </button>
          )}

          <div className="text-[10px] text-center text-zinc-500">
            Ödeme şahsi NeoBank hesabınızdan otomatik tahsil edilir.
          </div>
        </div>
      </div>
    </div>
  )
}
