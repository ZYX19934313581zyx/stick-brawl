# FK 反关节探针(P8)

用法:①在 computeTargetPose 的 return 前插一行钩子(见下);②浏览器进对局后 evaluate 跑审计体;③验收 kF-tF ≤ 0.2 全绿;④用完删钩子。

钩子行:
    if (window.__auditOn) (window.__auditRows = window.__auditRows || []).push([s, +(this.st || 0).toFixed(2), tF, kF, tB, kB]);

审计体:见 git 历史或夜间日志(P8),遍历 33 状态 × 8-24 帧,违规判定 kF-tF > 0.2。

屈膝铁律:自然屈膝必须小腿角(kF)≤大腿角(tF),kF-tF>0.2 即鸟膝。
