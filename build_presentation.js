const pptxgen = require("pptxgenjs");
const path = require("path");

const pptx = new pptxgen();
pptx.layout = "LAYOUT_WIDE";
pptx.author = "Steady team";
pptx.subject = "Steady hackathon presentation";
pptx.title = "Steady — Student Stress & Workload Manager";
pptx.company = "Steady";
pptx.lang = "en-US";
pptx.theme = {
  headFontFace: "Aptos Display",
  bodyFontFace: "Aptos",
  lang: "en-US"
};
pptx.defineSlideMaster({
  title: "STEADY_MASTER",
  background: { color: "F7FAF8" },
  objects: [
    { line: { x: 0.55, y: 7.12, w: 12.23, h: 0, line: { color: "DDE9E5", width: 0.7 } } },
    { text: { text: "STEADY  /  STUDENT STRESS & WORKLOAD MANAGER", options: { x: 0.58, y: 7.2, w: 6, h: 0.18, fontFace: "Aptos", fontSize: 7, color: "7A8B87", charSpacing: 1.1, margin: 0 } } }
  ],
  slideNumber: { x: 12.15, y: 7.17, color: "7A8B87", fontFace: "Aptos", fontSize: 8 }
});

const C = {
  ink: "183333", teal: "277B78", darkTeal: "1D5554", muted: "728180", line: "E0EAE6",
  paper: "F7FAF8", white: "FFFFFF", mint: "DCEEE7", peach: "F8E3D7", blue: "DCECF4",
  yellow: "FBEFCF", orange: "B65F39", paleTeal: "EFF8F5"
};
const S = pptx.ShapeType;
const W = 13.333;
const H = 7.5;
const desktopScreenshot = path.resolve("docs", "assets", "steady-desktop.png");
const mobileScreenshot = path.resolve("docs", "assets", "steady-mobile.png");

function text(slide, value, x, y, w, h, options = {}) {
  slide.addText(value, {
    x, y, w, h, margin: 0, fontFace: options.fontFace || "Aptos", fontSize: options.fontSize || 14,
    color: options.color || C.ink, bold: options.bold || false, breakLine: false,
    fit: "shrink", valign: options.valign || "mid", align: options.align || "left",
    italic: options.italic || false, charSpacing: options.charSpacing || 0,
    paraSpaceAfterPt: options.paraSpaceAfterPt || 0, bullet: options.bullet,
    transparency: options.transparency
  });
}
function box(slide, type, x, y, w, h, fill, line = fill, radius = 0) {
  slide.addShape(type, { x, y, w, h, rectRadius: radius, fill: { color: fill }, line: { color: line, width: 1 } });
}
function line(slide, x, y, w, h, color = C.line, width = 1) {
  slide.addShape(S.line, { x, y, w, h, line: { color, width, beginArrowType: "none", endArrowType: "none" } });
}
function pill(slide, label, x, y, w, color, fill) {
  box(slide, S.roundRect, x, y, w, 0.3, fill, fill);
  text(slide, label, x, y + 0.01, w, 0.27, { fontSize: 8.5, bold: true, color, align: "center" });
}
function eyebrow(slide, label, x, y, color = C.teal) {
  text(slide, label.toUpperCase(), x, y, 4.5, 0.2, { fontSize: 8, bold: true, color, charSpacing: 1.5 });
}
function title(slide, value, x, y, w, h, options = {}) {
  text(slide, value, x, y, w, h, { fontFace: "Aptos Display", fontSize: options.fontSize || 27, bold: true, color: options.color || C.ink, valign: "top" });
}
function body(slide, value, x, y, w, h, options = {}) {
  text(slide, value, x, y, w, h, { fontSize: options.fontSize || 12, color: options.color || C.muted, valign: "top" });
}
function dot(slide, x, y, color = C.teal, size = 0.12) { box(slide, S.ellipse, x, y, size, size, color, color); }

