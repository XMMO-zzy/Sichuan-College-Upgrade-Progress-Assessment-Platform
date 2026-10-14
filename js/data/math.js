window.EXAM_MATH = {
  limit:  { single: [], fill: [], calc: [] },   /* 极限与连续 */
  diff:   { single: [], fill: [], calc: [] },   /* 一元函数微分学 */
  integ:  { single: [], fill: [], calc: [] },   /* 一元函数积分学 */
  dbl:    { single: [], fill: [], calc: [] },   /* 二重积分 */
  extra:  { single: [], fill: [], calc: [] },   /* 常微分方程与级数 */
  linalg: { single: [], fill: [], calc: [] }    /* 线性代数 */
};

/* ==================== 极限与连续 ==================== */

window.EXAM_MATH.limit.single = [
  {
    id: "m_limit_s01",
    section: "极限",
    knowledge: "考察：两个重要极限之 lim(x→0) sinx/x = 1",
    difficulty: 1,
    q: "求 lim(x→0) (sinx)/x",
    options: ["A. 0", "B. 1", "C. ∞", "D. 不存在"],
    a: "B",
    ansNum: 1,
    ex: "由第一个重要极限：lim(x→0) sinx/x = 1，直接得结果 1，故选 B。"
  },
  {
    id: "m_limit_s02",
    section: "极限",
    knowledge: "考察：两个重要极限之 lim(x→∞) (1+1/x)^x = e",
    difficulty: 1,
    q: "求 lim(x→∞) (1 + 1/x)^x",
    options: ["A. 1", "B. e", "C. ∞", "D. 0"],
    a: "B",
    ansNum: 2.718281828459045,
    ex: "由第二个重要极限：lim(x→∞) (1+1/x)^x = e，故选 B。"
  },
  {
    id: "m_limit_s03",
    section: "极限",
    knowledge: "考察：等价无穷小替换 sinx ~ x",
    difficulty: 1,
    q: "当 x→0 时，下列无穷小中与 x 等价的是（ ）",
    options: ["A. sinx", "B. 1-cosx", "C. x^2", "D. sin2x"],
    a: "A",
    ansNum: null,
    ex: "x→0 时 sinx ~ x；1-cosx ~ x²/2；x² ~ x²；sin2x ~ 2x。只有 sinx 与 x 等价，故选 A。"
  },
  {
    id: "m_limit_s04",
    section: "极限",
    knowledge: "考察：间断点的类型（可去间断点）",
    difficulty: 2,
    q: "函数 f(x) = (x²-1)/(x-1) 在 x = 1 处为（ ）",
    options: ["A. 连续点", "B. 可去间断点", "C. 跳跃间断点", "D. 无穷间断点"],
    a: "B",
    ansNum: null,
    ex: "f(x) 在 x = 1 处无定义，但 lim(x→1) (x²-1)/(x-1) = lim(x→1) (x+1) = 2 存在，故 x = 1 为可去间断点，选 B。"
  },
  {
    id: "m_limit_s05",
    section: "极限",
    knowledge: "考察：等价无穷小 1-cosx ~ x²/2",
    difficulty: 1,
    q: "求 lim(x→0) (1-cosx)/x²",
    options: ["A. 0", "B. 1/2", "C. 1", "D. 2"],
    a: "B",
    ansNum: 0.5,
    ex: "x→0 时 1-cosx ~ x²/2，故原式 = (x²/2)/x² = 1/2，选 B。"
  },
  {
    id: "m_limit_s06",
    section: "极限",
    knowledge: "考察：∞/∞ 型极限，分子分母同除以最高次幂（抓大头）",
    difficulty: 1,
    q: "求 lim(x→∞) (2x² + 1)/(3x² - x)",
    options: ["A. 2/3", "B. ∞", "C. 0", "D. 1"],
    a: "A",
    ansNum: 0.6666666666666666,
    ex: "分子分母同除以 x²：lim(x→∞) (2 + 1/x²)/(3 - 1/x) = 2/3，选 A。"
  }
];

window.EXAM_MATH.limit.fill = [
  {
    id: "m_limit_f01",
    section: "极限",
    knowledge: "考察：等价无穷小 sin(3x) ~ 3x",
    difficulty: 1,
    q: "求 lim(x→0) sin(3x)/x",
    a: "3",
    ansNum: 3,
    ex: "x→0 时 sin(3x) ~ 3x，故原式 = lim(x→0) 3x/x = 3。"
  },
  {
    id: "m_limit_f02",
    section: "极限",
    knowledge: "考察：重要极限的推广 lim(x→∞) (1 + k/x)^x = e^k",
    difficulty: 1,
    q: "求 lim(x→∞) (1 + 2/x)^x",
    a: "e^2",
    ansNum: 7.38905609893065,
    ex: "令 t = x/2，则原式 = lim(t→∞) [(1 + 1/t)^t]² = e²。"
  },
  {
    id: "m_limit_f03",
    section: "极限",
    knowledge: "考察：等价无穷小 e^x - 1 ~ x",
    difficulty: 1,
    q: "求 lim(x→0) (e^x - 1)/x",
    a: "1",
    ansNum: 1,
    ex: "x→0 时 e^x - 1 ~ x，故原式 = 1。"
  },
  {
    id: "m_limit_f04",
    section: "极限",
    knowledge: "考察：函数连续的定义与可去间断点的补充定义",
    difficulty: 2,
    q: "设 f(x) = (x²-4)/(x-2)（x≠2），f(2) = a。若 f(x) 在 x = 2 处连续，则 a = ?",
    a: "4",
    ansNum: 4,
    ex: "lim(x→2) (x²-4)/(x-2) = lim(x→2) (x+2) = 4。连续要求 f(2) = lim(x→2) f(x)，故 a = 4。"
  },
  {
    id: "m_limit_f05",
    section: "极限",
    knowledge: "考察：等价无穷小 ln(1+x) ~ x",
    difficulty: 1,
    q: "求 lim(x→0) ln(1+x)/x",
    a: "1",
    ansNum: 1,
    ex: "x→0 时 ln(1+x) ~ x，故原式 = 1。"
  }
];

window.EXAM_MATH.limit.calc = [
  {
    id: "m_limit_c01",
    section: "极限",
    knowledge: "考察：洛必达法则（0/0 型，连续多次求导）",
    difficulty: 2,
    q: "求 lim(x→0) (sinx - x)/x³",
    a: "-1/6",
    ansNum: -0.16666666666666666,
    ex: "0/0 型，用洛必达法则：\n原式 = lim(x→0) (cosx - 1)/(3x²) = lim(x→0) (-sinx)/(6x) = lim(x→0) (-cosx)/6 = -1/6。\n（也可用泰勒展开 sinx = x - x³/6 + o(x³) 直接得结果）"
  },
  {
    id: "m_limit_c02",
    section: "极限",
    knowledge: "考察：洛必达法则（0/0 型，两次求导）",
    difficulty: 2,
    q: "求 lim(x→0) (e^x - 1 - x)/x²",
    a: "1/2",
    ansNum: 0.5,
    ex: "0/0 型，用洛必达法则：\n原式 = lim(x→0) (e^x - 1)/(2x) = lim(x→0) e^x/2 = 1/2。"
  },
  {
    id: "m_limit_c03",
    section: "极限",
    knowledge: "考察：0·∞ 型极限，化为 ∞/∞ 型后用洛必达法则",
    difficulty: 2,
    q: "求 lim(x→0+) x·lnx",
    a: "0",
    ansNum: 0,
    ex: "0·∞ 型，改写为 ∞/∞ 型：\n原式 = lim(x→0+) lnx/(1/x)，用洛必达法则：\n= lim(x→0+) (1/x)/(-1/x²) = lim(x→0+) (-x) = 0。"
  },
  {
    id: "m_limit_c04",
    section: "极限",
    knowledge: "考察：∞/∞ 型有理函数极限，分子分母同除以最高次幂",
    difficulty: 1,
    q: "求 lim(x→∞) (x² + 2x + 1)/(3x² - 4x + 2)",
    a: "1/3",
    ansNum: 0.3333333333333333,
    ex: "分子分母同除以 x²：\n原式 = lim(x→∞) (1 + 2/x + 1/x²)/(3 - 4/x + 2/x²) = 1/3。"
  },
  {
    id: "m_limit_c05",
    section: "极限",
    knowledge: "考察：0/0 型极限，分子有理化",
    difficulty: 1,
    q: "求 lim(x→0) (√(1+x) - 1)/x",
    a: "1/2",
    ansNum: 0.5,
    ex: "分子有理化：\n原式 = lim(x→0) ((1+x)-1)/(x·(√(1+x)+1)) = lim(x→0) 1/(√(1+x)+1) = 1/2。"
  },
  {
    id: "m_limit_c06",
    section: "极限",
    knowledge: "考察：夹逼准则",
    difficulty: 1,
    q: "求 lim(x→∞) (sinx)/x",
    a: "0",
    ansNum: 0,
    ex: "对任意 x>0：-1/x ≤ (sinx)/x ≤ 1/x，而 lim(x→∞) (±1/x) = 0，由夹逼准则得原式 = 0。"
  }
];

/* ==================== 一元函数微分学 ==================== */

