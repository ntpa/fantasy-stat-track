# Fantasy Stat Track    
    
Track statistics from your NFL Fanstasy League  
    
 The application's goal is to be a tool to help make trade and roster decisions for people who use NFL Fantasy. Hopefully the application will help users determine future draft, trade, and waiver-wire transaction for current and future seasons.
    
##### Dependencies:    
- NodeJS: Version 17.0.0 >=    
    - Puppeteer: Version 13.4 >=    
##### Requirements:    
    
- NFL Fantasy Account with at least one season.    
    
### Installation     
    
The application is run through the NodeJS runtime environment, so please ensure it is downloaded as per your distribution's package manager. Please refer to the [NodeJS](https://github.com/nodejs/node#download) github repository for help getting started. The installation instructions below are for **Unix-like** operating systems. 
    
After installing Node and project dependencies, clone this repository:    
    
    git clone https://github.com/ntpa/fantasy-stat-track.git    
    
From there navigate to the directory where the application resides    
    
    cd fantasy-stat-track/app/    
    
Ensure that the proper node dependencies are installed    
    
    npm install    
    
### Running the application     
1. Sign up for an account    
2. Under the fantasy-stat-track/app/ directory create a file named `creds.js`    
    
```javascript    
    nflUsername: '<nfl-fantasy-account-username>'    
    nflPassword: '<nfl-fantasy-account-password>' 
    
    export { nflUsername, nflPassword }
    
```    
    
> If you wish to contribute or make fork public, please make sure to add `creds.js` to your `.gitignore`    
    
3. Through the `node` command in the app/ directory    

        node app.js    
 
**Note: If you notice(while running app.js) that the web page has gone blank, refresh the browser page and proper execution should continue**


If an error occurs, the file error.txt will be in the log directory, which is created in the directory the command above is run. Please read the error output in the error.txt. *Usually a re-run will fix any unexpected errors*. 
    
4. If successful operation, change your directory to where the output files will be    

        cd <output-directory>    
    
5. Run the shell scripts in scripts/ to populate points and rank breakdowns. 
        python ../../scripts/json2rankings.py 'YYYY-MM-DD_playerOutput.json'

        *** OR *** 

        python ../../scripts/json2csv.py '<YYYY-MM-DD_playerOutput.json>'
        python ../../scripts/csv2rankings.py 'YYYY-MM-DD_output.csv'

6. Enjoy the simple plain text rankings on fantasy players in your league

---     
    
### Future goals include:    
    
- Visualize the data, create better insights
- Receive user recommendations 
- If you wish to contribute or give suggestions, please reach out!

**This application is in no way sponsored and/or endorsed by NFL Fantasy or its affiliates**    

