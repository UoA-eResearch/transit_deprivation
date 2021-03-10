import * as types from './actionTypes';
import initialState from './initialState';
import { createReducer} from '@reduxjs/toolkit';
import {array} from 'numjs';

/*
Using Redux Toolkit and Immer for immutable updates
 */
const reducer = createReducer(initialState, (builder) => {
    builder
        .addCase(types.SET_VIEW, (state, action) => {
          state.view = action.view;
        })
        .addCase(types.SET_DESTINATION_DATASET, (state, action) => {
            state.destinationDataset = action.destinationDataset;
        })
        .addCase(types.SET_DESTINATION_BASEMAP, (state, action) => {
            state.destinationBasemap = action.destinationBasemap;
        })
        .addCase(types.SET_ORIGIN_BASEMAP, (state, action) => {
            state.originBasemap = action.originBasemap;
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
        .addCase(types.SET_MAP_COLOR_SCHEME, (state, action) => {
            state.mapColorScheme = action.mapColorScheme;
        })
        .addCase(types.SET_MAP_VIEW_STATE, (state, action) => {
            state.mapViewState = action.mapViewState;
        })
        .addCase(types.SET_SELECTED_DATA_ZONE, (state, action) => {
            state.selectedDataZone = action.selectedDataZone;
        })
        .addCase(types.SET_DESTINATION_DATAZONE, (state, action) => {
            state.selectedDestination = action.dz;
        })
        .addCase(types.SET_HOVERED_DATA_ZONE, (state, action) => {
            state.hoveredDataZone = action.hoveredDataZone;
        })
        .addCase(types.SET_MAP_TOOLTIP, (state, action) => {
            state.mapTooltip = action.mapTooltip;
        })
        .addCase(types.SET_AB, (state, action) => {
            state.AB = action.AB;
        })
        .addCase(types.SET_BC, (state, action) => {
            state.BC = action.BC;
        })
        .addCase(types.SET_LOCATION_INBOUND_DATA, (state, action) => {
            if (action.data === null) {
                state.locationInboundData = action.data;
            } else {
                state.locationInboundData = array(action.data, 'float64');
            }
        })
        .addCase(types.SET_LOCATION_OUTBOUND_DATA, (state, action) => {
            if (action.data === null) {
                state.locationOutboundData = action.data;
            } else {
                state.locationOutboundData = array(action.data, 'float64');
            }

        })
        .addDefaultCase((state, action) => {})
});
export default reducer;
