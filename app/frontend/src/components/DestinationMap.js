import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withStyles, createMuiTheme } from '@material-ui/core/styles';
import {getLocationDT, setMapViewState} from "../store/actions";
import { StaticMap } from 'react-map-gl';
import DeckGL from '@deck.gl/react';
import { GeoJsonLayer } from '@deck.gl/layers';
import * as destinationTypes from './destinationTypes';


const theme = createMuiTheme({
    palette: {
        type: "light",
    },
});

const styles = (theme) => ({
    map: {
        minHeight: "550px",
        position: "relative",
    },
});

const mapStyle = 'mapbox://styles/mapbox/light-v9';
const MAPBOX_TOKEN = process.env.REACT_APP_MapboxAccessToken;

class DestinationMap extends Component {

    handleGeoJsonLayerOnClick = (event, info) => {
        const { getLocationDT } = this.props;
        getLocationDT(event.object.properties.DZ2018); // get location destination-time data and compute stats
    };

    onViewStateChange = vs => {
        const { setMapViewState } = this.props;
        setMapViewState(vs);
    };

    render() {
        const { classes, mapViewState, destinationDataset, destinations } = this.props;

        const layers = [];

        if (destinationDataset !== destinationTypes.DESTINATION_NONE){
            layers.push(
                new GeoJsonLayer({
                    id: 'destinations',
                    data: destinations[destinationDataset],
                    pointRadiusMinPixels: 5,
                    getFillColor: [235, 52, 52, 255],
                    pickable: true,
                    onClick: (event, info) => {
                        info.handled = true;
                        this.handleGeoJsonLayerOnClick(event);
                    },
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
        mapViewState: state.mapViewState,
        destinations: state.destinations,
        destinationDataset: state.destinationDataset,
    }
};

const mapDispatchToProps = (dispatch) => {
    return ({
        setMapViewState: (mapViewState) => { dispatch(setMapViewState(mapViewState)) },
        getLocationDT: (location) => { dispatch(getLocationDT(location)) },
    });
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withStyles(styles, {defaultTheme: theme})(DestinationMap));
