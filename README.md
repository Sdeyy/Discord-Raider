# Discord Raider

A feature-packed nuke bot with a slick and modern user-interface built with Electron and Discord.js.

---

## Requirements

| Requirement | Version |
|---|---|
| [Node.js](https://nodejs.org/) | v16.x or higher |
| [Git](https://git-scm.com/) | Latest |
| npm | Included with Node.js |

> **Note:** Electron 12 requires Node.js 16+. Make sure you have the correct version installed by running `node -v`.

---

## Installation

1. **Clone the repository**

```bash
git clone https://github.com/sdeyy/discord-raider.git
cd discord-raider
```

2. **Install dependencies**

```bash
npm install
```

---

## Usage

### Start the application

```bash
npm run start
```

This launches the Electron app using `electron-forge`.

### Build / Package

| Command | Description |
|---|---|
| `npm run start` | Start the app in development mode |
| `npm run package` | Package the app into a distributable folder |
| `npm run make` | Create platform-specific installers (`.exe`, `.deb`, `.rpm`) |
| `npm run build-installer` | Build an NSIS installer for Windows using electron-builder |

---

## How to use

1. Launch the app with `npm run start`.
2. Enter your **bot token** on the login screen and click **Login**.
3. Select the **server** (guild) you want to target from the dropdown.
4. Use the sidebar to navigate between sections: **Users**, **Channels**, **Roles**, and **Server**.
5. Click any action button to execute the corresponding command.

---

## Project Structure

```
src/
├── index.js          # Electron main process
├── index.html        # Login page
├── raid.html         # Main panel UI
├── alert.html        # Alert page
├── js/
│   ├── main.js       # Renderer logic (login, commands)
│   └── sidebar.js    # Sidebar navigation
├── css/              # Styles (Bootstrap, Tailwind, FontAwesome)
├── img/              # Icons and images
└── commands/         # Command modules
    ├── users/        # Ban, Kick, Mute, DM, Nickname...
    ├── channels/     # Create, Delete, Clone, Rename, Purge...
    ├── roles/        # Create, Delete, Clone, Rename...
    └── server/       # Change server name/icon
```

---

## License

This project is licensed under a **Non-Commercial** license. You are free to use, modify and distribute this software **for personal and educational purposes only**. Commercial use is strictly prohibited. See the [LICENSE](LICENSE) file for details.
