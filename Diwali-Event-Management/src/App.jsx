import React, { useEffect, useRef, useState } from "react";
import {
  Sparkles,
  Music2,
  Users,
  Clapperboard,
  Trophy,
  RotateCcw,
  ArrowRight,
  Volume2,
  Check,
  Plus,
  Trash2,
} from "lucide-react";

const visualImpairment = ["Siddhant", "Sagar B", "Renuka", "Archana"];
const sighted = [
  "Sunil",
  "Namrata",
  "Radha",
  "Rahul",
  "Anant",
  "Jeelu",
  "Harish",
  "Amey",
  "Shubham",
];
const roster = [...visualImpairment, ...sighted];
const names = [
  "🪔 Team Diya Dhamaka",
  "🎇 Team Phuljhadi",
  "🌈 Team Rangoli Rockers",
  "🚀 Team Rocket Raja",
];

const activities = [
  { name: "Sing", emoji: "🎤", detail: "Sing a song of your choice." },
  { name: "Rap", emoji: "🎧", detail: "Perform a short rap." },
  { name: "Dialog", emoji: "🎭", detail: "Deliver a famous movie dialogue." },
  { name: "Mimic", emoji: "🤪", detail: "Mimic a celebrity or character." },
  { name: "Dare", emoji: "🔥", detail: "Complete a fun dare given by the host." },
  { name: "Rapid Fire", emoji: "⚡", detail: "Answer quick questions from the host." }
];

const levelData = [
  {
    name: "Patakha Spin Dhamaka",
    emoji: "🎡",
    sub: "Individual activity spinner",
    hosts: "Amey & Shubham",
  },
  {
    name: "Filmy Phuljhadi Hungama",
    emoji: "🎬",
    sub: "Team formation, dialogue and emoji movie guessing",
    hosts: "Sagar N & Pravalika",
  },
  {
    name: "KYC — Know Your Colleague",
    emoji: "🕵️",
    sub: "Two Truths and One Lie",
    hosts: "Anant & Radha",
  },
];
const emptyTeams = () =>
  names.map((name, i) => ({ name, members: [], score: 0, id: i }));
function useSaved(key, initial) {
  const [value, setValue] = useState(() => {
    try {
      const x = localStorage.getItem(key);
      return x ? JSON.parse(x) : initial;
    } catch {
      return initial;
    }
  });
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {}
  }, [key, value]);
  return [value, setValue];
}
function shuffle(a) {
  const b = [...a];
  for (let i = b.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [b[i], b[j]] = [b[j], b[i]];
  }
  return b;
}
function Modal({ title, children, onClose }) {
  const closeRef = useRef(null);
  useEffect(() => {
    closeRef.current?.focus();
    function key(e) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", key);
    return () => document.removeEventListener("keydown", key);
  }, [onClose]);
  return (
    <div
      className="modalback"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div className="modalicon">🪔✨🎆</div>
        <h2 id="modal-title">{title}</h2>
        {children}
        <button className="primary" ref={closeRef} onClick={onClose}>
          Let's go! →
        </button>
      </div>
    </div>
  );
}
function Header({ level }) {
  return (
    <header className="header">
      <div className="topglow">🪔 ✨ 🎇 ✨ 🪔</div>
      <h1>
        Tekvision <span>Diwali</span> celebration
      </h1>
      <p>Lights, laughter and a whole lot of team dhamaka!</p>
      <div className="levelheading">
        <span className="bigemoji" aria-hidden="true">
          {levelData[level].emoji}
        </span>
        <div>
          <p className="eyebrow">LEVEL {level + 1}</p>
          <h2>{levelData[level].name}</h2>
          <p>
            Hosts: <strong>{levelData[level].hosts}</strong>
          </p>
        </div>
      </div>
    </header>
  );
}
const wheelColors = ["#b82c80", "#f3a92c", "#4d2eac", "#0f8f93", "#e45746", "#24864e"];

