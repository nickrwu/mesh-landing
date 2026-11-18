# OAuth Configuration Guide

## Issue: "Not an authorized app" for Google and GitHub Authentication

If you're experiencing issues when trying to sign in with Google or GitHub and receiving errors like "This app is not authorized" or similar, you need to properly configure these OAuth providers in their respective developer consoles and in your Supabase project.

## Google OAuth Configuration

1. **Go to Google Cloud Console**:
   - Navigate to [Google Cloud Console](https://console.cloud.google.com/)
   - Select or create a project

2. **Configure OAuth Consent Screen**:
   - Go to "APIs & Services" > "OAuth consent screen"
   - Select User Type (External or Internal)
   - Fill in the app name, user support email, and developer contact information
   - Add the domains you'll be using (your app domain and localhost for testing)
   - Save and continue

3. **Create OAuth Client ID**:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth client ID"
   - Set Application Type to "Web application"
   - Add a name for your OAuth client
   - Add Authorized JavaScript origins:
     - `https://yourdomain.com` (production)
     - `http://localhost:3000` (development)
   - Add Authorized redirect URIs:
     - `https://yourdomain.com/auth/callback`
     - `http://localhost:3000/auth/callback`
     - `https://<your-project-ref>.supabase.co/auth/v1/callback`
     - `mesh://auth/callback` (for your desktop app)
   - Click "Create"

4. **Add Credentials to Supabase**:
   - Go to your Supabase project dashboard
   - Navigate to "Authentication" > "Providers" > "Google"
   - Enable Google auth
   - Enter the Client ID and Client Secret from Google Cloud Console
   - Save changes

## GitHub OAuth Configuration

1. **Go to GitHub Developer Settings**:
   - Navigate to [GitHub Developer Settings](https://github.com/settings/developers)
   - Click on "OAuth Apps" > "New OAuth App"

2. **Register a New OAuth Application**:
   - Fill in Application name
   - Set Homepage URL to your website URL or localhost for development
   - Add Authorization callback URL:
     - `https://<your-project-ref>.supabase.co/auth/v1/callback`
     - For desktop app, also add: `mesh://auth/callback`
   - Click "Register application"
   - Generate a new client secret

3. **Add Credentials to Supabase**:
   - Go to your Supabase project dashboard
   - Navigate to "Authentication" > "Providers" > "GitHub"
   - Enable GitHub auth
   - Enter the Client ID and Client Secret from GitHub
   - Save changes

## Desktop App-Specific Configuration

For desktop applications, you need to ensure your desktop app's custom URL scheme (`mesh://`) is properly registered as a valid redirect URI:

1. **For Google**:
   - In Google Cloud Console, add `mesh://auth/callback` to the authorized redirect URIs

2. **For GitHub**:
   - In GitHub OAuth App settings, add `mesh://auth/callback` to the authorization callback URLs

3. **In Supabase**:
   - Go to "Authentication" > "URL Configuration"
   - Add `mesh://auth/callback` as an additional redirect URL

## Testing Your Configuration

After completing the configuration:

1. Try signing in through your application
2. If you encounter any errors, check the browser console for specific error messages
3. Verify that all redirect URLs are correct and match exactly between your application, Supabase settings, and OAuth provider settings

Remember that OAuth settings may take a few minutes to propagate after changes are made. 