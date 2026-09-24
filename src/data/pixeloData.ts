export interface PixeloEvent {
  id: string;
  number: string;
  name: string;
  category: 'Technical Event' | 'Non-Technical Event';
  venue: string;
  timing: string;
  description: string;
  rules: string[];
  teamSize: string;
  coordinators: string;
}

export interface AgendaItem {
  time: string;
  title: string;
  subtitle?: string;
  description?: string;
  badge?: string;
  highlight?: boolean;
}

export interface Coordinator {
  name: string;
  role: string;
  department?: string;
  titleBadge?: string;
}

export const CONFIRMED_EVENTS: PixeloEvent[] = [
  {
    id: 'paperquest',
    number: '01',
    name: 'PAPERQUEST',
    category: 'Technical Event',
    venue: 'MAIN AUDITORIUM',
    timing: '10:30 AM – 12:10 PM',
    description: 'A prestigious technical paper presentation symposium arena to showcase novel research, analytical insights, and engineering breakthroughs before expert evaluators.',
    rules: [
      'Presentation duration: 8 mins presentation + 2 mins Q&A',
      'Topics cover AI/ML, Cloud Computing, Cyber Security, IoT, and Emerging Technologies',
      'Team composition: 1 to 3 members per team',
      'Presentation slides must be brought in PPT/PDF format on a USB drive'
    ],
    teamSize: '1 – 3 Members',
    coordinators: 'Faculty & Student Technical Leads'
  },
  {
    id: 'ai-filmforge',
    number: '02',
    name: 'AI FILMFORGE',
    category: 'Technical Event',
    venue: 'MM LAB',
    timing: '10:30 AM – 12:10 PM',
    description: 'Unleash next-generation generative AI, cinematic storytelling, and multimedia prompt engineering to architect creative short films and visual narratives.',
    rules: [
      'Participants will use approved Generative AI tools and creative workflows',
      'Theme will be unveiled at the commencement of the session',
      'Evaluation criteria: Narrative coherence, prompt mastery, visual fidelity, and audio-visual design',
      'Individual or team of 2 participants allowed'
    ],
    teamSize: '1 – 2 Members',
    coordinators: 'Multimedia & AI Lab Team'
  },
  {
    id: 'checkmate',
    number: '03',
    name: 'CHECKMATE',
    category: 'Non-Technical Event',
    venue: 'MAIN CSE LAB',
    timing: '01:40 PM – 03:30 PM',
    description: 'The ultimate battle of intellect, tactical calculation, and foresight on the 64-square battlefield. Compete in high-stakes blitz and rapid matches.',
    rules: [
      'Standard FIDE rapid / blitz time controls apply',
      'Knockout tournament bracket structure',
      'Electronic devices and external assistance are strictly prohibited',
      'Decisions made by tournament arbiters are final'
    ],
    teamSize: 'Individual Participation',
    coordinators: 'Chess & Strategy Arena Leads'
  },
  {
    id: 'mine-relay',
    number: '04',
    name: 'MINE RELAY',
    category: 'Non-Technical Event',
    venue: 'AUDITORIUM',
    timing: '01:40 PM – 03:30 PM',
    description: 'An electrifying team relay combining rapid logical deciphering, blindfolded trust navigations, and puzzle-solving coordination under ticking clock pressure.',
    rules: [
      'Fast-paced multi-stage relay format with timed obstacles and puzzle checkpoints',
      'Teams must communicate strictly following relay protocol',
      'Penalty seconds added for missed obstacles or step violations',
      'Dynamic fun, coordination, and team synergy'
    ],
    teamSize: '2 – 4 Members',
    coordinators: 'Event Experience Crew'
  }
];

export const AGENDA_ITEMS: AgendaItem[] = [
  {
    time: '09:00 AM',
    title: 'REGISTRATION & CHECK-IN',
    subtitle: 'Welcome Desk & Badge Collection',
    description: 'Verification of digital registration IDs, symposium kit distribution, and participant orientation.',
    badge: 'Reporting'
  },
  {
    time: '09:30 AM',
    title: 'INAUGURATION',
    subtitle: 'Main Auditorium',
    description: 'Ceremonial lamp lighting, presidential address by dignitaries, keynote speech, and official unveiling of PIXELO 3.O.',
    badge: 'Ceremony',
    highlight: true
  },
  {
    time: '10:30 AM – 12:10 PM',
    title: 'TECHNICAL EVENTS',
    subtitle: 'PaperQuest · AI FilmForge',
    description: 'Simultaneous technical sessions: PaperQuest paper presentations in the Main Auditorium and AI FilmForge in the MM Lab.',
    badge: 'Morning Session'
  },
  {
    time: '12:20 PM – 01:20 PM',
    title: 'LUNCH BREAK',
    subtitle: 'College Canteen',
    description: 'Delightful Vegetarian Food + Refreshments provided to all registered participants and faculty mentors.',
    badge: 'Hospitality'
  },
  {
    time: '01:40 PM – 03:30 PM',
    title: 'NON-TECHNICAL EVENTS',
    subtitle: 'Checkmate · Mine Relay',
    description: 'High-energy afternoon arena: Checkmate chess battles in Main CSE Lab and thrilling Mine Relay in Auditorium.',
    badge: 'Afternoon Session'
  },
  {
    time: '03:30 PM – 04:20 PM',
    title: 'VALEDICTORY & PRIZE DISTRIBUTION',
    subtitle: 'Main Auditorium',
    description: 'Announcement of winners, distribution of cash awards, trophies, merit honors, and participation certificates.',
    badge: 'Grand Finale',
    highlight: true
  }
];

