# Fantasy Stat Track

Track statistics from your NFL Fanstasy League

 The application's goal is to automate the process for NFL Fantasy player data collection, as well improve the research tools available for people who use NFL Fantasy. Statistics help users determine future draft, trade, and waiver-wire transaction for current and future seasons.

##### Dependencies:
- NodeJS: Version 12.2 >= 
    - Mongoose: Version 6.2 >=
    - Puppeteer: Version 13.4 >=
- MongoDB: Version 4.3 >=

##### Requirements:

- NFL Fantasy Account with at least one season.
- MongoDB account, *if database storage desired*.


### Installation 

The application is run through the NodeJS runtime environment, so please ensure it is downloaded as per your distribution's package manager. Please refer to the [NodeJS](https://github.com/nodejs/node#download) github repository for help getting started. The installation instructions below are for **Unix-like** operating systems. 

After installing Node and project dependencies, clone this repository: 

    git clone https://github.com/ntpa/fantasy-stat-track.git
    
From there navigate to the directory where the application resides
    
    cd fantasy-stat-track/app/
    
Ensure that the proper node dependencies are installed
    
    npm install puppeteer mongoose --save
    
### Running the application 

There are two main options for running the application.

The prefered method is through the shell script
    
    source fantasyStatTrack.sh 
    
Directly through `node`
    
    node app.js
    
> If you choose to run directly through `node` make sure to truncate the files in the log/ directory before subsequent runs

--- 

### Future goals include:

- Add testing suite to the project
- Retrieve statistics other than fantasy points. Includes yards, touchdowns, as well as position specific statistics such as receptions, passing and rushing yards
- Visualize the data, create insights, get information from multiple seasons
- Include other fantasy football providers, such as ESPN and Yahoo



**This application is in no way sponsored and/or endorsed by NFL Fantasy or its affiliates**

