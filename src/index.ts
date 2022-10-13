import {Client} from "discord-rpc";
import {createInterface} from "readline";
import 'dotenv/config';

const rpc = new Client({transport: "ipc"});
const clientId = process.env.clientId;
const startTime = new Date();
const scanner = createInterface(process.stdin, process.stdout);
const parameters = ["details", "state", "startTimestamp", "largeImageKey", "largeImageText", "smallImageKey", "smallImageText"];
let currentPresenceOptions = {
    details: "Standing here, I realize",
    state: "You were just like me...",
    startTimestamp: startTime, //Use endTimestamp to create a countdown to the Date.
    largeImageKey: "senator",
    largeImageText: "Trying to make history",
    smallImageKey: "mgrr_logo",
    smallImageText: "Best game ost"
};

console.log("DiscordRPC-Example starting...");

rpc.once("ready",()=>{
    console.log("DiscordRPC-Example ready.");
    setPresence();
});

function setPresence(){
    rpc.setActivity(currentPresenceOptions);
    console.log("Presence set.");
    askForPresenceDetails();
}


function askForPresenceDetails(){
    console.log(`
Valid parameters: ${parameters.join(", ")}
(Case-sensitive!)`);
    scanner.question("Parameter-name to change: ", parameter => {
        if(!parameters.includes(parameter)){
            console.log("Invalid parameter.");
            return askForPresenceDetails();
        }
        scanner.question("Value to change it to: ", value => {
            if(value === ""){
                console.log(`Removing ${parameter}.`);
                delete currentPresenceOptions[parameter];
            } else {
                console.log(`Setting ${parameter} to ${value}.`);
                currentPresenceOptions[parameter] = value;
            }
            setPresence();
        });
    });
}

rpc.login({ clientId });

process.on("unhandledRejection", (error: Error)=>{
    if(error.message === "RPC_CONNECTION_TIMEOUT"){
        console.log("It would seem your Discord is out of sync with the application. Please reload Discord with CTRL+R.");
    } else if(error.message === "connection closed"){
        console.log("Discord connection closed, please restart this application.");
    } else if(error.message === "Could not connect"){
        console.log("Discord not detected, please make sure Discord is running.");
    } else {
        console.error(error);
    }
});

process.on("SIGINT",()=>{
    rpc.destroy();
    console.log(`
Goodbye!`);
});