import React, { useState, useRef, useCallback } from "react";
import { useSelector } from "react-redux";
import apiClient from "../../services/apiClient";
import { toPng } from "html-to-image";

//* Subject color mapping for different subjects
const SUBJECT_COLORS = {
  "Data Analytics & Visualization": { bg: "bg-green-700", text: "text-white" },
  "Ethical Hacking & security operations": { bg: "bg-green-700", text: "text-white" },
  "Operating System": { bg: "bg-red-900", text: "text-white" },
  "Accounting & Financial Management": { bg: "bg-yellow-600", text: "text-white" },
  "Core Java Programming": { bg: "bg-orange-500", text: "text-white" },
  "Web Technologies": { bg: "bg-green-500", text: "text-white" },
  "ADBM": { bg: "bg-yellow-700", text: "text-white" },
  "DAA": { bg: "bg-blue-900", text: "text-white" },
  "Advanced Database Management System": { bg: "bg-yellow-800", text: "text-white" },
  "Logical Aptitude": { bg: "bg-gray-700", text: "text-white" },
  "Mentorship": { bg: "bg-gray-600", text: "text-white" },
  "Guest Lecture": { bg: "bg-cyan-400", text: "text-black" },
  "Lab": { bg: "bg-green-600", text: "text-white" },
  "Business Essentials": { bg: "bg-green-600", text: "text-white" },
  default: { bg: "bg-gray-500", text: "text-white" },
};

//* Time slots configuration
const TIME_SLOTS = [
  { time: "8:40 am to 9:40 am", label: "1" },
  { time: "9:40 a.m. to 10:40 am", label: "2" },
  { time: "10:40 am to 10:50 am", label: "SHORT BREAK", isBreak: true },
  { time: "10:50 am to 11:50 am", label: "3" },
  { time: "11.50 am to 12.50 pm", label: "4" },
  { time: "12.50 pm to 1.20 pm", label: "LUNCH BREAK", isBreak: true },
  { time: "1:20 pm to 2:20 pm", label: "5" },
  { time: "2:20 pm to 3:20 pm", label: "6" },
  { time: "3:20 pm to 3:30 pm", label: "SHORT BREAK", isBreak: true },
  { time: "3:30 pm to 4:30 pm", label: "7" },
];

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

//* Sample timetable data based on the image
const SAMPLE_TIMETABLE_DATA = {
  monday: [
    { subject: "Data Analytics & Visualization/Ethical Hacking & security operations", faculty: "", room: "" },
    { subject: "Operating System", faculty: "", room: "" },
    null,
    { subject: "ADBMS", faculty: "", room: "" },
    { subject: "Accounting & Financial Management", faculty: "", room: "" },
    null,
    { subject: "Lab - I Business Essentials & Java Programming Lab Div C (WT) DS", faculty: "", room: "" },
    null,
    null,
    { subject: "Logical Aptitude -Prof.Kemachndra", faculty: "", room: "" },
  ],
  tuesday: [
    { subject: "Accounting & Financial Management", faculty: "", room: "" },
    { subject: "Data Analytics & Visualization/Ethical Hacking & security operations", faculty: "", room: "" },
    null,
    { subject: "Web Technologies", faculty: "", room: "" },
    { subject: "ADBMS", faculty: "", room: "" },
    null,
    { subject: "Advanced Database Management System & Operating System( Linux) Div B (HP)", faculty: "", room: "" },
    null,
    null,
    { subject: "Accounting & Financial Management Excel", faculty: "", room: "" },
  ],
  wednesday: [
    { subject: "Core Java Programming", faculty: "", room: "" },
    { subject: "Operating System", faculty: "", room: "" },
    null,
    { subject: "DAA", faculty: "", room: "" },
    { subject: "ADBMS", faculty: "", room: "" },
    null,
    { subject: "Data Analytics & Visualization/Ethical Hacking & security operations", faculty: "", room: "" },
    { subject: "Logical Aptitude -Prof.Kemachndra", faculty: "", room: "" },
    null,
    { subject: "Accounting & Financial Management", faculty: "", room: "" },
  ],
  thursday: [
    { subject: "Lab - I Business Essentials & Java Programming Lab C", faculty: "", room: "" },
    null,
    null,
    { subject: "DAA", faculty: "", room: "" },
    { subject: "Web Technologies", faculty: "", room: "" },
    null,
    { subject: "Core Java Programming", faculty: "", room: "" },
    { subject: "Logical Aptitude -Prof.Kemachndra", faculty: "", room: "" },
    null,
    { subject: "Logical Aptitude -Prof.Kemachndra", faculty: "", room: "" },
  ],
  friday: [
    { subject: "Core Java Programming", faculty: "", room: "" },
    { subject: "Web Technologies", faculty: "", room: "" },
    null,
    { subject: "Advanced Database Management System & Operating System( Linux) Div D(VC)", faculty: "", room: "" },
    null,
    null,
    { subject: "Operating System", faculty: "", room: "" },
    { subject: "DAA", faculty: "", room: "" },
    null,
    { subject: "Mentorship", faculty: "", room: "" },
  ],
  saturday: [
    null,
    null,
    null,
    { subject: "Guest Lecture / Library", faculty: "", room: "" },
    { subject: "Guest Lecture / Library", faculty: "", room: "" },
    null,
    null,
    null,
    null,
    null,
  ],
};

