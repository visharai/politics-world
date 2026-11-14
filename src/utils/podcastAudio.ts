/**
 * Podcast Audio Engine - High Reliability Broadcast Audio & Speech System
 * Combines:
 * 1. Web Speech Synthesis (TTS across 16 global languages with native accents & pitch control)
 * 2. Web Audio API Broadcast Soundbed (Station intro chimes, rhythmic newsroom acoustic presence)
 * 3. Formant Vocal Synthesizer Fallback (Ensures speech cadence and audio playback NEVER fail even if browser TTS is uninstalled/silent)
 * 4. User-Gesture Hardware Audio Unlocking (Bypasses autoplay restrictions on Chromium/Safari/Mobile)
 */

export interface TranscriptLine {
  time: string;
  seconds: number;
  speaker: string;
  text: string;
}

export interface AudioEngineCallbacks {
  onTimeUpdate: (seconds: number) => void;
  onSegmentChange: (index: number) => void;
  onStateChange: (isPlaying: boolean) => void;
  onError?: (err: unknown) => void;
}

export const LANG_BCP47_MAP: Record<string, string> = {
  en: 'en-US',
  es: 'es-ES',
  fr: 'fr-FR',
  de: 'de-DE',
  hi: 'hi-IN',
  zh: 'zh-CN',
  ar: 'ar-SA',
  ja: 'ja-JP',
  ru: 'ru-RU',
  pt: 'pt-BR',
  it: 'it-IT',
  ko: 'ko-KR',
  tr: 'tr-TR',
  nl: 'nl-NL',
  id: 'id-ID',
  pl: 'pl-PL',
};

// Sample greetings for instant audio & voice verification
export const SAMPLE_AUDIO_GREETINGS: Record<string, string> = {
  en: 'Politics World Daily Dispatch audio online.',
  hi: 'पॉलिटिक्स वर्ल्ड डेली डिस्पैच ऑडियो ऑनलाइन।',
  es: 'Despacho diario de Politics World en línea.',
  fr: 'Dépêche quotidienne de Politics World en direct.',
  de: 'Politics World Tagesbericht Audio online.',
  zh: '政治世界每日快讯音频已在线。',
  ar: 'ديسباتش بوليتيكس وورلد اليومي الصوتي يعمل الآن.',
  ja: 'ポリティクス・ワールドのデイリー・ディスパッチ音声を再生中。',
  ru: 'Ежедневный выпуск Politics World в эфире.',
  pt: 'Boletim diário do Politics World online.',
  it: 'Bollettino quotidiano di Politics World in onda.',
  ko: '폴리틱스 월드 데일리 디스패치 오디오 방송 중입니다.',
  tr: 'Politics World Günlük Bülten yayında.',
  nl: 'Politics World Daily Dispatch audio online.',
  id: 'Siaran audio harian Politics World aktif.',
  pl: 'Biuletyn codzienny Politics World online.',
};

declare global {
  interface Window {
    __pwActiveUtterances?: Set<SpeechSynthesisUtterance>;
  }
}

class PodcastAudioEngine {
  private audioCtx: AudioContext | null = null;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private segments: TranscriptLine[] = [];
  private currentSegmentIndex: number = 0;
  private isPlaying: boolean = false;
  private isMuted: boolean = false;
  private volume: number = 0.9;
  private playbackRate: number = 1;
  private callbacks: AudioEngineCallbacks | null = null;

  private ambientOsc: OscillatorNode | null = null;
  private ambientGain: GainNode | null = null;
  private bedPulseTimer: ReturnType<typeof setInterval> | null = null;
  private speechKeepAliveTimer: ReturnType<typeof setInterval> | null = null;
  private fallbackVoiceTimer: ReturnType<typeof setTimeout> | null = null;
  private segmentWatchdogTimer: ReturnType<typeof setTimeout> | null = null;
  private activeChunks: string[] = [];
  private currentChunkIndex: number = 0;
  private availableVoices: SpeechSynthesisVoice[] = [];
  private selectedVoiceUri: string | null = null;
  private currentLanguageCode: string = 'en';

  constructor() {
    if (typeof window !== 'undefined') {
      this.initVoices();
      if ('speechSynthesis' in window) {
        window.speechSynthesis.onvoiceschanged = () => {
          this.initVoices();
        };
      }
    }
  }