window.EXAM_MATH.diff.single = [
  {
    id: "m_diff_s01",
    section: "微分",
    knowledge: "考察：导数的定义（差商极限）",
    difficulty: 2,
    q: "设 f(x) 在 x₀ 处可导，则 lim(h→0) [f(x₀+h) - f(x₀-h)]/(2h) =（ ）",
    options: ["A. f'(x₀)", "B. 2f'(x₀)", "C. 0", "D. 不存在"],
    a: "A",
    ansNum: null,
    ex: "由导数定义：f(x₀+h) = f(x₀) + f'(x₀)h + o(h)，f(x₀-h) = f(x₀) - f'(x₀)h + o(h)，代入分子得 2f'(x₀)h + o(h)，除以 2h 后取极限得 f'(x₀)，选 A。"
  },
  {
    id: "m_diff_s02",
    section: "微分",
    knowledge: "考察：基本求导公式（幂函数）",
    difficulty: 1,
    q: "设 f(x) = x²，则 f'(2) =（ ）",
    options: ["A. 2", "B. 4", "C. 0", "D. 8"],
    a: "B",
    ansNum: 4,
    ex: "f'(x) = 2x，故 f'(2) = 4，选 B。"
  },
  {
    id: "m_diff_s03",
    section: "微分",
    knowledge: "考察：导数的几何意义（切线斜率）",
    difficulty: 1,
    q: "曲线 y = x³ 在点 (1, 1) 处的切线斜率为（ ）",
    options: ["A. 1", "B. 2", "C. 3", "D. 0"],
    a: "C",
    ansNum: 3,
    ex: "y' = 3x²，在 x = 1 处 y' = 3，即切线斜率为 3，选 C。"
  },
  {
    id: "m_diff_s04",
    section: "微分",
    knowledge: "考察：用导数符号判断单调性",
    difficulty: 2,
    q: "函数 y = x³ 的单调递增区间为（ ）",
    options: ["A. (-∞, 0)", "B. (0, +∞)", "C. (-∞, +∞)", "D. 不存在"],
    a: "C",
    ansNum: null,
    ex: "y' = 3x² ≥ 0 恒成立（仅在 x = 0 处为 0），故 y = x³ 在 (-∞, +∞) 上单调递增，选 C。"
  },
  {
    id: "m_diff_s05",
    section: "微分",
    knowledge: "考察：极值的判定（一阶导变号）",
    difficulty: 1,
    q: "函数 y = x² 在 x = 0 处（ ）",
    options: ["A. 取得极大值", "B. 取得极小值", "C. 取得最大值", "D. 无极值"],
    a: "B",
    ansNum: null,
    ex: "y' = 2x：x<0 时 y'<0，x>0 时 y'>0，y' 在 x = 0 两侧由负变正，故 x = 0 为极小值点，选 B。"
  },
  {
    id: "m_diff_s06",
    section: "微分",
    knowledge: "考察：凹凸性与拐点（二阶导变号）",
    difficulty: 2,
    q: "曲线 y = x³ 的拐点为（ ）",
    options: ["A. (0, 0)", "B. (1, 1)", "C. (-1, -1)", "D. 无拐点"],
    a: "A",
    ansNum: null,
    ex: "y'' = 6x：x<0 时 y''<0（曲线凸），x>0 时 y''>0（曲线凹），x = 0 两侧二阶导变号且 y(0) = 0，故拐点为 (0, 0)，选 A。"
  },
  {
    id: "m_diff_s07",
    section: "微分",
    knowledge: "考察：复合函数求导（链式法则）",
    difficulty: 1,
    q: "设 y = sin(2x)，则 y' =（ ）",
    options: ["A. cos(2x)", "B. 2cos(2x)", "C. -2cos(2x)", "D. -cos(2x)"],
    a: "B",
    ansNum: null,
    ex: "y' = cos(2x)·(2x)' = 2cos(2x)，选 B。"
  },
  {
    id: "m_diff_s08",
    section: "微分",
    knowledge: "考察：微分的计算 dy = y'dx",
    difficulty: 1,
    q: "设 y = ln(x² + 1)，则 dy =（ ）",
    options: ["A. 2x/(x²+1) dx", "B. 1/(x²+1) dx", "C. 2x dx", "D. 2/(x²+1) dx"],
    a: "A",
    ansNum: null,
    ex: "y' = (x²+1)'/(x²+1) = 2x/(x²+1)，故 dy = y'dx = 2x/(x²+1) dx，选 A。"
  },
  {
    id: "m_diff_s09",
    section: "微分",
    knowledge: "考察：罗尔定理的三个条件",
    difficulty: 2,
    q: "下列函数中，在区间 [0, 1] 上满足罗尔定理条件的是（ ）",
    options: ["A. f(x) = x", "B. f(x) = x(1-x)", "C. f(x) = 1/x", "D. f(x) = |x - 1/2|"],
    a: "B",
    ansNum: null,
    ex: "罗尔定理要求：闭区间连续、开区间可导、端点函数值相等。f(x)=x 端点值不等；1/x 在 x=0 无定义；|x-1/2| 在 x=1/2 不可导；只有 f(x) = x(1-x) 满足全部条件（f(0) = f(1) = 0），选 B。"
  },
  {
    id: "m_diff_s10",
    section: "微分",
    knowledge: "考察：拉格朗日中值定理",
    difficulty: 2,
    q: "设 f(x) 在 [a,b] 上连续、在 (a,b) 内可导，则拉格朗日中值定理的结论是（ ）",
    options: ["A. 存在 ξ∈(a,b)，使 f'(ξ) = (f(b)-f(a))/(b-a)", "B. 存在 ξ∈(a,b)，使 f'(ξ) = 0", "C. 存在 ξ∈[a,b]，使 f(ξ) = 0", "D. 存在 ξ∈(a,b)，使 f'(ξ) = f(ξ)"],
    a: "A",
    ansNum: null,
    ex: "拉格朗日中值定理：存在 ξ∈(a,b)，使 f'(ξ) = (f(b)-f(a))/(b-a)，选 A。"
  },
  {
    id: "m_diff_s11",
    section: "微分",
    knowledge: "考察：水平渐近线与铅直渐近线",
    difficulty: 1,
    q: "曲线 y = 1/x 的渐近线为（ ）",
    options: ["A. x = 0（铅直渐近线）和 y = 0（水平渐近线）", "B. 只有 y = 0", "C. 只有 x = 0", "D. 没有渐近线"],
    a: "A",
    ansNum: null,
    ex: "lim(x→∞) 1/x = 0，故 y = 0 为水平渐近线；lim(x→0) 1/x = ∞，故 x = 0 为铅直渐近线，选 A。"
  }
];

window.EXAM_MATH.diff.fill = [
  {
    id: "m_diff_f01",
    section: "微分",
    knowledge: "考察：幂函数求导公式",
    difficulty: 1,
    q: "设 y = x^5，则 y' = ?",
    a: "5x^4",
    ansNum: null,
    ex: "由 (xⁿ)' = n·x^(n-1)，得 y' = 5x⁴。"
  },
  {
    id: "m_diff_f02",
    section: "微分",
    knowledge: "考察：复合函数求导（指数函数）",
    difficulty: 1,
    q: "设 y = e^(2x)，则 y' = ?",
    a: "2e^(2x)",
    ansNum: null,
    ex: "y' = e^(2x)·(2x)' = 2e^(2x)。"
  },
  {
    id: "m_diff_f03",
    section: "微分",
    knowledge: "考察：乘积求导法则",
    difficulty: 1,
    q: "设 y = x·lnx，则 y' = ?",
    a: "lnx + 1",
    ansNum: null,
    ex: "y' = (x)'·lnx + x·(lnx)' = lnx + x·(1/x) = lnx + 1。"
  },
  {
    id: "m_diff_f04",
    section: "微分",
    knowledge: "考察：切线方程（点斜式）",
    difficulty: 2,
    q: "曲线 y = x³ 在点 (1, 1) 处的切线方程为？",
    a: "y = 3x - 2",
    ansNum: null,
    ex: "y' = 3x²，切线斜率 k = y'(1) = 3。切线：y - 1 = 3(x - 1)，即 y = 3x - 2。"
  },
  {
    id: "m_diff_f05",
    section: "微分",
    knowledge: "考察：高阶导数",
    difficulty: 1,
    q: "设 y = sinx，则 y'' = ?",
    a: "-sinx",
    ansNum: null,
    ex: "y' = cosx，y'' = -sinx。"
  },
  {
    id: "m_diff_f06",
    section: "微分",
    knowledge: "考察：乘积求导法则（两个函数相乘）",
    difficulty: 2,
    q: "设 y = x²·e^x，则 y' = ?",
    a: "e^x(x^2 + 2x)",
    ansNum: null,
    ex: "y' = (x²)'·e^x + x²·(e^x)' = 2x·e^x + x²·e^x = e^x(x² + 2x)。"
  },
  {
    id: "m_diff_f07",
    section: "微分",
    knowledge: "考察：隐函数求导",
    difficulty: 2,
    q: "设 y = y(x) 由方程 x² + y² = 1 确定，则 dy/dx = ?",
    a: "-x/y",
    ansNum: null,
    ex: "方程两边对 x 求导：2x + 2y·y' = 0，解得 y' = -x/y。"
  },
  {
    id: "m_diff_f08",
    section: "微分",
    knowledge: "考察：参数方程求导",
    difficulty: 2,
    q: "设参数方程 x = t²，y = t³，则 dy/dx = ?",
    a: "3t/2",
    ansNum: null,
    ex: "dy/dx = (dy/dt)/(dx/dt) = (3t²)/(2t) = 3t/2。"
  }
];

