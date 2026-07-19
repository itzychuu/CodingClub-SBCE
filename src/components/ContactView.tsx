import React, { useState } from 'react';
import { Mail, Instagram, Linkedin, Github, MapPin, Send, HelpCircle, CheckCircle2 } from 'lucide-react';
import { Settings } from '../types';

interface ContactViewProps {
  settings: Settings;
}

export default function ContactView({ settings }: ContactViewProps) {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    setIsSubmitting(true);
    // Simulate API delay
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 1200);
  };

  const socials = settings.socialLinks || {
    email: "codingclub@sbce.ac.in",
    instagram: "https://instagram.com/sbce_codingclub",
    linkedin: "https://linkedin.com/company/sbce-codingclub",
    github: "https://github.com/sbce-codingclub",
    location: "Sree Buddha College of Engineering, Pattoor, Nooranad, Alappuzha, Kerala - 690529",
    mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3936.815309325603!2d76.6042171147889!3d9.171249993421379!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b06117f77777777%3A0x6b4f707cfbdfa9f7!2sSree%20Buddha%20College%20of%20Engineering%20%2C%20Pattoor!5e0!3m2!1sen!2sin!4v1626245999999!5m2!1sen!2sin"
  };

  return (
    <div className="space-y-12 pb-20" id="contact-view">
      {/* 4.6 Header */}
      <div className="space-y-4 max-w-2xl" id="contact-header">
        <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight font-mono border-l-4 border-orange-500 pl-4">
          Contact Headquarters
        </h1>
        <p className="text-neutral-400 text-sm md:text-base leading-relaxed">
          Have an inquiry regarding upcoming hackathons, sponsorship slots, coordinate roles, or certificate records? Shoot us a message below.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12" id="contact-grid">
        {/* Left column - details & map */}
        <div className="lg:col-span-5 space-y-8 flex flex-col justify-between" id="contact-details">
          <div className="space-y-6">
            <h2 className="text-lg font-bold font-mono text-white flex items-center gap-2">
              <span className="w-2.5 h-2.5 bg-orange-500 rounded-sm"></span>
              Connect Details
            </h2>

            <div className="space-y-4" id="contact-cards">
              {/* Location Card */}
              <div className="bg-zinc-950/40 border border-neutral-900 rounded-xl p-5 flex gap-4">
                <MapPin className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
                <div>
                  <span className="text-[10px] font-mono text-neutral-500 uppercase block">College Location</span>
                  <p className="text-neutral-300 text-xs leading-relaxed mt-1">{socials.location}</p>
                </div>
              </div>

              {/* Social Channels List */}
              <div className="grid grid-cols-2 gap-4">
                <a
                  href={`mailto:${socials.email}`}
                  className="bg-zinc-950/40 border border-neutral-900 rounded-xl p-4 flex flex-col items-center justify-center text-center hover:border-neutral-800 hover:bg-neutral-900/10 transition-all group"
                >
                  <Mail className="w-5 h-5 text-orange-500 mb-2" />
                  <span className="text-[10px] font-mono text-neutral-500 block">Email Desk</span>
                  <span className="text-white text-[11px] font-mono mt-1 truncate max-w-full">{socials.email}</span>
                </a>

                <a
                  href={socials.instagram}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-zinc-950/40 border border-neutral-900 rounded-xl p-4 flex flex-col items-center justify-center text-center hover:border-neutral-800 hover:bg-neutral-900/10 transition-all group"
                >
                  <Instagram className="w-5 h-5 text-orange-500 mb-2" />
                  <span className="text-[10px] font-mono text-neutral-500 block">Instagram</span>
                  <span className="text-white text-[11px] font-mono mt-1">@sbce_codingclub</span>
                </a>

                <a
                  href={socials.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-zinc-950/40 border border-neutral-900 rounded-xl p-4 flex flex-col items-center justify-center text-center hover:border-neutral-800 hover:bg-neutral-900/10 transition-all group"
                >
                  <Linkedin className="w-5 h-5 text-orange-500 mb-2" />
                  <span className="text-[10px] font-mono text-neutral-500 block">LinkedIn</span>
                  <span className="text-white text-[11px] font-mono mt-1">SBCE Coding Club</span>
                </a>

                <a
                  href={socials.github}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-zinc-950/40 border border-neutral-900 rounded-xl p-4 flex flex-col items-center justify-center text-center hover:border-neutral-800 hover:bg-neutral-900/10 transition-all group"
                >
                  <Github className="w-5 h-5 text-orange-500 mb-2" />
                  <span className="text-[10px] font-mono text-neutral-500 block">GitHub Organization</span>
                  <span className="text-white text-[11px] font-mono mt-1">sbce-codingclub</span>
                </a>
              </div>
            </div>
          </div>

          {/* Map Section */}
          <div className="space-y-3" id="map-section">
            <span className="text-[10px] font-mono text-neutral-500 uppercase block tracking-wider">SBCE Campus Location Map</span>
            <div className="relative border border-neutral-900 bg-zinc-950/40 p-2 rounded-xl overflow-hidden shadow-xl aspect-video w-full">
              <iframe
                title="SBCE Campus Location"
                src={socials.mapEmbedUrl}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="rounded-lg grayscale filter"
                id="contact-map-iframe"
              ></iframe>
            </div>
          </div>
        </div>

        {/* Right column - visual inquiry form */}
        <div className="lg:col-span-7 bg-zinc-950/40 border border-neutral-900 rounded-xl p-6 md:p-8 flex flex-col justify-between" id="inquiry-form-wrapper">
          <div className="space-y-6">
            <h2 className="text-lg font-bold font-mono text-white flex items-center gap-2">
              <span className="w-2.5 h-2.5 bg-orange-500 rounded-sm"></span>
              Send Inquiry Ticket
            </h2>

            {isSubmitted ? (
              <div className="py-12 flex flex-col items-center justify-center text-center space-y-4" id="form-success-state">
                <div className="p-3 bg-orange-500/10 border border-orange-500/20 text-orange-500 rounded-full animate-bounce">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-white font-mono">Inquiry Filed Successfully!</h3>
                  <p className="text-neutral-400 text-xs">Our core committee will review your ticket and reply back via email shortly.</p>
                </div>
                <button
                  id="reset-form-btn"
                  onClick={() => setIsSubmitted(false)}
                  className="px-4 py-2 border border-neutral-800 bg-black text-neutral-300 hover:text-white rounded-lg text-xs font-mono transition-colors focus:outline-none"
                >
                  Submit Another Ticket
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4" id="contact-inquiry-form">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono text-neutral-400" htmlFor="contact-name">Full Name *</label>
                    <input
                      id="contact-name"
                      type="text"
                      required
                      placeholder="e.g. Rahul Kumar"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-black border border-neutral-850 rounded-lg py-2 px-3 text-xs text-white placeholder-neutral-650 focus:outline-none focus:border-orange-500/50"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono text-neutral-400" htmlFor="contact-email">Email Address *</label>
                    <input
                      id="contact-email"
                      type="email"
                      required
                      placeholder="e.g. rahul@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-black border border-neutral-850 rounded-lg py-2 px-3 text-xs text-white placeholder-neutral-650 focus:outline-none focus:border-orange-500/50"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-neutral-400" htmlFor="contact-subject">Inquiry Subject</label>
                  <input
                    id="contact-subject"
                    type="text"
                    placeholder="e.g. Flutter bootcamp query / Sponsor details"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full bg-black border border-neutral-850 rounded-lg py-2 px-3 text-xs text-white placeholder-neutral-650 focus:outline-none focus:border-orange-500/50"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-neutral-400" htmlFor="contact-message">Detail Message *</label>
                  <textarea
                    id="contact-message"
                    required
                    rows={5}
                    placeholder="Describe your query in full detail so our committee can understand and respond appropriately..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full bg-black border border-neutral-850 rounded-lg py-2 px-3 text-xs text-white placeholder-neutral-650 focus:outline-none focus:border-orange-500/50"
                  ></textarea>
                </div>

                <button
                  id="submit-form-btn"
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-2.5 bg-orange-600 hover:bg-orange-500 text-black font-bold text-xs font-mono rounded-lg transition-all flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(255,107,0,0.15)] disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none"
                >
                  {isSubmitting ? (
                    <span>Dispatching Ticket...</span>
                  ) : (
                    <>
                      <span>Dispatch Message</span>
                      <Send className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

          <div className="border-t border-neutral-900/60 pt-5 mt-6 text-[11px] text-neutral-500 font-mono leading-relaxed flex items-start gap-2">
            <HelpCircle className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
            <span>Need immediate support on event logistics? Contact Department Secretary Dr. Saji V.R. or coordinators at the CSE office building directly.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
