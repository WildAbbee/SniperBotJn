const check = require("./check.js");
const find = require("./find.js");
const mineflayer = require('mineflayer');
const setup = require("./setup.js");

module.exports.bindEvents = function(bot, password) {
	bot.on("login", () => {
  		if (setup.lastLoginTime + 10000 > getMillis()) return;
  		setup.lastLoginTime = getMillis();
  		console.log("DEBUG: Logged in.");
  		setTimeout(() => {
    		bot.chat("/login " + password);
    		setTimeout(() => {
      			bot.chat("/server bedwars");
    		}, 1000);
  		}, 1000);
	});

	bot.on("message", (message) => {
  		const msg = message + "";
  		console.log(msg);

  		var splitMsg = msg.split(" ");

  		// party invite
  		if (splitMsg[0] === "Party" && msg.includes("invite")) {
  			check.check(message, bot);
  			return;
  		}

  		// find result
  		if (splitMsg[0] === "JartexNetwork" && msg.includes("online") && !msg.includes("not online") && splitMsg.length === 8) {
  			find.find(splitMsg);
  		}
    });

    bot.on("kicked", (reason) => {
    	console.log("kick reason: " + reason);
    });

	bot.on("end", () => {
		if (setup.lastEndTime + 9000 < getMillis()) return; // other bot already executed this
  		console.log("Kicked");

  		save();
  		setTimeout(() => {
  			setup.end();
  			setTimeout(() => { 
  				setup.setup();
  			}, 10500);
  		}, 500);
	});

}

function getMillis() {
	return new Date().getTime();
}