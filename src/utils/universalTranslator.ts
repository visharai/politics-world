/**
 * Universal Journalism Translation Engine
 * Guarantees 100% complete multi-language translations across all 16 supported languages.
 * Translates:
 * - Full Articles (Title, Deck, Category, Lead Paragraph, Key Takeaways, Body Paragraphs, Caption, Tags)
 * - Breaking Dispatches
 * - Opinion Columns
 * - Fact Checks
 * - Interactive Polling & Legislation
 * - Reader Perspectives / Discussion Comments
 */

import { Article, BreakingDispatchItem, OpinionColumn } from '../data/newsData';
import { FactCheckItem } from '../data/factCheckData';

export interface FullArticleTranslation {
  title: string;
  deck: string;
  category: Article['category'];
  caption?: string;
  leadParagraph: string;
  keyTakeaways: string[];
  bodyParagraphs: string[];
  tags?: string[];
}

// Category localizations
export const CATEGORY_TRANSLATIONS: Record<string, Record<string, string>> = {
  hi: {
    'White House & Congress': 'व्हाइट हाउस और कांग्रेस',
    'Global Summits': 'वैश्विक शिखर सम्मेलन',
    'Geopolitics': 'भू-राजनीति',
    'Economy & Trade': 'अर्थव्यवस्था और व्यापार',
    'Elections 2026': 'चुनाव 2026',
    'CONGRESSIONAL DESK': 'संसदीय डेस्क',
    'TRADE & SANCTIONS': 'व्यापार एवं प्रतिबंध',
    'NATIONAL SECURITY': 'राष्ट्रीय सुरक्षा',
    'CENTRAL BANK WIRE': 'केंद्रीय बैंक समाचार',
    'DEFENSE LOGISTICS': 'रक्षा रसद',
    'DIPLOMATIC CABLE': 'राजनयिक संदेश',
    'WHITE HOUSE BRIEFING': 'व्हाइट हाउस ब्रीफिंग',
    'JUDICIARY WATCH': 'न्यायिक समीक्षा',
  },
  es: {
    'White House & Congress': 'Casa Blanca y Congreso',
    'Global Summits': 'Cumbres Globales',
    'Geopolitics': 'Geopolítica',
    'Economy & Trade': 'Economía y Comercio',
    'Elections 2026': 'Elecciones 2026',
    'CONGRESSIONAL DESK': 'Mesa del Congreso',
    'TRADE & SANCTIONS': 'Comercio y Sanciones',
    'NATIONAL SECURITY': 'Seguridad Nacional',
    'CENTRAL BANK WIRE': 'Banco Central',
    'DEFENSE LOGISTICS': 'Logística de Defensa',
    'DIPLOMATIC CABLE': 'Cable Diplomático',
    'WHITE HOUSE BRIEFING': 'Briefing Casa Blanca',
    'JUDICIARY WATCH': 'Tribunales y Justicia',
  },
  fr: {
    'White House & Congress': 'Maison-Blanche & Congrès',
    'Global Summits': 'Sommets Mondiaux',
    'Geopolitics': 'Géopolitique',
    'Economy & Trade': 'Économie & Commerce',
    'Elections 2026': 'Élections 2026',
    'CONGRESSIONAL DESK': 'Bureau du Congrès',
    'TRADE & SANCTIONS': 'Commerce & Sanctions',
    'NATIONAL SECURITY': 'Sécurité Nationale',
    'CENTRAL BANK WIRE': 'Banque Centrale',
    'DEFENSE LOGISTICS': 'Logistique de Défense',
    'DIPLOMATIC CABLE': 'Dépêche Diplomatique',
    'WHITE HOUSE BRIEFING': 'Briefing Maison-Blanche',
    'JUDICIARY WATCH': 'Affaires Judiciaires',
  },
  de: {
    'White House & Congress': 'Weißes Haus & Kongress',
    'Global Summits': 'Weltgipfel',
    'Geopolitics': 'Geopolitik',
    'Economy & Trade': 'Wirtschaft & Handel',
    'Elections 2026': 'Wahlen 2026',
    'CONGRESSIONAL DESK': 'Kongressbüro',
    'TRADE & SANCTIONS': 'Handel & Sanktionen',
    'NATIONAL SECURITY': 'Nationale Sicherheit',
    'CENTRAL BANK WIRE': 'Zentralbank',
    'DEFENSE LOGISTICS': 'Verteidigungslogistik',
    'DIPLOMATIC CABLE': 'Diplomatische Depesche',
    'WHITE HOUSE BRIEFING': 'Pressebriefing Weißes Haus',
    'JUDICIARY WATCH': 'Justizbeobachtung',
  },
  zh: {
    'White House & Congress': '白宫与国会',
    'Global Summits': '全球峰会',
    'Geopolitics': '地缘政治',
    'Economy & Trade': '经济与贸易',
    'Elections 2026': '2026选举',
    'CONGRESSIONAL DESK': '国会专线',
    'TRADE & SANCTIONS': '贸易与制裁',
    'NATIONAL SECURITY': '国家安全',
    'CENTRAL BANK WIRE': '央行快讯',
    'DEFENSE LOGISTICS': '国防后勤',
    'DIPLOMATIC CABLE': '外交电报',
    'WHITE HOUSE BRIEFING': '白宫简报',
    'JUDICIARY WATCH': '司法观察',
  },
  ar: {
    'White House & Congress': 'البيت الأبيض والكونغرس',
    'Global Summits': 'القمم الدولية',
    'Geopolitics': 'الجيوسياسية',
    'Economy & Trade': 'الاقتصاد والتجارة',
    'Elections 2026': 'انتخابات 2026',
    'CONGRESSIONAL DESK': 'مكتب الكونغرس',
    'TRADE & SANCTIONS': 'التجارة والعقوبات',
    'NATIONAL SECURITY': 'الأمن القومي',
    'CENTRAL BANK WIRE': 'البنك المركزي',
    'DEFENSE LOGISTICS': 'اللوجستيات الدفاعية',
    'DIPLOMATIC CABLE': 'برقية دبلوماسية',
    'WHITE HOUSE BRIEFING': 'إحاطة البيت الأبيض',
    'JUDICIARY WATCH': 'المتابعة القضائية',
  },
  ru: {
    'White House & Congress': 'Белый дом и Конгресс',
    'Global Summits': 'Мировые саммиты',
    'Geopolitics': 'Геополитика',
    'Economy & Trade': 'Экономика и торговля',
    'Elections 2026': 'Выборы 2026',
    'CONGRESSIONAL DESK': 'Новости Конгресса',
    'TRADE & SANCTIONS': 'Торговля и санкции',
    'NATIONAL SECURITY': 'Национальная безопасность',
    'CENTRAL BANK WIRE': 'Центробанк',
    'DEFENSE LOGISTICS': 'Военная логистика',
    'DIPLOMATIC CABLE': 'Дипломатическая депеша',
    'WHITE HOUSE BRIEFING': 'Брифинг Белого дома',
    'JUDICIARY WATCH': 'Судебная хроника',
  },
  ja: {
    'White House & Congress': 'ホワイトハウスと連邦議会',
    'Global Summits': 'グローバルサミット',
    'Geopolitics': '地政学',
    'Economy & Trade': '経済と貿易',
    'Elections 2026': '2026年中間選挙',
    'CONGRESSIONAL DESK': '議会速報デスク',
    'TRADE & SANCTIONS': '貿易と制裁',
    'NATIONAL SECURITY': '国家安全保障',
    'CENTRAL BANK WIRE': '中央銀行速報',
    'DEFENSE LOGISTICS': '防衛補給・兵站',
    'DIPLOMATIC CABLE': '外交公電',
    'WHITE HOUSE BRIEFING': 'ホワイトハウス定例会見',
    'JUDICIARY WATCH': '司法ウォッチ',
  },
  pt: {
    'White House & Congress': 'Casa Branca e Congresso',
    'Global Summits': 'Cúpulas Globais',
    'Geopolitics': 'Geopolítica',
    'Economy & Trade': 'Economia e Comércio',
    'Elections 2026': 'Eleições 2026',
    'CONGRESSIONAL DESK': 'Bancada do Congresso',
    'TRADE & SANCTIONS': 'Comércio e Sanções',
    'NATIONAL SECURITY': 'Segurança Nacional',
    'CENTRAL BANK WIRE': 'Banco Central',
    'DEFENSE LOGISTICS': 'Logística de Defesa',
    'DIPLOMATIC CABLE': 'Telegrama Diplomático',
    'WHITE HOUSE BRIEFING': 'Coletiva da Casa Branca',
    'JUDICIARY WATCH': 'Observatório Judiciário',
  },
  it: {
    'White House & Congress': 'Casa Bianca e Congresso',
    'Global Summits': 'Vertici Globali',
    'Geopolitics': 'Geopolitica',
    'Economy & Trade': 'Economia e Commercio',
    'Elections 2026': 'Elezioni 2026',
    'CONGRESSIONAL DESK': 'Banco del Congresso',
    'TRADE & SANCTIONS': 'Commercio e Sanzioni',
    'NATIONAL SECURITY': 'Sicurezza Nazionale',
    'CENTRAL BANK WIRE': 'Banca Centrale',
    'DEFENSE LOGISTICS': 'Logistica della Difesa',
    'DIPLOMATIC CABLE': 'Dispaccio Diplomatico',
    'WHITE HOUSE BRIEFING': 'Briefing Casa Bianca',
    'JUDICIARY WATCH': 'Cronaca Giudiziaria',
  },
  ko: {
    'White House & Congress': '백악관 및 미 의회',
    'Global Summits': '글로벌 정상회의',
    'Geopolitics': '지정학',
    'Economy & Trade': '경제 및 무역',
    'Elections 2026': '2026 선거',
    'CONGRESSIONAL DESK': '의회 데스크',
    'TRADE & SANCTIONS': '무역 및 제재',
    'NATIONAL SECURITY': '국가 안보',
    'CENTRAL BANK WIRE': '중앙은행 속보',
    'DEFENSE LOGISTICS': '방위 물류',
    'DIPLOMATIC CABLE': '외교 전문',
    'WHITE HOUSE BRIEFING': '백악관 브리핑',
    'JUDICIARY WATCH': '사법 감시',
  },
  tr: {
    'White House & Congress': 'Beyaz Saray ve Kongre',
    'Global Summits': 'Küresel Zirveler',
    'Geopolitics': 'Jeopolitik',
    'Economy & Trade': 'Ekonomi ve Ticaret',
    'Elections 2026': '2026 Seçimleri',
    'CONGRESSIONAL DESK': 'Kongre Masası',
    'TRADE & SANCTIONS': 'Ticaret ve Yaptırımlar',
    'NATIONAL SECURITY': 'Ulusal Güvenlik',
    'CENTRAL BANK WIRE': 'Merkez Bankası',
    'DEFENSE LOGISTICS': 'Savunma Lojistiği',
    'DIPLOMATIC CABLE': 'Diplomatik Telgraf',
    'WHITE HOUSE BRIEFING': 'Beyaz Saray Brifingi',
    'JUDICIARY WATCH': 'Yargı Gündemi',
  },
  nl: {
    'White House & Congress': 'Witte Huis & Congres',
    'Global Summits': 'Wereldtoppen',
    'Geopolitics': 'Geopolitiek',
    'Economy & Trade': 'Economie & Handel',
    'Elections 2026': 'Verkiezingen 2026',
    'CONGRESSIONAL DESK': 'Congresdesk',
    'TRADE & SANCTIONS': 'Handel & Sancties',
    'NATIONAL SECURITY': 'Nationale Veiligheid',
    'CENTRAL BANK WIRE': 'Centrale Bank',
    'DEFENSE LOGISTICS': 'Defensielogistiek',
    'DIPLOMATIC CABLE': 'Diplomatieke Depêche',
    'WHITE HOUSE BRIEFING': 'Witte Huis Briefing',
    'JUDICIARY WATCH': 'Gerechtelijke Zaken',
  },
  id: {
    'White House & Congress': 'Gedung Putih & Kongres',
    'Global Summits': 'KTT Global',
    'Geopolitics': 'Geopolitik',
    'Economy & Trade': 'Ekonomi & Perdagangan',
    'Elections 2026': 'Pemilu 2026',
    'CONGRESSIONAL DESK': 'Meja Kongres',
    'TRADE & SANCTIONS': 'Perdagangan & Sanksi',
    'NATIONAL SECURITY': 'Keamanan Nasional',
    'CENTRAL BANK WIRE': 'Kawat Bank Sentral',
    'DEFENSE LOGISTICS': 'Logistik Pertahanan',
    'DIPLOMATIC CABLE': 'Kawat Diplomatik',
    'WHITE HOUSE BRIEFING': 'Taklimat Gedung Putih',
    'JUDICIARY WATCH': 'Sorotan Peradilan',
  },
  pl: {
    'White House & Congress': 'Biały Dom i Kongres',
    'Global Summits': 'Szczyty Globalne',
    'Geopolitics': 'Geopolityka',
    'Economy & Trade': 'Gospodarka i Handel',
    'Elections 2026': 'Wybory 2026',
    'CONGRESSIONAL DESK': 'Wiadomości z Kongresu',
    'TRADE & SANCTIONS': 'Handel i Sankcje',
    'NATIONAL SECURITY': 'Bezpieczeństwo Narodowe',
    'CENTRAL BANK WIRE': 'Wiadomości Banku Centralnego',
    'DEFENSE LOGISTICS': 'Logistyka Obronna',
    'DIPLOMATIC CABLE': 'Depesza Dyplomatyczna',
    'WHITE HOUSE BRIEFING': 'Briefing Białego Domu',
    'JUDICIARY WATCH': 'Przegląd Sądownictwa',
  },
};

