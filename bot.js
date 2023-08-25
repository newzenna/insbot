/* required to disable the deprecation warning, 
will be fixed when node-telegram-bot-api gets a new update */
const { MongoClient } = require('mongodb')
require('dotenv').config()
process.env['NTBA_FIX_350'] = 1

const uri = "mongodb+srv://insbot:GGRfXfWb0QR5VYvf@insbot.9qdnvwd.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri);

const TelegramBot = require('node-telegram-bot-api')
const downloadFromYoutube = require('./funcs/youtube')
const downloadFromInstagram = require('./funcs/instagram')
const {
	downloadTrackFromSpotify,
	downloadAlbumFromSpotify,
	downloadPlaylistFromSpotify,
} = require('./funcs/spotify')
const {
	getNetworkUploadSpeed,
	getNetworkDownloadSpeed,
	getUsers
} = require('./funcs/dev')

const token = "6414834800:AAGKPj2nrWCl2JFO7gLmXx-sbQ_R7FHzXq8"
const bot = new TelegramBot(token, { polling: true })

console.log('Bot is running...')

// help
bot.onText(/\/help/, (msg) => {
	const chatId = msg.chat.id
	const firstName = msg.from.first_name
	text = {
      "reply_markup": {
        "inline_keyboard": [
          [
            {
              text: "Back to Menu",
              callback_data: "menu",
            }
          ],
          [
            {
              text: "Close",
              callback_data: "Close",
            }
          ],
          ]
    },
    parse_mode: 'HTML'
};

	const response =
		'<b>Hi '+ firstName +',\nWelcome to Instgram Downloady !'+ firstName +'\nSend a valid Instagram or Youtube link to download the content.</b>'
	bot.sendMessage(chatId, response,text)
})

// start
bot.onText(/\/start/, async (msg) => {
	const chatId = msg.chat.id
	const firstName = msg.from.first_name
	const opts = {
      "reply_markup": {
        "inline_keyboard": [
        	[
            {
              text: "Free Stuff",
              callback_data: "freestuff",
            }
          ],

          [
            {
              text: "About",
              callback_data: "about",
            },
            {
              text: "Help",
              callback_data: "help",
            },
          ],
          [
            {
              text: "Close",
              callback_data: "Close",
            }
          ],

          
          ]
    },parse_mode: 'HTML'}
	try{
		const database = client.db("insertDB");
	    const instadb = database.collection("instadb");
	    // create a document to insert
	    const doc = {
	      id: chatId,
	    }
	    const duplicate = await instadb.createIndex({id:1},{"unique":true});
	    const result = await instadb.insertOne(doc);
	    console.log(`A document was inserted with the _id: ${result.insertedId}`);
   	}
   	catch(error){
   		console.error(error);
   	}
	const response =
		'<b>Hi '+ firstName +',\nWelcome to @Easyigbot! \nSend a valid Instagram or Youtube link to download the content. </b>'

	bot.sendMessage(chatId, response,opts)
})

bot.on('callback_query', function onCallbackQuery(callbackQuery) { 
   const action = callbackQuery.data; 
   const msg = callbackQuery.message; 
   console.log(msg)
   const firstName = msg.chat.first_name;
   const chatId = msg.chat.id
   const response =
		'<b>Hi '+ firstName +',\nWelcome to @Easyigbot! \nSend a valid Instagram or Youtube link to download the content. </b>'

   const opts = { 
     chat_id: msg.chat.id, 
     message_id: msg.message_id, 
   }; 
   let text; 
  
   if (action === 'about') { 
     text = {
      "reply_markup": {
        "inline_keyboard": [
          [
            {
              text: "Back to Menu",
              callback_data: "menu",
            }
          ],
          [
            {
              text: "Close",
              callback_data: "Close",
            }
          ],
          ]
    },    parse_mode: 'HTML'
};
   bot.sendMessage(chatId,`<b>You can Download any instagram posts or reels or anything from download from Instagram.
     Support 	 : @clearmindnetwork
Any Video Download : @downloady_bot</b>
    ` ,text); 
   bot.deleteMessage(chatId, msg.message_id);  
   } 
    else if (action === 'help') { 
     text = {
      "reply_markup": {
        "inline_keyboard": [
          [
            {
              text: "Back to Menu",
              callback_data: "menu",
            }
          ],
          [
            {
              text: "Close",
              callback_data: "Close",
            }
          ],
          ]
    },    parse_mode: 'HTML'
};
   bot.sendMessage(chatId,`<b>You can Download any instagram posts or reels or anything from download from Instagram.
     Support 	 : @clearmindnetwork
Any Video Download : @downloady_bot
    </b>` ,text); 
   bot.deleteMessage(chatId, msg.message_id);  
   } 
   else if (action === 'Close') { 
     
   bot.deleteMessage(chatId, msg.message_id);  
   } 
   else if (action === 'menu') { 
     text = {
      "reply_markup": {
        "inline_keyboard": [
        	[
            {
              text: "Free Stuff",
              callback_data: "freestuff",
            }
          ],

          [
            {
              text: "About",
              callback_data: "about",
            },
            {
              text: "Help",
              callback_data: "help",
            },
          ],
          [
            {
              text: "Close",
              callback_data: "Close",
            }
          ],

                    ]
    },    parse_mode: 'HTML'
}; 
   bot.sendMessage(chatId,response ,text); 
   bot.deleteMessage(chatId, msg.message_id);
   } 
   else if (action === 'freestuff') { 
     text = {
      "reply_markup": {
        "inline_keyboard": [
          [
            {
              text: "Back to Menu",
              callback_data: "menu",
            }
          ],
          [
            {
              text: "Close",
              callback_data: "Close",
            }
          ],
          ]
    },    parse_mode: 'HTML'
};
   bot.sendMessage(chatId,`📛 <b> Mainbot : [Downloady bot V9 🚀](@downloady_bot)

 Other Projects

🔥 Free Instagram likes : https://magiclikes.com

🔥 Free Bins : @AllBinsfree

🔥 Free Udemy Courses: : @freeudemynet 

🔥 Free .Edu Temp Mail Weekly New Domain : https://easymail.run

👨‍💻 Developer : (@clearmindnetwork) </b>`,text); 

   bot.deleteMessage(chatId, msg.message_id);
   } 
  


    }); 

