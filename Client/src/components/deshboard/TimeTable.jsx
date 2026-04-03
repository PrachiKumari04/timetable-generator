import React, { useState, useMemo } from "react";
import { useSelector } from "react-redux";

// Subject color mapping - each subject gets a unique color
const SUBJECT_COLORS = [
  { bg: "bg-blue-100", border: "border-blue-300", text: "text-blue-800", hover: "hover:bg-blue-200" },
  { bg: "bg-green-100", border: "border-green-300", text: "text-green-800", hover: "hover:bg-green-200" },
  { bg: "bg-purple-100", border: "border-purple-300", text: "text-purple-800", hover: "hover:bg-purple-200" },
  { bg: "bg-orange-100", border: "border-orange-300", text: "text-orange-800", hover: "hover:bg-orange-200" },
  { bg: "bg-pink-100", border: "border-pink-300", text: "text-pink-800", hover: "hover:bg-pink-200" },
  { bg: "bg-teal-100", border: "border-teal-300", text: "text-teal-800", hover: "hover:bg-teal-200" },
  { bg: "bg-indigo-100", border: "border-indigo-300", text: "text-indigo-800", hover: "hover:bg-indigo-200" },
  { bg: "bg-red-100", border: "border-red-300", text: "text-red-800", hover: "hover:bg-red-200" },
  { bg: "bg-yellow-100", border: "border-yellow-300", text: "text-yellow-800", hover: "hover:bg-yellow-200" },
  { bg: "bg-cyan-100", border: "border-cyan-300", text: "text-cyan-800", hover: "hover:bg-cyan-200" },
  { bg: "bg-lime-100", border: "border-lime-300", text: "text-lime-800", hover: "hover:bg-lime-200" },
  { bg: "bg-amber-100", border: "border-amber-300", text: "text-amber-800", hover: "hover:bg-amber-200" },
  { bg: "bg-emerald-100", border: "border-emerald-300", text: "text-emerald-800", hover: "hover:bg-emerald-200" },
  { bg: "bg-rose-100", border: "border-rose-300", text: "text-rose-800", hover: "hover:bg-rose-200" },
  { bg: "bg-violet-100", border: "border-violet-300", text: "text-violet-800", hover: "hover:bg-violet-200" },
];

// Days of the week
const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

// Time slots for the timetable (9 AM to 5 PM with breaks)
const TIME_SLOTS = [
  { time: "09:00 - 10:00", label: "Period 1" },
  { time: "10:00 - 11:00", label: "Period 2" },
  { time: "11:00 - 11:15", label: "Short Break", isBreak: true },
  { time: "11:15 - 12:15", label: "Period 3" },
  { time: "12:15 - 13:15", label: "Period 4" },
  { time: "13:15 - 14:00", label: "Lunch Break", isBreak: true },
  { time: "14:00 - 15:00", label: "Period 5" },
  { time: "15:00 - 16:00", label: "Period 6" },
  { time: "16:00 - 17:00", label: "Period 7" },
];

// Sample timetable data generator
const generateSampleTimetable = (classId, subjects) => {
  const timetable = {};
  
  DAYS.forEach((day) => {
    timetable[day] = {};
    TIME_SLOTS.forEach((slot, index) => {
      if (!slot.isBreak) {
        // Assign subjects randomly for demo purposes
        const subjectIndex = (index + DAYS.indexOf(day)) % (subjects?.length || 5);
        const subject = subjects?.[subjectIndex] || { subject_id: `SUB${subjectIndex + 1}`, subject_name: `Subject ${subjectIndex + 1}` };
        timetable[day][slot.time] = {
          subject: subject,
          faculty: "Dr. Faculty Name",
          room: `Room ${101 + (index % 5)}`,
        };
      }
    });
  });
  
  return timetable;
};

