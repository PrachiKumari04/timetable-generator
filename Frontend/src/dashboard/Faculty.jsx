import React, { useEffect, useState } from "react";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
const PERIODS = ["1", "2", "3", "4", "5", "6", "7", "8"];

export default function Faculty() {
  const [masterData, setMasterData] = useState(null);
  const [timetables, setTimetables] = useState(null);
  const [selectedFacultyId, setSelectedFacultyId] = useState("");

  useEffect(() => {
    try {
      const md = window.localStorage.getItem("tt_masterData");
      const tt = window.localStorage.getItem("tt_timetables");
      setMasterData(md ? JSON.parse(md) : {});
      setTimetables(tt ? JSON.parse(tt) : {});
    } catch {
      setMasterData({});
      setTimetables({});
    }
  }, []);

  if (!masterData || !timetables) {
    return (
      <div className="text-sm text-gray-600">
        Loading timetable data from admin...
      </div>
    );
  }

  const facultyList = masterData.faculty || [];

  const getSubjectLabel = (subjectCode) => {
    if (!subjectCode) return "";
    const subjects = masterData.subject || [];
    const match =
      subjects.find((s) => s.code === subjectCode) ||
      subjects.find((s) => s.name === subjectCode);
    if (!match) return subjectCode;
    return `${match.code} - ${match.name}`;
  };

  const getFacultyLabel = (facultyId) => {
    if (!facultyId) return "";
    const list = masterData.faculty || [];
    const match = list.find((f) => f.employeeId === facultyId);
    if (!match) return facultyId;
    return `${match.name} (${match.employeeId})`;
  };

  const getCellAssignments = (day, period) => {
    if (!selectedFacultyId) return [];
    const result = [];
    Object.entries(timetables || {}).forEach(([classCode, data]) => {
      const cell = data.grid?.[day]?.[period];
      if (!cell) return;
      if (cell.facultyId === selectedFacultyId) {
        result.push({
          classCode,
          subjectCode: cell.subjectCode,
          room: cell.room,
        });
      }
    });
    return result;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">
            Faculty Timetable
          </h1>
          <p className="text-xs text-gray-500">
            View read-only weekly schedule for a faculty member.
          </p>
        </div>
      </div>

      {!facultyList.length && (
        <div className="border border-dashed border-gray-300 rounded-xl p-4 text-sm text-gray-500">
          No faculty records found. Please contact admin to add faculty and
          assign them in timetables.
        </div>
      )}

      {facultyList.length > 0 && (
        <>
          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-700">
              Select faculty
            </label>
            <select
              value={selectedFacultyId}
              onChange={(e) => setSelectedFacultyId(e.target.value)}
              className="px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Choose faculty</option>
              {facultyList.map((f) => (
                <option key={f.id} value={f.employeeId}>
                  {f.name} ({f.employeeId})
                </option>
              ))}
            </select>
          </div>

          {!selectedFacultyId && (
            <div className="border border-dashed border-gray-300 rounded-xl p-4 text-xs text-gray-500">
              Choose a faculty member to view their timetable.
            </div>
          )}

          {selectedFacultyId && (
            <div className="space-y-3">
              <div className="text-sm text-gray-700">
                Timetable for{" "}
                <span className="font-semibold">
                  {getFacultyLabel(selectedFacultyId)}
                </span>
              </div>

              <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white max-h-[520px]">
                <table className="min-w-full text-xs">
                  <thead className="bg-gray-100 sticky top-0 z-10">
                    <tr>
                      <th className="px-2 py-2 text-left font-semibold text-gray-700">
                        Day / Period
                      </th>
                      {PERIODS.map((p) => (
                        <th
                          key={p}
                          className="px-2 py-2 text-center font-semibold text-gray-700"
                        >
                          {p}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {DAYS.map((day) => (
                      <tr key={day} className="border-t border-gray-100">
                        <td className="px-2 py-2 text-xs font-medium text-gray-700 whitespace-nowrap bg-gray-50">
                          {day}
                        </td>
                        {PERIODS.map((p) => {
                          const assignments = getCellAssignments(day, p);
                          const hasAny = assignments.length > 0;
                          return (
                            <td
                              key={p}
                              className={`px-2 py-2 align-top min-w-[180px] ${
                                hasAny ? "bg-white" : "bg-gray-50"
                              }`}
                            >
                              {hasAny ? (
                                <div className="space-y-1">
                                  {assignments.map((a, idx) => (
                                    <div key={idx} className="space-y-0.5">
                                      <div className="font-medium text-[11px] text-gray-900">
                                        {getSubjectLabel(a.subjectCode)}
                                      </div>
                                      <div className="text-[11px] text-gray-600">
                                        Class: {a.classCode}
                                      </div>
                                      {a.room && (
                                        <div className="text-[10px] text-gray-400">
                                          Room: {a.room}
                                        </div>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <div className="text-[10px] text-gray-300 text-center">
                                  Free
                                </div>
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