window.EXAM_MATH.diff.calc = [
  {
    id: "m_diff_c01",
    section: "微分",
    knowledge: "考察：用一阶导数求单调区间与极值",
    difficulty: 2,
    q: "求函数 y = x³ - 3x + 1 的单调区间与极值。",
    a: "单调递增区间 (-∞,-1) 和 (1,+∞)，单调递减区间 (-1,1)；极大值 3（x=-1 处），极小值 -1（x=1 处）",
    ansNum: null,
    ex: "y' = 3x² - 3 = 3(x-1)(x+1)，令 y' = 0 得 x = ±1。\n列表：x<-1 时 y'>0，函数递增；-1<x<1 时 y'<0，函数递减；x>1 时 y'>0，函数递增。\n故递增区间为 (-∞,-1) 与 (1,+∞)，递减区间为 (-1,1)。\nx = -1 处取极大值 y(-1) = -1+3+1 = 3；x = 1 处取极小值 y(1) = 1-3+1 = -1。"
  },
  {
    id: "m_diff_c02",
    section: "微分",
    knowledge: "考察：用二阶导数判断凹凸性并求拐点",
    difficulty: 2,
    q: "求曲线 y = x³ - 3x² + 1 的凹凸区间与拐点。",
    a: "凹区间（下凹）(1,+∞)，凸区间（上凸）(-∞,1)，拐点 (1, -1)",
    ansNum: null,
    ex: "y' = 3x² - 6x，y'' = 6x - 6 = 6(x-1)。\n令 y'' = 0 得 x = 1。x<1 时 y''<0，曲线上凸；x>1 时 y''>0，曲线下凹。\nx = 1 两侧 y'' 变号且 y(1) = 1-3+1 = -1，故拐点为 (1, -1)。"
  },
  {
    id: "m_diff_c03",
    section: "微分",
    knowledge: "考察：闭区间上连续函数的最值（比较端点与驻点）",
    difficulty: 2,
    q: "求函数 f(x) = x·e^(-x) 在区间 [0, 2] 上的最大值与最小值。",
    a: "最大值 1/e（x=1 处），最小值 0（x=0 处）",
    ansNum: null,
    ex: "f'(x) = e^(-x) - x·e^(-x) = (1-x)e^(-x)，令 f' = 0 得驻点 x = 1。\n计算：f(0) = 0，f(1) = 1/e ≈ 0.368，f(2) = 2/e² ≈ 0.271。\n比较得：最大值 f(1) = 1/e，最小值 f(0) = 0。"
  },
  {
    id: "m_diff_c04",
    section: "微分",
    knowledge: "考察：切线方程与法线方程的求法",
    difficulty: 1,
    q: "求曲线 y = x³ 在点 (1, 1) 处的切线方程与法线方程。",
    a: "切线 y = 3x - 2；法线 y = -x/3 + 4/3",
    ansNum: null,
    ex: "y' = 3x²，斜率 k = y'(1) = 3。\n切线：y - 1 = 3(x - 1)，即 y = 3x - 2。\n法线斜率 k' = -1/3，法线：y - 1 = -(1/3)(x - 1)，即 y = -x/3 + 4/3。"
  },
  {
    id: "m_diff_c05",
    section: "微分",
    knowledge: "考察：隐函数求导",
    difficulty: 2,
    q: "设 y = y(x) 由方程 xy - e^y = 0 确定，求 dy/dx。",
    a: "y/(e^y - x)",
    ansNum: null,
    ex: "方程两边对 x 求导：y + x·y' - e^y·y' = 0，\n整理得 (x - e^y)·y' = -y，故 dy/dx = y/(e^y - x)。"
  },
  {
    id: "m_diff_c06",
    section: "微分",
    knowledge: "考察：参数方程求导",
    difficulty: 2,
    q: "设参数方程 x = a(t - sint)，y = a(1 - cost)（a 为常数），求 dy/dx。",
    a: "sint/(1-cost)",
    ansNum: null,
    ex: "dx/dt = a(1 - cost)，dy/dt = a·sint，\ndy/dx = (dy/dt)/(dx/dt) = a·sint/(a(1-cost)) = sint/(1-cost)。"
  },
  {
    id: "m_diff_c07",
    section: "微分",
    knowledge: "考察：导数应用（最优化问题，求最大容积）",
    difficulty: 3,
    q: "用边长为 a 的正方形铁皮，在四个角各剪去一个边长为 x 的小正方形后折成一个无盖盒子，问 x 取何值时盒子的容积最大？",
    a: "x = a/6",
    ansNum: null,
    ex: "盒子底面为边长 (a-2x) 的正方形，高为 x，容积 V(x) = x(a-2x)²，0 < x < a/2。\nV'(x) = (a-2x)² + x·2(a-2x)·(-2) = (a-2x)(a-2x-4x) = (a-2x)(a-6x)。\n令 V' = 0：x = a/6（x = a/2 舍去）。x<a/6 时 V'>0，x>a/6 时 V'<0，故 x = a/6 时容积最大，最大容积 V = (a/6)(2a/3)² = 2a³/27。"
  },
  {
    id: "m_diff_c08",
    section: "微分",
    knowledge: "考察：利用微分作近似计算 f(x₀+Δx) ≈ f(x₀) + f'(x₀)·Δx",
    difficulty: 2,
    q: "利用微分近似计算 e^0.1 的近似值（保留两位小数）。",
    a: "1.1",
    ansNum: 1.1,
    ex: "取 f(x) = e^x，x₀ = 0，Δx = 0.1：\ne^0.1 ≈ f(0) + f'(0)·0.1 = 1 + 1·0.1 = 1.1。"
  }
];

/* ==================== 一元函数积分学 ==================== */

window.EXAM_MATH.integ.single = [
  {
    id: "m_integ_s01",
    section: "积分",
    knowledge: "考察：基本积分公式（幂函数）",
    difficulty: 1,
    q: "∫ x² dx =（ ）",
    options: ["A. x³ + C", "B. x³/3 + C", "C. 3x³ + C", "D. x³/3"],
    a: "B",
    ansNum: null,
    ex: "由 ∫ xⁿ dx = x^(n+1)/(n+1) + C（n≠-1），得 ∫ x² dx = x³/3 + C，选 B。"
  },
  {
    id: "m_integ_s02",
    section: "积分",
    knowledge: "考察：基本积分公式（1/x）",
    difficulty: 1,
    q: "∫ (1/x) dx =（ ）",
    options: ["A. ln|x| + C", "B. lnx + C", "C. 1/x² + C", "D. x·lnx + C"],
    a: "A",
    ansNum: null,
    ex: "由 ∫ (1/x) dx = ln|x| + C（注意要带绝对值），选 A。"
  },
  {
    id: "m_integ_s03",
    section: "积分",
    knowledge: "考察：牛顿-莱布尼茨公式",
    difficulty: 1,
    q: "∫(0→1) 2x dx =（ ）",
    options: ["A. 1", "B. 2", "C. 0", "D. 1/2"],
    a: "A",
    ansNum: 1,
    ex: "∫(0→1) 2x dx = x² |(0→1) = 1 - 0 = 1，选 A。"
  },
  {
    id: "m_integ_s04",
    section: "积分",
    knowledge: "考察：基本积分公式（正弦）",
    difficulty: 1,
    q: "∫ sinx dx =（ ）",
    options: ["A. cosx + C", "B. -cosx + C", "C. sinx + C", "D. -sinx + C"],
    a: "B",
    ansNum: null,
    ex: "因为 (-cosx)' = sinx，所以 ∫ sinx dx = -cosx + C，选 B。"
  },
  {
    id: "m_integ_s05",
    section: "积分",
    knowledge: "考察：变上限积分求导（微积分基本定理）",
    difficulty: 1,
    q: "设 F(x) = ∫(0→x) sint dt，则 F'(x) =（ ）",
    options: ["A. sinx", "B. cosx", "C. -sinx", "D. x·sinx"],
    a: "A",
    ansNum: null,
    ex: "由变上限积分求导公式：d/dx ∫(0→x) f(t) dt = f(x)，得 F'(x) = sinx，选 A。"
  },
  {
    id: "m_integ_s06",
    section: "积分",
    knowledge: "考察：定积分计算（牛顿-莱布尼茨公式）",
    difficulty: 1,
    q: "∫(0→π) sinx dx =（ ）",
    options: ["A. 0", "B. 1", "C. 2", "D. π"],
    a: "C",
    ansNum: 2,
    ex: "∫(0→π) sinx dx = -cosx |(0→π) = -cosπ + cos0 = 1 + 1 = 2，选 C。"
  },
  {
    id: "m_integ_s07",
    section: "积分",
    knowledge: "考察：定积分的换元法（凑微分）",
    difficulty: 2,
    q: "∫(0→1) x·e^(x²) dx =（ ）",
    options: ["A. (e-1)/2", "B. e-1", "C. e", "D. (e-1)/4"],
    a: "A",
    ansNum: 0.8591409142295226,
    ex: "令 u = x²，du = 2x dx：\n原式 = (1/2)∫(0→1) e^u du = (1/2)(e - 1)，选 A。"
  },
  {
    id: "m_integ_s08",
    section: "积分",
    knowledge: "考察：无穷限反常积分",
    difficulty: 1,
    q: "反常积分 ∫(1→+∞) (1/x²) dx =（ ）",
    options: ["A. 1", "B. 2", "C. 发散", "D. 0"],
    a: "A",
    ansNum: 1,
    ex: "∫(1→+∞) 1/x² dx = -1/x |(1→+∞) = 0 - (-1) = 1，选 A。"
  },
  {
    id: "m_integ_s09",
    section: "积分",
    knowledge: "考察：定积分求平面图形面积",
    difficulty: 2,
    q: "由曲线 y = x 与 y = x² 所围平面图形的面积为（ ）",
    options: ["A. 1/3", "B. 1/6", "C. 1/2", "D. 1"],
    a: "B",
    ansNum: 0.16666666666666666,
    ex: "求交点：x = x² 得 x = 0, 1。\n面积 S = ∫(0→1) (x - x²) dx = (x²/2 - x³/3) |(0→1) = 1/2 - 1/3 = 1/6，选 B。"
  },
  {
    id: "m_integ_s10",
    section: "积分",
    knowledge: "考察：分部积分法",
    difficulty: 2,
    q: "∫ x·e^x dx =（ ）",
    options: ["A. (x-1)e^x + C", "B. (x+1)e^x + C", "C. x·e^x + C", "D. e^x + C"],
    a: "A",
    ansNum: null,
    ex: "分部积分：∫ x·e^x dx = x·e^x - ∫ e^x dx = x·e^x - e^x + C = (x-1)e^x + C，选 A。"
  }
];

