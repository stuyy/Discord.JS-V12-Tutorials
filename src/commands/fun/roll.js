const { rollDice } = require('../../utils/dicefn');

module.exports = {
    run: async(client, message) => {
        message.reply("rolled a " + rollDice());
    },
    aliases: ['dice', 'rolldice'],
    description: 'Rolls the dice'
}