import React, { useState } from 'react'
import { 
  Landmark, 
  CreditCard, 
  ArrowUpRight, 
  ArrowDownLeft, 
  RefreshCw, 
  ShieldCheck, 
  Copy, 
  Check, 
  FileText, 
  TrendingUp, 
  X,
  Sparkles,
  Coins,
  Percent,
  ChevronRight
} from 'lucide-react'
import { useGame, BankTransaction } from '../../context/GameContext'
import { soundEngine } from '../../utils/soundEngine'

export const BankApp: React.FC = () => {
  const {
    personalCash,
    serverFunds,
    bankTransactions,
    activeLoan,
    creditScore,
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
    iscordAccount
  } = useGame()

  const [activeTab, setActiveTab] = useState<'overview' | 'transfer' | 'crypto' | 'deposit'>('overview')
  const [copiedIban, setCopiedIban] = useState<string | null>(null)

  // Quick Virman Form state
  const [transferMode, setTransferMode] = useState<'serverToPersonal' | 'personalToServer'>('serverToPersonal')
  const [transferAmount, setTransferAmount] = useState<string>('250')
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  // Crypto Trade State
  const [cryptoBuyAmount, setCryptoBuyAmount] = useState<string>('200')
  const [cryptoSellAmount, setCryptoSellAmount] = useState<string>('1')

  // Term Deposit State
  const [depositAmount, setDepositAmount] = useState<string>('500')
  const [depositDays] = useState<number>(7)

  // Statement Filter State
  const [txFilter, setTxFilter] = useState<'all' | 'income' | 'expense'>('all')

  // Receipt Modal state
  const [selectedTx, setSelectedTx] = useState<BankTransaction | null>(null)

  const handleCopyIban = (iban: string, key: string) => {
    soundEngine.playKeyClick()
    navigator.clipboard?.writeText(iban)
    setCopiedIban(key)
    setTimeout(() => setCopiedIban(null), 2200)
  }

  const handleExecuteTransfer = () => {
    const amt = parseInt(transferAmount, 10)
    if (isNaN(amt) || amt <= 0) {
      setFeedback({ type: 'error', message: 'Lütfen geçerli bir transfer tutarı girin.' })
      return
    }

    if (transferMode === 'serverToPersonal') {
      const res = transferToPersonal(amt)
      setFeedback({ type: res.success ? 'success' : 'error', message: res.message })
    } else {
      const res = transferToServer(amt)
      setFeedback({ type: res.success ? 'success' : 'error', message: res.message })
    }
    setTimeout(() => setFeedback(null), 4000)
  }

  const handleBuyCrypto = () => {
    const amt = parseFloat(cryptoBuyAmount)
    if (isNaN(amt) || amt <= 0) {
      setFeedback({ type: 'error', message: 'Geçerli bir TL tutarı giriniz.' })
      return
    }
    const res = buyModCoin(amt)
    setFeedback({ type: res.success ? 'success' : 'error', message: res.message })
    setTimeout(() => setFeedback(null), 4000)
  }

  const handleSellCrypto = () => {
    const amt = parseFloat(cryptoSellAmount)
    if (isNaN(amt) || amt <= 0) {
      setFeedback({ type: 'error', message: 'Geçerli bir MOD miktarı giriniz.' })
      return
    }
    const res = sellModCoin(amt)
    setFeedback({ type: res.success ? 'success' : 'error', message: res.message })
    setTimeout(() => setFeedback(null), 4000)
  }

  const handleOpenDeposit = () => {
    const amt = parseInt(depositAmount, 10)
    if (isNaN(amt) || amt < 200) {
      setFeedback({ type: 'error', message: 'Minimum vadeli mevduat tutarı 200₺\'dir.' })
      return
    }
    const res = openTermDeposit(amt, depositDays)
    setFeedback({ type: res.success ? 'success' : 'error', message: res.message })
    setTimeout(() => setFeedback(null), 4000)
  }

  const handleWithdrawDeposit = () => {
    const res = withdrawTermDeposit()
    setFeedback({ type: res.success ? 'success' : 'error', message: res.message })
    setTimeout(() => setFeedback(null), 4000)
  }

  const handleTakeLoan = (amount: number) => {
    const res = takeBankLoan(amount)
    setFeedback({ type: res.success ? 'success' : 'error', message: res.message })
    setTimeout(() => setFeedback(null), 4000)
  }

  const handleRepayLoan = (amount: number) => {
    const res = repayBankLoan(amount)
    setFeedback({ type: res.success ? 'success' : 'error', message: res.message })
    setTimeout(() => setFeedback(null), 4000)
  }

  const filteredTransactions = bankTransactions.filter((tx) => {
    if (txFilter === 'income') return tx.type === 'income'
    if (txFilter === 'expense') return tx.type === 'expense'
    return true
  })

  const totalNetWorth = personalCash + serverFunds + Math.round(modCoinBalance * modCoinPrice)

  return (
    <div 
      className="flex flex-col h-full w-full bg-[#0a0c12] text-zinc-200 font-sans select-none overflow-hidden"
      onContextMenu={(e) => {
        e.preventDefault()
        e.stopPropagation()
      }}
    >
      {/* 1. Sleek Top Bar */}
      <div className="h-16 px-6 bg-[#11141e]/90 backdrop-blur-md border-b border-[#1f2535] flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-zinc-950 font-black shadow-lg shadow-emerald-500/20">
            <Landmark className="w-5 h-5 text-zinc-950" />
          </div>
          <div>
            <div className="text-sm font-bold text-white flex items-center gap-2">
              <span>NeoBank</span>
              <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full font-mono font-bold">
                PRIVATE
              </span>
            </div>
            <div className="text-[11px] text-zinc-400">
              {iscordAccount.username || 'Admin_Overlord'} • Müşteri No: #4589-TR
            </div>
          </div>
        </div>

        {/* Wealth Summary & Credit Score */}
        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <div className="text-[10px] uppercase font-semibold text-zinc-400">Toplam Finansal Varlık</div>
            <div className="text-sm font-mono font-bold text-emerald-400">
              {totalNetWorth.toLocaleString('tr-TR')} ₺
            </div>
          </div>
          <div className="px-3 py-1.5 rounded-lg bg-[#161b29] border border-[#283247] flex items-center gap-2">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
            <div className="text-xs font-mono font-bold text-white">
              <span className="text-[10px] text-zinc-400 font-sans mr-1">Skor:</span>
              {creditScore}
            </div>
          </div>
        </div>
      </div>

      {/* 2. Top Navigation Tabs */}
      <div className="h-12 px-6 bg-[#0e111a] border-b border-[#1a202e] flex items-center gap-2 shrink-0 overflow-x-auto">
        <button
          onClick={() => {
            setActiveTab('overview')
            soundEngine.playKeyClick()
          }}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            activeTab === 'overview'
              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 shadow-sm'
              : 'text-zinc-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <CreditCard className="w-4 h-4" />
          <span>Hesaplarım & Kartlar</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('transfer')
            soundEngine.playKeyClick()
          }}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            activeTab === 'transfer'
              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 shadow-sm'
              : 'text-zinc-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <RefreshCw className="w-4 h-4" />
          <span>Hızlı Virman (Hesaplar Arası)</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('crypto')
            soundEngine.playKeyClick()
          }}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            activeTab === 'crypto'
              ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30 shadow-sm'
              : 'text-zinc-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Coins className="w-4 h-4 text-amber-400" />
          <span>ModCoin Borsa</span>
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold">
            {modCoinPrice.toFixed(2)}₺
          </span>
        </button>

        <button
          onClick={() => {
            setActiveTab('deposit')
            soundEngine.playKeyClick()
          }}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            activeTab === 'deposit'
              ? 'bg-teal-500/10 text-teal-400 border border-teal-500/30 shadow-sm'
              : 'text-zinc-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Percent className="w-4 h-4 text-teal-400" />
          <span>Vadeli & Kredi</span>
          {(termDeposit || activeLoan > 0) && (
            <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
          )}
        </button>
      </div>

      {/* 3. Feedback Banner */}
      {feedback && (
        <div
          className={`mx-6 mt-3 px-4 py-2.5 rounded-lg text-xs font-medium border flex items-center justify-between animate-in fade-in ${
            feedback.type === 'success'
              ? 'bg-emerald-950/60 text-emerald-300 border-emerald-500/40'
              : 'bg-red-950/60 text-red-300 border-red-500/40'
          }`}
        >
          <span>{feedback.message}</span>
          <button onClick={() => setFeedback(null)} className="text-zinc-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 4. Tab Contents */}
      <div className="flex-1 p-6 overflow-y-auto">
        {/* TAB 1: ACCOUNTS & OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="max-w-5xl mx-auto space-y-6">
            {/* The Two Premium Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {/* Personal Black Titanium Card */}
              <div className="relative p-6 rounded-2xl bg-gradient-to-br from-[#181d28] via-[#11141c] to-[#090b10] border border-[#2a3449] shadow-2xl flex flex-col justify-between h-60 overflow-hidden group">
                <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white uppercase tracking-wider">Bireysel Vadesiz TL</div>
                      <div className="text-[10px] text-zinc-400">Black Metal Card</div>
                    </div>
                  </div>
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
                    FAST 7/24
                  </span>
                </div>

                {/* Big Clean Balance */}
                <div className="my-1">
                  <div className="text-[10px] uppercase font-semibold text-zinc-400 tracking-wider">Kullanılabilir Bakiye</div>
                  <div className="text-3xl font-mono font-extrabold text-white tracking-tight flex items-baseline gap-1 mt-0.5">
                    <span>{personalCash.toLocaleString('tr-TR')}</span>
                    <span className="text-emerald-400 text-xl font-sans font-bold">₺</span>
                  </div>
                </div>

                {/* Card Number & IBAN Copy Footer */}
                <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                  <div>
                    <div className="text-[9px] uppercase font-semibold text-zinc-500 tracking-wider">Şahsi IBAN Numaranız</div>
                    <div className="text-xs font-mono font-bold text-zinc-200">
                      TR64 0006 1000 4589 1234 5678 01
                    </div>
                  </div>

                  <button
                    onClick={() => handleCopyIban('TR64 0006 1000 4589 1234 5678 01', 'personal')}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 text-xs font-semibold transition-all shadow-sm active:scale-95"
                    title="DM'den rüşvet veya havale alırken bu IBAN'ı gönderin"
                  >
                    {copiedIban === 'personal' ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Kopyalandı!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>IBAN Kopyala</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Server Community Treasury Card */}
              <div className="relative p-6 rounded-2xl bg-gradient-to-br from-[#1a2030] via-[#111624] to-[#0a0d14] border border-[#2b3956] shadow-2xl flex flex-col justify-between h-60 overflow-hidden group">
                <div className="absolute top-0 right-0 w-48 h-48 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-sky-500/20 border border-sky-500/40 flex items-center justify-center text-sky-400">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white uppercase tracking-wider">Topluluk Kasası</div>
                      <div className="text-[10px] text-zinc-400">Resmi Sunucu Fonu</div>
                    </div>
                  </div>
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-sky-500/10 text-sky-400 border border-sky-500/20 font-bold">
                    KURUMSAL KASA
                  </span>
                </div>

                {/* Big Clean Balance */}
                <div className="my-1">
                  <div className="text-[10px] uppercase font-semibold text-zinc-400 tracking-wider">Kasa Yönetim Bütçesi</div>
                  <div className="text-3xl font-mono font-extrabold text-white tracking-tight flex items-baseline gap-1 mt-0.5">
                    <span>{serverFunds.toLocaleString('tr-TR')}</span>
                    <span className="text-sky-400 text-xl font-sans font-bold">₺</span>
                  </div>
                </div>

                {/* Card Number & IBAN Copy Footer */}
                <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                  <div>
                    <div className="text-[9px] uppercase font-semibold text-zinc-500 tracking-wider">Sunucu Resmi IBAN</div>
                    <div className="text-xs font-mono font-bold text-zinc-200">
                      TR91 0001 2000 9876 5432 1098 99
                    </div>
                  </div>

                  <button
                    onClick={() => handleCopyIban('TR91 0001 2000 9876 5432 1098 99', 'server')}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-500/20 hover:bg-sky-500/30 border border-sky-500/40 text-sky-300 text-xs font-semibold transition-all shadow-sm active:scale-95"
                    title="Sunucu bağışları ve resmi ödemeler için kopyala"
                  >
                    {copiedIban === 'server' ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-sky-400" />
                        <span>Kopyalandı!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>IBAN Kopyala</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Action Shortcuts Banner */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <button
                onClick={() => {
                  setTransferMode('serverToPersonal')
                  setActiveTab('transfer')
                }}
                className="p-3.5 rounded-xl bg-[#131722] hover:bg-[#191f2d] border border-[#232b3d] flex items-center gap-3 transition-all text-left group"
              >
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold text-sm shrink-0 group-hover:scale-105 transition-transform">
                  <ArrowDownLeft className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white">Maaş / Avans Çek</div>
                  <div className="text-[10px] text-zinc-400">Kasadan Bireysele</div>
                </div>
              </button>

              <button
                onClick={() => {
                  setTransferMode('personalToServer')
                  setActiveTab('transfer')
                }}
                className="p-3.5 rounded-xl bg-[#131722] hover:bg-[#191f2d] border border-[#232b3d] flex items-center gap-3 transition-all text-left group"
              >
                <div className="w-8 h-8 rounded-lg bg-sky-500/10 text-sky-400 flex items-center justify-center font-bold text-sm shrink-0 group-hover:scale-105 transition-transform">
                  <ArrowUpRight className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white">Kasaya Fon Aktar</div>
                  <div className="text-[10px] text-zinc-400">Bireysel'den Kasaya</div>
                </div>
              </button>

              <button
                onClick={() => setActiveTab('crypto')}
                className="p-3.5 rounded-xl bg-[#131722] hover:bg-[#191f2d] border border-[#232b3d] flex items-center gap-3 transition-all text-left group"
              >
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold text-sm shrink-0 group-hover:scale-105 transition-transform">
                  <Coins className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white">ModCoin Yatırımı</div>
                  <div className="text-[10px] text-zinc-400">{modCoinBalance.toFixed(2)} MOD Portföy</div>
                </div>
              </button>

              <button
                onClick={() => setActiveTab('deposit')}
                className="p-3.5 rounded-xl bg-[#131722] hover:bg-[#191f2d] border border-[#232b3d] flex items-center gap-3 transition-all text-left group"
              >
                <div className="w-8 h-8 rounded-lg bg-teal-500/10 text-teal-400 flex items-center justify-center font-bold text-sm shrink-0 group-hover:scale-105 transition-transform">
                  <Percent className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white">Vadeli & Kredi</div>
                  <div className="text-[10px] text-zinc-400">%42 Faiz Getirisi</div>
                </div>
              </button>
            </div>

            {/* Clean Transaction History List */}
            <div className="p-5 rounded-2xl bg-[#11141e] border border-[#1f2638] space-y-4">
              <div className="flex items-center justify-between border-b border-[#1f2638] pb-3">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-bold uppercase tracking-wider text-white">
                    Son Hesap Hareketleri & Dekontlar
                  </span>
                </div>

                <div className="flex items-center gap-1.5 text-xs">
                  <button
                    onClick={() => setTxFilter('all')}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-colors ${
                      txFilter === 'all' ? 'bg-white/10 text-white' : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    Tümü
                  </button>
                  <button
                    onClick={() => setTxFilter('income')}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-colors ${
                      txFilter === 'income' ? 'bg-emerald-500/20 text-emerald-300' : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    Gelirler (+)
                  </button>
                  <button
                    onClick={() => setTxFilter('expense')}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-colors ${
                      txFilter === 'expense' ? 'bg-red-500/20 text-red-300' : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    Giderler (-)
                  </button>
                </div>
              </div>

              {/* Transactions List */}
              <div className="space-y-2">
                {filteredTransactions.slice(0, 10).map((tx) => {
                  const isIncome = tx.type === 'income'
                  const isExpense = tx.type === 'expense'

                  return (
                    <div
                      key={tx.id}
                      onClick={() => setSelectedTx(tx)}
                      className="p-3 rounded-xl bg-[#161a26]/60 hover:bg-[#1a2030] border border-[#212a3d] flex items-center justify-between gap-3 transition-all cursor-pointer group"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                            isIncome
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                              : isExpense
                              ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                              : 'bg-sky-500/10 text-sky-400 border border-sky-500/30'
                          }`}
                        >
                          {isIncome ? <ArrowDownLeft className="w-4 h-4" /> : isExpense ? <ArrowUpRight className="w-4 h-4" /> : <RefreshCw className="w-4 h-4" />}
                        </div>

                        <div className="truncate">
                          <div className="text-xs font-semibold text-white group-hover:text-emerald-300 transition-colors truncate">
                            {tx.title}
                          </div>
                          <div className="text-[10px] text-zinc-400 flex items-center gap-2 mt-0.5">
                            <span>{tx.timestamp}</span>
                            <span>•</span>
                            <span className="font-mono text-zinc-500">{tx.reference || 'FAST-TR'}</span>
                          </div>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <div
                          className={`text-sm font-mono font-bold ${
                            isIncome
                              ? 'text-emerald-400'
                              : isExpense
                              ? 'text-rose-400'
                              : 'text-sky-400'
                          }`}
                        >
                          {isIncome ? '+' : isExpense ? '-' : ''}
                          {tx.amount.toLocaleString('tr-TR')} ₺
                        </div>
                        <div className="text-[10px] text-zinc-500 group-hover:text-zinc-300 flex items-center justify-end gap-1 mt-0.5 font-sans">
                          <span>Dekont İncele</span>
                          <ChevronRight className="w-3 h-3" />
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: TRANSFER / VIRMAN */}
        {activeTab === 'transfer' && (
          <div className="max-w-xl mx-auto p-6 rounded-2xl bg-[#11141e] border border-[#1f2638] space-y-6 shadow-xl">
            <div className="border-b border-[#1f2638] pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <RefreshCw className="w-4 h-4 text-emerald-400" />
                <span>Hesaplar Arası Hızlı Virman</span>
              </h3>
              <p className="text-[11px] text-zinc-400 mt-0.5">
                Şahsi vadesiz hesabınız ile sunucu topluluk kasası arasında anında para aktarın.
              </p>
            </div>

            {/* Mode Selector */}
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setTransferMode('serverToPersonal')}
                className={`p-3 rounded-xl border text-left transition-all ${
                  transferMode === 'serverToPersonal'
                    ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300 font-bold shadow-md'
                    : 'bg-[#161a26] border-[#222a3d] text-zinc-400 hover:text-white'
                }`}
              >
                <div className="text-xs">Kasadan Bireysele</div>
                <div className="text-[10px] text-zinc-400 mt-0.5">Maaş / Avans Çekimi</div>
              </button>

              <button
                onClick={() => setTransferMode('personalToServer')}
                className={`p-3 rounded-xl border text-left transition-all ${
                  transferMode === 'personalToServer'
                    ? 'bg-sky-500/10 border-sky-500/40 text-sky-300 font-bold shadow-md'
                    : 'bg-[#161a26] border-[#222a3d] text-zinc-400 hover:text-white'
                }`}
              >
                <div className="text-xs">Bireysel'den Kasaya</div>
                <div className="text-[10px] text-zinc-400 mt-0.5">Kasa Fonunu Destekle</div>
              </button>
            </div>

            {/* Amount Input */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-zinc-300">Aktarılacak Tutar (₺)</label>
              <div className="relative">
                <input
                  type="number"
                  value={transferAmount}
                  onChange={(e) => setTransferAmount(e.target.value)}
                  className="w-full h-11 px-4 bg-[#161a26] border border-[#242d40] rounded-xl text-white font-mono text-base outline-none focus:border-emerald-500/60"
                  placeholder="250"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 font-bold">₺</span>
              </div>

              {/* Quick Amount Pills */}
              <div className="flex gap-2 pt-1">
                {['100', '250', '500', '1000'].map((val) => (
                  <button
                    key={val}
                    onClick={() => setTransferAmount(val)}
                    className="flex-1 py-1 rounded-lg bg-[#1a2030] hover:bg-[#222a3d] text-xs font-mono text-zinc-300 hover:text-white border border-[#2b354c] transition-colors"
                  >
                    {val}₺
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleExecuteTransfer}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-zinc-950 font-black text-xs uppercase tracking-wider transition-all shadow-lg shadow-emerald-950/40 active:scale-95 cursor-pointer"
            >
              Transferi Anında Onayla
            </button>
          </div>
        )}

        {/* TAB 3: CRYPTO (MODCOIN) */}
        {activeTab === 'crypto' && (
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Header Stat Card */}
            <div className="p-6 rounded-2xl bg-gradient-to-r from-amber-950/40 via-[#151924] to-amber-950/20 border border-amber-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shadow-md">
                  <Coins className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-base font-bold text-white flex items-center gap-2">
                    <span>ModCoin (MOD)</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono font-bold">
                      MOD / TRY
                    </span>
                  </div>
                  <div className="text-xs text-zinc-400">Merkeziyetsiz Moderatör Topluluk Varlığı</div>
                </div>
              </div>

              <div className="text-right">
                <div className="text-[10px] uppercase font-semibold text-zinc-400">Anlık Fiyat</div>
                <div className="text-2xl font-mono font-bold text-amber-400">
                  {modCoinPrice.toFixed(2)} ₺
                </div>
                <div className="text-[11px] font-mono text-emerald-400 font-bold">+8.4% Bugün</div>
              </div>
            </div>

            {/* Trading Buy & Sell Desks */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Buy MOD */}
              <div className="p-5 rounded-2xl bg-[#11141e] border border-[#1f2638] space-y-4">
                <div className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center justify-between">
                  <span>ModCoin Satın Al</span>
                  <span className="text-zinc-400 font-mono">Bakiye: {personalCash}₺</span>
                </div>

                <div>
                  <label className="text-[11px] text-zinc-400 block mb-1">Ödenecek Tutar (₺)</label>
                  <input
                    type="number"
                    value={cryptoBuyAmount}
                    onChange={(e) => setCryptoBuyAmount(e.target.value)}
                    className="w-full h-10 px-3 bg-[#161a26] border border-[#242d40] rounded-xl text-white font-mono text-sm outline-none focus:border-emerald-500/60"
                  />
                  <div className="text-[11px] text-zinc-500 mt-1 font-mono">
                    ≈ {(parseFloat(cryptoBuyAmount || '0') / modCoinPrice).toFixed(4)} MOD Alınacak
                  </div>
                </div>

                <button
                  onClick={handleBuyCrypto}
                  className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase transition-colors"
                >
                  MOD Satın Al
                </button>
              </div>

              {/* Sell MOD */}
              <div className="p-5 rounded-2xl bg-[#11141e] border border-[#1f2638] space-y-4">
                <div className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center justify-between">
                  <span>ModCoin Bozdur / Sat</span>
                  <span className="text-zinc-400 font-mono">Portföy: {modCoinBalance.toFixed(4)} MOD</span>
                </div>

                <div>
                  <label className="text-[11px] text-zinc-400 block mb-1">Satılacak Miktar (MOD)</label>
                  <input
                    type="number"
                    value={cryptoSellAmount}
                    onChange={(e) => setCryptoSellAmount(e.target.value)}
                    className="w-full h-10 px-3 bg-[#161a26] border border-[#242d40] rounded-xl text-white font-mono text-sm outline-none focus:border-amber-500/60"
                  />
                  <div className="text-[11px] text-zinc-500 mt-1 font-mono">
                    ≈ {(parseFloat(cryptoSellAmount || '0') * modCoinPrice).toFixed(2)} ₺ Nakit Alınacak
                  </div>
                </div>

                <button
                  onClick={handleSellCrypto}
                  className="w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs uppercase transition-colors"
                >
                  MOD Bozdur & Nakite Çevir
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: DEPOSIT & LOAN */}
        {activeTab === 'deposit' && (
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Term Deposit Card */}
              <div className="p-6 rounded-2xl bg-[#11141e] border border-[#1f2638] space-y-4">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-teal-400">
                  <Percent className="w-4 h-4" />
                  <span>Vadeli Mevduat Hesabı</span>
                </div>

                {termDeposit ? (
                  <div className="p-4 rounded-xl bg-teal-950/30 border border-teal-500/30 space-y-3">
                    <div className="text-xs font-bold text-white">Aktif Vadeli Hesap</div>
                    <div className="text-2xl font-mono font-bold text-teal-400">{termDeposit.principal} ₺</div>
                    <div className="text-xs text-zinc-300 font-mono">
                      Kalan Süre: {termDeposit.daysRemaining} Gün • Tahmini Getiri: +{termDeposit.totalProfit} ₺
                    </div>
                    <button
                      onClick={handleWithdrawDeposit}
                      className="w-full py-2 rounded-lg bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs"
                    >
                      Vadeyi Kapat & Parayı Çek
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <p className="text-xs text-zinc-400 leading-relaxed">
                      Paranızı 7 günlük vadeliye bağlayarak günlük faiz kazanın.
                    </p>
                    <div>
                      <label className="text-[11px] text-zinc-400 block mb-1">Yatırılacak Tutar (₺)</label>
                      <input
                        type="number"
                        value={depositAmount}
                        onChange={(e) => setDepositAmount(e.target.value)}
                        className="w-full h-10 px-3 bg-[#161a26] border border-[#242d40] rounded-xl text-white font-mono text-sm outline-none"
                      />
                    </div>
                    <button
                      onClick={handleOpenDeposit}
                      className="w-full py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs"
                    >
                      7 Günlük Vadeli Mevduat Aç
                    </button>
                  </div>
                )}
              </div>

              {/* Quick Loan Card */}
              <div className="p-6 rounded-2xl bg-[#11141e] border border-[#1f2638] space-y-4">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-400">
                  <Landmark className="w-4 h-4" />
                  <span>Hızlı Kredi & Avans</span>
                </div>

                {activeLoan > 0 ? (
                  <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-500/30 space-y-3">
                    <div className="text-xs font-bold text-amber-300">Aktif Kredi Borcu</div>
                    <div className="text-2xl font-mono font-bold text-amber-400">{activeLoan} ₺</div>
                    <p className="text-xs text-zinc-400">
                      Borcunuzu kapatarak kredi notunuzu yükseltebilirsiniz.
                    </p>
                    <button
                      onClick={() => handleRepayLoan(activeLoan)}
                      className="w-full py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs"
                    >
                      Borcu Kapat ({activeLoan} ₺)
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <p className="text-xs text-zinc-400 leading-relaxed">
                      Kredi notunuza ({creditScore}) göre anında 500₺ veya 1.000₺ acil nakit avans kullanabilirsiniz.
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleTakeLoan(500)}
                        className="flex-1 py-2.5 rounded-xl bg-[#1a2030] hover:bg-[#222a3d] border border-[#2b354c] text-white font-bold text-xs"
                      >
                        500₺ Kredi Çek
                      </button>
                      <button
                        onClick={() => handleTakeLoan(1000)}
                        className="flex-1 py-2.5 rounded-xl bg-[#1a2030] hover:bg-[#222a3d] border border-[#2b354c] text-white font-bold text-xs"
                      >
                        1.000₺ Kredi Çek
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 5. Sleek Digital Receipt Modal (Dekont Görüntüleyici) */}
      {selectedTx && (
        <div 
          className="fixed inset-0 z-[99999] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150"
          onClick={() => setSelectedTx(null)}
        >
          <div 
            className="w-full max-w-md bg-[#121622] border border-[#263147] rounded-2xl shadow-2xl p-6 text-xs space-y-4 select-none relative animate-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-[#20293d] pb-3">
              <div className="flex items-center gap-2">
                <Landmark className="w-5 h-5 text-emerald-400" />
                <span className="font-bold text-white text-sm">Resmi Banka Dekontu</span>
              </div>
              <button 
                onClick={() => setSelectedTx(null)}
                className="text-zinc-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="text-center py-2 space-y-1">
              <div className="text-[10px] uppercase font-semibold text-zinc-400">İşlem Tutarı</div>
              <div className="text-3xl font-mono font-extrabold text-white">
                {selectedTx.type === 'income' ? '+' : selectedTx.type === 'expense' ? '-' : ''}
                {selectedTx.amount.toLocaleString('tr-TR')} ₺
              </div>
              <div className="text-[11px] text-emerald-400 font-semibold flex items-center justify-center gap-1">
                <Check className="w-3.5 h-3.5" />
                <span>İşlem Başarıyla Gerçekleşti (Onaylandı)</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#0b0e15] border border-[#1a2130] space-y-2.5 font-mono text-[11px]">
              <div className="flex justify-between">
                <span className="text-zinc-500">Açıklama:</span>
                <span className="text-zinc-200 text-right font-sans font-medium">{selectedTx.title}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Tarih & Saat:</span>
                <span className="text-zinc-300">{selectedTx.timestamp}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Referans Kodu:</span>
                <span className="text-emerald-400 font-bold">{selectedTx.reference || 'FAST-001'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Hesap Tipi:</span>
                <span className="text-zinc-300 uppercase">{selectedTx.account === 'server' ? 'Topluluk Kasası' : 'Bireysel Vadesiz'}</span>
              </div>
            </div>

            <button
              onClick={() => setSelectedTx(null)}
              className="w-full py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs transition-colors"
            >
              Kapat
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
