// Data
import * as data_zones from "./data/akl/akl_polygons_id.json"
import * as clinics from "./data/akl/akl_clinics.json"
import * as akl_idx_loc from "./data/akl/akl_idx_loc.json"
import * as akl_loc_idx from "./data/akl/akl_loc_idx.json"
import * as akl_idx_t from "./data/akl/akl_idx_t.json"

export default {
    // geojson data
    dataZones: data_zones["default"],
    clinics: clinics["default"],

    // filter/selection values
    destinationDataset: "None",
    etaView: "avail",
    timeLimit: 60,

    // map state
    // TODO: we might need more descriptive names if we add additional layers/second map
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

    // indexes
    idxLoc: akl_idx_loc["default"],
    locIdx: akl_loc_idx["default"],
    idxT: akl_idx_t["default"],

    // data, derived data from server
    locationDT: null,
    eta: null,
}
