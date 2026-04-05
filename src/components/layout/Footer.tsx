import React from "react";
import Link from "next/link";
import { MessageSquare } from "lucide-react";
import { GithubIcon, TwitterIcon, LinkedinIcon } from "../ui/Icons";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-primary/20 bg-background/80 backdrop-blur-md relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <Link href="/" className="inline-block font-jetbrains text-xl font-bold text-white mb-4 group">
              <span className="text-primary mr-2">&gt;</span>
              SOCS
              <span className="inline-block w-2 h-5 ml-1 bg-primary animate-[blink-cursor_1s_step-end_infinite]"></span>
            </Link>
            <p className="text-gray-400 font-jetbrains text-sm max-w-md mb-6 leading-relaxed">
              Society of Cyber Security. Uniting the elite, pushing boundaries, and securing the network. Join us and upgrade your payload.
            </p>
            <div className="flex items-center space-x-4">
              <a href="#" className="p-2 border border-gray-700 rounded hover:border-primary hover:text-primary text-gray-400 transition-colors">
                <GithubIcon className="w-5 h-5" />
              </a>
              <a href="#" className="p-2 border border-gray-700 rounded hover:border-primary hover:text-primary text-gray-400 transition-colors">
                <MessageSquare size={20} />
              </a>
              <a href="#" className="p-2 border border-gray-700 rounded hover:border-primary hover:text-primary text-gray-400 transition-colors">
                <TwitterIcon className="w-5 h-5" />
              </a>
              <a href="#" className="p-2 border border-gray-700 rounded hover:border-primary hover:text-primary text-gray-400 transition-colors">
                <LinkedinIcon className="w-5 h-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="font-jetbrains text-white font-bold mb-4 flex items-center">
              <span className="text-primary mr-2">/</span> Navigate
            </h3>
            <ul className="space-y-2 font-jetbrains text-sm">
              <li><Link href="/team" className="text-gray-400 hover:text-primary transition-colors">Team</Link></li>
              <li><Link href="/projects" className="text-gray-400 hover:text-primary transition-colors">Projects</Link></li>
              <li><Link href="/events" className="text-gray-400 hover:text-primary transition-colors">Events</Link></li>
              <li><Link href="/resources" className="text-gray-400 hover:text-primary transition-colors">Resources</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-jetbrains text-white font-bold mb-4 flex items-center">
              <span className="text-primary mr-2">/</span> System
            </h3>
            <p className="text-primary/60 font-jetbrains text-xs mb-2">
              &gt; STATUS: ONLINE <span className="inline-block w-2 h-2 rounded-full bg-primary ml-1 shadow-[0_0_5px_#C8FF00]"></span>
            </p>
            <p className="text-primary/60 font-jetbrains text-xs mb-2">
              &gt; VERSION: 2.0.4
            </p>
            <p className="text-gray-500 font-jetbrains text-xs mt-8">
              &gt; connection terminated.
            </p>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center font-jetbrains text-xs text-gray-500">
          <p>© {currentYear} Society of Cyber Security. All rights reserved.</p>
          <p className="mt-2 md:mt-0">Built with Next.js &lt;/&gt;</p>
        </div>
      </div>
    </footer>
  );
}
