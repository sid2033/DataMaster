const Discord = require("discord.js");
const {prefix, token, weatherToken} = require("./config.json");

const cheerio = require('cheerio');
const request = require("request");
const CoinGecko = require('coingecko-api');
const CoinGeckoClient = new CoinGecko();
let weather = require("openweather-apis");
weather.setAPPID(weatherToken);
weather.setLang("en");
weather.setUnits("imperial");
const cities = require('all-the-cities');

const bot = new Discord.Client();
bot.login(token);

//bot status
bot.once("ready", () => {
    console.log("Bot is Online");
});

bot.once("reconnecting", () => {
    console.log("Bot is Reconnecting");
});

bot.once("disconnect", () => {
    console.log("Bot has Disconnected");
});

//bot reads input message
bot.on("message", message => {
    if (message.author.bot) {
        return;
    }

    if (message.content.startsWith(prefix) === false) {
        return;
    }
    
    //bot command help
    if (message.content === "|help DataMaster") {
        //message reply
        message.reply("``` Hello, I am DataMaster, a multi purpose discord bot.  \n Commands: \n |hello DataMaster - Greetings \n |crypto (price/high24/low24/highest/lowest/cap/volume) (*crypto name*) \n - Returns specified cryptocurrency Data \n |weather (*City Name*) (temp/maxtemp/mintemp/pressure/humidity/wind) \n - Returns weather data for specified city```");
    }

    if (message.content === "|hello DataMaster") {
        //message reply
        message.reply("Hello");

    }

    let split = message.content.split(" ");

    //cryptocurreny commands
    if (split[0] === "|crypto") {
        if (split.length !== 4) {
            message.reply("Invalid Command");
            return;
        }
        dataCall(split[2], split[3], split[1]);

        async function dataCall(cryptocurrency, curr, action) {
            let rawData = await CoinGeckoClient.coins.fetch(cryptocurrency, {});
            if (rawData.success === false) {
                message.reply("Invalid Cryptocurrency");
                return;
            }
            if (action === "price") {
                let currencyList = rawData.data.market_data.current_price;
                let currencyArray = Object.keys(currencyList);
                if (currencyArray.includes(curr)) {
                    let price = currencyList[curr];
                    let date = getDate();
                    message.reply("The price of 1 " + cryptocurrency + " is " + price + " " + curr);
                }
                else {
                    message.reply("Invalid Currency Acronym");
                    return;
                }
            }
            else if (action === "high24"){
                let currencyList = rawData.data.market_data.high_24h;
                let currencyArray = Object.keys(currencyList);
                if (currencyArray.includes(curr)) {
                    let price = currencyList[curr];
                    let date = getDate();
                    message.reply("The highest price of " + cryptocurrency + " in the last 24 hours is " + price + " " + curr);
                }
                else {
                    message.reply("Invalid Currency Acronym");
                    return;
                }
            }
            else if (action === "low24"){
                let currencyList = rawData.data.market_data.low_24h;
                let currencyArray = Object.keys(currencyList);
                if (currencyArray.includes(curr)) {
                    let price = currencyList[curr];
                    let date = getDate();
                    message.reply("The lowest price of " + cryptocurrency + " in the last 24 hours is " + price + " " + curr);
                }
                else {
                    message.reply("Invalid Currency Acronym");
                    return;
                }
            }
            else if (action === "highest"){
                let currencyList = rawData.data.market_data.ath;
                let currencyArray = Object.keys(currencyList);
                if (currencyArray.includes(curr)) {
                    let price = currencyList[curr];
                    let date = getDate();
                    message.reply("The highest price of " + cryptocurrency + " ever is " + price + " " + curr);
                }
                else {
                    message.reply("Invalid Currency Acronym");
                    return;
                }
            }
            else if (action === "lowest"){
                let currencyList = rawData.data.market_data.atl;
                let currencyArray = Object.keys(currencyList);
                if (currencyArray.includes(curr)) {
                    let price = currencyList[curr];
                    let date = getDate();
                    message.reply("The lowest price of " + cryptocurrency + " ever is " + price + " " + curr);
                }
                else {
                    message.reply("Invalid Currency Acronym");
                    return;
                }
            }
            else if (action === "cap"){
                let currencyList = rawData.data.market_data.market_cap;
                let currencyArray = Object.keys(currencyList);
                if (currencyArray.includes(curr)) {
                    let price = currencyList[curr];
                    let date = getDate();
                    message.reply("The market cap of " + cryptocurrency + " is " + price + " " + curr);
                }
                else {
                    message.reply("Invalid Currency Acronym");
                    return;
                }
            }
            else if (action === "volume"){
                let currencyList = rawData.data.market_data.total_volume;
                let currencyArray = Object.keys(currencyList);
                if (currencyArray.includes(curr)) {
                    let price = currencyList[curr];
                    let date = getDate();
                    message.reply("The volume of " + cryptocurrency + " is " + price + " " + curr);
                }
                else {
                    message.reply("Invalid Currency Acronym");
                    return;
                }
            }
        }
    }

    //weather commands
    if (split[0] === "|weather") {
        let city = "";
        let divArr = [];
        if (split.length === 3){
            city = split[2];
        }
        else if (split.length === 4) {
            divArr.push(split[2]);
            divArr.push(split[3]);
            city = divArr.join(" ");
        }
        else if (split.length === 5) {
            divArr.push(split[2]);
            divArr.push(split[3]);
            divArr.push(split[4]);
            city = divArr.join(" ");
        }
        weather.setCity(city);
        if (cities.filter(paramcity => paramcity.name.match(city)).length === 0) {
            message.reply("Invalid City");
            return;
        }
        if (split[1] === "temp") {
            weather.getTemperature(function(err, temp){
                if (err) message.reply("Unexcpected Data Error");
                message.reply("The temperature in " + city + " is " + temp + "° F");
            });
        }
        else if (split[1] === "maxtemp") {
            weather.getAllWeather(function(err, obj){
                if (err) message.reply("Unexcpected Data Error");
                message.reply("The max temperature in " + city + " is " + obj.main.temp_max + "° F");
            });
        }
        else if (split[1] === "mintemp") {
            weather.getAllWeather(function(err, obj){
                if (err) message.reply("Unexcpected Data Error");
                message.reply("The min temperature in " + city + " is " + obj.main.temp_min + "° F");
            });
        }
        else if (split[1] === "pressure") {
            weather.getPressure(function(err, pres){
                if (err) message.reply("Unexcpected Data Error");
                message.reply("The pressure in " + city + " is " + pres + " ATM");
            });
        }
        else if (split[1] === "humidity") {
            weather.getPressure(function(err, hum){
                if (err) message.reply("Unexcpected Data Error");
                message.reply("The humidity in " + city + " is " + hum + " hPa");
            });
        }
        else if (split[1] === "wind") {
            weather.getAllWeather(function(err, obj){
                if (err) message.reply("Unexcpected Data Error");
                message.reply("The current wind speed in " + city + " is " + obj.wind.speed + " mph");
            });
        }
        else {
            message.reply("Invalid Command");
        }
    }
    
    //function to retrieve a precise date and time
    function getDate() {
        let date_ob = new Date();
        let date = ("0" + date_ob.getDate()).slice(-2);
        let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
        let year = date_ob.getFullYear();
        let hours = date_ob.getHours();
        let minutes = date_ob.getMinutes();
        let seconds = date_ob.getSeconds();
        return (year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds);
    }
});
