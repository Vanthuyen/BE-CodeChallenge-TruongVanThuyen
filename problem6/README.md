# BE-CodeChallenge-TruongVanThuyen

This folder solves problem number 6 in the backend programming challenge.
# Scoreboard API Service Specification

## 1. Introduction
The **Scoreboard API Service** provides backend functionality for managing a **live-updating scoreboard**.  
It enables:
- Secure **score updates** via authenticated API calls.
- Real-time broadcasting of the **top 10 users’ scores**.
- Role-based access control (User vs Admin).

**Highlight:** Users can only update their own score; Admins can manage/reset scores and view audit logs.

## 2. Overview / Architecture
The service exposes RESTful endpoints for score updates and retrieval. It uses WebSockets (or Server-Sent Events) for live updates. Authentication and authorization are enforced to prevent unauthorized score manipulation.

**Components:**
- REST API Server (Node.js/Express or similar)
- Database (e.g., PostgreSQL/Redis for fast leaderboard queries)
- WebSocket Server for real-time updates
- Authentication Middleware (JWT)

## 3. API Specification

### Authentication
All endpoints require a valid JWT token.

### Endpoints

#### `POST /api/auth/register`
**Description:** Register a new user account.
**Request Body:** 

{
  "username": "string",
  "email": "string",
  "password": "string"
}
**Response (201):**

{
  "userId": "uuid",
  "username": "string",
  "email": "string"
}

**Error Codes:**
400 Bad Request → Invalid input
409 Conflict → User already exists

#### `POST /api/auth/login`
**Description:** Authenticate user and return JWT tokens.
**Request Body:**
{
  "username": "string",
  "password": "string"
}


**Response (200):**
{
  "accessToken": "jwt-token",
  "refreshToken": "jwt-refresh-token",
  "expiresIn": 3600
}
**Error Codes:** 401 Unauthorized → Invalid credentials

#### `POST /api/auth/refresh`

**Description:** Refresh expired access token using refresh token.
**Request Body:**
{
  "refreshToken": "jwt-refresh-token"
}

**Response (200):**
{
  "accessToken": "new-jwt-token",
  "expiresIn": 3600
}

**Error Codes:** 401 Unauthorized → Invalid refresh token

#### `POST /api/auth/logout`
**Description:** Revoke user’s refresh token (invalidate session).
**Request Body:**

{
  "refreshToken": "jwt-refresh-token"
}

**Response (200):**

{
  "success": true
}

#### `POST /api/score/update`
**Description:** Increase the user’s score after completing a valid action.
**Request Body:**

{
  "userId": "string",
  "increment": number,
  "actionId": "string"
}
**Response (200):**
{
  "success": true,
  "newScore": 125
}
**Error Codes:**
400 Bad Request → Invalid input
401 Unauthorized → Invalid or missing token


#### `GET /api/score/top10`
**Description:** Retrieve the top 10 users by score.
**Response (200):**
[
  { "userId": "user1", "score": 150 },
  { "userId": "user2", "score": 140 }
]


#### `GET /api/score/:userId`
**Description:** Get the current score of a specific user.
**Response (200):**
{
  "userId": "user1",
  "score": 150
}
**Error Codes:** 404 Not Found → User does not exist


#### `GET /api/score/:userId`
**Description:** Get the current score of a specific user.
**Response (200):**
{
  "userId": "user1",
  "score": 150
}
**Error Codes:** 404 Not Found → User does not exist


#### `GET /api/score/history/:userId`
**Description:** Retrieve the score change history for a user (audit purpose).
**Response (200):**
{
  "userId": "user1",
  "history": [
    { "timestamp": "2025-09-06T12:00:00Z", "increment": 10, "newScore": 120 },
    { "timestamp": "2025-09-06T12:05:00Z", "increment": 5, "newScore": 125 }
  ]
}
**Error Codes:** 
400 Bad Request → userId invalid
404 Not Found -> userId not found


#### `POST /api/score/reset`
**Description:** Reset scores (admin only).
**Request Body (optional):**
{
  "scope": "all" | "user",
  "userId": "string"
}
**Response (200):**
{ "success": true }
**Error Codes:** 403 Forbidden → User not authorized


#### `DELETE /api/score/:userId`
**Description:** Delete a user’s score (admin only, e.g., cheating detected).
**Response (200):**
{ "success": true }
**Error Codes:**
403 Forbidden → User not authorized
404 Not Found → User does not exist



#### `WebSocket /scoreboard`
**Description:** Subscribe to live scoreboard updates.
**Events:**
scoreUpdated:
{ "userId": "user1", "newScore": 125 }

leaderboardUpdated:
[
  { "userId": "user1", "score": 150 },
  { "userId": "user2", "score": 140 }
]


### Authentication & User Management
| Method | Path                 | Description                           | Auth | Role    |
|--------|----------------------|---------------------------------------|------|---------|
| POST   | `/api/auth/register` | Register a new user                   | No   | Public  |
| POST   | `/api/auth/login`    | Authenticate user & return JWT tokens | No   | Public  |
| POST   | `/api/auth/refresh`  | Refresh access token                  | No   | Public  |
| POST   | `/api/auth/logout`   | Invalidate refresh token / logout     | Yes  | User    |

### Score Management
| Method | Path                        | Description                            | Auth | Role       |
|--------|-----------------------------|----------------------------------------|------|------------|
| POST   | `/api/score/update`         | Increase user score after an action    | Yes  | User       |
| GET    | `/api/score/top10`          | Get top 10 users’ scores               | Yes  | User       |
| GET    | `/api/score/:userId`        | Get score of a specific user           | Yes  | User       |
| GET    | `/api/score/history/:userId`| Get score history (audit log)          | Yes  | User/Admin |
| POST   | `/api/score/reset`          | Reset scores (all or specific user)    | Yes  | Admin      |
| DELETE | `/api/score/:userId`        | Delete a user’s score (cheating case)  | Yes  | Admin      |

### Real-time Updates
| Protocol | Path          | Description                         | Auth | Role |
|----------|--------------|-------------------------------------|------|------|
| WS       | `/scoreboard`| Subscribe to live scoreboard updates| Yes  | User |

## 4. Flow of Execution (Diagram)
![alt text](flowchart.png)

## 5. Non-functional Requirements
- **Security:** All endpoints require authentication. Input validation and rate limiting are enforced.
- **Performance:** Score updates and leaderboard queries must complete within 200ms.
- **Scalability:** Support at least 10,000 concurrent WebSocket connections.
- **Reliability:** 99.9% uptime, with automatic failover.

## 6. Deployment
- Containerized via Docker.
- Deployable on Kubernetes or cloud platforms (AWS/GCP/Azure).
- Environment variables for secrets and configuration.
- CI/CD pipeline for automated testing and deployment.

## 7. Improvement Suggestions
- Add audit logging for score changes.
- Implement anti-cheat mechanisms (e.g., action validation, anomaly detection).
- Support pagination for larger leaderboards.
- Integrate with external authentication providers.
- Add metrics and monitoring (Prometheus/Grafana).
- Consider using Redis for fast leaderboard operations.
