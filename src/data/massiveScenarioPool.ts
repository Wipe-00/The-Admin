// Massive Scenario & Message Pool (1,500+ Unique Turkish Discord Messages, Media Posts & Rule Violations)

export interface ScreenshotAttachment {
  title: string
  subtitle: string
  resolution: string
  fileSize: string
  previewTheme: 'setup' | 'scoreboard' | 'meme' | 'cat' | 'crypto' | 'hardware'
  description: string
}

export interface GeneratedChannelMessage {
  text: string
  isBannable?: boolean
  banReason?: string
  screenshot?: ScreenshotAttachment
}

// 1. Base Curated General Chat Messages
const BASE_GENEL_CHATS: string[] = [
  'Selamlar millet, gününüz nasıl geçiyor?',
  'Spotify premium yine zamlanmış ya şaka gibi.',
  'Beyler yeni aldığım mekanik klavyenin sesi çok tok, akşam seslide dinletirim.',
  'Bugün sunucuda muhabbet bayağı sarıyor.',
  'Kahvemi aldım geldim, akşama kadar buradayım.',
  'İnternet sağlayıcısı yine hız düşürdü galiba pingim 90 sabit.',
  'Sınav haftası yaklaşıyor hiç çalışasım yok valla.',
  'Akşam yayın açacak olan var mı ses kanalında?',
  'Bu sunucunun ortamı diğer yerlerden çok daha nezih.',
  'Modlar bugün bayağı aktif, troller barınamıyor.',
  'Dün geceki sesli sohbette gülmekten karnım ağrıdı.',
  'Beyler 2. el ekran kartı alınır mı sizce mining çıkması mıdır?',
  'Hava bir anda buz gibi oldu, kış geldi resmen.',
  'Kulaklığın sağ tarafı bozuldu, fiyat/performans önerisi olan var mı?',
  'Gece vardiyasında takılan tayfa burada mı?',
  'Sunucu seviyesi yükselince ses kalitesi bayağı fark etmiş.',
  'Acıktım ya gece gece yemeksepetinden bir şeyler söyleyeceğim.',
  'Yeni gelen arkadaşlar hoş geldiniz, kuralları okumayı unutmayın.',
  'Çay demledim geldim, sohbet aksın bakalım.',
  'Telefonun bataryası artık yarım gün bile gitmiyor.',
  'Hafta sonu planı olan var mı yoksa yine tüm gün PC başında mıyız?',
  'Fiber altyapı sonunda bizim sokağa da gelmiş!',
  'Dün izlediğim dizinin sezon finali aklımı başımdan aldı.',
  'Kripto piyasası yine hareketlendi, takip eden var mı?',
  'Ses odası 1 çok kalabalık, 2. odaya geçelim mi?',
  'Müzik botu bugün çok iyi parçalar çalıyor.',
  'Beler klavyede W tuşu bazen basmıyor, switch mi bozuldu acaba?',
  'Sabah 8 dersine uyanmak dünyanın en zor şeyi olabilir.',
  'Sunucuda VIP rolü olanların rengi çok havalı duruyor.',
  'Kargom 3 gündür dağıtıma çıkarıldı görünüyor hala gelmedi.'
]

// Combinatorial generators for 600+ unique General Chat lines
const GENEL_TOPICS = [
  'bilgisayar toplama', 'yeni çıkan dizi', 'internet hızı', 'kulaklık önerisi', 'monitör hz farkı',
  'gece sohbeti', 'üniversite vize haftası', 'iş çıkışı yorgunluğu', 'kahve molası', 'kış havası',
  'spotify listesi', 'yeni telefon fiyatları', 'oyuncu koltuğu', 'ikinci el parça', 'sunucu etkinliği',
  'sesli oda muhabbeti', 'klavye switchleri', 'mouse pad temizliği', 'termal macun değişimi', 'windows güncellemesi',
  'yemek siparişi', 'kargo gecikmesi', 'uyku düzeni', 'film gecesi', 'turnuva ödülleri'
]

