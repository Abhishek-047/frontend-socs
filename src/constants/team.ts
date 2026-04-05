export type TeamMember = {
  name: string;
  role: string;
  skills: string[];
  image?: string;
  github?: string;
  linkedin?: string;
  tier: "core" | "lead" | "member";
};

export const teamMembers: TeamMember[] = [
  {
    name: "Alex Vance",
    role: "President",
    skills: ["Offensive Security", "Reverse Engineering", "C/C++"],
    tier: "core",
    github: "#",
    linkedin: "#"
  },
  {
    name: "Sarah Jenkins",
    role: "Vice President",
    skills: ["Cloud Security", "DevSecOps", "AWS"],
    tier: "core",
    github: "#"
  },
  {
    name: "Marcus Chen",
    role: "Head of Operations",
    skills: ["Network Security", "Blue Teaming", "Python"],
    tier: "core",
    linkedin: "#"
  },
  {
    name: "Elena Rodriguez",
    role: "CTF Lead",
    skills: ["Cryptography", "Pwn", "Rust"],
    tier: "lead",
    github: "#" // etc
  },
  {
    name: "David Kim",
    role: "Web Security Lead",
    skills: ["Web Exploitation", "Bug Bounty", "JavaScript"],
    tier: "lead",
    github: "#"
  },
  {
    name: "Priya Patel",
    role: "Hardware Security Lead",
    skills: ["IoT", "Embedded Systems", "Assembly"],
    tier: "lead",
  },
  {
    name: "James Wilson",
    role: "Events Lead",
    skills: ["Logistics", "OSINT", "Public Speaking"],
    tier: "lead",
  },
  {
    name: "Nina Simone",
    role: "Member",
    skills: ["Malware Analysis", "Python"],
    tier: "member",
  },
  {
    name: "Tom Hardy",
    role: "Member",
    skills: ["Penetration Testing", "Bash"],
    tier: "member",
  },
  {
    name: "Alice Wonderland",
    role: "Member",
    skills: ["Cryptography", "Math"],
    tier: "member",
  },
  {
    name: "Bob Builder",
    role: "Member",
    skills: ["Infrastructure", "Docker"],
    tier: "member",
  },
  {
    name: "Eve Hacker",
    role: "Member",
    skills: ["Social Engineering", "OSINT"],
    tier: "member",
  },
  {
    name: "Charlie Brown",
    role: "Member",
    skills: ["Web Security", "React"],
    tier: "member",
  }
];
