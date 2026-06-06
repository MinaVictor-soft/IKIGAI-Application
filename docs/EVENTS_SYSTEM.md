# IKIGAI Events System Documentation

## Overview

The Events System manages all conference, gathering, and organizational events within the IKIGAI platform. It handles event creation, scheduling, attendance tracking, and notifications.

## Architecture

### Database Schema

```sql
-- Events Table
CREATE TABLE "Event" (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  eventType ENUM ('CONFERENCE', 'GATHERING', 'WORKSHOP', 'SERMON', 'PRAYER_MEETING', 'RETREAT') NOT NULL,
  startDate TIMESTAMP NOT NULL,
  endDate TIMESTAMP NOT NULL,
  location VARCHAR(255),
  capacity INT,
  image VARCHAR(500),
  isPublished BOOLEAN DEFAULT false,
  createdAt TIMESTAMP DEFAULT now(),
  updatedAt TIMESTAMP DEFAULT now(),
  createdBy UUID NOT NULL REFERENCES "User"(id),
  
  FOREIGN KEY (createdBy) REFERENCES "User"(id)
);

-- Event Attendees Table
CREATE TABLE "EventAttendee" (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  eventId UUID NOT NULL,
  userId UUID NOT NULL,
  status ENUM ('REGISTERED', 'ATTENDED', 'CANCELLED', 'NO_SHOW') DEFAULT 'REGISTERED',
  registeredAt TIMESTAMP DEFAULT now(),
  attendedAt TIMESTAMP,
  
  FOREIGN KEY (eventId) REFERENCES "Event"(id) ON DELETE CASCADE,
  FOREIGN KEY (userId) REFERENCES "User"(id) ON DELETE CASCADE,
  
  UNIQUE(eventId, userId),
  INDEX idx_event_id (eventId),
  INDEX idx_user_id (userId),
  INDEX idx_status (status)
);

-- Event Notifications Table
CREATE TABLE "EventNotification" (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  eventId UUID NOT NULL,
  notificationType ENUM ('EVENT_CREATED', 'EVENT_STARTING', 'REMINDER', 'CANCELLED') NOT NULL,
  sentAt TIMESTAMP DEFAULT now(),
  sentToAll BOOLEAN DEFAULT true,
  
  FOREIGN KEY (eventId) REFERENCES "Event"(id) ON DELETE CASCADE
);
```

## API Endpoints

### Event Management

#### Get All Events
```
GET /api/v1/events
Query Parameters:
  - page: number (default: 1)
  - limit: number (default: 10)
  - type: string (CONFERENCE|GATHERING|WORKSHOP|SERMON|PRAYER_MEETING|RETREAT)
  - published: boolean
  
Response:
{
  data: [
    {
      id: "uuid",
      title: "Sunday Service",
      description: "Weekly Sunday service",
      eventType: "SERMON",
      startDate: "2026-06-13T10:00:00Z",
      endDate: "2026-06-13T11:30:00Z",
      location: "Main Chapel",
      capacity: 500,
      attendeeCount: 145,
      image: "url",
      isPublished: true
    }
  ],
  pagination: { page: 1, limit: 10, total: 25 }
}
```

#### Get Event Details
```
GET /api/v1/events/:eventId

Response:
{
  data: {
    id: "uuid",
    title: "Sunday Service",
    description: "Weekly Sunday service",
    eventType: "SERMON",
    startDate: "2026-06-13T10:00:00Z",
    endDate: "2026-06-13T11:30:00Z",
    location: "Main Chapel",
    capacity: 500,
    attendees: [
      {
        userId: "uuid",
        userName: "John Doe",
        email: "john@example.com",
        status: "ATTENDED",
        registeredAt: "2026-06-06T08:00:00Z",
        attendedAt: "2026-06-13T10:05:00Z"
      }
    ],
    image: "url",
    isPublished: true,
    createdBy: "admin@ikigai.quest",
    createdAt: "2026-06-01T15:30:00Z"
  }
}
```

