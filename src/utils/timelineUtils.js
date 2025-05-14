import { groupConfig } from "../data/groupConfig";

/**
 * 데이터 가공 함수
 */
export const processData = (groupKey, data, renderType) => {
  const { columns, stateColors } = groupConfig[groupKey];

  return data.map((item, index) => {
    const start = new Date(item[columns.time]);
    const nextItem = data[index + 1];
    const end = nextItem
      ? new Date(nextItem[columns.time])
      : new Date(start).setHours(23, 59, 59, 999);

    const state = item[columns.state];
    const comment = item[columns.comment];
    const colorClass = stateColors[state] || "bg-gray-300";

    return {
      id: `${groupKey}-${index}`,
      group: groupKey,
      content: comment,
      start,
      end: renderType === "range" ? end : undefined,
      type: renderType,
      className: colorClass,
    };
  });
};

/**
 * x축 범위를 ±10일로 조정
 */
export const adjustTimeRange = (min, max) => {
  const TEN_DAYS_MS = 10 * 24 * 60 * 60 * 1000;
  return {
    adjustedMin: new Date(min.getTime() - TEN_DAYS_MS),
    adjustedMax: new Date(max.getTime() + TEN_DAYS_MS),
  };
};

/**
 * 타임라인 옵션 생성 함수
 */
export const generateOptions = (min, max) => {
  return {
    stack: false,
    showCurrentTime: true,
    zoomMin: 1000 * 60 * 30,
    zoomMax: 1000 * 60 * 60 * 24 * 7,
    min,
    max,
  };
};

/**
 * 공통 범위 계산 함수
 */

export const calculateGlobalRange = (groupData) => {
  const allTimestamps = Object.values(groupData)
    .flat()
    .map((item) => {
      const time = item.timestamp || item.event_time || item.occurred_at;
      return new Date(time).getTime(); // ✅ ISO 8601 문자열을 직접 Date로 변환
    });

  if (allTimestamps.length === 0) {
    const now = new Date();
    return {
      minTime: new Date(now.getTime() - 24 * 60 * 60 * 1000),
      maxTime: new Date(now.getTime() + 24 * 60 * 60 * 1000),
    };
  }

  const minTime = new Date(Math.min(...allTimestamps));
  const maxTime = new Date(Math.max(...allTimestamps));

  return { minTime, maxTime };
};
