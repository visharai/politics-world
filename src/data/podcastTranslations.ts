export interface TranslatedPodcastData {
  title: string;
  series: string;
  hostRole: string;
  description: string;
  topics: string[];
  keyQuotes: string;
  transcriptSample: {
    time: string;
    seconds: number;
    speaker: string;
    text: string;
  }[];
}

export const DYNAMIC_PODCAST_TRANSLATIONS: Record<string, Record<string, TranslatedPodcastData>> = {
  es: {
    'pod-1': {
      title: 'Resumen Global Matutino: El Acuerdo Arancelario de Bruselas',
      series: 'Despacho Diario',
      hostRole: 'Corresponsal Diplomática Principal',
      description: 'Los entretelones del pacto de subsidios a tecnologías limpias del G7 en Bruselas, las maniobras de clausura en el Senado y la doctrina marítima del Departamento de Estado.',
      topics: ['Acuerdo G7', 'Clausura del Senado', 'Tope de Subsidios', 'Logística del Pacífico'],
      keyQuotes: 'El tope de subsidios del doce por ciento anula decenas de disputas comerciales activas antes del amanecer.',
      transcriptSample: [
        { time: '00:00', seconds: 0, speaker: 'Locutor', text: 'Politics World Despacho Diario. Episodio 142: Resumen Global Matutino con la Corresponsal Diplomática Principal Eleanor Vance.' },
        { time: '00:10', seconds: 10, speaker: 'Eleanor Vance', text: 'Buenos días desde Washington. Abrimos hoy con el acuerdo alcanzado antes del amanecer entre los enviados económicos de la Casa Blanca y los directores comerciales de la Unión Europea en Bruselas.' },
        { time: '00:30', seconds: 30, speaker: 'Eleanor Vance', text: 'Tras tres intensas jornadas de deliberaciones a puerta cerrada, los negociadores establecieron un tope general del doce por ciento a los subsidios en tecnologías limpias y minerales críticos.' },
        { time: '00:52', seconds: 52, speaker: 'Marcus Sterling', text: 'El punto decisivo gira en torno a las normas de origen. Al reconocer los minerales procesados de forma equitativa entre jurisdicciones aliadas, la fricción logística disminuye de inmediato.' },
        { time: '01:14', seconds: 74, speaker: 'Eleanor Vance', text: 'En el Capitolio, los líderes del Senado ya han comprometido una votación acelerada para su ratificación este jueves, proyectando una cómoda mayoría.' },
        { time: '01:36', seconds: 96, speaker: 'Marcus Sterling', text: 'Miembros clave del Comité de Finanzas del Senado confirmaron esta mañana que el compromiso evita eficazmente aranceles de represalia antes del cierre del trimestre fiscal.' },
        { time: '01:58', seconds: 118, speaker: 'Eleanor Vance', text: 'Al abrir los mercados financieros, los bonos soberanos en París y Tokio han subido tras la noticia. Les informó Eleanor Vance para Politics World.' }
      ]
    },
    'pod-2': {
      title: 'Análisis Político 2026: El Pacto Transatlántico',
      series: 'Análisis Legislativo en Profundidad',
      hostRole: 'Analistas Principales de Legislación y Comercio',
      description: 'Disección exhaustiva del Pacto Industrial Transatlántico: el mecanismo de arbitraje en Ginebra, umbrales de origen y dinámica en los comités del Congreso.',
      topics: ['Análisis Estatutario', 'Arbitraje de Ginebra', 'Comité de Finanzas', 'Créditos Fiscales Verdes'],
      keyQuotes: 'Cuando las normas tributarias se cruzan con las listas de seguridad nacional, los viejos manuales de presión colapsan.',
      transcriptSample: [
        { time: '00:00', seconds: 0, speaker: 'Locutor', text: 'Politics World Análisis en Profundidad. Episodio 88: El Desglose Político de 2026, con Marcus Sterling y Sarah Jenkins.' },
        { time: '00:11', seconds: 11, speaker: 'Marcus Sterling', text: 'Bienvenidos al Análisis Político. Hoy revisamos página por página las cuarenta y seis páginas del recién publicado texto del Pacto Industrial Transatlántico.' },
        { time: '00:32', seconds: 32, speaker: 'Sarah Jenkins', text: 'Presten atención a la Sección Cuatro. Establece un panel automatizado de resolución de disputas en Ginebra con un plazo estricto de cuarenta y cinco días.' },
        { time: '00:54', seconds: 54, speaker: 'Marcus Sterling', text: 'Eso elimina al instante los vacíos legales que antes frenaban inversiones en gigafactorías de baterías y energía eólica marina.' },
        { time: '01:16', seconds: 76, speaker: 'Sarah Jenkins', text: 'Noten también que las definiciones fiscales ahora se intersectan directamente con los controles de exportación por seguridad nacional.' },
        { time: '01:38', seconds: 98, speaker: 'Marcus Sterling', text: 'El reloj de implementación legal comenzará a correr en cuanto el Presidente promulgue la ley. Seguiremos de cerca el calendario reglamentario.' }
      ]
    },
    'pod-3': {
      title: 'Confidencial del Capitolio: Clausura a Medianoche',
      series: 'Detrás del Mazo',
      hostRole: 'Jefe de Corresponsalía en el Congreso',
      description: 'A puerta cerrada mientras vencía el plazo de financiación federal: cómo una coalición bipartidista del Senado aseguró setenta y cuatro votos decisivos.',
      topics: ['Presupuesto', 'Resolución Continua', 'Matemática del Filibuster', 'Socorro por Desastres'],
      keyQuotes: 'Detrás de la retórica televisada, veteranos del comité sumaban meticulosamente mayorías contundentes.',
      transcriptSample: [
        { time: '00:00', seconds: 0, speaker: 'Locutor', text: 'Politics World Detrás del Mazo. Episodio 54: Confidencial del Capitolio, con Julian Barnes.' },
        { time: '00:10', seconds: 10, speaker: 'Julian Barnes', text: 'Eran las 11:15 de la noche bajo la rotonda del Capitolio cuando la moción de clausura se abrió paso en el recinto. Así cristalizó el compromiso bipartidista.' },
        { time: '00:31', seconds: 31, speaker: 'Julian Barnes', text: 'A puerta cerrada, miembros clave del comité forjaron una supermayoría de setenta y cuatro votos a tres horas del límite de financiación.' },
        { time: '00:53', seconds: 53, speaker: 'Julian Barnes', text: 'El gran avance llegó al acordar dieciséis mil millones de dólares en socorro agrícola de emergencia, desvinculándolo de las disputas de gasto militar.' },
        { time: '01:15', seconds: 75, speaker: 'Julian Barnes', text: 'Mientras las cámaras transmitían acalorados debates en las escalinatas exteriores, los legisladores negociaban voto por voto.' },
        { time: '01:36', seconds: 96, speaker: 'Julian Barnes', text: 'Con la ley firmada, el gobierno garantiza la estabilidad operativa del nuevo año fiscal. Les informó Julian Barnes desde el Capitolio.' }
      ]
    },
    'pod-4': {
      title: 'El Despacho Diplomático: Diplomacia de Infraestructura',
      series: 'Estrategia Global',
      hostRole: 'Investigador Principal y Ex Vicesecretario',
      description: 'Por qué las alianzas bilaterales contemporáneas se forjan en refinerías de litio, fundiciones de semiconductores y terminales marítimas.',
      topics: ['Estrategia', 'Semiconductores', 'Cadenas de Litio', 'Indo-Pacífico'],
      keyQuotes: 'La diplomacia sin capacidad industrial soberana es solo teatro.',
      transcriptSample: [
        { time: '00:00', seconds: 0, speaker: 'Locutor', text: 'Politics World Diplomacia Global. Episodio 39: El Despacho Diplomático con el Embajador Julian Richter.' },
        { time: '00:10', seconds: 10, speaker: 'Julian Richter', text: 'En la diplomacia del siglo XXI, ya no medimos la influencia por ceremonias protocolares. Hoy la medimos por capacidad fabril y resiliencia de la red eléctrica.' },
        { time: '00:32', seconds: 32, speaker: 'Julian Richter', text: 'Las alianzas bilaterales se definen en refinerías de litio, plantas de microprocesadores y puertos de contenedores de aguas profundas.' },
        { time: '00:54', seconds: 54, speaker: 'Julian Richter', text: 'El nuevo pacto logístico del Pacífico demuestra que la agilidad de los puertos es un instrumento activo de disuasión geopolítica.' },
        { time: '01:16', seconds: 76, speaker: 'Julian Richter', text: 'Al concluir la cumbre ministerial, esta realidad perdura: la diplomacia sin músculo industrial es mera escenografía. Gracias por su sintonía.' }
      ]
    }
  },
  fr: {
    'pod-1': {
      title: 'Briefing Mondial du Matin : L’Accord Tarifaire de Bruxelles',
      series: 'Dépêche Quotidienne',
      hostRole: 'Correspondante Diplomatique en Chef',
      description: 'Les coulisses du compromis du G7 sur les subventions aux technologies propres à Bruxelles, les manœuvres sénatoriales et la doctrine maritime.',
      topics: ['Accord du G7', 'Clôture au Sénat', 'Plafond des Subventions', 'Logistique Pacifique'],
      keyQuotes: 'Le plafond de subvention de douze pour cent désamorce des dizaines de litiges commerciaux dès l’aube.',
      transcriptSample: [
        { time: '00:00', seconds: 0, speaker: 'Annonceur', text: 'Politics World Dépêche Quotidienne. Épisode 142 : Briefing Mondial avec la correspondante diplomatique Eleanor Vance.' },
        { time: '00:10', seconds: 10, speaker: 'Eleanor Vance', text: 'Bonjour depuis Washington. Nous ouvrons ce matin sur l’accord scellé avant l’aube entre les émissaires de la Maison-Blanche et la direction commerciale européenne à Bruxelles.' },
        { time: '00:30', seconds: 30, speaker: 'Eleanor Vance', text: 'Au terme de trois jours d’intenses tractations à huis clos, un plafond uniforme de douze pour cent a été convenu pour les subventions vertes et minéraux critiques.' },
        { time: '00:52', seconds: 52, speaker: 'Marcus Sterling', text: 'L’avancée majeure réside dans la définition de l’origine. En reconnaissant mutuellement les minéraux transformés chez les partenaires alliés, les frictions logistiques disparaissent.' },
        { time: '01:14', seconds: 74, speaker: 'Eleanor Vance', text: 'Au Capitole, les chefs de file du Sénat prévoient un vote accéléré de ratification dès jeudi, prévoyant une confortable majorité.' },
        { time: '01:36', seconds: 96, speaker: 'Marcus Sterling', text: 'Les membres clés de la commission des finances ont affirmé ce matin que ce compromis écarte durablement le spectre de représailles douanières.' },
        { time: '01:58', seconds: 118, speaker: 'Eleanor Vance', text: 'À l’ouverture des places boursières, les obligations souveraines à Paris et Tokyo progressent nettement. C’était Eleanor Vance pour Politics World.' }
      ]
    },
    'pod-2': {
      title: 'Décryptage Politique 2026 : Le Pacte Transatlantique',
      series: 'Analyse Législative Approfondie',
      hostRole: 'Analystes Principaux Législation & Commerce',
      description: 'Analyse détaillée du Pacte Industriel Transatlantique : arbitrage à Genève, critères d’origine minérale et comités du Congrès.',
      topics: ['Analyse Statutaire', 'Arbitrage de Genève', 'Commission des Finances', 'Crédits Fiscaux Verts'],
      keyQuotes: 'Lorsque le code fiscal croise les listes de sécurité nationale, les stratégies de lobbying traditionnelles s’effondrent.',
      transcriptSample: [
        { time: '00:00', seconds: 0, speaker: 'Annonceur', text: 'Politics World Analyse Approfondie. Épisode 88 : Le Décryptage Politique 2026, avec Marcus Sterling et Sarah Jenkins.' },
        { time: '00:11', seconds: 11, speaker: 'Marcus Sterling', text: 'Bienvenue au Décryptage Politique. Aujourd’hui, nous explorons ligne par ligne les quarante-six pages du Pacte Industriel Transatlantique.' },
        { time: '00:32', seconds: 32, speaker: 'Sarah Jenkins', text: 'Regardez de près l’article quatre. Il institue à Genève un panel automatisé de règlement des litiges astreint à un délai strict de quarante-cinq jours.' },
        { time: '00:54', seconds: 54, speaker: 'Marcus Sterling', text: 'Cela élimine instantanément les blocages juridiques qui paralysaient les gigafactories de batteries et les parcs éoliens en mer.' },
        { time: '01:16', seconds: 76, speaker: 'Sarah Jenkins', text: 'Remarquez aussi que les définitions fiscales recoupent désormais directement les restrictions d’exportation stratégiques.' },
        { time: '01:38', seconds: 98, speaker: 'Marcus Sterling', text: 'Le compte à rebours d’application débutera dès la promulgation présidentielle. Nous suivrons de très près le calendrier réglementaire.' }
      ]
    },
    'pod-3': {
      title: 'Confidentiel du Capitole : Vote de Clôture à Minuit',
      series: 'Coulisses du Congrès',
      hostRole: 'Chef du Bureau Parlementaire',
      description: 'À huis clos avant l’échéance du budget fédéral : comment une coalition sénatoriale bipartisane a sécurisé soixante-quatorze suffrages.',
      topics: ['Finances Publiques', 'Résolution Continue', 'Calculs du Sénat', 'Aide aux Sinistrés'],
      keyQuotes: 'Derrière les déclarations médiatiques, des parlementaires chevronnés assemblaient méthodiquement de larges majorités.',
      transcriptSample: [
        { time: '00:00', seconds: 0, speaker: 'Annonceur', text: 'Politics World Coulisses du Congrès. Épisode 54 : Confidentiel du Capitole avec Julian Barnes.' },
        { time: '00:10', seconds: 10, speaker: 'Julian Barnes', text: 'Il était 23 heures 15 sous la rotonde lorsque la motion de clôture a été adoptée. Voici comment l’accord de compromis s’est formé.' },
        { time: '00:31', seconds: 31, speaker: 'Julian Barnes', text: 'En coulisses, les négociateurs ont bâti une majorité de soixante-quatorze voix à trois heures seulement de l’arrêt des crédits fédéraux.' },
        { time: '00:53', seconds: 53, speaker: 'Julian Barnes', text: 'Le tournant décisif s’est produit avec le déblocage de seize milliards d’aide agricole, découplé des arbitrages budgétaires militaires.' },
        { time: '01:15', seconds: 75, speaker: 'Julian Barnes', text: 'Tandis que les télévisions relayaient les postures partisanes, les vétérans du Sénat comptaient méthodiquement chaque voix.' },
        { time: '01:36', seconds: 96, speaker: 'Julian Barnes', text: 'Avec la promulgation du texte, les administrations abordent le nouvel exercice budgétaire avec sérénité. C’était Julian Barnes au Capitole.' }
      ]
    },
    'pod-4': {
      title: 'La Dépêche Diplomatique : Puissance Industrielle et Alliances',
      series: 'Stratégie Mondiale',
      hostRole: 'Chercheur Émérite et Ancien Secrétaire Adjoint',
      description: 'Pourquoi les alliances d’aujourd’hui se scellent dans les raffineries de lithium et les usines de semi-conducteurs plutôt que dans les salons.',
      topics: ['Diplomatie', 'Semi-conducteurs', 'Filières Lithium', 'Indo-Pacifique'],
      keyQuotes: 'La diplomatie sans assise industrielle souveraine n’est qu’un spectacle d’apparat.',
      transcriptSample: [
        { time: '00:00', seconds: 0, speaker: 'Annonceur', text: 'Politics World Diplomatie Mondiale. Épisode 39 : La Dépêche Diplomatique avec l’Ambassadeur Julian Richter.' },
        { time: '00:10', seconds: 10, speaker: 'Julian Richter', text: 'Au vingt-et-unième siècle, l’influence géopolitique ne se mesure plus aux traités d’apparat, mais aux cadences des fonderies et à la solidité du réseau énergétique.' },
        { time: '00:32', seconds: 32, speaker: 'Julian Richter', text: 'Les partenariats stratégiques s’articulent désormais autour du lithium, des puces de pointe et des terminaux portuaires en eau profonde.' },
        { time: '00:54', seconds: 54, speaker: 'Julian Richter', text: 'Le nouvel accord logistique du Pacifique prouve que la cadence de rotation des porte-conteneurs est devenue un levier de dissuasion.' },
        { time: '01:16', seconds: 76, speaker: 'Julian Richter', text: 'À l’issue de ce sommet ministériel, retenons cette vérité : la diplomatie sans substance industrielle n’est que théâtre. Merci pour votre écoute.' }
      ]
    }
  },
  de: {
    'pod-1': {
      title: 'Morgen-Briefing Weltpolitik: Die Brüsseler Zolleinigung',
      series: 'Täglicher Leitbericht',
      hostRole: 'Chefkorrespondentin Diplomatie',
      description: 'Hintergründe zum G7-Subventionskompromiss in Brüssel, den nächtlichen Senatsbeschlüssen in Washington und der maritimen Sicherheitsdoktrin.',
      topics: ['G7-Abkommen', 'Senatsabstimmung', 'Subventionsobergrenze', 'Pazifische Logistik'],
      keyQuotes: 'Die Obergrenze von zwölf Prozent für Subventionen beendet Dutzende Handelskonflikte noch vor Tagesanbruch.',
      transcriptSample: [
        { time: '00:00', seconds: 0, speaker: 'Sprecher', text: 'Politics World Täglicher Leitbericht. Episode 142: Weltweites Morgen-Briefing mit Chefkorrespondentin Eleanor Vance.' },
        { time: '00:10', seconds: 10, speaker: 'Eleanor Vance', text: 'Guten Morgen aus Washington. Unser Hauptthema heute ist die Einigung zwischen US-Wirtschaftsgesandten und der Europäischen Union in Brüssel.' },
        { time: '00:30', seconds: 30, speaker: 'Eleanor Vance', text: 'Nach dreitägigen Verhandlungen einigten sich beide Seiten auf eine Subventionsobergrenze von zwölf Prozent für grüne Zukunftstechnologien.' },
        { time: '00:52', seconds: 52, speaker: 'Marcus Sterling', text: 'Der Durchbruch betrifft die Herkunftsregeln. Die gegenseitige Anerkennung verarbeiteter kritischer Mineralien stabilisiert die Lieferketten schlagartig.' },
        { time: '01:14', seconds: 74, speaker: 'Eleanor Vance', text: 'Im Senat kündigte die Führung bereits eine beschleunigte Ratifizierung für Donnerstag an, getragen von einer klaren parteiübergreifenden Mehrheit.' },
        { time: '01:36', seconds: 96, speaker: 'Marcus Sterling', text: 'Führende Mitglieder des Finanzausschusses bekräftigten heute früh, dass dieser Kompromiss drohende Vergeltungszölle zuverlässig abwendet.' },
        { time: '01:58', seconds: 118, speaker: 'Eleanor Vance', text: 'An den Finanzmärkten reagierten Staatsanleihen in Paris und Tokio sofort mit spürbaren Kursgewinnen. Für Politics World berichtete Eleanor Vance.' }
      ]
    },
    'pod-2': {
      title: 'Politikanalyse 2026: Der Transatlantische Industriepakt',
      series: 'Gesetzgebungs-Dossier',
      hostRole: 'Leitende Analysten für Gesetzgebung & Außenhandel',
      description: 'Detaillierte Analyse des Transatlantischen Pakts: Schiedsgerichtsbarkeit in Genf, Rohstoff-Grenzwerte und Ausschussberatungen im Kongress.',
      topics: ['Gesetzesanalyse', 'Genfer Schiedsstelle', 'Finanzausschuss', 'Klimaförderung'],
      keyQuotes: 'Wenn steuerliche Definitionen direkt mit Sicherheitslisten verzahnt werden, greifen klassische Lobbying-Muster nicht mehr.',
      transcriptSample: [
        { time: '00:00', seconds: 0, speaker: 'Sprecher', text: 'Politics World Gesetzgebungs-Dossier. Episode 88: Politikanalyse 2026 mit Marcus Sterling und Sarah Jenkins.' },
        { time: '00:11', seconds: 11, speaker: 'Marcus Sterling', text: 'Willkommen zur Politikanalyse. Heute untersuchen wir Satz für Satz die 46 Seiten des Transatlantischen Industriepakts.' },
        { time: '00:32', seconds: 32, speaker: 'Sarah Jenkins', text: 'Beachten Sie Abschnitt vier: Er schafft ein Schiedsgremium in Genf mit einer verbindlichen Urteilsfrist von höchstens fünfundvierzig Tagen.' },
        { time: '00:54', seconds: 54, speaker: 'Marcus Sterling', text: 'Das beendet die jahrelangen Rechtsunsicherheiten, die Investitionen in Batteriefabriken und Offshore-Windkraftanlagen bisher bremsten.' },
        { time: '01:16', seconds: 76, speaker: 'Sarah Jenkins', text: 'Zudem sind Steuervergünstigungen nun unmittelbar an sicherheitsrelevante Ausfuhrlisten gekoppelt.' },
        { time: '01:38', seconds: 98, speaker: 'Marcus Sterling', text: 'Sobald das Gesetz unterzeichnet ist, beginnt die Implementierungsfrist. Wir werden die konkreten Verordnungen intensiv begleiten.' }
      ]
    },
    'pod-3': {
      title: 'Kapitol Vertraulich: Die Mitternachts-Entscheidung',
      series: 'Hinter den Kulissen des Kongresses',
      hostRole: 'Leiter des Parlamentsbüros',
      description: 'Hinter verschlossenen Türen vor dem Ablauf der Haushaltsfrist: Wie eine parteiübergreifende Senatskoalition 74 Stimmen sicherte.',
      topics: ['Haushalt', 'Übergangsetat', 'Senatsmehrheit', 'Katastrophenhilfe'],
      keyQuotes: 'Abseits der Kameras schmiedeten erfahrene Senatoren methodisch eine breite parteiübergreifende Mehrheit.',
      transcriptSample: [
        { time: '00:00', seconds: 0, speaker: 'Sprecher', text: 'Politics World Hinter den Kulissen des Kongresses. Episode 54: Kapitol Vertraulich mit Julian Barnes.' },
        { time: '00:10', seconds: 10, speaker: 'Julian Barnes', text: 'Es war 23 Uhr 15 unter der Kuppel des Kapitols, als der entscheidende Beschluss fiel. So kam der parteiübergreifende Durchbruch zustande.' },
        { time: '00:31', seconds: 31, speaker: 'Julian Barnes', text: 'Hinter Mahagonitüren sicherten Verhandlungsführer eine Supermehrheit von 74 Stimmen, knapp drei Stunden vor Ablauf der Frist.' },
        { time: '00:53', seconds: 53, speaker: 'Julian Barnes', text: 'Der Schlüssel lag in einem Hilfspaket von 16 Milliarden Dollar für Agrargebiete, unabhängig von umstrittenen Verteidigungsausgaben.' },
        { time: '01:15', seconds: 75, speaker: 'Julian Barnes', text: 'Während vor dem Gebäude scharfe Parteirhetorik laut wurde, zählten führende Parlamentarier konzentriert jede einzelne Stimme.' },
        { time: '01:36', seconds: 96, speaker: 'Julian Barnes', text: 'Mit der Unterzeichnung des Haushaltsgesetzes geht die Regierung mit voller Finanzierungssicherheit ins neue Rechnungsjahr. Julian Barnes, Kapitol.' }
      ]
    },
    'pod-4': {
      title: 'Diplomatische Lage: Industrielle Staatskunst',
      series: 'Globale Geostrategie',
      hostRole: 'Senior Fellow & Ehemaliger Ministerialdirektor',
      description: 'Warum moderne Allianzen heute in Lithium-Raffinerien und Chipfabriken geschmiedet werden und nicht mehr im Festsaal.',
      topics: ['Geopolitik', 'Halbleiter', 'Lithium-Lieferketten', 'Indopazifik'],
      keyQuotes: 'Diplomatie ohne industrielle Leistungsfähigkeit ist bloßes Theater.',
      transcriptSample: [
        { time: '00:00', seconds: 0, speaker: 'Sprecher', text: 'Politics World Globale Geostrategie. Episode 39: Diplomatische Lage mit Botschafter Julian Richter.' },
        { time: '00:10', seconds: 10, speaker: 'Julian Richter', text: 'Im 21. Jahrhundert messen wir geopolitisches Gewicht nicht mehr an feierlichen Urkunden, sondern an Produktionskapazitäten und Netzsicherheit.' },
        { time: '00:32', seconds: 32, speaker: 'Julian Richter', text: 'Moderne Allianzen entstehen nicht mehr bei Staatsbanketten. Sie werden in Lithium-Raffinerien und Containerterminals verankert.' },
        { time: '00:54', seconds: 54, speaker: 'Julian Richter', text: 'Der neue pazifische Logistikpakt belegt eindrucksvoll: Schnelle Umschlagszeiten in Häfen sind heute ein wirksames Instrument geopolitischer Abschreckung.' },
        { time: '01:16', seconds: 76, speaker: 'Julian Richter', text: 'Zum Abschluss des Ministertreffens bleibt die Erkenntnis: Diplomatie ohne industrielle Substanz ist reine Kulisse. Vielen Dank fürs Zuhören.' }
      ]
    }
  },
  hi: {
    'pod-1': {
      title: 'मॉर्निंग ग्लोबल ब्रीफिंग: ब्रुसेल्स टैरिफ समझौता',
      series: 'डेली डिस्पैच',
      hostRole: 'मुख्य राजनयिक संवाददाता',
      description: 'ब्रुसेल्स में जी7 स्वच्छ प्रौद्योगिकी सब्सिडी समझौते, सीनेट में सर्वसम्मति और अमेरिकी विदेश विभाग की समुद्री सुरक्षा नीति की पूरी रिपोर्ट।',
      topics: ['जी7 समझौता', 'सीनेट क्लोजर', 'सब्सिडी सीमा', 'प्रशांत रसद'],
      keyQuotes: 'बारह प्रतिशत सब्सिडी सीमा ने सुबह होने से पहले दर्जनों सक्रिय व्यापारिक विवादों को समाप्त कर दिया।',
      transcriptSample: [
        { time: '00:00', seconds: 0, speaker: 'उद्घोषक', text: 'पॉलिटिक्स वर्ल्ड डेली डिस्पैच। एपिसोड 142: मुख्य राजनयिक संवाददाता एलेनोर वेंस के साथ मॉर्निंग ग्लोबल ब्रीफिंग।' },
        { time: '00:10', seconds: 10, speaker: 'एलेनोर वेंस', text: 'वाशिंगटन से नमस्कार। आज की प्रमुख खबर ब्रुसेल्स में व्हाइट हाउस के आर्थिक दूतों और यूरोपीय संघ के बीच हुआ ऐतिहासिक समझौता है।' },
        { time: '00:30', seconds: 30, speaker: 'एलेनोर वेंस', text: 'तीन दिनों की गहन बंद कमरे की बैठकों के बाद, स्वच्छ ऊर्जा प्रौद्योगिकी और महत्वपूर्ण खनिजों पर 12 प्रतिशत की सब्सिडी सीमा तय की गई है।' },
        { time: '00:52', seconds: 52, speaker: 'मार्कस स्टर्लिंग', text: 'मुख्य सफलता उत्पत्ति के नियमों पर मिली। मित्र राष्ट्रों में प्रसंस्कृत खनिजों को समान मान्यता मिलने से आपूर्ति श्रृंखला बाधाएं समाप्त हो गई हैं।' },
        { time: '01:14', seconds: 74, speaker: 'एलेनोर वेंस', text: 'कैपिटल हिल में सीनेट नेतृत्व ने इस गुरुवार को त्वरित मंजूरी के लिए मतदान का संकल्प लिया है, जहां मजबूत बहुमत की उम्मीद है।' },
        { time: '01:36', seconds: 96, speaker: 'मार्कस स्टर्लिंग', text: 'सीनेट वित्त समिति के वरिष्ठ सदस्यों ने पुष्टि की है कि यह समझौता तिमाही की समाप्ति से पहले प्रतिशोधात्मक शुल्कों को टाल देगा।' },
        { time: '01:58', seconds: 118, speaker: 'एलेनोर वेंस', text: 'वित्तीय बाजारों के खुलते ही पेरिस और टोक्यो में सरकारी बॉन्ड में तेजी आई है। पॉलिटिक्स वर्ल्ड के लिए एलेनोर वेंस।' }
      ]
    },
    'pod-2': {
      title: 'नीति विश्लेषण 2026: ट्रांसअटलांटिक कॉम्पैक्ट',
      series: 'विधायी विश्लेषण',
      hostRole: 'वरिष्ठ विधायी और व्यापार विश्लेषक',
      description: 'ट्रांसअटलांटिक इंडस्ट्रियल कॉम्पैक्ट का विश्लेषण: जिनेवा विवाद समाधान पैनल और संसदीय समितियों की भूमिका।',
      topics: ['कानूनी विश्लेषण', 'जिनेवा मध्यस्थता', 'वित्त समिति', 'स्वच्छ ऊर्जा टैक्स क्रेडिट'],
      keyQuotes: 'जब कर परिभाषाएं राष्ट्रीय सुरक्षा निर्यात सूची से जुड़ती हैं, तो पारंपरिक लॉबिंग तरीके ध्वस्त हो जाते हैं।',
      transcriptSample: [
        { time: '00:00', seconds: 0, speaker: 'उद्घोषक', text: 'पॉलिटिक्स वर्ल्ड विधायी विश्लेषण। एपिसोड 88: मार्कस स्टर्लिंग और सारा जेनकिंस के साथ 2026 नीति विश्लेषण।' },
        { time: '00:11', seconds: 11, speaker: 'मार्कस स्टर्लिंग', text: 'पॉलिसी ब्रेकडाउन में आपका स्वागत है। आज हम ट्रांसअटलांटिक कॉम्पैक्ट के सभी 46 पृष्ठों की कानूनी समीक्षा कर रहे हैं।' },
        { time: '00:32', seconds: 32, speaker: 'सारा जेनकिंस', text: 'धारा चार पर ध्यान दें। यह जिनेवा में 45 दिनों की अनिवार्य समयसीमा वाला स्वचालित विवाद समाधान पैनल स्थापित करता है।' },
        { time: '00:54', seconds: 54, speaker: 'मार्कस स्टर्लिंग', text: 'इससे बैटरी गीगाफैक्ट्री और अपतटीय पवन ऊर्जा में वर्षों से अटके अंतरराष्ट्रीय निवेश को तुरंत गति मिलेगी।' },
        { time: '01:16', seconds: 76, speaker: 'सारा जेनकिंस', text: 'कर संहिता की परिभाषाएं अब सीधे राष्ट्रीय सुरक्षा निर्यात नियंत्रण सूची से जुड़ी हुई हैं।' },
        { time: '01:38', seconds: 98, speaker: 'मार्कस स्टर्लिंग', text: 'राष्ट्रपति के हस्ताक्षर के साथ कार्यान्वयन समयसीमा शुरू हो जाएगी। हम आगामी नियमों पर नज़र रखेंगे।' }
      ]
    },
    'pod-3': {
      title: 'कैपिटल गोपनीय: मध्यरात्रि का सीनेट मतदान',
      series: 'संसद के गलियारों से',
      hostRole: 'संसदीय ब्यूरो प्रमुख',
      description: 'बजट समाप्ति से ठीक पहले: कैसे सीनेट के दोनों दलों ने मिलकर 74 मतों का भारी बहुमत तैयार किया।',
      topics: ['बजट आवंटन', 'निरंतर प्रस्ताव', 'सीनेट गणित', 'आपदा राहत'],
      keyQuotes: 'टेलीविज़न पर जारी बयानबाजी के पीछे, अनुभवी सीनेटर चुपचाप भारी बहुमत जुटा रहे थे।',
      transcriptSample: [
        { time: '00:00', seconds: 0, speaker: 'उद्घोषक', text: 'पॉलिटिक्स वर्ल्ड संसद के गलियारों से। एपिसोड 54: जूलियन बार्न्स के साथ कैपिटल गोपनीय रिपोर्ट।' },
        { time: '00:10', seconds: 10, speaker: 'जूलियन बार्न्स', text: 'कैपिटल रोटुंडा के नीचे रात के 11:15 बज रहे थे जब निर्णायक मतदान हुआ। जानिए यह द्विदलीय समझौता कैसे संभव हुआ।' },
        { time: '00:31', seconds: 31, speaker: 'जूलियन बार्न्स', text: 'बंद कमरों में बातचीत कर सांसदों ने बजट सीमा समाप्त होने से तीन घंटे पहले 74 मतों का बहुमत तैयार किया।' },
        { time: '00:53', seconds: 53, speaker: 'जूलियन बार्न्स', text: 'महत्वपूर्ण सफलता तब मिली जब बाढ़ राहत के लिए 16 अरब डॉलर के पैकेज को विवादित रक्षा खर्च से अलग किया गया।' },
        { time: '01:15', seconds: 75, speaker: 'जूलियन बार्न्स', text: 'बाहर तीखे राजनीतिक बयान चल रहे थे, वहीं अंदर अनुभवी सीनेटर व्यवस्थित रूप से हर मत की गिनती कर रहे थे।' },
        { time: '01:36', seconds: 96, speaker: 'जूलियन बार्न्स', text: 'नए वित्तीय वर्ष में सरकारी कामकाज पूरी स्थिरता के साथ जारी रहेगा। कैपिटल हिल से जूलियन बार्न्स।' }
      ]
    },
    'pod-4': {
      title: 'राजनयिक समीक्षा: औद्योगिक कूटनीति',
      series: 'वैश्विक कूटनीति',
      hostRole: 'वरिष्ठ शोधकर्ता और पूर्व सहायक सचिव',
      description: 'आधुनिक द्विपक्षीय गठबंधन अब महलों के बजाय लिथियम रिफाइनरियों, सेमीकंडक्टर फैब्स और गहरे बंदरगाहों में कैसे तय होते हैं।',
      topics: ['कूटनीति', 'सेमीकंडक्टर', 'लिथियम आपूर्ति श्रृंखला', 'इंडो-पैसिफिक'],
      keyQuotes: 'औद्योगिक क्षमता के बिना कूटनीति केवल एक दिखावा है।',
      transcriptSample: [
        { time: '00:00', seconds: 0, speaker: 'उद्घोषक', text: 'पॉलिटिक्स वर्ल्ड वैश्विक कूटनीति। एपिसोड 39: राजदूत जूलियन रिक्टर के साथ राजनयिक समीक्षा।' },
        { time: '00:10', seconds: 10, speaker: 'जूलियन रिक्टर', text: '21वीं सदी की कूटनीति में प्रभाव केवल औपचारिक संधियों से नहीं, बल्कि सेमीकंडक्टर उत्पादन और ऊर्जा ग्रिड की मजबूती से मापा जाता है।' },
        { time: '00:32', seconds: 32, speaker: 'जूलियन रिक्टर', text: 'आधुनिक गठबंधन अब लिथियम रिफाइनरियों, चिप कारखानों और बंदरगाहों के आधार पर तय होते हैं।' },
        { time: '00:54', seconds: 54, speaker: 'जूलियन रिक्टर', text: 'प्रशांत रसद सुरक्षा समझौता दर्शाता है कि बंदरगाहों की दक्षता भू-राजनीतिक सुरक्षा का महत्वपूर्ण हथियार बन चुकी है।' },
        { time: '01:16', seconds: 76, speaker: 'जूलियन रिक्टर', text: 'इस सम्मेलन का सार यही है: औद्योगिक ताकत के बिना कूटनीति सिर्फ एक औपचारिकता है। सुनने के लिए धन्यवाद।' }
      ]
    },
    'pod-5': {
      title: 'नई दिल्ली डिजिटल गलियारा: सेमीकंडक्टर आत्मनिर्भरता और क्वाड कूटनीति',
      series: 'दक्षिण एशिया रणनीतिक समीक्षा',
      hostRole: 'वरिष्ठ भू-राजनीतिक एवं तकनीकी संवाददाता',
      description: 'भारतीय संसद द्वारा $15B सेमीकंडक्टर मिशन पारित करने, अमेरिका और यूरोपीय संघ के साथ द्विपक्षीय डिजिटल समझौतों और क्वाड समुद्री निगरानी का विश्लेषण।',
      topics: ['भारतीय तकनीकी मिशन', 'सेमीकंडक्टर', 'नई दिल्ली', 'क्वाड गठबंधन', 'डिजिटल इंडिया'],
      keyQuotes: 'जब डिजिटल सार्वजनिक अवसंरचना एक अरब नागरिकों तक पहुंचती है, तो संप्रभु चिप निर्माण एक रणनीतिक अनिवार्यता बन जाता है।',
      transcriptSample: [
        { time: '00:00', seconds: 0, speaker: 'उद्घोषक', text: 'पॉलिटिक्स वर्ल्ड दक्षिण एशिया रणनीतिक समीक्षा। एपिसोड 143: विक्रमादित्य शर्मा और एलिनोर वेंस के साथ नई दिल्ली डिजिटल गलियारा।' },
        { time: '00:10', seconds: 10, speaker: 'विक्रमादित्य शर्मा', text: 'नई दिल्ली से शुभ संध्या। आज भारतीय संसद ने पंद्रह अरब डॉलर के राष्ट्रीय सेमीकंडक्टर और क्वांटम शील्ड अधिनियम को वैधानिक रूप से पारित कर दिया।' },
        { time: '00:30', seconds: 30, speaker: 'विक्रमादित्य शर्मा', text: 'गुजरात और असम में तीन वाणिज्यिक विनिर्माण संयंत्रों की मंजूरी के साथ, भारत एक संप्रभु सिलिकॉन गलियारे की स्थापना कर रहा है जो वैश्विक दक्षिण को पश्चिमी बाजारों से जोड़ता है।' },
        { time: '00:52', seconds: 52, speaker: 'एलिनोर वेंस', text: 'वाशिंगटन और ब्रसेल्स में व्यापार दूतों ने इस सफलता का स्वागत करते हुए कहा कि विविध चिप पैकेजिंग आपूर्ति शृंखला को एकल केंद्र के व्यवधानों से बचाती है।' },
        { time: '01:14', seconds: 74, speaker: 'विक्रमादित्य शर्मा', text: 'इसके साथ ही, क्वाड समुद्री समझौते के तहत मलक्का जलडमरूमध्य से अरब सागर तक एन्क्रिप्टेड रडार डेटा साझा करने की पुष्टि हुई है, जिससे खुला व्यापार सुनिश्चित होगा।' },
        { time: '01:36', seconds: 96, speaker: 'एलिनोर वेंस', text: 'जैसे-जैसे वैश्विक तकनीकी कंपनियां बेंगलुरु और नोएडा में निवेश बढ़ा रही हैं, यह इक्कीसवीं सदी की औद्योगिक रणनीति का एक ऐतिहासिक मोड़ है।' },
        { time: '01:58', seconds: 118, speaker: 'विक्रमादित्य शर्मा', text: 'पॉलिटिक्स वर्ल्ड के लिए एलिनोर वेंस के साथ मैं विक्रमादित्य शर्मा। लगातार प्रति घंटा समाचारों के लिए हमारे साथ बने रहें।' }
      ]
    }
  },
  zh: {
    'pod-1': {
      title: '全球早报：布鲁塞尔关税与补贴协议解密',
      series: '每日快讯播客',
      hostRole: '首席外交与经贸记者',
      description: '布鲁塞尔G7清洁技术补贴妥协案前沿报道、国会山彻夜审议动态以及美国务院海上航行安全最新声明。',
      topics: ['G7协议', '参议院终结辩论', '补贴上限', '亚太海运物流'],
      keyQuotes: '12%的补贴上限在黎明前化解了数十起长期存在的双边贸易争端。',
      transcriptSample: [
        { time: '00:00', seconds: 0, speaker: '播报员', text: 'Politics World 每日快讯。第142期：首席外交记者埃莉诺·万斯主持的全球早间简报。' },
        { time: '00:10', seconds: 10, speaker: '埃莉诺·万斯', text: '华盛顿早安。今天我们聚焦白宫经济特使与欧盟贸易代表在布鲁塞尔达成的黎明前突破性协议。' },
        { time: '00:30', seconds: 30, speaker: '埃莉诺·万斯', text: '历经三天闭门谈判，双方同意对清洁能源技术和关键矿物实施12%的对等补贴上限。' },
        { time: '00:52', seconds: 52, speaker: '马库斯·斯特林', text: '核心突破在于原产地认定。通过在盟国司法管辖区内平等互认关键矿物加工，供应链壁垒瞬间消除。' },
        { time: '01:14', seconds: 74, speaker: '埃莉诺·万斯', text: '在国会山，参议院领导层已承诺在本周四就法案进行快速批准表决，预计将以绝对多数通过。' },
        { time: '01:36', seconds: 96, speaker: '马库斯·斯特林', text: '参议院财政委员会资深委员今早确认，该妥协在财季截止前有效避免了报复性关税的升级。' },
        { time: '01:58', seconds: 118, speaker: '埃莉诺·万斯', text: '随着金融市场开盘，巴黎和东京的主权债券市场应声全线上涨。我是埃莉诺·万斯，为您持续报道。' }
      ]
    },
    'pod-2': {
      title: '2026政策深度拆解：跨大西洋产业协定',
      series: '法案深度分析',
      hostRole: '资深立法与贸易分析师',
      description: '跨大西洋产业协定逐条解读：日内瓦争端自动仲裁机制、关键矿物原产地门槛与国会委员会动态。',
      topics: ['法定文本分析', '日内瓦仲裁', '财政委员会', '清洁能源税收抵免'],
      keyQuotes: '当税法条文直接与国家安全出口管制清单交织时，传统的游说手法彻底失效。',
      transcriptSample: [
        { time: '00:00', seconds: 0, speaker: '播报员', text: 'Politics World 深度法案分析。第88期：2026年政策拆解，主讲人马库斯·斯特林与萨拉·詹金斯。' },
        { time: '00:11', seconds: 11, speaker: '马库斯·斯特林', text: '欢迎收听政策拆解。今天我们逐条剖析刚刚公布的46页跨大西洋产业协定法定文本。' },
        { time: '00:32', seconds: 32, speaker: '萨拉·詹金斯', text: '请重点注意第四条：它在日内瓦设立了自动化争端解决小组，严格执行45天快速裁决期限。' },
        { time: '00:54', seconds: 54, speaker: '马库斯·斯特林', text: '这彻底消除了此前阻碍电池超级工厂与海上风电跨国投资的法律拖延漏洞。' },
        { time: '01:16', seconds: 76, speaker: '萨拉·詹金斯', text: '税法中的抵免标准现在直接同国家安全出口管制清单挂钩，彻底改写了行业博弈规则。' },
        { time: '01:38', seconds: 98, speaker: '马库斯·斯特林', text: '总统签署法案后法定执行倒计时即刻启动。我们将持续追踪监管细则的制定进展。' }
      ]
    },
    'pod-3': {
      title: '国会机密档案：午夜终结辩论幕后',
      series: '议事槌背后',
      hostRole: '国会分社社长',
      description: '联邦政府停摆倒计时前夕：两党参议员如何在数小时内敲定74票绝对多数，通过持续决议案。',
      topics: ['拨款法案', '持续决议案', '阻挠议事票数', '紧急救灾拨款'],
      keyQuotes: '在电视镜头激烈的党派争吵背后，经验丰富的委员会老将正有条不紊地锁定跨党派多数票。',
      transcriptSample: [
        { time: '00:00', seconds: 0, speaker: '播报员', text: 'Politics World 议事槌背后。第54期：国会机密档案，由国会社长朱利安·巴恩斯报道。' },
        { time: '00:10', seconds: 10, speaker: '朱利安·巴恩斯', text: '昨夜11点15分，国会大厦圆形大厅下关键的终结辩论动议获得通过。以下是跨党派妥协达成的全过程。' },
        { time: '00:31', seconds: 31, speaker: '朱利安·巴恩斯', text: '在闭门会议中，拨款委员会领袖在停摆最后关头前三小时成功锁定了74票参议院绝对多数。' },
        { time: '00:53', seconds: 53, speaker: '朱利安·巴恩斯', text: '谈判的核心突破在于将160亿美元农业救灾基金与具争议的国防支出上限脱钩处理。' },
        { time: '01:15', seconds: 75, speaker: '朱利安·巴恩斯', text: '台前两党仍在激烈交锋，台后资深议员们则冷静地一票一票完成点票与对表。' },
        { time: '01:36', seconds: 96, speaker: '朱利安·巴恩斯', text: '随着总统签署持续决议案，联邦政府以平稳财政状态迈入新财年。朱利安·巴恩斯国会报道。' }
      ]
    },
    'pod-4': {
      title: '外交专栏：硬核产业主权与现代治国方略',
      series: '全球博弈论',
      hostRole: '高级研究员兼前助理国务卿',
      description: '为什么当今的双边同盟是在锂精炼厂、芯片制造晶圆厂和深水港口建立，而不是外交宴会厅。',
      topics: ['治国方略', '半导体', '锂供应链', '印太地缘'],
      keyQuotes: '缺乏工业耐力的外交辞令不过是无足轻重的舞台剧。',
      transcriptSample: [
        { time: '00:00', seconds: 0, speaker: '播报员', text: 'Politics World 全球博弈论。第39期：外交专栏，特邀朱利安·里希特大使。' },
        { time: '00:10', seconds: 10, speaker: '朱利安·里希特', text: '在21世纪的国际博弈中，外交实力不再取决于签字仪式的排场，而取决于芯片晶圆产出与主权电网韧性。' },
        { time: '00:32', seconds: 32, speaker: '朱利安·里希特', text: '现代双边同盟不再诞生于宫廷宴席，而是锤炼于锂精炼厂、先进制程晶圆厂与深水集装箱码头。' },
        { time: '00:54', seconds: 54, speaker: '朱利安·里希特', text: '最新的太平洋物流安全协定证明，货柜船舶的周转速度已成为地缘威慑的重要工具。' },
        { time: '01:16', seconds: 76, speaker: '朱利安·里希特', text: '峰会闭幕之际请铭记：缺乏工业后劲的外交不过是纸上谈兵。感谢您的收听。' }
      ]
    }
  },
  ar: {
    'pod-1': {
      title: 'الإيجاز الصباحي العالمي: تسوية الرسوم الجمركية في بروكسل',
      series: 'الموجز اليومي',
      hostRole: 'كبيرة المراسلين الدبلوماسيين',
      description: 'كواليس اتفاق مجموعة السبع بشأن إعانات التكنولوجيا النظيفة في بروكسل وتصويت مجلس الشيوخ الأمريكي والعقيدة البحرية.',
      topics: ['اتفاق السبع', 'إنهاء مناقشات الشيوخ', 'سقف الإعانات', 'اللوجستيات عبر المحيط'],
      keyQuotes: 'سقف الدعم بنسبة اثني عشر بالمائة يُبطل عشرات النزاعات التجارية قبل بزوغ الفجر.',
      transcriptSample: [
        { time: '00:00', seconds: 0, speaker: 'المذيع', text: 'بوليتيكس وورلد الموجز اليومي. الحلقة 142: الإيجاز الصباحي العالمي مع المراسلة الدبلوماسية إلينور فانس.' },
        { time: '00:10', seconds: 10, speaker: 'إلينور فانس', text: 'صباح الخير من واشنطن. نبدأ اليوم بالاتفاق المبرم فجراً بين مبعوثي البيت الأبيض والاتحاد الأوروبي في بروكسل.' },
        { time: '00:30', seconds: 30, speaker: 'إلينور فانس', text: 'بعد ثلاثة أيام من المفاوضات المغلقة، حدد المفاوضون سقفاً شاملاً بنسبة 12% لإعانات التكنولوجيا النظيفة والمعادن الحيوية.' },
        { time: '00:52', seconds: 52, speaker: 'ماركوس ستيرلينغ', text: 'الاختراق الأساسي يدور حول قواعد المنشأ. الاعتراف المتبادل بالمعادن المعالجة بين الحلفاء يُنهي الخلافات فوراً.' },
        { time: '01:14', seconds: 74, speaker: 'إلينور فانس', text: 'في الكابيتول، تعهدت قيادة مجلس الشيوخ بتصويت سريع للتصديق يوم الخميس بأغلبية مريحة.' },
        { time: '01:36', seconds: 96, speaker: 'ماركوس ستيرلينغ', text: 'أكد أعضاء لجنة المالية في مجلس الشيوخ أن هذه التسوية تتجنب الرسوم الانتقامية قبل نهاية الربع المالي.' },
        { time: '01:58', seconds: 118, speaker: 'إلينور فانس', text: 'مع افتتاح الأسواق المالية، ارتفعت السندات السيادية في باريس وطوكيو. كانت معكم إلينور فانس لبوليتيكس وورلد.' }
      ]
    },
    'pod-2': {
      title: 'تحليل السياسات 2026: الميثاق الصناعي عبر الأطلسي',
      series: 'تحليل تشريعي معمق',
      hostRole: 'كبار محللي التشريع والتجارة',
      description: 'قراءة معمقة لنص الميثاق الصناعي عبر الأطلسي: آلية التحكيم في جنيف ومعايير المنشأ واللجان البرلمانية.',
      topics: ['تحليل قانوني', 'تحكيم جنيف', 'لجنة المالية', 'إعفاءات الطاقة النظيفة'],
      keyQuotes: 'عندما تتقاطع قوانين الضرائب مع قوائم الأمن القومي للتصدير، تسقط أساليب الضغط التقليدية.',
      transcriptSample: [
        { time: '00:00', seconds: 0, speaker: 'المذيع', text: 'بوليتيكس وورلد تحليل تشريعي. الحلقة 88: تفكيك السياسات مع ماركوس ستيرلينغ وسارة جينكينز.' },
        { time: '00:11', seconds: 11, speaker: 'ماركوس ستيرلينغ', text: 'مرحباً بكم. نتناول اليوم سطراً بسطر الصفحات الست والأربعين للنص التشريعي للميثاق الصناعي عبر الأطلسي.' },
        { time: '00:32', seconds: 32, speaker: 'سارة جينكينز', text: 'انتبهوا للقسم الرابع: إنه ينشئ هيئة تحكيم آلية في جنيف مع مهلة فصل حاسمة لا تتجاوز 45 يوماً.' },
        { time: '00:54', seconds: 54, speaker: 'ماركوس ستيرلينغ', text: 'هذا يزيل الثغرات التي عطلت استثمارات مصانع البطاريات العملاقة وطاقة الرياح البحرية لسنوات.' },
        { time: '01:16', seconds: 76, speaker: 'سارة جينكينز', text: 'لاحظوا أيضاً أن الحوافز الضريبية باتت ترتبط مباشرة بضوابط تصدير التكنولوجيا الحساسة.' },
        { time: '01:38', seconds: 98, speaker: 'ماركوس ستيرلينغ', text: 'يبدأ التنفيذ فور توقيع الرئيس على التشريع. سنتابع مسار اللوائح التنظيمية عن قرب.' }
      ]
    },
    'pod-3': {
      title: 'كواليس الكابيتول: تصويت منتصف الليل',
      series: 'ما وراء المطرقة',
      hostRole: 'رئيس مكتب الكونغرس',
      description: 'خلف الأبواب المغلقة قبيل إغلاق الحكومة الفيدرالية: كيف حسم تحالف الشيوخ 74 صوتاً لتمرير التمويل.',
      topics: ['المخصصات', 'القرار المستمر', 'حسابات الشيوخ', 'إغاثة الكوارث'],
      keyQuotes: 'وراء الخطابات المتلفزة، كان البرلمانيون المخضرمون يجمعون بهدوء أغلبية ساحقة.',
      transcriptSample: [
        { time: '00:00', seconds: 0, speaker: 'المذيع', text: 'بوليتيكس وورلد ما وراء المطرقة. الحلقة 54: كواليس الكابيتول مع جوليان بارنز.' },
        { time: '00:10', seconds: 10, speaker: 'جوليان بارنز', text: 'كانت الساعة 11:15 مساءً تحت قبة الكابيتول حين حُسم التصويت الحاسم لتفادي الإغلاق الحكومي.' },
        { time: '00:31', seconds: 31, speaker: 'جوليان بارنز', text: 'خلف الأبواب المغلقة، حقق المفاوضون 74 صوتاً قبل ثلاث ساعات فقط من الموعد النهائي للميزانية.' },
        { time: '00:53', seconds: 53, speaker: 'جوليان بارنز', text: 'جاء الانفراج حين تم فصل 16 مليار دولار للإغاثة الزراعية عن بنود الإنفاق الدفاعي المتنازع عليها.' },
        { time: '01:15', seconds: 75, speaker: 'جوليان بارنز', text: 'بينما انشغلت الكاميرات بالمشاحنات الحزبية، كان القادة يحسبون الأصوات مقعداً تلو الآخر.' },
        { time: '01:36', seconds: 96, speaker: 'جوليان بارنز', text: 'بتوقيع القرار، تواصل المؤسسات الفيدرالية عملها باستقرار مالي تام. جوليان بارنز من الكابيتول.' }
      ]
    },
    'pod-4': {
      title: 'التقرير الدبلوماسي: دبلوماسية الصناعة والسيادة',
      series: 'استراتيجيات عالمية',
      hostRole: 'باحث أول ومساعد وزير سابق',
      description: 'لماذا باتت التحالفات الدولية تُبنى في مصافي الليثيوم ومصانع الرقائق والموانئ وليس في القاعات البروتوكولية.',
      topics: ['الدبلوماسية', 'أشباه الموصلات', 'سلاسل الليثيوم', 'المحيطين الهندي والهادئ'],
      keyQuotes: 'الدبلوماسية دون قاعدة صناعية قوية ليست سوى استعراض مسرحي.',
      transcriptSample: [
        { time: '00:00', seconds: 0, speaker: 'المذيع', text: 'بوليتيكس وورلد استراتيجيات عالمية. الحلقة 39: التقرير الدبلوماسي مع السفير جوليان ريختر.' },
        { time: '00:10', seconds: 10, speaker: 'جوليان ريختر', text: 'في القرن الحادي والعشرين، لم نعد نقيس الثقل السياسي بمراسم التوقيع، بل بإنتاج الرقائق وصلابة شبكات الطاقة.' },
        { time: '00:32', seconds: 32, speaker: 'جوليان ريختر', text: 'التحالفات الحديثة تُصنع في مصافي الليثيوم ومصانع أشباه الموصلات ومحطات الحاويات البحرية.' },
        { time: '00:54', seconds: 54, speaker: 'جوليان ريختر', text: 'يُثبت الميثاق اللوجستي في المحيط الهادئ أن كفاءة الموانئ أصبحت سلاحاً فعالاً للردع الجيوسياسي.' },
        { time: '01:16', seconds: 76, speaker: 'جوليان ريختر', text: 'مع اختتام الاجتماعات الوزارية تذكروا هذه الحقيقة: الدبلوماسية دون قدرة صناعية مجرد مظهر. شكراً لاستماعكم.' }
      ]
    }
  },
  ja: {
    'pod-1': {
      title: 'モーニング・グローバル・ブリーフィング：ブリュッセル関税妥結',
      series: 'デイリー・ディスパッチ',
      hostRole: '首席外交特派員',
      description: 'ブリュッセルでのG7クリーンテック補助金妥協、米上院での徹夜採決の動き、国務省の海洋自由航行方針を徹底解説。',
      topics: ['G7合意', '上院討論終結', '補助金上限', '太平洋物流'],
      keyQuotes: '12%の補助金上限設定により、夜明け前に数多くの通商摩擦が解消されました。',
      transcriptSample: [
        { time: '00:00', seconds: 0, speaker: 'アナウンサー', text: 'ポリティクス・ワールド デイリー・ディスパッチ。第142回：首席外交特派員エレノア・ヴァンスによるモーニング・ブリーフィング。' },
        { time: '00:10', seconds: 10, speaker: 'エレノア・ヴァンス', text: 'ワシントンからおはようございます。本日トップは、ブリュッセルで未明に合意に達したホワイトハウスと欧州連合の歴史的通商合意です。' },
        { time: '00:30', seconds: 30, speaker: 'エレノア・ヴァンス', text: '3日間にわたる緊迫した協議を経て、クリーンエネルギー技術と重要鉱物に対し一律12％の補助金上限を設定することで合意しました。' },
        { time: '00:52', seconds: 52, speaker: 'マーカス・スターリング', text: '最大の突破口は原産地基準です。同盟諸国内で加工された重要鉱物を同等に認定することで、サプライチェーンの混乱が一挙に解消されます。' },
        { time: '01:14', seconds: 74, speaker: 'エレノア・ヴァンス', text: '連邦議会では、上院指導部が木曜日に迅速な批准採決を行うことを確約しており、大差での可決が見込まれています。' },
        { time: '01:36', seconds: 96, speaker: 'マーカス・スターリング', text: '上院財政委員会の重鎮議員は今朝、この妥協案が四半期末を前に報復関税の応酬を確実に回避したと評価しました。' },
        { time: '01:58', seconds: 118, speaker: 'エレノア・ヴァンス', text: '金融市場の取引開始とともに、パリと東京の国債利回りは好意的に推移しています。ポリティクス・ワールド、エレノア・ヴァンスがお伝えしました。' }
      ]
    },
    'pod-2': {
      title: '2026年政策分析：大西洋横断協定の全貌',
      series: '法案徹底分析',
      hostRole: '上席立法・通商アナリスト',
      description: '大西洋横断産業協定の条文詳細解説：ジュネーブ紛争仲裁システム、重要鉱物閾値、議会委員会の動向。',
      topics: ['条文分析', 'ジュネーブ仲裁', '財政委員会', 'クリーンエネルギー税額控除'],
      keyQuotes: '税法基準が国家安全保障の輸出管理リストと直結するとき、旧来のロビー活動は無力化します。',
      transcriptSample: [
        { time: '00:00', seconds: 0, speaker: 'アナウンサー', text: 'ポリティクス・ワールド 法案徹底分析。第88回：マーカス・スターリングとサラ・ジェンキンスによる政策解説。' },
        { time: '00:11', seconds: 11, speaker: 'マーカス・スターリング', text: '政策分析へようこそ。本日は公開された46ページの大西洋横断産業協定の法定条文を1行ずつ検証します。' },
        { time: '00:32', seconds: 32, speaker: 'サラ・ジェンキンス', text: '第4条にご注目ください。ジュネーブに設置される自動紛争解決パネルには、厳格な45日間の裁定期限が課されています。' },
        { time: '00:54', seconds: 54, speaker: 'マーカス・スターリング', text: 'これにより、電池ギガファクトリーや洋上風力発電への越境投資を阻んでいた法的不確実性が一掃されます。' },
        { time: '01:16', seconds: 76, speaker: 'サラ・ジェンキンス', text: '税制上の控除基準が安全保障上の輸出管理リストと直接連動している点も特筆すべきです。' },
        { time: '01:38', seconds: 98, speaker: 'マーカス・スターリング', text: '大統領の署名と同時に施行時計が動き出します。規制規則の策定スケジュールを注視していきます。' }
      ]
    },
    'pod-3': {
      title: 'キャピトル極秘録：深夜の討論終結採決',
      series: '議場の舞台裏',
      hostRole: '連邦議会支局長',
      description: '政府閉鎖のデッドライン直前：超党派上院有志がわずか数時間で74票の圧倒的多数を固めた舞台裏。',
      topics: ['歳出予算法案', 'つなぎ予算', '上院票読み', '災害復旧支援'],
      keyQuotes: 'テレビ向けのアピールの裏側で、歴戦の重鎮議員たちが冷静に大差の多数派を形成していました。',
      transcriptSample: [
        { time: '00:00', seconds: 0, speaker: 'アナウンサー', text: 'ポリティクス・ワールド 議場の舞台裏。第54回：ジュリアン・バーンズ支局長によるキャピトル極秘録。' },
        { time: '00:10', seconds: 10, speaker: 'ジュリアン・バーンズ', text: '議事堂の円形大広間の下で決定的な討論終結動議が可決されたのは午後11時15分のことでした。' },
        { time: '00:31', seconds: 31, speaker: 'ジュリアン・バーンズ', text: '閉ざされたマホガニーの扉の奥で、歳出委の指導部は予算失効の3時間前に74票の絶対多数をまとめ上げました。' },
        { time: '00:53', seconds: 53, speaker: 'ジュリアン・バーンズ', text: '農業水害支援の160億ドルを難航する国防費から切り離したことが決定打となりました。' },
        { time: '01:15', seconds: 75, speaker: 'ジュリアン・バーンズ', text: '建物の外で激しい党派的批判が叫ばれる中、議場では確実に1票ずつの票読みが進められていました。' },
        { time: '01:36', seconds: 96, speaker: 'ジュリアン・バーンズ', text: 'つなぎ予算が成立したことで、連邦政府は財政的安定を維持して新年度に入ります。ジュリアン・バーンズがお伝えしました。' }
      ]
    },
    'pod-4': {
      title: '外交ディスパッチ：産業力主権と国家戦略',
      series: 'グローバル・ステートクラフト',
      hostRole: '上級フェロー・元国務次官補',
      description: '現代の同盟関係が儀礼的な晩餐会ではなく、リチウム精錬所や半導体工場、深水港湾で結ばれる理由。',
      topics: ['国家戦略', '半導体', 'リチウム供給網', 'インド太平洋'],
      keyQuotes: '産業基盤を欠いた外交は、単なる舞台劇にすぎません。',
      transcriptSample: [
        { time: '00:00', seconds: 0, speaker: 'アナウンサー', text: 'ポリティクス・ワールド ステートクラフト。第39回：ジュリアン・リヒター元大使による外交ディスパッチ。' },
        { time: '00:10', seconds: 10, speaker: 'ジュリアン・リヒター', text: '21世紀の外交において、影響力は儀礼的な条約調印ではなく、半導体の製造能力と電力網の強靭さで測られます。' },
        { time: '00:32', seconds: 32, speaker: 'ジュリアン・リヒター', text: '同盟は晩餐会のテーブルではなく、リチウム精錬施設、最先端ファブ、コンテナ港で築かれます。' },
        { time: '00:54', seconds: 54, speaker: 'ジュリアン・リヒター', text: '新太平洋物流安全協定が示すように、港湾の貨物回転速度はいまや立派な地政学的抑止力です。' },
        { time: '01:16', seconds: 76, speaker: 'ジュリアン・リヒター', text: '閣僚級会合が閉幕したいま、産業力の裏付けなき外交は虚飾にすぎないことを銘記すべきです。ご清聴ありがとうございました。' }
      ]
    }
  },
  ru: {
    'pod-1': {
      title: 'Утренний мировой брифинг: Брюссельское тарифное соглашение',
      series: 'Ежедневный вестник',
      hostRole: 'Главный дипломатический корреспондент',
      description: 'Подробности соглашения G7 по субсидиям на чистые технологии, ночные маневры в Сенате США и морская доктрина Госдепартамента.',
      topics: ['Соглашение G7', 'Голосование в Сенате', 'Потолок субсидий', 'Тихоокеанская логистика'],
      keyQuotes: 'Двенадцатипроцентный потолок субсидий аннулирует десятки торговых споров еще до рассвета.',
      transcriptSample: [
        { time: '00:00', seconds: 0, speaker: 'Диктор', text: 'Politics World Ежедневный вестник. Выпуск 142: Утренний брифинг с главным дипломатическим корреспондентом Элеонор Вэнс.' },
        { time: '00:10', seconds: 10, speaker: 'Элеонор Вэнс', text: 'Доброе утро из Вашингтона. Мы начинаем выпуск с соглашения, заключенного перед рассветом в Брюсселе между посланниками Белого дома и ЕС.' },
        { time: '00:30', seconds: 30, speaker: 'Элеонор Вэнс', text: 'После трех дней закрытых консультаций стороны установили общий 12-процентный предел субсидирования зеленых технологий и критических минералов.' },
        { time: '00:52', seconds: 52, speaker: 'Маркус Стерлинг', text: 'Ключевой прорыв связан с правилами происхождения. Взаимное признание переработки сырья среди союзников снимает логистические барьеры.' },
        { time: '01:14', seconds: 74, speaker: 'Элеонор Вэнс', text: 'Лидеры Сената уже заявили о готовности провести ускоренное голосование в четверг, рассчитывая на уверенное большинство.' },
        { time: '01:36', seconds: 96, speaker: 'Маркус Стерлинг', text: 'Члены финансового комитета подтвердили, что этот компромисс предотвращает зеркальные пошлины до конца финансового квартала.' },
        { time: '01:58', seconds: 118, speaker: 'Элеонор Вэнс', text: 'С открытием финансовых рынков государственные облигации в Париже и Токио продемонстрировали рост. С вами была Элеонор Вэнс.' }
      ]
    },
    'pod-2': {
      title: 'Разбор политики 2026: Трансатлантический пакт',
      series: 'Углубленный анализ законов',
      hostRole: 'Старшие аналитики по законодательству и торговле',
      description: 'Анализ Трансатлантического промышленного пакта: арбитраж в Женеве, пороги происхождения минералов и комитеты Конгресса.',
      topics: ['Анализ статутов', 'Женевский арбитраж', 'Финансовый комитет', 'Зеленые налоговые льготы'],
      keyQuotes: 'Когда налоговые нормы пересекаются со списками нацбезопасности, привычный лоббизм перестает работать.',
      transcriptSample: [
        { time: '00:00', seconds: 0, speaker: 'Диктор', text: 'Politics World Анализ законодательства. Выпуск 88: Разбор политики 2026 с Маркусом Стерлингом и Сарой Дженкинс.' },
        { time: '00:11', seconds: 11, speaker: 'Маркус Стерлинг', text: 'Добро пожаловать в Анализ политики. Сегодня мы детально изучаем 46 страниц Трансатлантического промышленного пакта.' },
        { time: '00:32', seconds: 32, speaker: 'Сара Дженкинс', text: 'Обратите внимание на Раздел 4: он учреждает арбитражную панель в Женеве со строгим 45-дневным сроком вынесения решений.' },
        { time: '00:54', seconds: 54, speaker: 'Маркус Стерлинг', text: 'Это сразу устраняет многолетние юридические тупики, тормозившие инвестиции в аккумуляторные гигафабрики и ветропарки.' },
        { time: '01:16', seconds: 76, speaker: 'Сара Дженкинс', text: 'Налоговые вычеты теперь жестко привязаны к экспортным ограничениям в сфере национальной безопасности.' },
        { time: '01:38', seconds: 98, speaker: 'Маркус Стерлинг', text: 'С момента подписания закона президентом начнется нормативный обратный отсчет. Мы будем отслеживать регламенты.' }
      ]
    },
    'pod-3': {
      title: 'Тайны Капитолия: Полуночное голосование',
      series: 'За кулисами Конгресса',
      hostRole: 'Руководитель парламентского бюро',
      description: 'За закрытыми дверями перед наступлением шатдауна: как двухпартийная коалиция Сената обеспечила 74 решающих голоса.',
      topics: ['Бюджет', 'Резолюция о продлении', 'Расклад в Сенате', 'Помощь пострадавшим'],
      keyQuotes: 'Вдали от телекамер опытные законодатели методично выстраивали прочное межпартийное большинство.',
      transcriptSample: [
        { time: '00:00', seconds: 0, speaker: 'Диктор', text: 'Politics World За кулисами Конгресса. Выпуск 54: Тайны Капитолия с Джулианом Барнсом.' },
        { time: '00:10', seconds: 10, speaker: 'Джулиан Барнс', text: 'Было 23:15 под куполом Капитолия, когда резолюция прошла голосование. Вот как сложился этот двухпартийный компромисс.' },
        { time: '00:31', seconds: 31, speaker: 'Джулиан Барнс', text: 'За закрытыми дверями переговорщики заручились 74 голосами в Сенате всего за три часа до остановки финансирования.' },
        { time: '00:53', seconds: 53, speaker: 'Джулиан Барнс', text: 'Переломным моментом стало выделение 16 миллиардов долларов на помощь фермерам отдельно от оборонных статей.' },
        { time: '01:15', seconds: 75, speaker: 'Джулиан Барнс', text: 'Пока у входа звучали партийные лозунги, ветераны комитетов хладнокровно подсчитывали каждый голос.' },
        { time: '01:36', seconds: 96, speaker: 'Джулиан Барнс', text: 'С подписанием резолюции правительство входит в новый финансовый год без перебоев. Джулиан Барнс из Вашингтона.' }
      ]
    },
    'pod-4': {
      title: 'Дипломатический выпуск: Индустриальный суверенитет',
      series: 'Мировая геополитика',
      hostRole: 'Старший научный сотрудник и экс-помощник министра',
      description: 'Почему современные союзы формируются на литиевых заводах, полупроводниковых фабриках и в глубоководных портах.',
      topics: ['Геополитика', 'Полупроводники', 'Литиевые цепочки', 'Индо-Пацифика'],
      keyQuotes: 'Дипломатия без собственной промышленной базы — это просто театральная декорация.',
      transcriptSample: [
        { time: '00:00', seconds: 0, speaker: 'Диктор', text: 'Politics World Мировая геополитика. Выпуск 39: Дипломатический выпуск с послом Джулианом Рихтером.' },
        { time: '00:10', seconds: 10, speaker: 'Джулиан Рихтер', text: 'В 21 веке геополитический вес измеряется не протокольными приемами, а объемами выпуска чипов и устойчивостью энергосетей.' },
        { time: '00:32', seconds: 32, speaker: 'Джулиан Рихтер', text: 'Современные союзы рождаются на литиевых перерабатывающих комбинатах, заводах микроэлектроники и в морских хабах.' },
        { time: '00:54', seconds: 54, speaker: 'Джулиан Рихтер', text: 'Тихоокеанский логистический пакт наглядно доказал: скорость оборота контейнеров в портах стала инструментом сдерживания.' },
        { time: '01:16', seconds: 76, speaker: 'Джулиан Рихтер', text: 'Завершая встречу министров, подчеркну: дипломатия без индустриального хребта бессильна. Спасибо за внимание.' }
      ]
    }
  },
  pt: {
    'pod-1': {
      title: 'Briefing Global Matinal: O Acordo Tarifário de Bruxelas',
      series: 'Boletim Diário',
      hostRole: 'Correspondente Diplomática Principal',
      description: 'Os bastidores do compromisso do G7 sobre subsídios para tecnologias limpas, votações no Senado e a doutrina marítima.',
      topics: ['Acordo G7', 'Votação no Senado', 'Teto de Subsídios', 'Logística do Pacífico'],
      keyQuotes: 'O teto de doze por cento para subsídios anula dezenas de disputas comerciais antes do amanhecer.',
      transcriptSample: [
        { time: '00:00', seconds: 0, speaker: 'Locutor', text: 'Politics World Boletim Diário. Episódio 142: Briefing Global Matinal com a correspondente diplomática Eleanor Vance.' },
        { time: '00:10', seconds: 10, speaker: 'Eleanor Vance', text: 'Bom dia de Washington. Iniciamos hoje com o acordo firmado antes da alvorada em Bruxelas entre emissários da Casa Branca e da União Europeia.' },
        { time: '00:30', seconds: 30, speaker: 'Eleanor Vance', text: 'Após três dias de negociações a portas fechadas, foi acordado um teto uniforme de doze por cento para subsídios em energias limpas.' },
        { time: '00:52', seconds: 52, speaker: 'Marcus Sterling', text: 'A virada fundamental está nas regras de origem. Reconhecer minerais processados em parceiros aliados elimina atritos logísticos de imediato.' },
        { time: '01:14', seconds: 74, speaker: 'Eleanor Vance', text: 'No Capitólio, líderes do Senado já prometeram votação acelerada de ratificação nesta quinta-feira, com ampla maioria.' },
        { time: '01:36', seconds: 96, speaker: 'Marcus Sterling', text: 'Membros da Comissão de Finanças afirmaram que este compromisso afasta tarifas retaliatórias antes do fim do trimestre fiscal.' },
        { time: '01:58', seconds: 118, speaker: 'Eleanor Vance', text: 'Com a abertura dos mercados, títulos soberanos em Paris e Tóquio reagiram em alta. Informou Eleanor Vance para a Politics World.' }
      ]
    },
    'pod-2': {
      title: 'Análise de Políticas 2026: O Pacto Transatlântico',
      series: 'Análise Legislativa Aprofundada',
      hostRole: 'Analistas Legislativos e Comerciais Seniores',
      description: 'Dissecação do Pacto Industrial Transatlântico: arbitragem em Genebra, regras para minerais críticos e comissões do Congresso.',
      topics: ['Análise da Lei', 'Arbitragem de Genebra', 'Comissão de Finanças', 'Créditos Verdes'],
      keyQuotes: 'Quando as regras tributárias se cruzam com a segurança nacional, as antigas cartilhas de lobby perdem o valor.',
      transcriptSample: [
        { time: '00:00', seconds: 0, speaker: 'Locutor', text: 'Politics World Análise Aprofundada. Episódio 88: Análise de Políticas 2026 com Marcus Sterling e Sarah Jenkins.' },
        { time: '00:11', seconds: 11, speaker: 'Marcus Sterling', text: 'Bem-vindos à Análise de Políticas. Hoje examinamos linha por linha as 46 páginas do texto do Pacto Industrial Transatlântico.' },
        { time: '00:32', seconds: 32, speaker: 'Sarah Jenkins', text: 'Atenção especial à Seção Quatro: estabelece um painel em Genebra com prazo improrrogável de 45 dias para decisões.' },
        { time: '00:54', seconds: 54, speaker: 'Marcus Sterling', text: 'Isso resolve os impasses jurídicos que travavam investimentos em gigafábricas de baterias e parques eólicos marítimos.' },
        { time: '01:16', seconds: 76, speaker: 'Sarah Jenkins', text: 'Os incentivos fiscais agora se conectam diretamente com as listas de controle de exportação por segurança nacional.' },
        { time: '01:38', seconds: 98, speaker: 'Marcus Sterling', text: 'A contagem para implementação começa assim que o Presidente sancionar o texto. Acompanharemos todas as normas.' }
      ]
    },
    'pod-3': {
      title: 'Confidencial do Capitólio: Votação da Meia-Noite',
      series: 'Nos Bastidores do Congresso',
      hostRole: 'Chefe de Redação Parlamentar',
      description: 'A portas fechadas antes do fim do orçamento: como senadores democratas e republicanos garantiram 74 votos decisivos.',
      topics: ['Orçamento Federal', 'Resolução Contínua', 'Placar do Senado', 'Auxílio Desastres'],
      keyQuotes: 'Longe dos microfones da imprensa, parlamentares experientes construíam metodicamente ampla maioria suprapartidária.',
      transcriptSample: [
        { time: '00:00', seconds: 0, speaker: 'Locutor', text: 'Politics World Bastidores do Congresso. Episódio 54: Confidencial do Capitólio com Julian Barnes.' },
        { time: '00:10', seconds: 10, speaker: 'Julian Barnes', text: 'Eram 23h15 sob a cúpula do Capitólio quando a moção decisiva foi aprovada. Veja como o acordo bipartidário se consolidou.' },
        { time: '00:31', seconds: 31, speaker: 'Julian Barnes', text: 'A portas fechadas, negociadores garantiram 74 votos no Senado a apenas três horas do prazo de paralisação.' },
        { time: '00:53', seconds: 53, speaker: 'Julian Barnes', text: 'O avanço decisivo ocorreu ao destinar 16 bilhões de dólares para alívio agrícola, desvinculando de verbas militares.' },
        { time: '01:15', seconds: 75, speaker: 'Julian Barnes', text: 'Enquanto discursos inflamados ecoavam no plenário, líderes partidários contavam voto a voto com precisão.' },
        { time: '01:36', seconds: 96, speaker: 'Julian Barnes', text: 'Com a sanção da resolução contínua, o governo federal inicia o novo ano fiscal com estabilidade. Julian Barnes, do Capitólio.' }
      ]
    },
    'pod-4': {
      title: 'Boletim Diplomático: Poder Industrial e Soberania',
      series: 'Estratégia Global',
      hostRole: 'Pesquisador Sênior e Ex-Secretário Adjunto',
      description: 'Por que alianças contemporâneas são construídas em refinarias de lítio e fábricas de semicondutores, e não em banquetes diplomáticos.',
      topics: ['Estratégia', 'Semicondutores', 'Cadeia de Lítio', 'Indo-Pacífico'],
      keyQuotes: 'Diplomacia sem respaldo industrial é apenas representação cênica.',
      transcriptSample: [
        { time: '00:00', seconds: 0, speaker: 'Locutor', text: 'Politics World Estratégia Global. Episódio 39: Boletim Diplomático com o Embaixador Julian Richter.' },
        { time: '00:10', seconds: 10, speaker: 'Julian Richter', text: 'No século XXI, o peso geopolítico não é medido por assinaturas solenes, mas pela capacidade produtiva de semicondutores e redes elétricas.' },
        { time: '00:32', seconds: 32, speaker: 'Julian Richter', text: 'Alianças modernas são erguidas em refinarias de lítio, fábricas de microchips e terminais portuários de grande calado.' },
        { time: '00:54', seconds: 54, speaker: 'Julian Richter', text: 'O novo pacto logístico do Pacífico prova que a agilidade na movimentação de cargas portuárias é um instrumento de dissuasão geopolítica.' },
        { time: '01:16', seconds: 76, speaker: 'Julian Richter', text: 'Ao fim da reunião ministerial, fica a lição: diplomacia sem vigor industrial não passa de retórica. Obrigado pela audiência.' }
      ]
    }
  },
  it: {
    'pod-1': {
      title: 'Briefing Mondiale del Mattino: L’Accordo Tariffario di Bruxelles',
      series: 'Dispaccio Quotidiano',
      hostRole: 'Caporedattrice per la Diplomazia',
      description: 'Dietro le quinte dell’accordo del G7 sui sussidi all’energia pulita a Bruxelles, le manovre al Senato americano e la dottrina marittima.',
      topics: ['Accordo G7', 'Voto al Senato', 'Tetto Sussidi', 'Logistica Pacifico'],
      keyQuotes: 'Il tetto del dodici percento sui sussidi azzera decine di contenziosi commerciali prima dell’alba.',
      transcriptSample: [
        { time: '00:00', seconds: 0, speaker: 'Annunciatore', text: 'Politics World Dispaccio Quotidiano. Episodio 142: Briefing Mondiale con la corrispondente Eleanor Vance.' },
        { time: '00:10', seconds: 10, speaker: 'Eleanor Vance', text: 'Buongiorno da Washington. Apriamo oggi con l’intesa raggiunta prima dell’alba a Bruxelles tra inviati della Casa Bianca e direttori dell’UE.' },
        { time: '00:30', seconds: 30, speaker: 'Eleanor Vance', text: 'Dopo tre giorni di colloqui serrati, è stato fissato un tetto uniforme del 12% ai sussidi per le tecnologie pulite e i minerali critici.' },
        { time: '00:52', seconds: 52, speaker: 'Marcus Sterling', text: 'La svolta riguarda le regole d’origine. Riconoscere i minerali lavorati nei Paesi alleati fa crollare istantaneamente le frizioni logistiche.' },
        { time: '01:14', seconds: 74, speaker: 'Eleanor Vance', text: 'Al Senato, i capigruppo hanno già garantito un voto rapido di ratifica per giovedì con un’ampia maggioranza bipartisan.' },
        { time: '01:36', seconds: 96, speaker: 'Marcus Sterling', text: 'I vertici della Commissione Finanze confermano che questo compromesso scongiura ritorsioni doganali prima della chiusura trimestrale.' },
        { time: '01:58', seconds: 118, speaker: 'Eleanor Vance', text: 'All’apertura delle borse, i titoli sovrani a Parigi e Tokyo sono subito saliti. Per Politics World, Eleanor Vance.' }
      ]
    },
    'pod-2': {
      title: 'Analisi Politica 2026: Il Patto Transatlantico',
      series: 'Analisi Legislativa Approfondita',
      hostRole: 'Analisti Parlamentari e di Commercio Estero',
      description: 'Esame dettagliato del Patto Industriale Transatlantico: collegio arbitrale a Ginevra, soglie d’origine e dinamiche parlamentari.',
      topics: ['Analisi Normativa', 'Arbitrato Ginevra', 'Commissione Finanze', 'Crediti d’Imposta Verdi'],
      keyQuotes: 'Quando le definizioni fiscali incontrano gli elenchi di sicurezza nazionale, le vecchie strategie di lobbying tramontano.',
      transcriptSample: [
        { time: '00:00', seconds: 0, speaker: 'Annunciatore', text: 'Politics World Analisi Normativa. Episodio 88: Analisi Politica 2026 con Marcus Sterling e Sarah Jenkins.' },
        { time: '00:11', seconds: 11, speaker: 'Marcus Sterling', text: 'Benvenuti all’Analisi Politica. Oggi esaminiamo pagina per pagina le 46 pagine del Patto Industriale Transatlantico.' },
        { time: '00:32', seconds: 32, speaker: 'Sarah Jenkins', text: 'Attenzione alla Sezione Quattro: istituisce a Ginevra un collegio arbitrale con termine perentorio di 45 giorni per le sentenze.' },
        { time: '00:54', seconds: 54, speaker: 'Marcus Sterling', text: 'Questo rimuove gli stalli legali che bloccavano investimenti in gigafactory per batterie e parchi eolici offshore.' },
        { time: '01:16', seconds: 76, speaker: 'Sarah Jenkins', text: 'Le agevolazioni fiscali sono ora direttamente collegate ai controlli sulle esportazioni strategiche per la sicurezza.' },
        { time: '01:38', seconds: 98, speaker: 'Marcus Sterling', text: 'La tabella di marcia partirà appena il Presidente firmerà la legge. Monitoreremo da vicino i decreti attuativi.' }
      ]
    },
    'pod-3': {
      title: 'Dietro le Quinte del Campidoglio: Il Voto di Mezzanotte',
      series: 'I Segreti del Congresso',
      hostRole: 'Capo Ufficio Parlamentare',
      description: 'A porte chiuse prima della scadenza del bilancio: come una coalizione bipartisan ha raccolto 74 voti al Senato.',
      topics: ['Bilancio Federale', 'Esercizio Provvisorio', 'Numeri al Senato', 'Soccorsi Calamità'],
      keyQuotes: 'Dietro la retorica dei talk show, parlamentari di lungo corso stavano costruendo una solida maggioranza trasversale.',
      transcriptSample: [
        { time: '00:00', seconds: 0, speaker: 'Annunciatore', text: 'Politics World I Segreti del Congresso. Episodio 54: Il Voto di Mezzanotte con Julian Barnes.' },
        { time: '00:10', seconds: 10, speaker: 'Julian Barnes', text: 'Erano le 23:15 sotto la cupola del Campidoglio quando il voto decisivo è passato. Ecco come si è formato l’accordo.' },
        { time: '00:31', seconds: 31, speaker: 'Julian Barnes', text: 'A porte chiuse, i relatori del bilancio hanno blindato 74 voti al Senato a tre ore dal blocco dell’amministrazione.' },
        { time: '00:53', seconds: 53, speaker: 'Julian Barnes', text: 'La svolta è arrivata sbloccando 16 miliardi per aiuti all’agricoltura, scorporandoli dalle spese per la difesa.' },
        { time: '01:15', seconds: 75, speaker: 'Julian Barnes', text: 'Mentre all’esterno risuonavano polemiche partitiche, dentro si contavano metodicamente i voti banco per banco.' },
        { time: '01:36', seconds: 96, speaker: 'Julian Barnes', text: 'Con la firma della legge, il governo federale affronta il nuovo esercizio con stabilità. Julian Barnes dal Campidoglio.' }
      ]
    },
    'pod-4': {
      title: 'Il Dispaccio Diplomatico: Sovranità e Potenza Industriale',
      series: 'Geopolitica Globale',
      hostRole: 'Senior Fellow ed Ex Sottosegretario',
      description: 'Perché le alleanze odierne si stringono nelle raffinerie di litio e negli impianti di microchip, anziché nei saloni dorati.',
      topics: ['Geopolitica', 'Semiconduttori', 'Filiere del Litio', 'Indo-Pacifico'],
      keyQuotes: 'La diplomazia priva di una solida base industriale è solo pura rappresentazione scenica.',
      transcriptSample: [
        { time: '00:00', seconds: 0, speaker: 'Annunciatore', text: 'Politics World Geopolitica Globale. Episodio 39: Il Dispaccio Diplomatico con l’Ambasciatore Julian Richter.' },
        { time: '00:10', seconds: 10, speaker: 'Julian Richter', text: 'Nel ventunesimo secolo, il peso politico non si misura più con cerimonie formali, ma con la capacità dei semiconduttori e delle reti elettriche.' },
        { time: '00:32', seconds: 32, speaker: 'Julian Richter', text: 'Le partnership strategiche nascono nelle raffinerie di litio, nelle fabbriche di chip e nei porti commerciali ad alto pescaggio.' },
        { time: '00:54', seconds: 54, speaker: 'Julian Richter', text: 'Il nuovo patto logistico del Pacifico dimostra che la velocità dei container è diventata una leva di deterrenza geopolitica.' },
        { time: '01:16', seconds: 76, speaker: 'Julian Richter', text: 'A conclusione del vertice ministeriale, questa è la realtà: la diplomazia senza forza industriale è solo teatro. Grazie dell’ascolto.' }
      ]
    }
  },
  ko: {
    'pod-1': {
      title: '모닝 글로벌 브리핑: 브뤼셀 관세 타결 긴급 해설',
      series: '데일리 디스패치',
      hostRole: '수석 외교 특파원',
      description: '브뤼셀 G7 청정기술 보조금 타결의 막전막후, 미 상원 표결 전략, 미 국무부 해양 항행 자유 원칙 집중 분석.',
      topics: ['G7 합의', '상원 표결', '보조금 상한선', '태평양 물류'],
      keyQuotes: '12% 보조금 상한선 합의로 수십 건의 통상 분쟁이 동트기 전 전격 해소되었습니다.',
      transcriptSample: [
        { time: '00:00', seconds: 0, speaker: '아나운서', text: '폴리틱스 월드 데일리 디스패치. 142화: 수석 외교 특파원 엘리너 밴스의 모닝 글로벌 브리핑.' },
        { time: '00:10', seconds: 10, speaker: '엘리너 밴스', text: '워싱턴에서 전해드립니다. 오늘 첫 소식은 브뤼셀에서 백악관 경제특사와 유럽연합 대표단 사이에 체결된 새벽 타결안입니다.' },
        { time: '00:30', seconds: 30, speaker: '엘리너 밴스', text: '사흘간의 마라톤 밀실 협상 끝에 청정에너지 기술 및 핵심 광물에 대해 일률적으로 12% 보조금 상한선이 설정되었습니다.' },
        { time: '00:52', seconds: 52, speaker: '마커스 스털링', text: '핵심 성과는 원산지 규정입니다. 동맹 관할권 내에서 가공된 핵심 광물을 동등하게 인정함으로써 공급망 마찰이 즉시 완화됩니다.' },
        { time: '01:14', seconds: 74, speaker: '엘리너 밴스', text: '의회에서는 상원 지도부가 이번 주 목요일 신속 비준 표결을 약속했으며, 여야 모두 무난한 가결을 전망하고 있습니다.' },
        { time: '01:36', seconds: 96, speaker: '마커스 스털링', text: '상원 재무위원회 주요 의원들은 이번 타협으로 회계분기 마감 전 보복 관세 위기를 완벽하게 모면했다고 밝혔습니다.' },
        { time: '01:58', seconds: 118, speaker: '엘리너 밴스', text: '글로벌 금융시장이 열리며 파리와 도쿄의 국채 시장이 일제히 반등했습니다. 폴리틱스 월드 엘리너 밴스였습니다.' }
      ]
    },
    'pod-2': {
      title: '2026 정책 심층 해부: 대서양 산업 협정',
      series: '법안 정밀 분석',
      hostRole: '수석 입법 및 통상 분석관',
      description: '대서양 산업 협정 조문 심층 해설: 제네바 분쟁 중재 메커니즘, 핵심 광물 요건, 의회 상임위 쟁점.',
      topics: ['법안 분석', '제네바 중재', '재무위원회', '청정에너지 세제 혜택'],
      keyQuotes: '세법 정의가 국가 안보 수출 통제 목록과 직결될 때, 기존의 로비 공식은 완전히 무너집니다.',
      transcriptSample: [
        { time: '00:00', seconds: 0, speaker: '아나운서', text: '폴리틱스 월드 법안 정밀 분석. 88화: 마커스 스털링과 사라 젠킨스의 2026 정책 해부.' },
        { time: '00:11', seconds: 11, speaker: '마커스 스털링', text: '정책 해부에 오신 것을 환영합니다. 오늘 우리는 새로 발표된 46쪽 분량의 대서양 산업 협정 조문을 한 줄씩 점검합니다.' },
        { time: '00:32', seconds: 32, speaker: '사라 젠킨스', text: '제4조에 주목하십시오. 제네바에 45일 판정 시한을 엄격히 적용하는 자동 분쟁 해결 패널을 설치합니다.' },
        { time: '00:54', seconds: 54, speaker: '마커스 스털링', text: '이로써 배터리 기가팩토리와 해상 풍력에 대한 국경 간 투자를 가로막던 다년간의 법적 불확실성이 해소됩니다.' },
        { time: '01:16', seconds: 76, speaker: '사라 젠킨스', text: '또한 세법상 공제 혜택이 안보 수출 통제 목록과 직접 연계되어 업계의 판도를 완전히 바꾸어 놓았습니다.' },
        { time: '01:38', seconds: 98, speaker: '마커스 스털링', text: '대통령의 서명과 함께 법적 시행 카운트다운이 시작됩니다. 후속 행정 규칙 제정을 면밀히 모니터링하겠습니다.' }
      ]
    },
    'pod-3': {
      title: '의회 비망록: 자정의 종결 투표',
      series: '의사당 무대 뒤',
      hostRole: '의회 전문 지국장',
      description: '연방정부 셧다운 시한 직전: 초당파 상원의원 연합이 단 몇 시간 만에 74표 압도적 다수를 확보한 과정.',
      topics: ['예산 배정', '임시 예산안', '상원 표 계산', '재난 복구 지원'],
      keyQuotes: '방송용 카메라의 정쟁 뒤편에서, 베테랑 의원들은 침착하게 세 자릿수 초당파 다수를 조직하고 있었습니다.',
      transcriptSample: [
        { time: '00:00', seconds: 0, speaker: '아나운서', text: '폴리틱스 월드 의사당 무대 뒤. 54화: 줄리언 반스 지국장의 의회 비망록.' },
        { time: '00:10', seconds: 10, speaker: '줄리언 반스', text: '의회 중앙 로툰다 아래에서 결정적인 종결 투표가 통과된 것은 밤 11시 15분이었습니다. 타협의 전말을 공개합니다.' },
        { time: '00:31', seconds: 31, speaker: '줄리언 반스', text: '밀실에서 예산 협상단은 셧다운 데드라인을 불과 세 시간 앞두고 상원 74표의 슈퍼 다수를 구축했습니다.' },
        { time: '00:53', seconds: 53, speaker: '줄리언 반스', text: '농업 수해 복구 지원금 160억 달러를 국방비 지출 한도와 분리 승인한 것이 결정적인 돌파구가 되었습니다.' },
        { time: '01:15', seconds: 75, speaker: '줄리언 반스', text: '밖에서는 격한 당파 싸움이 연출되는 동안, 회의장 안에서는 한 표 한 표 정확히 확인하고 있었습니다.' },
        { time: '01:36', seconds: 96, speaker: '줄리언 반스', text: '임시 예산안 서명으로 연방정부는 안정적으로 새 회계연도에 진입합니다. 국회의사당에서 줄리언 반스였습니다.' }
      ]
    },
    'pod-4': {
      title: '외교 특파: 산업 주권과 현대 국가 전략',
      series: '글로벌 국정 운영',
      hostRole: '수석 펠로우 겸 전 차관보',
      description: '현대 동맹이 화려한 연회장이 아니라 리튬 정제소, 반도체 팹, 심수 컨테이너 항만에서 결속되는 이유.',
      topics: ['국가 전략', '반도체', '리튬 공급망', '인도 태평양'],
      keyQuotes: '산업적 뒷받침이 없는 외교는 그저 무대 연극에 불과합니다.',
      transcriptSample: [
        { time: '00:00', seconds: 0, speaker: '아나운서', text: '폴리틱스 월드 글로벌 국정 운영. 39화: 줄리언 리히터 대사와 함께하는 외교 특파.' },
        { time: '00:10', seconds: 10, speaker: '줄리언 리히터', text: '21세기 외교에서 국력은 더 이상 의전용 서명식으로 측정되지 않습니다. 반도체 생산 능력과 전력망 회복력이 척도입니다.' },
        { time: '00:32', seconds: 32, speaker: '줄리언 리히터', text: '현대 동맹은 연회장이 아니라 리튬 정제소, 최첨단 팹, 심수 컨테이너 터미널에서 다져집니다.' },
        { time: '00:54', seconds: 54, speaker: '줄리언 리히터', text: '새 태평양 물류 안보 협정은 항만의 선박 회전 속도가 지정학적 억지력의 실질적 수단임을 보여줍니다.' },
        { time: '01:16', seconds: 76, speaker: '줄리언 리히터', text: '장관급 회담을 마치며 기억하십시오. 산업 체력이 결여된 외교는 쇼에 불과합니다. 청취해 주셔서 감사합니다.' }
      ]
    }
  },
  tr: {
    'pod-1': {
      title: 'Sabah Küresel Brifingi: Brüksel Tarife Uzlaşması',
      series: 'Günlük Bülten',
      hostRole: 'Baş Diplomasi Muhabiri',
      description: 'Brüksel’deki G7 temiz teknoloji sübvansiyon uzlaşması, Senato’daki gece manevraları ve ABD Dışişleri deniz doktrini.',
      topics: ['G7 Anlaşması', 'Senato Oylaması', 'Sübvansiyon Tavanı', 'Pasifik Lojistiği'],
      keyQuotes: 'Yüzde on ikilik sübvansiyon tavanı, gün ağarmadan onlarca ticari anlaşmazlığı ortadan kaldırdı.',
      transcriptSample: [
        { time: '00:00', seconds: 0, speaker: 'Spiker', text: 'Politics World Günlük Bülten. Bölüm 142: Baş Diplomasi Muhabiri Eleanor Vance ile Sabah Küresel Brifingi.' },
        { time: '00:10', seconds: 10, speaker: 'Eleanor Vance', text: 'Washington’dan günaydın. Bugün Brüksel’de Beyaz Saray ve AB ticaret yetkilileri arasında şafak öncesi varılan tarihi anlaşmayla başlıyoruz.' },
        { time: '00:30', seconds: 30, speaker: 'Eleanor Vance', text: 'Üç günlük yoğun kapalı kapı görüşmelerinin ardından, temiz enerji ve kritik minerallerde yüzde on ikilik tavan sübvansiyon belirlendi.' },
        { time: '00:52', seconds: 52, speaker: 'Marcus Sterling', text: 'En büyük dönüm noktası menşe tanımlarıdır. Müttefik ülkelerde işlenen minerallerin tanınması tedarik zinciri sürtünmelerini bitiriyor.' },
        { time: '01:14', seconds: 74, speaker: 'Eleanor Vance', text: 'Kongre’de Senato liderliği Perşembe günü hızlı bir onay oylaması yapacağını ve rahat bir çoğunluk çıkacağını taahhüt etti.' },
        { time: '01:36', seconds: 96, speaker: 'Marcus Sterling', text: 'Senato Finans Komitesi üyeleri, bu uzlaşmanın mali çeyrek öncesinde misilleme tarifelerini kesin olarak önlediğini belirtti.' },
        { time: '01:58', seconds: 118, speaker: 'Eleanor Vance', text: 'Piyasaların açılmasıyla Paris ve Tokyo’da tahviller yükselişe geçti. Politics World için Eleanor Vance aktardı.' }
      ]
    },
    'pod-2': {
      title: '2026 Politika Analizi: Transatlantik Sözleşmesi',
      series: 'Derinlemesine Yasa Analizi',
      hostRole: 'Kıdemli Yasama ve Ticaret Analistleri',
      description: 'Transatlantik Sanayi Sözleşmesi’nin madde madde incelenmesi: Cenevre tahkim mekanizması ve kritik mineral eşikleri.',
      topics: ['Yasa Analizi', 'Cenevre Tahkimi', 'Finans Komitesi', 'Temiz Enerji Vergi Kredileri'],
      keyQuotes: 'Vergi tanımları ulusal güvenlik ihracat listeleriyle kesiştiğinde, geleneksel lobi taktikleri çöker.',
      transcriptSample: [
        { time: '00:00', seconds: 0, speaker: 'Spiker', text: 'Politics World Derinlemesine Yasa Analizi. Bölüm 88: Marcus Sterling ve Sarah Jenkins ile 2026 Politika Analizi.' },
        { time: '00:11', seconds: 11, speaker: 'Marcus Sterling', text: 'Politika Analizine hoş geldiniz. Bugün yeni yayımlanan 46 sayfalık Transatlantik Sanayi Sözleşmesi metnini inceliyoruz.' },
        { time: '00:32', seconds: 32, speaker: 'Sarah Jenkins', text: 'Dördüncü Maddeye dikkat edin: Cenevre’de kırk beş günlük kesin hüküm süresiyle çalışan otomatik tahkim paneli kuruyor.' },
        { time: '00:54', seconds: 54, speaker: 'Marcus Sterling', text: 'Bu düzenleme, batarya fabrikaları ve rüzgar enerjisi yatırımlarını kilitleyen yasal açmazları ortadan kaldırıyor.' },
        { time: '01:16', seconds: 76, speaker: 'Sarah Jenkins', text: 'Vergi teşvikleri artık doğrudan ulusal güvenlik ihracat kontrol listeleriyle eşleştirilmiş durumda.' },
        { time: '01:38', seconds: 98, speaker: 'Marcus Sterling', text: 'Yasa Başkan tarafından imzalandığı an uygulama süreci resmen başlayacak. Yönetmelik takvimini yakından izleyeceğiz.' }
      ]
    },
    'pod-3': {
      title: 'Kongre Kulisleri: Gece Yarısı Kapanma Oylaması',
      series: 'Tokmağın Arkası',
      hostRole: 'Kongre Büro Şefi',
      description: 'Bütçe kapanma süresi dolmadan hemen önce: Senato’daki partilerüstü ittifakın 74 oyu nasıl topladığı.',
      topics: ['Bütçe Tahsisatı', 'Geçici Bütçe', 'Senato Dengeleri', 'Afet Yardımı'],
      keyQuotes: 'Televizyonlardaki sert demeçlerin ardında, kıdemli vekiller sakin bir şekilde geniş bir çoğunluk kuruyordu.',
      transcriptSample: [
        { time: '00:00', seconds: 0, speaker: 'Spiker', text: 'Politics World Tokmağın Arkası. Bölüm 54: Julian Barnes ile Kongre Kulisleri.' },
        { time: '00:10', seconds: 10, speaker: 'Julian Barnes', text: 'Kongre kubbesi altında kritik oylama tamamlandığında saatler 23:15’i gösteriyordu. İki partili uzlaşmanın perde arkası.' },
        { time: '00:31', seconds: 31, speaker: 'Julian Barnes', text: 'Kapalı kapılar ardında müzakereciler, fonların tükenmesine 3 saat kala Senato’da 74 oyluk üstün çoğunluğu sağladı.' },
        { time: '00:53', seconds: 53, speaker: 'Julian Barnes', text: 'Tarım afet yardımına 16 milyar dolar ayrılması ve bunun savunma harcamalarından ayrılması kilit rol oynadı.' },
        { time: '01:15', seconds: 75, speaker: 'Julian Barnes', text: 'Dışarıda sert tartışmalar sürerken, içeride vekiller tek tek oyları sayarak anlaşmayı güvenceye alıyordu.' },
        { time: '01:36', seconds: 96, speaker: 'Julian Barnes', text: 'Yasanın onaylanmasıyla federal yönetim yeni mali yıla istikrarla adım atıyor. Julian Barnes, Kongre’den bildirdi.' }
      ]
    },
    'pod-4': {
      title: 'Diplomatik Bülten: Sanayi Egemenliği ve Devlet Aklı',
      series: 'Küresel Strateji',
      hostRole: 'Kıdemli Araştırmacı ve Eski Müsteşar Yardımcısı',
      description: 'Çağdaş ittifakların ziyafet salonlarında değil, lityum rafinerileri ve çip fabrikalarında kurulmasının nedenleri.',
      topics: ['Devlet Stratejisi', 'Yarı İletkenler', 'Lityum Tedariki', 'Hindi-Pasifik'],
      keyQuotes: 'Sanayi gücüyle desteklenmeyen diplomasi sadece bir tiyatro sahnesidir.',
      transcriptSample: [
        { time: '00:00', seconds: 0, speaker: 'Spiker', text: 'Politics World Küresel Strateji. Bölüm 39: Büyükelçi Julian Richter ile Diplomatik Bülten.' },
        { time: '00:10', seconds: 10, speaker: 'Julian Richter', text: '21. yüzyılda diplomatik ağırlık artık imza törenleriyle değil, yarı iletken üretimi ve enerji şebekesinin dayanıklılığıyla ölçülüyor.' },
        { time: '00:32', seconds: 32, speaker: 'Julian Richter', text: 'Modern ittifaklar lityum tesislerinde, mikroçip fabrikalarında ve derin su konteyner limanlarında şekilleniyor.' },
        { time: '00:54', seconds: 54, speaker: 'Julian Richter', text: 'Yeni Pasifik lojistik anlaşması, limanlardaki konteyner devir hızının artık jeopolitik bir caydırıcılık unsuru olduğunu kanıtlıyor.' },
        { time: '01:16', seconds: 76, speaker: 'Julian Richter', text: 'Bakanlar zirvesi biterken şunu unutmayalım: Sanayi temeli olmayan diplomasi yalnızca bir gösteridir. Teşekkürler.' }
      ]
    }
  },
  nl: {
    'pod-1': {
      title: 'Ochtendbriefing Wereldpolitiek: Het Brusselse Tarievenakkoord',
      series: 'Dagelijks Bericht',
      hostRole: 'Hoofdcorrespondent Diplomatie',
      description: 'Achter de schermen van het G7-subsidiecompromis in Brussel, nachtelijke stemmingen in de Senaat en maritieme veiligheid.',
      topics: ['G7-akkoord', 'Senaatsstemming', 'Subsidieplafond', 'Pacifische Logistiek'],
      keyQuotes: 'Het subsidieplafond van twaalf procent beëindigt tientallen handelsgeschillen nog voor zonsopgang.',
      transcriptSample: [
        { time: '00:00', seconds: 0, speaker: 'Omroeper', text: 'Politics World Dagelijks Bericht. Aflevering 142: Ochtendbriefing met hoofdcorrespondent Eleanor Vance.' },
        { time: '00:10', seconds: 10, speaker: 'Eleanor Vance', text: 'Goedemorgen vanuit Washington. We openen vandaag met het voor dag en dauw gesloten handelsakkoord tussen de VS en de EU in Brussel.' },
        { time: '00:30', seconds: 30, speaker: 'Eleanor Vance', text: 'Na drie dagen intensief overleg werd een algemeen subsidieplafond van twaalf procent overeengekomen voor schone technologie.' },
        { time: '00:52', seconds: 52, speaker: 'Marcus Sterling', text: 'De grote doorbraak zit in de oorsprongsregels. Wederzijdse erkenning van verwerkte mineralen onder bondgenoten neemt wrijvingen direct weg.' },
        { time: '01:14', seconds: 74, speaker: 'Eleanor Vance', text: 'In de Senaat heeft de leiding al een versnelde ratificatiestemming voor donderdag toegezegd met een ruime meerderheid.' },
        { time: '01:36', seconds: 96, speaker: 'Marcus Sterling', text: 'Kopstukken van de Financiële Commissie bevestigden vanmorgen dat dit compromis vergeldingstarieven vóór het kwartaaleinde afwendt.' },
        { time: '01:58', seconds: 118, speaker: 'Eleanor Vance', text: 'Bij het openen van de beurzen veerden staatsobligaties in Parijs en Tokio direct op. Dit was Eleanor Vance voor Politics World.' }
      ]
    },
    'pod-2': {
      title: 'Beleidsanalyse 2026: Het Trans-Atlantische Pact',
      series: 'Wetsanalyse in Detail',
      hostRole: 'Senior Wetgevings- & Handelsspecialisten',
      description: 'Lijn-voor-lijn ontleding van het industrieel pact: arbitrage in Genève, drempelwaarden voor mineralen en commissiedynamiek.',
      topics: ['Wetsanalyse', 'Geneefse Arbitrage', 'Financiële Commissie', 'Groene Belastingkredieten'],
      keyQuotes: 'Wanneer belastingregels samenvallen met nationale veiligheidslijsten, verliezen traditionele lobbytactieken hun kracht.',
      transcriptSample: [
        { time: '00:00', seconds: 0, speaker: 'Omroeper', text: 'Politics World Wetsanalyse. Aflevering 88: Beleidsanalyse 2026 met Marcus Sterling en Sarah Jenkins.' },
        { time: '00:11', seconds: 11, speaker: 'Marcus Sterling', text: 'Welkom bij de Beleidsanalyse. Vandaag nemen we alle 46 pagina’s van het Trans-Atlantische Industriële Pact door.' },
        { time: '00:32', seconds: 32, speaker: 'Sarah Jenkins', text: 'Let vooral op Sectie Vier: het stelt een arbitragepanel in Genève in met een bindende uitspraaktermijn van vijfenveertig dagen.' },
        { time: '00:54', seconds: 54, speaker: 'Marcus Sterling', text: 'Dit maakt een einde aan jarenlange juridische patstellingen rond investeringen in batterijfabrieken en windparken.' },
        { time: '01:16', seconds: 76, speaker: 'Sarah Jenkins', text: 'Fiscale aftrekposten zijn nu rechtstreeks gekoppeld aan strategische exportcontrolelijsten.' },
        { time: '01:38', seconds: 98, speaker: 'Marcus Sterling', text: 'Zodra de president de wet tekent, gaat de implementatietermijn in. We volgen de uitvoeringsregels op de voet.' }
      ]
    },
    'pod-3': {
      title: 'Capitool Vertrouwelijk: De Middernachtstemming',
      series: 'Achter de Schermen van het Congres',
      hostRole: 'Chef Parlementaire Redactie',
      description: 'Achter gesloten deuren vlak voor de begrotingsdeadline: hoe een brede coalitie 74 stemmen in de Senaat veiligstelde.',
      topics: ['Rijksbegroting', 'Overbruggingswet', 'Senaatszetels', 'Rampensteun'],
      keyQuotes: 'Achter de televisieretoriek bouwden ervaren senatoren kalm aan een overtuigende meerderheid over partijgrenzen heen.',
      transcriptSample: [
        { time: '00:00', seconds: 0, speaker: 'Omroeper', text: 'Politics World Achter de Schermen. Aflevering 54: Capitool Vertrouwelijk met Julian Barnes.' },
        { time: '00:10', seconds: 10, speaker: 'Julian Barnes', text: 'Het was 23:15 uur onder de rotonde toen de beslissende motie werd aangenomen. Dit is hoe het compromis tot stand kwam.' },
        { time: '00:31', seconds: 31, speaker: 'Julian Barnes', text: 'Achter gesloten deuren haalden onderhandelaars 74 stemmen op, nauwelijks drie uur voor de overheid zou stilvallen.' },
        { time: '00:53', seconds: 53, speaker: 'Julian Barnes', text: 'De doorslag gaf een noodpakket van 16 miljard voor landbouwschade, losgekoppeld van de defensie-uitgaven.' },
        { time: '01:15', seconds: 75, speaker: 'Julian Barnes', text: 'Terwijl buiten partijpolitieke debatten woedden, telden de fractieleiders binnen methodisch elke stem.' },
        { time: '01:36', seconds: 96, speaker: 'Julian Barnes', text: 'Met de ondertekening van de overbruggingswet start de overheid het nieuwe fiscale jaar in rust. Julian Barnes, Capitool.' }
      ]
    },
    'pod-4': {
      title: 'Diplomatiek Bericht: Industriële Soevereiniteit',
      series: 'Mondiale Staatskunde',
      hostRole: 'Senior Fellow & Oud-Onderminister',
      description: 'Waarom hedendaagse bondgenootschappen gesmeed worden in lithiumraffinaderijen en chipfabrieken in plaats van feestzalen.',
      topics: ['Staatskunde', 'Halfgeleiders', 'Lithiumketens', 'Indo-Pacific'],
      keyQuotes: 'Diplomatie zonder industriële spierballen is niets meer dan toneelspel.',
      transcriptSample: [
        { time: '00:00', seconds: 0, speaker: 'Omroeper', text: 'Politics World Mondiale Staatskunde. Aflevering 39: Diplomatiek Bericht met ambassadeur Julian Richter.' },
        { time: '00:10', seconds: 10, speaker: 'Julian Richter', text: 'In de 21e eeuw meten we geopolitiek gewicht niet aan ceremoniële handtekeningen, maar aan chiptransacties en netwerkstabiliteit.' },
        { time: '00:32', seconds: 32, speaker: 'Julian Richter', text: 'Moderne allianties ontstaan niet bij banketten, maar in lithiumraffinaderijen en diepzeehaven-terminals.' },
        { time: '00:54', seconds: 54, speaker: 'Julian Richter', text: 'Het nieuwe Pacifische logistieke pact bewijst dat containeroverslag een effectief geopolitiek afschrikkingsmiddel is.' },
        { time: '01:16', seconds: 76, speaker: 'Julian Richter', text: 'Na deze topconferentie geldt: diplomatie zonder industrieel uithoudingsvermogen is slechts decor. Dank voor het luisteren.' }
      ]
    }
  },
  id: {
    'pod-1': {
      title: 'Taklimat Global Pagi: Penyelesaian Tarif Brussel',
      series: 'Warta Harian',
      hostRole: 'Koresponden Diplomatik Utama',
      description: 'Di balik layar kompromi subsidi teknologi bersih G7 di Brussel, manuver Senat AS di Capitol Hill, dan doktrin maritim.',
      topics: ['Kesepakatan G7', 'Pemungutan Suara Senat', 'Batas Subsidi', 'Logistik Pasifik'],
      keyQuotes: 'Batas subsidi dua belas persen membatalkan puluhan perselisihan dagang aktif sebelum fajar.',
      transcriptSample: [
        { time: '00:00', seconds: 0, speaker: 'Penyiar', text: 'Politics World Warta Harian. Episode 142: Taklimat Global Pagi bersama Koresponden Utama Eleanor Vance.' },
        { time: '00:10', seconds: 10, speaker: 'Eleanor Vance', text: 'Selamat pagi dari Washington. Kami mengawali hari ini dengan kesepakatan dini hari di Brussel antara utusan Gedung Putih dan Uni Eropa.' },
        { time: '00:30', seconds: 30, speaker: 'Eleanor Vance', text: 'Setelah tiga hari perundingan tertutup, disepakati batas subsidi menyeluruh sebesar 12 persen untuk energi bersih dan mineral kritis.' },
        { time: '00:52', seconds: 52, speaker: 'Marcus Sterling', text: 'Terobosan utama terletak pada aturan asal barang. Pengakuan setara atas mineral olahan sekutu seketika melenyapkan hambatan logistik.' },
        { time: '01:14', seconds: 74, speaker: 'Eleanor Vance', text: 'Di Capitol Hill, pimpinan Senat telah menjanjikan pemungutan suara cepat hari Kamis dengan proyeksi mayoritas meyakinkan.' },
        { time: '01:36', seconds: 96, speaker: 'Marcus Sterling', text: 'Anggota Komite Keuangan Senat memastikan kompromi ini berhasil mencegah tarif balasan menjelang akhir kuartal fiskal.' },
        { time: '01:58', seconds: 118, speaker: 'Eleanor Vance', text: 'Saat pasar dibuka, obligasi pemerintah di Paris dan Tokyo langsung menguat. Saya Eleanor Vance untuk Politics World.' }
      ]
    },
    'pod-2': {
      title: 'Bedah Kebijakan 2026: Pakta Transatlantik',
      series: 'Analisis Legislatif Mendalam',
      hostRole: 'Analis Senior Legislasi & Perdagangan',
      description: 'Pembedahan klausul demi klausul Pakta Industri Transatlantik: mekanisme arbitrase Jenewa dan ambang batas mineral kritis.',
      topics: ['Analisis Regulasi', 'Arbitrase Jenewa', 'Komite Keuangan', 'Kredit Pajak Bersih'],
      keyQuotes: 'Ketika aturan pajak bersinggungan dengan daftar keamanan nasional, taktik lobi lama runtuh seketika.',
      transcriptSample: [
        { time: '00:00', seconds: 0, speaker: 'Penyiar', text: 'Politics World Analisis Mendalam. Episode 88: Bedah Kebijakan 2026 bersama Marcus Sterling dan Sarah Jenkins.' },
        { time: '00:11', seconds: 11, speaker: 'Marcus Sterling', text: 'Selamat datang di Bedah Kebijakan. Hari ini kita telaah 46 halaman naskah hukum Pakta Industri Transatlantik baris demi baris.' },
        { time: '00:32', seconds: 32, speaker: 'Sarah Jenkins', text: 'Perhatikan Pasal Empat: membentuk panel arbitrase di Jenewa dengan tenggat putusan wajib maksimum 45 hari.' },
        { time: '00:54', seconds: 54, speaker: 'Marcus Sterling', text: 'Ini melenyapkan ketidakpastian hukum yang selama bertahun-tahun menghambat investasi pabrik baterai dan turbin angin.' },
        { time: '01:16', seconds: 76, speaker: 'Sarah Jenkins', text: 'Insentif pajak kini terhubung langsung dengan daftar pengawasan ekspor keamanan nasional.' },
        { time: '01:38', seconds: 98, speaker: 'Marcus Sterling', text: 'Penghitungan implementasi dimulai saat Presiden menandatangani undang-undang. Kami akan terus memantau aturan turunannya.' }
      ]
    },
    'pod-3': {
      title: 'Rahasia Capitol: Pemungutan Suara Tengah Malam',
      series: 'Di Balik Palu Sidang',
      hostRole: 'Kepala Biro Kongres',
      description: 'Di balik pintu tertutup menjelang tenggat penutupan anggaran: bagaimana koalisi Senat mengunci 74 suara penting.',
      topics: ['Anggaran Belanja', 'Resolusi Berkelanjutan', 'Hitungan Senat', 'Bantuan Bencana'],
      keyQuotes: 'Di balik perdebatan sengit di televisi, para legislator senior dengan tenang menyusun suara mayoritas lintas partai.',
      transcriptSample: [
        { time: '00:00', seconds: 0, speaker: 'Penyiar', text: 'Politics World Di Balik Palu Sidang. Episode 54: Rahasia Capitol bersama Julian Barnes.' },
        { time: '00:10', seconds: 10, speaker: 'Julian Barnes', text: 'Pukul 23.15 di bawah kubah Capitol ketika mosi penutupan perdebatan disetujui. Inilah proses tercapainya kompromi lintas partai.' },
        { time: '00:31', seconds: 31, speaker: 'Julian Barnes', text: 'Di ruang tertutup, negosiator mengamankan 74 suara Senat hanya tiga jam sebelum tenggat batas anggaran berakhir.' },
        { time: '00:53', seconds: 53, speaker: 'Julian Barnes', text: 'Kuncinya adalah memisahkan 16 miliar dolar dana bantuan banjir pertanian dari perdebatan pagu anggaran pertahanan.' },
        { time: '01:15', seconds: 75, speaker: 'Julian Barnes', text: 'Saat media menyiarkan ketegangan partai, para pemimpin komite menghitung suara demi suara secara cermat.' },
        { time: '01:36', seconds: 96, speaker: 'Julian Barnes', text: 'Dengan disahkannya resolusi, pemerintahan federal menyongsong tahun anggaran baru dengan stabil. Julian Barnes, Capitol.' }
      ]
    },
    'pod-4': {
      title: 'Warta Diplomatik: Kedaulatan Industri dan Strategi Negara',
      series: 'Tata Kelola Global',
      hostRole: 'Peneliti Senior & Mantan Asisten Menteri',
      description: 'Mengapa aliansi modern kini ditempa di kilang litium dan pabrik semikonduktor, bukan di ruang perjamuan diplomatik.',
      topics: ['Strategi Negara', 'Semikonduktor', 'Rantai Pasok Litium', 'Indo-Pasifik'],
      keyQuotes: 'Diplomasi tanpa ketahanan industri hanyalah sandiwara panggung belaka.',
      transcriptSample: [
        { time: '00:00', seconds: 0, speaker: 'Penyiar', text: 'Politics World Tata Kelola Global. Episode 39: Warta Diplomatik bersama Duta Besar Julian Richter.' },
        { time: '00:10', seconds: 10, speaker: 'Julian Richter', text: 'Di abad ke-21, bobot diplomasi tidak lagi diukur dari seremonial tanda tangan, tetapi dari produksi semikonduktor dan ketahanan energi.' },
        { time: '00:32', seconds: 32, speaker: 'Julian Richter', text: 'Kemitraan strategis dibangun di kilang litium, pabrik mikrocip, dan terminal peti kemas laut dalam.' },
        { time: '00:54', seconds: 54, speaker: 'Julian Richter', text: 'Pakta logistik Pasifik membuktikan bahwa kecepatan bongkar muat kontainer pelabuhan telah menjadi instrumen pencegahan geopolitik.' },
        { time: '01:16', seconds: 76, speaker: 'Julian Richter', text: 'Seusai pertemuan menteri ini, ingatlah: diplomasi tanpa kekuatan industri hanyalah retorika belaka. Terima kasih telah mendengarkan.' }
      ]
    }
  },
  pl: {
    'pod-1': {
      title: 'Poranny Raport Globalny: Brukselskie Porozumienie Celne',
      series: 'Codzienny Raport',
      hostRole: 'Główna Korespondentka Dyplomatyczna',
      description: 'Kulisy kompromisu G7 w Brukseli ws. subsydiów dla zielonych technologii, nocne manewry w Senacie USA i doktryna morska.',
      topics: ['Porozumienie G7', 'Głosowanie w Senacie', 'Limit Subsydiów', 'Logistyka Pacyfiku'],
      keyQuotes: 'Dwunastoprocentowy pułap subsydiów unieważnia dziesiątki sporów handlowych jeszcze przed świtem.',
      transcriptSample: [
        { time: '00:00', seconds: 0, speaker: 'Lektor', text: 'Politics World Codzienny Raport. Odcinek 142: Poranny Raport Globalny z Eleanor Vance.' },
        { time: '00:10', seconds: 10, speaker: 'Eleanor Vance', text: 'Dzień dobry z Waszyngtonu. Zaczynamy od zawartego przed świtem w Brukseli porozumienia między wysłannikami Białego Domu a UE.' },
        { time: '00:30', seconds: 30, speaker: 'Eleanor Vance', text: 'Po trzech dniach obrad za zamkniętymi drzwiami ustalono wspólny 12-procentowy limit subsydiów na czyste technologie i minerały krytyczne.' },
        { time: '00:52', seconds: 52, speaker: 'Marcus Sterling', text: 'Kluczowy przełom dotyczy reguł pochodzenia. Wzajemne uznawanie minerałów przetwarzanych u sojuszników natychmiast usuwa bariery logistyczne.' },
        { time: '01:14', seconds: 74, speaker: 'Eleanor Vance', text: 'Na Kapitolu przywódcy Senatu zapowiedzieli przyspieszone głosowanie ratyfikacyjne w czwartek, przewidując wyraźną większość.' },
        { time: '01:36', seconds: 96, speaker: 'Marcus Sterling', text: 'Członkowie Komisji Finansów Senatu potwierdzili, że ten kompromis skutecznie oddala groźbę ceł odwetowych przed końcem kwartału.' },
        { time: '01:58', seconds: 118, speaker: 'Eleanor Vance', text: 'Na rynkach finansowych obligacje skarbowe w Paryżu i Tokio natychmiast zyskały na wartości. Mówiła Eleanor Vance dla Politics World.' }
      ]
    },
    'pod-2': {
      title: 'Analiza Polityki 2026: Pakt Transatlantycki',
      series: 'Szczegółowa Analiza Legislacyjna',
      hostRole: 'Główni Analitycy ds. Legislacji i Handlu',
      description: 'Szczegółowa analiza Paktu Przemysłowego: arbitraż w Genewie, progi minerałów krytycznych oraz dynamika komisji Kongresu.',
      topics: ['Analiza Ustawowa', 'Arbitraż w Genewie', 'Komisja Finansów', 'Zielone Ulgi Podatkowe'],
      keyQuotes: 'Kiedy przepisy podatkowe łączą się z listami bezpieczeństwa narodowego, tradycyjny lobbing traci znaczenie.',
      transcriptSample: [
        { time: '00:00', seconds: 0, speaker: 'Lektor', text: 'Politics World Analiza Ustawowa. Odcinek 88: Analiza Polityki 2026 z Marcusem Sterlingiem i Sarah Jenkins.' },
        { time: '00:11', seconds: 11, speaker: 'Marcus Sterling', text: 'Witamy w Analizie Polityki. Dziś analizujemy punkt po punkcie 46 stron tekstu Transatlantyckiego Paktu Przemysłowego.' },
        { time: '00:32', seconds: 32, speaker: 'Sarah Jenkins', text: 'Zwróćcie uwagę na Rozdział Czwarty: powołuje panel arbitrażowy w Genewie z rygorystycznym 45-dniowym terminem orzekania.' },
        { time: '00:54', seconds: 54, speaker: 'Marcus Sterling', text: 'To natychmiast usuwa luki prawne, które przez lata blokowały inwestycje w fabryki baterii i morskie farmy wiatrowe.' },
        { time: '01:16', seconds: 76, speaker: 'Sarah Jenkins', text: 'Ulgi podatkowe są teraz ściśle powiązane z listami kontroli eksportu technologii podwójnego zastosowania.' },
        { time: '01:38', seconds: 98, speaker: 'Marcus Sterling', text: 'Odliczanie do wdrożenia rozpocznie się z chwilą podpisania ustawy przez Prezydenta. Będziemy uważnie śledzić rozporządzenia.' }
      ]
    },
    'pod-3': {
      title: 'Kulisy Kapitolu: Głosowanie o Północy',
      series: 'Za Kulisami Kongresu',
      hostRole: 'Szef Biura Parlamentarnego',
      description: 'Za zamkniętymi drzwiami tuż przed groźbą paraliżu rządu: jak ponadpartyjna koalicja Senatu zebrała 74 decydujące głosy.',
      topics: ['Budżet Federalny', 'Prowizorium', 'Układ Sił w Senacie', 'Pomoc Powodziowa'],
      keyQuotes: 'Z dala od kamer doświadczeni parlamentarzyści metodycznie budowali szeroką ponadpartyjną większość.',
      transcriptSample: [
        { time: '00:00', seconds: 0, speaker: 'Lektor', text: 'Politics World Za Kulisami Kongresu. Odcinek 54: Kulisy Kapitolu z Julianem Barnesem.' },
        { time: '00:10', seconds: 10, speaker: 'Julian Barnes', text: 'Była 23:15 pod rotundą Kapitolu, gdy kluczowy wniosek został przyjęty. Oto jak ukształtował się ponadpartyjny kompromis.' },
        { time: '00:31', seconds: 31, speaker: 'Julian Barnes', text: 'Za zamkniętymi drzwiami negocjatorzy zabezpieczyli 74 głosy w Senacie na zaledwie trzy godziny przed wygaśnięciem środków.' },
        { time: '00:53', seconds: 53, speaker: 'Julian Barnes', text: 'Kluczem było wyodrębnienie 16 miliardów dolarów na pomoc rolnikom i odłączenie jej od spornych wydatków na obronność.' },
        { time: '01:15', seconds: 75, speaker: 'Julian Barnes', text: 'Podczas gdy na schodach trwały polityczne spory, wewnątrz liderzy z żelazną dyscypliną sprawdzali każdy głos.' },
        { time: '01:36', seconds: 96, speaker: 'Julian Barnes', text: 'Dzięki podpisaniu ustawy prowizorium rząd wkracza w nowy rok budżetowy z pełną stabilnością. Julian Barnes, Kapitol.' }
      ]
    },
    'pod-4': {
      title: 'Raport Dyplomatyczny: Suwerenność Przemysłowa',
      series: 'Globalna Geopolityka',
      hostRole: 'Główny Analityk i Były Asystent Sekretarza Stanu',
      description: 'Dlaczego współczesne sojusze wykuwają się w rafineriach litu i fabrykach czipów, a nie w salach balowych.',
      topics: ['Geopolityka', 'Półprzewodniki', 'Łańcuchy Litu', 'Indo-Pacyfik'],
      keyQuotes: 'Dyplomacja bez zaplecza przemysłowego jest jedynie pustym teatrem.',
      transcriptSample: [
        { time: '00:00', seconds: 0, speaker: 'Lektor', text: 'Politics World Globalna Geopolityka. Odcinek 39: Raport Dyplomatyczny z Ambasadorem Julianem Richterem.' },
        { time: '00:10', seconds: 10, speaker: 'Julian Richter', text: 'W XXI wieku waga dyplomatyczna nie zależy od uroczystych traktatów, lecz od wolumenu produkcji półprzewodników i odporności sieci.' },
        { time: '00:32', seconds: 32, speaker: 'Julian Richter', text: 'Nowoczesne sojusze rodzą się w rafineriach litu, fabrykach mikroczipów i głębokowodnych terminalach kontenerowych.' },
        { time: '00:54', seconds: 54, speaker: 'Julian Richter', text: 'Nowy pakt logistyczny na Pacyfiku udowadnia, że tempo przeładunku w portach stało się realnym narzędziem odstraszania.' },
        { time: '01:16', seconds: 76, speaker: 'Julian Richter', text: 'Pamiętajmy o tej prawdzie: dyplomacja bez siły przemysłowej jest wyłącznie inscenizacją. Dziękuję za uwagę.' }
      ]
    }
  }
};
