import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withStyles, createMuiTheme } from '@material-ui/core/styles';
import {getLocationDT, setMapViewState, setDestinationDataZone} from "../store/actions";
import { StaticMap } from 'react-map-gl';
import DeckGL from '@deck.gl/react';
import { GeoJsonLayer } from '@deck.gl/layers';
import * as destinationTypes from './destinationTypes';
import * as mapTheme from "./mapTheme";

const styles = (theme) => ({
    map: {
        minHeight: theme.mapHeight,
        position: "relative",
    },
});


const mapStyle = 'mapbox://styles/mapbox/light-v9';
const MAPBOX_TOKEN = process.env.REACT_APP_MapboxAccessToken;

class DestinationMap extends Component {

    handleGeoJsonLayerOnClick = (event, info) => {
        const { getLocationDT, setDestinationDataZone } = this.props;

        // for poly:
        const location = event.object.id;

        // for points
        // const location = event.object.properties.DZ2018

        setDestinationDataZone(location);
        getLocationDT(location); // get location destination-time data and compute stats
    };

    onViewStateChange = vs => {
        const { setMapViewState } = this.props;
        setMapViewState(vs);
    };

    render() {
        const { classes, mapViewState, dataZones, destinationDataset, destinations, selectedDestination } = this.props;

        const destColor = [235, 52, 52, 255];

        const layers = [
            new GeoJsonLayer({
                id: 'destination-base',
                data: dataZones,
                opacity: 1,
                filled: true,
                getFillColor: [0, 0, 0, 0],
                onClick: (event, info) => {
                    info.handled = true;
                    this.handleGeoJsonLayerOnClick(event);
                },
                getLineWidth: f => {return (f.id === selectedDestination) ? 2 : 0 },
                lineWidthUnits: "pixels",
                getLineColor: destColor,
                stroked: true,
                pickable: true,
                // onHover: this.handleMapOnHover,
                updateTriggers: {
                    getLineWidth: selectedDestination,
                },

            })
        ];
        if (destinationDataset !== destinationTypes.DESTINATION_NONE){
            layers.push(
                new GeoJsonLayer({
                    id: 'destination-points',
                    data: destinations[destinationDataset],
                    pointRadiusMinPixels: 5,
                    getFillColor: destColor,
                    // pickable: true,
                    // onClick: (event, info) => {
                    //     console.log('points');
                    //     // info.handled = true;
                    //     // this.handleGeoJsonLayerOnClick(event);
                    // },
                })
            )
        }

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
                </DeckGL>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        dataZones: state.dataZones,
        mapViewState: state.mapViewState,
        destinations: state.destinations,
        destinationDataset: state.destinationDataset,
        selectedDestination: state.selectedDestination
    }
};

const mapDispatchToProps = (dispatch) => {
    return ({
        setMapViewState: (mapViewState) => { dispatch(setMapViewState(mapViewState)) },
        setDestinationDataZone: (location) => { dispatch(setDestinationDataZone(location)) },
        getLocationDT: (location) => { dispatch(getLocationDT(location)) },
    });
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withStyles(styles, {defaultTheme: mapTheme.theme})(DestinationMap));
