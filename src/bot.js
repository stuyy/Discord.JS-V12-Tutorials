require('dotenv').config();
const discord = require('discord.js');
const client = new discord.Client();
const fs = require('fs').promises;
const path = require('path');
const { checkCommandModule, checkProperties } = require('./utils/validate');
const tableConfig = require('./utils/tableConfig');
const { createStream, table } = require('table');
const c = require('ansi-colors');
const commandStatus = [
    [`${c.bold('Command')}`, `${c.bold('Status')}`, `${c.bold('Description')}`]
];
const PREFIX = process.env.PREFIX;
client.login(process.env.BOT_TOKEN);
client.commands = new Map();
client.on('ready', () => {
    console.log(`${client.user.tag} has logged in.`);
    let stream = createStream(tableConfig);
    let i = 0;
    let fn = setInterval(() => {
        if(i === commandStatus.length)
            clearInterval(fn);
        else {
            stream.write(commandStatus[i]);
            i++;
        }
    }, 250)
});

client.on('message', async function(message) {
    if(message.author.bot) return;
    if(!message.content.startsWith(PREFIX)) return;
    let cmdName = message.content.substring(message.content.indexOf(PREFIX)+1).split(new RegExp(/\s+/)).shift();
    let argsToParse = message.content.substring(message.content.indexOf(' ')+1);
    if(client.commands.get(cmdName))
        client.commands.get(cmdName)(client, message, argsToParse);
    else
        console.log("Command does not exist.");
});

(async function registerCommands(dir = 'commands') {
    // Read the directory/file.
    let files = await fs.readdir(path.join(__dirname, dir));
    // Loop through each file.
    for(let file of files) {
        let stat = await fs.lstat(path.join(__dirname, dir, file));
        if(stat.isDirectory()) // If file is a directory, recursive call recurDir
            registerCommands(path.join(dir, file));
        else {
            // Check if file is a .js file.
            if(file.endsWith(".js")) {
                let cmdName = file.substring(0, file.indexOf(".js"));
                try {
                    let cmdModule = require(path.join(__dirname, dir, file));
                    if(checkCommandModule(cmdName, cmdModule)) {
                        if(checkProperties(cmdName, cmdModule)) {
                            let { aliases } = cmdModule;
                            client.commands.set(cmdName, cmdModule.run);
                            if(aliases.length !== 0)
                                aliases.forEach(alias => client.commands.set(alias, cmdModule.run));
                            commandStatus.push(
                                [`${c.cyan(`${cmdName}`)}`, `${c.bgGreenBright('Success')}`, `${cmdModule.description}`]
                            )
                        }
                    }
                }
                catch(err) {
                    console.log(err);
                    commandStatus.push(
                        [`${c.white(`${cmdName}`)}`, `${c.bgRedBright('Failed')}`, '']
                    );
                }
            }
        }
    }
})();
