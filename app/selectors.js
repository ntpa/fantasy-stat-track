module.exports = {
  username: 'input[type="email"]',
  password: 'input[type="password"]',
  submit: 'div[class="css-1dbjc4n r-1yzf0co"] > div[role="button"]',
  season: '.nameValue.first.last a', // Most recent season
  rosterPage: '.teamName.teamId-10',
  desiredWeek: 'a[href="/league/6255172/team/10?statCategory=stats&statSeason=2022&statType=seasonStats&week=3"]',
  teamName: '.selecter-selected .label',
  playerNameAndInfo: ['tbody td.playerNameAndInfo a.playerCard.playerName.playerNameFull', 'tbody td.playerNameAndInfo em'],
  playerTotalPoints: 'tbody td.stat.statTotal.numeric.last'
}
