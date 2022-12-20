var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const FANTASY_SITE_URL = 'https://fantasy.nfl.com';
const LOGIN_URL = 'https://fantasy.nfl.com/account/sign-in?s=fantasy&returnTo=http%3A%2F%2Ffantasy.nfl.com%2Fmyleagues';
function fantasyLoginPage(page, selectors, creds) {
    return __awaiter(this, void 0, void 0, function* () {
        yield page.goto(LOGIN_URL, { waitUntil: 'load' });
        yield page.waitForSelector(selectors.username);
        yield page.type(selectors.username, creds.nflUsername, { delay: 20 });
        yield page.type(selectors.password, creds.nflPassword, { delay: 20 });
        return Promise.all([page.waitForNavigation(), page.click(selectors.submitButton)]);
    });
}
function teamRosterPage(page, selectors) {
    return __awaiter(this, void 0, void 0, function* () {
        yield page.waitForSelector(selectors.myLeagues);
        yield Promise.all([
            page.waitForNavigation(),
            page.click(selectors.myLeagues)
        ]);
        yield page.waitForSelector(selectors.rosterPage);
        const leagueLink = yield page.$eval(selectors.rosterPage, (a) => a.getAttribute('href'));
        yield page.goto(`${FANTASY_SITE_URL}${leagueLink}`, { waitUntil: 'networkidle0' });
    });
}
function goToCurrentSeasonRoster(page, selectors, creds) {
    return __awaiter(this, void 0, void 0, function* () {
        yield fantasyLoginPage(page, selectors, creds);
        yield teamRosterPage(page, selectors);
    });
}
export { goToCurrentSeasonRoster };
//# sourceMappingURL=navigate.js.map