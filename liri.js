/*
    I only did this to work with Spotify
    There was a message in the slack HW channel saying we only need to set up 1 input
    If I need to add twitter and the others I will, just let me know and I'll tack them on    
    I'm working on a version of this using inquirer to select from any of the 4 possible inputs
    rather than inputting them as command line args so I only did the minimum for the basic directions
*/

require("dotenv").config();
var fs = require("fs");
var keys = require("./keys.js");
var Spotify = require("node-spotify-api");
var request = require("request");

var spotify = new Spotify(keys.spotify);

var spotifyCommand = process.argv[2];
var songName = "The Sign Ace of Base"; //default song

if (process.argv.length > 3) { //changes song name as long as input is there
    songName = process.argv.slice(3).join("+");
}

if (spotifyCommand === "spotify-this-song") {  //only runs if spotify command is entered
    spotify.search({ type: "track", query: songName }, function (err, data) {
        if (err) {
            console.log("error:" + err);
        }
        else {
            /*  THIS PART WAS VERY ANNOYING:
            It displayed as an array called "items" and every element was [Object] [Object] [Object]
            I originally thought the weird [object] [object] [object] display was an error and spent a lot of time trying to rework the api call (that was actually working)
            I had to make it log the data.tracks.items[0].each-object to see the content after wasting wayyyy toooo much time
            
            Is it normal for things to be condensed automatically, can you make them display the object data without logging a more defined variable?
            It was very tedious to have to go change what it logs every time to see it uncondensed and parse through each individually
            My first attempt was try to open the api url in a browser and parse through the objects in the console, but didn't work due to no verification token in browser...
            */

            var songData = (`Song name: ${data.tracks.items[0].name} \nBand name ${data.tracks.items[0].artists[0].name} \nAlbum name: ${data.tracks.items[0].album.name} \nSong preview: ${data.tracks.items[0].preview_url}`);
            //I used the 30 second preview URL, there were also links to the song itself and the entire album
            console.log(songData);
            fs.appendFile("log.txt", ("\r\n" + songData), function (err) {
                if (err) {
                    console.log(err);
                }
            });
        }
    });
}

else {
    console.log("Invalid input, use 'spotify-this-song' to get song information!");
}