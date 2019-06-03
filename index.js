const axios = require('axios');
const fs = require('fs');


const deviceId = '5c5acbc1c03f977a4b7707b5';
const token = 'A1E-mFxeHrts2kk6m09FwNf14DzOSuNMDz';
const url = `https://things.ubidots.com/api/v1.6/variables/${deviceId}/values/`;

options = {
    responseType: 'json',
    headers: { "X-Auth-Token": token }
}


/**
 * returns a promise that when resolved contains ubidots data
 * using the configuration above
 */
function getDataFromUbidots() {
    console.log('[get data from ubidots]');
    return axios.get(url, options);
}

const pathDataFile = './data/data.json';
/**
 * returns a promise that when resolved contains file data.
 * this will simulate get data from firebase
 */
function getDataFromFile() {
    return new Promise((resolve, reject) => {
        fs.readFile(pathDataFile, { encoding: 'utf-8' }, (err, data) => {
            if (err) reject();
            console.log('[get data from file]');
            resolve(JSON.parse(data));
        });
    });
}

/**
 * TODO: returns a promise that when resolved contains existing firebase data.
 */
function getDataFromFirebase(){
    return new Promise((resolve, reject) => {
        // TODO: write code to get the data from firebase.
        // when you get it, use resolve to pass the data.
        // hint: follow the example in `getDataFromFile()` function above
        console.log('[get data from firebase]');
    });
}

// Promise.all will execute callback function if and only if
// all promises are resolved without rejection (i.e. without error)
// TODO: replace `getDataFromFile` by `getDataFromFirebase`
Promise.all([getDataFromFile(), getDataFromUbidots()]).then((values) => {
    const dataFirebase = values[0];
    const dataUbidots = values[1].data.results
            .map(el =>  {return {timestamp: el.timestamp, value: el.value};});

    updateData(dataFirebase, dataUbidots);
});

/**
 * returns the list of recent values that exist in dataUbidots
 * and that does not exist in dataFirebase.
 */
function getDataRecent(dataFirebase, dataUbidots) {
    console.log('[compare data length]:');
    console.log(`\texisting data: ${dataFirebase.length}, ubidots data: ${dataUbidots.length}`);

    let dataNew = [];
    // the initial action: if firebase has no data,
    // then add all ubidots data.
    if (dataFirebase.length == 0){
        dataNew = dataUbidots;
    }
    // if firsbase data has all ubidots elements than no need
    // to add any data.
    else if (dataFirebase.length < dataUbidots.length){
        const t1 = parseInt(dataFirebase[dataFirebase.length - 1].timestamp);
        console.log(`[last element timestamp in the existing data]: ${t1}`);
        // knowing that data is sorted by `timestamp`,
        // we can just searh for the index of the first new recent element
        // and add all the elements from that position till the end.
        // NOTE: i think dichotomic search here will make less time.
        let lastIndex = dataUbidots.findIndex(el => {
            t2 = parseInt(el.timestamp);
            return t1 == t2;
        });
        // dataNew contains the values from dataUbidots that does not exist in dataFirebase
        dataNew = dataUbidots.slice(lastIndex + 1, dataUbidots.length);
    }
    return dataNew;
}

/**
 * TODO: send request to firsbase to update the data with recent values
 */
function updateData(dataFirebase, dataUbidots){
    dataNew = getDataRecent(dataFirebase, dataUbidots);
    console.log('[new data]:');
    console.log(dataNew);

    // TODO: code to update firebase data with `dataNew`
}
