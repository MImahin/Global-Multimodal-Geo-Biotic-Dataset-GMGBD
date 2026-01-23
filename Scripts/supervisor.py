import subprocess
import time
import sys

SCRIPT_NAME = "environment.py"
RESTART_INTERVAL = 300  # 5 minutes in seconds

def run_script():
    while True:
        print(f"\n🚀 [SUPERVISOR] Starting {SCRIPT_NAME} for a 5-minute session...")
        
        # Start the actual environment script
        process = subprocess.Popen([sys.executable, SCRIPT_NAME])

        try:
            # Let it run for 5 minutes
            process.wait(timeout=RESTART_INTERVAL)
            # If it finishes naturally before 5 mins (e.g., all rows done)
            print("✅ [SUPERVISOR] Script finished naturally.")
            break
        except subprocess.TimeoutExpired:
            print(f"\n⏰ [SUPERVISOR] 5 minutes reached. Killing process to clear hangs...")
            process.terminate()  # Kill the script
            process.wait()       # Wait for it to fully close
            print("🧼 [SUPERVISOR] Cleaned up. Restarting in 5 seconds...")
            time.sleep(5)

if __name__ == "__main__":

    run_script()
