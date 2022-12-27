const Selectors = {
    username: 'input[type="email"]',
    password: 'input[type="password"]',
    submitButton: 'div[class="css-1dbjc4n r-1yzf0co"] > div[role="button"]',
    season: '.nameValue.first.last a', // Most recent season
    myLeagues: 'span > a[href="/myleagues"]',
    rosterPage: '.teamName.teamId-10',
    links: 'div .selecter-options',
  // desiredWeek - the week number at the end of the url must be the current week, in order for the selector 
  // to be valid. For example, if the current week is week 4, and the below url specifies week 3. An error will 
  // be thrown during a function call teamRosterPage in navigate.js.
    desiredWeek: 'li#st2022 > a',
    teamName: '.selecter-selected .label',
    playerNameAndInfo: ['tbody td.playerNameAndInfo a.playerCard.playerName.playerNameFull', 'tbody td.playerNameAndInfo em'],
    playerTotalPoints: 'tbody td.stat.statTotal.numeric.last',
    teamRecord: '.teamRecord',
    teamRank: 'ul.teamStats .first strong'
};

export { Selectors }
