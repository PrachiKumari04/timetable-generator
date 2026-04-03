# Database Relationships & Constraints

<cite>
**Referenced Files in This Document**
- [user.models.js](file://Backend/src/models/user.models.js)
- [student.models.js](file://Backend/src/models/student.models.js)
- [faculty.models.js](file://Backend/src/models/faculty.models.js)
- [role.models.js](file://Backend/src/models/role.models.js)
- [program.models.js](file://Backend/src/models/program.models.js)
- [class.models.js](file://Backend/src/models/class.models.js)
- [course.models.js](file://Backend/src/models/course.models.js)
- [section.models.js](file://Backend/src/models/section.models.js)
- [subject.models.js](file://Backend/src/models/subject.models.js)
- [semester.models.js](file://Backend/src/models/semester.models.js)
- [specialization.models.js](file://Backend/src/models/specialization.models.js)
- [room.models.js](file://Backend/src/models/room.models.js)
- [hod.models.js](file://Backend/src/models/hod.models.js)
- [index.js](file://Backend/src/db/index.js)
- [constenets.js](file://Backend/src/constenets.js)
</cite>

## Table of Contents
1. [Introduction](#introduction)
2. [Project Structure](#project-structure)
3. [Core Components](#core-components)
4. [Architecture Overview](#architecture-overview)
5. [Detailed Component Analysis](#detailed-component-analysis)
6. [Dependency Analysis](#dependency-analysis)
7. [Performance Considerations](#performance-considerations)
8. [Troubleshooting Guide](#troubleshooting-guide)
9. [Conclusion](#conclusion)
10. [Appendices](#appendices)

## Introduction
This document focuses on the database relationships, foreign key constraints, and referential integrity across the academic timetable models. It explains:
- Self-referencing relationships in the User model via created_by and updated_by
- Linking mechanisms between User and Personnel models via student_id and faculty_id
- Hierarchical relationships among academic entities and their impact on data integrity
- Indexing strategies and query optimization patterns
- Cascading behavior expectations and enforcement
- Validation rules and business constraints

## Project Structure
The database layer is implemented using Mongoose ODM with a set of models representing academic entities. Connections to MongoDB are established via a centralized connection module.

```mermaid
graph TB
subgraph "Database Layer"
DB["MongoDB"]
MONGO["Mongoose"]
end
subgraph "Connection"
CONN["connectDB()<br/>Backend/src/db/index.js"]
CNAME["DB Name<br/>Backend/src/constenets.js"]
end
CONN --> MONGO
MONGO --> DB
CNAME --> CONN
```

**Diagram sources**
- [index.js:1-19](file://Backend/src/db/index.js#L1-L19)
- [constenets.js:1-2](file://Backend/src/constenets.js#L1-L2)

**Section sources**
- [index.js:1-19](file://Backend/src/db/index.js#L1-L19)
- [constenets.js:1-2](file://Backend/src/constenets.js#L1-L2)

## Core Components
This section outlines the primary models and their roles in the academic timetable domain.

- User: Central identity and access model with role and self-referencing audit fields.
- Student: Academic persona with unique identifiers and personal attributes.
- Faculty: Academic staff persona with professional attributes.
- Role: Permission and access control model with self-referencing audit fields.
- Academic hierarchy: Program → Class → Course → Section → Subject → Semester → Specialization → Room → Hod

Key constraints observed:
- Unique identifiers enforced at schema level for entities requiring uniqueness.
- Enumerations constrain categorical fields to predefined sets.
- Self-referencing ObjectId fields for audit trails.
- Reference fields linking to parent entities via ObjectId and ref.

**Section sources**
- [user.models.js:1-61](file://Backend/src/models/user.models.js#L1-L61)
- [student.models.js:1-66](file://Backend/src/models/student.models.js#L1-L66)
- [faculty.models.js:1-77](file://Backend/src/models/faculty.models.js#L1-L77)
- [role.models.js:1-43](file://Backend/src/models/role.models.js#L1-L43)
- [program.models.js:1-24](file://Backend/src/models/program.models.js#L1-L24)
- [class.models.js:1-32](file://Backend/src/models/class.models.js#L1-L32)
- [course.models.js:1-33](file://Backend/src/models/course.models.js#L1-L33)
- [section.models.js:1-31](file://Backend/src/models/section.models.js#L1-L31)
- [subject.models.js:1-33](file://Backend/src/models/subject.models.js#L1-L33)
- [semester.models.js:1-28](file://Backend/src/models/semester.models.js#L1-L28)
- [specialization.models.js:1-39](file://Backend/src/models/specialization.models.js#L1-L39)
- [room.models.js:1-28](file://Backend/src/models/room.models.js#L1-L28)
- [hod.models.js:1-57](file://Backend/src/models/hod.models.js#L1-L57)

## Architecture Overview
The academic timetable architecture forms a hierarchical graph of entities. Foreign keys are represented as ObjectId references with optional denormalized string identifiers for human-readable keys.

```mermaid
erDiagram
PROGRAM ||--o{ CLASS : "has_many"
CLASS ||--o{ SECTION : "has_many"
SECTION ||--o{ SUBJECT : "associates_with"
SUBJECT ||--o{ COURSE : "mapped_to"
SEMESTER ||--o{ CLASS : "organizes"
SPECIALIZATION ||--o{ COURSE : "aligns_to"
ROOM ||--o{ HOD : "allocated_for"
FACULTY ||--o{ HOD : "assigned_as"
STUDENT ||--o{ HOD : "tracked_via"
ROLE ||--o{ USER : "defines_access"
USER ||--o{ USER : "created_by/updated_by"
PROGRAM {
string program_id PK
}
CLASS {
string class_id PK
string program_id
number year
string course_id
}
SECTION {
string section_name PK
string class_id
string discraption
}
SUBJECT {
string subject_id PK
string subject_name
number credit
}
COURSE {
string course_id PK
string course_name
number course_duration
}
SEMESTER {
number semester_name PK
}
SPECIALIZATION {
string specilization_id PK
string specilization_name
string program_id
string course_id
}
ROOM {
string room_no PK
number floor_no
string wing
}
HOD {
boolean isLab
}
FACULTY {
string faculty_id PK
string faculty_name
string email
number phone
string specialization
string higher_qualification
number years_of_Experience
string gender
date date_of_joining
date date_of_birth
string address
}
STUDENT {
string student_id PK
string student_name
string email
string class
string batch
string date_of_birth
string specialization
string division
}
ROLE {
string role_id PK
string role_name
string role_description
}
USER {
string password
string role
string student_id
string faculty_id
boolean isActive
object created_by
object updated_by
}
```

**Diagram sources**
- [program.models.js:1-24](file://Backend/src/models/program.models.js#L1-L24)
- [class.models.js:1-32](file://Backend/src/models/class.models.js#L1-L32)
- [section.models.js:1-31](file://Backend/src/models/section.models.js#L1-L31)
- [subject.models.js:1-33](file://Backend/src/models/subject.models.js#L1-L33)
- [course.models.js:1-33](file://Backend/src/models/course.models.js#L1-L33)
- [semester.models.js:1-28](file://Backend/src/models/semester.models.js#L1-L28)
- [specialization.models.js:1-39](file://Backend/src/models/specialization.models.js#L1-L39)
- [room.models.js:1-28](file://Backend/src/models/room.models.js#L1-L28)
- [hod.models.js:1-57](file://Backend/src/models/hod.models.js#L1-L57)
- [faculty.models.js:1-77](file://Backend/src/models/faculty.models.js#L1-L77)
- [student.models.js:1-66](file://Backend/src/models/student.models.js#L1-L66)
- [role.models.js:1-43](file://Backend/src/models/role.models.js#L1-L43)
- [user.models.js:1-61](file://Backend/src/models/user.models.js#L1-L61)

## Detailed Component Analysis

### User Model: Identity, Roles, and Self-Referencing Audit
- Purpose: Stores user credentials, role, and audit trail via created_by and updated_by.
- Self-referencing fields:
  - created_by: ObjectId referencing User
  - updated_by: ObjectId referencing User
- Linking to Personnels:
  - student_id: Optional string identifier linking to Student
  - faculty_id: Optional string identifier linking to Faculty
- Constraints:
  - role enum supports admin, faculty, student, coordinator, hod
  - timestamps enabled for createdAt/updatedAt
- Referential Integrity:
  - created_by/updated_by are optional; absence implies system or anonymous creation.
  - No explicit MongoDB-level foreign key constraints; referential integrity relies on application-level checks.

```mermaid
classDiagram
class User {
+string password
+string role
+string student_id
+string faculty_id
+boolean isActive
+ObjectId created_by
+ObjectId updated_by
}
class Student {
+string student_id PK
}
class Faculty {
+string faculty_id PK
}
User --> Student : "links via student_id"
User --> Faculty : "links via faculty_id"
User --> User : "self-reference created_by/updated_by"
```

**Diagram sources**
- [user.models.js:1-61](file://Backend/src/models/user.models.js#L1-L61)
- [student.models.js:1-66](file://Backend/src/models/student.models.js#L1-L66)
- [faculty.models.js:1-77](file://Backend/src/models/faculty.models.js#L1-L77)

**Section sources**
- [user.models.js:1-61](file://Backend/src/models/user.models.js#L1-L61)

### Role Model: Access Control with Audit Trail
- Purpose: Defines roles and their descriptions with isActive flag.
- Self-referencing audit fields:
  - created_by and updated_by reference User
- Constraints:
  - role_id unique and uppercase
  - role_name indexed for lookup
  - role enum enforced at application level via controller/model logic
- Referential Integrity:
  - Optional self-references; application logic should validate presence when required.

```mermaid
classDiagram
class Role {
+string role_id PK
+string role_name
+string role_description
+boolean isActive
+ObjectId created_by
+ObjectId updated_by
}
class User {
+string role
}
Role --> User : "audit trail via created_by/updated_by"
```

**Diagram sources**
- [role.models.js:1-43](file://Backend/src/models/role.models.js#L1-L43)
- [user.models.js:1-61](file://Backend/src/models/user.models.js#L1-L61)

**Section sources**
- [role.models.js:1-43](file://Backend/src/models/role.models.js#L1-L43)

### Academic Hierarchy: Program → Class → Course → Section → Subject
- Program defines academic programs with unique identifiers.
- Class links to Program and Course; year indicates academic year.
- Section belongs to Class; description field present.
- Subject represents subjects with credits; Course-subject mapping implied via shared identifiers.
- Semester organizes academic terms; Specialization aligns with Program and Course.
- Room provides physical allocation; Hod coordinates allocations across entities.

```mermaid
flowchart TD
P["Program(program_id)"] --> C["Class(class_id)<br/>refs Program<br/>year, course_id"]
C --> S["Section(section_name)<br/>refs Class"]
S --> Sub["Subject(subject_id)<br/>refs Course implicitly"]
P --> Sp["Specialization(specilization_id)<br/>refs Program, Course"]
Sem["Semester(semester_name)"] --> C
R["Room(room_no)"] --> H["Hod(...)"]
F["Faculty(faculty_id)"] --> H
St["Student(student_id)"] --> H
```

**Diagram sources**
- [program.models.js:1-24](file://Backend/src/models/program.models.js#L1-L24)
- [class.models.js:1-32](file://Backend/src/models/class.models.js#L1-L32)
- [section.models.js:1-31](file://Backend/src/models/section.models.js#L1-L31)
- [subject.models.js:1-33](file://Backend/src/models/subject.models.js#L1-L33)
- [course.models.js:1-33](file://Backend/src/models/course.models.js#L1-L33)
- [semester.models.js:1-28](file://Backend/src/models/semester.models.js#L1-L28)
- [specialization.models.js:1-39](file://Backend/src/models/specialization.models.js#L1-L39)
- [room.models.js:1-28](file://Backend/src/models/room.models.js#L1-L28)
- [hod.models.js:1-57](file://Backend/src/models/hod.models.js#L1-L57)
- [faculty.models.js:1-77](file://Backend/src/models/faculty.models.js#L1-L77)
- [student.models.js:1-66](file://Backend/src/models/student.models.js#L1-L66)

**Section sources**
- [program.models.js:1-24](file://Backend/src/models/program.models.js#L1-L24)
- [class.models.js:1-32](file://Backend/src/models/class.models.js#L1-L32)
- [section.models.js:1-31](file://Backend/src/models/section.models.js#L1-L31)
- [subject.models.js:1-33](file://Backend/src/models/subject.models.js#L1-L33)
- [course.models.js:1-33](file://Backend/src/models/course.models.js#L1-L33)
- [semester.models.js:1-28](file://Backend/src/models/semester.models.js#L1-L28)
- [specialization.models.js:1-39](file://Backend/src/models/specialization.models.js#L1-L39)
- [room.models.js:1-28](file://Backend/src/models/room.models.js#L1-L28)
- [hod.models.js:1-57](file://Backend/src/models/hod.models.js#L1-L57)

### Data Integrity and Referential Integrity
- Unique constraints:
  - Entities enforce unique identifiers at schema level (e.g., student_id, faculty_id, room_no, course_id, subject_id, program_id).
- Enumerations:
  - role and program_name restrict values to predefined sets.
- Self-referencing:
  - User.created_by and User.updated_by, Role.created_by and Role.updated_by are optional ObjectId references to User.
- Missing explicit foreign key constraints:
  - No MongoDB-level ON DELETE CASCADE or referential actions are defined in the schema.
  - Application-level validation and transactional patterns should ensure referential integrity.

**Section sources**
- [user.models.js:1-61](file://Backend/src/models/user.models.js#L1-L61)
- [role.models.js:1-43](file://Backend/src/models/role.models.js#L1-L43)
- [student.models.js:1-66](file://Backend/src/models/student.models.js#L1-L66)
- [faculty.models.js:1-77](file://Backend/src/models/faculty.models.js#L1-L77)
- [room.models.js:1-28](file://Backend/src/models/room.models.js#L1-L28)
- [course.models.js:1-33](file://Backend/src/models/course.models.js#L1-L33)
- [subject.models.js:1-33](file://Backend/src/models/subject.models.js#L1-L33)
- [program.models.js:1-24](file://Backend/src/models/program.models.js#L1-L24)

### Indexing Strategies and Query Optimization
Observed indexes:
- Student.student_name: indexed for efficient lookups by name.
- Faculty.faculty_name: indexed for efficient lookups by name.
- Role.role_name: indexed for role-based filtering.
- Subject.subject_name: indexed for subject lookups.
- Program.program_name: constrained via enum; combined with unique program_id for fast joins.
- Composite and multi-key optimizations:
  - Consider compound indexes on frequently filtered pairs (e.g., Program + Year in Class, or Semester + Program for scheduling).
  - Ensure consistent casing policies (uppercase/lowercase) to maximize index effectiveness.

**Section sources**
- [student.models.js:18-18](file://Backend/src/models/student.models.js#L18-L18)
- [faculty.models.js:12-12](file://Backend/src/models/faculty.models.js#L12-L12)
- [role.models.js:17-17](file://Backend/src/models/role.models.js#L17-L17)
- [subject.models.js:17-17](file://Backend/src/models/subject.models.js#L17-L17)
- [program.models.js:14-14](file://Backend/src/models/program.models.js#L14-L14)

### Cascading Behavior and Enforcement
- No explicit cascade delete/update rules are defined in the schema.
- Recommended application-level behavior:
  - Prevent deletion of referenced entities (e.g., deleting a Program should fail if Classes exist).
  - On soft deletes, propagate isActive=false and block dependent writes.
  - Enforce that User.student_id or User.faculty_id references must exist prior to enabling access.

**Section sources**
- [user.models.js:30-38](file://Backend/src/models/user.models.js#L30-L38)
- [class.models.js:13-16](file://Backend/src/models/class.models.js#L13-L16)
- [section.models.js:17-20](file://Backend/src/models/section.models.js#L17-L20)
- [hod.models.js:7-46](file://Backend/src/models/hod.models.js#L7-L46)

### Data Validation Rules and Business Constraints
- Required fields:
  - Student: student_id, student_name, email, class, batch, date_of_birth, specialization.
  - Faculty: faculty_id, faculty_name, email, phone, specialization, higher_qualification, years_of_Experience, gender, address.
  - Course: course_id, course_name, course_duration.
  - Subject: subject_id, subject_name, credit.
  - Program: program_id, program_name.
  - Room: room_no, floor_no, wing.
  - Section: section_name, class_id, discraption.
  - Semester: semester_name.
  - Specialization: specilization_id, specilization_name, program_id, course_id.
- Enumerations:
  - User.role restricted to admin, faculty, student, coordinator, hod.
  - Program.program_name restricted to Under_Graduate, Post_Graduate, Diploma, Post_Diploma.
- Uniqueness:
  - student_id, faculty_id, room_no, course_id, subject_id, program_id are unique.
- Case normalization:
  - Fields normalized to lowercase/uppercase as per schema to maintain consistency.

**Section sources**
- [student.models.js:5-61](file://Backend/src/models/student.models.js#L5-L61)
- [faculty.models.js:5-72](file://Backend/src/models/faculty.models.js#L5-L72)
- [course.models.js:5-31](file://Backend/src/models/course.models.js#L5-L31)
- [subject.models.js:5-28](file://Backend/src/models/subject.models.js#L5-L28)
- [program.models.js:5-19](file://Backend/src/models/program.models.js#L5-L19)
- [room.models.js:5-23](file://Backend/src/models/room.models.js#L5-L23)
- [section.models.js:11-27](file://Backend/src/models/section.models.js#L11-L27)
- [semester.models.js:12-22](file://Backend/src/models/semester.models.js#L12-L22)
- [specialization.models.js:5-34](file://Backend/src/models/specialization.models.js#L5-L34)
- [user.models.js:13-28](file://Backend/src/models/user.models.js#L13-L28)

### Complex Queries and Relationship Demonstrations
Below are example query patterns that leverage the defined relationships. Replace placeholders with actual values and ensure proper middleware validation.

- Find all Sections for a given Class:
  - Filter: { class_id: ObjectId("...") }
  - Populate: class_id to Class

- Retrieve Subjects associated with a Course (via shared identifiers):
  - Filter: { subject_id: { $in: [ "...", "..." ] } }
  - Or join via Course.subject_ids if extended

- List all Rooms allocated to a specific Hod:
  - Filter: { room_id: ObjectId("...") }
  - Populate: room_id to Room

- Get all Courses under a Program:
  - Filter: { program_id: ObjectId("...") }
  - Populate: program_id to Program

- Fetch Role details with creator/updater info:
  - Filter: { role_id: "..." }
  - Populate: created_by and updated_by to User

- Find a User’s audit trail:
  - Filter: { created_by: ObjectId("...") } or { updated_by: ObjectId("...") }

- Retrieve a Faculty member’s profile and related Hods:
  - Filter: { faculty_id: ObjectId("...") }
  - Populate: related fields to Hod, Course, Specialization, Room

Note: These are conceptual examples. Use your application’s controller and service layers to construct robust queries with error handling and population.

[No sources needed since this section provides conceptual examples]

## Dependency Analysis
This section maps inter-model dependencies and highlights potential circular or cross-module references.

```mermaid
graph LR
U["User"] --> S["Student"]
U --> F["Faculty"]
R["Role"] --> U
H["Hod"] --> P["Program"]
H --> C["Course"]
H --> Cl["Class"]
H --> Sec["Section"]
H --> Sub["Subject"]
H --> Ro["Room"]
H --> Fa["Faculty"]
H --> St["Student"]
Cl --> P
Sec --> Cl
Sub --> C
Sp["Specialization"] --> P
Sp --> C
Ro --> H
```

**Diagram sources**
- [user.models.js:1-61](file://Backend/src/models/user.models.js#L1-L61)
- [student.models.js:1-66](file://Backend/src/models/student.models.js#L1-L66)
- [faculty.models.js:1-77](file://Backend/src/models/faculty.models.js#L1-L77)
- [role.models.js:1-43](file://Backend/src/models/role.models.js#L1-L43)
- [hod.models.js:1-57](file://Backend/src/models/hod.models.js#L1-L57)
- [program.models.js:1-24](file://Backend/src/models/program.models.js#L1-L24)
- [class.models.js:1-32](file://Backend/src/models/class.models.js#L1-L32)
- [section.models.js:1-31](file://Backend/src/models/section.models.js#L1-L31)
- [subject.models.js:1-33](file://Backend/src/models/subject.models.js#L1-L33)
- [course.models.js:1-33](file://Backend/src/models/course.models.js#L1-L33)
- [specialization.models.js:1-39](file://Backend/src/models/specialization.models.js#L1-L39)
- [room.models.js:1-28](file://Backend/src/models/room.models.js#L1-L28)

**Section sources**
- [hod.models.js:1-57](file://Backend/src/models/hod.models.js#L1-L57)
- [class.models.js:1-32](file://Backend/src/models/class.models.js#L1-L32)
- [section.models.js:1-31](file://Backend/src/models/section.models.js#L1-L31)
- [subject.models.js:1-33](file://Backend/src/models/subject.models.js#L1-L33)
- [course.models.js:1-33](file://Backend/src/models/course.models.js#L1-L33)
- [program.models.js:1-24](file://Backend/src/models/program.models.js#L1-L24)
- [specialization.models.js:1-39](file://Backend/src/models/specialization.models.js#L1-L39)
- [room.models.js:1-28](file://Backend/src/models/room.models.js#L1-L28)
- [user.models.js:1-61](file://Backend/src/models/user.models.js#L1-L61)
- [student.models.js:1-66](file://Backend/src/models/student.models.js#L1-L66)
- [faculty.models.js:1-77](file://Backend/src/models/faculty.models.js#L1-L77)
- [role.models.js:1-43](file://Backend/src/models/role.models.js#L1-L43)

## Performance Considerations
- Index selection:
  - Ensure indexes on fields used in frequent filters and joins (e.g., student_id, faculty_id, class_id, course_id, subject_id).
  - Consider compound indexes for multi-field queries (e.g., Program + Year).
- Population strategies:
  - Limit population depth to avoid N+1 problems; fetch only required fields.
- Caching:
  - Cache static enumerations and master lists (roles, programs) to reduce DB load.
- Query pagination:
  - Apply skip/take or cursor-based pagination for large result sets.
- Data normalization:
  - Keep denormalized identifiers (e.g., student_id, faculty_id) consistent with normalized ObjectId references to optimize lookups.

[No sources needed since this section provides general guidance]

## Troubleshooting Guide
Common issues and resolutions grounded in schema constraints:

- Duplicate unique identifiers:
  - Symptoms: Insert failures for student_id, faculty_id, room_no, course_id, subject_id, program_id.
  - Resolution: Validate uniqueness before insert; handle duplicate key errors gracefully.

- Invalid role values:
  - Symptoms: Validation errors when setting User.role to unsupported value.
  - Resolution: Enforce enum validation in controllers/services; reject unknown roles.

- Missing referenced entities:
  - Symptoms: Null or dangling references in populated fields.
  - Resolution: Validate existence of referenced documents before write operations; implement soft-delete semantics.

- Self-reference audit anomalies:
  - Symptoms: created_by or updated_by is null unexpectedly.
  - Resolution: Ensure audit middleware populates these fields during create/update; treat null as system-initiated action.

- Case sensitivity mismatches:
  - Symptoms: Lookup failures due to inconsistent casing.
  - Resolution: Normalize stored values to lowercase/uppercase as per schema; apply consistent casing in queries.

**Section sources**
- [user.models.js:13-28](file://Backend/src/models/user.models.js#L13-L28)
- [student.models.js:5-11](file://Backend/src/models/student.models.js#L5-L11)
- [faculty.models.js:5-27](file://Backend/src/models/faculty.models.js#L5-L27)
- [room.models.js:5-23](file://Backend/src/models/room.models.js#L5-L23)
- [course.models.js:5-31](file://Backend/src/models/course.models.js#L5-L31)
- [subject.models.js:5-28](file://Backend/src/models/subject.models.js#L5-L28)
- [program.models.js:5-19](file://Backend/src/models/program.models.js#L5-L19)
- [user.models.js:45-55](file://Backend/src/models/user.models.js#L45-L55)
- [role.models.js:29-37](file://Backend/src/models/role.models.js#L29-L37)

## Conclusion
The academic timetable models define a clear, hierarchical structure with strong uniqueness and enumeration constraints. Self-referencing audit fields in User and Role enable provenance tracking. While MongoDB does not enforce foreign key constraints by default, the schema’s design and the outlined validation and application-level strategies ensure robust referential integrity. Proper indexing and query patterns further support performance and scalability.

[No sources needed since this section summarizes without analyzing specific files]

## Appendices
- Connection Details:
  - Database name: retrieved from constants and used during connection.
  - Connection function establishes the DB connection using environment-provided URI.

**Section sources**
- [constenets.js:1-2](file://Backend/src/constenets.js#L1-L2)
- [index.js:4-16](file://Backend/src/db/index.js#L4-L16)