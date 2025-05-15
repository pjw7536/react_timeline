import { groupConfig } from "./timelineMeta";

/* 데이터 → vis-timeline 아이템 변환 */
export const processData = (groupKey, data) => {
  const cfg = groupConfig[groupKey];
  const { columns, stateColors } = cfg;

  return data.map((row, idx) => {
    const start = new Date(row[columns.time]);
    const next = data[idx + 1];
    const end = next
      ? new Date(next[columns.time])
      : new Date(start).setHours(23, 59, 59, 999);

    const state = row[columns.state];
    const colorCls = stateColors[state] ?? "bg-gray-300";
    const groupId =
      columns.groupBy && row[columns.groupBy] ? row[columns.groupBy] : groupKey;

    return {
      id: `${groupKey}-${idx}`,
      group: groupId, // PPID 그룹핑(STEP용)
      content: row[columns.comment],
      start,
      end: cfg.type === "range" ? end : undefined,
      type: cfg.type,
      className: colorCls,
    };
  });
};

/* ±10일 여유 범위 */
export const addBuffer = (min, max) => {
  const B = 10 * 24 * 60 * 60 * 1000;
  return { min: new Date(min - B), max: new Date(max + B) };
};

/* 공통 옵션 */
export const baseOptions = (min, max) => ({
  stack: false,
  zoomMin: 1000 * 60 * 30,
  zoomMax: 1000 * 60 * 60 * 24 * 7,
  min,
  max,
});

/* 선택 EQP 전체 범위 */
export const calcRange = (run, step, ev) => {
  const ts = [...run, ...step, ...ev].map((d) =>
    new Date(d.timestamp || d.start_time || d.occurred_at).getTime()
  );
  const min = new Date(Math.min(...ts));
  const max = new Date(Math.max(...ts));
  return { min, max };
};