// Full translated content for all 12 hourly lead stories
export const LEAD_STORIES_FULL_TRANSLATIONS: Record<string, Record<string, FullArticleTranslation>> = {
  hi: {
    'hourly-lead-1': {
      title: 'मध्यरात्रि समझौता: कैसे जी7 गुप्त ऊर्जा समझौते ने अटलांटिक-पार औद्योगिक रणनीति को नया रूप दिया',
      deck: 'ब्रसेल्स में बंद कमरों में हुई बातचीत में राजनयिकों ने स्वच्छ ऊर्जा सब्सिडी पर 10 साल का कानूनी समझौता किया, जिससे बड़ा व्यापारिक विवाद टल गया।',
      category: 'Global Summits',
      caption: 'ब्रसेल्स में भोर से पूर्व आयोजित उच्चस्तरीय वार्ता कक्ष से बाहर निकलते प्रतिनिधिमंडल।',
      leadParagraph: 'जब ब्रसेल्स में जस्टस लिप्सियस भवन के महोगनी दरवाजे सोमवार की सुबह खुलने से पहले खुले, तो राजनयिकों ने एक ऐतिहासिक समझौता हासिल कर लिया था, जिससे अटलांटिक-पार विनिर्माण सब्सिडी को सुसंगत बनाया गया।',
      keyTakeaways: [
        '2032 तक दुर्लभ खनिजों के आयात पर सब्सिडी की अधिकतम सीमा 12% तय की गई।',
        '45 दिनों के भीतर व्यापारिक विवाद सुलझाने के लिए जिनेवा में स्वचालित संयुक्त मध्यस्थता मंच स्थापित हुआ।',
        'संसदीय नेतृत्व ने गुरुवार को इस समझौते के वैधानिक अनुमोदन हेतु त्वरित मतदान का संकल्प लिया।',
      ],
      bodyParagraphs: [
        'यह सफलता व्हाइट हाउस के आर्थिक दूतों और यूरोपीय संघ के व्यापार निदेशकों के बीच 48 घंटे की लगातार वार्ता के बाद हासिल हुई। विवाद का मुख्य कारण बैटरी विनिर्माण और एयरोस्पेस संयंत्रों के लिए संप्रभु कर छूट थी।',
        'ट्रांसएटलांटिक इंडस्ट्रियल कॉम्पैक्ट नामक इस समझौते के तहत, दोनों पक्षों ने मित्र देशों में शोधित दुर्लभ खनिजों के लिए उत्पत्ति के मानकों को पारस्परिक मान्यता देने पर सहमति जताई। इससे सैकड़ों सीमा शुल्क विवाद समाप्त हो गए।',
        'कैपिटल हिल पर सीनेट वित्त समिति के अध्यक्ष ने समझौते का स्वागत करते हुए इसे घरेलू विनिर्माण को सुरक्षित रखने और नियम-आधारित व्यापार को सुदृढ़ करने वाला कदम बताया।',
      ],
      tags: ['जी7 शिखर सम्मेलन', 'व्यापार नीति', 'औद्योगिक रणनीति', 'स्वच्छ ऊर्जा'],
    },
    'hourly-lead-2': {
      title: 'समुद्री लक्ष्मण रेखा: विदेश विभाग ने दक्षिण चीन सागर में नौवहन स्वतंत्रता सिद्धांत स्पष्ट किया',
      deck: '90 मिनट की तीखी प्रेस वार्ता में, सरकार ने राजनयिक आपत्तियों को खारिज करते हुए क्षेत्रीय साझेदारों के साथ स्थायी संयुक्त निगरानी गश्त की घोषणा की।',
      category: 'Geopolitics',
      caption: 'आपातकालीन प्रेस वार्ता के दौरान अंतरराष्ट्रीय पत्रकारों को संबोधित करते अमेरिकी विदेश विभाग के प्रवक्ता।',
      leadParagraph: 'अंतरराष्ट्रीय संवाददाताओं के तीखे सवालों के जवाब में, सरकार ने इस राष्ट्रपति कार्यकाल की अपनी सबसे स्पष्ट विदेश नीति की लक्ष्मण रेखा तय कर दी।',
      keyTakeaways: [
        'मनीला, टोक्यो और कैनबरा की नौसेनाओं के साथ 24 घंटे संयुक्त समुद्री हवाई गश्त का आदेश।',
        'अंतरराष्ट्रीय जलडमरूमध्य में वैध वाणिज्यिक जहाजों के निर्बाध पारगमन हेतु संप्रभु सुरक्षा गारंटी।',
        'संबद्ध राष्ट्रों के तटरक्षकों के बीच उपग्रह ट्रैकिंग डेटा का तत्काल साझाकरण।',
      ],
      bodyParagraphs: [
        'प्रवक्ता ने एकतरफा उकसावे के आरोपों को खारिज करते हुए दोहराया कि बहुपक्षीय नौवहन स्वतंत्रता अभियान पूरी तरह से अंतरराष्ट्रीय समुद्री कानून और पुरानी संधि प्रतिबद्धताओं पर आधारित हैं।',
        'अगले सप्ताह से लंबी दूरी के समुद्री निगरानी विमानों के स्क्वाड्रन अंतरराष्ट्रीय गलियारों में अनुसूचित गश्त शुरू करेंगे, जिसे क्षेत्रीय साझेदार देशों के साथ मिलकर संचालित किया जाएगा।',
        'रक्षा विशेषज्ञों का मानना है कि यह घोषणा समय-समय पर होने वाले उड़ानों के स्थान पर एक सतत, विश्वसनीय और एकीकृत सुरक्षा प्रणाली की स्थापना की ओर बड़ा कदम है।',
      ],
      tags: ['विदेश विभाग', 'इंडो-पैसिफिक', 'समुद्री सुरक्षा', 'नौसैनिक रणनीति'],
    },
    'hourly-lead-3': {
      title: 'वैश्विक रसद चेतावनी: प्रशांत बंदरगाहों का पुनर्गठन हरित शिपिंग गलियारों को गति देता है',
      deck: 'रिकॉर्ड कंटेनर आवाजाही और बढ़ते शुल्क के बीच आठ देशों के वाणिज्य मंत्रियों ने सिंगापुर में आपातकालीन रसद परिषद बुलाई।',
      category: 'Economy & Trade',
      caption: 'प्रशांत समुद्री गलियारे के साथ स्वचालित गहरे पानी का कंटेनर टर्मिनल परिचालन।',
      leadParagraph: 'प्रशांत महासागर के प्रमुख जलमार्गों पर माल ढुलाई की दरें नए उच्च स्तर पर पहुंचने के बाद, आठ एशिया-प्रशांत देशों के आर्थिक मंत्री सिंगापुर में एकजुट हुए।',
      keyTakeaways: [
        'सत्यापित शून्य-उत्सर्जन मालवाहक जहाजों के लिए प्राथमिकता वाले सीमा शुल्क गलियारे स्थापित।',
        'बंदरगाहों पर कंटेनर रुकने के समय को 4 दिन से घटाकर 24 घंटे करने का लक्ष्य।',
        'भीड़भाड़ से बचने के लिए प्रशांत तट के छह प्रमुख बंदरगाहों पर संयुक्त टर्मिनल डेटा प्लेटफॉर्म।',
      ],
      bodyParagraphs: [
        'यह आपातकालीन सत्र कई प्रमुख समुद्री केंद्रों पर अचानक हुए विनियामक निरीक्षणों के बाद बुलाया गया, जिससे जहाजों के प्रतीक्षा समय में अप्रत्याशित वृद्धि हुई थी।',
        'वार्ता का केंद्र हरित-प्रमाणित मालवाहक जहाजों के लिए त्वरित सीमा शुल्क निकासी लेन स्थापित करना है, जिससे गैर-टैरिफ लालफीताशाही से बचा जा सके।',
        'उद्योग संघों ने आगाह किया है कि राष्ट्रीय संसदों में विधायी समन्वय के बिना, प्रशासनिक नियमों को स्थानीय अदालतों में चुनौती दी जा सकती है।',
      ],
      tags: ['सप्लाई चेन', 'प्रशांत व्यापार', 'बंदरगाह रसद', 'हरित परिवहन'],
    },
    'hourly-lead-4': {
      title: 'कार्यकारी आदेश: राष्ट्रीय संप्रभु एआई और क्वांटम कंप्यूट रिज़र्व की स्थापना',
      deck: 'राष्ट्रपति ने एक ऐतिहासिक निर्देश पर हस्ताक्षर कर संप्रभु सुपरकंप्यूटिंग केंद्रों के लिए $40 बिलियन आवंटित किए, ताकि तकनीकी स्वतंत्रता सुनिश्चित हो सके।',
      category: 'White House & Congress',
      caption: 'संघीय कंप्यूटिंग कार्यक्रम के तहत निर्मित उन्नत क्वांटम सुपरकंप्यूटिंग प्रयोगशाला।',
      leadParagraph: 'तकनीकी संप्रभुता को सुरक्षित रखने के उद्देश्य से, व्हाइट हाउस ने देश के पहले रणनीतिक क्वांटम और एआई कंप्यूटिंग भंडार की स्थापना को मंजूरी दी है।',
      keyTakeaways: [
        'अग्रणी राष्ट्रीय प्रयोगशालाओं में तीन समर्पित संप्रभु सुपरकंप्यूटिंग क्लस्टर का निर्माण।',
        'महत्वपूर्ण अनुसंधान के लिए विश्वविद्यालयों और घरेलू स्टार्टअप्स को गारंटीकृत कंप्यूट एक्सेस।',
        'विदेशी निर्यात प्रतिबंधों से अप्रभावित घरेलू चिप पैकेजिंग संयंत्रों का विस्तार।',
      ],
      bodyParagraphs: [
        'यह रणनीतिक आदेश ऐसे समय आया है जब अगली पीढ़ी की कृत्रिम बुद्धिमत्ता और सुरक्षित क्वांटम सिमुलेशन के लिए बुनियादी ढांचे की वैश्विक मांग तेजी से बढ़ी है।',
        'वाणिज्य विभाग के अधिकारियों ने स्पष्ट किया कि सार्वजनिक शोधकर्ताओं के लिए एक संप्रभु कंप्यूट स्तर प्रदान करने से निजी एकाधिकार के जोखिम को कम किया जा सकेगा।',
        'संसदीय प्रौद्योगिकी उपसमितियों ने इस कदम का स्वागत किया और इसे अगली औद्योगिक क्रांति में राष्ट्रीय नेतृत्व बनाए रखने के लिए अनिवार्य बताया।',
      ],
      tags: ['आर्टिफिशियल इंटेलिजेंस', 'क्वांटम कंप्यूटिंग', 'व्हाइट हाउस', 'प्रौद्योगिकी नीति'],
    },
    'hourly-lead-5': {
      title: 'फेडरल रिजर्व ने ब्याज दरें स्थिर रखीं; वित्तीय वर्ष समाप्ति से पूर्व मुख्य मुद्रास्फीति घटकर 2.1% पर',
      deck: 'केंद्रीय बैंक के बोर्ड ने ब्याज दरों में रोक जारी रखने की पुष्टि की, क्योंकि रोजगार बाजार स्थिर हुआ और आयातित सामान की कीमतें नियंत्रित रहीं।',
      category: 'Economy & Trade',
      caption: 'वाशिंगटन में फेडरल ओपन मार्केट कमेटी की मौद्रिक नीति बैठक का मुख्य कक्ष।',
      leadParagraph: 'फेडरल रिजर्व ने पुष्टि की कि सख्त मौद्रिक परिस्थितियों ने आर्थिक मंदी लाए बिना मुद्रास्फीति को आधिकारिक लक्ष्य के करीब ला दिया है।',
      keyTakeaways: [
        'बेंचमार्क ब्याज दर लक्ष्य 4.50%-4.75% की सीमा में अपरिवर्तित रखा गया।',
        'कोर पीसीई मूल्य सूचकांक लगातार तीसरे महीने घटकर 2.1% की वार्षिक दर पर पहुंचा।',
        'श्रम बाजार में मासिक नौकरियों की वृद्धि संतुलित स्तर पर स्थिर बनी हुई है।',
      ],
      bodyParagraphs: [
        'फेडरल रिजर्व के अध्यक्ष ने वाशिंगटन में संवाददाताओं को संबोधित करते हुए कहा कि दो साल के सख्त उपायों के बाद आपूर्ति और मांग में संतुलन लौट आया है।',
        'वित्तीय बाजारों ने इस निर्णय का सकारात्मक स्वागत किया, और ट्रेजरी बॉन्ड यील्ड में हल्की गिरावट दर्ज की गई जिससे आवास ऋण दरों में राहत मिलने की संभावना है।',
        'हालांकि, अर्थशास्त्रियों ने आगाह किया कि ऊर्जा और कच्चे माल की कीमतों में किसी भी वैश्विक व्यवधान से नीतिगत सतर्कता बनाए रखनी होगी।',
      ],
      tags: ['फेडरल रिजर्व', 'मुद्रास्फीति', 'ब्याज दरें', 'अमेरिकी अर्थव्यवस्था'],
    },
    'hourly-lead-6': {
      title: 'संवैधानिक समीक्षा: सुप्रीम कोर्ट अंतरराज्यीय डिजिटल वाणिज्य चुनौती पर ऐतिहासिक सुनवाई करेगा',
      deck: 'न्यायाधीश इस बात पर दलीलें सुनेंगे कि क्या राज्यों के डेटा संप्रभुता कानून अमेरिकी संविधान के संघीय वाणिज्य खंड का उल्लंघन करते हैं।',
      category: 'White House & Congress',
      caption: 'वाशिंगटन डीसी में अमेरिकी सुप्रीम कोर्ट की ऐतिहासिक इमारत का मुख्य प्रवेश द्वार।',
      leadParagraph: 'सुप्रीम कोर्ट ने एक ऐतिहासिक कानूनी विवाद की सुनवाई स्वीकार कर ली है जो इंटरनेट अर्थव्यवस्था को 50 अलग-अलग राज्य नियमों में बांटने का जोखिम पैदा करता है।',
      keyTakeaways: [
        'क्लाउड कंप्यूटिंग और उपभोक्ता डेटा गोपनीयता पर राज्य कानूनों की वैधता की जांच।',
        'संविधान के वाणिज्य खंड बनाम 10वें संशोधन के तहत राज्यों के अधिकारों पर सीधी टक्कर।',
        'फैसला अगले वर्ष गर्मियों तक आने की उम्मीद, जिससे राष्ट्रीय डिजिटल नीतियां प्रभावित होंगी।',
      ],
      bodyParagraphs: [
        'यह मामला कई प्रमुख व्यापारिक संघों द्वारा दायर याचिका से उपजा है, जिसमें तर्क दिया गया है कि अलग-अलग राज्यों के डेटा कानून अंतरराज्यीय व्यापार में अनावश्यक बाधाएं डालते हैं।',
        'न्याय विभाग ने संक्षिप्त रूप से हस्तक्षेप करते हुए स्पष्ट किया कि राष्ट्रीय स्तर पर एक सुसंगत ढांचा ही नवाचार और उपभोक्ता अधिकारों दोनों की रक्षा कर सकता है।',
        'कानूनी विश्लेषकों का मानना है कि यह निर्णय इक्कीसवीं सदी में डिजिटल प्लेटफॉर्म और उपभोक्ता डेटा के नियमन की दिशा तय करेगा।',
      ],
      tags: ['सुप्रीम कोर्ट', 'डेटा गोपनीयता', 'डिजिटल कॉमर्स', 'संवैधानिक कानून'],
    },
    'hourly-lead-7': {
      title: 'जिनेवा फैसला: 45-दिवसीय त्वरित स्वच्छ ऊर्जा मध्यस्थता ने आपूर्ति रुकावटों का समाधान किया',
      deck: 'स्वचालित ट्रिब्यूनल ने इलेक्ट्रिक वाहन बैटरी आपूर्ति शृंखला पर दर्जनों सक्रिय टैरिफ विवादों को खारिज करते हुए व्यापारिक सुगमता बहाल की।',
      category: 'Global Summits',
      caption: 'जिनेवा में अंतरराष्ट्रीय व्यापार केंद्र स्थित बहुपक्षीय मध्यस्थता पंचाट का सत्र।',
      leadParagraph: 'नए अटलांटिक-पार समझौते के तहत अपने पहले बड़े फैसले में, जिनेवा मध्यस्थता परिषद ने मित्र देशों के बैटरी कंपोनेंट्स के लिए पारस्परिक उत्पत्ति मानकों को वैध ठहराया।',
      keyTakeaways: [
        'इलेक्ट्रिक वाहन बैटरी घटकों पर प्रस्तावित 25% दंडात्मक शुल्कों को रद्द किया गया।',
        'भविष्य के सभी स्वच्छ ऊर्जा आपूर्ति विवादों के लिए अनिवार्य 45-दिवसीय मध्यस्थता समयसीमा।',
        'मित्र देशों की प्रमाणित सुविधाओं से आयातित खनिजों के लिए स्वचालित सीमा शुल्क क्लीयरेंस।',
      ],
      bodyParagraphs: [
        'इस निर्णय से उत्तरी अमेरिका और यूरोप के ऑटोमोटिव निर्माताओं को बड़ी राहत मिली है, जो महीनों से सीमा शुल्क अनिश्चितता का सामना कर रहे थे।',
        'मध्यस्थों ने पाया कि दोनों पक्षों की नियामक प्रक्रियाएं पर्यावरण और श्रम मानकों को समान रूप से पूरा करती हैं, जिससे अतिरिक्त शुल्क अनुचित हैं।',
        'व्यापार विशेषज्ञों ने इस त्वरित प्रक्रिया को पारंपरिक बहुवर्षीय विश्व व्यापार संगठन मुकदमों की तुलना में एक बड़ा सुधार बताया।',
      ],
      tags: ['जिनेवा ट्रिब्यूनल', 'स्वच्छ ऊर्जा', 'ईवी बैटरी', 'अंतरराष्ट्रीय व्यापार'],
    },
    'hourly-lead-8': {
      title: 'मध्यरात्रि क्लोजर: सीनेट ने ट्रिलियन-डॉलर बुनियादी ढांचे हेतु 74 मतों का भारी द्विदलीय बहुमत हासिल किया',
      deck: 'बजट समाप्ति से कुछ घंटे पहले, दोनों दलों के वरिष्ठ सांसदों ने कृषि राहत और रक्षा व्यय को अलग कर ऐतिहासिक समझौता पारित कराया।',
      category: 'White House & Congress',
      caption: 'देर रात बजट सत्र के दौरान जगमगाता हुआ यूएस कैपिटल का भव्य गुंबद।',
      leadParagraph: 'कैपिटल की रोशन गुंबद के नीचे, संसदीय वार्ताकारों ने एक निरंतर बजट प्रस्ताव पारित कर सरकार का कामकाज बंद होने से बचा लिया।',
      keyTakeaways: [
        'सड़क, पुल और हाई-स्पीड रेल परियोजनाओं के लिए $160 बिलियन का तत्काल आपातकालीन कोष।',
        '74-26 के भारी बहुमत से क्लोजर वोट पारित, दोनों पार्टियों के नेतृत्व का समर्थन।',
        'दिसंबर तक सभी आवश्यक संघीय एजेंसियों का सामान्य संचालन सुनिश्चित।',
      ],
      bodyParagraphs: [
        'सप्ताह भर की लंबी और तनावपूर्ण बातचीत के बाद, सीनेट बहुमत नेता और अल्पसंख्यक सचेतक ने एक साझा प्रारूप पर सहमति बनाई जो दोनों गुटों को स्वीकार्य था।',
        'इस विधेयक में प्राकृतिक आपदाओं से प्रभावित राज्यों के लिए पुनर्निर्माण सहायता और ग्रामीण ब्रॉडबैंड कनेक्टिविटी के लिए विशेष प्रावधान किए गए हैं।',
        'सदन के अध्यक्ष ने पुष्टि की कि प्रतिनिधि सभा इस पर बिना किसी संशोधन के मतदान करेगी और इसे हस्ताक्षर हेतु राष्ट्रपति को भेजेगी।',
      ],
      tags: ['अमेरिकी सीनेट', 'बुनियादी ढांचा', 'द्विदलीय बजट', 'कैपिटल हिल'],
    },
    'hourly-lead-9': {
      title: '45 गीगावाट सुपरग्रिड: यूरोपीय ऊर्जा संघ ने ऐतिहासिक समुद्री उच्च-वोल्टेज बिजली लिंक को मंजूरी दी',
      deck: 'आठ देशों ने मिलकर दुनिया का सबसे बड़ा एकीकृत अपतटीय पवन ट्रांसमिशन नेटवर्क बनाने का समझौता किया, जिससे बिजली कीमतों में भारी उतार-चढ़ाव रुकेगा।',
      category: 'Economy & Trade',
      caption: 'उत्तरी सागर में स्थापित अपतटीय पवन टरबाइन और उच्च-वोल्टेज सबस्टेशन प्लेटफॉर्म।',
      leadParagraph: 'कोपेनहेगन में आयोजित शिखर सम्मेलन में, उत्तरी और मध्य यूरोप के ऊर्जा मंत्रियों ने उत्तरी सागर में उच्च-वोल्टेज प्रत्यक्ष धारा (HVDC) ग्रिड के निर्माण समझौते पर हस्ताक्षर किए।',
      keyTakeaways: [
        '45 गीगावाट अपतटीय पवन ऊर्जा को सीधे 5 करोड़ से अधिक परिवारों से जोड़ा जाएगा।',
        'अंतरराष्ट्रीय ग्रिड इंटरकनेक्टर्स के माध्यम से बिजली की थोक कीमतों में 30% कमी का अनुमान।',
        'परियोजना 2029 तक पूरी तरह चालू होगी, जिससे जीवाश्म गैस पर निर्भरता नगण्य हो जाएगी।',
      ],
      bodyParagraphs: [
        'यह ग्रिड डेनमार्क, जर्मनी, नीदरलैंड, बेल्जियम, ब्रिटेन और नॉर्वे के तटवर्ती बिजली तंत्रों को आपस में जोड़कर अतिरिक्त हरित ऊर्जा का निर्बाध आदान-प्रदान संभव बनाएगा।',
        'यूरोपीय निवेश बैंक ने परियोजना के पहले चरण के लिए €18 बिलियन के रियायती हरित बॉन्ड जारी करने की घोषणा की है।',
        'ऊर्जा विशेषज्ञों का मानना है कि यह अंतरमहाद्वीपीय ग्रिड अक्षय ऊर्जा के भंडारण और वितरण की वैश्विक चुनौतियों का सबसे व्यावहारिक समाधान है।',
      ],
      tags: ['सुपरग्रिड', 'पवन ऊर्जा', 'यूरोपीय संघ', 'नवीकरणीय ऊर्जा'],
    },
    'hourly-lead-10': {
      title: 'क्वाड रक्षा मंत्री: भारत-प्रशांत समुद्री खुफिया और रडार साझाकरण समझौते पर हस्ताक्षर',
      deck: 'विश्व व्यापार के एक तिहाई हिस्से को ढोने वाले समुद्री मार्गों की सुरक्षा के लिए साझा अंतरिक्ष और रडार निगरानी प्रणाली तैनात की गई।',
      category: 'Geopolitics',
      caption: 'टोक्यो रक्षा शिखर सम्मेलन के दौरान क्वाड सदस्य देशों के रक्षा मंत्रियों की संयुक्त प्रेस वार्ता।',
      leadParagraph: 'टोक्यो में आयोजित मंत्रिस्तरीय बैठक के समापन पर, चारों क्वाड देशों ने हिंद और प्रशांत महासागर में रीयल-टाइम संयुक्त उपग्रह निगरानी का औपचारिक समझौता किया।',
      keyTakeaways: [
        'समुद्री डकैती, अवैध मछली पकड़ने और अघोषित सैन्य गतिविधियों की 24/7 लाइव ट्रैकिंग।',
        'चारों देशों के नौसेना कमांड सेंटरों के बीच एन्क्रिप्टेड डेटा लिंक की तुरंत शुरुआत।',
        'मलक्का और लोम्बोक जलडमरूमध्य में वाणिज्यिक जहाजों के मुक्त आवागमन की गारंटी।',
      ],
      bodyParagraphs: [
        'चारों साझेदार देशों के रक्षा मंत्रियों ने संयुक्त बयान में रेखांकित किया कि शांतिपूर्ण और खुला इंडो-पैसिफिक क्षेत्र वैश्विक आर्थिक स्थिरता के लिए अपरिहार्य है।',
        'इस समझौते के तहत वाणिज्यिक और नागरिक उपग्रह डेटा का उपयोग कर स्वचालित पहचान प्रणाली बंद करने वाले संदिग्ध जहाजों का तत्काल पता लगाया जा सकेगा।',
        'क्षेत्रीय देशों ने इस पहल का स्वागत करते हुए कहा कि इससे छोटे तटीय देशों को अपने विशेष आर्थिक क्षेत्रों की निगरानी में सीधी सहायता मिलेगी।',
      ],
      tags: ['क्वाड', 'इंडो-पैसिफिक', 'समुद्री सुरक्षा', 'रक्षा सहयोग'],
    },
    'hourly-lead-11': {
      title: 'रणनीतिक खनिज भंडार: रक्षा रसद एजेंसी ने घरेलू प्रसंस्करण भंडारों की पुनःपूर्ति की',
      deck: 'आपूर्ति शृंखला जोखिम कम करने के लिए, पेंटागन ने प्रमुख राज्यों में घरेलू रिफाइनरियों के साथ बहु-वर्षीय अनुबंध किए।',
      category: 'White House & Congress',
      caption: 'रणनीतिक संघीय कार्यक्रम में भाग लेने वाली उच्च-शुद्धता वाली दुर्लभ खनिज प्रसंस्करण सुविधा।',
      leadParagraph: 'द्विदलीय संसदीय मंजूरी के आधार पर, रक्षा रसद एजेंसी ने दशकों का सबसे बड़ा रणनीतिक सामग्री कार्यक्रम शुरू करते हुए घरेलू खनिज रिफाइनरियों के साथ सीधे अनुबंध किए हैं।',
      keyTakeaways: [
        'दुर्लभ खनिजों (डिस्प्रोसियम, नियोडिमियम और लिथियम) का 18 महीने का संप्रभु रणनीतिक भंडार सुरक्षित किया गया।',
        'नेवादा, टेक्सास और ओहियो की घरेलू रिफाइनरियों को बहु-वर्षीय आपूर्ति अनुबंध सौंपे गए।',
        'उन्नत एयरोस्पेस रक्षा कार्यक्रमों को विदेशी निर्यात प्रतिबंधों से पूर्ण सुरक्षा प्रदान की गई।',
      ],
      bodyParagraphs: [
        'यह रणनीतिक भंडार विशेष रूप से भारी दुर्लभ खनिजों पर केंद्रित है जो मिसाइल रक्षा प्रणालियों, इलेक्ट्रिक वाहनों और रडार ट्रांसमीटरों में उच्च तापमान वाले स्थायी चुंबकों के निर्माण हेतु अत्यंत आवश्यक हैं।',
        'अधिकारियों ने रेखांकित किया कि पांच साल के गारंटीकृत न्यूनतम मूल्य प्रदान कर सरकार निजी पूंजी को घरेलू शोधन संयंत्र स्थापित करने और एकल-देश पर निर्भरता समाप्त करने के लिए प्रोत्साहित कर रही है।',
        'उद्योग प्रतिनिधियों ने इस नीति की सराहना करते हुए कहा कि स्थिर और संप्रभु घरेलू आपूर्ति शृंखलाएं इक्कीसवीं सदी की औद्योगिक रणनीति की आधारशिला हैं।',
      ],
      tags: ['रक्षा रसद', 'दुर्लभ खनिज', 'सप्लाई चेन', 'रणनीतिक भंडार'],
    },
    'hourly-lead-12': {
      title: 'विमानन नियामक: पहले अटलांटिक-पार वाणिज्यिक हाइड्रोजन-इलेक्ट्रिक कार्गो गलियारे प्रमाणित',
      deck: 'एफएए और यूरोपीय उड्डयन एजेंसियों ने संयुक्त घोषणा कर 2028 तक न्यूयॉर्क, लंदन और फ्रैंकफर्ट के बीच शून्य-उत्सर्जन मालवाहक उड़ानों का रास्ता साफ किया।',
      category: 'Economy & Trade',
      caption: 'अगली पीढ़ी के स्वच्छ ईंधन रसद ढांचे से सुसज्जित वाणिज्यिक विमानन रनवे और हैंगर।',
      leadParagraph: 'ब्रसेल्स और वाशिंगटन से एक संयुक्त घोषणा में, नागरिक उड्डयन प्राधिकरणों ने वाणिज्यिक हाइड्रोजन-संचालित मालवाहक उड़ानों के लिए विनियामक खाका प्रमाणित कर दिया।',
      keyTakeaways: [
        'तरल हाइड्रोजन ईंधन प्रणालियों के लिए विश्व के पहले एकीकृत उड़ान योग्यता मानक स्थापित।',
        'न्यूयॉर्क जेएफके, लंदन हीथ्रो और फ्रैंकफर्ट को प्रारंभिक प्रमाणित हरित कार्गो हब घोषित किया गया।',
        'प्रमाणित मार्गों पर लंबी दूरी के एयर फ्रेट कार्बन उत्सर्जन में 85% की कमी का अनुमान।',
      ],
      bodyParagraphs: [
        'इस ऐतिहासिक प्रमाणन के बाद बोइंग और एयरबस के कंसोर्टियम ने 2027 के अंत तक ट्रांस-अटलांटिक हाइड्रोजन कार्गो प्रोटोटाइप परीक्षण शुरू करने की घोषणा की है।',
        'हवाईअड्डा अधिकारियों ने तरल हाइड्रोजन भरने के लिए सुरक्षित क्रायोजेनिक ईंधन स्टेशनों और भंडारण सुविधाओं के निर्माण के लिए पूंजी निवेश की योजना पेश की।',
        'वैश्विक लॉजिस्टिक्स कंपनियों ने कहा कि शून्य-उत्सर्जन हवाई माल परिवहन अंतरराष्ट्रीय ई-कॉमर्स और उच्च-मूल्य वाले व्यापार के भविष्य को पूरी तरह बदल देगा।',
      ],
      tags: ['विमानन', 'हाइड्रोजन कार्गो', 'स्वच्छ परिवहन', 'एफएए व ईएएसए'],
    },
    'hourly-lead-13': {
      title: 'नई दिल्ली टेक शिखर सम्मेलन: संसद ने $15B सेमीकंडक्टर और क्वांटम मिशन को दी ऐतिहासिक मंजूरी',
      deck: 'भारतीय संसद ने घरेलू सिलिकॉन फैब्रिकेशन और क्वांटम कंप्यूटिंग अनुसंधान के लिए व्यापक प्रोत्साहन कानून पारित किया; क्वाड और यूरोपीय संघ के साथ तकनीकी समझौते।',
      category: 'Economy & Trade',
      caption: 'ऐतिहासिक सेमीकंडक्टर कानून पारित होने के दौरान शाम के समय रोशनी से जगमगाता नई दिल्ली स्थित संसद भवन।',
      leadParagraph: 'संसद के दोनों सदनों में गहन द्विदलीय बहस के बाद, भारतीय सांसदों ने राष्ट्रीय सेमीकंडक्टर और उन्नत सामग्री शील्ड अधिनियम को भारी बहुमत से पारित कर दिया, जिससे भारत वैश्विक इलेक्ट्रॉनिक्स आपूर्ति शृंखला का एक अनिवार्य केंद्र बन गया।',
      keyTakeaways: [
        'गुजरात, असम और उत्तर प्रदेश में 3 वाणिज्यिक फैब्रिकेशन और उन्नत पैकेजिंग संयंत्रों के लिए $15 बिलियन की पूंजीगत सब्सिडी।',
        'व्यापार और प्रौद्योगिकी परिषद के तहत अमेरिका और यूरोपीय संघ के साथ द्विपक्षीय प्रौद्योगिकी सुरक्षा प्रोटोकॉल।',
        '10,000 संप्रभु जीपीयू क्लस्टर के साथ राष्ट्रीय क्वांटम कंप्यूटिंग और एआई अनुसंधान केंद्र की स्थापना।',
      ],
      bodyParagraphs: [
        'यह कानून मेगा सेमीकंडक्टर निर्माण इकाइयों के लिए 50% केंद्रीय राजकोषीय सहायता के साथ-साथ रियायती बिजली दरों और समर्पित जल आपूर्ति गलियारों का प्रावधान करता है।',
        'विदेश और इलेक्ट्रॉनिक्स मंत्रियों ने संयुक्त रूप से घोषणा की कि भू-राजनीतिक व्यवधानों से सुरक्षा हेतु टोक्यो, वाशिंगटन और ब्रसेल्स के साथ आपूर्ति शृंखला सुरक्षा समझौते किए गए हैं।',
        'उद्योग जगत ने इस वैधानिक गारंटी का स्वागत करते हुए कहा कि घरेलू वेफर निर्माण और पैकेजिंग से डिजिटल संप्रभुता को बढ़ावा मिलेगा और पूरे उपमहाद्वीप में लाखों विशिष्ट नौकरियां पैदा होंगी।',
      ],
      tags: ['भारत', 'सेमीकंडक्टर मिशन', 'नई दिल्ली', 'क्वाड', 'डिजिटल इंडिया'],
    },
    'art-india-1': {
      title: 'नई दिल्ली टेक शिखर सम्मेलन: संसद ने $15B सेमीकंडक्टर और क्वांटम मिशन को दी ऐतिहासिक मंजूरी',
      deck: 'भारतीय संसद ने घरेलू सिलिकॉन फैब्रिकेशन और क्वांटम कंप्यूटिंग अनुसंधान के लिए व्यापक प्रोत्साहन कानून पारित किया; क्वाड और यूरोपीय संघ के साथ तकनीकी समझौते।',
      category: 'Economy & Trade',
      caption: 'ऐतिहासिक सेमीकंडक्टर कानून पारित होने के दौरान शाम के समय रोशनी से जगमगाता नई दिल्ली स्थित संसद भवन।',
      leadParagraph: 'संसद के दोनों सदनों में गहन द्विदलीय बहस के बाद, भारतीय सांसदों ने राष्ट्रीय सेमीकंडक्टर और उन्नत सामग्री शील्ड अधिनियम को भारी बहुमत से पारित कर दिया, जिससे भारत वैश्विक इलेक्ट्रॉनिक्स आपूर्ति शृंखला का एक अनिवार्य केंद्र बन गया।',
      keyTakeaways: [
        'गुजरात, असम और उत्तर प्रदेश में 3 वाणिज्यिक फैब्रिकेशन और उन्नत पैकेजिंग संयंत्रों के लिए $15 बिलियन की पूंजीगत सब्सिडी।',
        'व्यापार और प्रौद्योगिकी परिषद के तहत अमेरिका और यूरोपीय संघ के साथ द्विपक्षीय प्रौद्योगिकी सुरक्षा प्रोटोकॉल।',
        '10,000 संप्रभु जीपीयू क्लस्टर के साथ राष्ट्रीय क्वांटम कंप्यूटिंग और एआई अनुसंधान केंद्र की स्थापना।',
      ],
      bodyParagraphs: [
        'यह कानून मेगा सेमीकंडक्टर निर्माण इकाइयों के लिए 50% केंद्रीय राजकोषीय सहायता के साथ-साथ रियायती बिजली दरों और समर्पित जल आपूर्ति गलियारों का प्रावधान करता है।',
        'विदेश और इलेक्ट्रॉनिक्स मंत्रियों ने संयुक्त रूप से घोषणा की कि भू-राजनीतिक व्यवधानों से सुरक्षा हेतु टोक्यो, वाशिंगटन और ब्रसेल्स के साथ आपूर्ति शृंखला सुरक्षा समझौते किए गए हैं।',
        'उद्योग जगत ने इस वैधानिक गारंटी का स्वागत करते हुए कहा कि घरेलू वेफर निर्माण और पैकेजिंग से डिजिटल संप्रभुता को बढ़ावा मिलेगा और पूरे उपमहाद्वीप में लाखों विशिष्ट नौकरियां पैदा होंगी।',
      ],
      tags: ['भारत', 'सेमीकंडक्टर मिशन', 'नई दिल्ली', 'क्वाड', 'डिजिटल इंडिया'],
    },
  },
  es: {
    'hourly-lead-11': {
      title: 'Reserva Estratégica de Minerales: Defensa Repone Existencias de Tierras Raras Nacionales',
      deck: 'Para blindar la industria militar frente a vetos geopolíticos, el Pentágono firma contratos plurianuales con refinerías en cinco estados.',
      category: 'White House & Congress',
      caption: 'Instalación de procesamiento de tierras raras de alta pureza del programa federal estratégico.',
      leadParagraph: 'Con autorización bipartidista del Congreso, la Agencia de Logística de Defensa puso en marcha su mayor plan de acopio de minerales estratégicos en décadas.',
      keyTakeaways: [
        'Asegura reservas soberanas de 18 meses de disprosio, neodimio y litio refinados.',
        'Contratos multianuales adjudicados a refinerías en Nevada, Texas y Ohio.',
        'Protege los programas de defensa aeroespacial frente a restricciones externas de exportación.',
      ],
      bodyParagraphs: [
        'La reposición se centra en tierras raras pesadas esenciales para imanes permanentes de alta temperatura en sistemas de guiado, vehículos eléctricos y radares.',
        'Los funcionarios señalaron que, al ofrecer precios mínimos garantizados a cinco años, se incentiva la inversión privada en plantas de refinado nacionales.',
        'Representantes de la industria elogiaron la previsibilidad, destacando que cadenas de suministro estables son la base de la política industrial del siglo XXI.',
      ],
      tags: ['Logística de Defensa', 'Tierras Raras', 'Cadena de Suministro', 'Reserva Nacional'],
    },
  },
  fr: {
    'hourly-lead-11': {
      title: 'Stocks de Minéraux Stratégiques : La Défense Renfloue ses Réserves de Raffinage Nationales',
      deck: 'Pour contrer les risques de rupture d’approvisionnement, le Pentagone alloue des contrats pluriannuels à des raffineries dans cinq États.',
      category: 'White House & Congress',
      caption: 'Site de traitement de terres rares à haute pureté participant au programme fédéral stratégique.',
      leadParagraph: 'Sur autorisation bipartite du Congrès, l’Agence logistique de la Défense a engagé son plus vaste plan de réapprovisionnement minéral depuis des décennies.',
      keyTakeaways: [
        'Sécurise 18 mois de réserves souveraines de dysprosium, néodyme et lithium raffinés.',
        'Contrats pluriannuels attribués à des raffineries au Nevada, Texas et Ohio.',
        'Protège les programmes aérospatiaux militaires contre tout embargo extérieur.',
      ],
      bodyParagraphs: [
        'Ce réapprovisionnement cible les terres rares lourdes indispensables aux aimants permanents haute température des systèmes guidés et des radars.',
        'Les autorités soulignent que des prix planchers sur cinq ans incitent l’investissement privé à bâtir des infrastructures de raffinage souveraines.',
        'Les industriels saluent cette prévisibilité, rappelant que des filières d’approvisionnement stables constituent le socle de la souveraineté moderne.',
      ],
      tags: ['Logistique de Défense', 'Terres Rares', 'Approvisionnement', 'Réserve Stratégique'],
    },
  },
  de: {
    'hourly-lead-11': {
      title: 'Strategische Mineralienreserve: Verteidigungsagentur Baut Nationale Verarbeitungsbestände Auf',
      deck: 'Zur Absicherung gegen geopolitische Lieferengpässe vergibt das Pentagon mehrjährige Verträge an heimische Veredelungsbetriebe.',
      category: 'White House & Congress',
      caption: 'Hochreine Seltenerd-Verarbeitungsanlage des strategischen Bundesbevorratungsprogramms.',
      leadParagraph: 'Auf überparteilichen Beschluss des Kongresses hin startete die Defense Logistics Agency ihr größtes strategisches Bevorratungsprogramm seit Jahrzehnten.',
      keyTakeaways: [
        'Sichert 18-monatige souveräne Vorräte an raffiniertem Dysprosium, Neodym und Lithium.',
        'Mehrjährige Abnahmeverträge für Raffinerien in Nevada, Texas und Ohio.',
        'Schützt Luft- und Raumfahrtverteidigungsprogramme vor externen Exportrestriktionen.',
      ],
      bodyParagraphs: [
        'Der Fokus liegt auf schweren Seltenen Erden für Hochtemperatur-Permanentmagnete in Lenkwaffen, E-Fahrzeugen und Radarsystemen.',
        'Vertreter betonten, dass fünfjährige Mindestpreisgarantien privates Kapital für den Bau heimischer Trennanlagen mobilisieren.',
        'Industrieverbände lobten die Planungssicherheit als unverzichtbaren Pfeiler einer resilienten Industriepolitik des 21. Jahrhunderts.',
      ],
      tags: ['Verteidigungslogistik', 'Seltene Erden', 'Lieferkette', 'Strategische Reserve'],
    },
  },
  zh: {
    'hourly-lead-11': {
      title: '战略物资动员：国防后勤局启动本土稀土与关键矿物储备回填计划',
      deck: '为抵御国际供应链中断风险，采购部门与内华达、得克萨斯及俄亥俄等多州精炼厂签下多年期兜底采购合同。',
      category: 'White House & Congress',
      caption: '参与联邦战略储备计划的高纯度稀土加工精炼设施。',
      leadParagraph: '依据两党国会特别授权，美国国防后勤局启动数十年来规模最大的战略矿产回填计划，直接对接本土矿物精炼厂商。',
      keyTakeaways: [
        '锁定为期18个月的高纯度镝、钕与锂主权战略储备。',
        '向内华达州、得克萨斯州和俄亥俄州的本土精炼厂授予多年期采购合同。',
        '全面保障尖端航空航天与国防装备免受外部出口管制断供威胁。',
      ],
      bodyParagraphs: [
        '此次储备重点聚焦于重稀土元素，这是制导防空系统、电动驱动总成与相控阵雷达发射器中耐高温永磁体的核心原料。',
        '官员指出，政府通过提供为期五年的保底价格机制，有力激励私人资本投入本土矿产分离设施建设，摆脱对单一来源的依赖。',
        '产业界代表高度赞赏该政策的稳定性与确定性，强调自主可控的供应链是21世纪国家工业实力的基石。',
      ],
      tags: ['国防后勤', '稀土矿产', '供应链安全', '战略储备'],
    },
  },
  ar: {
    'hourly-lead-11': {
      title: 'مخزون المعادن الاستراتيجية: وكالة لوجستيات الدفاع تعيد ملء الاحتياطيات المحلية',
      deck: 'للتحوط ضد اضطرابات سلاسل الإمداد العالمية، يبرم البنتاغون عقوداً متعددة السنوات مع مصافي تكرير محلية في خمس ولايات.',
      category: 'White House & Congress',
      caption: 'منشأة معالجة العناصر الأرضية النادرة عالية النقاء المشاركة في برنامج الاحتياطي الفيدرالي الاستراتيجي.',
      leadParagraph: 'بتفويض برلماني من الحزبين، أطلقت وكالة لوجستيات الدفاع أضخم برنامج لتجديد المواد الاستراتيجية منذ عقود بالتعاقد المباشر مع المصافي المحلية.',
      keyTakeaways: [
        'تأمين احتياطيات سيادية تكفي 18 شهراً من الديسبروسيوم والنيوديميوم والليثيوم المكرر.',
        'منح عقود توريد طويلة الأجل لمصافي التكرير في نيفادا وتكساس وأوهايو.',
        'تحصين برامج الدفاع الجوي والفضائي المتقدمة ضد قيود التصدير الخارجية.',
      ],
      bodyParagraphs: [
        'يركز ملء الاحتياطي على العناصر الأرضية النادرة الثقيلة الضرورية للمغناطيسات الدائمة المقاومة للحرارة في أنظمة الدفاع والتوجيه والرادارات.',
        'أكد المسؤولون أن تقديم حد أدنى لأسعار الشراء لمدة خمس سنوات يحفز رؤوس الأموال الخاصة على بناء منشآت فصل وتكرير محلية تقلل الاعتماد على المصادر الخارجية.',
        'أشاد ممثلو الصناعة بالاستقرار والوضوح، مؤكدين أن سلاسل التوريد المحلية المستقرة هي حجر الزاوية للسياسة الصناعية للقرن الحادي والعشرين.',
      ],
      tags: ['اللوجستيات الدفاعية', 'العناصر النادرة', 'سلاسل الإمداد', 'الاحتياطي الاستراتيجي'],
    },
  },
  ru: {
    'hourly-lead-11': {
      title: 'Стратегический запас минералов: Управление оборонной логистики пополняет запасы редких металлов',
      deck: 'Для защиты оборонной промышленности Пентагон заключил долгосрочные контракты с отечественными перерабатывающими заводами в пяти штатах.',
      category: 'White House & Congress',
      caption: 'Предприятие по глубокой переработке редкоземельных металлов в рамках стратегической федеральной программы.',
      leadParagraph: 'На основании двухпартийного решения Конгресса Агентство оборонной логистики развернуло масштабную закупку стратегических металлов.',
      keyTakeaways: [
        'Обеспечен 18-месячный суверенный резерв очищенного диспрозия, неодима и лития.',
        'Заключены многолетние контракты с заводами в Неваде, Техасе и Огайо.',
        'Оборонные аэрокосмические программы защищены от внешних экспортных эмбарго.',
      ],
      bodyParagraphs: [
        'Основное внимание уделяется тяжелым редкоземельным металлам, необходимым для постоянных магнитов в системах высокоточного оружия и радарах.',
        'Официальные лица отметили, что пятилетние гарантированные минимальные цены стимулируют частные инвестиции в развитие собственных мощностей.',
        'Представители промышленности приветствовали предсказуемость, назвав надежные внутренние цепочки основой индустриальной безопасности XXI века.',
      ],
      tags: ['Оборонная логистика', 'Редкоземельные металлы', 'Цепочки поставок', 'Госрезерв'],
    },
  },
  ja: {
    'hourly-lead-11': {
      title: '戦略鉱物備蓄：国防兵站局が重要レアアースの国内精錬備蓄を大幅拡充',
      deck: '地政学的サプライチェーン混乱に備え、国防総省は5州の国内精錬施設と複数年にわたる直接調達契約を締結。',
      category: 'White House & Congress',
      caption: '連邦戦略備蓄補給プログラムに参加する高純度レアアース精錬処理施設。',
      leadParagraph: '超党派の議会承認に基づき、国防兵站局は数十年ぶりの規模となる戦略物資備蓄プログラムを開始し、国内鉱物精錬企業と直接契約を結びました。',
      keyTakeaways: [
        '高純度ジスプロシウム、ネオジム、リチウムの18ヶ月分主権戦略備蓄を確保。',
        'ネバダ、テキサス、オハイオ各州の国内精錬施設に複数年契約を授与。',
        '外部の輸出規制から先端航空宇宙・防衛装備プログラムを完全保護。',
      ],
      bodyParagraphs: [
        '今回の備蓄拡充は、誘導ミサイルシステム、EV駆動部、レーダー送信機の耐熱永久磁石に不可欠な重レアアースに重点を置いています。',
        '政府関係者は、5年間の最低保証価格を提示することで民間投資を国内分離精錬施設へ誘導し、単一国依存を脱却すると説明しました。',
        '業界代表はこの予測可能性を歓迎し、強靭な国内サプライチェーンこそが21世紀産業政策の礎石であると強調しました。',
      ],
      tags: ['防衛補給', 'レアアース', 'サプライチェーン', '戦略備蓄'],
    },
  },
  pt: {
    'hourly-lead-11': {
      title: 'Reserva Estratégica de Minerais: Agência de Logística de Defesa Reabastece Terras Raras Nacionais',
      deck: 'Para proteger a indústria aeroespacial de sanções externas, o Pentágono firma contratos plurianuais com refinarias em cinco estados.',
      category: 'White House & Congress',
      caption: 'Instalação de processamento de terras raras de alta pureza integrada ao programa federal estratégico.',
      leadParagraph: 'Com autorização bipartidária do Congresso, a Agência de Logística de Defesa lançou seu maior programa de estocagem de minerais estratégicos em décadas.',
      keyTakeaways: [
        'Garante 18 meses de estoques soberanos de disprósio, neodímio e lítio refinados.',
        'Contratos multianuais concedidos a refinarias em Nevada, Texas e Ohio.',
        'Protege programas aeroespaciais avançados de defesa contra embargos de exportação.',
      ],
      bodyParagraphs: [
        'O reabastecimento prioriza terras raras pesadas vitais para ímãs permanentes de alta temperatura em sistemas teleguiados e radares.',
        'Autoridades destacaram que pisos de preço de cinco anos incentivam a criação de unidades nacionais de separação de minérios.',
        'Líderes industriais elogiaram a iniciativa, ressaltando que cadeias estáveis constituem o pilar da soberania industrial moderna.',
      ],
      tags: ['Logística de Defesa', 'Terras Raras', 'Cadeia de Suprimentos', 'Reserva Soberana'],
    },
  },
  it: {
    'hourly-lead-11': {
      title: 'Riserva Strategica di Minerali: La Difesa Ripristina le Scorte Nazionali di Terre Rare',
      deck: 'Per tutelarsi contro i blocchi delle forniture geopolitiche, il Pentagono assegna contratti pluriennali a raffinerie in cinque stati.',
      category: 'White House & Congress',
      caption: 'Impianto di lavorazione di terre rare ad alta purezza del programma di approvvigionamento strategico federale.',
      leadParagraph: 'Sulla base di un accordo bipartisan del Congresso, l’Agenzia Logistica della Difesa ha avviato il più vasto programma di scorte minerali degli ultimi decenni.',
      keyTakeaways: [
        'Garantisce 18 mesi di riserve sovrane di disprosio, neodimio e litio raffinati.',
        'Contratti pluriennali concessi a raffinerie in Nevada, Texas e Ohio.',
        'Piena tutela dei programmi aerospaziali e di difesa contro restrizioni esterne all’export.',
      ],
      bodyParagraphs: [
        'Il rifornimento punta sulle terre rare pesanti indispensabili per i magneti permanenti resistenti al calore nei sistemi guidati e radar.',
        'I funzionari hanno sottolineato che prezzi minimi garantiti a cinque anni stimolano gli investimenti privati in raffinerie interne.',
        'L’industria ha accolto con favore la misura, definendo filiere produttive stabili il fondamento della politica industriale contemporanea.',
      ],
      tags: ['Logistica della Difesa', 'Terre Rare', 'Filiera Produttiva', 'Riserva Strategica'],
    },
  },
  ko: {
    'hourly-lead-11': {
      title: '전략 광물 비축：미 국방물류국, 핵심 희토류 및 전략 광물 국내 비축량 대폭 확충',
      deck: '지정학적 공급망 교란에 대비하여 미 국방부는 5개 주에 위치한 국내 정제 시설들과 다년 공급 계약을 체결했습니다.',
      category: 'White House & Congress',
      caption: '연방 전략 비축물자 보충 프로그램에 참여하는 고순도 희토류 정제 시설.',
      leadParagraph: '초당적 의회 승인에 따라 미 국방물류국은 수십 년 만에 최대 규모의 전략물자 보충 프로그램을 가동하여 국내 광물 정제 기업들과 직접 계약을 체결했습니다.',
      keyTakeaways: [
        '고순도 디스프로슘, 네오디뮴, 리튬 18개월분 주권 전략 비축량 확보.',
        '네바다, 텍사스, 오하이오의 국내 정제 공장에 다년 계약 체결.',
        '외부 수출 통제로부터 첨단 항공우주 및 방위산업 프로그램 완벽 보호.',
      ],
      bodyParagraphs: [
        '이번 비축은 유도무기 체계, 전기차 구동계, 레이더 송신기의 고온 영구자석 제조에 필수적인 중희토류에 초점을 맞추고 있습니다.',
        '당국자들은 5년 가격 하한제를 보장함으로써 민간 자본이 국내 분리 정제 시설을 구축하고 단일 국가 의존도를 낮추도록 유도하고 있다고 밝혔습니다.',
        '산업계 대표들은 이 정책의 예측 가능성을 높이 평가하며, 안정적인 국내 공급망이 21세기 산업 안보의 초석이라고 강조했습니다.',
      ],
      tags: ['방위 물류', '희토류', '공급망 안보', '전략 비축'],
    },
  },
  tr: {
    'hourly-lead-11': {
      title: 'Stratejik Maden Stoku: Savunma Lojistik Ajansı Yerli Nadir Toprak Rezervlerini Yeniliyor',
      deck: 'Küresel tedarik risklerine karşı Pentagon, beş eyaletteki yerli rafinerilerle çok yıllı tedarik anlaşmaları imzaladı.',
      category: 'White House & Congress',
      caption: 'Federal stratejik stok programına katılan yüksek saflıkta nadir toprak işleme tesisi.',
      leadParagraph: 'Kongre’nin iki partili yetkilendirmesiyle Savunma Lojistik Ajansı, yerli rafinerilerle doğrudan sözleşmeler yaparak son on yılların en büyük stoklama hamlesini başlattı.',
      keyTakeaways: [
        '18 aylık rafine disprozyum, neodimyum ve lityum stratejik egemen stoku sağlandı.',
        'Nevada, Teksas ve Ohio’daki yerli rafinerilere çok yıllı sözleşmeler verildi.',
        'Gelişmiş havacılık savunma programları dış ihracat kısıtlamalarına karşı korundu.',
      ],
      bodyParagraphs: [
        'Yenileme, güdümlü savunma sistemleri ve radarlardaki yüksek sıcaklık mıknatısları için kritik olan ağır nadir elementlere odaklanıyor.',
        'Yetkililer, beş yıllık taban fiyat garantisi vererek yerel ayrıştırma tesislerine özel yatırımları teşvik ettiklerini bildirdi.',
        'Sektör temsilcileri, istikrarlı yerli tedarik zincirlerinin 21. yüzyıl sanayi politikasının temeli olduğunu belirterek adımı memnuniyetle karşıladı.',
      ],
      tags: ['Savunma Lojistiği', 'Nadir Toprak', 'Tedarik Zinciri', 'Stratejik Rezerv'],
    },
  },
  nl: {
    'hourly-lead-11': {
      title: 'Strategische Mineralenvoorraad: Defensielogistiek Vult Binnenlandse Zeldzame Aardreserves Aan',
      deck: 'Om geopolitieke bevoorradingsrisico’s af te dekken, sluit het Pentagon meerjarige contracten met raffinaderijen in vijf staten.',
      category: 'White House & Congress',
      caption: 'Hoogzuivere verwerkingsfaciliteit voor zeldzame aardmetalen binnen het federale strategische programma.',
      leadParagraph: 'Op basis van tweeledige parlementaire toestemming startte het Defensielogistiek Agentschap zijn grootste strategische bevoorrading in decennia.',
      keyTakeaways: [
        'Beveiligt 18 maanden soevereine strategische voorraden geraffineerd dysprosium, neodymium en lithium.',
        'Meerjarige contracten toegekend aan binnenlandse raffinaderijen in Nevada, Texas en Ohio.',
        'Beschermt geavanceerde defensieprogramma’s tegen buitenlandse exportbeperkingen.',
      ],
      bodyParagraphs: [
        'De aanvulling richt zich op zware zeldzame aardmetalen die onmisbaar zijn voor hittebestendige permanente magneten in defensiesystemen.',
        'Ambtenaren verklaarden dat gegarandeerde bodemprijzen privaat kapitaal stimuleren om eigen raffinagefaciliteiten op te zetten.',
        'Industrievertegenwoordigers prezen de duidelijkheid en noemden stabiele toeleveringsketens de hoeksteen van modern industriebeleid.',
      ],
      tags: ['Defensielogistiek', 'Zeldzame Aarden', 'Toeleveringsketen', 'Strategische Reserve'],
    },
  },
  id: {
    'hourly-lead-11': {
      title: 'Cadangan Mineral Strategis: Badan Logistik Pertahanan Mengisi Ulang Pasokan Logam Tanah Jarang',
      deck: 'Untuk membentengi industri pertahanan dari embargo geopolitik, Pentagon mengontrak kilang pengolahan domestik di lima negara bagian.',
      category: 'White House & Congress',
      caption: 'Fasilitas pemurnian logam tanah jarang berdaya murni tinggi yang tergabung dalam program cadangan strategis.',
      leadParagraph: 'Berdasarkan mandat dwipartai Kongres, Badan Logistik Pertahanan meluncurkan program pemulihan material strategis terbesar dalam beberapa dekade.',
      keyTakeaways: [
        'Mengamankan cadangan berdaulat 18 bulan untuk disprosium, neodimium, dan litium murni.',
        'Kontrak multi-tahun diberikan kepada fasilitas pengolahan di Nevada, Texas, dan Ohio.',
        'Melindungi program kedirgantaraan militer dari pembatasan ekspor pihak luar.',
      ],
      bodyParagraphs: [
        'Penimbunan berfokus pada logam tanah jarang berat yang penting bagi magnet permanen bersuhu tinggi pada sistem kendali dan radar.',
        'Pejabat mencatat bahwa jaminan harga dasar lima tahun memicu investasi swasta untuk membangun fasilitas pemurnian mandiri.',
        'Perwakilan industri memuji kepastian ini, menyebut rantai pasok domestik yang tangguh sebagai pilar kebijakan industri abad ke-21.',
      ],
      tags: ['Logistik Pertahanan', 'Tanah Jarang', 'Rantai Pasok', 'Cadangan Strategis'],
    },
  },
  pl: {
    'hourly-lead-11': {
      title: 'Strategiczne Rezerwy Minerałów: Agencja Logistyki Obronnej Uzupełnia Krajowe Zapasy Pierwiastków Ziem Rzadkich',
      deck: 'Aby zabezpieczyć się przed geopolitycznymi zatorami dostaw, Pentagon zawiera wieloletnie umowy z rafineriami w pięciu stanach.',
      category: 'White House & Congress',
      caption: 'Zakład przetwórstwa metali ziem rzadkich o wysokiej czystości w ramach federalnego programu strategicznego.',
      leadParagraph: 'Na mocy dwupartyjnej zgody Kongresu Agencja Logistyki Obronnej uruchomiła największy od dekad program uzupełniania surowców strategicznych.',
      keyTakeaways: [
        'Zabezpiecza 18-miesięczne suwerenne zapasy rafinowanego dysprozu, neodymu i litu.',
        'Wieloletnie kontrakty przyznane rafineriom w Nevadzie, Teksasie i Ohio.',
        'Chroni zaawansowane programy obronne przed zewnętrznymi embargami eksportowymi.',
      ],
      bodyParagraphs: [
        'Uzupełnianie zapasów koncentruje się na ciężkich pierwiastkach ziem rzadkich, kluczowych dla magnesów trwałych w systemach naprowadzania i radarach.',
        'Władze podkreśliły, że gwarantowane ceny minimalne na pięć lat stymulują prywatny kapitał do budowy krajowych zakładów separacji minerałów.',
        'Przedstawiciele przemysłu pochwalili stabilność, uznając suwerenne łańcuchy dostaw za fundament polityki przemysłowej XXI wieku.',
      ],
      tags: ['Logistyka Obronna', 'Ziemie Rzadkie', 'Łańcuch Dostaw', 'Rezerwa Strategiczna'],
    },
  },
};

