echo off
title Gulp
color 02
cls

start call node app.js

echo Waiting for server to start
timeout 3 >nul

call gulp

pause
