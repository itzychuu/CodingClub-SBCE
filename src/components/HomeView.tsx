import React from 'react';
import { Users, Calendar, Trophy, FolderCode, ArrowUpRight, Github, Linkedin, Instagram, Mail, MapPin, Zap } from 'lucide-react';
import { Event, Member, Settings } from '../types';
import heroImage from '../assets/images/HeroBG.png';
import CE from '../assets/images/CE.png';
import SB from '../assets/images/SB.png';
import Logo from '../assets/images/Logo.png';
import Code from '../assets/images/CodingClub.png'

interface HomeViewProps {
  settings: Settings;
  events: Event[];
  members: Member[];
  setTab: (tab: string) => void;
  onSelectEvent: (event: Event) => void;
}

export default function HomeView({ settings, events, members, setTab, onSelectEvent }: HomeViewProps) {
  // Filter for upcoming/ongoing events
  const upcomingEvents = events.filter(e => e.status !== 'Completed').slice(0, 2);
  const committeePreview = members.slice(0, 4);

  // Static list of notable student projects (developer-themed)
  const projects = [
    {
      title: "SBCE Campus Map",
      description: "An interactive, open-source 3D layout navigator helping freshmen locate campus labs and auditoriums.",
      tags: ["React", "Three.js", "Tailwind"],
      github: "https://github.com/sbce-codingclub/campus-map"
    },
    {
      title: "Automated Attendance QR",
      description: "A fast, QR-code check-in utility deployed across CSE seminars for paperless event registration verification.",
      tags: ["Node.js", "Express", "MongoDB", "QR API"],
      github: "https://github.com/sbce-codingclub/qr-checkin"
    },
    {
      title: "SBCE Devs Directory",
      description: "A student portfolio index highlighting achievements, github streaks, and resumes of engineering seniors.",
      tags: ["TypeScript", "Next.js", "Postgres"],
      github: "https://github.com/sbce-codingclub/devs-index"
    }
  ];

  return (
    <div id="home-view">
      {/* ═══════════════════════════════════════════════
          HERO – Full-viewport, matches Figma exactly
          ═══════════════════════════════════════════════ */}
      <section className="hero-fullscreen" id="hero-section" style={{ marginTop: '-1px' }}>

        {/* Background image */}
        <div
          className="hero-bg"
          style={{ backgroundImage: `url(${heroImage})` }}
          id="hero-image-bg-container"
        />

        {/* Dark gradient overlay */}
        <div className="hero-overlay" />

        {/* Content – sits in the lower-left of the viewport */}
        <div
          className="relative z-10 flex flex-col items-start justify-end h-full"
          style={{
            paddingLeft: 'clamp(24px, 15.6vw, 220px)',
            paddingRight: '5vw',
            paddingBottom: 'clamp(40px, 6.25vw, 80px)',
          }}
          id="hero-content"
        >

          {/* "CODING CLUB" – orange, Bungee font */}
          <img
            src={Code}
            alt="Coding Club"
            className="h-auto select-none"
            style={{ width: 'clamp(180px, 32.4vw, 415px)', translate: "110px" }}
            draggable={false}
          />

          {/* "S3" solid + "CE" glass – giant letters row */}
          <div
            className="flex items-end mt-2"
            style={{ gap: 'clamp(20px, 5.7vw, 36px)', translate: "110px"}}
          >
            <img
              src={SB}
              alt="SB"
              className="select-none"
              style={{ height: 'clamp(90px, 22vw, 282px)', width: 'auto' }}
              draggable={false}
            />
            <img
              src={CE}
              alt="CE"
              className="select-none"
              style={{ height: 'clamp(90px, 22vw, 282px)', width: 'auto' }}
              draggable={false}
            />
          </div>

          {/* "EXPLORE EVENTS" button – centered under the lockup */}
          <div
            className="w-full flex justify-center"
            style={{ marginTop: 'clamp(28px, 5.16vw, 66px)', translate: "-65px" }}
            id="hero-actions"
          >
            <button
              onClick={() => setTab('events')}
              className="hero-btn-explore"
              id="hero-explore-events-btn"
            >
              EXPLORE EVENTS
            </button>
          </div>

        </div>
      </section>

      {/* ─── Constrained sections below hero ─── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-24 pb-20 pt-16">

        {/* 4.1 Statistics Section */}
        <section className="border-t border-b border-neutral-900 py-10" id="stats-section">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8" id="stats-grid">
            {[
              { label: 'Active Members', value: `${settings.statistics?.members || 240}+`, icon: Users },
              { label: 'Events Hosted', value: settings.statistics?.events || 28, icon: Calendar },
              { label: 'Hackathons', value: settings.statistics?.hackathons || 5, icon: Trophy },
              { label: 'Open-Source Projects', value: `${settings.statistics?.projects || 12}+`, icon: FolderCode },
              { label: 'Years Active', value: `${settings.statistics?.yearsActive || 5}Y`, icon: Zap },
            ].map((stat, i) => (
              <div key={i} id={`stat-card-${i}`} className="text-center md:text-left space-y-2 p-4 bg-zinc-950/40 border border-neutral-900 rounded-xl hover:border-neutral-800 transition-colors">
                <div className="flex items-center justify-center md:justify-start gap-2 text-neutral-500">
                  <stat.icon className="w-4 h-4 text-orange-500/80" />
                  <span className="text-xs font-mono tracking-wider uppercase">{stat.label}</span>
                </div>
                <p className="text-3xl md:text-4xl font-black text-white font-mono">{stat.value}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Domains Module */}
        <section className="space-y-8" id="domains-section">
          <div className="max-w-2xl space-y-2">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white font-mono border-l-4 border-orange-500 pl-3">
              Core Learning Domains
            </h2>
            <p className="text-neutral-400 text-sm md:text-base">
              We categorize our technical activities into four structured domains where students study, build, and challenge peers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6" id="domains-grid">
            {[
              {
                title: "Full Stack Development",
                desc: "Building scalable backend microservices, real-time databases, and responsive modern user interfaces in React, Express, and databases.",
                badge: "Modern Web"
              },
              {
                title: "Competitive Programming",
                desc: "Polishing algorithm mastery, complexity parsing, and rapid problem-solving on portals like LeetCode, Codeforces, and HackerRank.",
                badge: "Algorithms"
              },
              {
                title: "Mobile App Engineering",
                desc: "Learning responsive cross-platform architectures, reactive states, and material styling guides with modern Flutter and Dart.",
                badge: "Flutter/Dart"
              },
              {
                title: "Open Source Ecosystems",
                desc: "Developing software transparently. Gaining knowledge of distributed version control, pull workflows, licensing, and community codebases.",
                badge: "Git/GitHub"
              }
            ].map((dom, idx) => (
              <div key={idx} id={`domain-card-${idx}`} className="bg-zinc-950/40 border border-neutral-900 rounded-xl p-6 hover:border-orange-500/20 transition-all duration-300 group hover:-translate-y-1">
                <div className="flex justify-between items-start mb-4">
                  <span className="font-mono text-xs text-orange-500 px-2 py-0.5 border border-orange-500/20 rounded-full">{dom.badge}</span>
                  <span className="text-neutral-800 font-mono text-2xl font-bold group-hover:text-neutral-700">0{idx + 1}</span>
                </div>
                <h3 className="text-lg font-bold text-white mb-2 font-mono group-hover:text-orange-400 transition-colors">{dom.title}</h3>
                <p className="text-neutral-400 text-xs leading-relaxed">{dom.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Upcoming Events Preview */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-12" id="upcoming-events-preview-section">
          <div className="lg:col-span-4 space-y-6">
            <div className="space-y-2">
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white font-mono border-l-4 border-orange-500 pl-3">
                Upcoming Milestones
              </h2>
              <p className="text-neutral-400 text-sm">
                Do not miss out! Check out what events we are hosting next on the campus. Make sure to complete your registration.
              </p>
            </div>
            <button
              onClick={() => setTab('events')}
              className="inline-flex items-center gap-2 text-sm font-mono text-orange-500 hover:text-orange-400 transition-colors group focus:outline-none"
              id="view-all-events-preview-btn"
            >
              <span>View All Schedule</span>
              <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </button>
          </div>

          <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-6" id="upcoming-events-preview-grid">
            {upcomingEvents.length > 0 ? (
              upcomingEvents.map((evt) => (
                <div
                  key={evt.id}
                  id={`upcoming-preview-card-${evt.id}`}
                  className="bg-black border border-neutral-900 rounded-xl overflow-hidden hover:border-neutral-800 transition-all flex flex-col group cursor-pointer"
                  onClick={() => onSelectEvent(evt)}
                >
                  <div className="aspect-video relative overflow-hidden bg-neutral-950">
                    <img src={evt.banner} alt={evt.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <span className="absolute top-3 right-3 px-2 py-0.5 bg-orange-600 text-black text-[10px] font-bold font-mono uppercase tracking-wider rounded">
                      {evt.status}
                    </span>
                  </div>
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <span className="font-mono text-[10px] text-neutral-500 uppercase tracking-widest">{evt.date} • {evt.venue}</span>
                      <h3 className="text-base font-bold text-white group-hover:text-orange-400 transition-colors font-mono line-clamp-1">{evt.title}</h3>
                      <p className="text-neutral-400 text-xs line-clamp-2">{evt.description}</p>
                    </div>
                    <div className="flex items-center justify-between text-xs font-mono pt-2 border-t border-neutral-950">
                      <span className="text-orange-500/80">Register Now</span>
                      <ArrowUpRight className="w-4 h-4 text-neutral-600 group-hover:text-orange-500 transition-colors" />
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="sm:col-span-2 border border-dashed border-neutral-900 rounded-xl p-8 text-center text-neutral-500 font-mono text-sm">
                All currently scheduled events are successfully completed. Stay tuned for new tracks!
              </div>
            )}
          </div>
        </section>

        {/* Projects Showcase */}
        <section className="space-y-8" id="projects-showcase-section">
          <div className="max-w-2xl space-y-2">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white font-mono border-l-4 border-orange-500 pl-3">
              Open-Source Initiatives
            </h2>
            <p className="text-neutral-400 text-sm md:text-base">
              These are utility systems built collaboratively by SBCE student teams to solve immediate campus and club logistical operations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6" id="projects-showcase-grid">
            {projects.map((proj, i) => (
              <div key={i} id={`project-card-${i}`} className="bg-zinc-950/40 border border-neutral-900 rounded-xl p-6 flex flex-col justify-between hover:border-neutral-800 transition-all group">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <FolderCode className="w-6 h-6 text-orange-500" />
                    <a href={proj.github} target="_blank" rel="noreferrer" className="p-1.5 rounded-full bg-neutral-900 text-neutral-400 hover:text-white transition-colors">
                      <Github className="w-4 h-4" />
                    </a>
                  </div>
                  <h3 className="text-lg font-bold text-white font-mono group-hover:text-orange-400 transition-colors">{proj.title}</h3>
                  <p className="text-neutral-400 text-xs leading-relaxed">{proj.description}</p>
                </div>
                <div className="flex flex-wrap gap-2 pt-6" id={`project-tags-${i}`}>
                  {proj.tags.map((tag, j) => (
                    <span key={j} className="font-mono text-[9px] text-neutral-500 px-2 py-0.5 bg-neutral-950 border border-neutral-900 rounded">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 4.2 Executive Committee Preview */}
        <section className="space-y-8" id="execom-preview-section">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="max-w-2xl space-y-2">
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white font-mono border-l-4 border-orange-500 pl-3">
                Leadership Board
              </h2>
              <p className="text-neutral-400 text-sm md:text-base">
                Meet the executive committee steering curriculum planning, workshop logistics, and student coordination.
              </p>
            </div>
            <button
              onClick={() => setTab('about')}
              className="px-4 py-2 text-xs font-mono text-neutral-400 hover:text-white border border-neutral-900 hover:border-neutral-800 rounded-lg transition-all focus:outline-none"
              id="view-full-team-btn"
            >
              Meet Full Committee
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6" id="execom-preview-grid">
            {committeePreview.map((mem) => (
              <div key={mem.id} id={`execom-member-${mem.id}`} className="bg-zinc-950/40 border border-neutral-900 rounded-xl overflow-hidden p-4 hover:border-neutral-800 transition-all group">
                <div className="aspect-square w-full rounded-lg overflow-hidden bg-neutral-950 mb-4 border border-neutral-900">
                  <img src={mem.image} alt={mem.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
                </div>
                <div className="space-y-2">
                  <span className="font-mono text-[10px] uppercase text-orange-500 tracking-wider font-bold">{mem.position}</span>
                  <h3 className="text-base font-bold text-white font-mono leading-tight">{mem.name}</h3>
                  <p className="text-neutral-500 text-xs line-clamp-2 leading-relaxed">{mem.bio}</p>

                  {/* Social links */}
                  <div className="flex items-center gap-3 pt-3 text-neutral-500 border-t border-neutral-950">
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
            ))}
          </div>
        </section>

        {/* Premium Footer */}
        <footer className="border-t border-neutral-900 pt-10 mt-16" id="home-footer">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 text-sm text-neutral-500" id="footer-grid">
            <div className="md:col-span-5 space-y-4">
              <span className="text-white font-mono font-bold tracking-tight text-base flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-orange-500"></span>
                CSE SBCE CODING CLUB
              </span>
              <p className="text-xs text-neutral-400 leading-relaxed max-w-sm">
                Sree Buddha College of Engineering, Alappuzha, Kerala. An active developer incubator organizing code seminars, cross-framework camps, and design sprint challenges.
              </p>
            </div>
            <div className="md:col-span-4 space-y-3">
              <span className="text-white text-xs uppercase font-mono tracking-wider">Campus Headquarters</span>
              <p className="text-xs text-neutral-400 leading-relaxed flex items-start gap-2">
                <MapPin className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
                <span>Department of Computer Science & Engineering,<br />Pattoor PO, Nooranad, Kerala 690529</span>
              </p>
            </div>
            <div className="md:col-span-3 space-y-3">
              <span className="text-white text-xs uppercase font-mono tracking-wider">Digital Outreach</span>
              <div className="flex gap-4">
                <a href={settings.socialLinks?.github} target="_blank" rel="noreferrer" className="hover:text-white transition-colors"><Github className="w-4 h-4" /></a>
                <a href={settings.socialLinks?.linkedin} target="_blank" rel="noreferrer" className="hover:text-white transition-colors"><Linkedin className="w-4 h-4" /></a>
                <a href={settings.socialLinks?.instagram} target="_blank" rel="noreferrer" className="hover:text-white transition-colors"><Instagram className="w-4 h-4" /></a>
                <a href={`mailto:${settings.socialLinks?.email}`} className="hover:text-white transition-colors"><Mail className="w-4 h-4" /></a>
              </div>
              <p className="text-xs text-neutral-400 pt-1 font-mono">
                {settings.socialLinks?.email || "codingclub@sbce.ac.in"}
              </p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-10 mt-10 border-t border-neutral-950 text-xs text-neutral-500" id="footer-bottom">
            <span className="font-mono">{settings.footerText || "© 2026 CSE SBCE Coding Club. Engineered for developers, by developers."}</span>
            <div className="flex gap-6 font-mono text-[10px]">
              <button onClick={() => setTab('admin')} className="hover:text-orange-500 transition-colors">Admin Portal</button>
              <span>v1.0.0</span>
            </div>
          </div>
        </footer>
      </div>{/* end constrained wrapper */}
    </div>
  );
}
