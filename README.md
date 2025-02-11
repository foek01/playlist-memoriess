# Playlist Memories

## Configuration

This project requires a .env file to be present in the base directory. This file consist of the folliwing variables:

```
NODE_ENV=development/production
REDIRECT_DEV=*redirect_uri for spotify in development*
REDIRECT_PRD=*redirect_uri for spotify in production*
BACKEND_BASE_DEV=*backend url in development*
BACKEND_BASE_PRD=*backend url in production*
SPOTIFY_CLIENT_ID=*spotify app client_id*
SPOTIFY_CLIENT_SECRET=*spotify app client_secret*
```

## Installation

1. Open the terminal
2. Update Homebrew (package manager) with the command: `brew update`
3. Install node and npm with the command: `brew install node`
4. Check if the packages are installed with the commands: `node -v` and `npm -v`. You should see the installed versions
5. Install the packages with the command: `npm install`

## Running the application

1. Start the backend with the command: `node server`
2. Open a new terminal window in the same directory
3. Start the frontend with the command: `npm start`

The server is now running on port 5000. The frontend is running on port 3000, you can navigate to it here [http://localhost:3000](http://localhost:3000)
