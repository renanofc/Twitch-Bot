const { embedCreator } = require("../../../configs/embedCreator");

module.exports = {
    category: "Moderação",
    name: "mute",
    description: "Muta alguém do servidor.",
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
            description: "Motivo do mute.",
            required: false,
            type: "STRING"
        }
    ],
    guildOnly: true,
    permissions: [ "MUTE_MEMBERS" ],
    syntaxError: { "portuguese": "Sintaxe incorreta. Use `/mute <@menção> [motivo]`" },
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

        const toMute = await interaction.guild.members.fetch(uId);
        if (!toMute.user.id) { return await embedCreator({ title: "❌ Erro ❌", description: `Não foi possível encontrar o usuário: ${args[ 0 ]}`, color: 14747136 }, interaction) }
        if (toMute.user.id === interaction.member.id) { return await embedCreator({ title: "❌ Erro ❌", description: `Você não pode mutar você mesmo!`, color: 14747136 }, interaction) }
        if ((await interaction.guild.roles.comparePositions(await interaction.member.roles.highest, toMute.roles.highest)) <= 0) { return await embedCreator({ title: "❌ Erro ❌", description: `Você não pode mutar alguém com um cargo maior ou igual ao seu!`, color: 14747136 }, interaction) }
        if ((await interaction.guild.roles.comparePositions(await interaction.guild.me.roles.highest, toMute.roles.highest)) <= 0) { return await embedCreator({ title: "❌ Erro ❌", description: `Eu não posso mutar alguém com um cargo maior ou igual ao meu!`, color: 14747136 }, interaction) }
        if (await toMute.roles.cache.find(x => x.name === "Mutado.")) { return await embedCreator({ title: "❌ Erro ❌", description: `O usuário ${toMute.user.tag} já está mutado!`, color: 14747136 }, interaction) }

        try
        {
            const toMuteRole = await interaction.guild.roles.cache.find(x => x.name === "Mutado.");
            if (!toMuteRole)
            {
                const newRole = await interaction.guild.roles.create({
                    name: "Mutado.",
                    color: "#000000",
                    permissions: []
                });
                await toMute.roles.add(await newRole);
                await interaction.guild.channels.cache.forEach(async (channel) => {
                    await channel.permissionOverwrites.create(await newRole, { SEND_MESSAGES: false, SPEAK: false, ADD_REACTIONS: false, CREATE_PUBLIC_THREADS: false, CREATE_PRIVATE_THREADS: false, SEND_MESSAGES_IN_THREADS: false });
                })
                return await embedCreator({ title: "✅ Sucesso ✅", description: `O usuário ${toMute.user.tag} foi mutado com sucesso!`, fields: [ { name: "Motivo do Mute:", value: args[ 1 ] ?? "Sem Motivo!" } ] }, interaction)

            } else
            {
                await toMute.roles.add(toMuteRole);
                return await embedCreator({ title: "✅ Sucesso ✅", description: `O usuário ${toMute.user.tag} foi mutado com sucesso!`, fields: [ { name: "Motivo do Mute:", value: args[ 1 ] ?? "Sem Motivo!" } ] }, interaction)
            }
        }
        catch (err)
        {
            return await embedCreator({ description: `**Algo de errado aconteceu, cheque abaixo:**\n\n${error}`, title: "❌ Erro ❌" }, interaction, true)
        }
    }
}