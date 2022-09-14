module.exports = {
    category: "Diversão",
    name: "rolar",
    description: "Rola um Dado de 26 lados!.",
    slash: true,
    syntaxError: { "portuguese": "Sintaxe incorreta. Use `/rolar`" },
    callback: async ({ interaction, args, client }) => {

        const dado = Math.floor(Math.random() * 26) + 1;
        return await interaction.reply(`🎲 O dado rolou: **${dado}**!`);

    }
}