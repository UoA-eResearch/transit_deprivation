import * as types from './actionTypes'
import { mean, deviation, max, min } from "d3";

const DT_SERVER = process.env.REACT_APP_DTServer || "http://0.0.0.0:8081";

export function setEtaView(etaView) {
    return {
        type: types.SET_ETA_VIEW,
        etaView
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

export function setMapOpacity(mapOpacity) {
    return {
        type: types.SET_MAP_OPACITY,
        mapOpacity
    }
}

export function setMapMinValue(mapMinValue) {
    return {
        type: types.SET_MAP_MIN_VALUE,
        mapMinValue
    }
}

export function setMapMaxValue(mapMaxValue) {
    return {
        type: types.SET_MAP_MAX_VALUE,
        mapMaxValue
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

export function setMapTooltip(mapTooltip) {
    return {
        type: types.SET_MAP_TOOLTIP,
        mapTooltip
    }
}

export function setETA(eta) {
    return {
        type: types.SET_ETA,
        eta
    }
}

export function resetETA() {
    return (dispatch, getState) => {
        dispatch(setETA(null));
        dispatch(setLocationDT(null));
    }
}

export function computeETA() {
    return (dispatch, getState) => {
        const data = getState().locationDT;
        const timeLimit = getState().timeLimit;
        const idxLoc = getState().idxLoc;
        if (data === null) {
            return;
        }

        const nloc = data.length;
        const ntimes = data[0].length;

        let times = {};

        // find valid journeys given the time constraint
        let t = null;
        for (let i = 0; i < nloc; i++) {
            times[i] = [];
            for (let j = 0; j < ntimes; j++) {
                t = data[i][j]
                if (t > -1 && t < timeLimit) {
                    times[i].push(t);
                }
            }
        }

        // compute stats from origin to each destinations
        let mean_ = {"values": {}, "min": 0, "max": 1};
        let stdev = {"values": {}, "min": 0, "max": 1};
        let avail = {"values": {}, "min": 0, "max": 1}; // ratio of trips that meet the time limit criteria

        let loc = null;
        for (let i = 0; i < nloc; i++) {
            loc = idxLoc[i]; // convert DT matrix index to datazone location id

            if (times[i].length > 0) {

                // mean
                mean_["values"][loc] = mean(times[i]);

                // stdev
                if (times[i].length >= 2) {
                    stdev["values"][loc] = deviation(times[i])
                }

                // avail
                avail["values"][loc] = times[i].length / ntimes;

            }
            //console.log(`${i}: ${loc}, mean: ${mean[loc]} stdev: ${stdev[loc]}`)
        }

        // calculate min, max required for normalisation
        mean_["max"] = max(Object.values(mean_["values"]));
        mean_["min"] = min(Object.values(mean_["values"]));

        stdev["max"] = max(Object.values(stdev["values"]));
        stdev["min"] = min(Object.values(stdev["values"]));

        avail["max"] = max(Object.values(avail["values"]));
        avail["min"] = min(Object.values(avail["values"]));

        let eta = {
            "avail": avail,
            "mean": mean_,
            "stdev": stdev,
        };

        dispatch(setETA(eta));
    }
}

export function setLocationDT(locationDT) {
    return {
        type: types.SET_LOCATIONDT,
        locationDT
    }
}

export function getLocationDT(location) {
    return (dispatch, getState) => {
        let region = "akl";
        let url = DT_SERVER+`/transit?region=${region}&location=${location}`;
        fetch(url)
            .then(response => response.json())
            .then((data) => {
                dispatch(setLocationDT(data));
                dispatch(computeETA());
            })
            .catch((error) => {
                console.error(error)
            })
    }
}