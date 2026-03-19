import React, { useState, useEffect } from "react";

// ---- Simple config for all master entities ----
const ENTITY_CONFIG = {
  program: {
    label: "Program",
    pluralLabel: "Programs",
    // description: "Define academic programs like B.Tech CSE, BBA, etc.",
    fields: [
      {
        name: "code",
        label: "Program Code",
        placeholder: "e.g. UG-CSE",
        required: true,
      },
      {
        name: "name",
        label: "Program Name",
        placeholder: "e.g. Undergraduate Computer Science",
        required: true,
      },
    ],
    csvExampleHeader: "code,name",
  },

  course: {
    label: "Course",
    pluralLabel: "Courses",
    // description: "Define courses like B.Tech, M.Tech, etc.",
    fields: [
      {
        name: "code",
        label: "Course Code",
        placeholder: "e.g. UG-CSE-101",
        required: true,
      },
      {
        name: "name",
        label: "Course Name",
        placeholder: "e.g. Introduction to Programming",
        required: true,
      },
      {
        name: "duration",
        label: "Duration (years)",
        placeholder: "e.g. 3",
        required: true,
      },
    ],
    csvExampleHeader: "code,name,duration",
  },

  room: {
    label: "Room",
    pluralLabel: "Rooms",
    // description: "Maintain list of rooms for scheduling classes.",
    fields: [
      {
        name: "code",
        label: "Room Code",
        placeholder: "e.g. R101",
        required: true,
      },
      {
        name: "floor_no",
        label: "Floor no",
        placeholder: "e.g. Ground Floor",
        required: true,
      },
      {
        name: "Wing",
        label: "Wing",
        placeholder: "e.g. A Wing",
        required: true,
      },
    ],
  },
  classes: {
    label: "Class",
    pluralLabel: "Classes",
    fields: [
      {
        name: "code",
        label: "Class Code",
        placeholder: "e.g. CSE-3A",
        required: true,
      },
      {
        name: "courseCode",
        label: "Course Code",
        placeholder: "e.g. UG-CSE-101",
        required: true,
      },
      {
        name: "programCode",
        label: "Program Code",
        placeholder: "e.g. UG-CSE",
        required: true,
      },
      {
        name: "year",
        label: "Year",
        placeholder: "e.g. 2024",
        required: true,
      },
    ],
  },
  section: {
    label: "Section",
    pluralLabel: "Sections",
    fields: [
      {
        name: "sectionCode",
        label: "Section Code",
        placeholder: "e.g. A",
        required: true,
      },
      {
        name: "classCode",
        label: "Class Code",
        placeholder: "e.g. CSE-3A",
        required: true,
      },
      {
        name: "division",
        label: "Division",
        placeholder: "e.g. 1",
        required: true,
      },
    ],
  },

  subject: {
    label: "Subject",
    pluralLabel: "Subjects",
    description: "Maintain subject master list for timetables.",
    fields: [
      {
        name: "code",
        label: "Subject Code",
        placeholder: "e.g. CS301",
        required: true,
      },
      {
        name: "name",
        label: "Subject Name",
        placeholder: "e.g. Data Structures",
        required: true,
      },
      {
        name: "credits",
        label: "Credits",
        placeholder: "e.g. 3",
        required: false,
      },
      {
        name: "isActive",
        label: "Active",
        type: "boolean",
        required: false,
      },
    ],
    csvExampleHeader: "code,name,credits,isActive",
  },

  Specialization: {
    label: "Specialization",
    pluralLabel: "Specializations",
    description: "Define specializations for programs (e.g. AI, DS).",
    fields: [
      {
        name: "code",
        label: "Specialization Code",
        placeholder: "e.g. CSE-AI",
        required: true,
      },
      {
        name: "name",
        label: "Specialization Name",
        placeholder: "e.g. Computer Science - Artificial Intelligence",
        required: true,
      },
      {
        name: "programCode",
        label: "Program Code",
        placeholder: "e.g. UG-CSE",
        required: true,
      },
      {
        name: "courseCodes",
        label: "Related Course Codes (comma-separated)",
        placeholder: "e.g. UG-CSE-201,UG-CSE-202",
        required: false,
      },
      {
        name: "duration",
        label: "Duration (semesters)",
        placeholder: "e.g. 4",
        required: false,
      },
    ],
    csvExampleHeader: "code,name,programCode,courseCodes,duration",
  },

  faculty: {
    label: "Faculty",
    pluralLabel: "Faculty",
    description: "Add faculty details to map classes and subjects.",
    fields: [
      {
        name: "facultyId",
        label: "Faculty ID",
        placeholder: "e.g. F001",
        required: true,
      },
      {
        name: "name",
        label: "Name",
        placeholder: "e.g. Dr. Sunil Kumar",
        required: true,
      },
      {
        name: "email",
        label: "Email",
        placeholder: "e.g. sunil@college.edu",
        required: false,
      },
      {
        name: "phone",
        label: "Phone",
        placeholder: "e.g. +1234567890",
        required: false,
      },
      {
        name: "specialization",
        label: "Specialization",
        placeholder: "e.g. Computer Science",
        required: false,
      },
      {
        name: "higherQualification",
        label: "Higher Qualification",
        placeholder: "e.g. PhD in Computer Science",
        required: false,
      },
      {
        name: "experienceYears",
        label: "Years of Experience",
        placeholder: "e.g. 10",
        required: false,
      },
      {
        name: "joiningDate",
        label: "Joining Date",
        placeholder: "e.g. 2020-08-15",
        required: false,
      },
      {
        name: "isActive",
        label: "Active",
        type: "boolean",
        required: false,
      },
      {
        name: "gender",
        label: "Gender",
        placeholder: "e.g. Male",
        required: false,
      },
      {
        name: "dateOfBirth",
        label: "Date of Birth",
        placeholder: "e.g. 1980-05-20",
        required: false,
      },
      {
        name: "address",
        label: "Address",
        placeholder: "e.g. 123 Main St, City",
        required: false,
      },
    ],
    csvExampleHeader:
      " employeeId,name,email,phone,specialization,higherQualification,experienceYears,joiningDate,isActive,gender,dateOfBirth,address",
  },

  student: {
    label: "Student",
    pluralLabel: "Students",
    description: "Maintain list of students for each class/section.",
    fields: [
      {
        name: "enrollmentNo",
        label: "Enrollment No",
        placeholder: "e.g. 24CS001",
        required: true,
      },
      {
        name: "name",
        label: "Name",
        placeholder: "e.g. Aryan Kumar",
        required: true,
      },
      {
        name: "fatherName",
        label: "Father's Name",
        placeholder: "e.g. Ramesh Kumar",
        required: false,
      },
      {
        name: "classCode",
        label: "Class Code",
        placeholder: "e.g. CSE-3A",
        required: true,
      },
      {
        name: "batch",
        label: "Batch",
        placeholder: "e.g. 2024",
        required: false,
      },
      {
        name: "specialization",
        label: "Specialization",
        placeholder: "e.g. AI",
        required: false,
      },
      {
        name: "email",
        label: "Email",
        placeholder: "e.g. aryan@college.edu",
        required: false,
      },
      {
        name: "sectionName",
        label: "Section (optional)",
        placeholder: "e.g. A",
        required: false,
      },
    ],
    csvExampleHeader: "rollNo,name,classCode,sectionName",
  },
};

