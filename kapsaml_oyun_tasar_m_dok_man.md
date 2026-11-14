# OYUN TASARIM DOKÜMANI (GDD): ROOT://ACCESS (SERVER OVERLORD)

* **Çalışma Başlığı:** `ROOT://ACCESS` (Alternatifler: *ModLife Simulator*, *Server: Overlord*, *Sudo Admin*)
* **Geliştirici Stüdyo:** Dark Query Studios / Localhost Games
* **Tür:** UI-Based Simülasyon, Kriz Yönetimi, Dedektiflik, İnternet Kültürü Hicvi
* **Platform:** PC (Steam / Windows, macOS, Linux)
* **Hedef Kitle:** *Papers, Please*, *Orwell*, *Not For Broadcast*, *Mainlining* ve internet altkültürlerini (Discord, Reddit, Twitch) seven oyuncular.

---

## 1. YÖNETİCİ ÖZETİ VE OYUNUN VİZYONU

### 1.1 Logline
Kendi yatak odasındaki tek monitörlü döküntü bilgisayarıyla internetin en kaotik topluluklarında "gönüllü moderatör" olarak işe başlayan; ban çekiçleri, terminal komutları ve dedektiflik logları arasında akıl sağlığını koruyarak devasa bir dijital imparatorluk (ve hayalindeki yayıncı/yazılımcı odasını) inşa eden bir moderatörün kara mizah simülasyonu.

### 1.2 Temel Tasarım Sütunları (Pillars)
1. **Dedektiflik & Metin Okuma Tatmini:** Olay sadece "hızlı tıklamak" değil; kanıtları, saat damgalarını (timestamps) ve log kayıtlarını çapraz kontrol ederek doğru kararı vermek.
2. **Ahlaki İkilemler (Yolsuzluk vs. Düzen):** Faturayı ödemek için zengin bir trolün banını açıp ona VIP vermek mi, yoksa sunucu batarken adaleti korumak mı?
3. **Somut İlerleme Hissi (Battlestation Meta):** Ekrandaki pencereler genişledikçe fiziksel masanın, monitörlerin, klavye seslerinin ve odanın da sınıf atlaması.
4. **İnternet Kültürü Hicvi:** Kripto dolandırıcıları, "bunu mahkemeye vereceğim" diyen 14 yaşındaki RP oyuncuları, telif trolleri ve fanatik yayıncı kitleleri.

---

## 2. TEMEL OYUN DÖNGÜSÜ (CORE GAMEPLAY LOOP)

```
       [ Kriz Ortaya Çıkar (Raid, Kavga, DDoS, Ticket) ]
                              │
                              ▼
        [ Araştırma & Müdahale (Log İnceleme / CLI Komutu) ]
                              │
                              ▼
            [ Karar Verme (Ban / Mute / Rüşvet Kabul) ]
                              │
                              ▼
      [ Sonuçlar: Sunucu Geliri + Prestij + Akıl Sağlığı Değişimi ]
                              │
                              ▼
     [ Gece Sonu Yükseltmeleri (Donanım, Otomasyon Botları, Oda Eşyaları) ]
```

---

## 3. ARAYÜZ (UI) VE ÇALIŞMA ALANI MİMARİSİ

Oyun tamamen diegetik (oyun dünyasının bizzat parçası olan) bir işletim sistemi arayüzü (**ModOS v4.2**) üzerinden oynanır.

### 3.1 Pencereler ve Katmanlar
* **ChatBox Client ("Disclord / NetCord"):** Farklı kanalların (Genel Sohbet, Duyurular, VIP Lounge, Kurallar) aktığı ana sohbet paneli.
* **Audit Logs Viewer (Kayıt Defteri):** Kimin hangi kanala ne yazdığını, mesaj silme geçmişini, IP çakışmalarını ve eylem kayıtlarını gösteren arama yapılabilir filtreli log penceresi.
* **Support Ticket Desk:** Kullanıcıların ekran görüntüleri ve ifadelerle açtığı resmi şikayet biletleri.
* **Terminal CLI (`/root`):** Hızlı aksiyonlar için klavye odaklı komut satırı. (Örn: `ban --user "xX_Kral_Xx" --reason "RDM" --duration permanent`).
* **BotBuilder IDE:** Basit sürükle-bırak mantık kapılarıyla oto-moderatör kural seti oluşturma aracı.
* **LifeBar & Ambient Desk (Ekran Kenarı):** Oyuncunun kahve bardağı, enerji içeceği seviyesi, masanın üstündeki not kağıtları ve akıl sağlığı (Sanity) barı.

---

## 4. DETAYLI OYUN MEKANİKLERİ

### 4.1 Canlı Moderasyon ve Ban Mekaniği
* **Hızlı Müdahale Penceresi:** Chat akarken şüpheli linkler, gizlenmiş küfürler (örneğin leetspeak: `b@n`, `k.u.f.u.r`) veya yasaklı görseller düşer.
* **Hata Cezası:** Yanlışlıkla masum bir kullanıcıyı banlamak sunucunun **Hype / Memnuniyet** oranını düşürür. Geç kalmak ise trollerin kanalı ele geçirmesine (**Raid Status**) yol açar.
* **Klavye Kısayolları:** Fare ile tıkla-banla yerine profesyonel oyuncular için hızlı komutlar:
  * `Alt + B`: Seçili kullanıcıyı banlar.
  * `Alt + M`: 5 dakika susturur (Timeout).
  * `Ctrl + Shift + S`: Sunucuyu acil durum "Slow Mode"a alır.

