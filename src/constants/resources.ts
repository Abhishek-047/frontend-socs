export type Resource = {
  id: string;
  title: string;
  description: string;
  url: string;
  category: "roadmap" | "tool" | "writeup" | "blog";
  tags: string[];
};

export const resources: Resource[] = [
  {
    id: "1",
    title: "Web Security Fundamentals",
    description: "A complete step-by-step roadmap to go from beginner to discovering your first bug.",
    url: "#",
    category: "roadmap",
    tags: ["Beginner", "Web"]
  },
  {
    id: "2",
    title: "Burp Suite Extensions",
    description: "Our curated list of the most essential Burp plugins for modern web app testing.",
    url: "#",
    category: "tool",
    tags: ["Tools", "Web"]
  },
  {
    id: "3",
    title: "HTB: Obscurity Writeup",
    description: "A detailed walkthrough of the HackTheBox machine Obscurity.",
    url: "#",
    category: "writeup",
    tags: ["HTB", "Linux", "Python"]
  },
  {
    id: "4",
    title: "Zero-Click Attacks Explained",
    description: "Deep dive into how modern zero-click exploits work on mobile devices.",
    url: "#",
    category: "blog",
    tags: ["Mobile", "Exploitation"]
  },
  {
    id: "5",
    title: "Reverse Engineering Roadmap",
    description: "Getting started with x86 assembly, ghidra, and binary analysis.",
    url: "#",
    category: "roadmap",
    tags: ["Intermediate", "RE"]
  },
  {
    id: "6",
    title: "Custom OSINT Framework",
    description: "A collection of scripts we use for automated intelligence gathering.",
    url: "#",
    category: "tool",
    tags: ["OSINT", "Python"]
  },
  {
    id: "7",
    title: "Defcon 32 Experience",
    description: "What our team learned at the world's biggest hacker conference.",
    url: "#",
    category: "blog",
    tags: ["Community", "Events"]
  },
  {
    id: "8",
    title: "Flare-On Challenge 1",
    description: "How we solved the first challenge of FireEye's Flare-On competition.",
    url: "#",
    category: "writeup",
    tags: ["Maware", "RE"]
  }
];
