import { groupConfig } from "./timelineMeta";

/**
 * group: "RACB_LOG", time: Date 또는 String (ISO)
 * 항상 3자리 ms 포맷으로 id 생성 (예: RACB_LOG-2025-05-26T15:01:01.389Z)
 */
export const makeItemId = (group, time) => {
  // time은 Date 또는 ISO String
  let d = time instanceof Date ? time : new Date(time);

  // ISO 문자열로 변환 (항상 3자리 ms로 강제)
  let iso = d.toISOString();
  // 1) 소수점 없으면 붙이기 (.000)
  if (!iso.includes(".")) {
    iso = iso.replace("Z", ".000Z");
  }
  // 2) 소수점 뒤가 3자리보다 짧으면 패딩, 길면 자르기
  iso = iso.replace(
    /\.(\d{1,6})Z$/,
    (_, ms) => `.${ms.padEnd(3, "0").slice(0, 3)}Z`
  );
  return `${group}-${iso}`;
};

/**
 * vis-timeline 데이터 변환 함수 (모든 group에서 makeItemId만 사용!)
 */
export const processData = (groupKey, data) => {
  const cfg = groupConfig[groupKey];
  const { columns, stateColors } = cfg;

  return data
    .filter((row) => row && row[columns.time])
    .map((row) => {
      const start = new Date(row[columns.time]);
      const next = data[data.indexOf(row) + 1];
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
        columns.groupBy && row[columns.groupBy]
          ? row[columns.groupBy]
          : groupKey;

      // point 타입일 때 end=start로
      const isPoint = cfg.type === "point";
      return {
        id: makeItemId(groupKey, row[columns.time]),
        group: groupId,
        content: cfg.type === "range" ? undefined : row[columns.comment],
        start,
        end: isPoint ? start : end, // <-- 여기! point도 end=start!
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
