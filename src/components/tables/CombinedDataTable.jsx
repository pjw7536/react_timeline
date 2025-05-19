import React from "react";

// 모든 데이터를 통합하여 표시하는 테이블 컴포넌트
const CombinedDataTable = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <p className="text-sm text-gray-500 dark:text-gray-400">
        표시할 데이터가 없습니다. 필터를 확인해주세요.
      </p>
    );
  }

  // 컬럼 정의 (데이터 구조에 따라 유연하게 조정 가능)
  const columns = [
    { header: "시간", accessor: "displayTimestamp" },
    { header: "타입", accessor: "type" },
    { header: "정보 1", accessor: "info1" },
    { header: "정보 2", accessor: "info2" },
    { header: "정보 3", accessor: "info3" },
  ];

  return (
    <div className="overflow-x-auto shadow-md sm:rounded-lg">
      <h3 className="text-lg font-semibold p-4 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white rounded-t-lg">
        통합 데이터 로그
      </h3>
      <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            {columns.map((col) => (
              <th
                key={col.accessor}
                scope="col"
                className="px-6 py-3 whitespace-nowrap"
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr
              key={index}
              className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
            >
              {columns.map((col) => (
                <td key={col.accessor} className="px-6 py-4 whitespace-nowrap">
                  {item[col.accessor] || "-"}{" "}
                  {/* 데이터가 없는 경우 '-' 표시 */}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CombinedDataTable;
