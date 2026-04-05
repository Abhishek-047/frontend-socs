import { events } from "../constants/events";

export const handleCommand = (cmd: string): string => {
  const c = cmd.trim().toLowerCase();
  
  if (c === "") return "";
  
  if (c === "help") {
    return [
      "Available commands:",
      "  help       - List all available commands",
      "  whoami     - Display current user info",
      "  ls         - List files in current directory",
      "  cat <file> - Read file contents",
      "  join       - Get join link",
      "  clear      - Clear terminal window"
    ].join("\r\n");
  }
  
  if (c === "whoami") {
    return "guest@socs-network — access level: visitor";
  }
  
  if (c === "ls") {
    return "about.txt\tevents.txt\tprojects.txt\tmembers.txt";
  }
  
  if (c.startsWith("cat ")) {
    const file = c.substring(4).trim();
    if (file === "about.txt") {
      return "Society of Cyber Security (SOCS) is an elite faction of researchers and engineers focused on offensive and defensive security primitives.";
    }
    if (file === "events.txt") {
      const up = events.filter(e => e.status === "upcoming").slice(0,2);
      if (up.length === 0) return "No upcoming events found.";
      return up.map(e => `[${e.date}] ${e.title} - ${e.type}`).join("\r\n");
    }
    if (file === "projects.txt" || file === "members.txt") {
      return `Access denied: encrypted file.`;
    }
    return `cat: ${file}: No such file or directory`;
  }
  
  if (c === "join") {
    return "Redirecting to join portal... Access via UI or traverse to /join path.";
  }
  
  return `command not found: ${c.split(' ')[0]}`;
};
