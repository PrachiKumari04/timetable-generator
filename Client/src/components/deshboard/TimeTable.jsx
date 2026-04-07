import React, { useState, useRef, useCallback } from "react";
import { useSelector } from "react-redux";
import apiClient from "../../services/apiClient";

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
  return SUBJECT_COLORS.default;
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
const ActionButtons = ({ onPrint, onExport, onRefresh, viewMode, setViewMode, isRefreshing, isExporting }) => (
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
    </div>
    
    <div className="flex items-center gap-2">
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
const processTimetableData = (timetableData, timeSlots) => {
  const processed = {};
  
  DAYS.forEach(day => {
    const dayKey = day.toLowerCase();
    const dayData = timetableData[dayKey] || [];
    processed[dayKey] = [];
    
    let skipNext = false;
    dayData.forEach((cell, index) => {
      if (skipNext) {
        skipNext = false;
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
        //* Mark this as a lab that spans 2 periods
        processed[dayKey].push({ ...cell, isLab: true, spansTwoPeriods: true });
        skipNext = true;
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
                <td
                  colSpan={6}
                  className="border border-border bg-yellow-100 dark:bg-yellow-900/30 p-2 text-center text-sm font-bold text-yellow-800 dark:text-yellow-200"
                >
                  {slot.label}
                </td>
              ) : (
                DAYS.map((day) => {
                  const dayKey = day.toLowerCase();
                  const cellData = processedData[dayKey]?.[slotIndex];
                  
                  //* Skip rendering if this is a continued lab cell (merged above)
                  if (cellData?.isContinued) {
                    return null;
                  }
                  
                  const color = getSubjectColor(cellData?.subject);
                  const rowSpan = cellData?.spansTwoPeriods ? 2 : 1;
                  
                  return (
                    <td
                      key={`${day}-${slotIndex}`}
                      rowSpan={rowSpan}
                      className={`border border-border p-1 text-xs ${
                        cellData ? color.bg : "bg-transparent"
                      } ${cellData ? color.text : "text-text"} ${
                        cellData?.spansTwoPeriods ? "align-middle" : ""
                      }`}
                      style={{ minHeight: cellData?.spansTwoPeriods ? '120px' : '60px' }}
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
                cellData ? color.bg : "bg-surface"
              } ${cellData ? color.text : "text-text"} ${
                isLab ? "min-h-[100px]" : ""
              }`}
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
const Legend = () => (
  <div className="p-4 bg-surface border-t border-border">
    <h3 className="text-sm font-semibold text-text mb-3">Subject Legend</h3>
    <div className="flex flex-wrap gap-2 mb-4">
      {Object.entries(SUBJECT_COLORS)
        .filter(([key]) => key !== "default")
        .map(([subject, color]) => (
          <div
            key={subject}
            className={`flex items-center gap-2 px-3 py-1 rounded-md text-xs ${color.bg} ${color.text}`}
          >
            <span className="font-medium">{subject}</span>
          </div>
        ))}
    </div>
    <div className="flex items-center gap-4 text-xs text-text/70">
      <div className="flex items-center gap-2">
        <span className="px-2 py-0.5 bg-white/20 border border-text/30 rounded text-[10px]">LAB</span>
        <span>Lab sessions span 2 consecutive periods</span>
      </div>
    </div>
  </div>
);

// Main TimeTable Component
const TimeTable = ({ onClose }) => {
  const [viewMode, setViewMode] = useState("week");
  const [selectedDay, setSelectedDay] = useState("monday");
  const [timetableData, setTimetableData] = useState(SAMPLE_TIMETABLE_DATA);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const timetableRef = useRef(null);
  
  //* College information (can be fetched from API)
  const collegeInfo = {
    name: "MIT COLLEGE OF MANAGEMENT & COMPUTER APPLICATIONS",
    batch: "BATCH 2025 ( A. Y. - 2025-26)",
    semester: "SEM - II",
    effectiveDate: "5 January 2026",
    classInfo: "MCA - II Div D (Data Science & Cyber Security )",
    classTeacher: "Prof. Harshit Kumar",
    roomNo: "N 715",
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
      //! Create a canvas from the timetable
      const element = timetableRef.current;
      if (!element) {
        throw new Error('Timetable element not found');
      }

      //* Use html2canvas approach by creating a data URL
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      //* Set canvas dimensions
      canvas.width = 1200;
      canvas.height = 800;
      
      //* Fill white background
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      //* Draw header
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, canvas.width, 100);
      
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 20px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(collegeInfo.name, canvas.width / 2, 35);
      
      ctx.font = '14px Arial';
      ctx.fillText(`${collegeInfo.batch}    ${collegeInfo.semester}    Effective From ${collegeInfo.effectiveDate}`, canvas.width / 2, 60);
      ctx.fillText(`${collegeInfo.classInfo}    Class Teacher - ${collegeInfo.classTeacher}    Room - ${collegeInfo.roomNo}`, canvas.width / 2, 85);
      
      //* Draw simplified timetable representation
      ctx.fillStyle = '#000000';
      ctx.font = '12px Arial';
      ctx.textAlign = 'left';
      
      let y = 130;
      const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      
      days.forEach((day, index) => {
        ctx.fillStyle = '#f0f0f0';
        ctx.fillRect(20, y + index * 100, 1160, 25);
        ctx.fillStyle = '#000000';
        ctx.font = 'bold 14px Arial';
        ctx.fillText(day, 30, y + index * 100 + 18);
        
        //* Draw time slots
        ctx.font = '11px Arial';
        const dayData = timetableData[day.toLowerCase()];
        if (dayData) {
          let x = 150;
          TIME_SLOTS.forEach((slot, slotIndex) => {
            if (!slot.isBreak && dayData[slotIndex]) {
              const subject = dayData[slotIndex].subject;
              if (subject && subject.length > 20) {
                ctx.fillText(subject.substring(0, 20) + '...', x, y + index * 100 + 60);
              } else if (subject) {
                ctx.fillText(subject, x, y + index * 100 + 60);
              }
            }
            x += 180;
          });
        }
      });
      
      //* Convert to image and download
      const dataUrl = canvas.toDataURL('image/png');
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
  }, [collegeInfo, timetableData]);

  //! Handle Refresh functionality
  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      //* Try to fetch fresh data from API
      const response = await apiClient.get('/timetable/current');
      if (response.data?.data) {
        setTimetableData(response.data.data);
      } else {
        //* If API returns no data, keep sample data but show message
        console.log('No timetable data from API, using sample data');
      }
    } catch (error) {
      console.error('Failed to refresh timetable:', error);
      // Don't show error to user, just keep the sample data
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <TimetableHeader collegeInfo={collegeInfo} />
      
      {/* Action Buttons */}
      <ActionButtons
        onPrint={handlePrint}
        onExport={handleExport}
        onRefresh={handleRefresh}
        viewMode={viewMode}
        setViewMode={setViewMode}
        isRefreshing={isRefreshing}
        isExporting={isExporting}
      />
      
      {/* Timetable Content */}
      <div ref={timetableRef} className="flex-1 overflow-auto p-4">
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
      <Legend />
    </div>
  );
};

export default TimeTable;
