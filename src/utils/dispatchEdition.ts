// Dynamic Time-of-Day Dispatch Edition Helper
// Automatically rotates between Morning, Afternoon, Evening, and Night dispatches based on local time

export type DaypartKey = 'morning' | 'afternoon' | 'evening' | 'night';

export interface DispatchEdition {
  key: DaypartKey;
  headerTitle: string;            // e.g. "THE AFTERNOON DISPATCH"
  localizedHeaderTitle: string;   // e.g. "दोपहर संस्करण · THE AFTERNOON DISPATCH"
  editionTag: string;             // e.g. "Afternoon Dispatch" / "दोपहर संस्करण"
  heroBadge: string;              // e.g. "दोपहर प्रेषण (Afternoon Dispatch)"
  subheading: string;             // e.g. "दोपहर का राजनीतिक विश्लेषण" / "Midday Political Intelligence"
  timeSlot: string;               // e.g. "12:00 - 17:00 IST"
}

const DISPATCH_I18N: Record<DaypartKey, Record<string, { label: string; hero: string; sub: string }>> = {
  morning: {
    en: { label: 'THE MORNING DISPATCH', hero: 'Morning Dispatch', sub: 'Morning Geopolitical & Policy Briefing' },
    hi: { label: 'प्रभात संस्करण · THE MORNING DISPATCH', hero: 'प्रभात प्रेषण (Morning Dispatch)', sub: 'प्रातःकालीन विशेष राजनीतिक विश्लेषण' },
    es: { label: 'EDICIÓN MATUTINA · THE MORNING DISPATCH', hero: 'Edición Matutina', sub: 'Informe Geopolítico y Legislativo Matutino' },
    fr: { label: 'ÉDITION DU MATIN · THE MORNING DISPATCH', hero: 'Édition du Matin', sub: 'Synthèse Géopolitique et Parlementaire Matinale' },
    de: { label: 'MORGENAUSGABE · THE MORNING DISPATCH', hero: 'Morgenausgabe', sub: 'Morgendliche Analyse für Außen- und Wirtschaftspolitik' },
    zh: { label: '晨间要闻 · THE MORNING DISPATCH', hero: '晨间版', sub: '清晨全球政治与外交态势快讯' },
    ar: { label: 'طبعة الصباح · THE MORNING DISPATCH', hero: 'طبعة الصباح', sub: 'إحاطة سياسية ودبلوماسية صباحية شاملة' },
    ja: { label: '朝刊エディション · THE MORNING DISPATCH', hero: '朝刊速報', sub: '国際情勢と連邦政策の朝刊ブリーフィング' },
    ru: { label: 'УТРЕННИЙ ВЫПУСК · THE MORNING DISPATCH', hero: 'Утренний выпуск', sub: 'Утренний аналитический обзор мировой политики' },
    pt: { label: 'EDIÇÃO DA MANHÃ · THE MORNING DISPATCH', hero: 'Edição da Manhã', sub: 'Inteligência Geopolítica e Política Matutina' },
    it: { label: 'EDIZIONE MATTUTINA · THE MORNING DISPATCH', hero: 'Edizione Mattutina', sub: 'Rapporto Geopolitico e Parlamentare del Mattino' },
    ko: { label: '조간 에디션 · THE MORNING DISPATCH', hero: '조간 에디션', sub: '조간 글로벌 정치 및 의회 종합 브리핑' },
    tr: { label: 'SABAH BASKISI · THE MORNING DISPATCH', hero: 'Sabah Baskısı', sub: 'Sabah Küresel Politika ve Yasama Raporu' },
    nl: { label: 'OCHTENDEDITIE · THE MORNING DISPATCH', hero: 'Ochtendeditie', sub: 'Ochtendbriefing Buitenlandse Zaken en Beleid' },
    id: { label: 'EDISI PAGI · THE MORNING DISPATCH', hero: 'Edisi Pagi', sub: 'Taklimat Kebijakan dan Geopolitik Pagi Hari' },
    pl: { label: 'WYDANIE PORANNE · THE MORNING DISPATCH', hero: 'Wydanie Poranne', sub: 'Poranny Przegląd Geopolityczny i Legislacyjny' },
  },
  afternoon: {
    en: { label: 'THE AFTERNOON DISPATCH', hero: 'Afternoon Dispatch', sub: 'Midday Geopolitical Intelligence' },
    hi: { label: 'दोपहर संस्करण · THE AFTERNOON DISPATCH', hero: 'दोपहर प्रेषण (Afternoon Dispatch)', sub: 'मध्याह्न त्वरित राजनीतिक व कूटनीतिक विश्लेषण' },
    es: { label: 'EDICIÓN DE TARDE · THE AFTERNOON DISPATCH', hero: 'Edición de Tarde', sub: 'Inteligencia Geopolítica de Mediodía' },
    fr: { label: 'ÉDITION DE L’APRÈS-MIDI · THE AFTERNOON DISPATCH', hero: 'Édition de Midi', sub: 'Analyse Parlementaire et Diplomatique de la Mi-Journée' },
    de: { label: 'NACHMITTAGSAUSGABE · THE AFTERNOON DISPATCH', hero: 'Nachmittagsausgabe', sub: 'Mittägliche außenpolitische Lageeinschätzung' },
    zh: { label: '午间要闻 · THE AFTERNOON DISPATCH', hero: '午间版', sub: '午间全球外交与立法重要进展' },
    ar: { label: 'طبعة الظهيرة · THE AFTERNOON DISPATCH', hero: 'طبعة الظهيرة', sub: 'التحليل الجيوسياسي والتشريعي لمنتصف اليوم' },
    ja: { label: '昼刊・夕刊速報 · THE AFTERNOON DISPATCH', hero: '昼刊速報', sub: '正午の国際情勢・外交レビュー' },
    ru: { label: 'ДНЕВНОЙ ВЫПУСК · THE AFTERNOON DISPATCH', hero: 'Дневной выпуск', sub: 'Дневная геополитическая аналитика и события' },
    pt: { label: 'EDIÇÃO DA TARDE · THE AFTERNOON DISPATCH', hero: 'Edição da Tarde', sub: 'Inteligência Geopolítica de Meio-Dia' },
    it: { label: 'EDIZIONE POMERIDIANA · THE AFTERNOON DISPATCH', hero: 'Edizione Pomeridiana', sub: 'Analisi Geopolitica e Legislativa di Metà Giornata' },
    ko: { label: '오후 에디션 · THE AFTERNOON DISPATCH', hero: '오후 에디션', sub: '오후 글로벌 외교 및 의회 주요 현안' },
    tr: { label: 'ÖĞLE BASKISI · THE AFTERNOON DISPATCH', hero: 'Öğle Baskısı', sub: 'Gün Ortası Jeopolitik ve Yasama Özeti' },
    nl: { label: 'MIDDAGEDITIE · THE AFTERNOON DISPATCH', hero: 'Middageditie', sub: 'Middagoverzicht Internationale Politiek' },
    id: { label: 'EDISI SIANG · THE AFTERNOON DISPATCH', hero: 'Edisi Siang', sub: 'Analisis Geopolitik Siang Hari' },
    pl: { label: 'WYDANIE POPOŁUDNIOWE · THE AFTERNOON DISPATCH', hero: 'Wydanie Popołudniowe', sub: 'Południowy Przegląd Geopolityczny' },
  },
  evening: {
    en: { label: 'THE EVENING DISPATCH', hero: 'Evening Dispatch', sub: 'Evening Legislative & Policy Intelligence' },
    hi: { label: 'संध्या संस्करण · THE EVENING DISPATCH', hero: 'संध्या प्रेषण (Evening Dispatch)', sub: 'सायंकालीन संपूर्ण विधायी व नीति विश्लेषण' },
    es: { label: 'EDICIÓN VESPERTINA · THE EVENING DISPATCH', hero: 'Edición Vespertina', sub: 'Resumen Legislativo y de Políticas del Atardecer' },
    fr: { label: 'ÉDITION DU SOIR · THE EVENING DISPATCH', hero: 'Édition du Soir', sub: 'Rapport Analytique Parlementaire du Soir' },
    de: { label: 'ABENDAUSGABE · THE EVENING DISPATCH', hero: 'Abendausgabe', sub: 'Abendliche Zusammenfassung der Regierungspolitik' },
    zh: { label: '晚间要闻 · THE EVENING DISPATCH', hero: '晚间版', sub: '晚间立法与政策深度综合通报' },
    ar: { label: 'طبعة المساء · THE EVENING DISPATCH', hero: 'طبعة المساء', sub: 'الموجز التشريعي والدبلوماسي المسائي' },
    ja: { label: '夕刊・夜間速報 · THE EVENING DISPATCH', hero: '夕刊速報', sub: '夕刻の政策・外交総合レポート' },
    ru: { label: 'ВЕЧЕРНИЙ ВЫПУСК · THE EVENING DISPATCH', hero: 'Вечерний выпуск', sub: 'Вечерний законодательный и внешнеполитический итог' },
    pt: { label: 'EDIÇÃO DA NOITE · THE EVENING DISPATCH', hero: 'Edição da Noite', sub: 'Resumo Legislativo e Geopolítico da Noite' },
    it: { label: 'EDIZIONE SERALE · THE EVENING DISPATCH', hero: 'Edizione Serale', sub: 'Rapporto Politico e Istituzionale della Sera' },
    ko: { label: '석간 에디션 · THE EVENING DISPATCH', hero: '석간 에디션', sub: '저녁 의회 및 정책 종합 정리' },
    tr: { label: 'AKŞAM BASKISI · THE EVENING DISPATCH', hero: 'Akşam Baskısı', sub: 'Akşam Yasama ve Politika Analizi' },
    nl: { label: 'AVONDEDITIE · THE EVENING DISPATCH', hero: 'Avondeditie', sub: 'Avondanalyse Parlement en Beleid' },
    id: { label: 'EDISI SORE · THE EVENING DISPATCH', hero: 'Edisi Sore', sub: 'Ikhtisar Legislatif dan Kebijakan Sore' },
    pl: { label: 'WYDANIE WIECZORNE · THE EVENING DISPATCH', hero: 'Wydanie Wieczorne', sub: 'Wieczorny Raport Polityczno-Gospodarczy' },
  },
  night: {
    en: { label: 'THE NIGHT DISPATCH', hero: 'Night Dispatch', sub: 'Overnight Global Record & Intelligence' },
    hi: { label: 'रात्रि संस्करण · THE NIGHT DISPATCH', hero: 'रात्रि प्रेषण (Night Dispatch)', sub: 'देर रात का वैश्विक ओवरनाइट सारांश' },
    es: { label: 'EDICIÓN NOCTURNA · THE NIGHT DISPATCH', hero: 'Edición Nocturna', sub: 'Registro Global de Última Hora de la Noche' },
    fr: { label: 'ÉDITION DE NUIT · THE NIGHT DISPATCH', hero: 'Édition de Nuit', sub: 'Bulletin Nocturne et Revue des Câbles Diplomatiques' },
    de: { label: 'NACHTAUSGABE · THE NIGHT DISPATCH', hero: 'Nachtausgabe', sub: 'Nächtlicher weltweiter Lagebericht' },
    zh: { label: '夜间要闻 · THE NIGHT DISPATCH', hero: '夜间版', sub: '深夜全球要闻与海外战报' },
    ar: { label: 'طبعة الليل · THE NIGHT DISPATCH', hero: 'طبعة الليل', sub: 'الملف الليلي للأخبار والبرقيات الدولية' },
    ja: { label: '深夜速報 · THE NIGHT DISPATCH', hero: '深夜版', sub: '深夜の世界情勢・公電速報' },
    ru: { label: 'НОЧНОЙ ВЫПУСК · THE NIGHT DISPATCH', hero: 'Ночной выпуск', sub: 'Ночной международный бюллетень' },
    pt: { label: 'EDIÇÃO DA MADRUGADA · THE NIGHT DISPATCH', hero: 'Edição Noturna', sub: 'Boletim Global da Madrugada' },
    it: { label: 'EDIZIONE NOTTURNA · THE NIGHT DISPATCH', hero: 'Edizione Notturna', sub: 'Bollettino Notturno degli Esteri' },
    ko: { label: '심야 에디션 · THE NIGHT DISPATCH', hero: '심야 에디션', sub: '심야 글로벌 외교 및 안보 동향' },
    tr: { label: 'GECE BASKISI · THE NIGHT DISPATCH', hero: 'Gece Baskısı', sub: 'Gece Küresel Haber Bülteni' },
    nl: { label: 'NACHTEDITIE · THE NIGHT DISPATCH', hero: 'Nachteditie', sub: 'Nachtelijk Internationaal Overzicht' },
    id: { label: 'EDISI MALAM · THE NIGHT DISPATCH', hero: 'Edisi Malam', sub: 'Buletin Global Larut Malam' },
    pl: { label: 'WYDANIE NOCNE · THE NIGHT DISPATCH', hero: 'Wydanie Nocne', sub: 'Nocny Biuletyn Międzynarodowy' },
  },
};

export function getDispatchEdition(date: Date = new Date(), langCode: string = 'en'): DispatchEdition {
  const hour = date.getHours();
  let key: DaypartKey = 'night';
  let timeSlot = '21:00 - 05:00';

  if (hour >= 5 && hour < 12) {
    key = 'morning';
    timeSlot = '05:00 - 12:00';
  } else if (hour >= 12 && hour < 17) {
    key = 'afternoon';
    timeSlot = '12:00 - 17:00';
  } else if (hour >= 17 && hour < 21) {
    key = 'evening';
    timeSlot = '17:00 - 21:00';
  }

  const i18n = DISPATCH_I18N[key][langCode] || DISPATCH_I18N[key].en;

  return {
    key,
    headerTitle: i18n.label,
    localizedHeaderTitle: i18n.label,
    editionTag: i18n.hero,
    heroBadge: i18n.hero,
    subheading: i18n.sub,
    timeSlot,
  };
}
