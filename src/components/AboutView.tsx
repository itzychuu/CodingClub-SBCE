import React, { useState } from 'react';
import { Search, ArrowUpDown, Github, Linkedin, Instagram, Mail, Trophy, Target, ShieldCheck, HelpCircle } from 'lucide-react';
import { Member, Settings } from '../types';

interface AboutViewProps {
  settings: Settings;
  members: Member[];
}

export default function AboutView({ settings, members }: AboutViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'designation' | 'name'>('designation');

  // Filter out Faculty Coordinators to show under their specific section
  // Student members go to the main Execom roster
  const studentLeaders = members.filter(m => !m.position.toLowerCase().includes('faculty') && !m.position.toLowerCase().includes('coordinator'));

  const filteredLeaders = studentLeaders
    .filter(mem => {
      return mem.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
             mem.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
             mem.bio.toLowerCase().includes(searchTerm.toLowerCase());
    })
    .sort((a, b) => {
      if (sortBy === 'name') {
        return a.name.localeCompare(b.name);
      } else {
        return (a.display_order || 99) - (b.display_order || 99);
      }
    });

  return (
    <div className="space-y-16 pb-20" id="about-view">
      {/* 4.4 Header */}
      <div className="space-y-4 max-w-2xl" id="about-header">
        <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight font-mono border-l-4 border-orange-500 pl-4">
          Our Foundation
        </h1>
        <p className="text-neutral-400 text-sm md:text-base leading-relaxed">
          The CSE Coding Club of Sree Buddha College of Engineering is an incubator built for student engineering growth and collaborative community innovation.
        </p>
      </div>

      {/* History and Objectives Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch" id="foundation-cards">
        <div className="lg:col-span-7 bg-zinc-950/40 border border-neutral-900 rounded-xl p-6 md:p-8 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <h2 className="text-lg font-bold font-mono text-white flex items-center gap-2">
              <span className="w-2.5 h-2.5 bg-orange-500 rounded-sm"></span>
              Our History
            </h2>
            <p className="text-neutral-400 text-xs md:text-sm leading-relaxed whitespace-pre-line">
              {settings.aboutHistory || "Established in 2021 by the Department of Computer Science & Engineering, the SBCE Coding Club has grown into the campus hub for technological leadership. We connect aspiring programmers, open-source advocates, and problem solvers to learn together, build for the community, and prepare for premium tech careers."}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4 border-t border-neutral-900/60 pt-6">
            <div className="p-4 bg-black border border-neutral-900 rounded-lg">
              <span className="text-[10px] uppercase font-mono text-neutral-500 block">Mission</span>
              <p className="text-neutral-300 text-xs font-mono mt-1">{settings.aboutMission || "To build a vibrant coding culture in SBCE and empower students to solve real-world problems using software engineering."}</p>
            </div>
            <div className="p-4 bg-black border border-neutral-900 rounded-lg">
              <span className="text-[10px] uppercase font-mono text-neutral-500 block">Vision</span>
              <p className="text-neutral-300 text-xs font-mono mt-1">{settings.aboutVision || "To produce top-tier technical talent capable of engineering solutions for national and global challenges, setting a benchmark for student-run technical communities in Kerala."}</p>
            </div>
          </div>
        </div>

        {/* Core Objectives List */}
        <div className="lg:col-span-5 bg-zinc-950/40 border border-neutral-900 rounded-xl p-6 md:p-8 space-y-6">
          <h2 className="text-lg font-bold font-mono text-white flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-orange-500 rounded-sm"></span>
            Club Objectives
          </h2>
          <ul className="space-y-4 text-xs md:text-sm text-neutral-400" id="objectives-list">
            {(settings.aboutObjectives || [
              "Conduct weekly technical workshops on cutting-edge technologies.",
              "Host annual national-level hackathons.",
              "Foster open-source contribution and collaborative development.",
              "Provide mentorship for technical interview preparation and coding competitions."
            ]).map((obj, i) => (
              <li key={i} className="flex items-start gap-3">
                <ShieldCheck className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
                <span className="leading-relaxed text-neutral-300">{obj}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Faculty Coordinators Section */}
      <section className="space-y-8" id="faculty-coordinators-section">
        <h2 className="text-xl md:text-2xl font-bold font-mono text-white border-l-4 border-orange-500 pl-3">
          Faculty Coordinators & Mentors
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6" id="faculty-grid">
          {(settings.aboutCoordinators || [
            { name: "Dr. Saji V.R.", title: "HOD, CSE Dept" },
            { name: "Prof. Soumya Murali", title: "Assistant Professor, CSE Dept" }
          ]).map((coord, i) => (
            <div key={i} id={`faculty-card-${i}`} className="bg-black border border-neutral-900 rounded-xl p-6 flex items-center gap-4 hover:border-neutral-800 transition-colors">
              <div className="w-12 h-12 rounded-full bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-500 font-mono text-lg font-bold shrink-0">
                {coord.name.split(' ').pop()?.charAt(0) || 'F'}
              </div>
              <div>
                <h3 className="text-base font-bold text-white font-mono leading-tight">{coord.name}</h3>
                <p className="text-xs text-orange-500 font-mono mt-0.5">{coord.title}</p>
                <p className="text-neutral-500 text-[11px] mt-1">Sree Buddha College of Engineering</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4.2 Executive Committee Module */}
      <section className="space-y-8" id="execom-module-section">
        <div className="border-t border-neutral-900 pt-10 flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <h2 className="text-xl md:text-2xl font-bold font-mono text-white border-l-4 border-orange-500 pl-3">
              Executive Committee Showcase
            </h2>
            <p className="text-neutral-400 text-xs md:text-sm">
              The student-run leadership board organizing software bootcamps, managing public relations, and designing system projects.
            </p>
          </div>

          {/* Roster Controls */}
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto" id="roster-controls">
            {/* Search */}
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-600" />
              <input
                id="execom-search-input"
                type="text"
                placeholder="Search leaders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-black border border-neutral-850 rounded-lg py-1.5 pl-9 pr-3 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-orange-500/50"
              />
            </div>
            {/* Sorting Toggle */}
            <button
              id="execom-sort-btn"
              onClick={() => setSortBy(prev => prev === 'designation' ? 'name' : 'designation')}
              className="px-3 py-1.5 border border-neutral-850 hover:border-neutral-700 bg-black text-neutral-400 hover:text-white rounded-lg text-xs font-mono flex items-center gap-1.5 focus:outline-none"
            >
              <ArrowUpDown className="w-3.5 h-3.5" />
              <span>Sort: <b className="text-orange-500">{sortBy === 'designation' ? 'Order' : 'Name'}</b></span>
            </button>
          </div>
        </div>

        {/* Leaders Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" id="execom-full-grid">
          {filteredLeaders.length > 0 ? (
            filteredLeaders.map((mem) => (
              <div key={mem.id} id={`roster-card-${mem.id}`} className="bg-zinc-950/40 border border-neutral-900 rounded-xl overflow-hidden p-5 hover:border-neutral-800 transition-all group flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="aspect-square w-full rounded-lg overflow-hidden bg-neutral-950 border border-neutral-900">
                    <img src={mem.image} alt={mem.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
                  </div>
                  <div className="space-y-2">
                    <span className="font-mono text-[10px] uppercase text-orange-500 tracking-wider font-bold">{mem.position}</span>
                    <h3 className="text-base font-bold text-white font-mono leading-tight">{mem.name}</h3>
                    <p className="text-neutral-400 text-xs leading-relaxed">{mem.bio}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 mt-4 border-t border-neutral-950">
                  <span className="font-mono text-[9px] text-neutral-600">ID: {mem.id}</span>
                  {/* Social links */}
                  <div className="flex items-center gap-3 text-neutral-500">
                    {mem.github && (
                      <a href={mem.github} target="_blank" rel="noreferrer" className="hover:text-white transition-colors">
                        <Github className="w-4 h-4" />
                      </a>
                    )}
                    {mem.linkedin && (
                      <a href={mem.linkedin} target="_blank" rel="noreferrer" className="hover:text-white transition-colors">
                        <Linkedin className="w-4 h-4" />
                      </a>
                    )}
                    {mem.instagram && (
                      <a href={mem.instagram} target="_blank" rel="noreferrer" className="hover:text-white transition-colors">
                        <Instagram className="w-4 h-4" />
                      </a>
                    )}
                    {mem.email && (
                      <a href={`mailto:${mem.email}`} className="hover:text-white transition-colors">
                        <Mail className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-3 border border-dashed border-neutral-850 rounded-xl p-8 text-center text-neutral-500 font-mono text-xs">
              No leadership members match your search criteria. Try a different query.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
