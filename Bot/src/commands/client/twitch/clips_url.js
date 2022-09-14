const
    { downloadClip } = require("../../../../modules/cliprxyz"),
    { embedCreator } = require("../../../configs/embedCreator")

module.exports = {
    category: 'Twitch',
    name: "urlclips",
    description: 'Te dá o link para download de um clipe da Twitch, usando a URL do clipe.',
    slash: true,
    options: [
        {
            name: "url_do_clipe",
            description: "URL do clipe.",
            required: true,
            type: "STRING"
        }
    ],
    syntaxError: { "portuguese": "Sintaxe incorreta. Use `/urlclips <clipe_id>`" },
    callback: async ({ interaction, args }) => {
        try
        {
            await interaction.reply("⏳ Fazendo a mágica para recuperar o clipe, apenas um momento por favor……")

            const
                dClip = await downloadClip(args[ 0 ]),
                { clipName, clipUrl, creatorUsername, creatorUrl, clippedOn } = await dClip;

            return await embedCreator({
                description: `**Clipe: ${clipName}**`,
                fields: [
                    { name: "Criador", value: `[${creatorUsername}](${creatorUrl})` }, { name: "Clipado em", value: clippedOn },
                    { name: "URL do Clipe", value: `[Clique para baixar!](${clipUrl})` },

                ],
                footer: { text: "Criado com 🖤 por тоска#8800", iconURL: "https://cdn.discordapp.com/avatars/876578406144290866/dce266d50333dc3af544894fac737c84.png" }
            }, interaction, true)
        } catch (error)
        {
            return await embedCreator({ description: `**Algo de errado aconteceu, cheque abaixo:**\n\n${error}`, title: "❌ Erro ❌" }, interaction, true)
        }
    },
    error: async({error}) => {
        console.log(error)
    }
}