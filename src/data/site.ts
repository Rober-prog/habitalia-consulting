export const site = {
  name: 'Habitalia Consulting',
  claim: 'Solucions en arquitectura & management',
  indexable: false,
  // Contact details explicitly supplied by the owner.
  contact: {
    street: {
      es: 'Calle Amalia Soler 1, Bajos',
      ca: 'Carrer d’Amàlia Soler 1, baixos',
    },
    postalCode: '08720',
    city: 'Vilafranca del Penedès',
    province: 'Barcelona',
    country: { es: 'España', ca: 'Espanya' },
    email: 'info@habitaliaconsulting.com',
    emailHref:
      'mailto:info@habitaliaconsulting.com?subject=WEB%20HABITALIA%20CONSULTING',
    phone: '93 892 36 92',
    phoneHref: 'tel:+34938923692',
    latitude: 41.3438246,
    longitude: 1.7016493,
    mapHref:
      'https://www.google.com/maps/search/?api=1&query=41.3438246%2C1.7016493',
  },
  // Name and role supplied by the owner for the About page.
  person: {
    name: {
      ca: 'Salvador Oliver i Juvé',
      es: 'Salvador Oliver i Juvé',
    },
    role: {
      ca: 'Arquitecte tècnic, fundador i màxim responsable de Habitalia Consulting',
      es: 'Arquitecto técnico, fundador y máximo responsable de Habitalia Consulting',
    },
  },
} as const;
