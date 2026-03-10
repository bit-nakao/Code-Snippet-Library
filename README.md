# Code Snippet Library

A web application to store, manage, and reuse HTML, CSS, and JavaScript code snippets.

## Features

- **Snippet Management**: CRUD operations for code snippets.
- **Search & Filter**: Find snippets by title, description, category, or tags.
- **Preview & Copy**: View code snippets with syntax highlighting and copy them to your clipboard.
- **VSCode Integration**: Export snippets to VSCode JSON format.

## Tech Stack

- **Frontend**: React (Vite)
- **Backend**: Node.js (Express)
- **Database**: SQLite (better-sqlite3)

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v16 or higher)
- npm

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd "Code Snippet Library"
   ```

2. Install dependencies for both client and server:
   ```bash
   npm run install-all
   ```

### Running the Application

To start both the client and server concurrently:

```bash
npm run dev
```

- Frontend: [http://localhost:5173](http://localhost:5173)
- Backend: [http://localhost:5000](http://localhost:5000)

## Project Structure

- `client/`: React frontend.
- `server/`: Node.js Express server and SQLite database setup.
