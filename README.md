# ![Github](https://img.icons8.com/?size=35&id=AZOZNnY73haj&format=png&color=000000) GitHub Push to Discord ![Discord](https://img.icons8.com/?size=35&id=6x2kochRVv1E&format=png&color=000000)

<p align="center">
  <img src="https://img.shields.io/badge/Bot Version-v1.0.0-FC79B2?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Discord.JS-v14.21.0-5865F2?style=for-the-badge" />
  <img src="https://img.shields.io/badge/ExpressJS-v5.1.0-000000?style=for-the-badge" />
  <img src="https://img.shields.io/github/license/oatmiwk/github-webhook-discord?style=for-the-badge&logoSize=64" />
  <img src="https://img.shields.io/github/actions/workflow/status/oatmiwk/github-webhook-discord/build.yml?style=for-the-badge" />
</p>

## 🤖 About this Bot

This bot allows you to have added customization to your github pushes to update your community or friends on what is happening behind the scenes!

GitHub Webhooks to Discord only allows up to 5 Commits to be displayed in one embed. As well, it cuts texts when it exceeds a certain amount of characters per push.

## 🔐 dotenv File config

Within the same location as your `index.js`, create a new file named `.env` (exactly, with the dot). - (Or modify the included `.env.example` file)

**📋 Paste the Following Inside**

```dotenv
# --- Discord Config (Required) ---
DISCORD_TOKEN=*discord_token*
DISCORD_CHANNEL_ID=*discord_channel_id* # Channel for the webhooks to be sent
# --- Port Config (Required) ---
PORT=3000

# --- Custom Pathing (Optional) ---
# GITHUB_CUSTOM_PATH=*custom_path*    # (if left blank, will default to `github`)
```

## 💻 Bot Setup

You will need to make sure you have Node.JS installed, preferably the latest stable version.
Using [NPM](https://www.npmjs.com/), you can do the following to start the setup!

**📦 Install needed Packages**

```sh
npm i
```

**🧪 Testing the bot**

```sh
node .
```

> [!NOTE]
> When doing `node .`, you will see a log with the full link of the webhook (excluding the IP address)

## ⚙️ Using PM2

Using `node .` will only run until as long as your terminal is open, you can install a package like [PM2](https://pm2.io/) to allow you to run it in the background.

**📦 Install PM2 Globally**

```sh
npm install pm2 -g
```

While still being inside the same folder as the `index.js` you can do the following command to start.
**🔑 Starting the bot**

```sh
pm2 start index.js --name push-bot
```

You can change the name to whatever you would like!

##### You can refer to the documentation of [PM2 Quick Start](https://pm2.keymetrics.io/docs/usage/quick-start/) for further instructions on how to use it!

## 🖥️ How to Host

You will need to do either of the following to allow this bot to work.
| **Method** | **Risk** | **How It Is Hosted** | **Notes** |
| ---------- | -------- | -------------------- | --------- |
| Port Forwarding | 🔴 High Risk | Locally | Exposes a port on your local network to the broad internet |
| [Cloudflared](https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/downloads/) | 🟡 Mild Risk | Locally | Secure tunnel, No portforwarding, setup required |
| Cloud Hosted | 🟢 Low Risk | Cloud | Heroku, DigitalOcean, etc, requires setup, can cost money |

## 🦑 Connecting with Github

If you aren't sure how to set up a webhook, you can follow these steps:

- Go to your repo's settings `https://github.com/username/repo/settings`
- Under **`Webhooks`** click `Add webhook`
- **`Payload URL`** will be the link that was shown in the console earlier, remember to change the `ip-address` to your server's IP address
  - If you are using Cloudflared, make sure to use the HTTPS URL (e.g. `https://domain.com/{path}/{token}`)
- **`Content type`** will be `application/json`
- **`SSL verification`** _OPTIONAL (but recommended)_ - use SSL verification.
- **`Which events would you like to trigger this webhook?`** - select `Just the push events`
- **`Active`** - Allows the webhooks to be triggered.

## 🎨 Color Configs

In the `config` folder, there's a `config.js` file (will be changed soon) that contains 3 color presets which can be modified:

- `isEnabled` - determines which color sequence is currently active
- `colors` - defines the sequence/order of colors. Uses hex notation (eg. `0xFFFFFF`)

Only one preset can be enabled at a time. The bot will cycle through the colors in the enabled preset for each new webhook message.

## ❓ Why did I do this?

I had made a very bare bones bot for my Discord server, as i was annoyed that I could only display 5 commits at a time and the messages would get cut after like 10 words.
While it is not for everyone, a very small population just might! It also set me to do something and start with a small little project that I plan to make it much much easier to use in the future.

- Could I have made a simple github action? Ummm... yeah... but this is more fun!!
- Is this over the top? Who knows!

# 📋 TODO

- [ ] PR Support
- [ ] Issue Support
- [ ] Release Support
- [ ] Docker Support
- [ ] Command Support

## ⁉️ Potential Features

- [ ] Other Platform Support
- [ ] A Bot Available to Anyone
