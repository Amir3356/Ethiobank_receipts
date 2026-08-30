import os
import random
import subprocess
from datetime import datetime, timedelta

# Realistic commit messages
messages = [
    "feat: update Telebirr extractor logic",
    "fix: handle missing reference numbers in CBE receipts",
    "docs: update API documentation for extraction routes",
    "refactor: clean up receipt form validation",
    "chore: update React and Vite dependencies",
    "feat: add support for Dashen Bank receipt formats",
    "fix: correct CORS headers for API requests",
    "style: improve ReceiptCard component layout",
    "test: add unit tests for Awash bank extractor",
    "feat: implement image upload parsing logic",
    "fix: resolve edge case with blurry Telebirr screenshots",
    "refactor: modularize frontend API service",
    "chore: remove old python crawler scripts",
    "feat: add loading spinners for extraction process",
    "docs: add setup instructions for local development",
    "fix: correctly parse dates from Zemen bank receipts",
    "style: update navbar aesthetics",
    "refactor: simplify backend controller error handling",
    "test: verify receipt controller response formats",
    "chore: update package-lock.json",
    "feat: handle multi-page PDF receipts",
    "fix: resolve memory leak in extractor",
    "docs: add comments to complex regex patterns"
]

def generate_commits():
    start_date = datetime(2025, 1, 1)
    end_date = datetime(2025, 12, 31)
    
    current_date = start_date
    commit_count = 0
    activity_file = "contribution_activity.txt"
    
    # We will simulate "active phases" and "slow phases" to make it look highly organic
    phase_length = random.randint(14, 30)
    days_in_phase = 0
    is_active_phase = True
    
    while current_date <= end_date:
        days_in_phase += 1
        if days_in_phase > phase_length:
            is_active_phase = not is_active_phase
            phase_length = random.randint(10, 45) # Active phases can be longer
            if not is_active_phase:
                phase_length = random.randint(5, 15) # Slow phases are shorter
            days_in_phase = 0
            
        # Determine probability based on day of week and phase
        is_weekend = current_date.weekday() >= 5 # 5 is Sat, 6 is Sun
        
        base_prob = 0.7 if not is_weekend else 0.2
        if not is_active_phase:
            base_prob *= 0.3 # 70% drop in activity during slow phases
            
        if random.random() < base_prob:
            # Determine number of commits for this day to get varying shades of green
            # Mostly 1-3 commits, rarely 5-8 commits for dark green
            r = random.random()
            if r < 0.6:
                num_commits = random.randint(1, 2)
            elif r < 0.9:
                num_commits = random.randint(3, 5)
            else:
                num_commits = random.randint(6, 9)
                
            for _ in range(num_commits):
                hour = random.randint(9, 21)
                minute = random.randint(0, 59)
                second = random.randint(0, 59)
                commit_time = current_date.replace(hour=hour, minute=minute, second=second)
                
                date_str = commit_time.strftime('%Y-%m-%dT%H:%M:%S')
                msg = random.choice(messages)
                
                with open(activity_file, "a") as f:
                    f.write(f"Organic update at {date_str} - {msg}\n")
                    
                subprocess.run(["git", "add", activity_file], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
                
                cmd = ["git", "commit", "-m", msg, "--date", date_str]
                env = os.environ.copy()
                env["GIT_COMMITTER_DATE"] = date_str
                env["GIT_AUTHOR_DATE"] = date_str
                
                subprocess.run(cmd, env=env, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
                commit_count += 1
                
        current_date += timedelta(days=1)
        
    print(f"Generated {commit_count} organic commits for the year 2025!")

if __name__ == "__main__":
    generate_commits()
