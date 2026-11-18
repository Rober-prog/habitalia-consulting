export type Lang = 'ca' | 'es';
export type Page =
  'home' | 'studio' | 'services' | 'contact' | 'legal' | 'privacy' | 'cookies';
export const languages: Lang[] = ['ca', 'es'];
export const slugs: Record<Lang, Record<Page, string>> = {
  ca: {
    home: '',
    studio: 'el-despatx',
    services: 'serveis',
    contact: 'contacte',
    legal: 'avis-legal',
    privacy: 'privacitat',
    cookies: 'cookies',
  },
  es: {
    home: '',
    studio: 'el-despacho',
    services: 'servicios',
    contact: 'contacto',
    legal: 'aviso-legal',
    privacy: 'privacidad',
    cookies: 'cookies',
  },
};
export const withBase = (path = '/') =>
  `${(import.meta.env?.BASE_URL ?? '/').replace(/\/$/, '')}/${path.replace(/^\//, '')}`;
export const href = (lang: Lang, page: Page = 'home') =>
  withBase(`/${lang}/${slugs[lang][page] ? `${slugs[lang][page]}/` : ''}`);
export const ui = {
  ca: {
    nav: {
      home: 'Inici',
      studio: 'Qui som',
      services: 'Serveis',
      contact: 'Contacte',
      legal: 'Avís legal',
      privacy: 'Privacitat',
      cookies: 'Cookies',
    },
    skip: 'Salta al contingut',
    menu: 'Menú',
    language: 'Idioma',
    preview: 'Versió de treball',
    pending: 'Continguts pendents de validació. Sense enviament de dades.',
    eyebrow: 'Arquitectura · Consultoria · Gestió',
    title: 'Una mirada tècnica.',
    titleAccent: 'Una visió de conjunt.',
    intro:
      'Arquitectura i gestió de l’edificació. Un espai per entendre cada necessitat i definir el següent pas amb criteri.',
    discover: 'Coneix el despatx',
    explore: 'Explora els àmbits de treball',
    drawing:
      'Estudi de volum · il·lustració conceptual, no correspon a una obra real',
    approach: '01 / La nostra mirada',
    approachTitle: 'Entendre abans de construir.',
    approachText:
      'Cada obra planteja preguntes diferents. La proposta de treball parteix de l’escolta, l’anàlisi tècnica i una planificació comprensible.',
    servicesLabel: '02 / Àmbits de treball',
    servicesTitle: 'Criteri tècnic en cada etapa.',
    servicesIntro:
      'Sis àmbits complementaris que reuneixen dotze serveis d’arquitectura, construcció i gestió. Troba el punt de partida per a la teva consulta.',
    categoryLabel: 'Àmbits d’especialització',
    includedServices: 'Serveis inclosos',
    viewCategory: 'Explora la categoria',
    exploreCategories: 'Altres categories',
    conceptArt:
      'Il·lustracions conceptuals. No representen projectes ni obres realitzades per Habitalia.',
    imagePending: 'Il·lustració conceptual pendent de generar',
    legacyTitle: 'Fitxa anterior · contingut provisional',
    legacyNotice:
      'Aquesta fitxa es conserva per mantenir els enllaços anteriors. No forma part de les sis categories corporatives actuals ni confirma la disponibilitat d’aquest servei. Consulta el catàleg actual per orientar la teva consulta.',
    allServices: 'Veure tots els àmbits',
    pendingService: 'Servei proposat · pendent de confirmació',
    read: 'Explora aquest àmbit',
    processLabel: '03 / Metodologia proposada',
    processTitle: 'De la primera pregunta al següent pas.',
    steps: [
      ['Escoltar', 'Entendre la necessitat, el context i els objectius.'],
      [
        'Analitzar',
        'Revisar la informació disponible i identificar què cal estudiar.',
      ],
      ['Planificar', 'Definir l’abast i acordar els següents passos.'],
    ],
    ctaEyebrow: 'Comencem per una conversa',
    ctaTitle: 'Què necessita el teu edifici?',
    ctaText:
      'Explica’ns el punt de partida. Escriu-nos o truca’ns per comentar la teva consulta i valorar el següent pas.',
    cta: 'Anar a contacte',
    studioTitle: 'Salvador Oliver i Juvé · Arquitecte tècnic',
    studioText:
      'Coneix l’equip de Habitalia Consulting, liderat per Salvador Oliver i Juvé, arquitecte tècnic amb més de 25 anys d’experiència professional.',
    contactTitle: 'Parlem del següent pas.',
    contactIntro:
      'Ens trobaràs a Vilafranca del Penedès. Escriu-nos o truca’ns per parlar de la teva consulta.',
    address: 'Adreça',
    emailLabel: 'Correu electrònic',
    phoneLabel: 'Telèfon',
    locationLabel: 'El nostre despatx',
    mapTitle: 'Habitalia Consulting a Vilafranca del Penedès',
    mapDescription:
      'Mapa de l’entorn del carrer d’Amàlia Soler amb el número 1 assenyalat en vermell.',
    openMap: 'Obrir a Google Maps',
    mapData: 'Dades del mapa',
    formTitle: 'Prepara la teva consulta',
    formDisabled:
      'Formulari no disponible fins a validar el responsable, la privacitat i el servei d’enviament.',
    name: 'Nom',
    email: 'Correu electrònic',
    message: 'En què et podem ajudar?',
    consent:
      'He llegit la informació de privacitat i accepto el tractament per respondre la consulta.',
    send: 'Enviament pendent d’activació',
    legalTitle: 'Informació legal',
    legalText:
      'Habitalia Consulting ofereix informació sobre els seus serveis d’arquitectura tècnica, consultoria i gestió de projectes. Per a qualsevol consulta sobre aquesta web, pots escriure a info@habitaliaconsulting.com o trucar al 93 892 36 92.',
    privacyTitle: 'Privacitat',
    privacyText:
      'Aquesta web no recull dades mitjançant formularis ni utilitza eines d’analítica. Els botons de correu i telèfon obren l’aplicació del teu dispositiu. El mapa es mostra sense connectar amb serveis externs; Google Maps s’obre només quan prems el seu enllaç. Per a consultes sobre privacitat, escriu a info@habitaliaconsulting.com.',
    cookiesTitle: 'Cookies i preferències',
    cookiesText:
      'Aquesta versió no configura cookies ni analítica. El mapa es genera amb dades cartogràfiques desades en aquesta web, sense carregar serveis de tercers. Els enllaços externs només s’obren quan els actives. El selector d’idioma no guarda dades al navegador. Cal revisar aquesta informació si s’incorporen nous serveis.',
    provisional: 'Proposta editorial · pendent d’aprovació',
    scope: 'Abast orientatiu',
    audience: 'A qui s’adreça',
    documents: 'Informació per a una primera revisió',
    process: 'Procés proposat',
    faq: 'Preguntes inicials',
    faqQ: 'Es pot contractar aquest servei ara?',
    faqA: 'La disponibilitat i l’abast encara no s’han confirmat. Aquesta fitxa és una proposta editorial i no constitueix una oferta de servei.',
    back: 'Tornar als àmbits de treball',
    footerLine: 'Arquitectura, amb perspectiva.',
    rights: 'Tots els drets reservats.',
  },
  es: {
    nav: {
      home: 'Inicio',
      studio: 'Quiénes somos',
      services: 'Servicios',
      contact: 'Contacto',
      legal: 'Aviso legal',
      privacy: 'Privacidad',
      cookies: 'Cookies',
    },
    skip: 'Saltar al contenido',
    menu: 'Menú',
    language: 'Idioma',
    preview: 'Versión de trabajo',
    pending: 'Contenidos pendientes de validación. Sin envío de datos.',
    eyebrow: 'Arquitectura · Consultoría · Gestión',
    title: 'Una mirada técnica.',
    titleAccent: 'Una visión de conjunto.',
    intro:
      'Arquitectura y gestión de la edificación. Un espacio para entender cada necesidad y definir el siguiente paso con criterio.',
    discover: 'Conoce el despacho',
    explore: 'Explora los ámbitos de trabajo',
    drawing:
      'Estudio de volumen · ilustración conceptual, no corresponde a una obra real',
    approach: '01 / Nuestra mirada',
    approachTitle: 'Entender antes de construir.',
    approachText:
      'Cada obra plantea preguntas diferentes. La propuesta de trabajo parte de la escucha, el análisis técnico y una planificación comprensible.',
    servicesLabel: '02 / Ámbitos de trabajo',
    servicesTitle: 'Criterio técnico en cada etapa.',
    servicesIntro:
      'Seis ámbitos complementarios que reúnen doce servicios de arquitectura, construcción y gestión. Encuentra el punto de partida para tu consulta.',
    categoryLabel: 'Ámbitos de especialización',
    includedServices: 'Servicios incluidos',
    viewCategory: 'Explora la categoría',
    exploreCategories: 'Otras categorías',
    conceptArt:
      'Ilustraciones conceptuales. No representan proyectos ni obras realizadas por Habitalia.',
    imagePending: 'Ilustración conceptual pendiente de generar',
    legacyTitle: 'Ficha anterior · contenido provisional',
    legacyNotice:
      'Esta ficha se conserva para mantener los enlaces anteriores. No forma parte de las seis categorías corporativas actuales ni confirma la disponibilidad de este servicio. Consulta el catálogo actual para orientar tu consulta.',
    allServices: 'Ver todos los ámbitos',
    pendingService: 'Servicio propuesto · pendiente de confirmación',
    read: 'Explora este ámbito',
    processLabel: '03 / Metodología propuesta',
    processTitle: 'De la primera pregunta al siguiente paso.',
    steps: [
      ['Escuchar', 'Entender la necesidad, el contexto y los objetivos.'],
      [
        'Analizar',
        'Revisar la información disponible e identificar qué conviene estudiar.',
      ],
      ['Planificar', 'Definir el alcance y acordar los siguientes pasos.'],
    ],
    ctaEyebrow: 'Empecemos por una conversación',
    ctaTitle: '¿Qué necesita tu edificio?',
    ctaText:
      'Cuéntanos el punto de partida. Escríbenos o llámanos para comentar tu consulta y valorar el siguiente paso.',
    cta: 'Ir a contacto',
    studioTitle: 'Salvador Oliver i Juvé · Arquitecto técnico',
    studioText:
      'Conoce al equipo de Habitalia Consulting, liderado por Salvador Oliver i Juvé, arquitecto técnico con más de 25 años de experiencia profesional.',
    contactTitle: 'Hablemos del siguiente paso.',
    contactIntro:
      'Nos encontrarás en Vilafranca del Penedès. Escríbenos o llámanos para hablar de tu consulta.',
    address: 'Dirección',
    emailLabel: 'Correo electrónico',
    phoneLabel: 'Teléfono',
    locationLabel: 'Nuestro despacho',
    mapTitle: 'Habitalia Consulting en Vilafranca del Penedès',
    mapDescription:
      'Mapa del entorno de la calle Amalia Soler con el número 1 señalado en rojo.',
    openMap: 'Abrir en Google Maps',
    mapData: 'Datos del mapa',
    formTitle: 'Prepara tu consulta',
    formDisabled:
      'Formulario no disponible hasta validar el responsable, la privacidad y el servicio de envío.',
    name: 'Nombre',
    email: 'Correo electrónico',
    message: '¿En qué podemos ayudarte?',
    consent:
      'He leído la información de privacidad y acepto el tratamiento para responder la consulta.',
    send: 'Envío pendiente de activación',
    legalTitle: 'Información legal',
    legalText:
      'Habitalia Consulting ofrece información sobre sus servicios de arquitectura técnica, consultoría y gestión de proyectos. Para cualquier consulta sobre esta web, puedes escribir a info@habitaliaconsulting.com o llamar al 93 892 36 92.',
    privacyTitle: 'Privacidad',
    privacyText:
      'Esta web no recoge datos mediante formularios ni utiliza herramientas de analítica. Los botones de correo y teléfono abren la aplicación de tu dispositivo. El mapa se muestra sin conectar con servicios externos; Google Maps se abre solo cuando pulsas su enlace. Para consultas sobre privacidad, escribe a info@habitaliaconsulting.com.',
    cookiesTitle: 'Cookies y preferencias',
    cookiesText:
      'Esta versión no configura cookies ni analítica. El mapa se genera con datos cartográficos guardados en esta web, sin cargar servicios de terceros. Los enlaces externos solo se abren cuando los activas. El selector de idioma no guarda datos en el navegador. Hay que revisar esta información si se incorporan nuevos servicios.',
    provisional: 'Propuesta editorial · pendiente de aprobación',
    scope: 'Alcance orientativo',
    audience: 'A quién se dirige',
    documents: 'Información para una primera revisión',
    process: 'Proceso propuesto',
    faq: 'Preguntas iniciales',
    faqQ: '¿Se puede contratar este servicio ahora?',
    faqA: 'La disponibilidad y el alcance todavía no se han confirmado. Esta ficha es una propuesta editorial y no constituye una oferta de servicio.',
    back: 'Volver a los ámbitos de trabajo',
    footerLine: 'Arquitectura, con perspectiva.',
    rights: 'Todos los derechos reservados.',
  },
} as const;
