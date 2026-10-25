
import {
  AudioLines,
  Compass,
  Heart,
  Home,
  Library,
  ListMusic,
  Music2,
  Play,
  Plus,
  Search,
  SkipBack,
  SkipForward,
  Volume2,
} from "lucide-react";

const mixes = [
  { title: "Night Drive", subtitle: "Late-night frequencies", color: "#8B5CF6" },
  { title: "Underground", subtitle: "Outside the mainstream", color: "#D7FF38" },
  { title: "After Hours", subtitle: "No sleep. Just sound.", color: "#FF4FA3" },
  { title: "Heavy Rotation", subtitle: "Your daily soundtrack", color: "#FF7A35" },
];

function App() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#f5f0e8]">
      <aside className="fixed inset-y-0 left-0 hidden w-60 border-r border-white/10 bg-[#0d0d0d] p-6 md:flex md:flex-col">
        <a href="#" className="mb-12 flex items-center gap-3 text-3xl font-black tracking-tighter">
          <AudioLines className="text-[#D7FF38]" size={30} />
          LOUD<span className="text-[#D7FF38]">.</span>
        </a>

        <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-white/35">
          Menu
        </p>
        <nav className="space-y-2">
          {[
            { label: "Home", icon: Home },
            { label: "Discover", icon: Compass },
            { label: "Search", icon: Search },
            { label: "Your Library", icon: Library },
          ].map(({ label, icon: Icon }, index) => (
            <button
              key={label}
              className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm ${
                index === 0
                  ? "bg-[#D7FF38] font-bold text-black"
                  : "text-white/55 transition hover:bg-white/5 hover:text-white"
              }`}
            >
              <Icon size={19} />
              {label}
            </button>
          ))}
        </nav>

        <div className="mt-10">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/35">
              Your playlists
            </p>
            <button aria-label="Create playlist" className="text-white/50 hover:text-[#D7FF38]">
              <Plus size={18} />
            </button>
          </div>
          {["Liked tracks", "Midnight files", "Bass culture"].map((name) => (
            <button key={name} className="flex w-full items-center gap-3 py-3 text-sm text-white/55 hover:text-white">
              <ListMusic size={17} />
              {name}
            </button>
          ))}
        </div>

        <div className="mt-auto rounded-2xl border border-white/10 bg-white/[0.03] p-4">
          <AudioLines className="mb-3 text-[#D7FF38]" size={22} />
          <p className="font-bold">Your music. Your rules.</p>
          <p className="mt-1 text-xs leading-5 text-white/45">
            Your personal universe of sound starts here.
          </p>
        </div>
      </aside>

      <main className="px-5 pb-36 pt-7 md:ml-60 md:px-10 md:pt-10">
        <header className="mb-10 flex items-center justify-between gap-4">
          <div className="md:hidden">
            <p className="text-2xl font-black tracking-tighter">
              LOUD<span className="text-[#D7FF38]">.</span>
            </p>
          </div>
          <div className="hidden text-sm text-white/40 md:block">
            YOUR SOUND. YOUR RULES.
          </div>
          <button className="flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-sm text-white/70 hover:border-[#D7FF38]/50">
            <Search size={16} />
            Find your frequency
          </button>
        </header>

        <section className="relative mb-12 overflow-hidden rounded-3xl border border-white/10 bg-[#151515] p-7 md:p-12">
          <div className="pointer-events-none absolute -right-16 -top-24 h-64 w-64 rounded-full bg-[#D7FF38]/10 blur-[90px]" />
          <div className="relative max-w-2xl">
            <span className="inline-flex rounded-full border border-[#D7FF38]/30 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-[#D7FF38]">
              Your personal sound system
            </span>
            <h1 className="mt-6 text-5xl font-black leading-[0.95] tracking-[-0.07em] md:text-7xl">
              TURN IT
              <br />
              <span className="text-[#D7FF38]">UP.</span>
            </h1>
            <p className="mt-5 max-w-md text-sm leading-6 text-white/50 md:text-base">
              Your music. Your discoveries. Your world. Everything starts with a sound.
            </p>
            <button className="mt-7 inline-flex items-center gap-2 rounded-full bg-[#D7FF38] px-6 py-3 text-sm font-black text-black transition hover:scale-[1.03]">
              <Play size={17} fill="currentColor" />
              Explore your sound
            </button>
          </div>
          <div className="pointer-events-none absolute bottom-8 right-8 hidden items-end gap-1 md:flex">
            {[28, 52, 36, 76, 45, 94, 58, 35, 68, 42, 83, 28].map((height, i) => (
              <div
                key={i}
                className="w-2 rounded-full bg-[#D7FF38]/70"
                style={{ height }}
              />
            ))}
          </div>
        </section>

        <section className="mb-12">
          <div className="mb-5 flex items-end justify-between">
            <div>
              <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.25em] text-[#D7FF38]">
                Curated by you
              </p>
              <h2 className="text-2xl font-black tracking-tight md:text-3xl">
                Your frequencies
              </h2>
            </div>
            <button className="text-xs font-bold text-white/45 hover:text-[#D7FF38]">
              VIEW ALL
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {mixes.map((mix, index) => (
              <button
                key={mix.title}
                className="group rounded-2xl border border-white/10 bg-white/[0.03] p-3 text-left transition hover:-translate-y-1 hover:border-white/25 hover:bg-white/[0.06]"
              >
                <div
                  className="relative mb-4 flex aspect-square items-center justify-center overflow-hidden rounded-xl"
                  style={{ backgroundColor: `${mix.color}18` }}
                >
                  <div
                    className="absolute h-28 w-28 rounded-full blur-2xl opacity-30"
                    style={{ backgroundColor: mix.color }}
                  />
                  {index % 2 === 0 ? (
                    <AudioLines size={54} strokeWidth={1.3} style={{ color: mix.color }} />
                  ) : (
                    <Music2 size={54} strokeWidth={1.3} style={{ color: mix.color }} />
                  )}
                  <span className="absolute bottom-3 right-3 flex h-10 w-10 translate-y-2 items-center justify-center rounded-full bg-[#D7FF38] text-black opacity-0 shadow-xl transition group-hover:translate-y-0 group-hover:opacity-100">
                    <Play size={17} fill="currentColor" />
                  </span>
                </div>
                <h3 className="font-bold">{mix.title}</h3>
                <p className="mt-1 text-xs text-white/40">{mix.subtitle}</p>
              </button>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-dashed border-white/15 p-6 md:p-8">
          <div className="flex items-start gap-4">
            <div className="rounded-xl bg-[#8B5CF6]/15 p-3 text-[#8B5CF6]">
              <Library size={23} />
            </div>
            <div>
              <h2 className="text-lg font-bold">Your library, your universe.</h2>
              <p className="mt-2 max-w-lg text-sm leading-6 text-white/45">
                Next up: connect your own music library and build a player for your tracks.
              </p>
            </div>
          </div>
        </section>
      </main>

      <footer className="fixed inset-x-0 bottom-0 z-20 border-t border-white/10 bg-[#101010]/95 px-4 py-4 backdrop-blur-xl md:left-60 md:px-8">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-[#D7FF38]/10 text-[#D7FF38]">
              <Music2 size={21} />
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-bold">Nothing playing yet</p>
              <p className="truncate text-xs text-white/40">Choose your first track</p>
            </div>
            <button aria-label="Like track" className="hidden text-white/40 hover:text-[#FF4FA3] sm:block">
              <Heart size={18} />
            </button>
          </div>

          <div className="flex shrink-0 items-center gap-5">
            <button aria-label="Previous track" className="hidden text-white/40 sm:block">
              <SkipBack size={19} />
            </button>
            <button aria-label="Play" className="flex h-10 w-10 items-center justify-center rounded-full bg-[#D7FF38] text-black">
              <Play size={18} fill="currentColor" />
            </button>
            <button aria-label="Next track" className="hidden text-white/40 sm:block">
              <SkipForward size={19} />
            </button>
          </div>

          <div className="hidden w-28 items-center gap-2 text-white/45 lg:flex">
            <Volume2 size={18} />
            <div className="h-1 flex-1 rounded-full bg-white/15">
              <div className="h-full w-2/3 rounded-full bg-[#D7FF38]" />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
