require("dotenv").config();

const { Client, GatewayIntentBits, EmbedBuilder } = require("discord.js");
const express = require("express");
const PORT = process.env.PORT || 3000;
const token = process.env.DISCORD_TOKEN;
const channelId = process.env.DISCORD_CHANNEL_ID;
const customPath = process.env.GITHUB_CUSTOM_PATH || "github";
const config = require("./config/config.js");
const fs = require("fs");

let linkToken;

if (fs.existsSync("./config/token.json")) {
  const tokenData = require("./config/token.json");
  linkToken = tokenData.linkToken;
}

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
});

const app = express();

let colorIndex = 0;

function getNextColor() {
  let colors = null;

  for (const [key, colorSet] of Object.entries(config)) {
    if (colorSet.isEnabled) {
      colors = colorSet.colors;
      break;
    }
  }
  if (!colors) {
    console.warn("No color found in the config");
    return 0xffffff;
  } else if (!Array.isArray(colors)) {
    colors = [colors];
  }

  const color = colors[colorIndex];

  colorIndex = (colorIndex + 1) % colors.length;
  return color;
}

// Token Character Generator
function createString(length) {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let string = "";
  for (let i = 0; i < length; i++) {
    string += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return string;
}

function createToken(stringLengths = [7, 12, 12, 7]) {
  return stringLengths.map(createString).join("-");
}

// Token Output to Console and File
if (!linkToken) {
  linkToken = createToken();
  let webhookUrl = `http://ip-address:${PORT}/${customPath}/${linkToken}`;
  fs.writeFile("./config/token.json", JSON.stringify({ linkToken }), (err) => {
    if (err) {
      console.error("Error writing token file:", err);
    } else {
      console.log("✅ Token file created successfully");
      console.log(
        "\x1b[36m🔗 New Webhook link:\x1b[0m",
        `\x1b[35m${webhookUrl}\x1b[0m`
      );
    }
  });
} else {
  console.log("✅ Token file found, skipping generation");
  let webhookUrl = `http://ip-address:${PORT}/${customPath}/${linkToken}`;
  console.log(
    "\x1b[36m🔗 Webhook link:\x1b[0m",
    `\x1b[35m${webhookUrl}\x1b[0m`
  );
}

function getFileStats(commits) {
  let totalAdded = 0;
  let totalRemoved = 0;
  let totalModified = 0;

  commits.forEach((commit) => {
    totalAdded += (commit.added || []).length;
    totalRemoved += (commit.removed || []).length;
    totalModified += (commit.modified || []).length;
  });

  return { totalAdded, totalRemoved, totalModified };
}

app.use(express.raw({ type: "application/json", limit: "5mb" }));

app.use(`/${customPath}/${linkToken}`, (req, res, next) => {
  try {
    const sizeMB = (req.body.length / 1024 / 1024).toFixed(2);
    console.log(`Received a webhook payload of ${sizeMB}MB`);

    req.body = JSON.parse(req.body.toString());
    next();
  } catch (error) {
    console.error("JSON parsing error:", error.message);
    res.status(400).send("Invalid JSON payload");
  }
});

client.once("ready", () => {
  console.log(`Bot logged in as ${client.user.tag}`);
});

function formatCommits(commits) {
  return commits
    .map((commit) => {
      const shortHash = commit.id.substring(0, 7);
      const commitMessage = commit.message.split("\n")[0];
      return `[\`${shortHash}\`](${commit.url}) ${commitMessage}`;
    })
    .join("\n");
}

app.post(`/${customPath}/${linkToken}`, async (req, res) => {
  try {
    const payload = req.body;

    if (req.headers["x-github-event"] !== "push") {
      return res
        .status(200)
        .send("Event was received but ignored (is not push event)");
    }

    const channel = client.channels.cache.get(channelId);
    if (!channel) {
      console.error("Discord channel not found");
      return res.status(500).send("Discord channel configuration error");
    }

    const repo = payload.repository.name;
    const branch = payload.ref.replace("refs/heads/", "");
    const pusher = payload.pusher.name;
    const pusherImage = payload.sender?.avatar_url;
    const pusherURL = payload.sender?.html_url;
    const commitCount = payload.commits.length;
    const compareUrl = payload.compare;
    const { totalAdded, totalRemoved, totalModified } = getFileStats(
      payload.commits
    );
    const totalChangedFiles = totalAdded + totalRemoved + totalModified;

    const embed = new EmbedBuilder()
      .setColor(getNextColor())
      .setAuthor({ name: pusher, iconURL: pusherImage, url: pusherURL })
      .setTitle(
        `[${repo}] ${commitCount} new commit${
          commitCount !== 1 ? "s" : ""
        } to [${branch}]`
      )
      .setFooter({
        text: `📄 ${totalChangedFiles} file${
          totalChangedFiles !== 1 ? "s" : ""
        } modified`,
      })
      .setURL(compareUrl);

    if (commitCount > 0) {
      const commitChunks = [];
      const maxEmbedLength = 4000;
      let currentChunk = "";
      const formattedCommits = formatCommits(payload.commits);
      const commitLines = formattedCommits.split("\n");

      for (const line of commitLines) {
        if (currentChunk.length + line.length + 1 > maxEmbedLength) {
          commitChunks.push(currentChunk);
          currentChunk = line;
        } else {
          currentChunk += (currentChunk ? "\n" : "") + line;
        }
      }

      if (currentChunk) {
        commitChunks.push(currentChunk);
      }

      embed.setDescription(commitChunks[0]);
      await channel.send({ embeds: [embed] });

      for (let i = 1; i < commitChunks.length; i++) {
        const additionalEmbed = new EmbedBuilder().setDescription(
          commitChunks[i]
        );
        await channel.send({ embeds: [additionalEmbed] });
      }
    } else {
      embed.setDescription("No commits in this push event");
      await channel.send({ embeds: [embed] });
    }
    res.status(200).send("Webhook processed successfully");
  } catch (error) {
    console.error("Error processing webhook:", error);
    res.status(500).send("Internal error");
  }
});

client.login(token);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
