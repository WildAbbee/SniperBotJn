const names = require("./names.js");
const setup = require("./setup.js");

module.exports.find = function(splitMsg) {
    // find
    const name = splitMsg[2];
    const server = splitMsg[7].replace("(", "").replace(")", "").replace(".", "");

    // first check if its a player that requested a check
    for (var i = 0; i < setup.checking.length; i++) {
      if (setup.checking[i].ign === name) {
        // player requested check
        setup.checking[i].server = server;
        return;
      }
    }

    // its a sniper check
    for (var i = 0; i < setup.checking.length; i++) {
      /*console.log("found: " + checking[i].found);
      console.log("checkingServer: " + checking[i].server);
      console.log("server: " + server);*/
      if (setup.checking[i].server !== "undefined" && setup.checking[i].server === server) {
        // sniper
        if (names.snipers.includes(name)) {
          setup.checking[i].found = true;
          setup.checking[i].snipers.push(name);
        } 
        // cheater
        else {
          setup.checking[i].cheaters.push(name);
        }
      }
    }
  
}