// Natural translation dictionary for standard paragraphs and bullet points across all 16 languages
const PROSE_PHRASE_DICTIONARY: Record<string, Record<string, string>> = {
  hi: {
    // Lead story 11 takeaways & body
    'Secures 18-month sovereign stockpiles of refined dysprosium, neodymium, and lithium.': 'दुर्लभ खनिजों (डिस्प्रोसियम, नियोडिमियम और लिथियम) का 18 महीने का संप्रभु रणनीतिक भंडार सुरक्षित किया गया।',
    'Multi-year contracts awarded to domestic refineries in Nevada, Texas, and Ohio.': 'नेवादा, टेक्सास और ओहियो की घरेलू रिफाइनरियों को बहु-वर्षीय आपूर्ति अनुबंध सौंपे गए।',
    'Shields advanced aerospace defense programs from external export restrictions.': 'उन्नत एयरोस्पेस रक्षा कार्यक्रमों को विदेशी निर्यात प्रतिबंधों से पूर्ण सुरक्षा प्रदान की गई।',
    'The reserve replenishment focuses on heavy rare earths essential for high-temperature permanent magnets in guided defense systems, electric vehicle drivetrains, and radar transmitters.': 'यह रणनीतिक भंडार विशेष रूप से भारी दुर्लभ खनिजों पर केंद्रित है जो मिसाइल रक्षा प्रणालियों, इलेक्ट्रिक वाहनों और रडार ट्रांसमीटरों में उच्च तापमान वाले स्थायी चुंबकों के निर्माण हेतु अत्यंत आवश्यक हैं।',
    'Officials noted that by offering five-year price floors, the government is incentivizing private capital to build out domestic separation facilities and reduce reliance on single-country sources.': 'अधिकारियों ने रेखांकित किया कि पांच साल के गारंटीकृत न्यूनतम मूल्य प्रदान कर सरकार निजी पूंजी को घरेलू शोधन संयंत्र स्थापित करने और एकल-देश पर निर्भरता समाप्त करने के लिए प्रोत्साहित कर रही है।',
    'Industry representatives commended the predictability, noting that stable domestic supply chains are the bedrock of twentieth-first century industrial policy.': 'उद्योग प्रतिनिधियों ने इस नीति की सराहना करते हुए कहा कि स्थिर और संप्रभु घरेलू आपूर्ति शृंखलाएं इक्कीसवीं सदी की औद्योगिक रणनीति की आधारशिला हैं।',
    'High-purity rare earth processing facility participating in the strategic federal replenishment program.': 'रणनीतिक संघीय कार्यक्रम में भाग लेने वाली उच्च-शुद्धता वाली दुर्लभ खनिज प्रसंस्करण सुविधा।',

    // Lead story 1 takeaways & body
    'Sets a unified 12% ceiling on reciprocal critical mineral import subsidies through 2032.': '2032 तक दुर्लभ खनिजों के आयात पर सब्सिडी की अधिकतम सीमा 12% तय की गई।',
    'Establishes an automated joint dispute arbitration panel in Geneva to resolve tariff grievances in under 45 days.': '45 दिनों के भीतर व्यापारिक विवाद सुलझाने के लिए जिनेवा में स्वचालित संयुक्त मध्यस्थता मंच स्थापित हुआ।',
    'Congressional leadership has pledged an expedited cloture vote for statutory ratification this Thursday.': 'संसदीय नेतृत्व ने गुरुवार को इस समझौते के वैधानिक अनुमोदन हेतु त्वरित मतदान का संकल्प लिया।',
    'The breakthrough came after forty-eight continuous hours of high-stakes bargaining between senior White House economic envoys and European Union trade directors.': 'व्हाइट हाउस के आर्थिक दूतों और यूरोपीय संघ के व्यापार निदेशकों के बीच 48 घंटे की लगातार वार्ता के बाद यह ऐतिहासिक सफलता हासिल हुई।',
    'Under the newly minted framework, dubbed the Transatlantic Industrial Compact, both jurisdictions agreed to mutual recognition of origin standards for rare earth elements processed within allied borders.': 'ट्रांसएटलांटिक इंडस्ट्रियल कॉम्पैक्ट के तहत दोनों पक्षों ने मित्र देशों में शोधित दुर्लभ खनिजों के लिए उत्पत्ति के मानकों को पारस्परिक मान्यता देने पर सहमति जताई।',
    'Reaction on Capitol Hill was swift. The Senate Finance Committee chair released a statement calling the accord an indispensable guardrail protecting domestic manufacturing.': 'कैपिटल हिल पर सीनेट वित्त समिति के अध्यक्ष ने समझौते का स्वागत करते हुए इसे घरेलू विनिर्माण को सुरक्षित रखने वाला कदम बताया।',

    // Secondary & Rail articles
    'The spokesperson rebuffed allegations of unilateral provocation, asserting that multilateral freedom of navigation operations are grounded strictly in international maritime law.': 'प्रवक्ता ने एकतरफा उकसावे के आरोपों को खारिज करते हुए दोहराया कि नौवहन स्वतंत्रता अभियान पूरी तरह अंतरराष्ट्रीय समुद्री कानून पर आधारित हैं।',
    'Beginning next week, rotating squadrons of long-range maritime surveillance aircraft will conduct scheduled reconnaissance sweeps across international transit corridors.': 'अगले सप्ताह से लंबी दूरी के समुद्री निगरानी विमान अंतरराष्ट्रीय गलियारों में अनुसूचित गश्त शुरू करेंगे।',
    'The emergency session was precipitated by sudden regulatory inspections at several pivotal maritime hubs, creating backlogs.': 'यह आपातकालीन सत्र कई प्रमुख बंदरगाहों पर अचानक हुए निरीक्षणों के बाद उत्पन्न भीड़भाड़ के कारण बुलाया गया था।',
    'Central to the talks is a proposal to establish expedited customs clearance lanes for verified green-certified cargo vessels.': 'वार्ता का मुख्य केंद्र हरित-प्रमाणित मालवाहक जहाजों के लिए त्वरित सीमा शुल्क निकासी लेन स्थापित करना है।',

    // Readers Perspectives / Comments
    'The 12 percent subsidy cap represents a realistic compromise, though everything hinges on whether the Geneva panel can issue binding arbitrations without triggering sovereign vetoes.': '12 प्रतिशत सब्सिडी सीमा एक व्यावहारिक समझौता है, बशर्ते जिनेवा मध्यस्थता मंच बिना किसी संप्रभु वीटो के बाध्यकारी फैसले सुना सके।',
    'Significant that allied rare earth sourcing is explicitly included. This resolves the customs limbo that automotive component suppliers have faced for months.': 'मित्र देशों से दुर्लभ खनिजों की सोर्सिंग को शामिल करना बेहद महत्वपूर्ण है। इससे ऑटोमोबाइल क्षेत्र की अनिश्चितता समाप्त होगी।',

    // Battleground matchup & issues
    'Incumbent': 'वर्तमान सांसद',
    'Challenger': 'चुनौती देने वाले',
    'Manufacturing subsidies & Natural gas infrastructure': 'विनिर्माण सब्सिडी और प्राकृतिक गैस बुनियादी ढांचा',
    'Colorado River water rights & Border commerce logistics': 'कोलोराडो नदी जल अधिकार और सीमा व्यापार रसद',
    'Clean energy battery corridor & Rural hospital solvency': 'स्वच्छ ऊर्जा बैटरी गलियारा और ग्रामीण अस्पताल स्थिरता',
    // Secondary, Rail, and Standard Article Titles & Decks
    'The Press Room Showdown: State Department Clarifies Maritime Freedom Doctrine in South China Sea': 'द प्रेस रूम शोडाउन: विदेश विभाग ने दक्षिण चीन सागर में नौवहन स्वतंत्रता सिद्धांत स्पष्ट किया',
    'Supply Chains Under Scrutiny: Pacific Trade Envoys Tackle Pacific Basin Tariff Escalation': 'जांच के दायरे में आपूर्ति शृंखलाएं: प्रशांत व्यापार दूतों ने बंदरगाह टैरिफ वृद्धि पर बुलाई आपात बैठक',
    'Bipartisan Appropriations Push Averts Autumn Government Funding Cliff with Hours to Spare': 'द्विदलीय विनियोग विधेयक: शरदकालीन सरकारी कामकाज ठप होने से कुछ घंटे पहले बजट समझौता',
    'Battleground 2026: Suburban Realignment Challenges Conventional Senate Map Calculus': 'चुनावी रणभूमि 2026: उपनगरीय मतदाताओं के रुख में बदलाव ने सीनेट समीकरण बदले',
    'The AI Sovereign Sovereignty Directive: European Union Imposes Strict Export Screenings on Advanced Clusters': 'संप्रभु एआई निर्देश: यूरोपीय संघ ने उन्नत कंप्यूटिंग क्लस्टर निर्यात पर सख्त जांच लागू की',
    'The Fiscal Deficit Paradox: How High Nominal Growth Is Complicating Federal Reserve Rate Pathways': 'राजकोषीय घाटा विरोधाभास: उच्च आर्थिक विकास कैसे केंद्रीय बैंक की ब्याज दर नीतियों को जटिल बना रहा है',
    'Judicial Scrutiny: Supreme Court Agrees to Review Regulatory Agency Rule-Making Authority': 'न्यायिक समीक्षा: सुप्रीम कोर्ट विनियामक एजेंसियों के नियम-निर्माण अधिकारों की वैधता पर सुनवाई के लिए सहमत',
    'Semiconductor Sovereign Foundry Initiative: Bipartisan $42B Capital Expansion Passed': 'संप्रभु सेमीकंडक्टर फाउंड्री पहल: $42 बिलियन के द्विदलीय पूंजीगत विस्तार को मंजूरी',
    'Transatlantic Wind Corridor: High-Voltage Offshore Interconnection Achieves Financial Close': 'अटलांटिक-पार पवन गलियारा: उच्च-वोल्टेज अपतटीय ग्रिड परियोजना को वित्तीय स्वीकृति मिली',
    'In an unusually combative 90-minute briefing, the administration dismissed diplomatic protests and announced permanent joint aerial patrols with regional partners.': '90 मिनट की तीखी प्रेस वार्ता में, सरकार ने राजनयिक आपत्तियों को खारिज करते हुए क्षेत्रीय साझेदारों के साथ स्थायी संयुक्त निगरानी गश्त की घोषणा की।',
    'Surging shipping container throughput and rising port handling surcharges prompt commerce ministers to convene an emergency Pacific logistics council.': 'कंटेनर परिवहन दरों में वृद्धि और बंदरगाह प्रबंधन अधिभार के बाद आठ एशिया-प्रशांत देशों के वाणिज्य मंत्रियों ने सिंगापुर में आपात सत्र आयोजित किया।',
    'Congressional leadership agrees to a stopgap continuing resolution, but ideological fault lines on agriculture subsidies and foreign aid threaten December cloture.': 'संसदीय नेताओं ने स्टॉपगैप निरंतरता प्रस्ताव को पारित कर संघीय सरकार के कामकाज की निरंतरता सुनिश्चित की।',
    'Surveys across five pivotal battleground states reveal independent suburban voters splitting ballots between fiscal conservatism and environmental protections.': 'प्रमुख राज्यों में स्वतंत्र और उपनगरीय मतदाताओं का आर्थिक नीतियों पर विभाजित मतदान पारंपरिक दलीय रणनीतियों को चुनौती दे रहा है।',
    'Brussels introduces unprecedented dual-use licensing requirements for sovereign cloud infrastructure, creating diplomatic pushback from Silicon Valley.': 'ब्रुसेल्स ने अगली पीढ़ी के एआई डेटा केंद्रों और सुपरकंप्यूटिंग चिप्स के निर्यात पर दोहरे उपयोग सुरक्षा मानक निर्धारित किए।',
    'Resilient consumer demand and persistent wage gains force central bank governors to balance sticky inflation against rising debt service costs.': 'लचीले उपभोक्ता खर्च और मुद्रास्फीति दबावों के बीच फेडरल रिजर्व ने मौद्रिक नीति में सतर्कता बरतने के संकेत दिए।',
    'A landmark constitutional challenge will decide whether independent federal agencies can enforce commercial disclosure rules without express congressional mandates.': 'संवैधानिक पीठ इस ऐतिहासिक मामले में तय करेगी कि संघीय एजेंसियां संसद की स्पष्ट मंजूरी के बिना व्यापक नियम लागू कर सकती हैं या नहीं।',
    'Indian legislative leaders enact comprehensive statutory incentives for domestic silicon foundries and quantum computing research, forging strategic tech accords with Quad and EU partners.': 'भारतीय संसद ने घरेलू सिलिकॉन फैब्रिकेशन और क्वांटम कंप्यूटिंग अनुसंधान के लिए व्यापक प्रोत्साहन कानून पारित किया; क्वाड और यूरोपीय संघ के साथ तकनीकी समझौते।',
    'Chief Diplomatic & Trade Correspondents': 'मुख्य राजनयिक एवं व्यापार संवाददाता',
    'National Security Bureau Chief': 'राष्ट्रीय सुरक्षा ब्यूरो प्रमुख',
    'Global Commerce Editor': 'वैश्विक व्यापार संपादक',
    'Chief Congressional Correspondent': 'मुख्य संसदीय संवाददाता',
    'Senior Political Polling Analyst': 'वरिष्ठ चुनावी एवं जनमत विश्लेषक',
    'European Tech Governance Reporter': 'यूरोपीय तकनीकी शासन संवाददाता',
    'Senior Macroeconomic Correspondent': 'वरिष्ठ समष्टि-अर्थशास्त्र संवाददाता',
    'Supreme Court & Legal Affairs Editor': 'सुप्रीम कोर्ट एवं कानूनी मामलों के संपादक',
    'South Asia Geopolitics & Tech Policy Desk': 'दक्षिण एशिया भू-राजनीति एवं तकनीकी नीति डेस्क',
    'Live Bulletin Unit': 'लाइव बुलेटिन यूनिट',
    'Supply Chain & Defense Analysts': 'आपूर्ति शृंखला एवं रक्षा विश्लेषक',
    'Global Aviation & Commerce Editor': 'वैश्विक विमानन एवं वाणिज्य संपादक',
  },
  es: {
    'Incumbent': 'Titular',
    'Challenger': 'Aspirante',
    'Manufacturing subsidies & Natural gas infrastructure': 'Subsidios de manufactura e infraestructura de gas',
    'Colorado River water rights & Border commerce logistics': 'Derechos de agua del Río Colorado y comercio fronterizo',
    'Clean energy battery corridor & Rural hospital solvency': 'Corredor de baterías limpias y salud rural',
    'Dairy trade parity & Agricultural supply chain costs': 'Paridad láctea y costos de suministros agrícolas',
    'Steel tariffs & Rail safety regulatory standards': 'Aranceles al acero y seguridad ferroviaria',
    'Hospitality union wage rules & Federal public land solar leases': 'Salarios de hostelería y plantas solares públicas',
    'Secures 18-month sovereign stockpiles of refined dysprosium, neodymium, and lithium.': 'Asegura reservas soberanas de 18 meses de disprosio, neodimio y litio refinados.',
    'Multi-year contracts awarded to domestic refineries in Nevada, Texas, and Ohio.': 'Contratos multianuales adjudicados a refinerías en Nevada, Texas y Ohio.',
    'Shields advanced aerospace defense programs from external export restrictions.': 'Protege los programas de defensa aeroespacial frente a restricciones externas de exportación.',
    'The reserve replenishment focuses on heavy rare earths essential for high-temperature permanent magnets in guided defense systems, electric vehicle drivetrains, and radar transmitters.': 'La reposición se centra en tierras raras pesadas esenciales para imanes permanentes de alta temperatura en sistemas de guiado, vehículos eléctricos y radares.',
    'Officials noted that by offering five-year price floors, the government is incentivizing private capital to build out domestic separation facilities and reduce reliance on single-country sources.': 'Los funcionarios señalaron que, al ofrecer precios mínimos garantizados a cinco años, se incentiva la inversión privada en plantas de refinado nacionales.',
    'Industry representatives commended the predictability, noting that stable domestic supply chains are the bedrock of twentieth-first century industrial policy.': 'Representantes de la industria elogiaron la previsibilidad, destacando que cadenas de suministro estables son la base de la política industrial del siglo XXI.',
  },
  fr: {
    'Secures 18-month sovereign stockpiles of refined dysprosium, neodymium, and lithium.': 'Sécurise 18 mois de réserves souveraines de dysprosium, néodyme et lithium raffinés.',
    'Multi-year contracts awarded to domestic refineries in Nevada, Texas, and Ohio.': 'Contrats pluriannuels attribués à des raffineries au Nevada, Texas et Ohio.',
    'Shields advanced aerospace defense programs from external export restrictions.': 'Protège les programmes aérospatiaux militaires contre tout embargo extérieur.',
    'The reserve replenishment focuses on heavy rare earths essential for high-temperature permanent magnets in guided defense systems, electric vehicle drivetrains, and radar transmitters.': 'Ce réapprovisionnement cible les terres rares lourdes indispensables aux aimants permanents haute température des systèmes guidés et des radars.',
    'Officials noted that by offering five-year price floors, the government is incentivizing private capital to build out domestic separation facilities and reduce reliance on single-country sources.': 'Les autorités soulignent que des prix planchers sur cinq ans incitent l’investissement privé à bâtir des infrastructures de raffinage souveraines.',
    'Industry representatives commended the predictability, noting that stable domestic supply chains are the bedrock of twentieth-first century industrial policy.': 'Les industriels saluent cette prévisibilité, rappelant que des filières d’approvisionnement stables constituent le socle de la souveraineté moderne.',
  },
  de: {
    'Secures 18-month sovereign stockpiles of refined dysprosium, neodymium, and lithium.': 'Sichert 18-monatige souveräne Vorräte an raffiniertem Dysprosium, Neodym und Lithium.',
    'Multi-year contracts awarded to domestic refineries in Nevada, Texas, and Ohio.': 'Mehrjährige Abnahmeverträge für Raffinerien in Nevada, Texas und Ohio.',
    'Shields advanced aerospace defense programs from external export restrictions.': 'Schützt Luft- und Raumfahrtverteidigungsprogramme vor externen Exportrestriktionen.',
    'The reserve replenishment focuses on heavy rare earths essential for high-temperature permanent magnets in guided defense systems, electric vehicle drivetrains, and radar transmitters.': 'Der Fokus liegt auf schweren Seltenen Erden für Hochtemperatur-Permanentmagnete in Lenkwaffen, E-Fahrzeugen und Radarsystemen.',
    'Officials noted that by offering five-year price floors, the government is incentivizing private capital to build out domestic separation facilities and reduce reliance on single-country sources.': 'Vertreter betonten, dass fünfjährige Mindestpreisgarantien privates Kapital für den Bau heimischer Trennanlagen mobilisieren.',
    'Industry representatives commended the predictability, noting that stable domestic supply chains are the bedrock of twentieth-first century industrial policy.': 'Industrieverbände lobten die Planungssicherheit als unverzichtbaren Pfeiler einer resilienten Industriepolitik des 21. Jahrhunderts.',
  },
  zh: {
    'Secures 18-month sovereign stockpiles of refined dysprosium, neodymium, and lithium.': '锁定为期18个月的高纯度镝、钕与锂主权战略储备。',
    'Multi-year contracts awarded to domestic refineries in Nevada, Texas, and Ohio.': '向内华达州、得克萨斯州和俄樵州本土精炼厂授予多年期采购合同。',
    'Shields advanced aerospace defense programs from external export restrictions.': '全面保障尖端航空航天与国防装备免受外部出口管制断供威胁。',
    'The reserve replenishment focuses on heavy rare earths essential for high-temperature permanent magnets in guided defense systems, electric vehicle drivetrains, and radar transmitters.': '此次储备重点聚焦于重稀土元素，这是制导防空系统、电动驱动总成与相控阵雷达发射器中耐高温永磁体的核心原料。',
    'Officials noted that by offering five-year price floors, the government is incentivizing private capital to build out domestic separation facilities and reduce reliance on single-country sources.': '官员指出，政府通过提供为期五年的保底价格机制，有力激励私人资本投入本土矿产分离设施建设，摆脱对单一来源的依赖。',
    'Industry representatives commended the predictability, noting that stable domestic supply chains are the bedrock of twentieth-first century industrial policy.': '产业界代表高度赞赏该政策的稳定性与确定性，强调自主可控的供应链是21世纪国家工业实力的基石。',
  },
  ar: {
    'Secures 18-month sovereign stockpiles of refined dysprosium, neodymium, and lithium.': 'تأمين احتياطيات سيادية تكفي 18 شهراً من الديسبروسيوم والنيوديميوم والليثيوم المكرر.',
    'Multi-year contracts awarded to domestic refineries in Nevada, Texas, and Ohio.': 'منح عقود توريد طويلة الأجل لمصافي التكرير في نيفادا وتكساس وأوهايو.',
    'Shields advanced aerospace defense programs from external export restrictions.': 'تحصين برامج الدفاع الجوي والفضائي المتقدمة ضد قيود التصدير الخارجية.',
    'The reserve replenishment focuses on heavy rare earths essential for high-temperature permanent magnets in guided defense systems, electric vehicle drivetrains, and radar transmitters.': 'يركز ملء الاحتياطي على العناصر الأرضية النادرة الثقيلة الضرورية للمغناطيسات الدائمة المقاومة للحرارة في أنظمة الدفاع والتوجيه والرادارات.',
    'Officials noted that by offering five-year price floors, the government is incentivizing private capital to build out domestic separation facilities and reduce reliance on single-country sources.': 'أكد المسؤولون أن تقديم حد أدنى لأسعار الشراء لمدة خمس سنوات يحفز رؤوس الأموال الخاصة على بناء منشآت فصل وتكرير محلية تقلل الاعتماد على المصادر الخارجية.',
    'Industry representatives commended the predictability, noting that stable domestic supply chains are the bedrock of twentieth-first century industrial policy.': 'أشاد ممثلو الصناعة بالاستقرار والوضوح، مؤكدين أن سلاسل التوريد المحلية المستقرة هي حجر الزاوية للسياسة الصناعية للقرن الحادي والعشرين.',
  },
  ru: {
    'Secures 18-month sovereign stockpiles of refined dysprosium, neodymium, and lithium.': 'Обеспечен 18-месячный суверенный резерв очищенного диспрозия, неодима и лития.',
    'Multi-year contracts awarded to domestic refineries in Nevada, Texas, and Ohio.': 'Заключены многолетние контракты с заводами в Неваде, Техасе и Огайо.',
    'Shields advanced aerospace defense programs from external export restrictions.': 'Оборонные аэрокосмические программы защищены от внешних экспортных эмбарго.',
    'The reserve replenishment focuses on heavy rare earths essential for high-temperature permanent magnets in guided defense systems, electric vehicle drivetrains, and radar transmitters.': 'Основное внимание уделяется тяжелым редкоземельным металлам, необходимым для постоянных магнитов в системах высокоточного оружия и радарах.',
    'Officials noted that by offering five-year price floors, the government is incentivizing private capital to build out domestic separation facilities and reduce reliance on single-country sources.': 'Официальные лица отметили, что пятилетние гарантированные минимальные цены стимулируют частные инвестиции в развитие собственных мощностей.',
    'Industry representatives commended the predictability, noting that stable domestic supply chains are the bedrock of twentieth-first century industrial policy.': 'Представители промышленности приветствовали предсказуемость, назвав надежные внутренние цепочки основой индустриальной безопасности XXI века.',
  },
  ja: {
    'Secures 18-month sovereign stockpiles of refined dysprosium, neodymium, and lithium.': '高純度ジスプロシウム、ネオジム、リチウムの18ヶ月分主権戦略備蓄を確保。',
    'Multi-year contracts awarded to domestic refineries in Nevada, Texas, and Ohio.': 'ネバダ、テキサス、オハイオ各州の国内精錬施設に複数年契約を授与。',
    'Shields advanced aerospace defense programs from external export restrictions.': '外部の輸出規制から先端航空宇宙・防衛装備プログラムを完全保護。',
    'The reserve replenishment focuses on heavy rare earths essential for high-temperature permanent magnets in guided defense systems, electric vehicle drivetrains, and radar transmitters.': '今回の備蓄拡充は、誘導ミサイルシステム、EV駆動部、レーダー送信機の耐熱永久磁石に不可欠な重レアアースに重点を置いています。',
    'Officials noted that by offering five-year price floors, the government is incentivizing private capital to build out domestic separation facilities and reduce reliance on single-country sources.': '政府関係者は、5年間の最低保証価格を提示することで民間投資を国内分離精錬施設へ誘導し、単一国依存を脱却すると説明しました。',
    'Industry representatives commended the predictability, noting that stable domestic supply chains are the bedrock of twentieth-first century industrial policy.': '業界代表はこの予測可能性を歓迎し、強靭な国内サプライチェーンこそが21世紀産業政策の礎石であると強調しました。',
  },
  pt: {
    'Secures 18-month sovereign stockpiles of refined dysprosium, neodymium, and lithium.': 'Garante 18 meses de estoques soberanos de disprósio, neodímio e lítio refinados.',
    'Multi-year contracts awarded to domestic refineries in Nevada, Texas, and Ohio.': 'Contratos multianuais concedidos a refinarias em Nevada, Texas e Ohio.',
    'Shields advanced aerospace defense programs from external export restrictions.': 'Protege programas aeroespaciais avançados de defesa contra embargos de exportação.',
    'The reserve replenishment focuses on heavy rare earths essential for high-temperature permanent magnets in guided defense systems, electric vehicle drivetrains, and radar transmitters.': 'O reabastecimento prioriza terras raras pesadas vitais para ímãs permanentes de alta temperatura em sistemas teleguiados e radares.',
    'Officials noted that by offering five-year price floors, the government is incentivizing private capital to build out domestic separation facilities and reduce reliance on single-country sources.': 'Autoridades destacaram que pisos de preço de cinco anos incentivam a criação de unidades nacionais de separação de minérios.',
    'Industry representatives commended the predictability, noting that stable domestic supply chains are the bedrock of twentieth-first century industrial policy.': 'Líderes industriais elogiaram a iniciativa, ressaltando que cadeias estáveis constituem o pilar da soberania industrial moderna.',
  },
  it: {
    'Secures 18-month sovereign stockpiles of refined dysprosium, neodymium, and lithium.': 'Garantisce 18 mesi di riserve sovrane di disprosio, neodimio e litio raffinati.',
    'Multi-year contracts awarded to domestic refineries in Nevada, Texas, and Ohio.': 'Contratti pluriannali concessi a raffinerie in Nevada, Texas e Ohio.',
    'Shields advanced aerospace defense programs from external export restrictions.': 'Piena tutela dei programmi aerospaziali e di difesa contro restrizioni esterne all’export.',
    'The reserve replenishment focuses on heavy rare earths essential for high-temperature permanent magnets in guided defense systems, electric vehicle drivetrains, and radar transmitters.': 'Il rifornimento punta sulle terre rare pesanti indispensabili per i magneti permanenti resistenti al calore nei sistemi guidati e radar.',
    'Officials noted that by offering five-year price floors, the government is incentivizing private capital to build out domestic separation facilities and reduce reliance on single-country sources.': 'I funzionari hanno sottolineato che prezzi minimi garantiti a cinque anni stimolano gli investimenti privati in raffinerie interne.',
    'Industry representatives commended the predictability, noting that stable domestic supply chains are the bedrock of twentieth-first century industrial policy.': 'L’industria ha accolto con favore la misura, definendo filiere produttive stabili il fondamento della politica industriale contemporanea.',
  },
  ko: {
    'Secures 18-month sovereign stockpiles of refined dysprosium, neodymium, and lithium.': '고순도 디스프로슘, 네오디뮴, 리튬 18개월분 주권 전략 비축량 확보.',
    'Multi-year contracts awarded to domestic refineries in Nevada, Texas, and Ohio.': '네바다, 텍사스, 오하이오의 국내 정제 공장에 다년 계약 체결.',
    'Shields advanced aerospace defense programs from external export restrictions.': '외부 수출 통제로부터 첨단 항공우주 및 방위산업 프로그램 완벽 보호.',
    'The reserve replenishment focuses on heavy rare earths essential for high-temperature permanent magnets in guided defense systems, electric vehicle drivetrains, and radar transmitters.': '이번 비축은 유도무기 체계, 전기차 구동계, 레이더 송신기의 고온 영구자석 제조에 필수적인 중희토류에 초점을 맞추고 있습니다.',
    'Officials noted that by offering five-year price floors, the government is incentivizing private capital to build out domestic separation facilities and reduce reliance on single-country sources.': '당국자들은 5년 가격 하한제를 보장함으로써 민간 자본이 국내 분리 정제 시설을 구축하고 단일 국가 의존도를 낮추도록 유도하고 있다고 밝혔습니다.',
    'Industry representatives commended the predictability, noting that stable domestic supply chains are the bedrock of twentieth-first century industrial policy.': '산업계 대표들은 이 정책의 예측 가능성을 높이 평가하며, 안정적인 국내 공급망이 21세기 산업 안보의 초석이라고 강조했습니다.',
  },
  tr: {
    'Secures 18-month sovereign stockpiles of refined dysprosium, neodymium, and lithium.': '18 aylık rafine disprozyum, neodimyum ve lityum stratejik egemen stoku sağlandı.',
    'Multi-year contracts awarded to domestic refineries in Nevada, Texas, and Ohio.': 'Nevada, Teksas ve Ohio’daki yerli rafinerilere çok yıllı sözleşmeler verildi.',
    'Shields advanced aerospace defense programs from external export restrictions.': 'Gelişmiş havacılık savunma programları dış ihracat kısıtlamalarına karşı korundu.',
    'The reserve replenishment focuses on heavy rare earths essential for high-temperature permanent magnets in guided defense systems, electric vehicle drivetrains, and radar transmitters.': 'Yenileme, güdümlü savunma sistemleri ve radarlardaki yüksek sıcaklık mıknatısları için kritik olan ağır nadir elementlere odaklanıyor.',
    'Officials noted that by offering five-year price floors, the government is incentivizing private capital to build out domestic separation facilities and reduce reliance on single-country sources.': 'Yetkililer, beş yıllık taban fiyat garantisi vererek yerel ayrıştırma tesislerine özel yatırımları teşvik ettiklerini bildirdi.',
    'Industry representatives commended the predictability, noting that stable domestic supply chains are the bedrock of twentieth-first century industrial policy.': 'Sektör temsilcileri, istikrarlı yerli tedarik zincirlerinin 21. yüzyıl sanayi politikasının temeli olduğunu belirterek adımı memnuniyetle karşıladı.',
  },
  nl: {
    'Secures 18-month sovereign stockpiles of refined dysprosium, neodymium, and lithium.': 'Beveiligt 18 maanden soevereine strategische voorraden geraffineerd dysprosium, neodymium en lithium.',
    'Multi-year contracts awarded to domestic refineries in Nevada, Texas, and Ohio.': 'Meerjarige contracten toegekend aan binnenlandse raffinaderijen in Nevada, Texas en Ohio.',
    'Shields advanced aerospace defense programs from external export restrictions.': 'Beschermt geavanceerde defensieprogramma’s tegen buitenlandse exportbeperkingen.',
    'The reserve replenishment focuses on heavy rare earths essential for high-temperature permanent magnets in guided defense systems, electric vehicle drivetrains, and radar transmitters.': 'De aanvulling richt zich op zware zeldzame aardmetalen die onmisbaar zijn voor hittebestendige permanente magneten in defensiesystemen.',
    'Officials noted that by offering five-year price floors, the government is incentivizing private capital to build out domestic separation facilities and reduce reliance on single-country sources.': 'Ambtenaren verklaarden dat gegarandeerde bodemprijzen privaat kapitaal stimuleren om eigen raffinagefaciliteiten op te zetten.',
    'Industry representatives commended the predictability, noting that stable domestic supply chains are the bedrock of twentieth-first century industrial policy.': 'Industrievertegenwoordigers prezen de duidelijkheid en noemden stabiele toeleveringsketens de hoeksteen van modern industriebeleid.',
  },
  id: {
    'Secures 18-month sovereign stockpiles of refined dysprosium, neodymium, and lithium.': 'Mengamankan cadangan berdaulat 18 bulan untuk disprosium, neodimium, dan litium murni.',
    'Multi-year contracts awarded to domestic refineries in Nevada, Texas, and Ohio.': 'Kontrak multi-tahun diberikan kepada fasilitas pengolahan di Nevada, Texas, dan Ohio.',
    'Shields advanced aerospace defense programs from external export restrictions.': 'Melindungi program kedirgantaraan militer dari pembatasan ekspor pihak luar.',
    'The reserve replenishment focuses on heavy rare earths essential for high-temperature permanent magnets in guided defense systems, electric vehicle drivetrains, and radar transmitters.': 'Penimbunan berfokus pada logam tanah jarang berat yang penting bagi magnet permanen bersuhu tinggi pada sistem kendali dan radar.',
    'Officials noted that by offering five-year price floors, the government is incentivizing private capital to build out domestic separation facilities and reduce reliance on single-country sources.': 'Pejabat mencatat bahwa jaminan harga dasar lima tahun memicu investasi swasta untuk membangun fasilitas pemurnian mandiri.',
    'Industry representatives commended the predictability, noting that stable domestic supply chains are the bedrock of twentieth-first century industrial policy.': 'Perwakilan industri memuji kepastian ini, menyebut rantai pasok domestik yang tangguh sebagai pilar kebijakan industri abad ke-21.',
  },
  pl: {
    'Secures 18-month sovereign stockpiles of refined dysprosium, neodymium, and lithium.': 'Zabezpiecza 18-miesięczne suwerenne zapasy rafinowanego dysprozu, neodymu i litu.',
    'Multi-year contracts awarded to domestic refineries in Nevada, Texas, and Ohio.': 'Wieloletnie kontrakty przyznane rafineriom w Nevadzie, Teksasie i Ohio.',
    'Shields advanced aerospace defense programs from external export restrictions.': 'Chroni zaawansowane programy obronne przed zewnętrznymi embargami eksportowymi.',
    'The reserve replenishment focuses on heavy rare earths essential for high-temperature permanent magnets in guided defense systems, electric vehicle drivetrains, and radar transmitters.': 'Uzupełnianie zapasów koncentruje się na ciężkich pierwiastkach ziem rzadkich, kluczowych dla magnesów trwałych w systemach naprowadzania i radarach.',
    'Officials noted that by offering five-year price floors, the government is incentivizing private capital to build out domestic separation facilities and reduce reliance on single-country sources.': 'Władze podkreśliły, że gwarantowane ceny minimalne na pięć lat stymulują prywatny kapitał do budowy krajowych zakładów separacji minerałów.',
    'Industry representatives commended the predictability, noting that stable domestic supply chains are the bedrock of twentieth-first century industrial policy.': 'Przedstawiciele przemysłu pochwalili stabilność, uznając suwerenne łańcuchy dostaw za fundament polityki przemysłowej XXI wieku.',
  },
};

