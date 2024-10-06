/*------------------------------------------------------------------------------------------------------------------------------------------------------


Copyright (C) 2024 Kgtech-cmr.
Sous licence GPL-3.0 ; vous ne pouvez pas utiliser ce fichier sauf en conformité avec la licence sous peine de poursuites judiciaires.
Kgtech-cmr.


------------------------------------------------------------------------------------------------------------------------------------------------------*/

const {
    yts,
    isUrl,
    YtInfo,
    System,
    GetYta,
    GetYtv,
    config,
    toAudio,
    Ytsearch,
    getBuffer,
    isPrivate,
    IronMan,
    youtube,
    AddMp3Meta,
    extractUrlFromMessage,
  } = require('../lib/');

/*
System({
      pattern: 'video',
      fromMe: isPrivate,
      desc: 'YouTube video downloader',
      type: 'download',
}, async (message, match) => {
      match = match || message.reply_message.text;
      if (!match) return await message.reply('_Give a YouTube video *Url* or *Query*_');
     const matchUrl = extractUrlFromMessage(match);
     if (isUrl(matchUrl)) {
         const { title } = await YtInfo(matchUrl);
         await message.reply("_*" + "downloading " + title + "*_");
         return await message.send(await GetYtv(matchUrl), { caption: '*made with 🤍*', quoted: message.data }, 'video');
      } else {
        const data = await Ytsearch(match);
        await message.reply("_*" + "downloading " + data.title + "*_"); 
        return await message.send(await GetYtv(data.url), { caption: '*made with 🤍*', quoted: message.data }, 'video');
      }
});

System({
      pattern: 'ytv',
      fromMe: isPrivate,
      desc: 'YouTube video downloader',
      type: 'download',
}, async (message, match) => {
      match = match || message.reply_message.text;
      if (!match) return await message.reply('_Give a YouTube video *Url* or *Query*_');
     const matchUrl = extractUrlFromMessage(match);
     if (isUrl(matchUrl)) {
         const { title } = await YtInfo(matchUrl);
         await message.reply("_*" + "downloading " + title + "*_");
         return await message.send(await GetYtv(matchUrl), { caption: '*made with 🤍*', quoted: message.data }, 'video');
      } else {
        const data = await Ytsearch(match);
        await message.reply("_*" + "downloading " + data.title + "*_"); 
        return await message.send(await GetYtv(data.url), { caption: '*made with 🤍*', quoted: message.data }, 'video');
      }
});
*/

System({
  pattern: 'video ?(.*)',
  fromMe: isPrivate,
  desc: 'Downloads YouTube video',
  type: 'youtube',
}, async (message, match) => {
  const sq = match || extractUrlFromMessage(message.reply_message?.text);
  if (!sq) return message.reply("*Besoin d'un lien d'une vidéo ou d'une requête\nExemple: video Tiakola TIA.*");
  
  let url = sq;
  if (!isUrl(sq)) {
    if (isUrl(message.reply_message?.text)) {
      url = message.reply_message.text;
    } else {
      const data = await Ytsearch(sq);
      url = data.url;
    }
  }
  var res = await fetch(IronMan(`ironman/dl/ytdl2?url=${url}`));
  var dataa = await res.json();
  if (!dataa) return await message.reply("*Aucune vidéo appropriée trouvée.*");
  await message.reply(`- *Téléchargement ${dataa.title}...*`);
  await message.sendFromUrl(dataa.video, { quoted: message });
});

System({
  pattern: 'ytv ?(.*)',
  fromMe: isPrivate,
  desc: 'Download YouTube videos',
  type: 'youtube',
}, async (message, match) => {
  if (!match) return await message.reply('Veuillez fournir un lien YouTube valide.');
  var data = await youtube(match);
  if (!data.download || data.download.length === 0) return await message.reply('No download links found.');
  let qualities = data.download.map((item, index) => `${index + 1}. ${item.quality}`).join('\n');
  await message.reply(`*_${data.title}_*\n\nQualités disponibles:\n${qualities}\n\n*Répondez avec le numéro pour télécharger la vidéo dans cette qualité*\n✧${match}`);
});

System({
  on: 'text',
  fromMe: isPrivate,
  dontAddCommandList: true,
}, async (message) => {
  if (message.isBot) return;
  if (!message.reply_message || !message.reply_message.fromMe || !message.reply_message.text.includes('✧')) return;
  const match = message.reply_message.text.split('✧')[1];
  const qualitylist = parseInt(message.body.trim());
  var data = await youtube(match);
  if (isNaN(qualitylist) || qualitylist < 1 || qualitylist > data.download.length) return;
  const q = data.download[qualitylist - 1];
  await message.reply(`Téléchargement *${data.title}* dans *${q.quality}*, veuillez patienter...`);
  await message.client.sendMessage(message.chat, {
    video: {
      url: q.download
    },
    caption: `*${data.title}*\n\nQualité: ${q.quality}`,
  });
});