const MASTER_ENTITY_KEYS = Object.keys(ENTITY_CONFIG);

const createEmptyMasterData = () =>
  MASTER_ENTITY_KEYS.reduce((acc, key) => {
    acc[key] = [];
    return acc;
  }, {});

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
const PERIODS = ["1", "2", "3", "4", "5", "6", "7", "8"];

// const createEmptyGrid = () => {
//   const grid = {};
//   DAYS.forEach((day) => {
//     grid[day] = {};
//     PERIODS.forEach((period) => {
//       grid[day][period] = {
//         subjectCode: "",
//         facultyId: "",
//         room: "",
//       };
//     });
//   });
//   return grid;
// };

const generateId = () => `${Date.now()}-${Math.random().toString(16).slice(2)}`;

export default function Admin() {
  const [activeTab, setActiveTab] = useState("master"); // master | timetable
  const [activeEntity, setActiveEntity] = useState("program");

  // All master data is stored here, purely on frontend (no backend yet)
  // const [masterData, setMasterData] = useState(() => {
  //   if (typeof window === "undefined") return createEmptyMasterData();
  //   try {
  //     const stored = window.localStorage.getItem("tt_masterData");
  //     if (!stored) return createEmptyMasterData();
  //     const parsed = JSON.parse(stored);
  //     return { ...createEmptyMasterData(), ...(parsed || {}) };
  //   } catch {
  //     return createEmptyMasterData();
  //   }
  // });

  const [entityForm, setEntityForm] = useState({});
  const [editingEntityId, setEditingEntityId] = useState(null);

  // const [timetables, setTimetables] = useState(() => {
  //   if (typeof window === "undefined") return {};
  //   try {
  //     const stored = window.localStorage.getItem("tt_timetables");
  //     return stored ? JSON.parse(stored) || {} : {};
  //   } catch {
  //     return {};
  //   }
  // });


  // key: classCode, value: { classCode, grid }
  // const [selectedClassForTT, setSelectedClassForTT] = useState("");
  // const [ttGrid, setTtGrid] = useState(createEmptyGrid());

  // // ---- Helpers for entity form ----
  // const currentEntityConfig = ENTITY_CONFIG[activeEntity];

  // const ensureFormInitialized = () => {
  //   if (!entityForm[activeEntity]) {
  //     const empty = {};
  //     currentEntityConfig.fields.forEach((f) => {
  //       empty[f.name] = "";
  //     });
  //     setEntityForm((prev) => ({ ...prev, [activeEntity]: empty }));
  //   }
  // };

  // useEffect(() => {
  //   ensureFormInitialized();
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [activeEntity]);

  // // Seed dummy MCA data and timetable when everything is empty (first run)
  // useEffect(() => {
  //   const isMasterEmpty = MASTER_ENTITY_KEYS.every(
  //     (key) => !masterData[key] || masterData[key].length === 0,
  //   );
  //   const hasNoTimetables = !timetables || Object.keys(timetables).length === 0;

  //   if (!isMasterEmpty || !hasNoTimetables) {
  //     return;
  //   }

  //   const mcaProgramId = generateId();
  //   const mcaBatchId = generateId();
  //   const mcaClassId = generateId();
  //   const faculty1Id = generateId();
  //   const faculty2Id = generateId();
  //   const faculty3Id = generateId();

  //   const seededMaster = {
  //     ...createEmptyMasterData(),
  //     program: [
  //       {
  //         id: mcaProgramId,
  //         code: "MCA",
  //         name: "Master of Computer Applications",
  //       },
  //     ],
  //     batch: [
  //       {
  //         id: mcaBatchId,
  //         name: "2024-2026",
  //         programCode: "MCA",
  //       },
  //     ],
  //     class: [
  //       {
  //         id: mcaClassId,
  //         code: "MCA-1",
  //         batchName: "2024-2026",
  //         programCode: "MCA",
  //       },
  //     ],
  //     section: [],
  //     subject: [
  //       {
  //         id: generateId(),
  //         code: "MCA101",
  //         name: "Data Structures",
  //         programCode: "MCA",
  //       },
  //       {
  //         id: generateId(),
  //         code: "MCA102",
  //         name: "Database Management Systems",
  //         programCode: "MCA",
  //       },
  //       {
  //         id: generateId(),
  //         code: "MCA103",
  //         name: "Operating Systems",
  //         programCode: "MCA",
  //       },
  //       {
  //         id: generateId(),
  //         code: "MCA104",
  //         name: "Computer Networks",
  //         programCode: "MCA",
  //       },
  //       {
  //         id: generateId(),
  //         code: "MCA105",
  //         name: "Discrete Mathematics",
  //         programCode: "MCA",
  //       },
  //     ],
  //     faculty: [
  //       {
  //         id: faculty1Id,
  //         employeeId: "F-MCA01",
  //         name: "Dr. Rohan Singh",
  //         email: "rohan.mca@college.edu",
  //       },
  //       {
  //         id: faculty2Id,
  //         employeeId: "F-MCA02",
  //         name: "Prof. Meera Sharma",
  //         email: "meera.mca@college.edu",
  //       },
  //       {
  //         id: faculty3Id,
  //         employeeId: "F-MCA03",
  //         name: "Dr. Arjun Verma",
  //         email: "arjun.mca@college.edu",
  //       },
  //     ],
  //     student: [],
  //   };

  //   const grid = createEmptyGrid();

  //   // Simple dummy pattern for MCA-1 timetable
  //   const fill = (day, period, subjectCode, facultyEmpId, room) => {
  //     if (!grid[day] || !grid[day][period]) return;
  //     grid[day][period] = {
  //       subjectCode,
  //       facultyId: facultyEmpId,
  //       room,
  //     };
  //   };

  //   // Monday
  //   fill("Monday", "1", "MCA101", "F-MCA01", "Lab-1");
  //   fill("Monday", "2", "MCA101", "F-MCA01", "Lab-1");
  //   fill("Monday", "3", "MCA102", "F-MCA02", "Room-201");
  //   fill("Monday", "4", "MCA102", "F-MCA02", "Room-201");
  //   fill("Monday", "5", "MCA105", "F-MCA03", "Room-203");

  //   // Tuesday
  //   fill("Tuesday", "1", "MCA103", "F-MCA03", "Room-202");
  //   fill("Tuesday", "2", "MCA103", "F-MCA03", "Room-202");
  //   fill("Tuesday", "3", "MCA104", "F-MCA02", "Room-204");
  //   fill("Tuesday", "4", "MCA104", "F-MCA02", "Room-204");
  //   fill("Tuesday", "6", "MCA101", "F-MCA01", "Lab-1");

  //   // Wednesday
  //   fill("Wednesday", "1", "MCA102", "F-MCA02", "Room-201");
  //   fill("Wednesday", "2", "MCA102", "F-MCA02", "Room-201");
  //   fill("Wednesday", "3", "MCA105", "F-MCA03", "Room-203");
  //   fill("Wednesday", "4", "MCA105", "F-MCA03", "Room-203");
  //   fill("Wednesday", "6", "MCA103", "F-MCA03", "Room-202");

  //   // Thursday
  //   fill("Thursday", "1", "MCA104", "F-MCA02", "Room-204");
  //   fill("Thursday", "2", "MCA104", "F-MCA02", "Room-204");
  //   fill("Thursday", "3", "MCA101", "F-MCA01", "Lab-1");
  //   fill("Thursday", "4", "MCA101", "F-MCA01", "Lab-1");
  //   fill("Thursday", "6", "MCA102", "F-MCA02", "Room-201");

  //   // Friday
  //   fill("Friday", "1", "MCA103", "F-MCA03", "Room-202");
  //   fill("Friday", "2", "MCA103", "F-MCA03", "Room-202");
  //   fill("Friday", "3", "MCA105", "F-MCA03", "Room-203");
  //   fill("Friday", "4", "MCA104", "F-MCA02", "Room-204");

  //   const seededTimetables = {
  //     "MCA-1": {
  //       classCode: "MCA-1",
  //       grid,
  //     },
  //   };

  //   setMasterData(seededMaster);
  //   setTimetables(seededTimetables);
  // }, [masterData, timetables]);

  // // Persist master data + timetables so Student/Faculty dashboards can read them
  // useEffect(() => {
  //   try {
  //     window.localStorage.setItem("tt_masterData", JSON.stringify(masterData));
  //   } catch {}
  // }, [masterData]);

  // useEffect(() => {
  //   try {
  //     window.localStorage.setItem("tt_timetables", JSON.stringify(timetables));
  //   } catch {}
  // }, [timetables]);

  // const handleEntityInputChange = (e) => {
  //   const { name, value } = e.target;
  //   setEntityForm((prev) => ({
  //     ...prev,
  //     [activeEntity]: {
  //       ...(prev[activeEntity] || {}),
  //       [name]: value,
  //     },
  //   }));
  // };

  // const resetEntityForm = () => {
  //   const empty = {};
  //   currentEntityConfig.fields.forEach((f) => {
  //     empty[f.name] = "";
  //   });
  //   setEntityForm((prev) => ({ ...prev, [activeEntity]: empty }));
  //   setEditingEntityId(null);
  // };

  // const handleEntitySubmit = (e) => {
  //   e.preventDefault();
  //   const formData = entityForm[activeEntity] || {};

  //   // Basic required validation
  //   for (const field of currentEntityConfig.fields) {
  //     if (field.required && !String(formData[field.name] || "").trim()) {
  //       alert(`Please fill "${field.label}"`);
  //       return;
  //     }
  //   }

  //   const withId = {
  //     id: editingEntityId || generateId(),
  //     ...formData,
  //   };

  //   setMasterData((prev) => {
  //     const list = prev[activeEntity] || [];
  //     if (editingEntityId) {
  //       return {
  //         ...prev,
  //         [activeEntity]: list.map((item) =>
  //           item.id === editingEntityId ? withId : item,
  //         ),
  //       };
  //     }
  //     return {
  //       ...prev,
  //       [activeEntity]: [...list, withId],
  //     };
  //   });

  //   resetEntityForm();
  // };

  // const handleEntityEdit = (item) => {
  //   setEditingEntityId(item.id);
  //   const loaded = {};
  //   currentEntityConfig.fields.forEach((f) => {
  //     loaded[f.name] = item[f.name] ?? "";
  //   });
  //   setEntityForm((prev) => ({ ...prev, [activeEntity]: loaded }));
  // };

  // const handleEntityDelete = (id) => {
  //   if (!window.confirm("Delete this record?")) return;
  //   setMasterData((prev) => ({
  //     ...prev,
  //     [activeEntity]: (prev[activeEntity] || []).filter(
  //       (item) => item.id !== id,
  //     ),
  //   }));
  //   if (editingEntityId === id) {
  //     resetEntityForm();
  //   }
  // };

  // // ---- CSV upload ----
  // const parseCsvText = (text, fields) => {
  //   const lines = text.trim().split(/\r?\n/);
  //   if (!lines.length) return [];

  //   const header = lines[0].split(",").map((h) => h.trim());
  //   const isHeader =
  //     fields.every((f) => header.includes(f.name)) ||
  //     header.length === fields.length;

  //   const startIndex = isHeader ? 1 : 0;

  //   const items = [];
  //   for (let i = startIndex; i < lines.length; i += 1) {
  //     const row = lines[i].trim();
  //     if (!row) continue;
  //     const cols = row.split(",").map((c) => c.trim());
  //     const obj = { id: generateId() };

  //     fields.forEach((field, idx) => {
  //       const colIndex = isHeader ? header.indexOf(field.name) : idx;
  //       obj[field.name] = cols[colIndex] ?? "";
  //     });

  //     items.push(obj);
  //   }
  //   return items;
  // };

  // const handleCsvUpload = (event) => {
  //   const file = event.target.files?.[0];
  //   if (!file) return;

  //   const reader = new FileReader();
  //   reader.onload = (e) => {
  //     try {
  //       const text = String(e.target?.result || "");
  //       const imported = parseCsvText(text, currentEntityConfig.fields);
  //       if (!imported.length) {
  //         alert("No valid rows found in CSV.");
  //         return;
  //       }
  //       setMasterData((prev) => ({
  //         ...prev,
  //         [activeEntity]: [...(prev[activeEntity] || []), ...imported],
  //       }));
  //       event.target.value = "";
  //       alert(
  //         `Imported ${imported.length} ${currentEntityConfig.pluralLabel}.`,
  //       );
  //     } catch (err) {
  //       console.error(err);
  //       alert("Failed to parse CSV. Please check the format.");
  //     }
  //   };
  //   reader.readAsText(file);
  // };

  // // ---- Timetable logic ----
  // const handleTtCellChange = (day, period, field, value) => {
  //   setTtGrid((prev) => ({
  //     ...prev,
  //     [day]: {
  //       ...prev[day],
  //       [period]: {
  //         ...prev[day][period],
  //         [field]: value,
  //       },
  //     },
  //   }));
  // };

  // const handleClassSelectChange = (e) => {
  //   const classCode = e.target.value;
  //   setSelectedClassForTT(classCode);
  //   if (!classCode) return;

  //   const existing = timetables[classCode];
  //   if (existing) {
  //     // Deep clone to avoid mutation
  //     setTtGrid(JSON.parse(JSON.stringify(existing.grid)));
  //   } else {
  //     setTtGrid(createEmptyGrid());
  //   }
  // };

  // const handleTtSave = () => {
  //   if (!selectedClassForTT) {
  //     alert("Please select a class first.");
  //     return;
  //   }
  //   setTimetables((prev) => ({
  //     ...prev,
  //     [selectedClassForTT]: {
  //       classCode: selectedClassForTT,
  //       grid: JSON.parse(JSON.stringify(ttGrid)),
  //     },
  //   }));
  //   alert("Timetable saved for class " + selectedClassForTT);
  // };

  const classList = masterData.class || [];
  const subjectList = masterData.subject || [];
  const facultyList = masterData.faculty || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Admin Dashboard
          </h1>
          {/* <p className="text-sm text-gray-500">
            Manage master data and generate class timetables.
          </p> */}
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setActiveTab("master")}
            className={`px-4 py-2 text-sm font-medium rounded-lg border ${
              activeTab === "master"
                ? "bg-indigo-600 text-white border-indigo-600"
                : "bg-white text-gray-700 border-gray-300"
            }`}
          >
            Master Data
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("timetable")}
            className={`px-4 py-2 text-sm font-medium rounded-lg border ${
              activeTab === "timetable"
                ? "bg-indigo-600 text-white border-indigo-600"
                : "bg-white text-gray-700 border-gray-300"
            }`}
          >
            Timetables
          </button>
          <button
            type="button"
            onClick={() => {
              // seed demo data into localStorage and state
              try {
                const seededMaster = {
                  ...createEmptyMasterData(),
                  program: [
                    { id: generateId(), code: "UG-CSE", name: "B.Tech Computer Science" },
                    { id: generateId(), code: "PG-MCA", name: "MCA" },
                  ],
                  course: [
                    { id: generateId(), code: "UG-CSE-101", name: "Intro to Programming", duration: "3" },
                    { id: generateId(), code: "UG-CSE-102", name: "Data Structures", duration: "3" },
                  ],
                  room: [
                    { id: generateId(), code: "R101", floor_no: "1", Wing: "A" },
                    { id: generateId(), code: "Lab-1", floor_no: "G", Wing: "B" },
                  ],
                  classes: [
                    { id: generateId(), code: "CSE-3A", courseCode: "UG-CSE-101", programCode: "UG-CSE", year: "3" },
                    { id: generateId(), code: "CSE-3B", courseCode: "UG-CSE-101", programCode: "UG-CSE", year: "3" },
                  ],
                  // keep legacy key used elsewhere
                  class: [
                    { id: generateId(), code: "MCA-1", batchName: "2024-2026", programCode: "PG-MCA" },
                    { id: generateId(), code: "MCA-2", batchName: "2024-2026", programCode: "PG-MCA" },
                  ],
                  section: [
                    { id: generateId(), sectionCode: "A", classCode: "CSE-3A", division: "1" },
                    { id: generateId(), sectionCode: "B", classCode: "CSE-3B", division: "1" },
                  ],
                  subject: [
                    { id: generateId(), code: "CS301", name: "Data Structures", credits: "3", isActive: true },
                    { id: generateId(), code: "CS302", name: "Database Systems", credits: "3", isActive: true },
                  ],
                  Specialization: [
                    { id: generateId(), code: "CSE-AI", name: "AI", programCode: "UG-CSE", courseCodes: "UG-CSE-101", duration: "4" },
                    { id: generateId(), code: "CSE-DS", name: "Data Science", programCode: "UG-CSE", courseCodes: "UG-CSE-101", duration: "4" },
                  ],
                  faculty: [
                    { id: generateId(), employeeId: "F001", facultyId: "F001", name: "Dr. Rohan Singh", email: "rohan@college.edu", phone: "+911234567890" },
                    { id: generateId(), employeeId: "F002", facultyId: "F002", name: "Prof. Meera Sharma", email: "meera@college.edu", phone: "+911234567891" },
                  ],
                  student: [
                    { id: generateId(), enrollmentNo: "24CS001", name: "Aryan Kumar", fatherName: "Ramesh Kumar", classCode: "CSE-3A", batch: "2024", specialization: "AI", email: "aryan@college.edu", sectionName: "A" },
                    { id: generateId(), enrollmentNo: "24CS002", name: "Priya Singh", fatherName: "Suresh Singh", classCode: "CSE-3B", batch: "2024", specialization: "DS", email: "priya@college.edu", sectionName: "B" },
                  ],
                };

                const grid = createEmptyGrid();
                grid.Monday["1"] = { subjectCode: "CS301", facultyId: "F001", room: "R101" };
                grid.Monday["2"] = { subjectCode: "CS301", facultyId: "F001", room: "R101" };
                grid.Tuesday["1"] = { subjectCode: "CS302", facultyId: "F002", room: "Lab-1" };
                grid.Tuesday["2"] = { subjectCode: "CS302", facultyId: "F002", room: "Lab-1" };

                const seededTimetables = { "MCA-1": { classCode: "MCA-1", grid } };

                try {
                  window.localStorage.setItem("tt_masterData", JSON.stringify(seededMaster));
                  window.localStorage.setItem("tt_timetables", JSON.stringify(seededTimetables));
                } catch (err) {
                  // ignore storage errors
                }

                setMasterData(seededMaster);
                setTimetables(seededTimetables);
                alert("Demo data seeded into localStorage and state.");
              } catch (err) {
                console.error(err);
                alert("Failed to seed demo data: " + String(err));
              }
            }}
            className="px-3 py-2 text-sm font-medium rounded-lg border bg-yellow-50 text-yellow-800 border-yellow-200 hover:bg-yellow-100"
          >
            Reset demo data
          </button>
        </div>
      </div>

      {/* ----------------------------------------------Header end---------------------------------------------- */}
      {/* ----------------------------------------------Master Data---------------------------------------------- */}

      {activeTab === "master" && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left: entity selector */}
          <div className="lg:col-span-1 space-y-3">
            <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
              Master entities
            </h2>
            <div className="space-y-2">
              {MASTER_ENTITY_KEYS.map((key) => {
                const cfg = ENTITY_CONFIG[key];
                const count = masterData[key]?.length || 0;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => {
                      setActiveEntity(key);
                      setEditingEntityId(null);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 text-sm rounded-lg border ${
                      activeEntity === key
                        ? "bg-indigo-50 border-indigo-500 text-indigo-700"
                        : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <span>{cfg.pluralLabel}</span>
                    <span className="text-xs text-gray-500">{count}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* -------------------------------------------------Right side: form + list + csv---------------------------------------------- */}

          {/* Right: form + list + csv */}
          <div className="lg:col-span-3 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-800">
                  {currentEntityConfig.pluralLabel}
                </h2>
                <p className="text-xs text-gray-500">
                  {currentEntityConfig.description}
                </p>
              </div>
            </div>

            {/* Form */}
            <form
              onSubmit={handleEntitySubmit}
              className="space-y-4 bg-gray-50 rounded-xl border border-gray-200 p-4"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentEntityConfig.fields.map((field) => (
                  <div key={field.name} className="space-y-1">
                    <label className="text-xs font-medium text-gray-700">
                      {field.label}
                      {field.required && (
                        <span className="text-red-500 ml-0.5">*</span>
                      )}
                    </label>
                    <input
                      type="text"
                      name={field.name}
                      value={(entityForm[activeEntity] || {})[field.name] || ""}
                      onChange={handleEntityInputChange}
                      placeholder={field.placeholder}
                      className="w-full px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-end gap-3">
                {editingEntityId && (
                  <button
                    type="button"
                    onClick={resetEntityForm}
                    className="px-3 py-2 text-xs rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100"
                  >
                    Cancel edit
                  </button>
                )}
                <button
                  type="button"
                  onClick={resetEntityForm}
                  className="px-3 py-2 text-xs rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100"
                >
                  Clear
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-medium rounded-lg bg-indigo-600 text-white hover:bg-indigo-700"
                >
                  {editingEntityId ? "Update" : "Add"}{" "}
                  {currentEntityConfig.label}
                </button>
              </div>
            </form>

            {/* CSV + List */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* CSV import */}
              <div className="space-y-2 md:col-span-1">
                <h3 className="text-sm font-semibold text-gray-800">
                  Import via CSV
                </h3>
                <p className="text-xs text-gray-500">
                  CSV should be comma-separated with header:{" "}
                  <span className="font-mono bg-gray-100 px-1 py-0.5 rounded">
                    {currentEntityConfig.csvExampleHeader}
                  </span>
                </p>
                <input
                  type="file"
                  accept=".csv,text/csv"
                  onChange={handleCsvUpload}
                  className="mt-2 block w-full text-xs text-gray-600 file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-medium file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                />
              </div>

              {/* List */}
              <div className="md:col-span-2 space-y-2">
                <h3 className="text-sm font-semibold text-gray-800">
                  Existing {currentEntityConfig.pluralLabel}
                </h3>
                <div className="max-h-64 overflow-y-auto border border-gray-200 rounded-lg bg-white">
                  {masterData[activeEntity]?.length ? (
                    <table className="min-w-full text-xs">
                      <thead className="bg-gray-50 sticky top-0 z-10">
                        <tr>
                          {currentEntityConfig.fields.map((f) => (
                            <th
                              key={f.name}
                              className="px-2 py-2 text-left font-semibold text-gray-700"
                            >
                              {f.label}
                            </th>
                          ))}
                          <th className="px-2 py-2 text-right font-semibold text-gray-700">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {masterData[activeEntity].map((item) => (
                          <tr
                            key={item.id}
                            className="border-t border-gray-100 hover:bg-gray-50"
                          >
                            {currentEntityConfig.fields.map((f) => (
                              <td
                                key={f.name}
                                className="px-2 py-1 text-[11px] text-gray-800"
                              >
                                {item[f.name]}
                              </td>
                            ))}
                            <td className="px-2 py-1 text-right">
                              <button
                                type="button"
                                onClick={() => handleEntityEdit(item)}
                                className="inline-flex items-center px-2 py-1 text-[11px] rounded border border-gray-300 text-gray-700 hover:bg-gray-100 mr-1"
                              >
                                Edit
                              </button>
                              <button
                                type="button"
                                onClick={() => handleEntityDelete(item.id)}
                                className="inline-flex items-center px-2 py-1 text-[11px] rounded border border-red-200 text-red-600 hover:bg-red-50"
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <div className="p-4 text-xs text-gray-500 text-center">
                      No records yet. Add using the form or import a CSV file.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* -------------------------------------------------Right side: form + list + csv---------------------------------------------- */}

      {/* -------------------------------------------------TimeTable---------------------------------------------- */}

     
    </div>
  );
}
