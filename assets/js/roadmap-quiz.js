/* Industry-to-Academia Roadmap Quiz — client-side only */
(function () {
  "use strict";

  const GHL_WEBHOOK_URL =
    "https://services.leadconnectorhq.com/hooks/pQUdCMt9SqQaC7RPNntU/webhook-trigger/6910086e-29ad-4323-93b6-d49c1b6947d1";

  const STORAGE = {
    state: "roadmap_state",
    answers: "roadmap_answers",
    question: "roadmap_question",
    contact: "roadmap_contact",
    utmSource: "roadmap_utm_source",
    utmMedium: "roadmap_utm_medium",
    utmCampaign: "roadmap_utm_campaign",
    quizStarted: "roadmap_quiz_started",
  };

  const STAGE_NAMES = [
    "",
    "Position",
    "Brand",
    "Convert the CV",
    "Write the Philosophy",
    "Build the Syllabus",
    "Record the Demo",
    "Deploy",
    "Convert",
    "Launch",
  ];

  const OUT_OF_ORDER_LINE =
    "One more thing: you've built documents before positioning. That's the most common DIY pattern — and it's usually why strong professionals get silence: the committee can't tell what you'd teach, so the documents never get read.";

  const FACULTY_LINE =
    "Already teaching? The roadmap holds — for faculty moving roles, the gaps are almost always in Stages 7–9, and the build stages compress into a fast audit of what you already have.";

  const PHD_MESSAGE =
    "The Accelerator is built for professionals bringing a career into the classroom. Your stage report is on its way to your inbox — start there. We'll also send you resources built for your path.";

  const QUESTIONS = [
    {
      key: "highest_degree",
      text: "What's your highest credential?",
      options: [
        { label: "Bachelor's degree", value: "bachelors" },
        { label: "Master's degree (MBA, MEng, MAcc, etc.)", value: "masters" },
        {
          label: "Professional designation (CPA, P.Eng, JD, CFA…)",
          value: "professional-designation",
        },
        { label: "Doctorate", value: "doctorate" },
      ],
    },
    {
      key: "years_experience",
      text: "Years of professional experience?",
      options: [
        { label: "Under 5", value: "lt5" },
        { label: "5–10", value: "5-10" },
        { label: "10–20", value: "10-20" },
        { label: "20+", value: "20plus" },
      ],
    },
    {
      key: "segment",
      text: "Which best describes you right now?",
      options: [
        {
          label: "Working in industry, exploring teaching on the side",
          value: "industry-exploring",
        },
        {
          label: "Working in industry, planning a full transition to academia",
          value: "industry-transition",
        },
        {
          label:
            "Working in industry AND pursuing a doctorate (PhD/DBA/EdD) alongside my career",
          value: "industry-doctorate",
        },
        {
          label: "Recently left industry / between roles",
          value: "between-roles",
        },
        {
          label:
            "Full-time PhD student or postdoc — academia is my first career",
          value: "full-time-phd",
        },
        {
          label: "Current faculty, looking for a new or additional role",
          value: "current-faculty",
        },
      ],
    },
    {
      key: "timeline",
      text: "When do you want to be at the front of a classroom?",
      options: [
        { label: "Within 6 months", value: "6mo" },
        { label: "6–12 months", value: "6-12mo" },
        { label: "1–2 years", value: "1-2yr" },
        { label: "Just exploring", value: "exploring" },
      ],
    },
    {
      key: "teaching_zone",
      text: "Can you name the 2–3 specific courses you're qualified to teach — actual course titles that exist in a university calendar, not just your subject area?",
      options: [
        {
          label: "Yes — specific course titles at specific schools",
          value: "defined",
        },
        { label: "Sort of — I know my general area", value: "general-area" },
        { label: "No", value: "none" },
      ],
    },
    {
      key: "target_list",
      text: "Do you have a target list of 5–10 institutions with the department chair or program director identified by name?",
      options: [
        { label: "Yes, with decision-makers named", value: "named" },
        { label: "I have schools in mind, no names", value: "schools-only" },
        { label: "No list", value: "none" },
      ],
    },
    {
      key: "google_test",
      text: "If a department chair googled you today, what would they find?",
      options: [
        {
          label:
            "A visible expert in my teaching area — posts, talks, commentary",
          value: "expert",
        },
        {
          label: "A competent professional — standard corporate LinkedIn",
          value: "professional",
        },
        { label: "Not much", value: "invisible" },
      ],
    },
    {
      key: "posting_cadence",
      text: "Have you published public commentary or thought leadership in your teaching area in the last 90 days?",
      options: [
        { label: "Yes, regularly (weekly-ish)", value: "regular" },
        { label: "Once or twice", value: "occasional" },
        { label: "No", value: "never" },
      ],
    },
    {
      key: "network_size",
      text: "How many department chairs, program directors, or professors do you know well enough to email directly?",
      options: [
        { label: "None", value: "0" },
        { label: "1–2", value: "1-2" },
        { label: "3–9", value: "3-9" },
        { label: "10+", value: "10plus" },
      ],
    },
    {
      key: "cv_status",
      text: "Which best describes your CV?",
      options: [
        {
          label:
            "A true academic CV — teaching interests section, experience reframed for teaching relevance, 2–3 pages",
          value: "academic",
        },
        { label: "My corporate resume, lightly adapted", value: "adapted" },
        {
          label: "Corporate resume only / nothing prepared",
          value: "corporate",
        },
      ],
    },
    {
      key: "philosophy_status",
      text: "Do you have a written teaching philosophy grounded in specific stories from your career?",
      options: [
        { label: "Yes, drafted", value: "drafted" },
        { label: "I could write one, but haven't", value: "not-yet" },
        {
          label: "What's that?",
          value: "none",
        },
      ],
    },
    {
      key: "syllabus_status",
      text: "Have you ever built a complete syllabus for a course — learning objectives, 13-week schedule, assessments?",
      options: [
        { label: "Yes, complete", value: "complete" },
        { label: "Partial", value: "partial" },
        { label: "No", value: "none" },
      ],
    },
    {
      key: "demo_status",
      text: "Do you have a recorded teaching demonstration — you actually teaching, not a conference presentation or webinar?",
      options: [
        {
          label: "Yes — a true 15–20 minute teaching demo",
          value: "true-demo",
        },
        {
          label: "I have conference talks / webinars on video",
          value: "talks-only",
        },
        { label: "No recording", value: "none" },
      ],
    },
    {
      key: "outreach_status",
      text: "Have you started outreach to department chairs and program directors?",
      options: [
        {
          label: "Yes — systematic, tracked, with follow-ups",
          value: "systematic",
        },
        { label: "I've sent a few cold messages", value: "few-cold" },
        {
          label: "I've applied to postings through university job portals",
          value: "portals-only",
        },
        { label: "Not yet", value: "none" },
      ],
    },
    {
      key: "results_status",
      text: "Any results so far?",
      options: [
        { label: "An offer", value: "offer" },
        { label: "Interview(s), no offer yet", value: "interview" },
        {
          label: "A guest lecture delivered or booked",
          value: "guest-lecture",
        },
        { label: "Nothing yet", value: "none" },
      ],
    },
  ];

  const STAGE_COPY = {
    1: {
      cta_line: "We'll define your teaching zone on the call itself.",
      body: `<p>You have the expertise. What you don't have yet is a course. Universities don't hire "20 years of finance experience" — they hire someone to teach a specific course in a specific term. Until your background is translated into 2–3 real course titles, a committee has no shelf to put you on.</p>
<p><strong>What the committee sees:</strong> impressive professionals get passed over in minutes because nobody in the room can answer "what would this person teach?" If the committee has to do the translation work, it doesn't.</p>
<p><strong>Do these three things now:</strong></p>
<ol>
<li>Pull the course calendars of three institutions near you. Highlight every course your career qualifies you to teach.</li>
<li>For each, write the three credentials or experiences that qualify you — one line each.</li>
<li>Build a list of 5–10 target institutions and find the department chair's name. Not the dean — deans don't staff courses.</li>
</ol>
<p><strong>Cost of staying here:</strong> sections get assigned every single term — to whoever the chair can already name. Every term unpositioned is a cohort of courses filled without you.</p>`,
    },
    2: {
      cta_line: "Bring your LinkedIn; we'll audit it live.",
      body: `<p>Your teaching zone is defined, but you're invisible where it counts. When your name eventually lands in a chair's inbox, they do one thing before replying: they google you. Right now, what comes back is a corporate profile — competent, but not a teacher.</p>
<p><strong>What the committee sees:</strong> shortlists get googled. A LinkedIn that leads with your corporate title tells us you haven't decided you're an educator yet. We notice.</p>
<p><strong>Do these three things now:</strong></p>
<ol>
<li>Rewrite your LinkedIn headline and About section to lead with your teaching identity, not your job title.</li>
<li>Publish one post this week in your teaching area — one thing practitioners know that students are never taught.</li>
<li>Connect with 10 faculty members in your discipline. No message needed yet.</li>
</ol>
<p><strong>Cost of staying here:</strong> every piece of outreach you ever send inherits your Google results. Invisible now means ignored later.</p>`,
    },
    3: {
      cta_line:
        "I'll tell you exactly where your current CV would lose the room.",
      body: `<p>You're positioned and findable — but your CV still speaks corporate. Metrics, action verbs, achievement bullets: the language that wins interviews in industry reads as tone-deaf on a committee desk, and it's the fastest tell that a candidate doesn't yet know the world they're entering.</p>
<p><strong>What the committee sees:</strong> I've sorted stacks of applications in an evening. Corporate-formatted resumes go to the "no" pile in under a minute — not because the person can't teach, but because the document never makes the case. Every line of an academic CV answers one question: how does this make me a better teacher?</p>
<p><strong>Do these three things now:</strong></p>
<ol>
<li>Restructure to academic sections — including a Teaching Interests paragraph naming your 2–3 course areas.</li>
<li>Translate your three biggest corporate achievements into teaching-relevant language and name the courses each supports.</li>
<li>Expand to 2–3 pages. Academic CVs aren't one-pagers; brevity reads as thinness here.</li>
</ol>
<p><strong>Cost of staying here:</strong> the CV is the first document opened. If it dies in minute one, nothing else you built gets read.</p>`,
    },
    4: {
      cta_line:
        "The philosophy is where industry stories become your unfair advantage. We'll find yours.",
      body: `<p>Your CV opens the file; the teaching philosophy is where committees decide whether you've actually thought about teaching or just want to try it. Most candidates don't know this document exists until a posting demands it — then they produce abstract claims under deadline.</p>
<p><strong>What the committee sees:</strong> the #1 failure mode, by a wide margin, is claims without evidence. "I'm passionate about student-centered learning" appears in every file we read. The specific story — the moment you watched someone you were training finally get it — almost never does. We read these in about 90 seconds, scanning for proof.</p>
<p><strong>Do these three things now:</strong></p>
<ol>
<li>Write your opening anecdote: a specific moment you taught someone something hard, and what you saw change.</li>
<li>State goals grounded in the gap between what school teaches and what the work demands — the paragraph no career academic can write.</li>
<li>Include how you'd know students learned it. Skipping assessment is the easiest miss to spot.</li>
</ol>
<p><strong>Cost of staying here:</strong> postings give you days, not weeks. This document written under deadline pressure reads exactly like it.</p>`,
    },
    5: {
      cta_line: "We'll pick the right target course together.",
      body: `<p>Documents drafted — now the single most concrete proof of teaching readiness: a complete syllabus. Anyone can say they could teach a course. A syllabus proves you can design one.</p>
<p><strong>What the committee sees:</strong> a full syllabus in an application file is rare from any candidate and almost unheard of from industry applicants. It answers our biggest silent doubt: can this person structure 13 weeks of learning, or just tell war stories?</p>
<p><strong>Do these three things now:</strong></p>
<ol>
<li>Match a real course at a target institution — its actual title and number, not an invented dream course.</li>
<li>Write 4–6 measurable learning objectives and map a 13-week schedule with assessments.</li>
<li>Design one industry-grounded project a career academic couldn't assign — that's your differentiator on paper.</li>
</ol>
<p><strong>Cost of staying here:</strong> without the syllabus, your file says "wants to teach." With it, it says "ready to start in September."</p>`,
    },
    6: {
      cta_line: "Demo review is where coaching moves fastest.",
      body: `<p>One asset left in the arsenal: a recorded teaching demonstration. Not a conference talk. Not a webinar. A simulated class — because committees don't want to see how you present, they want to see how you teach.</p>
<p><strong>What the committee sees:</strong> industry candidates routinely submit a keynote or client presentation and lose the room. Presenting is broadcasting; teaching has an engagement moment — a place where you stop and put the thinking on the students. We look for that moment specifically.</p>
<p><strong>Do these three things now:</strong></p>
<ol>
<li>Pick one topic from your syllabus. One.</li>
<li>Plan it: a hook, 2–3 core points, one explicit engagement moment ("here I'd ask students to…"), a close that connects to next class.</li>
<li>Record 15–20 minutes — no shorter, no longer — with clean audio and your face well lit.</li>
</ol>
<p><strong>Cost of staying here:</strong> an interview invitation often asks for a demo on short notice. Built now, it's an asset; built in a panic, it's a liability.</p>`,
    },
    7: {
      cta_line:
        "Bring your target list; we'll draft your first three messages on the call.",
      body: `<p>Your arsenal is complete — which puts you ahead of nearly every industry applicant. Now the failure mode changes: strong file, wrong door. If your plan is "apply through the portal," you're routing yourself into a screening process built for career academics.</p>
<p><strong>What the committee sees:</strong> portal applications go through central filters before a committee ever looks. But a large share of real staffing happens differently — an instructor drops a course, enrollment spikes, a section opens three weeks out, and the chair calls a name they already know. The hidden market isn't hidden; it just doesn't live in the portal.</p>
<p><strong>Do these three things now:</strong></p>
<ol>
<li>Send 10 messages to department chairs and program directors — the people who actually scramble to staff sections.</li>
<li>Ask for a 20-minute conversation or offer a guest lecture. Never ask "are you hiring?" — that triggers the apply-online reflex.</li>
<li>Track every contact and follow up after 7–10 days. Silence is normal; follow-ups routinely outperform first messages.</li>
</ol>
<p><strong>Cost of staying here:</strong> a complete arsenal nobody has seen is worth exactly zero.</p>`,
    },
    8: {
      cta_line:
        "Bring your tracker and your last three messages; we'll find the bottleneck in 20 minutes.",
      body: `<p>You're in market — outreach live, maybe a guest lecture or interview in motion. This is the stage where most people misread the signals and quit six inches from the wall's end.</p>
<p><strong>What the committee sees:</strong> "we hire centrally" isn't a no — it's a wrong door; find the program coordinator. Silence isn't a no — academics are slammed. "Nothing right now" is a soft yes to staying in touch. And know the base rates: under 15–20 documented contacts, you don't have enough data to conclude anything. Relationships convert on a 3–9 month pipeline — placements land when a need meets a name someone already trusts.</p>
<p><strong>Do these three things now:</strong></p>
<ol>
<li>Audit your tracker: how many contacts went to chairs/coordinators vs. deans, HR, or portals?</li>
<li>Reread your last three messages — does the ask sound like a job inquiry? Lighten it.</li>
<li>If interviews are coming: rehearse every answer to land on student outcomes. Committees hire teachers, not resumes.</li>
</ol>
<p><strong>Cost of staying here:</strong> unmanaged pipelines go cold silently. The follow-up you don't send is the section someone else teaches.</p>`,
    },
    9: {
      cta_line:
        "Offer-in-hand is exactly when an insider read pays for itself.",
      body: `<p>An offer is on the table or close. Two things now decide whether this becomes a teaching career or a one-semester experiment: what you negotiate, and your first-semester evaluations.</p>
<p><strong>What the committee sees:</strong> adjunct offers have limited but real negotiation room — per-course pay, course selection, PD funding, workspace are often movable; union scales and benefits usually aren't. Asking for the wrong thing marks you as green; asking for the right thing is expected. And reappointment is decided by your first evaluations — the hardest position to win is the first one, if semester one goes well.</p>
<p><strong>Do these three things now:</strong></p>
<ol>
<li>Negotiate only the negotiables. Get course selection if you can — teaching in your zone protects your evaluations.</li>
<li>Have your LMS live — syllabus, assignments, rubrics — before day one, and over-prepare the first three classes.</li>
<li>Run a mid-semester feedback survey. Catch problems while they're fixable, not in the final evals.</li>
</ol>
<p><strong>Cost of staying here:</strong> a shaky first semester makes the second appointment harder than the first.</p>`,
    },
  };

  const root = document.getElementById("roadmap-app");
  if (!root) return;

  let answers = loadJSON(STORAGE.answers, {});
  let contact = loadJSON(STORAGE.contact, null);
  let currentQuestion = parseInt(
    sessionStorage.getItem(STORAGE.question) || "0",
    10,
  );

  captureUtms();

  const savedState = sessionStorage.getItem(STORAGE.state);
  if (savedState === "results" && contact) {
    renderResults();
  } else if (savedState === "contact") {
    renderContact();
  } else if (savedState === "quiz" && currentQuestion >= 1) {
    renderQuestion(currentQuestion);
  } else {
    renderLanding();
  }

  function loadJSON(key, fallback) {
    try {
      const raw = sessionStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch {
      return fallback;
    }
  }

  function saveAnswers() {
    sessionStorage.setItem(STORAGE.answers, JSON.stringify(answers));
  }

  function saveContact(data) {
    contact = data;
    sessionStorage.setItem(STORAGE.contact, JSON.stringify(data));
  }

  function setState(state) {
    sessionStorage.setItem(STORAGE.state, state);
  }

  function captureUtms() {
    const params = new URLSearchParams(window.location.search);
    ["utm_source", "utm_medium", "utm_campaign"].forEach(function (key) {
      const val = params.get(key);
      if (val) {
        sessionStorage.setItem("roadmap_" + key, val);
      }
    });
  }

  function getUtm(key) {
    return sessionStorage.getItem("roadmap_" + key) || "";
  }

  function computeStage(a) {
    if (a.teaching_zone !== "defined" || a.target_list === "none") return 1;
    if (a.google_test !== "expert" && a.posting_cadence !== "regular") return 2;
    if (a.cv_status !== "academic") return 3;
    if (a.philosophy_status !== "drafted") return 4;
    if (a.syllabus_status !== "complete") return 5;
    if (a.demo_status !== "true-demo") return 6;
    if (a.outreach_status !== "systematic") return 7;
    if (a.results_status !== "offer") return 8;
    return 9;
  }

  function trackQuizStart() {
    if (sessionStorage.getItem(STORAGE.quizStarted)) return;
    sessionStorage.setItem(STORAGE.quizStarted, "1");
    if (typeof window.fbq === "function") {
      window.fbq("trackCustom", "QuizStart");
    }
    if (window.dataLayer && Array.isArray(window.dataLayer)) {
      window.dataLayer.push({ event: "quiz_start" });
    }
  }

  function trackQuizComplete(stage) {
    if (typeof window.fbq === "function") {
      window.fbq("trackCustom", "QuizComplete", { stage: stage });
    }
    if (window.dataLayer && Array.isArray(window.dataLayer)) {
      window.dataLayer.push({ event: "quiz_complete", stage: stage });
    }
  }

  function scrollTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function renderLanding() {
    setState("landing");
    root.innerHTML =
      '<section class="roadmap-landing">' +
      '<div class="roadmap-container">' +
      "<h1>Where are you on the path to the front of a university classroom?</h1>" +
      '<p class="roadmap-subhead">15 questions. 3 minutes. Find your stage on the Industry-to-Academia Roadmap — and what a faculty hiring committee would flag first — from a professor who sits on one.</p>' +
      '<ul class="roadmap-bullets">' +
      "<li>Your exact stage of 9</li>" +
      "<li>The #1 thing blocking your file</li>" +
      "<li>The three moves to make this month</li>" +
      "</ul>" +
      '<button type="button" class="squeeze-form-button roadmap-start-btn" id="roadmap-start">Find My Stage →</button>' +
      "</div></section>";

    document
      .getElementById("roadmap-start")
      .addEventListener("click", function () {
        currentQuestion = 1;
        sessionStorage.setItem(STORAGE.question, "1");
        setState("quiz");
        trackQuizStart();
        renderQuestion(1);
        scrollTop();
      });
  }

  function renderQuestion(index) {
    setState("quiz");
    sessionStorage.setItem(STORAGE.question, String(index));
    const q = QUESTIONS[index - 1];
    const selected = answers[q.key] || "";

    let optionsHtml = q.options
      .map(function (opt) {
        const sel = selected === opt.value ? " is-selected" : "";
        return (
          '<button type="button" class="roadmap-option' +
          sel +
          '" data-value="' +
          escapeAttr(opt.value) +
          '" aria-pressed="' +
          (selected === opt.value) +
          '">' +
          escapeHtml(opt.label) +
          "</button>"
        );
      })
      .join("");

    root.innerHTML =
      '<section class="roadmap-quiz">' +
      '<div class="roadmap-container">' +
      '<div class="roadmap-quiz-header">' +
      (index > 1
        ? '<button type="button" class="roadmap-back-btn" id="roadmap-back">← Back</button>'
        : '<span class="roadmap-back-spacer"></span>') +
      '<p class="roadmap-progress">Question ' +
      index +
      " of 15.</p>" +
      "</div>" +
      '<div class="roadmap-progress-bar" role="progressbar" aria-valuenow="' +
      index +
      '" aria-valuemin="1" aria-valuemax="15">' +
      '<div class="roadmap-progress-fill" style="width:' +
      Math.round((index / 15) * 100) +
      '%"></div>' +
      "</div>" +
      '<h2 class="roadmap-question-text">' +
      escapeHtml(q.text) +
      "</h2>" +
      '<div class="roadmap-options" role="radiogroup" aria-label="' +
      escapeAttr(q.text) +
      '">' +
      optionsHtml +
      "</div>" +
      "</div></section>";

    if (index > 1) {
      document
        .getElementById("roadmap-back")
        .addEventListener("click", function () {
          currentQuestion = index - 1;
          renderQuestion(currentQuestion);
          scrollTop();
        });
    }

    root.querySelectorAll(".roadmap-option").forEach(function (btn) {
      btn.addEventListener("click", function () {
        const value = btn.getAttribute("data-value");
        answers[q.key] = value;
        saveAnswers();

        root.querySelectorAll(".roadmap-option").forEach(function (b) {
          b.classList.remove("is-selected");
          b.setAttribute("aria-pressed", "false");
        });
        btn.classList.add("is-selected");
        btn.setAttribute("aria-pressed", "true");

        setTimeout(function () {
          if (index < 15) {
            currentQuestion = index + 1;
            renderQuestion(currentQuestion);
          } else {
            setState("contact");
            renderContact();
          }
          scrollTop();
        }, 280);
      });
    });
  }

  function renderContact() {
    setState("contact");
    const c = contact || {};

    root.innerHTML =
      '<section class="roadmap-contact">' +
      '<div class="roadmap-container">' +
      "<h2>One last step — where should we send your stage report?</h2>" +
      '<form id="roadmap-contact-form" class="roadmap-form" novalidate>' +
      '<div class="roadmap-field">' +
      '<label for="roadmap-first-name">First name <span class="roadmap-required">*</span></label>' +
      '<input type="text" id="roadmap-first-name" name="first_name" class="squeeze-form-input" required autocomplete="given-name" value="' +
      escapeAttr(c.first_name || "") +
      '">' +
      "</div>" +
      '<div class="roadmap-field">' +
      '<label for="roadmap-last-name">Last name <span class="roadmap-required">*</span></label>' +
      '<input type="text" id="roadmap-last-name" name="last_name" class="squeeze-form-input" required autocomplete="family-name" value="' +
      escapeAttr(c.last_name || "") +
      '">' +
      "</div>" +
      '<div class="roadmap-field">' +
      '<label for="roadmap-email">Email <span class="roadmap-required">*</span></label>' +
      '<input type="email" id="roadmap-email" name="email" class="squeeze-form-input" required autocomplete="email" value="' +
      escapeAttr(c.email || "") +
      '">' +
      '<p class="roadmap-field-error" id="roadmap-email-error" hidden>Please enter a valid email address.</p>' +
      "</div>" +
      '<div class="roadmap-field">' +
      '<label for="roadmap-phone">Phone <span class="roadmap-optional">(optional)</span></label>' +
      '<input type="tel" id="roadmap-phone" name="phone" class="squeeze-form-input" autocomplete="tel" value="' +
      escapeAttr(c.phone || "") +
      '">' +
      "</div>" +
      '<p class="squeeze-form-microcopy">Your full stage report also lands in your inbox.</p>' +
      '<button type="submit" class="squeeze-form-button">Show My Stage →</button>' +
      "</form>" +
      "</div></section>";

    document
      .getElementById("roadmap-contact-form")
      .addEventListener("submit", function (e) {
        e.preventDefault();
        const firstName = document
          .getElementById("roadmap-first-name")
          .value.trim();
        const lastName = document
          .getElementById("roadmap-last-name")
          .value.trim();
        const email = document.getElementById("roadmap-email").value.trim();
        const phone = document.getElementById("roadmap-phone").value.trim();
        const emailError = document.getElementById("roadmap-email-error");

        if (!firstName || !lastName || !email) {
          return;
        }

        if (!isValidEmail(email)) {
          emailError.hidden = false;
          document
            .getElementById("roadmap-email")
            .classList.add("roadmap-input-error");
          return;
        }

        emailError.hidden = true;
        document
          .getElementById("roadmap-email")
          .classList.remove("roadmap-input-error");

        const contactData = {
          first_name: firstName,
          last_name: lastName,
          email: email,
          phone: phone,
        };
        saveContact(contactData);
        setState("results");

        const stage = computeStage(answers);
        fireWebhook(contactData, stage);
        renderResults();
        scrollTop();
      });
  }

  function renderResults() {
    setState("results");
    const stage = computeStage(answers);
    const stageName = STAGE_NAMES[stage];
    const copy = STAGE_COPY[stage];
    const c = contact || {};

    trackQuizComplete(stage);

    let conditionalHtml = "";
    if (
      stage <= 2 &&
      (answers.cv_status === "academic" ||
        answers.philosophy_status === "drafted" ||
        answers.syllabus_status === "complete" ||
        answers.demo_status === "true-demo")
    ) {
      conditionalHtml +=
        '<p class="roadmap-conditional">' + OUT_OF_ORDER_LINE + "</p>";
    }
    if (answers.segment === "current-faculty") {
      conditionalHtml +=
        '<p class="roadmap-conditional">' + FACULTY_LINE + "</p>";
    }

    let ctaHtml = "";
    if (answers.segment === "full-time-phd") {
      ctaHtml =
        '<div class="roadmap-phd-message"><p>' + PHD_MESSAGE + "</p></div>";
    } else {
      ctaHtml =
        '<div class="roadmap-cta-section">' +
        "<h3>Book a free strategy call</h3>" +
        "<p>" +
        escapeHtml(copy.cta_line) +
        "</p>" +
        '<div class="roadmap-calendar" id="roadmap-calendar"></div>' +
        "</div>";
    }

    root.innerHTML =
      '<section class="roadmap-results">' +
      '<div class="roadmap-container">' +
      "<h2>You're at Stage " +
      stage +
      " of 9: " +
      escapeHtml(stageName) +
      "</h2>" +
      '<div class="roadmap-result-body">' +
      copy.body +
      conditionalHtml +
      "</div>" +
      ctaHtml +
      "</div></section>";

    if (answers.segment !== "full-time-phd") {
      injectCalendar(c);
    }
  }

  const CALENDAR_IFRAME_ID = "t9LJu6ITlc9ERcPacm3V_1783544973759";

  function calendarFallbackHeight() {
    return 1300;
  }

  function bindCalendarHeightListener() {
    if (window.__roadmapCalendarHeightBound) return;
    window.__roadmapCalendarHeightBound = true;

    window.addEventListener("message", function (event) {
      if (typeof event.data !== "string") return;
      if (event.data.indexOf("[iFrameSizer]") !== 0) return;

      const iframe = document.getElementById(CALENDAR_IFRAME_ID);
      if (!iframe) return;

      const parts = event.data.split(":");
      const height = parseInt(parts[1], 10);
      if (parts[3] === CALENDAR_IFRAME_ID && height > 0) {
        const px = Math.max(height + 5, 900) + "px";
        iframe.style.height = px;
        iframe.style.minHeight = px;
      }
    });
  }

  function injectCalendar(c) {
    const container = document.getElementById("roadmap-calendar");
    if (!container) return;

    bindCalendarHeightListener();

    const params = new URLSearchParams();
    if (c.first_name) params.set("first_name", c.first_name);
    if (c.last_name) params.set("last_name", c.last_name);
    if (c.email) params.set("email", c.email);
    if (c.phone) params.set("phone", c.phone);

    const base =
      "https://api.leadconnectorhq.com/widget/booking/t9LJu6ITlc9ERcPacm3V";
    const src = params.toString() ? base + "?" + params.toString() : base;
    const height = calendarFallbackHeight();

    container.innerHTML =
      '<iframe src="' +
      escapeAttr(src) +
      '" style="width:100%;height:' +
      height +
      "px;min-height:" +
      height +
      'px;border:none;" scrolling="yes" id="' +
      CALENDAR_IFRAME_ID +
      '" title="Book a free strategy call"></iframe>';
  }

  function buildWebhookPayload(contactData, stage) {
    const stageName = STAGE_NAMES[stage];
    const payload = {
      first_name: contactData.first_name,
      last_name: contactData.last_name,
      email: contactData.email,
      phone: contactData.phone || "",
      readiness_stage: stage,
      stage_name: stageName,
      utm_source: getUtm("utm_source"),
      utm_medium: getUtm("utm_medium"),
      utm_campaign: getUtm("utm_campaign"),
      page_url: window.location.href,
      submitted_at: new Date().toISOString(),
    };

    QUESTIONS.forEach(function (q) {
      payload[q.key] = answers[q.key] || "";
    });

    return payload;
  }

  function fireWebhook(contactData, stage) {
    const payload = buildWebhookPayload(contactData, stage);

    function send(mode) {
      const opts = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        keepalive: true,
      };
      if (mode === "no-cors") {
        opts.mode = "no-cors";
        opts.headers = { "Content-Type": "text/plain" };
      }
      return fetch(GHL_WEBHOOK_URL, opts);
    }

    send("cors")
      .then(function (res) {
        if (!res.ok) throw new Error("Webhook HTTP " + res.status);
      })
      .catch(function () {
        return new Promise(function (resolve) {
          setTimeout(resolve, 2000);
        }).then(function () {
          return send("cors");
        });
      })
      .catch(function () {
        return send("no-cors");
      })
      .catch(function (err) {
        console.error("Roadmap webhook failed:", err);
      });
  }

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function escapeAttr(str) {
    return escapeHtml(str).replace(/'/g, "&#39;");
  }
})();
