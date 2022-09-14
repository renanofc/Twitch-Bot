const { embedCreator } = require("../../../configs/embedCreator");

module.exports = {
    category: "Diversão",
    name: "avatar",
    description: "Mostra o avatar de alguém ou o seu avatar.",
    slash: true,
    options: [
        {
            name: "menção_ou_id",
            description: "menção_ou_id do usuário.",
            required: false,
            type: "STRING"
        }
    ],
    guildOnly: true,
    syntaxError: { "portuguese": "Sintaxe incorreta. Use `/avatar [@menção]`" },
    callback: async ({ interaction, args, client }) => {

        let uId;
        if (!args[ 0 ])
        {
            return await embedCreator({ description: `🔎 [${interaction.member.user.tag}](${interaction.member.user.displayAvatarURL({ format: "png", dynamic: true, size: 2048 })})`, image: { url: interaction.member.user.displayAvatarURL({ format: "png", dynamic: true, size: 2048 }) } }, interaction)
        }
        if (args[ 0 ].match(/<@!?(\d+)>/g))
        {
            uId = args[ 0 ].match(/<@!?(\d+)>/)[ 1 ]
        } else uId = args[0]

        // If args[0] length is less than 18, return
        if (args[ 0 ].length < 18)
        {
            return await interaction.reply(`Não foi possível encontrar o usuário: ${args[ 0 ]}`)
        }
        
        const toGetAvatar = await interaction.guild.members.fetch(uId);
        if (!toGetAvatar.user.id) { return await interaction.reply(`Não foi possível encontrar o usuário: ${args[ 0 ]}`) }
        return await embedCreator({ description: `🔎 [${toGetAvatar.user.tag}](${toGetAvatar.user.displayAvatarURL({ format: "png", dynamic: true, size: 2048 })})`, image: { url: toGetAvatar.user.displayAvatarURL({ format: "png", dynamic: true, size: 2048 }) } }, interaction)

    }
}