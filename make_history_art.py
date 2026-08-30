import os
import subprocess
from datetime import datetime, timedelta

# 7 rows for days of the week (Sun to Sat)
# We define the letters for "AMIR"
letters = {
    'A': [
        [0, 1, 1, 1, 0],
        [1, 0, 0, 0, 1],
        [1, 0, 0, 0, 1],
        [1, 1, 1, 1, 1],
        [1, 0, 0, 0, 1],
        [1, 0, 0, 0, 1],
        [1, 0, 0, 0, 1]
    ],
    'M': [
        [1, 0, 0, 0, 1],
        [1, 1, 0, 1, 1],
        [1, 0, 1, 0, 1],
        [1, 0, 0, 0, 1],
        [1, 0, 0, 0, 1],
        [1, 0, 0, 0, 1],
        [1, 0, 0, 0, 1]
    ],
    'I': [
        [0, 1, 1, 1, 0],
        [0, 0, 1, 0, 0],
        [0, 0, 1, 0, 0],
        [0, 0, 1, 0, 0],
        [0, 0, 1, 0, 0],
        [0, 0, 1, 0, 0],
        [0, 1, 1, 1, 0]
    ],
    'R': [
        [1, 1, 1, 1, 0],
        [1, 0, 0, 0, 1],
        [1, 0, 0, 0, 1],
        [1, 1, 1, 1, 0],
        [1, 0, 1, 0, 0],
        [1, 0, 0, 1, 0],
        [1, 0, 0, 0, 1]
    ]
}

def generate_commits():
    # 2025 starts on a Wednesday.
    # The first Sunday of 2025 is Jan 5. Let's start on Feb 2 (a Sunday) to center it nicely
    start_date = datetime(2025, 2, 2)
    
    text = "AMIR"
    space_between_letters = 2
    
    # Build grid columns
    columns = []
    for char in text:
        letter_grid = letters[char]
        char_cols = []
        for c in range(len(letter_grid[0])):
            col = []
            for r in range(7):
                col.append(letter_grid[r][c])
            char_cols.append(col)
        
        columns.extend(char_cols)
        # Add spaces
        for _ in range(space_between_letters):
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
                    date_str = target_date.replace(hour=12, minute=0, second=0).strftime('%Y-%m-%dT%H:%M:%S')
                    
                    with open(activity_file, "a") as f:
                        f.write(f"Commit at {date_str}\n")
                        
                    subprocess.run(["git", "add", activity_file], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
                    
                    cmd = ["git", "commit", "-m", f"art: pixel for {date_str}", "--date", date_str]
                    env = os.environ.copy()
                    env["GIT_COMMITTER_DATE"] = date_str
                    env["GIT_AUTHOR_DATE"] = date_str
                    
                    subprocess.run(cmd, env=env, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
                    commit_count += 1
                    
        current_date += timedelta(weeks=1)

    print(f"Generated {commit_count} commits for AMIR art.")

if __name__ == "__main__":
    generate_commits()