window.EXAM_MATH.integ.fill = [
  {
    id: "m_integ_f01",
    section: "积分",
    knowledge: "考察：基本积分公式（余弦）",
    difficulty: 1,
    q: "∫ cosx dx = ?",
    a: "sinx + C",
    ansNum: null,
    ex: "因为 (sinx)' = cosx，所以 ∫ cosx dx = sinx + C。"
  },
  {
    id: "m_integ_f02",
    section: "积分",
    knowledge: "考察：定积分计算（牛顿-莱布尼茨公式）",
    difficulty: 1,
    q: "∫(0→1) (x + 1) dx = ?",
    a: "3/2",
    ansNum: 1.5,
    ex: "原式 = (x²/2 + x) |(0→1) = 1/2 + 1 = 3/2。"
  },
  {
    id: "m_integ_f03",
    section: "积分",
    knowledge: "考察：定积分计算与对数积分",
    difficulty: 1,
    q: "∫(1→e) (1/x) dx = ?",
    a: "1",
    ansNum: 1,
    ex: "原式 = lnx |(1→e) = lne - ln1 = 1 - 0 = 1。"
  },
  {
    id: "m_integ_f04",
    section: "积分",
    knowledge: "考察：变上限积分求导（复合函数情形）",
    difficulty: 2,
    q: "设 F(x) = ∫(0→x²) sint dt，则 F'(x) = ?",
    a: "2x·sin(x^2)",
    ansNum: null,
    ex: "由变上限积分求导公式（链式法则）：F'(x) = sin(x²)·(x²)' = 2x·sin(x²)。"
  },
  {
    id: "m_integ_f05",
    section: "积分",
    knowledge: "考察：定积分计算",
    difficulty: 1,
    q: "∫(0→π/2) sinx dx = ?",
    a: "1",
    ansNum: 1,
    ex: "原式 = -cosx |(0→π/2) = -cos(π/2) + cos0 = 0 + 1 = 1。"
  },
  {
    id: "m_integ_f06",
    section: "积分",
    knowledge: "考察：定积分换元法（凑微分）",
    difficulty: 2,
    q: "∫(0→1) x/(1+x²) dx = ?",
    a: "(1/2)ln2",
    ansNum: 0.34657359027997264,
    ex: "令 u = 1+x²，du = 2x dx：\n原式 = (1/2)∫(1→2) (1/u) du = (1/2)ln2。"
  },
  {
    id: "m_integ_f07",
    section: "积分",
    knowledge: "考察：分部积分法计算定积分",
    difficulty: 2,
    q: "∫(0→1) x·e^x dx = ?",
    a: "1",
    ansNum: 1,
    ex: "分部积分：∫(0→1) x·e^x dx = (x-1)e^x |(0→1) = 0·e - (-1)·1 = 1。"
  },
  {
    id: "m_integ_f08",
    section: "积分",
    knowledge: "考察：无界函数的反常积分",
    difficulty: 2,
    q: "反常积分 ∫(0→1) (1/√x) dx = ?",
    a: "2",
    ansNum: 2,
    ex: "原式 = 2√x |(0→1) = 2·1 - 2·0 = 2。"
  }
];

window.EXAM_MATH.integ.calc = [
  {
    id: "m_integ_c01",
    section: "积分",
    knowledge: "考察：分部积分法（连续两次分部积分）",
    difficulty: 2,
    q: "求不定积分 ∫ x²·e^x dx。",
    a: "(x^2 - 2x + 2)e^x + C",
    ansNum: null,
    ex: "第一次分部积分：∫ x²e^x dx = x²e^x - ∫ 2x·e^x dx。\n第二次分部积分：∫ 2x·e^x dx = 2x·e^x - 2∫ e^x dx = 2x·e^x - 2e^x + C。\n故原式 = x²e^x - 2x·e^x + 2e^x + C = (x² - 2x + 2)e^x + C。"
  },
  {
    id: "m_integ_c02",
    section: "积分",
    knowledge: "考察：分部积分法",
    difficulty: 2,
    q: "求不定积分 ∫ x·cosx dx。",
    a: "x·sinx + cosx + C",
    ansNum: null,
    ex: "分部积分：∫ x·cosx dx = x·sinx - ∫ sinx dx = x·sinx + cosx + C。"
  },
  {
    id: "m_integ_c03",
    section: "积分",
    knowledge: "考察：换元法（凑反正切积分公式）",
    difficulty: 2,
    q: "求不定积分 ∫ 1/(x² + 4) dx。",
    a: "(1/2)·arctan(x/2) + C",
    ansNum: null,
    ex: "原式 = (1/4)∫ 1/(1 + (x/2)²) dx。令 u = x/2，dx = 2du：\n= (1/4)·2∫ 1/(1+u²) du = (1/2)arctan u + C = (1/2)arctan(x/2) + C。"
  },
  {
    id: "m_integ_c04",
    section: "积分",
    knowledge: "考察：有理函数积分（拆项/凑微分）",
    difficulty: 2,
    q: "求不定积分 ∫ x³/(x² + 1) dx。",
    a: "x^2/2 - (1/2)ln(x^2+1) + C",
    ansNum: null,
    ex: "拆项：x³/(x²+1) = x - x/(x²+1)，\n原式 = ∫ x dx - ∫ x/(x²+1) dx = x²/2 - (1/2)ln(x²+1) + C。"
  },
  {
    id: "m_integ_c05",
    section: "积分",
    knowledge: "考察：定积分换元法（三角代换）",
    difficulty: 2,
    q: "计算定积分 ∫(0→1) √(1-x²) dx。",
    a: "π/4",
    ansNum: 0.7853981633974483,
    ex: "令 x = sint，dx = cost dt，x: 0→1 对应 t: 0→π/2：\n原式 = ∫(0→π/2) cos²t dt = (1/2)∫(0→π/2) (1 + cos2t) dt\n= (1/2)(t + sin2t/2) |(0→π/2) = (1/2)·(π/2) = π/4。\n（几何意义：单位圆在第一象限的面积）"
  },
  {
    id: "m_integ_c06",
    section: "积分",
    knowledge: "考察：旋转体体积公式 V = π∫ y² dx",
    difficulty: 2,
    q: "求曲线 y = √x 与直线 x = 1、x 轴所围图形绕 x 轴旋转一周所得旋转体的体积。",
    a: "π/2",
    ansNum: 1.5707963267948966,
    ex: "旋转体体积 V = π∫(0→1) (√x)² dx = π∫(0→1) x dx = π·(x²/2) |(0→1) = π/2。"
  },
  {
    id: "m_integ_c07",
    section: "积分",
    knowledge: "考察：定积分求平面图形面积",
    difficulty: 1,
    q: "求曲线 y = x² 与直线 y = 2x 所围平面图形的面积。",
    a: "4/3",
    ansNum: 1.3333333333333333,
    ex: "求交点：x² = 2x，得 x = 0, 2。\n面积 S = ∫(0→2) (2x - x²) dx = (x² - x³/3) |(0→2) = 4 - 8/3 = 4/3。"
  },
  {
    id: "m_integ_c08",
    section: "积分",
    knowledge: "考察：无穷限反常积分",
    difficulty: 1,
    q: "计算反常积分 ∫(0→+∞) e^(-x) dx。",
    a: "1",
    ansNum: 1,
    ex: "∫(0→+∞) e^(-x) dx = -e^(-x) |(0→+∞) = 0 - (-1) = 1。"
  },
  {
    id: "m_integ_c09",
    section: "积分",
    knowledge: "考察：有理函数积分（部分分式分解）",
    difficulty: 3,
    q: "求不定积分 ∫ 1/(x² - 1) dx。",
    a: "(1/2)ln|(x-1)/(x+1)| + C",
    ansNum: null,
    ex: "部分分式分解：1/(x²-1) = 1/[(x-1)(x+1)] = (1/2)/(x-1) - (1/2)/(x+1)，\n原式 = (1/2)∫ 1/(x-1) dx - (1/2)∫ 1/(x+1) dx\n= (1/2)ln|x-1| - (1/2)ln|x+1| + C = (1/2)ln|(x-1)/(x+1)| + C。"
  },
  {
    id: "m_integ_c10",
    section: "积分",
    knowledge: "考察：变上限积分求导与洛必达法则",
    difficulty: 2,
    q: "求极限 lim(x→0) [∫(0→x) e^(t²) dt] / x。",
    a: "1",
    ansNum: 1,
    ex: "0/0 型，用洛必达法则：\n分子求导（变上限积分求导）：d/dx ∫(0→x) e^(t²) dt = e^(x²)，\n原式 = lim(x→0) e^(x²)/1 = e^0 = 1。"
  }
];

/* ==================== 二重积分 ==================== */

