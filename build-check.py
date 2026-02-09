#!/usr/bin/env python3
import subprocess
import os

os.chdir('/Users/adnankoroth/go/cliflow')

# First create the directory
os.makedirs('build/daemon', exist_ok=True)

# Run TypeScript compiler
result = subprocess.run(
    ['npx', 'tsc', '-p', 'daemon/tsconfig.json'],
    capture_output=True,
    text=True
)

# Write output to a file
with open('build-result.txt', 'w') as f:
    f.write(f"Command: npx tsc -p daemon/tsconfig.json\n")
    f.write(f"Return code: {result.returncode}\n")
    f.write(f"\nSTDOUT:\n{result.stdout}\n")
    f.write(f"\nSTDERR:\n{result.stderr}\n")
    
    # Check what's in build/daemon
    if os.path.exists('build/daemon'):
        files = os.listdir('build/daemon')
        f.write(f"\nFiles in build/daemon: {files}\n")
    else:
        f.write("\nbuild/daemon does not exist\n")

print("Done. Check build-result.txt")
