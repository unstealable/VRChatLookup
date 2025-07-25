# 🔎 VRChat Lookup

> Search VRChat users, worlds, and groups effortlessly — powered by [VRChat Bridge](https://github.com/unstealable/VRChatBridge).

---

## 🌐 What is VRChatLookup?

**VRChatLookup** is an open-source frontend for discovering public VRChat content — users, worlds, and groups — without needing to log in.  
Built on top of a custom API proxy ([VRChat Bridge](https://github.com/unstealable/VRChatBridge)), it offers a clean and mobile-friendly experience.

Live demo:  
🌍 [vrchatlookup.com](https://vrchatlookup.com)

---

## ✨ Features

- 🔎 Search for **users** by `userId` or `username`
- 🌍 Search for **worlds** by ID or name
- 🏷️ Search **groups** by `groupId`
- 📧 Check if an **email is linked** to a VRChat account
- 💡 See user details: avatar, status, tags, description, etc.
- ⚡ Fast, modern interface built with TailwindCSS
- 🛡️ No login, no tracking, no account needed

---

## 🧠 Tech Stack

- **Frontend:** Next.js 14, TypeScript, TailwindCSS
- **Backend:** [VRChat Bridge](https://github.com/unstealable/VRChatBridge) — Docker-compatible REST API
  - Docker Hub: [`unstealable/vrchatbridge`](https://hub.docker.com/r/unstealable/vrchatbridge)
  - API Docs: `[your-bridge-url]/docs`

---

## 🔧 Environment Configuration

Your `.env.local` file should look like this:

```env
# Application Settings
NEXT_PUBLIC_APP_NAME="VRChat Lookup"
NEXT_PUBLIC_APP_DESCRIPTION_EN="Discover and explore the VRChat universe - Search users, worlds, and groups effortlessly"
NEXT_PUBLIC_APP_DESCRIPTION_FR="Découvrir et explorer l'univers VRChat - Rechercher des utilisateurs, des mondes et des groupes sans effort"
NEXT_PUBLIC_APP_URL="https://your-public-url.tld"

# API Configuration
VRCHAT_BRIDGE_API_URL="https://your-bridge-api.tld"

# SEO & Marketing
NEXT_PUBLIC_APP_KEYWORDS="VRChat,VR,Virtual Reality,Social VR,VRChat Users,VRChat Worlds,VRChat Groups,VRChat Search,VRChat Lookup,VRChat Directory"
NEXT_PUBLIC_APP_AUTHOR="your-name-or-team"

# Debug Configuration
NEXT_PUBLIC_DEBUG_MODE="true"
```

> ℹ️ Replace URLs like `your-bridge-api.tld` and `your-public-url.tld` with your actual domains.

---

## 🚀 Getting Started

```bash
git clone https://github.com/unstealable/VRChatLookup
cd VRChatLookup
npm install
cp .env.local.example .env.local  # then edit it
npm run dev
```

---

## 📦 Deploy Options

- [x] Vercel
- [x] Docker + Reverse Proxy
- [x] Any Node.js server (18+)

For backend setup:

```bash
docker run -d -p 8080:8080 unstealable/vrchatbridge
```

Then update `.env.local`:
```env
VRCHAT_BRIDGE_API_URL=http://localhost:8080
```

---

## 📌 Limitations

- VRChat API is public, so **private content (e.g., friend lists)** is not available
- Email check only works with `@vrchat.com` logic (used for internal dev validation)
- Not affiliated with VRChat Inc.

---

## 🔮 Roadmap

- [x] Group & world search
- [x] Username/email support
- [ ] Embedded lookup widgets
- [ ] Favorites / bookmarks
- [ ] Admin/mod tools

---

## 🧑‍💻 Credits

Created by [@Unstealable](https://github.com/unstealable)  
Made with 💙 for the VRChat community.
