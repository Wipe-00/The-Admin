import React, { useState, useEffect } from 'react'
import {
  Inbox,
  Send,
  Trash2,
  Star,
  AlertTriangle,
  DollarSign,
  Check,
  X,
  Mail,
  RotateCcw,
  Reply,
  Plus
} from 'lucide-react'
import { useGame } from '../../context/GameContext'
import { soundEngine } from '../../utils/soundEngine'

export type MailFolder = 'inbox' | 'starred' | 'sent' | 'trash'

export interface ModMailMessage {
  id: string
  folder: 'inbox' | 'sent' | 'trash'
  isStarred?: boolean
  sender: string
  recipient?: string
  subject: string
  preview: string
  fullBody: string
  timestamp: string
  isRead: boolean
  isBribe?: boolean
  bribeOffer?: {
    cashAmount: number
    actionDesc: string
    hypePenalty: number
  }
  isSponsorship?: boolean
  sponsorOffer?: {
    cashAmount: number
    actionDesc: string
    hypePenalty: number
  }
  status?: 'pending' | 'accepted' | 'declined'
  repliedText?: string
}

export const MailApp: React.FC = () => {
  const { adjustPersonalCash, addBankTransaction, hype, setSanity, iscordAccount } = useGame()

  const [activeFolder, setActiveFolder] = useState<MailFolder>('inbox')
  const [mails, setMails] = useState<ModMailMessage[]>([
    {
      id: 'mail-1',
      folder: 'inbox',
      isStarred: true,
      sender: 'Zengin_Balina (VIP)',
      subject: 'Gizli Teklif: Berk_06 hakkında',
      preview: 'Selam admin, sana özelden 350₺ nakit atsam...',
      fullBody:
        'Selam admin. Dün banladığın Berk_06 benim yakın arkadaşım. Aramızda kalsın, sana el altından 350₺ nakit ateşleyeyim onun banını aç. Kimse fark etmez bile. Ne diyorsun?',
      timestamp: 'Bugün 02:40',
      isRead: false,
      isBribe: true,
      bribeOffer: {
        cashAmount: 350,
        actionDesc: 'Rüşveti kabul et ve Berk_06 nın banını aç',
        hypePenalty: -14
      },
      status: 'pending'
    },
    {
      id: 'mail-2',
      folder: 'inbox',
      isStarred: false,
      sender: 'CryptoSpin Sponsorluğu',
      subject: 'Haftalık Sponsorluk Anlaşması (500₺)',
      preview: 'Sunucunuzun #duyurular kanalında kumar botumuzu...',
      fullBody:
        'Merhaba Root Topluluk Yönetimi. Sunucunuzun duyuru kanalına sitemizin kumar botunun linkini sabitlerseniz kişisel hesabınıza anında 500₺ ödeme yapacağız.',
      timestamp: 'Dün 23:15',
      isRead: true,
      isSponsorship: true,
      sponsorOffer: {
        cashAmount: 500,
        actionDesc: 'Kumar sponsorluğunu kabul et',
        hypePenalty: -20
      },
      status: 'pending'
    },
    {
      id: 'mail-3',
      folder: 'inbox',
      isStarred: true,
      sender: 'Kurucu_Efe (Sunucu Sahibi)',
      subject: 'Aylık Moderatör Değerlendirmesi & VDS Bilgilendirmesi',
      preview: 'Hype oranına dikkat et, topluluk biraz gergin...',
      fullBody:
        'Merhaba Baş Moderatör. Sunucudaki son krizleri iyi yönettin ama chatte küfürlerin artması durumunda üyeler şikayetçi oluyor. Bot kurmak için önce VDS kiralaman ve Uzaktan Bağlantı ile VDS masaüstünden botları aktif etmen gerektiğini unutma. İyi çalışmalar.',
      timestamp: '07.11.2026',
      isRead: true
    },
    {
      id: 'mail-4',
      folder: 'inbox',
      isStarred: false,
      sender: ' Turnuva_Organizasyon',
      subject: 'Hafta Sonu 5v5 Valorant Turnuva Sponsorluğu (250₺)',
      preview: 'Topluluğunuzda ödüllü turnuva düzenlemek istiyoruz...',
      fullBody:
        'Selamlar! Sunucunuzdaki #oyun-sohbeti kanalında hafta sonu turnuva duyurumuzu paylaşırsanız moderasyon ekibinize 250₺ nakit katkı sağlayacağız.',
      timestamp: 'Bugün 10:15',
      isRead: false,
      isSponsorship: true,
      sponsorOffer: {
        cashAmount: 250,
        actionDesc: 'Turnuva sponsorluğunu onayla',
        hypePenalty: 0
      },
      status: 'pending'
    },
    {
      id: 'mail-sent-1',
      folder: 'sent',
      isStarred: false,
      sender: iscordAccount.username || 'Admin_Overlord',
      recipient: 'Kurucu_Efe (Sunucu Sahibi)',
      subject: 'RE: Moderatörlük Görev Başlangıcı',
      preview: 'Merhabalar Efe Bey, yetkilerimi devraldım...',
      fullBody:
        'Merhabalar Efe Bey, sunucu baş moderatörlük görevimi devraldım. Biletleri ve sohbet kanallarını düzenli olarak denetleyeceğim.',
      timestamp: '06.11.2026',
      isRead: true
    },
    {
      id: 'mail-trash-1',
      folder: 'trash',
      isStarred: false,
      sender: 'BedavaNitro_Bot',
      subject: 'TEBRİKLER 1 YILLIK NITRO KAZANDINIZ!',
      preview: 'Hemen tıklayın ve şifrenizi girin...',
      fullBody:
        'Tebrikler! Discord 1 yıllık bedava Nitro kazandınız! Hemen sahte linkimize tıklayıp hesabınızı teslim edin (!). [ModMail Spam Filtresi tarafından Çöp Kutusuna taşındı]',
      timestamp: '05.11.2026',
      isRead: true
    }
  ])

  const [selectedMailId, setSelectedMailId] = useState<string>('mail-1')
  const [isComposeOpen, setIsComposeOpen] = useState(false)
  const [composeTo, setComposeTo] = useState('Kurucu_Efe (Sunucu Sahibi)')
  const [composeSubject, setComposeSubject] = useState('')
  const [composeBody, setComposeBody] = useState('')

  const filteredMails = mails.filter((m) => {
    if (activeFolder === 'starred') return m.isStarred && m.folder !== 'trash'
    return m.folder === activeFolder
  })

  useEffect(() => {
    if (filteredMails.length > 0 && !filteredMails.some((m) => m.id === selectedMailId)) {
      setSelectedMailId(filteredMails[0].id)
    }
  }, [activeFolder, mails])

  const selectedMail =
    filteredMails.find((m) => m.id === selectedMailId) || filteredMails[0] || null

  const handleSendCompose = (e: React.FormEvent) => {
    e.preventDefault()
    if (!composeSubject.trim() || !composeBody.trim()) return

    soundEngine.playSuccess()
    const nowTime = new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
    const newSentMail: ModMailMessage = {
      id: `sent-${Date.now()}`,
      folder: 'sent',
      sender: iscordAccount.username || 'Admin_Overlord',
      recipient: composeTo,
      subject: composeSubject.trim(),
      preview: composeBody.trim().substring(0, 50) + '...',
      fullBody: composeBody.trim(),
      timestamp: `Bugün ${nowTime}`,
      isRead: true
    }

    setMails((prev) => [newSentMail, ...prev])
    setIsComposeOpen(false)
    setComposeSubject('')
    setComposeBody('')
    setActiveFolder('sent')
    setSelectedMailId(newSentMail.id)
  }

  const emptyTrash = () => {
    soundEngine.playKeyClick()
    setMails((prev) => prev.filter((m) => m.folder !== 'trash'))
  }

  const handleSelectMail = (id: string) => {
    soundEngine.playKeyClick()
    setSelectedMailId(id)
    setMails((prev) => prev.map((m) => (m.id === id ? { ...m, isRead: true } : m)))
  }

  const toggleStar = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation()
    soundEngine.playKeyClick()
    setMails((prev) =>
      prev.map((m) => (m.id === id ? { ...m, isStarred: !m.isStarred } : m))
    )
  }

  const moveToTrashOrRestore = (mail: ModMailMessage) => {
    soundEngine.playKeyClick()
    const nextFolder = mail.folder === 'trash' ? 'inbox' : 'trash'
    setMails((prev) =>
      prev.map((m) => (m.id === mail.id ? { ...m, folder: nextFolder } : m))
    )
  }

  const handleAcceptOffer = (mail: ModMailMessage) => {
    const amount = mail.bribeOffer?.cashAmount || mail.sponsorOffer?.cashAmount || 0
    if (mail.isBribe && mail.bribeOffer) {
      adjustPersonalCash(amount)
      setSanity((prev) => Math.max(0, prev - 10))
      addBankTransaction({
        title: `📩 ModMail Gizli Teklif Ödemesi (${mail.sender})`,
        amount,
        type: 'income',
        account: 'personal'
      })
    } else if (mail.isSponsorship && mail.sponsorOffer) {
      adjustPersonalCash(amount)
      addBankTransaction({
        title: `📢 ModMail Sponsorluk Anlaşması (${mail.sender})`,
        amount,
        type: 'income',
        account: 'personal'
      })
    }

    const nowTime = new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
    const sentReply: ModMailMessage = {
      id: `sent-${Date.now()}`,
      folder: 'sent',
      sender: iscordAccount.username || 'Admin_Overlord',
      recipient: mail.sender,
      subject: `RE: ${mail.subject} (Kabul Edildi)`,
      preview: `Teklifiniz tarafımca onaylanmıştır (+${amount}₺)...`,
      fullBody: `Merhaba ${mail.sender},\n\nİlettiğiniz "${mail.subject}" konulu teklifinizi kabul ediyorum. Ödeme (${amount}₺) hesabıma ulaşmıştır, gereği yapılacaktır.\n\nSaygılarımla,\n${iscordAccount.username}`,
      timestamp: `Bugün ${nowTime}`,
      isRead: true
    }

    setMails((prev) => [
      sentReply,
      ...prev.map((m) => (m.id === mail.id ? { ...m, status: 'accepted' as const } : m))
    ])
  }

  const handleDeclineOffer = (mail: ModMailMessage) => {
    soundEngine.playKeyClick()
    setSanity((prev) => Math.min(100, prev + 10))

    const nowTime = new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
    const sentReply: ModMailMessage = {
      id: `sent-${Date.now()}`,
      folder: 'sent',
      sender: iscordAccount.username || 'Admin_Overlord',
      recipient: mail.sender,
      subject: `RE: ${mail.subject} (Reddedildi)`,
      preview: 'Teklifiniz sunucu ilkelerimiz gereği reddedilmiştir...',
      fullBody: `Merhaba ${mail.sender},\n\nİlettiğiniz teklif topluluk kurallarımıza aykırı olduğu için reddedilmiştir.\n\n${iscordAccount.username}`,
      timestamp: `Bugün ${nowTime}`,
      isRead: true
    }

    setMails((prev) => [
      sentReply,
      ...prev.map((m) => (m.id === mail.id ? { ...m, status: 'declined' as const } : m))
    ])
  }

  const handleQuickReply = (mail: ModMailMessage, replyText: string) => {
    soundEngine.playKeyClick()
    const nowTime = new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
    const sentReply: ModMailMessage = {
      id: `sent-${Date.now()}`,
      folder: 'sent',
      sender: iscordAccount.username || 'Admin_Overlord',
      recipient: mail.sender,
      subject: `RE: ${mail.subject}`,
      preview: replyText,
      fullBody: replyText,
      timestamp: `Bugün ${nowTime}`,
      isRead: true
    }
    setMails((prev) => [
      sentReply,
      ...prev.map((m) => (m.id === mail.id ? { ...m, repliedText: replyText } : m))
    ])
  }

  const folderTitleMap: Record<MailFolder, string> = {
    inbox: 'Gelen İletiler',
    starred: 'Yıldızlı İletiler',
    sent: 'Gönderilen İletiler',
    trash: 'Çöp Kutusu'
  }

  return (
    <div className="flex h-full w-full bg-[#181a20] text-zinc-200 select-none font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Mail Sidebar */}
      <div className="w-52 bg-[#121317] border-r border-[#262831] p-3 flex flex-col justify-between shrink-0">
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-white uppercase tracking-wider px-1">
            <Mail className="w-4 h-4 text-amber-400" />
            <span>ModMail v2.4</span>
          </div>

          <button
            onClick={() => {
              soundEngine.playKeyClick()
              setIsComposeOpen(true)
            }}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs shadow-md transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Yeni İleti Yaz</span>
          </button>

          <div className="space-y-1">
            <button
              onClick={() => {
                soundEngine.playKeyClick()
                setActiveFolder('inbox')
              }}
              className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                activeFolder === 'inbox'
                  ? 'bg-[#222530] text-white border border-white/10'
                  : 'text-zinc-400 hover:bg-white/5'
              }`}
            >
              <span className="flex items-center gap-2">
                <Inbox className="w-4 h-4 text-sky-400" />
                <span>Gelen Kutusu</span>
              </span>
              <span className="text-[10px] bg-amber-500 text-black px-1.5 py-0.5 rounded-full font-bold">
                {mails.filter((m) => m.folder === 'inbox' && !m.isRead).length}
              </span>
            </button>

            <button
              onClick={() => {
                soundEngine.playKeyClick()
                setActiveFolder('starred')
              }}
              className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                activeFolder === 'starred'
                  ? 'bg-[#222530] text-white border border-white/10'
                  : 'text-zinc-400 hover:bg-white/5'
              }`}
            >
              <span className="flex items-center gap-2">
                <Star className="w-4 h-4 text-amber-400" />
                <span>Yıldızlı</span>
              </span>
              <span className="text-[10px] text-zinc-400 font-mono">
                {mails.filter((m) => m.isStarred && m.folder !== 'trash').length}
              </span>
            </button>

            <button
              onClick={() => {
                soundEngine.playKeyClick()
                setActiveFolder('sent')
              }}
              className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                activeFolder === 'sent'
                  ? 'bg-[#222530] text-white border border-white/10'
                  : 'text-zinc-400 hover:bg-white/5'
              }`}
            >
              <span className="flex items-center gap-2">
                <Send className="w-4 h-4 text-emerald-400" />
                <span>Gönderilen</span>
              </span>
              <span className="text-[10px] text-zinc-400 font-mono">
                {mails.filter((m) => m.folder === 'sent').length}
              </span>
            </button>

            <button
              onClick={() => {
                soundEngine.playKeyClick()
                setActiveFolder('trash')
              }}
              className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                activeFolder === 'trash'
                  ? 'bg-[#222530] text-white border border-white/10'
                  : 'text-zinc-400 hover:bg-white/5'
              }`}
            >
              <span className="flex items-center gap-2">
                <Trash2 className="w-4 h-4 text-red-400" />
                <span>Çöp Kutusu</span>
              </span>
              <span className="text-[10px] text-zinc-400 font-mono">
                {mails.filter((m) => m.folder === 'trash').length}
              </span>
            </button>
          </div>
        </div>

        <div className="p-2.5 rounded-xl bg-[#181a22] border border-[#282a35] text-[11px] text-zinc-400 space-y-1">
          <div className="text-[10px] font-bold text-zinc-300 uppercase">Ahlak & Prestij</div>
          <div>
            Hype: <span className="text-amber-400 font-bold">%{hype}</span>
          </div>
          <div className="text-[10px] text-zinc-500">
            Rüşvetler kişisel paranı artırır ancak yakalanırsan Hype hızla düşer.
          </div>
        </div>
      </div>

      {/* Message List */}
      <div className="w-72 bg-[#15171d] border-r border-[#262831] flex flex-col shrink-0 overflow-y-auto">
        <div className="p-3 border-b border-[#262831] text-xs font-bold text-zinc-400 uppercase tracking-wider flex items-center justify-between">
          <span>{folderTitleMap[activeFolder]}</span>
          <div className="flex items-center gap-2">
            {activeFolder === 'trash' && filteredMails.length > 0 && (
              <button
                onClick={emptyTrash}
                className="text-[10px] text-red-400 hover:text-red-300 font-bold flex items-center gap-1 cursor-pointer"
                title="Tüm çöpleri kalıcı sil"
              >
                <Trash2 className="w-3 h-3" />
                <span>Boşalt</span>
              </button>
            )}
            <span className="text-[10px] font-mono text-zinc-500">{filteredMails.length} İleti</span>
          </div>
        </div>

        {filteredMails.length === 0 ? (
          <div className="p-6 text-center text-xs text-zinc-500">
            Bu klasörde herhangi bir e-posta bulunmuyor.
          </div>
        ) : (
          <div className="divide-y divide-[#22242d]">
            {filteredMails.map((mail) => {
              const isSelected = selectedMail?.id === mail.id
              return (
                <div
                  key={mail.id}
                  onClick={() => handleSelectMail(mail.id)}
                  className={`w-full text-left p-3 transition-colors cursor-pointer relative ${
                    isSelected ? 'bg-[#20232c]' : 'hover:bg-[#1a1c22]'
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px] gap-1">
                    <span
                      className={`font-bold truncate ${
                        mail.isRead ? 'text-zinc-300' : 'text-white'
                      }`}
                    >
                      {mail.folder === 'sent' ? `Kime: ${mail.recipient}` : mail.sender}
                    </span>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={(e) => toggleStar(mail.id, e)}
                        className="text-zinc-500 hover:text-amber-400 cursor-pointer"
                        title="Yıldızla"
                      >
                        <Star
                          className={`w-3.5 h-3.5 ${
                            mail.isStarred ? 'fill-amber-400 text-amber-400' : ''
                          }`}
                        />
                      </button>
                      <span className="text-[10px] text-zinc-500">{mail.timestamp}</span>
                    </div>
                  </div>
                  <div className="text-xs font-medium text-zinc-200 truncate mt-0.5">
                    {mail.subject}
                  </div>
                  <div className="text-[11px] text-zinc-500 truncate mt-0.5">{mail.preview}</div>
                  {mail.isBribe && mail.status === 'pending' && (
                    <span className="inline-block mt-1 text-[9px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30 font-bold">
                      Rüşvet Teklifi
                    </span>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Message Viewport */}
      <div className="flex-1 p-6 flex flex-col justify-between overflow-y-auto bg-[#181a20]">
        {selectedMail ? (
          <div className="space-y-5 max-w-2xl">
            <div className="border-b border-[#282a35] pb-4 space-y-2">
              <div className="flex items-start justify-between gap-3">
                <h2 className="text-base font-bold text-white">{selectedMail.subject}</h2>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => toggleStar(selectedMail.id)}
                    className={`p-1.5 rounded-lg border text-xs flex items-center gap-1 cursor-pointer ${
                      selectedMail.isStarred
                        ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                        : 'bg-zinc-800 border-white/10 text-zinc-400 hover:text-white'
                    }`}
                  >
                    <Star
                      className={`w-3.5 h-3.5 ${selectedMail.isStarred ? 'fill-amber-400' : ''}`}
                    />
                    <span>{selectedMail.isStarred ? 'Yıldızlı' : 'Yıldızla'}</span>
                  </button>

                  <button
                    onClick={() => moveToTrashOrRestore(selectedMail)}
                    className="p-1.5 rounded-lg bg-zinc-800 hover:bg-red-950/60 border border-white/10 text-zinc-300 hover:text-red-300 text-xs flex items-center gap-1 cursor-pointer"
                  >
                    {selectedMail.folder === 'trash' ? (
                      <>
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Geri Yükle</span>
                      </>
                    ) : (
                      <>
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Çöpe Taşı</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-zinc-400">
                <span>
                  {selectedMail.folder === 'sent' ? (
                    <>
                      Alıcı: <strong className="text-zinc-200">{selectedMail.recipient}</strong>
                    </>
                  ) : (
                    <>
                      Kimden: <strong className="text-zinc-200">{selectedMail.sender}</strong>
                    </>
                  )}
                </span>
                <span className="font-mono text-[11px]">{selectedMail.timestamp}</span>
              </div>
            </div>

            <div className="text-xs text-zinc-300 leading-relaxed whitespace-pre-wrap select-text bg-[#14151b] p-4 rounded-xl border border-[#262833]">
              {selectedMail.fullBody}
            </div>

            {/* Bribery or Sponsorship Interactive Choice */}
            {(selectedMail.isBribe || selectedMail.isSponsorship) && (
              <div className="p-4 rounded-xl bg-[#20232d] border border-[#2f3240] space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-400">
                  <AlertTriangle className="w-4 h-4" />
                  <span>
                    Ahlaki Karar:{' '}
                    {selectedMail.isBribe ? 'Yolsuzluk & Rüşvet' : 'Sponsorluk Kabulü'}
                  </span>
                </div>

                <div className="text-xs text-zinc-300">
                  Teklif Edilen Tutar:{' '}
                  <strong className="text-emerald-400 font-mono text-sm">
                    {selectedMail.bribeOffer?.cashAmount ||
                      selectedMail.sponsorOffer?.cashAmount}
                    ₺
                  </strong>
                </div>

                {selectedMail.status === 'pending' ? (
                  <div className="flex gap-3 pt-2">
                    <button
                      onClick={() => handleAcceptOffer(selectedMail)}
                      className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 transition-colors shadow cursor-pointer"
                    >
                      <DollarSign className="w-4 h-4" />
                      <span>
                        Teklifi Kabul Et (+
                        {selectedMail.bribeOffer?.cashAmount ||
                          selectedMail.sponsorOffer?.cashAmount}
                        ₺)
                      </span>
                    </button>
                    <button
                      onClick={() => handleDeclineOffer(selectedMail)}
                      className="px-4 py-2 rounded-lg bg-zinc-700 hover:bg-zinc-600 text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                      <span>Reddet (Dürüst Kal)</span>
                    </button>
                  </div>
                ) : (
                  <div className="text-xs font-bold font-mono">
                    {selectedMail.status === 'accepted' ? (
                      <span className="text-emerald-400 flex items-center gap-1">
                        <Check className="w-4 h-4" /> Teklif kabul edildi. Para kişisel bakiyeye
                        aktarıldı ve yanıt Gönderilen kutusuna eklendi.
                      </span>
                    ) : (
                      <span className="text-zinc-400 flex items-center gap-1">
                        <X className="w-4 h-4" /> Teklif reddedildi. Yanıtınız Gönderilen kutusuna
                        eklendi.
                      </span>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Quick Reply Choice Buttons for non-offer mails */}
            {!selectedMail.isBribe &&
              !selectedMail.isSponsorship &&
              selectedMail.folder === 'inbox' && (
                <div className="p-4 rounded-xl bg-[#14161d] border border-white/10 space-y-2.5">
                  <div className="text-xs font-bold text-zinc-300 flex items-center gap-1.5">
                    <Reply className="w-3.5 h-3.5 text-sky-400" />
                    <span>Hızlı Yanıt Seçenekleri:</span>
                  </div>
                  {selectedMail.repliedText ? (
                    <div className="text-xs text-emerald-400 font-medium">
                      ✓ Yanıt gönderildi: "{selectedMail.repliedText}" (Gönderilen klasöründen
                      görüntüleyebilirsiniz)
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {[
                        'Anlaşıldı Efe Bey, talimatlarınızı hemen uyguluyorum.',
                        'Raporunuz için teşekkürler, sunucu güvenliği kontrol altında.',
                        'En kısa sürede VDS kurulumunu ve denetimleri tamamlayacağım.'
                      ].map((opt, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleQuickReply(selectedMail, opt)}
                          className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-sky-600/30 border border-white/10 hover:border-sky-500/40 text-xs text-zinc-200 transition-colors cursor-pointer"
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
          </div>
        ) : (
          <div className="text-center py-20 text-xs text-zinc-500">
            Bu klasörde görüntülenecek e-posta yok.
          </div>
        )}
      </div>

      {/* Compose Email Modal */}
      {isComposeOpen && (
        <div 
          className="fixed inset-0 z-[99999] bg-black/70 flex items-center justify-center p-4"
          onClick={() => setIsComposeOpen(false)}
        >
          <div 
            className="w-full max-w-lg bg-[#1a1c24] border border-[#2e313d] rounded-2xl shadow-2xl p-5 text-xs select-none space-y-4 animate-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-[#2e313d] pb-3">
              <div className="flex items-center gap-2">
                <Send className="w-4 h-4 text-amber-400" />
                <h3 className="text-sm font-bold text-white">Yeni İleti Gönder</h3>
              </div>
              <button 
                onClick={() => setIsComposeOpen(false)}
                className="text-zinc-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSendCompose} className="space-y-3.5">
              <div>
                <label className="block text-[11px] font-bold text-zinc-400 uppercase mb-1">Alıcı (Kime)</label>
                <select
                  value={composeTo}
                  onChange={(e) => setComposeTo(e.target.value)}
                  className="w-full px-3 py-2 bg-[#121317] border border-[#2e313d] rounded-lg text-white text-xs focus:outline-none focus:border-amber-500"
                >
                  <option value="Kurucu_Efe (Sunucu Sahibi)">Kurucu_Efe (Sunucu Sahibi)</option>
                  <option value="Zengin_Balina (VIP)">Zengin_Balina (VIP Üye)</option>
                  <option value="Turnuva_Organizasyon">Turnuva Organizasyon Ekibi</option>
                  <option value="CryptoSpin Sponsorluğu">CryptoSpin Sponsorluk Temsilcisi</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-zinc-400 uppercase mb-1">Konu</label>
                <input
                  type="text"
                  required
                  placeholder="E-posta konusu..."
                  value={composeSubject}
                  onChange={(e) => setComposeSubject(e.target.value)}
                  className="w-full px-3 py-2 bg-[#121317] border border-[#2e313d] rounded-lg text-white text-xs focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-zinc-400 uppercase mb-1">Mesaj İçeriği</label>
                <textarea
                  required
                  rows={5}
                  placeholder="Mesajınızı buraya yazın..."
                  value={composeBody}
                  onChange={(e) => setComposeBody(e.target.value)}
                  className="w-full px-3 py-2 bg-[#121317] border border-[#2e313d] rounded-lg text-white text-xs focus:outline-none focus:border-amber-500 resize-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-[#2e313d]">
                <button
                  type="button"
                  onClick={() => setIsComposeOpen(false)}
                  className="px-3.5 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-semibold text-xs cursor-pointer"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs flex items-center gap-1.5 shadow cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Gönder</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
