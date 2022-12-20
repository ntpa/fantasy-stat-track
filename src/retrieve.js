var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
class Player {
    constructor(name, position, pointsTotal, leagueTeam) {
        this.name = name;
        this.position = position;
        this.pointsTotal = pointsTotal;
        this.leagueTeam = leagueTeam;
    }
}
function getTeamID(teamLink) {
    return __awaiter(this, void 0, void 0, function* () {
        const regExpOne = '/team/';
        const regExpTwo = '?';
        return teamLink.slice(teamLink.indexOf(regExpOne), teamLink.indexOf(regExpTwo));
    });
}
function getLinks(page, selector) {
    return __awaiter(this, void 0, void 0, function* () {
        const teamLinks = [];
        yield page.waitForSelector(selector);
        yield page.$eval(selector, (span) => {
            return span.children.length;
        }).then((numberOfTeams) => {
            const templateLink = page.url();
            for (let i = 1; i < numberOfTeams + 1; i++) {
                getTeamID(templateLink).then((teamID) => {
                    const teamLink = templateLink.replace(teamID, `/team/${i}?`);
                    teamLinks.push(teamLink.substring(0, teamLink.length - 1));
                });
            }
        });
        return teamLinks;
    });
}
function getNames(page, selector) {
    return page.$$eval(selector, (table) => {
        const array = [];
        for (let i = 0; i < table.length; i++) {
            array.push(table[i].textContent);
        }
        return array;
    });
}
function getPositions(page, selector) {
    return page.$$eval(selector, (table) => {
        const array = [];
        for (let i = 0; i < table.length; i++) {
            const positionName = table[i].textContent;
            if (positionName !== null) {
                if (positionName.length === 3) {
                    array.push(positionName);
                }
                else {
                    array.push(positionName.slice(0, 2));
                }
            }
        }
        return array;
    });
}
function getTotalPoints(page, selector) {
    return page.$$eval(selector, (table) => {
        const array = [];
        for (let i = 0; i < table.length; i++) {
            console.log(table[i].textContent);
            array.push(table[i].textContent);
        }
        return array;
    });
}
function getTeamName(page, selector) {
    return page.$eval(selector, (span) => span.textContent);
}
function getPlayers(page, selectors, teamLinks, index) {
    return __awaiter(this, void 0, void 0, function* () {
        const players = [];
        yield page.goto(teamLinks[index], { waitUntil: 'domcontentloaded' });
        yield Promise.all([
            page.waitForNavigation({ waitUntil: 'networkidle0' }),
            page.click(selectors.desiredWeek)
        ]);
        yield Promise.all([getNames(page, selectors.playerNameAndInfo[0]),
            getPositions(page, selectors.playerNameAndInfo[1]),
            getTotalPoints(page, selectors.playerTotalPoints),
            getTeamName(page, selectors.teamName)
        ]).then((results) => {
            var _a, _b, _c, _d;
            const length = results[0].length;
            for (let i = 0; i < length; i++) {
                players.push(new Player((_a = results[0][i]) !== null && _a !== void 0 ? _a : "Player not found", (_b = results[1][i]) !== null && _b !== void 0 ? _b : "Position not found", (_c = results[2][i]) !== null && _c !== void 0 ? _c : "Points total not found", (_d = results[3]) !== null && _d !== void 0 ? _d : "League team not found"));
            }
        });
        return players;
    });
}
function getTeamRecord(page, selectors) {
    return __awaiter(this, void 0, void 0, function* () {
        yield page.waitForSelector(selectors.teamRank);
        return page.$eval(selectors.teamRecord, (span) => span.textContent);
    });
}
function getTeamRank(page, selector) {
    return __awaiter(this, void 0, void 0, function* () {
        yield page.waitForSelector(selector);
        return page.$eval(selector, (span) => span.textContent);
    });
}
export { Player, getNames, getPositions, getTotalPoints, getTeamName, getLinks, getPlayers, getTeamRecord, getTeamRank };
//# sourceMappingURL=retrieve.js.map