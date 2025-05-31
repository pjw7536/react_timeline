import { useRef, useEffect } from "react";
import { useSelection } from "../../context/SelectionContext";

/**
 * 여러 데이터 타입(RUN/STEP/EVENT 등)을 시간순으로 통합해서 보여주는 테이블입니다.
 * - data: [{displayTimestamp, type, info1, info2, info3, ...}] 형태의 배열
 */
const CombinedDataTable = ({ data }) => {
  const { selectedRow, setSelectedRow } = useSelection();
  const rowRefs = useRef({});

  useEffect(() => {
    if (selectedRow && rowRefs.current[selectedRow]) {
      rowRefs.current[selectedRow].scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    } else if (selectedRow) {
      // 렌더 타이밍 문제로 100ms 후 재시도
      setTimeout(() => {
        if (rowRefs.current[selectedRow]) {
          rowRefs.current[selectedRow].scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
        }
      }, 100);
    }
  }, [selectedRow, data]);

  // 데이터 없으면 안내 메시지
  if (!data || data.length === 0) {
    return (
      <p className="text-sm text-gray-500 dark:text-gray-400">
        표시할 데이터가 없습니다. 필터를 확인해주세요.
      </p>
    );
  }

  // 테이블 컬럼 정의
  const columns = [
    { header: "시간", accessor: "displayTimestamp" },
    { header: "타입", accessor: "type" },
    { header: "정보 1", accessor: "info1" },
    { header: "정보 2", accessor: "info2" },
  ];

  return (
    <div className="overflow-x-auto shadow-md sm:rounded-lg">
      <h3 className="text-lg font-semibold p-4 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white rounded-t-lg">
        통합 데이터 로그
      </h3>
      <div className="overflow-y-auto max-h-135 table-scroll">
        <table className="w-full text-sm text-center text-gray-800 dark:text-gray-200">
          <thead className="sticky top-0 bg-gray-50 text-gray-900 dark:bg-gray-600 dark:text-gray-100">
            <tr>
              {columns.map((col) => (
                <th key={col.accessor} className="px-6 py-3 font-semibold">
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((item) => {
              const rowId = item.id;
              const isSelected =
                String(rowId).trim() === String(selectedRow).trim();
              return (
                <tr
                  key={rowId}
                  ref={(el) => (rowRefs.current[rowId] = el)}
                  className={`transition-colors duration-300 ${
                    isSelected
                      ? "bg-yellow-100 dark:bg-yellow-800"
                      : "bg-white dark:bg-gray-800"
                  }`}
                  onClick={() => setSelectedRow(rowId, "table")}
                >
                  {columns.map((col) => (
                    <td key={col.accessor} className="px-6 py-4">
                      {item[col.accessor] || "-"}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CombinedDataTable;