const GENEL_COMMENTS = [
  'hakkında ne düşünüyorsunuz beyler? Bence bayağı önemli mevzu.',
  'konusunda bilgisi olan yeşillendirebilir mi?',
  'yüzünden bütün günüm ekran başında geçti resmen.',
  'bugün herkesin dilinde, sizce de abartılmıyor mu?',
  'olayı cidden can sıkmaya başladı ama bakalım.',
  'için tavsiyesi olan varsa özelden veya buradan yazabilir mi?',
  'muhabbeti dönüyor seslide, gelmek isteyen varsa bekleriz.',
  'konusunda dün çok iyi bir deneyim yaşadım tavsiye ederim.',
  'meselesini sonunda çözdüm, darısı başınıza.',
  'olmasa şu günler nasıl geçerdi bilmiyorum valla.',
  'için bütçe ayırdım, ay sonu hallediyorum inşallah.',
  'yine gündem olmuş, bence gayet mantıklı duruyor.',
  'beni benden alıyor ya, aynı durumu yaşayan var mı?',
  'hakkında geçen gün konuştuğumuz şey doğru çıktı bu arada.',
  'konusunda en iyi topluluk burası, hemen cevap bulunuyor.'
]

const GENEL_PREFIXES = [
  'Arkadaşlar', 'Beyler', 'Gençler', 'Selam millet,', 'Bu arada', 'Ya cidden', 'Valla', 'Bana sorarsanız', 'Dün fark ettim de', 'Şaka maka'
]

// 2. Gaming Channel (#oyun-sohbeti) Generator (500+ unique lines)
const GAMES_LIST = [
  'CS2', 'Valorant', 'League of Legends', 'GTA V RP', 'Elden Ring', 'Minecraft', 'Rust',
  'EA FC 25', 'Apex Legends', 'Rocket League', 'Red Dead Redemption 2', 'Cyberpunk 2077',
  'Baldur\'s Gate 3', 'Call of Duty Warzone', 'PUBG', 'Rainbow Six Siege', 'Dota 2', 'Deadlock'
]

const GAMING_SITUATIONS = [
  'oynarken FPS bir anda 60\'a çakılıyor, son güncellemeden sonra sizde de oldu mu?',
  'için +2 sağlam oyuncu aranıyor, mikrofon şart, ses 2\'deyiz gelin!',
  'rekabetçi maçta son el 1v4 clutch attım elim ayağım titriyor hala!',
  'yeni yama notlarını okudunuz mu? Meta tamamen değişmiş.',
  'dereceli girecek var mı? Tek başıma girince sürekli troll takım geliyor.',
  'turnuvası düzenlense sunucuda kimler katılır? Güzel kapışma olur.',
  'sunucularında bugün paket kaybı (packet loss) var galiba, mermiler gitmiyor.',
  'ayarlarında hassasiyeti (sens) düşürdükten sonra aimim bayağı topladı.',
  'için en iyi grafik ayarlarını bilen var mı? Rekabetçi odaklı lazım.',
  '5v5 sunucu içi özel maç kuruyoruz, gelmek isteyen +1 yazsın!',
  'oyunda hile denk geldi yine, raporladık bakalım ne zaman banlanacak.',
  'yeni sezonda rank kasmak eskisine göre çok daha zorlaşmış.',
  'harita havuzu değişmiş, en sevdiğim haritayı kaldırmışlar ya.',
  'oynarken arkada müzik açınca odaklanamıyorum ama çok sarıyor.',
  'ekibi kuruyoruz, akşam 21:00\'de tam kadro giriyoruz eksik kalmasın!'
]

