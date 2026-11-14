import React from 'react'
import { 
  TrendingUp, 
  Wallet, 
  CheckCircle, 
  ShieldAlert, 
  ArrowRight,
  SunMedium
} from 'lucide-react'

interface ShiftSummaryModalProps {
  isOpen: boolean
  onClose: () => void
  onAdvanceDay: () => void
  currentDay: number
  ticketsResolved: number
  bansIssued: number
  dailyDonations: number
  dailyExpenses: number
  salary: number
  hype: number
}

export const ShiftSummaryModal: React.FC<ShiftSummaryModalProps> = ({
  isOpen,
  onAdvanceDay,
  currentDay,
  ticketsResolved,
  bansIssued,
  dailyDonations,
  dailyExpenses,
  salary,
  hype
}) => {
  if (!isOpen) return null

  const netServerFunds = dailyDonations - dailyExpenses

  return (
    <div className="fixed inset-0 z-[99999] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 select-none">
      <div className="w-[460px] bg-[#14161b] border border-[#2b2e37] rounded-xl shadow-2xl p-6 text-zinc-200 space-y-5 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#252831] pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <SunMedium className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white leading-tight">
                Gün {currentDay} Vardiya Özeti
              </h2>
              <p className="text-xs text-zinc-400">ModOS Sunucu İstatistikleri & Mali Rapor</p>
            </div>
          </div>
          <span className="text-xs font-mono px-2 py-0.5 rounded bg-[#1f2229] border border-[#2e323c] text-zinc-300">
            23:59:59
          </span>
        </div>

        {/* Moderation Metrics */}
        <div className="grid grid-cols-3 gap-2 text-center text-xs">
          <div className="p-3 rounded-lg bg-[#181a20] border border-[#252831]">
            <div className="text-[10px] text-zinc-500 font-bold uppercase">Çözülen Ticket</div>
            <div className="text-lg font-bold text-emerald-400 mt-1 flex items-center justify-center gap-1">
              <CheckCircle className="w-4 h-4" />
              <span>{ticketsResolved}</span>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-[#181a20] border border-[#252831]">
            <div className="text-[10px] text-zinc-500 font-bold uppercase">Uygulanan Ban</div>
            <div className="text-lg font-bold text-red-400 mt-1 flex items-center justify-center gap-1">
              <ShieldAlert className="w-4 h-4" />
              <span>{bansIssued}</span>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-[#181a20] border border-[#252831]">
            <div className="text-[10px] text-zinc-500 font-bold uppercase">Sunucu Hype</div>
            <div className="text-lg font-bold text-amber-400 mt-1 flex items-center justify-center gap-1">
              <TrendingUp className="w-4 h-4" />
              <span>%{hype}</span>
            </div>
          </div>
        </div>

        {/* Financial Breakdown */}
        <div className="p-4 rounded-lg bg-[#181a20] border border-[#252831] space-y-2.5 text-xs">
          <div className="font-bold text-white flex items-center gap-1.5 border-b border-[#252831] pb-2">
            <Wallet className="w-4 h-4 text-emerald-400" />
            <span>Mali Hareketler</span>
          </div>

          <div className="flex items-center justify-between text-zinc-400">
            <span>Topluluk & VIP Bağışları:</span>
            <span className="font-mono font-bold text-emerald-400">+{dailyDonations}₺</span>
          </div>

          <div className="flex items-center justify-between text-zinc-400">
            <span>Sunucu & Bot Giderleri:</span>
            <span className="font-mono font-bold text-red-400">-{dailyExpenses}₺</span>
          </div>

          <div className="flex items-center justify-between text-zinc-200 font-bold pt-2 border-t border-[#252831]">
            <span>Net Sunucu Fonu Değişimi:</span>
            <span className={`font-mono ${netServerFunds >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
              {netServerFunds >= 0 ? `+${netServerFunds}₺` : `-${Math.abs(netServerFunds)}₺`}
            </span>
          </div>

          <div className="flex items-center justify-between text-zinc-200 font-bold pt-2 border-t border-[#252831]">
            <span>Kişisel Moderatör Maaşı (Performans):</span>
            <span className="font-mono text-emerald-300">
              +{salary}₺
            </span>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={onAdvanceDay}
          className="w-full py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors shadow-lg"
        >
          <span>Gün {currentDay + 1}'e Başla (Vardiyayı Tamamla)</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
