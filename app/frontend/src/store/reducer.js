import * as types from './actionTypes';
import initialState from './initialState';

export default function reducer(state = initialState, action) {
    switch (action.type) {
        case types.SET_ETA_VIEW:
            return {
                ...state,
                etaView: action.etaView
            };
        case types.SET_DESTINATION_DATASET:
            return {
                ...state,
                destinationDataset: action.destinationDataset
            };
        case types.SET_TIME_LIMIT:
            return {
                ...state,
                timeLimit: action.timeLimit
            };
        case types.SET_MAP_OPACITY:
            return {
                ...state,
                mapOpacity: action.mapOpacity
            };
        case types.SET_MAP_MIN_VALUE:
            return {
                ...state,
                mapMinValue: action.mapMinValue
            };
        case types.SET_MAP_MAX_VALUE:
            return {
                ...state,
                mapMaxValue: action.mapMaxValue
            };
        case types.SET_MAP_COLOR_SCHEME:
            return {
                ...state,
                mapColorScheme: action.mapColorScheme
            };
        case types.SET_MAP_VIEW_STATE:
            return {
                ...state,
                mapViewState: action.mapViewState
            };
        case types.SET_SELECTED_DATA_ZONE:
            return {
                ...state,
                selectedDataZone: action.selectedDataZone
            };
        case types.SET_MAP_TOOLTIP:
            return {
                ...state,
                mapTooltip: action.mapTooltip
            };
        case types.SET_ETA:
            return {
                ...state,
                eta: action.eta
            };
        case types.SET_LOCATIONDT:
            return {
                ...state,
                locationDT: action.locationDT
            };
        default:
            return { ...state }
    }    
}