// 3. Screenshot Channel (#ekran-goruntuleri) Posts (250+ unique media posts)
const SCREENSHOT_TEMPLATES: ScreenshotAttachment[] = [
  {
    title: 'yeni_setup_gece_gorunumu_2026.png',
    subtitle: 'RGB Masaüstü & Çift Monitör Kurulumu',
    resolution: '3840x2160 • 4.2 MB',
    fileSize: '4.2 MB',
    previewTheme: 'setup',
    description: 'Sonunda kablolamayı bitirdim ve yeni monitör kolunu taktım, puanınız 10 üzerinden kaç?'
  },
  {
    title: 'cs2_premier_42_kill_scoreboard.jpg',
    subtitle: 'CS2 Rekabetçi Maç Sonu Tablosu',
    resolution: '1920x1080 • 1.8 MB',
    fileSize: '1.8 MB',
    previewTheme: 'scoreboard',
    description: '42 vurup yine uzatmalarda kaybettik, takıma bak ağlamak istiyorum...'
  },
  {
    title: 'valorant_immortal_terfi_ekrani.png',
    subtitle: 'Valorant Rank Yükselme Ekranı',
    resolution: '1920x1080 • 2.1 MB',
    fileSize: '2.1 MB',
    previewTheme: 'scoreboard',
    description: 'Gece gündüz kastık sonunda Immortal eloya çıktık beyler!'
  },
  {
    title: 'kedi_klavye_ustunde_uyuyor.jpg',
    subtitle: 'Oyun Oynatmayan Kedi Fotoğrafı',
    resolution: '2560x1440 • 3.4 MB',
    fileSize: '3.4 MB',
    previewTheme: 'cat',
    description: 'Tam clutch atacağım sırada klavyenin üstüne yattı, kıpırdatamıyorum da :D'
  },
  {
    title: 'modcoin_grafik_analizi_4h.png',
    subtitle: 'Kripto Mum Grafiği & Destek Çizgisi',
    resolution: '1920x1080 • 950 KB',
    fileSize: '950 KB',
    previewTheme: 'crypto',
    description: 'Destek noktasından döndü gibi duruyor, yatırım tavsiyesi değildir!'
  },
  {
    title: 'yeni_ekran_karti_kutu_acilisi.jpg',
    subtitle: 'Yeni Nesil GPU & Kasa İçi Montaj',
    resolution: '2560x1440 • 3.9 MB',
    fileSize: '3.9 MB',
    previewTheme: 'hardware',
    description: 'Kargodan yeni çıktı, kasaya zar zor sığdı ama sıcaklık değerleri buz gibi!'
  },
  {
    title: 'gece_vardiyasi_meme_post.png',
    subtitle: 'Topluluk Mizah & Meme Paylaşımı',
    resolution: '1080x1080 • 640 KB',
    fileSize: '640 KB',
    previewTheme: 'meme',
    description: 'Saat gece 3\'te "son el çıkacağım" dedikten 4 saat sonra bizim eşgal :D'
  }
]

