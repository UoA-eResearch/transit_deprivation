import * as types from './actionTypes'
import { mean, deviation, max, min } from "d3";
var plan = require('./plan');

const DT_SERVER = process.env.REACT_APP_DTServer || "http://0.0.0.0:8081";

export function setView(view) {
    return {
        type: types.SET_VIEW,
        view
    }
}

export function setDestinationDataset(destinationDataset) {
    return {
        type: types.SET_DESTINATION_DATASET,
        destinationDataset
    }
}

export function setTimeLimit(timeLimit) {
    return {
        type: types.SET_TIME_LIMIT,
        timeLimit
    }
}

export function setTimeAtDestination(time) {
    return {
        type: types.SET_TIME_AT_DESTINATION,
        time
    }
}

export function setMapOpacity(mapOpacity) {
    return {
        type: types.SET_MAP_OPACITY,
        mapOpacity
    }
}

export function setMapColorScheme(mapColorScheme) {
    return {
        type: types.SET_MAP_COLOR_SCHEME,
        mapColorScheme
    }
}

export function setMapViewState(mapViewState) {
    return {
        type: types.SET_MAP_VIEW_STATE,
        mapViewState
    }
}

export function setSelectedDataZone(selectedDataZone) {
    return {
        type: types.SET_SELECTED_DATA_ZONE,
        selectedDataZone
    }
}

export function setHoveredDataZone(hoveredDataZone) {
    return {
        type: types.SET_HOVERED_DATA_ZONE,
        hoveredDataZone
    }
}

export function updateHover(hoveredDataZone){
    return (dispatch, getState) => {
        dispatch(setHoveredDataZone(hoveredDataZone));
        if (getState().AB !== null){
            dispatch(computeBC());
        }
    }
}

export function setMapTooltip(mapTooltip) {
    return {
        type: types.SET_MAP_TOOLTIP,
        mapTooltip
    }
}

export function setAB(AB) {
    return {
        type: types.SET_AB,
        AB
    }
}

export function setBC(BC) {
    return {
        type: types.SET_BC,
        BC
    }
}

export function reset() {
    return (dispatch, getState) => {
        dispatch(setAB(null));
        dispatch(setBC(null));
        dispatch(setLocationInboundData(null));
        dispatch(setLocationOutboundData(null));
        dispatch(setSelectedDataZone(null));
        dispatch(setHoveredDataZone(null));
    }
}

export function computeAB(){
    return (dispatch, getState) => {

        // constraints
        const tMax = getState().timeLimit;
        const tDest = getState().timeAtDestination;
        const tDelta = 10; // step size (minutes) in time dimension

        // convert travel time data to numjs ndarrays
        const inbound = getState().locationInboundData; // A->B

        // get inbound accessibility scores for selected location
        const [acc_B, tRemain] = plan.planAB(inbound, tMax, tDest);

        let avail_B = {"values": acc_B.tolist(), "min": 0, "max": 1};

        dispatch(setAB({
            "avail": avail_B, "tRemain": tRemain,
        }));

        dispatch(computeBC());


    }
}

export function computeBC(){
    return (dispatch, getState) => {

        const AB = getState().AB;
        const hoveredDataZone = getState().hoveredDataZone;
        if (AB !== null && hoveredDataZone !== null && hoveredDataZone !== undefined && ('id' in hoveredDataZone)){
            // constraints
            const tMax = getState().timeLimit;
            const tDest = getState().timeAtDestination;
            const tDelta = getState().timeDelta;
            const tRemain = AB.tRemain;
            const locIdx = getState().locIdx;
            const outbound = getState().locationOutboundData; // B->C
            const originIdx = locIdx[getState().hoveredDataZone.id];

            // get outbound accessibility scores for hovered location
            const acc_C = plan.planBC(originIdx, tRemain, outbound, tMax, tDest, tDelta)
            let avail_C = {"values": acc_C.tolist(), "min": 0, "max": 1};

            dispatch(setBC({
                "avail": avail_C,
            }));
        }
    }
}

// export function computeETA() {
//     return (dispatch, getState) => {
//         const data = getState().locationOutboundData;
//         const timeAtDestination = getState().timeAtDestination;
//         const timeLimit = getState().timeLimit - timeAtDestination;
//         const idxLoc = getState().idxLoc;
//         if (data === null) {
//             return;
//         }
//
//         const nloc = data.length;
//         const ntimes = data[0].length;
//
//         let times = {};
//
//         // find valid journeys given the time constraint
//         let t = null;
//         for (let i = 0; i < nloc; i++) {
//             times[i] = [];
//             for (let j = 0; j < ntimes; j++) {
//                 t = data[i][j]
//                 if (t > -1 && t < timeLimit) {
//                     times[i].push(t);
//                 }
//             }
//         }
//
//         // compute stats from origin to each destinations
//         let mean_ = {"values": {}, "min": 0, "max": 1};
//         let stdev = {"values": {}, "min": 0, "max": 1};
//         let avail = {"values": {}, "min": 0, "max": 1}; // ratio of trips that meet the time limit criteria
//
//         let loc = null;
//         for (let i = 0; i < nloc; i++) {
//             loc = idxLoc[i]; // convert DT matrix index to datazone location id
//
//             if (times[i].length > 0) {
//
//                 // mean
//                 mean_["values"][loc] = mean(times[i]);
//
//                 // stdev
//                 if (times[i].length >= 2) {
//                     stdev["values"][loc] = deviation(times[i])
//                 }
//
//                 // avail
//                 avail["values"][loc] = times[i].length / ntimes;
//
//             }
//             //console.log(`${i}: ${loc}, mean: ${mean[loc]} stdev: ${stdev[loc]}`)
//         }
//
//         // calculate min, max required for normalisation
//         mean_["max"] = max(Object.values(mean_["values"]));
//         mean_["min"] = min(Object.values(mean_["values"]));
//
//         stdev["max"] = max(Object.values(stdev["values"]));
//         stdev["min"] = min(Object.values(stdev["values"]));
//
//         avail["max"] = max(Object.values(avail["values"]));
//         avail["min"] = min(Object.values(avail["values"]));
//
//         let eta = {
//             "avail": avail,
//             "mean": mean_,
//             "stdev": stdev,
//         };
//
//         dispatch(setETA(eta));
//     }
// }

export function setLocationInboundData(data) {
    return {
        type: types.SET_LOCATION_INBOUND_DATA,
        data
    }
}

export function setLocationOutboundData(data) {
    return {
        type: types.SET_LOCATION_OUTBOUND_DATA,
        data
    }
}

export function getLocationDT(location) {
    /**
     * "inbound" means from everywhere to this location, "outbound" means from this location to everywhere
     */
    return (dispatch, getState) => {
        let region = "akl";
        let url = DT_SERVER+`/transit?region=${region}&location=${location}&direction=inbound`;

        const inbound = fetch(url)
            .then(response => response.json())
            .then((data) => {
                dispatch(setLocationInboundData(data));
            })
            .catch((error) => {
                console.error(error)
            })

        url = DT_SERVER+`/transit?region=${region}&location=${location}&direction=outbound`;
        const outbound = fetch(url)
            .then(response => response.json())
            .then((data) => {
                dispatch(setLocationOutboundData(data));
            })
            .catch((error) => {
                console.error(error)
            })

        Promise.all([inbound, outbound]).then(()=>{
                dispatch(computeAB());
        });
    }
}