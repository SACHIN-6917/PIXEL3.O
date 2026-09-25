import React, { useEffect, useState } from 'react';
import {
  Cpu,
  Film,
  Swords,
  Zap,
  MapPin,
  Users,
  CheckCircle2,
  Calendar,
  Clock,
  Award
} from 'lucide-react';
import { fetchAllRegistrations, RegistrationRecord } from '../../lib/googleSheet';
import { useAdminAuth } from '../AdminAuthContext';

export const AdminEventsPage: React.FC = () => {
  const { token } = useAdminAuth();
  const [registrations, setRegistrations] = useState<RegistrationRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchAllRegistrations(token || '');
        setRegistrations(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [token]);

  // Participation counts
  const paperQuestCount = registrations.filter(r => r.techEvent === 'PAPERQUEST').length;
  const filmForgeCount = registrations.filter(r => r.techEvent === 'AI FILMFORGE').length;
  const checkmateCount = registrations.filter(r => r.nonTechEvent === 'CHECKMATE').length;
  const mineRelayCount = registrations.filter(r => r.nonTechEvent === 'MINE RELAY').length;

  const EVENTS = [
    {
      id: 'paperquest',
      name: 'PAPERQUEST',
      category: 'Technical',
      participation: 'EXACTLY 4 MEMBERS',
      venue: 'Main Auditorium',
      timing: '10:30 AM – 12:10 PM',
      icon: Cpu,
      color: 'border-orange-500/30 text-[#FF6A00] bg-orange-50/20',
      tagColor: 'bg-orange-50 text-[#FF6A00] border-orange-200',
      registeredTeams: paperQuestCount,
      estimatedParticipants: paperQuestCount * 4,
      rules: [
        'Team composition: Exactly 4 members per team (Strict Rule)',
        'Presentation duration: 8 mins presentation + 2 mins Q&A',
        'Topics: AI/ML, Cloud Computing, Cyber Security, IoT, and Emerging Technologies',
        'Presentation slides must be brought in PPT/PDF on a USB drive',
      ],
    },
    {
      id: 'ai-filmforge',
      name: 'AI FILMFORGE',
      category: 'Technical',
      participation: 'EXACTLY 1 MEMBER (Solo)',
      venue: 'Main CSE Lab',
      timing: '10:30 AM – 12:10 PM',
      icon: Film,
      color: 'border-blue-500/30 text-blue-600 bg-blue-50/20',
      tagColor: 'bg-blue-50 text-blue-600 border-blue-200',
      registeredTeams: filmForgeCount,
      estimatedParticipants: filmForgeCount * 1,
      rules: [
        'Solo / Individual participation only (Strict Rule)',
        'Participants will use approved Generative AI tools and creative workflows',
        'Theme will be unveiled at the commencement of the session',
        'Evaluation: Narrative coherence, prompt mastery, visual fidelity, and audio-visual design',
      ],
    },
    {
      id: 'checkmate',
      name: 'CHECKMATE',
      category: 'Non-Technical',
      participation: 'EXACTLY 1 MEMBER (Solo)',
      venue: 'Main CSE Lab',
      timing: '01:40 PM – 03:30 PM',
      icon: Swords,
      color: 'border-emerald-500/30 text-emerald-600 bg-emerald-50/20',
      tagColor: 'bg-emerald-50 text-emerald-600 border-emerald-200',
      registeredTeams: checkmateCount,
      estimatedParticipants: checkmateCount * 1,
      rules: [
        'Solo / Individual participation only (Strict Rule)',
        'Standard rapid / blitz time controls apply with knockout tournament bracket',
        'Electronic devices and external assistance are strictly prohibited',
        'Decisions made by tournament arbiters are final',
      ],
    },
    {
      id: 'mine-relay',
      name: 'MINE RELAY',
      category: 'Non-Technical',
      participation: 'EXACTLY 4 MEMBERS',
      venue: 'Auditorium',
      timing: '01:40 PM – 03:30 PM',
      icon: Zap,
      color: 'border-purple-500/30 text-purple-600 bg-purple-50/20',
      tagColor: 'bg-purple-50 text-purple-600 border-purple-200',
      registeredTeams: mineRelayCount,
      estimatedParticipants: mineRelayCount * 4,
      rules: [
        'Team composition: Exactly 4 members per team (Strict Rule)',
        'Fast-paced multi-stage relay format with timed obstacles and puzzle checkpoints',
        'Penalty seconds added for missed obstacles or step violations',
        'Dynamic fun, logical coordination, and team synergy',
      ],
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">CONFIRMED EVENTS & QUOTAS</h1>
        <p className="text-xs text-gray-500 font-medium mt-0.5">
          Strictly four authorized symposium arenas (Old events CODESPRINT and KITTY PARTY 101 are disabled)
        </p>
      </div>

      {/* Grid of the 4 events */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {EVENTS.map(event => {
          const Icon = event.icon;
          return (
            <div
              key={event.id}
              className="bg-white rounded-3xl border border-gray-200/80 shadow-2xs p-6 space-y-4 relative overflow-hidden"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${event.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-extrabold text-gray-900 tracking-tight">{event.name}</h3>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${event.tagColor}`}>
                        {event.category}
                      </span>
                      <span className="text-xs font-semibold text-gray-600">
                        {event.participation}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats pill */}
              <div className="grid grid-cols-2 gap-3 p-3.5 rounded-2xl bg-gray-50/80 border border-gray-100 text-xs">
                <div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                    {event.category === 'Technical' && event.participation.includes('Solo') ? 'Registered Solos' : 'Registered Teams'}
                  </span>
                  <span className="text-lg font-extrabold text-gray-900">
                    {loading ? '—' : event.registeredTeams}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                    Est. Headcount
                  </span>
                  <span className="text-lg font-extrabold text-gray-900">
                    {loading ? '—' : event.estimatedParticipants}
                  </span>
                </div>
              </div>

              {/* Venue & Timings */}
              <div className="space-y-1.5 text-xs text-gray-600">
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-gray-400" />
                  <span>Venue: <strong>{event.venue}</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-gray-400" />
                  <span>Timing: <strong>{event.timing}</strong></span>
                </div>
              </div>

              {/* Rules list */}
              <div className="pt-2 border-t border-gray-100">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-2">
                  Event Rules & Team Constraints
                </span>
                <ul className="space-y-1.5 text-xs text-gray-600">
                  {event.rules.map((r, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{r}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
