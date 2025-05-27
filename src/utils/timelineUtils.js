import { groupConfig } from "./timelineMeta";

/* 데이터 → vis-timeline 아이템 변환 */
export const processData = (groupKey, data, overallMaxTime) => {
  const cfg = groupConfig[groupKey];
  const { columns, stateColors } = cfg;

  return data.map((row, idx) => {
    const start = new Date(row[columns.time]);
    const next = data[idx + 1];
    // For the last item in a group, if it's a range type,
    // its end time should extend to the overall maximum time of the timeline view.
    const end = next
      ? new Date(next[columns.time])
      : overallMaxTime;

    const state = row[columns.state];
    const colorCls = stateColors[state] ?? "bg-gray-300";
    const groupId =
      columns.groupBy && row[columns.groupBy] ? row[columns.groupBy] : groupKey;

    return {
      id: `${groupKey}-${idx}`,
      group: groupId, // PPID 그룹핑(STEP용)
      content: cfg.type === "range" ? undefined : row[columns.comment],
      start,
      end: cfg.type === "range" ? end : undefined,
      type: cfg.type,
      className: colorCls,
    };
  });
};

/* ±10일 여유 범위 */
export const addBuffer = (min, max) => {
  const B = 30 * 24 * 60 * 60 * 1000;
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
  // This function assumes that each data object (from run, step, ev) has only ONE primary timestamp field
  // among 'timestamp', 'start_time', or 'occurred_at'.
  // If an object inadvertently contains multiple of these fields, the OR (||) operator
  // will pick the first truthy value, which might lead to unexpected calculations if not intended.
  // It's crucial that the data sources (useRunStatus, useStepStatus, useEventLog) provide clean data
  // where each type of event uses its specific and consistent time field.
  const ts = [...run, ...step, ...ev].map((d) =>
    new Date(d.timestamp || d.start_time || d.occurred_at).getTime()
  );
  const min = new Date(Math.min(...ts));
  const max = new Date(Math.max(...ts));
  return { min, max };
};
