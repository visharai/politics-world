import React, { useState, useEffect, useRef, useMemo } from 'react';
import { PodcastEpisode, TranscriptSegment } from '../data/podcastData';
import { podcastAudioEngine } from '../utils/podcastAudio';
import { useLanguage } from '../context/LanguageContext';
import { gnewsService } from '../services/gnewsService';
import { liveNewsService } from '../services/liveNewsService';
import {
  Play,
  Pause,
  RotateCcw,
  RotateCw,
  Volume2,
  VolumeX,
  Headphones,
  Radio,
  Clock,
  Share2,
  FileText,
  ChevronDown,
  ChevronUp,
  Check,
  Mic,
  Music,
  Bell,
  RefreshCw,
} from 'lucide-react';

export const PodcastSection: React.FC = () => {
  const { t, langCode } = useLanguage();
  const [livePodcastEpisodes, setLivePodcastEpisodes] = useState<PodcastEpisode[]>([]);
  const [isRefreshingPodcasts, setIsRefreshingPodcasts] = useState(false);

  // Proactively generate live audio dispatches from today's real breaking GNews stories
  const loadLivePodcasts = async () => {
    setIsRefreshingPodcasts(true);
    try {
      const wireDispatches = await liveNewsService.getLiveWire('all', '', langCode);
      if (wireDispatches && wireDispatches.length > 0) {
        const liveEps = gnewsService.generateLivePodcastEpisodesList(wireDispatches, langCode);
        setLivePodcastEpisodes(liveEps);
      }
    } catch (err) {
      console.warn('Live podcast generation note:', err);
    } finally {
      setIsRefreshingPodcasts(false);
    }
  };

  useEffect(() => {
    loadLivePodcasts();
    const interval = setInterval(loadLivePodcasts, 2 * 60 * 1000);
    return () => clearInterval(interval);
  }, [langCode]);

  const episodesList = useMemo(() => {
    if (livePodcastEpisodes.length > 0) {
      return livePodcastEpisodes;
    }
    return gnewsService.generateLivePodcastEpisodesList([], langCode);
  }, [livePodcastEpisodes, langCode]);

  const [currentEpisode, setCurrentEpisode] = useState<PodcastEpisode>(() => episodesList[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [activeSegmentIndex, setActiveSegmentIndex] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [continuousFlow, setContinuousFlow] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.85);
  const [showTranscript, setShowTranscript] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoiceUri, setSelectedVoiceUri] = useState<string>('');
  const [audioFeedbackNotice, setAudioFeedbackNotice] = useState<string>('');

  const progressIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Synchronize current episode when language widget changes
  useEffect(() => {
    const updated = episodesList.find((ep) => ep.id === currentEpisode.id) || episodesList[0];
    setCurrentEpisode(updated);
    podcastAudioEngine.setLanguage(langCode, updated.transcriptSample);
    
    // Select best matching voice for current language
    const langVoices = podcastAudioEngine.getVoicesForLanguage(langCode);
    if (langVoices.length > 0) {
      setSelectedVoiceUri(langVoices[0].voiceURI);
      podcastAudioEngine.setVoice(langVoices[0].voiceURI, false);
    }
  }, [langCode, episodesList]);

  // Initialize available speech synthesis voices
  useEffect(() => {
    const loadVoices = () => {
      const vList = podcastAudioEngine.getVoices();
      if (vList && vList.length > 0) {
        // Deduplicate voices by unique identifier to prevent duplicate entries
        const uniqueMap = new Map<string, SpeechSynthesisVoice>();
        for (const v of vList) {
          const uniqueKey = `${v.voiceURI || v.name}::${v.lang}`;
          if (!uniqueMap.has(uniqueKey)) {
            uniqueMap.set(uniqueKey, v);
          }
        }
        const dedupedList = Array.from(uniqueMap.values());
        setVoices(dedupedList);

        const langVoices = podcastAudioEngine.getVoicesForLanguage(langCode);
        if (langVoices.length > 0) {
          setSelectedVoiceUri(langVoices[0].voiceURI);
          podcastAudioEngine.setVoice(langVoices[0].voiceURI);
        } else if (!selectedVoiceUri) {
          const defaultVoice = dedupedList.find((v) => v.lang.startsWith(langCode)) || dedupedList.find((v) => v.lang.startsWith('en')) || dedupedList[0];
          if (defaultVoice) setSelectedVoiceUri(defaultVoice.voiceURI);
        }
      }
    };

    loadVoices();
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }

    return () => {
      podcastAudioEngine.stop();
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    };
  }, [langCode]);

  // When playing, smoothly advance current time between segment markers
  useEffect(() => {
    if (isPlaying) {
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= currentEpisode.durationSeconds) {
            handlePause();
            return 0;
          }
          return prev + 1;
        });
      }, 1000 / playbackSpeed);
    } else {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
        progressIntervalRef.current = null;
      }
    }

    return () => {
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    };
  }, [isPlaying, playbackSpeed, currentEpisode.durationSeconds]);

  const handlePlay = (startTime = currentTime) => {
    podcastAudioEngine.unlockAudio();
    setIsPlaying(true);
    podcastAudioEngine.setVolume(volume);
    podcastAudioEngine.setMuted(isMuted);
    podcastAudioEngine.setPlaybackRate(playbackSpeed);

    if (continuousFlow) {
      const fullContinuousScript = currentEpisode.transcriptSample.map((s) => s.text).join(' ');
      podcastAudioEngine.playContinuous(
        fullContinuousScript,
        {
          onTimeUpdate: (sec) => {
            setCurrentTime(sec);
          },
          onSegmentChange: (idx) => {
            setActiveSegmentIndex(idx);
          },
          onStateChange: (playingState) => {
            setIsPlaying(playingState);
          },
        },
        langCode
      );
      return;
    }

    podcastAudioEngine.play(
      currentEpisode.transcriptSample,
      startTime,
      {
        onTimeUpdate: (sec) => {
          setCurrentTime(sec);
        },
        onSegmentChange: (idx) => {
          setActiveSegmentIndex(idx);
        },
        onStateChange: (playingState) => {
          setIsPlaying(playingState);
        },
        onError: () => {
          // Handled gracefully in engine
        }
      },
      langCode
    );
  };

  const handlePause = () => {
    setIsPlaying(false);
    podcastAudioEngine.pause();
  };

  const handleTogglePlay = () => {
    podcastAudioEngine.unlockAudio();
    if (isPlaying) {
      handlePause();
    } else {
      handlePlay(currentTime);
    }
  };

  const handleSelectEpisode = (ep: PodcastEpisode) => {
    podcastAudioEngine.unlockAudio();
    if (currentEpisode.id === ep.id) {
      handleTogglePlay();
    } else {
      podcastAudioEngine.stop();
      setCurrentEpisode(ep);
      setCurrentTime(0);
      setActiveSegmentIndex(0);
      setIsPlaying(true);
      // Play immediately with audio feedback
      setTimeout(() => {
        podcastAudioEngine.unlockAudio();
        podcastAudioEngine.setVolume(volume);
        podcastAudioEngine.setMuted(isMuted);
        podcastAudioEngine.setPlaybackRate(playbackSpeed);
        podcastAudioEngine.play(
          ep.transcriptSample,
          0,
          {
            onTimeUpdate: (sec) => setCurrentTime(sec),
            onSegmentChange: (idx) => setActiveSegmentIndex(idx),
            onStateChange: (state) => setIsPlaying(state),
          },
          langCode
        );
      }, 50);
    }
  };

  const handleSkip = (seconds: number) => {
    podcastAudioEngine.unlockAudio();
    const newTime = Math.min(
      Math.max(0, currentTime + seconds),
      currentEpisode.durationSeconds
    );
    setCurrentTime(newTime);
    podcastAudioEngine.seekToSecond(newTime);
  };

  const handleSeekProgress = (clickPos: number) => {
    podcastAudioEngine.unlockAudio();
    const targetSeconds = Math.floor(clickPos * currentEpisode.durationSeconds);
    setCurrentTime(targetSeconds);
    podcastAudioEngine.seekToSecond(targetSeconds);
  };

  const handleSelectSegment = (idx: number, segment: TranscriptSegment) => {
    podcastAudioEngine.unlockAudio();
    setActiveSegmentIndex(idx);
    setCurrentTime(segment.seconds);
    if (!isPlaying) {
      setIsPlaying(true);
    }
    podcastAudioEngine.seekToSegment(idx);
  };

  const handleCycleSpeed = () => {
    const speeds = [1, 1.25, 1.5, 2];
    const nextIdx = (speeds.indexOf(playbackSpeed) + 1) % speeds.length;
    const nextSpeed = speeds[nextIdx];
    setPlaybackSpeed(nextSpeed);
    podcastAudioEngine.setPlaybackRate(nextSpeed);
  };

  const handleVolumeChange = (newVol: number) => {
    setVolume(newVol);
    if (isMuted && newVol > 0) setIsMuted(false);
    podcastAudioEngine.setVolume(newVol);
    podcastAudioEngine.setMuted(false);
  };

  const handleToggleMute = () => {
    const nextMute = !isMuted;
    setIsMuted(nextMute);
    podcastAudioEngine.setMuted(nextMute);
  };

  const handleVoiceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const uri = e.target.value;
    setSelectedVoiceUri(uri);
    podcastAudioEngine.setVoice(uri, true);
  };

  const handleTestChime = () => {
    podcastAudioEngine.unlockAudio();
    podcastAudioEngine.playBroadcastStinger(0.5);
    setAudioFeedbackNotice('Broadcast Chime Played');
    setTimeout(() => setAudioFeedbackNotice(''), 2500);
  };

  const handleTestVoice = () => {
    podcastAudioEngine.unlockAudio();
    setAudioFeedbackNotice('Testing Audio & Speech...');
    podcastAudioEngine.testVoiceSample(langCode, () => {
      setAudioFeedbackNotice('Voice & Sound Verified Active');
      setTimeout(() => setAudioFeedbackNotice(''), 3000);
    });
  };

  const handleShare = (e: React.MouseEvent, ep: PodcastEpisode) => {
    e.stopPropagation();
    try {
      navigator.clipboard?.writeText(window.location.origin + '#podcast-' + ep.id);
      setCopiedId(ep.id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      // ignore
    }
  };

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const rem = Math.floor(secs % 60);
    return `${mins}:${rem < 10 ? '0' : ''}${rem}`;
  };

  const progressPercentage = Math.min(
    100,
    (currentTime / currentEpisode.durationSeconds) * 100
  );

  const currentSegment = currentEpisode.transcriptSample[activeSegmentIndex] || currentEpisode.transcriptSample[0];

  return (
    <section id="audio-digest" className="w-full bg-[#060c1d] border-b border-[#172750] py-14 sm:py-20 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 mb-10 border-b border-[#16274e]">
          <div>
            <div className="text-xs font-bold uppercase tracking-widest text-sky-400 mb-2 flex items-center gap-2">
              <Headphones className="w-4 h-4 text-sky-400" />
              <span>Broadcast & Audio Journalism</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-serif font-bold text-white tracking-tight [text-wrap:balance]">
              {t.podcastTitle}
            </h2>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <p className="text-xs sm:text-sm text-slate-400 max-w-md font-sans">
              {t.podcastSubtitle}
            </p>
            {/* Audio & Voice Quick Verification Controls */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={handleTestChime}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-mono uppercase tracking-wider text-sky-300 hover:text-white bg-[#0e1d42] hover:bg-[#162e66] border border-[#1d366e] rounded-sm transition-colors cursor-pointer"
                title="Test audio output by playing the signature broadcast chime"
              >
                <Bell className="w-3.5 h-3.5 text-sky-400" />
                <span>Chime Test</span>
              </button>

              <button
                onClick={handleTestVoice}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-mono uppercase tracking-wider text-emerald-300 hover:text-white bg-[#0a232c] hover:bg-[#113a48] border border-emerald-600/40 rounded-sm transition-colors cursor-pointer"
                title="Test speech synthesis and vocal audio output in active language"
              >
                <Mic className="w-3.5 h-3.5 text-emerald-400" />
                <span>Voice Test</span>
              </button>
            </div>
          </div>
        </div>

        {/* Master Playable Audio Widget */}
        <div className="bg-[#08132e] border border-[#1a2d59] rounded-sm p-6 sm:p-8 mb-12 shadow-2xl relative overflow-hidden">
          {/* Subtle Ambient Accent Glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-sky-500/5 rounded-full blur-3xl pointer-events-none" />

          {/* Episode Info Banner */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-[#142347]">
            <div className="space-y-1.5 flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-slate-400">
                <span className="text-sky-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <Radio className="w-3.5 h-3.5" />
                  {currentEpisode.series}
                </span>
                <span aria-hidden="true" className="text-slate-600">·</span>
                <span>Episode #{currentEpisode.episodeNumber}</span>
                <span aria-hidden="true" className="text-slate-600">·</span>
                <span>{currentEpisode.date}</span>
                <span aria-hidden="true" className="text-slate-600">·</span>
                <span className="text-emerald-400 flex items-center gap-1">
                  <Mic className="w-3 h-3" />
                  Speech Synthesis Audio
                </span>
              </div>

              <h3 className="text-xl sm:text-2xl lg:text-3xl font-serif font-bold text-white tracking-tight leading-snug">
                {currentEpisode.title}
              </h3>

              <p className="text-xs sm:text-sm text-slate-300 font-sans leading-relaxed line-clamp-2 max-w-3xl">
                {currentEpisode.description}
              </p>

              <div className="pt-1 flex flex-wrap items-center gap-3 text-xs text-slate-400 font-sans">
                <span>
                  Host: <strong className="text-slate-200">{currentEpisode.host}</strong> ({currentEpisode.hostRole})
                </span>
                {isPlaying && currentSegment && (
                  <span className="text-sky-300 font-mono text-[11px] bg-[#0c1a3b] px-2 py-0.5 rounded-xs border border-[#1b3469] flex items-center gap-1.5 animate-pulse">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    Now Speaking: <strong>{currentSegment.speaker}</strong>
                  </span>
                )}
              </div>
            </div>

            {/* Live Visualizer Equalizer when playing */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 shrink-0">
              {audioFeedbackNotice && (
                <div className="text-[11px] font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-500/30 px-2.5 py-1 rounded-sm animate-in fade-in">
                  ✓ {audioFeedbackNotice}
                </div>
              )}

              <div className="flex items-center gap-1 h-9 px-3.5 py-1.5 bg-[#050b1a] border border-[#142347] rounded-sm">
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 mr-2 flex items-center gap-1">
                  {isPlaying ? (
                    <>
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
                      <span className="text-emerald-300 font-semibold">{t.streamingAudio}</span>
                    </>
                  ) : (
                    <span>{t.paused}</span>
                  )}
                </span>
                {[45, 80, 60, 95, 65, 85, 50, 90, 70, 55].map((height, idx) => (
                  <div
                    key={idx}
                    className={`w-1 rounded-full transition-all duration-200 ${
                      isPlaying
                        ? 'bg-gradient-to-t from-sky-500 to-sky-300 animate-pulse'
                        : 'bg-slate-700'
                    }`}
                    style={{
                      height: isPlaying
                        ? `${Math.max(25, (height * (idx % 2 === 0 ? 0.9 : 1.15)) % 100)}%`
                        : '25%',
                    }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Interactive Player Controls & Scrubber */}
          <div className="pt-6 space-y-4">
            {/* Scrubber Progress Bar */}
            <div className="space-y-1.5">
              <div
                className="w-full bg-[#050b1a] h-2.5 rounded-full overflow-hidden relative cursor-pointer border border-[#132145] group"
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const clickPos = (e.clientX - rect.left) / rect.width;
                  handleSeekProgress(clickPos);
                }}
              >
                <div
                  className="bg-sky-400 h-full transition-all duration-150 relative"
                  style={{ width: `${progressPercentage}%` }}
                >
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3.5 h-3.5 bg-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>

              <div className="flex items-center justify-between text-xs font-mono text-slate-400 tabular-nums">
                <span className="text-sky-300 font-semibold">{formatTime(currentTime)}</span>
                <span className="text-slate-500">Segment {activeSegmentIndex + 1} of {currentEpisode.transcriptSample.length}</span>
                <span>{currentEpisode.durationFormatted}</span>
              </div>
            </div>

            {/* Playback Control Buttons */}
            <div className="flex flex-wrap items-center justify-between gap-4">
              {/* Left Play Controls */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleSkip(-15)}
                  className="p-2 text-slate-400 hover:text-white transition-colors cursor-pointer flex items-center gap-1 text-xs font-mono"
                  title="Rewind 15 seconds"
                  aria-label="Rewind 15 seconds"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span className="hidden sm:inline">15s</span>
                </button>

                {/* Primary Master Play Button with explicit audio label */}
                <button
                  onClick={handleTogglePlay}
                  className="px-4 py-2.5 rounded-full bg-sky-400 hover:bg-sky-300 active:bg-sky-500 text-[#060c1d] flex items-center gap-2.5 transition-all cursor-pointer shadow-lg hover:scale-102 font-medium text-xs sm:text-sm font-sans"
                  aria-label={isPlaying ? 'Pause broadcast' : 'Play broadcast with sound'}
                  title={isPlaying ? 'Pause broadcast' : 'Play broadcast with sound'}
                >
                  {isPlaying ? (
                    <>
                      <Pause className="w-4 h-4 fill-current" />
                      <span>{langCode === 'hi' ? 'रोकें (Pause)' : 'Pause'}</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 fill-current ml-0.5" />
                      <span className="font-semibold">{langCode === 'hi' ? 'ध्वनि के साथ पॉडकास्ट सुनें' : 'Play Broadcast With Sound'}</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => handleSkip(15)}
                  className="p-2 text-slate-400 hover:text-white transition-colors cursor-pointer flex items-center gap-1 text-xs font-mono"
                  title="Skip forward 15 seconds"
                  aria-label="Skip forward 15 seconds"
                >
                  <RotateCw className="w-4 h-4" />
                  <span className="hidden sm:inline">15s</span>
                </button>

                {/* Speed Multiplier */}
                <button
                  onClick={handleCycleSpeed}
                  className="px-2.5 py-1 bg-[#050b1a] border border-[#182a55] hover:border-sky-400 text-sky-400 rounded-sm text-xs font-mono tabular-nums cursor-pointer transition-colors"
                  title="Playback Speed"
                >
                  {playbackSpeed}x
                </button>

                {/* Sound Output Quick Verification */}
                <button
                  onClick={handleTestVoice}
                  className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-950/40 hover:bg-emerald-900/60 border border-emerald-500/40 text-emerald-300 hover:text-white rounded-sm text-xs font-mono cursor-pointer transition-colors"
                  title="Test voice synthesis and broadcast sound"
                >
                  <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{langCode === 'hi' ? 'आवाज़ टेस्ट' : 'Sound Test'}</span>
                </button>

                {/* Non-Stop Continuous Flow Reading Toggle */}
                <button
                  onClick={() => {
                    const next = !continuousFlow;
                    setContinuousFlow(next);
                    if (isPlaying) {
                      handlePause();
                    }
                  }}
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-sm text-xs font-mono transition-all cursor-pointer ${
                    continuousFlow
                      ? 'bg-amber-400 text-slate-950 font-bold border border-amber-300 shadow-sm'
                      : 'bg-[#091533] text-amber-300 border border-amber-500/30 hover:border-amber-400'
                  }`}
                  title={langCode === 'hi' ? 'बिना रुके लगातार (Non-Stop) एक ही प्रवाह में पढ़ें' : 'Read script in a single non-stop continuous flow'}
                >
                  <span>⚡ {langCode === 'hi' ? (continuousFlow ? 'नॉन-स्टॉप प्रवाह सक्रिय' : 'नॉन-स्टॉप प्रवाह') : (continuousFlow ? 'Non-Stop Active' : 'Non-Stop Flow')}</span>
                </button>
              </div>

              {/* Volume, Voice Selector & Transcript Toggles */}
              <div className="flex items-center flex-wrap gap-4">
                {/* Voice Selection Dropdown */}
                {voices.length > 0 && (
                  <div className="hidden md:flex items-center gap-2 text-xs text-slate-400 font-mono">
                    <Mic className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                    <select
                      value={selectedVoiceUri}
                      onChange={handleVoiceChange}
                      className="bg-[#050b1a] text-slate-200 border border-[#142347] hover:border-sky-500/60 rounded-xs px-2 py-1 text-[11px] focus:outline-none cursor-pointer max-w-[170px] truncate"
                      title="Select speech synthesis narrator voice"
                    >
                      {voices.map((v, idx) => (
                        <option
                          key={`${v.voiceURI || v.name || 'voice'}-${v.lang}-${idx}`}
                          value={v.voiceURI}
                        >
                          {v.name} ({v.lang})
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Volume Slider */}
                <div className="flex items-center gap-2 text-slate-400">
                  <button
                    onClick={handleToggleMute}
                    className="p-1 hover:text-white transition-colors cursor-pointer"
                    aria-label={isMuted ? 'Unmute' : 'Mute'}
                    title={isMuted ? 'Unmute' : 'Mute'}
                  >
                    {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4" />}
                  </button>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={isMuted ? 0 : volume}
                    onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                    className="w-16 sm:w-20 accent-sky-400 h-1 cursor-pointer bg-slate-700 rounded-lg"
                    aria-label="Volume slider"
                  />
                  <span className="text-[10px] font-mono text-slate-500 tabular-nums w-7">
                    {isMuted ? '0%' : `${Math.round(volume * 100)}%`}
                  </span>
                </div>

                <button
                  onClick={() => setShowTranscript(!showTranscript)}
                  className={`flex items-center gap-1.5 text-xs transition-colors cursor-pointer px-3 py-1.5 rounded-sm border ${
                    showTranscript
                      ? 'bg-[#0f1f45] border-sky-400 text-sky-300'
                      : 'bg-[#050b1a] border-[#142347] text-slate-300 hover:text-sky-300'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5 text-sky-400" />
                  <span>{t.transcript}</span>
                  {showTranscript ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {/* Interactive Live Transcript Drawer */}
            {showTranscript && (
              <div className="mt-5 p-5 sm:p-6 rounded-sm bg-[#050b1a] border border-[#142347] text-xs font-sans text-slate-300 space-y-3 leading-relaxed animate-in fade-in duration-200">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#122042] text-slate-400 font-mono gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sky-400 font-semibold uppercase">Verbatim Spoken Transcript</span>
                    <span className="text-slate-600">·</span>
                    <span className="text-[11px] text-slate-400">Click any paragraph to jump and speak immediately</span>
                  </div>
                  <span className="text-[11px] text-emerald-400 flex items-center gap-1">
                    <Music className="w-3 h-3" />
                    Real-time speech synchronization
                  </span>
                </div>

                <div className="space-y-2 pt-1">
                  {currentEpisode.transcriptSample.map((segment, idx) => {
                    const isActive = activeSegmentIndex === idx;
                    return (
                      <div
                        key={idx}
                        onClick={() => handleSelectSegment(idx, segment)}
                        className={`group p-3 rounded-sm transition-all duration-150 cursor-pointer flex gap-3 border ${
                          isActive
                            ? 'bg-[#0c1a3d] border-sky-400/80 shadow-md text-white'
                            : 'bg-transparent border-transparent hover:bg-[#08122c] hover:border-[#162953] text-slate-300'
                        }`}
                      >
                        <span className={`font-mono shrink-0 tabular-nums text-xs mt-0.5 ${
                          isActive ? 'text-sky-300 font-bold' : 'text-slate-500 group-hover:text-sky-400'
                        }`}>
                          [{segment.time}]
                        </span>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <strong className={`font-semibold ${isActive ? 'text-sky-300' : 'text-slate-200'}`}>
                              {segment.speaker}
                            </strong>
                            {isActive && isPlaying && (
                              <span className="inline-flex items-center gap-1 text-[10px] font-mono text-emerald-400 uppercase tracking-wider bg-emerald-950/60 px-1.5 py-0.2 rounded-xs border border-emerald-500/30">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                                Speaking
                              </span>
                            )}
                          </div>
                          <p className={`leading-relaxed text-xs sm:text-[13px] ${isActive ? 'text-slate-100 font-medium' : 'text-slate-300'}`}>
                            &ldquo;{segment.text}&rdquo;
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Episode Catalog Cards (Clean Dark-Blue Theme) */}
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-6 border-b border-[#172750]">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 uppercase tracking-widest mb-1">
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500" />
                </span>
                <span>{langCode === 'hi' ? 'लाइव ऑडियो समाचार प्रसारण' : 'Real-Time News Audio Broadcast'}</span>
              </div>
              <h4 className="text-sm sm:text-base font-bold uppercase tracking-widest text-white">
                {langCode === 'hi' ? 'ताज़ा लाइव प्रसारण एवं रीयल-टाइम पॉडकास्ट बुलेटिन' : 'Recent Broadcast Dispatches & Live Audio Editions'}
              </h4>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-[11px] text-emerald-300 bg-emerald-950/60 border border-emerald-500/30 px-2.5 py-1 rounded-sm font-mono flex items-center gap-1.5">
                <Radio className="w-3 h-3 text-emerald-400 animate-pulse" />
                <span>{langCode === 'hi' ? 'लाइव ऑडियो 24/7' : 'Live Audio 24/7'}</span>
              </span>
              <button
                onClick={loadLivePodcasts}
                disabled={isRefreshingPodcasts}
                className="px-2.5 py-1 bg-[#091533] hover:bg-[#10224d] border border-[#1e3364] text-slate-300 hover:text-white rounded-sm text-xs font-mono transition-colors cursor-pointer flex items-center gap-1.5"
                title="Refresh live podcast episodes from latest news"
              >
                <RefreshCw className={`w-3 h-3 text-cyan-400 ${isRefreshingPodcasts ? 'animate-spin' : ''}`} />
                <span>{langCode === 'hi' ? 'ताज़ा करें' : 'Refresh Audio'}</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {episodesList.map((episode) => {
              const isCurrent = currentEpisode.id === episode.id;
              const isCurrentlyPlayingThis = isCurrent && isPlaying;

              return (
                <div
                  key={episode.id}
                  onClick={() => handleSelectEpisode(episode)}
                  className={`p-6 rounded-sm border transition-all duration-200 cursor-pointer flex flex-col justify-between group ${
                    isCurrent
                      ? 'bg-[#0a1738] border-sky-400/60 shadow-lg'
                      : 'bg-[#08132e] border-[#172750] hover:border-[#223a73] hover:bg-[#0b1636]'
                  }`}
                >
                  <div>
                    {/* Header: Series, Episode Number, Date */}
                    <div className="flex items-center justify-between text-xs text-slate-400 mb-2 font-mono">
                      <div className="flex items-center gap-2">
                        <span className="text-sky-400 font-semibold uppercase">{episode.series}</span>
                        <span aria-hidden="true" className="text-slate-600">·</span>
                        <span>Ep #{episode.episodeNumber}</span>
                      </div>
                      <span className="flex items-center gap-1 text-slate-400 tabular-nums">
                        <Clock className="w-3 h-3 text-slate-500" />
                        {episode.durationFormatted}
                      </span>
                    </div>

                    {/* Title */}
                    <h5 className="text-lg font-serif font-bold text-white group-hover:text-sky-300 transition-colors leading-snug mb-2.5 [text-wrap:balance]">
                      {episode.title}
                    </h5>

                    {/* Excerpt */}
                    <p className="text-xs sm:text-sm text-slate-300 font-sans leading-relaxed line-clamp-3 mb-4">
                      {episode.description}
                    </p>

                    {/* Pull Quote Highlight */}
                    <div className="p-3 bg-[#050b1a] border border-[#132247] rounded-xs mb-4 text-xs font-serif italic text-slate-300">
                      &ldquo;{episode.keyQuotes}&rdquo;
                    </div>

                    {/* Topics Unboxed (Zero-pill discipline) */}
                    <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-400 font-sans mb-4">
                      <span className="text-slate-500">Topics:</span>
                      {episode.topics.map((item, idx) => (
                        <span key={idx} className="text-slate-300">
                          {item}{idx < episode.topics.length - 1 ? ' ·' : ''}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Card Footer: Host & Play Action */}
                  <div className="pt-4 border-t border-[#132247] flex items-center justify-between text-xs">
                    <div>
                      <span className="text-slate-200 font-semibold block">{episode.host}</span>
                      <span className="text-[11px] text-slate-400">{episode.date}</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        onClick={(e) => handleShare(e, episode)}
                        className="p-1.5 text-slate-400 hover:text-white transition-colors cursor-pointer"
                        title="Copy episode link"
                      >
                        {copiedId === episode.id ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelectEpisode(episode);
                        }}
                        className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-sm text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer ${
                          isCurrentlyPlayingThis
                            ? 'bg-sky-400 text-[#060c1d]'
                            : isCurrent
                            ? 'bg-[#152752] text-sky-300 hover:bg-sky-400 hover:text-[#060c1d]'
                            : 'bg-[#0e1d42] text-slate-200 group-hover:bg-sky-400 group-hover:text-[#060c1d]'
                        }`}
                      >
                        {isCurrentlyPlayingThis ? (
                          <>
                            <Pause className="w-3.5 h-3.5 fill-current" />
                            <span>Playing Audio</span>
                          </>
                        ) : (
                          <>
                            <Play className="w-3.5 h-3.5 fill-current" />
                            <span>Listen ({episode.durationFormatted})</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
};
