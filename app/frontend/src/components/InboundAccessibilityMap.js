import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withStyles, createMuiTheme } from '@material-ui/core/styles';
import { mapColorSchemeNameToInterpolator } from "../utils/colorScheme";
import { updateHover,
         setMapTooltip,
         setMapViewState,
         } from "../store/actions";
// mapping
import { StaticMap } from 'react-map-gl';
import DeckGL from '@deck.gl/react';
import { GeoJsonLayer } from '@deck.gl/layers';
import MapTooltip  from './MapTooltip';
import MapLegend from './MapLegend';
import { color } from "d3";
import {getInterpolatedColor, getNormalisedValue} from "../utils/mapUtil";
import * as mapTheme from "./mapTheme";

const styles = (theme) => ({
    map: {
        minHeight: theme.mapHeight,
        position: "relative",
    },
});


const mapStyle = 'mapbox://styles/mapbox/light-v9';
const MAPBOX_TOKEN = process.env.REACT_APP_MapboxAccessToken;

class InboundAccessibilityMap extends Component {

    getColor = (location) => {

        const { AB, locIdx, colorScheme, view } = this.props;
        const mapColorSchemeInterpolator = mapColorSchemeNameToInterpolator(colorScheme);
        const defaultColor = [0, 0, 0, 0];

        if(AB !== null) {

            let index = locIdx[location];
            let layer = AB[view];
            let nv = getNormalisedValue(layer, index);
            let c = getInterpolatedColor(nv, mapColorSchemeInterpolator);

            return c;

        } else {
            return defaultColor;
        }

    };

    onViewStateChange = vs => {
        const { setMapViewState } = this.props;
        setMapViewState(vs);
    };

    render() {
        const { classes, dataZones, mapViewState, AB, view, colorScheme, selectedDestination,
            selectedDataZone, destinationColor, originColor} = this.props;

        const layers = [
            new GeoJsonLayer({
                id: 'outbound',
                data: dataZones,
                opacity: 1,
                filled: true,
                stroked: false,
                getFillColor: f => this.getColor(f.id),
                updateTriggers: {
                    getFillColor: [AB, view, colorScheme],
                }
            }),
            new GeoJsonLayer({
                id: 'destination',
                data: dataZones,
                opacity: 1,
                filled: false,
                getLineWidth: f => {return (f.id === selectedDestination) ? 2 : 0 },
                lineWidthUnits: "pixels",
                getLineColor: destinationColor,
                stroked: true,
                updateTriggers: {
                    getLineWidth: selectedDestination,
                },
            }),
            new GeoJsonLayer({
                id: 'origin',
                data: dataZones,
                opacity: 1,
                filled: false,
                getLineWidth: f => {return (f.id === selectedDataZone) ? 2 : 0 },
                lineWidthUnits: "pixels",
                getLineColor: originColor,
                stroked: true,
                updateTriggers: {
                    getLineWidth: selectedDataZone,
                },
            }),
        ];

        return(
            <div className={classes.map}>
                <DeckGL
                    layers={layers}
                    initialViewState={mapViewState}
                    controller={true}
                    // onViewStateChange={ this.onViewStateChange }
                >
                    <StaticMap
                        reuseMaps
                        mapStyle={mapStyle}
                        preventStyleDiffing={true}
                        mapboxApiAccessToken={MAPBOX_TOKEN}
                    />
                    {/*{*/}
                    {/*    (eta !== null) ? (*/}
                    {/*        <MapLegend*/}
                    {/*            minValue={minValue}*/}
                    {/*            maxValue={maxValue}*/}
                    {/*            mapColorSchemeInterpolator={mapColorSchemeInterpolator}*/}
                    {/*            opacity={opacity}*/}
                    {/*            etaView={etaView}*/}
                    {/*        />) : null*/}
                    {/*}*/}
                    <MapTooltip />
                </DeckGL>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        mapViewState: state.mapViewState,
        dataZones: state.dataZones,
        dataZoneStats: state.dataZoneStats,
        selectedDataZone: state.selectedDataZone,
        tooltip: state.mapTooltip,
        locIdx: state.locIdx,
        AB: state.AB,
        view: state.view,
        colorScheme: state.mapColorScheme,
        selectedDestination: state.selectedDestination,
        destinationColor: state.destinationColor,
        originColor: state.originColor,
    }
};

const mapDispatchToProps = (dispatch) => {
    return ({
        setMapTooltip: (mapTooltip) => { dispatch(setMapTooltip(mapTooltip)) },
        setMapViewState: (mapViewState) => { dispatch(setMapViewState(mapViewState)) },
        // updateHover: (hoveredDataZone) => { dispatch(updateHover(hoveredDataZone)) },
    });
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withStyles(styles, {defaultTheme: mapTheme.theme})(InboundAccessibilityMap));
