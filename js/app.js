/* ============================================================
   蜀岸 · 2027四川专升本备考 —— 前端应用（页面渲染、测验流程、记录）
   ============================================================ */
window.EXAM.app = (function () {

  var CORE = window.EXAM.core;
  var PLAN = window.EXAM_PLAN;
  var STORE_KEY = 'shu_an_exam_v1';
  var DRAFT_KEY = 'shu_an_exam_draft_v1';

  /* ---------- 状态 ---------- */
  function defaultSettings(){
    return { examDate: '2027-04-17', startDate: '', intensity: 1, name: '同学' };
  }
  function emptyState(){ return { settings: defaultSettings(), days: {}, mocks: [], used: {}, wrong: {} }; }
  function loadState(){
    try {
      var s = JSON.parse(localStorage.getItem(STORE_KEY));
      if (!s) return emptyState();
      s.settings = Object.assign(defaultSettings(), s.settings || {});
      s.days = s.days || {}; s.mocks = s.mocks || []; s.used = s.used || {}; s.wrong = s.wrong || {};
      return s;
    } catch (e){ return emptyState(); }
  }
  function saveState(){ localStorage.setItem(STORE_KEY, JSON.stringify(state)); }
  function loadDraft(){
    try { return JSON.parse(localStorage.getItem(DRAFT_KEY)) || null; } catch (e){ return null; }
  }
  function saveDraft(){ localStorage.setItem(DRAFT_KEY, JSON.stringify(draft)); }

  var state = loadState();
  var draft = loadDraft();
  var registry = CORE.buildRegistry();
  var currentPage = 'today';
  var sectionEntries = {};   /* 当前测验区每个 subject 的条目数组 */
  var sectionResults = {};   /* subject -> {itemId: {grade, item, type}} */
  var bankFilter = { subject: 'all', q: '' };
  var mockSetIdx = 0;        /* 当前选中的全真模拟套卷序号 */
  var wrongPaper = null;     /* 错题重组生成的试卷条目（进入错题集页时展示） */
  var wrongPicked = {};      /* 错题集勾选状态 */

  /* ---------- 错题集 ---------- */
  function ensureWrong(){ if (!state.wrong) state.wrong = {}; return state.wrong; }
  function isWrong(id){ return !!ensureWrong()[id]; }
  /* 返回 true 表示新加入；false 表示已存在（不重复添加） */
  function addWrong(id, subject, type, source){
    var w = ensureWrong();
    var rec = registry[id];
    if (rec){ subject = subject || rec.subject; type = type || rec.type; }
    if (w[id]){
      w[id].count = (w[id].count || 1) + 1;
      w[id].ts = Date.now();
      saveState();
      return false;
    }
    w[id] = { subject: subject, type: type, ts: Date.now(), count: 1, source: source || 'auto' };
    saveState();
    return true;
  }
  function removeWrong(id){
    var w = ensureWrong();
    if (!w[id]) return false;
    delete w[id];
    saveState();
    return true;
  }
  function wrongList(){
    var w = ensureWrong();
    var out = [];
    Object.keys(w).forEach(function (id){
      var rec = registry[id];
      if (!rec) return;   /* 题目已不存在则跳过 */
      out.push({ id: id, subject: rec.subject, type: rec.type, item: rec.item, meta: w[id] });
    });
    out.sort(function (a, b){ return (b.meta.ts || 0) - (a.meta.ts || 0); });
    return out;
  }

  /* ---------- 工具 ---------- */
  function $(sel, root){ return (root || document).querySelector(sel); }
  function $all(sel, root){ return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }
  function esc(s){ return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
  function fmtPct(a, b){ return b ? Math.round(a / b * 100) : 0; }
  function pad2(n){ return n < 10 ? '0' + n : '' + n; }
  function isoOf(d){ return d.getFullYear() + '-' + pad2(d.getMonth() + 1) + '-' + pad2(d.getDate()); }
  function todayISO(){ return PLAN.todayISO(); }

  function toast(msg){
    $all('.toast').forEach(function (x){ x.remove(); });
    var t = document.createElement('div');
    t.className = 'toast'; t.textContent = msg;
    document.body.appendChild(t);
    requestAnimationFrame(function(){ t.classList.add('show'); });
    setTimeout(function(){ t.classList.remove('show'); setTimeout(function(){ t.remove(); }, 350); }, 2600);
  }

  function celebrate(){
    var box = document.createElement('div');
    box.className = 'celebrate';
    var icons = ['🎉', '🌟', '📚', '✏️', '🎯', '💪', '🏆', '📖'];
    for (var i = 0; i < 40; i++){
      var s = document.createElement('span');
      s.textContent = icons[Math.floor(Math.random() * icons.length)];
      s.style.left = Math.random() * 100 + 'vw';
      s.style.animationDuration = (2.2 + Math.random() * 2) + 's';
      s.style.animationDelay = (Math.random() * 0.6) + 's';
      s.style.fontSize = (16 + Math.random() * 18) + 'px';
      box.appendChild(s);
    }
    document.body.appendChild(box);
    setTimeout(function(){ box.remove(); }, 5200);
  }

  function ringSVG(pct, size, color){
    var r = (size - 12) / 2, c = 2 * Math.PI * r, off = c * (1 - Math.max(0, Math.min(100, pct)) / 100), h = size / 2;
    return '<svg width="' + size + '" height="' + size + '" viewBox="0 0 ' + size + ' ' + size + '">' +
      '<circle cx="' + h + '" cy="' + h + '" r="' + r + '" fill="none" stroke="#ece7db" stroke-width="10"/>' +
      '<circle cx="' + h + '" cy="' + h + '" r="' + r + '" fill="none" stroke="' + color + '" stroke-width="10" stroke-linecap="round" stroke-dasharray="' + c + '" stroke-dashoffset="' + off + '" transform="rotate(-90 ' + h + ' ' + h + ')"/>' +
      '<text x="50%" y="50%" text-anchor="middle" dominant-baseline="central" font-size="' + (size * 0.2) + '" font-weight="700" fill="#123c42">' + Math.round(pct) + '%</text></svg>';
  }

  function confirmModal(title, body, okText, onOk){
    var mask = document.createElement('div');
    mask.className = 'modal-mask';
    mask.innerHTML = '<div class="modal"><h3>' + esc(title) + '</h3><p class="muted">' + esc(body) + '</p>' +
      '<div class="m-actions"><button class="btn btn-ghost" data-act="no">取消</button><button class="btn btn-primary" data-act="yes">' + esc(okText || '确定') + '</button></div></div>';
    document.body.appendChild(mask);
    $('[data-act=no]', mask).onclick = function(){ mask.remove(); };
    $('[data-act=yes]', mask).onclick = function(){ mask.remove(); onOk(); };
  }

  /* ---------- 日期与阶段信息 ---------- */
  function planDateOf(day){
    var s = state.settings;
    return s.startDate ? PLAN.addDaysISO(s.startDate, day - 1) : PLAN.dateOf(day, s.examDate);
  }
  function dayInfo(){
    var today = todayISO();
    var examDate = state.settings.examDate;
    var startDate = state.settings.startDate || PLAN.dateOf(1, examDate);
    var day = PLAN.diffDays(startDate, today) + 1;
    return {
      today: today, day: day, examDate: examDate, startDate: startDate,
      daysToExam: PLAN.diffDays(today, examDate),
      beforeStart: day < 1, afterExam: PLAN.diffDays(today, examDate) < 0
    };
  }

  /* ---------- 聚合统计 ---------- */
  function aggregate(){
    var subjects = { english: { pts: 0, max: 0, count: 0, correct: 0 }, math: { pts: 0, max: 0, count: 0, correct: 0 }, computer: { pts: 0, max: 0, count: 0, correct: 0 } };
    var sections = {};
    var completedDays = 0, scoreSum = 0, maxSum = 0, dayCount = 0;
    Object.keys(state.days).forEach(function (d){
      var rec = state.days[d];
      if (rec.complete) completedDays++;
      if (rec.max) { scoreSum += rec.score; maxSum += rec.max; dayCount++; }
      rec.items.forEach(function (it){
        var s = subjects[it.subject];
        if (s){ s.pts += it.points; s.max += it.max; s.count++; if (it.correct === true) s.correct++; }
        var key = (it.subject || '?') + '\u0001' + (it.section || '未分类');
        var sec = sections[key] || (sections[key] = { subject: it.subject, section: it.section || '未分类', pts: 0, max: 0, count: 0, correct: 0 });
        sec.pts += it.points; sec.max += it.max; sec.count++; if (it.correct === true) sec.correct++;
      });
    });
    return { subjects: subjects, sections: sections, completedDays: completedDays, scoreSum: scoreSum, maxSum: maxSum, dayCount: dayCount };
  }

  function streak(){
    var d = new Date();
    var s = 0, skipToday = true;
    for (var i = 0; i < 400; i++){
      var rec = state.days[isoOf(d)];
      if (rec && rec.complete){ s++; d.setDate(d.getDate() - 1); skipToday = false; }
      else if (skipToday){ d.setDate(d.getDate() - 1); skipToday = false; }
      else break;
    }
    return s;
  }

  /* ---------- 路由 ---------- */
  var pageNames = { today: '今日任务', quiz: '每日测验', wrong: '错题集', plan: '备考计划', stats: '学习记录', bank: '知识点库', settings: '设置' };
  function switchPage(name){
    currentPage = name;
    $all('.tab').forEach(function (b){ b.classList.toggle('active', b.dataset.page === name); });
    var root = $('#page-root');
    root.innerHTML = '';
    if (name === 'today') renderToday(root);
    else if (name === 'quiz') renderQuiz(root);
    else if (name === 'wrong') renderWrong(root);
    else if (name === 'plan') renderPlan(root);
    else if (name === 'stats') renderStats(root);
    else if (name === 'bank') renderBank(root);
    else if (name === 'settings') renderSettings(root);
    window.scrollTo(0, 0);
  }

  document.addEventListener('DOMContentLoaded', function (){ switchPage('today'); });
  $('#tabs').addEventListener('click', function (e){
    var b = e.target.closest('.tab');
    if (b) switchPage(b.dataset.page);
  });

  /* ============================================================
     今日任务页
     ============================================================ */
  function renderToday(root){
    var info = dayInfo();
    var agg = aggregate();
    var rawDay = info.day;
    var d = Math.max(1, Math.min(PLAN.totalDays, rawDay));
    var wk = PLAN.weekOf(d);
    var ph = PLAN.phaseOf(d);

    var html = '';
    if (info.beforeStart){
      html += '<div class="hero"><h1>📖 备考尚未开始</h1><div class="sub">距离备考启动还有 ' + (1 - info.day) + ' 天（计划从 ' + esc(info.startDate) + ' 开始，共 180 天）</div>' +
        '<div class="hero-stats"><div class="hs"><div class="hs-num">' + info.daysToExam + '</div><div class="hs-lbl">距 2027 考试</div></div></div>' +
        '<div style="margin-top:16px"><button class="btn btn-gold" id="btn-start-now">🚀 立即从今天开始备考</button> <button class="btn" style="background:rgba(255,255,255,.15);color:#fff" id="btn-go-settings">调整日期</button></div></div>';
      html += '<div class="card"><h2>🗓 备考计划概览</h2><div class="sub">可先到「备考计划」页了解四阶段安排；到「设置」可自定义考试日期与开始日期</div></div>';
      root.innerHTML = html;
      $('#btn-start-now').onclick = function (){
        state.settings.startDate = todayISO();
        draft = null; localStorage.removeItem(DRAFT_KEY);
        saveState();
        toast('已从今天开始 180 天备考计划');
        switchPage('today');
      };
      $('#btn-go-settings').onclick = function (){ switchPage('settings'); };
      return;
    }
    var done = state.days[info.today] && state.days[info.today].complete;
    var mix = CORE.dailyMix(info.day, state.settings.intensity);

    html += '<div class="hero">' +
      '<h1>' + greeting() + '，' + esc(state.settings.name) + '！</h1>' +
      '<div class="sub">今天是备考第 ' + d + ' 天' + (rawDay > 180 ? '（180 天计划已结束，进入冲刺加练）' : '') + ' · ' + ph.name + '（第' + wk.w + '周：' + esc(wk.title) + '）' + (info.daysToExam >= 0 ? ' · 距考试还有 ' + info.daysToExam + ' 天' : ' · 考试已结束') + '</div>' +
      '<div class="hero-stats">' +
      '<div class="hs"><div class="hs-num">' + (done ? '✓ 已完成' : '待完成') + '</div><div class="hs-lbl">今日任务</div></div>' +
      '<div class="hs"><div class="hs-num">' + agg.completedDays + ' 天</div><div class="hs-lbl">累计完成</div></div>' +
      '<div class="hs"><div class="hs-num">' + streak() + ' 天</div><div class="hs-lbl">连续打卡</div></div>' +
      '<div class="hs"><div class="hs-num">' + fmtPct(agg.scoreSum, agg.maxSum) + '%</div><div class="hs-lbl">累计得分率</div></div>' +
      '</div></div>';

    /* 今日任务清单 */
    html += '<div class="card"><h2>📋 今日任务清单</h2><div class="sub">' + esc(info.today) + ' · ' + esc(ph.goal) + '</div><div class="tasklist">' +
      taskRow('英语', mix.english, 'english') +
      taskRow('数学', mix.math, 'math') +
      taskRow('计算机', mix.computer, 'computer') +
      '</div>' +
      '<div class="submit-bar"><div></div><button class="btn btn-gold" id="btn-today-quiz">' + (done ? '重新回顾今日测验' : '🚀 开始今日测验') + '</button></div></div>';

    /* 本周计划 */
    html += '<div class="card"><h2>📌 本周计划（第' + wk.w + '周）</h2><div class="sub">' + esc(wk.title) + ' · 第 ' + wk.days[0] + '–' + wk.days[1] + ' 天</div>' +
      '<div class="tasklist">' +
      '<div class="task-row"><span class="badge">数学</span><span>' + esc(wk.math) + '</span></div>' +
      '<div class="task-row"><span class="badge">英语</span><span>' + esc(wk.english) + '</span></div>' +
      '<div class="task-row"><span class="badge ink">计算机</span><span>' + esc(wk.computer) + '</span></div>' +
      '</div></div>';

    /* 近14天打卡 */
    var chips = '';
    for (var i = 13; i >= 0; i--){
      var d = new Date(); d.setDate(d.getDate() - i);
      var ds = isoOf(d);
      var rec = state.days[ds];
      var cls = 'daychip';
      if (rec && rec.complete) cls += ' done';
      if (ds === info.today) cls += ' today';
      chips += '<div class="' + cls + '" title="' + ds + '"><span class="d">' + (d.getMonth() + 1) + '/' + d.getDate() + '</span>' + (rec && rec.complete ? '✓' : '·') + '</div>';
    }
    html += '<div class="card"><h2>🔥 近 14 天打卡</h2><div class="checkline">' + chips + '</div></div>';

    root.innerHTML = html;
    $('#btn-today-quiz').onclick = function (){ switchPage('quiz'); };
  }

  function greeting(){
    var h = new Date().getHours();
    if (h < 6) return '夜深了';
    if (h < 12) return '早上好';
    if (h < 14) return '中午好';
    if (h < 18) return '下午好';
    return '晚上好';
  }

  function taskRow(name, mix, subject){
    var parts = [];
    var typeName = {
      single: '单选', translation: '英译汉', reading: '阅读', cloze: '选词填空', dialogue: '补全对话',
      fill: '填空', calc: '计算题', short: '简答题', op: '操作题'
    };
    Object.keys(mix).forEach(function (k){
      if (k === 'sections' || k === 'diff' || k === 'trDir') return;
      var n = mix[k];
      if (n && n > 0) parts.push(typeName[k] + '×' + n);
    });
    var badgeCls = subject === 'computer' ? 'badge ink' : 'badge';
    return '<div class="task-row"><span class="t-badge ' + badgeCls + '">' + name + '</span><span>' + (parts.length ? parts.join(' · ') : '—') + '</span></div>';
  }

  /* ============================================================
     测验页
     ============================================================ */
  function renderQuiz(root){
    root.innerHTML = '<div class="page-head"><h1>每日测验</h1><div class="desc">完成每日任务，答完自动判分并展示知识点详解</div></div>' +
      '<div class="quiz-modes">' +
      '<button class="mode-btn active" data-mode="today"><div class="m-title">📌 今日任务</div><div class="m-desc">按 6 个月计划自动组题（英语/数学/计算机）</div></button>' +
      '<button class="mode-btn" data-mode="mock"><div class="m-title">📝 全真模拟</div><div class="m-desc">多套完整套卷 · 英语不含阅读理解</div></button>' +
      '<button class="mode-btn" data-mode="free"><div class="m-title">🎯 自选练习</div><div class="m-desc">按科目/知识点/难度自选题目专项练习</div></button>' +
      '</div><div id="quiz-area"></div>';

    var mode = 'today';
    $all('.mode-btn').forEach(function (b){
      b.onclick = function (){
        $all('.mode-btn').forEach(function (x){ x.classList.remove('active'); });
        b.classList.add('active');
        mode = b.dataset.mode;
        renderQuizArea(mode);
      };
    });
    renderQuizArea(mode);
  }

  function renderQuizArea(mode){
    var area = $('#quiz-area');
    if (mode === 'today') renderTodayQuiz(area);
    else if (mode === 'mock') renderMockQuiz(area);
    else renderFreeQuiz(area);
  }

  /* ---------- 今日任务测验 ---------- */
  function renderTodayQuiz(area){
    var info = dayInfo();
    if (info.beforeStart){ area.innerHTML = '<div class="empty"><span class="e-icon">⏳</span>备考尚未开始，请先到「设置」确认考试日期</div>'; return; }
    if (info.afterExam){ area.innerHTML = '<div class="empty"><span class="e-icon">🎓</span>考试已结束！可到「学习记录」回顾，或到「设置」调整考试日期后继续练习</div>'; return; }

    var date = info.today;
    var day = info.day;

    /* 建立/恢复草稿 */
    if (!draft || draft.date !== date || draft.version !== 1){
      var items = CORE.buildDaily(day, state.settings.intensity, new Set(Object.keys(state.used)));
      draft = { version: 1, date: date, day: day, items: items.map(function (e){ return { id: e.item.id, subject: e.subject, type: e.type }; }), sections: {} };
      saveDraft();
    }
    /* 按科目分组 */
    var groups = { english: [], math: [], computer: [] };
    draft.items.forEach(function (it){
      var r = registry[it.id];
      if (r && groups[r.subject]) groups[r.subject].push(r);
    });

    var dayRec = state.days[date] || null;
    var subDone = draft.sections || {};
    var order = ['english', 'math', 'computer'];
    var names = { english: '英语', math: '数学', computer: '计算机' };

    var html = '<div class="card"><div class="sec-head"><h3>📅 ' + esc(date) + ' · 备考第 ' + day + ' 天任务</h3><span class="sec-progress">' +
      Object.keys(subDone).length + ' / 3 科已完成</span></div><div class="sub">按各科提交即判分，全部完成后自动打卡并计入学习记录</div></div>';
    area.innerHTML = html;

    order.forEach(function (sub){
      var entries = groups[sub];
      if (!entries || !entries.length){ area.insertAdjacentHTML('beforeend', '<div class="card"><h2>' + names[sub] + '</h2><div class="sub">该科题库暂为空</div></div>'); return; }
      var wrap = document.createElement('div');
      wrap.className = 'card';
      wrap.dataset.section = sub;
      sectionEntries[sub] = entries;
      area.appendChild(wrap);
      renderSectionHead(wrap, sub, entries, dayRec, subDone[sub]);
      renderSectionItems(wrap, sub, entries, dayRec);
      appendSectionBar(wrap, sub, subDone[sub]);
    });
    if (Object.keys(subDone).length >= 3){
      var rec = state.days[date];
      if (rec && rec.complete){
        area.insertAdjacentHTML('beforeend',
          '<div class="section-result good">🎉 今日任务已完成！得分 ' + rec.score + ' / ' + rec.max + '（' + fmtPct(rec.score, rec.max) + '%）</div>');
      }
    }
  }

  function renderSectionHead(wrap, sub, entries, dayRec, done){
    var names = { english: '英语', math: '数学', computer: '计算机' };
    var icons = { english: '🇬🇧', math: '📐', computer: '💻' };
    var chips = [];
    var cnt = {};
    entries.forEach(function (e){ cnt[e.type] = (cnt[e.type] || 0) + 1; });
    var typeName = { single: '单选', translation: '英译汉', reading: '阅读', cloze: '选词填空', dialogue: '补全对话', fill: '填空', calc: '计算大题', short: '简答题', op: '操作题' };
    Object.keys(cnt).forEach(function (k){ chips.push('<span class="kp">' + typeName[k] + '×' + cnt[k] + '</span>'); });
    var total = entries.length;
    var doneCount = 0;
    if (dayRec) entries.forEach(function (e){ if (dayRec.items.some(function (p){ return p.key.indexOf(e.item.id + '#') === 0; })) doneCount++; });
    wrap.insertAdjacentHTML('beforeend',
      '<div class="sec-head"><h3>' + icons[sub] + ' ' + names[sub] + '</h3><div>' + chips.join(' ') + '</div></div>' +
      '<div class="sub">共 ' + total + ' 题' + (done ? ' · 已提交 ✓' : '') + '</div>');
  }

  function appendSectionBar(wrap, sub, done){
    var names = { english: '英语', math: '数学', computer: '计算机' };
    var last = wrap.querySelector('.qitem');
    if (last) last.insertAdjacentHTML('afterend',
      '<div class="submit-bar right" style="margin-top:6px">' + (done
        ? '<span class="badge good">✓ 已提交</span> <button class="btn btn-soft" data-redo="' + sub + '">重新作答</button>'
        : '<button class="btn btn-primary" data-submit-section="' + sub + '">提交' + names[sub] + '并判分</button>') + '</div>');
  }

  function renderSectionItems(wrap, sub, entries, dayRec){
    var results = sectionResults[sub] || {};
    var inputsMap = null;
    var date = todayISO();
    if (dayRec){
      inputsMap = {};
      dayRec.items.forEach(function (p){ inputsMap[p.key] = p; });
    }
    var idx = 0;
    entries.forEach(function (en){
      var result = results[en.item.id] || null;
      var savedParts = null;
      if (inputsMap){
        var parts = [];
        var g = CORE.grade(en.item, en.type, {});
        g.parts.forEach(function (p){
          if (inputsMap[p.key]) parts.push(inputsMap[p.key]);
        });
        if (parts.length) savedParts = parts;
      }
      var node = document.createElement('div');
      renderEntry(node, en, ++idx, result, savedParts);
      wrap.appendChild(node);
    });
  }

  /* ---------- 渲染单题 ---------- */
  function renderEntry(node, en, idx, result, savedParts){
    var item = en.item, type = en.type;
    var diffLabel = { 1: '基础', 2: '中等', 3: '偏难' };
    var diffCls = { 1: 'badge', 2: 'badge gold', 3: 'badge bad' };
    var typeTag = typeNameOf(type);
    var revealed = !!(result || (savedParts && savedParts.length));
    var inWrong = isWrong(item.id);
    var wrongBtn = '<button class="btn-mini' + (inWrong ? ' on' : '') + '" data-add-wrong="' + esc(item.id) + '">' + (inWrong ? '✓ 已在错题集' : '＋ 加入错题集') + '</button>';

    var head = '<div class="q-top"><span class="q-num">' + idx + '.</span><span class="kp q-kp' + (revealed ? '' : ' is-hidden') + '">' + esc(item.knowledge || item.section || '') + '</span><span class="' + (diffCls[item.difficulty] || 'badge') + '">' + (diffLabel[item.difficulty] || '') + '</span><span class="badge ink">' + typeTag + '</span>' + wrongBtn + '</div>';

    var body = '';
    if (type === 'single'){
      body = '<div class="q-body">' + esc(item.q) + '</div>' + (item.options || []).map(function (o, i){
        var letter = String.fromCharCode(65 + i);
        var cls = 'opt';
        if (result){
          cls += ' disabled';
          if (letter === item.a) cls += ' correct';
          else if (savedParts && savedParts[0] && savedParts[0].correct === false && chosenLetterOf(savedParts[0]) === letter) cls += ' wrong';
        } else {
          cls += ' selectable';
        }
        return '<button class="' + cls + '" data-letter="' + letter + '"><span class="letter">' + letter + '.</span><span>' + esc(o.replace(/^[A-D][.、]\s*/, '')) + '</span></button>';
      }).join('');
    } else if (type === 'fill' || type === 'calc'){
      var placeholder = type === 'calc' ? '输入最终答案（如 1/3、e^2、ln2、pi/4）' : '输入答案（数值或表达式，如 2、1/3、ln2）';
      body = '<div class="q-body">' + esc(item.q) + '</div>' +
        '<div class="ansbox"><input class="qinput" data-ans style="flex:1;min-width:200px" placeholder="' + placeholder + '"' + (result ? ' disabled' : '') + ' value="' + esc(savedParts && savedParts[0] && savedParts[0].userAns || '') + '"></div>';
    } else if (type === 'translation'){
      var dirTxt = item.direction === 'c2e' ? '请将下列中文翻译成英文：' : '请将下列英文翻译成中文：';
      var src = item.direction === 'c2e' ? item.zh : item.en;
      body = '<div class="q-body"><b>' + dirTxt + '</b>\n' + esc(src) + '</div>' +
        '<textarea class="qinput" data-self-input' + (result ? ' disabled' : '') + ' placeholder="在此作答…"></textarea>';
    } else if (type === 'dialogue'){
      body = '<div class="q-body"><span class="badge gold">场景：' + esc(item.scene) + '</span></div>' +
        '<div class="passage">' + item.lines.map(function (l){ return '<div>' + esc(l.who) + '：' + esc(l.text).replace(/_{3,4}(\d+)_{3,4}/g, '<span class="blank" data-blank-src="$1">____$1____</span>') + '</div>'; }).join('') + '</div>' +
        renderBlankSelects(item.blanks, 'b', result, savedParts);
    } else if (type === 'reading'){
      body = '<div class="passage"><div class="ph-title">📄 ' + esc(item.title) + '</div>' + esc(item.passage) + '</div>' +
        item.questions.map(function (q, i){
          return '<div class="q-body"><b>Q' + (i + 1) + '.</b> ' + esc(q.q) + '</div>' +
            '<div class="q-options">' + q.options.map(function (o, k){
              var letter = String.fromCharCode(65 + k);
              var cls = 'opt' + (result ? ' disabled' : ' selectable');
              if (result){
                if (letter === q.a) cls += ' correct';
                else if (savedParts && savedParts[i] && savedParts[i].correct === false && savedParts[i].userAns === letter) cls += ' wrong';
              }
              return '<button class="' + cls + '" data-q="' + (i + 1) + '" data-letter="' + letter + '"><span class="letter">' + letter + '.</span><span>' + esc(o.replace(/^[A-D][.、]\s*/, '')) + '</span></button>';
            }).join('') + '</div>';
        }).join('');
    } else if (type === 'cloze'){
      body = '<div class="q-body"><span class="badge gold">从每空 4 个选项中选出最恰当的一项</span></div>' +
        '<div class="passage">' + esc(item.passage).replace(/_{3,4}(\d+)_{3,4}/g, '<span class="blank" data-blank-src="$1">____$1____</span>') + '</div>' +
        renderBlankSelects(item.blanks, 'b', result, savedParts);
    } else if (type === 'short' || type === 'op'){
      var tip = type === 'short' ? '请简要作答，答后对照参考答案自评' : '请写出操作步骤，答后对照参考答案自评';
      body = '<div class="q-body">' + esc(item.q) + '</div>' +
        '<div class="sub">' + tip + '</div>' +
        '<textarea class="qinput" data-self-input' + (result ? ' disabled' : '') + ' placeholder="在此作答…"></textarea>';
    }

    node.innerHTML = '<div class="qitem" data-entry="' + esc(item.id) + '" data-type="' + type + '">' + head + body + '<div class="entry-tail"></div></div>';

    var entryEl = $('[data-entry="' + item.id + '"]', node);
    bindEntryInputs(entryEl, type, result);

    if (result){
      renderResultInto(entryEl, en, result, savedParts);
    } else if (savedParts && savedParts.length && !result){
      renderSavedResult(entryEl, en, savedParts);
    }
  }

  function typeNameOf(type){
    var m = { single: '单选', translation: '英译汉', dialogue: '补全对话', reading: '阅读理解', cloze: '选词填空', fill: '填空', calc: '计算大题', short: '简答题', op: '操作题' };
    return m[type] || type;
  }

  function chosenLetterOf(part){
    return part.userAns || '';
  }

  function renderBlankSelects(blanks, prefix, result, savedParts){
    return blanks.map(function (b, i){
      var val = '';
      if (result && savedParts && savedParts[i]) val = savedParts[i].userAns || '';
      var cls = result && savedParts && savedParts[i] ? (savedParts[i].correct ? 'qinput correct-in' : 'qinput wrong-in') : 'qinput';
      return '<div style="margin:8px 0"><span class="muted small">第 ' + b.n + ' 空：</span>' +
        '<select class="' + cls + '" data-' + prefix + '="' + b.n + '"' + (result ? ' disabled' : '') + '>' +
        '<option value="">— 请选择 —</option>' +
        b.options.map(function (o){
          var letter = o.charAt(0);
          return '<option value="' + letter + '"' + (val === letter ? ' selected' : '') + '>' + esc(o) + '</option>';
        }).join('') +
        '</select></div>';
    }).join('');
  }

  function bindEntryInputs(entryEl, type, result){
    if (result) return;
    var self = entryEl;
    if (type === 'single'){
      $all('.opt', entryEl).forEach(function (o){
        o.onclick = function (){
          $all('.opt', entryEl).forEach(function (x){ x.classList.remove('selected'); });
          o.classList.add('selected');
        };
      });
    } else if (type === 'reading'){
      $all('.opt', entryEl).forEach(function (o){
        o.onclick = function (){
          var qn = o.dataset.q;
          $all('.opt[data-q="' + qn + '"]', entryEl).forEach(function (x){ x.classList.remove('selected'); });
          o.classList.add('selected');
        };
      });
    } else if (type === 'translation' || type === 'short' || type === 'op'){
      /* 自评按钮在提交后添加 */
    }
  }

  /* ---------- 收集答案 ---------- */
  function collectEntryInput(entryEl, en){
    var type = en.type, input = {};
    if (type === 'single'){
      var sel = $('.opt.selected', entryEl);
      if (sel) input.choice = sel.dataset.letter;
    } else if (type === 'fill' || type === 'calc'){
      var inp = $('[data-ans]', entryEl);
      if (inp) input.ans = inp.value.trim();
    } else if (type === 'reading'){
      $all('.opt', entryEl).forEach(function (o){
        if (o.classList.contains('selected')) input['q' + o.dataset.q] = o.dataset.letter;
      });
    } else if (type === 'dialogue' || type === 'cloze'){
      $all('select', entryEl).forEach(function (s){
        var k = s.dataset.b;
        if (k && s.value) input['b' + k] = s.value;
      });
    } else if (type === 'translation' || type === 'short' || type === 'op'){
      var v = $('[data-self-input]', entryEl);
      if (v) input.selfText = v.value.trim();
      input.self = entryEl.dataset.self || '';
    }
    return input;
  }

  /* ---------- 提交科目 ---------- */
  function submitSection(sub){
    var wrap = $('[data-section="' + sub + '"]');
    if (!wrap) return;
    var entries = sectionEntries[sub];
    if (!entries) return;
    var date = todayISO();
    var dayRec = state.days[date] || (state.days[date] = { date: date, day: draft ? draft.day : 0, phase: '', week: 0, complete: false, score: 0, max: 0, items: [] });

    var results = sectionResults[sub] = {};
    var answered = 0;
    var wrongAdded = 0;

    $all('[data-entry]', wrap).forEach(function (entryEl){
      var id = entryEl.dataset.entry;
      var en = entries.find(function (e){ return e.item.id === id; });
      if (!en) return;
      var input = collectEntryInput(entryEl, en);
      var g = CORE.grade(en.item, en.type, input);
      g.parts.forEach(function (p, pi){
        var ua = '';
        if (en.type === 'reading') ua = input['q' + (pi + 1)] || '';
        else if (en.type === 'dialogue' || en.type === 'cloze') ua = input['b' + (en.item.blanks[pi] ? en.item.blanks[pi].n : (pi + 1))] || '';
        else ua = input.choice || input.ans || input.self || '';
        p.userAns = ua;
        p.subject = en.subject; p.type = en.type; p.section = en.item.section;
        dayRec.items = dayRec.items.filter(function (x){ return x.key !== p.key; });
        dayRec.items.push(p);
      });
      results[en.item.id] = { grade: g, item: en.item, type: en.type };
      state.used[en.item.id] = 1;
      if (g.parts.some(function (p){ return p.correct === false; })){
        if (addWrong(en.item.id, en.subject, en.type, 'daily')) wrongAdded++;
      }
    });

    draft.sections[sub] = true;
    saveDraft();

    /* 重算总分 */
    dayRec.score = dayRec.items.reduce(function (s, p){ return s + (p.points || 0); }, 0);
    dayRec.max = dayRec.items.reduce(function (s, p){ return s + (p.max || 0); }, 0);
    dayRec.phase = draft ? PLAN.phaseOf(draft.day).name : '';
    dayRec.week = draft ? PLAN.weekOf(draft.day).w : 0;
    saveState();

    /* 重绘该科目 */
    wrap.innerHTML = '';
    renderSectionHead(wrap, sub, entries, state.days[date], true);
    renderSectionItems(wrap, sub, entries, state.days[date]);
    appendSectionBar(wrap, sub, true);

    var g = sectionResults[sub];
    var score = 0, max = 0;
    Object.keys(g).forEach(function (id){ score += g[id].grade.total; max += g[id].grade.max; });
    wrap.insertAdjacentHTML('beforeend',
      '<div class="section-result ' + (fmtPct(score, max) >= 80 ? 'good' : (fmtPct(score, max) >= 60 ? 'mid' : 'low')) + '">' +
      '本卷得分 ' + score + ' / ' + max + '（' + fmtPct(score, max) + '%）· 答案解析见各题下方</div>');

    if (wrongAdded) toast('❌ ' + wrongAdded + ' 道错题已自动加入错题集');
    checkDayComplete();
  }

  function checkDayComplete(){
    var date = todayISO();
    var dayRec = state.days[date];
    if (!dayRec) return;
    var sections = draft.sections || {};
    if (sections.english && sections.math && sections.computer && !dayRec.complete){
      dayRec.complete = true;
      saveState();
      toast('🎉 今日任务全部完成！已自动打卡');
      celebrate();
      /* 刷新今日页统计 */
      if (currentPage === 'today') switchPage('today');
    }
  }

  function redoSection(sub){
    var wrap = $('[data-section="' + sub + '"]');
    if (!wrap) return;
    var date = todayISO();
    var dayRec = state.days[date];
    var entries = sectionEntries[sub];
    if (dayRec && entries){
      entries.forEach(function (en){
        dayRec.items = dayRec.items.filter(function (p){ return p.key.indexOf(en.item.id + '#') !== 0; });
      });
      dayRec.score = dayRec.items.reduce(function (s, p){ return s + (p.points || 0); }, 0);
      dayRec.max = dayRec.items.reduce(function (s, p){ return s + (p.max || 0); }, 0);
      saveState();
    }
    if (draft && draft.sections) delete draft.sections[sub];
    sectionResults[sub] = {};
    saveDraft();
    wrap.innerHTML = '';
    renderSectionHead(wrap, sub, entries, dayRec, false);
    renderSectionItems(wrap, sub, entries, dayRec);
    appendSectionBar(wrap, sub, false);
  }

  /* ---------- 渲染结果 ---------- */
  function revealKnowledge(entryEl){
    $all('.q-kp', entryEl).forEach(function (x){ x.classList.remove('is-hidden'); });
  }
  function setWrongBtnState(id, inWrong){
    $all('[data-add-wrong="' + id + '"]').forEach(function (b){
      if (inWrong){ b.classList.add('on'); b.textContent = '✓ 已在错题集'; }
      else { b.classList.remove('on'); b.textContent = '＋ 加入错题集'; }
    });
  }
  function renderResultInto(entryEl, en, result, savedParts){
    var type = en.type, item = en.item;
    var g = result.grade;
    var parts = g.parts;
    var tail = $('.entry-tail', entryEl);
    revealKnowledge(entryEl);

    if (type === 'single' || type === 'fill' || type === 'calc'){
      var p0 = parts[0];
      var mark = p0.correct === true ? '<span class="badge good">✓ 正确</span>' : (p0.correct === false ? '<span class="badge bad">✗ 错误</span>' : '<span class="badge gold">待定</span>');
      var ansTxt = type === 'single' ? '正确答案：' + item.a + ' ' + (item.options && item.options[item.a.charCodeAt(0) - 65] || '') :
        (item.a != null ? '正确答案：' + item.a + '（数值 ' + (item.ansNum != null ? item.ansNum : '—') + '）' : '');
      tail.innerHTML = '<div class="explain"><div class="ex-ans ' + (p0.correct === false ? 'wrong' : '') + '">' + mark + ' ' + esc(ansTxt) + '</div>' +
        '<div class="ex-kp">📌 知识点：' + esc(item.knowledge) + '</div>' +
        '<pre>' + esc(item.ex || '') + '</pre></div>';
    } else if (type === 'reading'){
      var lines = item.questions.map(function (q, i){
        var p = parts[i];
        var mark = p.correct === true ? '✓' : (p.correct === false ? '✗' : '·');
        return mark + ' Q' + (i + 1) + '：正确答案 ' + q.a + (q.ex ? ' — ' + q.ex : '');
      });
      tail.innerHTML = '<div class="explain"><div class="ex-kp">📌 知识点：' + esc(item.knowledge) + '</div><pre>' + esc(lines.join('\n')) + '</pre></div>';
    } else if (type === 'dialogue' || type === 'cloze'){
      var blanks = item.blanks;
      var blines = blanks.map(function (b, i){
        var p = parts[i];
        var mark = p.correct === true ? '✓' : (p.correct === false ? '✗' : '·');
        return mark + ' 第' + b.n + '空：' + b.a + (b.ex ? ' — ' + b.ex : '');
      });
      tail.innerHTML = '<div class="explain"><div class="ex-kp">📌 知识点：' + esc(item.knowledge) + '</div><pre>' + esc(blines.join('\n')) + '</pre></div>';
    } else if (type === 'translation'){
      var ref = item.direction === 'c2e' ? '参考译文（英）：\n' + item.en : '参考译文（中）：\n' + item.zh;
      tail.innerHTML = '<div class="explain"><div class="ex-kp">📌 知识点：' + esc(item.knowledge) + '</div><pre>' + esc(ref) + '</pre>' +
        '<pre>' + esc(item.ex || '') + '</pre>' + selfButtons(entryEl, p0) + '</div>';
    } else if (type === 'short' || type === 'op'){
      tail.innerHTML = '<div class="explain"><div class="ex-kp">📌 知识点：' + esc(item.knowledge) + '</div>' +
        '<div class="sub">参考答案：</div><pre>' + esc(item.ref || '') + '</pre>' + selfButtons(entryEl, parts[0]) + '</div>';
    }
  }

  function selfButtons(entryEl, part){
    var cur = part && part.correct === true ? 'r' : (part && part.correct === false ? 'w' : '');
    var clsR = cur === 'r' ? 'btn btn-primary' : 'btn btn-ghost';
    var clsW = cur === 'w' ? 'btn btn-primary' : 'btn btn-ghost';
    return '<div class="selfbtns"><span class="muted small" style="align-self:center">自评（计入得分率）：</span>' +
      '<button class="' + clsR + '" data-self="r"' + (part && part.correct != null ? ' disabled' : '') + '>我答对了</button>' +
      '<button class="' + clsW + '" data-self="w"' + (part && part.correct != null ? ' disabled' : '') + '>我答错了</button></div>';
  }

  function renderSavedResult(entryEl, en, savedParts){
    var type = en.type, item = en.item;
    var tail = $('.entry-tail', entryEl);
    revealKnowledge(entryEl);
    var markSum = savedParts.every(function (p){ return p.correct === true; });
    var anyWrong = savedParts.some(function (p){ return p.correct === false; });
    var badge = anyWrong ? '<span class="badge bad">✗ 有错误</span>' : (markSum ? '<span class="badge good">✓ 全对</span>' : '<span class="badge gold">待自评</span>');
    if (type === 'translation' || type === 'short' || type === 'op'){
      var ref = type === 'translation' ? (item.direction === 'c2e' ? '参考译文（英）：\n' + item.en : '参考译文（中）：\n' + item.zh) : (item.ref || '');
      var p0 = savedParts[0];
      tail.innerHTML = '<div class="explain">' + badge +
        '<div class="ex-kp">📌 知识点：' + esc(item.knowledge) + '</div><pre>' + esc(ref) + '</pre>' +
        selfButtons(entryEl, p0) + '</div>';
    } else {
      var first = savedParts[0];
      var ansTxt = type === 'single' ? '正确答案：' + item.a + ' ' + (item.options && item.options[item.a.charCodeAt(0) - 65] || '') : (item.a != null ? '正确答案：' + item.a : '');
      tail.innerHTML = '<div class="explain">' + badge + '<div class="ex-ans">' + esc(ansTxt) + '</div>' +
        '<div class="ex-kp">📌 知识点：' + esc(item.knowledge) + '</div><pre>' + esc(item.ex || '') + '</pre></div>';
    }
  }

  /* ---------- 全真模拟 ---------- */
  function renderMockQuiz(area){
    var sets = CORE.MOCK_SETS || [{ id: 0, name: '全真模拟卷（一）', desc: '' }];
    if (mockSetIdx >= sets.length) mockSetIdx = 0;
    area.innerHTML = '<div class="quiz-modes" id="mock-sets">' +
      sets.map(function (s){
        return '<button class="mode-btn' + (s.id === mockSetIdx ? ' active' : '') + '" data-mock-set="' + s.id + '">' +
          '<div class="m-title">📝 ' + esc(s.name) + '</div><div class="m-desc">' + esc(s.desc || '') + '（英语不含阅读理解）</div></button>';
      }).join('') + '</div><div id="mock-area"></div>';
    $all('[data-mock-set]').forEach(function (b){
      b.onclick = function (){
        mockSetIdx = +b.dataset.mockSet;
        $all('[data-mock-set]').forEach(function (x){ x.classList.remove('active'); });
        b.classList.add('active');
        renderMockPaper();
      };
    });
    renderMockPaper();
  }

  function renderMockPaper(){
    var area = $('#mock-area');
    if (!area) return;
    area.innerHTML = '';
    var set = (CORE.MOCK_SETS && CORE.MOCK_SETS[mockSetIdx]) || { name: '全真模拟卷', desc: '' };
    var entries = CORE.buildMock(mockSetIdx);
    if (!entries.length){ area.innerHTML = '<div class="empty">题库为空，请等待题库生成</div>'; return; }

    var groups = { english: [], math: [], computer: [] };
    entries.forEach(function (e){ if (groups[e.subject]) groups[e.subject].push(e); });

    var html = '<div class="card"><div class="sec-head"><h3>📝 ' + esc(set.name) + '</h3><span class="sec-progress">英语 ' + groups.english.length + ' 题 · 数学 ' + groups.math.length + ' 题 · 计算机 ' + groups.computer.length + ' 题</span></div>' +
      '<div class="sub">限时 120 分钟 · 英语套卷不含阅读理解 · 全部答完后点击底部「提交全卷」统一判分，成绩计入「学习记录 · 模拟考试」</div></div>';
    area.innerHTML = html;
    sectionEntries = {};
    sectionResults = {};

    ['english', 'math', 'computer'].forEach(function (sub){
      var entriesSub = groups[sub];
      if (!entriesSub || !entriesSub.length) return;
      var wrap = document.createElement('div');
      wrap.className = 'card';
      wrap.dataset.section = sub;
      sectionEntries[sub] = entriesSub;
      area.appendChild(wrap);
      var names = { english: '英语', math: '数学', computer: '计算机' };
      wrap.insertAdjacentHTML('beforeend', '<div class="sec-head"><h3>' + names[sub] + '</h3><span class="muted small">共 ' + entriesSub.length + ' 题</span></div>');
      var idx = 0;
      entriesSub.forEach(function (en){
        var node = document.createElement('div');
        renderEntry(node, en, ++idx, null, null);
        wrap.appendChild(node);
      });
    });

    var bar = document.createElement('div');
    bar.className = 'card';
    bar.innerHTML = '<div class="submit-bar"><span class="muted">全部作答完毕后提交</span><button class="btn btn-gold" id="btn-submit-mock">✅ 提交全卷并判分</button></div>';
    area.appendChild(bar);
    $('#btn-submit-mock').onclick = function (){ submitMock(set); };
  }

  function submitMock(set){
    var totalScore = 0, totalMax = 0, partsAll = [];
    var wrongAdded = 0;
    Object.keys(sectionEntries).forEach(function (sub){
      var wrap = $('[data-section="' + sub + '"]');
      if (!wrap) return;
      $all('[data-entry]', wrap).forEach(function (entryEl){
        var id = entryEl.dataset.entry;
        var en = sectionEntries[sub].find(function (e){ return e.item.id === id; });
        if (!en) return;
        var input = collectEntryInput(entryEl, en);
        var g = CORE.grade(en.item, en.type, input);
        totalScore += g.total; totalMax += g.max;
        g.parts.forEach(function (p){ p.userAns = input.choice || input.ans || ''; p.subject = en.subject; p.type = en.type; p.section = en.item.section; });
        partsAll.push({ id: en.item.id, g: g, en: en });
        state.used[en.item.id] = 1;
        if (g.parts.some(function (p){ return p.correct === false; })){
          if (addWrong(en.item.id, en.subject, en.type, 'mock')) wrongAdded++;
        }
      });
    });

    var date = todayISO();
    var mockName = set && set.name ? set.name : '全真模拟卷';
    var allParts = [];
    partsAll.forEach(function (pa){
      pa.g.parts.forEach(function (p){ allParts.push(p); });
    });
    state.mocks.push({ date: date, score: totalScore, max: totalMax, label: mockName + '（' + date + '）', parts: allParts });
    saveState();

    /* 展示结果 */
    var area = $('#mock-area');
    Object.keys(sectionEntries).forEach(function (sub){
      var wrap = $('[data-section="' + sub + '"]');
      if (!wrap) return;
      $all('[data-entry]', wrap).forEach(function (entryEl){
        var id = entryEl.dataset.entry;
        var en = sectionEntries[sub].find(function (e){ return e.item.id === id; });
        var found = partsAll.find(function (p){ return p.id === id; });
        if (!found) return;
        var parts = found.g.parts.map(function (p){ return p; });
        var tail = $('.entry-tail', entryEl);
        if (tail) tail.innerHTML = '';
        entryEl.querySelectorAll('.opt,select,input,textarea').forEach(function (x){ x.disabled = true; });
        renderResultInto(entryEl, en, { grade: found.g }, parts);
      });
    });
    var bar = $('#btn-submit-mock');
    if (bar){
      bar.closest('.card').innerHTML = '<div class="section-result ' + (fmtPct(totalScore, totalMax) >= 80 ? 'good' : (fmtPct(totalScore, totalMax) >= 60 ? 'mid' : 'low')) + '">' +
        '🎯 ' + esc(mockName) + '得分 ' + totalScore + ' / ' + totalMax + '（' + fmtPct(totalScore, totalMax) + '%）已计入学习记录</div>';
    }
    toast(wrongAdded ? ('模拟卷已判分！❌ ' + wrongAdded + ' 道错题已加入错题集') : '模拟卷已判分！');
  }

  /* ---------- 自选练习 ---------- */
  function renderFreeQuiz(area){
    area.innerHTML = '<div class="card"><h2>🎯 自选练习</h2><div class="sub">选择科目、知识点与难度，随机组题专项训练</div>' +
      '<div class="form-row"><label>科目</label><select id="free-subject">' +
      '<option value="english">英语</option><option value="math">数学</option><option value="computer">计算机</option></select></div>' +
      '<div class="form-row"><label>知识点</label><select id="free-section"></select></div>' +
      '<div class="form-row"><label>难度</label><select id="free-diff">' +
      '<option value="0">全部</option><option value="1">基础</option><option value="2">中等</option><option value="3">偏难</option></select></div>' +
      '<div class="form-row"><label>题量</label><select id="free-count">' +
      '<option value="5">5 题</option><option value="10" selected>10 题</option><option value="15">15 题</option><option value="20">20 题</option></select></div>' +
      '<div class="submit-bar right"><button class="btn btn-primary" id="btn-free-gen">生成练习</button></div></div>' +
      '<div id="free-area"></div>';

    function fillSections(){
      var sub = $('#free-subject').value;
      var sel = $('#free-section');
      var options = [{ v: '__all__', t: '全部知识点' }];
      if (sub === 'english'){
        ['single', 'translation', 'dialogue', 'reading', 'cloze'].forEach(function (t){
          (CORE.POOLS.english[t] || []).forEach(function (it){ if (!options.some(function (o){ return o.v === it.section; })) options.push({ v: it.section, t: it.section }); });
        });
      } else if (sub === 'math'){
        CORE.MATH_SECS_ALL.forEach(function (s){
          var sec = { '极限': 'limit', '微分': 'diff', '积分': 'integ', '二重积分': 'dbl', '常微分方程与级数': 'extra', '线性代数': 'linalg' }[s];
          if (sec && CORE.POOLS.math[sec]) options.push({ v: s, t: s });
        });
      } else {
        CORE.COM_SECS_ALL.forEach(function (s){ options.push({ v: s, t: s }); });
      }
      sel.innerHTML = options.map(function (o){ return '<option value="' + esc(o.v) + '">' + esc(o.t) + '</option>'; }).join('');
    }
    fillSections();
    $('#free-subject').onchange = fillSections;

    $('#btn-free-gen').onclick = function (){
      var sub = $('#free-subject').value;
      var sec = $('#free-section').value;
      var diff = +$('#free-diff').value;
      var count = +$('#free-count').value;
      var pool = [];
      if (sub === 'english'){
        ['single', 'translation', 'dialogue', 'reading', 'cloze'].forEach(function (t){
          (CORE.POOLS.english[t] || []).forEach(function (it){ pool.push({ subject: 'english', type: t, item: it }); });
        });
      } else if (sub === 'math'){
        CORE.allItems().forEach(function (e){ if (e.subject === 'math') pool.push(e); });
      } else {
        ['single', 'short', 'op'].forEach(function (t){
          (CORE.POOLS.computer[t] || []).forEach(function (it){ pool.push({ subject: 'computer', type: t, item: it }); });
        });
      }
      var filtered = pool.filter(function (e){
        if (sec !== '__all__' && e.item.section !== sec) return false;
        if (diff && e.item.difficulty !== diff) return false;
        return true;
      });
      if (filtered.length < count) filtered = pool.filter(function (e){ return sec === '__all__' || e.item.section === sec; });
      if (filtered.length < count) filtered = pool;
      var picked = shuffleArr(filtered).slice(0, count);

      var areaEl = $('#free-area');
      areaEl.innerHTML = '';
      if (!picked.length){ areaEl.innerHTML = '<div class="empty">该条件下暂无题目</div>'; return; }
      var wrap = document.createElement('div');
      wrap.className = 'card';
      wrap.dataset.section = 'free';
      areaEl.appendChild(wrap);
      wrap.insertAdjacentHTML('beforeend', '<div class="sec-head"><h3>专项练习</h3><span class="muted small">共 ' + picked.length + ' 题（本练习不计入学习记录）</span></div>');
      var idx = 0;
      picked.forEach(function (en){
        var node = document.createElement('div');
        renderEntry(node, en, ++idx, null, null);
        wrap.appendChild(node);
      });
      var bar = document.createElement('div');
      bar.className = 'card';
      bar.innerHTML = '<div class="submit-bar right"><button class="btn btn-gold" id="btn-free-submit">提交并查看解析</button></div>';
      areaEl.appendChild(bar);
      $('#btn-free-submit').onclick = function (){
        var score = 0, max = 0, wrongAdded = 0;
        $all('[data-entry]', wrap).forEach(function (entryEl){
          var id = entryEl.dataset.entry;
          var en = picked.find(function (e){ return e.item.id === id; });
          if (!en) return;
          var input = collectEntryInput(entryEl, en);
          var g = CORE.grade(en.item, en.type, input);
          score += g.total; max += g.max;
          entryEl.querySelectorAll('.opt,select,input,textarea').forEach(function (x){ x.disabled = true; });
          renderResultInto(entryEl, en, { grade: g }, g.parts);
          if (g.parts.some(function (p){ return p.correct === false; })){
            if (addWrong(en.item.id, en.subject, en.type, 'free')) wrongAdded++;
          }
        });
        bar.innerHTML = '<div class="section-result ' + (fmtPct(score, max) >= 80 ? 'good' : (fmtPct(score, max) >= 60 ? 'mid' : 'low')) + '">本次练习得分 ' + score + ' / ' + max + '（' + fmtPct(score, max) + '%）' + (wrongAdded ? ' · ❌ ' + wrongAdded + ' 道错题已加入错题集' : '') + '</div>';
      };
    };
  }

  function shuffleArr(a){
    var arr = a.slice();
    for (var i = arr.length - 1; i > 0; i--){
      var j = Math.floor(Math.random() * (i + 1));
      var t = arr[i]; arr[i] = arr[j]; arr[j] = t;
    }
    return arr;
  }

  /* ============================================================
     错题集页
     ============================================================ */
  function renderWrong(root){
    if (wrongPaper && wrongPaper.length){ renderWrongPaperPage(root); return; }

    var list = wrongList();
    var sNames = { english: '英语', math: '数学', computer: '计算机' };
    var html = '<div class="page-head"><h1>错题集</h1><div class="desc">答错的题目会自动收进这里，也可手动加入；支持勾选自由组卷重做</div></div>';

    if (!list.length){
      html += '<div class="card"><div class="empty"><span class="e-icon">🎉</span>错题集还是空的。<br>测验中答错的题目会自动进来，也可在题目右上角点「＋ 加入错题集」手动收录。</div>' +
        '<div class="submit-bar right"><button class="btn btn-primary" id="btn-wrong-go-quiz">去测验</button></div></div>';
      root.innerHTML = html;
      $('#btn-wrong-go-quiz').onclick = function (){ switchPage('quiz'); };
      return;
    }

    var bySub = { english: 0, math: 0, computer: 0 };
    list.forEach(function (w){ if (bySub[w.subject] != null) bySub[w.subject]++; });
    html += '<div class="stat-grid">' +
      '<div class="stat-card"><div class="num">' + list.length + '</div><div class="lbl">错题总数</div></div>' +
      '<div class="stat-card"><div class="num">' + bySub.english + '</div><div class="lbl">英语</div></div>' +
      '<div class="stat-card"><div class="num">' + bySub.math + '</div><div class="lbl">数学</div></div>' +
      '<div class="stat-card"><div class="num">' + bySub.computer + '</div><div class="lbl">计算机</div></div>' +
      '</div>';

    html += '<div class="card"><div class="sec-head"><h3>📚 错题清单</h3><span class="sec-progress" id="wrong-count">已选 0 / ' + list.length + ' 题</span></div>' +
      '<div class="sub">勾选题目后可自由组合成一套试卷重新作答；同一题重复收录会给出提示</div>' +
      '<div class="wrong-tools">' +
      '<button class="btn btn-soft" data-wrong-all="1">全选</button>' +
      '<button class="btn btn-soft" data-wrong-all="0">清空选择</button>' +
      '<button class="btn btn-gold" data-wrong-gen>🧩 生成错题试卷</button>' +
      '<button class="btn btn-danger-ghost" data-wrong-clear>清空错题集</button>' +
      '</div>';

    var groups = {};
    list.forEach(function (w){
      var key = w.subject + '\u0001' + (w.item.section || '未分类');
      (groups[key] = groups[key] || { subject: w.subject, section: w.item.section || '未分类', list: [] }).list.push(w);
    });
    Object.keys(groups).forEach(function (k){
      var g = groups[k];
      html += '<div class="section-block"><div class="sec-title"><span class="badge">' + sNames[g.subject] + '</span> ' + esc(g.section) + ' <span class="muted small">' + g.list.length + ' 题</span></div>';
      g.list.forEach(function (w){
        var it = w.item;
        var title = it.q || it.title || (it.zh ? ('翻译：' + it.zh) : '题目');
        var checked = wrongPicked[w.id] ? ' checked' : '';
        html += '<div class="wrong-item">' +
          '<label class="wi-check"><input type="checkbox" data-wrong-pick="' + esc(w.id) + '"' + checked + '></label>' +
          '<div class="wi-body"><div class="wi-q">' + esc(String(title).slice(0, 90)) + '</div>' +
          '<div class="wi-meta"><span class="badge ink">' + esc(typeNameOf(w.type)) + '</span>' +
          '<span class="muted small">收录 ' + (w.meta.count || 1) + ' 次</span></div></div>' +
          '<button class="btn-mini" data-wrong-remove="' + esc(w.id) + '">移除</button>' +
          '</div>';
      });
      html += '</div>';
    });
    html += '</div>';

    root.innerHTML = html;

    function updateWrongCount(){
      var n = Object.keys(wrongPicked).filter(function (id){ return isWrong(id); }).length;
      var el = $('#wrong-count'); if (el) el.textContent = '已选 ' + n + ' / ' + list.length + ' 题';
    }
    $all('[data-wrong-pick]').forEach(function (cb){
      cb.onchange = function (){
        if (cb.checked) wrongPicked[cb.dataset.wrongPick] = 1; else delete wrongPicked[cb.dataset.wrongPick];
        updateWrongCount();
      };
    });
    updateWrongCount();
  }

  function renderWrongPaperPage(root){
    var entries = wrongPaper || [];
    sectionEntries = {};
    sectionResults = {};
    var groups = { english: [], math: [], computer: [] };
    entries.forEach(function (e){ if (groups[e.subject]) groups[e.subject].push(e); });

    var html = '<div class="page-head"><h1>错题试卷</h1><div class="desc">由你勾选的 ' + entries.length + ' 道错题自由组合而成 · 提交后自动判分并显示解析</div></div>' +
      '<div class="card"><div class="sec-head"><h3>🧩 我的错题试卷</h3><span class="sec-progress">共 ' + entries.length + ' 题</span></div>' +
      '<div class="sub">英语 ' + groups.english.length + ' 题 · 数学 ' + groups.math.length + ' 题 · 计算机 ' + groups.computer.length + ' 题</div>' +
      '<div class="submit-bar right"><button class="btn btn-ghost" data-wrong-back>← 返回错题集</button></div></div>';
    root.innerHTML = html;

    ['english', 'math', 'computer'].forEach(function (sub){
      var entriesSub = groups[sub];
      if (!entriesSub || !entriesSub.length) return;
      var wrap = document.createElement('div');
      wrap.className = 'card';
      wrap.dataset.section = sub;
      sectionEntries[sub] = entriesSub;
      root.appendChild(wrap);
      var names = { english: '英语', math: '数学', computer: '计算机' };
      wrap.insertAdjacentHTML('beforeend', '<div class="sec-head"><h3>' + names[sub] + '</h3><span class="muted small">共 ' + entriesSub.length + ' 题</span></div>');
      var idx = 0;
      entriesSub.forEach(function (en){
        var node = document.createElement('div');
        renderEntry(node, en, ++idx, null, null);
        wrap.appendChild(node);
      });
    });

    var bar = document.createElement('div');
    bar.className = 'card';
    bar.innerHTML = '<div class="submit-bar right"><button class="btn btn-ghost" data-wrong-back>← 返回错题集</button> <button class="btn btn-gold" id="btn-submit-wrong" data-submit-wrong>✅ 提交并判分</button></div>';
    root.appendChild(bar);
  }

  function submitWrongPaper(){
    if (!wrongPaper || !wrongPaper.length) return;
    var score = 0, max = 0, wrongAdded = 0;
    Object.keys(sectionEntries).forEach(function (sub){
      var wrap = $('[data-section="' + sub + '"]');
      if (!wrap) return;
      $all('[data-entry]', wrap).forEach(function (entryEl){
        var id = entryEl.dataset.entry;
        var en = sectionEntries[sub].find(function (e){ return e.item.id === id; });
        if (!en) return;
        var input = collectEntryInput(entryEl, en);
        var g = CORE.grade(en.item, en.type, input);
        score += g.total; max += g.max;
        entryEl.querySelectorAll('.opt,select,input,textarea').forEach(function (x){ x.disabled = true; });
        renderResultInto(entryEl, en, { grade: g }, g.parts);
        if (g.parts.some(function (p){ return p.correct === false; })){
          if (addWrong(en.item.id, en.subject, en.type, 'review')) wrongAdded++;
        }
      });
    });
    var btn = $('#btn-submit-wrong');
    if (btn){
      var lvl = fmtPct(score, max) >= 80 ? 'good' : (fmtPct(score, max) >= 60 ? 'mid' : 'low');
      btn.closest('.card').innerHTML = '<div class="section-result ' + lvl + '">错题试卷得分 ' + score + ' / ' + max + '（' + fmtPct(score, max) + '%）' +
        (wrongAdded ? ' · ❌ ' + wrongAdded + ' 道错题已保留在错题集' : ' · 全部答对，可到错题集移除已掌握的题目') + '</div>' +
        '<div class="submit-bar right"><button class="btn btn-ghost" data-wrong-back>← 返回错题集</button></div>';
    }
    toast('错题试卷已判分！');
  }

  /* ---------- 提交/重做事件委托 ---------- */
  $('#page-root').addEventListener('click', function (e){
    var aw = e.target.closest('[data-add-wrong]');
    if (aw){
      var wid = aw.dataset.addWrong;
      if (isWrong(wid)) toast('❌ 该题已在错题集中，无需重复添加');
      else { addWrong(wid, null, null, 'manual'); toast('✅ 已加入错题集'); }
      setWrongBtnState(wid, true);
      return;
    }
    var sw = e.target.closest('[data-submit-wrong]');
    if (sw){ submitWrongPaper(); return; }
    var back = e.target.closest('[data-wrong-back]');
    if (back){ wrongPaper = null; switchPage('wrong'); return; }
    var gen = e.target.closest('[data-wrong-gen]');
    if (gen){
      var ids = Object.keys(wrongPicked).filter(function (id){ return isWrong(id); });
      if (!ids.length){ toast('请先勾选要组卷的错题'); return; }
      wrongPaper = ids.map(function (id){ return registry[id]; });
      switchPage('wrong');
      return;
    }
    var rm = e.target.closest('[data-wrong-remove]');
    if (rm){
      var rid = rm.dataset.wrongRemove;
      removeWrong(rid);
      delete wrongPicked[rid];
      toast('已从错题集移除');
      switchPage('wrong');
      return;
    }
    var clr = e.target.closest('[data-wrong-clear]');
    if (clr){
      confirmModal('清空错题集', '将从错题集中移除全部题目（不影响学习记录与打卡）。确定继续吗？', '清空', function (){
        state.wrong = {}; wrongPicked = {}; saveState();
        toast('错题集已清空');
        switchPage('wrong');
      });
      return;
    }
    var wa = e.target.closest('[data-wrong-all]');
    if (wa){
      var all = wa.dataset.wrongAll === '1';
      var wl = wrongList();
      wrongPicked = {};
      if (all) wl.forEach(function (w){ wrongPicked[w.id] = 1; });
      $all('[data-wrong-pick]').forEach(function (cb){ cb.checked = all; });
      var el = $('#wrong-count');
      if (el) el.textContent = '已选 ' + (all ? wl.length : 0) + ' / ' + wl.length + ' 题';
      return;
    }
    var subBtn = e.target.closest('[data-submit-section]');
    if (subBtn){ submitSection(subBtn.dataset.submitSection); return; }
    var redo = e.target.closest('[data-redo]');
    if (redo){ redoSection(redo.dataset.redo); return; }
    var selfBtn = e.target.closest('[data-self]');
    if (selfBtn){
      var entry = selfBtn.closest('.qitem');
      if (entry){
        entry.dataset.self = selfBtn.dataset.self;
        $all('[data-self]', entry).forEach(function (b){ b.disabled = true; });
        /* 更新存储的自评状态 */
        var id = entry.dataset.entry;
        var date = todayISO();
        var ok = selfBtn.dataset.self === 'r';
        var dayRec = state.days[date];
        if (dayRec){
          dayRec.items.forEach(function (p){
            if (p.key.indexOf(id + '#') === 0){
              p.correct = ok;
              p.points = ok ? p.max : 0;
            }
          });
          dayRec.score = dayRec.items.reduce(function (s, p){ return s + (p.points || 0); }, 0);
          dayRec.max = dayRec.items.reduce(function (s, p){ return s + (p.max || 0); }, 0);
        }
        /* 模拟卷中的自评同步更新成绩 */
        var mockDirty = false;
        state.mocks.forEach(function (m){
          if (m.date !== date || !m.parts) return;
          m.parts.forEach(function (p){
            if (p.key.indexOf(id + '#') === 0){
              p.correct = ok;
              p.points = ok ? p.max : 0;
              mockDirty = true;
            }
          });
          if (mockDirty){
            m.score = m.parts.reduce(function (s, p){ return s + (p.points || 0); }, 0);
            m.max = m.parts.reduce(function (s, p){ return s + (p.max || 0); }, 0);
          }
        });
        saveState();
        if (mockDirty){
          var sr = $('#quiz-area .section-result');
          if (sr){
            var m0 = state.mocks[state.mocks.length - 1];
            sr.className = 'section-result ' + (fmtPct(m0.score, m0.max) >= 80 ? 'good' : (fmtPct(m0.score, m0.max) >= 60 ? 'mid' : 'low'));
            sr.innerHTML = '🎯 模拟卷得分 ' + m0.score + ' / ' + m0.max + '（' + fmtPct(m0.score, m0.max) + '%）已计入学习记录（自评已更新）';
          }
        }
        var selfW = false;
        if (!ok){ selfW = addWrong(id, null, null, 'self'); setWrongBtnState(id, true); }
        toast(ok ? '已自评：答对 ✓' : (selfW ? '已自评：答错，已自动加入错题集' : '已自评：答错，请复习解析'));
        var wrap = entry.closest('[data-section]');
        if (wrap && wrap.dataset.section && sectionResults[wrap.dataset.section]){
          var sub = wrap.dataset.section;
          var g = sectionResults[sub];
          var score = 0, max = 0;
          Object.keys(g).forEach(function (k){ score += g[k].grade.total; max += g[k].grade.max; });
          var res = wrap.querySelector('.section-result');
          if (res){
            res.className = 'section-result ' + (fmtPct(score, max) >= 80 ? 'good' : (fmtPct(score, max) >= 60 ? 'mid' : 'low'));
            res.textContent = '本卷得分 ' + score + ' / ' + max + '（' + fmtPct(score, max) + '%）· 自评后得分率已更新';
          }
        }
      }
      return;
    }
  });

  /* ============================================================
     备考计划页
     ============================================================ */
  function renderPlan(root){
    var info = dayInfo();
    var phIdx = info.beforeStart ? -1 : (info.afterExam ? 3 : PLAN.phaseIdxOf(info.day));
    var html = '<div class="page-head"><h1>6 个月备考计划</h1><div class="desc">' + esc(info.examDate) + ' 考试 · 倒计时 ' + info.daysToExam + ' 天 · 共 180 天（可到「设置」调整考试日期）</div></div>';

    /* 阶段总览 */
    html += '<div class="card"><h2>🗺 四阶段总览</h2><div class="sub">基础 → 进阶 → 强化 → 冲刺</div><div class="tasklist">';
    PLAN.phases.forEach(function (p, i){
      var cur = i === phIdx;
      html += '<div class="task-row"><span class="t-badge ' + (cur ? 'badge ink' : 'badge') + '">' + (cur ? '● 当前' : '阶段' + (i + 1)) + '</span>' +
        '<span><b>' + esc(p.name) + '</b>（第 ' + p.days[0] + '–' + p.days[1] + ' 天）· ' + esc(p.goal) + '</span></div>';
    });
    html += '</div></div>';

    /* 各阶段周计划表 */
    var weekIdx = info.beforeStart ? -1 : (info.afterExam ? 27 : PLAN.weekOf(Math.min(PLAN.totalDays, info.day)).w);
    PLAN.phases.forEach(function (p, pi){
      var rows = PLAN.weeks.filter(function (w){ return w.days[0] >= p.days[0] && w.days[1] <= p.days[1]; });
      var startISO = planDateOf(p.days[0]);
      var endISO = planDateOf(p.days[1]);
      html += '<div class="card phase-card ' + p.id + '"><div class="phase-head">' +
        '<h3>' + (pi + 1) + '. ' + esc(p.name) + '</h3>' +
        '<span class="range">' + esc(startISO) + ' ~ ' + esc(endISO) + '（第 ' + p.days[0] + '–' + p.days[1] + ' 天）</span></div>' +
        '<div class="sub">' + esc(p.goal) + '</div>' +
        '<div class="phase-focus">' +
        '<span class="badge">数学</span>' + p.focus.math.map(function (t){ return '<span class="kp">' + esc(t) + '</span>'; }).join('') + '</div>' +
        '<div class="phase-focus"><span class="badge">英语</span>' + p.focus.english.map(function (t){ return '<span class="kp">' + esc(t) + '</span>'; }).join('') + '</div>' +
        '<div class="phase-focus"><span class="badge ink">计算机</span>' + p.focus.computer.map(function (t){ return '<span class="kp">' + esc(t) + '</span>'; }).join('') + '</div>' +
        '<table class="week-table"><thead><tr><th style="width:86px">周次</th><th style="width:120px">日期</th><th>主题</th><th>数学</th><th>英语</th><th>计算机</th></tr></thead><tbody>';
      rows.forEach(function (w){
        var dStart = planDateOf(w.days[0]), dEnd = planDateOf(w.days[1]);
        var isCur = w.w === weekIdx;
        html += '<tr class="' + (isCur ? 'today-row' : '') + '"><td>' + (isCur ? '★ ' : '') + '第' + w.w + '周</td>' +
          '<td class="small">' + esc(dStart.slice(5)) + '~' + esc(dEnd.slice(5)) + '</td>' +
          '<td><b>' + esc(w.title) + '</b></td>' +
          '<td><span class="topic">' + esc(w.math) + '</span></td>' +
          '<td><span class="topic">' + esc(w.english) + '</span></td>' +
          '<td><span class="topic">' + esc(w.computer) + '</span></td></tr>';
      });
      html += '</tbody></table></div>';
    });

    root.innerHTML = html;
  }

  /* ============================================================
     学习记录页
     ============================================================ */
  function renderStats(root){
    var agg = aggregate();
    var info = dayInfo();
    var sNames = { english: '英语', math: '数学', computer: '计算机' };
    var sColors = { english: '#2a7f8c', math: '#d99a3d', computer: '#5b8db8' };

    var html = '<div class="page-head"><h1>学习记录</h1><div class="desc">打卡、得分率与知识点掌握情况</div></div>';

    html += '<div class="stat-grid">' +
      '<div class="stat-card"><div class="num">' + agg.completedDays + '</div><div class="lbl">已学天数 / 180</div><div class="extra">' + fmtPct(agg.completedDays, 180) + '% 完成</div></div>' +
      '<div class="stat-card"><div class="num">' + streak() + '</div><div class="lbl">连续打卡（天）</div></div>' +
      '<div class="stat-card"><div class="num">' + fmtPct(agg.scoreSum, agg.maxSum) + '%</div><div class="lbl">累计得分率</div><div class="extra">' + agg.dayCount + ' 天有成绩记录</div></div>' +
      '<div class="stat-card"><div class="num">' + wrongList().length + '</div><div class="lbl">错题集</div><div class="extra"><a href="javascript:void(0)" id="btn-go-wrong" style="color:inherit">去复盘 →</a></div></div>' +
      '<div class="stat-card"><div class="num">' + (info.daysToExam > 0 ? info.daysToExam : 0) + '</div><div class="lbl">距考试（天）</div></div>' +
      '</div>';

    /* 三科得分率 */
    html += '<div class="card"><h2>📊 三科得分率</h2><div class="sub">按各科已作答题目累计得分 / 满分计算</div><div class="ring-wrap">';
    ['english', 'math', 'computer'].forEach(function (sub){
      var s = agg.subjects[sub];
      html += '<div class="ring-item">' + ringSVG(fmtPct(s.pts, s.max), 116, sColors[sub]) +
        '<div class="r-name">' + sNames[sub] + '</div><div class="r-val">' + s.pts + ' / ' + s.max + ' 分 · ' + s.count + ' 题</div></div>';
    });
    html += '</div></div>';

    /* 14日趋势 */
    html += '<div class="card"><h2>📈 近 14 天得分趋势</h2><div class="sub">仅统计已完成的每日任务</div>' + trendSVG() + '</div>';

    /* 知识点掌握 */
    var secs = Object.keys(agg.sections).map(function (k){ return agg.sections[k]; })
      .sort(function (a, b){ return (b.max - b.pts) - (a.max - a.pts); }).slice(0, 18);
    html += '<div class="card"><h2>🧠 知识点掌握（薄弱优先）</h2><div class="sub">按失分从多到少排序</div>';
    if (!secs.length){ html += '<div class="empty">完成每日测验后这里会展示各知识点的掌握情况</div>'; }
    secs.forEach(function (s){
      var pct = fmtPct(s.pts, s.max);
      html += '<div class="sect-bar"><div class="sb-top"><span><span class="badge">' + sNames[s.subject] + '</span> ' + esc(s.section) + '</span><b>' + pct + '%</b></div>' +
        '<div class="bar"><i style="width:' + pct + '%"></i></div><div class="small muted">' + s.pts + ' / ' + s.max + ' 分 · ' + s.count + ' 题</div></div>';
    });
    html += '</div>';

    /* 模拟考试记录 */
    html += '<div class="card"><h2>📝 模拟考试记录</h2>';
    if (!state.mocks.length){ html += '<div class="empty">还没有模拟考试记录，去「每日测验」页做一套全真模拟吧</div>'; }
    else {
      html += '<table class="tbl"><thead><tr><th>日期</th><th>名称</th><th>得分</th><th>得分率</th></tr></thead><tbody>';
      state.mocks.slice().reverse().forEach(function (m){
        html += '<tr><td>' + esc(m.date) + '</td><td>' + esc(m.label || '模拟卷') + '</td><td>' + m.score + ' / ' + m.max + '</td><td>' +
          '<div class="bar" style="width:120px;display:inline-block"><i style="width:' + fmtPct(m.score, m.max) + '%"></i></div> ' + fmtPct(m.score, m.max) + '%</td></tr>';
      });
      html += '</tbody></table>';
    }
    html += '</div>';

    html += '<div class="card"><div class="submit-bar"><span class="muted small">数据仅保存在本机浏览器</span>' +
      '<div><button class="btn btn-ghost" id="btn-export">导出数据</button> <button class="btn btn-danger-ghost" id="btn-reset">清空全部数据</button></div></div></div>';

    root.innerHTML = html;
    $('#btn-go-wrong').onclick = function (){ wrongPaper = null; switchPage('wrong'); };
    $('#btn-export').onclick = function (){
      var blob = new Blob([JSON.stringify({ state: state, draft: draft }, null, 2)], { type: 'application/json' });
      var a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = '蜀岸备考数据_' + todayISO() + '.json';
      a.click();
      URL.revokeObjectURL(a.href);
      toast('已导出数据文件');
    };
    $('#btn-reset').onclick = function (){
      confirmModal('清空全部数据', '将删除所有学习记录、打卡、错题集与设置（不可恢复）。确定继续吗？', '清空', function (){
        state = emptyState();
        draft = null;
        wrongPaper = null; wrongPicked = {};
        saveState(); localStorage.removeItem(DRAFT_KEY);
        toast('数据已清空');
        switchPage('today');
      });
    };
  }

  function trendSVG(){
    var days = [];
    var maxV = 100;
    for (var i = 13; i >= 0; i--){
      var d = new Date(); d.setDate(d.getDate() - i);
      var ds = isoOf(d);
      var rec = state.days[ds];
      var v = (rec && rec.complete && rec.max) ? fmtPct(rec.score, rec.max) : null;
      days.push({ ds: ds, v: v });
    }
    var W = 760, H = 170, padL = 36, padB = 26, padT = 12;
    var iw = (W - padL - 12) / (days.length - 1);
    var pts = [];
    days.forEach(function (d, idx){
      var x = padL + idx * iw;
      var y = H - padB - ((d.v == null ? 0 : d.v) / maxV) * (H - padB - padT);
      pts.push({ x: x, y: y, v: d.v, ds: d.ds });
    });
    var line = pts.map(function (p){ return p.x + ',' + p.y; }).join(' ');
    var html = '<svg viewBox="0 0 ' + W + ' ' + H + '" style="width:100%;height:auto">';
    for (var g = 0; g <= 4; g++){
      var gy = H - padB - (g / 4) * (H - padB - padT);
      html += '<line x1="' + padL + '" y1="' + gy + '" x2="' + (W - 12) + '" y2="' + gy + '" stroke="#ece7db" stroke-width="1"/>';
      html += '<text x="' + (padL - 6) + '" y="' + (gy + 4) + '" text-anchor="end" font-size="11" fill="#7d8790">' + (g * 25) + '%</text>';
    }
    pts.forEach(function (p, i){
      if (i > 0) html += '<line x1="' + pts[i - 1].x + '" y1="' + pts[i - 1].y + '" x2="' + p.x + '" y2="' + p.y + '" stroke="#2a7f8c" stroke-width="2"' + (pts[i - 1].v == null || p.v == null ? ' stroke-dasharray="4 4" opacity=".4"' : '') + '/>';
    });
    pts.forEach(function (p){
      if (p.v != null){
        html += '<circle cx="' + p.x + '" cy="' + p.y + '" r="3.5" fill="#d99a3d"/>';
      }
      html += '<text x="' + p.x + '" y="' + (H - 8) + '" text-anchor="middle" font-size="10" fill="#7d8790">' + p.ds.slice(5) + '</text>';
    });
    html += '</svg>';
    return html;
  }

  /* ============================================================
     知识点库页
     ============================================================ */
  function renderBank(root){
    var agg = aggregate();
    var html = '<div class="page-head"><h1>知识点库</h1><div class="desc">全部题目的知识点与解析，可按科目与关键词检索</div></div>' +
      '<div class="searchbar"><input class="qinput" id="bank-search" placeholder="🔍 搜索知识点 / 题干关键词…">' +
      '<button class="btn btn-primary" id="bank-search-btn">搜索</button></div>' +
      '<div class="bank-tabs">' +
      '<button class="bank-tab active" data-sub="all">全部</button>' +
      '<button class="bank-tab" data-sub="english">🇬🇧 英语</button>' +
      '<button class="bank-tab" data-sub="math">📐 数学</button>' +
      '<button class="bank-tab" data-sub="computer">💻 计算机</button>' +
      '</div><div id="bank-list"></div>';
    root.innerHTML = html;

    $all('.bank-tab').forEach(function (b){
      b.onclick = function (){
        $all('.bank-tab').forEach(function (x){ x.classList.remove('active'); });
        b.classList.add('active');
        bankFilter.subject = b.dataset.sub;
        renderBankList();
      };
    });
    function doSearch(){ bankFilter.q = $('#bank-search').value.trim(); renderBankList(); }
    $('#bank-search').addEventListener('keydown', function (e){ if (e.key === 'Enter') doSearch(); });
    $('#bank-search-btn').onclick = doSearch;
    renderBankList();
  }

  function renderBankList(){
    var list = $('#bank-list');
    var items = CORE.allItems();
    if (bankFilter.subject !== 'all') items = items.filter(function (e){ return e.subject === bankFilter.subject; });
    if (bankFilter.q){
      var q = bankFilter.q.toLowerCase();
      items = items.filter(function (e){
        var it = e.item;
        return (it.q || '').toLowerCase().indexOf(q) >= 0 ||
          (it.knowledge || '').toLowerCase().indexOf(q) >= 0 ||
          (it.section || '').toLowerCase().indexOf(q) >= 0;
      });
    }
    var agg = aggregate();
    var sNames = { english: '英语', math: '数学', computer: '计算机' };
    var group = {};
    items.forEach(function (e){
      var key = e.subject + '\u0001' + (e.item.section || '未分类');
      if (!group[key]) group[key] = { subject: e.subject, section: e.item.section || '未分类', list: [] };
      group[key].list.push(e);
    });
    var keys = Object.keys(group).sort(function (a, b){ return (a < b ? -1 : 1); });
    var html = '<div class="muted small" style="margin-bottom:10px">共 ' + items.length + ' 题 · ' + keys.length + ' 个知识点分组</div>';
    keys.forEach(function (k){
      var g = group[k];
      var secKey = g.subject + '\u0001' + g.section;
      var st = agg.sections[secKey];
      var badge = st && st.max > 0 ? '<span class="badge ' + (fmtPct(st.pts, st.max) >= 70 ? 'good' : 'gold') + '">掌握率 ' + fmtPct(st.pts, st.max) + '%</span>' : '';
      html += '<div class="section-block"><div class="sec-title"><span class="badge">' + sNames[g.subject] + '</span> ' + esc(g.section) + ' <span class="muted small">' + g.list.length + ' 题</span> ' + badge + '</div>';
      g.list.forEach(function (e){
        var it = e.item;
        var optLine = '';
        if (e.type === 'single' && it.options){
          optLine = '<div class="small muted">' + it.options.map(function (o){ return esc(o); }).join('　') + '</div>';
        }
        var ansLine = '';
        if (e.type === 'single') ansLine = '<div class="small"><b>答案：' + esc(it.a) + '</b></div>';
        else if ((e.type === 'fill' || e.type === 'calc') && it.a != null) ansLine = '<div class="small"><b>答案：' + esc(it.a) + '</b>' + (it.ansNum != null ? '（数值 ' + it.ansNum + '）' : '') + '</div>';
        else if (e.type === 'translation') ansLine = '<div class="small"><b>参考：</b>' + esc(it.direction === 'c2e' ? it.en : it.zh) + '</div>';
        else if (e.type === 'short' || e.type === 'op') ansLine = '<div class="small"><b>要点：</b>' + esc((it.ref || '').slice(0, 80)) + '…</div>';
        html += '<div class="bank-item"><div class="bq">' + esc(it.q || '') + '</div>' + optLine + ansLine +
          '<details><summary>📌 知识点与解析</summary><div class="bx"><b>' + esc(it.knowledge || '') + '</b><br>' + esc(it.ex || it.ref || '') + '</div></details></div>';
      });
      html += '</div>';
    });
    if (!keys.length) html = '<div class="empty"><span class="e-icon">🔍</span>没有匹配的题目</div>';
    list.innerHTML = html;
  }

  /* ============================================================
     设置页
     ============================================================ */
  function renderSettings(root){
    var s = state.settings;
    var html = '<div class="page-head"><h1>设置</h1><div class="desc">考试日期、开始日期与每日题量强度</div></div>' +
      '<div class="card"><h2>⚙️ 基本设置</h2>' +
      '<div class="form-row"><label>考试日期</label><input type="date" id="set-exam" value="' + esc(s.examDate) + '"></div>' +
      '<div class="form-row"><label>开始日期</label><input type="date" id="set-start" value="' + esc(s.startDate || '') + '"><span class="muted small">留空则按考试日期倒推 180 天</span></div>' +
      '<div class="form-row"><label>称呼</label><input type="text" id="set-name" value="' + esc(s.name) + '" style="width:180px"></div>' +
      '<div class="form-row"><label>每日题量</label><div class="intensity-row">' +
      '<button class="intensity-btn" data-int="0.7">轻松</button>' +
      '<button class="intensity-btn active" data-int="1">标准</button>' +
      '<button class="intensity-btn" data-int="1.3">加强</button></div></div>' +
      '<div class="form-row"><label></label><button class="btn btn-primary" id="btn-save-settings">保存设置</button></div></div>' +
      '<div class="card"><h2>ℹ️ 关于</h2>' +
      '<div class="sub">「蜀岸 · 2027四川专升本备考」依据四川统招专升本考试大纲（大学英语 / 高等数学 / 计算机基础）设计：<br>' +
      '· 英语：单选、英译汉、补全对话、阅读理解、选词填空（全真模拟卷不含阅读理解）<br>' +
      '· 数学：极限、微分、积分、二重积分、常微分方程与级数、线性代数（含计算大题，答案支持数值与表达式判分）<br>' +
      '· 计算机：基础知识、软硬件、操作系统、网络、安全、Word、Excel、PPT、数据库、新技术（含简答与操作题）<br>' +
      '· 测验：每日任务、多套全真模拟、自选练习、错题集（自动收录 + 手动加入 + 自由组卷）<br>' +
      '6 个月计划：基础巩固（1-45天）→ 进阶提高（46-90天）→ 强化训练（91-135天）→ 冲刺模拟（136-180天）。</div>' +
      '<div class="sub">所有数据仅保存在本机浏览器（localStorage），可离线使用。</div></div>';

    root.innerHTML = html;
    $all('.intensity-btn').forEach(function (b){
      b.classList.toggle('active', +b.dataset.int === s.intensity);
      b.onclick = function (){
        $all('.intensity-btn').forEach(function (x){ x.classList.remove('active'); });
        b.classList.add('active');
      };
    });
    $('#btn-save-settings').onclick = function (){
      var exam = $('#set-exam').value;
      if (!exam){ toast('请选择考试日期'); return; }
      var int = +$('.intensity-btn.active').dataset.int;
      state.settings.examDate = exam;
      state.settings.startDate = $('#set-start').value || '';
      state.settings.intensity = int;
      state.settings.name = $('#set-name').value.trim() || '同学';
      draft = null; localStorage.removeItem(DRAFT_KEY);
      saveState();
      toast('设置已保存，今日任务已按新计划重新生成');
      switchPage('today');
    };
  }

  /* ---------- 初始化事件：科目提交按钮 ---------- */
  /* 由页面渲染时动态添加 [data-submit-section] 按钮 */
  return { switchPage: switchPage, state: state };
})();