function SpinWheel({ items, spinToken, caption }) {
  const count = Math.max(items.length, 1);
  const slice = 360 / count;
  const gradient = `conic-gradient(from -90deg, ${items
    .map((_, i) => `${wheelColors[i % wheelColors.length]} ${i * slice}deg ${(i + 1) * slice}deg`)
    .join(", ")})`;
  return (
    <div className="wheelwrap">
      <div className="pointer" aria-hidden="true">▼</div>
      <div
        className="wheel"
        style={{ "--spin": `${spinToken}deg`, background: gradient }}
        aria-hidden="true"
      >
        <div className="wheelface">
          {items.map((item, i) => {
            const angle = (-90 + (i + 0.5) * slice) * Math.PI / 180;
            return (
              <div
                className="wheeltext"
                key={i}
                style={{
                  left: `${50 + 36 * Math.cos(angle)}%`,
                  top: `${50 + 36 * Math.sin(angle)}%`,
                }}
              >
                <span className="wheelEmoji">{item.emoji}</span>
                {count <= 6 && item.name && <small className="wheelName">{item.name}</small>}
              </div>
            );
          })}
          <div className="wheelhub">🪔</div>
        </div>
      </div>
      <p className="muted">{caption}</p>
    </div>
  );
}

function LevelOne() {
  const [people, setPeople] = useSaved("tekvision-level1-people", roster);
  const [player, setPlayer] = useState(roster[0]);
  const [newName, setNewName] = useState("");
  const [spin, setSpin] = useState(0);
  const spinRef = useRef(0);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState(null);
  const [flash, setFlash] = useState(false);
  const timer = useRef(null);
  useEffect(() => () => clearTimeout(timer.current), []);
  function go() {
    if (busy || !people.length) return;
    setBusy(true);
    setResult(null);
    const idx = Math.floor(Math.random() * activities.length);
    // Align the randomly selected segment with the pointer at the top.
    const slice = 360 / activities.length;
    const desired = (360 - (idx + 0.5) * slice) % 360;
    const current = ((spinRef.current % 360) + 360) % 360;
    const extra = (desired - current + 360) % 360;
    spinRef.current += 360 * 5 + extra;
    setSpin(spinRef.current);
    timer.current = setTimeout(() => {
      const act = activities[idx];
      setResult({
        ...act,
        player,
      });
      setFlash(true);
      setBusy(false);
    }, 2200);
  }
  function add(e) {
    e.preventDefault();
    const name = newName.trim();
    if (name && !people.includes(name)) {
      setPeople([...people, name]);
      setPlayer(name);
      setNewName("");
    }
  }
  return (
    <div className="contentgrid">
      <section className="panel">
        <h3>👥 Individual Participants</h3>
        <form className="inlineform" onSubmit={add}>
          <label className="sr-only" htmlFor="newperson">
            Add participant
          </label>
          <input
            id="newperson"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Add participant"
          />
          <button className="smallbutton" aria-label="Add participant">
            <Plus size={18} />
          </button>
        </form>
        <ul className="peoplelist">
          {people.map((p) => (
            <li key={p}>
              <span>{p}</span>
              <button
                className="iconbutton"
                onClick={() => {
                  setPeople(people.filter((x) => x !== p));
                  if (player === p)
                    setPlayer(people.find((x) => x !== p) || "");
                }}
                aria-label={`Remove ${p}`}
              >
                <Trash2 size={15} />
              </button>
            </li>
          ))}
        </ul>
      </section>
      <section className="wheelpanel">
        <h3>🎡 Spin the Patakha Wheel</h3>
        <SpinWheel
          items={activities}
          spinToken={spin}
          caption="All 6 activities stay available after every spin."
        />
        <button
          className="primary"
          onClick={go}
          disabled={busy || !people.length}
        >
          {busy ? "Spinning…" : "✨ SPIN NOW"}
        </button>
      </section>
      <section className="panel">
        <h3>🎯 Current Turn</h3>
        <label htmlFor="player">Choose participant</label>
        <select
          id="player"
          value={people.includes(player) ? player : people[0] || ""}
          onChange={(e) => setPlayer(e.target.value)}
        >
          {people.map((p) => (
            <option key={p}>{p}</option>
          ))}
        </select>
        <div className="resultbox" role="status" aria-live="polite">
          {result ? (
            <>
              <div className="largeemoji">{result.emoji}</div>
              <h3>{result.name}</h3>
              <p>{result.player}</p>
              <p>{result.detail}</p>
            </>
          ) : (
            <p>Spin the wheel to reveal the next activity!</p>
          )}
        </div>
        {/* <p className="muted">
          Activities are never removed or disabled after selection.
        </p> */}
      </section>
      {flash && result && (
        <Modal
          title={`${result.emoji} ${result.name}`}
          onClose={() => setFlash(false)}
        >
          <p className="highlight">It's {result.player}'s turn!</p>
          <p>{result.detail}</p>
        </Modal>
      )}
    </div>
  );
}
function LevelTwo() {
  const [teams, setTeams] = useSaved("tekvision-level2-teams", emptyTeams());
  const [pending, setPending] = useState([]);
  const [drawn, setDrawn] = useState([]);
  const [active, setActive] = useState(0);
  const [formationSpin, setFormationSpin] = useState(0);
  const [forming, setForming] = useState(false);
  const [round, setRound] = useState("dialogue");
  const [emojiIndex, setEmojiIndex] = useState(1);
  const [answer, setAnswer] = useState("");
  const [roundLog, setRoundLog] = useSaved("tekvision-level2-log", []);
  const [tiebreak, setTiebreak] = useState(false);
  const [winner, setWinner] = useState(false);
  const [notice, setNotice] = useState("");
  const timer = useRef(null);
  useEffect(() => () => clearTimeout(timer.current), []);
  const assigned = teams.flatMap((t) => t.members);
  const remaining = roster.filter((p) => !assigned.includes(p));
  const complete =
    remaining.length === 0 &&
    teams.every((t) => t.members.some((m) => visualImpairment.includes(m)));
  function reset() {
    if (!window.confirm("Reset team assignments, scores and round history?"))
      return;
    setTeams(emptyTeams());
    setPending([]);
    setDrawn([]);
    setRoundLog([]);
    setActive(0);
    setWinner(false);
    setTiebreak(false);
    setNotice("Team formation reset.");
  }
  function draw() {
    if (forming || !remaining.length) return;
    setForming(true);
    setNotice("");
    setFormationSpin((v) => v + 1800 + Math.floor(Math.random() * 360));
    timer.current = setTimeout(() => {
      const reserved = visualImpairment.filter((x) => remaining.includes(x));
      const target = reserved.length
        ? teams.findIndex(
            (t) => !t.members.some((x) => visualImpairment.includes(x)),
          )
        : -1;
      const targetIndex =
        target >= 0
          ? target
          : teams.findIndex(
              (t) =>
                t.members.length ===
                Math.min(...teams.map((t) => t.members.length)),
            );
      const candidate = reserved.length
        ? reserved[Math.floor(Math.random() * reserved.length)]
        : remaining[Math.floor(Math.random() * remaining.length)];
      const newTeams = teams.map((t, i) =>
        i === targetIndex ? { ...t, members: [...t.members, candidate] } : t,
      );
      setTeams(newTeams);
      setDrawn((x) => [
        ...x,
        { person: candidate, team: newTeams[targetIndex].name },
      ]);
      setNotice(`${candidate} joins ${newTeams[targetIndex].name}`);
      setForming(false);
    }, 2100);
  }
  function award(points) {
    const name = teams[active].name;
    setTeams((ts) =>
      ts.map((t, i) => (i === active ? { ...t, score: t.score + points } : t)),
    );
    setRoundLog((x) => [
      ...x,
      {
        team: name,
        round: round === "dialogue" ? "Dialogue" : `Emoji clue ${emojiIndex}`,
        answer: answer || "—",
        points,
      },
    ]);
    setAnswer("");
    setNotice(`${points} points awarded to ${name}.`);
  }
  function next() {
    setActive((x) => (x + 1) % 4);
    setNotice("Moved to the next team.");
  }
  const highest = Math.max(...teams.map((t) => t.score));
  const leaders = teams.filter((t) => t.score === highest);
  const resultReady = roundLog.length > 0;
  return (
    <div className="leveltwo">
      <section className="panel wide">
        <div className="sectionhead">
          <div>
            <h3>🎡 Team Formation Spinner</h3>
            <p className="muted">
              13 players → 4 teams.
            </p>
          </div>
          <button className="secondary" onClick={reset}>
            <RotateCcw size={15} /> Reset teams
          </button>
        </div>
        <div className="formation">
          <div className="formationwheel">
            <SpinWheel
              items={roster.map((p, i) => ({
                emoji: ["🪔", "🎇", "✨", "🎆"][i % 4],
              }))}
              spinToken={formationSpin}
              caption="Animated random player draw"
            />
            <button
              className="primary"
              onClick={draw}
              disabled={forming || !remaining.length}
            >
              {forming
                ? "Assigning…"
                : remaining.length
                  ? `🎯 Spin & Assign (${remaining.length} left)`
                  : "✓ All assigned"}
            </button>
          </div>
          <div className="teamcards">
            {teams.map((t, i) => (
              <article className="teamcard" key={t.id}>
                <h4>{t.name}</h4>
                <p>{t.members.length} members</p>
                <ul>
                  {t.members.map((m) => (
                    <li key={m}>
                      {m}{" "}
                      {visualImpairment.includes(m) && (
                        <span className="muted"></span>
                      )}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
        <p role="status" aria-live="polite" className="notice">
          {notice ||
            (complete
              ? "All 13 players have been assigned to four balanced teams."
              : "Spin to assign participants.")}
        </p>
      </section>
      <div className="roundgrid">
        <section className="panel">
          <h3>🎬 Movie Guessing — 2 Rounds</h3>
          <p className="muted">
            Round 1: dialogue/audio. Round 2: two emoji clues per team.
          </p>
          <div className="tabs" role="group" aria-label="Select round">
            <button
              className={round === "dialogue" ? "selected" : ""}
              onClick={() => setRound("dialogue")}
            >
              🎙️ Dialogue
            </button>
            <button
              className={round === "emoji" ? "selected" : ""}
              onClick={() => setRound("emoji")}
            >
              😎 Emoji Movie
            </button>
          </div>
          <label htmlFor="teamselect">Playing team</label>
          <select
            id="teamselect"
            value={active}
            onChange={(e) => setActive(Number(e.target.value))}
          >
            {teams.map((t, i) => (
              <option value={i} key={t.id}>
                {t.name}
              </option>
            ))}
          </select>
          {round === "dialogue" ? (
            <div className="clue">
              <div className="largeemoji">🎙️</div>
              <h4>Guess the movie from a dialogue or audio clip</h4>
              <p>
                Host reads a dialogue or plays a permitted audio clip aloud.
              </p>
              <label htmlFor="audioclip">Optional audio clue</label>
              <input
                type="file"
                accept="audio/*"
                id="audioclip"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  const el = document.getElementById("clipplayer");
                  if (el && f) {
                    if (el.dataset.blob) URL.revokeObjectURL(el.dataset.blob);
                    el.dataset.blob = URL.createObjectURL(f);
                    el.src = el.dataset.blob;
                  }
                }}
              />
              <audio id="clipplayer" controls aria-label="Audio movie clue" />
            </div>
          ) : (
            <div className="clue">
              <div className="largeemoji">🎭 🍿 🎬</div>
              <h4>Find the movie from emojis</h4>
              <p>
                Each team gets two emoji movie clues. Hosts can describe the
                emojis aloud for accessibility.
              </p>
              <div className="tabs" role="group" aria-label="Emoji clue number">
                <button
                  className={emojiIndex === 1 ? "selected" : ""}
                  onClick={() => setEmojiIndex(1)}
                >
                  Clue 1
                </button>
                <button
                  className={emojiIndex === 2 ? "selected" : ""}
                  onClick={() => setEmojiIndex(2)}
                >
                  Clue 2
                </button>
              </div>
              <label htmlFor="emojiclue">Host's emoji clue</label>
              <input id="emojiclue" placeholder="Example: 👨‍👧‍👦 🚗 🏠" />
            </div>
          )}
          <label htmlFor="movieanswer">Team answer</label>
          <input
            id="movieanswer"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Enter movie name"
          />
          <div className="actionrow">
            <button className="primary" onClick={() => award(10)}>
              <Check size={16} /> Correct +10
            </button>
            <button className="secondary" onClick={() => award(0)}>
              Incorrect +0
            </button>
            <button className="secondary" onClick={next}>
              <ArrowRight size={16} /> Next team
            </button>
          </div>
        </section>
        <section className="panel">
          <h3>🏆 Live Scoreboard</h3>
          <ol className="scorelist">
            {[...teams]
              .sort((a, b) => b.score - a.score)
              .map((t) => (
                <li key={t.id}>
                  <span>{t.name}</span>
                  <strong>{t.score} pts</strong>
                </li>
              ))}
          </ol>
          <div className="resultbox">
            <h4>Results &amp; Tie Breaker</h4>
            {resultReady ? (
              <>
                {leaders.length === 1 ? (
                  <p>
                    Current leader: <strong>{leaders[0].name}</strong>
                  </p>
                ) : (
                  <p>
                    <strong>Tie:</strong>{" "}
                    {leaders.map((t) => t.name).join(" & ")}
                  </p>
                )}
                <button
                  className="secondary"
                  onClick={() => setTiebreak((x) => !x)}
                >
                  {tiebreak ? "Hide tie breaker" : "Show tie breaker"}
                </button>
                {tiebreak && (
                  <div className="tiebox">
                    <p>
                      Host asks one extra dialogue or emoji movie clue to the
                      tied teams. Award points using the buttons, then check the
                      updated result.
                    </p>
                    <p>
                      Current tied teams:{" "}
                      {leaders.map((t) => t.name).join(", ")}
                    </p>
                  </div>
                )}
                <button
                  className="primary"
                  onClick={() => setWinner((x) => !x)}
                >
                  {winner ? "Hide final result" : "Show final result"}
                </button>
                {winner && (
                  <p role="status">
                    {leaders.length === 1
                      ? `🏆 Winner: ${leaders[0].name} — ${highest} points`
                      : `Tie remains between: ${leaders.map((t) => t.name).join(", ")}. Play a tie breaker.`}
                  </p>
                )}
              </>
            ) : (
              <p>Record scores to reveal the result.</p>
            )}
          </div>
          <h4>Round History</h4>
          <div className="history">
            {roundLog.length ? (
              <ol>
                {roundLog
                  .slice(-10)
                  .reverse()
                  .map((r, i) => (
                    <li key={i}>
                      {r.team}: {r.round} — {r.points} points ({r.answer})
                    </li>
                  ))}
              </ol>
            ) : (
              <p className="muted">No rounds recorded yet.</p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

function LevelThree() {
  // Level 3 participants only
  const levelThreeRoster = roster.map((name) => {
    if (name === "Anant") return "Sagar N";
    if (name === "Radha") return "Pravalika";
    return name;
  });

  const [active, setActive] = useState(0);
  const [completed, setCompleted] = useSaved(
    "tekvision-kyc-completed",
    []
  );
  const [reveal, setReveal] = useState(false);
  const [text, setText] = useState("");

  const selected = levelThreeRoster[active];

  // Count only valid Level 3 participants
  const completedCount = levelThreeRoster.filter((name) =>
    completed.includes(name)
  ).length;

  function choose(i) {
    setActive(i);
    setReveal(false);
    setText("");
  }

  return (
    <div className="kycgrid">
      <section className="panel">
        <h3>👥 Colleague List</h3>

        <p className="muted">
          Hosts Anant and Radha select each colleague one by one.
        </p>

        <div className="colleagues">
          {levelThreeRoster.map((name, i) => (
            <button
              key={name}
              className={active === i ? "current" : ""}
              onClick={() => choose(i)}
            >
              <span>{name}</span>

              {completed.includes(name) && (
                <Check size={16} aria-label="Completed" />
              )}
            </button>
          ))}
        </div>
      </section>

      <section className="panel">
        <h3>🕵️ KYC — Two Truths and One Lie</h3>

        <div className="resultbox">
          <div className="largeemoji">🧐</div>
          <p className="eyebrow">CURRENT COLLEAGUE</p>
          <h2>{selected}</h2>

          <p>
            Hosts read three statements from the Google Form:
            two true statements and one lie. Teams guess
            which one is the lie.
          </p>
        </div>

        <label htmlFor="statements">
          Optional host notes (not connected to Google Forms)
        </label>

        <textarea
          id="statements"
          rows="5"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={
            "1. First statement\n2. Second statement\n3. Third statement"
          }
        />

        <div className="actionrow">
          <button
            className="secondary"
            onClick={() => setReveal((x) => !x)}
          >
            {reveal
              ? "Hide answer"
              : "Reveal / Discuss answer"}
          </button>

          <button
            className="primary"
            onClick={() => {
              setCompleted((x) =>
                x.includes(selected)
                  ? x
                  : [...x, selected]
              );

              choose(
                (active + 1) % levelThreeRoster.length
              );
            }}
          >
            Mark Done &amp; Next <ArrowRight size={16} />
          </button>
        </div>

        {reveal && (
          <p className="notice" role="status">
            Ask the colleague to reveal which statement
            was the lie. The app does not invent their answers.
          </p>
        )}

        <p className="muted">
          Progress: {completedCount} of{" "}
          {levelThreeRoster.length} colleagues completed.
        </p>

        <button
          className="linkbutton"
          onClick={() => {
            if (window.confirm("Clear KYC progress?")) {
              setCompleted([]);
            }
          }}
        >
          Reset KYC progress
        </button>
      </section>
    </div>
  );
}

export default function App() {
  const [level, setLevel] = useState(0);
  const [flash, setFlash] = useState(null);
  const nav = useRef(null);
  function navigate(n) {
    setLevel(n);
    setFlash(n);
  }
  function dismiss() {
    setFlash(null);
    nav.current?.querySelector('[aria-current="page"]')?.focus();
  }
  return (
    <div className="app">
      <Header level={level} />
      <main id="main" className="main">
        {level === 0 ? (
          <LevelOne />
        ) : level === 1 ? (
          <LevelTwo />
        ) : (
          <LevelThree />
        )}
      </main>
      <footer className="footer">
        Made for Tekvision Diwali Celebration • Have fun, play fair, include
        everyone 🪔
      </footer>
      <nav className="bottomnav" ref={nav} aria-label="Game levels">
        {levelData.map((l, i) => (
          <button
            key={i}
            onClick={() => navigate(i)}
            aria-current={level === i ? "page" : undefined}
          >
            <span aria-hidden="true">{l.emoji}</span>
            <span>
              Level {i + 1}
              <small>
                {i === 0 ? "Individual" : i === 1 ? "Team Games" : "KYC"}
              </small>
            </span>
          </button>
        ))}
      </nav>
      {flash !== null && (
        <Modal
          title={`${levelData[flash].emoji} ${levelData[flash].name}`}
          onClose={dismiss}
        >
          <p>{levelData[flash].sub}</p>
          <p className="highlight">Hosts: {levelData[flash].hosts}</p>
        </Modal>
      )}
    </div>
  );
}