export const STAFF_COORDINATORS: Coordinator[] = [
  {
    name: 'Dr. C. Dhaya',
    role: 'HOD / CSE',
    department: 'Department of Computer Science and Engineering',
    titleBadge: 'Head of Department'
  },
  {
    name: 'Mrs. P. Gajalakshmi',
    role: 'CONVENER',
    department: 'Assistant Professor / CSE',
    titleBadge: 'Convener'
  },
  {
    name: 'Mr. K. Chaitramuthurai',
    role: 'STAFF COORDINATOR',
    department: 'Assistant Professor / CSE',
    titleBadge: 'Staff Coordinator'
  },
  {
    name: 'Dr. A. Bhuwaneswari',
    role: 'VICE PRINCIPAL',
    department: 'Adhiparasakthi Engineering College',
    titleBadge: 'Vice Principal'
  },
  {
    name: 'Dr. V. Ramasamy',
    role: 'DEAN',
    department: 'Adhiparasakthi Engineering College',
    titleBadge: 'Dean'
  },
  {
    name: 'Dr. J. Raja',
    role: 'PRINCIPAL',
    department: 'Adhiparasakthi Engineering College',
    titleBadge: 'Principal'
  }
];

export const STUDENT_COORDINATORS: Coordinator[] = [
  {
    name: 'Ms. SACHIN',
    role: 'PRESIDENT',
    department: 'CSE Final Year',
    titleBadge: 'President'
  },
  {
    name: 'Ms. SHAJITHA K.',
    role: 'TREASURER',
    department: 'CSE Final Year',
    titleBadge: 'Treasurer'
  },
  {
    name: 'Ms. Padmapriya S.',
    role: 'VICE PRESIDENT',
    department: 'CSE Final Year',
    titleBadge: 'Vice President'
  },
  {
    name: 'Ms. SATHISH Kumar S.',
    role: 'SECRETARY',
    department: 'CSE Final Year',
    titleBadge: 'Secretary'
  },
  {
    name: 'Mr. Bharath S.',
    role: 'JOINT SECRETARY',
    department: 'CSE Third Year',
    titleBadge: 'Joint Secretary'
  }
];

export const VENUES_DATA = [
  {
    session: 'MORNING SESSIONS (10:30 AM – 12:10 PM)',
    venues: [
      {
        eventName: 'PAPERQUEST',
        category: 'Technical Event',
        venueName: 'Main Auditorium',
        floor: 'Ground Floor, Admin Block',
        capacity: '400+ Seating · Audio/Visual Presentation Facility',
        icon: 'Presentation'
      },
      {
        eventName: 'AI FILMFORGE',
        category: 'Technical Event',
        venueName: 'MM Lab (Multimedia Lab)',
        floor: 'Second Floor, IT/CSE Wing',
        capacity: 'High-Performance Workstations & GPU Cluster',
        icon: 'Video'
      }
    ]
  },
  {
    session: 'AFTERNOON SESSIONS (01:40 PM – 03:30 PM)',
    venues: [
      {
        eventName: 'CHECKMATE',
        category: 'Non-Technical Event',
        venueName: 'Main CSE Lab',
        floor: 'First Floor, CSE Department',
        capacity: 'Climatic Tournament Arena · Digital Match Boards',
        icon: 'Swords'
      },
      {
        eventName: 'MINE RELAY',
        category: 'Non-Technical Event',
        venueName: 'Auditorium',
        floor: 'Ground Floor, Main Campus Arena',
        capacity: 'Dynamic Obstacle Course & Relay Track',
        icon: 'Zap'
      }
    ]
  }
];

export const EXPERIENCE_PERKS = [
  {
    title: 'VEGETARIAN FOOD',
    description: 'Delicious, hygienic vegetarian lunch will be provided to all registered participants and mentors.',
    icon: 'UtensilsCrossed'
  },
  {
    title: 'REFRESHMENTS',
    description: 'Morning and evening high-energy refreshments and beverages will be served throughout the day.',
    icon: 'Coffee'
  },
  {
    title: 'PRIZES & CASH REWARDS',
    description: 'Winners of all technical & non-technical arenas will receive awards, certificates, and recognition.',
    icon: 'Trophy'
  },
  {
    title: 'PARTICIPATION CERTIFICATE',
    description: 'Every registered attendee will be awarded an official verified symposium participation certificate.',
    icon: 'Award'
  }
];

export const WHAT_AWAITS_YOU = [
  {
    title: 'TECHNICAL EVENTS',
    description: 'Challenge your technical knowledge and problem-solving skills across cutting-edge frontiers.',
    icon: 'Cpu'
  },
  {
    title: 'INNOVATION',
    description: 'Transform disruptive ideas into practical, real-world solutions that inspire change.',
    icon: 'Lightbulb'
  },
  {
    title: 'COMPETITION',
    description: 'Showcase your skills and compete with brilliant minds from across colleges nationwide.',
    icon: 'Trophy'
  },
  {
    title: 'EXPERIENCE',
    description: 'Learn, connect, celebrate teamwork, and forge lifelong connections in an inspiring festival of tech.',
    icon: 'Sparkles'
  }
];

export const REGISTRATION_DEADLINE = '2026-10-13T22:00:00';
export const EVENT_DATE_STRING = '14 OCTOBER 2026';
export const REPORTING_TIME = '09:00 AM';
export const VENUE_COLLEGE = 'Adhiparasakthi Engineering College, Melmaruvathur';
export const WHATSAPP_GROUP_LINK = 'https://chat.whatsapp.com/pixelo3-symposium-official';