window.EXAM_MATH.dbl.single = [
  {
    id: "m_dbl_s01",
    section: "二重积分",
    knowledge: "考察：直角坐标下二重积分的累次积分计算",
    difficulty: 1,
    q: "计算二重积分 ∬_D x dσ，其中 D：0≤x≤1, 0≤y≤1，结果为（ ）",
    options: ["A. 1/2", "B. 1", "C. 0", "D. 1/4"],
    a: "A",
    ansNum: 0.5,
    ex: "∬_D x dσ = ∫(0→1) dx ∫(0→1) x dy = ∫(0→1) x dx = 1/2，选 A。"
  },
  {
    id: "m_dbl_s02",
    section: "二重积分",
    knowledge: "考察：交换二重积分的积分次序",
    difficulty: 2,
    q: "交换积分次序：∫(0→1) dx ∫(0→x) f(x,y) dy 等于（ ）",
    options: ["A. ∫(0→1) dy ∫(y→1) f(x,y) dx", "B. ∫(0→1) dy ∫(0→y) f(x,y) dx", "C. ∫(0→1) dx ∫(0→x) f(x,y) dy", "D. ∫(0→1) dx ∫(x→1) f(x,y) dy"],
    a: "A",
    ansNum: null,
    ex: "积分区域：0≤x≤1，0≤y≤x，即 0≤y≤1，y≤x≤1。\n故换序后为 ∫(0→1) dy ∫(y→1) f(x,y) dx，选 A。"
  },
  {
    id: "m_dbl_s03",
    section: "二重积分",
    knowledge: "考察：利用对称性计算二重积分",
    difficulty: 2,
    q: "设积分区域 D 关于 y 轴对称，f(x,y) 关于 x 为奇函数，则 ∬_D f(x,y) dσ =（ ）",
    options: ["A. 0", "B. 2∬_(D1) f dσ（D1 为 D 的右半部分）", "C. ∬_D |f| dσ", "D. 无法确定"],
    a: "A",
    ansNum: null,
    ex: "D 关于 y 轴对称，f 关于 x 为奇函数，则对称点处的函数值互为相反数，正负相消，∬_D f dσ = 0，选 A。"
  },
  {
    id: "m_dbl_s04",
    section: "二重积分",
    knowledge: "考察：二重积分的极坐标变换（雅可比 r）",
    difficulty: 2,
    q: "设 D：x² + y² ≤ 1，用极坐标表示 ∬_D f(x,y) dσ 为（ ）",
    options: ["A. ∫(0→2π) dθ ∫(0→1) f(rcosθ, rsinθ)·r dr", "B. ∫(0→2π) dθ ∫(0→1) f(rcosθ, rsinθ) dr", "C. ∫(0→2π) dθ ∫(0→1) f(rcosθ, rsinθ)·r² dr", "D. ∫(0→2π) dθ ∫(0→1) f(rcosθ, rsinθ)·(1/2)r dr"],
    a: "A",
    ansNum: null,
    ex: "极坐标下 x = rcosθ，y = rsinθ，面积元素 dσ = r dr dθ；圆域 r: 0→1，θ: 0→2π，故选 A。"
  },
  {
    id: "m_dbl_s05",
    section: "二重积分",
    knowledge: "考察：二重积分求平面区域面积",
    difficulty: 1,
    q: "用二重积分求区域 D：0≤x≤1, 0≤y≤1-x 的面积，结果为（ ）",
    options: ["A. 1/2", "B. 1", "C. 2", "D. 1/3"],
    a: "A",
    ansNum: 0.5,
    ex: "面积 S = ∬_D dσ = ∫(0→1) dx ∫(0→1-x) dy = ∫(0→1) (1-x) dx = 1 - 1/2 = 1/2，选 A。"
  },
  {
    id: "m_dbl_s06",
    section: "二重积分",
    knowledge: "考察：二重积分表示区域面积",
    difficulty: 1,
    q: "计算 ∬_D dσ，其中 D：x² + y² ≤ 4，结果为（ ）",
    options: ["A. 4π", "B. 2π", "C. π", "D. 16π"],
    a: "A",
    ansNum: 12.566370614359172,
    ex: "∬_D dσ = 区域 D 的面积 = 圆 x²+y²≤4 的面积 = π·2² = 4π，选 A。"
  }
];

window.EXAM_MATH.dbl.fill = [
  {
    id: "m_dbl_f01",
    section: "二重积分",
    knowledge: "考察：二重积分表示区域面积",
    difficulty: 1,
    q: "计算二重积分 ∬_D 1 dσ，其中 D：0≤x≤2, 0≤y≤3。",
    a: "6",
    ansNum: 6,
    ex: "∬_D dσ = 区域面积 = 2×3 = 6。"
  },
  {
    id: "m_dbl_f02",
    section: "二重积分",
    knowledge: "考察：矩形区域上的二重积分（可分离变量）",
    difficulty: 1,
    q: "计算二重积分 ∬_D x·y dσ，其中 D：0≤x≤1, 0≤y≤2。",
    a: "1",
    ansNum: 1,
    ex: "∬_D xy dσ = ∫(0→1) x dx · ∫(0→2) y dy = (1/2)·(y²/2 |(0→2)) = (1/2)·2 = 1。"
  },
  {
    id: "m_dbl_f03",
    section: "二重积分",
    knowledge: "考察：二重积分的线性性质",
    difficulty: 2,
    q: "计算二重积分 ∬_D (x + y) dσ，其中 D：0≤x≤1, 0≤y≤1。",
    a: "1",
    ansNum: 1,
    ex: "∬_D (x+y) dσ = ∬_D x dσ + ∬_D y dσ = 1/2 + 1/2 = 1。"
  },
  {
    id: "m_dbl_f04",
    section: "二重积分",
    knowledge: "考察：二重积分求圆域面积",
    difficulty: 1,
    q: "计算二重积分 ∬_D dσ，其中 D：x² + y² ≤ 1。",
    a: "π",
    ansNum: 3.141592653589793,
    ex: "∬_D dσ = 单位圆面积 = π·1² = π。"
  },
  {
    id: "m_dbl_f05",
    section: "二重积分",
    knowledge: "考察：极坐标变换计算二重积分",
    difficulty: 3,
    q: "计算二重积分 ∬_D √(x²+y²) dσ，其中 D：x² + y² ≤ 1。",
    a: "2π/3",
    ansNum: 2.0943951023931953,
    ex: "极坐标：dσ = r dr dθ，被积函数 = r：\n原式 = ∫(0→2π) dθ ∫(0→1) r·r dr = 2π·(r³/3) |(0→1) = 2π/3。"
  },
  {
    id: "m_dbl_f06",
    section: "二重积分",
    knowledge: "考察：交换二重积分的积分次序",
    difficulty: 2,
    q: "把累次积分 ∫(0→1) dy ∫(0→y) f(x,y) dx 交换积分次序，写成先 y 后 x 的形式：",
    a: "∫(0→1) dx ∫(x→1) f(x,y) dy",
    ansNum: null,
    ex: "原区域：0≤y≤1，0≤x≤y，即 0≤x≤1，x≤y≤1，\n故换序后为 ∫(0→1) dx ∫(x→1) f(x,y) dy。"
  }
];

window.EXAM_MATH.dbl.calc = [
  {
    id: "m_dbl_c01",
    section: "二重积分",
    knowledge: "考察：直角坐标累次积分",
    difficulty: 1,
    q: "计算二重积分 ∬_D (x + 2y) dσ，其中 D：0≤x≤1, 0≤y≤1。",
    a: "3/2",
    ansNum: 1.5,
    ex: "∬_D (x+2y) dσ = ∫(0→1) dx ∫(0→1) (x+2y) dy\n= ∫(0→1) [xy + y²] |(0→1) dx = ∫(0→1) (x + 1) dx = 1/2 + 1 = 3/2。"
  },
  {
    id: "m_dbl_c02",
    section: "二重积分",
    knowledge: "考察：交换积分次序（先积 y 使 e^(x²) 可积）",
    difficulty: 3,
    q: "计算二重积分 ∫(0→1) dy ∫(y→1) e^(x²) dx。",
    a: "(e-1)/2",
    ansNum: 0.8591409142295226,
    ex: "原积分区域：0≤y≤1，y≤x≤1，即 0≤x≤1，0≤y≤x。\n交换次序：原式 = ∫(0→1) dx ∫(0→x) e^(x²) dy = ∫(0→1) x·e^(x²) dx\n= (1/2)e^(x²) |(0→1) = (e-1)/2。"
  },
  {
    id: "m_dbl_c03",
    section: "二重积分",
    knowledge: "考察：极坐标变换计算二重积分",
    difficulty: 2,
    q: "计算二重积分 ∬_D √(x²+y²) dσ，其中 D：x² + y² ≤ 4。",
    a: "16π/3",
    ansNum: 16.75516081914556,
    ex: "极坐标：0≤θ≤2π，0≤r≤2，dσ = r dr dθ，被积函数 = r：\n原式 = ∫(0→2π) dθ ∫(0→2) r·r dr = 2π·(r³/3) |(0→2) = 2π·(8/3) = 16π/3。"
  },
  {
    id: "m_dbl_c04",
    section: "二重积分",
    knowledge: "考察：一般区域上的直角坐标累次积分",
    difficulty: 3,
    q: "计算二重积分 ∬_D x·y dσ，其中 D 由曲线 y = x² 与直线 y = x 围成。",
    a: "1/24",
    ansNum: 0.041666666666666664,
    ex: "求交点：x² = x 得 x = 0, 1；区域：0≤x≤1，x²≤y≤x。\n原式 = ∫(0→1) dx ∫(x²→x) xy dy = ∫(0→1) x·(y²/2) |(x²→x) dx\n= (1/2)∫(0→1) (x³ - x⁵) dx = (1/2)(1/4 - 1/6) = 1/24。"
  },
  {
    id: "m_dbl_c05",
    section: "二重积分",
    knowledge: "考察：极坐标变换（第一象限圆域）",
    difficulty: 2,
    q: "计算二重积分 ∬_D x dσ，其中 D 为圆域 x² + y² ≤ 1 在第一象限的部分。",
    a: "1/3",
    ansNum: 0.3333333333333333,
    ex: "极坐标：0≤θ≤π/2，0≤r≤1，x = rcosθ，dσ = r dr dθ：\n原式 = ∫(0→π/2) dθ ∫(0→1) rcosθ·r dr = ∫(0→π/2) cosθ dθ · ∫(0→1) r² dr\n= 1·(1/3) = 1/3。"
  },
  {
    id: "m_dbl_c06",
    section: "二重积分",
    knowledge: "考察：利用对称性简化二重积分",
    difficulty: 2,
    q: "利用对称性计算 ∬_D (x³ + y) dσ，其中 D：x² + y² ≤ 1。",
    a: "0",
    ansNum: 0,
    ex: "D 关于 y 轴对称，x³ 关于 x 是奇函数，故 ∬_D x³ dσ = 0；\nD 关于 x 轴对称，y 关于 y 是奇函数，故 ∬_D y dσ = 0；\n所以原式 = 0 + 0 = 0。"
  },
  {
    id: "m_dbl_c07",
    section: "二重积分",
    knowledge: "考察：二重积分求立体体积（曲顶柱体）",
    difficulty: 3,
    q: "求曲面 z = x² + y² 与平面 z = 4 所围立体的体积。",
    a: "8π",
    ansNum: 25.132741228718345,
    ex: "立体体积 V = ∬_D (4 - x² - y²) dσ，其中 D：x²+y²≤4。\n极坐标：V = ∫(0→2π) dθ ∫(0→2) (4 - r²)·r dr\n= 2π·(2r² - r⁴/4) |(0→2) = 2π·(8 - 4) = 8π。"
  }
];