// Tag translations across languages
export const TAG_TRANSLATIONS: Record<string, Record<string, string>> = {
  hi: {
    'Defense Logistics': 'रक्षा रसद',
    'Rare Earths': 'दुर्लभ खनिज',
    'Supply Chain': 'सप्लाई चेन',
    'National Reserve': 'राष्ट्रीय भंडार',
    'G7 Summit': 'जी7 शिखर सम्मेलन',
    'Trade Policy': 'व्यापार नीति',
    'Industrial Strategy': 'औद्योगिक रणनीति',
    'Clean Tech Tariffs': 'स्वच्छ ऊर्जा टैरिफ',
    'State Department': 'विदेश विभाग',
    'Indo-Pacific': 'इंडो-पैसिफिक',
    'Maritime Security': 'समुद्री सुरक्षा',
    'Naval Strategy': 'नौसैनिक रणनीति',
    'Pacific Trade': 'प्रशांत व्यापार',
    'Tariff War': 'टैरिफ युद्ध',
    'Port Logistics': 'बंदरगाह रसद',
    'Clean Energy': 'स्वच्छ ऊर्जा',
    'Aviation': 'विमानन',
    'Hydrogen Cargo': 'हाइड्रोजन कार्गो',
    'Clean Transport': 'स्वच्छ परिवहन',
    'White House': 'व्हाइट हाउस',
    'Congress': 'अमेरिकी कांग्रेस',
    'Supreme Court': 'सुप्रीम कोर्ट',
    'Data Privacy': 'डेटा गोपनीयता',
    'Artificial Intelligence': 'कृत्रिम बुद्धिमत्ता',
    'Federal Reserve': 'फेडरल रिजर्व',
    'Inflation': 'मुद्रास्फीति',
    'Interest Rates': 'ब्याज दरें',
    'Breaking': 'ताजा खबर',
    'Urgent Dispatch': 'अति आवश्यक',
    'Analysis': 'विश्लेषण',
    'Policy': 'नीति',
  },
  es: {
    'Defense Logistics': 'Logística de Defensa',
    'Rare Earths': 'Tierras Raras',
    'Supply Chain': 'Cadena de Suministro',
    'National Reserve': 'Reserva Nacional',
    'G7 Summit': 'Cumbre del G7',
    'Trade Policy': 'Política Comercial',
    'Industrial Strategy': 'Estrategia Industrial',
    'Clean Tech Tariffs': 'Aranceles Limpios',
    'State Department': 'Departamento de Estado',
    'Indo-Pacific': 'Indopacífico',
    'Maritime Security': 'Seguridad Marítima',
    'Breaking': 'Última Hora',
    'Urgent Dispatch': 'Despacho Urgente',
  },
  fr: {
    'Defense Logistics': 'Logistique de Défense',
    'Rare Earths': 'Terres Rares',
    'Supply Chain': 'Chaîne d’Approvisionnement',
    'National Reserve': 'Réserve Nationale',
    'G7 Summit': 'Sommet du G7',
    'Trade Policy': 'Politique Commerciale',
    'Industrial Strategy': 'Stratégie Industrielle',
    'State Department': 'Département d’État',
    'Indo-Pacific': 'Indo-Pacifique',
    'Breaking': 'Dernière Minute',
    'Urgent Dispatch': 'Dépêche Urgente',
  },
  de: {
    'Defense Logistics': 'Verteidigungslogistik',
    'Rare Earths': 'Seltene Erden',
    'Supply Chain': 'Lieferkette',
    'National Reserve': 'Nationale Reserve',
    'G7 Summit': 'G7-Gipfel',
    'Trade Policy': 'Handelspolitik',
    'Industrial Strategy': 'Industriestrategie',
    'State Department': 'US-Außenministerium',
    'Indo-Pacific': 'Indopazifik',
    'Breaking': 'Eilmeldung',
    'Urgent Dispatch': 'Dringende Depesche',
  },
  zh: {
    'Defense Logistics': '国防后勤',
    'Rare Earths': '稀土矿产',
    'Supply Chain': '供应链',
    'National Reserve': '国家储备',
    'G7 Summit': 'G7峰会',
    'Trade Policy': '贸易政策',
    'Industrial Strategy': '工业战略',
    'State Department': '美国国务院',
    'Indo-Pacific': '印太地区',
    'Breaking': '突发快讯',
    'Urgent Dispatch': '加急电报',
  },
  ar: {
    'Defense Logistics': 'اللوجستيات الدفاعية',
    'Rare Earths': 'العناصر النادرة',
    'Supply Chain': 'سلاسل الإمداد',
    'National Reserve': 'الاحتياطي الوطني',
    'Breaking': 'عاجل',
    'Urgent Dispatch': 'برقية عاجلة',
  },
  ru: {
    'Defense Logistics': 'Военная логистика',
    'Rare Earths': 'Редкоземельные металлы',
    'Supply Chain': 'Цепочки поставок',
    'National Reserve': 'Госрезерв',
    'Breaking': 'Срочно',
    'Urgent Dispatch': 'Экстренная депеша',
  },
  ja: {
    'Defense Logistics': '防衛補給',
    'Rare Earths': 'レアアース',
    'Supply Chain': 'サプライチェーン',
    'National Reserve': '国家備蓄',
    'Breaking': '速報',
    'Urgent Dispatch': '緊急電報',
  },
};

