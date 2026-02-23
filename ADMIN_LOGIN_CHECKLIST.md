## Admin Login System - Setup Checklist

### Prerequisites
- [ ] MySQL is installed and running
- [ ] Node.js is installed (check: `node --version`)
- [ ] npm is installed (check: `npm --version`)

### Database Setup
- [ ] Navigate to: `C:\Users\PrettyLady\Desktop\web_task`
- [ ] Open MySQL command line or MySQL Workbench
- [ ] Run: `SOURCE database/schema.sql;`
  OR copy-paste the entire `database/schema.sql` content into MySQL
- [ ] Verify database created: `USE mice_zanzibar; SHOW TABLES;`

### Server Setup
- [ ] Create file: `server/.env` (copy from `.env.example`)
- [ ] Set in `.env`:
  ```
  DB_HOST=localhost
  DB_USER=root
  DB_PASSWORD=(your mysql password, leave empty if none)
  DB_NAME=mice_zanzibar
  JWT_SECRET=my_super_secret_key_12345
  PORT=5000
  ```
- [ ] Install dependencies: 
  ```
  cd server
  npm install
  ```
- [ ] Create admin user:
  ```
  node seed-admin.js
  ```
  Should see: ✅ Admin user created successfully!

### Client Setup
- [ ] Navigate to: `C:\Users\PrettyLady\Desktop\web_task\client`
- [ ] Install dependencies:
  ```
  npm install
  ```

### Running the System
1. Open PowerShell/Terminal 1:
   ```
   cd server
   npm run dev
   ```
   Should see: `Server running on port 5000`

2. Open PowerShell/Terminal 2:
   ```
   cd client
   npm start
   ```
   Should open browser at: `http://localhost:3000`

3. Navigate to: `http://localhost:3000/admin-login`

4. Login with:
   - Email: `admin@example.com`
   - Password: `admin123`

### If it Still Doesn't Work

#### Check 1: Server Running?
```
curl http://localhost:5000/api/health
```
Should return: `{"message":"Server is running"}`

#### Check 2: Database Connection?
In `server` folder, run:
```
mysql -h localhost -u root mice_zanzibar
```
If it fails, check DB credentials in `.env`

#### Check 3: Admin User Exists?
In MySQL:
```sql
SELECT * FROM admin_users;
```
Should show at least one row with admin@example.com

#### Check 4: Browser Console
1. Open browser (F12)
2. Go to Console tab
3. Try login again
4. Look for red error messages
5. Screenshot and share the error

#### Check 5: Server Terminal
1. Look at server terminal where `npm run dev` is running
2. Look for any red errors
3. Screenshot and share the error

### Need Help?
Provide:
1. Screenshot of server terminal (when running `npm run dev`)
2. Screenshot of browser console (F12 → Console)
3. Output of: `mysql -u root -p -e "USE mice_zanzibar; SELECT * FROM admin_users;"`
4. Your `.env` file (remove passwords before sharing)