function addDashboardMockup(slide, x, y, w, h, compact = false) {
  const scale = w / 5.55;
  const sx = (v) => x + v * scale;
  const sy = (v) => y + v * scale;
  const sw = (v) => v * scale;
  box(slide, S.roundRect, x, y, w, h, C.white, C.line);
  box(slide, S.rect, x, y, w, sw(0.45), C.paper, C.paper);
  box(slide, S.ellipse, sx(0.22), sy(0.15), sw(0.18), sw(0.18), C.teal, C.teal);
  text(slide, "✦", sx(0.22), sy(0.13), sw(0.18), sw(0.18), { fontSize: 7, color: C.white, align: "center" });
  text(slide, "steady", sx(0.47), sy(0.14), sw(0.9), sw(0.2), { fontSize: 8, bold: true, color: C.ink });
  text(slide, "A kinder way to get things done", sx(4.12), sy(0.16), sw(1.1), sw(0.15), { fontSize: 4.3, color: C.muted, align: "right" });
  text(slide, "GOOD MORNING, YOU’VE GOT THIS", sx(0.27), sy(0.7), sw(2.4), sw(0.16), { fontSize: 4.4, bold: true, color: C.teal, charSpacing: 1 });
  text(slide, "Make space for\nwhat matters.", sx(0.27), sy(0.91), sw(2.45), sw(0.7), { fontFace: "Aptos Display", fontSize: 17 * scale, bold: true, color: C.ink, valign: "top" });
  text(slide, "A small plan for your real energy, real time, and real life.", sx(0.27), sy(1.72), sw(2.1), sw(0.32), { fontSize: 5.3, color: C.muted, valign: "top" });
  box(slide, S.roundRect, sx(0.27), sy(2.18), sw(1.3), sw(0.3), C.teal, C.teal);
  text(slide, "Find my next step  →", sx(0.34), sy(2.22), sw(1.16), sw(0.15), { fontSize: 5.2, bold: true, color: C.white, align: "center" });
  box(slide, S.roundRect, sx(2.92), sy(0.67), sw(2.35), sw(1.9), C.white, C.line);
  text(slide, "10-SECOND CHECK-IN", sx(3.12), sy(0.86), sw(1.4), sw(0.14), { fontSize: 4.3, bold: true, color: C.teal, charSpacing: .8 });
  text(slide, "How are you arriving today?", sx(3.12), sy(1.05), sw(1.7), sw(0.23), { fontSize: 7, bold: true, color: C.ink });
  ["😌", "🙂", "😕", "😣"].forEach((emoji, i) => {
    box(slide, S.roundRect, sx(3.1 + i * .46), sy(1.4), sw(.37), sw(.38), i === 1 ? C.mint : C.paper, i === 1 ? "AC2FC3" : C.line);
    text(slide, emoji, sx(3.15 + i * .46), sy(1.46), sw(.27), sw(.14), { fontSize: 7, align: "center" });
  });
  text(slide, "Energy today", sx(3.12), sy(1.94), sw(.8), sw(.12), { fontSize: 4.3, color: C.muted });
  text(slide, "Steady — I can do a few things", sx(3.12), sy(2.08), sw(1.02), sw(.2), { fontSize: 4.1, color: C.ink });
  text(slide, "Time I can give", sx(4.28), sy(1.94), sw(.8), sw(.12), { fontSize: 4.3, color: C.muted });
  text(slide, "2 hours", sx(4.28), sy(2.08), sw(.8), sw(.2), { fontSize: 4.1, color: C.ink });
  box(slide, S.roundRect, sx(3.12), sy(2.34), sw(1.96), sw(.28), C.ink, C.ink);
  text(slide, "Update my plan  ↗", sx(3.3), sy(2.39), sw(1.58), sw(.12), { fontSize: 4.8, bold: true, color: C.white, align: "center" });
  if (compact) return;
  text(slide, "YOUR DAY AT A GLANCE", sx(0.27), sy(2.77), sw(2), sw(.14), { fontSize: 4.4, bold: true, color: C.teal, charSpacing: 1 });
  text(slide, "A little clarity goes a long way.", sx(0.27), sy(2.96), sw(2.5), sw(.22), { fontSize: 8, bold: true, color: C.ink });
  [["3", "open tasks", C.peach], ["2h 30m", "of estimated work", C.blue], ["Tight", "A focused plan will help", C.mint]].forEach((item, i) => {
    const px = sx(.27 + i * 1.77);
    box(slide, S.roundRect, px, sy(3.36), sw(1.61), sw(.55), C.white, C.line);
    box(slide, S.ellipse, px + sw(.12), sy(3.49), sw(.28), sw(.28), item[2], item[2]);
    text(slide, item[0], px + sw(.49), sy(3.45), sw(1), sw(.15), { fontSize: 6.5, bold: true, color: C.ink });
    text(slide, item[1], px + sw(.49), sy(3.64), sw(1), sw(.12), { fontSize: 4.2, color: C.muted });
  });
  box(slide, S.roundRect, sx(.27), sy(4.18), sw(3.57), sw(1.62), C.white, C.line);
  text(slide, "YOUR WORKLOAD", sx(.47), sy(4.4), sw(1.2), sw(.14), { fontSize: 4.3, bold: true, color: C.teal, charSpacing: 1 });
  text(slide, "Task inbox  3", sx(.47), sy(4.59), sw(1.5), sw(.2), { fontSize: 7, bold: true, color: C.ink });
  [["Finish research presentation", "Tomorrow · 90 min", "Must do"], ["Reply to internship email", "Today · 15 min", "Important"], ["Read chapter 6 notes", "Sep 14 · 45 min", "Nice to do"]].forEach((item, i) => {
    const py = sy(4.97 + i * .3);
    line(slide, sx(.47), py - sw(.06), sw(3.1), 0, C.line, .5);
    box(slide, S.ellipse, sx(.47), py, sw(.12), sw(.12), C.white, "BFD0CA");
    text(slide, item[0], sx(.68), py - sw(.01), sw(1.65), sw(.12), { fontSize: 4.5, color: C.ink });
    text(slide, item[1], sx(.68), py + sw(.13), sw(1.3), sw(.1), { fontSize: 3.7, color: C.muted });
    pill(slide, item[2], sx(2.72), py + sw(.02), sw(.7), item[2] === "Must do" ? C.orange : C.teal, item[2] === "Must do" ? C.peach : C.blue);
  });
  box(slide, S.roundRect, sx(4.02), sy(4.18), sw(1.25), sw(1.62), C.teal, C.teal);
  text(slide, "TODAY’S FOCUS", sx(4.22), sy(4.4), sw(.8), sw(.13), { fontSize: 4.3, bold: true, color: C.mint, charSpacing: .8 });
  text(slide, "The best next\nstep is", sx(4.22), sy(4.7), sw(.8), sw(.3), { fontSize: 6, color: C.mint, valign: "top" });
  text(slide, "Reply to internship email", sx(4.22), sy(5.12), sw(.8), sw(.3), { fontSize: 7.2, bold: true, color: C.white, valign: "top" });
  box(slide, S.roundRect, sx(4.22), sy(5.52), sw(.85), sw(.22), C.white, C.white);
  text(slide, "Start 25-min session →", sx(4.27), sy(5.57), sw(.75), sw(.1), { fontSize: 3.6, bold: true, color: C.darkTeal, align: "center" });
}