/* ==================== 常微分方程与级数 ==================== */

window.EXAM_MATH.extra.single = [
  {
    id: "m_extra_s01",
    section: "常微分方程与级数",
    knowledge: "考察：可直接积分求解的一阶微分方程",
    difficulty: 1,
    q: "微分方程 y' = 2x 的通解为（ ）",
    options: ["A. y = x² + C", "B. y = 2x + C", "C. y = x²", "D. y = 2x² + C"],
    a: "A",
    ansNum: null,
    ex: "两边积分：y = ∫ 2x dx = x² + C，选 A。"
  },
  {
    id: "m_extra_s02",
    section: "常微分方程与级数",
    knowledge: "考察：二阶常系数线性齐次微分方程的特征方程",
    difficulty: 1,
    q: "微分方程 y'' - y' - 2y = 0 的特征方程为（ ）",
    options: ["A. r² - r - 2 = 0", "B. r² + r + 2 = 0", "C. r² - r + 2 = 0", "D. r² + r - 2 = 0"],
    a: "A",
    ansNum: null,
    ex: "把 y'' 换成 r²、y' 换成 r、y 换成 1，得特征方程 r² - r - 2 = 0，选 A。"
  },
  {
    id: "m_extra_s03",
    section: "常微分方程与级数",
    knowledge: "考察：幂级数收敛半径（比值法）",
    difficulty: 2,
    q: "幂级数 ∑(n=1→∞) xⁿ/n 的收敛半径 R =（ ）",
    options: ["A. 1", "B. 2", "C. ∞", "D. 0"],
    a: "A",
    ansNum: 1,
    ex: "R = lim(n→∞) |aₙ/aₙ₊₁| = lim (1/n)/(1/(n+1)) = lim (n+1)/n = 1，选 A。"
  },
  {
    id: "m_extra_s04",
    section: "常微分方程与级数",
    knowledge: "考察：调和级数发散",
    difficulty: 1,
    q: "级数 ∑(n=1→∞) 1/n 的敛散性为（ ）",
    options: ["A. 收敛", "B. 发散", "C. 条件收敛", "D. 无法判断"],
    a: "B",
    ansNum: null,
    ex: "∑1/n 是调和级数（p-级数 p=1），发散，选 B。"
  },
  {
    id: "m_extra_s05",
    section: "常微分方程与级数",
    knowledge: "考察：一阶线性微分方程的解法",
    difficulty: 2,
    q: "一阶线性微分方程 y' + p(x)y = q(x) 的标准求解方法是（ ）",
    options: ["A. 分离变量法", "B. 常数变易法（通解公式）", "C. 特征方程法", "D. 降阶法"],
    a: "B",
    ansNum: null,
    ex: "一阶线性方程用通解公式 y = e^(-∫p dx)·(∫q·e^(∫p dx) dx + C) 求解（即常数变易法），选 B。"
  },
  {
    id: "m_extra_s06",
    section: "常微分方程与级数",
    knowledge: "考察：等比级数的求和公式",
    difficulty: 1,
    q: "级数 ∑(n=1→∞) (1/2)ⁿ 的和为（ ）",
    options: ["A. 1", "B. 2", "C. 1/2", "D. 发散"],
    a: "A",
    ansNum: 1,
    ex: "公比 q = 1/2，|q| < 1，和 S = a₁/(1-q) = (1/2)/(1-1/2) = 1，选 A。"
  },
  {
    id: "m_extra_s07",
    section: "常微分方程与级数",
    knowledge: "考察：可分离变量微分方程",
    difficulty: 1,
    q: "微分方程 y' = y 的通解为（ ）",
    options: ["A. y = C·e^x", "B. y = e^x", "C. y = C·e^(-x)", "D. y = e^x + C"],
    a: "A",
    ansNum: null,
    ex: "分离变量：dy/y = dx，两边积分得 ln|y| = x + C₁，故 y = C·e^x，选 A。"
  }
];

window.EXAM_MATH.extra.fill = [
  {
    id: "m_extra_f01",
    section: "常微分方程与级数",
    knowledge: "考察：二阶常系数线性齐次方程（共轭复根情形）",
    difficulty: 1,
    q: "微分方程 y'' + y = 0 的通解为？",
    a: "y = C1·cosx + C2·sinx",
    ansNum: null,
    ex: "特征方程 r² + 1 = 0，r = ±i，故通解 y = C₁cosx + C₂sinx。"
  },
  {
    id: "m_extra_f02",
    section: "常微分方程与级数",
    knowledge: "考察：几何级数的收敛域",
    difficulty: 2,
    q: "幂级数 ∑(n=0→∞) xⁿ 的收敛域为？",
    a: "(-1, 1)",
    ansNum: null,
    ex: "比值法：lim |x^(n+1)/xⁿ| = |x| < 1 时收敛；\nx = 1 时 ∑1 发散，x = -1 时 ∑(-1)ⁿ 发散，故收敛域为 (-1, 1)。"
  },
  {
    id: "m_extra_f03",
    section: "常微分方程与级数",
    knowledge: "考察：p-级数敛散性判别",
    difficulty: 2,
    q: "级数 ∑(n=1→∞) 1/n² 是收敛还是发散？",
    a: "收敛",
    ansNum: null,
    ex: "∑1/n² 是 p-级数（p = 2 > 1），收敛。"
  },
  {
    id: "m_extra_f04",
    section: "常微分方程与级数",
    knowledge: "考察：可分离变量微分方程",
    difficulty: 2,
    q: "求微分方程 dy/dx = 2xy 的通解。",
    a: "y = C·e^(x^2)",
    ansNum: null,
    ex: "分离变量：dy/y = 2x dx，两边积分：ln|y| = x² + C₁，\n故通解 y = C·e^(x²)。"
  },
  {
    id: "m_extra_f05",
    section: "常微分方程与级数",
    knowledge: "考察：一阶线性齐次方程的初值问题",
    difficulty: 1,
    q: "求微分方程 y' + y = 0 满足 y(0) = 1 的特解。",
    a: "y = e^(-x)",
    ansNum: null,
    ex: "通解：y = C·e^(-x)。代入 y(0) = 1 得 C = 1，特解 y = e^(-x)。"
  }
];

window.EXAM_MATH.extra.calc = [
  {
    id: "m_extra_c01",
    section: "常微分方程与级数",
    knowledge: "考察：可分离变量微分方程",
    difficulty: 2,
    q: "求微分方程 dy/dx = 2x·y² 的通解。",
    a: "y = -1/(x^2 + C)",
    ansNum: null,
    ex: "分离变量（y≠0）：dy/y² = 2x dx，两边积分：-1/y = x² + C，\n故通解 y = -1/(x² + C)。"
  },
  {
    id: "m_extra_c02",
    section: "常微分方程与级数",
    knowledge: "考察：一阶线性微分方程（积分因子法）",
    difficulty: 2,
    q: "求一阶线性微分方程 y' + y = e^(-x) 的通解。",
    a: "y = (x + C)·e^(-x)",
    ansNum: null,
    ex: "p(x) = 1，积分因子 μ = e^(∫1dx) = e^x。\n方程两边乘 μ：(y·e^x)' = e^(-x)·e^x = 1，\n积分：y·e^x = x + C，故 y = (x + C)e^(-x)。"
  },
  {
    id: "m_extra_c03",
    section: "常微分方程与级数",
    knowledge: "考察：二阶常系数线性齐次方程（两不等实根）",
    difficulty: 2,
    q: "求微分方程 y'' - 3y' + 2y = 0 的通解。",
    a: "y = C1·e^x + C2·e^(2x)",
    ansNum: null,
    ex: "特征方程 r² - 3r + 2 = 0，即 (r-1)(r-2) = 0，r₁ = 1，r₂ = 2。\n两不等实根，通解 y = C₁e^x + C₂e^(2x)。"
  },
  {
    id: "m_extra_c04",
    section: "常微分方程与级数",
    knowledge: "考察：幂级数收敛域（含端点的判定）",
    difficulty: 3,
    q: "求幂级数 ∑(n=1→∞) xⁿ/n² 的收敛域。",
    a: "[-1, 1]",
    ansNum: null,
    ex: "收敛半径 R = lim (1/n²)/(1/(n+1)²) = lim (n+1)²/n² = 1，|x|<1 收敛。\n端点：x = 1 时 ∑1/n² 收敛；x = -1 时 ∑(-1)ⁿ/n² 绝对收敛。\n故收敛域为 [-1, 1]。"
  },
  {
    id: "m_extra_c05",
    section: "常微分方程与级数",
    knowledge: "考察：级数收敛的必要条件（通项趋于 0）",
    difficulty: 1,
    q: "判断级数 ∑(n=1→∞) n/(n+1) 的敛散性。",
    a: "发散",
    ansNum: null,
    ex: "通项 uₙ = n/(n+1) → 1 ≠ 0。\n由级数收敛的必要条件（通项必须趋于 0）知该级数发散。"
  },
  {
    id: "m_extra_c06",
    section: "常微分方程与级数",
    knowledge: "考察：幂级数收敛半径与收敛域",
    difficulty: 2,
    q: "求幂级数 ∑(n=1→∞) xⁿ/2ⁿ 的收敛半径与收敛域。",
    a: "收敛半径 R = 2，收敛域 (-2, 2)",
    ansNum: null,
    ex: "aₙ = 1/2ⁿ，R = lim |aₙ/aₙ₊₁| = lim 2ⁿ⁺¹/2ⁿ = 2，|x| < 2 收敛。\nx = 2 时 ∑1 发散；x = -2 时 ∑(-1)ⁿ 发散。故收敛域为 (-2, 2)。"
  },
  {
    id: "m_extra_c07",
    section: "常微分方程与级数",
    knowledge: "考察：二阶常系数线性齐次方程（重根）的初值问题",
    difficulty: 3,
    q: "求微分方程 y'' + 2y' + y = 0 满足 y(0) = 1、y'(0) = 1 的特解。",
    a: "y = (1 + 2x)·e^(-x)",
    ansNum: null,
    ex: "特征方程 r² + 2r + 1 = 0，即 (r+1)² = 0，r = -1（二重根），\n通解 y = (C₁ + C₂x)e^(-x)。\ny' = (C₂ - C₁ - C₂x)e^(-x)。\n代入 y(0) = 1 得 C₁ = 1；代入 y'(0) = 1 得 C₂ - 1 = 1，C₂ = 2。\n特解 y = (1 + 2x)e^(-x)。"
  }
];

