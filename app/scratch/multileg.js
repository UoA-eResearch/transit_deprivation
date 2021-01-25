var nj = require('numjs');
var fs = require('fs');

function readData(filename){
    let data = fs.readFileSync(filename);
    return JSON.parse(data);
}

function getData(region, location){
    let inbound = readData(`./data/inbound/${region}/${location}.json`);
    let outbound = readData(`./data/outbound/${region}/${location}.json`);
    return {'inbound': inbound, 'outbound': outbound}
}

function validApply(a, b=null,  f=(a, b=null) => {return a}){
    /*
        a: the numjs array
        b: optional numjs array
        f: the function to apply to each element if valid
        valid is determined by a[i][j] > -1
     */
    let nx = a.shape[0];
    let ny = a.shape[1];

    for (let i = 0; i < nx; i++){
        for (let j = 0; j < ny; j++){
            if (a.get(i, j) > -1){
                a.set(i, j, f(a.get(i, j), b ? b.get(i, j) : null));
            }
        }
    }

    return a;
}

function testValidApply(){
    let ex = nj.zeros([3, 3])
    console.log(ex);
    ex.set(0, 1, -1);
    ex.set(1, 1, -1);
    console.log(ex);

    ex = validApply(ex, null, (a) => {return a + 1});
    console.log(ex);

    ex = validApply(ex, nj.ones([3, 3]), (a, b) => {return a + b});
    console.log(ex);

    return ex;
}

function validReduce(a){
    let nl = a.shape[0];
    let nt = a.shape[1];
    let sum = nj.zeros([nl]);

    // count number of valid trips for each location
    for (let i = 0; i < nl; i++){
        for (let j = 0; j < nt; j++){
            if (a.get(i, j) > 0){
                sum.set(i, sum.get(i) + 1);
            }
        }
    }

    // represent as ratio of possible trips
    return sum.divide(nt, false);
}

function testValidReduce(a){
    console.log(a);
    let result = validReduce(a)
    console.log(result);
}

function runTests(){
    let ex = testValidApply();
    testValidReduce(ex);
}

function printArray(a){
    for (let i = 0; i < a.shape[0]; i ++){
        process.stdout.write(`${a.get(i)} `);
    }
    console.log('');
}

function printArray2D(a){
    for (let i = 0; i < a.shape[0]; i ++){
        for (let j = 0; j < a.shape[1]; j++){
            process.stdout.write(`${a.get(i, j)} `);
        }
        console.log('');
    }
}

function getOffset(t, delta){
    return Math.ceil(t / delta);
}

// input parameters
const destID = "7601026";
const tMax = 2 * 60;
const tDest = 1 * 60;
const tDelta = 10;

// load the travel time matrices
let {inbound, outbound} = getData("akl", destID);
inbound = nj.array(inbound, 'float32'); // A->B
outbound = nj.array(outbound, 'float32'); // B->C

// A->B

// create budget matrix in the shape of 'inbound' with starting value tMax
let tRemain = validApply(inbound.clone(), null, (a) => {return tMax})

// subtract travel time to destination (clip negative values to 0)
tRemain = validApply(tRemain, inbound, (a, b) => {return Math.max(0, a - b)});

// accessibility of destination B from various start locations A
let acc_B = validReduce(tRemain);

// B->C

// calculate time offset for duration at B
let tDestOffset = getOffset(tDest, tDelta);

// create result matrix
let nl = inbound.shape[0];
let nt = inbound.shape[1];
let result = nj.zeros([nt, nl]);

// compute journey output matrices
// currently this is for a single C at a time due to memory constraints

// var b = nj.arange(5*5).reshape(5,5);
// console.log(b);
// var s = b.slice([0, 2, 1], [1, 3, 1]);
// console.log(s);

let jl = 838;
for (let jt = 0; jt < nt; jt++){

    let tRemainJ = tRemain.get(jl, jt);
    console.log(jl, jt, tRemainJ);

    if (tRemainJ > 0){

        // calculate max offset
        let tMaxOffset = getOffset(tRemainJ, tDelta);

        // slice the outbound matrix for valid journey times
        let startT = jt + tMaxOffset;
        let endT = Math.min(nt + 1, startT + tMaxOffset);
        let BCj = outbound.slice(null, [startT, endT, 1]);

        if (BCj.shape[1] === 0){
            continue;
        }

        // create a budget matrix that matches the slice dimensions
        let tRemainBCj = validApply(BCj.clone(), null, (a) => {return tRemainJ});

        // subtract travel time from B to C
        tRemainBCj = validApply(tRemainBCj, BCj, (a, b) => {return Math.max(0, a - b)});

        // reduce BCj matrix
        let r = validReduce(tRemainBCj);
        result.slice([jt, jt+1, 1]).assign(r.reshape(1, nl), false);
    }
}

// for (let t = 0;t < nt; t++){
//     console.log(t, result.slice(t).mean())
// }

// reduce the result matrix to availability scores
//let acc_C = validReduce(result);
//printArray(acc_C);







