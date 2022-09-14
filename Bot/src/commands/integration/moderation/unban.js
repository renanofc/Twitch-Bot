const { embedCreator } = require("../../../configs/embedCreator");

module.exports = {
    category: "Moderação",
    name: "unban",
    description: "Desbane alguém do servidor.",
    slash: true,
    options: [
        {
            name: "id_do_usuário",
            description: "Mencione alguém ou digite o ID do usuário.",
            required: true,
            type: "STRING"
        },
        {
            name: "motivo",
            description: "Motivo do banimento.",
            required: false,
            type: "STRING"
        }
    ],
    syntaxError: { "portuguese": "Sintaxe incorreta. Use `/unban <@menção> [motivo]`" },
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
        const toUnban = await interaction.guild.bans.fetch(uId);
        if (!toUnban.user.id) { return await embedCreator({ title: "❌ Erro ❌", description: `Não foi possível encontrar o usuário: ${args[ 0 ]}`, color: 14747136 }, interaction) }
        if (toUnban.user.id === interaction.member.id) { return await embedCreator({ title: "❌ Erro ❌", description: `Você não pode desbanir você mesmo, aliás, você já está aqui!`, color: 14747136 }, interaction) }

        try
        {
            await interaction.guild.bans.remove(uId, args[ 1 ] ?? `Nenhum motivo especificado. Desbanido por: ${interaction.member.user.tag}`);
            return await embedCreator({ title: "✅ Sucesso ✅", description: `O usuário ${toUnban.user.tag} foi desbanido com sucesso!`, color: 14747136 }, interaction)
        } catch (error)
        {
            return await embedCreator({ title: "❌ Erro ❌", description: `Não foi possível desbanir o usuário: ${toUnban.user.tag}\nErro específico: ${error}`, color: 14747136 }, interaction)
        }
    }
}