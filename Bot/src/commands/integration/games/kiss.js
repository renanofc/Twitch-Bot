const { embedCreator } = require("../../../configs/embedCreator");

module.exports = {
    category: "Diversão",
    name: "kiss",
    description: "Expulsa alguém do servidor.",
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
    syntaxError: { "portuguese": "Sintaxe incorreta. Use `/kiss [@menção]`" },
    callback: async ({ interaction, args, client }) => {

        const kissGifs = [
            "https://i.pinimg.com/originals/51/fa/2e/51fa2e1237643d5cfe8bb3fb129aa099.gif",
            "https://i.pinimg.com/originals/4f/db/e9/4fdbe9469f67804ae273f2d7a71120c6.gif",
            "https://i.pinimg.com/originals/df/14/14/df141459968515c610e62bf1a7df7be0.gif",
            "https://i.pinimg.com/originals/3a/df/00/3adf007025f558319e96b7557027fe41.gif",
            "https://i.pinimg.com/originals/69/fb/4b/69fb4b69e9b66342adcab3a0065ac579.gif",
            "https://i.pinimg.com/originals/bc/c1/a3/bcc1a3e96af7a255b65ff89699ed1997.gif"
        ]
        const randomKiss = kissGifs[ Math.floor(Math.random() * kissGifs.length) ];

        if (args[ 0 ].match(/<@!?(\d+)>/g))
        {
            const uId = args[ 0 ].match(/<@!?(\d+)>/)[ 1 ]
            const toKiss = await interaction.guild.members.fetch(uId)
            if (!toKiss.user.id)
            {
                return await interaction.reply(`Não foi possível encontrar o usuário: ${args[ 0 ]}`)
            }
            await embedCreator({ description: `${await interaction.member.user.tag} beijou ${toKiss.user.tag}! 💋`, image: { url: randomKiss } }, interaction)
        } else
        {
            await interaction.reply(`Não foi possível encontrar o usuário: ${args[ 0 ]}`)
        }
    }
}