import React, { useState, useEffect } from 'react';
import {
  Bell,
  BellRing,
  X,
  Check,
  Smartphone,
  Shield,
  Zap,
  Radio,
  Sliders,
  Send,
  ExternalLink,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import {
  notificationService,
  PushPermissionStatus,
  PushSubscriptionPreferences,
} from '../services/notificationService';

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationModal: React.FC<NotificationModalProps> = ({ isOpen, onClose }) => {
  const { langCode } = useLanguage();
  const [permission, setPermission] = useState<PushPermissionStatus>('default');
  const [prefs, setPrefs] = useState<PushSubscriptionPreferences>(() =>
    notificationService.getPreferences()
  );
  const [testSent, setTestSent] = useState(false);
  const [isRequesting, setIsRequesting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setPermission(notificationService.checkPermissionStatus());
      setPrefs(notificationService.getPreferences());
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleEnablePush = async () => {
    setIsRequesting(true);
    const granted = await notificationService.requestPushPermission();
    setPermission(notificationService.checkPermissionStatus());
    setPrefs(notificationService.getPreferences());
    setIsRequesting(false);
  };

  const handleSendTest = async () => {
    setTestSent(true);
    await notificationService.sendTestNotification();
    setTimeout(() => setTestSent(false), 3000);
  };

  const handleToggleTopic = (topicKey: keyof PushSubscriptionPreferences['topics']) => {
    const updatedTopics = {
      ...prefs.topics,
      [topicKey]: !prefs.topics[topicKey],
    };
    notificationService.updateTopics(updatedTopics);
    setPrefs(notificationService.getPreferences());
  };

  const handleUnsubscribe = () => {
    notificationService.unsubscribe();
    setPrefs(notificationService.getPreferences());
  };

  const isGranted = permission === 'granted' && prefs.enabled;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 font-sans animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg bg-[#070e24] border border-[#1b2f5f] shadow-2xl rounded-sm p-6 sm:p-8 text-slate-100 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Ambient background glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Top Header */}
        <div className="flex items-center justify-between pb-4 mb-6 border-b border-[#142347] relative z-10">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-full bg-sky-500/15 border border-sky-500/30 text-sky-400">
              <BellRing className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="text-[10px] font-mono uppercase tracking-widest text-sky-400">
                Web Push Alert System · FCM & OneSignal
              </div>
              <h3 className="text-lg sm:text-xl font-serif font-bold text-white">
                {langCode === 'hi'
                  ? 'लाइव ब्रेकिंग न्यूज़ नोटिफिकेशन'
                  : 'Web Push Notifications'}
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status Badge & Device Compatibility */}
        <div className="mb-6 p-3.5 bg-[#0a142e] border border-[#172b59] rounded-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400">
              {langCode === 'hi' ? 'डिवाइस स्थिति' : 'Push Status'}:
            </span>
            {isGranted ? (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono font-medium bg-emerald-950/80 text-emerald-300 border border-emerald-500/40">
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>{langCode === 'hi' ? 'सक्रिय (Active)' : 'Subscribed & Live'}</span>
              </span>
            ) : permission === 'denied' ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-mono bg-rose-950/80 text-rose-300 border border-rose-500/40">
                <span>{langCode === 'hi' ? 'अस्वीकृत (Denied in Browser)' : 'Blocked in Browser'}</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-mono bg-amber-950/80 text-amber-300 border border-amber-500/40">
                <span>{langCode === 'hi' ? 'अनुमति प्रतीक्षित' : 'Ready to Enable'}</span>
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 text-[11px] text-slate-300 pt-1 border-t border-[#122144]">
            <Smartphone className="w-3.5 h-3.5 text-sky-400 shrink-0" />
            <span>
              {langCode === 'hi'
                ? 'एंड्रॉयड, विंडोज, मैक, आईफोन (सफारी/क्रोम) और ओपेरा मिनी पर पूरी तरह समर्थित।'
                : 'Fully compatible with Android, Windows, macOS, iPhone (Safari/Chrome), and Opera Mini.'}
            </span>
          </div>
        </div>

        {/* Description */}
        <p className="text-xs sm:text-sm text-slate-300 font-sans leading-relaxed mb-6">
          {langCode === 'hi'
            ? 'जब भी कोई नया लेख या बीबीसी, रॉयटर्स और डीडब्ल्यू से ब्रेकिंग रिपोर्ट प्रकाशित होगी, आपके मोबाइल या लैपटॉप पर तुरंत पॉप-अप नोटिफिकेशन दिखाई देगा।'
            : 'Get instant, automated device alerts whenever a new political investigation, hourly edition, or live wire dispatch is published—even when your browser tab is in the background.'}
        </p>

        {/* Topic Customization Checklist */}
        <div className="mb-6 space-y-2.5">
          <div className="text-xs font-mono uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Sliders className="w-3.5 h-3.5 text-sky-400" />
            <span>{langCode === 'hi' ? 'विषय चुनें' : 'Notification Channels'}:</span>
          </div>

          <div className="space-y-2 text-xs">
            <label className="flex items-center justify-between p-2.5 bg-[#050b1a] border border-[#142347] rounded-xs cursor-pointer hover:border-sky-500/40 transition-colors">
              <span className="flex items-center gap-2 text-slate-200">
                <span className="w-2 h-2 rounded-full bg-rose-400" />
                <span>{langCode === 'hi' ? '🔴 ब्रेकिंग न्यूज़ फ्लैश' : '🔴 Breaking News & Emergency Dispatches'}</span>
              </span>
              <input
                type="checkbox"
                checked={prefs.topics.breakingNews}
                onChange={() => handleToggleTopic('breakingNews')}
                className="accent-sky-400 w-4 h-4 cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between p-2.5 bg-[#050b1a] border border-[#142347] rounded-xs cursor-pointer hover:border-sky-500/40 transition-colors">
              <span className="flex items-center gap-2 text-slate-200">
                <span>🇮🇳</span>
                <span>{langCode === 'hi' ? 'भारत एवं दक्षिण एशिया विशेष' : 'India & South Asia Policy Alerts'}</span>
              </span>
              <input
                type="checkbox"
                checked={prefs.topics.indiaNews}
                onChange={() => handleToggleTopic('indiaNews')}
                className="accent-sky-400 w-4 h-4 cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between p-2.5 bg-[#050b1a] border border-[#142347] rounded-xs cursor-pointer hover:border-sky-500/40 transition-colors">
              <span className="flex items-center gap-2 text-slate-200">
                <Radio className="w-3.5 h-3.5 text-sky-400" />
                <span>{langCode === 'hi' ? 'लाइव वायर (BBC · Reuters · DW)' : 'Live Automated Wire (BBC · Reuters · DW)'}</span>
              </span>
              <input
                type="checkbox"
                checked={prefs.topics.liveWire}
                onChange={() => handleToggleTopic('liveWire')}
                className="accent-sky-400 w-4 h-4 cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between p-2.5 bg-[#050b1a] border border-[#142347] rounded-xs cursor-pointer hover:border-sky-500/40 transition-colors">
              <span className="flex items-center gap-2 text-slate-200">
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                <span>{langCode === 'hi' ? 'संसदीय एवं विधायी रडार' : 'Capitol Hill & Policy Radar Updates'}</span>
              </span>
              <input
                type="checkbox"
                checked={prefs.topics.elections2026}
                onChange={() => handleToggleTopic('elections2026')}
                className="accent-sky-400 w-4 h-4 cursor-pointer"
              />
            </label>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 pt-2">
          {!isGranted ? (
            <button
              onClick={handleEnablePush}
              disabled={isRequesting || permission === 'denied'}
              className="w-full py-3 bg-sky-400 hover:bg-sky-300 disabled:opacity-50 text-[#060c1d] rounded-xs font-semibold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg cursor-pointer"
            >
              <Bell className="w-4 h-4 fill-current" />
              <span>
                {isRequesting
                  ? (langCode === 'hi' ? 'सक्रिय किया जा रहा है...' : 'Enabling...')
                  : (langCode === 'hi' ? 'डिवाइस पर सूचनाएं चालू करें' : 'Enable Web Push Alerts')}
              </span>
            </button>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                onClick={handleSendTest}
                disabled={testSent}
                className="py-2.5 px-4 bg-emerald-500 hover:bg-emerald-400 text-[#060c1d] rounded-xs font-semibold text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
              >
                <Send className="w-3.5 h-3.5" />
                <span>
                  {testSent
                    ? (langCode === 'hi' ? 'अलर्ट भेजा गया!' : 'Alert Dispatched!')
                    : (langCode === 'hi' ? 'टेस्ट अलर्ट भेजें' : 'Send Test Alert')}
                </span>
              </button>

              <button
                onClick={handleUnsubscribe}
                className="py-2.5 px-4 bg-[#0a1636] hover:bg-rose-950/60 border border-[#1e3466] hover:border-rose-500/50 text-slate-300 hover:text-rose-300 rounded-xs font-medium text-xs transition-colors cursor-pointer"
              >
                {langCode === 'hi' ? 'अलर्ट बंद करें' : 'Disable Push Alerts'}
              </button>
            </div>
          )}

          {/* FCM / OneSignal Token Disclosure */}
          {prefs.token && (
            <div className="text-[10px] font-mono text-slate-500 truncate pt-2 text-center">
              Device Registration Token: {prefs.token}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
