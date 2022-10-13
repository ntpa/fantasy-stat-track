module.exports = {
  username: 'input[type="email"]',
  password: 'input[type="password"]',
  submit: 'div[class="css-1dbjc4n r-1yzf0co"] > div[role="button"]',
  season: '.nameValue.first.last a', // Most recent season
  myLeagues: 'span > a[href="/myleagues"]',
  rosterPage: '.teamName.teamId-10',
  // desiredWeek - the week number at the end of the url must be the current week, in order for the selector 
  // to be valid. For example, if the current week is week 4, and the below url specifies week 3. An error will 
  // be thrown during a function call teamRosterPage in navigate.js.
  desiredWeek: 'a[href="/league/6255172/team/10?statCategory=stats&statSeason=2022&statType=seasonStats&week=5"]',
  teamName: '.selecter-selected > .label',
  playerNameAndInfo: ['tbody td.playerNameAndInfo a.playerCard.playerName.playerNameFull', 'tbody td.playerNameAndInfo em'],
  playerTotalPoints: 'tbody td.stat.statTotal.numeric.last'
}
