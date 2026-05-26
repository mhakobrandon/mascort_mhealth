@echo off 
title MASCOT Backend - http://localhost:8000 
cd /d "C:\Users\bk\Documents\mascort_mhealth\backend" 
echo. 
echo  Starting MASCOT Backend on http://localhost:8000 
echo  API Docs at  http://localhost:8000/docs 
echo. 
venv\Scripts\python.exe main.py 
pause 
