const { Client, Events, GatewayIntentBits } = require("discord.js")
const mukhwakBot = require("./commands/utility/hukam.js")
const keepAlive = require("./server.js")
require("dotenv").config()

const client = new Client({ intents: [GatewayIntentBits.Guilds] })

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`)
})

client.on(Events.InteractionCreate, handleInteraction)

async function handleInteraction(interaction) {
  if (!interaction.isCommand()) return
  if (interaction.commandName === "today") {
    try {
      await mukhwakBot.execute(interaction)
    } catch (error) {
      console.log(error)
    }
  }
}

// keepAlive() // Server Running
client.login(process.env.TOKEN)