//! Get color for a subject
const getSubjectColor = (subject) => {
  if (!subject) return { bg: "bg-transparent", text: "text-transparent" };
  
  for (const [key, color] of Object.entries(SUBJECT_COLORS)) {
    if (subject.toLowerCase().includes(key.toLowerCase())) {
      return color;
    }
  }
  
  // Consistent color generation using hash of subject name
  let hash = 0;
  for (let i = 0; i < subject.length; i++) {
    hash = subject.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  // Choose beautiful, professional dark-toned HSL values
  const h = Math.abs(hash) % 360;
  return {
    bg: `hsl(${h}, 55%, 35%)`,
    text: "text-white",
    isCustomHSL: true
  };
};

// Timetable Header Component
const TimetableHeader = ({ collegeInfo, onPrint, onExport, onRefresh }) => (
  <div className="bg-black text-white p-4">
    <div className="text-center space-y-1">
      <h1 className="text-xl font-bold tracking-wide">{collegeInfo.name}</h1>
      <div className="flex justify-center items-center gap-8 text-sm">
        <span className="font-semibold">{collegeInfo.batch}</span>
        <span className="font-semibold">{collegeInfo.semester}</span>
        <span>Effective From {collegeInfo.effectiveDate}</span>
      </div>
      <div className="flex justify-center items-center gap-8 text-sm pt-1">
        <span className="font-semibold">{collegeInfo.classInfo}</span>
        <span>Class Teacher - {collegeInfo.classTeacher}</span>
        <span>Class Room No - {collegeInfo.roomNo}</span>
      </div>
    </div>
  </div>
);

// Action Buttons Component
const ActionButtons = ({ onPrint, onExport, onRefresh, onGenerate, viewMode, setViewMode, isRefreshing, isExporting, isAdmin, selectedDivision, setSelectedDivision, role }) => (
  <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-surface border-b border-border">
    <div className="flex items-center gap-2">
      <button
        onClick={() => setViewMode("week")}
        className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
          viewMode === "week"
            ? "bg-primary text-white"
            : "bg-surface-hover border border-border text-text hover:bg-border"
        }`}
      >
        Week View
      </button>
      <button
        onClick={() => setViewMode("day")}
        className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
          viewMode === "day"
            ? "bg-primary text-white"
            : "bg-surface-hover border border-border text-text hover:bg-border"
        }`}
      >
        Day View
      </button>

      {role !== "student" && (
        <div className="flex items-center gap-2 ml-4">
          <span className="text-sm font-medium text-text/80">Division:</span>
          <select
            value={selectedDivision}
            onChange={(e) => setSelectedDivision(e.target.value)}
            className="px-3 py-1.5 border border-border bg-background rounded-md text-text text-sm focus:outline-none focus:border-primary"
          >
            <option value="D001">A</option>
            <option value="D002">B</option>
            <option value="D003">C</option>
            <option value="D004">D</option>
          </select>
        </div>
      )}
    </div>
    
    <div className="flex items-center gap-2">
      {isAdmin && (
        <button
          onClick={onGenerate}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md bg-purple-600 hover:bg-purple-700 text-white transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
          </svg>
          Generate Timetable
        </button>
      )}
      <button
        onClick={onRefresh}
        disabled={isRefreshing}
        className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md bg-surface-hover border border-border text-text hover:bg-border transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isRefreshing ? (
          <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        ) : (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        )}
        {isRefreshing ? "Refreshing..." : "Refresh"}
      </button>
      <button
        onClick={onExport}
        disabled={isExporting}
        className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md bg-green-600 text-white hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isExporting ? (
          <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        ) : (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        )}
        {isExporting ? "Exporting..." : "Export PNG"}
      </button>
      <button
        onClick={onPrint}
        className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
        </svg>
        Print
      </button>
    </div>
  </div>
);

