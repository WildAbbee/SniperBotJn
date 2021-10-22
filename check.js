const names = require("./names.js");
const setup = require("./setup.js");

module.exports.check = function(message, bot) {
  if (message.clickEvent === undefined || message.clickEvent.value === undefined) return;

	const joinParty = message.clickEvent.value; // /p join <player name>
	const name = joinParty.split(" ")[2];

  if (names.snipers.includes(name)) return; // don't join if invited by sniper

  // check if user has already requested a check
  for (var i = 0; i < setup.checking.length; i++) {
    if (setup.checking[i].ign === name)
      return;
  }

  // queue a check
  setup.checking.push({ign: name, server: "undefined", found: false, snipers: [], cheaters: []});
  bot.chat("/find " + name); // find requester
  setTimeout(() => {
    // /find all snipers
    for (var i = 0; i < names.snipers.length; i++) { 
      bot.chat("/find " + names.snipers[i]);
    }
    // /find all suspected cheaters
    for (var i = 0; i < setup.cheaters.length; i++) {
      bot.chat("/find " + setup.cheaters[i]);
    }
  }, 300);

  // act on results of check
  setTimeout(() => {
    for (var i = 0; i < setup.checking.length; i++) {
      if (setup.checking[i].ign === name) {
        if (!setup.checking[i].server.includes("Lobby")) {
          var theCheck = setup.checking[i];
          bot.chat("/p join " + name);
        	if (!setup.users.includes(name) && name.length > 1) {
            setup.users.push(name + ", ");
          }
          // tell user if a sniper is in their server
          // messy but it works :shrug:
          setTimeout(() => {
            setup.uses += 1;
            if (theCheck.found) {
              setup.snipersFound += 1;
              bot.chat("/p chat WARNING: Sniper detected in your server. (" + theCheck.server + ")");
              theCheck.snipers.forEach(e => bot.chat("/p chat SNIPER FOUND: " + e));
            } else if (theCheck.cheaters.length > 0) {
              bot.chat("/p chat WARNING: Possible cheater detected in your server. (" + theCheck.server + ")");
              theCheck.cheaters.forEach(e => bot.chat("/p chat CHEATER FOUND: " + e));
            } else {
              bot.chat("/p chat No snipers found! If you get sniped please DM igns to WildAbbee#6794 (" + theCheck.server + ")");
            }
  
            setTimeout(() => {
              bot.chat("/p chat &1");
              bot.chat("/p chat &1");
              bot.chat("/p chat &1");
              bot.chat("/p chat Report cheaters: /p invite StopHacks (may take a while to join party, be patient)");
              bot.chat(setup.creditMsg);
            }, 100);

            // go back to lobby if was warped
            setTimeout(() => {
              bot.chat("/p leave");
              let index = setup.checking.indexOf(theCheck);
              if (index !== undefined) setup.checking.splice(index, 1);
              setTimeout(() => {
                bot.chat("/hub")
                setTimeout(() => {
                  bot.chat("/server bedwars");
                }, 500);
              }, 500);
            }, 1000);
          }, 500);
        } else {
          // bot in lobby, ignore this check
          let index = setup.checking.indexOf(theCheck);
      		if (index !== undefined) setup.checking.splice(index, 1);
        }
      }
    }
  }, 2000);
}
