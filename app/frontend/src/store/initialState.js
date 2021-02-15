import {min, max} from "d3";

// Data
import * as data_zones from "./data/akl/akl_polygons_id.json"
import * as clinics from "./data/akl/akl_clinics.json"
import * as akl_idx_loc from "./data/akl/akl_idx_loc.json"
import * as akl_loc_idx from "./data/akl/akl_loc_idx.json"
import * as akl_idx_t from "./data/akl/akl_idx_t.json"

import * as destinationTypes from "../components/destinationTypes";
import {DESTINATION_DIABETES_CLINICS} from "../components/destinationTypes";

function calcStats(data){

    const stats = {
            "IMD18": {"min": min(data, d => d.properties.IMD18), "max": max(data, d => d.properties.IMD18)},
        }
    return stats
}

export default {
    // geojson data
    dataZones: data_zones["default"],
    destinations: {
        [destinationTypes.DESTINATION_DIABETES_CLINICS]: clinics["default"],
    },
    // clinics: clinics["default"],

    // filter/selection values
    destinationDataset: destinationTypes.DESTINATION_DIABETES_CLINICS,
    selectedDestination: null,
    view: "avail",
    timeLimit: 120,
    timeAtDestination: 60,
    timeDelta: 10, // step size (minutes) in time dimension

    // map state
    // TODO: we might need more descriptive names if we add additional layers/second map
    destinationColor: [240, 32, 1],
    originColor: [0, 211, 255],
    mapColorScheme: "BlueGreen",
    mapHoveredObject: null,
    mapOpacity: 0.8,
    mapMinValue: 0.0,
    mapMaxValue: 1.0,
    mapViewState: {
        latitude: -36.8485, // auckland
        longitude: 174.7633,
        zoom: 11,
        maxZoom: 16,
        pitch: 0,
        bearing: 0
    },
    mapTooltip: {
        showHover: false,
    },
    selectedDataZone: null,
    hoveredDataZone: null,

    // indexes
    idxLoc: akl_idx_loc["default"], // array index to location id
    locIdx: akl_loc_idx["default"], // location id to array index
    idxT: akl_idx_t["default"], // array index to timestamp

    // data, derived data from server
    locationInboundData: null,
    locationOutboundData: null,
    AB: null,
    BC: null,
    dataZoneStats: calcStats(data_zones["default"]["features"])

}