  private initVoices() {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    try {
      const raw = window.speechSynthesis.getVoices() || [];
      const seen = new Set<string>();
      const deduped: SpeechSynthesisVoice[] = [];
      for (const v of raw) {
        const key = `${v.voiceURI || v.name}::${v.lang}`;
        if (!seen.has(key)) {
          seen.add(key);
          deduped.push(v);
        }
      }
      this.availableVoices = deduped.length > 0 ? deduped : raw;
    } catch {
      this.availableVoices = [];
    }
  }

  /**
   * Synchronously called from user click events (Play, Sound Test, Scrubber)
   * to unlock browser hardware audio pipelines and clear Chromium autoplay policy restrictions.
   */
  public unlockAudio(): void {
    try {
      const ctx = this.getAudioContext();
      if (ctx && ctx.state === 'suspended') {
        ctx.resume().catch(() => {});
      }
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        if (window.speechSynthesis.paused) {
          window.speechSynthesis.resume();
        }
      }
    } catch {
      // Audio unlocking best effort
    }
  }

  public getVoices(): SpeechSynthesisVoice[] {
    if (this.availableVoices.length === 0 && typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.initVoices();
    }
    return this.availableVoices;
  }

  public getVoicesForLanguage(langCode: string): SpeechSynthesisVoice[] {
    const all = this.getVoices();
    const prefix = langCode.toLowerCase();
    const bcp = (LANG_BCP47_MAP[langCode] || langCode).toLowerCase();
    return all.filter((v) => {
      const l = v.lang.toLowerCase().replace('_', '-');
      return l.startsWith(prefix) || l.startsWith(bcp) || l.includes(prefix);
    });
  }

  public setVoice(voiceUri: string, restartIfPlaying: boolean = false) {
    this.selectedVoiceUri = voiceUri;
    if (this.isPlaying && restartIfPlaying) {
      this.playSegment(this.currentSegmentIndex, 0);
    }
  }

  public getCurrentLanguage(): string {
    return this.currentLanguageCode;
  }

  public setLanguage(langCode: string, newSegments?: TranscriptLine[]) {
    const prevLang = this.currentLanguageCode;
    this.currentLanguageCode = langCode;

    if (newSegments && newSegments.length > 0) {
      this.segments = newSegments;
    }

    if (this.selectedVoiceUri) {
      const currentVoice = this.getVoices().find((v) => v.voiceURI === this.selectedVoiceUri);
      if (currentVoice && !currentVoice.lang.toLowerCase().startsWith(langCode.toLowerCase())) {
        this.selectedVoiceUri = null;
      }
    }

    if (this.isPlaying && prevLang !== langCode) {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        try { window.speechSynthesis.cancel(); } catch { /* ignore */ }
      }
      this.playSegment(this.currentSegmentIndex);
    }
  }

  public getAudioContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.audioCtx) {
      const AudioContextClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioContextClass) {
        this.audioCtx = new AudioContextClass();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume().catch(() => {});
    }
    return this.audioCtx;
  }

  /**
   * Plays a signature public radio broadcast chime (4 notes: F4, A4, C5, F5)
   * Provides immediate, unmistakable audio feedback that sound output is live.
   */
  public playBroadcastStinger(customGain = 0.45): void {
    try {
      this.unlockAudio();
      const ctx = this.getAudioContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      const notes = [
        { freq: 349.23, start: 0, duration: 0.2 },     // F4
        { freq: 440.0, start: 0.14, duration: 0.22 },  // A4
        { freq: 523.25, start: 0.28, duration: 0.25 }, // C5
        { freq: 698.46, start: 0.45, duration: 0.75 }, // F5 high harmonic
      ];

      const masterVol = this.isMuted ? 0 : this.volume * customGain;

      notes.forEach(({ freq, start, duration }) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + start);

        gain.gain.setValueAtTime(0.0001, now + start);
        gain.gain.linearRampToValueAtTime(masterVol, now + start + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + start + duration);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + start);
        osc.stop(now + start + duration + 0.05);
      });
    } catch (e) {
      console.warn('Could not play broadcast stinger:', e);
    }
  }

  /**
   * Plays a delicate, high-frequency studio chime on segment transitions
   * so the user always hears audible acoustic progress through the podcast.
   */
  public playSegmentTransitionChime(): void {
    try {
      const ctx = this.getAudioContext();
      if (!ctx || this.isMuted) return;
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, now); // A5 gentle chime
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.linearRampToValueAtTime(this.volume * 0.08, now + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.15);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.18);
    } catch {
      // Best effort
    }
  }

  /**
   * Plays an audible, authentic broadcast radio acoustic bed while audio is active.
   * Features warm studio low-end resonance and soft rhythmic news pulse.
   */
  private startAmbientBed() {
    this.stopAmbientBed();
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;

      // 1. Warm studio room resonance
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(98.0, ctx.currentTime); // Low G warm studio floor

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(180, ctx.currentTime);

      const targetGain = this.isMuted ? 0 : this.volume * 0.06; // Clearly audible yet balanced behind voice
      gain.gain.setValueAtTime(0.0001, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(targetGain, ctx.currentTime + 0.8);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      this.ambientOsc = osc;
      this.ambientGain = gain;

      // 2. Subtle rhythmic broadcast presence tick every 2 seconds
      this.bedPulseTimer = setInterval(() => {
        if (!this.isPlaying || this.isMuted) return;
        try {
          const pCtx = this.getAudioContext();
          if (!pCtx) return;
          const pOsc = pCtx.createOscillator();
          const pGain = pCtx.createGain();
          pOsc.type = 'sine';
          pOsc.frequency.setValueAtTime(261.63, pCtx.currentTime); // C4 gentle pulse
          pGain.gain.setValueAtTime(0.0001, pCtx.currentTime);
          pGain.gain.linearRampToValueAtTime(this.volume * 0.025, pCtx.currentTime + 0.02);
          pGain.gain.exponentialRampToValueAtTime(0.0001, pCtx.currentTime + 0.18);
          pOsc.connect(pGain);
          pGain.connect(pCtx.destination);
          pOsc.start();
          pOsc.stop(pCtx.currentTime + 0.22);
        } catch {
          // ignore
        }
      }, 2000);
    } catch {
      // Ambient bed best-effort
    }
  }

  private stopAmbientBed() {
    if (this.bedPulseTimer) {
      clearInterval(this.bedPulseTimer);
      this.bedPulseTimer = null;
    }
    if (this.ambientGain && this.audioCtx) {
      try {
        this.ambientGain.gain.setValueAtTime(0.0001, this.audioCtx.currentTime);
      } catch {
        // ignore
      }
    }
    if (this.ambientOsc) {
      try {
        this.ambientOsc.stop();
        this.ambientOsc.disconnect();
      } catch {
        // ignore
      }
      this.ambientOsc = null;
    }
    this.ambientGain = null;
  }

  /**
   * Formant Voice Cadence Synthesizer (Fallback & Enhancer)
   * If the browser has no speech synthesis voices installed or speech synthesis fails/stays silent,
   * this generates audible voice frequencies matching the sentence length and speaker's vocal pitch!
   */
  private playFormantVoiceFallback(text: string, speaker: string, onEnd: () => void) {
    if (!this.isPlaying) return;

    try {
      const ctx = this.getAudioContext();
      if (!ctx) {
        // Advance after estimated duration
        const durationMs = Math.max(2000, text.split(' ').length * 350);
        this.fallbackVoiceTimer = setTimeout(() => {
          if (this.isPlaying) onEnd();
        }, durationMs / this.playbackRate);
        return;
      }

      // Base pitch based on speaker profile across all languages
      const isFemale =
        speaker.includes('Sarah') ||
        speaker.includes('Eleanor') ||
        speaker.includes('एलेनोर') ||
        speaker.includes('सारा') ||
        speaker.includes('Cynthia') ||
        speaker.includes('Isabella') ||
        speaker.includes('महिला');
      const baseFreq = isFemale ? 220 : 135;
      const words = text.split(/\s+/).filter(Boolean);
      const totalWords = Math.max(1, words.length);

      const syllableDuration = 0.20 / this.playbackRate;
      const totalDuration = totalWords * syllableDuration;
      const now = ctx.currentTime;
      const masterVol = this.isMuted ? 0 : Math.max(0.12, this.volume * 0.28);

      words.forEach((_, wIdx) => {
        const wordStart = now + wIdx * syllableDuration;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const formantFilter = ctx.createBiquadFilter();

        // Vary pitch slightly across sentence for natural speech prosody
        const pitchDrift = Math.sin(wIdx * 0.8) * 15;
        osc.type = isFemale ? 'sawtooth' : 'triangle';
        osc.frequency.setValueAtTime(baseFreq + pitchDrift, wordStart);

        // Vocal formant filter (mimics human throat and vocal tract)
        formantFilter.type = 'bandpass';
        formantFilter.frequency.setValueAtTime(isFemale ? 1100 : 800, wordStart);
        formantFilter.Q.setValueAtTime(3.5, wordStart);

        gain.gain.setValueAtTime(0.0001, wordStart);
        gain.gain.linearRampToValueAtTime(masterVol, wordStart + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.0001, wordStart + syllableDuration * 0.9);

        osc.connect(formantFilter);
        formantFilter.connect(gain);
        gain.connect(ctx.destination);

        osc.start(wordStart);
        osc.stop(wordStart + syllableDuration);
      });

      this.fallbackVoiceTimer = setTimeout(() => {
        if (this.isPlaying) onEnd();
      }, (totalDuration * 1000) + 300);
    } catch {
      this.fallbackVoiceTimer = setTimeout(() => {
        if (this.isPlaying) onEnd();
      }, 3000 / this.playbackRate);
    }
  }

  /**
   * Starts or resumes playback for a list of transcript segments
   */
  /**
   * Splits long paragraphs into natural, sentence-sized chunks (15-25 words max)
   * to permanently eliminate Chromium's 15-second speech buffer freeze bug.
   */
  private splitIntoSpeechChunks(text: string): string[] {
    if (!text || !text.trim()) return [];

    // Split on natural sentence boundaries across Latin, Cyrillic, CJK, Devanagari, Arabic
    const rawSentences = text
      .split(/(?<=[.?!;:\n।؟。！？])\s+/)
      .map((s) => s.trim())
      .filter(Boolean);

    const chunks: string[] = [];
    for (const sentence of rawSentences) {
      if (sentence.length <= 130) {
        chunks.push(sentence);
      } else {
        // Break long compound sentences into natural clause chunks
        const words = sentence.split(/\s+/);
        let curr = '';
        for (const w of words) {
          if ((curr + ' ' + w).trim().length > 115) {
            if (curr.trim()) chunks.push(curr.trim());
            curr = w;
          } else {
            curr = curr ? curr + ' ' + w : w;
          }
        }
        if (curr.trim()) chunks.push(curr.trim());
      }
    }
    return chunks.length > 0 ? chunks : [text.trim()];
  }

  /**
   * Starts or resumes playback for a list of transcript segments
   */
  public play(
    segments: TranscriptLine[],
    startSeconds: number,
    callbacks: AudioEngineCallbacks,
    langCode?: string
  ) {
    this.unlockAudio();

    if (langCode) {
      this.currentLanguageCode = langCode;
    }
    this.segments = segments;
    this.callbacks = callbacks;
    this.isPlaying = true;

    // Clear any previous hung speech synthesis state cleanly
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
      } catch {
        // ignore
      }
    }

    // Wake up Web Audio and trigger broadcast theme & ambiance
    this.playBroadcastStinger(0.45);
    this.startAmbientBed();

    // Determine starting segment based on startSeconds
    let startIndex = 0;
    for (let i = segments.length - 1; i >= 0; i--) {
      if (startSeconds >= segments[i].seconds) {
        startIndex = i;
        break;
      }
    }
    this.currentSegmentIndex = startIndex;

    // Small delay after cancel() before first speak so Chrome's IPC queue completely clears
    setTimeout(() => {
      if (this.isPlaying) {
        this.playSegment(this.currentSegmentIndex, 0);
      }
    }, 70);

    this.startKeepAlive();
    this.callbacks.onStateChange(true);
  }

  /**
   * Plays a single segment via sentence-chunked SpeechSynthesis,
   * completely avoiding buffer timeouts, with seamless fallback if TTS is silent.
   */
  private playSegment(index: number, chunkIndex: number = 0) {
    if (!this.isPlaying || index >= this.segments.length) {
      if (index >= this.segments.length) {
        this.stop();
        this.callbacks?.onTimeUpdate(0);
        this.callbacks?.onSegmentChange(0);
      }
      return;
    }

    if (this.fallbackVoiceTimer) {
      clearTimeout(this.fallbackVoiceTimer);
      this.fallbackVoiceTimer = null;
    }

    if (this.segmentWatchdogTimer) {
      clearTimeout(this.segmentWatchdogTimer);
      this.segmentWatchdogTimer = null;
    }

    const segment = this.segments[index];
    this.currentSegmentIndex = index;

    if (chunkIndex === 0) {
      this.callbacks?.onSegmentChange(index);
      this.callbacks?.onTimeUpdate(segment.seconds);
      this.playSegmentTransitionChime();
      this.activeChunks = this.splitIntoSpeechChunks(segment.text);
    }

    this.currentChunkIndex = chunkIndex;

    const hasSpeechApi = typeof window !== 'undefined' && 'speechSynthesis' in window;

    if (!hasSpeechApi) {
      this.playFormantVoiceFallback(segment.text, segment.speaker, () => {
        if (this.isPlaying) this.playSegment(index + 1, 0);
      });
      return;
    }

    const chunks = this.activeChunks.length > 0 ? this.activeChunks : [segment.text];
    const chunkText = chunks[chunkIndex] || segment.text;

    // Unpause synthesizer if stuck
    try {
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
      }
    } catch {
      // ignore
    }

    try {
      const utterance = new SpeechSynthesisUtterance(chunkText);
      this.currentUtterance = utterance;

      // Retain strong reference in global set to prevent GC collection in Chrome & Safari
      if (typeof window !== 'undefined') {
        if (!window.__pwActiveUtterances) {
          window.__pwActiveUtterances = new Set();
        }
        window.__pwActiveUtterances.add(utterance);
      }

      // Set target BCP-47 tag for precise linguistic phonology and native accent
      const targetLang = this.currentLanguageCode.toLowerCase();
      const targetBcp47 =
        LANG_BCP47_MAP[targetLang] ||
        `${targetLang}-${targetLang.toUpperCase()}`;
      utterance.lang = targetBcp47;

      utterance.rate = Math.max(0.85, Math.min(1.2, this.playbackRate));
      utterance.volume = this.isMuted ? 0 : Math.max(0.25, this.volume);
      utterance.pitch = (segment.speaker?.includes('Marcus') || segment.speaker?.includes('मार्कस'))
        ? 0.95
        : (segment.speaker?.includes('Sarah') || segment.speaker?.includes('Eleanor') || segment.speaker?.includes('एलेनोर') || segment.speaker?.includes('सारा'))
        ? 1.12
        : 1.0;

      // Voice matching: only match voices that truly support this language
      const voices = this.getVoices();
      let matchedVoice: SpeechSynthesisVoice | undefined;

      if (this.selectedVoiceUri) {
        const found = voices.find((v) => v.voiceURI === this.selectedVoiceUri);
        if (
          found &&
          (found.lang.toLowerCase().startsWith(targetLang) ||
            (targetLang === 'en' && found.lang.toLowerCase().startsWith('en')))
        ) {
          matchedVoice = found;
        }
      }

      if (!matchedVoice) {
        const langVoices = this.getVoicesForLanguage(targetLang);
        if (langVoices.length > 0) {
          matchedVoice =
            langVoices.find(
              (v) =>
                (v.name.includes('Natural') ||
                  v.name.includes('Google') ||
                  v.name.includes('Neural') ||
                  v.name.includes('Premium') ||
                  v.name.includes('Lekha') ||
                  v.name.includes('Hemant') ||
                  v.name.includes('Samantha') ||
                  v.name.includes('Daniel')) &&
                !v.name.includes('Compact')
            ) || langVoices[0];
        }
      }

      // CRITICAL: Only assign matchedVoice if it actually belongs to targetLang
      if (matchedVoice && (matchedVoice.lang.toLowerCase().startsWith(targetLang) || targetLang === 'en')) {
        utterance.voice = matchedVoice;
      }

      let hasStarted = false;
      let hasEnded = false;

      const cleanupUtterance = () => {
        if (typeof window !== 'undefined' && window.__pwActiveUtterances) {
          window.__pwActiveUtterances.delete(utterance);
        }
      };

      utterance.onstart = () => {
        hasStarted = true;
        if (this.segmentWatchdogTimer) {
          clearTimeout(this.segmentWatchdogTimer);
          this.segmentWatchdogTimer = null;
        }
        this.callbacks?.onSegmentChange(index);
      };

      utterance.onend = () => {
        if (hasEnded || !this.isPlaying) return;
        hasEnded = true;
        cleanupUtterance();

        const nextChunk = chunkIndex + 1;
        if (nextChunk < chunks.length) {
          // Play next chunk within current segment seamlessly (NO cancel() called!)
          setTimeout(() => {
            if (this.isPlaying) {
              this.playSegment(index, nextChunk);
            }
          }, 60 / this.playbackRate);
        } else {
          // All chunks for current segment completed; advance to next segment
          const nextIndex = index + 1;
          if (nextIndex < this.segments.length) {
            setTimeout(() => {
              if (this.isPlaying) {
                this.playSegment(nextIndex, 0);
              }
            }, 260 / this.playbackRate);
          } else {
            this.stop();
            this.callbacks?.onTimeUpdate(0);
            this.callbacks?.onSegmentChange(0);
          }
        }
      };

      utterance.onerror = (e) => {
        cleanupUtterance();
        if (e.error === 'canceled' || e.error === 'interrupted') return;
        console.warn('Speech synthesis segment chunk notice:', e.error);
        if (!hasEnded && this.isPlaying) {
          hasEnded = true;
          const nextChunk = chunkIndex + 1;
          if (nextChunk < chunks.length) {
            this.playSegment(index, nextChunk);
          } else {
            const nextIndex = index + 1;
            if (nextIndex < this.segments.length) {
              this.playSegment(nextIndex, 0);
            } else {
              this.stop();
            }
          }
        }
      };

      // Watchdog: 3500ms safety timer.
      // If neither onstart has fired nor is the browser actually outputting speech,
      // fallback to the formant synthesizer so the broadcast NEVER freezes.
      this.segmentWatchdogTimer = setTimeout(() => {
        const isSpeaking = typeof window !== 'undefined' && 'speechSynthesis' in window && window.speechSynthesis.speaking;
        if (this.isPlaying && !hasStarted && !isSpeaking && !hasEnded && this.currentSegmentIndex === index) {
          console.warn('Speech synthesis did not start within 3.5s, switching to vocal synthesizer fallback');
          cleanupUtterance();
          hasEnded = true;
          this.playFormantVoiceFallback(segment.text, segment.speaker, () => {
            if (this.isPlaying) this.playSegment(index + 1, 0);
          });
        }
      }, 3500);

      window.speechSynthesis.speak(utterance);
    } catch (err) {
      console.error('Failed to trigger speech synthesis:', err);
      this.playFormantVoiceFallback(segment.text, segment.speaker, () => {
        if (this.isPlaying) this.playSegment(index + 1, 0);
      });
    }
  }

  /**
   * Non-disruptive keep-alive: unpauses if browser paused unexpectedly,
   * without calling synchronous pause() which glitches Chromium.
   */
  private startKeepAlive() {
    this.stopKeepAlive();
    this.speechKeepAliveTimer = setInterval(() => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window && this.isPlaying) {
        if (window.speechSynthesis.paused) {
          window.speechSynthesis.resume();
        }
      }
    }, 4000);
  }

  private stopKeepAlive() {
    if (this.speechKeepAliveTimer) {
      clearInterval(this.speechKeepAliveTimer);
      this.speechKeepAliveTimer = null;
    }
  }

  public pause() {
    this.isPlaying = false;
    this.stopKeepAlive();
    this.stopAmbientBed();
    if (this.fallbackVoiceTimer) {
      clearTimeout(this.fallbackVoiceTimer);
      this.fallbackVoiceTimer = null;
    }
    if (this.segmentWatchdogTimer) {
      clearTimeout(this.segmentWatchdogTimer);
      this.segmentWatchdogTimer = null;
    }

    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try { window.speechSynthesis.cancel(); } catch { /* ignore */ }
    }
    if (typeof window !== 'undefined' && window.__pwActiveUtterances) {
      window.__pwActiveUtterances.clear();
    }
    this.callbacks?.onStateChange(false);
  }

  public stop() {
    this.isPlaying = false;
    this.stopKeepAlive();
    this.stopAmbientBed();
    if (this.fallbackVoiceTimer) {
      clearTimeout(this.fallbackVoiceTimer);
      this.fallbackVoiceTimer = null;
    }
    if (this.segmentWatchdogTimer) {
      clearTimeout(this.segmentWatchdogTimer);
      this.segmentWatchdogTimer = null;
    }

    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try { window.speechSynthesis.cancel(); } catch { /* ignore */ }
    }
    if (typeof window !== 'undefined' && window.__pwActiveUtterances) {
      window.__pwActiveUtterances.clear();
    }
    this.callbacks?.onStateChange(false);
  }

  public seekToSecond(seconds: number) {
    this.unlockAudio();
    let targetIndex = 0;
    for (let i = this.segments.length - 1; i >= 0; i--) {
      if (seconds >= this.segments[i].seconds) {
        targetIndex = i;
        break;
      }
    }

    this.currentSegmentIndex = targetIndex;
    this.callbacks?.onSegmentChange(targetIndex);
    this.callbacks?.onTimeUpdate(seconds);

    if (this.isPlaying) {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        try { window.speechSynthesis.cancel(); } catch { /* ignore */ }
      }
      setTimeout(() => {
        if (this.isPlaying) {
          this.playSegment(targetIndex, 0);
        }
      }, 50);
    }
  }

  public seekToSegment(index: number) {
    this.unlockAudio();
    if (index >= 0 && index < this.segments.length) {
      this.currentSegmentIndex = index;
      const targetSecs = this.segments[index].seconds;
      this.callbacks?.onSegmentChange(index);
      this.callbacks?.onTimeUpdate(targetSecs);

      if (this.isPlaying) {
        if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
          try { window.speechSynthesis.cancel(); } catch { /* ignore */ }
        }
        setTimeout(() => {
          if (this.isPlaying) {
            this.playSegment(index, 0);
          }
        }, 50);
      }
    }
  }

  public setPlaybackRate(rate: number) {
    this.playbackRate = rate;
    if (this.currentUtterance && this.isPlaying) {
      this.playSegment(this.currentSegmentIndex);
    }
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
    if (this.currentUtterance) {
      this.currentUtterance.volume = this.isMuted ? 0 : this.volume;
    }
    if (this.ambientGain && this.audioCtx) {
      try {
        const targetGain = this.isMuted ? 0 : this.volume * 0.06;
        this.ambientGain.gain.setValueAtTime(targetGain, this.audioCtx.currentTime);
      } catch {
        // ignore
      }
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    this.setVolume(this.volume);
  }

  public getBestVoiceForLanguage(targetLang: string): SpeechSynthesisVoice | undefined {
    const voices = this.getVoices();
    let matchedVoice: SpeechSynthesisVoice | undefined;

    if (this.selectedVoiceUri) {
      const found = voices.find((v) => v.voiceURI === this.selectedVoiceUri);
      if (
        found &&
        (found.lang.toLowerCase().startsWith(targetLang) ||
          (targetLang === 'en' && found.lang.toLowerCase().startsWith('en')))
      ) {
        matchedVoice = found;
      }
    }

    if (!matchedVoice) {
      const langVoices = this.getVoicesForLanguage(targetLang);
      if (langVoices.length > 0) {
        matchedVoice =
          langVoices.find(
            (v) =>
              (v.name.includes('Natural') ||
                v.name.includes('Google') ||
                v.name.includes('Neural') ||
                v.name.includes('Premium') ||
                v.name.includes('Lekha') ||
                v.name.includes('Hemant') ||
                v.name.includes('Samantha') ||
                v.name.includes('Daniel')) &&
              !v.name.includes('Compact')
          ) || langVoices[0];
      }
    }

    if (matchedVoice && (matchedVoice.lang.toLowerCase().startsWith(targetLang) || targetLang === 'en')) {
      return matchedVoice;
    }
    return undefined;
  }

  /**
   * Reads a complete news script in a single continuous, non-stop flow.
   * Strips ALL full stops, dots, commas, colons, danda, and punctuation marks
   * and pipelines chunks into the native Web Speech queue for zero-gap continuous speech.
   */
  public playContinuous(
    fullScript: string,
    callbacks: AudioEngineCallbacks,
    langCode?: string,
    useAmbientBed: boolean = false
  ): void {
    this.unlockAudio();

    if (langCode) {
      this.currentLanguageCode = langCode;
    }
    this.callbacks = callbacks;
    this.isPlaying = true;

    // Clear any existing speech synthesis queue before starting continuous read
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
      } catch {
        // ignore
      }
    }
    if (typeof window !== 'undefined' && window.__pwActiveUtterances) {
      window.__pwActiveUtterances.clear();
    }

    // Strip ALL pausing punctuation: full stops, dots, danda (।), commas, colons, semicolons, dashes, quotes, ellipsis, line breaks
    const cleanContinuousText = fullScript
      .replace(/[।\.!,;:?¿¡—–\-"'«»()\[\]{}\/\\*_~`…\r\n]+/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    if (!cleanContinuousText) {
      this.stop();
      return;
    }

    // Build balanced chunks (~26 words / <=200 chars each) so Chromium's 15s cutoff never triggers,
    // then pre-queue them straight into SpeechSynthesis queue for gapless flow.
    const words = cleanContinuousText.split(' ').filter(Boolean);
    const continuousChunks: string[] = [];
    let current = '';
    let wordCount = 0;
    for (const w of words) {
      const next = current ? `${current} ${w}` : w;
      if ((wordCount >= 24 || next.length > 190) && current) {
        continuousChunks.push(current);
        current = w;
        wordCount = 1;
      } else {
        current = next;
        wordCount += 1;
      }
    }
    if (current) {
      continuousChunks.push(current);
    }

    this.activeChunks = continuousChunks.length > 0 ? continuousChunks : [cleanContinuousText];
    this.currentChunkIndex = 0;
    this.segments = [
      {
        time: '00:00',
        seconds: 0,
        speaker: 'Narrator',
        text: cleanContinuousText,
      },
    ];

    if (useAmbientBed) {
      this.startAmbientBed();
    } else {
      this.stopAmbientBed();
    }
    this.startKeepAlive();
    this.callbacks.onStateChange(true);

    setTimeout(() => {
      if (this.isPlaying) {
        this.enqueueContinuousPipeline();
      }
    }, 35);
  }

  private enqueueContinuousPipeline(): void {
    if (!this.isPlaying || this.activeChunks.length === 0) {
      this.stop();
      return;
    }

    const hasSpeechApi = typeof window !== 'undefined' && 'speechSynthesis' in window;
    if (!hasSpeechApi) {
      this.runContinuousFallback(0);
      return;
    }

    try {
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
      }
    } catch {
      // ignore
    }

    const targetLang = this.currentLanguageCode.toLowerCase();
    const bcpLang = LANG_BCP47_MAP[targetLang] || `${targetLang}-${targetLang.toUpperCase()}`;
    const matchedVoice = this.getBestVoiceForLanguage(targetLang);

    if (typeof window !== 'undefined' && !window.__pwActiveUtterances) {
      window.__pwActiveUtterances = new Set();
    }

    const totalChunks = this.activeChunks.length;

    // Queue all chunks directly into browser's native speech synthesis pipeline so transitions are gapless
    this.activeChunks.forEach((chunkText, idx) => {
      try {
        const utterance = new SpeechSynthesisUtterance(chunkText);
        if (idx === 0) {
          this.currentUtterance = utterance;
        }
        window.__pwActiveUtterances?.add(utterance);

        utterance.lang = bcpLang;
        utterance.rate = Math.max(0.95, Math.min(1.25, this.playbackRate));
        utterance.volume = this.isMuted ? 0 : Math.max(0.25, this.volume);
        utterance.pitch = 1.0;

        if (matchedVoice) {
          utterance.voice = matchedVoice;
        }

        utterance.onstart = () => {
          if (!this.isPlaying) return;
          this.currentChunkIndex = idx;
          this.currentUtterance = utterance;
          this.callbacks?.onSegmentChange(0);
        };

        utterance.onend = () => {
          window.__pwActiveUtterances?.delete(utterance);
          if (!this.isPlaying) return;
          if (idx === totalChunks - 1) {
            this.stop();
            this.callbacks?.onTimeUpdate(0);
            this.callbacks?.onSegmentChange(0);
          }
        };

        utterance.onerror = (e) => {
          window.__pwActiveUtterances?.delete(utterance);
          if (e.error === 'canceled' || e.error === 'interrupted') return;
          if (idx === totalChunks - 1 && this.isPlaying) {
            this.stop();
            this.callbacks?.onTimeUpdate(0);
          }
        };

        window.speechSynthesis.speak(utterance);
      } catch {
        // continue queueing remaining chunks
      }
    });
  }

  private runContinuousFallback(chunkIdx: number): void {
    if (!this.isPlaying || chunkIdx >= this.activeChunks.length) {
      this.stop();
      this.callbacks?.onTimeUpdate(0);
      this.callbacks?.onSegmentChange(0);
      return;
    }
    this.currentChunkIndex = chunkIdx;
    this.playFormantVoiceFallback(this.activeChunks[chunkIdx], 'Narrator', () => {
      if (this.isPlaying) {
        this.runContinuousFallback(chunkIdx + 1);
      }
    });
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }

  /**
   * Tests both speech synthesis and broadcast audio stinger with a greeting in current language
   */
  public testVoiceSample(langCode = this.currentLanguageCode, callback?: () => void) {
    this.unlockAudio();
    this.playBroadcastStinger(0.5);

    const greeting = SAMPLE_AUDIO_GREETINGS[langCode] || SAMPLE_AUDIO_GREETINGS.en;
    const testSegment: TranscriptLine = {
      time: '00:00',
      seconds: 0,
      speaker: 'Politics World Bureau',
      text: greeting,
    };

    setTimeout(() => {
      this.play(
        [testSegment],
        0,
        {
          onTimeUpdate: () => {},
          onSegmentChange: () => {},
          onStateChange: () => {},
        },
        langCode
      );
      if (callback) callback();
    }, 450);
  }
}

// Global singleton instance
export const podcastAudioEngine = new PodcastAudioEngine();
