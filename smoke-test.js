/* ============================================================
   蜀岸 · 集成冒烟测试（Node 环境运行：node smoke-test.js）
   验证：数据文件结构 / id 唯一性 / 选题 / 判分 / 数学求值 / 计划
   ============================================================ */
global.window = {};
require('./js/data/english.js');
require('./js/data/math.js');
require('./js/data/computer.js');
require('./js/plan.js');
require('./js/core.js');

var CORE = window.EXAM.core;
var PLAN = window.EXAM_PLAN;
var errors = [];

function check(cond, msg){ if (!cond) errors.push(msg); }
function log(msg){ console.log(msg); }

/* ---------- 1. 数据结构校验 ---------- */
var idSet = {};
function regId(id, where){ if (idSet[id]) errors.push('重复 id: ' + id + ' (' + where + ')'); idSet[id] = 1; }

var EN = window.EXAM_ENGLISH || {};
var MA = window.EXAM_MATH || {};
var CO = window.EXAM_COMPUTER || {};

var enCounts = { single: 0, translation: 0, dialogue: 0, reading: 0, cloze: 0 };
['single', 'translation', 'dialogue', 'reading', 'cloze'].forEach(function (t){
  (EN[t] || []).forEach(function (it){
    enCounts[t]++;
    regId(it.id, 'english.' + t);
    check(typeof it.knowledge === 'string' && it.knowledge.length >= 4, 'en.' + t + ' 缺知识点: ' + it.id);
    check([1, 2, 3].indexOf(it.difficulty) >= 0, 'en.' + t + ' 难度非法: ' + it.id);
    if (t === 'single'){
      check(Array.isArray(it.options) && it.options.length === 4, 'en.single 选项数≠4: ' + it.id);
      check(/^[A-D]$/.test(it.a || ''), 'en.single 答案字母非法: ' + it.id);
      check(typeof it.q === 'string' && it.q.length > 3, 'en.single 题干过短: ' + it.id);
    } else if (t === 'translation'){
      check(it.direction === 'e2c', 'en.translation 必须为英译汉(e2c): ' + it.id);
      check(typeof it.zh === 'string' && typeof it.en === 'string', 'en.translation 缺 zh/en: ' + it.id);
    } else if (t === 'dialogue'){
      check(Array.isArray(it.lines) && it.lines.length >= 4, 'en.dialogue lines 过少: ' + it.id);
      check(Array.isArray(it.blanks) && it.blanks.length === 5, 'en.dialogue blanks≠5: ' + it.id);
      it.blanks.forEach(function (b){ check(Array.isArray(b.options) && b.options.length === 4 && /^[A-D]$/.test(b.a || ''), 'en.dialogue 空选项非法: ' + it.id); });
      check(typeof it.scene === 'string' && it.scene.length > 1, 'en.dialogue 缺 scene: ' + it.id);
    } else if (t === 'reading'){
      check(Array.isArray(it.questions) && it.questions.length >= 4, 'en.reading questions<4: ' + it.id);
      check(typeof it.passage === 'string' && it.passage.length > 80, 'en.reading 短文过短: ' + it.id);
      it.questions.forEach(function (q){ check(Array.isArray(q.options) && q.options.length === 4 && /^[A-D]$/.test(q.a || ''), 'en.reading 选项非法: ' + it.id); });
    } else if (t === 'cloze'){
      check(Array.isArray(it.blanks) && it.blanks.length === 10, 'en.cloze blanks≠10: ' + it.id);
      check(typeof it.passage === 'string' && it.passage.length > 80, 'en.cloze 短文过短: ' + it.id);
      it.blanks.forEach(function (b){ check(Array.isArray(b.options) && b.options.length === 4 && /^[A-D]$/.test(b.a || ''), 'en.cloze 空选项非法: ' + it.id); });
    }
  });
});

var mathCounts = { single: 0, fill: 0, calc: 0 };
var mathBySec = {};
['limit', 'diff', 'integ', 'dbl', 'extra', 'linalg'].forEach(function (k){
  ['single', 'fill', 'calc'].forEach(function (t){
    (MA[k][t] || []).forEach(function (x){
      mathCounts[t]++;
      var key = k + '.' + t;
      mathBySec[key] = (mathBySec[key] || 0) + 1;
      regId(x.id, 'math.' + key);
      check(typeof x.knowledge === 'string' && x.knowledge.length >= 4, 'math 缺知识点: ' + x.id);
      check([1, 2, 3].indexOf(x.difficulty) >= 0, 'math 难度非法: ' + x.id);
      check(typeof x.q === 'string' && x.q.length > 3, 'math 题干过短: ' + x.id);
      if (t === 'single'){
        check(Array.isArray(x.options) && x.options.length === 4 && /^[A-D]$/.test(x.a || ''), 'math.single 选项非法: ' + x.id);
      } else {
        check(x.a != null && String(x.a).length > 0, 'math ' + t + ' 缺答案 a: ' + x.id);
        check(x.ansNum === null || typeof x.ansNum === 'number', 'math ' + t + ' ansNum 非法: ' + x.id + ' -> ' + x.ansNum);
      }
      check(typeof x.ex === 'string' && x.ex.length >= 10, 'math ' + t + ' 解析过短: ' + x.id);
    });
  });
});

