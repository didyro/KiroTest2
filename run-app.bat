@echo off
echo ✨ Starting Soamnia - Dream Interpretation App
echo.
echo Starting server on port 5000...
start "Soamnia Server" cmd /k "cd /d %~dp0 && node server.js"

echo Waiting for server to start...
timeout /t 3 /nobreak > nul

echo Starting React client on port 3000...
start "Soamnia Client" cmd /k "cd /d %~dp0client && npm start"

echo.
echo ✨ Soamnia is starting up!
echo Server: http://localhost:5000
echo Client: http://localhost:3000
echo.
echo Press any key to exit...
pause > nul