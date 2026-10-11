import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface RouteSEO {
  title: string;
  description: string;
  canonicalPath: string;
  noIndex?: boolean;
}

const ROUTE_SEO_MAP: Record<string, RouteSEO> = {
  '/': {
    title: 'PIXEL 3.O 2026 | National Level Technical Symposium',
    description: 'Join PIXEL 3.O on 14 October 2026 at Adhiparasakthi Engineering College, Melmaruvathur. Explore technical and non-technical symposium events.',
    canonicalPath: '/',
  },
  '/registration': {
    title: 'Registration | PIXEL 3.O 2026 Technical Symposium',
    description: 'Register for PIXEL 3.O 2026 symposium events: PaperQuest, AI FilmForge, Checkmate, and Mine Relay via the official Google Form.',
    canonicalPath: '/registration',
  },
  '/register': {
    title: 'Registration | PIXEL 3.O 2026 Technical Symposium',
    description: 'Register for PIXEL 3.O 2026 symposium events: PaperQuest, AI FilmForge, Checkmate, and Mine Relay via the official Google Form.',
    canonicalPath: '/registration',
  },
  '/about': {
    title: 'About | PIXEL 3.O 2026 National Level Symposium',
    description: 'Learn about PIXEL 3.O, organized by the Department of CSE at Adhiparasakthi Engineering College with CSI Kanchipuram Chapter.',
    canonicalPath: '/about',
  },
  '/agenda': {
    title: 'Event Agenda & Timeline | PIXEL 3.O 2026',
    description: 'Schedule and timeline for PIXEL 3.O 2026 on 14 October 2026. Explore reporting time, inaugural session, technical tracks, and valedictory.',
    canonicalPath: '/agenda',
  },
  '/venues': {
    title: 'Campus Venues & Locations | PIXEL 3.O 2026',
    description: 'Discover event venues for PIXEL 3.O 2026 across Adhiparasakthi Engineering College campus: Central Library and Lab PG Block.',
    canonicalPath: '/venues',
  },
  '/staff-coordinators': {
    title: 'Staff Coordinators | PIXEL 3.O 2026',
    description: 'Meet the faculty advisors and staff coordinators organizing PIXEL 3.O 2026 at Adhiparasakthi Engineering College.',
    canonicalPath: '/staff-coordinators',
  },
  '/student-coordinators': {
    title: 'Student Coordinators | PIXEL 3.O 2026',
    description: 'Meet the dedicated student leadership team organizing PIXEL 3.O 2026 technical and non-technical symposium tracks.',
    canonicalPath: '/student-coordinators',
  },
  '/verify': {
    title: 'Participant Verification Pass | PIXEL 3.O 2026',
    description: 'Verify your PIXEL 3.O symposium participant pass and registration credentials.',
    canonicalPath: '/verify',
    noIndex: true,
  },
  '/pass': {
    title: 'Participant Verification Pass | PIXEL 3.O 2026',
    description: 'Verify your PIXEL 3.O symposium participant pass and registration credentials.',
    canonicalPath: '/pass',
    noIndex: true,
  },
};

export const SEOHead: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    const path = location.pathname;
    const seo: RouteSEO = ROUTE_SEO_MAP[path] || {
      title: 'PIXEL 3.O 2026 | National Level Technical Symposium',
      description: 'Join PIXEL 3.O on 14 October 2026 at Adhiparasakthi Engineering College, Melmaruvathur. Explore technical and non-technical symposium events.',
      canonicalPath: path,
    };

    // Set document title
    document.title = seo.title;

    // Helper to safely set meta tag content
    const setMeta = (selector: string, content: string) => {
      let el = document.querySelector<HTMLMetaElement>(selector);
      if (!el) {
        el = document.createElement('meta');
        if (selector.startsWith('meta[name="')) {
          const name = selector.slice(11, -2);
          el.setAttribute('name', name);
        } else if (selector.startsWith('meta[property="')) {
          const property = selector.slice(15, -2);
          el.setAttribute('property', property);
        }
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };

    // Update meta tags
    setMeta('meta[name="description"]', seo.description);
    setMeta('meta[property="og:title"]', seo.title);
    setMeta('meta[property="og:description"]', seo.description);
    setMeta('meta[property="og:url"]', `https://pixel-3-o.vercel.app${seo.canonicalPath === '/' ? '' : seo.canonicalPath}`);
    setMeta('meta[name="twitter:title"]', seo.title);
    setMeta('meta[name="twitter:description"]', seo.description);

    // Robots directive
    const robotsDirective = seo.noIndex
      ? 'noindex, nofollow'
      : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1';
    setMeta('meta[name="robots"]', robotsDirective);

    // Canonical link
    let canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    const canonicalUrl = `https://pixel-3-o.vercel.app${seo.canonicalPath === '/' ? '/' : seo.canonicalPath}`;
    canonical.setAttribute('href', canonicalUrl);

    // Scroll to top on route change
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return null;
};
