# Vercel Deployment Setup Guide

## Fix Missing Game Images on Vercel

If game images are not showing on your Vercel deployment, you need to add the Twitch API environment variables.

### Step 1: Get Your Twitch API Credentials

1. Go to [Twitch Developer Console](https://dev.twitch.tv/console)
2. Sign in with your Twitch account
3. Create a new application or use an existing one
4. Copy your **Client ID** and **Client Secret**

### Step 2: Add Environment Variables to Vercel

1. Go to your [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your **MyVideoGameLibrary** project
3. Click on **Settings** in the top navigation
4. Click on **Environment Variables** in the left sidebar
5. Add the following two variables:

#### Variable 1:
- **Name**: `VITE_TWITCH_CLIENT_ID`
- **Value**: `86vlcsmj0e9q2xbwl088f97i4hnu6y` (or your own Client ID)
- **Environment**: Select **Production**, **Preview**, and **Development** (or at least Production)

#### Variable 2:
- **Name**: `VITE_TWITCH_CLIENT_SECRET`
- **Value**: Your Client Secret (from your Twitch app)
- **Environment**: Select **Production**, **Preview**, and **Development** (or at least Production)

### Step 3: Redeploy Your Application

After adding the environment variables:

1. Go to the **Deployments** tab in your Vercel project
2. Click the **three dots** (...) next to your latest deployment
3. Click **Redeploy**
4. Make sure **Use existing Build Cache** is **unchecked** (to ensure new env vars are picked up)

OR

Just push a new commit to trigger a redeploy:

```bash
git commit --allow-empty -m "Trigger redeploy with env vars"
git push origin main
```

### Step 4: Verify It's Working

1. After redeployment, check your browser's console (F12 > Console)
2. You should see game images loading
3. If you see errors, check that the environment variables are set correctly

### Troubleshooting

#### Images still not showing?
- Check browser console for errors
- Verify environment variables are set for the correct environment (Production/Preview)
- Make sure you **redeployed** after adding the variables
- Check that variable names are exactly: `VITE_TWITCH_CLIENT_ID` and `VITE_TWITCH_CLIENT_SECRET`

#### Getting CORS errors?
- The Twitch API should handle CORS automatically, but if you see CORS errors, you may need to add a backend proxy (future enhancement)

#### API Rate Limits?
- Twitch API has rate limits. If you hit limits, wait a bit and try again
- For production, consider implementing caching or using a backend proxy

### Important Security Note

⚠️ **Security Warning**: In a production application, you should NEVER expose the Client Secret in frontend code. For this demo/learning project, it's acceptable, but for a real production app:

1. Create a backend API proxy (Node.js/Express server)
2. Store the Client Secret on the backend only
3. Make API calls from your frontend to your backend
4. Backend handles Twitch API authentication

### Quick Command Reference

```bash
# Check if env vars are accessible (local)
echo $VITE_TWITCH_CLIENT_ID

# In Vercel, check via Dashboard > Settings > Environment Variables
```

---

**Need Help?**
- Check Vercel Docs: https://vercel.com/docs/environment-variables
- Twitch API Docs: https://dev.twitch.tv/docs/api

