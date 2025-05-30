import { useContext, useEffect, useRef, useMemo } from "react";
import { Timeline, DataSet } from "vis-timeline/standalone";
import { TimelineContext } from "../../../context/TimelineProvider";
import { processData } from "../../../utils/timelineUtils";
import { groupConfig } from "../../../utils/timelineMeta";
import moment from "moment";
import "moment/locale/ko";
moment.locale("ko");
/**
 * 실제 vis-timeline 인스턴스를 생성/업데이트/해제하는 역할을 하는 커스텀 훅입니다.
 * - 타임라인 인스턴스의 X축 동기화, 옵션 변화 반영 등을 관리합니다.
 */
export const useTimelineRenderer = (containerRef, groupKey, data, range) => {
  const tlRef = useRef(null); // 타임라인 인스턴스 참조
  const { poolRef, register, unregister } = useContext(TimelineContext);

  // 그룹별 옵션 (useMemo로 캐싱)
  const groupOptions = useMemo(() => {
    return groupConfig[groupKey]?.options ?? {};
  }, [groupKey]);

  // 1. 타임라인 인스턴스 생성 및 파괴
  useEffect(() => {
    if (!containerRef.current) return;

    // 타임라인 옵션 설정 (X축 min/max 포함)
    const initialMergedOptions = {
      stack: false,
      zoomMin: 1000 * 60 * 30,
      zoomMax: 1000 * 60 * 60 * 24 * 30,
      ...groupOptions,
      min: range.min,
      max: range.max,
      locale: "ko", // 브라우저가 지원해야 제대로 나옴
      format: {
        minorLabels: {
          millisecond: "SSS",
          second: "s초",
          minute: "HH:mm",
          hour: "HH:mm",
          weekday: "MM/DD(ddd)", // 예: 05/21(수)
          day: "DD(ddd)",
          week: "w주",
          month: "MM월",
          year: "YY년",
        },
        majorLabels: {
          millisecond: "HH:mm:ss",
          second: "DD일 HH:mm",
          minute: "MM/DD(ddd)",
          hour: "MM/DD(ddd)",
          weekday: "YYYY/MM",
          day: "YYYY/MM",
          week: "YYYY/MM",
          month: "YYYY년",
          year: "",
        },
      },
    };

    // 데이터 가공 및 타임라인 생성
    const items = new DataSet(processData(groupKey, data, range.max));
    tlRef.current = new Timeline(
      containerRef.current,
      items,
      initialMergedOptions
    );
    tlRef.current.setWindow(range.min, range.max); // 최초 보이는 구간

    // 타임라인 pool에 등록 (동기화 위해)
    register(tlRef.current);

    // X축 동기화: 다른 타임라인도 같이 움직이게 함
    const currentTl = tlRef.current;
    const handleRangeChange = ({ start, end }) => {
      poolRef.current.forEach((tl) => {
        if (tl !== currentTl) {
          tl.setWindow(start, end, { animation: false });
        }
      });
    };
    currentTl.on("rangechange", handleRangeChange);

    // 언마운트시: pool 해제 + 이벤트 해제 + 파괴
    return () => {
      unregister(currentTl);
      currentTl.off("rangechange", handleRangeChange);
      currentTl.destroy();
      tlRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [containerRef, groupKey, poolRef, register, unregister]);

  // 2. 데이터가 바뀔 때마다 타임라인 데이터만 갱신
  useEffect(() => {
    if (tlRef.current) {
      tlRef.current.setItems(
        new DataSet(processData(groupKey, data, range.max))
      );
    }
  }, [data, groupKey, range.max]);

  // 3. range(구간), 옵션 등이 바뀔 때마다 타임라인 옵션 및 윈도우 업데이트
  useEffect(() => {
    if (tlRef.current) {
      const updatedMergedOptions = {
        stack: false,
        zoomMin: 1000 * 60 * 30,
        zoomMax: 1000 * 60 * 60 * 24 * 30,
        ...groupOptions,
        min: range.min,
        max: range.max,
      };
      tlRef.current.setOptions(updatedMergedOptions);
      tlRef.current.setWindow(range.min, range.max);
    }
  }, [range, groupOptions]);

  return tlRef;
};
