// Run from the project root (the folder that contains src/):  node restructure.mjs
// 1) Moves components into auth/, layout/ and ui/  2) Fixes every import path
// 3) Adds the FlightFormState type to src/types.ts
import fs from "node:fs";
import path from "node:path";

const src = path.join(process.cwd(), "src");
if (!fs.existsSync(src)) {
  console.error("src/ not found. Run this from the project root.");
  process.exit(1);
}
const p = (f) => path.join(src, ...f.split("/"));

const moves = {
  "components/AuthShell.tsx": "components/auth/AuthShell.tsx",
  "components/AppLayout.tsx": "components/layout/AppLayout.tsx",
  "components/Sidebar.tsx": "components/layout/Sidebar.tsx",
  "components/SidebarContext.tsx": "components/layout/SidebarContext.tsx",
  "components/Topbar.tsx": "components/layout/Topbar.tsx",
  "components/ConfirmDialog.tsx": "components/ui/ConfirmDialog.tsx",
  "components/DroneMark.tsx": "components/ui/DroneMark.tsx",
  "components/Logo.tsx": "components/ui/Logo.tsx",
  "components/ScrollToTop.tsx": "components/ui/ScrollToTop.tsx",
  "components/StatCard.tsx": "components/ui/StatCard.tsx",
  "components/StatusBadge.tsx": "components/ui/StatusBadge.tsx",
};

for (const [from, to] of Object.entries(moves)) {
  if (!fs.existsSync(p(from))) {
    if (!fs.existsSync(p(to))) console.warn(`missing: ${from}`);
    continue;
  }
  fs.mkdirSync(path.dirname(p(to)), { recursive: true });
  fs.renameSync(p(from), p(to));
  console.log(`moved   ${from} -> ${to}`);
}

// Replace an import path, whichever quote style the file uses
function swap(file, pairs) {
  if (!fs.existsSync(p(file))) return console.warn(`missing: ${file}`);
  let text = fs.readFileSync(p(file), "utf8");
  const before = text;
  for (const [a, b] of pairs) {
    text = text.split(`"${a}"`).join(`"${b}"`).split(`'${a}'`).join(`'${b}'`);
  }
  if (text !== before) {
    fs.writeFileSync(p(file), text);
    console.log(`updated ${file}`);
  }
}

swap("main.tsx", [["./components/ScrollToTop", "./components/ui/ScrollToTop"]]);
swap("components/layout/AppLayout.tsx", [["./ConfirmDialog", "../ui/ConfirmDialog"]]);
swap("components/layout/Sidebar.tsx", [
  ["./Logo", "../ui/Logo"],
  ["../data/mock", "../../data/mock"],
  ["../data/DataContext", "../../data/DataContext"],
]);
swap("components/auth/AuthShell.tsx", [["./DroneMark", "../ui/DroneMark"]]);
swap("components/ui/StatusBadge.tsx", [["../types", "../../types"]]);

const pageSwaps = [
  ["../components/Topbar", "../components/layout/Topbar"],
  ["../components/StatCard", "../components/ui/StatCard"],
  ["../components/StatusBadge", "../components/ui/StatusBadge"],
  ["../components/ConfirmDialog", "../components/ui/ConfirmDialog"],
  ["../components/AuthShell", "../components/auth/AuthShell"],
];
for (const page of ["Login", "SignUp", "Dashboard", "FlightLogs", "FlightDetails", "Drones", "Batteries", "Settings"]) {
  swap(`pages/${page}.tsx`, pageSwaps);
}

const typesFile = p("types.ts");
const formTypes = `
/** Raw string values held by the add flight log form */
export interface FlightFormState {
  date: string
  location: string
  reporting: string
  leaving: string
  start: string
  end: string
  purpose: string
  drone: string
  pilot: string
  type: string
  batterySerial: string
  cycles: string
  initialPct: string
  finalPct: string
  initialTemp: string
  finalTemp: string
  notes: string
  incident: string
}
`;
if (fs.existsSync(typesFile) && !fs.readFileSync(typesFile, "utf8").includes("FlightFormState")) {
  fs.appendFileSync(typesFile, formTypes);
  console.log("updated types.ts");
}
console.log("done");