function TimeTable({ onClose }) {
  const masterData = useSelector((state) => state.admin.masterData);
  const classes = masterData.classes || [];
  const courses = masterData.course || [];
  const subjects = masterData.subject || [];

  // Filter states
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedDivision, setSelectedDivision] = useState("");

  // Generate subject color map
  const subjectColorMap = useMemo(() => {
    const map = {};
    subjects.forEach((subject, index) => {
      map[subject.subject_id] = SUBJECT_COLORS[index % SUBJECT_COLORS.length];
    });
    return map;
  }, [subjects]);

  // Get filtered classes based on course selection
  const filteredClasses = useMemo(() => {
    if (!selectedCourse) return classes;
    return classes.filter((cls) => 
      cls.course_id === selectedCourse || 
      cls.course_id?._id === selectedCourse
    );
  }, [classes, selectedCourse]);

  // Get divisions for selected class
  const divisions = masterData.division || [];
  const filteredDivisions = useMemo(() => {
    if (!selectedClass) return [];
    return divisions.filter((div) => 
      div.class_id === selectedClass || 
      div.class_id?._id === selectedClass
    );
  }, [divisions, selectedClass]);

  // Generate timetable data based on filters
  const timetableData = useMemo(() => {
    if (!selectedClass) return null;
    return generateSampleTimetable(selectedClass, subjects);
  }, [selectedClass, subjects]);

  // Get color for a subject
  const getSubjectColor = (subjectId) => {
    return subjectColorMap[subjectId] || SUBJECT_COLORS[0];
  };

  return (
    <div className="w-full h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-8 py-4 border-b border-border bg-surface">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold text-text">Timetable</h1>
          {onClose && (
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-text bg-surface-hover border border-border rounded-md hover:bg-border transition-colors"
            >
              Back to Dashboard
            </button>
          )}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-text/60">University Timetable System</span>
        </div>
      </header>

      {/* Filters */}
      <div className="px-8 py-4 bg-surface border-b border-border">
        <div className="flex flex-wrap items-center gap-4">
          {/* Course Filter */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-text/70">Course</label>
            <select
              value={selectedCourse}
              onChange={(e) => {
                setSelectedCourse(e.target.value);
                setSelectedClass("");
                setSelectedDivision("");
              }}
              className="px-3 py-2 text-sm border border-border rounded-md bg-surface text-text focus:outline-none focus:ring-2 focus:ring-primary/50 min-w-[150px]"
            >
              <option value="">Select Course</option>
              {courses.map((course) => (
                <option key={course._id || course.course_id} value={course._id || course.course_id}>
                  {course.course_name}
                </option>
              ))}
            </select>
          </div>

          {/* Class Filter */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-text/70">Class</label>
            <select
              value={selectedClass}
              onChange={(e) => {
                setSelectedClass(e.target.value);
                setSelectedDivision("");
              }}
              disabled={!selectedCourse}
              className="px-3 py-2 text-sm border border-border rounded-md bg-surface text-text focus:outline-none focus:ring-2 focus:ring-primary/50 min-w-[150px] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <option value="">Select Class</option>
              {filteredClasses.map((cls) => (
                <option key={cls._id || cls.class_id} value={cls._id || cls.class_id}>
                  {cls.class_id}
                </option>
              ))}
            </select>
          </div>

          {/* Division Filter */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-text/70">Division</label>
            <select
              value={selectedDivision}
              onChange={(e) => setSelectedDivision(e.target.value)}
              disabled={!selectedClass}
              className="px-3 py-2 text-sm border border-border rounded-md bg-surface text-text focus:outline-none focus:ring-2 focus:ring-primary/50 min-w-[150px] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <option value="">Select Division</option>
              {filteredDivisions.map((div) => (
                <option key={div._id || div.section_name} value={div._id || div.section_name}>
                  {div.section_name}
                </option>
              ))}
            </select>
          </div>

          {/* Clear Filters Button */}
          {(selectedCourse || selectedClass || selectedDivision) && (
            <button
              onClick={() => {
                setSelectedCourse("");
                setSelectedClass("");
                setSelectedDivision("");
              }}
              className="mt-5 px-4 py-2 text-sm font-medium text-red-600 bg-red-50 border border-red-200 rounded-md hover:bg-red-100 transition-colors"
            >
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* Timetable Display */}
      <div className="flex-1 overflow-auto p-8">
        {!selectedClass ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <svg
              className="w-24 h-24 mb-6 text-text/30"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <h3 className="text-xl font-semibold text-text/60 mb-2">
              Select Filters to View Timetable
            </h3>
            <p className="text-base text-text/50">
              Please select a course and class to display the timetable.
            </p>
          </div>
        ) : (
          <div className="bg-surface rounded-lg shadow-lg overflow-hidden border border-border">
            {/* Timetable Header */}
            <div className="px-6 py-4 border-b border-border bg-surface-hover">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-text">
                    Class: {selectedClass}
                    {selectedDivision && ` - Division: ${selectedDivision}`}
                  </h2>
                  <p className="text-sm text-text/60 mt-1">
                    Academic Year 2024-2025
                  </p>
                </div>
                <div className="flex items-center gap-4 text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded bg-blue-100 border border-blue-300"></div>
                    <span className="text-text/60">Theory</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded bg-gray-100 border border-gray-300"></div>
                    <span className="text-text/60">Break</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Timetable Grid */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-surface-hover">
                    <th className="px-4 py-3 text-left text-xs font-semibold text-text/70 border-b border-r border-border w-32">
                      Time / Day
                    </th>
                    {DAYS.map((day) => (
                      <th
                        key={day}
                        className="px-4 py-3 text-center text-xs font-semibold text-text border-b border-r border-border min-w-[140px]"
                      >
                        {day}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {TIME_SLOTS.map((slot, slotIndex) => (
                    <tr key={slot.time} className={slot.isBreak ? "bg-gray-50 dark:bg-gray-800/30" : ""}>
                      <td className="px-4 py-3 text-xs font-medium text-text/70 border-b border-r border-border bg-surface-hover">
                        <div className="flex flex-col">
                          <span>{slot.time}</span>
                          <span className="text-text/50 text-[10px]">{slot.label}</span>
                        </div>
                      </td>
                      {DAYS.map((day) => (
                        <td
                          key={`${day}-${slot.time}`}
                          className={`px-2 py-2 border-b border-r border-border ${
                            slot.isBreak ? "text-center" : ""
                          }`}
                        >
                          {slot.isBreak ? (
                            <div className="flex flex-col items-center justify-center h-full">
                              <span className="text-xs font-medium text-text/50">
                                {slot.label === "Short Break" ? "☕ Short Break" : "🍽️ Lunch Break"}
                              </span>
                            </div>
                          ) : (
                            timetableData?.[day]?.[slot.time] && (
                              <div
                                className={`p-2 rounded-md border text-center transition-all cursor-pointer ${
                                  getSubjectColor(timetableData[day][slot.time].subject.subject_id).bg
                                } ${
                                  getSubjectColor(timetableData[day][slot.time].subject.subject_id).border
                                } ${
                                  getSubjectColor(timetableData[day][slot.time].subject.subject_id).hover
                                }`}
                              >
                                <div
                                  className={`text-xs font-semibold ${
                                    getSubjectColor(timetableData[day][slot.time].subject.subject_id).text
                                  }`}
                                >
                                  {timetableData[day][slot.time].subject.subject_name}
                                </div>
                                <div className="text-[10px] text-text/60 mt-1">
                                  {timetableData[day][slot.time].room}
                                </div>
                              </div>
                            )
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Subject Legend */}
            <div className="px-6 py-4 border-t border-border bg-surface-hover">
              <h4 className="text-sm font-semibold text-text mb-3">Subject Legend</h4>
              <div className="flex flex-wrap gap-3">
                {subjects.slice(0, 10).map((subject, index) => (
                  <div
                    key={subject.subject_id}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-md border ${
                      SUBJECT_COLORS[index % SUBJECT_COLORS.length].bg
                    } ${SUBJECT_COLORS[index % SUBJECT_COLORS.length].border}`}
                  >
                    <div
                      className={`w-2 h-2 rounded-full ${
                        SUBJECT_COLORS[index % SUBJECT_COLORS.length].text.replace("text-", "bg-")
                      }`}
                    ></div>
                    <span
                      className={`text-xs font-medium ${
                        SUBJECT_COLORS[index % SUBJECT_COLORS.length].text
                      }`}
                    >
                      {subject.subject_id}: {subject.subject_name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default TimeTable;
