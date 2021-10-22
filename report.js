const names = require("./names.js");
const setup = require("./setup.js");

// player invites stophacks to their party, this function checks some stuff like if the person inviting the bot is a sniper, 
// etc, then it basically says "hey complete this report whenever ur not in a party"
module.exports.report = function(message) {
    // report
    if (message.clickEvent === undefined || message.clickEvent.value === undefined) return;

    const joinParty = message.clickEvent.value; // /p join <player name>
    const name = joinParty.split(" ")[2];
    console.log("DEBUG 1");

    if (names.snipers.includes(name)) return; // ignore snipers reporting

    var largest = 0;
    setup.queuedReports.forEach(e => {
      if (e.ign === name) return; // already queued a report
      if (e.number > largest) largest = e.number;
    });
    largest += 1;

    console.log("DEBUG 2 " + name);

    setup.queuedReports.push({ign: name, number: largest});
}

// if user disbands their party before bot has a chance to join that could cause some errors, test?

// once the bot has time (isn't handling another report) it joins the party and sends some help messages
module.exports.actOnReport = function(bot) {
  setup.lastReportTime = getMillis();
  var report = undefined;
  setup.queuedReports.forEach(e => {
    if (report === undefined || e.number < report.number) {
      report = e;
    }
  });
  if (report === undefined) {
    setup.lastReportTime = 0; // available to handle another report
    return; // no reports
  }

  bot.chat("/p join " + report.ign);
  let index = setup.queuedReports.indexOf(report);
  if (index !== undefined) setup.queuedReports.splice(index, 1);

  setTimeout(() => {
    bot.chat("/p chat Please report players using ?report IGN");
  }, 200);

  setTimeout(() => {
    bot.chat("/p chat Do not include a reason, report multiple players separately.");
  }, 400);

  setTimeout(() => {
    bot.chat("/p chat This bot will leave the party in 15 seconds.");
  }, 600);

  setTimeout(() => {
    bot.chat("/p chat Check if you are being sniped: /p invite AntiSnipe");
  }, 800);

  setTimeout(() => {
    bot.chat(setup.creditMsg);
  }, 1000);

  setTimeout(() => {
    if (bot === undefined) return;
    bot.chat("/p leave");
  }, 15000);
}

// once a player in that party types ?report <ign> this function is called, and it does some checks to make sure the correct command format is used and then
// it /find's the player who was reported
module.exports.receivedReport = function(splitMsg, bot) {
  // Party ▏ AntiSnipe2: ?report WildAbbee
  console.log("DEBUG REPORT");
  for (var i = 0; i < splitMsg.length; i++) {
    if (splitMsg[i] === "?report" && splitMsg.length > i + 1) {
      var reported = splitMsg[i + 1];
      //setup.cheaters.push(reported);
      console.log("DEBUG FIND " + reported);
      bot.chat("/find " + reported);
      return;
    }
  }
}

// once the /find gives a msg this function is called and it checks if /find said the user is not online, if it does then it says report failed, if it is online, it says report successful
// and adds the username to the list of cheaters
module.exports.finallyReport = function(splitMsg, validPlayer, bot) {
    // find result
    const name = splitMsg[2];
    if (name === "IGN") return;

    if (!validPlayer) {
      bot.chat("/p chat " + name + " is not online, report failed. (maybe a nick?)");
      return;
    }

    bot.chat("/p chat You have reported " + name);
    if (!setup.cheaters.includes(name)) setup.cheaters.push(name);
    console.log(setup.cheaters);
}

function getMillis() {
  return new Date().getTime();
}