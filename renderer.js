(() => {
  const config = window.THAI_NAVI_CONFIG;
  const state = { stores: [], filtered: [] };

  const beginnerGuides = [
    "初めてのタイ夜遊び", "料金相場", "ぼったくり回避", "エリア別の雰囲気", "深夜移動の注意点", "日本語対応の探し方"
  ];

  const areaGuideData = [
    ["Nana / Asok","観光客が多く比較しやすい","高","中〜高","多め","高い","混雑時の移動に注意"],
    ["Sukhumvit","店舗の幅が広く選択肢が多い","中","中","中","高い","価格表示の確認推奨"],
    ["Silom","ローカル寄りと観光向けが混在","中","中","中","中","終電後の移動手段を確保"],
    ["Pattaya","密度が高く比較しやすい","中","中","中","高い","深夜の客引き対応に注意"],
    ["Phuket","観光シーズンで変動が大きい","中","中〜高","中","中","繁忙期は料金確認を丁寧に"],
    ["Chiang Mai","落ち着いたエリアが多い","高","中","少なめ","中","深夜営業の情報更新頻度に注意"]
  ];

  function parseCsv(text) {
    const rows = text.trim().split(/\r?\n/);
    const headers = rows.shift().split(",").map((h) => h.trim());
    return rows.map((line) => {
      const cols = line.match(/("([^"]|"")*"|[^,]+)/g) || [];
      const obj = {};
      headers.forEach((h, i) => {
        const raw = (cols[i] || "").trim().replace(/^"|"$/g, "").replace(/""/g, '"');
        obj[h] = raw;
      });
      return obj;
    });
  }

  async function loadStores() {
    try {
      const res = await fetch(config.CSV_URL);
      if (!res.ok) throw new Error("CSV fetch failed");
      const text = await res.text();
      state.stores = parseCsv(text);
    } catch {
      state.stores = config.FALLBACK_STORES;
    }
    state.stores = state.stores.filter((s) => (s.status || "").toLowerCase() === "active");
    populateFilters();
    renderStatic();
    applyFilters();
  }

  function isTrue(v) { return String(v).toLowerCase() === "true"; }
  function normalize(v) { return (v || "").toLowerCase(); }

  function populateFilters() {
    const fill = (id, values) => {
      const el = document.getElementById(id);
      [...new Set(values.filter(Boolean))].sort().forEach((v) => el.insertAdjacentHTML("beforeend", `<option value="${v}">${v}</option>`));
    };
    fill("areaFilter", state.stores.map((s) => s.area));
    fill("genreFilter", state.stores.map((s) => s.genre));
    fill("tagFilter", state.stores.flatMap((s) => (s.tags || "").split(",").map((t) => t.trim())));
  }

  function applyFilters() {
    const keyword = normalize(document.getElementById("keywordInput").value);
    const area = document.getElementById("areaFilter").value;
    const genre = document.getElementById("genreFilter").value;
    const tag = document.getElementById("tagFilter").value;
    state.filtered = state.stores.filter((s) => {
      const text = normalize([s.name_ja,s.name_en,s.area,s.genre,s.sns_memo,s.editor_memo,s.caution].join(" "));
      if (keyword && !text.includes(keyword)) return false;
      if (area && s.area !== area) return false;
      if (genre && s.genre !== genre) return false;
      if (tag && !(s.tags || "").split(",").map((t) => t.trim()).includes(tag)) return false;
      if (document.getElementById("beginnerOnly").checked && !isTrue(s.beginner_friendly)) return false;
      if (document.getElementById("jpOnly").checked && !isTrue(s.japanese_support)) return false;
      if (document.getElementById("lateOnly").checked && !isTrue(s.late_night)) return false;
      if (document.getElementById("snsOnly").checked && !isTrue(s.sns_checked)) return false;
      if (document.getElementById("cautionOnly").checked && !s.caution) return false;
      return true;
    }).sort((a,b) => Number(isTrue(b.is_pr)) - Number(isTrue(a.is_pr)));

    renderStores(); renderSnsLogs(); renderRanking();
    document.getElementById("storeCount").textContent = `${state.filtered.length}件を表示中`;
  }

  function renderStatic() {
    document.getElementById("beginnerCards").innerHTML = beginnerGuides.map((v) => `<article class="guide-card">${v}</article>`).join("");
    document.getElementById("areaCards").innerHTML = areaGuideData.map(([name,a,b,c,d,e,f]) => `<article class="area-card"><h3>${name}</h3><p>雰囲気: ${a}</p><p>初心者向け度: ${b}</p><p>料金感: ${c}</p><p>日本語対応の多さ: ${d}</p><p>深夜移動しやすさ: ${e}</p><p>SNS露出: ${e}</p><p>注意点: ${f}</p><a class="btn" href="#store-list">詳細を見る</a></article>`).join("");
  }

  function renderStores() {
    const html = state.filtered.map((s, i) => {
      const tags = (s.tags || "").split(",").map((t) => t.trim()).filter(Boolean).slice(0,3);
      const pr = isTrue(s.is_pr) ? '<span class="pr-label">PR</span>' : "";
      const prCard = i === 2 ? '<article class="card ad-box">PR / 広告 / Sponsored<br>店舗一覧中のPRカード</article>' : "";
      return `<article class="card">${pr}<h3>${s.name_ja}</h3><p class="store-meta">${s.name_en}</p><p>${s.area} / ${s.genre}</p><p>料金目安: ${s.price_range}</p><p>営業時間: ${s.hours}</p><p>アクセス: ${s.access}</p><div>${tags.map((t)=>`<span class="tag">${t}</span>`).join("")}</div><p>SNS観測: ${s.sns_memo || "-"}</p><p>注意点: ${s.caution || "-"}</p><p>管理人メモ: ${s.editor_memo || "-"}</p><div class="hero-cta"><a class="btn" href="${s.official_url || '#'}">詳細を見る</a><a class="btn" href="${s.google_map_url || '#'}">地図を見る</a><a class="btn" href="#">料金を見る</a></div></article>${prCard}`;
    }).join("");
    document.getElementById("storeCards").innerHTML = html || '<p>条件に一致する店舗がありません。</p>';
  }

  function renderSnsLogs() {
    const html = state.filtered.slice(0,8).map((s) => `<article class="card"><h3>${s.name_ja || s.area}</h3><p>SNS種別: TikTok / Instagram / Facebook / X / RED</p><p>観測内容: ${s.sns_memo || "SNSでの言及を確認"}</p><p>投稿傾向: Instagramで投稿増加 / Facebookでイベント告知あり</p><p>注意点: ${s.caution || "情報更新日を確認"}</p><p>管理人メモ: ${s.editor_memo || "落ち着いて比較推奨"}</p><a class="btn" href="#store-list">詳細を見る</a></article>`).join("");
    document.getElementById("snsLogCards").innerHTML = html;
  }

  function renderRanking() {
    const cats = ["初心者向け","コスパ重視","日本語対応","深夜営業","一人でも入りやすい","SNSでよく見かける"];
    document.getElementById("rankingGrid").innerHTML = cats.map((c) => `<article class="rank-card"><h3>${c}</h3><ol>${state.filtered.slice(0,3).map((s) => `<li>${s.name_ja}</li>`).join("")}</ol></article>`).join("");
  }

  document.querySelectorAll("#filters input, #filters select").forEach((el) => el.addEventListener("input", applyFilters));
  document.querySelectorAll(".bottom-nav button").forEach((b) => b.addEventListener("click", () => document.getElementById(b.dataset.target)?.scrollIntoView({ behavior: "smooth" })));
  document.querySelectorAll('a[href="#listing"]').forEach((a) => a.addEventListener("click", (e) => { e.preventDefault(); document.getElementById("listing").scrollIntoView({ behavior: "smooth" }); }));

  loadStores();
})();
