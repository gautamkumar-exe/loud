
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
  {
    title: "Your First Track",
    artist: "LOUD. Library",
    src: "/audio/sample.mp4",
  },
  {
    title: "Second Track",
    artist: "LOUD. Library",
    src: "/audio/second.mp4",
  },
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

  const currentTrack = tracks[trackIndex];

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !autoplayRef.current) return;

    autoplayRef.current = false;
    void audio.play().then(() => setPlaying(true)).catch(() => {
      setPlaying(false);
      setError("Playback failed. Check that the media file is playable.");
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
    const nextIndex = (index % tracks.length + tracks.length) % tracks.length;

    if (nextIndex === trackIndex) {
      if (!playing) void togglePlay();
      return;
    }

    autoplayRef.current = true;
    setTrackIndex(nextIndex);
    setPlaying(true);
    setTime(0);
    setDuration(0);
    setError("");
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
          setDuration(e.currentTarget.duration || 0);
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
          setError(`Couldn't load ${currentTrack.title}. Check its file path and format.`);
        }}
      />

      <aside className="fixed inset-y-0 left-0 hidden w-60 flex-col border-r border-white/10 bg-[#0d0d0d] p-6 md:flex">
        <a href="#" className="mb-12 flex items-center gap-3 text-3xl font-black tracking-tighter">
          <AudioLines size={30} className="text-[#D7FF38]" />
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
          ].map(({ label, icon: Icon }, i) => (
            <button
              key={label}
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
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/35">
              Your playlists
            </p>
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
          <p className="mt-1 text-xs leading-5 text-white/45">
            Your personal universe of sound starts here.
          </p>
        </div>
      </aside>

      <main className="px-4 pb-40 pt-6 sm:px-6 md:ml-60 md:px-10 md:pt-10">
        <header className="mb-8 flex items-center justify-between gap-3">
          <a href="#" className="text-2xl font-black tracking-tighter md:hidden">
            LOUD<span className="text-[#D7FF38]">.</span>
          </a>
          <p className="hidden text-sm text-white/40 md:block">
            YOUR SOUND. YOUR RULES.
          </p>
          <button className="flex items-center gap-2 rounded-full border border-white/10 px-3 py-2 text-xs text-white/70 hover:border-[#D7FF38]/50 sm:px-4 sm:text-sm">
            <Search size={16} />
            <span>Find your frequency</span>
          </button>
        </header>

        <nav className="mb-8 flex gap-2 overflow-x-auto md:hidden">
          {[
            { label: "Home", icon: Home },
            { label: "Discover", icon: Compass },
            { label: "Library", icon: Library },
          ].map(({ label, icon: Icon }, i) => (
            <button
              key={label}
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
              TURN IT
              <br />
              <span className="text-[#D7FF38]">UP.</span>
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
              <div
                key={i}
                className="w-2 rounded-full bg-[#D7FF38]/70"
                style={{ height }}
              />
            ))}
          </div>
        </section>

        <section className="mb-10 md:mb-12">
          <div className="mb-5">
            <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.25em] text-[#D7FF38]">
              Curated by you
            </p>
            <h2 className="text-2xl font-black tracking-tight sm:text-3xl">
              Your frequencies
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            {mixes.map((mix, i) => (
              <article
                key={mix.title}
                className="rounded-2xl border border-white/10 bg-white/[0.03] p-3 transition hover:border-white/20"
              >
                <div
                  className="mb-4 flex aspect-square items-center justify-center overflow-hidden rounded-xl"
                  style={{ backgroundColor: `${mix.color}18` }}
                >
                  {i % 2 === 0 ? (
                    <AudioLines size={48} strokeWidth={1.3} style={{ color: mix.color }} />
                  ) : (
                    <Music2 size={48} strokeWidth={1.3} style={{ color: mix.color }} />
                  )}
                </div>
                <h3 className="truncate font-bold">{mix.title}</h3>
                <p className="mt-1 text-xs text-white/40">{mix.subtitle}</p>
              </article>
            ))}
          </div>
        </section>

        <section>
          <div className="mb-5">
            <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.25em] text-[#8B5CF6]">
              Up next
            </p>
            <h2 className="text-2xl font-black tracking-tight sm:text-3xl">
              Your queue
            </h2>
            <p className="mt-2 text-sm text-white/40">
              {tracks.length} tracks in your local library
            </p>
          </div>

          <div className="space-y-2">
            {tracks.map((track, index) => (
              <button
                key={track.src}
                onClick={() => selectTrack(index)}
                className={`flex w-full min-w-0 items-center gap-3 rounded-xl border p-3 text-left transition sm:gap-4 ${
                  index === trackIndex
                    ? "border-[#D7FF38]/40 bg-[#D7FF38]/5"
                    : "border-white/10 bg-white/[0.02] hover:bg-white/[0.05]"
                }`}
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-white/5 text-[#D7FF38]">
                  {index === trackIndex && playing ? (
                    <AudioLines size={21} />
                  ) : (
                    <Music2 size={21} />
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold">{track.title}</p>
                  <p className="mt-1 truncate text-xs text-white/40">{track.artist}</p>
                </div>

                <span className="shrink-0 text-[10px] font-bold uppercase tracking-wider text-white/40">
                  {index === trackIndex ? (playing ? "Playing" : "Selected") : "Play"}
                </span>

                {index === trackIndex && playing ? (
                  <Pause size={17} className="shrink-0 text-[#D7FF38]" />
                ) : (
                  <Play size={17} className="shrink-0 text-white/50" />
                )}
              </button>
            ))}
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
            <Heart size={17} className="hidden text-white/40 lg:block" />
          </div>

          <div className="flex shrink-0 items-center gap-1 sm:gap-3">
            <button
              aria-label="Previous track"
              onClick={() => selectTrack(trackIndex - 1)}
              className="flex h-8 w-8 items-center justify-center text-white/60 hover:text-white sm:h-9 sm:w-9"
            >
              <SkipBack size={17} />
            </button>

            <button
              aria-label={playing ? "Pause" : "Play"}
              onClick={() => void togglePlay()}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-[#D7FF38] text-black sm:h-10 sm:w-10"
            >
              {playing ? <Pause size={17} fill="currentColor" /> : <Play size={17} fill="currentColor" />}
            </button>

            <button
              aria-label="Next track"
              onClick={() => selectTrack(trackIndex + 1)}
              className="flex h-8 w-8 items-center justify-center text-white/60 hover:text-white sm:h-9 sm:w-9"
            >
              <SkipForward size={17} />
            </button>
          </div>

          <div className="hidden w-24 items-center gap-2 text-white/45 sm:flex lg:w-28">
            <Volume2 size={18} />
            <input
              aria-label="Volume"
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={(e) => setVolume(Number(e.target.value))}
              className="h-1 w-full cursor-pointer accent-[#D7FF38]"
            />
          </div>
        </div>

        <div className="mx-auto mt-3 flex max-w-7xl items-center gap-3 text-[10px] text-white/40">
          <span>{formatTime(time)}</span>
          <input
            aria-label="Track progress"
            type="range"
            min="0"
            max={duration || 1}
            step="0.1"
            value={Math.min(time, duration || 1)}
            onChange={(e) => seek(Number(e.target.value))}
            className="h-1 min-w-0 flex-1 cursor-pointer accent-[#D7FF38]"
          />
          <span>{formatTime(duration)}</span>
        </div>

        {error && (
          <p role="status" className="mt-2 text-center text-xs text-[#FF4FA3]">
            {error}
          </p>
        )}
      </footer>
    </div>
  );
}
