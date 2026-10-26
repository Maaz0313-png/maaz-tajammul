import React, {
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { createRoot } from "react-dom/client";
import {
  AnimatePresence,
  MotionConfig,
  animate,
  motion,
  useMotionValue,
} from "motion/react";

// Subscribe explicitly so changing the OS preference also updates a running tour.
function subscribeReducedMotion(listener) {
  const media = matchMedia("(prefers-reduced-motion: reduce)");
  media.addEventListener("change", listener);
  return () => media.removeEventListener("change", listener);
}
const getReducedMotion = () =>
  matchMedia("(prefers-reduced-motion: reduce)").matches;

const projectNames = ["Panda Patronage", "The Hexters", "Inventory Management"];
const steps = [
  {
    short: "Interact",
    title: "It starts with a visit.",
    initial:
      "You enter /projects in the address bar. There is no running app yet, so the browser needs a complete HTML document.",
    visit:
      "You click an Inertia <Link> to /projects. The React app is already running, so the client intercepts the click.",
    phase: "BROWSER",
    owner: "browser",
  },
  {
    short: "Request",
    title: "The browser asks Laravel.",
    initial:
      "A normal GET /projects request crosses the network. There is no X-Inertia header on this first visit.",
    visit:
      "The Inertia client sends GET /projects over XHR with X-Inertia: true. It asks for a new page without replacing the whole document.",
    phase: "REQUEST →",
    owner: "request",
  },
  {
    short: "Route",
    title: "Laravel owns the route.",
    initial:
      "Laravel matches /projects, runs middleware, and calls ProjectController@index. Server-side routing still decides what this URL means.",
    visit:
      "Laravel uses the same route, middleware, and controller as an initial visit. Inertia does not replace your backend routing.",
    phase: "SERVER",
    owner: "server",
  },
  {
    short: "Query",
    title: "The controller gets the data.",
    initial:
      "The controller queries the database through an Eloquent model. Only the data it chooses to expose becomes page props.",
    visit:
      "Eloquent reads the projects from the database. Authentication, authorization, and application logic stay on the server.",
    phase: "SERVER",
    owner: "database",
  },
  {
    short: "Package",
    title: "Same page data. Different envelope.",
    initial:
      "The Inertia server adapter puts the component name and props into the initial HTML document, alongside the application entry point.",
    visit:
      "The Inertia server adapter returns a JSON page object: component, props, URL, and asset version. It does not send a full HTML page.",
    phase: "SERVER",
    owner: "server",
  },
  {
    short: "Response",
    title: "The response comes back.",
    initial:
      "HTTP 200 brings back HTML with the initial page data. The browser also loads the JavaScript and CSS needed to start the app.",
    visit:
      "HTTP 200 brings back application/json with X-Inertia: true. This is a page payload for the Inertia client, not a separate REST API.",
    phase: "← RESPONSE",
    owner: "response",
  },
  {
    short: "Render",
    title: "React makes the page visible.",
    initial:
      "Inertia boots React with Projects/Index and its props. React mounts the page; the loaded Tailwind CSS styles the resulting HTML. SSR is optional and is not shown here.",
    visit:
      "Inertia resolves Projects/Index and gives it the props. React updates the page, Inertia updates browser history, and a configured persistent layout stays mounted.",
    phase: "BROWSER",
    owner: "browser",
  },
];

function snippet(mode, step) {
  const initial = mode === "initial";
  if (step < 2)
    return initial
      ? {
          file: "request.http",
          text: "GET /projects HTTP/1.1\nAccept: text/html\n\n// First visit: no X-Inertia header.\n// The browser needs a full document.",
        }
      : {
          file: "request.http",
          text: "GET /projects HTTP/1.1\nX-Inertia: true\nX-Requested-With: XMLHttpRequest\nAccept: text/html, application/xhtml+xml\n\n// The existing app stays alive.",
        };
  if (step === 2)
    return {
      file: "routes/web.php",
      text: "Route::get('/projects',\n  [ProjectController::class, 'index']\n);\n\n// Middleware and authorization\n// still run on the Laravel server.",
    };
  if (step === 3)
    return {
      file: "ProjectController.php",
      text: "public function index()\n{\n  return Inertia::render('Projects/Index', [\n    'projects' => Project::select(\n      'id', 'name'\n    )->get(),\n  ]);\n}",
    };
  if (step < 6)
    return initial
      ? {
          file: "response.html",
          text: 'HTTP/1.1 200 OK\nContent-Type: text/html\n\n<!doctype html>\n<html>\n  <!-- App entry point + initial page data -->\n  <!-- component: Projects/Index -->\n  <!-- props: { projects: [...] } -->\n  <div id="app"></div>\n</html>',
        }
      : {
          file: "response.json",
          text: 'HTTP/1.1 200 OK\nContent-Type: application/json\nX-Inertia: true\n\n{\n  "component": "Projects/Index",\n  "props": { "projects": [...] },\n  "url": "/projects",\n  "version": "example-asset-hash"\n}',
        };
  return {
    file: "Projects/Index.jsx",
    text: 'export default function Index({ projects }) {\n  return (\n    <div className="grid gap-4">\n      {projects.map(project => (\n        <article key={project.id}\n          className="rounded-xl border p-4">\n          {project.name}\n        </article>\n      ))}\n    </div>\n  );\n}',
  };
}

function Packet({ direction, playing, reduced }) {
  const position = useMotionValue(direction === "request" ? 9 : 151);
  const controls = useRef();
  useEffect(() => {
    if (reduced) {
      position.set(80);
      return;
    }
    const path = direction === "request" ? [9, 151] : [151, 9];
    controls.current = animate(position, path, {
      duration: 1.8,
      ease: "linear",
      repeat: Infinity,
      repeatDelay: 0.35,
    });
    if (!playing) controls.current.pause();
    return () => controls.current?.stop();
  }, [direction, reduced, position]);
  useEffect(() => {
    if (playing) controls.current?.play();
    else controls.current?.pause();
  }, [playing]);
  return (
    <motion.circle
      className={`network-packet ${direction}`}
      cx={position}
      cy={direction === "request" ? 36 : 106}
      r="5"
    />
  );
}

export function ArchitectureDemo({ active }) {
  const [mode, setMode] = useState("visit");
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const reduced = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotion,
    () => true,
  );
  const initial = mode === "initial";
  const completed = step === steps.length - 1;
  const current = steps[step];
  const code = snippet(mode, step);
  const showProjects = completed;
  useEffect(() => {
    if (!active) setPlaying(false);
  }, [active]);
  useEffect(() => {
    const pause = () => {
      if (document.hidden) setPlaying(false);
    };
    document.addEventListener("visibilitychange", pause);
    return () => document.removeEventListener("visibilitychange", pause);
  }, []);
  useEffect(() => {
    if (!playing || !active) return;
    if (completed) {
      setPlaying(false);
      return;
    }
    const timeout = setTimeout(
      () => setStep((value) => value + 1),
      3400 / speed,
    );
    return () => clearTimeout(timeout);
  }, [playing, active, completed, step, speed]);
  const reset = () => {
    setPlaying(false);
    setStep(0);
  };
  const selectMode = (value) => {
    setMode(value);
    reset();
  };
  const selectStep = (value) => {
    setPlaying(false);
    setStep(value);
  };
  const play = () => {
    if (completed) setStep(0);
    setPlaying((value) => !value);
  };

  return (
    <MotionConfig reducedMotion={reduced ? "always" : "never"}>
      <div
        className="request-lab"
        data-demo-mode={mode}
        data-demo-step={step}
        data-playing={playing}
      >
        <div className="lab-toolbar">
          <div className="lab-mode-switch" role="group" aria-label="Visit type">
            <button aria-pressed={!initial} onClick={() => selectMode("visit")}>
              Inertia navigation <span>JSON</span>
            </button>
            <button
              aria-pressed={initial}
              onClick={() => selectMode("initial")}
            >
              First page load <span>HTML</span>
            </button>
          </div>
          <span className="lab-simulation">
            <i className="status-dot" /> ILLUSTRATIVE · NO LIVE REQUESTS
          </span>
        </div>
        <div className="lab-stage">
          <div className="lab-stage-top">
            <span className="mini-label">FOLLOW THE ROUND TRIP</span>
            <span className={`phase-badge phase-${current.owner}`}>
              {current.phase}
            </span>
          </div>
          <div className="roundtrip-grid">
            <motion.article
              className={`lab-browser endpoint ${current.owner === "browser" ? "endpoint-active" : ""}`}
              animate={{
                borderColor:
                  current.owner === "browser" ? "var(--green)" : "var(--line)",
              }}
            >
              <div className="endpoint-label">
                <span className="blue">◉</span>
                <h2>Your browser</h2>
                <span className="endpoint-tag">CLIENT</span>
              </div>
              <div className="browser-chrome">
                <div className="traffic-lights">
                  <i />
                  <i />
                  <i />
                </div>
                <span>
                  localhost/{initial || completed ? "projects" : "overview"}
                </span>
                <span>↗</span>
              </div>
              <div className="mock-layout">
                <div className="mock-brand">
                  <img
                    src={
                      new URL("../assets/icons/monogram.svg", import.meta.url)
                        .href
                    }
                    width="21"
                    height="21"
                    alt=""
                  />
                  <strong>maaz.dev</strong>
                  <span>
                    {initial
                      ? completed
                        ? "App mounted"
                        : "Not mounted yet"
                      : "Layout stays mounted"}
                  </span>
                </div>
                <div className="mock-navigation">
                  <span
                    className={!showProjects && !initial ? "mock-active" : ""}
                  >
                    Overview
                  </span>
                  <button
                    className={showProjects ? "mock-active" : ""}
                    onClick={() => {
                      setStep(0);
                      setPlaying(true);
                    }}
                    aria-label="Simulate clicking the Projects link"
                  >
                    Projects <span>↗</span>
                  </button>
                </div>
                <div className="mock-page">
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.div
                      key={
                        showProjects
                          ? "projects"
                          : initial
                            ? "empty"
                            : "overview"
                      }
                      initial={{ opacity: 0, y: reduced ? 0 : 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.22 }}
                    >
                      {showProjects ? (
                        <>
                          <span className="mock-page-label">
                            Projects/Index.jsx
                          </span>
                          <h3>
                            Selected work<span className="green">.</span>
                          </h3>
                          <div className="mock-project-list">
                            {projectNames.map((name, index) => (
                              <motion.div
                                key={name}
                                initial={{ opacity: 0, x: reduced ? 0 : -8 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{
                                  delay: reduced ? 0 : index * 0.12,
                                }}
                              >
                                <span>0{index + 1}</span>
                                {name}
                                <i>↗</i>
                              </motion.div>
                            ))}
                          </div>
                        </>
                      ) : initial ? (
                        <div className="browser-waiting">
                          <span>⌘</span>
                          <h3>Waiting for the document</h3>
                          <p>React hasn’t booted yet.</p>
                        </div>
                      ) : (
                        <>
                          <span className="mock-page-label">Overview.jsx</span>
                          <h3>
                            Hello, world<span className="green">.</span>
                          </h3>
                          <p>
                            The page you are on stays visible
                            <br />
                            while the next request is in flight.
                          </p>
                          <div className="mock-skeleton">
                            <i />
                            <i />
                          </div>
                        </>
                      )}
                    </motion.div>
                  </AnimatePresence>
                </div>
                <div className="mock-persistent">
                  <span className="status-dot" />
                  {initial
                    ? completed
                      ? "Fresh layout + page mounted"
                      : "First visit starts a new app"
                    : "Example layout state: session 00:42"}
                  <span>{!initial && completed ? "PRESERVED ✓" : "DEMO"}</span>
                </div>
              </div>
            </motion.article>
            <div
              className="network-bridge"
              aria-label="Requests travel to the server; responses return to the browser"
            >
              <span
                className={`wire-label request-label ${step === 1 ? "wire-active" : ""}`}
              >
                REQUEST <strong>GET /projects</strong>
              </span>
              <svg
                viewBox="0 0 160 142"
                className="network-wires"
                role="img"
                aria-label="Request arrow to server and response arrow to browser"
              >
                <defs>
                  <marker
                    id="request-arrow"
                    viewBox="0 0 10 10"
                    refX="9"
                    refY="5"
                    markerWidth="5"
                    markerHeight="5"
                    orient="auto-start-reverse"
                  >
                    <path d="M 0 0 L 10 5 L 0 10 z" fill="currentColor" />
                  </marker>
                </defs>
                <path
                  className={`request-wire ${step === 1 ? "wire-active" : ""}`}
                  d="M 3 36 H 155"
                  markerEnd="url(#request-arrow)"
                />
                <path
                  className={`response-wire ${step === 5 ? "wire-active" : ""}`}
                  d="M 157 106 H 5"
                  markerEnd="url(#request-arrow)"
                />
                {(step === 1 || step === 5) && (
                  <Packet
                    key={`${mode}-${step}`}
                    direction={step === 1 ? "request" : "response"}
                    playing={playing && active}
                    reduced={reduced}
                  />
                )}
              </svg>
              <span
                className={`wire-label response-label ${step === 5 ? "wire-active" : ""}`}
              >
                RESPONSE <strong>200 · {initial ? "HTML" : "JSON"}</strong>
              </span>
            </div>
            <motion.article
              className={`lab-server endpoint ${["server", "database"].includes(current.owner) ? "endpoint-active" : ""}`}
              animate={{
                borderColor: ["server", "database"].includes(current.owner)
                  ? "var(--red)"
                  : "var(--line)",
              }}
            >
              <div className="endpoint-label">
                <span className="red">◈</span>
                <h2>Laravel server</h2>
                <span className="endpoint-tag">SERVER</span>
              </div>
              <div
                className={`server-route ${step === 2 ? "server-task-active" : ""}`}
              >
                <span className="server-task-index">01</span>
                <div>
                  <strong>Router + middleware</strong>
                  <code>GET /projects → index()</code>
                </div>
                <span className="red">↳</span>
              </div>
              <div
                className={`server-route ${step === 3 ? "server-task-active" : ""}`}
              >
                <span className="server-task-index">02</span>
                <div>
                  <strong>ProjectController</strong>
                  <code>Project::select(…)-&gt;get()</code>
                </div>
                <span className="red">↳</span>
              </div>
              <div
                className={`database-block ${step === 3 ? "database-active" : ""}`}
              >
                <span className="database-icon">▱</span>
                <div>
                  <strong>Database / Eloquent</strong>
                  <span>
                    {step >= 3
                      ? "3 project records → page props"
                      : "Projects live here, on the server"}
                  </span>
                </div>
                <motion.span
                  className="database-light"
                  animate={{
                    opacity:
                      step === 3 && playing && !reduced ? [0.35, 1, 0.35] : 0.7,
                  }}
                  transition={{
                    repeat: step === 3 && playing && !reduced ? Infinity : 0,
                    duration: 1.2,
                  }}
                />
              </div>
              <div
                className={`server-envelope ${step === 4 || step === 5 ? "envelope-active" : ""}`}
              >
                <span className="purple">{initial ? "〈/〉" : "{ }"}</span>
                <div>
                  <strong>Inertia server adapter</strong>
                  <span>
                    {initial
                      ? "HTML document + initial page data"
                      : "JSON page object + X-Inertia: true"}
                  </span>
                </div>
              </div>
              <div className="server-footnote">
                Routes, authorization, and data stay here.
              </div>
            </motion.article>
          </div>
          <div className="tailwind-role">
            <span className="cyan">T</span>
            <p>
              <strong>Where does Tailwind fit?</strong> Its CSS styles the React
              output in the browser. It is not another network hop.
            </p>
            <span className="tailwind-role-tag">PRESENTATION LAYER</span>
          </div>
        </div>
        <div className="playback-bar">
          <div className="playback-actions">
            <button className="button primary" id="run-flow" onClick={play}>
              {playing ? "Pause" : completed ? "Replay" : "Play walkthrough"}
              <span aria-hidden="true">{playing ? "Ⅱ" : "▶"}</span>
            </button>
            <button
              className="playback-icon"
              onClick={() => selectStep(Math.max(0, step - 1))}
              disabled={step === 0}
              aria-label="Previous step"
            >
              ←
            </button>
            <button
              className="playback-icon"
              onClick={() => selectStep(Math.min(steps.length - 1, step + 1))}
              disabled={completed}
              aria-label="Next step"
            >
              →
            </button>
            <button
              className="playback-icon reset-playback"
              id="reset-flow"
              onClick={reset}
              aria-label="Reset walkthrough"
            >
              ↺
            </button>
          </div>
          <label className="playback-speed">
            Speed
            <select
              value={speed}
              onChange={(event) => setSpeed(Number(event.target.value))}
            >
              <option value="0.5">0.5×</option>
              <option value="1">1×</option>
              <option value="2">2×</option>
            </select>
          </label>
          <span className="step-counter">
            STEP <strong>0{step + 1}</strong> / 07
          </span>
        </div>
        <nav className="step-timeline" aria-label="Lifecycle steps">
          {steps.map((item, index) => (
            <button
              key={item.short}
              onClick={() => selectStep(index)}
              aria-current={index === step ? "step" : undefined}
              className={index < step ? "step-done" : ""}
            >
              <span>{index < step ? "✓" : `0${index + 1}`}</span>
              {item.short}
              {index === step && (
                <motion.i
                  layoutId="timeline-active"
                  transition={{ type: "spring", stiffness: 350, damping: 35 }}
                />
              )}
            </button>
          ))}
        </nav>
        <div className="explanation-grid">
          <div className="step-narration">
            <span className="mini-label">WHAT IS HAPPENING / 0{step + 1}</span>
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={`${mode}-${step}`}
                initial={{ opacity: 0, y: reduced ? 0 : 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                <h2>{current.title}</h2>
                <p id="flow-status" role="status" aria-live="polite">
                  {initial ? current.initial : current.visit}
                </p>
              </motion.div>
            </AnimatePresence>
            <div className="learning-takeaway">
              <span className="green">↳</span>
              <p>
                {initial
                  ? "First visit: HTML → boot React → mount page."
                  : "Later visit: request → JSON props → update React. No full document reload."}
              </p>
            </div>
            {reduced && (
              <p className="reduced-motion-note">
                Reduced motion is on. Use the steps to explore without traveling
                animations.
              </p>
            )}
          </div>
          <div className="payload-inspector">
            <div className="inspector-header">
              <span>{code.file}</span>
              <span>ILLUSTRATIVE CODE</span>
            </div>
            <pre tabIndex="0" aria-label={`Illustrative ${code.file}`}>
              <code>{code.text}</code>
            </pre>
          </div>
        </div>
        <div className="lab-source">
          Based on the{" "}
          <a
            href="https://inertiajs.com/the-protocol"
            target="_blank"
            rel="noopener noreferrer"
          >
            Inertia protocol ↗
          </a>
          <span>React + Motion · built with Vite</span>
        </div>
      </div>
    </MotionConfig>
  );
}

let root;
export function mountArchitecture(active) {
  root ??= createRoot(document.getElementById("architecture-demo"));
  root.render(<ArchitectureDemo active={active} />);
}
