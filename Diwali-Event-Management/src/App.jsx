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
import "./level3.css";

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
  {
    name: "Dare",
    emoji: "🔥",
    detail: "Complete a fun dare given by the host.",
  },
  {
    name: "Rapid Fire",
    emoji: "⚡",
    detail: "Answer quick questions from the host.",
  },
];

const levelData = [
  {
    name: "Chakravyuh",
    emoji: "🎡",
    sub: "Individual Activity Spinner",
    hosts: "Amey & Shubham",
  },
  {
    name: "WTF – What the Film?",
    emoji: "🎬",
    sub: "Team Games – Dialogue & Emoji Movie Guessing",
    hosts: "Sagar N & Pravalika",
  },
  {
    name: "KYC – Know Your Colleague",
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
        <small className="presents">Tekvision Presents</small>
        <span>Diwali</span> Celebration
      </h1>
      <p>Lights • Laughter • Team Spirit • Fun for Everyone!</p>
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

const wheelColors = [
  "#b82c80",
  "#f3a92c",
  "#4d2eac",
  "#0f8f93",
  "#e45746",
  "#24864e",
];

function SpinWheel({ items, spinToken, caption }) {
  const count = Math.max(items.length, 1);
  const slice = 360 / count;
  const gradient = items.length
    ? `conic-gradient(from -90deg, ${items
        .map(
          (_, i) =>
            `${wheelColors[i % wheelColors.length]} ${i * slice}deg ${(i + 1) * slice}deg`,
        )
        .join(", ")})`
    : wheelColors[0];
  return (
    <div className="wheelwrap">
      <div className="pointer" aria-hidden="true">
        ▼
      </div>
      <div
        className="wheel"
        style={{ "--spin": `${spinToken}deg`, background: gradient }}
        aria-hidden="true"
      >
        <div className="wheelface">
          {items.map((item, i) => {
            const angle = ((-90 + (i + 0.5) * slice) * Math.PI) / 180;
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
                {count <= 6 && item.name && (
                  <small className="wheelName">{item.name}</small>
                )}
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
  const [players, setPlayers] = useSaved("tekvision-level2-players", roster);
  const [newName, setNewName] = useState("");
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
  const remaining = players.filter((p) => !assigned.includes(p));
  const complete = remaining.length === 0 && players.length > 0;

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

  function addPlayer(e) {
    e.preventDefault();
    const name = newName.trim();
    if (!name) return;
    if (players.includes(name)) {
      setNotice(`${name} is already in the list.`);
      return;
    }
    setPlayers([...players, name]);
    setNewName("");
    setNotice(`${name} added.`);
  }

  function removePlayer(p) {
    setPlayers(players.filter((x) => x !== p));
    setTeams((ts) =>
      ts.map((t) => ({ ...t, members: t.members.filter((m) => m !== p) })),
    );
    setNotice(`${p} removed.`);
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
            <p className="muted">{players.length} players → 4 teams.</p>
          </div>
          <button className="secondary" onClick={reset}>
            <RotateCcw size={15} /> Reset teams
          </button>
        </div>

        <details className="managePlayers">
          <summary>
            <Users size={16} aria-hidden="true" /> Manage players (
            {players.length})
          </summary>
          <div className="managePlayersBody">
            <form className="inlineform" onSubmit={addPlayer}>
              <label className="sr-only" htmlFor="newteamplayer">
                Add player
              </label>
              <input
                id="newteamplayer"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Add player"
              />
              <button className="smallbutton" aria-label="Add player">
                <Plus size={18} />
              </button>
            </form>
            <ul className="playerchips">
              {players.map((p) => (
                <li key={p}>
                  <span>{p}</span>
                  <button
                    className="iconbutton"
                    onClick={() => removePlayer(p)}
                    aria-label={`Remove ${p}`}
                  >
                    <Trash2 size={14} />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </details>

        <div className="formation">
          <div className="formationwheel">
            <SpinWheel
              items={players.map((p, i) => ({
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
            {teams.map((t) => (
              <article className="teamcard" key={t.id}>
                <h4>{t.name}</h4>
                <p>{t.members.length} members</p>
                <ul>
                  {t.members.map((m) => (
                    <li key={m}>{m}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
        <p role="status" aria-live="polite" className="notice">
          {notice ||
            (complete
              ? `All ${players.length} players have been assigned to four teams.`
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

// ---------- Level 3: Google Sheet helpers ----------

function parseCSV(text) {
  const rows = [];
  let row = [];
  let field = "";
  let quoted = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (quoted) {
      if (c === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i++;
        } else quoted = false;
      } else field += c;
    } else if (c === '"') quoted = true;
    else if (c === ",") {
      row.push(field);
      field = "";
    } else if (c === "\n" || c === "\r") {
      if (c === "\r" && text[i + 1] === "\n") i++;
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
    } else field += c;
  }
  if (field || row.length) {
    row.push(field);
    rows.push(row);
  }
  return rows.filter((r) => r.some((x) => x.trim()));
}

// Finds the columns by their header text, so the sheet's column order
// doesn't matter. Needs: a "name" column, three "statement" columns and
// a "lie" column. The lie can be written as 1/2/3, "Statement 2",
// or the exact text of the lie.
function sheetToColleagues(text) {
  if (text.trim().startsWith("<")) {
    throw new Error(
      "That link returned a web page, not CSV. Use File → Share → Publish to web → CSV, or upload a downloaded CSV.",
    );
  }
  const [header, ...body] = parseCSV(text);
  if (!header) throw new Error("The sheet is empty.");
  const h = header.map((x) => x.toLowerCase().trim());
  const lieCol = h.findIndex((x) => /\blie\b/.test(x));
  const nameCol = h.findIndex((x, i) => i !== lieCol && x.includes("name"));
  const statementCols = h
    .map((_, i) => i)
    .filter(
      (i) => i !== lieCol && i !== nameCol && /statement|truth|fact/.test(h[i]),
    )
    .slice(0, 3);
  if (nameCol < 0 || lieCol < 0 || statementCols.length < 3) {
    throw new Error(
      `Couldn't match the columns. The sheet has: ${header.join(" | ")}. It needs a name column, three statement columns and a lie column.`,
    );
  }
  const byName = new Map();
  body.forEach((r) => {
    const name = (r[nameCol] || "").trim();
    if (!name) return;
    const statements = statementCols.map((i) => (r[i] || "").trim());
    const raw = (r[lieCol] || "").trim();
    const digit = raw.match(/[1-3]/);
    const lie = digit
      ? Number(digit[0])
      : statements.findIndex(
          (s) => s && s.toLowerCase() === raw.toLowerCase(),
        ) + 1;
    // A later form submission from the same person replaces the earlier one.
    byName.set(name, { name, statements, lie: lie || null });
  });
  return [...byName.values()];
}

const defaultColleagues = roster
  .map((name) => {
    if (name === "Anant") return "Sagar N";
    if (name === "Radha") return "Pravalika";
    return name;
  })
  .map((name) => ({ name, statements: ["", "", ""], lie: null }));

const KYC_POINTS = 10;

function LevelThree() {
  const [colleagues, setColleagues] = useSaved(
    "tekvision-kyc-colleagues",
    defaultColleagues,
  );
  // results[colleagueName] = { revealed: bool, correct: [names who guessed right] }
  const [results, setResults] = useSaved("tekvision-kyc-individual", {});
  const [sheetUrl, setSheetUrl] = useSaved("tekvision-kyc-sheet-url", "");
  const [active, setActive] = useState(0);
  const [newName, setNewName] = useState("");
  const [notice, setNotice] = useState("");
  const [loading, setLoading] = useState(false);
  const [showFinal, setShowFinal] = useState(false);

  const index = Math.min(active, Math.max(colleagues.length - 1, 0));
  const current = colleagues[index];
  const result = (current && results[current.name]) || {
    revealed: false,
    correct: [],
  };
  const correct = result.correct || [];
  const hasStatements = current?.statements.every((s) => s.trim());
  // Everyone except the colleague whose statements are being guessed
  const guessers = colleagues.filter((c) => c.name !== current?.name);

  const scores = colleagues
    .map((p) => ({
      name: p.name,
      points: colleagues.reduce((sum, c) => {
        const r = results[c.name];
        return r?.revealed && (r.correct || []).includes(p.name)
          ? sum + KYC_POINTS
          : sum;
      }, 0),
    }))
    .sort((a, b) => b.points - a.points || a.name.localeCompare(b.name));
  const top = scores[0]?.points ?? 0;
  const finalWinners = scores.filter((p) => p.points === top && top > 0);
  const doneCount = colleagues.filter((c) => results[c.name]?.revealed).length;

  // ----- loading -----
  function applyImport(list, source) {
    if (!list.length) {
      setNotice(`No rows with a name were found in the ${source}.`);
      return;
    }
    setColleagues(list);
    setActive(0);
    const missingLie = list.filter((c) => !c.lie).map((c) => c.name);
    setNotice(
      `Loaded ${list.length} colleagues from the ${source}.` +
        (missingLie.length
          ? ` No lie found for: ${missingLie.join(", ")}. Fix it in the sheet and reload.`
          : ""),
    );
  }

  async function loadFromUrl(e) {
    e.preventDefault();
    if (!sheetUrl.trim()) return;
    setLoading(true);
    setNotice("Loading sheet…");
    try {
      const res = await fetch(sheetUrl.trim());
      if (!res.ok) throw new Error(`The sheet returned error ${res.status}.`);
      applyImport(sheetToColleagues(await res.text()), "sheet");
    } catch (err) {
      setNotice(
        err.message === "Failed to fetch"
          ? "Couldn't reach the sheet. Check it's published to the web as CSV, or upload a CSV file instead."
          : err.message,
      );
    } finally {
      setLoading(false);
    }
  }

  function loadFromFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        applyImport(sheetToColleagues(String(reader.result)), "file");
      } catch (err) {
        setNotice(err.message);
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  }

  // ----- colleague list -----
  function addColleague(e) {
    e.preventDefault();
    const name = newName.trim();
    if (!name) return;
    if (colleagues.some((c) => c.name === name)) {
      setNotice(`${name} is already in the list.`);
      return;
    }
    setColleagues([
      ...colleagues,
      { name, statements: ["", "", ""], lie: null },
    ]);
    setNewName("");
    setNotice(`${name} added. Add their statements in the sheet and reload.`);
  }

  function removeColleague(name) {
    const i = colleagues.findIndex((c) => c.name === name);
    setColleagues(colleagues.filter((c) => c.name !== name));
    // Drop their own round and any points they earned in other rounds
    setResults((r) => {
      const { [name]: _, ...rest } = r;
      Object.keys(rest).forEach((k) => {
        rest[k] = {
          ...rest[k],
          correct: (rest[k].correct || []).filter((n) => n !== name),
        };
      });
      return rest;
    });
    if (i < index || index === colleagues.length - 1)
      setActive(Math.max(index - 1, 0));
    setNotice(`${name} removed.`);
  }

  // ----- game -----
  function choose(i) {
    setActive(i);
    setNotice("");
  }

  function saveResult(patch) {
    setResults((r) => ({
      ...r,
      [current.name]: { ...result, correct, ...patch },
    }));
  }

  function reveal() {
    if (!hasStatements || !current.lie) {
      setNotice(
        `${current.name} doesn't have all three statements and a lie yet. Fix it in the sheet and reload.`,
      );
      return;
    }
    saveResult({ revealed: true });
    setNotice(
      `The lie was statement ${current.lie}. Tick everyone who guessed it right.`,
    );
  }

  function undoReveal() {
    saveResult({ revealed: false });
    setNotice(`Reveal undone for ${current.name}.`);
  }

  function toggleCorrect(name) {
    const on = correct.includes(name);
    saveResult({
      correct: on ? correct.filter((n) => n !== name) : [...correct, name],
    });
    setNotice(
      on ? `${name}: points removed.` : `${name} +${KYC_POINTS} points.`,
    );
  }

  function nextColleague() {
    choose((index + 1) % colleagues.length);
  }

  function resetKyc() {
    if (!window.confirm("Clear all KYC reveals and scores?")) return;
    setResults({});
    setShowFinal(false);
    setNotice("KYC reveals and scores cleared.");
  }

  return (
    <div className="kycgrid">
      <section className="panel">
        <h3>👥 Colleague List</h3>

        <details className="managePlayers">
          <summary>
            <Users size={16} aria-hidden="true" /> Load from Google Sheet
          </summary>
          <div className="managePlayersBody">
            <form className="inlineform" onSubmit={loadFromUrl}>
              <label className="sr-only" htmlFor="sheeturl">
                Published sheet CSV link
              </label>
              <input
                id="sheeturl"
                value={sheetUrl}
                onChange={(e) => setSheetUrl(e.target.value)}
                placeholder="Published CSV link"
              />
              <button className="smallbutton" disabled={loading}>
                {loading ? "…" : "Load"}
              </button>
            </form>
            <label htmlFor="sheetfile" className="kycfilelabel">
              Or upload a CSV (File → Download → CSV)
            </label>
            <input
              id="sheetfile"
              type="file"
              accept=".csv,text/csv"
              onChange={loadFromFile}
            />
          </div>
        </details>

        <details className="managePlayers">
          <summary>
            <Users size={16} aria-hidden="true" /> Manage colleagues (
            {colleagues.length})
          </summary>
          <div className="managePlayersBody">
            <form className="inlineform" onSubmit={addColleague}>
              <label className="sr-only" htmlFor="newcolleague">
                Add colleague
              </label>
              <input
                id="newcolleague"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Add colleague"
              />
              <button className="smallbutton" aria-label="Add colleague">
                <Plus size={18} />
              </button>
            </form>
            <ul className="playerchips">
              {colleagues.map((c) => (
                <li key={c.name}>
                  <span>{c.name}</span>
                  <button
                    className="iconbutton"
                    onClick={() => removeColleague(c.name)}
                    aria-label={`Remove ${c.name}`}
                  >
                    <Trash2 size={14} />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </details>

        <div className="colleagues">
          {colleagues.map((c, i) => (
            <button
              key={c.name}
              className={index === i ? "current" : ""}
              aria-current={index === i ? "true" : undefined}
              onClick={() => choose(i)}
            >
              <span>{c.name}</span>
              {results[c.name]?.revealed && (
                <Check size={16} aria-label="Done" />
              )}
            </button>
          ))}
        </div>

        <p className="muted">
          Progress: {doneCount} of {colleagues.length} colleagues done.
        </p>
      </section>

      <section className="panel">
        <h3>🕵️ KYC – Two Truths and One Lie</h3>

        {!current ? (
          <p>Add a colleague or load the sheet to start.</p>
        ) : (
          <>
            <div className="resultbox">
              <div className="largeemoji" aria-hidden="true">
                🧐
              </div>
              <p className="eyebrow">CURRENT COLLEAGUE</p>
              <h2>{current.name}</h2>
            </div>

            {hasStatements ? (
              <ol className="kycstatements">
                {current.statements.map((s, i) => {
                  const isLie = result.revealed && current.lie === i + 1;
                  const isTruth = result.revealed && current.lie !== i + 1;
                  return (
                    <li
                      key={i}
                      className={isLie ? "lie" : isTruth ? "truth" : ""}
                    >
                      <span className="kycnum">{i + 1}</span>
                      <span className="kyctext">{s}</span>
                      {isLie && <span className="kyctag">🤥 Lie</span>}
                      {isTruth && <span className="kyctag">✓ Truth</span>}
                    </li>
                  );
                })}
              </ol>
            ) : (
              <p className="kycempty">
                No statements yet for {current.name}. Load the sheet to add
                them.
              </p>
            )}

            <div className="actionrow">
              {result.revealed ? (
                <button className="secondary" onClick={undoReveal}>
                  Undo reveal
                </button>
              ) : (
                <button className="primary" onClick={reveal}>
                  🎉 Reveal the lie
                </button>
              )}
              <button className="secondary" onClick={nextColleague}>
                Next colleague <ArrowRight size={16} />
              </button>
            </div>

            <p className="notice" role="status" aria-live="polite">
              {notice}
            </p>

            {result.revealed && (
              <fieldset className="correctlist">
                <legend>Who guessed it right? (+{KYC_POINTS} each)</legend>
                <div className="correctoptions">
                  {guessers.map((p) => {
                    const on = correct.includes(p.name);
                    const id = `correct-${p.name.replace(/\W+/g, "-")}`;
                    return (
                      <label
                        key={p.name}
                        htmlFor={id}
                        className={on ? "picked" : ""}
                      >
                        <input
                          id={id}
                          type="checkbox"
                          checked={on}
                          onChange={() => toggleCorrect(p.name)}
                        />
                        {p.name}
                      </label>
                    );
                  })}
                </div>
              </fieldset>
            )}

            {result.revealed && (
              <div className="kycwinners">
                <h4>This round</h4>
                {correct.length ? (
                  <p>🎉 {correct.join(", ")} got it right!</p>
                ) : (
                  <p>Nobody yet. {current.name} is fooling everyone!</p>
                )}
              </div>
            )}
          </>
        )}
      </section>

      <section className="panel kycscore">
        <h3>🏆 KYC Scoreboard</h3>
        <ol className="scorelist">
          {scores.map((p) => (
            <li key={p.name}>
              <span>{p.name}</span>
              <strong>{p.points} pts</strong>
            </li>
          ))}
        </ol>

        <button
          className="primary"
          onClick={() => setShowFinal((x) => !x)}
          aria-expanded={showFinal}
        >
          {showFinal ? "Hide final winners" : "🏆 Show final winners"}
        </button>

        {showFinal && (
          <div className="kycwinners" role="status">
            {finalWinners.length === 0 ? (
              <p>No points scored yet.</p>
            ) : (
              <>
                <h4>
                  {finalWinners.length === 1 ? "Winner" : "It's a tie"}
                  {" – "}
                  {top} points
                </h4>
                <p>🏆 {finalWinners.map((p) => p.name).join(", ")}</p>
              </>
            )}
          </div>
        )}

        <button className="linkbutton" onClick={resetKyc}>
          Reset KYC reveals and scores
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
