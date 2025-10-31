# Twitch API Credentials

Please create a file named `.env.local` in the root of your project with the following content:

```
VITE_TWITCH_CLIENT_ID=86vlcsmj0e9q2xbwl088f97i4hnu6y
VITE_TWITCH_CLIENT_SECRET=ujy9080yy687h2g33v352ngmh645l7
```

**Important:** 
- This file is already in `.gitignore` so it won't be committed to git
- For production, you should move the Client Secret to a backend server
- Never expose the Client Secret in frontend code in production!

