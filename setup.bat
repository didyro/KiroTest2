@echo off
echo ✨ Setting up Soamnia - Dream Interpretation App
echo.

echo Installing server dependencies...
call npm install

echo.
echo Installing client dependencies...
cd client
call npm install
cd ..

echo.
echo Setup complete! 
echo.
echo Next steps:
echo 1. Copy .env.example to .env and add your OpenAI API key
echo 2. Run 'npm run dev' to start both server and client
echo.
echo Happy dreaming! ✨
pause