export type AdSlotKey =
  | 'header'
  | 'in-article'
  | 'sponsored-article'
  | 'multimedia-feature'
  | 'sponsored-wire'
  | 'magazine';

export type DurationKey = '1-week' | '1-month' | '3-months' | '1-year';

export type CurrencyCode = 'INR';
export type ClientTaxType = 'b2b' | 'b2c';

export function formatInr(amountInInr: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(Math.round(amountInInr || 0));
}

export const INDIA_PLACEMENT_RULES = {
  currency: 'INR' as const,
  gstRatePercent: 18,
  cgstPercent: 9,
  sgstPercent: 9,
  sacCode: '998363',
  jurisdictionEn: 'All-India National Placement (New Delhi · Mumbai · Bengaluru · Kolkata · Chennai)',
  jurisdictionHi: 'अखिल भारतीय राष्ट्रीय प्लेसमेंट (नई दिल्ली · मुंबई · बेंगलुरु · कोलकाता · चेन्नई)',
  settlementRailsEn: '100% Digital INR Only (Business UPI, NEFT, RTGS, RuPay / Indian NetBanking · Sec 269ST Compliant)',
  settlementRailsHi: 'केवल 100% डिजिटल INR भुगतान (बिज़नेस UPI, NEFT, RTGS, भारतीय कार्ड · धारा 269ST अनुपालन)',
  complianceRulesEn: [
    'All creatives must comply with ASCI (Advertising Standards Council of India) & IT Rules 2021.',
    'Mandatory 18% India GST (9% CGST + 9% SGST) under SAC 998363 on all domestic bookings.',
    '100% non-cash digital settlement in INR (No international FX, no cash above ₹0).',
    'Sponsor disclosures & advertiser Indian entity verification precede national go-live.',
  ],
  complianceRulesHi: [
    'सभी बैनर ASCI और भारतीय IT नियम 2021 के अनुरूप होने अनिवार्य हैं।',
    'SAC 998363 के अंतर्गत सभी घरेलू बुकिंग पर 18% भारतीय GST (9% CGST + 9% SGST) लागू।',
    'भुगतान केवल INR में 100% डिजिटल माध्यम (UPI / NEFT / RTGS) द्वारा मान्य (धारा 269ST)।',
    'राष्ट्रीय प्रकाशन से पहले विज्ञापनदाता की भारतीय पहचान व कॉपीराइट सत्यापन अनिवार्य है।',
  ],
};

export interface LiveAdSlot {
  slotKey: AdSlotKey;
  brandName: string;
  headline?: string;
  bannerUrl: string;
  targetUrl: string;
  durationKey: DurationKey;
  durationDays: number;
  bookingId: string;
  paymentStatus: 'verified';
  status: 'active' | 'expired' | 'paused';
  activatedAtIso: string;
  expiresAtIso: string;
  expiresAtMs: number;
}

export interface AdBooking extends LiveAdSlot {
  contactPerson?: string;
  advertiserEmail: string;
  advertiserPhone?: string;
  clientType: ClientTaxType;
  currency: 'INR';
  gstin?: string;
  billingAddress?: string;
  baseAmount: number;
  gstAmount: number;
  grandTotal: number;
  paymentMethod: string;
  paymentReference: string;
  invoiceNumber: string;
  createdAtIso: string;
}

export interface AdSlotMetadata {
  slotKey: AdSlotKey;
  titleEn: string;
  titleHi: string;
  placementEn: string;
  placementHi: string;
  recommendedSize: string;
  aspectHint: string;
  domTargetId: string;
  sac: string;
  /** Authoritative India Domestic Rates in Indian Rupees (INR ₹) */
  rates: Record<DurationKey, number>;
}