// Slide 1 — solution in one sentence.
{
  const slide = pptx.addSlide("STEADY_MASTER");
  slide.background = { color: C.paper };
  eyebrow(slide, "Hackathon project", 0.72, 0.66);
  title(slide, "Make space for\nwhat matters.", 0.72, 1.05, 5.3, 1.55, { fontSize: 34 });
  body(slide, "Steady turns a student’s deadlines, energy, and stress into one realistic next step for today.", 0.75, 2.9, 4.4, 0.75, { fontSize: 15 });
  pill(slide, "STUDENT STRESS & WORKLOAD MANAGER", 0.75, 4.03, 2.65, C.teal, C.mint);
  text(slide, "From “I have too much to do”\nto “I know what to do next.”", 0.75, 4.62, 4.6, 0.68, { fontFace: "Aptos Display", fontSize: 18, bold: true, color: C.darkTeal, valign: "top" });
  box(slide, S.roundRect, 6.3, 0.68, 6.34, 5.28, C.white, C.line);
  slide.addImage({ path: desktopScreenshot, x: 6.32, y: 0.7, w: 6.3, h: 5.25, sizing: { type: "cover", w: 6.3, h: 5.25 }, altText: "Live Steady dashboard showing check-in, workload metrics, tasks, and today's focus" });
  text(slide, "A calmer starting point for real student life.", 6.42, 6.76, 5.8, 0.2, { fontSize: 9, color: C.muted, italic: true, align: "center" });
}

