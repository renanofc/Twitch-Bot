//https://discord.com/api/oauth2/authorize?client_id=982078627686526996&permissions=8&scope=bot%20applications.commands

const dotenv = require("dotenv"); dotenv.config()
const
    DiscordJS = require("discord.js"),
    WOKCommands = require("../modules/wokcommands"),
    path = require("path")

const
    { Intents } = DiscordJS,
    client = new DiscordJS.Client({
        intents: [
            Intents.FLAGS.GUILDS,
            Intents.FLAGS.GUILD_MESSAGES,
            Intents.FLAGS.GUILD_MEMBERS,
            Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
            Intents.FLAGS.DIRECT_MESSAGES,
            Intents.FLAGS.DIRECT_MESSAGE_REACTIONS,
            Intents.FLAGS.DIRECT_MESSAGE_TYPING,
        ],
    })

client.on("ready", async () => {
    new WOKCommands(client, {
        commandsDir: path.join(__dirname, "commands"),
        featuresDir: path.join(__dirname, "features"),
        showWarns: true,
        delErrMsgCooldown: -1,
        defaultLanguage: "portuguese",
        messagesPath: path.join(__dirname, "configs/message.json"),
        ignoreBots: true,
        ephemeral: true,
        botOwners: process.env.BOT_OWNER,
        disabledDefaultCommands: [
            "requiredrole",
            "channelonly",
            "prefix",
            "language",
            "command"
        ],
        debug: false
    })
        .setDisplayName(`${client.user.username} -`)
        .setCategorySettings([
            { name: "Twitch", emoji: "🎥", color: 7419530 },
            { name: "Diversão", emoji: "🎮" },
            { name: "Moderação", emoji: "🔨" },
        ])
        .setColor(7419530)
})

client.login(process.env.TOKEN)