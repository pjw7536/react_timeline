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
 * 통일된 BaseLog 구조의 로그 배열을 vis-timeline 아이템으로 변환
 * @param {string} logType - 예: EQP_LOG, TIP_LOG 등
 * @param {BaseLog[]} data - 해당 로그 타입의 데이터 배열
 * @returns vis-timeline items[]
 */
export const processData = (logType, data) => {
  const cfg = groupConfig[logType];
  if (!cfg) {
    console.warn(`[processData] 그룹 설정이 없습니다: ${logType}`);
    return [];
  }

  return data
    .filter((log) => log && log.eventTime)
    .map((log) => {
      const start = new Date(log.eventTime);
      const end = log.endTime ? new Date(log.endTime) : start;
      const isRange = !!log.endTime;
      const state = log.eventType;
      const colorCls = cfg.stateColors[state] || "bg-gray-300";

      return {
        id: log.id,
        group: logType,
        content: log.comment || "", // 간단한 주석 표시
        start,
        end,
        type: isRange ? "range" : "point",
        className: colorCls,
        title: [
          log.comment,
          log.operator ? `👤 ${log.operator}` : null,
          log.url ? `🔗 ${log.url}` : null,
        ]
          .filter(Boolean)
          .join("\n"),
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
    .flatMap((d) => [
      new Date(d.eventTime).getTime(),
      d.endTime ? new Date(d.endTime).getTime() : undefined,
    ])
    .filter(Boolean);
  if (ts.length === 0) return { min: new Date(), max: new Date() };
  const min = new Date(Math.min(...ts));
  const max = new Date(Math.max(...ts));
  return { min, max };
};