// Slide 2 — what is different.
{
  const slide = pptx.addSlide("STEADY_MASTER");
  eyebrow(slide, "01  /  Solution + novelty", 0.72, 0.55);
  title(slide, "The twist is capacity,\nnot more pressure.", 0.72, 0.92, 6.5, 0.95, { fontSize: 29 });
  body(slide, "Most productivity tools ask students to manage an ideal day. Steady plans around the day they actually have.", 0.75, 2.08, 5.3, 0.55, { fontSize: 13 });
  box(slide, S.roundRect, 0.72, 3.05, 3.55, 2.5, C.white, C.line);
  eyebrow(slide, "The usual to-do list", 1, 3.37, C.muted);
  text(slide, "Do everything", 1, 3.78, 2.2, 0.3, { fontFace: "Aptos Display", fontSize: 20, bold: true, color: C.ink });
  body(slide, "A long list treats every task as equally urgent—even when energy and time are limited.", 1, 4.25, 2.78, 0.62, { fontSize: 11 });
  ["More tabs", "More guilt", "More avoidance"].forEach((label, i) => { dot(slide, 1, 5.05 + i * .22, C.peach, .1); text(slide, label, 1.2, 5.02 + i * .22, 1.9, .15, { fontSize: 9, color: C.orange }); });
  box(slide, S.roundRect, 4.62, 3.05, 3.55, 2.5, C.teal, C.teal);
  eyebrow(slide, "The Steady approach", 4.9, 3.37, C.mint);
  text(slide, "Choose what matters", 4.9, 3.78, 2.75, 0.3, { fontFace: "Aptos Display", fontSize: 20, bold: true, color: C.white });
  body(slide, "Check in, see your capacity, and receive one useful next step—not a lecture.", 4.9, 4.25, 2.8, 0.62, { fontSize: 11, color: C.mint });
  ["Realistic capacity", "Smaller starting step", "Private by default"].forEach((label, i) => { dot(slide, 4.9, 5.05 + i * .22, C.mint, .1); text(slide, label, 5.1, 5.02 + i * .22, 2.2, .15, { fontSize: 9, color: C.white }); });
  text(slide, "Three product decisions make the difference", 8.85, 3.08, 3.4, 0.25, { fontSize: 13, bold: true, color: C.ink });
  const decisions = [
    ["01", "Capacity-aware", "The plan respects the time a student actually has."],
    ["02", "Stress-responsive", "High stress shrinks the next action and offers a reset."],
    ["03", "Privacy-first", "Keys stay server-side and the AI only receives the workload context it needs."]
  ];
  decisions.forEach((item, i) => {
    const y = 3.64 + i * .8;
    text(slide, item[0], 8.86, y, .32, .2, { fontSize: 9, bold: true, color: C.teal });
    text(slide, item[1], 9.36, y - .02, 2.45, .2, { fontSize: 11, bold: true, color: C.ink });
    body(slide, item[2], 9.36, y + .25, 3, .3, { fontSize: 9.5 });
  });
}

