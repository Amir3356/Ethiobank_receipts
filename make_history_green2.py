import os
import random
import subprocess
from datetime import datetime, timedelta

# List of realistic commit messages
messages = [
    "fix: resolve edge case in data parsing",
    "chore: update dependencies",
    "docs: add setup instructions to README",
    "refactor: clean up unused variables",
    "feat: add validation for user inputs",
    "style: format code according to guidelines",
    "test: add unit tests for utility functions",
    "fix: handle null values gracefully",
    "chore: remove obsolete scripts",
    "refactor: modularize API service logic",
    "feat: integrate new UI components",
    "docs: update API documentation",
    "fix: correct typo in variable name",
    "chore: update gitignore rules",
    "test: improve test coverage for controllers",
    "feat: improve layout responsiveness",
    "chore: bump package version",
    "docs: document controller logic",
    "fix: patch security vulnerability in dependency",
    "refactor: simplify database queries",
]

def generate_commits():
    start_date = datetime(2025, 1, 1, 9, 0, 0)
    end_date = datetime(2025, 12, 31, 18, 0, 0)
    
    current_date = start_date
    commit_count = 0
    activity_file = "contribution_activity.txt"
    
    while current_date <= end_date:
        # Determine if we commit on this day (e.g., 85% chance to have a very green graph)
        if random.random() < 0.85:
            # Generate between 1 and 6 commits on an active day
            num_commits = random.randint(1, 6)
            for _ in range(num_commits):
                hour = random.randint(9, 18)
                minute = random.randint(0, 59)
                second = random.randint(0, 59)
                commit_time = current_date.replace(hour=hour, minute=minute, second=second)
                
                # Format date string for git using ISO format
                date_str = commit_time.strftime('%Y-%m-%dT%H:%M:%S')
                msg = random.choice(messages)
                
                # Touch a file so the commit is not empty!
                with open(activity_file, "a") as f:
                    f.write(f"Commit at {date_str}\n")
                
                # Add the file
                subprocess.run(["git", "add", activity_file], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
                
                cmd = [
                    "git", "commit",
                    "-m", msg,
                    "--date", date_str
                ]
                env = os.environ.copy()
                env["GIT_COMMITTER_DATE"] = date_str
                env["GIT_AUTHOR_DATE"] = date_str
                
                subprocess.run(cmd, env=env, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
                commit_count += 1
                
        current_date += timedelta(days=1)
    
    print(f"Successfully generated {commit_count} commits for the year 2025!")

if __name__ == "__main__":
    print("Generating non-empty commits for 2025...")
    generate_commits()
