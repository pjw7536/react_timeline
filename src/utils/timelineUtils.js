import { groupConfig } from "./timelineMeta";

/**
 * 원시 데이터를 vis-timeline이 이해할 수 있는 형태로 가공합니다.
 * groupKey: 어떤 타입인지 (예: EQP_STATUS)
 * data: 원본 데이터 배열
 * overallMaxTime: 마지막 아이템 끝 범위 (없으면 range.max)
 */
export const processData = (groupKey, data) => {
  const cfg = groupConfig[groupKey];
  const { columns, stateColors } = cfg;

  return data.map((row, idx) => {
    const start = new Date(row[columns.time]);
    const next = data[idx + 1];
    // 마지막 아이템은 range.max까지 끝이 연장됩니다.
    const end = next
      ? new Date(next[columns.time])
      : new Date(
          start.getFullYear(),
          start.getMonth(),
          start.getDate(),
          23,
          59,
          59
        );
    const state = row[columns.state];
    const colorCls = stateColors[state] ?? "bg-gray-300";
    const groupId =
      columns.groupBy && row[columns.groupBy] ? row[columns.groupBy] : groupKey;

    return {
      id: `${groupKey}-${idx}`,
      group: groupId,
      content: cfg.type === "range" ? undefined : row[columns.comment],
      start,
      end: cfg.type === "range" ? end : undefined,
      type: cfg.type,
      className: colorCls,
    };
  });
};

/**
 * ±3일 여유를 주는 범위 반환
 */
export const addBuffer = (min, max) => {
  const B = 3 * 24 * 60 * 60 * 1000;
  return { min: new Date(min - B), max: new Date(max + B) };
};

/**
 * 기본 타임라인 옵션
 */
export const baseOptions = (min, max) => ({
  stack: false,
  zoomMin: 1000 * 60 * 30,
  zoomMax: 1000 * 60 * 60 * 24 * 7,
  min,
  max,
});

/**
 * 여러 데이터(run/step/ev)에서 전체 시간 범위(min~max)를 계산합니다.
 */
export const calcRange = (...arrs) => {
  const ts = arrs
    .flat()
    .map((d) =>
      new Date(d.timestamp || d.start_time || d.occurred_at).getTime()
    );
  if (ts.length === 0) return { min: new Date(), max: new Date() };
  const min = new Date(Math.min(...ts));
  const max = new Date(Math.max(...ts));
  return { min, max };
};