// Slide 3 — prototype demo walkthrough.
{
  const slide = pptx.addSlide("STEADY_MASTER");
  eyebrow(slide, "02  /  Prototype demo", 0.72, 0.55);
  title(slide, "A four-step journey from\noverwhelm to action.", 0.72, 0.92, 6.1, 0.9, { fontSize: 28 });
  body(slide, "The prototype is the interface: each screen decision makes the next action feel smaller and clearer.", 0.75, 2.02, 5.9, 0.38, { fontSize: 12 });
  box(slide, S.roundRect, 0.7, 2.3, 5.95, 4.96, C.white, C.line);
  slide.addImage({ path: desktopScreenshot, x: 0.73, y: 2.33, w: 5.9, h: 4.92, sizing: { type: "cover", w: 5.9, h: 4.92 }, altText: "Live Steady dashboard prototype" });
  box(slide, S.roundRect, 5.72, 4.85, 0.88, 2.1, C.white, C.line);
  slide.addImage({ path: mobileScreenshot, x: 5.74, y: 4.87, w: 0.84, h: 2.05, sizing: { type: "cover", w: 0.84, h: 2.05 }, altText: "Live Steady mobile layout" });
  const steps = [
    ["1", "Check in", "Stress, energy, and time set the day’s constraints."],
    ["2", "See the load", "Open work is translated into effort and status."],
    ["3", "Pick one", "The focus card recommends the best next task."],
    ["4", "Start small", "A 25-minute session turns intention into motion."]
  ];
  steps.forEach((item, i) => {
    const y = 2.77 + i * .85;
    box(slide, S.ellipse, 7.05, y, .36, .36, i === 2 ? C.teal : C.mint, i === 2 ? C.teal : C.mint);
    text(slide, item[0], 7.05, y + .05, .36, .18, { fontSize: 9, bold: true, color: i === 2 ? C.white : C.darkTeal, align: "center" });
    text(slide, item[1], 7.63, y - .02, 2.8, .2, { fontSize: 12, bold: true, color: C.ink });
    body(slide, item[2], 7.63, y + .25, 4.75, .3, { fontSize: 9.5 });
  });
  pill(slide, "DEMO MOMENT", 7.05, 6.35, 1.22, C.orange, C.peach);
  body(slide, "Set stress to high → watch Steady recommend the smallest useful start.", 8.43, 6.34, 4.05, .35, { fontSize: 9.5, color: C.darkTeal });
}

// Slide 4 — stack and three-week build plan.
{
  const slide = pptx.addSlide("STEADY_MASTER");
  eyebrow(slide, "03  /  Tech stack + build plan", 0.72, 0.55);
  title(slide, "Simple enough to ship.\nThoughtful enough to matter.", 0.72, 0.92, 6.8, 0.9, { fontSize: 28 });
  body(slide, "The MVP stays lightweight so the team can spend its build time on the planning experience—not infrastructure.", 0.75, 2.03, 6.2, .4, { fontSize: 12 });
  const arch = [["Flutter", "Student experience", C.peach], ["Spring Boot", "Secure API + AI", C.blue], ["Supabase", "Postgres data", C.mint]];
  arch.forEach((item, i) => {
    const x = .75 + i * 2.2;
    box(slide, S.roundRect, x, 2.85, 1.82, .9, C.white, C.line);
    box(slide, S.ellipse, x + .18, 3.1, .32, .32, item[2], item[2]);
    text(slide, item[0], x + .62, 3.0, 1.05, .18, { fontSize: 10, bold: true, color: C.ink });
    text(slide, item[1], x + .62, 3.25, 1.05, .16, { fontSize: 8, color: C.muted });
    if (i < 2) slide.addShape(S.rightArrow, { x: x + 1.9, y: 3.16, w: .26, h: .24, fill: { color: C.teal }, line: { color: C.teal } });
  });
  pill(slide, "SERVER-ONLY KEYS  /  SUPABASE POSTGRES  /  STRUCTURED AI PLANS", .75, 4.08, 5.95, C.darkTeal, C.mint);
  text(slide, "3-week build plan", 7.55, 2.84, 4.25, .25, { fontSize: 14, bold: true, color: C.ink });
  const weeks = [
    ["WEEK 1", "Foundation", "Flutter UI, Java API, Supabase schema", C.peach],
    ["WEEK 2", "Intelligence", "OpenAI planning, validation, task breakdown", C.blue],
    ["WEEK 3", "Trust + launch", "Accessibility, insights, user test, deploy, demo", C.mint]
  ];
  weeks.forEach((item, i) => {
    const y = 3.37 + i * .85;
    box(slide, S.roundRect, 7.55, y, 4.75, .62, C.white, C.line);
    pill(slide, item[0], 7.72, y + .16, .7, C.darkTeal, item[3]);
    text(slide, item[1], 8.65, y + .1, 1.22, .17, { fontSize: 10.5, bold: true, color: C.ink });
    body(slide, item[2], 9.95, y + .11, 2.14, .3, { fontSize: 8.2 });
  });
  text(slide, "Definition of done", 0.75, 5.1, 2.5, .2, { fontSize: 12, bold: true, color: C.ink });
  ["A student can add a deadline", "Steady recommends one next step", "The plan updates after completion"].forEach((item, i) => {
    dot(slide, .78, 5.53 + i * .32, C.teal, .1); text(slide, item, 1.02, 5.49 + i * .32, 3.1, .16, { fontSize: 10, color: C.muted });
  });
}

