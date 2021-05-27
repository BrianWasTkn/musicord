import mkdir from 'make-dir';

const dir = await mkdir('something');
console.log(dir);

// import 'dotenv/config';
// import { Client, Intents, MessageAttachment } from 'discord.js';
// import fetch from 'node-fetch';

// const bot = new Client({ intents: Intents.ALL });
// bot.on('ready', () => console.log('big daddy im ready'));
// bot.on('message', async msg => {
//   if (msg.content === 'plx meme') {
//     const abandon = await fetch(`https://dankmemer.services/changemymind`, {
//       body: JSON.stringify({ text: 'lol imagine being lava' }),
//       method: 'POST',
//       headers: {
//         Authorization: process.env.MEME_TOKEN,
//         'Content-Type': 'application/json'
//       }
//     }).then(d => d.buffer());

//     console.log(abandon);

//     const n = new MessageAttachment(abandon, { name: 'abandon' });
//     await msg.channel.send(n);
//   }

// })
// await bot.login();

// // import 'dotenv/config';
// // import { Client, Intents } from 'discord.js';
// // import { Manager } from 'erela.js';

// // // Initiate both main classes
// // const client = new Client({ intents: Intents.ALL });

// // // Define some options for the node
// // const nodes = [
// //   {
// //     host: "your mom",
// //     password: "some password",
// //     port: 2333,
// //   }
// // ];

// // // Assign Manager to the client variable
// // client.manager = new Manager({
// //   // The nodes to connect to, optional if using default lavalink options
// //   nodes,
// //   // Method to send voice data to Discord
// //   send: (id, payload) => {
// //     const guild = client.guilds.cache.get(id);
// //     // NOTE: FOR ERIS YOU NEED JSON.stringify() THE PAYLOAD
// //     if (guild) guild.shard.send(payload);
// //   }
// // });

// // // Emitted whenever a node connects
// // client.manager.on("nodeConnect", node => {
// //     console.log(`Node "${node.options.identifier}" connected.`)
// // })

// // // Emitted whenever a node encountered an error
// // client.manager.on("nodeError", (node, error) => {
// //     console.log(`Node "${node.options.identifier}" encountered an error: ${error.message}.`)
// // })

// // // Listen for when the client becomes ready
// // client.once("ready", () => {
// //   // Initiates the manager and connects to all the nodes
// //   client.manager.init(client.user.id);
// //   console.log(`Logged in as ${client.user.tag}`);
// // });

// // // THIS IS REQUIRED. Send raw events to Erela.js
// // client.on("raw", d => client.manager.updateVoiceState(d));

// // // Finally login at the END of your code
// // await client.login(process.env.DISCORD_TOKEN);