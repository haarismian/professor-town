/* Professor Town - Book Consultation application form */
(function () {
  "use strict";

  const form = document.getElementById("bc-form");
  if (!form) return;

  /* ============================================
     Configuration
     ============================================ */

  const CALENDAR_URL =
    "https://api.leadconnectorhq.com/widget/bookings/industry-to-academia-consult";

  const MASTERCLASS_URL = "/academic-job-masterclass/";

  const NOTIFY_EMAIL = "hello@professortown.com";

  // FormSubmit relays the answers straight to NOTIFY_EMAIL with no backend.
  // The first submission after deploy sends a one-time activation link to that
  // inbox; answers only start arriving once it has been clicked.
  const EMAIL_ENDPOINT = "https://formsubmit.co/ajax/" + NOTIFY_EMAIL;

  // Optional: paste an inbound webhook URL from GoHighLevel to also push the
  // application into the CRM. Left empty, only the email above is sent.
  const GHL_WEBHOOK_URL = "";

  // Answers that end the application before the calendar.
  const BLOCK_FREE_RESOURCES = "No, I'm only looking for free resources";
  const BLOCK_ROLE_START = "2-3 years from now";

  const CALENDAR_IFRAME_ID = "bc-calendar-iframe";

  /* ============================================
     Video facade
     ============================================ */

  const facade = document.getElementById("bc-video-facade");
  if (facade) {
    facade.addEventListener("click", function () {
      const wrapper = document.getElementById("bc-video");
      const videoId = wrapper.getAttribute("data-video-id");
      const iframe = document.createElement("iframe");
      iframe.src =
        "https://www.youtube-nocookie.com/embed/" +
        encodeURIComponent(videoId) +
        "?autoplay=1&rel=0&modestbranding=1";
      iframe.title = "Professor Town training";
      iframe.allow =
        "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
      iframe.allowFullscreen = true;
      wrapper.innerHTML = "";
      wrapper.appendChild(iframe);
      track("vsl_play");
    });
  }

  /* ============================================
     Segment router
     ============================================ */

  const branchIds = [
    "bc-branch-industry",
    "bc-branch-phd",
    "bc-branch-faculty",
    "bc-branch-other",
  ];

  form.querySelectorAll('input[name="segment"]').forEach(function (radio) {
    radio.addEventListener("change", function () {
      const target = radio.getAttribute("data-branch");
      branchIds.forEach(function (id) {
        const fs = document.getElementById(id);
        const isActive = id === target;
        fs.hidden = !isActive;
        fs.disabled = !isActive;
        if (!isActive) clearBranchErrors(fs);
      });
      clearFieldError(radio.closest("[data-field]"));
    });
  });

  branchIds.forEach(function (id) {
    document.getElementById(id).disabled = true;
  });

  function clearBranchErrors(fieldset) {
    fieldset.querySelectorAll("[data-field]").forEach(clearFieldError);
  }

  /* ============================================
     Radio group semantics
     ============================================ */

  form.querySelectorAll(".bc-field").forEach(function (block, index) {
    const group = block.querySelector(".bc-options");
    const heading = block.querySelector(":scope > .bc-question-label");
    if (!group || !heading) return;

    if (!heading.id) heading.id = "bc-group-label-" + index;
    group.setAttribute("role", "radiogroup");
    group.setAttribute("aria-labelledby", heading.id);
  });

  /* ============================================
     Validation
     ============================================ */

  function activeFieldBlocks() {
    return [].filter.call(
      form.querySelectorAll("[data-field]"),
      function (block) {
        const parentFieldset = block.closest("fieldset[disabled]");
        return !parentFieldset && !block.hidden;
      },
    );
  }

  function blockControls(block) {
    return [].filter.call(
      block.querySelectorAll("input, select, textarea"),
      function (el) {
        return !el.disabled;
      },
    );
  }

  function labelFor(block) {
    const source =
      block.querySelector(":scope > label") ||
      block.querySelector(":scope > .bc-question-label") ||
      block.querySelector(":scope > legend") ||
      (block.tagName === "FIELDSET" ? block.querySelector("legend") : null);
    if (!source) return block.getAttribute("data-field");
    return source.textContent
      .replace(/\s+/g, " ")
      .trim()
      .replace(/\s*\*$/, "")
      .replace(/^\d+\.\s*/, "")
      .trim();
  }

  function valueOf(block) {
    const controls = blockControls(block);
    const radios = controls.filter(function (el) {
      return el.type === "radio";
    });
    if (radios.length) {
      const checked = radios.find(function (el) {
        return el.checked;
      });
      return checked ? checked.value : "";
    }
    const first = controls[0];
    return first ? first.value.trim() : "";
  }

  function isRequired(block) {
    return blockControls(block).some(function (el) {
      return el.required;
    });
  }

  function validate() {
    let firstInvalid = null;

    activeFieldBlocks().forEach(function (block) {
      clearFieldError(block);
      if (!isRequired(block)) return;

      const value = valueOf(block);
      let message = "";

      if (!value) {
        message = blockControls(block).some(function (el) {
          return el.type === "radio";
        })
          ? "Please choose an option."
          : "This field is required.";
      } else if (block.getAttribute("data-field") === "email") {
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          message = "Please enter a valid email address.";
        }
      } else if (block.getAttribute("data-field") === "phone") {
        if (value.replace(/\D/g, "").length < 7) {
          message = "Please enter a phone number we can reach you on.";
        }
      }

      if (message) {
        showFieldError(block, message);
        if (!firstInvalid) firstInvalid = block;
      }
    });

    return firstInvalid;
  }

  function showFieldError(block, message) {
    const error = document.createElement("p");
    error.className = "bc-error";
    error.textContent = message;
    block.appendChild(error);
    blockControls(block).forEach(function (el) {
      if (el.type !== "radio") el.classList.add("bc-input-error");
    });
  }

  function clearFieldError(block) {
    if (!block) return;
    block.querySelectorAll(".bc-error").forEach(function (el) {
      el.remove();
    });
    block.querySelectorAll(".bc-input-error").forEach(function (el) {
      el.classList.remove("bc-input-error");
    });
  }

  form.addEventListener("change", function (event) {
    const block = event.target.closest("[data-field]");
    if (block) clearFieldError(block);
  });

  /* ============================================
     Collection
     ============================================ */

  function collect() {
    const answers = [];
    const byKey = {};

    activeFieldBlocks().forEach(function (block) {
      const key = block.getAttribute("data-field");
      const value = valueOf(block);
      byKey[key] = value;
      if (value)
        answers.push({ key: key, label: labelFor(block), value: value });
    });

    return { answers: answers, byKey: byKey };
  }

  function disqualifyReasons(byKey) {
    const reasons = [];
    if (byKey.financial_readiness === BLOCK_FREE_RESOURCES) {
      reasons.push("Only looking for free resources");
    }
    if (byKey.role_start === BLOCK_ROLE_START) {
      reasons.push("Next role is 2-3 years out");
    }
    return reasons;
  }

  function reviewFlags(byKey) {
    const flags = [];
    if (byKey.role_track === "Research-track") {
      flags.push(
        "Targeting research-track (R1) roles only — program is built for teaching-focused hiring",
      );
    }
    if (byKey.financial_readiness === "I'd need 30-60 days to be ready") {
      flags.push("Needs 30–60 days before investing");
    }
    return flags;
  }

  /* ============================================
     Submit
     ============================================ */

  const submitBtn = document.getElementById("bc-submit");
  const submitError = document.getElementById("bc-submit-error");

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    submitError.hidden = true;

    const firstInvalid = validate();
    if (firstInvalid) {
      firstInvalid.scrollIntoView({ behavior: "smooth", block: "center" });
      const control = blockControls(firstInvalid)[0];
      if (control) control.focus({ preventScroll: true });
      return;
    }

    const collected = collect();
    const reasons = disqualifyReasons(collected.byKey);
    const flags = reviewFlags(collected.byKey);

    if (reasons.length) {
      track("consultation_disqualified", { reasons: reasons.join("; ") });
      openNotAFitModal();
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = "Sending…";

    track("consultation_qualified");

    // A slow or blocked relay must never cost a qualified booking, so the
    // calendar is revealed on whichever finishes first.
    Promise.race([
      notify(collected, flags).catch(function (err) {
        console.error("Consultation notification failed:", err);
        track("consultation_notify_failed");
      }),
      new Promise(function (resolve) {
        setTimeout(resolve, 6000);
      }),
    ]).then(function () {
      showCalendar(collected.byKey);
    });
  });

  function notify(collected, flags) {
    const meta = {
      "Submitted at": new Date().toLocaleString(),
      "Page URL": window.location.href,
      "Review flags": flags.length ? flags.join(" | ") : "None",
    };

    const utms = getUtms();
    Object.keys(utms).forEach(function (key) {
      meta[key] = utms[key];
    });

    const name = collected.byKey.first_name + " " + collected.byKey.last_name;

    const emailPayload = {
      _subject: "New consultation application — " + name,
      _template: "table",
      _captcha: "false",
      name: name,
      email: collected.byKey.email,
    };

    collected.answers.forEach(function (item) {
      emailPayload[item.label] = item.value;
    });
    Object.keys(meta).forEach(function (key) {
      emailPayload[key] = meta[key];
    });

    const requests = [
      fetch(EMAIL_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(emailPayload),
        keepalive: true,
      }).then(function (res) {
        return res.json().then(function (data) {
          // FormSubmit answers 200 with success:"false" until the recipient
          // clicks the one-time activation link it emails on first use.
          if (String(data.success) !== "true") {
            console.warn(
              "Answers were not emailed. FormSubmit says:",
              data.message || data,
            );
            track("consultation_email_rejected");
          }
        });
      }),
    ];

    if (GHL_WEBHOOK_URL) {
      const crmPayload = {
        first_name: collected.byKey.first_name,
        last_name: collected.byKey.last_name,
        email: collected.byKey.email,
        phone: collected.byKey.phone,
        review_flags: flags.join(" | "),
        page_url: window.location.href,
        submitted_at: new Date().toISOString(),
      };
      collected.answers.forEach(function (item) {
        crmPayload[item.key] = item.value;
      });
      Object.keys(utms).forEach(function (key) {
        crmPayload[key.toLowerCase().replace(/\s+/g, "_")] = utms[key];
      });

      requests.push(
        fetch(GHL_WEBHOOK_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(crmPayload),
          keepalive: true,
        }),
      );
    }

    return Promise.all(requests);
  }

  function getUtms() {
    const params = new URLSearchParams(window.location.search);
    const out = {};
    [
      "utm_source",
      "utm_medium",
      "utm_campaign",
      "utm_content",
      "utm_term",
    ].forEach(function (key) {
      const value = params.get(key);
      if (value) out[key] = value;
    });
    return out;
  }

  /* ============================================
     Calendar
     ============================================ */

  function showCalendar(byKey) {
    const step = document.getElementById("bc-calendar-step");
    const frame = document.getElementById("bc-calendar-frame");
    const formSection = document.getElementById("bc-application");

    const params = new URLSearchParams();
    if (byKey.first_name) params.set("first_name", byKey.first_name);
    if (byKey.last_name) params.set("last_name", byKey.last_name);
    if (byKey.email) params.set("email", byKey.email);
    if (byKey.phone) params.set("phone", byKey.phone);

    frame.innerHTML =
      '<iframe src="' +
      escapeAttr(CALENDAR_URL + "?" + params.toString()) +
      '" id="' +
      CALENDAR_IFRAME_ID +
      '" scrolling="no" title="Book your strategy call"></iframe>';

    bindCalendarResize();
    loadCalendarEmbedScript();

    formSection.hidden = true;
    step.hidden = false;
    step.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function loadCalendarEmbedScript() {
    if (document.getElementById("bc-ghl-embed")) return;
    const script = document.createElement("script");
    script.id = "bc-ghl-embed";
    script.src = "https://link.msgsndr.com/js/form_embed.js";
    document.body.appendChild(script);
  }

  // The booking widget reports its height over postMessage; without this the
  // iframe keeps its min-height and the month view can clip.
  function bindCalendarResize() {
    window.addEventListener("message", function (event) {
      if (typeof event.data !== "string") return;
      if (event.data.indexOf("[iFrameSizer]") !== 0) return;

      const iframe = document.getElementById(CALENDAR_IFRAME_ID);
      if (!iframe) return;

      const parts = event.data.split(":");
      const height = parseInt(parts[1], 10);
      if (height > 0) {
        iframe.style.height = Math.max(height + 5, 700) + "px";
      }
    });
  }

  /* ============================================
     Not-a-fit modal
     ============================================ */

  function openNotAFitModal() {
    const backdrop = document.createElement("div");
    backdrop.className = "bc-modal-backdrop";
    backdrop.innerHTML =
      '<div class="bc-modal" role="dialog" aria-modal="true" aria-labelledby="bc-modal-title">' +
      '<h2 id="bc-modal-title">Looks like we\'re not a fit right now</h2>' +
      "<p>Based on your answers, a paid coaching call isn't the right next step for you today — and we'd rather tell you that than sell you something.</p>" +
      "<p>Start with the free masterclass instead. It covers how faculty hiring actually works and what committees look for. When your timing and budget line up, come back and apply again.</p>" +
      '<div class="bc-modal-actions">' +
      '<a href="' +
      MASTERCLASS_URL +
      '" class="bc-cta" id="bc-modal-primary">Get the Free Masterclass →</a>' +
      '<button type="button" class="bc-modal-secondary" id="bc-modal-close">Go back and change my answers</button>' +
      "</div></div>";

    document.body.appendChild(backdrop);
    document.body.style.overflow = "hidden";

    const primary = backdrop.querySelector("#bc-modal-primary");
    primary.focus();

    function close() {
      backdrop.remove();
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKeydown);
      submitBtn.focus();
    }

    function onKeydown(event) {
      if (event.key === "Escape") close();
    }

    backdrop.querySelector("#bc-modal-close").addEventListener("click", close);
    backdrop.addEventListener("click", function (event) {
      if (event.target === backdrop) close();
    });
    document.addEventListener("keydown", onKeydown);
  }

  /* ============================================
     Helpers
     ============================================ */

  function track(name, props) {
    if (window.posthog && typeof window.posthog.capture === "function") {
      window.posthog.capture(name, props || {});
    }
    if (typeof window.fbq === "function") {
      window.fbq("trackCustom", name, props || {});
    }
    if (window.dataLayer && Array.isArray(window.dataLayer)) {
      window.dataLayer.push(Object.assign({ event: name }, props || {}));
    }
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
