var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import puppeteer from 'puppeteer';
import * as fs from 'node:fs';
import { mkdir } from 'node:fs/promises';
import * as path from 'node:path/posix';
import * as readline from 'node:readline/promises';
import { nflUsername, nflPassword } from './creds.js';
import { Selectors } from './selectors.js';
import * as retrieve from './retrieve.js';
import * as navigate from './navigate.js';
(() => __awaiter(void 0, void 0, void 0, function* () {
    'use strict';
    let outputDirectory = 'output';
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    if (fs.existsSync(outputDirectory)) {
        console.log(outputDirectory, 'directory already exists.');
        const newDirectory = yield rl.question("Please give name of the new directory(without spaces) for the program to use: ");
        try {
            yield mkdir(newDirectory, { recursive: false });
        }
        catch (err) {
            console.log(newDirectory, 'directory already exists. Please run again, and choose a different name.');
            process.exit(1);
        }
        console.log(`created directory: ${newDirectory}`);
        outputDirectory = newDirectory;
    }
    rl.close();
    const today = new Date().toISOString().slice(0, 10);
    const separator = '_';
    const filePlayerOutput = path.resolve(outputDirectory, './' + today.concat(separator, 'playerOutput.json'));
    const fileStandingOutput = path.resolve(outputDirectory, './' + today.concat(separator, 'standingOutput.json'));
    const browser = yield puppeteer.launch({ headless: false });
    const page = yield browser.newPage();
    page.setDefaultTimeout(20000);
    const leaguePlayers = [];
    try {
        yield navigate.goToCurrentSeasonRoster(page, Selectors, { nflUsername, nflPassword });
        const teamLinks = yield retrieve.getLinks(page, Selectors.links);
        console.log(teamLinks);
        for (let i = 0; i < teamLinks.length; i++) {
            const teamPlayers = yield retrieve.getPlayers(page, Selectors, teamLinks, i);
            for (const player of teamPlayers) {
                leaguePlayers.push(player);
            }
            const teamRecord = yield retrieve.getTeamRecord(page, Selectors);
            const teamRank = yield retrieve.getTeamRank(page, Selectors.teamRank);
            const teamName = teamPlayers[0].leagueTeam;
            fs.appendFile(fileStandingOutput, `${teamRank}\t${teamName}\t${teamRecord}\n`, (err) => {
                if (err)
                    throw err;
            });
        }
        fs.appendFile(filePlayerOutput, JSON.stringify(leaguePlayers, null, 2), (err) => {
            if (err)
                throw err;
        });
    }
    catch (error) {
        console.log('Failed to retrieve league players.\n');
        console.log(error);
        fs.rm(outputDirectory, { recursive: true, force: true }, (err) => {
            if (err)
                throw err;
            console.log(`Removed directory: ${outputDirectory}`);
        });
    }
    finally {
        browser.close();
    }
}))();
//# sourceMappingURL=app.js.map