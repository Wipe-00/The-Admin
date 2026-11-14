import React, { useState, useRef, useEffect } from 'react'
import { useGame } from '../../context/GameContext'

export const TerminalApp: React.FC = () => {
  const {
    hype,
    sanity,
    members,
    personalCash,
    serverFunds,
    banMember,
    muteMember,
    auditLogs,
    isSlowModeActive,
    toggleSlowMode,
    isRaidActive,
    activeRaiders,
    nukeAllRaiders,
    botGlitchActive,
    restartBots,
    serverLevel,
    upgradeServerLevel
  } = useGame()

  const [history, setHistory] = useState<string[]>([
    'ModOS [Sürüm 4.2.19045.2486] - Root CLI Subsystem',
    '(c) 2026 Dark Query Corp. Tüm hakları saklıdır.',
    '',
    'Root erişimi: AKTİF. Siber savunma ve moderasyon komutları için "help" yazın.',
    ''
  ])
  const [inputVal, setInputVal] = useState('')
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [history])

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault()
    const cmd = inputVal.trim()
    if (!cmd) return

    const newHistory = [...history, `root@overlord:~$ ${cmd}`]
    const parts = cmd.split(' ')
    const action = parts[0].toLowerCase()

    switch (action) {
      case 'help':
        newHistory.push(
          'Kullanılabilir Terminal Komutları:',
          '  trace_ip / netstat       : Aktif ağ trafiğini ve botnet C2 IP adreslerini tarar',
          '  nuke_botnet              : [SİBER DARBE] Tespit edilen tüm raid botlarını tek darbede imhâ eder',
          '  restart_bots / reboot    : Çöken veya döngüye giren bot servislerini baştan başlatır',
          '  boost / upgrade          : Sunucuyu Seviye 2 veya 3\'e boostlar (Kasa fonundan harcar)',
          '  ban <kullanici> <sebep>  : Kullanıcıyı sunucudan kalıcı olarak uzaklaştırır',
          '  mute <kullanici> <dk>    : Kullanıcıyı belirtilen süre kadar susturur',
          '  slowmode                 : Yavaş Mod durumunu değiştirir (Aç/Kapat)',
          '  audit                    : Son 10 işlem ve ceza kaydını listeler',
          '  status                   : Sunucu Seviyesi, Hype, Sanity ve ekonomi durumunu döker',
          '  members                  : Çevrimiçi üyeleri listeler',
          '  clear                    : Terminal ekranını temizler'
        )
        break

      case 'trace_ip':
      case 'netstat':
        if (isRaidActive && activeRaiders.length > 0) {
          newHistory.push(
            '⚠️ [ALARM] TEHLİKELİ DDOS / BOTNET SYN FLOOD TESPİT EDİLDİ!',
            '  Saldırgan Botnet C2 IP : 185.220.101.45 (ZeroSquad-ProxyNet AS4412)',
            '  Hedef Port             : 8080 (Discord Gateway / Webhook)',
            `  Aktif Zombie Bot Sayısı: ${activeRaiders.length} Bot Host`,
            '  Ters Ağ Analizi: C2 Sunucu savunması ZAYIF! Tersine DDoS açığı mevcut.',
            '  ⚡ ÖNERİ: "nuke_botnet" yazarak karşı siber saldırıyı ateşleyin!'
          )
        } else {
          newHistory.push(
            '[*] Ağ bağlantıları taranıyor... [TAMAMLANDI]',
            '[*] 0 şüpheli botnet veya DDoS trafiği tespit edildi.',
            '[*] Gateway: 192.168.1.1 (STABİL) — Tüm gelen paketler doğrulanmış.'
          )
        }
        break

      case 'nuke_botnet':
      case 'nuke':
        if (isRaidActive && activeRaiders.length > 0) {
          newHistory.push(
            '🚀 [SİBER KARŞI SALDIRI BAŞLATILIYOR]...',
            '[*] Hedef: 185.220.101.45 (ZeroSquad C2 Botnet Master)',
            '[*] Exploit payload fırlatılıyor (CVE-2026-9041 Buffer Overrun)...',
            '[*] Hedef sunucunun C2 bağlantıları koparıldı!',
            '💥 [BOMBA ETKİSİ] 20 Troll Botu sunucudan tamamen banlandı ve IP\'leri yok edildi!',
            '✨ Sunucu güvenliği sağlandı (+30 Hype, +25 Akıl Sağlığı). Başarım kazanıldı!'
          )
          nukeAllRaiders()
        } else {
          newHistory.push('[!] Aktif bir raid baskını veya botnet tehdidi bulunmuyor.')
        }
        break

      case 'restart_bots':
      case 'reboot':
        restartBots()
        newHistory.push(
          '[*] Bot daemon servisleri taranıyor (PID: 1042, 1088, 2031)...',
          '[*] SIGTERM sinyali gönderildi... [OK]',
          '[*] Node.js runtime yeniden yüklendi. Bellek sızıntıları temizlendi.',
          botGlitchActive
            ? '✅ [DÜZELTİLDİ] Bot glitch hata döngüsü ve spam başarıyla sonlandırıldı!'
            : '✅ [BAŞARILI] Bot servisleri sıfırlandı ve stabil durumda.'
        )
        break

      case 'boost':
      case 'upgrade': {
        const res = upgradeServerLevel()
        newHistory.push(res.success ? `[BAŞARILI] ${res.message}` : `[HATA] ${res.message}`)
        break
      }

      case 'slowmode':
        toggleSlowMode()
        newHistory.push(`[SİSTEM] Yavaş Mod ${!isSlowModeActive ? 'AÇILDI (12s)' : 'KAPATILDI'}.`)
        break

      case 'clear':
        setHistory([])
        setInputVal('')
        return

      case 'status':
        newHistory.push(
          `--- SUNUCU DURUM RAPORU ---`,
          `Sunucu Seviyesi  : Seviye ${serverLevel} ${serverLevel === 3 ? '(ELİT)' : serverLevel === 2 ? '(GELİŞMİŞ)' : '(STANDART)'}`,
          `Hype Seviyesi    : %${hype}`,
          `Akıl Sağlığı     : %${sanity}`,
          `Kişisel Bakiye   : ${personalCash}₺`,
          `Sunucu Kasası    : ${serverFunds}₺`,
          `Toplam Üye Sayısı: ${members.length}`,
          `Aktif Raid Tehdit: ${isRaidActive ? `EVET (${activeRaiders.length} Bot)` : 'YOK'}`,
          `Bot Glitch Durum : ${botGlitchActive ? '🚨 HATA DÖNGÜSÜNDE (restart_bots çalıştırın)' : 'STABİL'}`
        )
        break

      case 'members':
        newHistory.push(
          `Toplam ${members.length} Üye:`,
          ...members.map((m) => `  [${m.role}] ${m.username} (${m.isOnline ? 'ONLINE' : 'OFFLINE'})`)
        )
        break

      case 'audit':
        newHistory.push(
          'Son Denetim Kayıtları:',
          ...auditLogs.slice(0, 8).map((l) => `  [${l.timestamp}] ${l.action} -> ${l.target} (${l.details})`)
        )
        break

      case 'ban':
        if (!parts[1]) {
          newHistory.push('Hata: Kullanıcı adı belirtmelisiniz. Örnek: ban Berk_06 Küfür')
        } else {
          const target = parts[1]
          const reason = parts.slice(2).join(' ') || 'Kural ihlali'
          const success = banMember(target, reason)
          if (success) {
            newHistory.push(`[BAŞARILI] "${target}" sunucudan kalıcı olarak uzaklaştırıldı.`)
          } else {
            newHistory.push(`[HATA] "${target}" adında bir üye bulunamadı.`)
          }
        }
        break

      case 'mute':
        if (!parts[1]) {
          newHistory.push('Hata: Kullanıcı adı belirtmelisiniz. Örnek: mute TrollBass 30')
        } else {
          const target = parts[1]
          const minutes = parseInt(parts[2], 10) || 15
          muteMember(target, minutes)
          newHistory.push(`[BAŞARILI] "${target}" ${minutes} dakika susturuldu.`)
        }
        break

      default:
        newHistory.push(`Bilinmeyen komut: "${cmd}". Komut listesi için "help" yazın.`)
        break
    }

    setHistory(newHistory)
    setInputVal('')
  }

  return (
    <div className="h-full w-full bg-[#0c0d10] text-emerald-400 font-mono text-xs p-3 flex flex-col select-text overflow-hidden">
      <div className="flex-1 overflow-y-auto space-y-1">
        {history.map((line, i) => (
          <div key={i} className="whitespace-pre-wrap leading-relaxed">
            {line}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <form onSubmit={handleCommand} className="flex items-center gap-2 pt-2 border-t border-emerald-950/40">
        <span className="text-emerald-500 font-bold shrink-0">root@overlord:~$</span>
        <input
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          autoFocus
          className="flex-1 bg-transparent text-emerald-300 outline-none font-mono"
        />
      </form>
    </div>
  )
}
