import express from 'express';
import type { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '10mb' }));

// Initial Seed Events matching Swami Vivekananda University Campus Pulse mockups
const initialEvents = [
  {
    id: 'ev-1',
    title: "SVU 'INDEPENDENCE DAY' SPECIAL 2026",
    subtitle: 'Day 2 — Rock Night & Band Faceoff',
    description: 'The monumental flagship Independence Day celebration of Swami Vivekananda University! Featuring 12 collegiate rock bands competing in the high-voltage Mukta Mancha amphitheatre, followed by neon light spectacles and DJ headliner.',
    category: 'fest',
    categoryLabel: 'College Fest',
    categoryEmoji: '🎉',
    status: 'live',
    statusBadge: 'Day 2 Active',
    date: '2026-09-26',
    dateDisplay: 'Today, 6:00 PM onwards',
    startTime: '18:00',
    endTime: '23:30',
    venue: 'Mukta Mancha Open Air Amphitheatre',
    venueDetail: 'North Lawn Quad, Barrackpore Campus',
    organizer: 'SVU Student Council & Cultural Wing',
    organizerRegNo: 'ORG-SVU-2026-CC1',
    organizerRole: 'Central Council',
    bannerUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBdglItc7ZXe0ePV9hX27MPYEgXDSD9ziGOLdRuNwJ-m6XhxYvNewLv4_e_InjnE9g6e9hkNZVcFYrwFSKU5kbWAglSglB-Drvnsv0AJr1dZ3SuU0JKf5E_Q6qXpMVVGwrO-VmIr7LOGZ2_P5fcux_-umlTDMkqv6l3PBxuoYqCop7GL5GS1JIHVRPJGbYhNvBRjJWK3zWIKMrYKBCHIvkesR1nSByn9CFBIlR1knIEnRf6ieyBiMchDcaVv8CFqlzFzogIZUA9-TBw3w',
    attendeeCount: 1420,
    capacity: 2500,
    prizes: '₹75,000 Rolling Trophy',
    perks: ['Free Entry with Roll No', 'Rock Band Faceoff', 'Food Street Stalls', 'Laser Show'],
    isStudentIdRequired: true,
    isFree: true,
    tags: ['Live Now', 'Mukta Mancha', 'Band Battle', "Fest '26"],
    schedule: [
      { time: '06:00 PM', title: 'Gates Open & ID Card Verification', location: 'Gate 1 & 2', description: 'Student roll card scanning and wristband issuing' },
      { time: '06:30 PM', title: 'Round 1: Battle of the Bands', location: 'Mukta Mancha Stage', description: 'Top 6 inter-department college bands live faceoff' },
      { time: '08:45 PM', title: 'Award Ceremony & Rolling Trophy', location: 'Main Podium', description: 'Presented by Student Welfare Dean' },
      { time: '09:15 PM', title: 'Headliner Rock Band: The Pulse Project', location: 'Mukta Mancha', description: 'Live rock and laser extravaganza' }
    ],
    keyAttractions: ['12+ Rock Bands', 'Laser & Drone Show', '24 Campus Stalls', 'FastPass Entry'],
    createdAt: Date.now() - 1000 * 60 * 60 * 24
  },
  {
    id: 'ev-2',
    title: 'HackSVU 2026: 36-Hr Inter-College Hackathon',
    subtitle: 'Next Friday • 36h Sprint',
    description: 'Build disruptive tech across AI, Web3, and HealthTech. Mentored by premier tech founders and industry engineers. Free food, 24/7 Red Bull & coffee lounges, swags, and internship tracks.',
    category: 'hackathon',
    categoryLabel: 'Hackathons',
    categoryEmoji: '⚡',
    status: 'upcoming',
    statusBadge: 'Next Friday • 36H',
    date: '2026-10-12',
    dateDisplay: 'Oct 12 - 14, 2026',
    startTime: '09:00',
    endTime: '21:00',
    venue: 'Auditorium Block A & Innovation Labs',
    venueDetail: 'Computer Science Department, Floor 3 & 4',
    organizer: 'Department of CSE & IT',
    organizerRegNo: '006-121-2023-305',
    organizerRole: 'Tech Wing',
    bannerUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAjjQB5r7wEyQjTYrQdiHGqj5Z_MGgiPy1dbP7_uw9h-VdMBf6Hc54BK5LmT_qAlkM0pNNW2-NufyDXnstHSUu178yRJ8AaCpxc0B2VFjn0YeWMxx7F3nRmEwFq_ceRpent6LuSjii9s1ol9U3J5t9enj6b7eo9qZb6K2QZXMkDirbO6VYWSB3SJsHKlL005vAepMGQjtIT0mQ1JymFWb800srhfiomiO7GtWHZ59IKq2lxaBdeTWuPfELVXZzA4ZKZXlZilVM6v2BNlQ',
    attendeeCount: 384,
    capacity: 500,
    prizes: '₹50,000 Cash Prize',
    perks: ['Free Food & Swag', 'Open to all departments', 'Certificates & Cloud Credits', 'Direct Interview PPOs'],
    isStudentIdRequired: true,
    isFree: true,
    tags: ['Hackathon', 'AI / Web3', '₹50K Prize', '36h Non-stop'],
    schedule: [
      { time: '09:00 AM (Day 1)', title: 'Check-in, Breakfast & Team Formation', location: 'Block A Foyer', description: 'Get your hacker badge, swag kit, and team table' },
      { time: '11:00 AM (Day 1)', title: 'Problem Statements Revealed & Hacking Begins', location: 'Main Hall', description: 'Themes: Campus Tech, Generative AI, MedTech' },
      { time: '08:00 PM (Day 1)', title: 'Mentor Review & Pitch Clinic', location: 'Lab 401', description: '1-on-1 architecture feedback from senior engineers' },
      { time: '11:00 AM (Day 2)', title: 'Code Freeze & Grand Demonstrations', location: 'Auditorium A', description: 'Live jury evaluation on big screen' }
    ],
    keyAttractions: ['₹50,000 Cash Prize', '36-Hour Hackathon', 'Free Midnight Pizza & Swag', 'Sponsor Cloud Vouchers'],
    createdAt: Date.now() - 1000 * 60 * 60 * 12
  },
  {
    id: 'ev-3',
    title: 'Freshers Welcome 2026: "Aarohan"',
    subtitle: 'Welcoming Batch of 2026',
    description: 'The warmest official student induction and cultural gala for the incoming first-year batches of Swami Vivekananda University. Enjoy electrifying departmental dance performances, Mr. & Ms. Fresher pageant, celebrity DJ, and royal dinner.',
    category: 'freshers',
    categoryLabel: 'Freshers 2026',
    categoryEmoji: '🌟',
    status: 'upcoming',
    statusBadge: 'Nov 02, 2026',
    date: '2026-11-02',
    dateDisplay: 'Nov 02, 2026 • 3:00 PM',
    startTime: '15:00',
    endTime: '22:00',
    venue: 'SVU Central Lawn Garden ("We Love SVU")',
    venueDetail: 'Main Campus Quad, Vivekananda Knowledge City',
    organizer: 'Department of Engineering & Technology',
    organizerRegNo: 'ORG-SVU-ENG-2026',
    organizerRole: 'Student Council',
    bannerUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCRGb1BZyv3_1wLirO3YcvIeXfeGXLwz0KO-xS6NjT6PxOedqFSNyOnwZuoAg83pfGNqMDGr_8-mcxxZCRkYWO9r5Q8keWhOcrVv1D_5hWq2JrQ8m9wegE4RmBHOlbAq80o4flMjdPB7jgbgcv0aQb-G6XHUp6p5Uef2g7loGo6swRzC6wfb0ewzA0ePA4oQ8s3pNNQ2r5EDyZCrzCQN4ihIKYWDwmRT5jjr4Hr-IxWxYcyCuJBDJs2dupFLyBmowhyRSEdoTiJtG53Tw',
    attendeeCount: 890,
    capacity: 1200,
    prizes: 'Mr & Ms Fresher Crowns',
    perks: ['Free Entry with Roll No', 'Freshers Banquet Dinner', 'Welcome Kit', 'DJ Night'],
    isStudentIdRequired: true,
    isFree: true,
    tags: ['Freshers', 'Aarohan', 'Campus Lawn', 'Free Dinner'],
    schedule: [
      { time: '03:00 PM', title: 'Red Carpet Welcome & Batch Photos', location: 'Central Lawn Arch', description: 'Freshers receive university lapel pin and wristbands' },
      { time: '04:30 PM', title: 'Talent Hunt: Mr & Ms Fresher', location: 'Lawn Stage', description: 'Rounds: Introduction, Talent, Q&A' },
      { time: '07:30 PM', title: 'Grand Banquet Dinner', location: 'Dining Pavilion', description: 'Buffet for all students and faculties' },
      { time: '08:30 PM', title: 'Bollywood & EDM Night with DJ Shadow', location: 'Central Stage', description: 'Campus dance party' }
    ],
    keyAttractions: ['Red Carpet Welcome', 'Mr & Ms Fresher Pageant', 'Royal Campus Buffet', 'EDM DJ Dance Night'],
    createdAt: Date.now() - 1000 * 60 * 60 * 8
  },
  {
    id: 'ev-4',
    title: 'SVU Annual Cultural Fest: Aakash 2026',
    subtitle: 'Overnight Cultural Extravaganza',
    description: 'Experience the flagship university extravaganza of the year! SVU Barrackpore lights up with electrifying inter-college music battles, adrenaline-charged DJ sets, premier theatrical performances by the SVU Drama Club, and mouth-watering culinary hubs. Join thousands of students celebrating unity and creativity.',
    category: 'cultural',
    categoryLabel: 'Cultural & Drama',
    categoryEmoji: '🎭',
    status: 'upcoming',
    statusBadge: 'Oct 24, 2026',
    date: '2026-10-24',
    dateDisplay: 'Friday, Oct 24, 2026 • 5:00 PM onwards',
    startTime: '17:00',
    endTime: '02:00',
    venue: 'SVU Main Amphitheatre & Central Lawns',
    venueDetail: 'Barrackpore Campus, West Bengal',
    organizer: 'SVU Central Student Union & Cultural Committee',
    organizerRegNo: 'ORG-SVU-CUL-26',
    organizerRole: 'Organizing Committee',
    bannerUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCeMMrKqfba7AWZebctS-6V8cUauEGNTzrqF1sdCKSSXnI_2nlYnnEVA_4QveTxROT9BlSJgtgkQG67BKN89-cPKTebj2f6RkqHGvl8Ay8gCPOpW1idABpTf5vRL_QZPHKDo5QIaOlhzXV_IBMP0i_dyo9Re0NHL0tuI37soP15c8GQWJWhrMPAJhBepDjm_Lx64BhPW5F-YbrI9bRnKpTQ-LpVlUMkW1KVQ--R55LNgQxp31U7KkLELdKlusaKir4X-g',
    attendeeCount: 1650,
    capacity: 2500,
    prizes: 'Trophies across 15 Competitions',
    perks: ['18+ Rock Bands', 'Laser & Drone Show', '24 Food Stalls', 'Street Plays'],
    isStudentIdRequired: true,
    isFree: true,
    tags: ['Aakash 2026', 'Cultural Fest', 'Rock Bands', 'Drama Club'],
    schedule: [
      { time: '05:00 PM', title: 'Inauguration & Lamp Lighting', location: 'Amphi Main', description: 'Keynote addresses by Hon Vice Chancellor & Academic Deans' },
      { time: '06:30 PM', title: 'Battle of the Bands', location: 'Acoustic Arena', description: '12 top colleges competing live for the coveted SVU Trophy' },
      { time: '08:30 PM', title: 'Rock Band & Grand Laser Extravaganza', location: 'Mukta Mancha', description: 'Live celebrity headline concert followed by synchronized laser show' },
      { time: '11:00 PM', title: 'Midnight Street Plays & Starlight Jam', location: 'Lawn Garden', description: 'Acoustic performances and night market' }
    ],
    keyAttractions: ['18+ Rock Bands', 'Laser & Drone Show', '24 Food Stalls', 'Street Plays & DJ Night'],
    createdAt: Date.now() - 1000 * 60 * 60 * 6
  },
  {
    id: 'ev-5',
    title: 'AI & Robotics Tech Symposium',
    subtitle: 'Hands-on Drone Simulation & Edge AI',
    description: 'Keynotes on Autonomous Systems & Hands-on Drone Simulation. Demonstration of robotic arms, computer vision pipelines, and student robotics club prototypes. Verified participation certificates provided.',
    category: 'workshop',
    categoryLabel: 'Workshop / Seminar',
    categoryEmoji: '🤖',
    status: 'upcoming',
    statusBadge: 'Nov 18, 2026',
    date: '2026-11-18',
    dateDisplay: 'Nov 18, 2026 • 10:00 AM',
    startTime: '10:00',
    endTime: '16:00',
    venue: 'Seminar Hall 3 (ECE Wing)',
    venueDetail: 'Electronics & Communication Block, Floor 2',
    organizer: 'Department of ECE & Robotics Club',
    organizerRegNo: '006-121-2023-112',
    organizerRole: 'Robotics Club',
    bannerUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC7g224dPg3IigFnJJlwr9bvvSLo4JOUqaAAXRRwCC0MZ8ZqmIllazvbS3Bp0GPz2IheMROLaGOSFK49aidTXezmEKcXtqAVoMT6CV2ENFDjm3YPW0bzmNVS9oDHj4yguAz_ChjESIMd3w0I2VLZbbm2gUKbRlOZCoXpi97kTPtQUmnKE7he5CvnTfQdyXS-IzMeLPDnbplMeh2wv5HwoJyUHGQMPeNYXL9dUDv5bjB0q4mjOwefdiJmMdZh88wMHTY15_7Hx3d7xu_qA',
    attendeeCount: 210,
    capacity: 250,
    prizes: 'Best Paper & Prototype Awards',
    perks: ['Certificates Provided', 'Hands-on Hardware Kits', 'Industry Mentorship', 'High Tea'],
    isStudentIdRequired: true,
    isFree: true,
    tags: ['Robotics', 'Edge AI', 'Drone Sim', 'Certificates'],
    schedule: [
      { time: '10:00 AM', title: 'Keynote: Next-Gen Autonomous Quadcopters', location: 'Hall 3', description: 'By DRDO and IIT guest researchers' },
      { time: '11:45 AM', title: 'Hands-on PX4 Flight Simulation Workshop', location: 'Embedded Lab', description: 'Build and tune flight controllers on PC' },
      { time: '02:00 PM', title: 'Student Robotics Arena Challenge', location: 'Hall 3 Foyer', description: 'Line follower and maze-solver robot trials' }
    ],
    keyAttractions: ['Autonomous Drones Demo', 'Hands-on Edge AI Kits', 'Certificate of Completion', 'Robotics Club Expo'],
    createdAt: Date.now() - 1000 * 60 * 60 * 4
  },
  {
    id: 'ev-6',
    title: 'SVU Premier League: Inter-Department Cricket 2026',
    subtitle: 'Sports Week Flagship Trophy',
    description: 'The annual inter-department T10 cricket clash! 16 department teams battle for the university gold championship trophy. Live commentary, refreshments, and athletic scouting.',
    category: 'sports',
    categoryLabel: 'Sports',
    categoryEmoji: '⚽',
    status: 'upcoming',
    statusBadge: 'Nov 25, 2026',
    date: '2026-11-25',
    dateDisplay: 'Nov 25 - 28, 2026',
    startTime: '08:30',
    endTime: '18:00',
    venue: 'SVU Stadium & Sports Ground',
    venueDetail: 'East Campus Sports Complex, Barrackpore',
    organizer: 'SVU Sports Council & Physical Education Dept',
    organizerRegNo: 'ORG-SVU-SPT-26',
    organizerRole: 'Sports Council',
    bannerUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCRGb1BZyv3_1wLirO3YcvIeXfeGXLwz0KO-xS6NjT6PxOedqFSNyOnwZuoAg83pfGNqMDGr_8-mcxxZCRkYWO9r5Q8keWhOcrVv1D_5hWq2JrQ8m9wegE4RmBHOlbAq80o4flMjdPB7jgbgcv0aQb-G6XHUp6p5Uef2g7loGo6swRzC6wfb0ewzA0ePA4oQ8s3pNNQ2r5EDyZCrzCQN4ihIKYWDwmRT5jjr4Hr-IxWxYcyCuJBDJs2dupFLyBmowhyRSEdoTiJtG53Tw',
    attendeeCount: 640,
    capacity: 1000,
    prizes: '₹25,000 + Gold Trophy',
    perks: ['Open to All Departments', 'Official Medals & Kits', 'Energy Drinks & Food', 'Cheer Squads'],
    isStudentIdRequired: true,
    isFree: true,
    tags: ['Cricket', 'Sports Trophy', 'T10 League', 'Inter-Dept'],
    schedule: [
      { time: '08:30 AM (Nov 25)', title: 'Opening Match: CSE Warriors vs ME Tigers', location: 'Pitch 1', description: 'T10 Group A opener' },
      { time: '02:00 PM (Nov 28)', title: 'Grand Final & Trophy Presentation', location: 'Main Ground', description: 'Championship final with live commentary' }
    ],
    keyAttractions: ['T10 League Action', 'Trophy & Medals', 'Live DJ Commentary', 'Campus Food Trucks'],
    createdAt: Date.now() - 1000 * 60 * 60 * 2
  }
];