#### Create Event
```
POST /api/v1/events
Authentication: Required (Admin/Super Admin)

Body:
{
  title: "Youth Conference 2026",
  description: "Annual youth conference",
  eventType: "CONFERENCE",
  startDate: "2026-07-15T09:00:00Z",
  endDate: "2026-07-17T18:00:00Z",
  location: "Cairo Convention Center",
  capacity: 1000,
  image: "imageUrl",
  isPublished: false
}

Response: 201 Created
{
  data: {
    id: "uuid",
    title: "Youth Conference 2026",
    eventType: "CONFERENCE",
    startDate: "2026-07-15T09:00:00Z",
    endDate: "2026-07-17T18:00:00Z",
    capacity: 1000,
    isPublished: false,
    attendeeCount: 0,
    createdAt: "2026-06-06T12:00:00Z"
  }
}
```

#### Update Event
```
PATCH /api/v1/events/:eventId
Authentication: Required (Admin/Super Admin)

Body:
{
  title: "Youth Conference 2026 - Updated",
  description: "Updated description",
  capacity: 1200,
  isPublished: true
}

Response: 200 OK
{
  data: {
    id: "uuid",
    title: "Youth Conference 2026 - Updated",
    capacity: 1200,
    isPublished: true,
    updatedAt: "2026-06-06T13:00:00Z"
  }
}
```

#### Delete Event
```
DELETE /api/v1/events/:eventId
Authentication: Required (Admin/Super Admin)

Response: 200 OK
{
  message: "Event deleted successfully"
}
```

### Event Registration

#### Register for Event
```
POST /api/v1/events/:eventId/register
Authentication: Required

Response: 201 Created
{
  data: {
    eventId: "uuid",
    userId: "uuid",
    status: "REGISTERED",
    registeredAt: "2026-06-06T12:30:00Z"
  }
}
```

#### Cancel Registration
```
POST /api/v1/events/:eventId/cancel-registration
Authentication: Required

Response: 200 OK
{
  data: {
    status: "CANCELLED",
    cancelledAt: "2026-06-06T13:00:00Z"
  }
}
```

#### Get User's Events
```
GET /api/v1/events/my-events
Authentication: Required

Query Parameters:
  - status: REGISTERED|ATTENDED|CANCELLED|NO_SHOW

Response:
{
  data: [
    {
      id: "uuid",
      title: "Sunday Service",
      startDate: "2026-06-13T10:00:00Z",
      location: "Main Chapel",
      status: "REGISTERED",
      registeredAt: "2026-06-06T08:00:00Z"
    }
  ]
}
```

### Event Attendance

#### Mark Attendance
```
POST /api/v1/events/:eventId/mark-attendance
Authentication: Required (Admin)

Body:
{
  userId: "uuid",
  status: "ATTENDED" // or "NO_SHOW"
}

Response: 200 OK
{
  data: {
    eventId: "uuid",
    userId: "uuid",
    status: "ATTENDED",
    attendedAt: "2026-06-13T10:05:00Z"
  }
}
```

#### Get Event Attendees
```
GET /api/v1/events/:eventId/attendees
Authentication: Required (Admin)

Query Parameters:
  - status: REGISTERED|ATTENDED|CANCELLED|NO_SHOW
  - page: number
  - limit: number

Response:
{
  data: [
    {
      id: "uuid",
      userId: "uuid",
      userName: "John Doe",
      email: "john@example.com",
      status: "ATTENDED",
      registeredAt: "2026-06-06T08:00:00Z",
      attendedAt: "2026-06-13T10:05:00Z"
    }
  ],
  pagination: { page: 1, limit: 20, total: 145 }
}
```

## Event Types

| Type | Description | Use Case |
|------|-------------|----------|
| CONFERENCE | Large multi-day gathering | Annual conferences, major events |
| GATHERING | Regular group meeting | Midweek gatherings, special events |
| WORKSHOP | Educational/training session | Skills training, Bible studies |
| SERMON | Religious service/message | Sunday services, special messages |
| PRAYER_MEETING | Prayer focused event | Prayer groups, intercession meetings |
| RETREAT | Extended event (1-3 days) | Spiritual retreats, leadership retreats |

## Service Layer

### EventService Methods

