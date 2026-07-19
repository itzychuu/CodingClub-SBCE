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
              <div
                key={mem.id}
                id={`roster-card-${mem.id}`}
                className="
                  group relative flex flex-col justify-between p-5 rounded-2xl overflow-hidden
                  bg-white/[0.03] border border-white/10 backdrop-blur-xl
                  shadow-[0_8px_32px_rgba(0,0,0,0.35)]
                  transition-all duration-500 ease-out
                  hover:-translate-y-1.5 hover:border-orange-500/30
                  hover:shadow-[0_20px_50px_rgba(0,0,0,0.5),0_0_40px_rgba(255,107,0,0.12)]
                "
              >
                {/* Gradient ring glow on hover */}
                <div
                  className="
                    pointer-events-none absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100
                    transition-opacity duration-500
                    bg-[radial-gradient(120%_60%_at_50%_0%,rgba(255,107,0,0.12),transparent_70%)]
                  "
                />

                <div className="relative space-y-4">
                  {/* Photo */}
                  <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-neutral-950 border border-white/10">
                    <img
                      src={mem.image}
                      alt={mem.name}
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700 ease-out"
                    />
                    {/* Bottom gradient wash for text legibility / depth */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-70 group-hover:opacity-40 transition-opacity duration-500" />
                    {/* Diagonal shine sweep */}
                    <div
                      className="
                        absolute top-0 -left-full w-1/2 h-full
                        bg-gradient-to-r from-transparent via-white/25 to-transparent
                        skew-x-[-20deg] group-hover:left-[150%]
                        transition-[left] duration-1000 ease-out
                      "
                    />
                  </div>

                  <div className="space-y-2">
                    <h5 className="text-base font-bold text-white font-mono leading-tight group-hover:text-orange-400 transition-colors duration-300">
                      {mem.position}
                    </h5>
                    <h3 className="text-base font-bold text-white font-mono leading-tight group-hover:text-orange-400 transition-colors duration-300">
                      {mem.name}
                    </h3>
                    <p className="text-neutral-400 text-xs leading-relaxed line-clamp-3">{mem.bio}</p>
                  </div>
                </div>

                <div className="relative flex items-center justify-between pt-4 mt-4 border-t border-white/10">

                  {/* Social links – slide/fade in on hover */}
                  <div className="flex items-center gap-3 text-neutral-500">
                    {mem.github && (
                      <a
                        href={mem.github}
                        target="_blank"
                        rel="noreferrer"
                        className="
                          p-1.5 rounded-full border border-transparent
                          hover:text-white hover:bg-white/10 hover:border-white/15
                          hover:-translate-y-0.5 transition-all duration-300
                        "
                      >
                        <Github className="w-4 h-4" />
                      </a>
                    )}
                    {mem.linkedin && (
                      <a
                        href={mem.linkedin}
                        target="_blank"
                        rel="noreferrer"
                        className="
                          p-1.5 rounded-full border border-transparent
                          hover:text-white hover:bg-white/10 hover:border-white/15
                          hover:-translate-y-0.5 transition-all duration-300
                        "
                      >
                        <Linkedin className="w-4 h-4" />
                      </a>
                    )}
                    {mem.instagram && (
                      <a
                        href={mem.instagram}
                        target="_blank"
                        rel="noreferrer"
                        className="
                          p-1.5 rounded-full border border-transparent
                          hover:text-white hover:bg-white/10 hover:border-white/15
                          hover:-translate-y-0.5 transition-all duration-300
                        "
                      >
                        <Instagram className="w-4 h-4" />
                      </a>
                    )}
                    {mem.email && (
                      <a
                        href={`mailto:${mem.email}`}
                        className="
                          p-1.5 rounded-full border border-transparent
                          hover:text-white hover:bg-white/10 hover:border-white/15
                          hover:-translate-y-0.5 transition-all duration-300
                        "
                      >
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
