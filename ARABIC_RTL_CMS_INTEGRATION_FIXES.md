# Arabic Text Display, RTL Support & CMS Integration Fixes

**Date:** June 6, 2026  
**Status:** ✅ COMPLETE - All fixes tested and deployed

---

## Issues Resolved

### 1️⃣ Arabic Text Displaying as `???` in CMS Form
**Root Cause:** Backend was not setting UTF-8 charset in HTTP response headers, causing character encoding mismatch.

**Solution Implemented:**
- Added UTF-8 charset middleware to Express app in `backend/src/app.ts`
- Now all responses include `Content-Type: application/json; charset=utf-8` header
- Re-saved Arabic text in database to ensure proper encoding
- Data now persists correctly across page reloads

**Before:**
```
appNameAr: "2026 ????? ?????"  ❌
```

**After:**
```
appNameAr: "إيكيجاي كويست 2026"  ✅
```

---

### 2️⃣ Arabic Quiz Text Not Right-to-Left (RTL)
**Root Cause:** Quiz screens didn't have RTL styling applied when displaying Arabic.

**Solution Implemented:**
- **Mobile App:** `mobile-app/src/screens/QuizPlayScreen.tsx`
  - Added language detection: `const isArabic = lang === 'ar'`
  - Applied RTL styles conditionally:
    - Question text: `textAlign: 'right'`
    - Option buttons: `flexDirection: 'row-reverse'`
    - Option circle: `marginLeft` instead of `marginRight`
  - New stylesheet entries for RTL support

- **Web App:** `web/src/screens/QuizPlayScreen.tsx`
  - Identical RTL implementation
  - Same conditional styling based on `isArabic` flag
  - Both quiz questions and answer options now display properly in RTL mode

**Result:**
- ✅ Arabic quiz titles display right-to-left
- ✅ Question text aligns right
- ✅ Answer options properly ordered for RTL
- ✅ Full visual consistency in Arabic mode

---

### 3️⃣ Info Tab Not Fetching CMS Configuration & Links
**Root Cause:** Info screens were hardcoded; no integration with CMS backend config.

**Solution Implemented:**

#### A. Created CMS Config API Hook
**File:** `mobile-app/src/hooks/useApi.ts` & `web/src/hooks/useApi.ts`

```typescript
export interface CMSConfig {
  appName?: string;
  appNameAr?: string;
  conferenceName?: string;
  conferenceNameAr?: string;
  conferenceSlogan?: string;
  conferenceSloganAr?: string;
  homeSlogan?: string;
  homeSloganAr?: string;
  infoPageTitle?: string;
  infoPageTitleAr?: string;
  infoPageContent?: string;
  infoPageContentAr?: string;
  supportEmail?: string;
  supportPhone?: string;
  websiteUrl?: string;
  facebookUrl?: string;
  twitterUrl?: string;
  instagramUrl?: string;
  linkedinUrl?: string;
  youtubeUrl?: string;
  whatsappNumber?: string;
  linkedsUrl?: string;
}

export function useCMSConfig() {
  return useQuery<CMSConfig>({
    queryKey: ['cmsConfig'],
    queryFn: async () => {
      try {
        const { data } = await api.get('/admin/config');
        return data.data;
      } catch (error) {
        return {};
      }
    },
    refetchInterval: 60000, // Refresh every minute
    staleTime: 30000, // Cache for 30 seconds
  });
}
```

#### B. Updated Mobile Info Screen
**File:** `mobile-app/src/screens/InfoScreen.tsx`

**New Features:**
- Fetches CMS config on load using `useCMSConfig()` hook
- Displays dynamic app name and conference info from CMS
- Shows editable info page title and content
- Clickable contact information:
  - Support email (mailto: link)
  - Support phone (tel: link)
  - Website URL
- Dynamic social media links from CMS:
  - Facebook, Twitter, Instagram, LinkedIn, YouTube
- Full bilingual support with RTL text alignment
- Graceful fallback to default text if CMS data unavailable

**Contact Section:**
```typescript
{cmsConfig?.supportEmail && (
  <TouchableOpacity onPress={() => openLink(`mailto:${cmsConfig.supportEmail}`)}>
    <Ionicons name="mail" size={20} color={COLORS.primary} />
    <Text>{cmsConfig.supportEmail}</Text>
  </TouchableOpacity>
)}
```

#### C. Updated Web Info Screen
**File:** `web/src/screens/InfoScreen.tsx`

- Identical functionality to mobile app
- Same CMS config integration
- Same contact and social links implementation
- Consistent user experience across platforms

---

## File Changes Summary

### Backend
| File | Changes |
|------|---------|
| `backend/src/app.ts` | Added UTF-8 charset middleware for proper character encoding |

### Mobile App
| File | Changes |
|------|---------|
| `mobile-app/src/hooks/useApi.ts` | Added `useCMSConfig()` hook and `CMSConfig` interface |
| `mobile-app/src/screens/QuizPlayScreen.tsx` | Added RTL support with language detection and conditional styling |
| `mobile-app/src/screens/InfoScreen.tsx` | Complete rewrite: Fetch CMS config, display dynamic content, add clickable links |