// !dev commands
// get network upload speed
bot.onText(/\/upload/, async (msg) => {
	const chatId = msg.chat.id

	// if user is not the developer
	if (String(msg.from.id) !== String("1737577771")) {
		return
	}

	await getNetworkUploadSpeed(bot, chatId)
})

// get network download speed
bot.onText(/\/download/, async (msg) => {
	const chatId = msg.chat.id

	// if user is not the developer
	if (String(msg.from.id) !== String("1737577771")) {
		return
	}

	await getNetworkDownloadSpeed(bot, chatId)
})

bot.onText(/\/users/, async (msg) => {
	const chatId = msg.chat.id

	if (String(msg.from.id) !== String("1737577771")) {
		return
	}
		

	await getUsers(bot, chatId)
})

bot.onText(/\/test/, (msg) => {
	const chatId = msg.chat.id
	const opts = {
      "reply_markup": {
        "inline_keyboard": [
          [
            {
              text: "Channel 1",
              callback_data: "click",
            },
          ],]
    },    parse_mode: 'HTML'
}

	bot.sendMessage(chatId, 'hi',opts);

})
// match youtube link

bot.onText(
	/(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+/,
	async (msg, match) => {
		const chatId = msg.chat.id
		const url = match[0]

		await downloadFromYoutube(bot, chatId, url)
	}
)

// match instagram post link
bot.onText(
	/(https?:\/\/)?(www\.)?(instagram\.com|instagr\.?am)\/p\/.+/,
	(msg, match) => {
		const chatId = msg.chat.id
		const url = match[0]

		downloadFromInstagram(bot, chatId, url)
	}
)

// match instagram story link
bot.onText(
	/(https?:\/\/)?(www\.)?(instagram\.com|instagr\.?am)\/stories\/.+/,
	(msg, match) => {
		const chatId = msg.chat.id
		const url = match[0]

		downloadFromInstagram(bot, chatId, url)
	}
)

// match instagram reel link
bot.onText(
	/(https?:\/\/)?(www\.)?(instagram\.com|instagr\.?am)\/reel\/.+/,
	(msg, match) => {
		const chatId = msg.chat.id
		const url = match[0]
		const messageId = msg.message_id
		console.log(messageId)
					

		downloadFromInstagram(bot, chatId, url, messageId)
	}
)

// match spotify track link
bot.onText(
	/(https?:\/\/)?(www\.)?(open\.spotify\.com|spotify\.?com)\/track\/.+/,
	(msg, match) => {
		const chatId = msg.chat.id
		const url = match[0]

		downloadTrackFromSpotify(bot, chatId, url)
	}
)

// match spotify album link
bot.onText(
	/(https?:\/\/)?(www\.)?(open\.spotify\.com|spotify\.?com)\/album\/.+/,
	(msg, match) => {
		const chatId = msg.chat.id
		const url = match[0]

		downloadAlbumFromSpotify(bot, chatId, url)
	}
)

// match spotify playlist link
bot.onText(
	/(https?:\/\/)?(www\.)?(open\.spotify\.com|spotify\.?com)\/playlist\/.+/,
	(msg, match) => {
		const chatId = msg.chat.id
		const url = match[0]

		downloadPlaylistFromSpotify(bot, chatId, url)
	}
)