var comCounts = { single: 0, short: 0, op: 0 };
['single', 'short', 'op'].forEach(function (t){
  (CO[t] || []).forEach(function (it){
    comCounts[t]++;
    regId(it.id, 'computer.' + t);
    check(typeof it.knowledge === 'string' && it.knowledge.length >= 4, 'com.' + t + ' 缺知识点: ' + it.id);
    check([1, 2, 3].indexOf(it.difficulty) >= 0, 'com.' + t + ' 难度非法: ' + it.id);
    check(typeof it.q === 'string' && it.q.length > 3, 'com.' + t + ' 题干过短: ' + it.id);
    check(typeof it.section === 'string' && it.section.length > 1, 'com.' + t + ' 缺 section: ' + it.id);
    if (t === 'single'){
      check(Array.isArray(it.options) && it.options.length === 4 && /^[A-D]$/.test(it.a || ''), 'com.single 选项非法: ' + it.id);
      check(typeof it.ex === 'string' && it.ex.length >= 5, 'com.single 解析过短: ' + it.id);
    } else {
      check(typeof it.ref === 'string' && it.ref.length >= 10, 'com.' + t + ' ref 过短: ' + it.id);
    }
  });
});

log('英语：单选 ' + enCounts.single + ' / 翻译 ' + enCounts.translation + ' / 对话 ' + enCounts.dialogue + ' / 阅读 ' + enCounts.reading + ' / 选词 ' + enCounts.cloze);
log('数学：单选 ' + mathCounts.single + ' / 填空 ' + mathCounts.fill + ' / 计算 ' + mathCounts.calc + '  ' + JSON.stringify(mathBySec));
log('计算机：单选 ' + comCounts.single + ' / 简答 ' + comCounts.short + ' / 操作 ' + comCounts.op);

check(enCounts.single >= 40, '英语单选 < 40');
check(enCounts.translation >= 20, '英语翻译 < 20');
check(enCounts.dialogue >= 5, '英语对话 < 5');
check(enCounts.reading >= 4, '英语阅读 < 4');
check(enCounts.cloze >= 4, '英语选词 < 4');
check(mathCounts.single >= 48 && mathCounts.fill >= 40 && mathCounts.calc >= 44, '数学题量不足');
check(comCounts.single >= 70 && comCounts.short >= 16 && comCounts.op >= 12, '计算机题量不足');

/* ---------- 2. 数学表达式求值 ---------- */
function approx(a, b){ return Math.abs(a - b) < 1e-9; }
check(approx(CORE.mathEval('1/3'), 1 / 3), 'mathEval 1/3');
check(approx(CORE.mathEval('2*3+4'), 10), 'mathEval 2*3+4');
check(approx(CORE.mathEval('e^2'), Math.exp(2)), 'mathEval e^2');
check(approx(CORE.mathEval('ln(2)'), Math.log(2)), 'mathEval ln(2)');
check(approx(CORE.mathEval('pi/4'), Math.PI / 4), 'mathEval pi/4');
check(approx(CORE.mathEval('sqrt(9)'), 3), 'mathEval sqrt(9)');
check(approx(CORE.mathEval('2π'), 2 * Math.PI), 'mathEval 2π');
check(approx(CORE.mathEval('3sin(0)'), 0), 'mathEval 3sin(0)');
check(approx(CORE.mathEval('2(3+1)'), 8), 'mathEval 2(3+1)');
check(CORE.mathEval('abc') === null, 'mathEval abc 应拒绝');
check(CORE.mathEval('') === null, 'mathEval 空串应拒绝');
check(approx(CORE.mathEval('-2+5'), 3), 'mathEval -2+5');
check(approx(CORE.mathEval('2^3^2'), 512), 'mathEval 2^3^2 右结合');
check(approx(CORE.mathEval('(1+2)/3'), 1), 'mathEval (1+2)/3');

/* ---------- 3. 计划 ---------- */
var exam = '2027-04-17';
var d1 = PLAN.dateOf(1, exam), d180 = PLAN.dateOf(180, exam);
log('计划起止：' + d1 + ' ~ ' + d180);
check(d180 === exam, '第180天应等于考试日期');
check(PLAN.dayIndexOf(d1, exam) === 1 && PLAN.dayIndexOf(d180, exam) === 180, '日期换算');
check(PLAN.diffDays(d1, d180) === 179, '计划总跨度 179 天');
check(PLAN.phaseOf(1).id === 'p1' && PLAN.phaseOf(45).id === 'p1', '阶段1边界');
check(PLAN.phaseOf(46).id === 'p2' && PLAN.phaseOf(90).id === 'p2', '阶段2边界');
check(PLAN.phaseOf(91).id === 'p3' && PLAN.phaseOf(135).id === 'p3', '阶段3边界');
check(PLAN.phaseOf(136).id === 'p4' && PLAN.phaseOf(180).id === 'p4', '阶段4边界');
check(PLAN.weekOf(1).w === 1 && PLAN.weekOf(180).w === 28, '周次边界');
check(PLAN.dayIndexOf(d1, exam) === 1 && PLAN.dayIndexOf(d180, exam) === 180, '日期换算');