### 4.2 Ticket Dedektifliği (Case Solving)
* **Senaryolu Krizler:** Örnek: Hardcore RP sunucusunda bir oyuncu "Beni sebepsiz vurdular (RDM)" diyerek ticket açar.
* **Delil İnceleme Süreci:**
  1. Şikayetçinin ifadesini oku.
  2. Sanığın savunmasını oku (Genelde yalan söyler veya gerçeği büker).
  3. **Audit Log** aç: Saat `23:14:02`'deki pozisyon ve eylem verilerine bak.
  4. Gerçek: Şikayetçi aslında ilk küfrü etmiş ve kuralları çiğnemiştir.
  5. Karar: Şikayetçiyi mi, sanığı mı yoksa her ikisini mi cezalandıracaksın?

### 4.3 Kendi Botunu Kodlama (Otomasyon Mühendisliği)
Oyun ilerledikçe chat hızı insanın yetişemeyeceği seviyeye çıkar. Oyuncu kendi botunu oluşturmalıdır:
* **Blok Tabanlı Mantık:**
  * `EĞER` [Mesaj Türü == "Link"] `VE` [Kullanıcı Rolü != "VIP"] `İSE` -> [Mesajı Sil] + [Uyarı Puanı +1]
  * `EĞER` [Aynı Mesaj Tekrarı > 3 / 5sn] `İSE` -> [Kullanıcıya 10 Dakika Mute At]
* **Regex / Kelime Filtresi:** Troller filtreleri aşmak için kelimeleri modifiye eder (`d-i-s-c-o-r-d.gg/scam`). Oyuncu regex ve anahtar kelime listesini güncel tutmalıdır.
* **Bot Çökmesi (Bug Riski):** Çok karmaşık ve optimize edilmemiş bot kuralları yazılırsa bot sunucuda aşırı bellek tüketir (Memory Leak) ve çöker.

### 4.4 Ekonomi, Altyapı ve VIP Yolsuzluk Sistemi
* **Sunucu Giderleri:** Hosting kirası, bot sunucusu masrafı, DDoS koruma kalkanı aboneliği.
* **Gelir Modelleri:**
  * Topluluk bağışları (Sunucu kalitesi ve adalete bağlı artar).
  * VIP / Rol Satışları (Kullanıcılara özel ayrıcalıklar).
* **Ahlaki İkilem (Corruption Dynamic):**
  * Zengin bir "Balina" (Whale) kullanıcı her ay 500$ bağış yapmaktadır ancak genel sohbette toxic davranışlar sergilemektedir.
  * Banlarsan: Sunucu o ay iflas edebilir.
  * Banlamazsan: Eski ve sadık üyeler sunucuyu terk eder, sunucu saygınlığı düşer.

### 4.5 Akıl Sağlığı (Sanity) ve İhtiyaçlar
* Ekrana gelen toksik mesajlar, durmaksızın öten bildirim sesleri ve haksız linçler oyuncunun **Sanity** barını tüketir.
* Sanity düşünce:
  * Ekran bulanıklaşır.
  * Halüsinasyon mesajlar görünmeye başlar ("Herkes senden nefret ediyor", "İstifa et").
  * Terminal komutlarında yazım hataları (typo) meydana gelir.
* İyileşme: Masadaki kahveyi yudumlamak, kedi sevmek veya "Bildirimleri Sessize Al (Do Not Disturb)" moduna geçip 30 saniye mola vermek (bu esnada sunucuda kaos çıkabilir).

---

## 5. SEVİYELER VE SENARYO AKIŞI

| Seviye | Sunucu Tipi | Kültür & Krizler | Mekanik Odak |
| :--- | :--- | :--- | :--- |
| **Bölüm 1** | *PixelForge Dev Community* (İndie Oyun) | Sakin kitle, bug raporları, kibar oyuncular, birkaç telif sorunu. | Tutorial, temel /ban /mute komutları, log okuma temelleri. |
| **Bölüm 2** | *SpeedyStreams* (Twitch Yayıncısı Fan Kulübü) | Aşırı hızlı chat, raidler, rakip yayıncı trolleri, spam dalgaları. | Hızlı reaksiyon, slow mode kullanımı, ilk basit bot kurulumu. |
| **Bölüm 3** | *Los Santos Noir* (Hardcore GTA/FiveM RP) | Rol ihlalleri (Metagaming, VDM), ego savaşları, rüşvet teklifleri. | Ağır Ticket incelemesi, çapraz kanıt analizi, VIP yolsuzluğu ikilemleri. |
| **Bölüm 4** | *MoonRocket DAO* (Kripto / Web3 Topluluğu) | Phishing linkleri, cüzdan hırsızları, organize botnet DDoS saldırıları. | CLI terminal krizleri, gelişmiş regex filtreleme, siber güvenlik mini-oyunları. |
| **Bölüm 5** | *The Syndicate* (Karanlık Forum / Whistleblower Ağı) | Hükümet ajanları, sızıntı belgeler, sansür baskısı ve etik kararlar. | Final aşaması: Hangi tarafın verilerini koruyup kimi ifşa edeceğine karar verme. |

