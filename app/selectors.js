module.exports = {
  username: '#gigya-loginID-60062076330815260',
  password: '[placeholder="Password *"]',
  submit: 'input[class="gigya-input-submit"][data-screenset-roles="instance"]',
  season: '.nameValue.first.last a', // Most recent season
  rosterPage: '.teamName.teamId-10',
  desiredWeek: 'a.w-14',
  teamName: '.selecter-selected .label',
  playerNameAndInfo: ['tbody td.playerNameAndInfo a.playerCard.playerName.playerNameFull', 'tbody td.playerNameAndInfo em'],
  playerTotalPoints: 'tbody td.stat.statTotal.numeric.last'
}
