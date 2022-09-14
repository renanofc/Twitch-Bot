const { MessageEmbed } = require("discord.js")

/**
 * @param {Object} embedData
 * @param {Object} interactionObj
 * @param {boolean} followup
 * @returns {Promise<void>}
*/

async function embedCreator(embedData, interactionObj, followup) {
    if (!embedData) throw new Error("No embed data provided")
    const { title, description, color, fields, image, file } = embedData;
    if (!description) throw new Error("No title or description provided.")
    if (!interactionObj) throw new Error("No interaction object provided.")

    let footer = { text: "Criado com 🖤 por тоска#8800", iconURL: "https://cdn.discordapp.com/avatars/876578406144290866/dce266d50333dc3af544894fac737c84.png?size=2048" }
    if(process.env.CREDITOS === "false") footer = null;
    else if(process.env.CREDITOS === true) footer;

    let user;
    if (!interactionObj.guildId)
    {
        user = interactionObj.user
    } else
    {
        const {member} = interactionObj;
        user = member.user
    }
    if (followup === true)
    {
        await interactionObj.followUp({
            embeds: [
                new MessageEmbed({
                    author: {
                        name: user.username,
                        iconURL: user.displayAvatarURL({ format: 'png', dynamic: true })
                    },
                    title: title ?? "",
                    description: description,
                    color: color ?? 7419530,
                    fields: fields ?? [],
                    image: image ?? null,
                    footer: footer
                })
            ]
        })
        return
    } else {
        return await interactionObj.reply({
            embeds: [
                new MessageEmbed({
                    author: {
                        name: user.username,
                        iconURL: user.displayAvatarURL({ format: 'png', dynamic: true })
                    },
                    title: title ?? "",
                    description: description,
                    color: color ?? 7419530,
                    fields: fields ?? [],
                    image: image ?? null,
                    footer: footer
                })
            ],
            files: file ?? []
        })
    }
}

module.exports = { embedCreator }