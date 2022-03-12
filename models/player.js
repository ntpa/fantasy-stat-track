const mongoose = require('mongoose')

const playerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  position: { type: String, required: true },
  pointsTotal: { type: Number, required: true },
  leagueTeam: { type: String, required: true } // Fantasy team name NOT NFL team name
})

module.exports = mongoose.model('Player', playerSchema)
