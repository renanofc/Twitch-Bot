const
    { downloadClip } = require("../../../../modules/cliprxyz"),
    { embedCreator } = require("../../../configs/embedCreator"),
    fs = require("fs"),
    https = require("https");

module.exports = {
    category: 'Twitch',
    name: "clipes",
    description: 'Faz o Download de um clipe da Twitch, usando a URL do clipe.',
    slash: true,
    options: [
        {
            name: "url_do_clipe",
            description: "ID do clipe.",
            required: true,
            type: "STRING"
        }
    ],
    syntaxError: { "portuguese": "Sintaxe incorreta. Use `/clips <clipe_id>`" },
    callback: async ({ interaction, args }) => {
        try
        {
            await interaction.reply("⏳ Fazendo o Download do clipe, apenas um momento por favor……")
            const
                dClip = await downloadClip(args[ 0 ]),
                { clipName, clipUrl, creatorUsername, creatorUrl, clippedOn } = dClip;
            https.get(clipUrl, async (res) => {
                const name = clipName.replaceAll("\n", "").replaceAll("\\", "-").replaceAll("/", "-").replaceAll(":", "-").replaceAll("*", "-").replaceAll("?", "-").replaceAll("\"", "-").replaceAll("<", "-").replaceAll(">", "-").replaceAll("|", "-");
                const filePath = fs.createWriteStream(`${__dirname + `${name}.mp4`}`)
                res.pipe(filePath)
                filePath.on('finish', () => {
                    filePath.close();

                    // Caso a variavel "Destino" seja definido, o download será feito para o local definido, caso contrário
                    // Muda o Local do clipe para o diretório de Clips, localizado no diretório do Bot.
                    // OBS: O diretório de Clips padrão é o diretório onde está a pasta "clipes", no diretório do Bot.
                    // OBS 2: A variável "Destino" é definida no arquivo ".env" do Bot, sendo OBRIGATÓRIO uma URL de destino completa, por exemplo:
                    // C:\Users\{VOCÊ}\Desktop\Clipes\ <-- NÃO ESQUEÇA DA BARRA INVERTIDA!

                    let destino = process.env.CLIPS_PATH;
                    if (!destino) { destino = __dirname + `../../../../../clips/${name}.mp4`; }
                    else
                    {
                        if (destino.endsWith('\\')) { destino = destino + name + '.mp4'; }
                        else { destino = destino + '\\' + name + '.mp4'; }
                    }

                    const
                        source = fs.createReadStream(`${__dirname + `${name}.mp4`}`),
                        dest = fs.createWriteStream(`${destino}`)

                    source.pipe(dest);
                    source.on('end', () => {
                        fs.unlink(`${__dirname + `${name}.mp4`}`, async () => {
                            return await embedCreator({
                                description: `**Clipe: ${clipName}\nFoi baixado com sucesso!**`,
                                fields: [
                                    { name: "Criador", value: `[${creatorUsername}](${creatorUrl})` }, { name: "Clipado em", value: clippedOn } ],
                                
                            }, interaction, true)
                        })
                    })
                    source.on("error", async (err) => {
                        throw new Error(err.message)
                    })
                });
                filePath.on("error", async (err) => {
                    throw new Error(err.message)
                })
            })
        } catch (error)
        {
            return await embedCreator({ description: `**Algo de errado aconteceu, cheque abaixo:**\n\n${error}`, title: "❌ Erro ❌" }, interaction, true)
        }
    },
    error: async({error}) => {
        console.log(error)
    }
}