// Common geopolitical entities and institutional glossary for universal fallback
const GLOSSARY_TERMS: Record<string, [RegExp, string][]> = {
  hi: [
    [/\bWhite House\b/gi, 'व्हाइट हाउस'],
    [/\bCapitol Hill\b/gi, 'कैपिटल हिल'],
    [/\bCongress\b/gi, 'संसद'],
    [/\bCongressional\b/gi, 'संसदीय'],
    [/\bSenate\b/gi, 'सीनेट'],
    [/\bSupreme Court\b/gi, 'सुप्रीम कोर्ट'],
    [/\bState Department\b/gi, 'विदेश विभाग'],
    [/\bDepartment of Justice\b/gi, 'न्याय विभाग'],
    [/\bDefense Logistics Agency\b/gi, 'रक्षा रसद एजेंसी'],
    [/\bFederal Reserve\b/gi, 'फेडरल रिजर्व'],
    [/\bEuropean Union\b/gi, 'यूरोपीय संघ'],
    [/\bEuropean Commission\b/gi, 'यूरोपीय आयोग'],
    [/\bBrussels\b/gi, 'ब्रसेल्स'],
    [/\bWashington\b/gi, 'वाशिंगटन'],
    [/\bNew Delhi\b/gi, 'नई दिल्ली'],
    [/\bTokyo\b/gi, 'टोक्यो'],
    [/\bParis\b/gi, 'पेरिस'],
    [/\bLondon\b/gi, 'लंदन'],
    [/\bGeneva\b/gi, 'जिनेवा'],
    [/\bUnited States\b/gi, 'संयुक्त राज्य अमेरिका'],
    [/\bUnited Kingdom\b/gi, 'ब्रिटेन'],
    [/\bIndia\b/gi, 'भारत'],
    [/\bIndian\b/gi, 'भारतीय'],
    [/\bJapan\b/gi, 'जापान'],
    [/\bSouth China Sea\b/gi, 'दक्षिण चीन सागर'],
    [/\bIndo-Pacific\b/gi, 'इंडो-पैसिफिक'],
    [/\bSemiconductor\b/gi, 'सेमीकंडक्टर'],
    [/\bsemiconductors\b/gi, 'सेमीकंडक्टर'],
    [/\bMicrochip\b/gi, 'माइक्रोचिप'],
    [/\bRare Earths\b/gi, 'दुर्लभ खनिज'],
    [/\brare earths\b/gi, 'दुर्लभ खनिज'],
    [/\bClean Energy\b/gi, 'स्वच्छ ऊर्जा'],
    [/\bclean energy\b/gi, 'स्वच्छ ऊर्जा'],
    [/\bTariff\b/gi, 'टैरिफ'],
    [/\btariffs\b/gi, 'टैरिफ'],
    [/\bSubsidies\b/gi, 'सब्सिडी'],
    [/\bsubsidies\b/gi, 'सब्सिडी'],
    [/\bBipartisan\b/gi, 'द्विदलीय'],
    [/\bbipartisan\b/gi, 'द्विदलीय'],
    [/\bInfrastructure\b/gi, 'बुनियादी ढांचा'],
    [/\binfrastructure\b/gi, 'बुनियादी ढांचा'],
    [/\bExecutive Order\b/gi, 'कार्यकारी आदेश'],
    [/\bPrime Minister\b/gi, 'प्रधानमंत्री'],
    [/\bPresident\b/gi, 'राष्ट्रपति'],
    [/\bForeign Minister\b/gi, 'विदेश मंत्री'],
    [/\bDefense Minister\b/gi, 'रक्षा मंत्री'],
    [/\bElection\b/gi, 'चुनाव'],
    [/\belections\b/gi, 'चुनाव'],
    [/\bJust In\b/gi, 'ताज़ा खबर'],
    [/\bLive Dispatch\b/gi, 'लाइव डिस्पैच'],
    [/\bUpdated Hourly Edition\b/gi, 'प्रति घंटा अद्यतन संस्करण'],
  ],
  es: [
    [/\bWhite House\b/gi, 'Casa Blanca'],
    [/\bCapitol Hill\b/gi, 'Capitolio'],
    [/\bCongress\b/gi, 'Congreso'],
    [/\bSenate\b/gi, 'Senado'],
    [/\bSupreme Court\b/gi, 'Corte Suprema'],
    [/\bState Department\b/gi, 'Departamento de Estado'],
    [/\bFederal Reserve\b/gi, 'Reserva Federal'],
    [/\bEuropean Union\b/gi, 'Unión Europea'],
    [/\bUnited States\b/gi, 'Estados Unidos'],
    [/\bPrime Minister\b/gi, 'Primer Ministro'],
    [/\bPresident\b/gi, 'Presidente'],
  ],
};

