export type EventCategory = 'all' | 'fest' | 'hackathon' | 'freshers' | 'cultural' | 'sports' | 'workshop';

export interface ScheduleItem {
  time: string;
  title: string;
  location: string;
  description: string;
}

export interface CampusEvent {
  id: string;
  title: string;
  subtitle?: string;
  description: string;
  category: 'fest' | 'hackathon' | 'freshers' | 'cultural' | 'sports' | 'workshop';
  categoryLabel: string;
  categoryEmoji: string;
  status: 'live' | 'upcoming' | 'completed';
  statusBadge: string;
  date: string;
  dateDisplay: string;
  startTime: string;
  endTime: string;
  venue: string;
  venueDetail: string;
  organizer: string;
  organizerRegNo: string;
  organizerRole: string;
  bannerUrl: string;
  attendeeCount: number;
  capacity: number;
  prizes?: string;
  perks: string[];
  isStudentIdRequired: boolean;
  isFree: boolean;
  tags: string[];
  schedule: ScheduleItem[];
  keyAttractions: string[];
  createdAt: number;
  creatorPhone?: string;
}

export interface StudentProfile {
  isLoggedIn: boolean;
  phone: string;
  rollNo: string;
  name: string;
  department: string;
  batch: string;
  avatarUrl?: string;
  isVerified: boolean;
}

export interface EventPass {
  id: string;
  eventId: string;
  eventTitle: string;
  eventDate: string;
  eventTime: string;
  venue: string;
  studentName: string;
  rollNo: string;
  phone: string;
  ticketCode: string;
  gate: string;
  seatType: string;
  issuedAt: number;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  type: 'event' | 'reminder' | 'broadcast' | 'pass';
  eventId?: string;
  isRead: boolean;
  timestamp: number;
}

export interface ReminderSetting {
  eventId: string;
  eventTitle: string;
  eventTime: string;
  venue: string;
  type: '15m' | '1h' | '1d' | 'immediate';
  label: string;
  createdTime: number;
}