/* ---- 常微分方程与级数（补充题） ---- */

window.EXAM_MATH.extra.single = window.EXAM_MATH.extra.single.concat([
  {
    id: "m_extra_s08",
    section: "常微分方程与级数",
    knowledge: "考察：可分离变量方程的识别",
    difficulty: 1,
    q: "下列微分方程中，属于可分离变量方程的是（ ）",
    options: ["A. y' = x + y", "B. y' = x·y", "C. y' = x² + y²", "D. y'' + y = 0"],
    a: "B",
    ansNum: null,
    ex: "y' = x·y 可改写为 dy/y = x dx，变量 x 与 y 可分别移到等号两侧，属于可分离变量方程。A、C 中 x、y 无法分离；D 为二阶方程，不属于一阶可分离变量型。"
  },
  {
    id: "m_extra_s09",
    section: "常微分方程与级数",
    knowledge: "考察：二阶常系数线性非齐次方程特解的形式",
    difficulty: 2,
    q: "微分方程 y'' - 2y' + y = e^x 的特解形式应设为（ ）（A 为待定常数）",
    options: ["A. y* = A·e^x", "B. y* = A·x·e^x", "C. y* = A·x²·e^x", "D. y* = A·cosx"],
    a: "C",
    ansNum: null,
    ex: "自由项 e^x 中的指数与特征方程 (r-1)² = 0 的二重根 r = 1 相同，故特解需乘 x 的 k 次幂（k 为根的重数，此处 k = 2），设为 y* = A·x²·e^x，选 C。"
  },
  {
    id: "m_extra_s10",
    section: "常微分方程与级数",
    knowledge: "考察：交错级数的莱布尼茨判别法",
    difficulty: 2,
    q: "交错级数 ∑(n=1→∞) (-1)^(n-1)/n 的敛散性为（ ）",
    options: ["A. 绝对收敛", "B. 条件收敛", "C. 发散", "D. 无法判断"],
    a: "B",
    ansNum: null,
    ex: "取绝对值后 ∑1/n 为调和级数，发散；而原交错级数满足莱布尼茨条件（uₙ = 1/n 单调递减且趋于 0），故收敛。既收敛又不绝对收敛，为条件收敛，选 B。"
  },
  {
    id: "m_extra_s11",
    section: "常微分方程与级数",
    knowledge: "考察：正项级数的比值判别法",
    difficulty: 2,
    q: "级数 ∑(n=1→∞) 1/n! 的敛散性为（ ）",
    options: ["A. 收敛", "B. 发散", "C. 条件收敛", "D. 无法判断"],
    a: "A",
    ansNum: null,
    ex: "由比值判别法：lim(n→∞) uₙ₊₁/uₙ = lim 1/(n+1) = 0 < 1，故级数收敛，选 A。"
  },
  {
    id: "m_extra_s12",
    section: "常微分方程与级数",
    knowledge: "考察：几何级数（等比级数）的收敛条件",
    difficulty: 1,
    q: "级数 ∑(n=1→∞) a·qⁿ（a ≠ 0）收敛的充要条件是（ ）",
    options: ["A. |q| > 1", "B. |q| < 1", "C. q = 1", "D. q = -1"],
    a: "B",
    ansNum: null,
    ex: "几何级数当公比 |q| < 1 时收敛，其和为 a·q/(1-q)；|q| ≥ 1 时发散。故选 B。"
  }
]);

window.EXAM_MATH.extra.fill = window.EXAM_MATH.extra.fill.concat([
  {
    id: "m_extra_f06",
    section: "常微分方程与级数",
    knowledge: "考察：一阶微分方程的直接积分求解",
    difficulty: 1,
    q: "求微分方程 y' = 3x² 的通解为？",
    a: "y = x^3 + C",
    ansNum: null,
    ex: "两边对 x 积分：y = ∫ 3x² dx = x³ + C。"
  },
  {
    id: "m_extra_f07",
    section: "常微分方程与级数",
    knowledge: "考察：幂级数收敛半径（阶乘型，R = ∞）",
    difficulty: 2,
    q: "幂级数 ∑(n=0→∞) xⁿ/n! 的收敛半径为？",
    a: "R = ∞（在整个数轴上收敛）",
    ansNum: null,
    ex: "由比值法：|uₙ₊₁/uₙ| = |x|/(n+1) → 0，对任意实数 x 都收敛，故收敛半径 R = ∞。"
  },
  {
    id: "m_extra_f08",
    section: "常微分方程与级数",
    knowledge: "考察：p-级数的收敛条件",
    difficulty: 2,
    q: "p-级数 ∑(n=1→∞) 1/n^p 收敛的条件是 p 满足什么？",
    a: "p > 1",
    ansNum: null,
    ex: "p-级数当 p > 1 时收敛，当 p ≤ 1 时发散（p = 1 即调和级数）。"
  },
  {
    id: "m_extra_f09",
    section: "常微分方程与级数",
    knowledge: "考察：可分离变量方程",
    difficulty: 2,
    q: "求微分方程 dy/dx = e^x·y 的通解。",
    a: "y = C·e^(e^x)",
    ansNum: null,
    ex: "分离变量：dy/y = e^x dx，两边积分：ln|y| = e^x + C₁，故通解 y = C·e^(eˣ)。"
  }
]);

window.EXAM_MATH.extra.calc = window.EXAM_MATH.extra.calc.concat([
  {
    id: "m_extra_c08",
    section: "常微分方程与级数",
    knowledge: "考察：二阶常系数线性齐次方程（特征根不同）",
    difficulty: 2,
    q: "求微分方程 y'' - 5y' + 6y = 0 的通解。",
    a: "y = C1·e^(2x) + C2·e^(3x)",
    ansNum: null,
    ex: "特征方程 r² - 5r + 6 = 0，即 (r-2)(r-3) = 0，得 r₁ = 2，r₂ = 3。\n两不等实根，通解 y = C₁e^(2x) + C₂e^(3x)。"
  },
  {
    id: "m_extra_c09",
    section: "常微分方程与级数",
    knowledge: "考察：一阶线性微分方程（积分因子法）",
    difficulty: 2,
    q: "求一阶线性微分方程 y' + 2xy = x 的通解。",
    a: "y = 1/2 + C·e^(-x^2)",
    ansNum: null,
    ex: "p(x) = 2x，积分因子 μ = e^(∫2x dx) = e^(x²)。\n两边乘 μ：(y·e^(x²))' = x·e^(x²)，\n积分：y·e^(x²) = (1/2)e^(x²) + C，故 y = 1/2 + C·e^(-x²)。"
  },
  {
    id: "m_extra_c10",
    section: "常微分方程与级数",
    knowledge: "考察：幂级数收敛半径与收敛域（含端点）",
    difficulty: 3,
    q: "求幂级数 ∑(n=1→∞) (x-1)ⁿ/n 的收敛域。",
    a: "收敛半径 R = 1，收敛域 [0, 2)",
    ansNum: null,
    ex: "令 t = x - 1，得 ∑tⁿ/n，其收敛半径 R = 1，即 |t| < 1。\n端点 t = 1 时 ∑1/n 发散；t = -1 时 ∑(-1)ⁿ/n 条件收敛。\n故 t ∈ [-1, 1)，即 x ∈ [0, 2)。"
  },
  {
    id: "m_extra_c11",
    section: "常微分方程与级数",
    knowledge: "考察：二阶常系数线性齐次方程的初值问题",
    difficulty: 3,
    q: "求微分方程 y'' - 4y = 0 满足 y(0) = 1、y'(0) = 2 的特解。",
    a: "y = e^(2x)",
    ansNum: null,
    ex: "特征方程 r² - 4 = 0，r = ±2，通解 y = C₁e^(2x) + C₂e^(-2x)。\ny' = 2C₁e^(2x) - 2C₂e^(-2x)。\n代入 y(0) = 1：C₁ + C₂ = 1；代入 y'(0) = 2：2C₁ - 2C₂ = 2，即 C₁ - C₂ = 1。\n解得 C₁ = 1，C₂ = 0，故特解 y = e^(2x)。"
  }
]);

/* ==================== 线性代数 ==================== */

