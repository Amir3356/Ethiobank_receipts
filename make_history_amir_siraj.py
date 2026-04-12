import os
import random
import subprocess
from datetime import datetime, timedelta

# Font defined for 5 rows high. We will pad 1 row top and 1 row bottom for the 7 days of week.
font = {
    'A': [
        [0,1,1,0],
        [1,0,0,1],
        [1,1,1,1],
        [1,0,0,1],
        [1,0,0,1]
    ],
    'M': [
        [1,0,0,0,1],
        [1,1,0,1,1],
        [1,0,1,0,1],
        [1,0,0,0,1],
        [1,0,0,0,1]
    ],
    'I': [
        [1,1,1],
        [0,1,0],
        [0,1,0],
        [0,1,0],
        [1,1,1]
    ],
    'R': [
        [1,1,1,0],
        [1,0,0,1],
        [1,1,1,0],
        [1,0,1,0],
        [1,0,0,1]
    ],
    'S': [
        [0,1,1,1],
        [1,0,0,0],
        [0,1,1,0],
        [0,0,0,1],
        [1,1,1,0]
    ],
    'J': [
        [0,0,1,1],
        [0,0,0,1],
        [0,0,0,1],
        [1,0,0,1],
        [0,1,1,0]
    ],
    ' ': [
        [0,0],
        [0,0],
        [0,0],
        [0,0],
        [0,0]
    ]
}

# Realistic project-specific commit messages
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
    "chore: update package-lock.json"
]

def generate_commits():
    # 2025 starts on a Wednesday.
    # The first Sunday of 2025 is Jan 5. We will start on Jan 12 (Sunday).
    start_date = datetime(2025, 1, 12)
    
    text = "AMIR SIRAJ"
    
    # Build grid columns
    columns = []
    for char in text:
        letter_grid = font[char]
        char_cols = []
        for c in range(len(letter_grid[0])):
            col = [0] # Top padding (Sunday)
            for r in range(5):
                col.append(letter_grid[r][c])
            col.append(0) # Bottom padding (Saturday)
            char_cols.append(col)
        
        columns.extend(char_cols)
        # Add 1 column space between letters
        columns.append([0]*7)
            
    current_date = start_date
    commit_count = 0
    activity_file = "contribution_activity.txt"
    
    for col in columns:
        for row_idx, cell in enumerate(col):
            if cell == 1:
                target_date = current_date + timedelta(days=row_idx)
                
                # Make 2 commits so it shows up as nice green
                num_commits = 2
                for _ in range(num_commits):
                    # Randomize the time slightly so it's not exactly 12:00:00 for every single commit
                    hour = random.randint(9, 18)
                    minute = random.randint(0, 59)
                    second = random.randint(0, 59)
                    date_str = target_date.replace(hour=hour, minute=minute, second=second).strftime('%Y-%m-%dT%H:%M:%S')
                    
                    msg = random.choice(messages)
                    
                    with open(activity_file, "a") as f:
                        # Writing random realistic code snippets or simple log updates
                        f.write(f"Updated component logic at {date_str} - {msg}\n")
                        
                    subprocess.run(["git", "add", activity_file], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
                    
                    cmd = ["git", "commit", "-m", msg, "--date", date_str]
                    env = os.environ.copy()
                    env["GIT_COMMITTER_DATE"] = date_str
                    env["GIT_AUTHOR_DATE"] = date_str
                    
                    subprocess.run(cmd, env=env, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
                    commit_count += 1
                    
        current_date += timedelta(weeks=1)

    print(f"Generated {commit_count} commits for AMIR SIRAJ art with realistic messages.")

if __name__ == "__main__":
    generate_commits()
