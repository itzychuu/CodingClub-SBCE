import React, { useState } from 'react';
import { Image, ChevronLeft, ChevronRight, Maximize2, Layers } from 'lucide-react';
import { GalleryItem, Event } from '../types';

interface GalleryViewProps {
  gallery: GalleryItem[];
  events: Event[];
}

export default function GalleryView({ gallery, events }: GalleryViewProps) {
  const [selectedAlbum, setSelectedAlbum] = useState<string>('all');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // Filter gallery items by album/event
  const filteredGallery = gallery.filter(item => {
    if (selectedAlbum === 'all') return true;
    return item.event_id === selectedAlbum;
  });

  // Get event title by event_id for labels
  const getEventTitle = (eventId: string) => {
    if (eventId === 'all' || eventId === 'general') return 'General Club Activities';
    const evt = events.find(e => e.id === eventId);
    return evt ? evt.title : 'Club Milestones';
  };

  // Lightbox Navigation
  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (lightboxIndex === null) return;
    setLightboxIndex(prev => (prev !== null && prev > 0 ? prev - 1 : filteredGallery.length - 1));
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (lightboxIndex === null) return;
    setLightboxIndex(prev => (prev !== null && prev < filteredGallery.length - 1 ? prev + 1 : 0));
  };

  return (
    <div className="space-y-12 pb-20" id="gallery-view">
      {/* 4.5 Header */}
      <div className="space-y-4 max-w-2xl" id="gallery-header">
        <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight font-mono border-l-4 border-orange-500 pl-4">
          Photo Gallery
        </h1>
        <p className="text-neutral-400 text-sm md:text-base leading-relaxed">
          Glimpse into our workshops, brainstorming huddles, inauguration assemblies, and collaborative team sprints.
        </p>
      </div>

      {/* Album Filters / Selector */}
      <div className="flex flex-wrap items-center gap-3 border-b border-neutral-900 pb-6" id="gallery-albums-bar">
        <div className="flex items-center gap-2 text-neutral-500 font-mono text-xs pr-4 border-r border-neutral-900 shrink-0">
          <Layers className="w-4 h-4 text-orange-500" />
          <span>Select Album:</span>
        </div>

        <button
          onClick={() => setSelectedAlbum('all')}
          className={`px-4 py-1.5 rounded-lg text-xs font-mono font-medium transition-all focus:outline-none ${
            selectedAlbum === 'all'
              ? 'bg-orange-600 text-black font-bold'
              : 'bg-zinc-950/40 border border-neutral-900 text-neutral-400 hover:text-white hover:border-neutral-800'
          }`}
          id="album-btn-all"
        >
          All Activities
        </button>

        {events.map(evt => (
          <button
            key={evt.id}
            id={`album-btn-${evt.id}`}
            onClick={() => setSelectedAlbum(evt.id)}
            className={`px-4 py-1.5 rounded-lg text-xs font-mono font-medium transition-all shrink-0 max-w-[200px] truncate focus:outline-none ${
              selectedAlbum === evt.id
                ? 'bg-orange-600 text-black font-bold'
                : 'bg-zinc-950/40 border border-neutral-900 text-neutral-400 hover:text-white hover:border-neutral-800'
            }`}
            title={evt.title}
          >
            {evt.title}
          </button>
        ))}
      </div>

      {/* Grid Layout of photos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6" id="gallery-grid">
        {filteredGallery.length > 0 ? (
          filteredGallery.map((item, idx) => (
            <div
              key={item.id}
              id={`gallery-item-card-${item.id}`}
              className="bg-zinc-950/40 border border-neutral-900 rounded-xl overflow-hidden p-2.5 hover:border-neutral-800 transition-all group cursor-pointer relative"
              onClick={() => setLightboxIndex(idx)}
            >
              <div className="aspect-[4/3] rounded-lg overflow-hidden bg-neutral-950 relative">
                <img
                  src={item.image_url}
                  alt={item.caption || "CSE SBCE Coding Club event capture"}
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="p-2 bg-black/85 border border-neutral-800 rounded-full text-white">
                    <Maximize2 className="w-4 h-4 text-orange-500" />
                  </div>
                </div>
              </div>

              {/* Caption and event label */}
              <div className="p-3 space-y-1.5">
                <span className="font-mono text-[9px] text-orange-500/80 uppercase block tracking-wider">
                  {getEventTitle(item.event_id)}
                </span>
                <p className="text-neutral-300 text-xs line-clamp-2 leading-relaxed">
                  {item.caption || "No description configured."}
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-4 border border-dashed border-neutral-850 rounded-xl p-16 text-center text-neutral-500 font-mono text-xs">
            No photographs have been uploaded to this specific album yet. Check back later!
          </div>
        )}
      </div>

      {/* Lightbox Modal overlay */}
      {lightboxIndex !== null && filteredGallery[lightboxIndex] && (
        <div
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/95 p-4"
          onClick={() => setLightboxIndex(null)}
          id="gallery-lightbox"
        >
          {/* Top Control Bar */}
          <div className="w-full max-w-4xl flex items-center justify-between text-white mb-4 z-10">
            <div className="font-mono text-xs text-neutral-400">
              Viewing photo <b className="text-orange-500">{lightboxIndex + 1}</b> of <b>{filteredGallery.length}</b>
            </div>
            <button
              id="lightbox-close-btn"
              onClick={() => setLightboxIndex(null)}
              className="px-4 py-1.5 bg-neutral-900 border border-neutral-800 hover:bg-neutral-800 text-white rounded-lg text-xs font-mono transition-colors focus:outline-none"
            >
              Close [Esc]
            </button>
          </div>

          {/* Core Image Slide Container */}
          <div className="relative w-full max-w-4xl max-h-[70vh] flex items-center justify-center">
            {/* Left navigation arrow */}
            <button
              id="lightbox-prev-btn"
              onClick={handlePrev}
              className="absolute left-2 md:-left-16 p-3 bg-neutral-900/85 border border-neutral-800 hover:bg-neutral-800 text-white rounded-full transition-all focus:outline-none"
            >
              <ChevronLeft className="w-5 h-5 text-orange-500" />
            </button>

            {/* Lightbox Image */}
            <img
              src={filteredGallery[lightboxIndex].image_url}
              alt={filteredGallery[lightboxIndex].caption || "Full size photo capture"}
              className="max-w-full max-h-[70vh] object-contain rounded-lg border border-neutral-900 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />

            {/* Right navigation arrow */}
            <button
              id="lightbox-next-btn"
              onClick={handleNext}
              className="absolute right-2 md:-right-16 p-3 bg-neutral-900/85 border border-neutral-800 hover:bg-neutral-800 text-white rounded-full transition-all focus:outline-none"
            >
              <ChevronRight className="w-5 h-5 text-orange-500" />
            </button>
          </div>

          {/* Bottom Info Card */}
          <div
            className="w-full max-w-4xl bg-zinc-950 border border-neutral-800 rounded-xl p-5 mt-6 space-y-2 text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <span className="font-mono text-[10px] text-orange-500 uppercase tracking-widest block font-bold">
              {getEventTitle(filteredGallery[lightboxIndex].event_id)}
            </span>
            <p className="text-neutral-300 text-sm leading-relaxed max-w-2xl mx-auto">
              {filteredGallery[lightboxIndex].caption || "SBCE Department of Computer Science & Engineering Coding Club."}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
