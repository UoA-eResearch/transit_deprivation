var fs = require('fs');
var nj = require('numjs');
var plan = require( './plan.js');

function readData(filename){
    let data = fs.readFileSync(filename);
    return JSON.parse(data);
}

function getData(region, location){
    let inbound = readData(`./data/inbound/${region}/${location}.json`);
    let outbound = readData(`./data/outbound/${region}/${location}.json`);
    return {'inbound': inbound, 'outbound': outbound}
}

// input parameters
const destID = "7601026";
const tMax = 2 * 60;
const tDest = 1 * 60;
const tDelta = 10;

// load the travel time matrices
let {inbound, outbound} = getData("akl", destID);
inbound = nj.array(inbound, 'float64'); // A->B
outbound = nj.array(outbound, 'float64'); // B->C

let nl = outbound.shape[0];
let [acc_B, acc_C] = plan.multileg(inbound, outbound, tMax, tDest, tDelta);

for (let i=0; i < nl; i++){
    console.log(i, acc_C[i]);
}