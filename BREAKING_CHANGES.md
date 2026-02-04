# Breaking Changes - Authentication Removed

## Date: 2026-02-04

## Summary
All authentication has been completely removed from this application. It is now a public internal tool.

## Files Removed
The following files DO NOT EXIST and should never be referenced:

### Authentication Files (DELETED)
- `middleware.ts` - NextAuth middleware (REMOVED)
- `lib/auth.ts` - Authentication configuration (REMOVED)
- `app/api/auth/[...nextauth]/route.ts` - NextAuth API route (REMOVED)
- Any other auth-related configuration files (REMOVED)

### Dependencies Removed
- `next-auth` - Removed from package.json
- All Microsoft Entra ID / Azure AD configurations

## Current State
- ✅ No authentication required
- ✅ No middleware
- ✅ No auth API routes
- ✅ All API routes are public
- ✅ All users have full access

## If You See Build Errors
If Netlify shows errors about missing `next-auth` or auth-related files:

1. **Clear Netlify Build Cache:**
   - Go to Netlify Dashboard
   - Site Settings → Build & Deploy → Clear cache and retry deploy

2. **Ensure clean build:**
   - The build command now uses `npm ci` for clean installs
   - This ensures no cached dependencies

3. **Verify git repository:**
   - The files listed above do not exist in the repository
   - Check: `git ls-files | grep -E "(middleware|auth)"`
   - Should return no results (except node_modules)

## Required Environment Variables
Only these are needed:
- `DATABASE_URL` - PostgreSQL connection string (required)
- GCP credentials (optional, for AI features)

## What Changed
- Removed all `getServerSession` calls
- Removed all `useSession` hooks  
- Removed all role/permission checks
- Removed all auth imports
- Updated all API routes to be public
- Simplified UI components

## Status
✅ All changes committed to main branch
✅ Ready for deployment
