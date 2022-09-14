const { embedCreator } = require("../../../configs/embedCreator");

module.exports = {
    category: "Diversão",
    name: "pat",
    description: "Dá carinho em alguém do servidor.",
    slash: true,
    options: [
        {
            name: "menção_ou_id",
            description: "Mencione alguém ou digite o ID do usuário.",
            required: true,
            type: "STRING"
        }
    ],
    guildOnly: true,
    syntaxError: { "portuguese": "Sintaxe incorreta. Use `/pat [@menção]`" },
    callback: async ({ interaction, args, client }) => {

        const patGifs = [
            "https://i.pinimg.com/originals/48/d6/75/48d67569d3dd681bc5b638b4783ee13e.gif",
            "https://i.pinimg.com/originals/38/db/ba/38dbba01df34822bfe0a286e861d9b3a.gif",
            "https://i.pinimg.com/originals/7a/ac/01/7aac01fe264581179622ef6df4a08d45.gif",
            "https://i.pinimg.com/originals/75/9a/3e/759a3e4200a0f4c292ebf3fd84cf25e1.gif",
            "https://i.pinimg.com/originals/7a/69/f8/7a69f83c312d7711df38c0c115c889c3.gif",
            "https://i.pinimg.com/originals/48/97/73/4897734e420880998b7047a2432684e5.gif"
        ]
        const randomPat = patGifs[ Math.floor(Math.random() * patGifs.length) ];

        if (args[ 0 ].match(/<@!?(\d+)>/g))
        {
            const uId = args[ 0 ].match(/<@!?(\d+)>/)[ 1 ]
            const toKiss = await interaction.guild.members.fetch(uId)
            if (!toKiss.user.id)
            {
                return await interaction.reply(`Não foi possível encontrar o usuário: ${args[ 0 ]}`)
            }
            await embedCreator({ description: `${await interaction.member.user.tag} fez carinho em ${toKiss.user.tag}!`, image: { url: randomPat } }, interaction)
        } else
        {
            await interaction.reply(`Não foi possível encontrar o usuário: ${args[ 0 ]}`)
        }

    }
}