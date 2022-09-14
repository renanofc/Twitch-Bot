const { embedCreator } = require("../../../configs/embedCreator");

module.exports = {
    category: "Moderação",
    name: "unmute",
    description: "Desmuta alguém mutado.",
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
    syntaxError: { "portuguese": "Sintaxe incorreta. Use `/unmute <@menção ou id>`" },
    permissions: [ "MUTE_MEMBERS" ],
    callback: async ({ interaction, args, client }) => {
        let uId;
        if (args[ 0 ].match(/<@!?(\d+)>/g))
        {
            uId = args[ 0 ].match(/<@!?(\d+)>/)[ 1 ]
        }
        else uId = args[ 0 ]
        if (args[ 0 ].length < 18)
        {
            return await interaction.reply(`Não foi possível encontrar o usuário: ${args[ 0 ]}`)
        }
        const toUnmute = await interaction.guild.members.fetch(uId);
        if (!toUnmute.user.id) { return await embedCreator({ title: "❌ Erro ❌", description: `Não foi possível encontrar o usuário: ${args[ 0 ]}`, color: 14747136 }, interaction) }

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
                await interaction.guild.channels.cache.forEach(async (channel) => {
                    await channel.permissionOverwrites.create(await newRole, { SEND_MESSAGES: false, SPEAK: false, ADD_REACTIONS: false, CREATE_PUBLIC_THREADS: false, CREATE_PRIVATE_THREADS: false, SEND_MESSAGES_IN_THREADS: false });
                })
                return await embedCreator({ title: "❌ Erro ❌", description: `Não foi possível encontrar o cargo de mutado. Um novo cargo foi criado.`, color: 14747136 }, interaction)
            }
            if (!await toUnmute.roles.cache.find(x => x.name === "Mutado.")) { return await embedCreator({ title: "❌ Erro ❌", description: `O usuário ${toUnmute.user.tag} não está mutado!`, color: 14747136 }, interaction) }

            await toUnmute.roles.remove(toMuteRole);
            return await embedCreator({ title: "✅ Sucesso ✅", description: `O usuário ${toUnmute.user.tag} foi desmutado com sucesso!` }, interaction)
        } catch (error)
        {
            return await embedCreator({ description: `**Algo de errado aconteceu, cheque abaixo:**\n\n${error}`, title: "❌ Erro ❌" }, interaction, true)
        }

    }
}