---

## 6. İLERLEME VE ODA/SETUP KİŞİSELLEŞTİRMESİ (BATTLESTATION PROGRESSION)

Kazanılan paralar ikiye bölünür: **Sunucu Fonu** ve **Kişisel Banka Hesabı**. Kişisel parayla oyuncu odasını ve çalışma ortamını yükseltir:

### 6.1 Donanım Yükseltmeleri (Doğrudan Oynanışa Etki Eder)
* **Tek 17" CRT Monitör -> 27" IPS Panel -> Çift Monitör -> 49" Kavisli Ultrawide:**
  * Ekranda aynı anda açık tutulabilecek pencere sayısını artırır. Alt-Tab yapma ihtiyacını azaltır.
* **Ofis Klavyesi -> Mekanik Klavye (Blue/Red/Brown Switch seçenekleriyle):**
  * Komut giriş hızını (input delay) azaltır, tatmin edici diegetik sesler ekler.
* **Modem & Fiber İnternet Yükseltmesi:**
  * Mesaj gecikmesini (ping) düşürür, DDoS saldırılarına karşı terminal tepki süresini hızlandırır.

### 6.2 Kozmetik ve Atmosfer (Sanity Düşüşünü Yavaşlatır)
* **Masa Lambaları & RGB Şeritler:** Göz yorgunluğunu azaltarak Sanity düşüşünü %15 yavaşlatır.
* **Masaüstü Koleksiyonu:** 1:64 diecast model arabalar, anime figürleri, kaktüs saksısı (Tıklanabilir stres azaltıcılar).
* **İşletim Sistemi Temaları:** Classic Win98 Teması, Cyberpunk Neon, Minimalist Dark Theme.

---

## 7. SES VE MÜZİK TASARIMI (DIEGETIC AUDIO)

* **Geri Bildirim Sesleri (Foley):**
  * Kullanılan klavye modeline göre değişken mekanik switch sesleri (Cherry MX Blue tıkırtısı, Red tok sesi).
  * 2000'lerin sonu MSN / Skype / Discord benzeri nostaljik bildirim sesleri (Her sunucu türünde farklılaşır).
* **Çevresel Sesler (Atmosphere):**
  * Bilgisayar kasasından gelen fan uğultusu (DDoS anında fanlar çılgınca hızlanır).
  * Dışarıdan gelen yağmur sesi, uzaktan geçen araba sesleri (Odaklanma hissi verir).
* **Müzik:** Düşük tempolu, lo-fi hip-hop ve retro synthwave; kriz anlarında yerini boğuk, kalp atışını andıran endüstriyel gerilim ritimlerine bırakır.

---

## 8. PAZARLAMA, YAYINCI ENTEGRASYONU VE VİRAL POTANSİYEL

### 8.1 Twitch / YouTube Entegrasyonu (Streamer-Bait Mechanics)
* **İzleyiciler Chat'e Dahil Olur:** Yayını izleyen seyirciler oyun içi sunucuya katılabilir!
* **Twitch Oylamaları:** Seyirci oy kullanarak sunucuya baskın (Raid) düzenleyebilir ya da ticket açarak yayıncıya zorlu davalar gönderebilir.
* **İsim Eşleşmesi:** Oyundaki trollerin veya VIP kullanıcıların isimleri doğrudan Twitch chatindeki izleyicilerin nickleriyle değiştirilir.

### 8.2 Düşük Geliştirme Maliyeti / Yüksek Kâr Marjı (Production Feasibility)
* 3D animasyon ve karmaşık fizik motorları gerektirmez.
* Godot, Unity veya Electron/Web tabanlı hafif motorlarla kolaylıkla geliştirilebilir.
* Vurgu tamamen UI tasarımı, zekice kurgulanmış metinler ve internet altkültürü mizahındadır.

---

## 9. GELİŞTİRME YOL HARİTASI (ROADMAP)

1. **Aşama 1 (Prototip - 2 Ay):** Temel OS arayüzü, akan sohbet motoru, basit ban/mute komutları.
2. **Aşama 2 (Dedektiflik & Bot Motoru - 3 Ay):** Audit log arama sistemi, ticket mekanizması ve blok tabanlı otomasyon arayüzü.
3. **Aşama 3 (İçerik & Bölüm Tasarımı - 3 Ay):** 5 ana sunucu seviyesinin diyaloglarının, krizlerinin ve yan karakterlerinin yazılması.
4. **Aşama 4 (Battlestation & Kozmetik - 2 Ay):** Donanım yükseltme dükkanı, oda rendering katmanı, SFX/Müzik entegrasyonu.
5. **Aşama 5 (Beta & Twitch API - 2 Ay):** Yayıncı testleri, topluluk geri bildirimleri, Steam Next Fest demosu.