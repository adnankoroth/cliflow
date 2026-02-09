#!/bin/bash
cd "$(dirname "$0")"
LOG="./build-log.txt"
echo "=== Build started ===" > $LOG
echo "PWD: $(pwd)" >> $LOG
echo "Creating build dirs..." >> $LOG
mkdir -p build/daemon 2>&1 >> $LOG
echo "Running tsc for daemon..." >> $LOG
npx tsc -p daemon/tsconfig.json 2>&1 >> $LOG
echo "Exit code: $?" >> $LOG
echo "Listing build/daemon:" >> $LOG
ls -la build/daemon/ 2>&1 >> $LOG
echo "=== Build complete ===" >> $LOG
