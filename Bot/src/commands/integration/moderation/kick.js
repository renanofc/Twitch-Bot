const { embedCreator } = require("../../../configs/embedCreator");

module.exports = {
    category: "Moderação",
    name: "kick",
    description: "Expulsa alguém do servidor.",
    slash: true,
    options: [
        {
            name: "menção_ou_id",
            description: "Mencione alguém ou digite o ID do usuário.",
            required: true,
            type: "STRING"
        },
        {
            name: "motivo",
            description: "Motivo do expulsão.",
            required: false,
            type: "STRING"
        }
    ],
    guildOnly: true,
    permissions: [ "KICK_MEMBERS" ],
    syntaxError: { "portuguese": "Sintaxe incorreta. Use `/kick <@menção>`" },
    callback: async ({ interaction, args, client }) => {
        let uId;
        if (args[ 0 ].match(/<@!?(\d+)>/g))
        {
            uId = args[ 0 ].match(/<@!?(\d+)>/)[ 1 ]
        } else uId = args[ 0 ]
        if (args[ 0 ].length < 18)
        {
            return await interaction.reply(`Não foi possível encontrar o usuário: ${args[ 0 ]}`)
        }
        const toKick = await interaction.guild.members.fetch(uId);
        if (!toKick.user.id) { return await embedCreator({ title: "❌ Erro ❌", description: `Não foi possível encontrar o usuário: ${args[ 0 ]}`, color: 14747136 }, interaction) }
        if (toKick.user.id === interaction.member.id) { return await embedCreator({ title: "❌ Erro ❌", description: `Você não pode expulsar você mesmo!`, color: 14747136 }, interaction) }
        if (!toKick.kickable) { return await embedCreator({ title: "❌ Erro ❌", description: `O usuário ${toKick.user.tag} não pode ser expulso.\nEle não é alguém que (Ao menos eu não consigo!) pode ser expulso!`, color: 14747136 }, interaction) }

        try
        {
            await toKick.kick(args[ 1 ] ?? "Nenhum motivo especificado. Expulso por: " + interaction.member.user.tag)
            return await embedCreator({ title: "✅ Sucesso ✅", description: `O usuário ${toKick.user.tag} foi expulso com sucesso!`, color: 14747136 }, interaction)
        } catch (error)
        {
            return await embedCreator({ title: "❌ Erro ❌", description: `Não foi possível expulsar o usuário: ${toKick.user.tag}\nErro específico: ${error}`, color: 14747136 }, interaction)
        }
    }
}