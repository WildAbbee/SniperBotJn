const mineflayer = require('mineflayer');
const setup = require("./setup.js");
const report = require("./report.js");

module.exports.bindEvents = function(bot, password) {

	bot.on("login", () => {
  		if (setup.lastLoginTimeAH + 10000 > getMillis()) return;
  		setup.lastLoginTimeAH = getMillis();
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
  		//console.log(msg);

  		var splitMsg = msg.split(" ");

  		// party invite
  		if (splitMsg[0] === "Party" && msg.includes("invite")) {
  			report.report(message, bot);
  			return;
  		}

  		// party msg
  		else if (splitMsg[0] === "Party" && msg.includes("report") && !msg.includes("AntiHacks")) {
  			report.receivedReport(splitMsg, bot);
  			return;
  		}

  		// find msg
  		else if (msg.includes("online") && !msg.includes("[") && !msg.includes("Party")) {
  			report.finallyReport(splitMsg, msg.includes("is online"), bot);
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