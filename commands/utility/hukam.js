const {
  SlashCommandBuilder,
  EmbedBuilder,
  blockQuote,
  bold,
  italic,
} = require("discord.js")
const axios = require("axios")
const { getIndianTime } = require("../../getIndianTime.js")

async function fetchData() {
  try {
    const response = await axios.get(`${process.env.APIURL}/${getIndianTime()}`)
    return response.data
  } catch (error) {
    console.error("Error fetching data:", error.message)
    throw error // Rethrow the error to handle it further, if needed
  }
}

async function getTitle() {
  const data = await fetchData()
  try {
    const date = data.date.gregorian
    const dateNS = data.date.nanakshahi.punjabi
    const hInfo = data.hukamnamainfo
    const mDateEnglish = `${date.day}, ${date.month} ${date.date}, ${date.year}`
    const mDateNankshahi = `${dateNS.day}, ${dateNS.date} ${dateNS.month} (ਸੰਮਤ ${dateNS.year} ਨਾਨਕਸ਼ਾਹੀ)`
    const mAng = `${hInfo.source.pageName.unicode} ${hInfo.pageno} (${hInfo.source.unicode})`
    const mRaagWriter = `${hInfo.raag.unicode} - ${hInfo.writer.unicode}`
    const mTitle = `Hukamnama from Sri Darbar Sahib, Sri Amritsar\n`
    const mDescription = `${mDateEnglish}\n${mDateNankshahi}\n\n${mAng}\n${mRaagWriter}`

    const embed = new EmbedBuilder()
      .setColor(0x0099ff)
      .setTitle(mTitle)
      .setDescription(blockQuote(mDescription))
    return embed
  } catch (error) {
    console.log(error.message)
  }
}

async function getHukam() {
  try {
    const data = await fetchData()
    let sum = ""
    data.hukamnama.forEach((pangti) => {
      sum += `${bold(pangti.line.gurmukhi.unicode)}\n${italic(
        pangti.line.translation.english.default
      )}\n \n`
    })

    sum = sum.replace(/\|/g, "\\|")
    const embed = new EmbedBuilder()
      .setColor(0x0099ff)
      .setDescription(sum)
      .setTimestamp()
    return embed
  } catch (error) {
    console.log(error.message)
  }
}

function getImage() {
  const hukamnamaGif = `https://old.sgpc.net/hukumnama/jpeg%20hukamnama/hukamnama.gif?v=${new Date().getTime()}`

  const embed = new EmbedBuilder().setColor(0x0099ff).setImage(hukamnamaGif)

  return embed
}

const data = new SlashCommandBuilder()
  .setName("today")
  .setDescription("Gives today's Hukamnama")

const execute = async (interaction) => {
  const title = await getTitle()
  const hukam = await getHukam()
  const image = getImage()

  await interaction.deferReply()
  await interaction.editReply({ embeds: [title, hukam, image] })
}

module.exports = { data, execute }
