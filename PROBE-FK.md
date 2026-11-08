# FK 反关节探针(P8,清单 V16 扩版)

用法:①在 computeTargetPose 的 return 前插一行钩子(见下);②浏览器进对局后 evaluate 跑审计体;③验收 kF-tF ≤ 0.2 全绿;④用完删钩子。

钩子行:
    if (window.__auditOn) (window.__auditRows = window.__auditRows || []).push([s, +(this.st || 0).toFixed(2), tF, kF, tB, kB]);

屈膝铁律:自然屈膝必须小腿角(kF)≤大腿角(tF),kF-tF>0.2 即鸟膝。
**P8 原版契约只判前腿(kF-tF);后腿 kB-tB 是 V16 新增观测列(见下「历史豁免与既存观测」)。**

---

## V16(2026-10-31)「全部可达状态」清单版审计

### 驱动协议(硬规则,踩过的坑都在里面)
- 浏览器打开 127.0.0.1:8123,`selChar1=ch; startMatch('train')`(或 'ai');
- **`setPaused(true)` 或直写 `paused=true`(后者不弹暂停面板,截图用)后手动循环** `match.update(1/60); match.checkKO(); frameCount++; p1.computePose()` 驱动——rAF 后台节流+会双重驱动;
- 采样**目标层** `p1.computeTargetPose()`(返回关节坐标 nx/ny/exF…/knF…,非角度;角度用 atan2 重构,相对角必须 wrap 到 ±π——举臂过头时 aF+bF>π 不 wrap 会假报 -5.7 级肘角);
- 搓招进 state 用 `p1.fakeMotion('qcf'|'dp'|'ah')`+keys 直写;重复进招前清 `p1._qcfLatch=false; p1.fbCd=0`(否则被 latch/冷却挡成 lp);
- 空中招(alp/alk/ahp/ahk/lily/nara)先 `p1.y=616-130; p1.grounded=false; p1.vy=-260` 再 startAtk;
- orochi 按住 keys['j'] 采满 2.6s 保险丝全程(不能只采 ATK.dur——**这就是 P8 漏审面条人的原因**)。

### 状态清单(33 状态 → 全部可达状态,三角色)
- 共通非 ATK(13):idle / walk(跑+后撤)/ crouch / prejump / jump / land / dodge / blockstun(站防+蹲防)/ hitstun(high/mid/low/空中 tumble)/ down(地面+空中入场)/ ko / win / grabbed(挣扎+_lifted+_pinned+_slammed 四变体);
- 共通 ATK(15):lp lk hp hk clp clk chp chk alp alk ahp ahk dp fb throw(cd gc 走全局表另计);
- iori(6):md1 md2 lily clus ult(分镜 pre/dash/lift/hammer)+ah1-ah3;
- kyo(8):ar1 ar2 ar3 kt kyk nara orochi(蓄力全程 2.6s!)ult(_cinPose:mCharge/mDash/mJabL/mJabR/mPush/mUp/mLeap/mSlam/mRec);
- daimon(8):jishin sgc unrei tenchi choshu chou daichi ult(gCharge/gDash/gCloud/gPile/gRaise/gFin)。
- 每状态采真实游戏时长帧数(≥dur+atkRec+0.1s;非 ATK 态 20-110 帧),逐帧全部关节。

### 检查规则(硬门,任一命中=红)
1. **NaN 扫描**:22 个关节坐标+rot+squash 任一非有限(V16 抓到 daimon ahp 双手 NaN 19/25 帧);
2. **前腿鸟膝(P8 原规则)**:小腿绝对角−大腿绝对角>0.2,仅直立帧(|rot|≤0.1)且足在髋下(头顶/蝎踢类姿势该角无意义,如 lily 蝎踢是 IK 屈腿合法方向);
3. **前膝几何**:膝在髋→足连线的后侧 >10px(与 2 互证,IK 腿膝恒在前=构造安全);
4. **包络**(角度重构后):lean ∈[-1.05,1.2](下限覆盖 P25 受击甩头设计值 -0.95)、肩 aF/aB ∈[-2.1,3.1]、肘 bF/bB ∈[-1.0,2.4];
5. **穿地(髋)**:直立且 grounded 时 hy>-1。
   观测列(不判红,记录基线防回归):后腿 kB-tB、后膝几何、足部入地深度(见下)。

