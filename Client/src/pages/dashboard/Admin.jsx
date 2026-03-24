import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import SideBar from "../../components/deshboard/SideBar";
import DataTable from "../../components/deshboard/DataTable";
import Form from "../../components/deshboard/Form";
import { fetchMasterData, setActiveEntity, setEditingEntityId } from "../../store/admin/adminSlice";

function Admin() {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const userData = useSelector((state) => state.auth.userData);
  const navigate = useNavigate();

  const { activeEntity, masterData, loading, error } = useSelector((state) => state.admin);

  useEffect(() => {
    if (!isAuthenticated || !userData || userData.role !== "admin") {
      navigate("/");
    }
  }, [isAuthenticated, userData, navigate]);

  if (!isAuthenticated || !userData || userData.role !== "admin") {
    // Render nothing or a loading spinner while redirecting
    return null;
  }

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

  useEffect(() => {
    if (activeEntity && !masterData[activeEntity]) {
      dispatch(fetchMasterData(activeEntity));
    }
  }, [activeEntity, dispatch, masterData]);

  const handleSetActiveEntity = (entityKey) => {
    dispatch(setActiveEntity(entityKey));
  };
  const handleSetEditingEntityId = (id) => {
    dispatch(setEditingEntityId(id));
  };

  const headerActions = [
    { label: "Master Data", className: "bg-primary hover:bg-secondary text-white border-transparent" },
    { label: "Timetables", className: "bg-background border border-text/20 hover:bg-text/10 text-text" },
  ];

  const renderContent = () => {
    if (!activeEntity) {
      return (
        <div className="flex-1 p-8 flex flex-col items-center justify-center text-center text-text/60 h-full">
          <svg
            className="w-24 h-24 mb-6 text-text/40"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1"
              d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
            />
          </svg>
          <h3 className="text-xl font-semibold text-text/80 mb-2">
            Welcome to the Admin Dashboard
          </h3>
          <p className="text-base text-text/60">
            Please select an item from the sidebar to get started.
          </p>
        </div>
      );
    }

    const currentEntityConfig = ENTITY_CONFIG[activeEntity];

    return (
      <div className="flex-1 p-8 space-y-6 bg-background overflow-y-auto h-full text-text">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold text-text">
            {currentEntityConfig.pluralLabel}
          </h2>
          <div className="flex items-center space-x-4">
            {loading && (
              <div className="flex items-center space-x-2">
                <svg
                  className="animate-spin h-5 w-5 text-blue-600"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                <span className="text-sm font-medium text-blue-600">
                  Loading...
                </span>
              </div>
            )}
            {error && (
              <div className="flex items-center space-x-2 bg-red-100 px-3 py-2 rounded-md">
                <svg
                  className="h-5 w-5 text-red-600"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
                <span className="text-sm text-red-700 font-medium">
                  {error}
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="bg-surface p-6 rounded-lg shadow-md border border-border">
          <Form currentEntityConfig={currentEntityConfig} activeEntity={activeEntity} />
        </div>
        <div className="bg-surface p-6 rounded-lg shadow-md border border-border">
          <DataTable currentEntityConfig={currentEntityConfig} activeEntity={activeEntity} />
        </div>
      </div>
    );
  };

  return (
    <div className="w-full h-screen max-w-[1440px] mx-auto flex flex-col bg-background text-text transition-colors duration-200">
      <header className="flex items-center justify-between px-8 py-4 border-b border-border bg-surface">
        <h1 className="text-2xl font-bold text-text">Admin Dashboard</h1>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <aside className="w-72 border-r border-border px-4 py-6 overflow-y-auto hidden md:block bg-surface">
          <SideBar
            ENTITY_CONFIG={ENTITY_CONFIG}
            masterData={masterData}
            activeEntity={activeEntity}
            setActiveEntity={handleSetActiveEntity}
            setEditingEntityId={handleSetEditingEntityId}
          />
        </aside>

        <main className="flex-1 overflow-hidden">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}

export default Admin;
