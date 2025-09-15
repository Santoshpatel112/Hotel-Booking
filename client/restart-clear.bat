@echo off
echo Clearing React cache and restarting...
cd /d d:\BOOKINGAPP\client
if exist node_modules\.cache rmdir /s /q node_modules\.cache
if exist .eslintcache del .eslintcache
echo Cache cleared!
echo Starting development server...
npm start