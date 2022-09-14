const { embedCreator } = require("../../../configs/embedCreator");

module.exports = {
    category: "Diversão",
    name: "hug",
    description: "Abraça alguém do servidor.",
    slash: true,
    options: [
        {
            name: "menção_ou_id",
            description: "menção_ou_id do usuário que você quer abraçar.",
            required: true,
            type: "STRING"
        }
    ],
    guildOnly: true,
    syntaxError: { "portuguese": "Sintaxe incorreta. Use `/hug [@menção]`" },
    callback: async ({ interaction, args, client }) => {

        const hugGifs = [
            "https://i.pinimg.com/originals/b4/39/a5/b439a56458d086acb7eac47cc7991616.gif",
            "https://i.pinimg.com/originals/cb/74/fc/cb74fcfbaa1c29a7744b600ffe365f05.gif",
            "https://i.pinimg.com/originals/ef/b6/e3/efb6e37a8a31e47b1ea969833555b4b6.gif",
            "https://i.pinimg.com/originals/06/dd/8f/06dd8f976b7353d69aec173b44927ef4.gif",
            "https://i.pinimg.com/originals/68/0b/69/680b69563aceba3df48b4483d007bce3.gif"
        ]
        const randomHugs = hugGifs[ Math.floor(Math.random() * hugGifs.length) ];

        if (args[ 0 ].match(/<@!?(\d+)>/g))
        {
            const uId = args[ 0 ].match(/<@!?(\d+)>/)[ 1 ]
            const toKiss = await interaction.guild.members.fetch(uId)
            if (!toKiss.user.id)
            {
                return await interaction.reply(`Não foi possível encontrar o usuário: ${args[ 0 ]}`)
            }
            await embedCreator({ description: `${await interaction.member.user.tag} abraçou ${toKiss.user.tag}!`, image: { url: randomHugs } }, interaction)
        } else
        {
            await interaction.reply(`Não foi possível encontrar o usuário: ${args[ 0 ]}`)
        }

    }
}