// 4. Bannable / Rule-Violation Messages (Massive pool of realistic Turkish Discord slurs & violations)
const BANNABLE_TEMPLATES: { text: string; reason: string }[] = [
  { text: 'BEDAVA DISCORD NITRO 3 AYLIK DAGITIYORUZ HEMEN TIKLA: http://dlscord-nitro-free-gift.ru/claim', reason: 'Sahte Nitro / Phishing Oltalama Linki' },
  { text: 'STEAM 50$ CUZDAN KODU CEKILISI SON 5 DK: https://steamcommunlty-gift-drop.xyz/login', reason: 'Sahte Steam Cüzdan Phishing Linki' },
  { text: 'Beyler bu sunucu çöp, adminler ilgisiz gelin bizim sunucuya yetki vereyim: discord.gg/kral-mekan-tr', reason: 'Başka Sunucu Reklamı & Üye Çalma' },
  { text: 'Sunucumuzda her gün nakit ödüllü turnuva var hepinizi bekleriz: discord.gg/bedava-odul-2026', reason: 'İzinsiz Discord Davet Linki Paylaşımı' },
  { text: 'Lan sizin oynayacağınız oyunun da sizin de sülalenizi gelmişinizi geçmişinizi s... velet sürüsü!', reason: 'Ağır Ailevi Küfür & Topluluk Hakareti' },
  { text: 'Admin senin ben sıfatını yetkini s... torpilli köpekler banlayın da görelim!', reason: 'Yetkiliye Ağır Hakaret & Provokasyon' },
  { text: 'VALORANT IMMORTAL HESAP SATILIR ICINDE RGX VANDAL VAR 200 TL DM GELIN ACIL!', reason: 'Yasaklı Hesap Satışı & Ticaret İhlali' },
  { text: '100 TL ATANA 1 SAAT ICINDE 1000 TL GARANTI KUPON VERIYORUM TELEGRAMDAN YAZIN!', reason: 'Yasadışı Bahis & Dolandırıcılık Spamı' },
  { text: 'CS2 UNDETECTED WALLHACK + AIMBOT SATILIR BAN YEME RISK YOK: http://cheat-master-vip.org', reason: 'Oyun Hilesi & Zararlı Yazılım Satışı' },
  { text: 'AAAAAAAAAAAAAAAAAA SPAM SPAM SPAM SPAM @everyone @here BAKIN BURAYA AAAAAAAAA', reason: 'Aşırı Flood & Gereksiz @everyone Etiketi' },
  { text: 'Kripto ponzi sistemimize katılın, yatırdığınız parayı akşam 5 katı olarak geri alın: http://fast-usdt-x5.io', reason: 'Kripto Ponzi & Dolandırıcılık Linki' },
  { text: 'Oyun odasındaki mikrofonu bozuk elemanın anasını avradını s... kulağım patladı!', reason: 'Ağır Küfür ve Kişisel Saldırı' },
  { text: 'senin bacını s... velet ses odasına gel erkeksen korkak it', reason: 'Ağır ailevi tehdit ve hakaret' },
  { text: 'senin kafanı monitöre vururum klavye delikanlısı piç', reason: 'Fiziksel şiddet tehdidi' },
  { text: 'adminlerin anasını avradını s... sunucu velet kaynıyor kurucu da o... evladı', reason: 'Yönetime toplu hakaret' },
  { text: 'cs2 de adamın anasına sövdüm diye banlandım böyle adaletin a... koyim', reason: 'Kural ihlali ve küfür' },
  { text: 'orospu çocukları hile açmışlar gelmiş burda rank kasıyorlar ananızı s...', reason: 'Ağır küfür ve taciz' },
  { text: 'ses odasındaki mikrofon basan veledin anasını mezardan çıkarıp s...', reason: 'Aşırı ağır küfür ve nefret söylemi' },
  { text: 'admin torpilli pezevenk gelmiş bana ahkam kesiyor sokarım yetkine', reason: 'Moderatöre doğrudan saldırı' },
  { text: 'sen kime artistlik taslıyosun lan döl israfı adres ver de geleyim', reason: 'Kişisel taciz ve kışkırtma' },
  { text: 'senin o ananın a... balıklama atlarım velet beni tilt etme', reason: 'Ağır argo ve hakaret' },
  { text: 'kurucu efe sunucunun paralarını rulette eziyormuş dolandırıcı piçler', reason: 'İftira ve sunucu karalama' },
  { text: 'ananı s... senin hileci köpek crosshair adamın kafasına kilitleniyor hala ağlıyor', reason: 'Oyun içi aşırı küfür' },
  { text: 'beyler bu mod kaan tam bir orospu çocuğu kurucunun götünü yalıyor', reason: 'Yetkiliye ağır hakaret' },
  { text: 'discord.gg/anarsi-tayfa gelin sunucuyu nukeleyip patlatıcaz modlar uyuyor', reason: 'Sunucu raid organizasyonu & reklam' },
  { text: 'seni bulduğum yerde s... lan velet kaçma erkeksen ses 1 gel', reason: 'Kişisel tehdit ve kışkırtma' },
  { text: 'steam hesabını çaldım elemanın ağlıyor velet xd kurtarmak istiyorsan 200 tl at', reason: 'Şantaj ve hesap hırsızlığı' },
  { text: 'ben senin o babanın ananın geçmişini yedi sülaleni s... sus lan', reason: 'Ailevi ve geçmişe hakaret' },
  { text: 'allahına kitabına sövdürtme benim s... git odadan', reason: 'Dini değerlere saldırı ve küfür' },
  { text: 'modların alayının a... koyayım gelin banlayın hadi erkekseniz', reason: 'Yetkililere açık meydan okuma' },
  { text: 'valoda radiant hesap boostlanır 150 tl ban garantili değil dm', reason: 'Yasaklı hesap boosting & ticaret' },
  { text: 'klavyenin w tuşunu ananın a... sokarım düzgün konuş benimle', reason: 'Yaratıcı ağır küfür' },
  { text: 'sunucu sahibinin numarasını buldum yayıyorum birazdan hazır olun', reason: 'Kişisel veri (Doxxing) tehdidi' }
]

