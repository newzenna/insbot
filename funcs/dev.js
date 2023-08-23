const NetworkSpeed = require('network-speed')
const testNetworkSpeed = new NetworkSpeed()
const { MongoClient } = require('mongodb')

const uri = "mongodb+srv://insbot:GGRfXfWb0QR5VYvf@insbot.9qdnvwd.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri);

async function getNetworkDownloadSpeed(bot, chatId) {
	console.log('Calculating Download Speed...')
	bot.sendMessage(chatId, 'Calculating Download Speed...').catch((err) => {
		console.log(err)
	})
	const baseUrl = 'https://eu.httpbin.org/stream-bytes/100000'
	const fileSizeInBytes = 100000
	const speed = await testNetworkSpeed.checkDownloadSpeed(
		baseUrl,
		fileSizeInBytes
	)
	bot.sendMessage(chatId, `Download Speed: ${speed.mbps} Mbps`).catch(
		(err) => {
			console.log(err)
		}
	)
	console.log(`Download Speed: ${speed.mbps} Mbps`)
}

async function getNetworkUploadSpeed(bot, chatId) {
	console.log('Calculating Upload Speed...')
	bot.sendMessage(chatId, 'Calculating Upload Speed...').catch((err) => {
		console.log(err)
	})
	const options = {
		hostname: 'www.google.com',
		port: 80,
		path: '/catchers/544b09b4599c1d0200000289',
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
	}
	const fileSizeInBytes = 2000000
	const speed = await testNetworkSpeed.checkUploadSpeed(
		options,
		fileSizeInBytes
	)
	bot.sendMessage(chatId, `Upload Speed: ${speed.mbps} Mbps`).catch((err) => {
		console.log(err)
	})
	console.log(`Upload Speed: ${speed.mbps} Mbps`)
}

async function getUsers(bot, chatId) {
	console.log('Fetching Users')
	bot.sendMessage(chatId, 'Fetching Users').catch((err) => {
		console.log(err)
	})
	try{
		const database = client.db("insertDB");
	    const instadb = database.collection("instadb");
	    // create a document to insert
	    const total_users = await instadb.count()
	    bot.sendMessage(chatId, `Users: ${total_users}`).catch((err) => {
		console.log(err)
		})
	    console.log("Total")
   	}
   	catch(error){
   		console.error(error);
   	}
}

module.exports = {
	getNetworkDownloadSpeed,
	getNetworkUploadSpeed,
	getUsers
}
