import * as types from './actionTypes';
import initialState from './initialState';
import { createReducer} from '@reduxjs/toolkit';

/*
Using Redux Toolkit and Immer for immutable updates
 */
const reducer = createReducer(initialState, (builder) => {
    builder
        .addCase(types.SET_ETA_VIEW, (state, action) => {
          state.etaView = action.etaView;
        })
        .addCase(types.SET_DESTINATION_DATASET, (state, action) => {
            state.destinationDataset = action.destinationDataset;
        })
        .addCase(types.SET_TIME_LIMIT, (state, action) => {
            state.timeLimit = action.timeLimit;
        })
        .addCase(types.SET_TIME_AT_DESTINATION, (state, action) => {
            state.timeAtDestination = action.time;
        })
        .addCase(types.SET_MAP_OPACITY, (state, action) => {
            state.mapOpacity = action.mapOpacity;
        })
        // .addCase(types.SET_MAP_MIN_VALUE, (state, action) => {
        //     state.mapMinValue = action.mapMinValue;
        // })
        // .addCase(types.SET_MAP_MAX_VALUE, (state, action) => {
        //     state.mapMaxValue = action.mapMaxValue;
        // })
        .addCase(types.SET_MAP_COLOR_SCHEME, (state, action) => {
            state.mapColorScheme = action.mapColorScheme;
        })
        .addCase(types.SET_MAP_VIEW_STATE, (state, action) => {
            state.mapViewState = action.mapViewState;
        })
        .addCase(types.SET_SELECTED_DATA_ZONE, (state, action) => {
            state.selectedDataZone = action.selectedDataZone;
        })
        .addCase(types.SET_MAP_TOOLTIP, (state, action) => {
            state.mapTooltip = action.mapTooltip;
        })
        .addCase(types.SET_ETA, (state, action) => {
            state.eta = action.eta;
        })
        .addCase(types.SET_LOCATION_INBOUND_DATA, (state, action) => {
            state.locationInboundData = action.data;
        })
        .addCase(types.SET_LOCATION_OUTBOUND_DATA, (state, action) => {
            state.locationOutboundData = action.data;
        })
        .addDefaultCase((state, action) => {})
});
export default reducer;
