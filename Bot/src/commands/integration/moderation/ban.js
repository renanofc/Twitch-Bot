const { embedCreator } = require("../../../configs/embedCreator");

module.exports = {
    category: "Moderação",
    name: "ban",
    description: "Bane alguém do servidor.",
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
            description: "Motivo do banimento.",
            required: false,
            type: "STRING"
        },
        {
            name: "tempo",
            description: "Tempo do banimento. (Máximo de 7 dias)",
            required: false,
            type: "STRING"
        }
    ],
    syntaxError: { "portuguese": "Sintaxe incorreta. Use `/ban <@menção> [motivo] [tempo]`" },
    permissions: [ "BAN_MEMBERS" ],
    guildOnly: true,
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
        const toBan = interaction.guild.members.cache.get(uId);
        if (!toBan) { return await embedCreator({ title: "❌ Erro ❌", description: `Não foi possível encontrar o usuário: ${args[ 0 ]}`, color: 14747136 }, interaction) }
        if (toBan.id === interaction.member.id) { return await embedCreator({ title: "❌ Erro ❌", description: `Você não pode banir você mesmo.`, color: 14747136 }, interaction) }
        if (!toBan.bannable) { return await embedCreator({ title: "❌ Erro ❌", description: `Não foi possível banir o usuário: ${toBan.user.tag}\nEle não é alguém que (Ao menos eu não consigo!) pode ser banido!`, color: 14747136 }, interaction) }

        try
        {
            await toBan.ban({
                reason: args[ 1 ] ? args[ 1 ] : "Nenhum motivo especificado. Banido por: " + interaction.member.user.tag,
                days: parseInt(args[ 2 ]) ? args[ 2 ] : 0
            })
            return await embedCreator({ title: "✅ Sucesso ✅", description: `O usuário ${toBan.user.tag} foi banido com sucesso!` }, interaction)
        } catch (error)
        {
            return await embedCreator({ title: "❌ Erro ❌", description: `Não foi possível banir o usuário: ${toBan.user.tag}\nErro específico: ${error}`, color: 14747136 }, interaction)
        }
    }
}