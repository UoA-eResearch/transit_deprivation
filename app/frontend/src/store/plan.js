var nj = require('numjs');

const EPS = 0.01

function validApply(a, b=null,  f=(a, b=null) => {return a}){
    /*
        a: the numjs array
        b: optional numjs array
        f: the function to apply to each element if valid
        valid is determined by a[i][j] > -1
     */
    let nx = a.shape[0];
    let ny = a.shape[1];

    let result = nj.zeros([nx, ny], 'float64');
    for (let i = 0; i < nx; i++){
        for (let j = 0; j < ny; j++){
            if (a.get(i, j) > -1){
                result.set(i, j, f(a.get(i, j), b ? b.get(i, j) : null));
            }
        }
    }

    return result;
}

function validReduce(a, debug=false){
    let nl = a.shape[0];
    let nt = a.shape[1];
    let sum = nj.zeros([nl], 'float64');

    if (debug){
        // printArray2D(a);
        console.log(a.shape);
    }


    // count number of valid trips for each location
    for (let i = 0; i < nl; i++){
        for (let j = 0; j < nt; j++){
            if (a.get(i, j) > EPS){
                sum.set(i, sum.get(i) + 1);
            }
        }
    }

    // represent as ratio of possible trips
    return sum.divide(nt, false);
}

function getOffset(t, delta){
    return Math.ceil(t / delta);
}

module.exports = {
    'multileg': function multileg(inbound, outbound, tMax, tDest, tDelta) {
        // A->B
        // create budget matrix in the shape of 'inbound' with starting value tMax
        let tRemain = validApply(inbound, null, (a) => {
            return tMax
        })

        // subtract travel time to destination and time at destination (clip negative values to 0)
        tRemain = validApply(tRemain, inbound, (a, b) => {
            return Math.max(0, a - b - tDest)
        });

        // accessibility of destination B from various start locations A
        let acc_B = validReduce(tRemain);

        // B->C
        // calculate time offset for duration at B
        let tDestOffset = getOffset(tDest, tDelta);

        // create result matrix
        let nl = inbound.shape[0];
        let nt = inbound.shape[1];
        let result = nj.zeros([nt, nl], 'float64');

        // compute journey output matrices
        // currently this is for a single C at a time due to memory constraints

        let jl = 838; // selected start location
        for (let jt = 0; jt < nt; jt++) {

            let tRemainJ = tRemain.get(jl, jt);

            if (tRemainJ > EPS) {

                // calculate max offset
                let tMaxOffset = getOffset(tRemainJ, tDelta);

                // slice the outbound matrix for valid journey times
                let startT = jt + tDestOffset;
                let endT = Math.min(nt + 1, Math.min(nt, startT + tMaxOffset));
                let BCj = outbound.slice(null, [startT, endT, 1]);

                if (BCj.shape[1] > 0) {

                    // create a budget matrix that matches the slice dimensions
                    let tRemainBCj = validApply(BCj, null, (a) => {
                        return tRemainJ
                    });

                    // subtract travel time from B to C
                    tRemainBCj = validApply(BCj, tRemainBCj, (a, b) => {
                        return Math.max(0, b - a)
                    });

                    // reduce BCj matrix
                    let r = validReduce(tRemainBCj);
                    result.slice([jt, jt + 1, 1]).assign(r.reshape(1, nl), false);

                }
            }
        }

        // reduce the result matrix to accessibility scores by taking the mean accessibility for each location
        let acc_C = nj.zeros([nl]);
        for (let t = 0; t < nt; t++) {
            for (let l = 0; l < nl; l++) {
                acc_C.set(l, acc_C.get(l) + result.get(t, l));
            }
        }
        acc_C.divide(nt, false);

        return [acc_B.tolist(), acc_C.tolist()];
    }
}
