// Diegetic Web Audio Synthesizer for realistic OS, Discord, and keyboard audio
class SoundEngine {
  private ctx: AudioContext | null = null
  public isMuted: boolean = false

  setMuted(muted: boolean) {
    this.isMuted = muted
  }

  private getContext(): AudioContext {
    if (this.isMuted) {
      throw new Error('Audio is muted')
    }
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      this.ctx = new AudioCtx()
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume()
    }
    return this.ctx
  }

  // Realistic Discord message "ping" sound (two-tone soft marimba sine)
  playDiscordPing() {
    try {
      const ctx = this.getContext()
      const now = ctx.currentTime
      
      const osc1 = ctx.createOscillator()
      const osc2 = ctx.createOscillator()
      const gain = ctx.createGain()

      osc1.type = 'sine'
      osc2.type = 'sine'

      osc1.frequency.setValueAtTime(659.25, now) // E5
      osc1.frequency.exponentialRampToValueAtTime(880, now + 0.08) // A5

      osc2.frequency.setValueAtTime(1318.5, now) // E6
      osc2.frequency.exponentialRampToValueAtTime(1760, now + 0.08)

      gain.gain.setValueAtTime(0.08, now)
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25)

      osc1.connect(gain)
      osc2.connect(gain)
      gain.connect(ctx.destination)

      osc1.start(now)
      osc2.start(now)
      osc1.stop(now + 0.25)
      osc2.stop(now + 0.25)
    } catch {
      // Audio autoplay policy fallback
    }
  }

  // Discord voice connect sound
  playVoiceConnect() {
    try {
      const ctx = this.getContext()
      const now = ctx.currentTime
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()

      osc.type = 'sine'
      osc.frequency.setValueAtTime(440, now) // A4
      osc.frequency.setValueAtTime(587.33, now + 0.08) // D5
      osc.frequency.setValueAtTime(880, now + 0.16) // A5

      gain.gain.setValueAtTime(0.07, now)
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35)

      osc.connect(gain)
      gain.connect(ctx.destination)

      osc.start(now)
      osc.stop(now + 0.35)
    } catch {}
  }

  // Discord voice disconnect sound
  playVoiceDisconnect() {
    try {
      const ctx = this.getContext()
      const now = ctx.currentTime
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()

      osc.type = 'sine'
      osc.frequency.setValueAtTime(659.25, now) // E5
      osc.frequency.setValueAtTime(493.88, now + 0.08) // B4
      osc.frequency.setValueAtTime(329.63, now + 0.16) // E4

      gain.gain.setValueAtTime(0.07, now)
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3)

      osc.connect(gain)
      gain.connect(ctx.destination)

      osc.start(now)
      osc.stop(now + 0.3)
    } catch {}
  }

  // Ban gavel / heavy slam thump
  playBanHammer() {
    try {
      const ctx = this.getContext()
      const now = ctx.currentTime
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()

      osc.type = 'triangle'
      osc.frequency.setValueAtTime(150, now)
      osc.frequency.exponentialRampToValueAtTime(30, now + 0.28)

      gain.gain.setValueAtTime(0.2, now)
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3)

      osc.connect(gain)
      gain.connect(ctx.destination)

      osc.start(now)
      osc.stop(now + 0.3)
    } catch {}
  }

  // Mechanical switch tactile key click
  playKeyClick() {
    try {
      const ctx = this.getContext()
      const now = ctx.currentTime
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()

      osc.type = 'sine'
      osc.frequency.setValueAtTime(1200 + Math.random() * 400, now)
      osc.frequency.exponentialRampToValueAtTime(200, now + 0.03)

      gain.gain.setValueAtTime(0.025, now)
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.035)

      osc.connect(gain)
      gain.connect(ctx.destination)

      osc.start(now)
      osc.stop(now + 0.035)
    } catch {}
  }

  // Steam-style achievement unlock fanfare
  playAchievement() {
    try {
      const ctx = this.getContext()
      const now = ctx.currentTime

      const freqs = [523.25, 659.25, 783.99, 1046.50] // C5, E5, G5, C6
      freqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        osc.type = 'triangle'
        osc.frequency.setValueAtTime(freq, now + idx * 0.08)

        gain.gain.setValueAtTime(0.09, now + idx * 0.08)
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.35)

        osc.connect(gain)
        gain.connect(ctx.destination)
        osc.start(now + idx * 0.08)
        osc.stop(now + idx * 0.08 + 0.35)
      })
    } catch {}
  }

  // Paranoia / Sanity Glitch Whisper
  playGlitchWhisper() {
    try {
      const ctx = this.getContext()
      const now = ctx.currentTime
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()

      osc.type = 'sawtooth'
      osc.frequency.setValueAtTime(80, now)
      osc.frequency.exponentialRampToValueAtTime(240, now + 0.15)
      osc.frequency.exponentialRampToValueAtTime(40, now + 0.35)

      gain.gain.setValueAtTime(0.04, now)
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35)

      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start(now)
      osc.stop(now + 0.35)
    } catch {}
  }

  // Low Sanity Heartbeat Thump
  playHeartbeat() {
    try {
      const ctx = this.getContext()
      const now = ctx.currentTime
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()

      osc.type = 'sine'
      osc.frequency.setValueAtTime(65, now)
      osc.frequency.exponentialRampToValueAtTime(35, now + 0.22)

      gain.gain.setValueAtTime(0.2, now)
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25)

      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start(now)
      osc.stop(now + 0.25)
    } catch {}
  }

  // Discord ticket channel close / archive sound
  playTicketClose() {
    try {
      const ctx = this.getContext()
      const now = ctx.currentTime
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()

      osc.type = 'sine'
      osc.frequency.setValueAtTime(600, now)
      osc.frequency.exponentialRampToValueAtTime(320, now + 0.16)

      gain.gain.setValueAtTime(0.08, now)
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22)

      osc.connect(gain)
      gain.connect(ctx.destination)

      osc.start(now)
      osc.stop(now + 0.22)
    } catch {}
  }

  // Casino chip / money sound
  playCoinChime() {
    try {
      const ctx = this.getContext()
      const now = ctx.currentTime
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()

      osc.type = 'sine'
      osc.frequency.setValueAtTime(987.77, now)
      osc.frequency.setValueAtTime(1318.51, now + 0.08)

      gain.gain.setValueAtTime(0.08, now)
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25)

      osc.connect(gain)
      gain.connect(ctx.destination)

      osc.start(now)
      osc.stop(now + 0.25)
    } catch {}
  }

  // Emergency Raid Siren
  playRaidAlarm() {
    try {
      const ctx = this.getContext()
      const now = ctx.currentTime
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()

      osc.type = 'sawtooth'
      osc.frequency.setValueAtTime(400, now)
      osc.frequency.linearRampToValueAtTime(800, now + 0.2)
      osc.frequency.linearRampToValueAtTime(400, now + 0.4)

      gain.gain.setValueAtTime(0.12, now)
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45)

      osc.connect(gain)
      gain.connect(ctx.destination)

      osc.start(now)
      osc.stop(now + 0.45)
    } catch {}
  }

  // Desk Cat Purr / Meow sound
  playCatMeow() {
    try {
      const ctx = this.getContext()
      const now = ctx.currentTime
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()

      osc.type = 'sine'
      osc.frequency.setValueAtTime(600, now)
      osc.frequency.exponentialRampToValueAtTime(850, now + 0.15)
      osc.frequency.exponentialRampToValueAtTime(500, now + 0.4)

      gain.gain.setValueAtTime(0.08, now)
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45)

      osc.connect(gain)
      gain.connect(ctx.destination)

      osc.start(now)
      osc.stop(now + 0.45)
    } catch {}
  }

  // Email Notification Chime
  playMailChime() {
    try {
      const ctx = this.getContext()
      const now = ctx.currentTime
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()

      osc.type = 'sine'
      osc.frequency.setValueAtTime(523.25, now) // C5
      osc.frequency.setValueAtTime(659.25, now + 0.1) // E5
      osc.frequency.setValueAtTime(783.99, now + 0.2) // G5

      gain.gain.setValueAtTime(0.07, now)
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4)

      osc.connect(gain)
      gain.connect(ctx.destination)

      osc.start(now)
      osc.stop(now + 0.4)
    } catch {}
  }

  // Generic success chime
  playSuccess() {
    this.playCoinChime()
  }

  // Generic UI click
  playClick() {
    this.playKeyClick()
  }
}

export const soundEngine = new SoundEngine()
