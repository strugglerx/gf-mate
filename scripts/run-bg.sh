#!/bin/bash
# run-bg.sh — 后台长任务的「完成必通知」包装器
#
# 用法: ./scripts/run-bg.sh <任务ID> <命令...>
# 效果:
#   1. 任务结束时写状态文件 /tmp/dq-tasks/<ID>.status（exit code + 起止时间 + 日志位置）
#   2. 弹 macOS 系统通知（成功/失败不同提示音），即使 agent 会话不在运行，用户也能看到
#   3. 日志全程写入 /tmp/dq-tasks/<ID>.log
#
# agent 侧约定：派发后台任务后，用 `cat /tmp/dq-tasks/<ID>.status` 轮询即可知道是否完成，
# 不需要猜。状态文件存在 = 已结束。

set -u
ID="$1"; shift
DIR=/tmp/dq-tasks
mkdir -p "$DIR"
LOG="$DIR/$ID.log"
STATUS="$DIR/$ID.status"
rm -f "$STATUS"

START=$(date +%s)
"$@" >"$LOG" 2>&1
CODE=$?
END=$(date +%s)
DUR=$((END - START))

cat >"$STATUS" <<EOF
id=$ID
exit=$CODE
started=$START
ended=$END
duration=${DUR}s
log=$LOG
EOF

if [ $CODE -eq 0 ]; then
  osascript -e "display notification \"任务 $ID 成功完成（${DUR}s）\" with title \"gf-mate 后台任务\" sound name \"Glass\"" 2>/dev/null || true
else
  osascript -e "display notification \"任务 $ID 失败（exit=$CODE，${DUR}s），查看 $LOG\" with title \"gf-mate 后台任务\" sound name \"Basso\"" 2>/dev/null || true
fi
exit $CODE
