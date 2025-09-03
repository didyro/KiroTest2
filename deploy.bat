@echo off
echo 🚀 Building Soamnia for Production...
echo.

echo 📦 Installing dependencies...
call npm install
cd client
call npm install
cd ..

echo.
echo 🔨 Building React app...
call npm run build

echo.
echo ✅ Production build complete!
echo.
echo 🌟 To start the production server:
echo    npm start
echo.
echo 📱 The app will be available at http://localhost:5000
echo.
pause