export const AD_SLOTS_CATALOG: Record<AdSlotKey, AdSlotMetadata> = {
  header: {
    slotKey: 'header',
    titleEn: 'National Header Leaderboard Billboard',
    titleHi: 'नेशनल हेडर लीडरबोर्ड बिलबोर्ड',
    placementEn: 'Above-the-Fold National Broadsheet Masthead Across All India Editions',
    placementHi: 'वेबसाइट के सबसे ऊपर मुख्य राष्ट्रीय लीडरबोर्ड बैनर (सभी भारतीय संस्करण)',
    recommendedSize: '970 × 250 px or 728 × 90 px',
    aspectHint: 'Wide Landscape (4:1 to 7:1)',
    domTargetId: 'top-leaderboard-slot',
    sac: '998363',
    rates: { '1-week': 10000, '1-month': 25000, '3-months': 65000, '1-year': 220000 },
  },
  'in-article': {
    slotKey: 'in-article',
    titleEn: 'In-Article National Editorial Unit',
    titleHi: 'इन-आर्टिकल नेशनल एडिटोरियल यूनिट',
    placementEn: 'Embedded Inside Every National & Parliamentary News Report Across India',
    placementHi: 'प्रत्येक प्रमुख राष्ट्रीय समाचार और संसद रिपोर्ट के भीतर',
    recommendedSize: '728 × 180 px or 1200 × 300 px',
    aspectHint: 'Horizontal Banner (4:1)',
    domTargetId: 'latest-news',
    sac: '998363',
    rates: { '1-week': 5000, '1-month': 12000, '3-months': 32000, '1-year': 110000 },
  },
  'sponsored-article': {
    slotKey: 'sponsored-article',
    titleEn: 'Sponsored National Editorial Story',
    titleHi: 'स्पॉन्सर्ड नेशनल एडिटोरियल स्टोरी',
    placementEn: 'National Political News Spotlight & Permanent Indian Policy Archive',
    placementHi: 'राष्ट्रीय राजनीतिक समाचार स्पॉटलाइट एवं स्थायी आर्काइव',
    recommendedSize: '1200 × 320 px or 16:9 Landscape',
    aspectHint: 'Wide Feature Banner',
    domTargetId: 'sponsored-editorial-slot',
    sac: '998363',
    rates: { '1-week': 8000, '1-month': 22000, '3-months': 58000, '1-year': 195000 },
  },
  'multimedia-feature': {
    slotKey: 'multimedia-feature',
    titleEn: 'Multimedia Feature & AI Voice Dossier',
    titleHi: 'मल्टीमीडिया वीडियो व वॉइस डॉज़ियर',
    placementEn: 'National Audio Briefings & Broadcast Multimedia Spotlight',
    placementHi: 'राष्ट्रीय ऑडियो ब्रीफिंग व मल्टीमीडिया ब्रॉडकास्ट सेक्शन',
    recommendedSize: '1200 × 320 px or 16:9 Banner',
    aspectHint: 'Landscape Spotlight',
    domTargetId: 'multimedia-feature-slot',
    sac: '998363',
    rates: { '1-week': 15000, '1-month': 42000, '3-months': 110000, '1-year': 360000 },
  },
  'sponsored-wire': {
    slotKey: 'sponsored-wire',
    titleEn: 'National Press Release Wire',
    titleHi: 'राष्ट्रीय कॉर्पोरेट प्रेस वायर',
    placementEn: 'Front-Page National News Wire Syndication & Institutional Archive',
    placementHi: 'होमपेज राष्ट्रीय लाइव वायर प्राथमिकता प्रकाशन बैनर',
    recommendedSize: '1200 × 280 px or 4:1 Banner',
    aspectHint: 'Wide Dispatch Strip',
    domTargetId: 'sponsored-wire-slot',
    sac: '998363',
    rates: { '1-week': 8000, '1-month': 22000, '3-months': 58000, '1-year': 195000 },
  },
  magazine: {
    slotKey: 'magazine',
    titleEn: 'Notebook Magazine Masthead Box',
    titleHi: 'नोटबुक मैगज़ीन मास्टहेड बॉक्स',
    placementEn: 'Top Broadsheet Masthead Right Showcase & Mobile Header Strip (India)',
    placementHi: 'मुख्य मास्टहेड का दायाँ स्पॉटलाइट एवं मोबाइल स्ट्रिप (भारत संस्करण)',
    recommendedSize: '600 × 400 px or 400 × 500 px',
    aspectHint: 'Compact Showcase Card',
    domTargetId: 'magazine-masthead-slot',
    sac: '998363',
    rates: { '1-week': 15000, '1-month': 40000, '3-months': 105000, '1-year': 350000 },
  },
};

export const DURATION_LABELS: Record<DurationKey, { en: string; hi: string; days: number }> = {
  '1-week': { en: '7 Days (1 Week)', hi: '7 दिन (1 सप्ताह)', days: 7 },
  '1-month': { en: '30 Days (1 Month)', hi: '30 दिन (1 माह)', days: 30 },
  '3-months': { en: '90 Days (Quarterly)', hi: '90 दिन (तिमाही)', days: 90 },
  '1-year': { en: '365 Days (Annual)', hi: '365 दिन (वार्षिक)', days: 365 },
};
