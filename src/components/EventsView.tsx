import React, { useState } from 'react';
import { Search, Filter, Calendar, MapPin, User, ArrowRight, Download, Info, ExternalLink } from 'lucide-react';
import { Event } from '../types';

interface EventsViewProps {
  events: Event[];
  onSelectEvent: (event: Event) => void;
  selectedEvent: Event | null;
  onCloseModal: () => void;
}

type EventFilterType = 'All' | 'Upcoming' | 'Ongoing' | 'Completed' | 'Workshops' | 'Hackathons' | 'Bootcamps' | 'Competitions' | 'Talks';

export default function EventsView({ events, onSelectEvent, selectedEvent, onCloseModal }: EventsViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState<EventFilterType>('All');

  // Derive categories from tags or titles
  const matchesCategory = (evt: Event, filter: EventFilterType) => {
    if (filter === 'All') return true;
    if (filter === 'Upcoming') return evt.status === 'Upcoming';
    if (filter === 'Ongoing') return evt.status === 'Ongoing';
    if (filter === 'Completed') return evt.status === 'Completed';
    
    const titleLower = evt.title.toLowerCase();
    const descLower = evt.description.toLowerCase();
    
    if (filter === 'Workshops') {
      return titleLower.includes('workshop') || descLower.includes('workshop') || titleLower.includes('bootcamp') || titleLower.includes('course');
    }
    if (filter === 'Hackathons') {
      return titleLower.includes('hackathon') || titleLower.includes('hack') || titleLower.includes('fest');
    }
    if (filter === 'Bootcamps') {
      return titleLower.includes('bootcamp') || titleLower.includes('camp');
    }
    if (filter === 'Competitions') {
      return titleLower.includes('competition') || titleLower.includes('contest') || titleLower.includes('challenge');
    }
    if (filter === 'Talks') {
      return titleLower.includes('talk') || titleLower.includes('speaker') || titleLower.includes('seminar') || titleLower.includes('intro');
    }
    return true;
  };

  const filteredEvents = events.filter(evt => {
    const matchesSearch = evt.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          evt.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          evt.speaker.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = matchesCategory(evt, activeFilter);
    return matchesSearch && matchesCat;
  });

  const filterOptions: EventFilterType[] = ['All', 'Upcoming', 'Ongoing', 'Completed', 'Workshops', 'Hackathons', 'Bootcamps', 'Competitions', 'Talks'];

  return (
    <div className="space-y-12 pb-20" id="events-view">
      {/* Page Header */}
      <div className="space-y-4 max-w-2xl" id="events-header">
        <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight font-mono border-l-4 border-orange-500 pl-4">
          Events Directory
        </h1>
        <p className="text-neutral-400 text-sm md:text-base leading-relaxed">
          Browse our calendar of code-along sessions, national sprint hackathons, algorithmic bootcamps, and developer panel seminars.
        </p>
      </div>

      {/* Filters and Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-zinc-950/40 p-4 border border-neutral-900 rounded-xl" id="events-filter-bar">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
          <input
            id="event-search-input"
            type="text"
            placeholder="Search titles, speakers, descriptions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-black border border-neutral-800 rounded-lg py-2.5 pl-10 pr-4 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-orange-500/50 transition-colors"
          />
        </div>

        {/* Filter Indicator */}
        <div className="flex items-center gap-2 text-neutral-500 font-mono text-xs">
          <Filter className="w-3.5 h-3.5" />
          <span>Active Filter: <b className="text-orange-500">{activeFilter}</b></span>
        </div>
      </div>

      {/* Tabs Filter Row */}
      <div className="flex flex-wrap gap-2 overflow-x-auto pb-2 scrollbar-none" id="events-filter-tags">
        {filterOptions.map((opt) => (
          <button
            key={opt}
            id={`filter-opt-${opt}`}
            onClick={() => setActiveFilter(opt)}
            className={`px-4 py-1.5 text-xs font-mono font-medium rounded-full border transition-all shrink-0 focus:outline-none ${
              activeFilter === opt
                ? 'border-orange-500 text-orange-500 bg-orange-500/5'
                : 'border-neutral-900 bg-zinc-950/20 text-neutral-400 hover:text-white hover:border-neutral-800'
            }`}
          >
            {opt}
          </button>
        ))}
      </div>

      {/* Events Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8" id="events-grid">
        {filteredEvents.length > 0 ? (
          filteredEvents.map((evt) => {
            const isCompleted = evt.status === 'Completed';
            const isUpcoming = evt.status === 'Upcoming';
            const isOngoing = evt.status === 'Ongoing';

            return (
              <div
                key={evt.id}
                id={`event-card-${evt.id}`}
                className="bg-zinc-950/40 border border-neutral-900 rounded-xl overflow-hidden hover:border-neutral-800 transition-all flex flex-col justify-between h-[520px] group relative"
              >
                {/* Image Section */}
                <div className="aspect-video relative overflow-hidden bg-neutral-950">
                  <img
                    src={evt.banner}
                    alt={evt.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {/* Status Badge */}
                  <span
                    className={`absolute top-4 right-4 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider font-mono rounded ${
                      isCompleted
                        ? 'bg-neutral-800 text-neutral-400 border border-neutral-700'
                        : isOngoing
                        ? 'bg-orange-600/20 text-orange-400 border border-orange-500/30'
                        : 'bg-white text-black border border-white'
                    }`}
                  >
                    {evt.status}
                  </span>
                </div>

                {/* Details Section */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] text-neutral-500 font-mono">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-orange-500/70" />
                        {evt.date}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-orange-500/70" />
                        {evt.venue}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-white font-mono leading-tight group-hover:text-orange-500 transition-colors line-clamp-1">
                      {evt.title}
                    </h3>
                    <p className="text-neutral-400 text-xs leading-relaxed line-clamp-3">
                      {evt.description}
                    </p>

                    <div className="flex items-center gap-2 pt-2 text-[11px] text-neutral-400 font-mono bg-neutral-950/40 p-2 rounded border border-neutral-900/50">
                      <User className="w-3.5 h-3.5 text-orange-500 shrink-0" />
                      <span className="line-clamp-1">Speaker: <b className="text-white">{evt.speaker || 'TBD'}</b></span>
                    </div>
                  </div>

                  {/* Actions Row */}
                  <div className="grid grid-cols-12 gap-2 pt-4 border-t border-neutral-900/60 mt-4">
                    <button
                      id={`event-details-btn-${evt.id}`}
                      onClick={() => onSelectEvent(evt)}
                      className="col-span-3 p-2 bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white rounded-lg border border-neutral-800 transition-all text-xs flex items-center justify-center gap-1 focus:outline-none"
                      title="View Details"
                    >
                      <Info className="w-4 h-4" />
                    </button>

                    {isCompleted ? (
                      <a
                        href={evt.certificate_link || '#'}
                        target="_blank"
                        rel="noreferrer"
                        onClick={(e) => {
                          if (!evt.certificate_link) {
                            e.preventDefault();
                            alert("Certificate link has not been configured by Admin yet.");
                          }
                        }}
                        className={`col-span-9 py-2 px-3 rounded-lg font-mono text-xs font-bold text-center flex items-center justify-center gap-2 border transition-all ${
                          evt.certificate_link
                            ? 'bg-neutral-800 hover:bg-neutral-700 text-white border-neutral-700 shadow-lg'
                            : 'bg-neutral-950 text-neutral-600 border-neutral-900 cursor-not-allowed'
                        }`}
                        id={`event-cert-btn-${evt.id}`}
                      >
                        <Download className="w-3.5 h-3.5" />
                        Certificates
                      </a>
                    ) : (
                      <a
                        href={evt.registration_link || '#'}
                        target="_blank"
                        rel="noreferrer"
                        onClick={(e) => {
                          if (!evt.registration_link) {
                            e.preventDefault();
                            alert("Registration link has not been set by Admin yet.");
                          }
                        }}
                        className={`col-span-9 py-2 px-3 rounded-lg font-mono text-xs font-bold text-center flex items-center justify-center gap-2 transition-all ${
                          evt.registration_link
                            ? 'bg-orange-600 hover:bg-orange-500 text-black shadow-[0_0_15px_rgba(255,107,0,0.15)]'
                            : 'bg-neutral-950 text-neutral-600 border border-neutral-900 cursor-not-allowed'
                        }`}
                        id={`event-reg-btn-${evt.id}`}
                      >
                        Register
                        <ArrowRight className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-span-3 border border-dashed border-neutral-800 rounded-xl p-12 text-center text-neutral-500 font-mono text-sm">
            No events match your current filter criteria or search. Try updating your terms!
          </div>
        )}
      </div>

      {/* Detailed Modal/Drawer overlay */}
      {selectedEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm" id="event-detail-modal">
          <div className="w-full max-w-2xl bg-zinc-950 border border-neutral-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            {/* Header */}
            <div className="aspect-video relative bg-neutral-950 border-b border-neutral-900">
              <img src={selectedEvent.banner} alt={selectedEvent.title} className="w-full h-full object-cover" />
              <button
                id="close-modal-btn"
                onClick={onCloseModal}
                className="absolute top-4 right-4 p-2 bg-black/80 hover:bg-black text-white rounded-full border border-neutral-800 transition-colors focus:outline-none"
              >
                ✕
              </button>
              <span className="absolute bottom-4 left-4 px-2.5 py-0.5 bg-orange-600 text-black text-xs font-bold uppercase tracking-wider font-mono rounded">
                {selectedEvent.status}
              </span>
            </div>

            {/* Scrollable details container */}
            <div className="p-6 md:p-8 space-y-6 overflow-y-auto">
              <div className="space-y-2">
                <div className="flex flex-wrap gap-4 text-xs font-mono text-neutral-400">
                  <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4 text-orange-500" /> {selectedEvent.date} ({selectedEvent.time})</span>
                  <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-orange-500" /> {selectedEvent.venue}</span>
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-white font-mono">{selectedEvent.title}</h2>
              </div>

              <div className="space-y-2">
                <span className="text-xs font-mono text-neutral-500 uppercase tracking-widest block">Speaker / Host Panel</span>
                <div className="flex items-center gap-3 bg-black border border-neutral-900 p-3 rounded-lg">
                  <div className="p-1.5 rounded bg-orange-500/5 border border-orange-500/20 text-orange-500">
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white font-mono">{selectedEvent.speaker || 'To Be Announced'}</p>
                    <p className="text-[10px] text-neutral-500 font-mono">Invited Technical Expert</p>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-xs font-mono text-neutral-500 uppercase tracking-widest block">Syllabus & Activity Roadmap</span>
                <p className="text-neutral-300 text-sm leading-relaxed whitespace-pre-line">{selectedEvent.description}</p>
              </div>

              {/* CTAs */}
              <div className="pt-6 border-t border-neutral-900 flex items-center justify-end gap-3">
                <button
                  id="modal-cancel-btn"
                  onClick={onCloseModal}
                  className="px-4 py-2 text-xs font-mono text-neutral-400 hover:text-white transition-colors"
                >
                  Close
                </button>

                {selectedEvent.status === 'Completed' ? (
                  <a
                    href={selectedEvent.certificate_link || '#'}
                    target="_blank"
                    rel="noreferrer"
                    onClick={(e) => {
                      if (!selectedEvent.certificate_link) {
                        e.preventDefault();
                        alert("Certificate folder has not been added yet.");
                      }
                    }}
                    className={`px-5 py-2.5 font-mono text-xs font-bold rounded-lg flex items-center gap-2 border transition-all ${
                      selectedEvent.certificate_link
                        ? 'bg-orange-600 hover:bg-orange-500 text-black font-bold'
                        : 'bg-neutral-950 text-neutral-700 border-neutral-900 cursor-not-allowed'
                    }`}
                    id="modal-certificate-link"
                  >
                    <Download className="w-4 h-4" />
                    Download Certificates
                  </a>
                ) : (
                  <a
                    href={selectedEvent.registration_link || '#'}
                    target="_blank"
                    rel="noreferrer"
                    onClick={(e) => {
                      if (!selectedEvent.registration_link) {
                        e.preventDefault();
                        alert("Registration form link has not been setup yet.");
                      }
                    }}
                    className={`px-5 py-2.5 font-mono text-xs font-bold rounded-lg flex items-center gap-2 transition-all ${
                      selectedEvent.registration_link
                        ? 'bg-orange-600 hover:bg-orange-500 text-black font-bold'
                        : 'bg-neutral-950 text-neutral-700 border border-neutral-900 cursor-not-allowed'
                    }`}
                    id="modal-registration-link"
                  >
                    Complete Form Registration
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
