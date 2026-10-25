
import { useEffect, useRef, useState } from "react";
import {
  AudioLines,
  Compass,
  Heart,
  Home,
  Library,
  ListMusic,
  Music2,
  Pause,
  Play,
  Plus,
  Search,
  SkipBack,
  SkipForward,
  Volume2,
} from "lucide-react";

const tracks = [
  { title: "Your First Track", artist: "LOUD. Library", src: "/audio/sample.mp4" },
  { title: "Second Track", artist: "LOUD. Library", src: "/audio/second.mp4" },
];

const mixes = [
  { title: "Night Drive", subtitle: "Late-night frequencies", color: "#8B5CF6" },
  { title: "Underground", subtitle: "Outside the mainstream", color: "#D7FF38" },
  { title: "After Hours", subtitle: "No sleep. Just sound.", color: "#FF4FA3" },
  { title: "Heavy Rotation", subtitle: "Your daily soundtrack", color: "#FF7A35" },
];

const formatTime = (seconds: number) => {
  if (!Number.isFinite(seconds)) return "0:00";
  return `${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2, "0")}`;
};

export default function App() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const autoplayRef = useRef(false);

  const [trackIndex, setTrackIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved: unknown = JSON.parse(localStorage.getItem("loud-favorites") || "[]");
      return Array.isArray(saved)
        ? saved.filter(
            (item): item is string =>
              typeof item === "string" && tracks.some((track) => track.src === item)
          )
        : [];
    } catch {
      return [];
    }
  });

  const currentTrack = tracks[trackIndex];

  const filteredTracks = tracks.filter((track) =>
    `${track.title} ${track.artist}`
      .toLowerCase()
      .includes(searchQuery.trim().toLowerCase())
  );

  useEffect(() => {
    try {
      localStorage.setItem("loud-favorites", JSON.stringify(favorites));
    } catch {
      // Keep the app usable if browser storage is unavailable.
    }
  }, [favorites]);

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !autoplayRef.current) return;

    autoplayRef.current = false;
    audio.load();

    void audio.play().then(() => {
      setPlaying(true);
    }).catch(() => {
      setPlaying(false);
      setError("Playback failed. Check the media file and try again.");
    });
  }, [trackIndex]);

  async function togglePlay() {
    const audio = audioRef.current;
    if (!audio) return;

    setError("");

    if (audio.paused) {
      if (audio.ended) audio.currentTime = 0;

      try {
        await audio.play();
        setPlaying(true);
      } catch {
        setPlaying(false);
        setError("Playback failed. Check the media file and try again.");
      }
    } else {
      audio.pause();
      setPlaying(false);
    }
  }

  function selectTrack(index: number) {
    const nextIndex = (index + tracks.length) % tracks.length;

    if (nextIndex === trackIndex) {
      void togglePlay();
      return;
    }

    autoplayRef.current = true;
    setTrackIndex(nextIndex);
    setPlaying(true);
    setTime(0);
    setDuration(0);
    setError("");
  }

  function toggleFavorite(src: string) {
    setFavorites((saved) =>
      saved.includes(src)
        ? saved.filter((item) => item !== src)
        : [...saved, src]
    );
  }

  function seek(value: number) {
    const audio = audioRef.current;
    if (!audio || !Number.isFinite(audio.duration)) return;

    audio.currentTime = value;
    setTime(value);
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#f5f0e8]">
      <audio
        ref={audioRef}
        src={currentTrack.src}
        preload="metadata"
        onTimeUpdate={(e) => setTime(e.currentTarget.currentTime)}
        onLoadedMetadata={(e) => {
          setDuration(Number.isFinite(e.currentTarget.duration) ? e.currentTarget.duration : 0);
          e.currentTarget.volume = volume;
        }}
        onEnded={() => {
          if (trackIndex < tracks.length - 1) {
            selectTrack(trackIndex + 1);
          } else {
            setPlaying(false);
            setTime(0);
          }
        }}
        onError={() => {
          setPlaying(false);
          setError(`Couldn't load ${currentTrack.title}. Check its file and format.`);
        }}
      />

      <aside className="fixed inset-y-0 left-0 hidden w-60 flex-col border-r border-white/10 bg-[#0d0d0d] p-6 md:flex">
        <a href="#" className="mb-12 flex items-center gap-3 text-3xl font-black tracking-tighter">
          <AudioLines size={30} className="text-[#D7FF38]" />
          LOUD<span className="text-[#D7FF38]">.</span>
        </a>

        <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-white/35">Menu</p>

        <nav className="space-y-2">
          {[
            { label: "Home", icon: Home },
            { label: "Discover", icon: Compass },
            { label: "Search", icon: Search },
            { label: "Your Library", icon: Library },
          ].map(({ label, icon: Icon }, i) => (
            <button
              key={label}
              onClick={() => {
                if (label === "Search") document.querySelector<HTMLInputElement>("#music-search")?.focus();
                if (label === "Your Library") document.querySelector("#queue")?.scrollIntoView({ behavior: "smooth" });
                if (label === "Home") window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm ${
                i === 0
                  ? "bg-[#D7FF38] font-bold text-black"
                  : "text-white/55 hover:bg-white/5 hover:text-white"
              }`}
            >
              <Icon size={19} />
              {label}
            </button>
          ))}
        </nav>

        <div className="mt-10">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/35">Your playlists</p>
            <button aria-label="Create playlist" className="text-white/50 hover:text-[#D7FF38]">
              <Plus size={18} />
            </button>
          </div>

          {["Liked tracks", "Midnight files", "Bass culture"].map((name) => (
            <div key={name} className="flex items-center gap-3 py-3 text-sm text-white/55">
              <ListMusic size={17} />
              {name}
            </div>
          ))}
        </div>

        <div className="mt-auto rounded-2xl border border-white/10 p-4">
          <AudioLines size={22} className="mb-3 text-[#D7FF38]" />
          <p className="font-bold">Your music. Your rules.</p>
          <p className="mt-1 text-xs leading-5 text-white/45">Your personal universe of sound starts here.</p>
        </div>
      </aside>

      <main className="px-4 pb-40 pt-6 sm:px-6 md:ml-60 md:px-10 md:pt-10">
        <header className="mb-8 flex items-center justify-between gap-3">
          <a href="#" className="text-2xl font-black tracking-tighter md:hidden">
            LOUD<span className="text-[#D7FF38]">.</span>
          </a>
          <p className="hidden text-sm text-white/40 md:block">YOUR SOUND. YOUR RULES.</p>

          <label className="flex min-w-0 items-center gap-2 rounded-full border border-white/10 px-3 py-2 text-white/60 focus-within:border-[#D7FF38]/50 sm:w-72">
            <Search size={16} className="shrink-0" />
            <input
              id="music-search"
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search your music..."
              aria-label="Search tracks"
              className="w-full min-w-0 bg-transparent text-xs text-white outline-none placeholder:text-white/40 sm:text-sm"
            />
          </label>
        </header>

        <nav className="mb-8 flex gap-2 overflow-x-auto md:hidden">
          {[
            { label: "Home", icon: Home },
            { label: "Discover", icon: Compass },
            { label: "Library", icon: Library },
          ].map(({ label, icon: Icon }, i) => (
            <button
              key={label}
              onClick={() => {
                if (label === "Library") document.querySelector("#queue")?.scrollIntoView({ behavior: "smooth" });
                if (label === "Home") window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className={`flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-sm ${
                i === 0 ? "bg-[#D7FF38] font-bold text-black" : "bg-white/5 text-white/65"
              }`}
            >
              <Icon size={16} />
              {label}
            </button>
          ))}
        </nav>

        <section className="relative mb-10 overflow-hidden rounded-3xl border border-white/10 bg-[#151515] p-6 sm:p-9 md:mb-12 md:p-12">
          <div className="pointer-events-none absolute -right-16 -top-24 h-64 w-64 rounded-full bg-[#D7FF38]/10 blur-[90px]" />
          <div className="relative max-w-2xl">
            <span className="inline-block rounded-full border border-[#D7FF38]/30 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-[#D7FF38]">
              Your personal sound system
            </span>
            <h1 className="mt-6 text-5xl font-black leading-[0.95] tracking-[-0.07em] sm:text-6xl md:text-7xl">
              TURN IT<br /><span className="text-[#D7FF38]">UP.</span>
            </h1>
            <p className="mt-5 max-w-md text-sm leading-6 text-white/50 sm:text-base">
              Your music. Your discoveries. Your world. Everything starts with a sound.
            </p>
            <button
              onClick={() => void togglePlay()}
              className="mt-7 inline-flex items-center gap-2 rounded-full bg-[#D7FF38] px-6 py-3 text-sm font-black text-black transition hover:scale-[1.02]"
            >
              {playing ? <Pause size={17} /> : <Play size={17} fill="currentColor" />}
              {playing ? "Pause your track" : "Play your track"}
            </button>
          </div>

          <div className="pointer-events-none absolute bottom-8 right-8 hidden items-end gap-1 md:flex">
            {[28, 52, 36, 76, 45, 94, 58, 35, 68, 42, 83, 28].map((height, i) => (
              <div key={i} className="w-2 rounded-full bg-[#D7FF38]/70" style={{ height }} />
            ))}
          </div>
        </section>

        <section className="mb-10 md:mb-12">
          <div className="mb-5">
            <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.25em] text-[#D7FF38]">Curated by you</p>
            <h2 className="text-2xl font-black tracking-tight sm:text-3xl">Your frequencies</h2>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            {mixes.map((mix, i) => (
              <article key={mix.title} className="rounded-2xl border border-white/10 bg-white/[0.03] p-3 transition hover:border-white/20">
                <div className="mb-4 flex aspect-square items-center justify-center overflow-hidden rounded-xl" style={{ backgroundColor: `${mix.color}18` }}>
                  {i % 2 === 0
                    ? <AudioLines size={48} strokeWidth={1.3} style={{ color: mix.color }} />
                    : <Music2 size={48} strokeWidth={1.3} style={{ color: mix.color }} />}
                </div>
                <h3 className="truncate font-bold">{mix.title}</h3>
                <p className="mt-1 text-xs text-white/40">{mix.subtitle}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="queue" className="mb-10 md:mb-12">
          <div className="mb-5">
            <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.25em] text-[#8B5CF6]">Your local library</p>
            <h2 className="text-2xl font-black tracking-tight sm:text-3xl">
              {searchQuery.trim() ? "Search results" : "Your queue"}
            </h2>
            <p className="mt-2 text-sm text-white/40">
              {filteredTracks.length} {searchQuery.trim() ? "matching tracks" : "tracks in your local library"}
            </p>
          </div>

          <div className="space-y-2">
            {filteredTracks.map((track) => {
              const index = tracks.findIndex((item) => item.src === track.src);
              const isFavorite = favorites.includes(track.src);
              const isCurrent = index === trackIndex;

              return (
                <div key={track.src} className={`flex items-center gap-2 rounded-xl border p-3 ${
                  isCurrent ? "border-[#D7FF38]/40 bg-[#D7FF38]/5" : "border-white/10 bg-white/[0.02]"
                }`}>
                  <button onClick={() => selectTrack(index)} className="flex min-w-0 flex-1 items-center gap-3 text-left">
                    <Music2 className="shrink-0 text-[#D7FF38]" size={21} />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-bold">{track.title}</span>
                      <span className="mt-1 block truncate text-xs text-white/40">{track.artist}</span>
                    </span>
                    <span className="hidden shrink-0 text-[10px] text-white/40 sm:block">
                      {isCurrent ? (playing ? "Playing" : "Selected") : "Play"}
                    </span>
                  </button>

                  <button
                    aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
                    aria-pressed={isFavorite}
                    onClick={() => toggleFavorite(track.src)}
                    className="shrink-0 p-2"
                  >
                    <Heart size={19} fill={isFavorite ? "currentColor" : "none"} className={isFavorite ? "text-[#FF4FA3]" : "text-white/40 hover:text-[#FF4FA3]"} />
                  </button>
                </div>
              );
            })}
          </div>

          {filteredTracks.length === 0 && (
            <p className="py-8 text-center text-sm text-white/40">
              No tracks found. Try another search.
            </p>
          )}
        </section>

        {favorites.length > 0 && (
          <section id="favorites" className="mb-10">
            <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.25em] text-[#FF4FA3]">Saved by you</p>
            <h2 className="mb-5 text-2xl font-black sm:text-3xl">Liked tracks</h2>

            <div className="space-y-2">
              {tracks.filter((track) => favorites.includes(track.src)).map((track) => (
                <button
                  key={track.src}
                  onClick={() => selectTrack(tracks.findIndex((item) => item.src === track.src))}
                  className="flex w-full items-center gap-3 rounded-xl border border-white/10 p-3 text-left hover:bg-white/5"
                >
                  <Heart size={18} fill="currentColor" className="shrink-0 text-[#FF4FA3]" />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-bold">{track.title}</span>
                    <span className="block text-xs text-white/40">{track.artist}</span>
                  </span>
                  <Play size={17} className="shrink-0 text-white/50" />
                </button>
              ))}
            </div>
          </section>
        )}

        <section className="rounded-2xl border border-dashed border-white/15 p-5 sm:p-8">
          <div className="flex items-start gap-4">
            <div className="rounded-xl bg-[#8B5CF6]/15 p-3 text-[#8B5CF6]"><Library size={23} /></div>
            <div>
              <h2 className="text-lg font-bold">Your library, your universe.</h2>
              <p className="mt-2 max-w-lg text-sm leading-6 text-white/45">
                Your personal music library is just getting started.
              </p>
            </div>
          </div>
        </section>
      </main>

      <footer className="fixed inset-x-0 bottom-0 z-20 border-t border-white/10 bg-[#101010]/95 px-3 py-3 backdrop-blur-xl sm:px-6 md:left-60 md:px-8">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-2 sm:gap-3">
          <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#D7FF38]/10 text-[#D7FF38] sm:h-11 sm:w-11">
              <Music2 size={21} />
            </div>
            <div className="min-w-0">
              <p className="truncate text-xs font-bold sm:text-sm">{currentTrack.title}</p>
              <p className="truncate text-[10px] text-white/40 sm:text-xs">{currentTrack.artist}</p>
            </div>
            <button
              aria-label={favorites.includes(currentTrack.src) ? "Unlike track" : "Like track"}
              aria-pressed={favorites.includes(currentTrack.src)}
              onClick={() => toggleFavorite(currentTrack.src)}
              className="hidden sm:block"
            >
              <Heart size={17} fill={favorites.includes(currentTrack.src) ? "currentColor" : "none"} className={favorites.includes(currentTrack.src) ? "text-[#FF4FA3]" : "text-white/40 hover:text-[#FF4FA3]"} />
            </button>
          </div>

          <div className="flex shrink-0 items-center gap-1 sm:gap-3">
            <button aria-label="Previous track" onClick={() => selectTrack(trackIndex - 1)} className="flex h-8 w-8 items-center justify-center text-white/60 hover:text-white sm:h-9 sm:w-9">
              <SkipBack size={17} />
            </button>
            <button aria-label={playing ? "Pause" : "Play"} onClick={() => void togglePlay()} className="flex h-9 w-9 items-center justify-center rounded-full bg-[#D7FF38] text-black sm:h-10 sm:w-10">
              {playing ? <Pause size={17} fill="currentColor" /> : <Play size={17} fill="currentColor" />}
            </button>
            <button aria-label="Next track" onClick={() => selectTrack(trackIndex + 1)} className="flex h-8 w-8 items-center justify-center text-white/60 hover:text-white sm:h-9 sm:w-9">
              <SkipForward size={17} />
            </button>
          </div>

          <div className="hidden w-24 items-center gap-2 text-white/45 sm:flex lg:w-28">
            <Volume2 size={18} />
            <input aria-label="Volume" type="range" min="0" max="1" step="0.01" value={volume} onChange={(e) => setVolume(Number(e.target.value))} className="h-1 w-full cursor-pointer accent-[#D7FF38]" />
          </div>
        </div>

        <div className="mx-auto mt-3 flex max-w-7xl items-center gap-3 text-[10px] text-white/40">
          <span>{formatTime(time)}</span>
          <input aria-label="Track progress" type="range" min="0" max={duration || 1} step="0.1" value={Math.min(time, duration || 1)} onChange={(e) => seek(Number(e.target.value))} className="h-1 min-w-0 flex-1 cursor-pointer accent-[#D7FF38]" />
          <span>{formatTime(duration)}</span>
        </div>

        {error && <p role="status" className="mt-2 text-center text-xs text-[#FF4FA3]">{error}</p>}
      </footer>
    </div>
  );
}
