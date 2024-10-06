/*------------------------------------------------------------------------------------------------------------------------------------------------------


Copyright (C) 2024 Kgtech-cmr.
Sous licence GPL-3.0 ; vous ne pouvez pas utiliser ce fichier sauf en conformité avec la licence sous peine de poursuites judiciaires.
Kgtech-cmr.



------------------------------------------------------------------------------------------------------------------------------------------------------*/


const { System, IronMan, isPrivate, getJson, getBuffer } = require("../lib/");

System({ 
    pattern: "waifu", 
    fromMe: isPrivate, 
    desc: "Send a waifu image", 
    type: "anime" 
}, async (message) => {
    const response = await getJson(await IronMan("ironman/waifu"));
    if (!response.status) return await message.send("_*Echec de la récupération d'image 🤷🏽*_");
    await message.send(response.ironman.url, { caption: "*Voici pour vous 😈*", quoted: message.data }, "image");
});

System({ 
    pattern: "neko", 
    fromMe: isPrivate, 
    desc: "Send Neko images", 
    type: "anime" 
}, async (message) => {
    const response = await getJson(await IronMan("ironman/neko"));
    if (!response.status) return await message.send("Echec de la récupération d'image 🤷🏽");
    await message.send(response.ironman.url, { caption: "*Voici pour vous 😈*", quoted: message.data }, "image");
});

System({
    pattern: 'sanime (.*)',
    fromMe: isPrivate,
    desc: 'Get details of an anime',
    type: 'anime',
}, async (message, match, m) => {
    if (!match) return await message.send("*J ai besoin d un anime*\n_Exemple: .anime One piece_");
    var anime = encodeURI(match);
    var res = await fetch(IronMan(`ironman/s/anime?anime=${anime}`));
    if (!res.ok) return await message.send("*Pas trouvé*\nRegarde bien si tu as bien écrit le nom de cet anime");
    var data = await res.json();
    var Etitle = data['English Title'];
    var Romaji = data.Romaji;
    var Japanese = data.Japanese;
    var Summary = data.Summary;
    var Released = data.Released;
    var Ended = data.Ended;
    var Popularity = data.Popularity;
    var Rating = data.Rating;
    var AgeRating = data['Age Rating'];
    var Subtype = data.Subtype;
    var Status = data.Status;
    var Poster = data.Poster;
    var Episodes = data.Episodes;
    var EpisodeLength = data['Episode Length'];
    var TotalLength = data['Total Length'];
    var ShowType = data['Show Type'];
    var NSFW = data.NSFW;
    var Cover = data.Low_Cover;
    var pimage = await getBuffer(Cover);
    var YouTube = data.YouTube;
    var link = "https://github.com/Kgtech-cmr/KERM-LITE-2";
    var caption = `➥ *ɴᴀᴍᴇ:* ${Romaji}\n✰ *ᴛʏᴘᴇ:* ${ShowType}\n✰ *ꜱᴜʙᴛʏᴘᴇ:* ${Subtype}\n✰ *ꜱᴛᴀᴛᴜꜱ:* ${Status}\n✰ *ʀᴇʟᴇᴀꜱᴇᴅ:* ${Released}\n✰ *ᴇɴᴅᴇᴅ:* ${Ended}\n✰ *ᴇᴘɪꜱᴏᴅᴇꜱ:* ${Episodes}\n✰ *ᴛᴏᴛᴀʟ ʟᴇɴɢᴛʜ:* ${TotalLength}\n✰ *ᴇᴘɪꜱᴏᴅᴇ ʟᴇɴɢᴛʜ:* ${EpisodeLength}\n✰ *ᴀɢᴇ ʀᴀᴛɪɴɢ:* ${AgeRating}\n✰ *ᴘᴏᴘᴜʟᴀʀɪᴛʏ:* ${Popularity}\n✰ *ʀᴀᴛɪɴɢ:* ${Rating}\n✰ *ɴꜱꜰᴡ:* ${NSFW}\n✰ *ꜱᴜᴍᴍᴀʀʏ:* ${Summary}\n➥ *ᴛʀᴀɪʟᴇʀ:* https://youtube.com/watch?v=${YouTube}\n`;
    var linkPrev = { title: Etitle, body: Japanese, thumbnail: pimage, mediaType: 1, mediaUrl: link, sourceUrl: link, showAdAttribution: false, renderLargerThumbnail: true };
    await message.client.sendMessage(message.chat, { image: { url: Poster }, caption, contextInfo: { externalAdReply: linkPrev } }, { quoted: message });
});

System({
    pattern: 'aquote ?(.*)',
    fromMe: isPrivate,
    desc: 'Get a random anime quote',
    type: 'anime',
}, async (message, match, m) => {
    const data = await getJson(IronMan('api/aquote'));
    if (!data && !data.result && !data.result.length > 0) return await message.reply('_*Aucun devis trouvé.*_');
    const randomIndex = Math.floor(Math.random() * data.result.length);
    const { english: enquote, character, anime } = data.result[randomIndex];
    await message.send(`*➭QUOTE:* ${enquote}\n*➭CHARACTER:* ${character}\n*➭ANIME:* ${anime}`);
});
