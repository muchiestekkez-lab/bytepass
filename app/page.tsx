import Link from 'next/link';
import { PLATFORMS } from '@/lib/platforms';

// ── Landing Page ──────────────────────────────────────────
export default function LandingPage() {
  return (
    <div className="min-h-screen animated-bg overflow-x-hidden">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-5 max-w-6xl mx-auto">
        <span className="font-display text-2xl font-black gradient-text bg-gradient-to-r from-[#FF6EC7] via-[#7B61FF] to-[#00D1FF]">
          Cloud Trip ☁️✈️
        </span>
        <div className="flex gap-3">
          <Link
            href="/login"
            className="px-5 py-2 rounded-full text-sm font-semibold text-slate-700 hover:bg-white/60 transition-all"
          >
            Login
          </Link>
          <Link
            href="/register"
            className="px-5 py-2 rounded-full text-sm font-bold bg-gradient-to-r from-[#FF6EC7] to-[#7B61FF] text-white shadow-md hover:shadow-lg hover:scale-105 transition-all"
          >
            Get Passport
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="text-center py-20 px-6 max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 bg-white/60 backdrop-blur-sm border border-white/50 rounded-full px-4 py-1.5 text-sm font-medium text-slate-600 mb-8 shadow-sm">
          <span className="animate-pulse">✨</span> Your digital scrapbook starts here
        </div>

        <h1 className="font-display text-6xl md:text-7xl font-black leading-tight mb-6">
          <span className="gradient-text bg-gradient-to-r from-[#FF6EC7] via-[#7B61FF] to-[#00D1FF]">
            Stamp Your
          </span>
          <br />
          <span className="text-slate-800">Internet.</span>
        </h1>

        <p className="text-xl text-slate-600 max-w-xl mx-auto mb-10 leading-relaxed">
          Create your Internet Passport. Log flights between platforms.
          Collect stamps. Share your chaotic digital journey with the world.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/register"
            className="px-8 py-4 rounded-2xl font-bold text-lg bg-gradient-to-r from-[#FF6EC7] to-[#7B61FF] text-white shadow-xl hover:shadow-glow-pink hover:scale-105 transition-all duration-200"
          >
            Get My Passport 🛂
          </Link>
          <Link
            href="/login"
            className="px-8 py-4 rounded-2xl font-bold text-lg bg-white/70 text-slate-700 border border-white/60 shadow-md hover:bg-white hover:scale-105 transition-all duration-200"
          >
            Already have one?
          </Link>
        </div>

        {/* Floating emoji decorations */}
        <div className="relative mt-16 h-20 select-none pointer-events-none">
          <span className="absolute left-1/4 text-4xl animate-float" style={{ animationDelay: '0s' }}>✈️</span>
          <span className="absolute left-1/2 -translate-x-1/2 text-4xl animate-float" style={{ animationDelay: '2s' }}>🛂</span>
          <span className="absolute right-1/4 text-4xl animate-float" style={{ animationDelay: '4s' }}>🌍</span>
        </div>
      </section>

      {/* Platform Stamps Preview */}
      <section className="py-16 px-6 max-w-5xl mx-auto">
        <p className="text-center text-sm font-semibold uppercase tracking-widest text-slate-400 mb-8">
          9 Platforms. Infinite routes.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          {PLATFORMS.map((p) => (
            <div
              key={p.slug}
              className={`bg-gradient-to-br ${p.gradient} w-20 h-20 rounded-2xl flex flex-col items-center justify-center shadow-lg hover:scale-110 transition-all duration-200 cursor-default`}
            >
              <span className="text-2xl">{p.emoji}</span>
              <span className="text-white text-[10px] font-bold mt-1 opacity-90 truncate px-1">
                {p.name.split('/')[0]}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-6 max-w-5xl mx-auto">
        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              emoji: '🗺️',
              title: 'Log Flights',
              desc: 'Moving from Twitter drama to LinkedIn cringe? Log that flight. Add your reason. Get a boarding pass.',
              color: 'from-pink-100 to-purple-100',
            },
            {
              emoji: '📬',
              title: 'Collect Stamps',
              desc: 'Each platform you visit earns you a stamp. Fill your passport grid. Flex your digital mileage.',
              color: 'from-cyan-100 to-blue-100',
            },
            {
              emoji: '🎫',
              title: 'Share Boarding Passes',
              desc: 'Every flight generates a colorful boarding pass card. Screenshot it. Post it. Go viral.',
              color: 'from-yellow-100 to-orange-100',
            },
          ].map((f) => (
            <div
              key={f.title}
              className={`bg-gradient-to-br ${f.color} rounded-3xl p-7 border border-white/60 shadow-card hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300`}
            >
              <div className="text-4xl mb-4">{f.emoji}</div>
              <h3 className="font-display text-xl font-bold mb-2 text-slate-800">{f.title}</h3>
              <p className="text-slate-600 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Citizen Levels */}
      <section className="py-16 px-6 max-w-3xl mx-auto text-center">
        <h2 className="font-display text-3xl font-black text-slate-800 mb-3">
          Earn Your Rank
        </h2>
        <p className="text-slate-500 mb-10">The more you fly, the higher you climb.</p>
        <div className="flex flex-wrap justify-center gap-3">
          {[
            { title: 'Explorer', emoji: '🔭', flights: '0 flights' },
            { title: 'Scroll Rookie', emoji: '📜', flights: '1+ flights' },
            { title: 'Digital Nomad', emoji: '🌍', flights: '5+ flights' },
            { title: 'Meme Pilot', emoji: '✈️', flights: '15+ flights' },
            { title: 'Byte Captain', emoji: '🚀', flights: '30+ flights' },
            { title: 'Internet Legend', emoji: '🌌', flights: '50+ flights' },
          ].map((level) => (
            <div
              key={level.title}
              className="bg-white/70 border border-white/60 rounded-2xl px-5 py-3 shadow-sm flex items-center gap-2 hover:scale-105 transition-all"
            >
              <span className="text-xl">{level.emoji}</span>
              <div className="text-left">
                <div className="font-bold text-sm text-slate-800">{level.title}</div>
                <div className="text-xs text-slate-400">{level.flights}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 text-center">
        <div className="max-w-xl mx-auto bg-gradient-to-br from-[#FF6EC7] to-[#7B61FF] rounded-3xl p-10 shadow-glow-purple text-white">
          <h2 className="font-display text-4xl font-black mb-4">Ready to stamp the internet?</h2>
          <p className="opacity-80 mb-8">
            It takes 30 seconds. No credit card. Just vibes.
          </p>
          <Link
            href="/register"
            className="inline-block bg-white text-[#7B61FF] font-bold px-8 py-4 rounded-2xl text-lg hover:scale-105 shadow-lg transition-all"
          >
            Create My Passport →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center py-8 text-sm text-slate-400">
        Cloud Trip © {new Date().getFullYear()} · Stamp Your Internet ✈️
      </footer>
    </div>
  );
}
