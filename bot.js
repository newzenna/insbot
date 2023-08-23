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

const token = "6365938204:AAHAXusSAdHr2Qp86fp4nG_WCtoTmyzl4QM"
const bot = new TelegramBot(token, { polling: true })

console.log('Bot is running...')

// help
bot.onText(/\/help/, (msg) => {
	const chatId = msg.chat.id
	const firstName = msg.from.first_name

	const response =
		'Hi '+ firstName +',\nWelcome to Instgram Downloady!\nSend a valid Instagram or Youtube link to download the content.\n /help'

	bot.sendMessage(chatId, response)
})

// start
bot.onText(/\/start/, async (msg) => {
	const chatId = msg.chat.id
	const firstName = msg.from.first_name
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
		'Hi '+ firstName +',\nWelcome to instagram Downloady! \nSend a valid Instagram or Youtube link to download the content.\n /help'

	bot.sendMessage(chatId, response)
})

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

		downloadFromInstagram(bot, chatId, url)
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