window.EXAM_MATH.linalg.single = [
  {
    id: "m_la_s01",
    section: "线性代数",
    knowledge: "考察：二阶行列式的计算",
    difficulty: 1,
    q: "行列式 |2 1; 3 4| =（ ）",
    options: ["A. 5", "B. -5", "C. 11", "D. 8"],
    a: "A",
    ansNum: 5,
    ex: "二阶行列式 = 主对角线之积 - 副对角线之积 = 2×4 - 1×3 = 5，选 A。"
  },
  {
    id: "m_la_s02",
    section: "线性代数",
    knowledge: "考察：方阵行列式的数乘性质 |kA| = kⁿ|A|",
    difficulty: 2,
    q: "设 A 为 3 阶方阵，且 |A| = 2，则 |2A| =（ ）",
    options: ["A. 4", "B. 8", "C. 16", "D. 2"],
    a: "C",
    ansNum: 16,
    ex: "k 乘 n 阶方阵，其行列式的每一行都乘 k，故 |kA| = kⁿ|A|。这里 |2A| = 2³×|A| = 8×2 = 16，选 C。"
  },
  {
    id: "m_la_s03",
    section: "线性代数",
    knowledge: "考察：矩阵可逆的充要条件",
    difficulty: 1,
    q: "n 阶方阵 A 可逆的充要条件是（ ）",
    options: ["A. A 是对称矩阵", "B. |A| ≠ 0", "C. |A| = 0", "D. A 是零矩阵"],
    a: "B",
    ansNum: null,
    ex: "方阵 A 可逆 ⇔ |A| ≠ 0（即 A 满秩），此时 A⁻¹ = A*/|A|。故选 B。"
  },
  {
    id: "m_la_s04",
    section: "线性代数",
    knowledge: "考察：齐次线性方程组有非零解的条件",
    difficulty: 2,
    q: "齐次线性方程组 Ax = 0 有非零解的充要条件是（ ）",
    options: ["A. r(A) = n", "B. r(A) < n", "C. r(A) > n", "D. |A| ≠ 0"],
    a: "B",
    ansNum: null,
    ex: "设 A 为 m×n 矩阵，n 为未知数个数。Ax = 0 有非零解 ⇔ r(A) < n（未知数个数）；当 r(A) = n 时只有零解。故选 B。"
  },
  {
    id: "m_la_s05",
    section: "线性代数",
    knowledge: "考察：向量组线性相关的判定",
    difficulty: 2,
    q: "n 维向量组 α₁, α₂, …, αₛ（s ≥ 2）线性相关的充要条件是（ ）",
    options: ["A. 其中至少有一个向量可由其余向量线性表示", "B. 所有向量都是零向量", "C. 向量个数 s 大于 n", "D. 所有向量两两不成比例"],
    a: "A",
    ansNum: null,
    ex: "向量组线性相关 ⇔ 其中至少有一个向量可由其余向量线性表示。特别地，s > n 时必线性相关，但这是充分条件而非必要条件，故不选 C。选 A。"
  },
  {
    id: "m_la_s06",
    section: "线性代数",
    knowledge: "考察：逆矩阵的行列式",
    difficulty: 2,
    q: "设 3 阶方阵 A 满足 |A| = 2，则 |A⁻¹| =（ ）",
    options: ["A. 2", "B. 1/2", "C. -2", "D. 4"],
    a: "B",
    ansNum: 0.5,
    ex: "由 A·A⁻¹ = E 得 |A|·|A⁻¹| = 1，故 |A⁻¹| = 1/|A| = 1/2，选 B。"
  },
  {
    id: "m_la_s07",
    section: "线性代数",
    knowledge: "考察：矩阵转置与行列式 |Aᵀ| = |A|",
    difficulty: 1,
    q: "设 A 为 n 阶方阵，则下列等式正确的是（ ）",
    options: ["A. |Aᵀ| = -|A|", "B. |Aᵀ| = |A|", "C. |Aᵀ| = |A|ⁿ", "D. |Aᵀ| = 1/|A|"],
    a: "B",
    ansNum: null,
    ex: "转置不改变行列式的值，即 |Aᵀ| = |A|，选 B。"
  },
  {
    id: "m_la_s08",
    section: "线性代数",
    knowledge: "考察：上（下）三角行列式的计算",
    difficulty: 1,
    q: "行列式 |2 3 5; 0 1 4; 0 0 3| =（ ）",
    options: ["A. 6", "B. 1", "C. 24", "D. 0"],
    a: "A",
    ansNum: 6,
    ex: "上三角行列式等于主对角线上元素的乘积：2×1×3 = 6，选 A。"
  }
];

window.EXAM_MATH.linalg.fill = [
  {
    id: "m_la_f01",
    section: "线性代数",
    knowledge: "考察：两行成比例的行列式为零",
    difficulty: 1,
    q: "行列式 |1 2; 2 4| = ?",
    a: "0",
    ansNum: 0,
    ex: "第二行是第一行的 2 倍（两行成比例），故行列式 = 1×4 - 2×2 = 0。"
  },
  {
    id: "m_la_f02",
    section: "线性代数",
    knowledge: "考察：三阶上三角行列式",
    difficulty: 1,
    q: "行列式 |2 1 0; 0 3 0; 0 0 4| = ?",
    a: "24",
    ansNum: 24,
    ex: "上三角行列式等于主对角线元素之积：2×3×4 = 24。"
  },
  {
    id: "m_la_f03",
    section: "线性代数",
    knowledge: "考察：方阵行列式的数乘性质",
    difficulty: 2,
    q: "设 A 为 3 阶方阵，|A| = 5，则 |2A| = ?",
    a: "40",
    ansNum: 40,
    ex: "|2A| = 2³·|A| = 8×5 = 40。"
  },
  {
    id: "m_la_f04",
    section: "线性代数",
    knowledge: "考察：二阶行列式的计算",
    difficulty: 1,
    q: "行列式 |1 2; 3 4| = ?",
    a: "-2",
    ansNum: -2,
    ex: "1×4 - 2×3 = -2。"
  },
  {
    id: "m_la_f05",
    section: "线性代数",
    knowledge: "考察：单位矩阵的行列式",
    difficulty: 1,
    q: "n 阶单位矩阵 E 的行列式 |E| = ?",
    a: "1",
    ansNum: 1,
    ex: "单位矩阵主对角线元素全为 1、其余为 0，故 |E| = 1。"
  },
  {
    id: "m_la_f06",
    section: "线性代数",
    knowledge: "考察：方阵乘积的行列式",
    difficulty: 2,
    q: "设 A、B 均为 2 阶方阵，|A| = 2，|B| = 3，则 |AB| = ?",
    a: "6",
    ansNum: 6,
    ex: "由 |AB| = |A|·|B| 得 |AB| = 2×3 = 6。"
  }
];

window.EXAM_MATH.linalg.calc = [
  {
    id: "m_la_c01",
    section: "线性代数",
    knowledge: "考察：三阶行列式按第一行展开的计算",
    difficulty: 2,
    q: "计算三阶行列式 |1 2 3; 4 5 6; 7 8 10|。",
    a: "-3",
    ansNum: -3,
    ex: "按第一行展开：\nD = 1×(5×10 - 6×8) - 2×(4×10 - 6×7) + 3×(4×8 - 5×7)\n  = 1×(50-48) - 2×(40-42) + 3×(32-35)\n  = 2 - 2×(-2) + 3×(-3) = 2 + 4 - 9 = -3。"
  },
  {
    id: "m_la_c02",
    section: "线性代数",
    knowledge: "考察：二阶矩阵的逆矩阵（伴随矩阵法）",
    difficulty: 2,
    q: "设 A = |1 2; 3 4|，求 A⁻¹。",
    a: "A⁻¹ = |-2 1; 3/2 -1/2|",
    ansNum: null,
    ex: "|A| = 1×4 - 2×3 = -2 ≠ 0，A 可逆。\nA* = |4 -2; -3 1|（主对角线交换、副对角线变号），\nA⁻¹ = A*/|A| = (1/-2)|4 -2; -3 1| = |-2 1; 3/2 -1/2|。"
  },
  {
    id: "m_la_c03",
    section: "线性代数",
    knowledge: "考察：二元线性方程组的求解",
    difficulty: 1,
    q: "解线性方程组：x + y = 3，x - y = 1。",
    a: "x = 2，y = 1",
    ansNum: null,
    ex: "两式相加得 2x = 4，x = 2；代入 x + y = 3 得 y = 1。\n即解为 x = 2，y = 1。"
  },
  {
    id: "m_la_c04",
    section: "线性代数",
    knowledge: "考察：向量组线性相关性的判定",
    difficulty: 2,
    q: "已知向量组 α₁ = (1, 0, 0)，α₂ = (0, 1, 0)，α₃ = (1, 1, 0)，判断其线性相关性。",
    a: "线性相关（α₃ = α₁ + α₂）",
    ansNum: null,
    ex: "因为 α₃ = α₁ + α₂，即存在不全为零的系数 1、1、-1 使 α₁ + α₂ - α₃ = 0，\n故该向量组线性相关。"
  },
  {
    id: "m_la_c05",
    section: "线性代数",
    knowledge: "考察：对角矩阵的特征值",
    difficulty: 2,
    q: "求矩阵 A = |2 0; 0 3| 的全部特征值。",
    a: "λ₁ = 2，λ₂ = 3",
    ansNum: null,
    ex: "对角矩阵的特征值就是主对角线上的元素：λ₁ = 2，λ₂ = 3。\n（也可由 |λE - A| = (λ-2)(λ-3) = 0 解得）"
  },
  {
    id: "m_la_c06",
    section: "线性代数",
    knowledge: "考察：矩阵方程与逆矩阵",
    difficulty: 3,
    q: "设 A = |1 2; 0 1|，求满足 AX = E 的矩阵 X（即求 A⁻¹）。",
    a: "X = |1 -2; 0 1|",
    ansNum: null,
    ex: "|A| = 1×1 - 2×0 = 1 ≠ 0，A 可逆。\nA* = |1 -2; 0 1|，故 X = A⁻¹ = A*/|A| = |1 -2; 0 1|。\n验证：|1 2; 0 1|·|1 -2; 0 1| = |1 0; 0 1| = E。"
  }
];
