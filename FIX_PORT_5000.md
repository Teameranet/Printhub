# 🔧 Fix: Port 5000 Already in Use

## Quick Solutions

### Option 1: Kill the Process Using Port 5000

**In PowerShell (Run as Administrator):**
```powershell
# Find the process
netstat -ano | findstr :5000

# Kill it (replace PID with the number from above, e.g., 12220)
taskkill /PID 12220 /F
```

**Or use Task Manager:**
1. Press `Ctrl + Shift + Esc` to open Task Manager
2. Go to **Details** tab
3. Find process with PID **12220** (or search for "node")
4. Right-click → **End Task**

### Option 2: Change Backend Port Temporarily

Edit `backend/.env`:
```env
PORT=5001
```

Then update `frontend/.env.local`:
```env
VITE_API_URL=http://localhost:5001
```

Restart both servers.

### Option 3: Find What's Using Port 5000

**Check if it's your old backend:**
```powershell
# See what process is using port 5000
Get-NetTCPConnection -LocalPort 5000 | Select-Object OwningProcess
```

Then check what that process is:
```powershell
Get-Process -Id 12220
```

---

## ✅ After Fixing

1. **Restart backend:**
   ```bash
   cd backend
   npm run dev
   ```

2. **Verify it starts:**
   ```
   Server running on port 5000
   MongoDB Connected: ...
   ```

3. **Test price calculation again**

---

**Most likely:** You have an old backend server still running. Kill it and restart!
