

const env = require('dotenv').config()
const Discord = require('discord.js');
const https = require('https');
const client = new Discord.Client();
const http = require('http');


function sendMessageToTelegram(msg) {
  let telegramBotUrl = `https://api.telegram.org/${process.env.TELEGRAM_BOT}/sendMessage?chat_id=${process.env.TELEGRAM_CHAT_ID}&text=${msg}`

  https.get(telegramBotUrl, res => {
    res.setEncoding("utf8");
    let body = "";
    res.on("data", data => {
      body += data;
    });
    res.on("end", () => {
      body = JSON.parse(body);
      console.log(body);
    });
  });
};

client.on('ready', () => {
  client.user.setPresence({ game: { name: 'bot. is. butt.' }, status: 'idle' });
  console.log("DISCORD READY");
});
          
client.on("voiceStateUpdate", function (oldVoiceState, newVoiceState) {
  
  let talkChannel = client.channels.cache.find((f) => f.name === 'bot-trash');

  if (oldVoiceState !== undefined && newVoiceState !== undefined) {
    if (oldVoiceState.channelID === newVoiceState.channelID) {
      // User starts streaming.

      if (newVoiceState.streaming) {
        let msg = `${newVoiceState.member.displayName} is streaming.`
        //talkChannel.send(msg);
        sendMessageToTelegram(msg);
      }
      return;
    }
  }
  
  if(oldVoiceState === undefined && newVoiceState !== undefined) {
    
    // User Joins a voice channel
    talkChannel.send(newVoiceState.member.displayName + " entered vvv");

  } else if(newVoiceState === undefined){

    // User leaves a voice channel

  }
  
  return;
});

client.login(process.env.XDISCORD_TOKEN);
console.log("DISCORD INIT");