let events = [...initialEvents];

// Keep track of connected Server-Sent Events (SSE) clients for real-time streaming
const sseClients: Response[] = [];

function broadcastToClients(data: { type: string; payload: unknown }) {
  const message = `data: ${JSON.stringify(data)}\n\n`;
  for (let i = sseClients.length - 1; i >= 0; i--) {
    const client = sseClients[i];
    try {
      client.write(message);
    } catch {
      sseClients.splice(i, 1);
    }
  }
}

// REST Endpoints
app.get('/api/events', (_req: Request, res: Response) => {
  res.json({ success: true, events });
});

app.post('/api/events', (req: Request, res: Response) => {
  const newEventData = req.body;
  if (!newEventData || !newEventData.title) {
    return res.status(400).json({ success: false, error: 'Event title is required' });
  }

  const newEvent = {
    ...newEventData,
    id: `ev-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    createdAt: Date.now(),
    attendeeCount: newEventData.attendeeCount || 0
  };

  events.unshift(newEvent);

  // Broadcast to all active users in real-time
  broadcastToClients({ type: 'EVENT_CREATED', payload: newEvent });

  res.status(201).json({ success: true, event: newEvent });
});

app.post('/api/events/:id/rsvp', (req: Request, res: Response) => {
  const { id } = req.params;
  const event = events.find((e) => e.id === id);
  if (!event) {
    return res.status(404).json({ success: false, error: 'Event not found' });
  }

  event.attendeeCount = (event.attendeeCount || 0) + 1;

  broadcastToClients({
    type: 'EVENT_RSVP_UPDATED',
    payload: { id: event.id, attendeeCount: event.attendeeCount }
  });

  res.json({ success: true, event });
});

// SSE Real-time Endpoint
app.get('/api/events/stream', (req: Request, res: Response) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders?.();

  sseClients.push(res);

  // Send initial events bundle
  res.write(`data: ${JSON.stringify({ type: 'INITIAL_EVENTS', payload: events })}\n\n`);

  // Heartbeat ping every 25 seconds
  const heartbeat = setInterval(() => {
    try {
      res.write(': heartbeat\n\n');
    } catch {
      clearInterval(heartbeat);
    }
  }, 25000);

  req.on('close', () => {
    clearInterval(heartbeat);
    const index = sseClients.indexOf(res);
    if (index !== -1) {
      sseClients.splice(index, 1);
    }
  });
});

// Broadcast push notification endpoint
app.post('/api/broadcast-notification', (req: Request, res: Response) => {
  const notification = req.body;
  broadcastToClients({
    type: 'PUSH_NOTIFICATION',
    payload: {
      ...notification,
      id: `notif-${Date.now()}`,
      time: 'Just now'
    }
  });
  res.json({ success: true });
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    // Mount Vite middlewares in development
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Serve static files in production
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`SVU Campus Pulse server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