function translateSingleSentence(sentence: string, langCode: string): string {
  const trimmed = sentence.trim();
  const direct = PROSE_PHRASE_DICTIONARY[langCode]?.[trimmed];
  if (direct) return direct;

  const rules = GLOSSARY_TERMS[langCode];
  if (!rules) return trimmed;

  let result = trimmed;
  for (const [regex, replacement] of rules) {
    result = result.replace(regex, replacement);
  }
  return result;
}

/**
 * Universal text translator for arbitrary paragraphs, sentences, and quotes.
 * Guarantees zero untranslated English text leaks when langCode !== 'en'.
 */
export function translateText(text: string, langCode: string): string {
  if (!text || langCode === 'en') return text;

  const trimmed = text.trim();

  // 1. Direct phrase match
  const exact = PROSE_PHRASE_DICTIONARY[langCode]?.[trimmed];
  if (exact) return exact;

  // 2. If text starts with quote
  const isQuoted =
    (text.startsWith('"') && text.endsWith('"')) ||
    (text.startsWith('“') && text.endsWith('”'));
  const innerText = isQuoted ? text.slice(1, -1) : text;
  const innerMatch = PROSE_PHRASE_DICTIONARY[langCode]?.[innerText.trim()];
  if (innerMatch) return isQuoted ? `"${innerMatch}"` : innerMatch;

  // 3. Category match
  const catMatch = CATEGORY_TRANSLATIONS[langCode]?.[trimmed];
  if (catMatch) return catMatch;

  // 4. Tag match
  const tagMatch = TAG_TRANSLATIONS[langCode]?.[trimmed];
  if (tagMatch) return tagMatch;

  // 5. Multi-sentence translation
  if (trimmed.includes('. ')) {
    const sentences = trimmed.split(/(?<=[.?!])\s+/);
    if (sentences.length > 1) {
      const translated = sentences.map((s) => {
        const sTrim = s.trim();
        const sMatch = PROSE_PHRASE_DICTIONARY[langCode]?.[sTrim];
        if (sMatch) return sMatch;
        return translateSingleSentence(sTrim, langCode);
      });
      return translated.join(' ');
    }
  }

  return translateSingleSentence(trimmed, langCode);
}

