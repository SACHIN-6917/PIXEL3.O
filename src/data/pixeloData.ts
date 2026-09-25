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

export interface CommitteeItem {
  role: string;
  members: string[];
}

export interface Coordinator {
  name: string;
  role: string;
  members?: string[];
  department?: string;
  titleBadge?: string;
  year?: string;
  phone?: string;
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
      'Team composition: Exactly 4 members per team',
      'Presentation slides must be brought in PPT/PDF format on a USB drive'
    ],
    teamSize: 'Team of 4',
    coordinators: 'Faculty & Student Technical Leads'
  },
  {
    id: 'ai-filmforge',
    number: '02',
    name: 'AI FILMFORGE',
    category: 'Technical Event',
    venue: 'MAIN CSE LAB',
    timing: '10:30 AM – 12:10 PM',
    description: 'Unleash next-generation generative AI, cinematic storytelling, and multimedia prompt engineering to architect creative short films and visual narratives.',
    rules: [
      'Participants will use approved Generative AI tools and creative workflows',
      'Theme will be unveiled at the commencement of the session',
      'Evaluation criteria: Narrative coherence, prompt mastery, visual fidelity, and audio-visual design',
      'Solo / Individual participation only'
    ],
    teamSize: 'Solo (1 Member)',
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
    teamSize: 'Team of 4',
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
    description: 'Simultaneous technical sessions: PaperQuest paper presentations in the Main Auditorium and AI FilmForge in the Main CSE Lab.',
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

export const STAFF_COMMITTEE: CommitteeItem[] = [
  { role: 'Convener', members: ['Mrs. P. Gajalakshmi'] },
  { role: 'Staff Coordinator', members: ['Mr. K. Chairmadhurai'] },
  { role: 'Treasurer', members: ['Mr. G. Sekar'] },
  { role: 'Event & Technical Coordinator', members: ['Mrs. M. Padmapriya'] },
  { role: 'Technical Events', members: ['Mrs. M. Padmapriya'] },
  { role: 'Non-Technical Events', members: ['Ms. Kavitha'] },
  { role: 'Registration & Payment', members: ['Ms. S. Swetha', 'Mrs. S. Swathy'] },
  { role: 'Design, Décor & Reception', members: ['Ms. Jayanthi', 'Ms. Sangavi', 'Ms. Rubini'] },
  { role: 'Guest Lunch & Hospitality', members: ['Mrs. V. Thamaraiselvi', 'Ms. D. Teena'] },
  { role: 'Food Committee', members: ['Mr. G. Srinivasan', 'Mr. A. Arunachalam'] },
  { role: 'Social Media & Promotion', members: ['Mr. M. Sudhashan'] },
  { role: 'Photography', members: ['Mr. R. Prasanna'] },
  { role: 'Certificate, Prize & Memento Committee', members: ['Ms. Sumitra'] }
];

export const STUDENT_LEADERSHIP: CommitteeItem[] = [
  { role: 'President',       members: ['Mr. Sachin'] },
  { role: 'Treasurer',       members: ['Ms. Shajitha'] },
  { role: 'Vice President',  members: ['Ms. Padmapriya'] },
  { role: 'Secretary',       members: ['Mr. Sathish Kumar'] },
  { role: 'Joint Secretary', members: ['Mr. Bharath'] },
];

export const STUDENT_COMMITTEE: CommitteeItem[] = [
  { role: 'Event Management Committee', members: ['Ms. Padamapriya', 'Mr. Sathish Kumar'] },
  { role: 'Technical Committee', members: ['Mr. Gokul Kumar P'] },
  { role: 'Non-Technical Committee', members: ['Mr. Mohanraj K'] },
  { role: 'Registration Committee', members: ['Mr. Sairam R'] },
  { role: 'Food Committee', members: ['Mr. Abu Bakkar Siddiq Raja'] },
  { role: 'Certificate Committee', members: ['Mr. Vishnu Prasath'] },
  { role: 'Treasurer', members: ['Ms. Shajitha'] },
  { role: 'Social Media Committee', members: ['Mr. Ajai Adhithiyan'] },
  { role: 'Graphic Design Committee', members: ['Mr. Sriram'] },
  { role: 'Reception Committee', members: ['Ms. Rajakumari'] },
  { role: 'Prize & Memento Committee', members: ['Mr. Sanjaikumar', 'Mr. Kiranraj'] },
  { role: 'Photography Committee', members: ['Mr. Dhilip'] },
  { role: 'Stage & Saami Committee', members: ['Ms. Harini'] },
  { role: 'Design & Decoration Committee', members: ['Ms. Lavanya'] },
  { role: 'Outreach Committee', members: ['Mr. Pranav Kumaran'] },
  { role: 'Discipline Committee', members: ['Mr. Bharath'] },
  { role: 'Banner Committee', members: ['Mr. Kalaiyarasan'] }
];

export interface EventCoordinatorGroup {
  event: string;
  category: 'Technical' | 'Non-Technical';
  coordinators: string[];
}

export const EVENT_COORDINATORS: EventCoordinatorGroup[] = [
  {
    event: 'PAPERQUEST',
    category: 'Technical',
    coordinators: ['Ms. Duragadevi', 'Ms. Cathrine'],
  },
  {
    event: 'AI FILMFORGE',
    category: 'Technical',
    coordinators: ['Ms. Ragavi', 'Ms. Shiyamala'],
  },
  {
    event: 'CHECKMATE',
    category: 'Non-Technical',
    coordinators: ['Mr. Gokul Raju', 'Mr. Anandh', 'Mr. Surendar'],
  },
  {
    event: 'MINE RELAY',
    category: 'Non-Technical',
    coordinators: ['Ms. Yuvashree', 'Ms. Vijayalakshmi'],
  },
];

export const STAFF_COORDINATORS: Coordinator[] = STAFF_COMMITTEE.map((item) => ({
  name: item.members.join(', '),
  role: item.role,
  members: item.members,
  department: 'Adhiparasakthi Engineering College',
  titleBadge: 'Staff Committee'
}));

export const STUDENT_COORDINATORS: Coordinator[] = STUDENT_COMMITTEE.map((item) => ({
  name: item.members.join(', '),
  role: item.role,
  members: item.members,
  department: 'Dept. of CSE',
  titleBadge: 'Student Committee'
}));

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
        venueName: 'Main CSE Lab',
        floor: 'First Floor, CSE Department Wing',
        capacity: 'High-Performance Workstations · AI/Generative Tools Lab',
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
export const WHATSAPP_GROUP_LINK = 'https://chat.whatsapp.com/EcA1kG8VThJFx58Qmr2l1v';
