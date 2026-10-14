/* ============================================================
   蜀岸 · core —— 选题、判分、计划与数学求值等纯逻辑（无 DOM）
   ============================================================ */
window.EXAM = window.EXAM || {};
window.EXAM.core = (function () {

  var POOLS = {
    english: window.EXAM_ENGLISH || {},
    math: window.EXAM_MATH || {},
    computer: window.EXAM_COMPUTER || {}
  };

  /* ---------- 工具 ---------- */
  function shuffle(arr){
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--){
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }
  function rint(min, max){ return min + Math.floor(Math.random() * (max - min + 1)); }

  /* ---------- 数学表达式求值（支持 + - * / ^ () 与函数） ---------- */
  function mathEval(src){
    if (typeof src !== 'string') return null;
    var s = src
      .replace(/\s+/g, '')
      .replace(/×/g, '*').replace(/÷/g, '/')
      .replace(/π/g, 'pi').replace(/√/g, 'sqrt')
      .replace(/−/g, '-')
      .toLowerCase();
    if (!s) return null;
    /* 隐式乘法：数字后跟字母/左括号、右括号后跟数字或字母或左括号 */
    s = s.replace(/([0-9.]+)([a-z(])/g, '$1*$2')
         .replace(/\)([0-9a-z(])/g, ')*$1');
    if (s[0] === '+' || s[0] === '-') s = '0' + s;

    var i = 0;
    function err(){ throw new Error('parse'); }
    function parseAtom(){
      if (i >= s.length) err();
      var c = s[i];
      if (c === '('){ i++; var v = parseExpr(); if (s[i] !== ')') err(); i++; return v; }
      if (s.slice(i, i + 2) === 'pi'){ i += 2; return Math.PI; }
      /* 函数优先于常数 e（避免 exp 被识别为 e） */
      var fns = [
        ['sqrt', Math.sqrt], ['ln', Math.log], ['lg', function(x){ return Math.log(x) / Math.LN10; }],
        ['log', Math.log], ['sin', Math.sin], ['cos', Math.cos], ['tan', Math.tan],
        ['arcsin', Math.asin], ['arccos', Math.acos], ['arctan', Math.atan],
        ['exp', Math.exp], ['abs', Math.abs]
      ];
      for (var k = 0; k < fns.length; k++){
        if (s.slice(i, i + fns[k][0].length) === fns[k][0]){
          i += fns[k][0].length;
          var arg;
          if (s[i] === '('){ i++; arg = parseExpr(); if (s[i] !== ')') err(); i++; }
          else { arg = parseFactor(); }   /* 支持 ln2、sinx 等无括号写法 */
          return fns[k][1](arg);
        }
      }
      if (c === 'e'){ i++; return Math.E; }
      if (/[0-9.]/.test(c)){
        var st = i;
        while (i < s.length && /[0-9.]/.test(s[i])) i++;
        var n = parseFloat(s.slice(st, i));
        return n;
      }
      err();
    }
    function parseFactor(){
      var v = parseAtom();
      while (i < s.length && s[i] === '^'){ i++; v = Math.pow(v, parseFactor()); }
      return v;
    }
    function parseTerm(){
      var v = parseFactor();
      while (i < s.length && (s[i] === '*' || s[i] === '/')){
        var op = s[i]; i++;
        var r = parseFactor();
        v = op === '*' ? v * r : v / r;
      }
      return v;
    }
    function parseExpr(){
      var v = parseTerm();
      while (i < s.length && (s[i] === '+' || s[i] === '-')){
        var op = s[i]; i++;
        var r = parseTerm();
        v = op === '+' ? v + r : v - r;
      }
      return v;
    }
    try {
      var r = parseExpr();
      if (i < s.length) return null;
      if (!isFinite(r)) return null;
      return r;
    } catch (e){ return null; }
  }

  function closeTo(a, b){
    if (b === 0) return Math.abs(a) <= 1e-6;
    return Math.abs(a - b) <= Math.max(1e-6, Math.abs(b) * 0.005);
  }

  /* ---------- 题库池 ---------- */
  function mathPools(){
    var m = POOLS.math, out = [];
    ['limit', 'diff', 'integ', 'dbl', 'extra', 'linalg'].forEach(function (k){
      if (m[k]){
        ['single', 'fill', 'calc'].forEach(function (t){
          (m[k][t] || []).forEach(function (it){ out.push({ subject: 'math', type: t, item: it }); });
        });
      }
    });
    return out;
  }
  function allItems(){
    var out = [];
    ['single', 'translation', 'dialogue', 'reading', 'cloze'].forEach(function (t){
      (POOLS.english[t] || []).forEach(function (it){ out.push({ subject: 'english', type: t, item: it }); });
    });
    out = out.concat(mathPools());
    ['single', 'short', 'op'].forEach(function (t){
      (POOLS.computer[t] || []).forEach(function (it){ out.push({ subject: 'computer', type: t, item: it }); });
    });
    return out;
  }

  /* ---------- 选题 ---------- */
  function pickFrom(list, count, used, preferSection, difficultyRange){
    var cand = list.filter(function (e){
      if (used && used.has(e.item.id)) return false;
      if (preferSection && preferSection.length && preferSection.indexOf(e.item.section) === -1) return false;
      if (difficultyRange && e.item.difficulty != null){
        if (e.item.difficulty < difficultyRange[0] || e.item.difficulty > difficultyRange[1]) return false;
      }
      return true;
    });
    if (cand.length < count){
      cand = list.filter(function (e){
        if (used && used.has(e.item.id)) return false;
        if (preferSection && preferSection.length && preferSection.indexOf(e.item.section) === -1) return false;
        return true;
      });
    }
    if (cand.length < count){
      cand = list.filter(function (e){
        if (preferSection && preferSection.length && preferSection.indexOf(e.item.section) === -1) return false;
        return true;
      });
    }
    return shuffle(cand).slice(0, count);
  }

  function englishPool(type){
    return (POOLS.english[type] || []).map(function (it){ return { subject: 'english', type: type, item: it }; });
  }
  function computerPool(type){
    return (POOLS.computer[type] || []).map(function (it){ return { subject: 'computer', type: type, item: it }; });
  }
  function mathPoolBySection(secs, type){
    var out = [];
    var map = { '极限': 'limit', '微分': 'diff', '积分': 'integ', '二重积分': 'dbl', '常微分方程与级数': 'extra', '线性代数': 'linalg' };
    secs.forEach(function (s){
      var k = map[s];
      if (k && POOLS.math[k] && POOLS.math[k][type]){
        POOLS.math[k][type].forEach(function (it){ out.push({ subject: 'math', type: type, item: it }); });
      }
    });
    return out;
  }

  var EN_SECTIONS_ALL = ['时态语态', '非谓语动词', '虚拟语气', '定语从句', '名词性从句', '状语从句', '情态动词', '主谓一致与倒装', '代词与冠词', '形容词副词', '介词与连词', '强调句与It句型'];
  var MATH_SECS_ALL = ['极限', '微分', '积分', '二重积分', '常微分方程与级数', '线性代数'];
  var COM_SECS_ALL = ['计算机基础知识', '计算机软硬件系统', '操作系统', '计算机网络', '信息安全', 'Word文字处理', 'Excel电子表格', 'PowerPoint演示文稿', '数据库基础', '新技术'];

  /* ---------- 每日配额（标准强度） ---------- */
  function dailyMix(day, intensity){
    intensity = intensity || 1;
    var ph = window.EXAM_PLAN.phaseIdxOf(day);
    var dip = window.EXAM_PLAN.dayInPhase(day);
    var m = { english: {}, math: {}, computer: {} };

    function mul(n){ return Math.max(1, Math.round(n * intensity)); }

    var enCycle = day % 3; /* 0 阅读 / 1 选词 / 2 对话 */
    if (ph === 0){
      m.english = { single: mul(6), translation: mul(2), reading: 0, cloze: 0, dialogue: 0, sections: ['时态语态', '非谓语动词', '代词与冠词', '介词与连词', '形容词副词', '主谓一致与倒装'], diff: [1, 1], trDir: 'e2c' };
      m.math = dip <= 7
        ? { single: mul(3), fill: mul(3), calc: 0, sections: ['极限'], diff: [1, 1] }
        : { single: mul(3), fill: mul(2), calc: mul(1), sections: dip <= 22 ? ['极限'] : ['微分'], diff: [1, 1] };
      m.computer = { single: mul(3), short: 1, op: 0, sections: ['计算机基础知识', '计算机软硬件系统', '操作系统'], diff: [1, 1] };
    } else if (ph === 1){
      m.english = { single: mul(4), translation: mul(1), reading: enCycle === 0 ? 1 : 0, cloze: enCycle === 1 ? 1 : 0, dialogue: enCycle === 2 ? 1 : 0, sections: ['定语从句', '名词性从句', '状语从句', '情态动词'], diff: [1, 2], trDir: 'e2c' };
      m.math = { single: mul(2), fill: mul(2), calc: mul(2), sections: dip <= 22 ? ['微分'] : ['积分'], diff: [1, 2] };
      m.computer = { single: mul(3), short: 1, op: 0, sections: ['操作系统', '计算机网络', '信息安全'], diff: [1, 2] };
    } else if (ph === 2){
      m.english = { single: mul(3), translation: mul(2), reading: enCycle === 0 ? 1 : 0, cloze: enCycle === 2 ? 1 : 0, dialogue: enCycle === 1 ? 1 : 0, sections: ['虚拟语气', '强调句与It句型', '定语从句', '名词性从句', '状语从句'], diff: [2, 2], trDir: 'e2c' };
      m.math = { single: mul(2), fill: mul(2), calc: mul(2), sections: dip <= 14 ? ['积分'] : (dip <= 28 ? ['二重积分'] : ['常微分方程与级数', '线性代数']), diff: [2, 2] };
      m.computer = { single: mul(3), short: day % 2 === 1 ? 1 : 0, op: day % 2 === 0 ? 1 : 0, sections: ['Word文字处理', 'Excel电子表格', 'PowerPoint演示文稿', '数据库基础', '新技术'], diff: [2, 2] };
    } else {
      m.english = { single: mul(5), translation: mul(2), reading: enCycle === 0 ? 1 : 0, cloze: enCycle === 2 ? 1 : 0, dialogue: enCycle === 1 ? 1 : 0, sections: EN_SECTIONS_ALL, diff: [1, 3], trDir: 'e2c' };
      m.math = { single: mul(2), fill: mul(2), calc: mul(3), sections: MATH_SECS_ALL, diff: [2, 3] };
      m.computer = { single: mul(3), short: 1, op: 1, sections: COM_SECS_ALL, diff: [2, 3] };
    }
    return m;
  }

  /* ---------- 构建每日题目 ---------- */
  function buildDaily(day, intensity, used){
    var mix = dailyMix(day, intensity);
    var out = [];
    var e = mix.english;
    var trPool = englishPool('translation').filter(function (x){
      if (e.trDir === 'c2e' && x.item.direction === 'e2c') return false;
      if (e.trDir === 'e2c' && x.item.direction === 'c2e') return false;
      return true;
    });
    if (trPool.length === 0) trPool = englishPool('translation');

    pickFrom(englishPool('single'), e.single, used, e.sections, e.diff).forEach(function (x){ out.push(x); });
    pickFrom(trPool, e.translation, used, null, e.diff).forEach(function (x){ out.push(x); });
    if (e.reading) pickFrom(englishPool('reading'), 1, used, null, e.diff).forEach(function (x){ out.push(x); });
    if (e.cloze) pickFrom(englishPool('cloze'), 1, used, null, e.diff).forEach(function (x){ out.push(x); });
    if (e.dialogue) pickFrom(englishPool('dialogue'), 1, used, null, e.diff).forEach(function (x){ out.push(x); });

    var mm = mix.math;
    var secs = mm.sections && mm.sections.length ? mm.sections : MATH_SECS_ALL;
    pickFrom(mathPoolBySection(secs, 'single'), mm.single, used, null, mm.diff).forEach(function (x){ out.push(x); });
    pickFrom(mathPoolBySection(secs, 'fill'), mm.fill, used, null, mm.diff).forEach(function (x){ out.push(x); });
    pickFrom(mathPoolBySection(secs, 'calc'), mm.calc, used, null, mm.diff).forEach(function (x){ out.push(x); });

    var cm = mix.computer;
    pickFrom(computerPool('single'), cm.single, used, cm.sections, cm.diff).forEach(function (x){ out.push(x); });
    if (cm.short) pickFrom(computerPool('short'), cm.short, used, cm.sections, [1, 3]).forEach(function (x){ out.push(x); });
    if (cm.op) pickFrom(computerPool('op'), cm.op, used, cm.sections, [1, 3]).forEach(function (x){ out.push(x); });

    return out;
  }

  /* ---------- 全真模拟卷（多套，稳定可复现） ---------- */
  var MOCK_SETS = [
    { id: 0, name: '全真模拟卷（一）', desc: '基础到中等难度 · 覆盖全部题型' },
    { id: 1, name: '全真模拟卷（二）', desc: '中等难度为主 · 侧重语法与计算' },
    { id: 2, name: '全真模拟卷（三）', desc: '难度递增 · 冲刺拔高训练' }
  ];

  function byId(a, b){ return a.item.id < b.item.id ? -1 : (a.item.id > b.item.id ? 1 : 0); }

  /* 稳定抽取：按步长 setCount 从排序后的题库中取，保证同一套卷每次结果一致、不同套卷尽量不重叠 */
  function pickSet(list, count, setIndex, setCount){
    var arr = list.slice().sort(byId);
    var n = arr.length, out = [], taken = {};
    if (!n) return out;
    for (var k = 0; out.length < count && k <= n; k++){
      var idx = (setIndex + k * setCount) % n;
      if (taken[idx]) continue;
      taken[idx] = 1;
      out.push(arr[idx]);
    }
    for (var j = 0; out.length < count && j < n; j++){
      if (!taken[j]){ taken[j] = 1; out.push(arr[j]); }
    }
    return out;
  }

  function buildMock(setIndex){
    setIndex = setIndex || 0;
    var setCount = MOCK_SETS.length;
    var out = [];
    /* 英语：单选 + 翻译 + 补全对话 + 选词填空（全真模拟不含阅读理解） */
    pickSet(englishPool('single'), 20, setIndex, setCount).forEach(function (x){ out.push(x); });
    pickSet(englishPool('translation'), 6, setIndex, setCount).forEach(function (x){ out.push(x); });
    pickSet(englishPool('dialogue'), 1, setIndex, setCount).forEach(function (x){ out.push(x); });
    pickSet(englishPool('cloze'), 1, setIndex, setCount).forEach(function (x){ out.push(x); });

    var mp = mathPools();
    pickSet(mp.filter(function (x){ return x.type === 'single'; }), 5, setIndex, setCount).forEach(function (x){ out.push(x); });
    pickSet(mp.filter(function (x){ return x.type === 'fill'; }), 5, setIndex, setCount).forEach(function (x){ out.push(x); });
    pickSet(mp.filter(function (x){ return x.type === 'calc'; }), 5, setIndex, setCount).forEach(function (x){ out.push(x); });

    pickSet(computerPool('single'), 20, setIndex, setCount).forEach(function (x){ out.push(x); });
    pickSet(computerPool('short'), 4, setIndex, setCount).forEach(function (x){ out.push(x); });
    pickSet(computerPool('op'), 2, setIndex, setCount).forEach(function (x){ out.push(x); });
    return out;
  }

  /* ---------- 判分 ---------- */
  var POINTS = { single: 2, fill: 2, calc: 10, translation: 5, short: 6, op: 8 };

  function typePoints(type){
    return POINTS[type] || 2;
  }

  /* 返回 { parts: [{key, correct(boolean|null), points, max}], auto: true/false, total, max } */
  function grade(item, type, input){
    var parts = [];
    var max = typePoints(type);
    var auto = true;

    if (type === 'single'){
      var c = input && input.choice;
      parts.push({ key: item.id + '#p1', correct: c ? c === item.a : null, points: c ? (c === item.a ? max : 0) : 0, max: max });
    } else if (type === 'fill' || type === 'calc'){
      var ans = input && input.ans;
      var val = ans ? mathEval(ans) : null;
      var ok = val !== null && item.ansNum != null && closeTo(val, item.ansNum);
      var bad = val === null;
      parts.push({ key: item.id + '#p1', correct: bad ? null : ok, points: ok ? max : 0, max: max, note: bad ? '无法识别，请查看解析' : undefined });
    } else if (type === 'translation' || type === 'short' || type === 'op'){
      auto = false;
      var self = input && input.self;
      parts.push({ key: item.id + '#p1', correct: self ? (self === 'r') : null, points: self === 'r' ? max : 0, max: max });
    } else if (type === 'dialogue'){
      (item.blanks || []).forEach(function (b, idx){
        var v = input && input['b' + b.n];
        var pm = 2;
        parts.push({ key: item.id + '#p' + (idx + 1), correct: v ? v === b.a : null, points: v ? (v === b.a ? pm : 0) : 0, max: pm });
      });
    } else if (type === 'reading'){
      (item.questions || []).forEach(function (q, idx){
        var v = input && input['q' + (idx + 1)];
        var pm = 2;
        parts.push({ key: item.id + '#p' + (idx + 1), correct: v ? v === q.a : null, points: v ? (v === q.a ? pm : 0) : 0, max: pm });
      });
    } else if (type === 'cloze'){
      (item.blanks || []).forEach(function (b, idx){
        var v = input && input['b' + b.n];
        var pm = 2;
        parts.push({ key: item.id + '#p' + (idx + 1), correct: v ? v === b.a : null, points: v ? (v === b.a ? pm : 0) : 0, max: pm });
      });
    } else {
      parts.push({ key: item.id + '#p1', correct: null, points: 0, max: max });
    }

    var total = 0, mx = 0;
    parts.forEach(function (p){ total += p.points; mx += p.max; });
    return { parts: parts, auto: auto, total: total, max: mx };
  }

  /* ---------- 题目 id 注册表（用于还原历史题目） ---------- */
  function buildRegistry(){
    var reg = {};
    allItems().forEach(function (e){
      reg[e.item.id] = { subject: e.subject, type: e.type, item: e.item };
    });
    return reg;
  }

  return {
    POOLS: POOLS,
    mathEval: mathEval,
    closeTo: closeTo,
    dailyMix: dailyMix,
    buildDaily: buildDaily,
    buildMock: buildMock,
    MOCK_SETS: MOCK_SETS,
    grade: grade,
    typePoints: typePoints,
    buildRegistry: buildRegistry,
    allItems: allItems,
    EN_SECTIONS_ALL: EN_SECTIONS_ALL,
    MATH_SECS_ALL: MATH_SECS_ALL,
    COM_SECS_ALL: COM_SECS_ALL
  };
})();
