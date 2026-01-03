#!/bin/bash

# Stage all changes
git add .

# Prompt for commit message
echo "Enter commit message:"
read commit_msg

if [ -z "$commit_msg" ]; then
    echo "Commit message cannot be empty. Aborting."
    exit 1
fi

# Commit
git commit -m "$commit_msg"

# Push
git push
