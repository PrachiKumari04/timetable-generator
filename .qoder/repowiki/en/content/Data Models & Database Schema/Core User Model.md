# Core User Model

<cite>
**Referenced Files in This Document**
- [user.models.js](file://Backend/src/models/user.models.js)
- [role.models.js](file://Backend/src/models/role.models.js)
- [user.controller.js](file://Backend/src/controllers/user.controller.js)
- [user.routers.js](file://Backend/src/routes/user.routers.js)
- [student.models.js](file://Backend/src/models/student.models.js)
- [faculty.models.js](file://Backend/src/models/faculty.models.js)
- [ApiError.js](file://Backend/src/utils/ApiError.js)
- [ApiResponse.js](file://Backend/src/utils/ApiResponse.js)
- [asyncHandler.js](file://Backend/src/utils/asyncHandler.js)
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

## Introduction
This document provides comprehensive data model documentation for the User and Role models within the timetable management system. It details the user schema including password field, role enumeration, relationship fields, timestamps, and the self-referencing created_by and updated_by fields. It also explains the role-based access control system, validation rules, and security considerations for password storage and role validation.

## Project Structure
The user and role models are part of a MongoDB/Mongoose-based backend architecture with Express.js routing and controller logic. The user model integrates with student and faculty collections through foreign keys (student_id and faculty_id), while the role model maintains separate role definitions with audit fields.

```mermaid
graph TB
subgraph "Models"
UM["User Model<br/>user.models.js"]
RM["Role Model<br/>role.models.js"]
SM["Student Model<br/>student.models.js"]
FM["Faculty Model<br/>faculty.models.js"]
end
subgraph "Controllers"
UC["User Controller<br/>user.controller.js"]
end
subgraph "Routes"
UR["User Routes<br/>user.routers.js"]
end
subgraph "Utilities"
AE["ApiError<br/>ApiError.js"]
AR["ApiResponse<br/>ApiResponse.js"]
AH["Async Handler<br/>asyncHandler.js"]
end
UR --> UC
UC --> UM
UM --> SM
UM --> FM
RM --> UM
UC --> AE
UC --> AR
UC --> AH
```

**Diagram sources**
- [user.models.js:1-61](file://Backend/src/models/user.models.js#L1-L61)
- [role.models.js:1-43](file://Backend/src/models/role.models.js#L1-L43)
- [user.controller.js:1-355](file://Backend/src/controllers/user.controller.js#L1-L355)
- [user.routers.js:1-19](file://Backend/src/routes/user.routers.js#L1-L19)

**Section sources**
- [user.models.js:1-61](file://Backend/src/models/user.models.js#L1-L61)
- [role.models.js:1-43](file://Backend/src/models/role.models.js#L1-L43)
- [user.controller.js:1-355](file://Backend/src/controllers/user.controller.js#L1-L355)
- [user.routers.js:1-19](file://Backend/src/routes/user.routers.js#L1-L19)

## Core Components
This section documents the primary data structures and their relationships.

### User Model Schema
The User model defines the core authentication and authorization entity with the following fields:

- **password**: String field with required validation
- **role**: Enumerated field with predefined values: admin, faculty, student, coordinator, hod
- **student_id**: String field for linking to student records (nullable)
- **faculty_id**: String field for linking to faculty records (nullable)
- **isActive**: Boolean flag indicating account status (default: true)
- **created_by**: Self-referencing ObjectId linking to another User (audit trail)
- **updated_by**: Self-referencing ObjectId linking to another User (audit trail)
- **timestamps**: Automatic createdAt and updatedAt fields

```mermaid
erDiagram
USER {
string password
string role
string student_id
string faculty_id
boolean isActive
object_id created_by
object_id updated_by
datetime createdAt
datetime updatedAt
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
boolean isActive
}
USER ||--|| STUDENT : "student_id"
USER ||--|| FACULTY : "faculty_id"
USER }o--|| USER : "created_by"
USER }o--|| USER : "updated_by"
```

**Diagram sources**
- [user.models.js:13-58](file://Backend/src/models/user.models.js#L13-L58)
- [student.models.js:5-65](file://Backend/src/models/student.models.js#L5-L65)
- [faculty.models.js:5-76](file://Backend/src/models/faculty.models.js#L5-L76)

### Role Model Schema
The Role model provides separate role definitions with administrative capabilities:

- **role_id**: Unique identifier (uppercase, unique)
- **role_name**: Human-readable role name (lowercase, indexed)
- **role_description**: Role description text
- **isActive**: Boolean status flag
- **created_by**: Self-referencing ObjectId for audit trail
- **updated_by**: Self-referencing ObjectId for audit trail
- **timestamps**: Automatic createdAt and updatedAt fields

**Section sources**
- [user.models.js:13-58](file://Backend/src/models/user.models.js#L13-L58)
- [role.models.js:4-42](file://Backend/src/models/role.models.js#L4-L42)

## Architecture Overview
The user management system follows a layered architecture with clear separation of concerns:

```mermaid
sequenceDiagram
participant Client as "Client Application"
participant Router as "User Router"
participant Controller as "User Controller"
participant Model as "User Model"
participant Student as "Student Model"
participant Faculty as "Faculty Model"
participant DB as "MongoDB"
Client->>Router : POST /api/users (register)
Router->>Controller : registerUser()
Controller->>Controller : Validate input data
Controller->>Model : insertMany(uniqueUsers)
Model->>DB : Save user documents
DB-->>Model : Acknowledge
Model-->>Controller : Saved user records
Controller-->>Client : ApiResponse with user data
Client->>Router : GET /api/users/ : id (fetch)
Router->>Controller : getUserById()
Controller->>Model : aggregate pipeline
Model->>Student : Lookup student data
Model->>Faculty : Lookup faculty data
Student-->>Model : Student documents
Faculty-->>Model : Faculty documents
Model-->>Controller : Aggregated user data
Controller-->>Client : ApiResponse with user details
```

**Diagram sources**
- [user.routers.js:14-16](file://Backend/src/routes/user.routers.js#L14-L16)
- [user.controller.js:8-81](file://Backend/src/controllers/user.controller.js#L8-L81)
- [user.controller.js:164-236](file://Backend/src/controllers/user.controller.js#L164-L236)
- [user.models.js:1-61](file://Backend/src/models/user.models.js#L1-L61)

## Detailed Component Analysis

### User Registration and Validation
The registration process handles bulk user creation with comprehensive validation:

```mermaid
flowchart TD
Start([Registration Request]) --> ValidateArray["Validate Array Input"]
ValidateArray --> ValidateEach["Validate Each User Record"]
ValidateEach --> CheckPassword{"Password Present?"}
CheckPassword --> |No| ErrorPassword["Throw ApiError: Password Required"]
CheckPassword --> |Yes| CheckRole{"Role Present?"}
CheckRole --> |No| ErrorRole["Throw ApiError: Role Required"]
CheckRole --> |Yes| CheckId{"Student ID OR Faculty ID?"}
CheckId --> |No| ErrorId["Throw ApiError: ID Required"]
CheckId --> |Yes| CheckDuplicates["Check Existing Users"]
CheckDuplicates --> FilterUnique["Filter Unique Records"]
FilterUnique --> HasUnique{"Any Unique Records?"}
HasUnique --> |No| ErrorExists["Throw ApiError: All Users Exist"]
HasUnique --> |Yes| InsertUsers["Insert Unique Users"]
InsertUsers --> Success["Return ApiResponse"]
ErrorPassword --> End([End])
ErrorRole --> End
ErrorId --> End
ErrorExists --> End
Success --> End
```

**Diagram sources**
- [user.controller.js:8-81](file://Backend/src/controllers/user.controller.js#L8-L81)

Key validation rules implemented:
- Password field is mandatory for all users
- Role field is mandatory and must match predefined enum values
- Either student_id or faculty_id must be provided
- Duplicate student_id and faculty_id entries are prevented
- All provided users must be unique

**Section sources**
- [user.controller.js:8-81](file://Backend/src/controllers/user.controller.js#L8-L81)

### Role-Based Access Control System
The system implements role-based access control through the role enumeration:

```mermaid
classDiagram
class UserRole {
+string admin
+string faculty
+string student
+string coordinator
+string hod
+validateRole(role) boolean
+getPermissions(role) string[]
}
class User {
+string password
+string role
+string student_id
+string faculty_id
+boolean isActive
+ObjectId created_by
+ObjectId updated_by
+validateCredentials(user_id, password) boolean
+canAccess(resource, action) boolean
}
class RoleValidation {
+validateEnum(role) boolean
+normalizeRole(role) string
+getSupportedRoles() string[]
}
User --> UserRole : "uses"
UserRole --> RoleValidation : "validates against"
```

**Diagram sources**
- [user.models.js:19-28](file://Backend/src/models/user.models.js#L19-L28)
- [user.controller.js:280-354](file://Backend/src/controllers/user.controller.js#L280-L354)

Role validation rules:
- Enum constraint prevents invalid role values
- Automatic lowercase normalization ensures consistent storage
- Trim operation removes whitespace
- Message validation provides clear error feedback

**Section sources**
- [user.models.js:19-28](file://Backend/src/models/user.models.js#L19-L28)
- [user.controller.js:280-354](file://Backend/src/controllers/user.controller.js#L280-L354)

### Authentication and Authorization Flow
The login process demonstrates role-based access patterns:

```mermaid
sequenceDiagram
participant Client as "Client"
participant Controller as "User Controller"
participant Model as "User Model"
participant Student as "Student Model"
participant Faculty as "Faculty Model"
Client->>Controller : POST /api/users/login
Controller->>Controller : Validate input fields
Controller->>Model : Aggregate with $match
Model->>Model : Match by student_id OR faculty_id
Model->>Model : Match by password
Model->>Student : Lookup student data
Model->>Faculty : Lookup faculty data
Student-->>Model : Student documents
Faculty-->>Model : Faculty documents
Model->>Model : Add user_data field
Model->>Model : Project required fields
Model-->>Controller : Aggregated user data
Controller->>Controller : Check authentication result
Controller-->>Client : ApiResponse with user details
Note over Client,Model : Authentication successful with role-based access
```

**Diagram sources**
- [user.controller.js:280-354](file://Backend/src/controllers/user.controller.js#L280-L354)
- [user.models.js:13-58](file://Backend/src/models/user.models.js#L13-L58)

**Section sources**
- [user.controller.js:280-354](file://Backend/src/controllers/user.controller.js#L280-L354)

### Audit Trail Implementation
The self-referencing created_by and updated_by fields implement comprehensive audit trails:

```mermaid
erDiagram
USER {
object_id _id PK
string password
string role
string student_id
string faculty_id
boolean isActive
object_id created_by FK
object_id updated_by FK
datetime createdAt
datetime updatedAt
}
USER ||--o{ USER : "created_by"
USER ||--o{ USER : "updated_by"
```

**Diagram sources**
- [user.models.js:45-55](file://Backend/src/models/user.models.js#L45-L55)

Audit trail characteristics:
- Both fields reference the User collection
- Default values are null for new users
- updated_by field is automatically populated during updates
- Supports hierarchical audit trails for user management operations

**Section sources**
- [user.models.js:45-55](file://Backend/src/models/user.models.js#L45-L55)

### Data Retrieval and Projection
The user controller implements sophisticated aggregation pipelines for data retrieval:

```mermaid
flowchart TD
Start([User Query]) --> LookupStudent["Lookup Student Data"]
LookupStudent --> LookupFaculty["Lookup Faculty Data"]
LookupFaculty --> AddUserData["Add User Data Field"]
AddUserData --> ConditionalProjection["Conditional Field Projection"]
ConditionalProjection --> RemoveSensitive["Remove Sensitive Fields"]
RemoveSensitive --> ReturnResult["Return User Data"]
LookupStudent --> StudentMatch{"Has Student Data?"}
StudentMatch --> |Yes| UseStudent["Use Student Fields"]
StudentMatch --> |No| UseFaculty["Use Faculty Fields"]
UseStudent --> AddUserData
UseFaculty --> AddUserData
```

**Diagram sources**
- [user.controller.js:84-161](file://Backend/src/controllers/user.controller.js#L84-L161)

**Section sources**
- [user.controller.js:84-161](file://Backend/src/controllers/user.controller.js#L84-L161)

## Dependency Analysis
The user model has several important dependencies and relationships:

```mermaid
graph LR
subgraph "Internal Dependencies"
UM["user.models.js"]
RM["role.models.js"]
UC["user.controller.js"]
UR["user.routers.js"]
SM["student.models.js"]
FM["faculty.models.js"]
end
subgraph "External Dependencies"
MONGOOSE["mongoose"]
EXPRESS["express"]
UTILS["utils/*"]
end
UM --> MONGOOSE
RM --> MONGOOSE
UC --> UM
UC --> SM
UC --> FM
UC --> UTILS
UR --> UC
UR --> EXPRESS
```

**Diagram sources**
- [user.models.js:1](file://Backend/src/models/user.models.js#L1)
- [role.models.js:1](file://Backend/src/models/role.models.js#L1)
- [user.controller.js:1-5](file://Backend/src/controllers/user.controller.js#L1-L5)
- [user.routers.js:1](file://Backend/src/routes/user.routers.js#L1)

Key dependency relationships:
- User model depends on Mongoose for schema definition and database operations
- User controller depends on User, Student, and Faculty models for data operations
- Router module depends on controller functions for endpoint handling
- Utility modules (ApiError, ApiResponse, asyncHandler) provide error handling and response formatting

**Section sources**
- [user.models.js:1](file://Backend/src/models/user.models.js#L1)
- [user.controller.js:1-5](file://Backend/src/controllers/user.controller.js#L1-L5)
- [user.routers.js:1](file://Backend/src/routes/user.routers.js#L1)

## Performance Considerations
Several performance optimizations are implemented in the user model and controller:

- **Indexing**: Role name field is indexed for faster lookups
- **Aggregation Pipelines**: Efficient data retrieval using MongoDB aggregation framework
- **Selective Field Projection**: Sensitive fields like passwords are excluded from responses
- **Conditional Lookups**: Student and faculty data are only retrieved when needed
- **Batch Operations**: Bulk user registration reduces database round trips

## Troubleshooting Guide

### Common Issues and Solutions

**Authentication Failures**
- Verify that user_id matches either student_id or faculty_id
- Ensure password field is included in login request
- Check that user.isActive is set to true

**Registration Errors**
- Confirm that password field is present in all user records
- Validate that role matches one of the supported enum values
- Ensure unique student_id or faculty_id values are provided

**Data Retrieval Issues**
- Verify that student_id or faculty_id relationships are properly established
- Check that aggregation pipeline is correctly configured
- Ensure that sensitive fields are properly excluded from projections

**Audit Trail Problems**
- Confirm that created_by and updated_by fields are properly populated
- Verify that self-referencing relationships are maintained
- Check that ObjectId references are valid

**Section sources**
- [user.controller.js:280-354](file://Backend/src/controllers/user.controller.js#L280-L354)
- [ApiError.js:1-21](file://Backend/src/utils/ApiError.js#L1-L21)
- [ApiResponse.js:1-10](file://Backend/src/utils/ApiResponse.js#L1-L10)

## Conclusion
The User and Role models provide a robust foundation for the timetable management system's authentication and authorization needs. The implementation includes comprehensive validation, role-based access control, audit trails, and efficient data retrieval mechanisms. The modular architecture supports future enhancements while maintaining clear separation of concerns and strong data integrity through Mongoose schema validation and MongoDB aggregation capabilities.