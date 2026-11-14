import type { TicketScenario } from './ticketScenarios'

// 80 unique handcrafted scenarios (sc_26 to sc_105) covering every realistic community moderation event
export const ADDITIONAL_SCENARIOS: TicketScenario[] = [
  // 26-35: Ses Odası Olayları
  {
    id: 'sc_26',
    category: 'Şikayet',
    subject: 'Seste kulak patlatan bass açılması',
    userIssue: 'Ses 1 odasında oyun oynarken Berk mikrofondan son ses kulak çınlatan bass açtı oyundan düştük.',
    creatorUsername: 'Ahmet_Oyunda',
    accusedUsername: 'Berk_06',
    evidenceProvided: true,
    choices: [
      {
        id: 'c1',
        label: 'Kullanıcı sesten atıldı ve 2 saat ses susturması verildi.',
        replyText: 'Kulak sağlığını tehdit eden yüksek ses ve ear-rape yasaktır. Kullanıcı 2 saat susturuldu.',
        userReaction: 'Teşekkürler kulağımız rahatladı.',
        isCorrect: true,
        hypeDelta: 4,
        sanityDelta: 2,
        actionType: 'mute_accused',
        feedback: 'Ses odası düzenini hızla sağladın.'
      },
      {
        id: 'c2',
        label: 'Ses seviyesini kendi Discordundan kısabilirsin.',
        replyText: 'Kullanıcıya sağ tıklayıp sesini yüzde bire çekebilirsiniz.',
        userReaction: 'Adam herkesi rahatsız ediyor ama hiçbir şey yapmıyorsunuz.',
        isCorrect: false,
        hypeDelta: -8,
        sanityDelta: -4,
        actionType: 'dismiss',
        feedback: 'Toplu rahatsızlığı bireysel sorumluluk saydın, üyeler tepki gösterdi.'
      }
    ]
  },
  {
    id: 'sc_27',
    category: 'Şikayet',
    subject: 'İzinsiz ses kaydı alma tehdidi',
    userIssue: 'Sohbet odasında KaanVip hepimizin sesini izinsiz kaydedip internete atacağını söylüyor.',
    creatorUsername: 'Mertcan_TR',
    accusedUsername: 'KaanVip',
    evidenceProvided: true,
    choices: [
      {
        id: 'c1',
        label: 'İzinsiz kayıt alma ve şantaj kural ihlalinden kullanıcı uyarıldı ve geçici susturuldu.',
        replyText: 'Sunucu kuralları gereği üyelerin ses kaydını almak kesinlikle yasaktır. İhlal eden kişi susturuldu.',
        userReaction: 'İçimiz rahatladı çok sağolun.',
        isCorrect: true,
        hypeDelta: 5,
        sanityDelta: 3,
        actionType: 'mute_accused',
        feedback: 'Kullanıcıların mahremiyetini korudun.'
      },
      {
        id: 'c2',
        label: 'İnternete atarsa bakarız şimdilik bir şey yok.',
        replyText: 'Henüz video yüklenmediği için işlem yapamayız.',
        userReaction: 'Tehdit ediliyoruz diyorum neyi bekliyorsunuz?',
        isCorrect: false,
        hypeDelta: -7,
        sanityDelta: -5,
        actionType: 'dismiss',
        feedback: 'Güvenlik tehdidini erteledin.'
      }
    ]
  },
  {
    id: 'sc_28',
    category: 'Şikayet',
    subject: 'Soundboard spamı',
    userIssue: 'Sohbette sürekli keçi sesi ve osuruk efekti basıyor konuşamıyoruz.',
    creatorUsername: 'Zeynep_K',
    accusedUsername: 'TrollSesci',
    evidenceProvided: true,
    choices: [
      {
        id: 'c1',
        label: 'Soundboard yetkisi kapatıldı ve 1 saat susturuldu.',
        replyText: 'Ses odalarında spam amaçlı ses paneli kullanımı yasaktır. Gerekli ceza uygulandı.',
        userReaction: 'Sonunda rahatça konuşabileceğiz teşekkürler.',
        isCorrect: true,
        hypeDelta: 3,
        sanityDelta: 2,
        actionType: 'mute_accused',
        feedback: 'Oda düzenini sağladın.'
      },
      {
        id: 'c2',
        label: 'Komikmiş biraz gülelim.',
        replyText: 'Bence eğlenceli abartmayın.',
        userReaction: 'Burası kreş mi ciddiyet sıfır.',
        isCorrect: false,
        hypeDelta: -9,
        sanityDelta: -6,
        actionType: 'dismiss',
        feedback: 'Moderatör ciddiyeti sarsıldı.'
      }
    ]
  },
  {
    id: 'sc_29',
    category: 'Teknik Destek',
    subject: 'Mikrofon yankı sorunu',
    userIssue: 'Oyun sesinde bir arkadaşın kulaklığı bozuk oyunun tüm sesi iki kez geliyor.',
    creatorUsername: 'Furkan_Apex',
    accusedUsername: 'YankiKral',
    evidenceProvided: false,
    choices: [
      {
        id: 'c1',
        label: 'Kullanıcıya bas konuş ayarı yapması için rehber iletildi ve uyarıldı.',
        replyText: 'Kullanıcıya özelden bas-konuş ayarı mesajı yollandı, düzeltmezse sesten ayrılacak.',
        userReaction: 'Uyardığınız için teşekkürler.',
        isCorrect: true,
        hypeDelta: 3,
        sanityDelta: 1,
        actionType: 'warn_user',
        feedback: 'Teknik sorunu yapıcı çözdün.'
      },
      {
        id: 'c2',
        label: 'Kullanıcıyı doğrudan sunucudan kalıcı banla.',
        replyText: 'Mikrofonu bozuk diye banladım.',
        userReaction: 'Sırf mikrofonu yankı yapıyor diye adamı banladınız mı cidden?',
        isCorrect: false,
        hypeDelta: -11,
        sanityDelta: -5,
        actionType: 'ban_accused',
        feedback: 'Aşırı orantısız ceza verdin, topluluk tepki gösterdi.'
      }
    ]
  },
  {
    id: 'sc_30',
    category: 'Şikayet',
    subject: 'Yayın odasını sabote etme',
    userIssue: 'Discordda film gecesi yapıyorduk odaya girip ekran paylaşımına uygunsuz görüntüler verdi.',
    creatorUsername: 'SinemaKulubu',
    accusedUsername: 'SlaytTroll',
    evidenceProvided: true,
    choices: [
      {
        id: 'c1',
        label: 'Kullanıcı sunucudan kalıcı olarak uzaklaştırıldı.',
        replyText: 'Topluluk etkinliğini ahlaka aykırı görsellerle sabote etmek kalıcı ban sebebidir.',
        userReaction: 'Çok hızlı müdahale ettiniz minnettarız.',
        isCorrect: true,
        hypeDelta: 6,
        sanityDelta: 4,
        actionType: 'ban_accused',
        feedback: 'Ağır ihlali anında temizledin.'
      },
      {
        id: 'c2',
        label: 'Filmi başka odaya taşıyın.',
        replyText: 'Odayı kilitlemeyi unuttuysanız yapacak bir şey yok.',
        userReaction: 'Etkinliği mahveden adam cezasız mı kalıyor yani?',
        isCorrect: false,
        hypeDelta: -12,
        sanityDelta: -8,
        actionType: 'dismiss',
        feedback: 'Kural ihlaline göz yumdun.'
      }
    ]
  },
  {
    id: 'sc_31',
    category: 'Şikayet',
    subject: 'Seste uyuyan kullanıcı',
    userIssue: 'Sohbet 2 odasında biri mikrofona horluyor sesten çıkmıyor.',
    creatorUsername: 'GeceVardiyasi',
    accusedUsername: 'Uykucu_Emre',
    evidenceProvided: false,
    choices: [
      {
        id: 'c1',
        label: 'Kullanıcı AFK odasına taşındı.',
        replyText: 'Horlayan kullanıcı AFK kanalına aktarıldı, iyi sohbetler.',
        userReaction: 'Elinize sağlık rahatladık.',
        isCorrect: true,
        hypeDelta: 2,
        sanityDelta: 2,
        actionType: 'dismiss',
        feedback: 'Sorunsuz ve doğru işlem.'
      },
      {
        id: 'c2',
        label: 'Horluyor diye 1 hafta banla.',
        replyText: 'Seste uyumak yasaktır 1 hafta banladım.',
        userReaction: 'Yuh artık adam sadece uyuyakalmış.',
        isCorrect: false,
        hypeDelta: -8,
        sanityDelta: -3,
        actionType: 'ban_accused',
        feedback: 'Gereksiz sert davrandın.'
      }
    ]
  },
  {
    id: 'sc_32',
    category: 'Şikayet',
    subject: 'Seste siyasi propaganda ve kavga çıkarma',
    userIssue: 'Oyun odasında durduk yere siyaset açıp millete vatan haini falan demeye başladı.',
    creatorUsername: 'Kemal_99',
    accusedUsername: 'SiyasiKavga',
    evidenceProvided: true,
    choices: [
      {
        id: 'c1',
        label: 'Kullanıcıya 1 gün susturma verildi ve siyaset yasağı hatırlatıldı.',
        replyText: 'Sunucumuzda siyasi tartışma ve nefret söylemi yasaktır. 24 saat susturma uygulandı.',
        userReaction: 'Teşekkürler ortam çok gerilmişti.',
        isCorrect: true,
        hypeDelta: 4,
        sanityDelta: 3,
        actionType: 'mute_accused',
        feedback: 'Topluluk huzurunu korudun.'
      },
      {
        id: 'c2',
        label: 'Herkes fikrini söyler karışamayız.',
        replyText: 'Fikir özgürlüğü var karışamam.',
        userReaction: 'Hakaret ediyor adam ne fikir özgürlüğü?',
        isCorrect: false,
        hypeDelta: -10,
        sanityDelta: -6,
        actionType: 'dismiss',
        feedback: 'Nefret söylemine izin verdin.'
      }
    ]
  },
  {
    id: 'sc_33',
    category: 'Şikayet',
    subject: 'Odaya seri giriş çıkış yapıp bildirim sesiyle trolleme',
    userIssue: 'Odaya 1 saniyede girip çıkıyor sürekli dın dın bildirim sesi geliyor.',
    creatorUsername: 'BarisPro',
    accusedUsername: 'SeriGirisCikis',
    evidenceProvided: true,
    choices: [
      {
        id: 'c1',
        label: 'Kasıtlı ses spami nedeniyle 3 saat sunucu susturması verildi.',
        replyText: 'Giriş çıkış sesiyle sunucu üyelerini taciz etmek yasaktır. 3 saat susturuldu.',
        userReaction: 'Çok iyi oldu teşekkürler.',
        isCorrect: true,
        hypeDelta: 4,
        sanityDelta: 2,
        actionType: 'mute_accused',
        feedback: 'Trolü etkisiz kıldın.'
      },
      {
        id: 'c2',
        label: 'Bağlantısı kopuyordur günahını almayın.',
        replyText: 'İnterneti gidiyordur bir şey yapamam.',
        userReaction: 'Dalga geçiyor adam bilerek yapıyor.',
        isCorrect: false,
        hypeDelta: -7,
        sanityDelta: -4,
        actionType: 'dismiss',
        feedback: 'Aşikar trollüğü görmezden geldin.'
      }
    ]
  },
  {
    id: 'sc_34',
    category: 'Şikayet',
    subject: 'Seste kadın üyeye rahatsız edici ısrarlar',
    userIssue: 'Ses odasında Selin isimli üyeye sürekli yaşını ve instagramını sorup rahatsız ediyor.',
    creatorUsername: 'Selin_G',
    accusedUsername: 'SapikKurt',
    evidenceProvided: true,
    choices: [
      {
        id: 'c1',
        label: 'Kullanıcı sunucudan süresiz uzaklaştırıldı.',
        replyText: 'Bireyleri ısrarla taciz etmek ve özel bilgi talep etmek sıfır tolerans kuralımızdır. Banlandı.',
        userReaction: 'Çok teşekkür ederim gerçekten çok korkmuştum.',
        isCorrect: true,
        hypeDelta: 7,
        sanityDelta: 4,
        actionType: 'ban_accused',
        feedback: 'Kadın üyelerin güvenliğini sağladın, takdir topladın.'
      },
      {
        id: 'c2',
        label: 'Tanışmak istemiş ne var bunda?',
        replyText: 'İstemiyorsan cevap verme abartma.',
        userReaction: 'Sizin gibi zihniyet olmaz olsun sunucudan çıkıyorum.',
        isCorrect: false,
        hypeDelta: -14,
        sanityDelta: -9,
        actionType: 'dismiss',
        feedback: 'Tacizi meşrulaştırdın, sunucudan toplu çıkışlar oldu.'
      }
    ]
  },
  {
    id: 'sc_35',
    category: 'Şikayet',
    subject: 'Oyun içi bilgi sızdırma',
    userIssue: 'Aramızdaki rekabetçi maçta öldükten sonra yerimizi rakip takımdaki arkadaşına söylüyor.',
    creatorUsername: 'CS_Krali',
    accusedUsername: 'Ghostcu_Ali',
    evidenceProvided: true,
    choices: [
      {
        id: 'c1',
        label: 'Ghosting yaptığı için 1 gün ses ve metin susturması verildi.',
        replyText: 'Ghosting ve haksız rekabet yasaktır. 24 saat susturma uygulandı.',
        userReaction: 'Elinize sağlık maçımız kurtuldu.',
        isCorrect: true,
        hypeDelta: 4,
        sanityDelta: 2,
        actionType: 'mute_accused',
        feedback: 'Rekabetçi adalet sağlandı.'
      },
      {
        id: 'c2',
        label: 'Özel odada oynayın beni ilgilendirmez.',
        replyText: 'Oyun içi taktiklere karışmıyoruz.',
        userReaction: 'Turnuva maçı bu nasıl karışmazsınız?',
        isCorrect: false,
        hypeDelta: -8,
        sanityDelta: -4,
        actionType: 'dismiss',
        feedback: 'Kullanıcıları mağdur ettin.'
      }
    ]
  },

  // 36-45: Dolandırıcılık, Sahte Linkler & Phishing
  {
    id: 'sc_36',
    category: 'Dolandırıcılık',
    subject: 'Sahte bedava Discord Nitro linki',
    userIssue: 'Biri bana özel mesajdan 3 aylık bedava Nitro linki attı tıkladım hesabım spam atmaya başladı.',
    creatorUsername: 'Magdur_01',
    accusedUsername: 'NitroOltaci',
    evidenceProvided: true,
    choices: [
      {
        id: 'c1',
        label: 'Oltalama hesabı perma banlandı, mağdura şifre değiştirme uyarısı yapıldı.',
        replyText: 'Zararlı linki yayan hesap kalıcı olarak banlandı. Lütfen derhal Discord şifrenizi değiştirin.',
        userReaction: 'Hemen değiştiriyorum çok teşekkür ederim.',
        isCorrect: true,
        hypeDelta: 5,
        sanityDelta: 3,
        actionType: 'ban_accused',
        feedback: 'Hesap korsanlığı salgınını durdurdun.'
      },
      {
        id: 'c2',
        label: 'Linke tıklamasaydın senin hatan kapatıyorum.',
        replyText: 'Her linke tıklanmaz geçmiş olsun.',
        userReaction: 'Adam hala sunucuda başkalarını dolandırıyor ama?',
        isCorrect: false,
        hypeDelta: -10,
        sanityDelta: -6,
        actionType: 'dismiss',
        feedback: 'Dolandırıcının sunucuda kalmasına izin verdin.'
      }
    ]
  },
  {
    id: 'sc_37',
    category: 'Dolandırıcılık',
    subject: 'Steam takas dolandırıcılığı',
    userIssue: 'DarkKnight bana bıçak skinime karşılık para atacağını söyledi skini aldı parayı atmadı.',
    creatorUsername: 'SkinAvcisi',
    accusedUsername: 'DarkKnight',
    evidenceProvided: true,
    choices: [
      {
        id: 'c1',
        label: 'Kanıtlar incelendi, dolandırıcı sunucudan kalıcı banlandı.',
        replyText: 'Takas dolandırıcılığı kanıtlandı. Şahıs sunucudan atıldı ve kara listeye alındı.',
        userReaction: 'Param gitti ama en azından başkalarını dolandıramayacak.',
        isCorrect: true,
        hypeDelta: 5,
        sanityDelta: 3,
        actionType: 'ban_accused',
        feedback: 'Zehirli üyeyi temizledin.'
      },
      {
        id: 'c2',
        label: 'DarkKnight sunucunun VIP üyesi o öyle şey yapmaz.',
        replyText: 'VIP üyemize iftira atmayın kapatıyorum.',
        userReaction: 'Ekran görüntüsü ve dekont ortada adamı koruyorsunuz resmen!',
        isCorrect: false,
        hypeDelta: -15,
        sanityDelta: -10,
        actionType: 'dismiss',
        feedback: 'Açık dolandırıcılığı kayırdın, sunucuda isyan çıktı.'
      }
    ]
  },
  {
    id: 'sc_38',
    category: 'Dolandırıcılık',
    subject: 'Sahte Valorant VP çekiliş sitesi linki',
    userIssue: 'Genel chate 2850 VP bedava kod sitesi linki bıraktı 5 kişi tıkladı.',
    creatorUsername: 'ValorantSever',
    accusedUsername: 'VpDagitici',
    evidenceProvided: true,
    choices: [
      {
        id: 'c1',
        label: 'Mesajlar silindi ve hesap anında sunucudan uzaklaştırıldı.',
        replyText: 'Oltalama ve sahte kod siteleri yasaktır. Mesajlar temizlendi, kullanıcı banlandı.',
        userReaction: 'Teşekkürler hemen sildiniz.',
        isCorrect: true,
        hypeDelta: 5,
        sanityDelta: 3,
        actionType: 'ban_accused',
        feedback: 'Oltalama saldırısını savuşturdun.'
      },
      {
        id: 'c2',
        label: 'Belki gerçektir deneyelim.',
        replyText: 'Kodları ben bir deneyeyim olursa dağıtırız.',
        userReaction: 'Admin oltaya düşüyor rezillik.',
        isCorrect: false,
        hypeDelta: -12,
        sanityDelta: -7,
        actionType: 'dismiss',
        feedback: 'Yetkili itibarın sıfırlandı.'
      }
    ]
  },
  {
    id: 'sc_39',
    category: 'Dolandırıcılık',
    subject: 'Sunucu yetkisi satma yalanı',
    userIssue: 'Biri bana 100 TL verirsen seni moderatör yaparım dedi IBAN attı.',
    creatorUsername: 'GencUye',
    accusedUsername: 'SahteAdmin',
    evidenceProvided: true,
    choices: [
      {
        id: 'c1',
        label: 'Yetki satışı dolandırıcılığından kullanıcı anında banlandı.',
        replyText: 'Yetkiler asla parayla satılmaz. Sahte yetki vaadinde bulunan kişi banlandı.',
        userReaction: 'Az kalsın parayı atacaktım uyardığınız için teşekkürler.',
        isCorrect: true,
        hypeDelta: 6,
        sanityDelta: 4,
        actionType: 'ban_accused',
        feedback: 'Sunucu yönetim itibarını korudun.'
      },
      {
        id: 'c2',
        label: '100 TL ye yetki varsa ben de alayım.',
        replyText: 'Parayı bana atsaydın yapardım.',
        userReaction: 'Şaka gibi sunucu yetkiyi parayla satıyor.',
        isCorrect: false,
        hypeDelta: -14,
        sanityDelta: -9,
        actionType: 'dismiss',
        feedback: 'Yolsuzluk izlenimi yarattın.'
      }
    ]
  },
  {
    id: 'sc_40',
    category: 'Dolandırıcılık',
    subject: 'Kripto yatırım botu reklamı',
    userIssue: 'Biri herkese günde yüzde 20 kazanç vaat eden telegram kripto linki gönderiyor.',
    creatorUsername: 'Kriptocu_Ali',
    accusedUsername: 'KriptoBotu',
    evidenceProvided: true,
    choices: [
      {
        id: 'c1',
        label: 'Ponzi ve saadet zinciri reklamı yapan şahıs banlandı.',
        replyText: 'Kripto dolandırıcılığı ve izinsiz reklam kesinlikle yasaktır. Hesap banlandı.',
        userReaction: 'Çok sağolun bıktırmıştı.',
        isCorrect: true,
        hypeDelta: 4,
        sanityDelta: 2,
        actionType: 'ban_accused',
        feedback: 'Üyeleri ponziden korudun.'
      },
      {
        id: 'c2',
        label: 'İsteyen girer isteyen girmez.',
        replyText: 'Zorla sokmuyorlar ya karışamam.',
        userReaction: 'Böyle sahtekarlıklara göz yuman yerde durmam.',
        isCorrect: false,
        hypeDelta: -8,
        sanityDelta: -5,
        actionType: 'dismiss',
        feedback: 'Dolandırıcılara alan açtın.'
      }
    ]
  },
  {
    id: 'sc_41',
    category: 'Dolandırıcılık',
    subject: 'Çalıntı kredi kartı ile nitro satışı',
    userIssue: 'Sohbette 50 TL ye yıllık Nitro satıyorum CC var diyen biri var.',
    creatorUsername: 'DuyarliUye',
    accusedUsername: 'CcSatici',
    evidenceProvided: true,
    choices: [
      {
        id: 'c1',
        label: 'İllegal faaliyet ve kart hırsızlığı nedeniyle perma ban atıldı.',
        replyText: 'Sunucumuzda yasadışı kart ve hesap ticareti kesinlikle yasaktır. Şahıs banlandı.',
        userReaction: 'Elinize sağlık sunucunun başı belaya girerdi.',
        isCorrect: true,
        hypeDelta: 6,
        sanityDelta: 3,
        actionType: 'ban_accused',
        feedback: 'Sunucuyu yasal sıkıntıdan kurtardın.'
      },
      {
        id: 'c2',
        label: 'Ucuzmuş aslında ne zararı var.',
        replyText: 'Ucuza satıyor işte ne kızıyorsunuz.',
        userReaction: 'Hırsızlığı savunuyorsunuz tebrikler.',
        isCorrect: false,
        hypeDelta: -15,
        sanityDelta: -10,
        actionType: 'dismiss',
        feedback: 'Ağır prestij kaybı.'
      }
    ]
  },
  {
    id: 'sc_42',
    category: 'Dolandırıcılık',
    subject: 'Özelden hile linki satmaya çalışma',
    userIssue: 'CS2 için virüssüz hile diye exe dosyası atıyor virüstotal kırmızı dolu.',
    creatorUsername: 'TemizOyuncu',
    accusedUsername: 'HileciAbi',
    evidenceProvided: true,
    choices: [
      {
        id: 'c1',
        label: 'Zararlı yazılım yaymaktan kalıcı olarak banlandı.',
        replyText: 'Truva atı ve hile yazılımı paylaşımı nedeniyle şahıs kalıcı uzaklaştırıldı.',
        userReaction: 'Harikasınız milletin bilgisayarı patlayacaktı.',
        isCorrect: true,
        hypeDelta: 5,
        sanityDelta: 3,
        actionType: 'ban_accused',
        feedback: 'Güvenliği sağladın.'
      },
      {
        id: 'c2',
        label: 'Hile linkini bana at ben bir kurayım.',
        replyText: 'Bana yollayın ben bakayım.',
        userReaction: 'Admin hile kurmaya çalışıyor inanılır gibi değil.',
        isCorrect: false,
        hypeDelta: -10,
        sanityDelta: -6,
        actionType: 'dismiss',
        feedback: 'Rezil oldun.'
      }
    ]
  },
  {
    id: 'sc_43',
    category: 'Dolandırıcılık',
    subject: 'Oyun içi takasta parayı alıp kaçma',
    userIssue: 'Metin2 de dolunay kılıcı için 200 TL IBAN attım ticareti onaylamadan oyundan çıktı.',
    creatorUsername: 'Metinci_Hasan',
    accusedUsername: 'DolunayKral',
    evidenceProvided: true,
    choices: [
      {
        id: 'c1',
        label: 'Dolandırıcılık tescillendi, sunucudan kalıcı olarak banlandı.',
        replyText: 'Dekont ve oyun içi loglar uyuşuyor. Dolandırıcılık yapan şahıs banlandı.',
        userReaction: 'Teşekkürler en azından bu sunucuda kimseyi çarpamaz artık.',
        isCorrect: true,
        hypeDelta: 4,
        sanityDelta: 2,
        actionType: 'ban_accused',
        feedback: 'Mağduriyeti ciddiye aldın.'
      },
      {
        id: 'c2',
        label: 'Metin2 oynayan kaldı mı abi kapatıyorum.',
        replyText: 'Oyun içi ticaretler bizi bağlamaz.',
        userReaction: 'Adam sunucunuzu pazar yeri gibi kullanıp milleti çarpıyor.',
        isCorrect: false,
        hypeDelta: -7,
        sanityDelta: -4,
        actionType: 'dismiss',
        feedback: 'Topluluk güvenini sarstın.'
      }
    ]
  },
  {
    id: 'sc_44',
    category: 'Dolandırıcılık',
    subject: 'Çekiliş kazandın diyerek telefon numarası isteme',
    userIssue: 'Biri bana sunucu çekilişini kazandınız diyerek SMS onay kodu istedi.',
    creatorUsername: 'SafGenc',
    accusedUsername: 'CekilisHirsizi',
    evidenceProvided: true,
    choices: [
      {
        id: 'c1',
        label: 'Oltalama ve kimlik avı nedeniyle şahıs kalıcı banlandı.',
        replyText: 'Sunucu yetkilileri asla SMS kodu istemez. Şahıs derhal banlandı.',
        userReaction: 'İyi ki kodu vermemişim sağolun.',
        isCorrect: true,
        hypeDelta: 5,
        sanityDelta: 3,
        actionType: 'ban_accused',
        feedback: 'Üyeyi büyük zarardan korudun.'
      },
      {
        id: 'c2',
        label: 'Kodu verseydin hediyen gelirdi.',
        replyText: 'Kod istemiştir normaldir.',
        userReaction: 'Siz de mi dolandırıcısınız?',
        isCorrect: false,
        hypeDelta: -12,
        sanityDelta: -7,
        actionType: 'dismiss',
        feedback: 'Ağır sorumsuzluk.'
      }
    ]
  },
  {
    id: 'sc_45',
    category: 'Dolandırıcılık',
    subject: 'Özelden sunucu çalma botu daveti',
    userIssue: 'Biri bana sunucuna bedava müzik botu ekle diye yetkili bot linki atıyor.',
    creatorUsername: 'SunucuSahibi_Ali',
    accusedUsername: 'BotcuTroll',
    evidenceProvided: true,
    choices: [
      {
        id: 'c1',
        label: 'Kötü niyetli bot linki dağıtan kullanıcı banlandı.',
        replyText: 'Yetki gaspı yapan sahte bot linkleri dağıtmak yasaktır. Kullanıcı banlandı.',
        userReaction: 'Teşekkürler sunucumu patlatacaktı az kalsın.',
        isCorrect: true,
        hypeDelta: 5,
        sanityDelta: 3,
        actionType: 'ban_accused',
        feedback: 'Raid botunu engelledin.'
      },
      {
        id: 'c2',
        label: 'Bana ne senin sunucundan.',
        replyText: 'Başka sunucunun güvenliği benim işim değil.',
        userReaction: 'Senin sunucundaki üyeleri hedef alıyor adam farkında mısın?',
        isCorrect: false,
        hypeDelta: -8,
        sanityDelta: -4,
        actionType: 'dismiss',
        feedback: 'Dar görüşlü karar.'
      }
    ]
  },

  // 46-55: Oyun İçi Rekabet, Hile & Griefing
  {
    id: 'sc_46',
    category: 'Şikayet',
    subject: 'Valorant maçında hile kullanımı videosu',
    userIssue: 'Sunucu turnuva maçında karşı takımdaki adam duvar arkası vuruyor kanıt videosunu yükledim.',
    creatorUsername: 'Efe_Gamer',
    accusedUsername: 'WallhackPro',
    evidenceProvided: true,
    choices: [
      {
        id: 'c1',
        label: 'Kanıt videosu incelendi, hileci turnuvadan diskalifiye edilip banlandı.',
        replyText: 'Video kayıtları net hile tespit etti. Oyuncu kalıcı olarak banlandı ve turnuva skoru düzeltildi.',
        userReaction: 'Adalet yerini buldu harikasınız.',
        isCorrect: true,
        hypeDelta: 7,
        sanityDelta: 4,
        actionType: 'ban_accused',
        feedback: 'Turnuva dürüstlüğünü kurtardın.'
      },
      {
        id: 'c2',
        label: 'Adam iyi oynuyor çekemiyorsunuz kapatıyorum.',
        replyText: 'Sadece yetenekli ağlamayın.',
        userReaction: 'Duvar arkasından kafama bakıp sıkıyor ne yeteneği?',
        isCorrect: false,
        hypeDelta: -11,
        sanityDelta: -6,
        actionType: 'dismiss',
        feedback: 'Hileciyi akladın, turnuva dağıldı.'
      }
    ]
  },
  {
    id: 'sc_47',
    category: 'Şikayet',
    subject: 'R6 maçında kasıtlı tk atıp roundu kaybettirme',
    userIssue: 'Dereceli maçta defalarca kafamıza sıktı sonra güldü maçımız gitti.',
    creatorUsername: 'Taktikci_Mert',
    accusedUsername: 'Tker_01',
    evidenceProvided: true,
    choices: [
      {
        id: 'c1',
        label: 'Griefing ve bilerek maçı sabote etmekten 2 gün susturma verildi.',
        replyText: 'Takım arkadaşlarını kasıtlı öldürmek ve oyunu sabote etmek yasaktır. 48 saat susturuldu.',
        userReaction: 'Teşekkürler en azından ders olur.',
        isCorrect: true,
        hypeDelta: 4,
        sanityDelta: 2,
        actionType: 'mute_accused',
        feedback: 'Adil yaptırım uyguladın.'
      },
      {
        id: 'c2',
        label: 'Yanlışlıkla vurmuştur.',
        replyText: 'Oyun içi kazalar olabilir.',
        userReaction: 'Üç round üst üste kafama sıktı ne kazası?',
        isCorrect: false,
        hypeDelta: -8,
        sanityDelta: -4,
        actionType: 'dismiss',
        feedback: 'Trolü cezasız bıraktın.'
      }
    ]
  },
  {
    id: 'sc_48',
    category: 'Şikayet',
    subject: 'Rust klan kodunu düşman klana satan hain',
    userIssue: 'Sunucu Rust klanımızdaki Furkan bütün kapı şifrelerimizi düşmana satmış üssümüz patladı.',
    creatorUsername: 'RustReisi',
    accusedUsername: 'Furkan07',
    evidenceProvided: true,
    choices: [
      {
        id: 'c1',
        label: 'Klan sabotajı ve güven suistimalinden sunucu klan rollerinden atıldı.',
        replyText: 'Sunucu içi klan birlikteliğini sabote ettiği kanıtlandı, oyuncu klandan çıkarıldı.',
        userReaction: 'Sağolun bari diğer klanlar dikkat etsin.',
        isCorrect: true,
        hypeDelta: 4,
        sanityDelta: 2,
        actionType: 'mute_accused',
        feedback: 'Klan huzurunu sağladın.'
      },
      {
        id: 'c2',
        label: 'Rust böyle bir oyun ağlamayın.',
        replyText: 'Rust ihanet oyunudur yapacak bir şey yok.',
        userReaction: 'Kendi aramızda kurduğumuz kuralı çiğnedi ama.',
        isCorrect: false,
        hypeDelta: -6,
        sanityDelta: -3,
        actionType: 'dismiss',
        feedback: 'Topluluk bağını zayıflattın.'
      }
    ]
  },
  {
    id: 'sc_49',
    category: 'Şikayet',
    subject: 'LoL maçında bilerek besleme ve hakaret',
    userIssue: 'Sunucu içi 5v5 maçta ilk kanı verdi diye koridorunu terk edip kule altına öldü sövdü.',
    creatorUsername: 'MidOyuncusu',
    accusedUsername: 'TiltYone',
    evidenceProvided: true,
    choices: [
      {
        id: 'c1',
        label: 'Toxic davranış ve bilerek besleme nedeniyle 1 gün susturma verildi.',
        replyText: 'Sunucu içi etkinliklerde kasıtlı feedlemek ve hakaret etmek yasaktır. 24 saat susturuldu.',
        userReaction: 'Elinize sağlık maçı zehir etmişti.',
        isCorrect: true,
        hypeDelta: 4,
        sanityDelta: 2,
        actionType: 'mute_accused',
        feedback: 'Sportmenliği korudun.'
      },
      {
        id: 'c2',
        label: 'LoL oynayan herkes böyle normaldir.',
        replyText: 'LoL chati böyledir takılmayın.',
        userReaction: 'Sunucu içi maçta bunu yapması yasak değil miydi?',
        isCorrect: false,
        hypeDelta: -7,
        sanityDelta: -4,
        actionType: 'dismiss',
        feedback: 'Toksikliği normalleştirdin.'
      }
    ]
  },
  {
    id: 'sc_50',
    category: 'Şikayet',
    subject: 'GTA RP sunucusunda RDM şikayeti',
    userIssue: 'Sunucunun RP odasında rol yaparken durduk yere gelip sıktı ve kaçtı rolü böldü.',
    creatorUsername: 'RolUstasi',
    accusedUsername: 'Rdmci_Kadir',
    evidenceProvided: true,
    choices: [
      {
        id: 'c1',
        label: 'Rol ihlali ve RDM nedeniyle RP rollerinden men edildi.',
        replyText: 'Rolsüz adam öldürme ve rol bölme tescillendi. RP kanallarından uzaklaştırıldı.',
        userReaction: 'Teşekkürler rol kalitemiz arttı.',
        isCorrect: true,
        hypeDelta: 4,
        sanityDelta: 2,
        actionType: 'mute_accused',
        feedback: 'RP disiplinini sağladın.'
      },
      {
        id: 'c2',
        label: 'Kendini savunsaydın vurulmasaydın.',
        replyText: 'Sen de ona sıksaydın.',
        userReaction: 'RP kuralı diyorum kendi sıksaydın diyorsunuz inanılmaz.',
        isCorrect: false,
        hypeDelta: -9,
        sanityDelta: -5,
        actionType: 'dismiss',
        feedback: 'Rol kurallarını hiçe saydın.'
      }
    ]
  },
  {
    id: 'sc_51',
    category: 'Şikayet',
    subject: 'Oyun içi smurf hesapla düşük elo üyeleri ezme ve dalga geçme',
    userIssue: 'Demir elo turnuvasına radiant smurfüyle katılıp herkesle dalga geçti.',
    creatorUsername: 'YeniBaslayan',
    accusedUsername: 'SmurfKral',
    evidenceProvided: true,
    choices: [
      {
        id: 'c1',
        label: 'Smurf kuralı ihlalinden turnuva ödülü iptal edildi ve uyarıldı.',
        replyText: 'Düşük elo etkinliklerinde smurf hesap kullanımı yasaktır. Ödül geri alındı.',
        userReaction: 'Hakkımız yenmedi çok teşekkürler.',
        isCorrect: true,
        hypeDelta: 5,
        sanityDelta: 3,
        actionType: 'warn_user',
        feedback: 'Zayıf oyuncuların hakkını korudun.'
      },
      {
        id: 'c2',
        label: 'İyi oynayanı cezalandıramayız.',
        replyText: 'Bileğine sağlık adam vurmuş işte.',
        userReaction: 'Yeni başlayanlar için turnuva demiştiniz ama.',
        isCorrect: false,
        hypeDelta: -8,
        sanityDelta: -5,
        actionType: 'dismiss',
        feedback: 'Yeni üyeleri kaybettin.'
      }
    ]
  },
  {
    id: 'sc_52',
    category: 'Şikayet',
    subject: 'Among Us oyununda sesten info sızdırma',
    userIssue: 'Oyun içi etkinlikte imposter olunca yanındaki arkadaşına fısıldayıp oyunu bozdu.',
    creatorUsername: 'Dedektif_Cem',
    accusedUsername: 'HainImposter',
    evidenceProvided: true,
    choices: [
      {
        id: 'c1',
        label: 'Oyun bozanlık nedeniyle etkinlik odalarından 1 gün uzaklaştırıldı.',
        replyText: 'Parti oyunlarında haksız bilgi paylaşımı yasaktır. 24 saat etkinlik yasağı verildi.',
        userReaction: 'Oyunun tadı kaçmıştı iyi oldu.',
        isCorrect: true,
        hypeDelta: 3,
        sanityDelta: 2,
        actionType: 'mute_accused',
        feedback: 'Eğlence ortamını korudun.'
      },
      {
        id: 'c2',
        label: 'Alt tarafı oyun büyütmeyin.',
        replyText: 'Among us için ticket mi açılır kapatıyorum.',
        userReaction: 'Bütün sunucu beraber oynuyoruz saygısızlık bu.',
        isCorrect: false,
        hypeDelta: -6,
        sanityDelta: -3,
        actionType: 'dismiss',
        feedback: 'Kullanıcı talebini küçümsedin.'
      }
    ]
  },
  {
    id: 'sc_53',
    category: 'Şikayet',
    subject: 'Minecraft sunucusunda evleri lavla yakma',
    userIssue: 'Sunucunun ortak Minecraft dünyasında yaptığımız kaleyi lav döküp yaktı.',
    creatorUsername: 'Mimar_Can',
    accusedUsername: 'Griefer_Ali',
    evidenceProvided: true,
    choices: [
      {
        id: 'c1',
        label: 'Emek hırsızlığı ve griefing nedeniyle oyuncu banlandı.',
        replyText: 'Ortak sunucu dünyasını tahrip etmek kalıcı uzaklaştırma sebebidir. Banlandı.',
        userReaction: 'Haftalardır uğraşıyorduk teşekkürler.',
        isCorrect: true,
        hypeDelta: 5,
        sanityDelta: 3,
        actionType: 'ban_accused',
        feedback: 'Topluluk emeğini savundun.'
      },
      {
        id: 'c2',
        label: 'Evini taştan yapsaydın yanmazdı.',
        replyText: 'Ahşap yapmasaydınız.',
        userReaction: 'Gözümüzün önünde yaktı adamı koruyorsunuz.',
        isCorrect: false,
        hypeDelta: -9,
        sanityDelta: -6,
        actionType: 'dismiss',
        feedback: 'Zorbayı ödüllendirdin.'
      }
    ]
  },
  {
    id: 'sc_54',
    category: 'Şikayet',
    subject: 'Lethal Company de gemiyi bilerek erken kaldırma',
    userIssue: 'Ganimetleri toplarken bizi bilerek dışarıda bırakıp gemi kolunu çekti ve güldü.',
    creatorUsername: 'Hurda_Avcisi',
    accusedUsername: 'TrollKaptan',
    evidenceProvided: false,
    choices: [
      {
        id: 'c1',
        label: 'Kullanıcı uyarıldı ve tekrarında oyun odasından men edileceği bildirildi.',
        replyText: 'Kasıtlı trollemeyi bırakması için uyarıldı, tekrarlarsa yetkisi alınacak.',
        userReaction: 'Sağolun dikkate aldığınız için.',
        isCorrect: true,
        hypeDelta: 3,
        sanityDelta: 1,
        actionType: 'warn_user',
        feedback: 'Makul bir uyarı verdin.'
      },
      {
        id: 'c2',
        label: 'Kullanıcıyı sorgusuz sualsiz perma banla.',
        replyText: 'Oyun içi trollük yüzünden banladım.',
        userReaction: 'Kanıt bile yoktu direkt banladınız mı?',
        isCorrect: false,
        hypeDelta: -8,
        sanityDelta: -4,
        actionType: 'ban_accused',
        feedback: 'Kanıtsız aşırı ceza verdin.'
      }
    ]
  },
  {
    id: 'sc_55',
    category: 'Şikayet',
    subject: 'Rocket League turnuva maçına gelmeyip hükmen mağlup ettirme',
    userIssue: 'Partnerim maç saatinde çevrimiçi olduğu halde başka oyuna girdi elendik.',
    creatorUsername: 'UcanArabaci',
    accusedUsername: 'Terkeden_06',
    evidenceProvided: true,
    choices: [
      {
        id: 'c1',
        label: 'Turnuva kurallarını ihlal eden oyuncu sonraki turnuvalardan men edildi.',
        replyText: 'Hükmen mağlubiyete sebep olan oyuncuya turnuva yasağı getirildi.',
        userReaction: 'Teşekkür ederim emeğimize yazık olmuştu.',
        isCorrect: true,
        hypeDelta: 4,
        sanityDelta: 2,
        actionType: 'mute_accused',
        feedback: 'Turnuva disiplinini sağladın.'
      },
      {
        id: 'c2',
        label: 'Tek başına oynasaydın.',
        replyText: 'İki kişi oynamak zorunda değildin.',
        userReaction: '2v2 turnuva bu dalga mı geçiyorsunuz?',
        isCorrect: false,
        hypeDelta: -7,
        sanityDelta: -4,
        actionType: 'dismiss',
        feedback: 'Saçma yanıtla sinirlendirdin.'
      }
    ]
  },

  // 56-65: Yetki, Rol & VIP Talepleri
  {
    id: 'sc_56',
    category: 'Yetki & Rol',
    subject: 'VIP bağış dekontu ve rol teslimi',
    userIssue: 'Sunucuya 150 TL bağış yaptım dekont ektedir VIP Balina rolümü talep ediyorum.',
    creatorUsername: 'Zengin_Yeni',
    evidenceProvided: true,
    choices: [
      {
        id: 'c1',
        label: 'Dekont doğrulandı, VIP Balina rolü teslim edildi.',
        replyText: 'Bağışınız için teşekkür ederiz. VIP Balina rolünüz ve ayrıcalıklarınız tanımlandı.',
        userReaction: 'Harikasınız çok hızlısınız.',
        isCorrect: true,
        hypeDelta: 5,
        sanityDelta: 2,
        moneyDelta: 150,
        actionType: 'grant_role',
        feedback: 'Bağışçıyı memnun ettin, sunucu kasası kazandı.'
      },
      {
        id: 'c2',
        label: 'Dekont sahte gibi duruyor kapatıyorum.',
        replyText: 'Bunu paintle mi yaptın kabul etmiyorum.',
        userReaction: 'Banka dekontu bu reziller paramı yediniz!',
        isCorrect: false,
        hypeDelta: -14,
        sanityDelta: -8,
        actionType: 'dismiss',
        feedback: 'Gerçek bağışçıyı kovdun, itibar yerle bir.'
      }
    ]
  },
  {
    id: 'sc_57',
    category: 'Yetki & Rol',
    subject: 'Booster rolünün sistemsel olarak silinmesi',
    userIssue: 'Sunucuya dün 2 boost bastım ama sunucu yenilenince Booster rolüm kayboldu.',
    creatorUsername: 'SadikBooster',
    evidenceProvided: true,
    choices: [
      {
        id: 'c1',
        label: 'Boost kaydı teyit edildi, rol iade edildi.',
        replyText: 'Loglar incelendi, sistem hatası düzeltilerek Booster rolünüz verildi.',
        userReaction: 'Çok teşekkürler ilgilendiğiniz için.',
        isCorrect: true,
        hypeDelta: 4,
        sanityDelta: 2,
        actionType: 'grant_role',
        feedback: 'Destekçiyi mağdur etmedin.'
      },
      {
        id: 'c2',
        label: 'Bir daha boost bas düzelir.',
        replyText: 'Sistem silmişse tekrar para yatırın.',
        userReaction: 'Boostu çekiyorum sunucudan da çıkıyorum.',
        isCorrect: false,
        hypeDelta: -12,
        sanityDelta: -7,
        actionType: 'dismiss',
        feedback: 'Sunucu boost seviyesi düştü.'
      }
    ]
  },
  {
    id: 'sc_58',
    category: 'Yetki & Rol',
    subject: 'Eski sunucuda moderatördüm burada da verin',
    userIssue: 'Ben 50 bin kişilik sunucuda baş moderatördüm beni hemen yetkili yapın tecrübeliyim.',
    creatorUsername: 'EskiMod_Salih',
    evidenceProvided: false,
    choices: [
      {
        id: 'c1',
        label: 'Başvuru formunu doldurması gerektiği kibarca açıklandı.',
        replyText: 'Yetkili alımlarımız yalnızca aktif başvuru formları üzerinden yapılmaktadır. Duyuruları takip ediniz.',
        userReaction: 'Anladım formu bekleyeceğim.',
        isCorrect: true,
        hypeDelta: 3,
        sanityDelta: 1,
        actionType: 'dismiss',
        feedback: 'Kurumsal duruş sergiledin.'
      },
      {
        id: 'c2',
        label: 'Hemen Yönetici rolünü ver.',
        replyText: 'Madem tecrübelisin al sana tam yetki.',
        userReaction: 'Eyvallah kardeşim hallederiz.',
        isCorrect: false,
        hypeDelta: -15,
        sanityDelta: -12,
        actionType: 'grant_role',
        feedback: 'Tanımadığın birine yetki verdin, sunucu güvenliği çöktü.'
      }
    ]
  },
  {
    id: 'sc_59',
    category: 'Yetki & Rol',
    subject: 'Kız üye rolü talebi',
    userIssue: 'Kız rolü almak istiyorum ses teyit kanalına gelebilirim.',
    creatorUsername: 'Gamze_98',
    evidenceProvided: true,
    choices: [
      {
        id: 'c1',
        label: 'Ses teyidi alındı ve rol tanımlandı.',
        replyText: 'Teyit tamamlandı, rolünüz verildi. Keyifli sohbetler.',
        userReaction: 'Teşekkürler iyi çalışmalar.',
        isCorrect: true,
        hypeDelta: 3,
        sanityDelta: 1,
        actionType: 'grant_role',
        feedback: 'Prosedürü doğru işlettin.'
      },
      {
        id: 'c2',
        label: 'İnstagramını ver bakayım ona göre veririm.',
        replyText: 'Fotoğrafını atarsan veririm.',
        userReaction: 'Sapık mısınız siz yetkiliye bak!',
        isCorrect: false,
        hypeDelta: -16,
        sanityDelta: -10,
        actionType: 'dismiss',
        feedback: 'Ahlaksız talepte bulundun, ifşa edildin.'
      }
    ]
  },
  {
    id: 'sc_60',
    category: 'Yetki & Rol',
    subject: 'İçerik üreticisi rolü talebi',
    userIssue: 'YouTube da 15 bin abonem var sunucunuzun tanıtım videosunu çektim rol talep ediyorum.',
    creatorUsername: 'YoutuberGenc',
    evidenceProvided: true,
    choices: [
      {
        id: 'c1',
        label: 'Kanal linki incelendi, İçerik Üreticisi rolü tanımlandı.',
        replyText: 'Tanıtım videonuz incelendi, emeğiniz için teşekkür ederiz. Rolünüz verildi.',
        userReaction: 'Süpersiniz yeni video da gelecek.',
        isCorrect: true,
        hypeDelta: 8,
        sanityDelta: 3,
        actionType: 'grant_role',
        feedback: 'Sunucuya ücretsiz PR kazandırdın.'
      },
      {
        id: 'c2',
        label: '15 bin az 100 bin olunca gel.',
        replyText: 'Küçük kanallara rol vermiyoruz.',
        userReaction: 'Tanıtım videonuzu siliyorum kötüleme videosu çekeceğim.',
        isCorrect: false,
        hypeDelta: -10,
        sanityDelta: -5,
        actionType: 'dismiss',
        feedback: 'Kötü reklam aldın.'
      }
    ]
  },
  {
    id: 'sc_61',
    category: 'Yetki & Rol',
    subject: 'Moderatörün keyfi yetki kullanımı şikayeti',
    userIssue: 'Kaan_Mod beni sırf fikirlerimiz uyuşmuyor diye genel sohbetten susturdu kanıtları attım.',
    creatorUsername: 'Fikirci_Emre',
    accusedUsername: 'Kaan_Mod',
    evidenceProvided: true,
    choices: [
      {
        id: 'c1',
        label: 'Haksız susturma kaldırıldı, moderatör uyarıldı.',
        replyText: 'Loglar incelendi ve kural ihlali olmadığı tespit edildi. Cezanız kaldırıldı, yetkili uyarıldı.',
        userReaction: 'Adil davrandığınız için minnettarım.',
        isCorrect: true,
        hypeDelta: 5,
        sanityDelta: 3,
        actionType: 'dismiss',
        feedback: 'Yönetim içinde adaleti sağladın.'
      },
      {
        id: 'c2',
        label: 'Moderatörüm ne yaparsa arkasındayım uzatma.',
        replyText: 'Yetkilimin kararı kesindir.',
        userReaction: 'Diktatörlük burası reziller.',
        isCorrect: false,
        hypeDelta: -11,
        sanityDelta: -6,
        actionType: 'dismiss',
        feedback: 'Keyfi baskıyı korudun.'
      }
    ]
  },
  {
    id: 'sc_62',
    category: 'Yetki & Rol',
    subject: 'Turnuva şampiyonu rolü teslimi',
    userIssue: 'Dünkü 1v1 CS2 turnuvasını ben kazandım Şampiyon rolüm verilmedi.',
    creatorUsername: 'Sampiyon_Ahmet',
    evidenceProvided: true,
    choices: [
      {
        id: 'c1',
        label: 'Turnuva tablosu kontrol edildi, Şampiyon rolü verildi.',
        replyText: 'Tebrikler turnuva başarınız onaylandı. Şampiyon rolünüz teslim edildi.',
        userReaction: 'Çok sağolun.',
        isCorrect: true,
        hypeDelta: 4,
        sanityDelta: 2,
        actionType: 'grant_role',
        feedback: 'Etkinlik motivasyonunu artırdın.'
      },
      {
        id: 'c2',
        label: 'Turnuvayı unuttuk rol falan yok.',
        replyText: 'Turnuva kaydı tutmadık yapacak bir şey yok.',
        userReaction: 'Saatlerce oynadım dalga mı geçiyorsunuz?',
        isCorrect: false,
        hypeDelta: -9,
        sanityDelta: -5,
        actionType: 'dismiss',
        feedback: 'Etkinlik güvenilirliğini yıktın.'
      }
    ]
  },
  {
    id: 'sc_63',
    category: 'Yetki & Rol',
    subject: 'Özel isim rengi isteme',
    userIssue: 'Sunucuda adımın mor renk gözükmesini istiyorum nasıl alabilirim?',
    creatorUsername: 'Renkci_Buse',
    evidenceProvided: false,
    choices: [
      {
        id: 'c1',
        label: 'Renk rollerinin seviye veya VIP ile açıldığı bilgisi verildi.',
        replyText: 'Özel isim renkleri Seviye 15 ve üzeri veya sunucu destekçilerine açıktır. Bilgi kanalını inceleyebilirsiniz.',
        userReaction: 'Anladım seviye kasmaya devam o zaman teşekkürler.',
        isCorrect: true,
        hypeDelta: 3,
        sanityDelta: 1,
        actionType: 'dismiss',
        feedback: 'Sohbet aktivitesini teşvik ettin.'
      },
      {
        id: 'c2',
        label: 'Uğraştırma beni boş ticket açma.',
        replyText: 'Renk için ticket mi açtın kapatıyorum.',
        userReaction: 'Düzgünce sorduk terbiyesiz.',
        isCorrect: false,
        hypeDelta: -5,
        sanityDelta: -2,
        actionType: 'dismiss',
        feedback: 'Kaba davrandın.'
      }
    ]
  },
  {
    id: 'sc_64',
    category: 'Yetki & Rol',
    subject: 'Yetkili alım mülakatı talebi',
    userIssue: 'Moderatör alımı formunu doldurmuştum mülakat için bekliyorum.',
    creatorUsername: 'AdayMod_Kemal',
    evidenceProvided: true,
    choices: [
      {
        id: 'c1',
        label: 'Başvuruların toplu değerlendirileceği bilgisi verildi.',
        replyText: 'Başvurunuz kayıtlarımıza ulaştı. Değerlendirme haftasonu toplu duyurulacaktır.',
        userReaction: 'Beklemedeyim kolay gelsin.',
        isCorrect: true,
        hypeDelta: 3,
        sanityDelta: 1,
        actionType: 'dismiss',
        feedback: 'Profesyonel süreç yönettin.'
      },
      {
        id: 'c2',
        label: 'Tipini beğenmedik elendin.',
        replyText: 'Başvurun reddedildi.',
        userReaction: 'Hiç profesyonel değilsiniz.',
        isCorrect: false,
        hypeDelta: -6,
        sanityDelta: -3,
        actionType: 'dismiss',
        feedback: 'Yönetim kalitesini düşürdün.'
      }
    ]
  },
  {
    id: 'sc_65',
    category: 'Yetki & Rol',
    subject: 'Rolüm başkası tarafından silinmiş',
    userIssue: 'Dün Kıdemli Üye rolüm vardı bugün baktım gitmiş neden alındı?',
    creatorUsername: 'Kidemli_Murat',
    evidenceProvided: false,
    choices: [
      {
        id: 'c1',
        label: 'Denetim kayıtları incelendi, hata tespit edilip rol iade edildi.',
        replyText: 'Otomasyon botunun hatası sonucu rol düşmüş, düzeltildi ve rolünüz geri verildi.',
        userReaction: 'Hızlı çözüm için teşekkürler.',
        isCorrect: true,
        hypeDelta: 4,
        sanityDelta: 2,
        actionType: 'grant_role',
        feedback: 'Üye sadakatini korudun.'
      },
      {
        id: 'c2',
        label: 'Alındıysa hak etmişsindir.',
        replyText: 'Boşuna alınmaz kurallara uy.',
        userReaction: 'Loga bile bakmadınız suçum ne diyorum cevap yok.',
        isCorrect: false,
        hypeDelta: -8,
        sanityDelta: -4,
        actionType: 'dismiss',
        feedback: 'Haksız yere üye küstürdün.'
      }
    ]
  },

  // 66-75: Ceza İtirazları & Ban Affı
  {
    id: 'sc_66',
    category: 'Ceza İtirazı',
    subject: 'Kardeşim klavyeye basmış küfür etmiş itirazı',
    userIssue: 'Ben tuvaletteyken 8 yaşındaki küçük kardeşim chate küfür yazmış banımı açar mısınız lütfen?',
    creatorUsername: 'KardesimYapti',
    evidenceProvided: false,
    choices: [
      {
        id: 'c1',
        label: 'Hesap güvenliğinin şahsi sorumluluk olduğu hatırlatılarak ceza 1 güne indirildi.',
        replyText: 'Hesap güvenliği kullanıcının sorumluluğundadır. Ancak samimiyetiniz nedeniyle ceza 24 saat susturmaya çekildi.',
        userReaction: 'Çok teşekkür ederim bir daha bilgisayarı açık bırakmam.',
        isCorrect: true,
        hypeDelta: 3,
        sanityDelta: 1,
        actionType: 'dismiss',
        feedback: 'Merhametli ama kurallı davrandın.'
      },
      {
        id: 'c2',
        label: 'Klasik kardeş yalanı banın açılmıyor.',
        replyText: 'Herkes aynı yalanı söylüyor ban kalıcı.',
        userReaction: 'Gerçekti ama neyse.',
        isCorrect: false,
        hypeDelta: -4,
        sanityDelta: -2,
        actionType: 'dismiss',
        feedback: 'Katı tutum sergiledin.'
      }
    ]
  },
  {
    id: 'sc_67',
    category: 'Ceza İtirazı',
    subject: 'Haksız yere bot tarafından atılan spam mutesi',
    userIssue: 'Kod paylaşırken 3 satır arka arkaya yapıştırdım bot beni 24 saat susturdu.',
    creatorUsername: 'Yazilimci_Boran',
    evidenceProvided: true,
    choices: [
      {
        id: 'c1',
        label: 'Bot cezası iptal edildi, mute kaldırıldı.',
        replyText: 'Kod bloğu paylaştığınız ve niyetiniz spam olmadığı doğrulandı. Susturmanız kaldırıldı.',
        userReaction: 'Harika bot ayarını biraz gevşetin bence teşekkürler.',
        isCorrect: true,
        hypeDelta: 4,
        sanityDelta: 2,
        actionType: 'dismiss',
        feedback: 'Hatalı bot kararı düzeltildi.'
      },
      {
        id: 'c2',
        label: 'Bot ne dediyse odur bekleyeceksin.',
        replyText: 'Botun kararına karışamam.',
        userReaction: 'Siz ne işe yarıyorsunuz o zaman?',
        isCorrect: false,
        hypeDelta: -7,
        sanityDelta: -4,
        actionType: 'dismiss',
        feedback: 'Tembellik ettin.'
      }
    ]
  },
  {
    id: 'sc_68',
    category: 'Ceza İtirazı',
    subject: '6 ay önce banlanmıştım özür dilerim af istiyorum',
    userIssue: 'Geçen yaz sinirle modla tartışıp ban yemiştim çok pişmanım arkadaşlarım bu sunucuda af diliyorum.',
    creatorUsername: 'PismanUye',
    evidenceProvided: false,
    choices: [
      {
        id: 'c1',
        label: 'Geçmiş sicil incelendi, son bir şans verilerek ban kaldırıldı.',
        replyText: 'Aradan geçen süre ve samimi özrünüz dikkate alınarak banınız kaldırıldı. Tekrarı halinde affı olmayacaktır.',
        userReaction: 'Söz veriyorum asla sorun çıkarmayacağım teşekkürler.',
        isCorrect: true,
        hypeDelta: 5,
        sanityDelta: 2,
        actionType: 'dismiss',
        feedback: 'Eski üyeyi geri kazandın.'
      },
      {
        id: 'c2',
        label: 'Giden gelmez ban asla açılmaz.',
        replyText: 'Bizde af yoktur.',
        userReaction: 'Pişman olan insana bile şans vermiyorsunuz.',
        isCorrect: false,
        hypeDelta: -5,
        sanityDelta: -2,
        actionType: 'dismiss',
        feedback: 'Aşırı sert durdun.'
      }
    ]
  },
  {
    id: 'sc_69',
    category: 'Ceza İtirazı',
    subject: 'Arkadaşım banlandı onun yerine ben yazıyorum',
    userIssue: 'Arkadaşım Ahmet ban yedi haksız yere banlandı onun banını açın lütfen.',
    creatorUsername: 'Araci_Arkadas',
    evidenceProvided: false,
    choices: [
      {
        id: 'c1',
        label: 'Bireysel ceza itirazlarının şahsın kendisi tarafından yapılması gerektiği bildirildi.',
        replyText: 'Güvenlik prosedürleri gereği 3. şahıslar adına talep alınamamaktadır. Arkadaşınız kendisi destek açmalıdır.',
        userReaction: 'Tamam ona söyleyeyim kendi yazsın.',
        isCorrect: true,
        hypeDelta: 2,
        sanityDelta: 1,
        actionType: 'dismiss',
        feedback: 'Prosedüre sadık kaldın.'
      },
      {
        id: 'c2',
        label: 'Arkadaşını savunduğun için seni de banlıyorum.',
        replyText: 'Yancılık yapma sen de banlandın.',
        userReaction: 'Sadece soru sorduk ne biçim adminsiniz!',
        isCorrect: false,
        hypeDelta: -12,
        sanityDelta: -7,
        actionType: 'ban_accused',
        feedback: 'Gereksiz yere suçsuz üyeyi banladın.'
      }
    ]
  },
  {
    id: 'sc_70',
    category: 'Ceza İtirazı',
    subject: 'Kelimem yanlış anlaşıldı küfür etmedim',
    userIssue: 'Sohbette amanın dedim bot beni küfür filtresinden banladı itiraz ediyorum.',
    creatorUsername: 'Saskin_Sair',
    evidenceProvided: true,
    choices: [
      {
        id: 'c1',
        label: 'Chat logu incelendi, harf çakışması tespit edilip ban kaldırıldı.',
        replyText: 'Filtre harf eşleşmesi hatası tespit edildi, banınız kaldırıldı ve filtremiz güncellendi.',
        userReaction: 'Çok teşekkürler korkmuştum.',
        isCorrect: true,
        hypeDelta: 5,
        sanityDelta: 3,
        actionType: 'dismiss',
        feedback: 'Sistem hatasını düzelttin.'
      },
      {
        id: 'c2',
        label: 'O kelimeyi kullanmayacaktın cezanı çek.',
        replyText: 'Yazmasaydın sen de.',
        userReaction: 'Türkçe kelime yazmak yasak mı şaka mısınız?',
        isCorrect: false,
        hypeDelta: -9,
        sanityDelta: -5,
        actionType: 'dismiss',
        feedback: 'Hatalı filtreyi savundun.'
      }
    ]
  },
  {
    id: 'sc_71',
    category: 'Ceza İtirazı',
    subject: 'Caps lock açık kalmış ceza aldım',
    userIssue: 'Oyun heyecanıyla büyük harfle YOL VER dedim 3 saat susturuldum çok fazla değil mi?',
    creatorUsername: 'CapsMagduru',
    evidenceProvided: true,
    choices: [
      {
        id: 'c1',
        label: 'Ceza süresi 15 dakikaya düşürüldü, caps uyarısı yapıldı.',
        replyText: 'İlk kural ihlaliniz olduğu için cezanız 15 dakikaya indirildi. Lütfen genel sohbette büyük harf kullanmayın.',
        userReaction: 'Sağolun dikkat edeceğim.',
        isCorrect: true,
        hypeDelta: 3,
        sanityDelta: 1,
        actionType: 'dismiss',
        feedback: 'Orantılı adalet sağladın.'
      },
      {
        id: 'c2',
        label: 'Büyük harfe tahammülümüz yok ceza bitene kadar bekle.',
        replyText: 'Bağırmak yasaktır bekleyeceksin.',
        userReaction: 'Tek kelime yazdık alt tarafı.',
        isCorrect: false,
        hypeDelta: -5,
        sanityDelta: -2,
        actionType: 'dismiss',
        feedback: 'Gereksiz katılık.'
      }
    ]
  },
  {
    id: 'sc_72',
    category: 'Ceza İtirazı',
    subject: 'Karşı taraf başlattı ben sadece kendimi savundum',
    userIssue: 'Berk_06 bana sövdü ben de ona karşılık verdim sadece beni susturdunuz o hala konuşuyor.',
    creatorUsername: 'MagdurSavunucu',
    accusedUsername: 'Berk_06',
    evidenceProvided: true,
    choices: [
      {
        id: 'c1',
        label: 'Loglar incelendi, olayı başlatan Berk_06 da susturuldu.',
        replyText: 'Küfre küfürle karşılık vermek de yasaktır ancak olayı başlatan şahıs da eşit şekilde cezalandırıldı.',
        userReaction: 'En azından adil oldu teşekkürler.',
        isCorrect: true,
        hypeDelta: 4,
        sanityDelta: 2,
        actionType: 'mute_accused',
        feedback: 'Çifte standardı önledin.'
      },
      {
        id: 'c2',
        label: 'Ona ceza vermeyeceğiz sen cezanı çek.',
        replyText: 'Kimi susturacağımızı sana sormayacağız.',
        userReaction: 'Açık açık taraf tutuyorsunuz yazıklar olsun.',
        isCorrect: false,
        hypeDelta: -10,
        sanityDelta: -6,
        actionType: 'dismiss',
        feedback: 'Taraf tuttun, adalet duygusu zedelendi.'
      }
    ]
  },
  {
    id: 'sc_73',
    category: 'Ceza İtirazı',
    subject: 'Mute süresi bittiği halde konuşamıyorum',
    userIssue: '1 saatlik mute cezam bitti ama hala kanallara yazı yazamıyorum rol takılı kaldı sanırım.',
    creatorUsername: 'RolTakilan',
    evidenceProvided: false,
    choices: [
      {
        id: 'c1',
        label: 'Muted rolü manuel olarak kaldırıldı.',
        replyText: 'Bot rol senkronizasyonunda gecikme olmuş, susturulma rolünüz kaldırıldı.',
        userReaction: 'Düzeldi çok teşekkür ederim.',
        isCorrect: true,
        hypeDelta: 3,
        sanityDelta: 1,
        actionType: 'dismiss',
        feedback: 'Hızlı teknik müdahale.'
      },
      {
        id: 'c2',
        label: 'Sunucudan çık gir düzelir.',
        replyText: 'Çık gir yap biz karışamayız.',
        userReaction: 'Çıkarsam tüm rollerim gider yardımcı olun lütfen.',
        isCorrect: false,
        hypeDelta: -6,
        sanityDelta: -3,
        actionType: 'dismiss',
        feedback: 'Başından savdın.'
      }
    ]
  },
  {
    id: 'sc_74',
    category: 'Ceza İtirazı',
    subject: 'Spoiler cezası itirazı',
    userIssue: 'Dün çıkan dizinin fragmanında zaten olan şeyi yazdım spoiler diye 1 gün mute yedim.',
    creatorUsername: 'Dizici_Tolga',
    evidenceProvided: true,
    choices: [
      {
        id: 'c1',
        label: 'Fragman içeriği olduğu doğrulandı, susturma kaldırıldı.',
        replyText: 'İncelendiğinde bilginin resmi fragmanda yer aldığı görüldü. Susturmanız kaldırıldı.',
        userReaction: 'Teşekkürler çok sağolun.',
        isCorrect: true,
        hypeDelta: 4,
        sanityDelta: 2,
        actionType: 'dismiss',
        feedback: 'Haksızlığı giderdin.'
      },
      {
        id: 'c2',
        label: 'Dizi konuşmak komple yasak.',
        replyText: 'Dizi muhabbeti istemiyoruz bekleyeceksin.',
        userReaction: 'Genel sohbet kanalı burası kural uydurmayın.',
        isCorrect: false,
        hypeDelta: -7,
        sanityDelta: -4,
        actionType: 'dismiss',
        feedback: 'Kafana göre kural ürettin.'
      }
    ]
  },
  {
    id: 'sc_75',
    category: 'Ceza İtirazı',
    subject: 'IP çakışması yüzünden haksız ban',
    userIssue: 'Aynı yurtta kaldığımız oda arkadaşım ban yediği için benim hesabım da IP banına takılmış.',
    creatorUsername: 'YurtOgrencisi',
    evidenceProvided: true,
    choices: [
      {
        id: 'c1',
        label: 'Farklı hesap ve cihaz doğrulaması yapılarak ban kaldırıldı.',
        replyText: 'Öğrenci yurdu ortak ağ çakışması doğrulandı. Masum hesabın yasağı kaldırıldı.',
        userReaction: 'Büyük dertten kurtardınız elleriniz dert görmesin.',
        isCorrect: true,
        hypeDelta: 5,
        sanityDelta: 3,
        actionType: 'dismiss',
        feedback: 'Masum kullanıcıyı kurtardın.'
      },
      {
        id: 'c2',
        label: 'Yurttakilere söyle banlatmasalardı.',
        replyText: 'Ortak ağ beni ilgilendirmez.',
        userReaction: 'Elimde olmayan şey yüzünden suçlanıyorum harika sistem.',
        isCorrect: false,
        hypeDelta: -8,
        sanityDelta: -5,
        actionType: 'dismiss',
        feedback: 'Mağduriyeti çözmedin.'
      }
    ]
  },

  // 76-85: Gizlilik & Kişisel Haklar
  {
    id: 'sc_76',
    category: 'Şikayet',
    subject: 'İzinsiz Instagram fotoğrafı paylaşımı',
    userIssue: 'Biri benim özel Instagram hesabımı ve fotoğrafımı genel chatte paylaşıp dalga geçti acil silin.',
    creatorUsername: 'GizlilikMagduru',
    accusedUsername: 'FotocuTroll',
    evidenceProvided: true,
    choices: [
      {
        id: 'c1',
        label: 'Mesajlar anında silindi, şahıs kalıcı olarak banlandı.',
        replyText: 'Kişisel veri ve izinsiz fotoğraf paylaşımı kırmızı çizgimizdir. Mesajlar temizlendi, şahıs banlandı.',
        userReaction: 'Hızınız için minnettarım çok korkmuştum.',
        isCorrect: true,
        hypeDelta: 7,
        sanityDelta: 4,
        actionType: 'ban_accused',
        feedback: 'Kişisel hak ihlalini sertçe önledin.'
      },
      {
        id: 'c2',
        label: 'İnternete koyduysan herkes paylaşır.',
        replyText: 'Halka açık fotoğrafın silinmesine gerek yok.',
        userReaction: 'Özel hesap diyorum dalga geçiyorlar diyorum dava edeceğim sizi.',
        isCorrect: false,
        hypeDelta: -16,
        sanityDelta: -11,
        actionType: 'dismiss',
        feedback: 'Yasal suç teşkil eden durumu savsakladın.'
      }
    ]
  },
  {
    id: 'sc_77',
    category: 'Şikayet',
    subject: 'Reel isim ve soyisim ifşalama',
    userIssue: 'Tartıştığımız kullanıcı sohbette benim açık adımı soyadımı ve oturduğum semti yazdı.',
    creatorUsername: 'DoxxMagduru',
    accusedUsername: 'Doxxcu_Emre',
    evidenceProvided: true,
    choices: [
      {
        id: 'c1',
        label: 'Doxxing nedeniyle mesaj silindi, şahıs kalıcı banlandı.',
        replyText: 'Kişisel bilgileri ifşalamak (doxxing) kesinlikle yasaktır ve suçtur. Şahıs sunucudan atıldı.',
        userReaction: 'Çok sağolun elleriniz dert görmesin.',
        isCorrect: true,
        hypeDelta: 7,
        sanityDelta: 4,
        actionType: 'ban_accused',
        feedback: 'Topluluk güvenliğini sağladın.'
      },
      {
        id: 'c2',
        label: 'Adından utanıyorsan internete girme.',
        replyText: 'Adını yazdıysa ne var bunda.',
        userReaction: 'Adresimi veriyor diyorum dalga geçiyorsunuz.',
        isCorrect: false,
        hypeDelta: -15,
        sanityDelta: -10,
        actionType: 'dismiss',
        feedback: 'Ağır güvenlik zaafiyeti.'
      }
    ]
  },
  {
    id: 'sc_78',
    category: 'Şikayet',
    subject: 'DM üzerinden tehdit ve şantaj',
    userIssue: 'Biri bana özelden oyun hesabımı vermezsem fotoğraflarımı yayacağını söylüyor şantaj yapıyor.',
    creatorUsername: 'SantajMagduru',
    accusedUsername: 'SantajciTehdit',
    evidenceProvided: true,
    choices: [
      {
        id: 'c1',
        label: 'Şantajcı sunucudan uzaklaştırıldı, yasal haklarını araması tavsiye edildi.',
        replyText: 'Şantaj kanıtlandı, kullanıcı kalıcı banlandı. Ekran görüntülerini savcılığa iletmenizi öneririz.',
        userReaction: 'Çok teşekkür ederim banlandığını görmek içimi rahatlattı.',
        isCorrect: true,
        hypeDelta: 6,
        sanityDelta: 3,
        actionType: 'ban_accused',
        feedback: 'Doğru ve sorumlu rehberlik yaptın.'
      },
      {
        id: 'c2',
        label: 'Özel mesaj bizi bağlamaz engelle geç.',
        replyText: 'DM konuşmalarına bakmıyoruz.',
        userReaction: 'Sunucunuzdaki adam bana şantaj yapıyor umrunuzda değil.',
        isCorrect: false,
        hypeDelta: -12,
        sanityDelta: -8,
        actionType: 'dismiss',
        feedback: 'Kullanıcıyı çaresiz bıraktın.'
      }
    ]
  },
  {
    id: 'sc_79',
    category: 'Şikayet',
    subject: 'WhatsApp grubu linki dağıtarak telefon numarası toplama',
    userIssue: 'Sohbette kızlar tanışma grubu diye link atıp milleti WhatsAppa çekip numaralarını yayıyorlar.',
    creatorUsername: 'DikkatliUye',
    accusedUsername: 'NumaraAvcisi',
    evidenceProvided: true,
    choices: [
      {
        id: 'c1',
        label: 'İzinsiz veri toplama ve harici link dağıtımından banlandı.',
        replyText: 'Numara toplama amaçlı harici grup linkleri yasaktır. Mesajlar arındırıldı ve hesap banlandı.',
        userReaction: 'Teşekkürler bir sürü kişi düşecekti.',
        isCorrect: true,
        hypeDelta: 5,
        sanityDelta: 3,
        actionType: 'ban_accused',
        feedback: 'Kişisel veri avcılığını durdurdun.'
      },
      {
        id: 'c2',
        label: 'Girmek isteyen girer serbest.',
        replyText: 'Sosyal medya linki serbesttir.',
        userReaction: 'Dolandırıcı adamlar diyorum numara çalıyorlar.',
        isCorrect: false,
        hypeDelta: -9,
        sanityDelta: -5,
        actionType: 'dismiss',
        feedback: 'İhmalkar davrandın.'
      }
    ]
  },
  {
    id: 'sc_80',
    category: 'Şikayet',
    subject: 'Ses kaydı montajlayıp rezil etme tehdidi',
    userIssue: 'Konuşurken söylediğim kelimeleri kesip biçip komik video yapıp TikToka koymakla tehdit ediyor.',
    creatorUsername: 'KayitMagduru',
    accusedUsername: 'Montajci_Troll',
    evidenceProvided: true,
    choices: [
      {
        id: 'c1',
        label: 'Kullanıcı uyarıldı ve ses odalarından 3 gün uzaklaştırıldı.',
        replyText: 'Üyelerin rızası olmadan seslerini kaydetmek ve montajlamak yasaktır. 3 gün ses yasağı verildi.',
        userReaction: 'Çok sağolun vazgeçer umarım.',
        isCorrect: true,
        hypeDelta: 4,
        sanityDelta: 2,
        actionType: 'mute_accused',
        feedback: 'Zorbalığı engelledin.'
      },
      {
        id: 'c2',
        label: 'Komikse izleriz TikTok linkini atın.',
        replyText: 'Bize de atın gülelim.',
        userReaction: 'Zorbalığa ortak oluyorsunuz.',
        isCorrect: false,
        hypeDelta: -11,
        sanityDelta: -7,
        actionType: 'dismiss',
        feedback: 'Saygınlığını yitirdin.'
      }
    ]
  },
  {
    id: 'sc_81',
    category: 'Şikayet',
    subject: 'Genel chatte uygunsuz içerik ve NSFW görsel',
    userIssue: 'Oyun içi görsel kanalına cinsel içerikli anime resmi attılar çocuklar da var sunucuda.',
    creatorUsername: 'AileBabasi_Mod',
    accusedUsername: 'NsfwPaylasici',
    evidenceProvided: true,
    choices: [
      {
        id: 'c1',
        label: 'Görseller silindi, kullanıcı kalıcı banlandı.',
        replyText: 'Genel kanallarda NSFW ve uygunsuz görsel paylaşımı sıfır tolerans kuralımızdır. Banlandı.',
        userReaction: 'Elinize sağlık anında sildiniz.',
        isCorrect: true,
        hypeDelta: 6,
        sanityDelta: 3,
        actionType: 'ban_accused',
        feedback: 'Sunucu güvenliğini korudun.'
      },
      {
        id: 'c2',
        label: 'Anime çizimdir gerçek insan değil abartmayın.',
        replyText: 'Çizimlere karışmıyoruz.',
        userReaction: 'Sunucuda 13 yaşında çocuklar var şaka mısınız?',
        isCorrect: false,
        hypeDelta: -14,
        sanityDelta: -8,
        actionType: 'dismiss',
        feedback: 'Topluluk standartlarını çiğnedin.'
      }
    ]
  },
  {
    id: 'sc_82',
    category: 'Şikayet',
    subject: 'Sunucu kurallarında açık arayıp trollük yapma',
    userIssue: 'Biri kurallarda yazmıyor diye chate yüzlerce anlamsız nokta ve boşluk atıp sohbeti kaydırıyor.',
    creatorUsername: 'DuzenliUye',
    accusedUsername: 'AcikArayan',
    evidenceProvided: true,
    choices: [
      {
        id: 'c1',
        label: 'Sohbet akışını kasten tıkamaktan 6 saat susturma verildi.',
        replyText: 'Kuralların arkasına sığınıp kasıtlı düzen bozmak yasaktır. 6 saat susturuldu.',
        userReaction: 'Çok haklı karar teşekkürler.',
        isCorrect: true,
        hypeDelta: 4,
        sanityDelta: 2,
        actionType: 'mute_accused',
        feedback: 'İnisiyatif alarak düzeni korudun.'
      },
      {
        id: 'c2',
        label: 'Kurallarda yazmıyorsa ceza veremem serbest.',
        replyText: 'Kurallarda nokta atmak yasak yazmıyor haklı adam.',
        userReaction: 'Bütün chat kilitlendi adam yüzünden.',
        isCorrect: false,
        hypeDelta: -9,
        sanityDelta: -5,
        actionType: 'dismiss',
        feedback: 'Bürokrasiye kurban gittin.'
      }
    ]
  },
  {
    id: 'sc_83',
    category: 'Şikayet',
    subject: 'Eski sevgilisini sunucuda taciz etme',
    userIssue: 'Ayrıldığım eski erkek arkadaşım girdiğim her ses odasına girip bana laf sokuyor ve çıkmıyor.',
    creatorUsername: 'Derya_S',
    accusedUsername: 'TakintiliEski',
    evidenceProvided: true,
    choices: [
      {
        id: 'c1',
        label: 'Sistematik taciz ve huzur bozmaktan kullanıcı banlandı.',
        replyText: 'Üyeleri özel hayat meseleleriyle taciz etmek ve huzursuzluk yaratmak yasaktır. Banlandı.',
        userReaction: 'Çok teşekkür ederim artık rahatça arkadaşlarımla konuşabilirim.',
        isCorrect: true,
        hypeDelta: 6,
        sanityDelta: 3,
        actionType: 'ban_accused',
        feedback: 'Tacizciyi uzaklaştırdın.'
      },
      {
        id: 'c2',
        label: 'Aralarında barışırlar karışmayın.',
        replyText: 'Gençler aranızda halledin.',
        userReaction: 'Adam beni takip ediyor diyorum ne barışması!',
        isCorrect: false,
        hypeDelta: -12,
        sanityDelta: -7,
        actionType: 'dismiss',
        feedback: 'Tacizi hafife aldın.'
      }
    ]
  },
  {
    id: 'sc_84',
    category: 'Şikayet',
    subject: 'Kullanıcının dini ve milli değerlerine küfretme',
    userIssue: 'Tartışırken karşı taraf milli değerlerimize ağır küfürler savurdu loglar ektedir.',
    creatorUsername: 'HassasVatandas',
    accusedUsername: 'HadsizTroll',
    evidenceProvided: true,
    choices: [
      {
        id: 'c1',
        label: 'Nefret söylemi ve ağır hakaretten süresiz uzaklaştırıldı.',
        replyText: 'Toplumsal ve manevi değerlere hakaret sıfır tolerans sebebidir. Şahıs kalıcı banlandı.',
        userReaction: 'Ellerinize sağlık hak ettiği buydu.',
        isCorrect: true,
        hypeDelta: 6,
        sanityDelta: 4,
        actionType: 'ban_accused',
        feedback: 'Toplumsal barışı korudun.'
      },
      {
        id: 'c2',
        label: 'Sinirlenmiştir büyütmeyin 10 dk susturuyorum.',
        replyText: 'Ağır küfür sayılmaz 10 dk susturdum.',
        userReaction: 'Bu küfre 10 dakika mı verdiniz yazıklar olsun.',
        isCorrect: false,
        hypeDelta: -14,
        sanityDelta: -9,
        actionType: 'mute_accused',
        feedback: 'Topluluk infialine sebep oldun.'
      }
    ]
  },
  {
    id: 'sc_85',
    category: 'Şikayet',
    subject: 'Sunucu yetkilisine iftira atma',
    userIssue: 'Biri genel chatte Kaan_Mod rüşvet alıyor para karşılığı ban açıyor diye iftira atıyor.',
    creatorUsername: 'Kaan_Mod',
    accusedUsername: 'Iftiraci_Ali',
    evidenceProvided: true,
    choices: [
      {
        id: 'c1',
        label: 'Kanıtsız iftira ve yönetim karalama nedeniyle 1 gün susturma verildi.',
        replyText: 'Kanıt sunulmaksızın yetkilileri karalamak ve sunucu huzurunu bozmak yasaktır.',
        userReaction: 'Teşekkürler yönetim zan altında kalmaktan kurtuldu.',
        isCorrect: true,
        hypeDelta: 4,
        sanityDelta: 2,
        actionType: 'mute_accused',
        feedback: 'Yetkili kadrosunu savundun.'
      },
      {
        id: 'c2',
        label: 'Belki doğru söylüyordur Kaanı da banlayalım.',
        replyText: 'Kaan sen de mi rüşvet alıyorsun?',
        userReaction: 'Böyle saçmalık görmedim istifa ediyorum.',
        isCorrect: false,
        hypeDelta: -15,
        sanityDelta: -10,
        actionType: 'dismiss',
        feedback: 'Kendi moderatörünü sattın, ekip dağıldı.'
      }
    ]
  },

  // 86-95: Sunucu Düzeni & Kanal Suistimali
  {
    id: 'sc_86',
    category: 'Genel',
    subject: 'Oyun arama kanalında alakasız sohbet',
    userIssue: 'Oyun arkadaşı bulma kanalında iki kişi yemek tarifi konuşuyor ilanımız kayboldu.',
    creatorUsername: 'OyunArayan_TR',
    accusedUsername: 'Sohbetci_Cem',
    evidenceProvided: true,
    choices: [
      {
        id: 'c1',
        label: 'Mesajlar genel sohbete yönlendirildi ve kanal temizlendi.',
        replyText: 'Kanal amacı dışı kullanım için uyarıldı, lütfen sohbeti genel-sohbete taşıyın.',
        userReaction: 'Teşekkürler şimdi rahatça takım kurabiliriz.',
        isCorrect: true,
        hypeDelta: 3,
        sanityDelta: 1,
        actionType: 'warn_user',
        feedback: 'Kanal düzenini sağladın.'
      },
      {
        id: 'c2',
        label: 'Yemek tarifi konuşanları kalıcı banla.',
        replyText: 'Yemek konuştuğunuz için banlandınız.',
        userReaction: 'Yuh alt tarafı lahmacun konuştuk direkt ban mı?',
        isCorrect: false,
        hypeDelta: -9,
        sanityDelta: -4,
        actionType: 'ban_accused',
        feedback: 'Orantısız tepki gösterdin.'
      }
    ]
  },
  {
    id: 'sc_87',
    category: 'Genel',
    subject: 'Sürekli herkesi etiketleyip soru sorma',
    userIssue: 'Her yazdığı mesajda @here atıp valorant gelecek var mı diye soruyor bildirim yağdı.',
    creatorUsername: 'RahatsizUye',
    accusedUsername: 'Hereci_Berk',
    evidenceProvided: true,
    choices: [
      {
        id: 'c1',
        label: 'Kullanıcının etiket yetkisi kapatıldı ve 2 saat susturuldu.',
        replyText: 'Gereksiz toplu etiket atmak yasaktır. 2 saat susturma uygulandı.',
        userReaction: 'Telefonum titremekten patlamıştı çok sağolun.',
        isCorrect: true,
        hypeDelta: 4,
        sanityDelta: 2,
        actionType: 'mute_accused',
        feedback: 'Bildirim terörünü kestin.'
      },
      {
        id: 'c2',
        label: 'Bildirimleri kapatabilirsin beni ilgilendirmez.',
        replyText: 'Sunucuyu sessize alın.',
        userReaction: 'Neden yetki verdiniz o zaman adama?',
        isCorrect: false,
        hypeDelta: -8,
        sanityDelta: -5,
        actionType: 'dismiss',
        feedback: 'Üye konforunu hiçe saydın.'
      }
    ]
  },
  {
    id: 'sc_88',
    category: 'Genel',
    subject: 'Spoiler uyarısı vermeden film sonunu yazma',
    userIssue: 'Genel chate dün vizyona giren filmin katilini pat diye yazdı hevesimiz kursağımızda kaldı.',
    creatorUsername: 'Sinemasever_Ali',
    accusedUsername: 'SpoilerciTroll',
    evidenceProvided: true,
    choices: [
      {
        id: 'c1',
        label: 'Mesaj spoiler etiketiyle gizlendi ve kullanıcı 1 gün susturuldu.',
        replyText: 'Yeni çıkan yapımlarla ilgili izinsiz spoiler vermek yasaktır. 24 saat susturuldu.',
        userReaction: 'Filmi izleyemedik ama en azından ceza aldı sağolun.',
        isCorrect: true,
        hypeDelta: 4,
        sanityDelta: 2,
        actionType: 'mute_accused',
        feedback: 'Topluluk keyfini korudun.'
      },
      {
        id: 'c2',
        label: 'Filme gitseydin dün bana ne.',
        replyText: 'Hemen izleseydin sen de.',
        userReaction: 'Dün vizyona girdi daha nasıl izleyeyim?',
        isCorrect: false,
        hypeDelta: -7,
        sanityDelta: -4,
        actionType: 'dismiss',
        feedback: 'Saygısızlığı savundun.'
      }
    ]
  },
  {
    id: 'sc_89',
    category: 'Teknik Destek',
    subject: 'Müzik botunun takılması ve durdurulamaması',
    userIssue: 'Müzik botu döngüye girdi aynı şarkıyı 5 saattir çalıyor komutları dinlemiyor.',
    creatorUsername: 'MuzikSever',
    evidenceProvided: false,
    choices: [
      {
        id: 'c1',
        label: 'Bot sıfırlandı ve ses odasından çıkarılıp yeniden bağlandı.',
        replyText: 'Müzik botunun önbelleği temizlendi ve sistem yeniden başlatıldı.',
        userReaction: 'Sonunda durdu teşekkürler.',
        isCorrect: true,
        hypeDelta: 3,
        sanityDelta: 2,
        actionType: 'dismiss',
        feedback: 'Bot bugını çözdün.'
      },
      {
        id: 'c2',
        label: 'Şarkı güzelse dinleyin.',
        replyText: 'Şarkı fena değil bence çalsın.',
        userReaction: '5 saattir aynı nakarat kafayı yedik.',
        isCorrect: false,
        hypeDelta: -6,
        sanityDelta: -3,
        actionType: 'dismiss',
        feedback: 'Şikayeti alaya aldın.'
      }
    ]
  },
  {
    id: 'sc_90',
    category: 'Genel',
    subject: 'Genel sohbette bot komutları spami',
    userIssue: 'Bot-komut kanalı varken genel sohbette üst üste 20 tane kumar ve para komutu yazıyor.',
    creatorUsername: 'DuzenAşıgı',
    accusedUsername: 'Komutcu_Berk',
    evidenceProvided: true,
    choices: [
      {
        id: 'c1',
        label: 'Komutlar temizlendi ve bot komut kanalına yönlendirilip uyarıldı.',
        replyText: 'Bot komutlarının genel chate yazılması yasaktır. Lütfen komut kanalını kullanın.',
        userReaction: 'Elinize sağlık chat temizlendi.',
        isCorrect: true,
        hypeDelta: 3,
        sanityDelta: 1,
        actionType: 'warn_user',
        feedback: 'Doğru kanal akışını korudun.'
      },
      {
        id: 'c2',
        label: 'Komut yazan adamı direk perma banla.',
        replyText: 'Komut yazdığı için banlandı.',
        userReaction: 'Alt tarafı bot komutu yazdı ban çok ağır oldu.',
        isCorrect: false,
        hypeDelta: -8,
        sanityDelta: -4,
        actionType: 'ban_accused',
        feedback: 'Orantısız şiddet uyguladın.'
      }
    ]
  },
  {
    id: 'sc_91',
    category: 'Şikayet',
    subject: 'Özelden sunucu davet linki spamlamak',
    userIssue: 'Sunucuya yeni katılan biri tüm üyelere özelden kendi yeni açtığı sunucunun linkini atıyor.',
    creatorUsername: 'SadikUye_07',
    accusedUsername: 'ReklamciKurt',
    evidenceProvided: true,
    choices: [
      {
        id: 'c1',
        label: 'DM reklamı nedeniyle kullanıcı kalıcı uzaklaştırıldı.',
        replyText: 'Üyelerimize özel mesaj yoluyla reklam yapmak yasaktır. Reklam hesabı banlandı.',
        userReaction: 'Teşekkürler sunucudan üye çekmeye çalışıyordu.',
        isCorrect: true,
        hypeDelta: 5,
        sanityDelta: 3,
        actionType: 'ban_accused',
        feedback: 'Sunucu kitleni korudun.'
      },
      {
        id: 'c2',
        label: 'Biz de onun sunucusuna gidip reklam yapalım.',
        replyText: 'Onun linkine girip bizim reklamı atın.',
        userReaction: 'Çocukça taktiklerle sunucu yönetiyorsunuz.',
        isCorrect: false,
        hypeDelta: -10,
        sanityDelta: -6,
        actionType: 'dismiss',
        feedback: 'Vizyonsuz hamle yaptın.'
      }
    ]
  },
  {
    id: 'sc_92',
    category: 'Genel',
    subject: 'İkinci el ekran kartı satışı ilanı',
    userIssue: 'Genel sohbette RTX 3060 satıyorum 7000 TL diye pazarlık yapıyor sohbet kaynadı.',
    creatorUsername: 'Oyuncu_Ahmet',
    accusedUsername: 'Pazarlikci_Veli',
    evidenceProvided: true,
    choices: [
      {
        id: 'c1',
        label: 'Mesajlar silindi ve ticaret kanalına yönlendirildi.',
        replyText: 'Genel sohbette ürün satışı ve pazarlık yasaktır. Mesaj silindi, kullanıcı uyarıldı.',
        userReaction: 'Teşekkürler genel chat rahatladı.',
        isCorrect: true,
        hypeDelta: 3,
        sanityDelta: 1,
        actionType: 'warn_user',
        feedback: 'Kanal hijyenini sağladın.'
      },
      {
        id: 'c2',
        label: 'Kart temizse bana sat.',
        replyText: 'Fiyat iyiymiş ben alayım.',
        userReaction: 'Admin pazarlığa dahil oldu şaka gibi.',
        isCorrect: false,
        hypeDelta: -7,
        sanityDelta: -3,
        actionType: 'dismiss',
        feedback: 'Profesyonelliği bozdun.'
      }
    ]
  },
  {
    id: 'sc_93',
    category: 'Şikayet',
    subject: 'Ölü taklidi yapıp milleti telaşlandırma',
    userIssue: 'Sohbette bileğimi kestim ambulans çağırın yazıp 2 saat cevap vermedi sonra şaka yaptım dedi.',
    creatorUsername: 'Telasli_Uye',
    accusedUsername: 'KaranlikTroll',
    evidenceProvided: true,
    choices: [
      {
        id: 'c1',
        label: 'Ağır duygusal manipülasyon ve trollükten 3 gün sunucudan men edildi.',
        replyText: 'İntihar ve kendine zarar verme şakaları kesinlikle tolere edilmez. 3 gün uzaklaştırıldı.',
        userReaction: 'Polisi arayacaktık az kalsın çok iyi yaptınız.',
        isCorrect: true,
        hypeDelta: 5,
        sanityDelta: 3,
        actionType: 'mute_accused',
        feedback: 'Sınırları net çizdin.'
      },
      {
        id: 'c2',
        label: 'Kara mizah yapmış gülün geçin.',
        replyText: 'Mizahtan anlamıyorsunuz.',
        userReaction: 'Bunun neresi mizah hasta mısınız?',
        isCorrect: false,
        hypeDelta: -12,
        sanityDelta: -8,
        actionType: 'dismiss',
        feedback: 'Ciddi krizi alaya aldın.'
      }
    ]
  },
  {
    id: 'sc_94',
    category: 'Genel',
    subject: 'Kullanıcı adı ve profilinde küfürlü ifade',
    userIssue: 'Sunucuya katılan yeni üyenin kullanıcı adı ve hakkında kısmı ağır küfür dolu.',
    creatorUsername: 'Duyarli_Uye2',
    accusedUsername: 'KufurluNick_31',
    evidenceProvided: true,
    choices: [
      {
        id: 'c1',
        label: 'Kullanıcı adı moderatör tarafından sıfırlandı ve uyarıldı.',
        replyText: 'Uygunsuz kullanıcı adı Üye_4812 olarak değiştirildi ve profilini düzeltmesi istendi.',
        userReaction: 'Çok teşekkürler göz zevkimiz bozulmuştu.',
        isCorrect: true,
        hypeDelta: 4,
        sanityDelta: 2,
        actionType: 'warn_user',
        feedback: 'Profil temizliği yapıldı.'
      },
      {
        id: 'c2',
        label: 'Kullanıcı adına karışamayız istediğini koyar.',
        replyText: 'İsmine karışamayız serbest.',
        userReaction: 'Genel chate her yazdığında gözümüze sokuluyor ama.',
        isCorrect: false,
        hypeDelta: -6,
        sanityDelta: -3,
        actionType: 'dismiss',
        feedback: 'Kaliteyi düşürdün.'
      }
    ]
  },
  {
    id: 'sc_95',
    category: 'Teknik Destek',
    subject: 'Kanalların izinlerinin bozulması',
    userIssue: 'Normal üyeler yetkili duyuru kanalına mesaj yazabiliyor kilit kalkmış acil bakın.',
    creatorUsername: 'Uyanik_Mod',
    evidenceProvided: true,
    choices: [
      {
        id: 'c1',
        label: 'Kanal izinleri yeniden yapılandırıldı ve kilitlendi.',
        replyText: 'Duyuru kanalı mesaj gönderme izinleri everyone için kapatıldı. Bildirim için teşekkürler.',
        userReaction: 'Düzeltildi elinize sağlık.',
        isCorrect: true,
        hypeDelta: 4,
        sanityDelta: 2,
        actionType: 'dismiss',
        feedback: 'Yetki sızıntısını kapattın.'
      },
      {
        id: 'c2',
        label: 'Yazsınlar ne olacak duyuruyu tartışırlar.',
        replyText: 'Bırakın yazsınlar serbest.',
        userReaction: 'Duyurular spam doldu kimse resmi mesajı göremiyor.',
        isCorrect: false,
        hypeDelta: -8,
        sanityDelta: -4,
        actionType: 'dismiss',
        feedback: 'Sunucu ciddiyeti bozuldu.'
      }
    ]
  },

  // 96-105: Etkinlikler, Ödüller & Özel Durumlar
  {
    id: 'sc_96',
    category: 'Şikayet',
    subject: 'Çekiliş ödülünü teslim etmeyen çekiliş sahibi',
    userIssue: 'Sunucu üyesi Zengin_Balina Discord Nitro çekilişi yaptı ben kazandım ama vermiyor engelledi.',
    creatorUsername: 'Kazanan_Fakir',
    accusedUsername: 'Zengin_Balina',
    evidenceProvided: true,
    choices: [
      {
        id: 'c1',
        label: 'Sahte çekiliş ve kural ihlalinden şahsa yaptırım uygulandı, ödül telafi edildi.',
        replyText: 'Kanıtlar doğrulandı. Sahte çekiliş düzenleyen kullanıcı uyarıldı ve çekiliş düzenleme yetkisi alındı.',
        userReaction: 'İlgilendiğiniz için çok teşekkürler.',
        isCorrect: true,
        hypeDelta: 5,
        sanityDelta: 3,
        actionType: 'warn_user',
        feedback: 'Çekiliş dolandırıcılığını cezalandırdın.'
      },
      {
        id: 'c2',
        label: 'Kendi cebinden yapıyordu zorla verdiremeyiz.',
        replyText: 'Kendi rızasıyla yapıyordu karışamayız.',
        userReaction: 'Sunucuda prim kastı herkesi takip ettirdi şimdi vermiyor.',
        isCorrect: false,
        hypeDelta: -10,
        sanityDelta: -6,
        actionType: 'dismiss',
        feedback: 'Etkinlik güvenini sıfırladın.'
      }
    ]
  },
  {
    id: 'sc_97',
    category: 'Genel',
    subject: 'Sunucuya sponsorluk teklifi',
    userIssue: 'Bir enerji içeceği firmasında çalışıyorum sunucunuza sponsor olup ödüllü turnuva yapmak istiyoruz.',
    creatorUsername: 'Sponsor_Temsilcisi',
    evidenceProvided: true,
    choices: [
      {
        id: 'c1',
        label: 'Teklif detayları incelendi ve yönetim kurulu görüşmesine alındı.',
        replyText: 'Teklifiniz için teşekkür ederiz. İletişim bilgilerinizi aldık, iş birliği için özelden iletişime geçildi.',
        userReaction: 'Mailinizi bekliyoruz iyi çalışmalar.',
        isCorrect: true,
        hypeDelta: 8,
        sanityDelta: 3,
        moneyDelta: 300,
        actionType: 'dismiss',
        feedback: 'Sunucuya büyük gelir ve hype kazandırdın.'
      },
      {
        id: 'c2',
        label: 'Bize bedava içecek yollarsanız düşünürüz.',
        replyText: 'Önce bana iki koli içecek yollayın.',
        userReaction: 'Çok gayriciddi bir yaklaşımla karşılaştık teklifimizi geri çekiyoruz.',
        isCorrect: false,
        hypeDelta: -12,
        sanityDelta: -5,
        actionType: 'dismiss',
        feedback: 'Büyük sponsorluğu kaçırdın.'
      }
    ]
  },
  {
    id: 'sc_98',
    category: 'Genel',
    subject: 'Gece saatinde gereksiz açılan acil durum ticketı',
    userIssue: 'Saat gece 4te acil yardım başlığıyla ticket açtım admin uyudun mu kankam?',
    creatorUsername: 'GeceTrollu_Ali',
    evidenceProvided: false,
    choices: [
      {
        id: 'c1',
        label: 'Gereksiz ticket açmaktan 1 saat metin susturması verildi.',
        replyText: 'Destek kanallarını meşgul etmek ve yetkilileri gereksiz rahatsız etmek yasaktır. Ticket kapatıldı.',
        userReaction: 'Tamam abi şaka yapmıştım kusura bakma.',
        isCorrect: true,
        hypeDelta: 2,
        sanityDelta: 2,
        actionType: 'warn_user',
        feedback: 'Gereksiz meşguliyeti engelledin.'
      },
      {
        id: 'c2',
        label: 'Uyumadım kanka gel CS atak.',
        replyText: 'Gel girelim discordda ne işimiz var.',
        userReaction: 'Kral admin be.',
        isCorrect: false,
        hypeDelta: -5,
        sanityDelta: -3,
        actionType: 'dismiss',
        feedback: 'Ciddiyetini bozdun, diğer ticketlar birikti.'
      }
    ]
  },
  {
    id: 'sc_99',
    category: 'Genel',
    subject: 'Klan savaşı meydan okuması',
    userIssue: 'Rakip sunucunun klanıyız cumartesi akşamı 5v5 Valorant klan savaşına var mısınız?',
    creatorUsername: 'RakipKlanLideri',
    evidenceProvided: true,
    choices: [
      {
        id: 'c1',
        label: 'Meydan okuma kabul edildi ve etkinlik duyurusu hazırlandı.',
        replyText: 'Meydan okumanız kabul edildi. Kurallar ve maç saati etkinlik kanalında duyurulacaktır.',
        userReaction: 'Görüşürüz sahada iyi olan kazansın.',
        isCorrect: true,
        hypeDelta: 10,
        sanityDelta: 3,
        actionType: 'dismiss',
        feedback: 'Sunucuya büyük heyecan ve izlenme dalgası getirdin.'
      },
      {
        id: 'c2',
        label: 'Bizim seviyemizde değilsiniz ezikler.',
        replyText: 'Siz kimsiniz bizimle oynayacaksınız.',
        userReaction: 'Korktunuz yani anlaşıldı reziller.',
        isCorrect: false,
        hypeDelta: -10,
        sanityDelta: -5,
        actionType: 'dismiss',
        feedback: 'Korkak damgası yediniz.'
      }
    ]
  },
  {
    id: 'sc_100',
    category: 'Teknik Destek',
    subject: 'Yayın odasında ekran paylaşımı kasma sorunu',
    userIssue: 'Sunucu ses odasında ekran paylaşınca FPS 10a düşüyor sunucu bölgesi mi bozuk?',
    creatorUsername: 'YayinSever',
    evidenceProvided: false,
    choices: [
      {
        id: 'c1',
        label: 'Sunucu ses bölgesi optimize edildi (Rotterdam -> Frankfurt).',
        replyText: 'Ses sunucusu bölgesi optimize edildi, donanım ivmesini kontrol etmeniz tavsiye edildi.',
        userReaction: 'Akıcı oldu harika elinize sağlık.',
        isCorrect: true,
        hypeDelta: 4,
        sanityDelta: 2,
        actionType: 'dismiss',
        feedback: 'Altyapı sorununu çözdün.'
      },
      {
        id: 'c2',
        label: 'Bilgisayarın çöp değiştir.',
        replyText: 'Tost makinesiyle yayın açma.',
        userReaction: 'Sistemim RTX 4070 terbiyesizlik yapmayın.',
        isCorrect: false,
        hypeDelta: -8,
        sanityDelta: -4,
        actionType: 'dismiss',
        feedback: 'Kullanıcıyı haksız yere aşağıladın.'
      }
    ]
  },
  {
    id: 'sc_101',
    category: 'Genel',
    subject: 'Sunucuya yeni bot önerisi',
    userIssue: 'Sunucuya anime trivia bilgi yarışması botu ekler misiniz çok eğlenceli olur?',
    creatorUsername: 'AnimeSever_Batu',
    evidenceProvided: true,
    choices: [
      {
        id: 'c1',
        label: 'Öneri değerlendirmeye alındı ve test kanalına kuruldu.',
        replyText: 'Fikriniz için teşekkürler! Bot güvenlik testlerinden geçtikten sonra etkinleştirilecektir.',
        userReaction: 'Harikasınız sabırsızlıkla bekliyorum.',
        isCorrect: true,
        hypeDelta: 4,
        sanityDelta: 2,
        actionType: 'dismiss',
        feedback: 'Topluluk talebine değer verdin.'
      },
      {
        id: 'c2',
        label: 'Animeci botu falan kurmayız kapatıyorum.',
        replyText: 'Biz animeci değiliz.',
        userReaction: 'Sadece öneri sunduk ne bu nefret.',
        isCorrect: false,
        hypeDelta: -6,
        sanityDelta: -3,
        actionType: 'dismiss',
        feedback: 'Kullanıcıyı tersledin.'
      }
    ]
  },
  {
    id: 'sc_102',
    category: 'Şikayet',
    subject: 'Kullanıcının sürekli ticket açıp kapatması',
    userIssue: 'Bugün üst üste 5 kere ticket açıp bir şey demeden kapatan biri var loglarda.',
    creatorUsername: 'SistemTakipcisi',
    accusedUsername: 'Spamci_Velet',
    evidenceProvided: true,
    choices: [
      {
        id: 'c1',
        label: 'Destek sistemini meşgul etmekten 1 gün ticket yasağı verildi.',
        replyText: 'Ticket sistemini kasten meşgul etmek yasaktır. 24 saat ticket açma yasağı uygulandı.',
        userReaction: 'Teşekkürler kuyruk rahatladı.',
        isCorrect: true,
        hypeDelta: 4,
        sanityDelta: 2,
        actionType: 'warn_user',
        feedback: 'Sistem suistimalini önledin.'
      },
      {
        id: 'c2',
        label: 'Açsın ne olacak canı sıkılmıştır.',
        replyText: 'Karışmayın canı isterse açar.',
        userReaction: 'Gerçekten yardıma ihtiyacı olanlar bekliyor ama.',
        isCorrect: false,
        hypeDelta: -7,
        sanityDelta: -4,
        actionType: 'dismiss',
        feedback: 'Hizmet kalitesini düşürdün.'
      }
    ]
  },
  {
    id: 'sc_103',
    category: 'Genel',
    subject: 'Sunucu kurallarını okumadan genel sohbette kavga etme',
    userIssue: 'Biri gelmiş küfür serbest değil miydi burası ne biçim yer diye millete sarıyor.',
    creatorUsername: 'SakinUye',
    accusedUsername: 'KuralTanımaz',
    evidenceProvided: true,
    choices: [
      {
        id: 'c1',
        label: 'Kurallar hatırlatıldı ve 3 saat susturma verildi.',
        replyText: 'Sunucuya katılan her üye kuralları kabul etmiş sayılır. 3 saat susturma uygulandı.',
        userReaction: 'Teşekkürler ortam yatıştı.',
        isCorrect: true,
        hypeDelta: 4,
        sanityDelta: 2,
        actionType: 'mute_accused',
        feedback: 'Otoriteyi hissettirdin.'
      },
      {
        id: 'c2',
        label: 'Küfür serbest olsun herkes rahatlasın.',
        replyText: 'Küfürü serbest bıraktım dilediğiniz gibi sövün.',
        userReaction: 'Bütün sunucu küfür kıyamet oldu herkes kaçıyor.',
        isCorrect: false,
        hypeDelta: -18,
        sanityDelta: -12,
        actionType: 'dismiss',
        feedback: 'Sunucuyu anarşiye sürükledin.'
      }
    ]
  },
  {
    id: 'sc_104',
    category: 'Yetki & Rol',
    subject: 'VIP üyelik iade talebi',
    userIssue: 'Dün VIP Balina aldım ama beğenmedim paramı iade eder misiniz?',
    creatorUsername: 'KararsizBalina',
    evidenceProvided: true,
    choices: [
      {
        id: 'c1',
        label: 'Dijital ürünlerde keyfi iade yapılamayacağı nazikçe açıklandı.',
        replyText: 'Dijital rol teslimatlarında kullanım sonrası iade politikamız bulunmamaktadır. Anlayışınız için teşekkür ederiz.',
        userReaction: 'Anladım sağlık olsun ayrıcalıkları kullanırım o zaman.',
        isCorrect: true,
        hypeDelta: 3,
        sanityDelta: 1,
        actionType: 'dismiss',
        feedback: 'Mali politikayı korudun.'
      },
      {
        id: 'c2',
        label: 'İade falan yok defol sunucudan banlıyorum.',
        replyText: 'Para gitti ağlama banlandın.',
        userReaction: 'Müşteriye böyle mi davranılır haram olsun.',
        isCorrect: false,
        hypeDelta: -12,
        sanityDelta: -6,
        actionType: 'ban_accused',
        feedback: 'Müşteriyi gasp edip kovdun.'
      }
    ]
  },
  {
    id: 'sc_105',
    category: 'Genel',
    subject: 'Sunucuya 100 kişi getirdim ödülüm ne?',
    userIssue: 'Özel davet linkimle tam 100 aktif kullanıcı getirdim davet yarışması ödülümü istiyorum.',
    creatorUsername: 'DavetciKral_99',
    evidenceProvided: true,
    choices: [
      {
        id: 'c1',
        label: 'Davet logları onaylandı, Kıdemli Üye ve özel ödül teslim edildi.',
        replyText: 'Davetleriniz incelendi ve gerçek kullanıcılar olduğu onaylandı. Teşekkür ederiz ödülünüz verildi.',
        userReaction: 'Harikasınız daha da çok arkadaşımı getireceğim.',
        isCorrect: true,
        hypeDelta: 10,
        sanityDelta: 4,
        actionType: 'grant_role',
        feedback: 'Sunucu büyümesini ödüllendirdin, kitle patladı.'
      },
      {
        id: 'c2',
        label: 'Bunların hepsi senin yan hesabındır sahtekar.',
        replyText: 'Bot basmışsın hiçbir şey vermiyorum.',
        userReaction: 'Hepsi okuldan gerçek arkadaşlarım emeğimi hiçe saydınız.',
        isCorrect: false,
        hypeDelta: -11,
        sanityDelta: -6,
        actionType: 'dismiss',
        feedback: 'Büyüme motorunu kırdın.'
      }
    ]
  }
]