//! Check if a subject is a lab session
const isLabSession = (subject) => {
  if (!subject) return false;
  const labKeywords = ['lab', 'practical', 'workshop', 'session'];
  return labKeywords.some(keyword => subject.toLowerCase().includes(keyword));
};

//* Process timetable data to handle lab sessions spanning 2 consecutive periods
//* Process timetable data to handle lab sessions spanning 2 consecutive periods
const processTimetableData = (timetableData, timeSlots) => {
  const processed = {};
  
  DAYS.forEach(day => {
    const dayKey = day.toLowerCase();
    const dayData = timetableData[dayKey] || [];
    processed[dayKey] = [];
    
    const skipIndices = new Set();
    
    dayData.forEach((cell, index) => {
      if (skipIndices.has(index)) {
        processed[dayKey].push({ isContinued: true, parentIndex: index - 1 });
        return;
      }
      
      //! Check if current slot is a break
      if (timeSlots[index]?.isBreak) {
        processed[dayKey].push(cell);
        return;
      }
      
      //! Check if this is a lab session
      if (cell && isLabSession(cell.subject)) {
        // Look ahead for the second slot of this lab
        let nextClassIdx = index + 1;
        while (nextClassIdx < dayData.length && timeSlots[nextClassIdx]?.isBreak) {
          nextClassIdx++;
        }
        
        const nextCell = dayData[nextClassIdx];
        if (nextCell && nextCell.subject === cell.subject) {
          // Mark all intermediate break slots and the next class slot as continued
          for (let i = index + 1; i <= nextClassIdx; i++) {
            skipIndices.add(i);
          }
          const rowSpan = nextClassIdx - index + 1;
          processed[dayKey].push({ ...cell, isLab: true, spansTwoPeriods: true, customRowSpan: rowSpan });
        } else {
          processed[dayKey].push(cell);
        }
      } else {
        processed[dayKey].push(cell);
      }
    });
  });
  
  return processed;
};

