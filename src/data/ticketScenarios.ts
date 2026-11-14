export interface TicketChoice {
  id: string
  label: string
  replyText: string
  userReaction: string
  isCorrect: boolean
  hypeDelta: number
  sanityDelta: number
  moneyDelta?: number
  actionType: 'ban_accused' | 'mute_accused' | 'dismiss' | 'warn_user' | 'grant_role' | 'refund'
  feedback: string
}

export interface EvidenceDetails {
  type: 'image_ss' | 'chat_dump' | 'receipt' | 'link_preview'
  title: string
  subtitle: string
  authorName: string
  timestamp: string
  reportedContent: string
  channelName: string
  extraNotes?: string
  isTamperedOrFake?: boolean
}

export interface TicketScenario {
  id: string
  category?: 'Şikayet' | 'Ceza İtirazı' | 'Yetki & Rol' | 'Dolandırıcılık' | 'Teknik Destek' | 'Genel'
  subject: string
  userIssue: string
  creatorUsername?: string
  accusedUsername?: string
  evidenceProvided: boolean
  evidenceDetails?: EvidenceDetails
  choices: TicketChoice[]
}

function generateRealisticCulpritContent(scenario: TicketScenario): { content: string; notes: string; isFake?: boolean } {
  const accused = scenario.accusedUsername || 'Şüpheli_Kullanıcı'
  const text = ((scenario.subject || '') + ' ' + (scenario.userIssue || '')).toLowerCase()

  if (text.includes('küfür') || text.includes('hakaret') || text.includes('ailevi') || text.includes('sövdü')) {
    return {
      content: `${accused}: "lan senin ananı bacını gelmişini geçmişini s... velet seni, bi daha sesime gel bak napıyorum sana! klavye delikanlısı seni!"`,
      notes: 'Görselde şikayetçinin ailesine yönelik ağır hakaret tespit edildi. Audit logda geçmiş sabıkasını teyit ediniz.'
    }
  }
  if (text.includes('link') || text.includes('phishing') || text.includes('dolandır') || text.includes('steam') || text.includes('nitro') || text.includes('oltalama')) {
    return {
      content: `${accused}: "GENÇLER ACELE EDİN! Steam 50$ cüzdan kodu dağıtıyor son 10 dakika kalmış koşun kapın: https://steam-community-nitro-gift.xyz/trade/id=99281"`,
      notes: 'Oltalama (Phishing) bağlantısı tespit edildi. Kesinlikle tıklanmamalı, kalıcı perma ban gerek.'
    }
  }
  if (text.includes('seste') || text.includes('soundpad') || text.includes('çığlık') || text.includes('mikrofon') || text.includes('bass')) {
    return {
      content: `[Ses Odası Log Kaydı]: @${accused} kulaklık patlatıcı Soundpad bass frekansı ve desibel aşımı (+34 dB) tespit edildi. Kanal: Oyun Ekibi`,
      notes: 'Kasıtlı ses bozma ve üyeleri rahatsız eden desibel aşımı sunucu ses tamponunda doğrulandı.'
    }
  }
  if (text.includes('catfish') || text.includes('e-kız') || text.includes('kız') || text.includes('çalıntı')) {
    return {
      content: `${accused}: "Aşkım lütfen bana 1 yıllık Nitro alabilir misin ya da 250₺ gönderir misin kargo bekliyorum nolur🥺 Bak sana ses kaydı da atarım..." [Ekli Dosya: ig_model_stolen.jpg]`,
      notes: 'Görsel tersine arama (Google Lens) sonucu fotoğrafın @alina_model99 adlı Rus mankene ait olduğu ve sesin MorphVOX ses değiştirici olduğu tespit edildi.'
    }
  }
  if (text.includes('wallhack') || text.includes('turnuva') || text.includes('cs2') || text.includes('demo')) {
    return {
      content: `[CS2 Match Demo - Tick 14280]: @${accused} sis bulutunun arkasındaki 3 rakip oyuncunun kafa hizasını duvar arkasından 4 saniye boyunca kilitlenerek takip etti ve AWP ile vurdu. ESP Kırmızı Kutu tespit edildi.`,
      notes: '144Hz turnuva demo analizi: Bariz Wallhack ve Box ESP yazılımı doğrulandı. Rakip takım haksız elendi.'
    }
  }
  if (text.includes('ponzi') || text.includes('kripto') || text.includes('katlama')) {
    return {
      content: `${accused}: "GENÇLER MODCOIN BALİNASIYIM! BANA 100₺ FAST ATANA 1 SAATTE 250₺ GERİ GÖNDERİYORUM! SINIRLI KONTENJAN HEMEN DM GELİN!"`,
      notes: 'Klasik sahte saadet zinciri (Ponzi) dolandırıcılığı. Mağdurların parası buharlaştı.'
    }
  }
  if (text.includes('carder') || text.includes('cc') || text.includes('çalıntı kart') || text.includes('boost')) {
    return {
      content: `[Discord Ödeme İtirazı / Chargeback Alarmı]: @${accused} tarafından sunucuya basılan 14x Nitro Boost işlemi çalıntı Visa kartla yapılmıştır (Ters İbraz Bildirimi).`,
      notes: 'Çalıntı kartla yapılan işlemler sunucunun Discord Hizmet Şartları ihlali sebebiyle kalıcı kapatılmasına (Nuke) yol açabilir. Derhal uzaklaştırılmalı.'
    }
  }
  if (text.includes('reklam') || text.includes('sunucu davet')) {
    return {
      content: `${accused}: "Gençler bu sunucu ölmüş adminler hiç bakmıyor, bizim yeni açtığımız sunucuya gelin sınırsız çekiliş var: discord.gg/turk-gaming-toplulugu"`,
      notes: 'İzinsiz sunucu davet linki ve DM reklamı ekran görüntüsü. Reklam yasağı ihlali.'
    }
  }
  if (text.includes('hile') || text.includes('makro') || text.includes('sekmeme') || text.includes('esp')) {
    return {
      content: `${accused}: "kanka bende sekmeme + esp makrosu var ban korumalı, dcden gel 100 liraya atayım ömürlük kullan kimse çakmaz"`,
      notes: 'Oyun hilesi / 3. parti haksız avantaj yazılımı ticareti ekran kaydı kanıtı.'
    }
  }
  if (text.includes('dekont') || text.includes('para') || text.includes('bağış') || text.includes('yetki') || text.includes('vip')) {
    const isFake = text.includes('sahte') || text.includes('montaj') || text.includes('yalan')
    return {
      content: `[Banka FAST Bildirimi]: Alıcı: TheAdmin Kasa - Gönderen: ${accused} - Tutar: 250.00 TL - Durum: Başarılı`,
      notes: isFake 
        ? 'DİKKAT: Dekont yazı fontunda pikselleşme ve saat uyumsuzluğu var (Photoshop Montaj Şüphesi!).' 
        : 'Banka FAST dekontu orijinal font ve şifreleme ile uyuşuyor.',
      isFake
    }
  }
  if (text.includes('siyaset') || text.includes('din') || text.includes('kavga') || text.includes('kışkırtma')) {
    return {
      content: `${accused}: "bu ülkenin hükümeti de muhalefeti de hain kardeşim, buranın adminleri de taraf tutuyor zaten hepiniz koyunsunuz"`,
      notes: 'Topluluk kurallarını ihlal eden siyasi tartışma ve genel sohbeti provoke etme logu.'
    }
  }

  // Fallback realistic culprit quote
  return {
    content: `${accused}: "sen kimsin lan bana kural öğretiyorsun? adminin yakın arkadaşıyım ben istediğimi yazarım sana noluyor velet?"`,
    notes: 'Kullanıcının genel sohbetteki kural ihlali ve saygısızlık içeren konuşma dökümü.'
  }
}

