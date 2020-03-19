module.exports = {
    run: async(client, message, args) => {
        if(!message.member.hasPermission('KICK_MEMBERS'))
                message.channel.send("You don't have permission to use that command.");
        else {
            let member = message.guild.members.cache.get(args);
            if(member) {
                try {
                    await member.kick();
                    console.log('A member was kicked.');
                }
                catch(err) {
                    console.log(err);
                }
            }
        }
    },
    aliases: [],
    description: 'Kicks a user'
}