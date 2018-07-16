/*
    This is still in progress
    File relating to the homework requirements is liri.js
    Making a different version that goes through inquirer rather than command line inputs
    Lets user select twitter, song, or movie from a list and then takes in the input
    
*/


require("dotenv").config();
var fs = require("fs");
var keys = require("./keys.js");
var Spotify = require("node-spotify-api");
var Twitter = require("twitter");
var request = require("request");
var inquirer = require("inquirer");

//initial question, with switch leading to each individual api
inquirer.prompt([
    {
        type: "list",
        message: "What would you like to search for?",
        choices: ["song (spotify-this-song)", "movie (movie-this)", "twitter (my-tweets)"],
        name: "choice"
    }
]).then(function (answer) {
    switch (answer.choice) {
        case "song (spotify-this-song)":
            spotifySearch();
            break;
        case "movie (movie-this)":
            //omdb function
            console.log("you picked movie search");
            break;
        case "twitter (my-tweets)":
            twitterSearch();
            break;
        default:
            console.log("Invalid option, please try again!");
    }

});


//spotify song info function, with inquirer prompt and api call
function spotifySearch() {
    inquirer.prompt([
        {
            message: "What song would you like to search for?",
            name: "songName"
        }
    ]).then(function (answers) {
        var spotify = new Spotify(keys.spotify);
        var songName = "";
        if (!answers.songName) {
            songName = "The Sign Ace of Base";
            console.log("Invalid song name entered, searching for The Sign by Ace of Base.");
        }
        else {
            songName = answers.songName;
        }
        spotify.search({ type: "track", query: songName }, function (err, data) {
            if (err) {
                console.log("error:" + err);
            }
            else {
                spotifyLogger(data);
            }
        });
    });
}

//sorts the returned object, prints to console and txt file
function spotifyLogger(data) {
    var songData = (`Song name: ${data.tracks.items[0].name} \nBand name ${data.tracks.items[0].artists[0].name} \nAlbum name: ${data.tracks.items[0].album.name} \nSong preview: ${data.tracks.items[0].preview_url}`);
    //I used the 30 second preview URL, there were also links to the song itself and the entire album
    console.log(songData);
    fs.appendFile("log.txt", ("\r\nSong Information:" + songData), function (err) {
        if (err) {
            console.log(err);
        }
    });
}

//twitter request
function twitterSearch() {
    var client = new Twitter(keys.twitter);
    var params = { screen_name: 'HwNode' };
    client.get('statuses/user_timeline', params, function (error, tweets, response) {
        if (!error) {
            tweetLogger(tweets)
        }
    });
}
//prints 5 most recent tweets to console and text file
function tweetLogger(tweets) {
    var name = tweets[0].user.name;
    console.log("View the 5 most recent tweets of " + name +"\n");
    for (i = 0; i < 5; i++) {
        var tweetInfo = `Tweet: ${tweets[i].text} \nTimestamp: ${tweets[i].created_at}\n`;
        console.log(tweetInfo);
        fs.appendFile("long.txt", ("\r\n New Twitter Info:" + name + "\r\n" + tweetInfo), function (err) {
            if (err) {
                console.log(err);
            }
        })
    }
}