

const env = require('dotenv').config()
const Discord = require('discord.js');
const https = require('https');
const client = new Discord.Client();
const http = require('http');

// TODO: Setup webhook to recieve messages from the channel. This way cooldown can be smart
// and the bot won't send messages unless there has been some activity in the channel that
// is not bot activity.
var voicemessages = [
  'XXX is in the voice room',
  'Wow, XXX is a big mouth and wants to voice chat',
  'yall know who it is its ya boy XXX back in voice',
  'someone is lonely oh its XXX',
  'ohhh la la its XXX',
  'Michael jordan? No its XXX',
  'Trump Vs. XXX'
];

var cooldown = false;
// cool down messages for 120 seconds so people aren't spamming.
function cooldownbaby() {
  cooldown = true;
  setTimeout(() => {
    cooldown = false;
    
  }, 120000);
}

function generateVoiceMessage(usr) {
  const message = voicemessages[Math.floor(Math.random() * voicemessages.length)]; //tx stkvrflw
  return message.replace('XXX', usr) 
}

function sendMessageToTelegram(msg) {
  if (!cooldown) { 
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
  }
};

client.on('ready', () => {
  client.user.setPresence({ game: { name: 'manhattan is dead' }, status: 'idle' });
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

  if (newVoiceState !== undefined && newVoiceState.channel) {
    var allowedChannel = false;

    if (newVoiceState.channel.id === '508061365056045077') {
      allowedChannel = true;
    }

    if (!cooldown && allowedChannel) {

      let msg = generateVoiceMessage(newVoiceState.member.displayName);
      //talkChannel.send(msg);
      sendMessageToTelegram(msg);
      cooldownbaby();
    } else {
      console.log("coolin down");
    }
        
  }
  

  
  return;
});

client.login(process.env.XDISCORD_TOKEN);
console.log("DISCORD INIT");

