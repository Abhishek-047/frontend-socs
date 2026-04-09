export type ProjectTag = "Web Security" | "OSINT" | "Reverse Engineering" | "AI Security";

export type Project = {
  slug: string;
  title: string;
  description: string;
  techStack: string[];
  githubUrl: string;
  tags: ProjectTag[];
  featured?: boolean;
};

export const projects: Project[] = [
  {
    slug: "project-zeroday",
    title: "Project ZeroDay",
    description: "An automated vulnerability scanner for modern web applications using advanced fuzzing techniques.",
    techStack: ["Python", "Go", "Docker"],
    githubUrl: "#",
    tags: ["Web Security"],
    featured: true,
  },
  {
    slug: "deepsight",
    title: "DeepSight",
    description: "AI-driven threat intelligence platform that aggregates and analyzes dark web chatter in real-time.",
    techStack: ["React", "Python", "TensorFlow"],
    githubUrl: "#",
    tags: ["AI Security", "OSINT"],
    featured: true,
  },
  {
    slug: "revtools",
    title: "RevTools",
    description: "A suite of open-source scripts and utilities for reverse engineering x86 binaries.",
    techStack: ["C++", "Assembly", "Python"],
    githubUrl: "#",
    tags: ["Reverse Engineering"],
    featured: true,
  },
  {
    slug: "opentrace",
    title: "OpenTrace",
    description: "Open-source intelligence gathering tool focused on mapping corporate network footprints.",
    techStack: ["Node.js", "Vue", "MongoDB"],
    githubUrl: "#",
    tags: ["OSINT"],
    featured: false,
  },
  {
    slug: "secure-auth-lib",
    title: "SecureAuthLib",
    description: "A drop-in authentication library with zero-knowledge proofs for Next.js applications.",
    techStack: ["TypeScript", "Next.js", "Cryptography"],
    githubUrl: "#",
    tags: ["Web Security"],
    featured: false,
  },
  {
    slug: "binanalyze",
    title: "BinAnalyze",
    description: "Static analysis tool for detecting common malware signatures in executable files.",
    techStack: ["Rust", "YARA"],
    githubUrl: "#",
    tags: ["Reverse Engineering", "AI Security"],
    featured: false,
  }
];
