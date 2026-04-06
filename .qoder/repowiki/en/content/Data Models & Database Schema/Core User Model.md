# Core User Model

<cite>
**Referenced Files in This Document**
- [user.models.js](file://Backend/src/models/user.models.js)
- [user.controller.js](file://Backend/src/controllers/user.controller.js)
- [user.routers.js](file://Backend/src/routes/user.routers.js)
- [student.models.js](file://Backend/src/models/student.models.js)
- [faculty.models.js](file://Backend/src/models/faculty.models.js)
- [auth.middleware.js](file://Backend/src/middlewares/auth.middleware.js)
- [ApiError.js](file://Backend/src/utils/ApiError.js)
- [ApiResponse.js](file://Backend/src/utils/ApiResponse.js)
- [asyncHandler.js](file://Backend/src/utils/asyncHandler.js)
</cite>

## Update Summary
**Changes Made**
- Updated User Model Schema to document manual user_id management system
- Revised Registration Process to reflect manual user_id management requirement
- Updated Authentication Flow to show user_id vs student_id/faculty_id distinction
- Removed documentation for automatic user_id generation system
- Updated field definitions to clarify manual user_id management
- Added troubleshooting guidance for manual user_id management

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
This document provides comprehensive data model documentation for the User model within the timetable management system. It details the user schema including the manual user_id management system, password field, role enumeration, relationship fields, timestamps, and the self-referencing created_by and updated_by fields. The system requires explicit user_id provision while maintaining robust role-based access control and security considerations.

## Project Structure
The user model is part of a MongoDB/Mongoose-based backend architecture with Express.js routing and controller logic. The user model integrates with student and faculty collections through foreign keys (student_id and faculty_id), while the manual user_id management system ensures explicit identification control across all user types.

```mermaid
graph TB
subgraph "Models"
UM["User Model<br/>user.models.js"]
SM["Student Model<br/>student.models.js"]
FM["Faculty Model<br/>faculty.models.js"]
end
subgraph "Controllers"
UC["User Controller<br/>user.controller.js"]
end
subgraph "Routes"
UR["User Routes<br/>user.routers.js"]
end
subgraph "Middlewares"
AM["Auth Middleware<br/>auth.middleware.js"]
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
UC --> AM
UC --> AE
UC --> AR
UC --> AH
```

**Diagram sources**
- [user.models.js:1-102](file://Backend/src/models/user.models.js#L1-L102)
- [user.controller.js:1-654](file://Backend/src/controllers/user.controller.js#L1-L654)
- [user.routers.js:1-41](file://Backend/src/routes/user.routers.js#L1-L41)
- [auth.middleware.js:1-121](file://Backend/src/middlewares/auth.middleware.js#L1-L121)

**Section sources**
- [user.models.js:1-102](file://Backend/src/models/user.models.js#L1-L102)
- [user.controller.js:1-654](file://Backend/src/controllers/user.controller.js#L1-L654)
- [user.routers.js:1-41](file://Backend/src/routes/user.routers.js#L1-L41)

## Core Components
This section documents the primary data structures and their relationships, focusing on the manual user_id management system.

### User Model Schema
The User model defines the core authentication and authorization entity with manual user_id management:

**Updated** The user_id field is now manually managed and must be provided explicitly during user creation, eliminating automatic generation while maintaining uniqueness and validation requirements.

- **user_id**: String field with required validation, unique constraint, uppercase, trimmed
- **password**: String field with required validation and minimum length requirement
- **role**: Enumerated field with predefined values: admin, faculty, student, coordinator, hod
- **student_id**: String field for linking to student records (nullable, used for user_id management)
- **faculty_id**: String field for linking to faculty records (nullable, used for user_id management)
- **refreshToken**: String field for JWT refresh token storage
- **isActive**: Boolean flag indicating account status (default: true)
- **created_by**: Self-referencing ObjectId linking to another User (audit trail)
- **updated_by**: Self-referencing ObjectId linking to another User (audit trail)
- **timestamps**: Automatic createdAt and updatedAt fields

```mermaid
erDiagram
USER {
string user_id
string password
string role
string student_id
string faculty_id
string refreshToken
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
- [user.models.js:6-63](file://Backend/src/models/user.models.js#L6-L63)
- [student.models.js:5-11](file://Backend/src/models/student.models.js#L5-L11)
- [faculty.models.js:5-10](file://Backend/src/models/faculty.models.js#L5-L10)

**Section sources**
- [user.models.js:6-63](file://Backend/src/models/user.models.js#L6-L63)

### Manual User ID Management System
**Updated** The system now requires explicit user_id management with manual assignment:

- **Manual Assignment**: user_id field must be provided during user creation
- **Validation**: user_id is required and must be unique across all users
- **Format Flexibility**: No automatic prefix generation - user_id format is user-defined
- **Uniqueness**: Maintains unique user_id values across all user types
- **Consistency**: Ensures standardized identification format as defined by the user

**Section sources**
- [user.models.js:6-11](file://Backend/src/models/user.models.js#L6-L11)
- [user.controller.js:23-30](file://Backend/src/controllers/user.controller.js#L23-L30)

## Architecture Overview
The user management system follows a layered architecture with clear separation of concerns and manual user_id management:

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
Controller->>Controller : Validate input data (user_id required)
Controller->>Model : Create user (user_id provided manually)
Model->>DB : Save user document
DB-->>Model : Acknowledge
Model-->>Controller : Saved user with provided user_id
Controller-->>Client : ApiResponse with user data
Client->>Router : GET /api/users/ : id (fetch)
Router->>Controller : getUserById()
Controller->>Model : Aggregate pipeline
Model->>Student : Lookup student data
Model->>Faculty : Lookup faculty data
Student-->>Model : Student documents
Faculty-->>Model : Faculty documents
Model-->>Controller : Aggregated user data
Controller-->>Client : ApiResponse with user details
```

**Diagram sources**
- [user.routers.js:22-29](file://Backend/src/routes/user.routers.js#L22-L29)
- [user.controller.js:14-132](file://Backend/src/controllers/user.controller.js#L14-L132)

## Detailed Component Analysis

### User Registration and Validation
**Updated** The registration process now requires manual user_id management:

```mermaid
flowchart TD
Start([Registration Request]) --> ValidateArray["Validate Array Input"]
ValidateArray --> ValidateEach["Validate Each User Record"]
ValidateEach --> CheckPassword{"Password Present?"}
CheckPassword --> |No| ErrorPassword["Throw ApiError: Password Required"]
CheckPassword --> |Yes| CheckRole{"Role Present?"}
CheckRole --> |No| ErrorRole["Throw ApiError: Role Required"]
CheckRole --> |Yes| CheckUserId{"User ID Present?"}
CheckUserId --> |No| ErrorUserId["Throw ApiError: User ID Required"]
CheckUserId --> |Yes| CheckId{"Student ID OR Faculty ID?"}
CheckId --> |No| ErrorId["Throw ApiError: ID Required"]
CheckId --> |Yes| CheckDuplicates["Check Existing Users"]
CheckDuplicates --> FilterUnique["Filter Unique Records"]
FilterUnique --> HasUnique{"Any Unique Records?"}
HasUnique --> |No| ErrorExists["Throw ApiError: All Users Exist"]
HasUnique --> |Yes| CreateUser["Create Users (user_id Manually Provided)"]
CreateUser --> Success["Return ApiResponse with provided user_ids"]
ErrorPassword --> End([End])
ErrorRole --> End
ErrorUserId --> End
ErrorId --> End
ErrorExists --> End
Success --> End
```

**Diagram sources**
- [user.controller.js:14-132](file://Backend/src/controllers/user.controller.js#L14-L132)

Key validation rules implemented:
- Password field is mandatory for all users
- Role field is mandatory and must match predefined enum values
- user_id field is mandatory and must be unique
- Either student_id or faculty_id must be provided
- Duplicate user_id, student_id, and faculty_id entries are prevented
- All provided users must be unique
- **Updated** user_id field must be provided manually during creation

**Section sources**
- [user.controller.js:14-132](file://Backend/src/controllers/user.controller.js#L14-L132)

### Role-Based Access Control System
The system implements role-based access control through the role enumeration with manual user_id management:

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
+string user_id (manually provided)
+string password
+string role
+string student_id
+string faculty_id
+boolean isActive
+ObjectId created_by
+ObjectId updated_by
+validateCredentials(username, password) boolean
+canAccess(resource, action) boolean
}
class UserManagement {
+validateUserIdFormat(user_id) boolean
+checkUserUniqueness(user_id) boolean
+assignUserRole(user_id, role) boolean
}
User --> UserRole : "uses"
User --> UserManagement : "managed by"
```

**Diagram sources**
- [user.models.js:19-28](file://Backend/src/models/user.models.js#L19-L28)
- [auth.middleware.js:47-62](file://Backend/src/middlewares/auth.middleware.js#L47-L62)

Role validation rules:
- Enum constraint prevents invalid role values
- Automatic lowercase normalization ensures consistent storage
- Trim operation removes whitespace
- Message validation provides clear error feedback
- **Updated** user_id management ensures consistent identification format

**Section sources**
- [user.models.js:19-28](file://Backend/src/models/user.models.js#L19-L28)
- [auth.middleware.js:47-62](file://Backend/src/middlewares/auth.middleware.js#L47-L62)

### Authentication and Authorization Flow
**Updated** The login process now uses user_id for authentication with manual user_id management:

```mermaid
sequenceDiagram
participant Client as "Client"
participant Controller as "User Controller"
participant Model as "User Model"
participant Student as "Student Model"
participant Faculty as "Faculty Model"
Client->>Controller : POST /api/users/login
Controller->>Controller : Validate input fields (user_id/password)
Controller->>Model : Find user by student_id OR faculty_id
Model->>Model : Match by provided user_id
Model->>Model : Verify password hash
Model->>Student : Lookup student data
Model->>Faculty : Lookup faculty data
Student-->>Model : Student documents
Faculty-->>Model : Faculty documents
Model->>Model : Add user_data field
Model->>Model : Project required fields
Model-->>Controller : Aggregated user data
Controller->>Controller : Check authentication result
Controller-->>Client : ApiResponse with user details
Note over Client,Model : Authentication successful with manual user_id
```

**Diagram sources**
- [user.controller.js:359-471](file://Backend/src/controllers/user.controller.js#L359-L471)

**Section sources**
- [user.controller.js:359-471](file://Backend/src/controllers/user.controller.js#L359-L471)

### Audit Trail Implementation
The self-referencing created_by and updated_by fields implement comprehensive audit trails:

```mermaid
erDiagram
USER {
object_id _id PK
string user_id
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
- [user.models.js:50-60](file://Backend/src/models/user.models.js#L50-L60)

Audit trail characteristics:
- Both fields reference the User collection
- Default values are null for new users
- updated_by field is automatically populated during updates
- Supports hierarchical audit trails for user management operations
- **Updated** user_id remains consistent even when audit trail fields change

**Section sources**
- [user.models.js:50-60](file://Backend/src/models/user.models.js#L50-L60)

### Data Retrieval and Projection
**Updated** The user controller implements sophisticated aggregation pipelines for data retrieval with manual user_id management:

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
- [user.controller.js:135-284](file://Backend/src/controllers/user.controller.js#L135-L284)

**Section sources**
- [user.controller.js:135-284](file://Backend/src/controllers/user.controller.js#L135-L284)

## Dependency Analysis
The user model has several important dependencies and relationships:

```mermaid
graph LR
subgraph "Internal Dependencies"
UM["user.models.js"]
UC["user.controller.js"]
UR["user.routers.js"]
SM["student.models.js"]
FM["faculty.models.js"]
AM["auth.middleware.js"]
end
subgraph "External Dependencies"
MONGOOSE["mongoose"]
EXPRESS["express"]
BCRYPT["bcryptjs"]
UTILS["utils/*"]
end
UM --> MONGOOSE
UM --> BCRYPT
UC --> UM
UC --> SM
UC --> FM
UC --> AM
UR --> UC
UR --> EXPRESS
```

**Diagram sources**
- [user.models.js:1](file://Backend/src/models/user.models.js#L1)
- [user.controller.js:1-12](file://Backend/src/controllers/user.controller.js#L1-L12)
- [user.routers.js:1](file://Backend/src/routes/user.routers.js#L1)
- [auth.middleware.js:1-5](file://Backend/src/middlewares/auth.middleware.js#L1-L5)

Key dependency relationships:
- User model depends on Mongoose for schema definition and database operations
- User model depends on bcryptjs for password hashing
- User controller depends on User, Student, and Faculty models for data operations
- Router module depends on controller functions for endpoint handling
- Auth middleware provides role-based access control
- Utility modules (ApiError, ApiResponse, asyncHandler) provide error handling and response formatting

**Section sources**
- [user.models.js:1](file://Backend/src/models/user.models.js#L1)
- [user.controller.js:1-12](file://Backend/src/controllers/user.controller.js#L1-L12)
- [user.routers.js:1](file://Backend/src/routes/user.routers.js#L1)

## Performance Considerations
Several performance optimizations are implemented in the user model and controller:

- **Indexing**: Role name field is indexed for faster lookups
- **Aggregation Pipelines**: Efficient data retrieval using MongoDB aggregation framework
- **Selective Field Projection**: Sensitive fields like passwords are excluded from responses
- **Conditional Lookups**: Student and faculty data are only retrieved when needed
- **Batch Operations**: Bulk user registration reduces database round trips
- **Manual user_id Management**: Eliminates automatic ID generation overhead
- **Hashing Optimization**: Password hashing with configurable salt rounds

## Troubleshooting Guide

### Common Issues and Solutions

**Authentication Failures**
- Verify that user_id matches either student_id or faculty_id (both supported)
- Ensure password field is included in login request
- Check that user.isActive is set to true
- **Updated** Note: user_id must be provided manually during registration

**Registration Errors**
- Confirm that password field is present in all user records
- Validate that role matches one of the supported enum values
- Ensure unique user_id values are provided
- **Updated** user_id field is now required and must be provided manually

**Data Retrieval Issues**
- Verify that student_id or faculty_id relationships are properly established
- Check that aggregation pipeline is correctly configured
- Ensure that sensitive fields are properly excluded from projections
- **Updated** user_id field is manually managed and doesn't require automatic generation

**Audit Trail Problems**
- Confirm that created_by and updated_by fields are properly populated
- Verify that self-referencing relationships are maintained
- Check that ObjectId references are valid

**User ID Management Issues**
- **Updated** Ensure that user_id is provided during user creation
- Verify that user_id is unique across all user records
- Check that user_id format meets application requirements
- Confirm that user_id follows the manual management approach

**Section sources**
- [user.controller.js:359-471](file://Backend/src/controllers/user.controller.js#L359-L471)
- [ApiError.js:1-21](file://Backend/src/utils/ApiError.js#L1-L21)
- [ApiResponse.js:1-10](file://Backend/src/utils/ApiResponse.js#L1-L10)

## Conclusion
The User model provides a robust foundation for the timetable management system's authentication and authorization needs. The manual user_id management system eliminates automatic ID generation overhead while maintaining strong data integrity and security. The implementation includes comprehensive validation, role-based access control, audit trails, efficient data retrieval mechanisms, and explicit user identification management. The modular architecture supports future enhancements while maintaining clear separation of concerns and consistent user identification across all user types.