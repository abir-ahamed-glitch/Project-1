@echo off
:: Navigate to project directory
e:
cd "e:\Antigravity\Project-1"

:: Start the vite server
:: We use 'call' to ensure npm doesn't terminate the batch session
call npm run dev