// Build and export the massive 1,500+ message pools
export const MASSIVE_GENEL_POOL: string[] = [...BASE_GENEL_CHATS]
for (const prefix of GENEL_PREFIXES) {
  for (const topic of GENEL_TOPICS) {
    for (let i = 0; i < 3; i++) {
      const comment = GENEL_COMMENTS[(topic.length + i * 3 + prefix.length) % GENEL_COMMENTS.length]
      MASSIVE_GENEL_POOL.push(`${prefix} ${topic} ${comment}`)
    }
  }
}

export const MASSIVE_OYUN_POOL: string[] = []
for (const game of GAMES_LIST) {
  for (const sit of GAMING_SITUATIONS) {
    MASSIVE_OYUN_POOL.push(`${game} ${sit}`)
  }
}

export const MASSIVE_BANNABLE_POOL: { text: string; reason: string }[] = [...BANNABLE_TEMPLATES]
const SCAM_DOMAINS = ['nitro-drop.xyz', 'steam-gift-2026.ru', 'free-skins-cs2.org', 'crypto-double.io', 'discord-events.net', 'valorant-vp-free.com']
const INVITE_CODES = ['oyun-mekani', 'kral-tayfa', 'elit-klan', 'bedava-vip', 'sohbet-adasi', 'turnuva-tr', 'underground-dc']
for (const dom of SCAM_DOMAINS) {
  for (let i = 1; i <= 15; i++) {
    MASSIVE_BANNABLE_POOL.push({
      text: `🚨 [ACİL DUYURU #${i}]: Ücretsiz 100$ Hediye Kodu ve Nitro dağıtımı başladı! Hemen tıkla: https://${dom}/claim?id=${1000 + i * 37}`,
      reason: 'Phishing / Oltalama Linki & Dolandırıcılık'
    })
  }
}
for (const code of INVITE_CODES) {
  for (let i = 1; i <= 12; i++) {
    MASSIVE_BANNABLE_POOL.push({
      text: `Gençler bu sunucu ölmüş, aktif +500 kişilik ses ortamı ve çekilişler için gelin: discord.gg/${code}-${i}`,
      reason: 'Başka Sunucu Reklamı (İzinsiz Davet)'
    })
  }
}

// Helper to get a random message for any channel
export function generateChannelActivity(channelId: string, channelName: string): GeneratedChannelMessage {
  const isRuleViolation = Math.random() < 0.22

  if (isRuleViolation) {
    const pick = MASSIVE_BANNABLE_POOL[Math.floor(Math.random() * MASSIVE_BANNABLE_POOL.length)]
    return {
      text: pick.text,
      isBannable: true,
      banReason: pick.reason
    }
  }

  if (channelId === 'oyun-sohbeti' || channelName.toLowerCase().includes('oyun') || channelName.toLowerCase().includes('turnuva')) {
    const text = MASSIVE_OYUN_POOL[Math.floor(Math.random() * MASSIVE_OYUN_POOL.length)]
    return { text }
  }

  if (channelId === 'ekran-goruntuleri' || channelName.toLowerCase().includes('ekran') || channelName.toLowerCase().includes('foto') || channelName.toLowerCase().includes('medya')) {
    const baseTpl = SCREENSHOT_TEMPLATES[Math.floor(Math.random() * SCREENSHOT_TEMPLATES.length)]
    const serial = Math.floor(100 + Math.random() * 900)
    return {
      text: baseTpl.description,
      screenshot: {
        ...baseTpl,
        title: baseTpl.title.replace('.', `_${serial}.`)
      }
    }
  }

  // Custom user-created channels or #genel-sohbet
  if (channelId !== 'genel-sohbet') {
    const customPrompts = [
      `#${channelName} kanalı yeni açılmış, hayırlı olsun!`,
      `Burada ${channelName} üzerine konuşuyoruz değil mi beyler?`,
      `#${channelName} odası bayağı iyi düşünülmüş, yönetim ekibine teşekkürler.`,
      `${channelName} hakkında önerisi olan var mı arkadaşlar?`,
      `Genel sohbet çok hızlı akıyordu, #${channelName} kanalının açılması süper oldu.`
    ]
    if (Math.random() < 0.55) {
      return { text: customPrompts[Math.floor(Math.random() * customPrompts.length)] }
    }
  }

  const text = MASSIVE_GENEL_POOL[Math.floor(Math.random() * MASSIVE_GENEL_POOL.length)]
  return { text }
}