/*System({
      pattern: 'yta ?(.*)',
      fromMe: isPrivate,
      desc: 'YouTube audio downloader',
      type: 'download',
}, async (message, match) => {
      match = match || message.reply_message.text;
      if (!match) return await message.reply('_Give a YouTube video *Url* or *Query*_');
      const matchUrl = extractUrlFromMessage(match);
      if (isUrl(matchUrl)) {
          const { title, author, thumbnail } = await YtInfo(matchUrl);
          await message.reply("_*" + "downloading " + title + "*_");
          const aud = await AddMp3Meta(await toAudio(await GetYta(matchUrl)), await getBuffer(thumbnail), { title: title, body: author });
          await message.reply(aud, { mimetype: 'audio/mpeg' }, "audio");
      } else {
          const { title, author, thumbnail, url } = await Ytsearch(match);
          await message.reply("_*" + "downloading " + title + "*_");
          const aud = await AddMp3Meta(await toAudio(await GetYta(url)), await getBuffer(thumbnail), { title: title, body: author.name });
          await message.reply(aud, { mimetype: 'audio/mpeg' }, "audio");
     }
});*/

System({
  pattern: 'yta ?(.*)',
  fromMe: isPrivate,
  desc: 'Sends YouTube audio directly',
  type: 'youtube',
}, async (message, match) => {
    var url = match || (message.reply_message && message.reply_message.text);
    if (!url || !isUrl(url)) return await message.reply("*Besoin d'un lien d'une vidéo valide.*");
    var aud = await youtube(url);
    if (!aud.audio || aud.audio.length === 0) return await message.reply("Aucun audio disponible pour cette vidéo.");
    var title = aud.title || "audio";
    var artist = aud.artist || "Unknown Artist";
    var image = aud.image || "https://graph.org/file/58ea74675af7836579a3a.jpg";
    if (config.AUDIO_DATA !== "original") [artist, title, image] = config.AUDIO_DATA.split(';').map((v, i) => v || [artist, title, image][i]);
    await message.reply(`Téléchargement *${aud.title}*, veuillez patienter...`);
    var [audbuff, imgbuff] = await Promise.all([getBuffer(aud.audio[0].download), getBuffer(image)]);
    var fek = await AddMp3Meta(audbuff, imgbuff, { title, body: artist });
    await message.reply(fek, { mimetype: 'audio/mpeg' }, "audio");
});


System({
  pattern: 'song ?(.*)',
  fromMe: isPrivate,
  desc: 'Downloads YouTube audio',
  type: 'youtube',
}, async (message, match) => {
  var url;
  if (match) {
    url = match.includes("--thumbnail") ? (await Ytsearch(match.replace("--thumbnail", "").trim())).url : (isUrl(match) ? match : (await Ytsearch(match)).url);
  } else if (message.reply_message && message.reply_message.text) {
    url = extractUrlFromMessage(message.reply_message.text);
    if (!url) return await message.reply("*Aucun lien trouvée dans le message répondu.*");
  }
  
  if (!url) return await message.reply("*Besoin d'un lien de chanson ou d'une requête.*\n_Exemple: song Jolagreen23 4BULLDOGS_");
  var aud = await youtube(url);
  if (!aud || !aud.audio || aud.audio.length === 0) return await message.reply("Aucun audio disponible pour cette vidéo.");
  var { title = "audio", artist = "Unknown Artist", image = "https://graph.org/file/58ea74675af7836579a3a.jpg" } = aud;
  if (config.AUDIO_DATA !== "original") [artist, title, image] = config.AUDIO_DATA.split(';').map((v, i) => v || [artist, title, image][i]);
  var audbuff = await AddMp3Meta(await getBuffer(aud.audio[0].download), await getBuffer(image), { title, body: artist });
  var isThumbnail = match && match.includes("--thumbnail");
  if (isThumbnail) {
    await message.client.sendMessage(message.chat, { image: { url: aud.image }, caption: `Téléchargement *${aud.title}*, veuillez patienter...` }, { quoted: message });
    await message.reply(audbuff, { mimetype: 'audio/mpeg' }, "audio");
  } else {
    await message.send(`Téléchargement *${aud.title}*, veuillez patienter...`);
    await message.client.sendMessage(message.chat, {
      audio: audbuff,
      mimetype: 'audio/mpeg',
      contextInfo: {
        externalAdReply: {
          title: aud.title,
          body: aud.artist,
          thumbnail: await getBuffer(aud.image),
          mediaType: 1,
          mediaUrl: url,
          sourceUrl: url,
          showAdAttribution: false,
          renderLargerThumbnail: true
        }
      }
    }, { quoted: message });
  }
});

