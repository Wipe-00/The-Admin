import React, { useState } from 'react'
import { 
  Bot, 
  Cpu, 
  Play, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  Sliders
} from 'lucide-react'
import { useGame } from '../../context/GameContext'

export const BotBuilderApp: React.FC = () => {
  const { auditLogs, botRules, updateBotRules } = useGame()

  const [linkFilterEnabled, setLinkFilterEnabled] = useState(botRules.linkFilterEnabled)
  const [capsFilterEnabled, setCapsFilterEnabled] = useState(botRules.capsFilterEnabled)
  const [spamThreshold, setSpamThreshold] = useState(botRules.spamThreshold)
  const [customWords, setCustomWords] = useState<string[]>(botRules.customWords)
  const [newWordInput, setNewWordInput] = useState('')
  const [isDeployed, setIsDeployed] = useState(true)
  const [deployNotice, setDeployNotice] = useState<string | null>(null)

  const handleAddWord = (e: React.FormEvent) => {
    e.preventDefault()
    const word = newWordInput.trim().toLowerCase()
    if (!word || customWords.includes(word)) return
    setCustomWords([...customWords, word])
    setNewWordInput('')
    setIsDeployed(false)
  }

  const handleRemoveWord = (word: string) => {
    setCustomWords(customWords.filter((w) => w !== word))
    setIsDeployed(false)
  }

  const handleDeploy = () => {
    updateBotRules({
      linkFilterEnabled,
      capsFilterEnabled,
      spamThreshold,
      customWords
    })
    setIsDeployed(true)
    setDeployNotice('Bot kuralları derlendi ve canlı sunucuya uygulandı.')
    setTimeout(() => setDeployNotice(null), 3000)
  }

  return (
    <div className="flex h-full w-full bg-[#14161b] text-zinc-200 select-none font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Sidebar Rules */}
      <div className="w-56 bg-[#101115] border-r border-[#22242b] p-3 flex flex-col justify-between shrink-0">
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-white uppercase tracking-wider">
            <Bot className="w-4 h-4 text-sky-400" />
            <span>BotBuilder IDE</span>
          </div>

          <div className="text-[11px] text-zinc-400 leading-relaxed">
            Sunucudaki otomatik moderasyon kurallarını ve filtre motorunu buradan yapılandır.
          </div>

          <div className="p-2.5 rounded bg-[#181a20] border border-[#252831] space-y-2 text-[11px]">
            <div className="flex items-center justify-between">
              <span className="text-zinc-400 flex items-center gap-1">
                <Cpu className="w-3 h-3 text-emerald-400" /> Bot RAM:
              </span>
              <span className="font-mono text-emerald-400">128 MB / 512 MB</span>
            </div>
            <div className="w-full bg-[#101115] h-1.5 rounded-full overflow-hidden">
              <div className="bg-emerald-500 h-full w-[25%]" />
            </div>
            <div className="text-[10px] text-zinc-500">
              Durum: {isDeployed ? 'Çalışıyor (Deploy Edildi)' : 'Değişiklik Bekliyor'}
            </div>
          </div>
        </div>

        <button
          onClick={handleDeploy}
          className="w-full py-2 rounded bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow"
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          <span>Kuralları Dağıt (Deploy)</span>
        </button>
      </div>

      {/* Main Configuration Workspace */}
      <div className="flex-1 overflow-y-auto p-5 space-y-5">
        {deployNotice && (
          <div className="p-3 rounded bg-emerald-950/40 border border-emerald-800 text-xs text-emerald-300 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>{deployNotice}</span>
          </div>
        )}

        {/* Rule 1: Link Detection */}
        <div className="p-4 rounded-lg bg-[#181a20] border border-[#252831] space-y-2">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-white">1. Yetkisiz Link & Davet Engelleme</div>
              <div className="text-[11px] text-zinc-400 mt-0.5">
                VIP veya Yönetici olmayan üyelerin gönderdiği URL ve harici Discord linklerini anında siler.
              </div>
            </div>
            <button
              onClick={() => {
                setLinkFilterEnabled(!linkFilterEnabled)
                setIsDeployed(false)
              }}
              className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${
                linkFilterEnabled ? 'bg-sky-600' : 'bg-zinc-700'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  linkFilterEnabled ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Rule 2: Caps Lock Limit */}
        <div className="p-4 rounded-lg bg-[#181a20] border border-[#252831] space-y-2">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-white">2. Aşırı Büyük Harf (Caps Lock) Filtresi</div>
              <div className="text-[11px] text-zinc-400 mt-0.5">
                Mesajın %70'inden fazlası büyük harf ise mesajı engeller ve kullanıcıyı uyarır.
              </div>
            </div>
            <button
              onClick={() => {
                setCapsFilterEnabled(!capsFilterEnabled)
                setIsDeployed(false)
              }}
              className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${
                capsFilterEnabled ? 'bg-sky-600' : 'bg-zinc-700'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  capsFilterEnabled ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Rule 3: Spam Rate Limiter */}
        <div className="p-4 rounded-lg bg-[#181a20] border border-[#252831] space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-white flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-amber-400" />
                <span>3. Spam & Hızlı Mesaj Sıklık Limiti</span>
              </div>
              <div className="text-[11px] text-zinc-400 mt-0.5">
                5 saniye içinde izin verilen maksimum mesaj adedi. Aşarsa 5 dakika susturur.
              </div>
            </div>
            <span className="font-mono text-xs font-bold text-amber-400 px-2 py-1 rounded bg-[#111215]">
              {spamThreshold} Mesaj / 5sn
            </span>
          </div>

          <input
            type="range"
            min="2"
            max="8"
            value={spamThreshold}
            onChange={(e) => {
              setSpamThreshold(parseInt(e.target.value, 10))
              setIsDeployed(false)
            }}
            className="w-full accent-sky-500 cursor-pointer"
          />
        </div>

        {/* Rule 4: Custom Blacklist Words */}
        <div className="p-4 rounded-lg bg-[#181a20] border border-[#252831] space-y-3">
          <div>
            <div className="text-xs font-bold text-white">4. Özel Yasaklı Kelime & Regex Kara Listesi</div>
            <div className="text-[11px] text-zinc-400 mt-0.5">
              Bu kelimeleri içeren mesajlar chatte filtrelenir ve moderasyon günlüğüne kaydedilir.
            </div>
          </div>

          <form onSubmit={handleAddWord} className="flex gap-2">
            <input
              type="text"
              placeholder="Yeni yasaklı kelime ekle (örn: botnet)..."
              value={newWordInput}
              onChange={(e) => setNewWordInput(e.target.value)}
              className="flex-1 bg-[#101115] border border-[#2a2d36] rounded px-3 py-1.5 text-xs text-white placeholder-zinc-500 outline-none font-mono"
            />
            <button
              type="submit"
              className="px-3 py-1.5 bg-[#252831] hover:bg-sky-600 hover:text-white text-zinc-300 text-xs font-bold rounded flex items-center gap-1 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Ekle</span>
            </button>
          </form>

          <div className="flex flex-wrap gap-2 pt-1">
            {customWords.map((word) => (
              <span
                key={word}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#111215] border border-[#252831] text-xs font-mono text-zinc-300"
              >
                <span>{word}</span>
                <button
                  onClick={() => handleRemoveWord(word)}
                  className="hover:text-red-400 p-0.5"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Recent Bot Execution Logs */}
        <div className="p-4 rounded-lg bg-[#181a20] border border-[#252831] space-y-2">
          <div className="text-xs font-bold text-white">Son Bot Tetiklenme Kayıtları</div>
          <div className="space-y-1 font-mono text-[11px] text-zinc-400">
            {auditLogs.slice(0, 3).map((l) => (
              <div key={l.id} className="p-1.5 rounded bg-[#111215] border border-[#22242b] truncate">
                [{l.timestamp}] {l.action} ➔ {l.target}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
