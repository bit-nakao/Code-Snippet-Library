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

## Vercel Deployment

このプロジェクトはVercelへのデプロイに対応しています。

### 設定のポイント
1. **GitHub連携**: リポジトリをVercelにインポートします。
2. **プロジェクト設定**:
   - **Framework Preset**: `Other` (または `Vite`)
   - **Root Directory**: `./` (プロジェクトルート)
   - **Build Command**: `npm run build`
   - **Output Directory**: `client/dist` (※`vercel.json`で制御されます)
3. **ルーティング**: ルートにある `vercel.json` がフロントエンドとバックエンドのルーティングを自動的に行います。

> [!WARNING]
> **SQLiteのデータ永続化について**: Vercelのサーバーレス環境では、デプロイやサーバーの再起動に伴い `snippets.db` のデータが消去されます。本番環境でデータを永続化したい場合は、**Vercel Postgres** などの外部データベースへの移行を検討してください。

## Project Structure

- `client/`: React frontend.
- `server/`: Node.js Express server and SQLite database setup.
