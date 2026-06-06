# IKIGAI Admin & Super Admin Permissions Guide

## 📋 Overview

The IKIGAI system uses a **role-based access control (RBAC)** system with 4 distinct user roles:

| Role | Level | Access | Use Case |
|------|-------|--------|----------|
| **ATTENDEE** | 0 | Mobile/Web App only | Regular conference participants |
| **STAFF** | 1 | Basic admin | Event staff, organizers |
| **ADMIN** | 2 | Full admin | System administrators |
| **SUPER_ADMIN** | 3 | Complete control | System owners, developers |

---

## 🔐 Permission Matrix

### Core Access Levels

```
┌─────────────────────┬─────────┬───────┬────────┬─────────────┐
│ Feature             │ ATTENDEE│ STAFF │ ADMIN  │ SUPER_ADMIN │
├─────────────────────┼─────────┼───────┼────────┼─────────────┤
│ Admin Dashboard     │    ❌   │  ✅   │   ✅   │      ✅     │
│ Mobile App          │    ✅   │  ✅   │   ✅   │      ✅     │
│ Web App             │    ✅   │  ✅   │   ✅   │      ✅     │
│ System Config       │    ❌   │  ❌   │   ✅   │      ✅     │
│ Bulk Operations     │    ❌   │  ❌   │   ❌   │      ✅     │
│ Role Management     │    ❌   │  ✅   │   ✅   │      ✅     │
│ Nav Settings        │    ❌   │  ❌   │   ❌   │      ✅     │
└─────────────────────┴─────────┴───────┴────────┴─────────────┘
```

---

## 👤 ATTENDEE Role

**Access Level:** User (Default)

### Permissions:
- ✅ Access mobile app
- ✅ Access web app  
- ✅ Take quizzes
- ✅ View leaderboard
- ✅ View profile
- ✅ Participate in sessions
- ✅ View publications
- ✅ View sports matches
- ✅ Scan QR codes
- ✅ Access conference info

### Restrictions:
- ❌ Cannot access admin dashboard
- ❌ Cannot create/manage content
- ❌ Cannot modify user data
- ❌ Cannot adjust XP
- ❌ Cannot manage system

---

## 👔 STAFF Role

**Access Level:** Organization Level (Event Staff)

### Can Create/Manage:
- ✅ **Sessions** - Create and manage conference sessions
- ✅ **Quizzes** - Create and publish quizzes
- ✅ **Events** - Create and manage events
- ✅ **Matches** - Create sports matches
- ✅ **QR Codes** - Generate bonus XP QR codes
- ✅ **Publications** - Upload and manage documents
- ✅ **Users** - Manage user accounts
- ✅ **Tribes** - Create and manage teams

### Can View/Edit:
- ✅ User list and details
- ✅ XP leaderboard
- ✅ User attendance
- ✅ Quiz submissions
- ✅ Session attendance
- ✅ User XP history
- ✅ Bonus QR claims

### Can Perform Actions On Users:
- ✅ Assign tribe
- ✅ Change user role (↔ ATTENDEE, ↔ STAFF)
- ✅ Adjust XP manually
- ✅ Reset password
- ✅ Delete user
- ❌ Cannot promote to ADMIN or SUPER_ADMIN

### Restrictions:
- ❌ Cannot access system configuration
- ❌ Cannot delete all attendees
- ❌ Cannot create ADMIN users
- ❌ Cannot promote to SUPER_ADMIN

**Admin Routes:** `/api/v1/admin/*` (except system config & bulk ops)

---

## 🔧 ADMIN Role

**Access Level:** System Administrator

### All STAFF Permissions Plus:

### Can Create/Manage:
- ✅ **Levels** - Define XP thresholds and badges
- ✅ **System Configuration** - Manage system settings
- ✅ **Full User Management** - All user operations
- ✅ Everything STAFF can do

### Can Access:
- ✅ All admin dashboard pages
- ✅ System configuration endpoint
- ✅ All reports and analytics
- ✅ Complete user activity history
- ✅ Full audit logs

### Can Perform Actions On Users:
- ✅ Change role to ATTENDEE, STAFF, or ADMIN
- ✅ Create ADMIN users
- ✅ Adjust XP with reason tracking
- ✅ Reset passwords
- ✅ Manage all user attributes
- ❌ Cannot change SUPER_ADMIN roles
- ❌ Cannot delete SUPER_ADMIN users

