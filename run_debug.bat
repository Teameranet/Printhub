@echo off
node backend/scripts/debug_admin_orders.js > debug_output.txt 2>&1
echo Done >> debug_output.txt