// Slide 5 — impact and close.
{
  const slide = pptx.addSlide("STEADY_MASTER");
  slide.background = { color: C.teal };
  text(slide, "04  /  Impact + close", 0.72, 0.6, 4, .2, { fontSize: 8, bold: true, color: C.mint, charSpacing: 1.5 });
  title(slide, "A student should not\nneed more willpower\nto begin.", 0.72, 1.12, 6.1, 1.7, { fontSize: 32, color: C.white });
  body(slide, "They need a plan that respects their capacity, protects their attention, and makes the next step feel possible.", 0.75, 3.35, 4.8, .65, { fontSize: 14, color: C.mint });
  box(slide, S.roundRect, 0.75, 4.5, 5.45, 1.08, C.darkTeal, C.darkTeal);
  text(slide, "Our impact hypothesis", 1.02, 4.75, 2.1, .18, { fontSize: 10, bold: true, color: C.mint });
  body(slide, "When students see one realistic next action, they start sooner and carry less decision overload.", 1.02, 5.03, 4.5, .3, { fontSize: 11, color: C.white });
  box(slide, S.roundRect, 7.25, 0.85, 5.25, 5.45, C.white, C.white);
  text(slide, "What changes for the user?", 7.68, 1.3, 3.8, .28, { fontSize: 17, bold: true, color: C.ink });
  [["Before", "A scattered list and no clear starting point", C.peach], ["After", "One prioritized task sized to today’s capacity", C.mint], ["Next", "A repeatable rhythm of focus, reset, and progress", C.blue]].forEach((item, i) => {
    const y = 2.02 + i * 1.08;
    box(slide, S.ellipse, 7.72, y + .04, .38, .38, item[2], item[2]);
    text(slide, item[0], 8.35, y, 1.05, .2, { fontSize: 10, bold: true, color: C.teal });
    body(slide, item[1], 8.35, y + .28, 3.55, .3, { fontSize: 11, color: C.ink });
  });
  line(slide, 7.7, 5.18, 4.25, 0, C.line, .8);
  text(slide, "Start small. Stay steady.", 7.68, 5.48, 4, .3, { fontFace: "Aptos Display", fontSize: 20, bold: true, color: C.darkTeal });
  text(slide, "steady", 0.75, 6.42, 1.1, .25, { fontFace: "Aptos Display", fontSize: 16, bold: true, color: C.white });
  text(slide, "A productivity prototype — not a medical tool.", 7.68, 6.53, 4.6, .18, { fontSize: 8.5, color: C.mint, align: "right" });
}

pptx.writeFile({ fileName: path.resolve("docs", "Steady-Presentation.pptx") });
