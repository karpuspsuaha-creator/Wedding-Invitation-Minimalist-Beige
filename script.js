/* ============================================================
   PREMIUM WEDDING INVITATION - script.js
   ============================================================ */
(async function () {
  "use strict";

  // --- CONFIG: sumber tunggal (config.js) ---
  // Config diambil LANGSUNG dari file config.js di server (fetch tanpa cache)
  // -> kalau config.js di-upload ulang, isi undangan ikut berubah tanpa
  //    perlu upload index.html / script.js / styles.css lagi.
  // Fallback: config dari tag <script> (mis. saat dibuka langsung dari file://)
  const CONFIG_URL = "config.js";
  function evalConfigSource(raw) {
    const s = document.createElement("script");
    s.textContent = raw;
    document.head.appendChild(s);
    s.remove();
    return (typeof window.WEDDING_CONFIG !== "undefined") ? window.WEDDING_CONFIG : null;
  }
  async function fetchConfigSource() {
    const ctrl = typeof AbortController !== "undefined" ? new AbortController() : null;
    const timer = window.setTimeout(() => { if (ctrl) ctrl.abort(); }, 3000);
    try {
      const res = await fetch(`${CONFIG_URL}?t=${Date.now()}`, {
        cache: "no-store",
        signal: ctrl ? ctrl.signal : undefined,
      });
      if (!res.ok) return null;
      return await res.text();
    } catch (e) {
      return null; // dibuka dari file:// atau offline -> pakai config bawaan
    } finally {
      window.clearTimeout(timer);
    }
  }

  const embeddedConfig = (typeof WEDDING_CONFIG !== "undefined") ? WEDDING_CONFIG : {};
  let C = embeddedConfig;
  let configSource = "";
  const fetchedSource = await fetchConfigSource();
  if (fetchedSource) {
    try {
      const parsed = evalConfigSource(fetchedSource);
      if (parsed) {
        C = parsed;
        configSource = fetchedSource;
      }
    } catch (e) {
      console.warn("config.js tidak bisa dibaca, memakai config bawaan.", e);
    }
  }

  // --- Helpers ---
  const $ = (id) => document.getElementById(id);
  const setText = (id, v) => { const el = $(id); if (el) el.textContent = v; };
  const setHTML = (id, v) => { const el = $(id); if (el) el.innerHTML = v; };
  const UI = C.ui || {};

  // --- Zona waktu acara (WIB / UTC+7) ---
  // Waktu acara DIKUNCI ke WIB, bukan memakai jam lokal perangkat, supaya
  // countdown & tanggal live sama untuk semua tamu (HP yg zona waktunya beda).
  const EVENT_TZ = "+07:00";
  const EVENT_TZ_NAME = "Asia/Jakarta";
  function parseEventDate(value) {
    if (!value) return null;
    const str = String(value).trim();
    // string yang sudah punya offset (Z / +07:00) dipakai apa adanya
    if (/(Z|[+-]\d{2}:?\d{2})$/i.test(str)) return new Date(str);
    return new Date(str + EVENT_TZ);
  }

  // --- Title ---
  document.title = `The Wedding of ${C.bride.name} & ${C.groom.name}`;

  // --- Teks statis (dari config.ui) ---
  if (UI.loaderText) setText("loaderText", UI.loaderText);
  if (UI.coverTopline) setText("coverTopline", UI.coverTopline);
  if (UI.openButton) setText("openButtonLabel", UI.openButton);
  if (UI.scrollHint) setText("scrollHint", UI.scrollHint);
  if (UI.greetingCaption) setText("greetingCaption", UI.greetingCaption);
  if (UI.brideFamilyLabel) setText("brideFamilyLabel", UI.brideFamilyLabel);
  if (UI.groomFamilyLabel) setText("groomFamilyLabel", UI.groomFamilyLabel);
  if (UI.galleryTitle) setText("galleryTitle", UI.galleryTitle);
  if (UI.countdownTitle) setText("countdownTitle", UI.countdownTitle);
  if (UI.venueTitle) setText("venueTitle", UI.venueTitle);
  if (UI.venueMapLabel) setText("mapStyle", UI.venueMapLabel);
  if (UI.liveCalendar) {
    const calSpan = document.querySelector("#liveCalendar span");
    if (calSpan) calSpan.textContent = UI.liveCalendar;
  }
  if (UI.liveYoutube) {
    const ytSpan = document.querySelector("#liveBtnYoutube span");
    if (ytSpan) ytSpan.textContent = UI.liveYoutube;
  }
  if (UI.liveInstagram) {
    const igSpan = document.querySelector("#liveBtnInstagram span");
    if (igSpan) igSpan.textContent = UI.liveInstagram;
  }
  if (UI.guestTitle) setText("guestTitle", UI.guestTitle);
  if (UI.rsvpLabel) setText("rsvpLabel", UI.rsvpLabel);
  if (UI.rsvpSub) setText("rsvpSub", UI.rsvpSub);
  if (UI.guestSend) {
    const sendSpan = document.querySelector("#guestSend span");
    if (sendSpan) sendSpan.textContent = UI.guestSend;
  }
  if (UI.countdownUnits) {
    const units = UI.countdownUnits;
    const cdItems = document.querySelectorAll(".cd-item .cd-unit");
    const order = ["days", "hours", "mins", "secs"];
    cdItems.forEach((el, i) => { if (units[order[i]]) el.textContent = units[order[i]]; });
  }
  if (UI.guestYes || UI.guestNo) {
    const opts = document.querySelectorAll(".guest-opt");
    if (opts[0] && UI.guestYes) { opts[0].textContent = UI.guestYes; opts[0].setAttribute("data-value", UI.guestYes); }
    if (opts[1] && UI.guestNo) { opts[1].textContent = UI.guestNo; opts[1].setAttribute("data-value", UI.guestNo); }
  }
  if (UI.guestNamePlaceholder) {
    const n = $("guestName");
    if (n) n.placeholder = UI.guestNamePlaceholder;
  }
  if (UI.guestMsgPlaceholder) {
    const m = $("guestMsg");
    if (m) m.placeholder = UI.guestMsgPlaceholder;
  }

  // --- Cover ---
  const cover = $("cover");
  const coverMedia = document.querySelector(".cover-media");
  if (coverMedia && C.photos && C.photos.couple) {
    coverMedia.style.backgroundImage = `url('${C.photos.couple}')`;
    coverMedia.style.backgroundSize = "cover";
    coverMedia.style.backgroundPosition = "center";
  }
  const coverMonogram = $("coverMonogram");
  if (coverMonogram && C.bride && C.groom) {
    coverMonogram.innerHTML = `${C.bride.name.charAt(0)}<span>&amp;</span>${C.groom.name.charAt(0)}`;
  }
  setText("coverNames", `${C.bride.name} & ${C.groom.name}`);
  if (C.greeting && C.greeting.subtitle) setText("coverSub", C.greeting.subtitle);
  const hero = document.querySelector(".hero");
  const heroMedia = $("heroMedia");
  if (heroMedia && C.photos && C.photos.couple) {
    heroMedia.style.backgroundImage = `url('${C.photos.couple}')`;
    heroMedia.style.backgroundSize = "cover";
    heroMedia.style.backgroundPosition = "center";
  }
  const heroMonogram = $("heroMonogram");
  if (heroMonogram && C.bride && C.groom) {
    heroMonogram.innerHTML = `${C.bride.name.charAt(0)}<span>&amp;</span>${C.groom.name.charAt(0)}`;
  }
  setText("heroNames", `${C.bride.name} & ${C.groom.name}`);
  if (C.greeting && C.greeting.subtitle) setText("heroSub", C.greeting.subtitle);

  // --- Greeting ---
  setText("greetingPre", (C.greeting && C.greeting.title) ? C.greeting.title : "The Wedding of");
  setText("greetingNames", `${C.bride.name} & ${C.groom.name}`);
  if (C.greeting) {
    setText("greetingBismillah", C.greeting.bismillah);
    setText("greetingSalam", C.greeting.salam);
    setText("greetingMsg", C.greeting.message);
    setText("greetingMsg2", C.greeting.message2);
    setText("greetingDuaa", C.greeting.duaa);
    setText("greetingDuaaMeaning", C.greeting.duaaMeaning);
    setText("greetingWassalam", C.greeting.wassalam);
  }
  setText("brideParents", (C.bride && C.bride.parents) || "");
  setText("groomParents", (C.groom && C.groom.parents) || "");

  // --- Greeting photo ---
  const greetPhoto = $("greetingPhoto");
  if (greetPhoto && C.photos) {
    const gpSrc = C.photos.greeting || C.photos.couple || C.photos.bride || (Array.isArray(C.photos.gallery) ? C.photos.gallery[0] : null);
    if (gpSrc) greetPhoto.src = gpSrc;
    greetPhoto.addEventListener("click", () => {
      const full = (C.photos && C.photos.greetingFull) || greetPhoto.currentSrc || greetPhoto.src;
      openLightbox(full, true);
    });
  }

  // --- Couple gallery (polaroid) ---
  const grid = $("galleryGrid") || $("polaroid");
  if (grid && C.photos && Array.isArray(C.photos.gallery)) {
    const photos = C.photos.gallery;
    grid.innerHTML = "";
    photos.forEach((src, i) => {
      const figure = document.createElement("figure");
      const img = document.createElement("img");
      img.src = src;
      img.alt = `Foto ${i + 1}`;
      img.loading = "lazy";
      img.addEventListener("click", () => openLightbox(src));
      const caption = document.createElement("figcaption");
      caption.textContent = UI.galleryCaption || "Our Moment";
      figure.appendChild(img);
      figure.appendChild(caption);
      // bingkai lebar: pertama, dan terakhir bila jumlahnya genap
      if (i === 0 || (i === photos.length - 1 && photos.length % 2 === 0)) {
        figure.classList.add("wide");
      }
      grid.appendChild(figure);
    });
  }

  // --- Schedule (timeline) ---
  const EVENT_ICONS = {
    book: '<path d="M5 4.6A1.6 1.6 0 0 1 6.6 3H19v15.5H6.6A1.6 1.6 0 0 0 5 20.1z"/><path d="M5 4.6v15.5"/><path d="M19 18.5V21H6.6"/><path d="M9 7.6h6"/><path d="M9 10.6h4"/>',
    camera: '<path d="M3.5 8.8A1.8 1.8 0 0 1 5.3 7h1.9l1.1-2.2h7.4L16.8 7h1.9a1.8 1.8 0 0 1 1.8 1.8v8.4a1.8 1.8 0 0 1-1.8 1.8H5.3a1.8 1.8 0 0 1-1.8-1.8z"/><circle cx="12" cy="13" r="3.3"/>',
    feast: '<path d="M3.6 15.6a8.4 8.4 0 0 1 16.8 0z"/><path d="M2.4 15.6h19.2"/><path d="M12 5.4v1.8"/>',
    cake: '<path d="M4 20.5h16"/><path d="M5.5 20.5v-5.8a2.2 2.2 0 0 1 2.2-2.2h8.6a2.2 2.2 0 0 1 2.2 2.2v5.8"/><path d="M12 12.5V8.9"/><path d="M12 6.4c1-.8.7-2 0-2.8-.7.8-1 2 0 2.8z"/>',
    music: '<path d="M9 17.5V5.2l9.5-1.8v12.3"/><circle cx="6.8" cy="17.6" r="2.4"/><circle cx="16.3" cy="15.8" r="2.4"/>',
    rings: '<circle cx="9.3" cy="14.2" r="5.4"/><circle cx="14.7" cy="14.2" r="5.4"/><path d="M12 4.2l1.9 2-1.9 2-1.9-2z"/>',
    pin: '<path d="M12 21.2s6.4-6.1 6.4-10.6a6.4 6.4 0 1 0-12.8 0C5.6 15.1 12 21.2 12 21.2z"/><circle cx="12" cy="10.5" r="2.4"/>',
    heart: '<path d="M12 20.3s-7.3-4.7-7.3-9.7a4.2 4.2 0 0 1 7.3-2.8 4.2 4.2 0 0 1 7.3 2.8c0 5-7.3 9.7-7.3 9.7z"/>',
    door: '<path d="M10 21H2" /> <path d="M10 3H7a2 2 0 00-2 2v16" /> <path d="M14 12h.01" /> <path d="M19 21V5a2 2 0 00-1.675-1.974l-6.163-1.013A1 1 0 0010 3v18a1 1 0 001.124.992z" /> <path d="M22 21h-3" />',
    handshake: '<path d="m11 17 2 2a1 1 0 1 0 3-3" /> <path d="m14 14 2.5 2.5a1 1 0 1 0 3-3l-3.88-3.88a3 3 0 0 0-4.24 0l-.88.88a1 1 0 1 1-3-3l2.81-2.81a5.79 5.79 0 0 1 7.06-.87l.47.28a2 2 0 0 0 1.42.25L21 4" /> <path d="m21 3 1 11h-2" /> <path d="M3 3 2 14l6.5 6.5a1 1 0 1 0 3-3" /> <path d="M3 4h8" />',
    party: '<path d="M5.8 11.3 2 22l10.7-3.79" /> <path d="M4 3h.01" /> <path d="M22 8h.01" /> <path d="M15 2h.01" /> <path d="M22 20h.01" /> <path d="m22 2-2.24.75a2.9 2.9 0 0 0-1.96 3.12c.1.86-.57 1.63-1.45 1.63h-.38c-.86 0-1.6.6-1.76 1.44L14 10" /> <path d="m22 13-.82-.33c-.86-.34-1.82.2-1.98 1.11c-.11.7-.72 1.22-1.43 1.22H17" /> <path d="m11 2 .33.82c.34.86-.2 1.82-1.11 1.98C9.52 4.9 9 5.52 9 6.23V7" /> <path d="M11 13c1.93 1.93 2.83 4.17 2 5-.83.83-3.07-.07-5-2-1.93-1.93-2.83-4.17-2-5 .83-.83 3.07.07 5 2Z" />',
    cutlery: '<path d="m16 2-2.3 2.3a3 3 0 0 0 0 4.2l1.8 1.8a3 3 0 0 0 4.2 0L22 8" /> <path d="M15 15 3.3 3.3a4.2 4.2 0 0 0 0 6l7.3 7.3c.7.7 2 .7 2.8 0L15 15Zm0 0 7 7" /> <path d="m2.1 21.8 6.4-6.3" /> <path d="m19 5-7 7" />',
    sunset: '<path d="M12 10V2" /> <path d="m4.93 10.93 1.41 1.41" /> <path d="M2 18h2" /> <path d="M20 18h2" /> <path d="m19.07 10.93-1.41 1.41" /> <path d="M22 22H2" /> <path d="m16 6-4 4-4-4" /> <path d="M16 18a4 4 0 0 0-8 0" />',
    gift: '<path d="M4 10.5h16v9.5H4z"/><path d="M3 7.5h18v3H3z"/><path d="M12 7.5V20"/><path d="M12 7.5S9.8 3.6 8 4.6s0 2.9 4 2.9z"/><path d="M12 7.5s2.2-3.9 4-2.9-.1 2.9-4 2.9z"/>',
  };
  const scheduleList = $("scheduleList");
  if (scheduleList) {
    const R = C.reception || {};
    if (R.title) setText("receptionTitle", R.title);
    if (R.subtitle) setText("receptionSubtitle", R.subtitle);
    if (R.quote) setText("receptionQuote", R.quote);
    const items = Array.isArray(R.events) ? R.events : [];
    scheduleList.innerHTML = "";
    items.forEach((it, i) => {
      const row = document.createElement("li");
      row.className = "tl-item";

      const num = document.createElement("div");
      num.className = "tl-num";
      num.textContent = String(i + 1).padStart(2, "0");

      const box = document.createElement("div");
      box.className = "tl-body";
      const icon = it.icon && EVENT_ICONS[it.icon]
        ? '<svg class="tl-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + EVENT_ICONS[it.icon] + "</svg>"
        : "";
      box.innerHTML =
        '<div class="tl-head">' +
        '<div class="tl-when"><span class="tl-time">' + (it.time || "") + "</span>" +
        (it.unit ? '<span class="tl-unit">' + it.unit + "</span>" : "") + "</div>" +
        (icon ? '<span class="tl-badge">' + icon + "</span>" : "") +
        "</div>" +
        (it.cat ? '<p class="tl-cat">' + it.cat + "</p>" : "") +
        '<h3 class="tl-title">' + (it.title || "") + "</h3>" +
        (it.desc ? '<p class="tl-desc">' + it.desc + "</p>" : "");


      row.appendChild(num);
      row.appendChild(box);
      scheduleList.appendChild(row);
    });
  }

  // --- Hero = salinan persis dari cover (tanpa tombol & tanpa id duplikat),
  //     sehingga setelah tombol "Buka Undangan" ditekan, tampilannya identik.
  const coverContentEl = document.querySelector(".cover-content");
  const heroContentEl = $("heroContent");
  if (coverContentEl && heroContentEl) {
    const clone = coverContentEl.cloneNode(true);
    clone.querySelectorAll("[id]").forEach((n) => n.removeAttribute("id"));
    // tombol dihapus tapi jejaknya (tinggi) dipertahankan supaya blok hero
    // sama tinggi dengan cover -> tidak ada lompat saat cover terangkat
    const cloneBtn = clone.querySelector(".open-button");
    if (cloneBtn) {
      const spacer = document.createElement("div");
      spacer.className = "open-button-spacer";
      spacer.setAttribute("aria-hidden", "true");
      cloneBtn.replaceWith(spacer);
    }
    heroContentEl.innerHTML = clone.innerHTML;
  }

  // --- Venue ---
  if (C.venue) {
    setText("venueName", C.venue.name);
    setText("venueHotel", C.venue.hotel || "");
    setText("venueAddr", C.venue.address);
    const link = $("venueLink");
    if (link) link.href = C.venue.mapsUrl || "#";
    const map = $("venueMap");
    if (map) {
      const hasCoords = C.venue.lat != null && C.venue.lng != null;
      if (hasCoords && window.L) {
        // peta bersih: tile Carto (light) + penanda emas, tanpa tombol Google
        const lm = L.map(map, {
          zoomControl: false, scrollWheelZoom: false, dragging: true, doubleClickZoom: false,
          attributionControl: true,
        }).setView([C.venue.lat, C.venue.lng], 16);
        // pilihan gaya peta (gratis, tanpa API key)
        const mapStyles = [
          { label: "Peta", url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", attr: "&copy; OpenStreetMap contributors" },
          { label: "Abu-abu", url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}", attr: "Tiles &copy; Esri" },
          { label: "Satelit", url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}", attr: "Tiles &copy; Esri" },
        ];
        let styleIndex = 0;
        let tileLayer = L.tileLayer(mapStyles[0].url, { maxZoom: 19, attribution: mapStyles[0].attr }).addTo(lm);
        const marker = L.circleMarker([C.venue.lat, C.venue.lng], {
          radius: 9, color: "#765926", weight: 2, fillColor: "#e2c99d", fillOpacity: 1,
        }).addTo(lm);
        const styleBtn = $("mapStyle");
        if (styleBtn) {
          styleBtn.textContent = mapStyles[0].label;
          styleBtn.addEventListener("click", function () {
            styleIndex = (styleIndex + 1) % mapStyles.length;
            const st = mapStyles[styleIndex];
            lm.removeLayer(tileLayer);
            tileLayer = L.tileLayer(st.url, { maxZoom: 19, attribution: st.attr }).addTo(lm);
            tileLayer.bringToBack();
            marker.bringToFront();
            styleBtn.textContent = st.label;
          });
        }
        setTimeout(function () { lm.invalidateSize(); }, 400);
      } else {
        // fallback: embed Google Maps
        const src = hasCoords
          ? `https://www.google.com/maps?q=${C.venue.lat},${C.venue.lng}&z=16&output=embed`
          : `https://www.google.com/maps?q=${encodeURIComponent(C.venue.address || C.venue.name)}&output=embed`;
        map.innerHTML = `<iframe loading="lazy" src="${src}" allowfullscreen></iframe>`;
      }
    }
  }

  // --- RSVP ---
  setText("rsvpTitle", `${C.bride.name} & ${C.groom.name}`);
  setText("signBride", C.bride.name);
  setText("signGroom", C.groom.name);

  // --- Live streaming ---
  const liveCfg = C.live || {};

  // --- Section live streaming ---
  if (liveCfg.title) setText("liveTitle", liveCfg.title);
  if (liveCfg.subtitle) setText("liveSub", liveCfg.subtitle);
  if (liveCfg.label) setText("liveLabel", liveCfg.label);
  if (liveCfg.desc) setText("liveDesc", liveCfg.desc);
  if (liveCfg.note) setText("liveNote", liveCfg.note);
  const liveBtnYt = $("liveBtnYoutube");
  const liveBtnIg = $("liveBtnInstagram");
  const liveVideo = $("liveVideo");
  const liveThumb = $("liveThumb");
  const liveDateEl = $("liveDate");
  const liveTimeEl = $("liveTime");
  const liveCal = $("liveCalendar");

  if (liveCfg.hint) setText("liveHint", liveCfg.hint);
  // link live belum ada -> desain tetap tampil, thumbnail disembunyikan saja
  if (liveCfg.youtubeId && liveThumb) {
    liveThumb.src = `https://img.youtube.com/vi/${liveCfg.youtubeId}/hqdefault.jpg`;
    liveThumb.style.display = "block";
  } else if (liveThumb) {
    liveThumb.style.display = "none";
  }
  // area video terkunci: tidak bisa ditekan, hanya tombol YouTube/IG yang jadi pemicu
  if (liveVideo) {
    if (liveCfg.youtube) liveVideo.href = liveCfg.youtube;
    else {
      liveVideo.removeAttribute("href");
      liveVideo.style.cursor = "default";
      liveVideo.addEventListener("click", function (e) { e.preventDefault(); });
    }
  }
  [[liveBtnYt, liveCfg.youtube], [liveBtnIg, liveCfg.instagram]].forEach(function (pair) {
    var btn = pair[0], url = pair[1];
    if (!btn) return;
    if (url) {
      btn.href = url;
    } else {
      btn.removeAttribute("href");
      btn.classList.add("is-disabled");
      btn.setAttribute("aria-disabled", "true");
    }
  });

  // --- WAKTU LIVE (sumber tunggal) ---
  // Tanggal & jam live diambil dari config:
  //   weddingDate                  -> tanggal acara
  //   reception.events[0].time     -> jam live (contoh "15.30" = 15.30 WIB)
  // Tanggal live, jam live, link kalender, dan countdown semuanya pakai
  // nilai yang sama -> ganti tanggal/jam di config, semuanya ikut berubah.
  const firstEvent = (C.reception && Array.isArray(C.reception.events) && C.reception.events[0]) || null;
  const liveTimeText = firstEvent && firstEvent.time ? firstEvent.time : "15.30";
  const liveTime = liveTimeText.replace(".", ":");
  const liveStart = new Date((C.weddingDate || "") + "T" + liveTime + ":00" + EVENT_TZ);
  const liveStartValid = !isNaN(liveStart.getTime());
  if (liveStartValid) {
    if (liveDateEl) {
      const tgl = new Intl.DateTimeFormat("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric", timeZone: EVENT_TZ_NAME }).format(liveStart);
      liveDateEl.textContent = tgl.charAt(0).toUpperCase() + tgl.slice(1);
    }
    if (liveTimeEl) liveTimeEl.textContent = liveTimeText.replace(":", ".") + " WIB";
    if (liveCal) {
      const mulai = liveStart;
      const selesai = new Date(mulai.getTime() + 3 * 3600 * 1000);
      const fmt = (dt) => dt.toISOString().replace(/[-:]/g, "").replace(/\.\d+/, "");
      const params = [
        "action=TEMPLATE",
        "text=" + encodeURIComponent(`Pernikahan ${C.bride.name} & ${C.groom.name}`),
        "dates=" + fmt(mulai) + "/" + fmt(selesai),
        "details=" + encodeURIComponent(liveCfg.desc || ""),
        "location=" + encodeURIComponent(C.venue ? `${C.venue.name}, ${C.venue.address}` : ""),
      ];
      liveCal.href = "https://calendar.google.com/calendar/render?" + params.join("&");
    }
  }
  if (liveCal && liveCfg.calendar === false) liveCal.style.display = "none";

  // footer: tahun ikut tanggal acara (biar otomatis kalau tanggal diganti)
  if (liveStartValid) {
    const tahun = new Intl.DateTimeFormat("id-ID", { year: "numeric", timeZone: EVENT_TZ_NAME }).format(liveStart);
    const catatan = UI.footerNote || "Made with love";
    setText("footerCopy", `© ${tahun} The Wedding of ${C.bride.name} & ${C.groom.name} · ${catatan}`);
  }

  // --- Kado & Ucapan (transfer bank / dompet digital) ---
  const giftCfg = C.gift || {};
  if (giftCfg.title) setText("giftTitle", giftCfg.title);
  if (giftCfg.subtitle) setText("giftSub", giftCfg.subtitle);

  const COPY_ICON =
    '<svg class="icon-copy" viewBox="0 0 24 24" aria-hidden="true"><path d="M16 1H4a2 2 0 0 0-2 2v14h2V3h12V1z"/><path d="M19 5H8a2 2 0 0 0-2 2v14h2V7h11a2 2 0 0 0 2-2V7"/></svg>';
  const CHECK_ICON =
    '<svg class="icon-check" viewBox="0 0 24 24" aria-hidden="true"><path d="M9 16.2 4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"/></svg>';

  const giftGrid = $("giftGrid");
  if (giftGrid) {
    const accounts = Array.isArray(giftCfg.accounts) ? giftCfg.accounts : [];
    giftGrid.innerHTML = "";
    accounts.forEach((acc) => {
      const number = String(acc.number || "").trim();
      const shown = acc.display || number;
      const card = document.createElement("article");
      card.className = "gift-card";

      const kind = document.createElement("p");
      kind.className = "gift-card__kind";
      kind.textContent = acc.kind || "";

      const title = document.createElement("h3");
      title.className = "gift-card__title";
      title.textContent = acc.title || "";

      const visual = document.createElement("div");
      visual.className = "gift-card__visual";
      if (acc.image) {
        const img = document.createElement("img");
        img.src = acc.image;
        img.alt = acc.title ? `${acc.title}` : "Kartu pembayaran";
        img.loading = "lazy";
        img.decoding = "async";
        visual.appendChild(img);
      }

      const body = document.createElement("div");
      body.className = "gift-card__body";

      const label = document.createElement("p");
      label.className = "gift-card__label";
      label.textContent = acc.label || "Nomor";

      const row = document.createElement("div");
      row.className = "gift-account-row";

      const code = document.createElement("code");
      code.className = "gift-account";
      code.textContent = shown;
      if (number) code.setAttribute("data-copy", number);

      const btn = document.createElement("button");
      btn.className = "gift-copy-btn";
      btn.type = "button";
      btn.setAttribute("aria-label", acc.copyLabel || "Copy number");
      btn.setAttribute("title", acc.copyLabel || "Copy");
      btn.innerHTML = COPY_ICON + CHECK_ICON + '<span class="gift-copy-text">Salin</span>';
      if (number) btn.setAttribute("data-copy", number);

      row.appendChild(code);
      row.appendChild(btn);

      const holder = document.createElement("p");
      holder.className = "gift-card__holder";
      holder.textContent = acc.holder || "";

      body.appendChild(label);
      body.appendChild(row);
      body.appendChild(holder);

      card.appendChild(kind);
      card.appendChild(title);
      card.appendChild(visual);
      card.appendChild(body);
      giftGrid.appendChild(card);
    });
  }

  // --- Salin nomor rekening / DANA ---
  function copyText(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(text).catch(() => copyTextFallback(text));
    }
    return copyTextFallback(text);
  }
  function copyTextFallback(text) {
    return new Promise((resolve, reject) => {
      const input = document.createElement("textarea");
      input.value = text;
      input.setAttribute("readonly", "");
      input.style.position = "fixed";
      input.style.opacity = "0";
      document.body.appendChild(input);
      input.select();
      try {
        document.execCommand("copy") ? resolve() : reject(new Error("Copy failed"));
      } catch (err) {
        reject(err);
      } finally {
        input.remove();
      }
    });
  }
  const giftToast = $("giftToast");
  let giftToastTimer;
  function showGiftToast(message) {
    if (!giftToast) return;
    window.clearTimeout(giftToastTimer);
    giftToast.textContent = message;
    giftToast.classList.add("is-visible");
    giftToastTimer = window.setTimeout(() => {
      giftToast.classList.remove("is-visible");
    }, 3200);
  }
  document.querySelectorAll(".gift-copy-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const text = btn.getAttribute("data-copy");
      if (!text) return;
      copyText(text)
        .then(() => {
          btn.classList.add("copied");
          showGiftToast(`Nomor tersalin: ${text}`);
          window.setTimeout(() => btn.classList.remove("copied"), 2000);
        })
        .catch(() => showGiftToast("Gagal menyalin. Silakan coba lagi."));
    });
  });
  // klik langsung pada angka juga menyalin
  document.querySelectorAll(".gift-account[data-copy]").forEach((el) => {
    el.addEventListener("click", () => {
      const text = el.getAttribute("data-copy");
      if (!text) return;
      copyText(text)
        .then(() => showGiftToast(`Nomor tersalin: ${text}`))
        .catch(() => showGiftToast("Gagal menyalin. Silakan coba lagi."));
    });
  });

  // --- Guest section (RSVP & Wishes) ---
  const G = C.guest || {};
  if (G.subtitle) setText("guestSub", G.subtitle);
  if (G.intro) setText("guestIntro", G.intro);
  if (G.note) setText("guestNote", G.note);
  const sealBox = $("sealBox");
  if (sealBox && C.bride && C.groom) {
    const initials = `${C.bride.name.charAt(0)}&${C.groom.name.charAt(0)}`;
    sealBox.querySelectorAll("text").forEach((t) => { t.textContent = initials; });
  }
  const guestChoice = $("guestChoice");
  const guestName = $("guestName");
  const guestMsg = $("guestMsg");
  const guestSend = $("guestSend");
  let guestStatus = "Hadir";
  function updateGuestLink() {
    if (!guestSend) return;
    const name = (guestName && guestName.value.trim()) || "…";
    const msg = (guestMsg && guestMsg.value.trim()) || "";
    const text = encodeURIComponent(
      `Halo, saya ${name}. Saya ${guestStatus} pada acara pernikahan ${C.bride.name} & ${C.groom.name}.` +
      (msg ? ` Ucapan saya: ${msg}` : "")
    );
    guestSend.href = `https://wa.me/${G.whatsapp || ""}?text=${text}`;
  }
  if (guestChoice) {
    guestChoice.addEventListener("click", (e) => {
      const btn = e.target.closest(".guest-opt");
      if (!btn) return;
      guestChoice.querySelectorAll(".guest-opt").forEach((b) => b.classList.remove("is-active"));
      btn.classList.add("is-active");
      guestStatus = btn.getAttribute("data-value") || "Hadir";
      updateGuestLink();
    });
  }
  const guestCounter = $("guestCounter");
  const GUEST_MAX = 5000;
  function updateGuestCounter() {
    if (!guestCounter || !guestMsg) return;
    if (guestMsg.value.length > GUEST_MAX) {
      guestMsg.value = guestMsg.value.slice(0, GUEST_MAX);
    }
    const len = guestMsg.value.length;
    guestCounter.textContent = `${len} / ${GUEST_MAX}`;
    guestCounter.classList.toggle("is-warn", len >= GUEST_MAX * 0.9);
  }

  if (guestName) guestName.addEventListener("input", updateGuestLink);
  if (guestMsg) {
    guestMsg.addEventListener("input", updateGuestLink);
    guestMsg.addEventListener("input", updateGuestCounter);
    updateGuestCounter();
  }
  if (guestSend) {
    updateGuestLink();
    guestSend.addEventListener("click", (e) => {
      // pastiin pesan = input terbaru (nama + status + ucapan) saat tombol ditekan
      updateGuestLink();
      const name = guestName ? guestName.value.trim() : "";
      if (!name) {
        e.preventDefault();
        showGiftToast("Mohon isi nama Anda terlebih dahulu.");
        if (guestName) guestName.focus();
        return;
      }
      if (!G.whatsapp) {
        e.preventDefault();
        showGiftToast("Nomor WhatsApp belum diatur.");
        return;
      }
      guestSend.classList.add("is-sent");
      window.setTimeout(() => guestSend.classList.remove("is-sent"), 3000);
    });
  }

  // --- Audio / YouTube ---
  const audio = $("bgAudio");
  let ytPlayer = null;
  let ytReady = false;
  let isPlaying = false;
  const useYT = !!(C.music && C.music.youtubeId);
  if (!useYT && audio && C.music && C.music.track) {
    audio.src = C.music.track;
    audio.volume = (typeof C.music.volume === "number") ? C.music.volume : 0.5;
    audio.loop = true;
  }
  if (useYT) {
    window.onYouTubeIframeAPIReady = function () {
      ytPlayer = new YT.Player("ytPlayer", {
        videoId: C.music.youtubeId,
        playerVars: { autoplay: 0, controls: 0, loop: 1, playlist: C.music.youtubeId, modestbranding: 1 },
        events: {
          onReady: function (e) {
            ytReady = true;
            e.target.setVolume(Math.round(((typeof C.music.volume === "number") ? C.music.volume : 0.5) * 100));
          },
          onStateChange: function (e) {
            isPlaying = (e.data === YT.PlayerState.PLAYING);
            syncMusicIcon();
          },
        },
      });
    };
  }

  // --- Live streaming: hanya aktif saat acara sudah dimulai ---
  function setLiveOnAir() {
    var sec = document.querySelector(".live");
    if (!sec || sec.classList.contains("is-onair")) return;
    var cfg = (typeof WEDDING_CONFIG !== "undefined" && WEDDING_CONFIG.live) ? WEDDING_CONFIG.live : {};
    sec.classList.add("is-onair");
    setText("liveBadge", "Sedang Berlangsung");
    setText("liveHint", cfg.onairHint || "Tonton lewat YouTube Live atau Instagram Live.");
    [[$("liveBtnYoutube"), cfg.youtube], [$("liveBtnInstagram"), cfg.instagram]].forEach(function (pair) {
      var btn = pair[0], url = pair[1];
      if (!btn) return;
      btn.classList.remove("is-disabled");
      btn.removeAttribute("aria-disabled");
      if (url) btn.href = url;
    });
  }

  // --- Countdown ---
  // Menghitung mundur ke jam live (dari config: weddingDate + jam live).
  // Kalau config.countdownTarget diisi, itu yang dipakai (opsional).
  // Target dikunci ke WIB (lihat parseEventDate) -> devices yg zona
  // waktunya berbeda tetap menghitung mundur ke momen yang sama
  const targetDate = C.countdownTarget ? parseEventDate(C.countdownTarget) : (liveStartValid ? liveStart : null);
  const target = targetDate ? targetDate.getTime() : Date.now();
  const cdDays = $("cdDays"), cdHours = $("cdHours"), cdMins = $("cdMins"), cdSecs = $("cdSecs");
  function pad(n) { return String(n).padStart(2, "0"); }
  function updateCountdown() {
    const diff = target - Date.now();
    if (diff <= 0) {
      if (cdDays) cdDays.textContent = "00";
      if (cdHours) cdHours.textContent = "00";
      if (cdMins) cdDays.textContent = "00";
      if (cdSecs) cdSecs.textContent = "00";
      setLiveOnAir();
      return;
    }
    const d = Math.floor(diff / (24 * 60 * 60 * 1000));
    const h = Math.floor((diff % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
    const m = Math.floor((diff % (60 * 60 * 1000)) / (60 * 1000));
    const s = Math.floor((diff % (60 * 1000)) / 1000);
    if (cdDays) cdDays.textContent = pad(d);
    if (cdHours) cdHours.textContent = pad(h);
    if (cdMins) cdMins.textContent = pad(m);
    if (cdSecs) cdSecs.textContent = pad(s);
  }
  updateCountdown();
  setInterval(updateCountdown, 1000);

  // --- Loader ---
  const loader = $("loader");
  let loaderHidden = false;
  const loaderStart = Date.now();
  const LOADER_MIN = 1200; // ms - minimum tampil supaya animasinya kelihatan
  function hideLoader() {
    if (loaderHidden || !loader) return;
    const wait = Math.max(0, LOADER_MIN - (Date.now() - loaderStart));
    setTimeout(() => {
      if (loaderHidden) return;
      loaderHidden = true;
      loader.classList.add("is-hidden");
      setTimeout(() => {
        if (loader) loader.style.display = "none";
      }, 700);
    }, wait);
  }
  if (document.readyState === "complete") {
    hideLoader();
  } else {
    window.addEventListener("load", hideLoader, { once: true });
  }
  setTimeout(hideLoader, LOADER_MIN + 3500);

  // --- Kunci scroll selama loader/cover tampil ---
  // Kalau halaman bisa di-scroll, URL bar browser di HP menyusut ->
  // tinggi viewport berubah -> loader & cover (100svh/100dvh) tidak
  // menutup FULL layar, muncul strip di bawah. Jadi scroll dikunci
  // sampai undangan dibuka.
  const lockScroll = (e) => {
    if (document.body.classList.contains("is-open")) return;
    const cov = $("cover");
    // cover sendiri tetap boleh di-scroll kalau isinya lebih tinggi
    if (cov && e.target && cov.contains(e.target) && cov.scrollHeight > cov.clientHeight) return;
    e.preventDefault();
  };
  window.addEventListener("wheel", lockScroll, { passive: false });
  window.addEventListener("touchmove", lockScroll, { passive: false });
  window.addEventListener("keydown", (e) => {
    if (document.body.classList.contains("is-open")) return;
    if (["PageDown", "PageUp", "ArrowDown", "ArrowUp", "Home", "End"].includes(e.key)) e.preventDefault();
  });

  // --- Open invitation ---
  function openInvitation() {
    if (document.body.classList.contains("is-open") || document.body.classList.contains("is-opening")) return;
    document.body.classList.add("is-opening");
    // pastikan halaman di posisi paling atas (konten di belakang cover
    // tidak boleh ikut tergeser) - "instant" supaya tidak dianimasikan
    try { window.scrollTo({ top: 0, left: 0, behavior: "instant" }); } catch (e) { window.scrollTo(0, 0); }
    if (cover) cover.classList.add("is-closed");
    if (musicToggle) musicToggle.classList.remove("hidden");
    if (useYT) {
      const tryPlay = () => {
        if (ytReady && ytPlayer) { ytPlayer.playVideo(); isPlaying = true; syncMusicIcon(); }
        else setTimeout(tryPlay, 300);
      };
      if (C.music && C.music.autoplay) tryPlay();
    } else if (audio) {
      audio.play().then(() => { isPlaying = true; syncMusicIcon(); }).catch(() => { syncMusicIcon(); });
    }
    // CROSSFADE: cover pudar gelap -> terang bersamaan dengan konten
    // utama yang memunculan, tanpa gerak/geser sama sekali.
    document.body.classList.add("is-open");
    setTimeout(() => {
      if (cover) cover.hidden = true;
      document.body.classList.remove("is-opening");
      // scrolling halaman aktif setelah cover hilang. Scrollbar browser
      // dimatikan penuh (lebar 0) => tidak ada ruang/scrollbar di tepi
      // kanan dan cover tetap menutup full.
      document.documentElement.classList.add("is-open");
      // pastikan halaman benar-benar di posisi teratas (hero tampil utuh)
      try { window.scrollTo({ top: 0, left: 0, behavior: "instant" }); } catch (e) { window.scrollTo(0, 0); }
    }, 950);
  }
  const btnOpen = $("btnOpen");
  if (btnOpen) btnOpen.addEventListener("click", openInvitation);

  // --- Reveal button (scroll) ---
  const btnReveal = $("btnReveal");
  if (btnReveal) {
    btnReveal.addEventListener("click", () => {
      const cd = $("countdown");
      if (cd) cd.scrollIntoView({ behavior: "smooth" });
    });
  }

  // --- Music toggle ---
  const musicToggle = $("musicToggle");
  const mtIcon = $("mtIcon");
  function syncMusicIcon() {
    if (useYT) {
      if (mtIcon) mtIcon.textContent = isPlaying ? "⏸" : "▶";
      return;
    }
    if (!audio) return;
    isPlaying = !audio.paused;
    if (mtIcon) mtIcon.textContent = isPlaying ? "⏸" : "▶";
  }
  function playMusic() {
    if (useYT) {
      if (ytReady && ytPlayer) ytPlayer.playVideo();
    } else if (audio) {
      audio.play().then(syncMusicIcon).catch(() => {});
    }
  }
  function pauseMusic() {
    if (useYT) {
      if (ytReady && ytPlayer) ytPlayer.pauseVideo();
    } else if (audio) {
      audio.pause();
    }
  }
  if (musicToggle) {
    musicToggle.classList.add("hidden");
    musicToggle.addEventListener("click", () => {
      if (isPlaying) { pauseMusic(); isPlaying = false; syncMusicIcon(); }
      else { playMusic(); isPlaying = true; syncMusicIcon(); }
    });
  }
  if (!useYT && audio) {
    audio.addEventListener("play", () => { isPlaying = true; syncMusicIcon(); });
    audio.addEventListener("pause", () => { isPlaying = false; syncMusicIcon(); });
  }

  // --- Lightbox ---
  const lightbox = $("lightbox");
  const lightboxImg = $("lightboxImg");
  function openLightbox(src, framed) {
    if (!lightbox || !lightboxImg) return;
    lightboxImg.src = src;
    lightbox.classList.toggle("is-framed", !!framed);
    lightbox.classList.add("is-open");
    lightbox.setAttribute("aria-hidden", "false");
  }
  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove("is-open");
    lightbox.setAttribute("aria-hidden", "true");
    if (lightboxImg) lightboxImg.src = "";
  }
  if (lightbox) {
    lightbox.addEventListener("click", closeLightbox);
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeLightbox(); });
  }

  // --- Scroll reveal ---
  // cover TIDAK ikut reveal: dia overlay fixed, bukan bagian halaman yang
  // di-scroll. Kalau ikut, aturan .reveal.is-visible menimpa
  // .cover.is-closed -> cover tidak bisa pudar saat dibuka.
  const revealEls = document.querySelectorAll("section:not(.hero):not(.schedule):not(.cover)");
  const revealItems = document.querySelectorAll(".reveal-left, .reveal-right, .reveal-zoom");
  // timeline: judul + tiap kartu difade-in sendiri saat masuk layar,
  // jadi animasinya baru tampil ketika scroll sudah sampai ke sana.
  const scheduleBits = document.querySelectorAll(
    ".schedule .section-label, .schedule .section-sub, .schedule .reception-quote"
  );
  const scheduleCards = document.querySelectorAll(".tl-item");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("is-visible");
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.1, rootMargin: "0px 0px -30px 0px" });
    revealEls.forEach((el) => { el.classList.add("reveal"); io.observe(el); });
    revealItems.forEach((el) => io.observe(el));

    // kartu timeline: pemicu saat kartu benar-benar masuk layar
    const ioCard = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("is-visible");
          ioCard.unobserve(e.target);
        }
      });
    }, { threshold: 0.2, rootMargin: "0px 0px -10% 0px" });
    scheduleBits.forEach((el) => ioCard.observe(el));
    scheduleCards.forEach((el) => ioCard.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("is-visible"));
    revealItems.forEach((el) => el.classList.add("is-visible"));
    scheduleBits.forEach((el) => el.classList.add("is-visible"));
    scheduleCards.forEach((el) => el.classList.add("is-visible"));
  }
})();
