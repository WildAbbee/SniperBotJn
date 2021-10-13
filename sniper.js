const mineflayer = require('mineflayer');

var snipers = ["pablobreadmc", "swkinq", "LimitedElimz", "Poi", 
"pwoii", "Prann__", "Kaspariuxt", "Salti", "boys_like_boys", "Adnthunder", 
"Vonts", "fluffon", "AmazingTrish", "Skyneh", "Skynie", "Arfanisagrape", "_zyrofam"];
var checking = [];

var alreadyCalled = false;

var bot = mineflayer.createBot({
  host: "jartex.fun",
  port: 25565,
  username: "AntiSnipe"
});
bindEvents(bot);

function bindEvents(bot) {
bot.on("login", () => {
  if (alreadyCalled) return;
  alreadyCalled = true;
  console.log("Logged in.");
  setTimeout(() => {
    bot.chat("/login nosnipe");
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

    if (message.clickEvent !== undefined && message.clickEvent.value !== undefined) {

      const joinParty = message.clickEvent.value;
      const name = joinParty.split(" ")[2];

      // check if user has already requested a check
      for (var i = 0; i < checking.length; i++) {
        if (checking[i].ign === name) {
          bot.chat("/p join " + name);
          setTimeout(() => {
            bot.chat("/p chat Please wait until your previous request has completed.");
            setTimeout(() => {
              bot.chat("/p leave");
            }, 1000);
          }, 1000);
          return;
        }
      }

      // queue a check
      checking.push({ign: name, server: "undefined", found: false});
      bot.chat("/find " + name);
      setTimeout(() => {
        for (var i = 0; i < snipers.length; i++) { 
          
            bot.chat("/find " + snipers[i]);
            console.log("FINDING: " + snipers[i]);
          
        }
      }, 2000);

      console.log(checking);

      // act on results of check
      setTimeout(() => {
        console.log("acting");
        for (var i = 0; i < checking.length; i++) {
          if (checking[i].ign === name) {

            bot.chat("/p join " + name);
            completeActing(i);
            
          }
        }
      }, 2000 + snipers.length * 100);
    }
  }

  // find
  if (splitMsg[0] === "JartexNetwork" && msg.includes("online") && !msg.includes("not online") && splitMsg.length === 8) {
    const name = splitMsg[2];
    const server = splitMsg[7].replace("(", "").replace(")", "").replace(".", "");

    // first check if its a player that requested a check
    for (var i = 0; i < checking.length; i++) {
      if (checking[i].ign === name) {
        // player requested check
        checking[i].server = server;
        return;
      }
    }

    console.log("DEBUG 1");

    // its a sniper check
    for (var i = 0; i < checking.length; i++) {
      console.log("found: " + checking[i].found);
      console.log("checkingServer: " + checking[i].server);
      console.log("server: " + server);
      if (!checking[i].found && checking[i].server !== "undefined" && checking[i].server === server) {
        // sniper in their server
        checking[i].found = true;
      }
    }
  }
});

bot.on("end", () => {
  console.log("Kicked");
  setTimeout(() => {
  bot = mineflayer.createBot({
    host: "jartex.fun",
    port: 25565,
    username: "AntiSnipe"
  });
  bindEvents(bot);
}, 10000);
});

}
function completeActing(i) {
  setTimeout(() => {
    if (checking[i].found) {
      bot.chat("/p chat WARNING: Sniper detected in your server.");
    } else {
      bot.chat("/p chat No snipers found! If you get sniped please DM igns to WildAbbee#6794");
    }

    setTimeout(() => {
      bot.chat("/p leave");
      console.log("CHECKING LENGTH: " + checking.length);
      checking.splice(i, 1);
      console.log("CHECKING LENGTH AFTER REMOVE: " + checking.length);
    }, 500);
  }, 1000);
}

/*
Party ▏ Diamond WildAbbee invited you to join his/her party!
Party ▏ CLICK HERE to accept the invite.

JartexNetwork » WildAbbee is online at BedWars (BW3-143).
*/