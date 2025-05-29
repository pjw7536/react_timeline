import React from "react";

/**
 * 공정 단계(STEP)별 상태를 보여주는 테이블.
 * - data: [{ start_time, step, ppid, state }]
 */
const TIPLogTable = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <p className="text-sm text-gray-500 dark:text-gray-400">
        공정 STEP 데이터가 없습니다.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto shadow-md sm:rounded-lg">
      <h3 className="text-lg font-semibold p-4 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white rounded-t-lg">
        공정 STEP 상태
      </h3>
      <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" className="px-6 py-3">
              시작 시간
            </th>
            <th scope="col" className="px-6 py-3">
              STEP
            </th>
            <th scope="col" className="px-6 py-3">
              PPID
            </th>
            <th scope="col" className="px-6 py-3">
              상태
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
                {new Date(item.start_time).toLocaleString()}
              </td>
              <td className="px-6 py-4">{item.step}</td>
              <td className="px-6 py-4">{item.ppid}</td>
              <td className="px-6 py-4">{item.state}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TIPLogTable;
