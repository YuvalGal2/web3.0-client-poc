'use strict';
const fs = require('fs')
const Path = require('path')
const readline = require('readline');

const url = process.argv[2];
const webMode = process.argv[4]; // 2 for 2.0 and 3 for 3.0

const chainFile = `${__dirname}\\chains\\${url}.chain.json`;
const gateWayFile = "brokers.chain";



const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function isChainExisting() {
    const fileExisting = fs.existsSync(chainFile)
    return fileExisting;
}
async function requestData() {
    // do i know this site ? 
    // check if i have a file under my /chains named google.com
    const fileExisting = await isChainExisting();
    if (!fileExisting) {
        const gateWay = await askForGateWayMode();
        rl.pause();
        if (gateWay) {
            const path = `${url}/${gateWayFile}`;
            const res = await doRequest(path);
            if (res) {
                const payload = await res.json();
                await writeDataToFile(payload);
            }
        } else {
            const ip = await askForBroker(url);
            rl.pause();
            console.log("lets stop here for now");
            // await doRequest(ip);
        }
    }
}


function askForBroker() {
    return new Promise((resolve) => {
        rl.question('Enter a valid IP address for trusted broker: ', (answer) => {
            resolve(answer);
        });
    });
}
async function doRequest(url) {
    url = `https://${url}`;
    console.log(url);
    try {
        const res = await fetch(url);
        if (res.ok) {
            return res;
        } else {
            console.log("could not fetch data!");
        }
    } catch (e) {
        console.log('unable to fetch data');
    }
}

function writeDataToFile(payload) {
    fs.writeFile(chainFile, data, (error) => {
        if (error) {
            console.error('cannot write to disk');
        } else {
            console.log('Data written to file successfully.');
        }
    });
}

function askForGateWayMode() {
    return new Promise((resolve) => {
        rl.question('Do you want to use the Web2.0 Gateway? (y/n): ', (answer) => {
            if (answer.toLowerCase() === 'y') {
                resolve(true);
                console.log('Gateway enabled.');
            } else if (answer.toLowerCase() === 'n') {
                resolve(false);
                console.log('Gateway disabled.');
            } else {
                console.log('Invalid input. Please enter either y or n.');
                resolve(askForGateWayMode());
            }
        })
    });
}

requestData();