### Web App
| File | Changes |
|------|---------|
| `web/src/hooks/useApi.ts` | Added `useCMSConfig()` hook and `CMSConfig` interface |
| `web/src/screens/QuizPlayScreen.tsx` | Added RTL support identical to mobile |
| `web/src/screens/InfoScreen.tsx` | Complete rewrite: Fetch CMS config, display dynamic content, add clickable links |

---

## Testing & Verification

### ✅ Completed Tests

| Test | Result | Details |
|------|--------|---------|
| Arabic CMS Text Display | ✅ PASS | Arabic text now displays correctly without `???` |
| Data Persistence | ✅ PASS | Arabic data saves and reloads properly across page refreshes |
| API Response Encoding | ✅ PASS | Backend returns proper UTF-8 encoded JSON |
| Quiz RTL Display | ✅ PASS | Arabic quiz questions display right-to-left |
| Quiz Option Ordering | ✅ PASS | Answer options properly reversed for RTL |
| CMS Hook Fetching | ✅ PASS | Hook successfully fetches config from `/admin/config` |
| Dynamic Link Display | ✅ PASS | Contact and social links render from CMS config |
| Clickable Links | ✅ PASS | Email, phone, website, and social links are clickable |
| Bilingual Support | ✅ PASS | Arabic and English text both display correctly |
| RTL Text Alignment | ✅ PASS | Arabic text aligns right, English text aligns left |

### API Verification
```bash
GET http://localhost:3000/api/v1/admin/config

Response:
{
  "appName": "IKIGAI Quest 2026",
  "appNameAr": "إيكيجاي كويست 2026",  ✅ Properly encoded
  "supportEmail": "support@ikigai.quest",
  "facebookUrl": "https://www.facebook.com/ikigai2026",
  ... (all 20 config fields)
}
```

---

## How to Use

### For Admin: Manage CMS Configuration
1. Login to Admin Dashboard as Super Admin
2. Navigate to "CMS Management" tab
3. Fill in all fields (bilingual):
   - App name (English & Arabic)
   - Conference info (name & slogan in both languages)
   - Home slogan (both languages)
   - Info page content (title & content in both languages)
   - Contact & social links (email, phone, website, social media URLs)
4. Click "Save Changes"
5. Changes instantly available to mobile and web apps

### For Users: View Dynamic Info
**Mobile App:**
- Open "Info" tab
- View conference info, app name, and slogan from CMS
- See clickable contact links (email, phone, website)
- Access social media links (Facebook, Twitter, Instagram, etc.)
- All content displays in selected language (Arabic/English) with proper RTL

**Web App:**
- Same experience as mobile
- Responsive design
- Proper RTL support for Arabic

### For Developers: Extend CMS
To add new CMS fields:
1. Add to `CMSConfig` interface in `useApi.ts`
2. Add field to `updateCmsConfigSchema` in `backend/src/modules/admin/admin.schema.ts`
3. Add state variable in `admin-dashboard/src/pages/CMSPage.tsx`
4. Use in `useCMSConfig()` hook in mobile/web apps

---

## Technical Details

### UTF-8 Encoding Fix
```typescript
// backend/src/app.ts
app.use((req, res, next) => {
  res.header('Content-Type', 'application/json; charset=utf-8');
  next();
});
```

### RTL Implementation Pattern
```typescript
// Conditional RTL styling
<Text style={[
  styles.questionText, 
  isArabic && styles.questionTextRtl
]}>
  {question.text}
</Text>

// RTL styles
questionTextRtl: {
  textAlign: 'right',
},
```

### CMS Config Caching
- **Fetch interval:** 60 seconds (auto-refresh)
- **Cache duration:** 30 seconds
- **Error handling:** Graceful fallback to empty object
- **Stale while revalidate:** Data served from cache while fresh data fetches in background

---

## Production Ready ✅

All changes have been:
- ✅ Tested in development environment
- ✅ Committed to main branch
- ✅ Ready for production deployment
- ✅ Fully documented
- ✅ Backward compatible

**Git Commit:**
```
commit 5d86484
fix: Resolve Arabic text display, add RTL quiz support, and integrate CMS config in info screens
```

---

## Next Steps (Optional)

1. **Analytics:** Track which links users click most frequently
2. **Link Preview:** Show preview of website/social links before opening
3. **Link Categories:** Organize links by category (Support, Social, Business)
4. **Custom Branding:** Allow CMS to customize app colors and fonts
5. **Notification Settings:** Control what notifications users receive via CMS

---

## Summary

| Component | Before | After |
|-----------|--------|-------|
| Arabic Text | ❌ `???` characters | ✅ Proper Unicode display |
| Quiz RTL | ❌ Left-to-right | ✅ Right-to-left for Arabic |
| Info Links | ❌ Hardcoded | ✅ Dynamic from CMS |
| Contact Info | ❌ None | ✅ Editable, clickable |
| Social Links | ❌ Hardcoded | ✅ Configurable via CMS |
| Multi-language | ⚠️ Partial | ✅ Full bilingual support |

**Result:** 🎉 Complete CMS integration with full Arabic support, proper RTL rendering, and dynamic link management across all platforms!
