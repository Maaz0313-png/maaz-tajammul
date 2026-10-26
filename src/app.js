import pandaPreview from "../assets/images/pandapatronage-preview.webp";
import hextersPreview from "../assets/images/hexters-preview.webp";
import inventoryPreview from "../assets/images/ims-dashboard-preview.webp";

(() => {
  "use strict";
  const $ = (selector, parent = document) => parent.querySelector(selector);
  const $$ = (selector, parent = document) => [
    ...parent.querySelectorAll(selector),
  ];
  const pages = [
    {
      id: "home",
      file: "overview.jsx",
      label: "Overview",
      icon: "⌂",
      color: "green",
    },
    {
      id: "projects",
      file: "projects.tsx",
      label: "Selected work",
      icon: "◇",
      color: "purple",
    },
    {
      id: "about",
      file: "about.json",
      label: "About & experience",
      icon: "{ }",
      color: "yellow",
    },
    {
      id: "stack",
      file: "architecture.php",
      label: "RILT architecture",
      icon: "◈",
      color: "red",
    },
    {
      id: "contact",
      file: "contact.tsx",
      label: "Get in touch",
      icon: "@",
      color: "blue",
    },
  ];
  const projects = [
    {
      id: "panda",
      title: "Panda Patronage",
      category: "Agency website",
      type: "web",
      image: pandaPreview,
      imageHeight: 6370,
      url: "https://pandapatronage.com",
      live: false,
      repo: "panda-patronage",
      stack: ["Laravel", "React", "Inertia.js"],
      description: "A home for a digital agency’s services, work, and story.",
      focus:
        "Bring an agency’s services and portfolio into a single, coherent web experience.",
      approach:
        "Laravel provides the application foundation, with React and Inertia.js connecting the frontend. The website brings service content and project storytelling together.",
      takeaway:
        "A public-facing agency website, with attention to the relationship between content, visual hierarchy, and the underlying application.",
    },
    {
      id: "hexters",
      title: "The Hexters",
      category: "Portfolio & CMS",
      type: "web",
      image: hextersPreview,
      imageHeight: 5150,
      url: "https://thehexters.com",
      live: true,
      repo: "hexters-portfolio-mgt-sys",
      stack: ["Laravel", "React", "Inertia.js"],
      description:
        "A portfolio and blog, backed by tools to manage the content.",
      focus:
        "Connect a public portfolio and blog with the editorial tools needed to keep them useful.",
      approach:
        "A Laravel and React application connected through Inertia.js, with role-based access, editorial controls, and SEO structure.",
      takeaway:
        "An example of working across both sides of a product: the experience visitors see and the tools that support it.",
    },
    {
      id: "ims",
      title: "Inventory Management",
      category: "Business application",
      type: "app",
      image: inventoryPreview,
      imageHeight: 1497,
      url: "https://ims.thehexters.com",
      live: false,
      repo: "ims",
      stack: ["Laravel", "Blade", "MySQL"],
      description:
        "Stock workflows and business analytics, in one practical dashboard.",
      focus:
        "Make stock information and everyday business operations easier to manage.",
      approach:
        "Built with Laravel, Blade, and MySQL, bringing together stock tracking, analytics, and role-based access controls.",
      takeaway:
        "A business application focused on the day-to-day workflows that sit behind a clear dashboard.",
    },
  ];
  const projectCard = (project, index) => {
    const tag = project.live ? "a" : "button";
    const target = project.live
      ? `href="${project.url}" target="_blank" rel="noopener noreferrer" aria-label="Visit ${project.title}"`
      : `type="button" data-project="${project.id}" aria-label="Open ${project.title} project preview"`;
    return `<article class="project-card" data-project-type="${project.type}">
      <${tag} class="project-media ${project.id}" ${target}>
        <span class="project-number">SELECTED WORK / 0${index + 1}</span>
        <img src="${project.image}" alt="${project.title} website preview" loading="lazy" width="1351" height="${project.imageHeight}" />
        <span class="project-visit" aria-hidden="true">${project.live ? "↗" : "→"}</span>
      </${tag}>
      <div class="project-body">
        <div class="project-category-row"><span class="project-category">${project.category}</span><span class="project-availability">${project.live ? "Live website" : "Archived preview"}</span></div>
        <h3>${project.title}</h3>
        <p>${project.description}</p>
        <div class="project-purpose"><span>The focus</span><p>${project.focus}</p></div>
        <div class="project-tags" aria-label="Technologies">${project.stack.map((tool) => `<span>${tool}</span>`).join("")}</div>
        <div class="project-links"><button data-project="${project.id}" aria-label="Read project notes for ${project.title}">Project notes <span aria-hidden="true">→</span></button><a href="https://github.com/Maaz0313-png/${project.repo}" target="_blank" rel="noopener noreferrer" aria-label="View ${project.title} source code">Source code <span aria-hidden="true">↗</span></a></div>
      </div>
    </article>`;
  };
  $("#home-projects").innerHTML = projects.map(projectCard).join("");
  $("#all-projects").innerHTML = projects.map(projectCard).join("");
  const workspaceToggle = $("#workspace-toggle");
  const workspaceFiles = $("#workspace-files");
  try {
    workspaceFiles.hidden =
      localStorage.getItem("workspace-collapsed") === "true";
  } catch {}
  const updateWorkspace = () =>
    workspaceToggle.setAttribute(
      "aria-expanded",
      String(!workspaceFiles.hidden),
    );
  updateWorkspace();
  workspaceToggle.addEventListener("click", () => {
    workspaceFiles.hidden = !workspaceFiles.hidden;
    updateWorkspace();
    try {
      localStorage.setItem(
        "workspace-collapsed",
        String(workspaceFiles.hidden),
      );
    } catch {}
  });
  const sidebar = $("#sidebar");
  const menuToggle = $("#menu-toggle");
  const backdrop = $("#explorer-backdrop");
  const content = $("#content");
  const closeMenu = (restoreFocus = false) => {
    sidebar.classList.remove("is-open");
    sidebar.removeAttribute("role");
    sidebar.removeAttribute("aria-modal");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open file explorer");
    backdrop.hidden = true;
    $(".editor-shell").inert = false;
    $$(".topbar a, .topbar button").forEach((control) => {
      control.inert = false;
    });
    if (restoreFocus === true) menuToggle.focus();
  };
  const openMenu = () => {
    sidebar.classList.add("is-open");
    sidebar.setAttribute("role", "dialog");
    sidebar.setAttribute("aria-modal", "true");
    menuToggle.setAttribute("aria-expanded", "true");
    menuToggle.setAttribute("aria-label", "Close file explorer");
    backdrop.hidden = false;
    $(".editor-shell").inert = true;
    $$(".topbar a, .topbar button").forEach((control) => {
      control.inert = control !== menuToggle;
    });
    $("#workspace-toggle").focus();
  };
  menuToggle.addEventListener("click", () => {
    if (sidebar.classList.contains("is-open")) closeMenu(true);
    else openMenu();
  });
  backdrop.addEventListener("click", () => closeMenu(true));
  $("#close-explorer").addEventListener("click", () => closeMenu(true));
  matchMedia("(min-width: 761px)").addEventListener("change", closeMenu);
  document.addEventListener("keydown", (event) => {
    if (event.key !== "Tab" || !sidebar.classList.contains("is-open")) return;
    const focusable = $$("a[href], button", sidebar).filter(
      (el) => el.getClientRects().length,
    );
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });
  const scrollPositions = new Map();
  $("[data-scroll-top]").addEventListener("click", () => {
    content.scrollTo({
      top: 0,
      behavior: matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "auto"
        : "smooth",
    });
  });
  let currentPage;
  const navigate = (initial = false) => {
    const hash = location.hash.slice(1);
    if (hash === "content") {
      $("#content").focus();
      return;
    }
    const page = pages.find((page) => page.id === hash) || pages[0];
    if (page.id === currentPage) {
      closeMenu();
      return;
    }
    if (currentPage) scrollPositions.set(currentPage, content.scrollTop);
    currentPage = page.id;
    $$("[data-view]").forEach((view) => {
      view.hidden = view.dataset.view !== page.id;
    });
    $$("[data-route]").forEach((link) => {
      if (link.dataset.route === page.id)
        link.setAttribute("aria-current", "page");
      else link.removeAttribute("aria-current");
    });
    $("#active-file").textContent = page.file;
    $("#path-name").textContent = page.id === "home" ? "overview" : page.id;
    document.title = `${page.label} — Maaz Tajammul`;
    closeMenu();
    content.scrollTo(0, scrollPositions.get(page.id) || 0);
    if (!initial) {
      const heading = $(`#view-${page.id} h1`);
      heading.tabIndex = -1;
      heading.focus({ preventScroll: true });
    }
  };
  window.addEventListener("hashchange", () => navigate());
  navigate(true);
  $$(".file-nav a").forEach((link) =>
    link.addEventListener("click", () => {
      if (link.hash === location.hash) {
        closeMenu();
        const heading = $(`#view-${currentPage} h1`);
        heading.tabIndex = -1;
        heading.focus({ preventScroll: true });
      }
    }),
  );
  // This clock lives outside the view containers and survives every file change.
  const startedAt = performance.now();
  const updateClocks = () => {
    const seconds = Math.floor((performance.now() - startedAt) / 1000);
    $("#session-timer").textContent =
      `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;
    $("#karachi-clock").textContent =
      `${new Intl.DateTimeFormat("en-GB", { timeZone: "Asia/Karachi", hour: "2-digit", minute: "2-digit", hour12: false }).format(new Date())} PKT · UTC+05:00`;
  };
  updateClocks();
  setInterval(updateClocks, 1000);
  $("#year").textContent = new Date().getFullYear();
  const themeButton = $("#theme-toggle");
  const updateTheme = () => {
    const dark = document.documentElement.dataset.theme === "dark";
    themeButton.setAttribute(
      "aria-label",
      `Switch to ${dark ? "light" : "dark"} theme`,
    );
    $('meta[name="theme-color"]').content = dark ? "#111311" : "#f0f2ec";
  };
  const toggleTheme = () => {
    const root = document.documentElement;
    root.dataset.theme = root.dataset.theme === "dark" ? "light" : "dark";
    try {
      localStorage.setItem("theme", root.dataset.theme);
    } catch {}
    updateTheme();
  };
  themeButton.addEventListener("click", toggleTheme);
  updateTheme();
  $$("[data-filter]").forEach((button) =>
    button.addEventListener("click", () => {
      $$("[data-filter]").forEach((other) =>
        other.setAttribute("aria-pressed", String(other === button)),
      );
      $$("#all-projects .project-card").forEach((card) => {
        card.hidden =
          button.dataset.filter !== "all" &&
          card.dataset.projectType !== button.dataset.filter;
      });
      const visible = $$("#all-projects .project-card").filter(
        (card) => !card.hidden,
      ).length;
      $("#all-projects").classList.toggle("single-result", visible === 1);
      $("#project-results").textContent =
        button.dataset.filter === "all"
          ? "Showing all 3 projects"
          : `Showing ${visible} ${visible === 1 ? "project" : "projects"}`;
    }),
  );
  const projectDialog = $("#project-dialog");
  $$("[data-project]").forEach((button) =>
    button.addEventListener("click", () => {
      const project = projects.find(
        (project) => project.id === button.dataset.project,
      );
      $("#project-detail-content").innerHTML =
        `<span class="mini-label">PROJECT NOTES / ${project.category.toUpperCase()}</span><h2 id="project-dialog-title">${project.title}</h2><img src="${project.image}" alt="${project.title} preview"><h3>The focus</h3><p>${project.focus}</p><h3>The approach</h3><p>${project.approach}</p><h3>The takeaway</h3><p>${project.takeaway}</p><div class="project-tags">${project.stack.map((tool) => `<span>${tool}</span>`).join("")}</div>${project.live ? "" : '<p class="archived-project-note">Archived project preview. The implementation is available on GitHub.</p>'}<div class="project-links">${project.live ? `<a class="green" href="${project.url}" target="_blank" rel="noopener noreferrer">Visit website ↗</a>` : ""}<a href="https://github.com/Maaz0313-png/${project.repo}" target="_blank" rel="noopener noreferrer">Source code ↗</a></div>`;
      projectDialog.setAttribute("aria-labelledby", "project-dialog-title");
      projectDialog.showModal();
    }),
  );
  $("#close-project").addEventListener("click", () => projectDialog.close());
  [projectDialog, $("#command-palette")].forEach((dialog) =>
    dialog.addEventListener("click", (event) => {
      const bounds = dialog.getBoundingClientRect();
      if (
        event.target === dialog &&
        (event.clientX < bounds.left ||
          event.clientX > bounds.right ||
          event.clientY < bounds.top ||
          event.clientY > bounds.bottom)
      )
        dialog.close();
    }),
  );
  const palette = $("#command-palette");
  const search = $("#command-search");
  let commandIndex = 0;
  let matches = pages;
  const renderCommands = () => {
    matches = pages.filter((page) =>
      `${page.file} ${page.label}`
        .toLowerCase()
        .includes(search.value.toLowerCase()),
    );
    commandIndex = Math.max(0, Math.min(commandIndex, matches.length - 1));
    $("#command-results").innerHTML = matches.length
      ? matches
          .map(
            (page, index) =>
              `<button id="command-option-${page.id}" role="option" aria-selected="${index === commandIndex}" tabindex="-1" class="${index === commandIndex ? "is-selected" : ""}" data-command-route="${page.id}"><span class="${page.color}">${page.icon}</span>${page.file}<span>${page.label}</span></button>`,
          )
          .join("")
      : '<p class="no-results">No files found. Try “projects” or “contact”.</p>';
    if (matches.length)
      search.setAttribute(
        "aria-activedescendant",
        `command-option-${matches[commandIndex].id}`,
      );
    else search.removeAttribute("aria-activedescendant");
    $$("[data-command-route]").forEach((button) =>
      button.addEventListener("click", () => {
        palette.close();
        location.hash = button.dataset.commandRoute;
      }),
    );
  };
  const openPalette = () => {
    if (palette.open) return;
    closeMenu(sidebar.classList.contains("is-open"));
    search.value = "";
    commandIndex = 0;
    renderCommands();
    palette.showModal();
    search.focus();
  };
  $$("[data-open-palette]").forEach((button) =>
    button.addEventListener("click", openPalette),
  );
  search.addEventListener("input", () => {
    commandIndex = 0;
    renderCommands();
  });
  search.addEventListener("keydown", (event) => {
    if (["ArrowDown", "ArrowUp"].includes(event.key)) {
      event.preventDefault();
      if (matches.length)
        commandIndex =
          (commandIndex +
            (event.key === "ArrowDown" ? 1 : -1) +
            matches.length) %
          matches.length;
      renderCommands();
    }
    if (event.key === "Enter") {
      event.preventDefault();
      if (matches[commandIndex]) {
        palette.close();
        location.hash = matches[commandIndex].id;
      }
    }
  });
  $(".palette-header").addEventListener("submit", (event) => {
    if (event.submitter?.getAttribute("aria-label") !== "Close command palette")
      event.preventDefault();
  });
  const terminal = $("#terminal");
  const terminalInput = $("#terminal-input");
  const openTerminal = () => {
    terminal.hidden = false;
    terminalInput.focus({ preventScroll: true });
  };
  $$("[data-open-terminal]").forEach((button) =>
    button.addEventListener("click", openTerminal),
  );
  $("#close-terminal").addEventListener("click", () => {
    terminal.hidden = true;
    $(".statusbar [data-open-terminal]").focus({ preventScroll: true });
  });
  const print = (text) => {
    const line = document.createElement("p");
    line.textContent = text;
    $("#terminal-output").append(line);
    while ($("#terminal-output").children.length > 60)
      $("#terminal-output").firstChild.remove();
    $("#terminal-output").scrollTop = $("#terminal-output").scrollHeight;
  };
  const commandHistory = [];
  let historyIndex = 0;
  $("#terminal-form").addEventListener("submit", (event) => {
    event.preventDefault();
    const value = terminalInput.value.trim();
    if (!value) return;
    print(`visitor@maaz:~$ ${value}`);
    commandHistory.push(value);
    historyIndex = commandHistory.length;
    terminalInput.value = "";
    const command = value.toLowerCase();
    const aliases = {
      work: "projects",
      overview: "home",
      architecture: "stack",
      experience: "about",
    };
    const route = aliases[command] || command;
    if (pages.some((page) => page.id === route)) {
      location.hash = route;
      print(
        `Opening ${pages.find((page) => page.id === route).file} — session preserved.`,
      );
    } else if (command === "help")
      print(
        "Explore: home · projects · about · stack · contact\nTools: theme · uptime · whoami · clear\nTip: Ctrl/Cmd K opens the command palette.",
      );
    else if (command === "whoami")
      print(
        "Maaz Tajammul — Full Stack Developer\nKarachi, Pakistan · React / Inertia / Laravel / Tailwind",
      );
    else if (command === "theme") {
      toggleTheme();
      print(`Theme: ${document.documentElement.dataset.theme}`);
    } else if (command === "uptime")
      print(
        `Current browser session: ${$("#session-timer").textContent}. This is session time, not server uptime.`,
      );
    else if (command === "clear") $("#terminal-output").replaceChildren();
    else
      print(`Unknown command: ${value}. Type help to see available commands.`);
  });
  terminalInput.addEventListener("keydown", (event) => {
    if (event.key === "ArrowUp") {
      event.preventDefault();
      historyIndex = Math.max(0, historyIndex - 1);
      terminalInput.value = commandHistory[historyIndex] || "";
    } else if (event.key === "ArrowDown") {
      event.preventDefault();
      historyIndex = Math.min(commandHistory.length, historyIndex + 1);
      terminalInput.value = commandHistory[historyIndex] || "";
    }
  });
  document.addEventListener("keydown", (event) => {
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
      event.preventDefault();
      if (palette.open) palette.close();
      else openPalette();
    }
    if (event.key === "Escape") {
      if (sidebar.classList.contains("is-open")) {
        closeMenu();
        menuToggle.focus();
      } else if (!terminal.hidden && !palette.open && !projectDialog.open) {
        terminal.hidden = true;
        $(".statusbar [data-open-terminal]").focus({ preventScroll: true });
      }
    }
  });
  $("#copy-email").addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText("maaztajammul63@gmail.com");
      $("#copy-email-status").textContent = "Email address copied.";
    } catch {
      $("#copy-email-status").textContent =
        "Copy is unavailable. You can select the email address above.";
    }
  });
  const form = $("#contact-form");
  const validateField = (field) => {
    let message = "";
    const value = field.value.trim();
    if (!value)
      message =
        field.name === "name"
          ? "Please enter your name."
          : field.name === "email"
            ? "Please enter your email address."
            : "Please add a little about your idea.";
    else if (field.name === "email" && !field.validity.valid)
      message = "Please enter a valid email address.";
    $(`#${field.name}-error`).textContent = message;
    field.setAttribute("aria-invalid", String(Boolean(message)));
    return !message;
  };
  $$("input, textarea", form).forEach((field) => {
    field.addEventListener("blur", () => validateField(field));
    field.addEventListener("input", () => {
      if (field.getAttribute("aria-invalid") === "true") validateField(field);
      $("#form-status").textContent = "";
    });
  });
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const fields = $$("input, textarea", form);
    const valid = fields.map(validateField).every(Boolean);
    if (!valid) {
      fields
        .find((field) => field.getAttribute("aria-invalid") === "true")
        .focus();
      return;
    }
    const data = new FormData(form);
    const subject = encodeURIComponent(
      `Let’s build something — ${String(data.get("name")).trim()}`,
    );
    const body = encodeURIComponent(
      `From: ${String(data.get("name")).trim()}\nReply to: ${String(data.get("email")).trim()}\n\n${String(data.get("message")).trim()}`,
    );
    const url = `mailto:maaztajammul63@gmail.com?subject=${subject}&body=${body}`;
    $("#form-status").textContent =
      "Your draft is ready. If your email app did not open, use the email link on the right.";
    window.location.href = url;
  });
})();