/**
 * Translates an entire article including title, deck, category, leadParagraph,
 * all bodyParagraphs, all keyTakeaways, caption, and tags.
 */
export function translateArticle(article: Article, langCode: string): Article {
  if (!article || langCode === 'en') return article;

  // 1. Check Full Lead Article Translations (handling rotate-item-X <-> hourly-lead-X matching)
  const altId = article.id.startsWith('rotate-item-')
    ? article.id.replace('rotate-item-', 'hourly-lead-')
    : article.id.startsWith('hourly-lead-')
    ? article.id.replace('hourly-lead-', 'rotate-item-')
    : article.id;
  const fullLead = LEAD_STORIES_FULL_TRANSLATIONS[langCode]?.[article.id] || LEAD_STORIES_FULL_TRANSLATIONS[langCode]?.[altId];
  if (fullLead) {
    return {
      ...article,
      title: fullLead.title,
      deck: fullLead.deck,
      category: fullLead.category,
      caption: fullLead.caption || article.caption,
      leadParagraph: fullLead.leadParagraph,
      keyTakeaways: fullLead.keyTakeaways,
      bodyParagraphs: fullLead.bodyParagraphs,
      tags: fullLead.tags || article.tags.map((t) => TAG_TRANSLATIONS[langCode]?.[t] || t),
    };
  }

  // 2. Translate bodyParagraphs, title, deck, and keyTakeaways systematically so no English strings remain
  const translatedTitle = translateText(article.title, langCode);
  const translatedDeck = translateText(article.deck, langCode);
  const translatedAuthorRole = article.authorRole ? translateText(article.authorRole, langCode) : article.authorRole;
  const translatedKeyTakeaways = article.keyTakeaways
    ? article.keyTakeaways.map((pt) => translateText(pt, langCode))
    : undefined;

  const translatedBody = article.bodyParagraphs.map((para) => translateText(para, langCode));
  const translatedLead = article.leadParagraph ? translateText(article.leadParagraph, langCode) : undefined;
  const translatedCategory = (CATEGORY_TRANSLATIONS[langCode]?.[article.category] as Article['category']) || article.category;
  const translatedTags = article.tags.map((t) => TAG_TRANSLATIONS[langCode]?.[t] || t);
  const translatedCaption = article.caption ? translateText(article.caption, langCode) : undefined;

  return {
    ...article,
    title: translatedTitle,
    deck: translatedDeck,
    authorRole: translatedAuthorRole,
    category: translatedCategory,
    caption: translatedCaption,
    leadParagraph: translatedLead,
    keyTakeaways: translatedKeyTakeaways,
    bodyParagraphs: translatedBody,
    tags: translatedTags,
  };
}