```typescript
// Create event
async createEvent(data: CreateEventDTO): Promise<Event>

// Get all events with filters
async getEvents(filters: EventFilters, pagination: Pagination): Promise<PaginatedResponse<Event>>

// Get single event
async getEventById(eventId: string): Promise<Event>

// Update event
async updateEvent(eventId: string, data: UpdateEventDTO): Promise<Event>

// Delete event
async deleteEvent(eventId: string): Promise<void>

// Register user for event
async registerForEvent(userId: string, eventId: string): Promise<EventAttendee>

// Cancel registration
async cancelRegistration(userId: string, eventId: string): Promise<void>

// Get user's events
async getUserEvents(userId: string, status?: AttendeeStatus): Promise<Event[]>

// Mark attendance
async markAttendance(userId: string, eventId: string, status: AttendeeStatus): Promise<EventAttendee>

// Get event attendees
async getEventAttendees(eventId: string, filters?: AttendeeFilters): Promise<EventAttendee[]>

// Send event notifications
async sendEventNotifications(eventId: string, type: NotificationType): Promise<void>

// Get event statistics
async getEventStatistics(eventId: string): Promise<EventStats>
```

## Notifications

### Auto-Triggered Notifications

1. **Event Created**: When admin creates new event
   - Sent to: All users
   - Message: "🎉 {eventTitle} - {startDate}"

2. **Event Starting**: 24 hours before event
   - Sent to: Registered attendees
   - Message: "⏰ {eventTitle} in 24 hours"

3. **Event Reminder**: 1 hour before event
   - Sent to: Registered attendees
   - Message: "📢 {eventTitle} starts in 1 hour"

4. **Event Cancelled**: If event is deleted/cancelled
   - Sent to: All registered attendees
   - Message: "❌ {eventTitle} has been cancelled"

## Features

### 1. Event Registration
- Users can register for upcoming events
- Capacity management prevents overbooking
- Registration confirmation notifications
- Cancel registration option

### 2. Attendance Tracking
- Admin marks attendance post-event
- Tracks no-shows vs. cancellations
- Attendance history for compliance
- Reports on attendance rates

### 3. Event Categories
- Support for 6 event types
- Type-specific handling
- Filter by type

### 4. Notifications
- Real-time event notifications
- Pre-event reminders
- Start alerts
- Cancellation notices

### 5. Admin Dashboard
- View all events
- Create/Edit/Delete events
- View attendee lists
- Mark attendance
- Generate attendance reports

### 6. User Portal
- Browse upcoming events
- Register for events
- View registered events
- See event details

## Usage Examples

### Admin Creating an Event

```typescript
const eventData = {
  title: "Summer Youth Conference",
  description: "3-day youth spiritual conference",
  eventType: "CONFERENCE",
  startDate: new Date("2026-07-15"),
  endDate: new Date("2026-07-17"),
  location: "Cairo Convention Center",
  capacity: 500,
  image: "conference-banner.jpg",
  isPublished: true
};

const event = await eventService.createEvent(eventData);
// Sends notifications to all users about new event
```

### User Registering for Event

```typescript
const registration = await eventService.registerForEvent(userId, eventId);
// User receives confirmation notification
```

### Admin Marking Attendance

```typescript
const attendees = await eventService.getEventAttendees(eventId);
attendees.forEach(async (attendee) => {
  await eventService.markAttendance(
    attendee.userId,
    eventId,
    "ATTENDED"
  );
});
```

## Database Indexes

```sql
CREATE INDEX idx_event_startdate ON "Event"(startDate);
CREATE INDEX idx_event_type ON "Event"(eventType);
CREATE INDEX idx_event_published ON "Event"(isPublished);
CREATE INDEX idx_attendee_eventid ON "EventAttendee"(eventId);
CREATE INDEX idx_attendee_userid ON "EventAttendee"(userId);
CREATE INDEX idx_attendee_status ON "EventAttendee"(status);
```

## Error Handling

| Error | Status | Message |
|-------|--------|---------|
| Event not found | 404 | Event does not exist |
| Unauthorized | 403 | Not authorized to perform this action |
| Capacity exceeded | 400 | Event capacity is full |
| Already registered | 400 | User already registered for this event |
| Invalid event type | 400 | Invalid event type |
| Past event | 400 | Cannot register for past events |

## Future Enhancements

- [ ] Calendar integration
- [ ] QR code check-in
- [ ] Event feedback/surveys
- [ ] Seat/table assignments
- [ ] Recurring events
- [ ] Event categories/tags
- [ ] Social sharing
- [ ] Email invitations