### Restrictions:
- ❌ Cannot delete all attendees at once
- ❌ Cannot modify other SUPER_ADMIN users
- ❌ Cannot manage navigation visibility
- ❌ Cannot change their own role

**Admin Routes:** All except bulk delete operations

---

## 🚀 SUPER_ADMIN Role

**Access Level:** Full System Control

### All Permissions:
- ✅ **Everything** - Full system access
- ✅ All ADMIN capabilities
- ✅ All STAFF capabilities

### Exclusive Features:
- ✅ **System Configuration** - Access and modify system settings
- ✅ **Bulk Operations** - Delete all attendees at once
- ✅ **Role Management** - Create and modify any role
- ✅ **Navigation Settings** - Enable/disable nav items in UI
- ✅ **User Role Changes** - Change any role including other SUPER_ADMIN (with restriction)
- ✅ **Complete Audit Access** - View all system changes

### Protection:
- ⚠️ Cannot change roles of other SUPER_ADMIN users (system protection)
- ⚠️ Cannot delete other SUPER_ADMIN users (system protection)
- ⚠️ System prevents self-demotion in role changes

### Database Impact:
- Can execute all database operations through API
- Can modify system configuration values
- Can trigger level recalculation
- Can bulk delete/reset data

**Admin Routes:** All routes accessible

---

## 🛠️ API Endpoint Permissions

### Dashboard
- `GET /admin/stats` - STAFF+

### User Management  
- `POST /admin/users` - STAFF+
- `GET /admin/users` - STAFF+
- `GET /admin/users/:id` - STAFF+
- `PATCH /admin/users/:id/tribe` - STAFF+
- `PATCH /admin/users/:id/role` - STAFF+ (with restrictions)
- `PATCH /admin/users/:id/xp` - STAFF+
- `POST /admin/users/:id/reset-password` - STAFF+
- `DELETE /admin/users/:id` - STAFF+
- `DELETE /admin/users/attendees` - **SUPER_ADMIN ONLY**

### Sessions
- `POST /admin/sessions` - STAFF+
- `GET /admin/sessions` - STAFF+
- `PATCH /admin/sessions/:id` - STAFF+
- `PATCH /admin/sessions/:id/status` - STAFF+
- `GET /admin/sessions/:id` - STAFF+

### Content Management
- `POST /admin/quizzes` - STAFF+
- `GET /admin/quizzes` - STAFF+
- `POST /admin/tribes` - STAFF+
- `GET /admin/tribes` - STAFF+
- `POST /admin/levels` - STAFF+
- `GET /admin/levels` - STAFF+

### System Configuration
- `GET /admin/system-config` - **ADMIN+**
- `PATCH /admin/system-config/:key` - **ADMIN+**

---

## 📊 Admin Dashboard Tabs

| Tab | Icon | Required Role | Purpose |
|-----|------|---------------|---------|
| Dashboard | 📊 | STAFF+ | View system statistics |
| Users | 👥 | STAFF+ | Manage users & roles |
| Tribes | 🏆 | STAFF+ | Manage teams |
| Levels | ⭐ | STAFF+ | Define XP levels |
| Sessions | 📅 | STAFF+ | Create & manage sessions |
| Quizzes | ❓ | STAFF+ | Create & manage quizzes |
| XP Leaderboard | 🏅 | STAFF+ | View rankings |
| Bonus QR | 🎁 | STAFF+ | Manage bonus codes |
| Sports | ⚽ | STAFF+ | Manage matches |
| Publications | 📰 | STAFF+ | Upload documents |
| **Settings** | ⚙️ | **SUPER_ADMIN+** | Configure nav visibility |

---

## 🔄 Role Change Rules

### Who Can Change Roles?

**STAFF Role Can Change To:**
- ATTENDEE ↔ STAFF (only)
- Cannot elevate above STAFF

**ADMIN Role Can Change To:**
- ATTENDEE ↔ STAFF ↔ ADMIN
- Cannot promote to SUPER_ADMIN
- Cannot modify SUPER_ADMIN roles

**SUPER_ADMIN Can Change To:**
- ATTENDEE ↔ STAFF ↔ ADMIN ↔ SUPER_ADMIN
- Cannot change other SUPER_ADMIN roles (protected)
- Can promote any ATTENDEE to any role