export const getScenarioEvidence = (scenario: TicketScenario): EvidenceDetails | null => {
  if (scenario.evidenceDetails) return scenario.evidenceDetails
  if (!scenario.evidenceProvided) return null

  const accused = scenario.accusedUsername || 'Şüpheli_Kullanıcı'
  const isScam = scenario.category === 'Dolandırıcılık'
  const isAppeal = scenario.category === 'Ceza İtirazı'
  const culpritData = generateRealisticCulpritContent(scenario)

  return {
    type: isScam ? 'link_preview' : isAppeal ? 'receipt' : 'image_ss',
    title: `Kanıt Dosyası: ss_${scenario.id}_delil.png`,
    subtitle: isScam ? 'Şüpheli Web Linki & Oltalama Analizi' : isAppeal ? 'İtiraz Dekontu / Geçmiş Logu' : 'Discord Ekran Alıntısı (#genel-sohbet)',
    authorName: accused,
    timestamp: 'Bugün, 14:18:22',
    channelName: isScam ? '#duyuru-ve-reklam' : '#genel-sohbet',
    reportedContent: culpritData.content,
    extraNotes: culpritData.notes,
    isTamperedOrFake: culpritData.isFake
  }
}

export const TICKET_SCENARIOS: TicketScenario[] = [
  // 1-10: Küfür & Hakaret Olayları
  {
    id: 'sc_01',
    subject: 'Ailevi küfür şikayeti',
    userIssue: 'Genel sohbette Berk_06 durduk yere aileme ağır küfretti.',
    accusedUsername: 'Berk_06',
    evidenceProvided: true,
    choices: [
      {
        id: 'c1',
        label: 'Kanıtı inceledim, kullanıcı sunucudan kalıcı olarak uzaklaştırıldı.',
        replyText: 'Ekran görüntüsü ve loglar incelendi. Kural 1 ihlali nedeniyle şahıs kalıcı olarak banlandı.',
        userReaction: 'Teşekkürler, çok hızlısınız.',
        isCorrect: true,
        hypeDelta: 4,
        sanityDelta: 2,
        actionType: 'ban_accused',
        feedback: 'Adil ve hızlı karar verdin. Topluluk güven kazandı.'
      },
      {
        id: 'c2',
        label: 'Olur öyle şeyler kafana takma kapatıyorum.',
        replyText: 'Genel chate fazla takılmayın, aranızda halledin.',
        userReaction: 'Böyle rezil moderasyon görmedim, sunucudan çıkıyorum.',
        isCorrect: false,
        hypeDelta: -8,
        sanityDelta: -5,
        actionType: 'dismiss',
        feedback: 'Açık kural ihlalini görmezden geldin, şikayetçi ve arkadaşları sunucudan ayrıldı.'
      },
      {
        id: 'c3',
        label: 'Seni de susturuyorum çok uzatma.',
        replyText: 'Boş yere ticket açtığın için ikinize de 1 saat mute veriyorum.',
        userReaction: 'Şaka mısınız siz? Mağdur olan benim!',
        isCorrect: false,
        hypeDelta: -12,
        sanityDelta: -8,
        actionType: 'warn_user',
        feedback: 'Haklı şikayetçiyi cezalandırdın. Sunucuda isyan çıktı.'
      }
    ]
  },
  {
    id: 'sc_02',
    subject: 'DM üzerinden küfür ve taciz',
    userIssue: 'Vortex bana özel mesajdan sürekli taciz mesajları ve küfür atıyor.',
    accusedUsername: 'Vortex',
    evidenceProvided: false,
    choices: [
      {
        id: 'c1',
        label: 'Özel mesaj ekran görüntüsünü iletir misiniz?',
        replyText: 'Özel mesajlara doğrudan müdahale edebilmemiz için konuşma kanıtı gerekmektedir. İletir misiniz?',
        userReaction: 'Hemen atıyorum, buyrun kanıt burada.',
        isCorrect: true,
        hypeDelta: 3,
        sanityDelta: 1,
        actionType: 'mute_accused',
        feedback: 'Kanıt isteyerek doğru prosedürü izledin.'
      },
      {
        id: 'c2',
        label: 'Hemen Vortex isimli kullanıcıyı perma banlıyorum.',
        replyText: 'Hiç araştırmadan hemen banladım.',
        userReaction: 'Eline sağlık.',
        isCorrect: false,
        hypeDelta: -10,
        sanityDelta: -4,
        actionType: 'ban_accused',
        feedback: 'Kanıtsız iftira üzerine masum bir kullanıcıyı banladın. Vortex haksız yere atıldı!'
      },
      {
        id: 'c3',
        label: 'DM bizi ilgilendirmez engelle geç.',
        replyText: 'Özel mesajlar sunucu dışıdır, engelle butonunu kullanın.',
        userReaction: 'Sunucunuzdaki adam milleti rahatsız ediyor ama umrunuzda değil.',
        isCorrect: false,
        hypeDelta: -4,
        sanityDelta: -2,
        actionType: 'dismiss',
        feedback: 'Kullanıcı ilgisizliğinden dolayı memnuniyetsiz ayrıldı.'
      }
    ]
  },
  {
    id: 'sc_03',
    subject: 'Seste mikrofon basma ve çığlık',
    userIssue: 'Oyun Ekibi ses kanalında Soundpad açık tutuyor kulak zarımız patladı.',
    accusedUsername: 'TrollBass',
    evidenceProvided: true,
    choices: [
      {
        id: 'c1',
        label: 'Kullanıcıyı sesten atıp ses susturması verdim.',
        replyText: 'Şahıs sesten çıkarıldı ve 30 dakika ses cezası uygulandı.',
        userReaction: 'Çok sağolun sonunda rahatça oyun oynayabileceğiz.',
        isCorrect: true,
        hypeDelta: 5,
        sanityDelta: 3,
        actionType: 'mute_accused',
        feedback: 'Ses odasındaki üyelerin huzurunu kurtardın.'
      },
      {
        id: 'c2',
        label: 'Kullanıcının sesini siz sağ tıklayıp kısın.',
        replyText: 'Discord ayarlarından şahsın sesini %0 yapabilirsiniz.',
        userReaction: 'Hepimiz tek tek kısmak zorunda mıyız? Ne biçim yetkilisiniz.',
        isCorrect: false,
        hypeDelta: -6,
        sanityDelta: -3,
        actionType: 'dismiss',
        feedback: 'Sorumluluğu kullanıcılara attın, ses kanalı boşaldı.'
      }
    ]
  },
  {
    id: 'sc_04',
    subject: 'Dolandırıcılık linki paylaşımı',
    userIssue: 'KriptoFree adında biri sohbette ücretsiz Nitro linki dağıtıyor.',
    accusedUsername: 'KriptoFree',
    evidenceProvided: true,
    choices: [
      {
        id: 'c1',
        label: 'Hesap botnet/phishing, derhal kalıcı banlayıp mesajları siliyorum.',
        replyText: 'Zararlı phishing linki tespit edildi. Kullanıcı banlandı ve mesajları temizlendi.',
        userReaction: 'Harikasınız az kalsın hesabım çalınacaktı.',
        isCorrect: true,
        hypeDelta: 6,
        sanityDelta: 4,
        actionType: 'ban_accused',
        feedback: 'Büyük bir hesap çalma dalgasını vaktinde engelledin.'
      },
      {
        id: 'c2',
        label: 'Belki gerçekten Nitro veriyordur elleme.',
        replyText: 'Bakalım belki doğrudur kontrol ederiz.',
        userReaction: 'Dalga mı geçiyorsun adam token çalıyor!',
        isCorrect: false,
        hypeDelta: -15,
        sanityDelta: -10,
        actionType: 'dismiss',
        feedback: 'Sunucudaki 3 üyenin hesabı çalındı, sunucu karalandı!'
      }
    ]
  },
  {
    id: 'sc_05',
    subject: 'VIP üye kural ihlali ve küfür',
    userIssue: 'Gold VIP rolü olan DarkKnight genel sohbette herkese sövüyor.',
    accusedUsername: 'DarkKnight',
    evidenceProvided: true,
    choices: [
      {
        id: 'c1',
        label: 'VIP veya normal fark etmeksizin kurallar geçerlidir, 3 saat susturuldu.',
        replyText: 'VIP olması kuralları çiğneme hakkı vermez. 3 saat genel sohbetten susturuldu.',
        userReaction: 'Helal olsun adaletli bir moderasyon varmış.',
        isCorrect: true,
        hypeDelta: 7,
        sanityDelta: 5,
        actionType: 'mute_accused',
        feedback: 'Çifte standart uygulamadın, tüm topluluğun saygısını kazandın.'
      },
      {
        id: 'c2',
        label: 'O sunucumuza aylık 200 TL bağış yapıyor dokunamam.',
        replyText: 'Bağışçı üyelerimize biraz tolerans tanıyoruz kusura bakmayın.',
        userReaction: 'Parayı veren düdüğü çalıyor yani? Çıkıyorum bu rezil yerden.',
        isCorrect: false,
        hypeDelta: -14,
        sanityDelta: -8,
        actionType: 'dismiss',
        feedback: 'Yolsuzluk yaptın. Toplulukta boykot başladı!'
      }
    ]
  },
  {
    id: 'sc_06',
    subject: 'Yetki ve moderatörlük talebi',
    userIssue: 'Sunucuda çok aktifim beni moderatör yapar mısınız lütfen?',
    evidenceProvided: false,
    choices: [
      {
        id: 'c1',
        label: 'Yetkili alımları duyurular kanalından açılınca başvuru yapabilirsiniz.',
        replyText: 'Yetkili alımları şu an kapalıdır. Alımlar açıldığında #duyurular kanalından form paylaşılacaktır.',
        userReaction: 'Anladım teşekkür ederim bekleyeceğim.',
        isCorrect: true,
        hypeDelta: 2,
        sanityDelta: 1,
        actionType: 'dismiss',
        feedback: 'Profesyonel ve kuralına uygun cevap verdin.'
      },
      {
        id: 'c2',
        label: 'Tamam seni hemen Admin yapıyorum.',
        replyText: 'Rolün verildi hayırlı olsun.',
        userReaction: 'Ciddi misin sen harikasın!',
        isCorrect: false,
        hypeDelta: -20,
        sanityDelta: -15,
        actionType: 'grant_role',
        feedback: 'Tanımadığın birine adminlik verdin, sunucuyu patlatma riski doğdu!'
      }
    ]
  },
  {
    id: 'sc_07',
    subject: 'Reklam ve sunucu daveti yayma',
    userIssue: 'Shadow isimli üye insanlara özelden başka bir sunucunun linkini atıyor.',
    accusedUsername: 'Shadow',
    evidenceProvided: true,
    choices: [
      {
        id: 'c1',
        label: 'Özelden sunucu reklamı yapmak kesinlikle yasaktır, banlandı.',
        replyText: 'İzinsiz reklam kuralı nedeniyle kullanıcı sunucudan kalıcı olarak atılmıştır.',
        userReaction: 'Teşekkürler bildirmek istedim.',
        isCorrect: true,
        hypeDelta: 4,
        sanityDelta: 2,
        actionType: 'ban_accused',
        feedback: 'Üye çekme hırsızlığını engelledin.'
      },
      {
        id: 'c2',
        label: 'Bana da atın bakayım güzel sunucu mu.',
        replyText: 'Link atın bakalım nasıl bir yermiş.',
        userReaction: 'Siz ne yapıyorsunuz ya yetkili misiniz ajan mı?',
        isCorrect: false,
        hypeDelta: -10,
        sanityDelta: -5,
        actionType: 'dismiss',
        feedback: 'Görevi kötüye kullandın, ciddiyetin sarsıldı.'
      }
    ]
  },
  {
    id: 'sc_08',
    subject: 'Yanlışlıkla banlandım itirazı',
    userIssue: 'Dün gece kardeşim klavyeye basmış küfür gitmiş, lütfen banımı açın.',
    evidenceProvided: false,
    choices: [
      {
        id: 'c1',
        label: 'Hesap güvenliği kullanıcıya aittir, kural ihlali affedilmez.',
        replyText: 'Hesap güvenliği ve yapılan eylemler tamamen hesap sahibinin sorumluluğundadır. Ban kaldırılamaz.',
        userReaction: 'Peki anladım kendi hatam.',
        isCorrect: true,
        hypeDelta: 3,
        sanityDelta: 1,
        actionType: 'dismiss',
        feedback: 'Taviz vermedin, caydırıcılığı korudun.'
      },
      {
        id: 'c2',
        label: 'Ah canım kıyamam açtım banını gir hemen.',
        replyText: 'Bir defaya mahsus affettim.',
        userReaction: 'Adamsın hemen girip tekrar küfür edeceğim!',
        isCorrect: false,
        hypeDelta: -8,
        sanityDelta: -6,
        actionType: 'dismiss',
        feedback: 'Trolün yalanına kandın, sunucuda dalga konusu oldun.'
      }
    ]
  },
  {
    id: 'sc_09',
    subject: 'Oyun içi hile suçlaması',
    userIssue: 'Topluluk Minecraft sunucusunda xX_Speed_Xx fly açıp evimizi patlattı.',
    accusedUsername: 'xX_Speed_Xx',
    evidenceProvided: true,
    choices: [
      {
        id: 'c1',
        label: 'Loglar incelendi, hile kullanımı sabit. Kalıcı banlandı.',
        replyText: 'Sunucu loglarında hile verileri doğrulandı. Şahıs sunucudan ve oyun ağından banlandı.',
        userReaction: 'Elinize sağlık evimiz gitti ama adalet yerini buldu.',
        isCorrect: true,
        hypeDelta: 5,
        sanityDelta: 3,
        actionType: 'ban_accused',
        feedback: 'Oyun topluluğunu hileciden arındırdın.'
      },
      {
        id: 'c2',
        label: 'Oyun içi olaylar bizi ilgilendirmez.',
        replyText: 'Minecraft ayrı Discord ayrı, karışmıyoruz.',
        userReaction: 'Resmi topluluk sunucunuz değil mi burası? Başlarım böyle işe.',
        isCorrect: false,
        hypeDelta: -7,
        sanityDelta: -4,
        actionType: 'dismiss',
        feedback: 'Oyuncu kitlesi güven kaybetti ve serverı terk etti.'
      }
    ]
  },
  {
    id: 'sc_10',
    subject: 'Siyaset ve nefret söylemi',
    userIssue: 'Genel sohbette bazı kişiler aşırı kışkırtıcı siyasi tartışma çıkarıyor.',
    accusedUsername: 'PolitikTroll',
    evidenceProvided: true,
    choices: [
      {
        id: 'c1',
        label: 'Siyaset ve kışkırtma yasaktır, şahsa 12 saat susturma uygulandı.',
        replyText: 'Topluluk huzurunu bozan tartışma nedeniyle şahsa 12 saat mute atıldı ve mesajlar silindi.',
        userReaction: 'Teşekkürler ortam çok gerilmişti.',
        isCorrect: true,
        hypeDelta: 4,
        sanityDelta: 3,
        actionType: 'mute_accused',
        feedback: 'Chate sakinlik getirdin.'
      },
      {
        id: 'c2',
        label: 'Bırakın tartışsınlar fikir özgürlüğü var.',
        replyText: 'Herkes istediğini yazar karışmıyoruz.',
        userReaction: 'Burası kahvehaneye döndü o zaman ben gidiyorum.',
        isCorrect: false,
        hypeDelta: -9,
        sanityDelta: -6,
        actionType: 'dismiss',
        feedback: 'Chat toxic kavgalarla doldu taştı.'
      }
    ]
  },
  // 11-20: Topluluk & Teknik Olaylar
  {
    id: 'sc_11',
    subject: 'Çekiliş hilesi iddiası',
    userIssue: 'Dünkü Steam cüzdan kodu çekilişini yöneticinin arkadaşı kazandı, şike var.',
    evidenceProvided: false,
    choices: [
      {
        id: 'c1',
        label: 'Çekiliş botunun kayıt logları herkese açık kanalda paylaşılmıştır.',
        replyText: 'Çekiliş harici bot üzerinden şeffaf yapılmıştır. Loglar #duyurular kanalında mevcuttur.',
        userReaction: 'Kontrol ettim, haklıymışsınız kusura bakmayın.',
        isCorrect: true,
        hypeDelta: 3,
        sanityDelta: 2,
        actionType: 'dismiss',
        feedback: 'Şeffaflıkla iftiranın önüne geçtin.'
      },
      {
        id: 'c2',
        label: 'İtiraz edeni banlıyorum!',
        replyText: 'Yönetime laf edemezsin banlandın.',
        userReaction: 'Demek ki gerçekten torpil varmış!',
        isCorrect: false,
        hypeDelta: -15,
        sanityDelta: -8,
        actionType: 'warn_user',
        feedback: 'Diktatörce davrandın, dedikodular çığ gibi büyüdü.'
      }
    ]
  },
  {
    id: 'sc_12',
    subject: 'Ses odasında ekran açıp uygunsuz görüntü izletme',
    userIssue: 'Mizah odasında ekran paylaşarak yasaklı videolar açıyorlar.',
    accusedUsername: 'StreamTroll',
    evidenceProvided: true,
    choices: [
      {
        id: 'c1',
        label: 'Kullanıcının yayın izni alındı ve sunucudan kalıcı olarak atıldı.',
        replyText: 'Topluluk kurallarını ağır şekilde ihlal ettiği için kalıcı banlandı.',
        userReaction: 'Hızlı müdahale için minnettarız.',
        isCorrect: true,
        hypeDelta: 6,
        sanityDelta: 4,
        actionType: 'ban_accused',
        feedback: 'Kritik bir ihlali anında durdurdun.'
      },
      {
        id: 'c2',
        label: 'Komikse izleyin bir şey olmaz.',
        replyText: 'Gülün geçin abartmayın.',
        userReaction: 'Yaş sınırı olan içerik bu, şaka mısın sen?',
        isCorrect: false,
        hypeDelta: -20,
        sanityDelta: -10,
        actionType: 'dismiss',
        feedback: 'Sunucu raporlandı ve tehlikeye girdi.'
      }
    ]
  },
  {
    id: 'sc_13',
    subject: 'Kişisel veri ifşası (Doxxing)',
    userIssue: 'Neon_Rider benim gerçek adımı soyadımı ve telefonumu chate yazdı.',
    accusedUsername: 'Neon_Rider',
    evidenceProvided: true,
    choices: [
      {
        id: 'c1',
        label: 'Doxxing affedilmez. Mesajlar derhal silindi ve kullanıcı banlandı.',
        replyText: 'Kişisel verilerin ifşası kabul edilemez. Şahıs banlandı, tüm mesajları ve kayıtları silindi.',
        userReaction: 'Çok teşekkür ederim polise de şikayet edeceğim.',
        isCorrect: true,
        hypeDelta: 8,
        sanityDelta: 5,
        actionType: 'ban_accused',
        feedback: 'Çok ciddi bir krizi profesyonelce çözdün.'
      },
      {
        id: 'c2',
        label: 'Numaran doğru mu bari?',
        replyText: 'Gerçekten senin numaran mı kontrol edelim.',
        userReaction: 'Yetkili misin sapık mısın nesin sen!',
        isCorrect: false,
        hypeDelta: -25,
        sanityDelta: -12,
        actionType: 'dismiss',
        feedback: 'Büyük skandal çıktı!'
      }
    ]
  },
  {
    id: 'sc_14',
    subject: 'Gereksiz yere herkesi etiketleme',
    userIssue: 'Bir üye genel chate @everyone atıp duruyor spam yapıyor.',
    accusedUsername: 'SpamMaster',
    evidenceProvided: true,
    choices: [
      {
        id: 'c1',
        label: 'Kullanıcının etiket izinleri kısıtlandı ve 2 saat mute verildi.',
        replyText: 'Toplu etiket spamı nedeniyle kullanıcı 2 saat susturuldu.',
        userReaction: 'Bildirimlerden kurtulduk sağolun.',
        isCorrect: true,
        hypeDelta: 4,
        sanityDelta: 3,
        actionType: 'mute_accused',
        feedback: 'Bildirim gürültüsünü kestin.'
      },
      {
        id: 'c2',
        label: 'Ben de chate everyone atayım o zaman.',
        replyText: 'Dur ben de katılayım.',
        userReaction: 'Admin bile trol çıktı.',
        isCorrect: false,
        hypeDelta: -10,
        sanityDelta: -6,
        actionType: 'dismiss',
        feedback: 'Ciddiyetini kaybettin.'
      }
    ]
  },
  {
    id: 'sc_15',
    subject: 'Oyun takımı daveti',
    userIssue: 'Akşam turnuvamız var ama genel sohbette takım arkadaşı arayınca sildiler.',
    evidenceProvided: false,
    choices: [
      {
        id: 'c1',
        label: 'Takım arayışları için #oyun-sohbeti kanalını kullanmalısınız.',
        replyText: 'Genel sohbet akışını korumak için takım ilanları #oyun-sohbeti kanalında yapılmalıdır.',
        userReaction: 'Tamamdır oraya yazayım teşekkürler.',
        isCorrect: true,
        hypeDelta: 2,
        sanityDelta: 1,
        actionType: 'dismiss',
        feedback: 'Kullanıcıyı doğru kanala yönlendirdin.'
      },
      {
        id: 'c2',
        label: 'Burada oyun muhabbeti yasak banlarım!',
        replyText: 'Bir daha oyun yazarsan atarım.',
        userReaction: 'Oyun topluluğu değil mi burası?',
        isCorrect: false,
        hypeDelta: -6,
        sanityDelta: -3,
        actionType: 'warn_user',
        feedback: 'Gereksiz sertlik gösterdin.'
      }
    ]
  },
  // 16-25: İftira, Para & Dolandırıcılık
  {
    id: 'sc_16',
    subject: 'Steam hesabı takasında dolandırıldım',
    userIssue: 'Sunucudaki biriyle CS skini takas ettik bana parayı atmadı.',
    accusedUsername: 'TradeScammer',
    evidenceProvided: true,
    choices: [
      {
        id: 'c1',
        label: 'Kanıtlar doğrulandı. Dolandırıcı banlandı, ticaret kuralları hatırlatıldı.',
        replyText: 'Kanıtlar incelendi. Şahıs sunucudan atıldı. Sunucu dışı ticaretlerde aracı kullanmanız önerilir.',
        userReaction: 'En azından başkalarını dolandıramaz teşekkürler.',
        isCorrect: true,
        hypeDelta: 5,
        sanityDelta: 3,
        actionType: 'ban_accused',
        feedback: 'Dolandırıcıyı uzaklaştırdın.'
      },
      {
        id: 'c2',
        label: 'Parayı bana verseydin ben yapardım.',
        replyText: 'Keşke bana sorsaydın komisyonla yapardım.',
        userReaction: 'Yetkiliye bak fırsatçılık yapıyor.',
        isCorrect: false,
        hypeDelta: -8,
        sanityDelta: -4,
        actionType: 'dismiss',
        feedback: 'Güven zedeledin.'
      }
    ]
  },
  {
    id: 'sc_17',
    subject: 'Kanal adında hakaret şikayeti',
    userIssue: 'Ses kanallarından birinin adı çok argo bir ifade içeriyor.',
    evidenceProvided: true,
    choices: [
      {
        id: 'c1',
        label: 'Kanal adı kurala uygun şekilde hemen düzeltildi.',
        replyText: 'Bildirim için teşekkürler. Kanal adı hemen kurallara uygun hale getirildi.',
        userReaction: 'Hızlı ilgi için teşekkürler.',
        isCorrect: true,
        hypeDelta: 3,
        sanityDelta: 2,
        actionType: 'dismiss',
        feedback: 'Sunucu görünümünü temiz tuttun.'
      },
      {
        id: 'c2',
        label: 'Kanal adı böyle iyi değiştirmiyorum.',
        replyText: 'Biz koyduk adı beğenmiyorsan girme.',
        userReaction: 'Kalite sıfır gerçekten.',
        isCorrect: false,
        hypeDelta: -5,
        sanityDelta: -3,
        actionType: 'dismiss',
        feedback: 'Kalite algısını düşürdün.'
      }
    ]
  },
  {
    id: 'sc_18',
    subject: 'Sürekli DM atıp rahatsız eden bot',
    userIssue: 'Sunucuya yeni katıldığımda bana otomatik kumar reklamı atan bir bot var.',
    evidenceProvided: true,
    choices: [
      {
        id: 'c1',
        label: 'Zararlı bot ve onu ekleyen şahıs kalıcı olarak atıldı.',
        replyText: 'İzinsiz reklam botu sunucudan atıldı ve davet izinleri güncellendi.',
        userReaction: 'Çok sağolun.',
        isCorrect: true,
        hypeDelta: 5,
        sanityDelta: 3,
        actionType: 'ban_accused',
        feedback: 'Sunucu güvenliğini güçlendirdin.'
      },
      {
        id: 'c2',
        label: 'Botlara karışamıyoruz.',
        replyText: 'Botlar serbest bir şey yapamam.',
        userReaction: 'Sunucuyu botlar ele geçirmiş haberiniz yok.',
        isCorrect: false,
        hypeDelta: -10,
        sanityDelta: -5,
        actionType: 'dismiss',
        feedback: 'Sunucu bot çöplüğüne döndü.'
      }
    ]
  },
  {
    id: 'sc_19',
    subject: 'Sahte profil ve kimlik taklidi',
    userIssue: 'Biri profil fotoğrafımı ve ismimi kopyalamış millete hakaret ediyor.',
    accusedUsername: 'FakeKullanici',
    evidenceProvided: true,
    choices: [
      {
        id: 'c1',
        label: 'Taklit hesap incelendi ve derhal sunucudan uzaklaştırıldı.',
        replyText: 'Kimlik taklidi ve itibar zedeleme nedeniyle sahte hesap banlandı.',
        userReaction: 'Çok rahatladım teşekkür ederim.',
        isCorrect: true,
        hypeDelta: 5,
        sanityDelta: 3,
        actionType: 'ban_accused',
        feedback: 'Kullanıcının itibarını korudun.'
      },
      {
        id: 'c2',
        label: 'Sen de onun profilini kopyala ödeşin.',
        replyText: 'Git sen de onu taklit et.',
        userReaction: 'Siz gerçekten moderatör müsünüz?',
        isCorrect: false,
        hypeDelta: -8,
        sanityDelta: -4,
        actionType: 'dismiss',
        feedback: 'Komik duruma düştün.'
      }
    ]
  },
  {
    id: 'sc_20',
    subject: 'Korsan oyun linki paylaşımı',
    userIssue: 'Chate virüslü korsan GTA dosyası attılar.',
    accusedUsername: 'Crackci',
    evidenceProvided: true,
    choices: [
      {
        id: 'c1',
        label: 'Korsan ve zararlı yazılım linki silindi, şahıs kalıcı banlandı.',
        replyText: 'Zararlı yazılım paylaşımı sıfır tolerans kapsamındadır. Kalıcı uzaklaştırıldı.',
        userReaction: 'Virüsten kurtardınız bizi teşekkürler.',
        isCorrect: true,
        hypeDelta: 6,
        sanityDelta: 3,
        actionType: 'ban_accused',
        feedback: 'Topluluğu virüsten korudun.'
      },
      {
        id: 'c2',
        label: 'Link çalışıyor mu ben de indireyim.',
        replyText: 'Dosya temizse dursun.',
        userReaction: 'Rezalet...',
        isCorrect: false,
        hypeDelta: -14,
        sanityDelta: -7,
        actionType: 'dismiss',
        feedback: 'Topluluk virüs krizine girdi.'
      }
    ]
  },
  // 21-35: Ekstra Gerçekçi Topluluk Krizleri
  {
    id: 'sc_21',
    subject: 'Ses odasında yabancı dilde küfür',
    userIssue: 'İngilizce bilmediğimizi sanıp bize ağır küfürler savuruyor.',
    accusedUsername: 'ToxicExpat',
    evidenceProvided: true,
    choices: [
      {
        id: 'c1',
        label: 'Dili ne olursa olsun küfür yasaktır, kullanıcı banlandı.',
        replyText: 'Küfür ve nefret söylemi dili fark etmeksizin cezalandırılır. Şahıs atıldı.',
        userReaction: 'Adaletiniz için teşekkürler.',
        isCorrect: true,
        hypeDelta: 4,
        sanityDelta: 2,
        actionType: 'ban_accused',
        feedback: 'Dürüst ve kararlı tutum sergiledin.'
      },
      {
        id: 'c2',
        label: 'Yabancı dil pratik yapıyordur abartma.',
        replyText: 'İngilizceniz gelişir fena mı.',
        userReaction: 'Bizimle alay mı ediyorsunuz?',
        isCorrect: false,
        hypeDelta: -6,
        sanityDelta: -3,
        actionType: 'dismiss',
        feedback: 'Üyeleri sinirlendirdin.'
      }
    ]
  },
  {
    id: 'sc_22',
    subject: 'Moderatörün kendisinden şikayetçiyim',
    userIssue: 'Diğer moderatör arkadaşınız sırf farklı takımı tuttuğum için bana mute attı.',
    evidenceProvided: true,
    choices: [
      {
        id: 'c1',
        label: 'Haksız susturma kaldırıldı, moderatör uyarıldı.',
        replyText: 'Kanıt incelendi. Yetki kötüye kullanımı tespit edildiği için susturmanız açıldı.',
        userReaction: 'Teşekkür ederim objektifliğiniz için.',
        isCorrect: true,
        hypeDelta: 7,
        sanityDelta: 4,
        actionType: 'dismiss',
        feedback: 'Moderatör kayırmacılığı yapmadın, sunucu güveni zirve yaptı.'
      },
      {
        id: 'c2',
        label: 'Moderatörüm ne yaparsa arkasındayım seni de banlarım.',
        replyText: 'Biz birbirimizi satmayız defol git.',
        userReaction: 'Kendi çöplüğünüzde kalın.',
        isCorrect: false,
        hypeDelta: -18,
        sanityDelta: -9,
        actionType: 'warn_user',
        feedback: 'Kayırmacılık sunucuda isyan çıkardı.'
      }
    ]
  },
  {
    id: 'sc_23',
    subject: 'Ödüllü turnuva kaydı sorusu',
    userIssue: 'Turnuva için nereden kayıt oluşturabiliriz?',
    evidenceProvided: false,
    choices: [
      {
        id: 'c1',
        label: '#duyurular kanalındaki başvuru linkini doldurabilirsiniz.',
        replyText: 'Turnuva başvuruları #duyurular kanalında sabitlenen link üzerinden alınmaktadır.',
        userReaction: 'Çok teşekkürler hemen başvuruyorum.',
        isCorrect: true,
        hypeDelta: 3,
        sanityDelta: 1,
        actionType: 'dismiss',
        feedback: 'Doğru yönlendirdin.'
      },
      {
        id: 'c2',
        label: 'Bana 50 TL at kayıt edeyim.',
        replyText: 'Hesabıma para atarsan yazarım adını.',
        userReaction: 'Rüşvet mi istiyorsun sen?',
        isCorrect: false,
        hypeDelta: -12,
        sanityDelta: -6,
        actionType: 'dismiss',
        feedback: 'Rüşvetçilikle suçlandın.'
      }
    ]
  },
  {
    id: 'sc_24',
    subject: 'Seste sürekli klavye ve yemek sesi',
    userIssue: 'Mikrofonunu açık bırakıp cips yiyor sesimizi duyamıyoruz.',
    accusedUsername: 'CipsCanavari',
    evidenceProvided: false,
    choices: [
      {
        id: 'c1',
        label: 'Kullanıcıya bas-konuş kullanması için uyarı mesajı iletildi.',
        replyText: 'Kullanıcı uyarıldı ve bas-konuş moduna geçmesi istendi.',
        userReaction: 'Sağolun düzeltti şimdi.',
        isCorrect: true,
        hypeDelta: 3,
        sanityDelta: 2,
        actionType: 'mute_accused',
        feedback: 'Gereksiz ban atmadan sorunu çözdün.'
      },
      {
        id: 'c2',
        label: 'Afiyet olsun canım çeksin ben de yiyeyim.',
        replyText: 'Ne yiyor sorsana.',
        userReaction: 'Komik değilsiniz.',
        isCorrect: false,
        hypeDelta: -4,
        sanityDelta: -2,
        actionType: 'dismiss',
        feedback: 'İlgisizlik tepki çekti.'
      }
    ]
  },
  {
    id: 'sc_25',
    subject: 'Sunucuya baskın (Raid) uyarısı',
    userIssue: 'Başka bir sunucunun üyeleri toplanıp bizim chate raid atacaklarını yazıyor.',
    evidenceProvided: true,
    choices: [
      {
        id: 'c1',
        label: 'Sunucu koruma kalkanı ve yavaş mod devreye alındı.',
        replyText: 'Bilgi için teşekkürler. Doğrulama seviyesi artırıldı ve yavaş mod açıldı.',
        userReaction: 'Harikasınız gardımızı aldık.',
        isCorrect: true,
        hypeDelta: 6,
        sanityDelta: 3,
        actionType: 'dismiss',
        feedback: 'Olası bir baskını önceden durdurdun.'
      },
      {
        id: 'c2',
        label: 'Gelsinler hiçbir şey yapamazlar.',
        replyText: 'Korkmuyoruz gelsinler.',
        userReaction: 'Görürsün birazdan ne olacağını.',
        isCorrect: false,
        hypeDelta: -10,
        sanityDelta: -6,
        actionType: 'dismiss',
        feedback: 'Raid sunucuyu kilitledi!'
      }
    ]
  },
  {
    id: 'sc_catfish',
    category: 'Dolandırıcılık',
    subject: 'E-Kız Rolüyle VIP Balinalardan Nitro Dolandırıcılığı (Catfish)',
    userIssue: 'Prenses_Buse isimli hesap bana özelden kız olduğunu söyleyip 3 aylık Nitro Boost ve 250₺ para aldırdı. Sonradan fotoğraflarının Rus bir modelden çalıntı olduğunu buldum!',
    accusedUsername: 'Prenses_Buse',
    evidenceProvided: true,
    choices: [
      {
        id: 'c1',
        label: 'Çalıntı fotoğraf ve ses değiştirici kanıtlandı: Şahıs kalıcı olarak banlandı.',
        replyText: 'Google Lens görsel araması ve ses incelemesi sonucu hesabın sahte (Catfish) olduğu teyit edildi. Sunucudan kalıcı olarak uzaklaştırıldı.',
        userReaction: 'Çok sağolun modum, rezil herif herkesi kandırıyordu!',
        isCorrect: true,
        hypeDelta: 8,
        sanityDelta: 4,
        actionType: 'ban_accused',
        feedback: 'VIP üyelerin dolandırılmasını engelledin, sunucuda adaleti sağladın.'
      },
      {
        id: 'c2',
        label: 'Özel hayata karışmıyoruz, kendi rızanla almışsın.',
        replyText: 'Özelden kime ne hediye aldığınız bizi ilgilendirmez, bileti kapatıyorum.',
        userReaction: 'Dolandırıcıyı koruyorsunuz yani? Ben de sunucudan ayrılıyorum!',
        isCorrect: false,
        hypeDelta: -10,
        sanityDelta: -6,
        actionType: 'dismiss',
        feedback: 'Topluluğu dolandıran hesabı cezasız bıraktın. VIP üyeler isyan etti.'
      },
      {
        id: 'c3',
        label: 'Şüpheliyi 1 saat susturup dosyayı arşive kaldır.',
        replyText: 'Şüpheli 1 saat susturuldu, şikayet dosyası kapandı.',
        userReaction: 'Adam milleti soyuyor siz 1 saat susturuyorsunuz şaka gibi...',
        isCorrect: false,
        hypeDelta: -6,
        sanityDelta: -3,
        actionType: 'mute_accused',
        feedback: 'Dolandırıcılık suçuna yetersiz ve hafif ceza verdin.'
      }
    ]
  },
  {
    id: 'sc_cs2_wallhack',
    category: 'Şikayet',
    subject: 'Ödüllü Turnuvada Wallhack & Radar Hack Şikayeti',
    userIssue: 'Akşamki 1.000₺ ödüllü sunucu turnuvasında SmokeSniper_TR isimli adam sislerin içinden kafamıza tek atıyor. Demo kaydını inceledim adam resmen duvar arkasını izliyor!',
    accusedUsername: 'SmokeSniper_TR',
    evidenceProvided: true,
    choices: [
      {
        id: 'c1',
        label: '144Hz Demo kaydı incelendi: Bariz Wallhack nedeniyle turnuvadan men ve perma ban.',
        replyText: 'Turnuva maçı demosu tick-by-tick incelendi. Duvar arkası kilitlenme (ESP) tespit edildi. Kullanıcı turnuvadan diskalifiye edilerek sunucudan yasaklandı.',
        userReaction: 'Helal olsun mod ekibine! Hak yerini buldu turnuva kurtuldu!',
        isCorrect: true,
        hypeDelta: 10,
        sanityDelta: 5,
        actionType: 'ban_accused',
        feedback: 'Turnuva bütünlüğünü kurtardın, oyuncuların saygısını kazandın.'
      },
      {
        id: 'c2',
        label: 'Kullanıcı iyi oynuyor, şüphe üzerine ceza veremeyiz.',
        replyText: 'Ses kasarak vurmuş olabilir, kesin kanıt yok.',
        userReaction: 'Sis içine zıplayarak tek atıyor ne sesi?! Turnuvayı boykot ediyoruz!',
        isCorrect: false,
        hypeDelta: -12,
        sanityDelta: -8,
        actionType: 'dismiss',
        feedback: 'Hileciyi akladın! Turnuvaya katılan 8 takım sunucuyu terk etti.'
      }
    ]
  },
  {
    id: 'sc_crypto_ponzi',
    category: 'Dolandırıcılık',
    subject: 'Sunucu İçi Sahte ModCoin Ponzi & Kripto Katlama Tuzağı',
    userIssue: 'Kripto_Kralı_34 isimli şahıs bana 100₺ ver akşam 300₺ yapayım diye sahte borsa sitesi linki attı. Paramı aldı ve beni engelledi!',
    accusedUsername: 'Kripto_Kralı_34',
    evidenceProvided: true,
    choices: [
      {
        id: 'c1',
        label: 'Ponzi saadet zinciri tespit edildi: Şahıs anında perma banlandı.',
        replyText: 'Sunucu içi izinsiz kripto vaadi ve dolandırıcılık tespit edildi. Şahıs kalıcı olarak banlandı ve genel duyuru geçildi.',
        userReaction: 'Teşekkürler, umarım başka kimsenin canı yanmaz.',
        isCorrect: true,
        hypeDelta: 7,
        sanityDelta: 3,
        actionType: 'ban_accused',
        feedback: 'Sunucudaki finansal sahtekarlığı kökünden temizledin.'
      },
      {
        id: 'c2',
        label: 'Siz de her şeye inanmayın kardeşim kendi hatanız.',
        replyText: 'Kripto işleri risklidir, sunucu yönetimi sorumlu tutulamaz.',
        userReaction: 'Sunucunuzda resmen hırsız besliyorsunuz tebrikler.',
        isCorrect: false,
        hypeDelta: -8,
        sanityDelta: -5,
        actionType: 'dismiss',
        feedback: 'Dolandırıcı sunucuda serbestçe diğer üyeleri avlamaya devam etti.'
      }
    ]
  },
  {
    id: 'sc_mod_bribe',
    category: 'Yetki & Rol',
    subject: 'Yetki Başvurusu & Aylık Rüşvet Teklifi',
    userIssue: 'Adminim yaşım 22, günde 12 saat bilgisayar başındayım. Beni sunucuda Moderatör yaparsan sana her ay şahsi IBAN\'ına 300₺ FAST harçlık atarım. Aramızda kalsın kimseye söylemem.',
    accusedUsername: 'Zengin_Velet_06',
    evidenceProvided: false,
    choices: [
      {
        id: 'c1',
        label: 'Torpil ve rüşvet teklifini reddet, kural ihlalinden 24 saat sustur.',
        replyText: 'Sunucumuzda yetkiler para veya torpille değil, liyakat ve güvenle verilir. Rüşvet girişimi nedeniyle 24 saat susturuldunuz.',
        userReaction: 'Pardon adminim şaka yapmıştım özür dilerim...',
        isCorrect: true,
        hypeDelta: 6,
        sanityDelta: 4,
        actionType: 'mute_accused',
        feedback: 'Yönetim onurunu korudun, disiplini sağladın.'
      },
      {
        id: 'c2',
        label: 'Teklifi gizlice kabul et: VIP Balina yetkisi ver.',
        replyText: 'Anlaştık, sana geçici bir yetki tanımlıyorum.',
        userReaction: 'Adamsın kral IBAN at parayı gönderiyorum.',
        isCorrect: false,
        hypeDelta: -10,
        sanityDelta: -10,
        moneyDelta: 300,
        actionType: 'grant_role',
        feedback: 'Torpilli yetki dağıttın. Kurucu logları incelerse başın büyük belada!'
      }
    ]
  },
  {
    id: 'sc_klan_raid',
    category: 'Genel',
    subject: 'Baskın Ultimatomu: Klan Liderinin Banını Açın Yoksa...',
    userIssue: 'ÖlümKlanı lideri Dark_Vader_TR bilet açıp eğer banını 15 dakika içinde kaldırmazsanız sunucuya 100 botla DDoS ve spam basacağını söylüyor.',
    accusedUsername: 'Dark_Vader_TR',
    evidenceProvided: true,
    choices: [
      {
        id: 'c1',
        label: 'Tehdide boyun eğme: Güvenlik duvarını aç ve şantajcıyı banla.',
        replyText: 'Sunucumuz hiçbir şantaja veya tehdide boyun eğmez. IP loglarınız kaydedildi, tüm klan hesapları karantinaya alındı.',
        userReaction: 'Siz bittiniz oğlum, akşam botları yağdırınca göreceksiniz!',
        isCorrect: true,
        hypeDelta: 9,
        sanityDelta: 4,
        actionType: 'ban_accused',
        feedback: 'Korkusuzca duruş sergiledin. Üyeler cesaretini alkışladı.'
      },
      {
        id: 'c2',
        label: 'Korkup banını aç: Sunucu basılmasın.',
        replyText: 'Tamam banını açıyoruz lütfen baskın atmayın.',
        userReaction: 'Haha nası da korktunuz ezikler sizi, sunucu bizim artık!',
        isCorrect: false,
        hypeDelta: -18,
        sanityDelta: -12,
        actionType: 'dismiss',
        feedback: 'Trollere teslim oldun! Sunucuda yönetim otoritesi tamamen çöktü.'
      }
    ]
  },
  {
    id: 'sc_cc_boost',
    category: 'Teknik Destek',
    subject: 'Çalıntı Kartla (CC) Sahte 14x Nitro Boost Basımı',
    userIssue: 'Yeni gelen Carder_Ghost_99 isimli kullanıcı sunucuya 14x Nitro boost bastı ama bu kartlar çalıntı. Discord sunucuyu kapatmadan önce adamı banlayıp boostları iptal etmelisiniz!',
    accusedUsername: 'Carder_Ghost_99',
    evidenceProvided: true,
    choices: [
      {
        id: 'c1',
        label: 'Çalıntı kart dolandırıcısını banla ve Discord Güvenliğe bildir.',
        replyText: 'Ters ibraz (Chargeback) riski nedeniyle hesap derhal perma banlandı. Sunucunun kapanma riski önlendi.',
        userReaction: 'Doğru kararı verdiniz modum, sunucumuz silinebilirdi.',
        isCorrect: true,
        hypeDelta: 10,
        sanityDelta: 5,
        actionType: 'ban_accused',
        feedback: 'Sunucuyu Discord Trust & Safety tarafından silinmekten kurtardın!'
      },
      {
        id: 'c2',
        label: 'Boşver kalsın sunucu Level 3 oldu ne güzel.',
        replyText: 'Boost boosttur, bedava sunucu seviyesi geldi.',
        userReaction: 'Yarın sunucu kapatılınca görürsünüz...',
        isCorrect: false,
        hypeDelta: -15,
        sanityDelta: -10,
        actionType: 'dismiss',
        feedback: 'Discord, çalıntı kart işlemi tespit ettiği için sunucuya ceza puanı kesti!'
      }
    ]
  }
]
