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
    name: "uclipes",
    description: 'Faz o Download de vários clipes de um usuário da Twitch (Máximo e Padrão do Comando: 100)',
    slash: true,
    expectedArgs: '<jogo> <username>',
    minArgs: 2,
    maxArgs: 3,
    options: [
        {
            name: "jogo",
            description: "Jogo da Twitch",
            required: true,
            type: "STRING"
        },
        {
            name: "username",
            description: "Nome do usuário da Twitch",
            required: true,
            type: "STRING"
        },
        {
            name: "quantidade",
            description: "Quantidade de clipes a serem baixados",
            required: false,
            type: "NUMBER"
        }
    ],
    syntaxError: { "portuguese": "Sintaxe incorreta. Use `/uclipes <username>`" },
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
            const fetchGame = await fetch(`https://api.twitch.tv/helix/games?name=${args[ 0 ]}`, options)
            const { data } = await fetchGame.json()
            if (data.length === 0)
            {
                throw new Error(`O jogo: "${args[ 0 ]}", parece não ser existente na Twitch!, Tente verificar o nome do jogo, talvez ajude, não esqueça de nenhum detalhe no nome!.`)
            }

            const { id: game_id } = data[ 0 ];

            const fetchBroadcasterId = await fetch(`https://api.twitch.tv/helix/users?login=${args[ 1 ]}`, options)
            const broadcasterData = await fetchBroadcasterId.json()

            if (broadcasterData.data.length === 0)
            {
                throw new Error(`O usuário: "${args[ 1 ]}", parece não ser existente na Twitch!. Tente verificar o nome do usuário, talvez ajude, não esqueça de nenhum detalhe no nome!.`)
            }

            const { id: broadcast_id } = broadcasterData.data[ 0 ];

            const fetchUser = await fetch(`https://api.twitch.tv/helix/clips?broadcaster_id=${broadcast_id}&first=${args[ 2 ] ?? "100"}`, options)
            const fetchUserData = await fetchUser.json()
            const dataClips = fetchUserData.data;
            const clips = dataClips.filter(clip => clip.game_id === game_id);

            if (clips.length === 0)
            {
                throw new Error(`Parece que não consegui encontrar nenhum clipe para o jogo: ${args[ 0 ]}, ou o streamer ${args[ 1 ]}. Tente verificar o nome do jogo ou do criador de conteúdo, talvez ajude, não esqueça de nenhum detalhe no nome de ambos!.`)
            }

            const clipsUrls = clips.map(clip => clip.url);

            await interaction.reply("⏳ Fazendo o Download dos clipes, apenas um momento por favor……")
            async.forEachOf(clipsUrls, async (clipUrls, index, cb) => {
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
                        source.on("error", async (error) => {
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
                throw new Error(error.message)
            })

            setTimeout(async () => {
                /** Caso o download demore demais, o bot enviará esta mensagem */
                if (!finished)
                {
                    return await interaction.followUp("⏳ Consegui baixar alguns clipes, mas provavelmente não todos!\nTalvez a Twitch não queira que você tenha alguns deles?")
                } else return void (0);
            }, /** 1 minuto em ms */ 60000)
        } catch (error)
        {
            return await embedCreator({ description: `**Algo de errado aconteceu, cheque abaixo:**\n\n${error}`, title: "❌ Erro ❌" }, interaction, true)
        }
    },
    error: async({error}) => {
        console.log(error)
    }
}