/* ---------- 4. 选题 ---------- */
var used = new Set();
for (var day = 1; day <= 180; day += 7){
  var items = CORE.buildDaily(day, 1, used);
  var mix = CORE.dailyMix(day, 1);
  var bySub = { english: 0, math: 0, computer: 0 };
  items.forEach(function (e){ bySub[e.subject]++; });
  check(bySub.english >= 4 && bySub.math >= 4 && bySub.computer >= 3, '第' + day + '天题量不足: ' + JSON.stringify(bySub));
  var allUsed = new Set(used);
  items.forEach(function (e){ allUsed.add(e.item.id); });
  used = allUsed;
}
log('180 天抽题测试通过');

var mock = CORE.buildMock(0);
var mockSub = { english: 0, math: 0, computer: 0 };
mock.forEach(function (e){ mockSub[e.subject]++; });
log('模拟卷（一）：' + JSON.stringify(mockSub));
check(mockSub.english >= 25 && mockSub.math >= 12 && mockSub.computer >= 22, '模拟卷题量不足');

/* ---------- 4b. 多套全真模拟（英语不含阅读理解、稳定可复现） ---------- */
check((CORE.MOCK_SETS || []).length >= 3, '全真模拟套数应 ≥ 3');
(CORE.MOCK_SETS || []).forEach(function (s){
  var paper = CORE.buildMock(s.id);
  var sub = { english: 0, math: 0, computer: 0 };
  var hasReading = false;
  paper.forEach(function (e){
    sub[e.subject]++;
    if (e.subject === 'english' && e.type === 'reading') hasReading = true;
  });
  log('模拟卷 ' + (s.id + 1) + '：' + JSON.stringify(sub));
  check(sub.english >= 25 && sub.math >= 12 && sub.computer >= 22, '模拟卷题量不足: ' + s.name);
  check(!hasReading, '全真模拟英语不应包含阅读理解: ' + s.name);
});
var m0a = CORE.buildMock(0).map(function (e){ return e.item.id; }).join(',');
var m0b = CORE.buildMock(0).map(function (e){ return e.item.id; }).join(',');
check(m0a !== '' && m0a === m0b, '同一套模拟卷应可稳定复现');

/* ---------- 5. 判分 ---------- */
var all = CORE.allItems();
var single = all.find(function (e){ return e.type === 'single' && e.item.a; });
if (single){
  var g1 = CORE.grade(single.item, 'single', { choice: single.item.a });
  var g2 = CORE.grade(single.item, 'single', { choice: single.item.a === 'A' ? 'B' : 'A' });
  check(g1.parts[0].correct === true && g1.total === g1.max, '单选判分(对)');
  check(g2.parts[0].correct === false && g2.total === 0, '单选判分(错)');
}
var calcItem = null;
all.forEach(function (e){ if (e.type === 'calc' && e.item.ansNum != null && !calcItem) calcItem = e; });
if (calcItem){
  var g3 = CORE.grade(calcItem.item, 'calc', { ans: String(calcItem.item.ansNum) });
  check(g3.parts[0].correct === true, '计算题判分(数值精确): ' + calcItem.item.id);
  var g4 = CORE.grade(calcItem.item, 'calc', { ans: '999' });
  check(g4.parts[0].correct === false, '计算题判分(错误)');
}
var trans = all.find(function (e){ return e.type === 'translation'; });
if (trans){
  var g5 = CORE.grade(trans.item, 'translation', { self: 'r' });
  check(g5.parts[0].correct === true && !g5.auto, '翻译自评');
}
var reading = all.find(function (e){ return e.type === 'reading'; });
if (reading){
  var inp = {};
  reading.item.questions.forEach(function (q, i){ inp['q' + (i + 1)] = q.a; });
  var g6 = CORE.grade(reading.item, 'reading', inp);
  check(g6.parts.length === reading.item.questions.length && g6.total === g6.max, '阅读判分');
}
var cloze = all.find(function (e){ return e.type === 'cloze'; });
if (cloze){
  var inp2 = {};
  cloze.item.blanks.forEach(function (b){ inp2['b' + b.n] = b.a; });
  var g7 = CORE.grade(cloze.item, 'cloze', inp2);
  check(g7.parts.length === 10 && g7.total === g7.max, '选词判分');
}

/* ---------- 6. 注册表 ---------- */
var reg = CORE.buildRegistry();
check(Object.keys(reg).length === Object.keys(idSet).length, '注册表数量一致');

/* ---------- 汇总 ---------- */
if (errors.length){
  console.log('\n❌ 发现 ' + errors.length + ' 个问题：');
  errors.slice(0, 40).forEach(function (e){ console.log('  - ' + e); });
  process.exit(1);
} else {
  console.log('\n✅ 全部冒烟测试通过（题目 id 总数 ' + Object.keys(idSet).length + '）');
}
