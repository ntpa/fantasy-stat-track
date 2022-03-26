const mongoose = require('mongoose')

const playerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  position: { type: String, required: true },
  pointsTotal: { type: Number, required: true },
  leagueTeam: { type: String, required: true } // Fantasy team name NOT NFL team name
})

// Add function to the "statics" object of our player schema
// Add a player to the database. Should there be points minimum ? 
playerSchema.statics.addPlayer = function(playerInstance) {
return this.create({
  name: playerInstance.name,
  position: playerInstance.name,
  pointsTotal: playerInstance.pointsTotal,
  leagueTeam: playerInstance.leagueTeam
  })

}

// Check if player is in database
playerSchema.statics.playerFound = function (playerName) {
  return this.exists({ name: `${playerName}` })

}
module.exports = mongoose.model('Player', playerSchema)
