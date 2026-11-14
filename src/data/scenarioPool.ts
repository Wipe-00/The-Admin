import { TICKET_SCENARIOS, TicketScenario } from './ticketScenarios'
import { ADDITIONAL_SCENARIOS } from './additionalScenarios'
import { USER_NICKNAMES_POOL } from './userNicknames'

const ACCUSED_POOL = [
  ...USER_NICKNAMES_POOL.slice(0, 75),
  'Berk_06', 'DarkKnight', 'TrollKing_34', 'Sniper_Wolf', 'Gokhan_X',
  'Zehir_44', 'Vortex_TR', 'Toxic_Efe', 'Ghost_Rider', 'Kaan_35', 'Mertcan_99', 'Shadow_X'
]

const CREATOR_POOL = [
  ...USER_NICKNAMES_POOL.slice(75),
  'Ahmet_B', 'BarisPro', 'CanerKral', 'Doga_TR', 'Efe_Gamer', 'Furkan07', 'Hakan99',
  'Irem_S', 'KaanVip', 'Levent_Sniper', 'Nazli_Wolf', 'Oguz_Khan', 'Pelin_9', 'RamazanTR'
]

interface ScenarioArchetype {
  category: TicketScenario['category']
  subjectPrefix: string
  issueTemplates: string[]
  evidenceProvided: boolean
  correctLabel: string
  correctReply: string
  correctAction: 'ban_accused' | 'mute_accused' | 'dismiss' | 'warn_user'
  wrongLabel1: string
  wrongReply1: string
  wrongAction1: 'ban_accused' | 'mute_accused' | 'dismiss' | 'warn_user'
  wrongLabel2: string
  wrongReply2: string
  wrongAction2: 'ban_accused' | 'mute_accused' | 'dismiss' | 'warn_user'
}