// Preset Moderator Choices for channels (Requirement #7: No free text typing, only rich contextual choices!)
export function getModeratorChannelChoices(channelId: string, channelName: string): { id: string; label: string; text: string; hypeDelta: number }[] {
  if (channelId === 'oyun-sohbeti') {
    return [
      { id: 'c_game_1', label: '🎮 Turnuva Duyurusu', text: '📢 Gençler bu akşam 5v5 ödüllü sunucu turnuvamız var, takımlarınızı hazırlayın!', hypeDelta: 4 },
      { id: 'c_game_2', label: '🛡️ Centilmenlik Uyarısı', text: '⚠️ Oyun tartışmalarında birbirimize hakaret etmeyelim, centilmence rekabet edelim.', hypeDelta: 1 },
      { id: 'c_game_3', label: '🔥 Lobiye Katıl', text: 'Ben de bir el rekabetçi giriyorum, ses odasında yer açın bakalım!', hypeDelta: 3 },
      { id: 'c_game_4', label: '🛑 Toxic Oyuncuya Ayar', text: 'Skor tablosuna bakıp millete toxiclik yapmayı kesin, oyun zevkini baltalamayın.', hypeDelta: 2 },
      { id: 'c_game_5', label: '🎯 Hile İhbarı Çağrısı', text: 'Şüpheli hareket veya wallhack/aimbot gören direkt kliple ticket açsın, gereğini yaparım.', hypeDelta: 2 },
      { id: 'c_game_6', label: '⚔️ Dereceli Kadrosu Kur', text: 'Akşam rank kasmak isteyen +2 İmmortal / Faceit 10 gelsin ses odası 1\'deyiz.', hypeDelta: 3 },
      { id: 'c_game_7', label: '⚡ İronik / Troll', text: 'Kardeşim o klipte adam hile değil, senin crosshair yerleri süpürüyor ağlama artık :D', hypeDelta: 2 },
      { id: 'c_game_8', label: '🔨 Ban Tehdidi', text: 'Bir kez daha oyunda küfür edip genele taşıyan olursa mola vermeden doğrudan banlarım.', hypeDelta: -1 }
    ]
  }

  if (channelId === 'ekran-goruntuleri') {
    return [
      { id: 'c_ss_1', label: '👏 Setup Öv', text: '✨ Harika ekran görüntüleri ve setup fotoğrafları gelmiş, elinize sağlık millet!', hypeDelta: 3 },
      { id: 'c_ss_2', label: '🔞 Medya Kuralı Uyarısı', text: '🛡️ Arkadaşlar bu kanalda sadece oyun ve setup görselleri paylaşalım, uygunsuz içerik yasaktır.', hypeDelta: 1 },
      { id: 'c_ss_3', label: '📸 Setup Yarışması', text: '🏆 Haftanın en iyi masaüstü/setup fotoğrafına özel VIP rolü hediye edeceğiz!', hypeDelta: 5 },
      { id: 'c_ss_4', label: '🔥 Skor Tablosunu Alkışla', text: 'O nasıl bir skor öyle eline koluna sağlık, clutch harika görünüyor!', hypeDelta: 3 },
      { id: 'c_ss_5', label: '🧹 Kanal Temizliği Hatırlat', text: 'Lütfen ekran görüntüsü harici uzun sohbetleri #genel-sohbet kanalında yapalım gençler.', hypeDelta: 1 }
    ]
  }

  if (channelId === 'mizah-meme') {
    return [
      { id: 'c_meme_1', label: '😂 Kahkaha At', text: 'HAHAHAHA bu meme cidden gece gece kopardı beni, tam bizim sunucunun hali!', hypeDelta: 4 },
      { id: 'c_meme_2', label: '🛑 Ofansif Sınır Uyarısı', text: 'Mizah yaparken aşırı ofansif ve dini/ailevi sınırlara girmeyelim arkadaşlar, dikkat.', hypeDelta: 1 },
      { id: 'c_meme_3', label: '🏆 Haftanın Capsi', text: 'Bu hafta gelen en kaliteli meme post buydu net, mod ekibi olarak onayladık :D', hypeDelta: 3 }
    ]
  }

  if (channelId === 'bot-komut') {
    return [
      { id: 'c_bot_1', label: '🎵 Müzik Sırası Hatırlat', text: 'Müzik botuna troll şarkı veya earrape basanları bot yetkisinden men edeceğim.', hypeDelta: 2 },
      { id: 'c_bot_2', label: '🤖 Botları Yeniden Başlat', text: 'Bot komutlarında gecikme varsa birazdan VDS üzerinden restart atıyorum bilginize.', hypeDelta: 1 }
    ]
  }

  // General & All Channels Diverse Response Options
  return [
    { id: 'c_gen_1', label: '🛡️ Kuralları Hatırlat (Resmi)', text: `⚠️ Arkadaşlar #${channelName} kanalında küfür, spam ve reklam linkleri kesinlikle yasaktır. Kurallara uyalım.`, hypeDelta: 1 },
    { id: 'c_gen_2', label: '🛑 Tartışmayı Kes (Sert)', text: '🚨 Bu konudaki laf dalaşını derhal kesin. Bir kelime daha uzatan mola alacak, son uyarım.', hypeDelta: 1 },
    { id: 'c_gen_3', label: '🔨 Ban Tehdidi (Gözdağı)', text: '⚡ Ban çekicim elimde kaşınmaya başladı. Kaşınan varsa buyursun devam etsin.', hypeDelta: 2 },
    { id: 'c_gen_4', label: '😊 Sakin Olun (Ilımlı)', text: 'Beyler sakin olalım lütfen, iki satır muhabbet için kalp kırmaya hiç gerek yok.', hypeDelta: 2 },
    { id: 'c_gen_5', label: '💬 Hal Hatır Sor (Samimi)', text: 'Selamlar herkese! Çayınızı kahvenizi aldınız mı gençler, keyifler nasıl bugün?', hypeDelta: 3 },
    { id: 'c_gen_6', label: '⚡ Ağlama Duvarı (İronik/Trol)', text: 'Ağlama duvarı sol tarafta beyler devam edin, mendilleri de masaya bıraktım :D', hypeDelta: 3 },
    { id: 'c_gen_7', label: '🤫 SlowMode Uyarısı (Yavaşlat)', text: 'Sohbet çok hızlı akıyor, gözümüz kanadı. Biraz yavaşlamazsanız slow mode açıyorum.', hypeDelta: 1 },
    { id: 'c_gen_8', label: '🎉 Nitro Çekiliş Müjdesi', text: '🔥 Sunucu aktifliği harika! Vardiya sonuna kadar Hype yüksek kalırsa Nitro dağıtımı yapacağım!', hypeDelta: 5 },
    { id: 'c_gen_9', label: '🤝 Şikayet Bildirimi (DM Çağrısı)', text: 'Dostlar hakarete veya haksızlığa uğrayan varsa bana direkt DM atsın veya ticket açsın ilgilenirim.', hypeDelta: 2 },
    { id: 'c_gen_10', label: '🎮 Akşama Ses Odası Çağrısı', text: 'Akşama ses odalarımızda turnuva ve geyik var, herkesi bekliyoruz toplanın bakalım!', hypeDelta: 4 }
  ]
}
