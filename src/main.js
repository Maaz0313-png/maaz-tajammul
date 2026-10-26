import "./workspace.css";
import "./app.js";

let demoModule;
function updateArchitecture() {
  const active = location.hash === "#stack";
  if (!active && !demoModule) return;
  demoModule ??= import("./architecture.jsx");
  demoModule
    .then(({ mountArchitecture }) => {
      mountArchitecture(location.hash === "#stack");
    })
    .catch(() => {
      document.querySelector("#architecture-demo").innerHTML =
        '<p class="bento" role="alert">The demo could not load. Please refresh to try again.</p>';
      demoModule = undefined;
    });
}
addEventListener("hashchange", updateArchitecture);
updateArchitecture();