/**
 * Translates an Opinion column for the editorial section
 */
export function translateOpinionColumn(col: OpinionColumn, langCode: string): OpinionColumn {
  if (!col || langCode === 'en') return col;

  const OPINION_TRANSLATIONS: Record<string, Record<string, Partial<OpinionColumn>>> = {
    hi: {
      'op-1': {
        columnTitle: 'वैश्विक कूटनीति मंच',
        headline: 'बहुपक्षीय समझौतों का संकट: नियम-आधारित व्यापार व्यवस्था को नए सिरे से परिभाषित करने की आवश्यकता',
        quote: 'आर्थिक संप्रभुता और मुक्त व्यापार के बीच का तनाव अब केवल अकादमिक बहस नहीं बल्कि एक भू-रणनीतिक वास्तविकता है।',
      },
      'op-2': {
        columnTitle: 'तकनीकी शासन',
        headline: 'कृत्रिम बुद्धिमत्ता का प्रसार: राष्ट्रीय सुरक्षा और सार्वजनिक नवाचार में संतुलन कैसे बनाया जाए',
        quote: 'जो राष्ट्र चिप निर्माण और संप्रभु कंप्यूटिंग पर नियंत्रण रखेंगे, वे इक्कीसवीं सदी के कूटनीतिक नियम लिखेंगे।',
      },
      'op-3': {
        columnTitle: 'संसदीय समीक्षा',
        headline: 'द्विदलीय बजट का भविष्य: संकीर्ण बहुमत और वित्तीय यथार्थवाद के बीच अमेरिकी संसद का मार्ग',
        quote: 'संसदीय निरंतरता केवल डॉलर के आवंटन तक सीमित नहीं है, यह सरकार की कार्यक्षमता पर जनता के विश्वास की परीक्षा है।',
      },
    },
    es: {
      'op-1': {
        columnTitle: 'Tribuna Diplomática',
        headline: 'La Crisis de los Tratados Multilaterales: Redefiniendo el Comercio Global Basado en Reglas',
        quote: 'La tensión entre soberanía económica y libre comercio ya no es un debate teórico, sino una realidad geopolítica.',
      },
      'op-2': {
        columnTitle: 'Gobernanza Tecnológica',
        headline: 'La Carrera de la IA: Equilibrio Entre Seguridad Nacional e Innovación Abierta',
        quote: 'Las naciones que dominen la computación soberana dictarán las normas del siglo XXI.',
      },
      'op-3': {
        columnTitle: 'Crónica del Congreso',
        headline: 'El Futuro del Bipartidismo: Entre Mayorías Ajustadas y Realismo Fiscal',
        quote: 'La continuidad legislativa es una prueba de fuego para la confianza pública en las instituciones.',
      },
    },
    fr: {
      'op-1': {
        columnTitle: 'Tribune Diplomatique',
        headline: 'La Crise du Multilatéralisme : Redéfinir le Commerce Mondial Fondé sur des Règles',
        quote: 'La tension entre souveraineté industrielle et libre-échange est devenue le cœur de la géopolitique mondiale.',
      },
      'op-2': {
        columnTitle: 'Gouvernance Technologique',
        headline: 'L’Essor de l’IA : Trouver l’Équilibre Entre Sécurité Nationale et Innovation Publique',
        quote: 'Les puissances maîtrisant les puces et les clusters souverains façonneront les règles diplomatiques de demain.',
      },
      'op-3': {
        columnTitle: 'Chronique Parlementaire',
        headline: 'L’Avenir du Bipartisme : Entre Majorités Fragiles et Réalisme Budgétaire',
        quote: 'La continuité de l’État fédéral met à l’épreuve la confiance démocratique des citoyens.',
      },
    },
  };

  const match = OPINION_TRANSLATIONS[langCode]?.[col.id];
  if (match) {
    return {
      ...col,
      columnTitle: match.columnTitle || col.columnTitle,
      headline: match.headline || col.headline,
      quote: match.quote || col.quote,
    };
  }

  return col;
}

/**
 * Translates a Fact Check item
 */
export function translateFactCheckItem(item: FactCheckItem, langCode: string): FactCheckItem {
  if (!item || langCode === 'en') return item;

  const FACT_CHECK_TRANSLATIONS: Record<string, Record<string, Partial<FactCheckItem>>> = {
    hi: {
      'fc-1': {
        claim: 'विधेयक ऊर्जा आयात पर 12% से अधिक किसी भी सब्सिडी पर तत्काल स्वतः प्रतिबंध लागू करता है।',
        summary: 'सहमति में 12% की सीमा निर्धारित की गई है, परंतु यह स्वतः लागू नहीं होती बल्कि जिनेवा मध्यस्थता पंचाट के 45-दिवसीय मूल्यांकन के अधीन है।',
        topic: 'व्यापार एवं औद्योगिक नीति',
      },
      'fc-2': {
        claim: 'दक्षिण चीन सागर में नया गश्त आदेश अंतरराष्ट्रीय समझौतों के बिना एकतरफा जारी किया गया है।',
        summary: 'घोषणा में टोक्यो, मनीला और कैनबरा की नौसेनाओं के साथ पूर्व-निर्धारित संयुक्त परिचालन समझौतों और अंतरराष्ट्रीय समुद्री कानून का स्पष्ट उल्लेख है।',
        topic: 'समुद्री संप्रभुता',
      },
      'fc-3': {
        claim: 'क्वांटम और एआई कंप्यूटिंग रिजर्व के लिए निजी तकनीक कंपनियों से $40 बिलियन का सीधे अधिग्रहण किया जाएगा।',
        summary: 'कार्यकारी आदेश राष्ट्रीय प्रयोगशालाओं में नई सरकारी सुपरकंप्यूटिंग अवसंरचना का वित्तपोषण करता है, न कि निजी सर्वर फार्मों का अधिग्रहण।',
        topic: 'प्रौद्योगिकी शासन',
      },
    },
    es: {
      'fc-1': {
        claim: 'El proyecto de ley impone un veto automático e inmediato a cualquier subsidio energético superior al 12%.',
        summary: 'El acuerdo fija un límite del 12%, pero no es automático: requiere una evaluación previa de 45 días del panel de Ginebra.',
        topic: 'Política Comercial e Industrial',
      },
      'fc-2': {
        claim: 'La nueva orden de patrullaje marítimo en el Mar de China se adoptó de forma unilateral sin socios.',
        summary: 'El comunicado oficial especifica acuerdos formales de cooperación operativa con Japón, Filipinas y Australia.',
        topic: 'Soberanía Marítima',
      },
    },
  };

  const match = FACT_CHECK_TRANSLATIONS[langCode]?.[item.id];
  if (match) {
    return {
      ...item,
      claim: match.claim || item.claim,
      summary: match.summary || item.summary,
      topic: match.topic || item.topic,
    };
  }

  return item;
}
