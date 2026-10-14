/* ============================================================
   蜀岸 · 2027四川专升本备考 —— 6个月备考计划
   结构：4 大阶段 × 28 周 = 180 天（默认 2027-04-17 考试，可设置）
   ============================================================ */
window.EXAM_PLAN = (function () {

  function pad(n){ return n < 10 ? '0' + n : '' + n; }
  function parseISO(s){ var p = String(s).split('-'); return new Date(+p[0], +p[1] - 1, +p[2]); }
  function toISO(d){ return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); }
  function addDaysISO(iso, n){ var d = parseISO(iso); d.setDate(d.getDate() + n); return toISO(d); }
  function diffDays(aISO, bISO){ return Math.round((parseISO(bISO) - parseISO(aISO)) / 86400000); }
  function todayISO(){ return toISO(new Date()); }

  var phases = [
    {
      id: 'p1', name: '基础巩固期', days: [1, 45],
      goal: '夯实三科基础：数学吃透极限与微分基础，英语过完核心语法与高频词汇，计算机建立基本概念体系。',
      focus: {
        math: ['函数与极限', '重要极限与等价无穷小', '连续性', '导数与微分', '微分中值定理与洛必达'],
        english: ['核心语法（时态语态、非谓语、从句入门）', '高频词汇', '简单句翻译', '单选专项'],
        computer: ['计算机基础知识', '数制与编码', '软硬件系统', '操作系统概述', 'Word 基础']
      }
    },
    {
      id: 'p2', name: '进阶提高期', days: [46, 90],
      goal: '数学进入积分学，英语全面练习阅读与选词填空，计算机进入网络、安全与 Excel 实操。',
      focus: {
        math: ['导数应用（单调极值凹凸）', '不定积分（换元/分部）', '定积分与变上限积分', '反常积分'],
        english: ['定语/名词性/状语从句', '阅读理解精练', '选词填空精练', '情态动词'],
        computer: ['计算机网络', '信息安全', 'Excel 公式与函数', '数据库基础']
      }
    },
    {
      id: 'p3', name: '强化训练期', days: [91, 135],
      goal: '数学攻克二重积分与微分方程，英语进入补全对话与翻译进阶，计算机强化 Office 三大件操作。',
      focus: {
        math: ['定积分应用', '二重积分（直角/极坐标）', '常微分方程', '级数', '线性代数（行列式/矩阵）'],
        english: ['补全对话', '翻译进阶（从句/非谓语）', '阅读提速', '写作思路'],
        computer: ['Word 进阶（页眉目录/邮件合并）', 'Excel 高级（透视表/图表）', 'PowerPoint 全套', '新技术（AI/大数据/云计算）']
      }
    },
    {
      id: 'p4', name: '冲刺模拟期', days: [136, 180],
      goal: '全题型每日模拟 + 周末全真套卷，错题复盘、查漏补缺、回归教材，调整状态迎接考试。',
      focus: {
        math: ['综合计算大题限时训练', '线性代数综合', '全真套卷', '错题复盘'],
        english: ['全题型套卷', '限时阅读', '作文模板演练'],
        computer: ['全真套卷', '操作题综合训练', '考前速记（网络/安全/新技术）']
      }
    }
  ];

  var weeks = [
    { w: 1,  days: [1, 7],   title: '开篇 · 函数与极限',       math: '函数概念、复合函数、基本初等函数', english: '词汇打卡启动；时态语态（一般时/进行时）', computer: '计算机发展史、计算机特点与分类、数制与编码' },
    { w: 2,  days: [8, 14],  title: '极限运算（一）',           math: '极限定义、四则运算、两个重要极限', english: '非谓语动词（不定式/动名词）', computer: '计算机软硬件系统组成、冯·诺依曼结构' },
    { w: 3,  days: [15, 21], title: '极限运算（二）与连续',     math: '等价无穷小、洛必达法则入门、连续性、间断点', english: '代词与冠词、介词与连词', computer: '操作系统概述、进程与线程' },
    { w: 4,  days: [22, 28], title: '导数与微分',               math: '导数定义与几何意义、基本求导公式、微分', english: '形容词副词（比较级最高级）、主谓一致', computer: '存储管理、文件与磁盘管理' },
    { w: 5,  days: [29, 35], title: '求导法则',                 math: '复合函数/隐函数/参数方程求导、高阶导数', english: '倒装句、强调句', computer: 'Word 基础（排版/样式/查找替换）' },
    { w: 6,  days: [36, 42], title: '中值定理与综合',           math: '罗尔/拉格朗日中值定理、导数综合应用', english: '基础翻译（简单句、固定搭配）', computer: '阶段自查 + 错题复盘' },
    { w: 7,  days: [43, 45], title: '阶段小结',                 math: '极限与微分小测 + 复盘', english: '语法综合单选', computer: '基础知识综合练习' },

    { w: 8,  days: [46, 52], title: '导数应用（一）',           math: '单调性与极值、最值问题', english: '定语从句（关系代词/关系副词）', computer: '计算机网络概述、OSI 七层模型' },
    { w: 9,  days: [53, 59], title: '导数应用（二）',           math: '凹凸性、拐点、渐近线', english: '名词性从句（主语/宾语/表语/同位语）', computer: 'TCP/IP 协议、IP 地址与子网' },
    { w: 10, days: [60, 66], title: '不定积分（一）',           math: '原函数与不定积分、第一类换元法', english: '状语从句（时间/条件/原因/让步）', computer: '信息安全基础、计算机病毒与防范' },
    { w: 11, days: [67, 73], title: '不定积分（二）',           math: '第二类换元法、分部积分法、有理函数积分', english: '情态动词、综合语法回顾', computer: 'Excel 基础（单元格/工作表/公式）' },
    { w: 12, days: [74, 80], title: '定积分',                   math: '定积分定义与性质、牛顿-莱布尼茨公式', english: '阅读理解精练（细节题/主旨题）', computer: 'Excel 函数（SUM/IF/VLOOKUP）、数据管理' },
    { w: 13, days: [81, 87], title: '变上限积分与反常积分',     math: '变上限积分求导、反常积分', english: '选词填空精练（词性与逻辑）', computer: '数据库基础（概念模型、SQL 入门）' },
    { w: 14, days: [88, 90], title: '阶段小结',                 math: '微分与积分小测 + 复盘', english: '阅读 + 选词综合', computer: '网络与数据库综合练习' },

    { w: 15, days: [91, 97], title: '定积分应用',               math: '平面图形面积、旋转体体积', english: '补全对话（购物/问路/电话场景）', computer: 'PowerPoint 基础（新建/版式/幻灯片）' },
    { w: 16, days: [98, 104], title: '二重积分（一）',          math: '二重积分概念、直角坐标累次积分', english: '翻译进阶（定语从句/非谓语译法）', computer: 'PPT 美化（母版/动画/放映设置）' },
    { w: 17, days: [105, 111], title: '二重积分（二）',         math: '交换积分次序、利用对称性', english: '阅读提速与长难句分析', computer: 'Word 进阶（页眉页脚/目录/邮件合并）' },
    { w: 18, days: [112, 118], title: '极坐标与二重积分应用',   math: '极坐标变换、二重积分求面积体积', english: '英语综合训练（单选+阅读+翻译）', computer: 'Excel 高级（数据透视表/图表/条件格式）' },
    { w: 19, days: [119, 125], title: '常微分方程',             math: '可分离变量、一阶线性、二阶常系数齐次', english: '写作思路与常用模板', computer: '新技术（人工智能/大数据/云计算/物联网）' },
    { w: 20, days: [126, 132], title: '级数与线性代数',         math: '级数敛散性、幂级数收敛半径；行列式与矩阵运算', english: '模拟小测（全题型）', computer: 'Office 综合操作训练' },
    { w: 21, days: [133, 135], title: '阶段小结',               math: '二重积分、微分方程与线性代数小测', english: '补全对话 + 翻译综合', computer: '数据库与新技术综合' },

    { w: 22, days: [136, 142], title: '全面回顾',               math: '极限/微分/积分错题复盘', english: '语法与词汇查漏补缺', computer: '基础概念快速回顾' },
    { w: 23, days: [143, 149], title: '全真模拟（一）',         math: '数学套卷限时训练', english: '英语套卷限时训练', computer: '计算机套卷限时训练' },
    { w: 24, days: [150, 156], title: '全真模拟（二）',         math: '计算大题专项 + 套卷', english: '阅读限时 + 翻译 + 作文', computer: '操作题专项 + 套卷' },
    { w: 25, days: [157, 163], title: '全真模拟（三）',         math: '套卷 + 薄弱点定向刷题', english: '套卷 + 易错语法', computer: '套卷 + 易错概念' },
    { w: 26, days: [164, 170], title: '查漏补缺',               math: '二重积分/级数/线性代数强化', english: '选词填空 + 补全对话冲刺', computer: '网络/安全/新技术速记' },
    { w: 27, days: [171, 177], title: '全真模拟（四）',         math: '套卷 + 考前心态调整', english: '套卷 + 作文模板演练', computer: '套卷 + 操作题复盘' },
    { w: 28, days: [178, 180], title: '考前冲刺',               math: '回归教材、浏览错题本', english: '浏览高频词汇与模板', computer: '考前速记清单' }
  ];

  function phaseOf(day){
    for (var i = 0; i < phases.length; i++){
      if (day >= phases[i].days[0] && day <= phases[i].days[1]) return phases[i];
    }
    return phases[phases.length - 1];
  }
  function phaseIdxOf(day){
    for (var i = 0; i < phases.length; i++){
      if (day >= phases[i].days[0] && day <= phases[i].days[1]) return i;
    }
    return phases.length - 1;
  }
  function weekOf(day){
    for (var i = 0; i < weeks.length; i++){
      if (day >= weeks[i].days[0] && day <= weeks[i].days[1]) return weeks[i];
    }
    return weeks[weeks.length - 1];
  }
  function dayInPhase(day){ return day - phaseOf(day).days[0] + 1; }

  /* 日期换算：day(1..180)，examISO 为考试日期 */
  function dateOf(day, examISO){ return addDaysISO(examISO, day - 180); }
  function dayIndexOf(dateISO, examISO){ return 180 - diffDays(dateISO, examISO); }

  return {
    totalDays: 180,
    phases: phases,
    weeks: weeks,
    phaseOf: phaseOf,
    phaseIdxOf: phaseIdxOf,
    weekOf: weekOf,
    dayInPhase: dayInPhase,
    dateOf: dateOf,
    dayIndexOf: dayIndexOf,
    todayISO: todayISO,
    addDaysISO: addDaysISO,
    diffDays: diffDays,
    parseISO: parseISO,
    toISO: toISO
  };
})();