### Implementation:
```typescript
// Backend validation
if (isChangingRole && user.role === 'SUPER_ADMIN') {
  // Prevent SUPER_ADMIN role changes
  return error('CANNOT_MODIFY_SUPER_ADMIN');
}
```

---

## 🛡️ Security Features

### Audit Logging:
- ✅ All admin actions logged
- ✅ User creation/deletion tracked
- ✅ Role changes recorded
- ✅ XP adjustments documented with reason
- ✅ System config changes tracked

### Data Protection:
- ✅ SUPER_ADMIN roles protected from change
- ✅ Soft delete on user deletion (not permanent)
- ✅ Password hash encryption
- ✅ JWT token expiration
- ✅ Rate limiting on sensitive endpoints

### Access Control:
- ✅ Role-based route protection
- ✅ JWT authentication required
- ✅ Token validation on each request
- ✅ Refresh token mechanism

---

## 🎯 Quick Reference

### Creating Users:
```
STAFF can create:     ATTENDEE, STAFF
ADMIN can create:     ATTENDEE, STAFF, ADMIN
SUPER_ADMIN can:      ATTENDEE, STAFF, ADMIN, SUPER_ADMIN
```

### Adjusting XP:
```
STAFF/ADMIN/SUPER_ADMIN can adjust any user's XP
Must provide reason for audit trail
```

### Deleting Users:
```
STAFF can delete individual ATTENDEE users
ADMIN can delete any non-ADMIN user
SUPER_ADMIN:
  - Can delete any individual user (except other SUPER_ADMIN)
  - Can bulk delete all ATTENDEES
```

### Navigation Settings:
```
Only SUPER_ADMIN can:
- Enable/disable nav items
- Settings saved to localStorage
- Applies to all users on device
- Reset to defaults available
```

---

## 📱 Mobile & Web App Access

All roles (ATTENDEE through SUPER_ADMIN) have access to:
- ✅ Mobile app (full functionality)
- ✅ Web app (full functionality)
- ✅ Profile management
- ✅ Leaderboard viewing
- ✅ Quiz participation
- ✅ Publication access

Admin-specific features (Dashboard) only available in admin dashboard.

---

## 🔍 Checking User Permissions

### Frontend (useAuth hook):
```typescript
const { user } = useAuth();
if (['ADMIN', 'SUPER_ADMIN'].includes(user.role)) {
  // Show admin features
}
```

### Backend (Middleware):
```typescript
authorize(['STAFF', 'ADMIN', 'SUPER_ADMIN']) // Protected route
authorize(['ADMIN', 'SUPER_ADMIN']) // Restricted feature
authorize('SUPER_ADMIN') // Exclusive feature
```

---

## ✏️ Recent Enhancements

### Added:
- ✅ Phone field display for all users
- ✅ Role change UI in Users table (STAFF+)
- ✅ Role change in User Detail modal
- ✅ Settings page for SUPER_ADMIN (nav config)
- ✅ Comprehensive audit logging

### Security:
- ✅ SUPER_ADMIN protection from role changes
- ✅ Soft delete implementation
- ✅ Audit trail for all changes
- ✅ Role-based column visibility in tables

---

## 🚀 Testing Permissions

### Test Users Available:
- **Admin:** admin@ikigai.quest / (configured in DB)
- **Super Admin:** Create via POST /admin/users with role=SUPER_ADMIN

### Test Endpoints:
```bash
# List all users
curl -H "Authorization: Bearer <TOKEN>" \
  https://ikigai-backend.replit.app/api/v1/admin/users

# Change user role (STAFF+ can do ATTENDEE↔STAFF)
curl -X PATCH -H "Authorization: Bearer <TOKEN>" \
  -d '{"role":"STAFF"}' \
  https://ikigai-backend.replit.app/api/v1/admin/users/{userId}/role

# Adjust XP (STAFF+)
curl -X PATCH -H "Authorization: Bearer <TOKEN>" \
  -d '{"amount":100,"reason":"Manual award"}' \
  https://ikigai-backend.replit.app/api/v1/admin/users/{userId}/xp
```

---

## 📞 Support

For permission-related issues:
1. Check user role in admin Users tab (Phone column shows user details)
2. View user activity in User Detail modal
3. Check audit logs for recent changes
4. Reset permissions via Settings page (SUPER_ADMIN only)

**Last Updated:** June 6, 2026
**Version:** 2.0 (With Phone Display & Role Changes & Settings Page)
