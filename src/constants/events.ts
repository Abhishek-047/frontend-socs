export type Event = {
  id: string;
  slug: string;
  title: string;
  date: string;
  description: string;
  type: "workshop" | "ctf" | "talk" | "hackathon";
  status: "upcoming" | "past";
  location?: string;
};

export const events: Event[] = [
  {
    id: "1",
    slug: "intro-to-web-exploitation",
    title: "Intro to Web Exploitation",
    date: "2026-05-15",
    description: "Learn the basics of SQL injection, XSS, and CSRF in this hands-on workshop.",
    type: "workshop",
    status: "upcoming",
    location: "Cyber Lab 1"
  },
  {
    id: "2",
    slug: "spring-security-ctf",
    title: "Spring Security CTF",
    date: "2026-05-22",
    description: "Our annual flagship Capture The Flag competition. Form teams and win prizes.",
    type: "ctf",
    status: "upcoming",
    location: "Main Auditorium"
  },
  {
    id: "3",
    slug: "future-of-ai-in-hacking",
    title: "Guest Lecture: Future of AI in Hacking",
    date: "2026-06-05",
    description: "Industry expert discusses how LLMs are changing the threat landscape.",
    type: "talk",
    status: "upcoming",
    location: "Virtual"
  },
  {
    id: "4",
    slug: "hardware-hacking-101",
    title: "Hardware Hacking 101",
    date: "2026-03-10",
    description: "We broke apart consumer routers to find UART and JTAG interfaces.",
    type: "workshop",
    status: "past",
    location: "MakerSpace"
  },
  {
    id: "5",
    slug: "winter-hackathon-26",
    title: "Winter Hackathon '26",
    date: "2026-01-15",
    description: "48 hours of building secure tools for the community. Sponsored by TechCorp.",
    type: "hackathon",
    status: "past",
    location: "Innovation Hub"
  },
  {
    id: "6",
    slug: "osint-techniques",
    title: "OSINT Techniques",
    date: "2025-11-20",
    description: "Advanced open-source intelligence gathering methodologies.",
    type: "talk",
    status: "past",
    location: "Cyber Lab 2"
  },
  {
    id: "7",
    slug: "beginner-boot2root",
    title: "Beginner Boot2Root",
    date: "2025-10-05",
    description: "A beginner-friendly CTF walking through enumerating and rooting a vulnerable VM.",
    type: "ctf",
    status: "past",
    location: "Virtual"
  }
];
