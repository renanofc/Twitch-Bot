///uclipes jogo:league of legends username:tockawa

const { MessageEmbed } = require("discord.js");
const
    { downloadClip } = require("../../../../modules/cliprxyz"),
    { embedCreator } = require("../../../configs/embedCreator"),
    async = require("async"),
    fs = require("fs"),
    https = require("https"),
    fetch = require("node-fetch");
module.exports = {
    category: 'Twitch',
    name: "aclipes",
    description: 'Faz o Download de vários clipes de um usuário da Twitch (Máximo e Padrão do Comando: 100)',
    slash: true,
    expectedArgs: '<jogo> <username>',
    minArgs: 1,
    maxArgs: 2,
    options: [
        {
            name: "username",
            description: "Nome do usuário da Twitch",
            required: true,
            type: "STRING"
        },
        {
            name: "quantidade",
            description: "Quantidade de clipes a serem baixados (Max: 100)",
            required: false,
            type: "NUMBER"
        }
    ],
    syntaxError: { "portuguese": "Sintaxe incorreta. Use `/aclips <username>`" },
    callback: async ({ interaction, args, client }) => {

        try
        {
            let finished;
            const options = {
                method: "GET",
                headers: {
                    "Client-ID": process.env.TWITCH_ID,
                    "Authorization": `Bearer ${process.env.OAUTH}`,
                    "Accept": "application/json"
                },
            }

            await interaction.reply("⏳ Fazendo o Download dos clipes, apenas um momento por favor……\n\nEste comando pode demorar MUITO tempo para ser completo, dependendo do número de clipes disponíveis para serem baixados.")

            const fetchBroadcasterId = await fetch(`https://api.twitch.tv/helix/users?login=${args[ 0 ]}`, options)
            const broadcasterData = await fetchBroadcasterId.json()

            if (broadcasterData.data.length === 0)
            {
                throw `O usuário: "${args[ 0 ]}", parece não ser existente na Twitch!. Tente verificar o nome do usuário, talvez ajude, não esqueça de nenhum detalhe no nome!.`
            }

            const { id: broadcast_id } = broadcasterData.data[ 0 ];

            const fetchUser = await fetch(`https://api.twitch.tv/helix/clips?broadcaster_id=${broadcast_id}&first=${args[ 1 ] ?? "100"}`, options)
            const fetchUserData = await fetchUser.json()
            const dataClips = fetchUserData.data;
            const clips = dataClips.map(clip => clip.url)
            amountClips = dataClips.length;
            if (clips.length === 0)
            {
                throw new Error(`Parece que não consegui encontrar nenhum clipe para streamer ${args[ 0 ]}. Tente verificar o nome do criador de conteúdo, talvez ajude, não esqueça de nenhum detalhe no nome!.`)
            }

            async.forEachOf(clips, async (clipUrls, index, cb) => {
                const dclip = await downloadClip(clipUrls).catch(error => { console.log(error) });
                const { clipName, clipUrl } = dclip;
                https.get(clipUrl, async (res) => {
                    const name = clipName.replaceAll("\n", "").replaceAll("\\", "-").replaceAll("/", "-").replaceAll(":", "-").replaceAll("*", "-").replaceAll("?", "-").replaceAll("\"", "-").replaceAll("<", "-").replaceAll(">", "-").replaceAll("|", "-").replaceAll(",", " ").replaceAll("twitch", "");
                    const fileName = __dirname + `${name}.mp4`

                    const filePath = fs.createWriteStream(fileName)

                    res.pipe(filePath)
                    filePath.on("finish", async () => {
                        filePath.close()
                        let destino = process.env.CLIPS_PATH;
                        if (!destino) { destino = __dirname + `../../../../../clips/${name}.mp4`; }
                        else
                        {
                            if (destino.endsWith('\\')) { destino = destino + name + '.mp4'; }
                            else { destino = destino + '\\' + name + '.mp4'; }
                        }

                        const
                            source = fs.createReadStream(fileName),
                            dest = fs.createWriteStream(`${destino}`)
                        source.pipe(dest);
                        source.on('end', async () => {
                            source.close()
                        })
                        source.on("error", async (error) => {
                            console.log("Reached error 1")
                            throw new Error(error.message)
                        })
                    })
                    filePath.on("error", () => {
                        throw new Error(error.message)
                    })
                    setTimeout(() => {
                        fs.unlink(fileName, (err) => {
                            if (err) { void(0) }
                        })
                    }, 180000)
                })

            }, async () => {
                finished = true;
                await embedCreator({
                    title: "⏳ Download dos clipes concluído",
                    description: "Os clipes foram baixados com sucesso!\nCaso sejam muitos clipes, é possível que o tempo de download aumente, caso os clipes não apareçam na pasta desejada, aguarde um momento!\n\nTalvez a Twitch não envie todos os clipes para que eu possa baixar, mas não é minha culpa, culpe a Twitch!",
                }, interaction, true)
            }, async (error) => {
                throw error.message
            })

            setTimeout(async () => {
                /** Caso o download demore demais, o bot enviará esta mensagem */
                if (!finished)
                {
                    return await interaction.followUp(`⏳ Consegui baixar alguns dos clipes, mas provavelmente não todos!\nTalvez a Twitch não queira que você tenha alguns deles?`)
                } else return void (0);
            }, /** 5 minutos em ms */ 300000)
        } catch (error)
        {
            return await embedCreator({ description: `**Algo de errado aconteceu, cheque abaixo:**\n\n${error}`, title: "❌ Erro ❌" }, interaction, true)
        }
    },
    error: async ({ error }) => {
        console.log(error)
    }
}