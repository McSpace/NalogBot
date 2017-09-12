/*
Done! Congratulations on your new bot. You will find it at t.me/NalogNalogBot. You can now add a description, about section and profile picture for your bot, see /help for a list of commands. By the way, when you've finished creating your cool bot, ping our Bot Support if you want a better username for it. Just make sure the bot is fully operational before you do this.

Use this token to access the HTTP API:
398779925:AAFnHOarHUAML2HkQ4dc8GIBXlywEFj2EW8

For a description of the Bot API, see this page: https://core.telegram.org/bots/api
*/

var request = require('request');
var TelegramBot = require('node-telegram-bot-api');
var readline = require('readline');

var BadFn = "23";



var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// BurgerNowBot
//var token = '109258817:AAHM26-lrQtgF3IF6xZ5zwTf28g-0LCHVMY';
// FareBot
var token = '398779925:AAFnHOarHUAML2HkQ4dc8GIBXlywEFj2EW8';

var lastChat = 123975744;
// Setup polling way
var bot = new TelegramBot(token, { polling: true });
console.log('bot:', bot);


bot.on('text', function (msg) {
  console.log('bot.on text:', msg);
  var chatId = msg.chat.id;
  lastChat = chatId;
  // photo can be: a file path, a stream or a Telegram file_id
  if (msg.text.toLowerCase() == "test") {
    var photo = 'cat.jpg';
    bot.sendPhoto(chatId, photo, { caption: 'Чек корректный' });
  }
  if ((msg.text.toLowerCase()).startsWith("fn=")) {
    var newMask = msg.text.slice(3);
    console.log("Block = (" + newMask + ")");
    BadFn = newMask;
    bot.sendMessage(chatId, 'Заблокировал ФН, оканчивающийся на ' + newMask);
  }
  //bot.sendMessage(chatId, 'New booking! -$' + random(8,25) + ' off');
});


bot.on('photo', function (msg) {
  console.log('bot.on photo:', msg);
  var chatId = msg.chat.id;
  console.log('=== Start Read ===');

  var url1 = 'https://api.telegram.org/bot' + token + '/getfile?file_id=' + msg.photo[3].file_id;
  console.log(url1);
  request.get(
    url1,
    function (error, response, FNbody) {
      if (error) { console.log(error); }
      if (!error && response.statusCode == 200) {
        console.log('=== get file path ===');
        console.log(FNbody);

        request.get(
          'http://api.qrserver.com/v1/read-qr-code/?fileurl=https://api.telegram.org/file/bot' + token + '/' + JSON.parse(FNbody).result.file_path,
          function (error, response, body) {
            if (error) { console.log(error); }
            if (!error && response.statusCode == 200) {
              console.log('=== get QR ===');
              console.log(body);
              var r = JSON.parse(body)[0].symbol[0];
              if (r.error == null) {
                var fnpos = r.data.indexOf('fn=');
                if (fnpos == -1) {
                  bot.sendMessage(chatId, "В QR-коде отсутсвует информация о чеке");
                }
                else {
                  var fn = r.data.substr(fnpos + 3, 16);

                  console.log("FN = " + fn);
                  if (fn.endsWith(BadFn)) {
                    bot.sendMessage(chatId, "Чек не действительный. Подайте жалобу в ФНС!");
                  }
                  else {
                    bot.sendMessage(chatId, "Чек коррекный");

                  }
                }

              }
              else {
                bot.sendMessage(chatId, "QR-код не распознан");
              }

            }
          }
        );

      }
    }
  );




  // lastChat = chatId;
  // photo can be: a file path, a stream or a Telegram file_id
  // var photo = 'cat.jpg';
  // bot.sendPhoto(chatId, photo, {caption: 'Чек корректный'});
  //bot.sendMessage(chatId, 'New booking! -$' + random(8,25) + ' off');
});




bot.on('/start', function (msg) {
  console.log('/start', msg);
  var chatId = msg.chat.id;
  lastChat = chatId;
  // photo can be: a file path, a stream or a Telegram file_id
  var photo = 'cat.png';
  //  bot.sendPhoto(chatId, photo, {caption: 'Lovely kittens'});
  bot.sendMessage(chatId, '/start ' + msg.from.first_name);
});

bot.on('start', function (msg) {
  console.log('start', msg);
  var chatId = msg.chat.id;
  lastChat = chatId;
  // photo can be: a file path, a stream or a Telegram file_id
  var photo = 'cat.png';
  //  bot.sendPhoto(chatId, photo, {caption: 'Lovely kittens'});
  bot.sendMessage(chatId, 'start ' + msg.from.first_name);
});

function random(low, high) {
  return Math.floor(Math.random() * (high - low) + low);
}

rl.on('line', function (cmd) {
  bot.sendMessage(lastChat, 'Yof ' + cmd);
  var photo = 'cat.png';
  bot.sendPhoto(57787202, photo, { caption: 'Чек верный' });
  //console.log('You just typed: '+cmd);
});






