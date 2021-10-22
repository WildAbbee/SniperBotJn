const mineflayer = require('mineflayer');
const fs = require('fs');
const main_bot = require("./main_bot.js");
const antihacks = require("./antihacks.js");
const report = require("./report.js");

/*
Dear past abby,

		Fuck you.

Sincerly, future abby.
*/

// TODO: Move getMillis, save, etc into a utils file

module.exports.setup = function() {
	// init variables
	module.exports.cheaters = [];
	module.exports.checking = [];
	module.exports.lastLoginTime = 0;
	module.exports.lastLoginTimeAH = 0;
	module.exports.lastEndTime = 0;
	module.exports.reports = [];
	module.exports.queuedReports = [];
	module.exports.creditMsg = "/p chat AntiSnipe v1.1 by WildAbbee#6794";
	module.exports.lastReportTime = 0;

	// read files
	// data.txt
	fs.readFile('data.txt', 'utf8' , (err, data) => {
  		if (err) {
    		console.error(err)
    		return
  		}
  		console.log(data)

  		lines = data.split("\n");
  		module.exports.runningFor = parseInt(lines[0].replace("Minutes Running: ", "")) + 1;
  		module.exports.uses = parseInt(lines[1].replace("Uses: ", ""));
  		module.exports.snipersFound = parseInt(lines[2].replace("Snipers Found: ", ""));
	});

	// users.txt
	fs.readFile('users.txt', 'utf8' , (err, data) => {
  		if (err) {
    		console.error(err)
    		return
  		}
  		module.exports.users = data.split(", ");
  		if (data.length === 0) {
  			module.exports.users = [];
  		}
  		console.log("Used by " + module.exports.users.length + " users.");
	});//

	// create the bot
	module.exports.bot = mineflayer.createBot({
  		host: "jartex.fun",
  		port: 25565,
  		username: "AntiSnipe"
	});

	main_bot.bindEvents(module.exports.bot, "nosnipe");

	module.exports.antihackspw = "nocheat";
	module.exports.ah_bot = mineflayer.createBot({
  		host: "jartex.fun",
  		port: 25565,
  		username: "StopHacks"
	});

	antihacks.bindEvents(module.exports.ah_bot, "nocheat");
}

module.exports.end = function() {
	if (module.exports.bot !== undefined) module.exports.bot.end();
	if (module.exports.ah_bot !== undefined) module.exports.ah_bot.end();
}

module.exports.save = function() {
	fs.writeFile("data.txt", "Minutes Running: " + module.exports.runningFor + "\nUses: " + module.exports.uses + "\nSnipers Found: " + module.exports.snipersFound, function(err) {
    	if(err) {
    	    return console.log(err);
    	}
	}); 

	let usersString = "";
	for (var i = 0; i < module.exports.users.length; i++) {
		usersString += module.exports.users[i] + ", ";
	}
	fs.writeFile("users.txt", usersString, function(err) {
		if (err) {
			return console.log(err);
		}
	});
}

function firstLaunch() {
	module.exports.setup();

	// data management
	setInterval(function() {
		module.exports.runningFor += 1;
		console.log("Minutes Running: " + module.exports.runningFor + ", Uses: " + module.exports.uses + ", Snipers Found: " + module.exports.snipersFound);
		console.log("Used by " + module.exports.users.length + " users.");
	}, 1000 * 60);

	// backlog of reports
	setInterval(function() {
		if (module.exports.queuedReports.length > 0 && module.exports.lastReportTime + 16000 < getMillis()) {
			report.actOnReport(module.exports.ah_bot);
		}
	}, 2000);
}

function getMillis() {
	return new Date().getTime();
}

firstLaunch();