const ARCHETYPES: ScenarioArchetype[] = [
  {
    category: 'Şikayet',
    subjectPrefix: 'Ses Kanalında Aşırı Bass & Soundpad Trolü',
    issueTemplates: [
      'Sohbet Odası #1 kanalında {accused} sürekli yüksek desibel Soundpad açıp kulaklığımızı patlatıyor.',
      'Oyun Ekibi odasında rekabetçi maç oynarken {accused} odaya girip çığlık efektleri basıp çıkıyor.',
      'Müzik odasında şarkı dinlerken {accused} mikrofonunu ağzına sokup üfleyerek herkesi rahatsız ediyor.'
    ],
    evidenceProvided: true,
    correctLabel: 'Ses loglarını inceledim, kullanıcıya 1 saat susturma (Mute) uyguluyorum.',
    correctReply: 'Ses kanalı desibel kayıtları doğrulandı. Kural 3 gereği kullanıcıya 1 saat susturma cezası verildi.',
    correctAction: 'mute_accused',
    wrongLabel1: 'Sesten çıkın o zaman, bunun için bilet mi açılır?',
    wrongReply1: 'Kendi aranızda halledin veya kulaklığın sesini kısın.',
    wrongAction1: 'dismiss',
    wrongLabel2: 'Şikayet eden kişiyi de şüpheliyi de kalıcı banlıyorum.',
    wrongReply2: 'İkinizi de sunucudan kalıcı olarak uzaklaştırdım.',
    wrongAction2: 'ban_accused'
  },
  {
    category: 'Dolandırıcılık',
    subjectPrefix: 'Sahte Oyun Kodu / Phishing Linki İhbarı',
    issueTemplates: [
      '#{channel} kanalında {accused} isimli üye bedava Steam 50$ cüzdan kodu diye sahte bir site linki paylaşıyor.',
      '{accused} özelden ve genel sohbetten "Bedava 3 Aylık Discord Nitro" diyerek hesap çalan link atıyor.',
      '{accused} turnuva kayıt formu adı altında şifre soran oltalama (phishing) linki yayıyor.'
    ],
    evidenceProvided: true,
    correctLabel: 'Oltalama (Phishing) linki doğrulandı. Kullanıcıyı kalıcı olarak banla!',
    correctReply: 'Bildiriminiz için teşekkürler. Zararlı bağlantı silindi ve @{accused} sunucudan kalıcı olarak yasaklandı.',
    correctAction: 'ban_accused',
    wrongLabel1: 'Link zararsız görünüyor, belki gerçekten hediye dağıtıyordur.',
    wrongReply1: 'Linkte bir sorun göremedik, isteyen tıklayabilir.',
    wrongAction1: 'dismiss',
    wrongLabel2: 'Sadece 15 dakika susturma verip geçelim.',
    wrongReply2: 'Kullanıcıya 15 dakika uyarı susturması verildi.',
    wrongAction2: 'mute_accused'
  },
  {
    category: 'Şikayet',
    subjectPrefix: 'Oyun Sohbetinde Ağır Küfür & Provokasyon',
    issueTemplates: [
      '#oyun-sohbeti kanalında {accused} yenildiği maçtan sonra tüm takıma ve ailevi değerlere ağır küfürler yağdırdı.',
      '#genel-sohbet kanalında {accused} durduk yere yeni gelen üyelere hakaret edip kışkırtıyor.',
      '#ekran-görüntüleri kanalında attığım fotoğrafın altına {accused} çok ağır küfürler yazdı.'
    ],
    evidenceProvided: true,
    correctLabel: 'Ekran görüntüsündeki ağır küfür sabit. Kural 1 gereği cezalandırıyorum.',
    correctReply: 'Kanıt incelendi. Ailevi ve ağır hakaret nedeniyle @{accused} hakkında disiplin işlemi başlatıldı.',
    correctAction: 'ban_accused',
    wrongLabel1: 'Oyunda sinirlenmiştir normaldir, işlem yapmıyorum.',
    wrongReply1: 'Rekabetçi oyunlarda böyle şeyler olur, büyütmeyin.',
    wrongAction1: 'dismiss',
    wrongLabel2: 'Kanıt olmasına rağmen yetersiz deyip bileti kapat.',
    wrongReply2: 'Deliller yetersiz bulunduğu için talep kapatıldı.',
    wrongAction2: 'dismiss'
  },
  {
    category: 'Ceza İtirazı',
    subjectPrefix: 'Kanıtsız İftira & Haksız Ban Talebi',
    issueTemplates: [
      'Hocam {accused} benim en sevdiğim oyuna çöp dedi, hemen onu perma banlayın lütfen kanıtım yok ama kesin banlayın!',
      '{accused} profil fotoğrafını benimkine benzetmiş, gıcık oldum sunucudan atar mısınız?',
      '{accused} ses odasında benimle konuşmadı, kesin arkamdan iş çeviriyor banlayın şunu!'
    ],
    evidenceProvided: false,
    correctLabel: 'Ortada kural ihlali veya kanıt yok. Talebi reddet ve uyar.',
    correctReply: 'Kişisel anlaşmazlıklar veya kural ihlali içermeyen durumlar için ceza uygulanamaz. Gereksiz bilet açmayınız.',
    correctAction: 'dismiss',
    wrongLabel1: 'Madem gıcık oldun hemen {accused} kullanıcısını perma banlıyorum!',
    wrongReply1: 'İsteğiniz üzerine kullanıcıyı sorgusuz sualsiz banladım.',
    wrongAction1: 'ban_accused',
    wrongLabel2: 'Şüpheliyi 24 saat susturuyorum.',
    wrongReply2: 'Kullanıcıya 24 saat mute atıldı.',
    wrongAction2: 'mute_accused'
  },
  {
    category: 'Yetki & Rol',
    subjectPrefix: 'Sahte Dekontla VIP Rolü İsteme Vakası',
    issueTemplates: [
      'Selam admin, sunucu kasasına 500₺ bağış attım (ekteki Paint ile yapılmış dekonta bakın), hemen VIP Balina rolümü verin!',
      'Ben {accused} hesabının yan çarıyım, dün para atmıştım şimdi bu hesaba da Moderatörlük verin!',
      'Kurucu Efe benim amcamın oğlu, bana hemen Yönetici rolü tanımlayın yoksa sizi kovdururum!'
    ],
    evidenceProvided: true,
    correctLabel: 'Dekont/iddia sahte! Dolandırıcılık girişimini reddet ve uyar.',
    correctReply: 'Banka kayıtlarımızda böyle bir işlem bulunmamaktadır. Sahte beyan nedeniyle talebiniz reddedildi.',
    correctAction: 'warn_user',
    wrongLabel1: 'Hiç kontrol etmeden hemen VIP Balina ve Moderatör rolü ver.',
    wrongReply1: 'Tamamdır hemen yetkilerinizi tanımladım hayırlı olsun.',
    wrongAction1: 'dismiss',
    wrongLabel2: 'Sunucu kasasından üstüne bir de 200₺ iade gönder.',
    wrongReply2: 'Hemen rolünüzü ve ödemenizi gönderiyorum.',
    wrongAction2: 'dismiss'
  }
]

