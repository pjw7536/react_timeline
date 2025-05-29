import React from "react";

/**
 * EVENT 로그 전용 테이블.
 * - data: [{ occurred_at, event_type, comment }]
 */
const RACBLogTable = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <p className="text-sm text-gray-500 dark:text-gray-400">
        이벤트 로그 데이터가 없습니다.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto shadow-md sm:rounded-lg">
      <h3 className="text-lg font-semibold p-4 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white rounded-t-lg">
        이벤트 로그
      </h3>
      <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" className="px-6 py-3">
              발생 시간
            </th>
            <th scope="col" className="px-6 py-3">
              이벤트 타입
            </th>
            <th scope="col" className="px-6 py-3">
              코멘트
            </th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr
              key={index}
              className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
            >
              <td className="px-6 py-4 whitespace-nowrap">
                {new Date(item.occurred_at).toLocaleString()}
              </td>
              <td className="px-6 py-4">{item.event_type}</td>
              <td className="px-6 py-4">{item.comment}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RACBLogTable;