### 历史豁免与既存观测(V16 实测基线,后续审计只防「新增」)
- **豁免(V2/V4 已标注)**:grabbed._lifted 乱蹬(F_bird 峰 0.8=脚本踢腿)/down·ko·grabbed._pinned·_slammed 翻转体(rot −π/2…π,直立坐标类检查不适用)/hitstun 三层受击夸张值(P25 设计);
- **后腿 kB-tB 既存**(P8 契约从不判后腿,本作弓步后腿风格化值):fb 1.00、iori ult/dash 1.05、clus 1.05、hp 系 0.84-0.93、ahk 3.04(脚跟坐砸大屈曲,屈曲方向合法)、nara 2.1、throw 系 0.44、ko 0.6 等 47 处,逐值=分支表原值,V16 修前后零变化;
- **足部入地既存**(历史审计不查穿地;角度腿默认姿势(0.16/0.3)本身触地深 ~7px,大门长腿 48/46 更深):65 个(状态×实际 state)有基线,全场最大 24.8px(daimon 投技族);足部线段圆头+影椭圆下视觉不可见;U6 马步等 IK 蹲姿精确 616.00 不受影响;
- **伸腿边缘帧(非鸟膝)**:daimon ah1×3 帧、gc×5 帧 F_bird 0.21-0.29 但膝在髋→足线**前侧** +5~7px(屈曲正确方向,腿近伸直的测角边缘值)=大门长腿×共享姿势值交互,既存(T4 起),V16 零变化;
- lily 蝎踢 F_bird 4.1/kneeGeo 15px=假阳性:前腿 IK 目标在髋上方(弧线扫过头顶),屈曲方向合法,T2 设计(「前腿走 IK 零反关节」)。

### V16 修复记录(详见 CHAR-DIFF-QUEUE.md V16 节)
1. **orochi「面条人」**:根因=computeTargetPose 尾部「KOF 收招回落」块 `w=(p2-0.72)/0.28*0.72` 无界——ATK.orochi.dur=.42 但蓄力 st 可达 2.6s,p2=6.2 → w≈14,lerp 变线性外插(实测修前 st=2.36:lean 3.09 躯干倒转/hy -198.6 髋上浮/手臂角绕整圈 da=2π 级跳变)。修=回落块排除 orochi + `w=Math.min(0.72,…)` 封顶(防同类:普通招 atkRec 期 p2 可到 ~1.35,旧式微外插属非设计行为)。修后蓄力全程=分支设计值逐位恒定(chg 饱和后),零违规;修前修后对照:lean -0.06↔3.09、hy -60↔-198.6、aF -0.38↔-3.12(绕圈)@st≈2.35;
2. **daimon ahp 双手 NaN**(审计新发现,U6 引入):POSE_DAIMON.ahp.B.bF/bB 写成标量 .35/.5,而 ahp 分支 B 段读数组 lerp(B.bF[0],B.bF[1],e)→双手坐标 NaN 19/25 帧,且 computePose 插值层 NaN 粘滞(用过一次空中重拳后该 fighter 双手永久消失)。修=B.bF:[1.5,.35]/bB:[1.5,.5](对齐 iori/kyo 的 [A段末值,终值] 约定,终值=U6 设计值不变)。

### 复现命令(修复后应全绿)
- 面条人:训练模式选草薙,`match.p1.fakeMotion('qcf'); keys['j']=1;` 按住 2.6s,逐帧 dump computeTargetPose,lean 恒 ≤0.06、hy 恒 ≥-60、无坐标跳变;
- 全状态:按上文清单逐 state×逐帧跑 5 条硬规则,三角色合计 ~100 状态变体 × 平均 40 帧 ≈ 1.3 万采样;
- AI 回归:乱按 600×3(kyo 全招含蓄力+iori),零 NaN/零错/粒子 ≤320;
- 截图:u7shots/v16-before-charge-noodle.png(修前,夜/码头舞台)/ v16-after-charge-fixed.png(修后,道场舞台)。