// Generates 1,050+ unique ticket scenarios combining handcrafted + procedural variations
let cachedAllScenarios: TicketScenario[] | null = null

export function getAllScenarios(): TicketScenario[] {
  if (cachedAllScenarios) return cachedAllScenarios

  const base = [...TICKET_SCENARIOS, ...ADDITIONAL_SCENARIOS]
  const generated: TicketScenario[] = []

  const CHANNELS = ['genel-sohbet', 'oyun-sohbeti', 'ekran-görüntüleri', 'ses-odasi-1', 'turnuva-lobi']

  let counter = 1
  for (let round = 0; round < 18; round++) {
    for (const arch of ARCHETYPES) {
      for (let idx = 0; idx < ACCUSED_POOL.length; idx++) {
        if (generated.length >= 1000) break
        const accused = ACCUSED_POOL[(idx + round) % ACCUSED_POOL.length]
        const creator = CREATOR_POOL[(idx * 3 + round) % CREATOR_POOL.length]
        const channel = CHANNELS[(idx + round) % CHANNELS.length]
        const rawIssue = arch.issueTemplates[(idx + round) % arch.issueTemplates.length]
        const userIssue = rawIssue
          .replace(/\{accused\}/g, accused)
          .replace(/\{channel\}/g, channel)

        generated.push({
          id: `gen_sc_${counter++}`,
          category: arch.category,
          subject: `${arch.subjectPrefix} (#${1000 + counter})`,
          userIssue,
          creatorUsername: creator,
          accusedUsername: accused,
          evidenceProvided: arch.evidenceProvided,
          choices: [
            {
              id: 'c1',
              label: arch.correctLabel.replace(/\{accused\}/g, accused),
              replyText: arch.correctReply.replace(/\{accused\}/g, accused),
              userReaction: 'Teşekkürler modum, adalet yerini buldu.',
              isCorrect: true,
              hypeDelta: 4,
              sanityDelta: 2,
              actionType: arch.correctAction,
              feedback: 'Doğru prosedürü uyguladın. Topluluk düzeni korundu.'
            },
            {
              id: 'c2',
              label: arch.wrongLabel1.replace(/\{accused\}/g, accused),
              replyText: arch.wrongReply1.replace(/\{accused\}/g, accused),
              userReaction: 'Böyle yönetim mi olur ya?! Şaka gibisiniz.',
              isCorrect: false,
              hypeDelta: -7,
              sanityDelta: -5,
              actionType: arch.wrongAction1,
              feedback: 'Hatalı karar verdin, sunucu üyeleri tepki gösterdi.'
            },
            {
              id: 'c3',
              label: arch.wrongLabel2.replace(/\{accused\}/g, accused),
              replyText: arch.wrongReply2.replace(/\{accused\}/g, accused),
              userReaction: 'Ne alaka şimdi bu karar?!',
              isCorrect: false,
              hypeDelta: -9,
              sanityDelta: -6,
              actionType: arch.wrongAction2,
              feedback: 'Orantısız ve yanlış müdahale yaptın.'
            }
          ]
        })
      }
    }
  }

  cachedAllScenarios = [...base, ...generated]
  return cachedAllScenarios
}
