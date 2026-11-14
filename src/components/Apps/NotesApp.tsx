import React from 'react'

export const NotesApp: React.FC = () => {
  return (
    <div className="h-full w-full bg-[#1b1d22] text-zinc-300 p-4 font-mono text-xs overflow-y-auto leading-relaxed select-text">
      <div className="max-w-xl mx-auto space-y-4">
        <div className="border-b border-[#2d313c] pb-2">
          <h2 className="text-sm font-bold text-white"># MODERASYON REHBERİ (v1.0)</h2>
          <span className="text-[10px] text-zinc-500">Son Güncelleme: 08.11.2026</span>
        </div>

        <div className="space-y-2">
          <h3 className="text-zinc-100 font-bold">1. Temel Kurallar</h3>
          <p className="text-zinc-400">
            - Küfür ve hakaret tespit edildiğinde kanıt iste veya logları incele.<br/>
            - Masum bir üyeyi banlamak sunucu Hype seviyesini düşürür.<br/>
            - Ticket açan kullanıcılarla net ve resmi konuş.
          </p>
        </div>

        <div className="space-y-2">
          <h3 className="text-zinc-100 font-bold">2. Hype ve Sanity Dengesi</h3>
          <p className="text-zinc-400">
            - Hype yüksekken sunucuya katılan yeni üye sayısı artar.<br/>
            - Sanity düşerse ekranda halüsinasyonlar başlar ve komutlarda hata çıkar. Kahve içerek toparla.
          </p>
        </div>
      </div>
    </div>
  )
}