/*
System({
      pattern: 'song ?(.*)',
      fromMe: isPrivate,
      desc: 'YouTube audio downloader',
      type: 'download',
}, async (message, match) => {
      match = match || message.reply_message.text;
      if (!match) return await message.reply('_Give a YouTube video *Url* or *Query*_');
      const matchUrl = extractUrlFromMessage(match);
      if (isUrl(matchUrl)) {
          const { title, author, thumbnail } = await YtInfo(matchUrl);
          await message.reply("_*" + "downloading " + title + "*_");
          const aud = await AddMp3Meta(await toAudio(await GetYta(matchUrl)), await getBuffer(thumbnail), { title: title, body: author });
          await message.reply(aud, { mimetype: 'audio/mpeg' }, "audio");
      } else {
          const { title, author, thumbnail, url } = await Ytsearch(match);
          await message.reply("_*" + "downloading " + title + "*_");
          const aud = await AddMp3Meta(await toAudio(await GetYta(url)), await getBuffer(thumbnail), { title: title, body: author.name });
          await message.reply(aud, { mimetype: 'audio/mpeg' }, "audio");
     }
});


System({
    pattern: 'play ?(.*)',
    fromMe: isPrivate,
    desc: 'YouTube video player',
    type: 'download',
}, async (message, match) => {
      if (!match) return await message.reply('_Give a *Query* to play the song or video_');
      if (isUrl(match)) {
          const matchUrl = extractUrlFromMessage(match);
          const yt = await YtInfo(matchUrl);
          await message.reply(`*_${yt.title}_*\n\n\n\`\`\`1.⬢\`\`\` *audio*\n\`\`\`2.⬢\`\`\` *video*\n\n_*Send a number as a reply to download*_`, {
            contextInfo: {
              externalAdReply: {
                title: yt.author,
                body: yt.seconds,
                thumbnail: await getBuffer(yt.thumbnail),
                mediaType: 1,
                mediaUrl: yt.url,
                sourceUrl: yt.url,
                showAdAttribution: false,
                renderLargerThumbnail: true
              }
            }
          });
      } else {
          const yt = await Ytsearch(match);
          await message.reply(`*_${yt.title}_*\n\n\n\`\`\`1.⬢\`\`\` *audio*\n\`\`\`2.⬢\`\`\` *video*\n\n_*Send a number as a reply to download*_`, {
            contextInfo: {
              externalAdReply: {
                title: yt.author.name,
                body: yt.ago,
                thumbnail: await getBuffer(yt.image),
                mediaType: 1,
                mediaUrl: yt.url,
                sourceUrl: yt.url,
                showAdAttribution: false,
                renderLargerThumbnail: true
              }
            }
          });
      }
});
  
  System({
    on: 'text',
    fromMe: isPrivate,
    dontAddCommandList: true,
  }, async (message) => {
    if (message.isBot) return;
    if (!message.reply_message.fromMe || !message.reply_message.text) return;
    if (!message.body.includes('⬢')) return;
    let match = message.body.replace('⬢', '');
    if (message.body.includes('1')) {
      const ytAudio = await Ytsearch(match);
      const msg = await message.send(`_*Now playing : ${ytAudio.title} 🎶*_`);
      const data = config.AUDIO_DATA.split(';');
      const aud = await AddMp3Meta(
        await toAudio(await GetYta(ytAudio.url), 'mp3'),
        await getBuffer(data[2]),
        {
          title: data[0],
          body: data[1],
        }
      );
      await message.client.sendMessage(message.from, {
        audio: aud,
        mimetype: 'audio/mpeg',
        contextInfo: {
          externalAdReply: {
            title: ytAudio.author.name,
            body: ytAudio.ago,
            thumbnail: await getBuffer(ytAudio.image),
            mediaType: 1,
            mediaUrl: ytAudio.url,
            sourceUrl: ytAudio.url,
            showAdAttribution: false,
            renderLargerThumbnail: true
          }
        }
      }, { quoted: msg });
    } else if (message.body.includes('2')) {
      const data = await Ytsearch(match);
      const q = await message.send(`_*Now playing : ${data.title} 🎶*_`);
      await message.send(
        await GetYtv(data.url),
        { caption: `_*${data.title}*_`, quoted: q },
        'video'
      );
    } else {
      return;
    }
  });
  */

  System({
       pattern: 'yts ?(.*)',
       fromMe: isPrivate,
       desc: "yt search",
       type: "search",
  }, async (message, match) => {
      if (!match) {
        return await message.reply('_Veuillez fournir une *une requête*');
      } else {
        if (isUrl(match)) {
          return await message.reply("_Pas un *Lien* Veuillez fournir une *requête*");
        } else {
          const videos = await yts(match);
          const result = videos.all.map(video => `*🏷️ Titre :* _*${video.title}*_\n*📁 Duré :* _${video.duration}_\n*🔗 Lien :* _${video.url}_`);
          return await message.reply(`\n\n_*Resultat de ${match} 🔍*_\n\n`+result.join('\n\n')+"\n\n*🤍KermLord*")
        }
      }
  });