// Week View Component
const WeekView = ({ timetableData, timeSlots }) => {
  const processedData = processTimetableData(timetableData, timeSlots);
  
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className="border border-border bg-surface-hover p-2 text-sm font-semibold text-text w-32">
              Timing
            </th>
            {DAYS.map((day) => (
              <th
                key={day}
                className="border border-border bg-surface-hover p-2 text-sm font-semibold text-text min-w-[150px]"
              >
                {day}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {timeSlots.map((slot, slotIndex) => (
            <tr key={slotIndex}>
              <td className="border border-border bg-surface-hover p-2 text-xs text-text text-center">
                <div className="font-semibold">{slot.label}</div>
                {!slot.isBreak && <div className="text-text/60 mt-1">{slot.time}</div>}
              </td>
              {slot.isBreak ? (
                DAYS.map((day) => {
                  const dayKey = day.toLowerCase();
                  const cellData = processedData[dayKey]?.[slotIndex];
                  
                  if (cellData?.isContinued) {
                    return null;
                  }
                  
                  return (
                    <td
                      key={`${day}-${slotIndex}`}
                      className="border border-border bg-yellow-100 dark:bg-yellow-900/30 p-2 text-center text-xs font-bold text-yellow-800 dark:text-yellow-200"
                    >
                      {slot.label}
                    </td>
                  );
                })
              ) : (
                DAYS.map((day) => {
                  const dayKey = day.toLowerCase();
                  const cellData = processedData[dayKey]?.[slotIndex];
                  
                  //* Skip rendering if this is a continued lab cell (merged above)
                  if (cellData?.isContinued) {
                    return null;
                  }
                  
                  const color = getSubjectColor(cellData?.subject);
                  const rowSpan = cellData?.customRowSpan || 1;
                  
                  return (
                    <td
                      key={`${day}-${slotIndex}`}
                      rowSpan={rowSpan}
                      className={`border border-border p-1 text-xs ${
                        cellData ? (color.isCustomHSL ? "" : color.bg) : "bg-transparent"
                      } ${cellData ? color.text : "text-text"} ${
                        cellData?.spansTwoPeriods ? "align-middle" : ""
                      }`}
                      style={{ 
                        minHeight: cellData?.spansTwoPeriods ? '120px' : '60px',
                        backgroundColor: cellData && color.isCustomHSL ? color.bg : undefined
                      }}
                    >
                      {cellData && !cellData.isContinued && (
                        <div className="p-1">
                          <div className="font-semibold leading-tight">
                            {cellData.subject}
                            {cellData.isLab && (
                              <span className="ml-1 text-[10px] bg-white/20 px-1 rounded">LAB</span>
                            )}
                          </div>
                          {cellData.faculty && (
                            <div className="text-[10px] mt-1 opacity-90">{cellData.faculty}</div>
                          )}
                          {cellData.room && (
                            <div className="text-[10px] opacity-75">{cellData.room}</div>
                          )}
                        </div>
                      )}
                    </td>
                  );
                })
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// Day View Component
const DayView = ({ timetableData, timeSlots, selectedDay, setSelectedDay }) => {
  const processedData = processTimetableData(timetableData, timeSlots);
  
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {DAYS.map((day) => (
          <button
            key={day}
            onClick={() => setSelectedDay(day.toLowerCase())}
            className={`px-4 py-2 text-sm font-medium rounded-md whitespace-nowrap transition-colors ${
              selectedDay === day.toLowerCase()
                ? "bg-primary text-white"
                : "bg-surface-hover border border-border text-text hover:bg-border"
            }`}
          >
            {day}
          </button>
        ))}
      </div>
      
      <div className="space-y-2">
        {timeSlots.map((slot, slotIndex) => {
          if (slot.isBreak) {
            return (
              <div
                key={slotIndex}
                className="bg-yellow-100 dark:bg-yellow-900/30 p-3 rounded-md text-center text-sm font-bold text-yellow-800 dark:text-yellow-200"
              >
                {slot.label} ({slot.time})
              </div>
            );
          }
          
          const cellData = processedData[selectedDay]?.[slotIndex];
          
          //* Skip rendering if this is a continued lab cell
          if (cellData?.isContinued) {
            return null;
          }
          
          const color = getSubjectColor(cellData?.subject);
          const isLab = cellData?.isLab;
          const nextSlot = timeSlots[slotIndex + 1];
          const timeDisplay = isLab && nextSlot && !nextSlot.isBreak
            ? `${slot.time} - ${nextSlot.time}`
            : slot.time;
          
          return (
            <div
              key={slotIndex}
              className={`flex items-center gap-4 p-3 rounded-md border border-border ${
                cellData ? (color.isCustomHSL ? "" : color.bg) : "bg-surface"
              } ${cellData ? color.text : "text-text"} ${
                isLab ? "min-h-[100px]" : ""
              }`}
              style={{
                backgroundColor: cellData && color.isCustomHSL ? color.bg : undefined
              }}
            >
              <div className="w-40 shrink-0 text-sm font-semibold">
                {timeDisplay}
                {isLab && (
                  <span className="block text-[10px] mt-1 opacity-75">(2 Hours)</span>
                )}
              </div>
              <div className="flex-1">
                {cellData ? (
                  <div>
                    <div className="font-semibold">
                      {cellData.subject}
                      {isLab && (
                        <span className="ml-2 text-xs bg-white/20 px-2 py-0.5 rounded">LAB SESSION</span>
                      )}
                    </div>
                    {(cellData.faculty || cellData.room) && (
                      <div className="text-xs mt-1 opacity-90">
                        {cellData.faculty && <span>{cellData.faculty}</span>}
                        {cellData.faculty && cellData.room && <span> • </span>}
                        {cellData.room && <span>{cellData.room}</span>}
                      </div>
                    )}
                  </div>
                ) : (
                  <span className="text-text/50 italic">No class scheduled</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Legend Component
const Legend = ({ subjectsWithTeachers }) => {
  const entries = Object.entries(subjectsWithTeachers || {});
  if (entries.length === 0) return null;

  return (
    <div className="p-4 bg-surface border border-border rounded-lg shadow-xs mt-4">
      <h3 className="text-sm font-semibold text-text mb-3">Subject & Faculty Legend</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mb-4">
        {entries.map(([subject, teachers]) => {
          const color = getSubjectColor(subject);
          const teachersStr = Array.from(teachers).join(", ");
          return (
            <div
              key={subject}
              className="flex items-start gap-2.5 p-2 rounded-lg border border-border bg-background"
            >
              <div
                className={`w-3.5 h-3.5 rounded-full shrink-0 mt-0.5 ${color.isCustomHSL ? "" : color.bg}`}
                style={{ backgroundColor: color.isCustomHSL ? color.bg : undefined }}
              />
              <div className="text-xs">
                <div className="font-semibold text-text leading-tight">{subject}</div>
                <div className="text-text/70 mt-1">
                  Faculty: <span className="font-medium text-text">{teachersStr}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="flex items-center gap-4 text-xs text-text/70 pt-2 border-t border-border/50">
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 bg-white/20 border border-text/30 rounded text-[10px]">LAB</span>
          <span>Lab sessions span 2 consecutive periods</span>
        </div>
      </div>
    </div>
  );
};

// Main TimeTable Component
const TimeTable = ({ onClose }) => {
  const { userData } = useSelector((state) => state.auth || {});
  const isAdmin = userData?.role === "admin";

  const [viewMode, setViewMode] = useState("week");
  const [selectedDay, setSelectedDay] = useState("monday");
  const [timetableData, setTimetableData] = useState(SAMPLE_TIMETABLE_DATA);
  const [rawEntries, setRawEntries] = useState([]);
  const [selectedDivision, setSelectedDivision] = useState("D001");
  const [courses, setCourses] = useState([]);
  const [faculties, setFaculties] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [genSemester, setGenSemester] = useState("S002");
  const [genAcademicYear, setGenAcademicYear] = useState("2025-2026");
  const [genBy, setGenBy] = useState("ADMIN");
  const [isGenerating, setIsGenerating] = useState(false);
  const timetableRef = useRef(null);
  const exportRef = useRef(null);

  // Map student class to division ID
  const getDivisionIdFromClass = (classStr) => {
    if (!classStr) return "D001";
    const parts = classStr.trim().split(/\s+/);
    const lastPart = parts[parts.length - 1].toUpperCase();
    const mapping = {
      "A": "D001",
      "B": "D002",
      "C": "D003",
      "D": "D004"
    };
    return mapping[lastPart] || "D001";
  };

  const activeDivisionId = userData?.role === "student"
    ? getDivisionIdFromClass(userData?.class_group)
    : selectedDivision;

  // Compute subjects and their teachers for the active division
  const subjectsWithTeachers = React.useMemo(() => {
    const courseMap = {};
    courses.forEach(c => {
      courseMap[c.course_id] = c.course_name;
    });

    const facultyMap = {};
    faculties.forEach(f => {
      facultyMap[f.faculty_id] = f.faculty_name;
    });

    const filtered = rawEntries.filter(entry => entry.class_group === activeDivisionId);

    const mapping = {};
    filtered.forEach(entry => {
      const subjectName = courseMap[entry.course_id] || entry.course_id;
      const facultyName = facultyMap[entry.faculty_id] || entry.faculty_id;
      if (subjectName && facultyName) {
        if (!mapping[subjectName]) {
          mapping[subjectName] = new Set();
        }
        mapping[subjectName].add(facultyName);
      }
    });

    // Fallback to SAMPLE_TIMETABLE_DATA subjects if no database allocations exist
    if (Object.keys(mapping).length === 0) {
      Object.values(SAMPLE_TIMETABLE_DATA).forEach(dayList => {
        dayList.forEach(cell => {
          if (cell && cell.subject) {
            const names = cell.subject.split('/');
            names.forEach(name => {
              const cleaned = name.trim();
              if (cleaned) {
                if (!mapping[cleaned]) {
                  mapping[cleaned] = new Set();
                }
                mapping[cleaned].add("Sample Faculty");
              }
            });
          }
        });
      });
    }

    return mapping;
  }, [rawEntries, activeDivisionId, courses, faculties]);
  
  const getDivisionName = (id) => {
    const mapping = {
      "D001": "Div A",
      "D002": "Div B",
      "D003": "Div C",
      "D004": "Div D"
    };
    return mapping[id] || "Div A";
  };

  const DIVISION_DETAILS = {
    "D001": { teacher: "Prof. Vinod Charawande", room: "N 709" },
    "D002": { teacher: "Dr. Rahul Satyakam", room: "N 710" },
    "D003": { teacher: "Dr. Pradnya Mulye", room: "S 703" },
    "D004": { teacher: "Prof. Harshit Kumar", room: "N 715" },
  };

  const getDivisionDetails = (id) => {
    return DIVISION_DETAILS[id] || { teacher: "Prof. Harshit Kumar", room: "N 715" };
  };

  //* College information (can be fetched from API)
  const collegeInfo = {
    name: "MIT COLLEGE OF MANAGEMENT & COMPUTER APPLICATIONS",
    batch: "BATCH 2025 ( A. Y. - 2025-26)",
    semester: "SEM - II",
    effectiveDate: "5 January 2026",
    classInfo: userData?.role === "student" && userData?.class_group 
      ? userData.class_group 
      : `MCA - II ${getDivisionName(activeDivisionId)}`,
    classTeacher: getDivisionDetails(activeDivisionId).teacher,
    roomNo: getDivisionDetails(activeDivisionId).room,
  };

  //! Handle Print functionality
  const handlePrint = useCallback(() => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Please allow popups to print the timetable');
      return;
    }

    const timetableHTML = timetableRef.current?.innerHTML || '';
    const printStyles = `
      <style>
        @media print {
          body { font-family: Arial, sans-serif; margin: 20px; }
          table { width: 100%; border-collapse: collapse; }
          th, td { border: 1px solid #000; padding: 8px; text-align: center; }
          th { background-color: #f0f0f0; font-weight: bold; }
          .bg-green-700 { background-color: #15803d !important; color: white !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .bg-red-900 { background-color: #7f1d1d !important; color: white !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .bg-yellow-600 { background-color: #ca8a04 !important; color: white !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .bg-orange-500 { background-color: #f97316 !important; color: white !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .bg-green-500 { background-color: #22c55e !important; color: white !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .bg-yellow-700 { background-color: #a16207 !important; color: white !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .bg-blue-900 { background-color: #1e3a8a !important; color: white !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .bg-yellow-800 { background-color: #854d0e !important; color: white !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .bg-gray-700 { background-color: #374151 !important; color: white !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .bg-gray-600 { background-color: #4b5563 !important; color: white !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .bg-cyan-400 { background-color: #22d3ee !important; color: black !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .bg-green-600 { background-color: #16a34a !important; color: white !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .bg-yellow-100 { background-color: #fef9c3 !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .text-white { color: white !important; }
          .text-black { color: black !important; }
          .text-center { text-align: center; }
          .font-bold { font-weight: bold; }
          .font-semibold { font-weight: 600; }
          .text-xl { font-size: 1.25rem; }
          .text-sm { font-size: 0.875rem; }
          .text-xs { font-size: 0.75rem; }
          .space-y-1 > * + * { margin-top: 0.25rem; }
          .pt-1 { padding-top: 0.25rem; }
          .p-4 { padding: 1rem; }
          .p-2 { padding: 0.5rem; }
          .p-1 { padding: 0.25rem; }
          .gap-8 { gap: 2rem; }
          .flex { display: flex; }
          .justify-center { justify-content: center; }
          .items-center { align-items: center; }
          .tracking-wide { letter-spacing: 0.025em; }
        }
      </style>
    `;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Timetable - ${collegeInfo.classInfo}</title>
          ${printStyles}
        </head>
        <body>
          <div class="p-4">
            <div style="background-color: #000; color: #fff; padding: 16px; text-align: center; margin-bottom: 20px;">
              <h1 style="font-size: 1.25rem; font-weight: bold; margin: 0;">${collegeInfo.name}</h1>
              <div style="display: flex; justify-content: center; gap: 2rem; margin-top: 8px; font-size: 0.875rem;">
                <span><strong>${collegeInfo.batch}</strong></span>
                <span><strong>${collegeInfo.semester}</strong></span>
                <span>Effective From ${collegeInfo.effectiveDate}</span>
              </div>
              <div style="display: flex; justify-content: center; gap: 2rem; margin-top: 4px; font-size: 0.875rem;">
                <span><strong>${collegeInfo.classInfo}</strong></span>
                <span>Class Teacher - ${collegeInfo.classTeacher}</span>
                <span>Class Room No - ${collegeInfo.roomNo}</span>
              </div>
            </div>
            ${timetableHTML}
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    
    //* Wait for content to load then print
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 250);
  }, [collegeInfo]);

  //! Handle Export to PDF functionality
  const handleExport = useCallback(async () => {
    setIsExporting(true);
    try {
      const element = exportRef.current;
      if (!element) {
        throw new Error('Export container element not found');
      }

      // Render the element as a PNG data URL using html-to-image
      const dataUrl = await toPng(element, {
        cacheBust: true,
        quality: 0.95,
        backgroundColor: window.getComputedStyle(element).backgroundColor || '#ffffff',
      });

      const link = document.createElement('a');
      link.download = `Timetable_${collegeInfo.classInfo.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.png`;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Export failed:', error);
      alert('Failed to export timetable. Please try again.');
    } finally {
      setIsExporting(false);
    }
  }, [collegeInfo]);

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      //* Try to fetch fresh data from API (bypass cache)
      const response = await apiClient.get('/timetables', { cache: false });
      if (response.data?.data?.data?.length > 0) {
        const lastTimetable = response.data.data.data[response.data.data.data.length - 1];
        const entries = lastTimetable.entries || [];
        setRawEntries(entries);
      } else {
        console.log('No timetable data from API, using sample data');
      }

      // Fetch all courses and faculties to map names
      const coursesRes = await apiClient.get('/courses', { params: { limit: 1000 }, cache: false });
      const facultiesRes = await apiClient.get('/faculties', { params: { limit: 1000 }, cache: false });
      if (coursesRes.data?.data?.data) {
        setCourses(coursesRes.data.data.data);
      }
      if (facultiesRes.data?.data?.data) {
        setFaculties(facultiesRes.data.data.data);
      }
    } catch (error) {
      console.error('Failed to refresh timetable:', error);
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  React.useEffect(() => {
    handleRefresh();
  }, [handleRefresh]);

  React.useEffect(() => {
    if (rawEntries.length === 0) return;

    // Create lookup maps for actual names
    const courseMap = {};
    courses.forEach(c => {
      courseMap[c.course_id] = c.course_name;
    });

    const facultyMap = {};
    faculties.forEach(f => {
      facultyMap[f.faculty_id] = f.faculty_name;
    });

    const formattedData = {
      monday: new Array(10).fill(null),
      tuesday: new Array(10).fill(null),
      wednesday: new Array(10).fill(null),
      thursday: new Array(10).fill(null),
      friday: new Array(10).fill(null),
      saturday: new Array(10).fill(null)
    };

    const filtered = rawEntries.filter(entry => entry.class_group === activeDivisionId);

    filtered.forEach(entry => {
      const day = entry.day_of_week.toLowerCase();
      
      // Parse database slot ID (e.g. TS001 -> 1, TS009 -> 9 -> slotNum 1)
      const num = parseInt(entry.slot_id.replace("TS", "")) || 1;
      const slotNum = (num - 1) % 8 + 1; // 1 to 8

      // Map daily slot number to the 10-period React layout (including breaks)
      let index = 0;
      if (slotNum === 1) index = 0;
      else if (slotNum === 2) index = 1;
      else if (slotNum === 3) index = 3;
      else if (slotNum === 4) index = 4; // Period 4
      else if (slotNum === 5) index = 5; // Lunch break
      else if (slotNum === 6) index = 6;
      else if (slotNum === 7) index = 7;
      else if (slotNum === 8) index = 9;

      if (formattedData[day]) {
        formattedData[day][index] = {
          subject: courseMap[entry.course_id] || entry.course_id,
          faculty: facultyMap[entry.faculty_id] || entry.faculty_id,
          room: entry.block ? `${entry.room_no} (${entry.block})` : entry.room_no,
          isLab: entry.isLab
        };
      }
    });

    // Fill remaining empty spots with Mentoring, Library, and Self Study sessions
    let emptyCount = 0;
    const lectureIndices = [0, 1, 3, 4, 6, 7, 9];
    const weekdayKeys = ["monday", "tuesday", "wednesday", "thursday", "friday"];

    weekdayKeys.forEach(day => {
      lectureIndices.forEach(idx => {
        if (!formattedData[day][idx]) {
          emptyCount++;
          if (emptyCount === 1 || emptyCount === 2) {
            formattedData[day][idx] = {
              subject: "Mentoring Session",
              faculty: getDivisionDetails(activeDivisionId).teacher || "Class Teacher",
              room: getDivisionDetails(activeDivisionId).room || "Class Room",
              isLab: false
            };
          } else if (emptyCount === 3) {
            formattedData[day][idx] = {
              subject: "Library Session",
              faculty: "Librarian",
              room: "Library",
              isLab: false
            };
          } else {
            formattedData[day][idx] = {
              subject: "Self Study",
              faculty: "",
              room: getDivisionDetails(activeDivisionId).room || "Class Room",
              isLab: false
            };
          }
        }
      });
    });

    setTimetableData(formattedData);
  }, [rawEntries, activeDivisionId, courses, faculties]);

  const handleGenerate = async (e) => {
    e.preventDefault();
    setIsGenerating(true);
    try {
      // Invalidate cache on generate
      await apiClient.post('/timetables/generate', {
        semester_id: genSemester,
        academicYear: genAcademicYear,
        generatedBy: genBy
      }, { invalidateCache: "timetables" });
      alert('Timetable generated successfully!');
      setShowGenerateModal(false);
      handleRefresh();
    } catch (error) {
      console.error('Failed to generate timetable:', error);
      alert(error.response?.data?.message || 'Failed to generate timetable.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-background relative">
      {/* Action Buttons */}
      <ActionButtons
        onPrint={handlePrint}
        onExport={handleExport}
        onRefresh={handleRefresh}
        onGenerate={() => setShowGenerateModal(true)}
        viewMode={viewMode}
        setViewMode={setViewMode}
        isRefreshing={isRefreshing}
        isExporting={isExporting}
        isAdmin={isAdmin}
        selectedDivision={selectedDivision}
        setSelectedDivision={setSelectedDivision}
        role={userData?.role}
      />
      
      {/* Export Container wrapping Header, Content Grid, and Legend */}
      <div ref={exportRef} className="flex-1 overflow-auto p-6 bg-background space-y-6">
        {/* Header */}
        <TimetableHeader collegeInfo={collegeInfo} />
        
        {/* Timetable Content */}
        <div ref={timetableRef}>
          {viewMode === "week" ? (
            <WeekView timetableData={timetableData} timeSlots={TIME_SLOTS} />
          ) : (
            <DayView
              timetableData={timetableData}
              timeSlots={TIME_SLOTS}
              selectedDay={selectedDay}
              setSelectedDay={setSelectedDay}
            />
          )}
        </div>
        
        {/* Legend */}
        <Legend subjectsWithTeachers={subjectsWithTeachers} />
      </div>

      {/* Generation Modal */}
      {showGenerateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-surface border border-border p-6 rounded-lg shadow-xl w-96 text-text">
            <h3 className="text-lg font-bold mb-4">Generate Timetable</h3>
            <form onSubmit={handleGenerate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Semester ID</label>
                <input
                  type="text"
                  value={genSemester}
                  onChange={(e) => setGenSemester(e.target.value)}
                  className="w-full px-3 py-2 border border-border bg-background rounded-md text-text"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Academic Year</label>
                <input
                  type="text"
                  value={genAcademicYear}
                  onChange={(e) => setGenAcademicYear(e.target.value)}
                  className="w-full px-3 py-2 border border-border bg-background rounded-md text-text"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Generated By</label>
                <input
                  type="text"
                  value={genBy}
                  onChange={(e) => setGenBy(e.target.value)}
                  className="w-full px-3 py-2 border border-border bg-background rounded-md text-text"
                  required
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowGenerateModal(false)}
                  className="px-4 py-2 text-sm font-medium rounded-md border border-border bg-surface hover:bg-surface-hover"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isGenerating}
                  className="px-4 py-2 text-sm font-medium rounded-md bg-purple-600 hover:bg-purple-700 text-white disabled:opacity-50"
                >
                  {isGenerating ? "Generating..." : "Generate"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TimeTable;

