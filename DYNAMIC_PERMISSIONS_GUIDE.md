# Dynamic Permissions Implementation Guide

## 🎯 Overview

This implementation allows your frontend to use **dynamic permissions** from the backend login response instead of hardcoded role-based access control. The system is **backward compatible** - it will work with both role-based and permission-based access.

## 🔄 How It Works

### 1. **Backend Login Response**
When a user logs in, the backend now returns:
```json
{
  "id": "user-uuid",
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "accessToken": "jwt-token",
  "refreshToken": "refresh-token",
  "roles": "Super Admin",  // Mapped role name
  "permissions": [          // ✨ NEW: Dynamic permissions array
    "manageUsers",
    "manageRoles", 
    "managePermissions",
    "viewReports",
    "accessAllFeatures"
  ]
}
```

### 2. **Frontend Storage**
The login API automatically stores permissions in localStorage:
```typescript
// In api/login.ts
localStorage.setItem("permissions", JSON.stringify(response.data.data.permissions))
```

### 3. **Dynamic Access Control**
The system now checks permissions first, then falls back to roles:

```typescript
// In utils/Helper.ts
export function hasDynamicAccess(path: string, role?: string, userPermissions?: string[]): boolean {
  // If permissions are provided, use permission-based access
  if (userPermissions && userPermissions.length > 0) {
    return hasPermissionAccess(path, userPermissions);
  }

  // Fallback to role-based access if no permissions provided
  if (role) {
    return hasAccess(path, role);
  }

  return false;
}
```

## 🗺️ Permission Mapping

### Permission to Route Mapping
Each backend permission maps to specific frontend routes:

```typescript
// In utils/roles.ts
export const PERMISSION_TO_ROUTE_MAPPING: Record<string, string[]> = {
  'manageUsers': [
    '/users',
    '/users/create',
    '/users/edit/:id',
    '/users/:id',
  ],
  'optimizeContent': [
    '/content_management/pages',
    '/content_management/pages/create',
    '/news',
    '/faq',
    '/testimonials',
    // ... more routes
  ],
  'accessAllFeatures': [
    // Grants access to ALL routes
    ...Object.values(constant.ROUTING_URLS),
  ],
  // ... more permissions
};
```

## 🚀 Usage Examples

### Example 1: SEO Agent Login
**Backend Response:**
```json
{
  "roles": "Seo",
  "permissions": ["optimizeContent", "manageSeoReports"]
}
```

**Result:** User can access:
- ✅ Content Management pages
- ✅ News management
- ✅ FAQ management  
- ✅ Testimonials
- ✅ SEO reports
- ❌ User management (no `manageUsers` permission)
- ❌ Affiliate management (no `manageRegionAffiliates` permission)

### Example 2: Super Admin Login
**Backend Response:**
```json
{
  "roles": "Super Admin", 
  "permissions": ["accessAllFeatures"]
}
```

**Result:** User can access **ALL** routes (because of `accessAllFeatures` permission)

### Example 3: Regional Admin Login
**Backend Response:**
```json
{
  "roles": "Regional Admin",
  "permissions": ["manageRegionAffiliates", "manageRegionChauffeurs", "viewRegionReports"]
}
```

**Result:** User can access:
- ✅ Affiliate management
- ✅ Chauffeur management
- ✅ Reports and Dashboard
- ❌ User management
- ❌ System settings

## 🔧 Implementation Details

### Files Modified:

1. **`utils/roles.ts`**
   - Added `PERMISSION_TO_ROUTE_MAPPING` 
   - Maps backend permissions to frontend routes

2. **`utils/Helper.ts`**
   - Added `hasPermissionAccess()` function
   - Added `hasDynamicAccess()` function (supports both permissions and roles)

3. **`components/layouts/Sidebar.tsx`**
   - Updated to use `hasDynamicAccess()` instead of `hasAccess()`
   - Reads permissions from localStorage

4. **`utils/ProtectedRoute.tsx`**
   - Updated to use dynamic permissions for route protection

5. **`api/login.ts`**
   - Automatically stores permissions in localStorage

## 🎨 Benefits

### ✅ **No Breaking Changes**
- Existing role-based code continues to work
- Gradual migration possible
- Backward compatible

### ✅ **Dynamic & Flexible**
- Permissions come from backend
- No need to update frontend when permissions change
- Fine-grained access control

### ✅ **Easy to Maintain**
- Single source of truth (backend permissions)
- Clear mapping between permissions and routes
- Easy to add new permissions

## 🔄 Migration Strategy

### Phase 1: Current State ✅
- Backend returns both roles and permissions
- Frontend uses permissions when available, falls back to roles
- No changes needed to existing components

### Phase 2: Future Enhancement
- Gradually move more components to use `hasDynamicAccess()`
- Add permission checks to individual UI elements
- Remove hardcoded role checks

### Phase 3: Full Migration
- All access control uses permissions
- Roles become display-only
- Maximum flexibility achieved

## 🧪 Testing

### Test Different Permission Scenarios:

1. **Super Admin** - Should see all menu items
2. **SEO Agent** - Should see content-related items only  
3. **Regional Admin** - Should see region-specific items
4. **User with no permissions** - Should see minimal items

### Test Fallback Behavior:
1. **User with permissions** - Uses permission-based access
2. **User with only role** - Falls back to role-based access
3. **User with neither** - Denied access

## 🚨 Important Notes

1. **localStorage Structure:**
   ```typescript
   // Role (string)
   localStorage.getItem("role") // "Super Admin"
   
   // Permissions (JSON array)
   localStorage.getItem("permissions") // '["manageUsers", "manageRoles"]'
   ```

2. **Permission Priority:**
   - Permissions are checked first
   - Roles are fallback only
   - `accessAllFeatures` grants access to everything

3. **Error Handling:**
   - Graceful fallback if permissions can't be parsed
   - Console warnings for debugging
   - No crashes if localStorage is corrupted

## 🎉 Result

Your frontend now supports **dynamic permissions** without requiring any changes to your existing code! The system automatically:

- ✅ Reads permissions from login response
- ✅ Maps permissions to routes dynamically  
- ✅ Shows/hides menu items based on permissions
- ✅ Protects routes based on permissions
- ✅ Falls back to roles if permissions unavailable
- ✅ Maintains backward compatibility

**No frontend changes needed** - everything works automatically! 🚀
