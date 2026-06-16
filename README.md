# github-dashboard-cli

A command-line GitHub stats dashboard built with Node.js and TypeScript.

## Demo

## Installation

```bash
git clone https://github.com/dsbly1/github-dashboard-cli
cd github-dashboard-cli
npm install
```

## Usage

```bash
# Your own stats (default)
npm start

# Any GitHub user
npx ts-node src/index.ts torvalds
npx ts-node src/index.ts dsbly1
```

## Tech Stack

- Node.js + TypeScript
- axios — GitHub API requests
- chalk — terminal colors
- ora — loading spinner

## What It Does

- Fetches live GitHub profile data via the GitHub API
- Displays public repo count, total stars, followers, and top languages
- Lists top 5 repos by star count with descriptions
- Handles errors gracefully (user not found, network issues)

## Author

Damon Bly Jr. — [github.com/dsbly1](https://github.com/dsbly1)

