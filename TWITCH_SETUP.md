# Twitch API Setup Guide

## Current Configuration

### ✅ Correct Settings:
- **Name**: MyVideoGameLibrary ✓
- **Category**: Website Integration ✓
- **Client Type**: Confidential ✓ (correct for web apps)
- **Client ID**: `o50hqkbvefb2nd0s7budrglc1zb383` ✓

### ⚠️ Issues to Fix:

#### 1. OAuth Redirect URLs
**Current (WRONG):**
```
https://localhost:5173
https://localhost:3000
```

**Should be (CORRECT):**
```
http://localhost:5173
http://localhost:3000
```

**Why:** Localhost URLs must use `http://` not `https://` for local development.

**Action:** Update your Twitch Developer Console and change:
- `https://localhost:5173` → `http://localhost:5173`
- `https://localhost:3000` → `http://localhost:3000`

#### 2. Client Secret

**Where to Find "New Secret" Button:**

The Client Secret generation is usually located in one of these places:

1. **On the same page where you see your Client ID**
   - Look for a section labeled "Client Secret" or "Secrets"
   - There should be a button like:
     - "New Secret"
     - "Generate Secret"
     - "Create Secret"
     - "Reset Secret" (if one exists)

2. **Under "Credentials" or "Security" section**
   - Some Twitch Console layouts have a separate tab/section

3. **If you see an existing secret (masked):**
   - You might see `********` or `••••••••`
   - There should be a "Reveal" or "Show" button
   - If you want a new one, look for "Reset" or "New Secret"

4. **If the button is missing:**
   - The Client Secret might already be generated
   - Check if there's a "Reveal Secret" or "Show Secret" button instead
   - Some accounts show it differently

**Important:** Once you generate/view the secret, **copy it immediately** - Twitch only shows it once!

## What You Need for API Calls

1. **Client ID**: `o50hqkbvefb2nd0s7budrglc1zb383` ✅ (You have this)
2. **Client Secret**: `[YOUR_SECRET]` ❌ (You need to find/generate this)
3. **Redirect URLs**: Update to use `http://` instead of `https://` for localhost

## Next Steps

Once you have:
1. Fixed the localhost URLs (http:// not https://)
2. Generated/retrieved your Client Secret

I can help you:
- Set up the Twitch API integration
- Create utilities to fetch game data from Twitch
- Add game auto-complete/search functionality
- Integrate Twitch game database into your collection

## Testing Your Setup

After fixing the URLs and getting your secret, you can test with:

```bash
# Get App Access Token (for testing)
curl -X POST 'https://id.twitch.tv/oauth2/token' \
  -H 'Content-Type: application/x-www-form-urlencoded' \
  -d 'client_id=o50hqkbvefb2nd0s7budrglc1zb383&client_secret=YOUR_SECRET&grant_type=client_credentials'
```

This will return an access token you can use to make API calls.

