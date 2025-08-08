# ![Github](https://img.icons8.com/?size=35&id=AZOZNnY73haj&format=png&color=000000) GitHub Push to Discord ![Discord](https://img.icons8.com/?size=35&id=6x2kochRVv1E&format=png&color=000000)

<p align="center">
  <img src="https://img.shields.io/badge/Discord.JS-v14.21.0-5865F2?style=for-the-badge" />
  <img src="https://img.shields.io/badge/ExpressJS-v5.1.0-000000?style=for-the-badge" />
  <img src="https://img.shields.io/github/license/oatmiwk/github-webhook-discord?style=for-the-badge" />
  <img src="https://img.shields.io/github/actions/workflow/status/oatmiwk/github-webhook-discord/build.yml?style=for-the-badge" />
</p>
This bot allows you to have added customization to your github pushes to update your community or friends on what is happening behind the scenes!

GitHub Webhooks to Discord only allows up to 5 Commits to be displayed in one embed. As well, it cuts texts when it exceeds a certain amount of characters per push.

Using this bot allows you to customise the logs however you want them too look! (With Discord's limitations)

## 🔐 dotenv File config

Within the same location as your `index.js`, create a new file named `.env` (exactly, with the dot). - (Or modify the included `.env.example` file)

**📋 Paste the Following Inside**

```dotenv
# --- Discord Config (Required) ---
DISCORD_TOKEN=*discord_token*

# --- Port Config (Required) ---
PORT=3000

# --- GitHub Config (Optional) ---
# GITHUB_SECRET=*github_webhook_secret*

# --- Custom Pathing (Optional) ---
GITHUB_CUSTOM_PATH=*custom_path*    # (if left blank, will default to `/github`)
```

> [!TIP]
> For extra security, you can append the EXTRA_STRING set in the .env file to the end of the URL

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

Using `node .` is useful for development purposes, and will only run when the terminal is opened, you can install a package like [PM2](https://pm2.io/) to allow you to run it in the background.

It is recommended you install it globaly!

**⚙️ Installing PM2**

```sh
npm install pm2 -g
```

While still being inside the same folder as `index.js` you can do the following command to start.
**🔑 Starting the bot**

```sh
pm2 start index.js --name push-bot
```

You can change the name to whatever you would like!

You can refer to the documentation of [PM2 Quick Start](https://pm2.keymetrics.io/docs/usage/quick-start/) for further instructions on how to use it!

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
- **`Payload URL`** will be the IP Address or domain of your server (e.g. `http://192.168.0.0:3000/{string}/github`)
  - If you are using Cloudflared, make sure to use the HTTPS URL (e.g. `https://domain.com/{string}/github`)
- **`Content type`** will be `application/json`
- **`Secret`** _OPTIONAL (but recommended)_ - the secret you set in your `.env` file.
- **`SSL verification`** _OPTIONAL (but recommended)_ - use SSL verification.
- **`Which events would you like to trigger this webhook?`** - select `Just the push events`
- **`Active`** - Allows the webhooks to be triggered.

## 📑 Future Features

Currently the bot only handles push events, later will be adding Issues, PRs and Automations.
