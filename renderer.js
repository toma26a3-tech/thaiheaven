(() => {
  const config = window.THAI_NAVI_CONFIG;
  const state = { stores: [], filtered: [] };

  const areaHierarchyData = {
    Bangkok: ["Nana", "Asok", "Sukhumvit", "Silom"],
    Pattaya: ["Central Pattaya", "Walking Street"],
    Phuket: ["Patong", "Kata"],
    "Chiang Mai": ["Nimman", "Old City"]
  };

  const parseCsv = (text) => {
    const rows = text.trim().split(/\r?\n/);
    const headers = rows.shift().split(",");
    return rows.map((line) => {
      const cols = line.match(/("([^"]|"")*"|[^,]+)/g) || [];
      const obj = {};
      headers.forEach((h, i) => (obj[h.trim()] = (cols[i] || "").replace(/^"|"$/g, "").replace(/""/g, '"').trim()));
      return obj;
    });
  };

  const isTrue = (v) => String(v).toLowerCase() === "true";
  const btsOf = (s) => (s.bts_station || (s.access || "").match(/BTS\s*([^駅\s]+)/)?.[1] || "-");

  async function load() {
    try {
      const r = await fetch(config.CSV_URL);
      if (!r.ok) throw new Error();
      state.stores = parseCsv(await r.text());
    } catch {
      state.stores = config.FALLBACK_STORES;
    }
    state.stores = state.stores.filter((s) => (s.status || "").toLowerCase() === "active");
    fillFilters();
    renderAreaHierarchy();
    bind();
    apply();
  }

  function fillFilters() {
    fill("areaFilter", state.stores.map((s) => s.area));
    fill("genreFilter", state.stores.map((s) => s.genre));
    fill("priceFilter", state.stores.map((s) => s.price_range));
    fill("btsFilter", state.stores.map((s) => btsOf(s)));
    fill("tagFilter", state.stores.flatMap((s) => (s.tags || "").split(",").map((x) => x.trim())));
  }
  function fill(id, arr) {
    const el = document.getElementById(id);
    [...new Set(arr.filter(Boolean))].sort().forEach((v) => el.insertAdjacentHTML("beforeend", `<option value="${v}">${v}</option>`));
  }

  function apply() {
    const kw = (document.getElementById("keywordInput").value || "").toLowerCase();
    const area = document.getElementById("areaFilter").value;
    const bts = document.getElementById("btsFilter").value;
    const genre = document.getElementById("genreFilter").value;
    const price = document.getElementById("priceFilter").value;
    const tag = document.getElementById("tagFilter").value;

    state.filtered = state.stores.filter((s) => {
      const hay = [s.name_ja, s.area, s.genre, s.caution, s.editor_memo, s.sns_memo, btsOf(s)].join(" ").toLowerCase();
      if (kw && !hay.includes(kw)) return false;
      if (area && s.area !== area) return false;
      if (bts && btsOf(s) !== bts) return false;
      if (genre && s.genre !== genre) return false;
      if (price && s.price_range !== price) return false;
      if (tag && !(s.tags || "").split(",").map((x) => x.trim()).includes(tag)) return false;
      if (document.getElementById("beginnerOnly").checked && !isTrue(s.beginner_friendly)) return false;
      if (document.getElementById("jpOnly").checked && !isTrue(s.japanese_support)) return false;
      if (document.getElementById("snsOnly").checked && !isTrue(s.sns_checked)) return false;
      return true;
    }).sort((a, b) => Number(isTrue(b.is_pr)) - Number(isTrue(a.is_pr)));

    renderRows();
    renderCompare();
    renderSnsLogs();
    const last = state.filtered.map((s) => s.updated_at).filter(Boolean).sort().pop() || "-";
    document.getElementById("lastUpdated").textContent = last;
    document.getElementById("storeCount").textContent = `${state.filtered.length}件を表示中`;
  }

  function renderRows() {
    const tbody = document.getElementById("storeRows");
    tbody.innerHTML = state.filtered.map((s) => {
      const tags = (s.tags || "").split(",").map((x) => x.trim()).filter(Boolean).slice(0, 3);
      return `<tr>
        <td><strong>${s.name_ja}</strong>${isTrue(s.is_pr) ? ' <span class="tag pr">PR</span>' : ''}</td>
        <td>${s.area}</td><td>${btsOf(s)}</td><td>${s.genre}</td><td>${s.price_range || '-'}</td>
        <td>${tags.map((t) => `<span class="tag">${t}</span>`).join("")}</td>
        <td>${isTrue(s.sns_checked) ? '確認済み' : '未確認'}</td>
        <td>${s.caution || '-'}</td>
        <td><a href="${s.google_map_url || '#'}">地図</a> / <a href="${s.official_url || '#'}">詳細</a></td>
      </tr>`;
    }).join("") || '<tr><td colspan="9">条件に一致する店舗がありません。</td></tr>';
  }

  function renderCompare() {
    document.getElementById("compareCards").innerHTML = state.filtered.slice(0, 6).map((s) => `<article class="card"><h3>${s.name_ja}</h3><p>${s.area} / BTS ${btsOf(s)}</p><p>料金: ${s.price_range || '-'}</p><p>初心者: ${isTrue(s.beginner_friendly) ? '◯' : '△'} / 日本語: ${isTrue(s.japanese_support) ? '◯' : '△'} / SNS: ${isTrue(s.sns_checked) ? '◯' : '△'}</p></article>`).join("");
  }

  function renderSnsLogs() {
    document.getElementById("snsLogCards").innerHTML = state.filtered.slice(0, 6).map((s) => `<article class="card"><h3>${s.name_ja}</h3><p>SNS種別: TikTok / Instagram / Facebook / X / RED</p><p>観測内容: ${s.sns_memo || '現地投稿を確認'}</p><p>注意点: ${s.caution || '更新日を要確認'}</p></article>`).join("");
  }

  function renderAreaHierarchy() {
    document.getElementById("areaHierarchy").innerHTML = Object.entries(areaHierarchyData).map(([k, children]) => `<div class="group"><strong>${k}</strong><ul>${children.map((c) => `<li>${c}</li>`).join("")}</ul></div>`).join("");
  }

  function bind() {
    document.querySelectorAll("#search input,#search select").forEach((el) => el.addEventListener("input", apply));
    document.querySelectorAll(".bottom-nav button").forEach((b) => b.addEventListener("click", () => document.getElementById(b.dataset.target)?.scrollIntoView({ behavior: "smooth" })));
  }

  load();
})();
