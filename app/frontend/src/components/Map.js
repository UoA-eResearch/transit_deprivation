import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withStyles, createMuiTheme } from '@material-ui/core/styles';
import { mapColorSchemeNameToInterpolator } from "../utils/ColorScheme";
import { setSelectedDataZone,
         setMapTooltip,
         setMapViewState,
         getLocationDT,
         resetETA } from "../store/actions";
// mapping
import { StaticMap } from 'react-map-gl';
import DeckGL from '@deck.gl/react';
import { GeoJsonLayer } from '@deck.gl/layers';
import MapTooltip  from './MapTooltip';
import MapLegend from './MapLegend';
import { color } from "d3";

const theme = createMuiTheme({
    palette: {
        type: "light",
    },
});

const styles = (theme) => ({
    map: {
        minHeight: "550px",
    },
});

const mapStyle = 'mapbox://styles/mapbox/light-v9';
const MAPBOX_TOKEN = process.env.REACT_APP_MapboxAccessToken;
console.log(MAPBOX_TOKEN);
const INITIAL_VIEW_STATE = {
    latitude: -36.8485, // auckland
        longitude: 174.7633,
        zoom: 11,
        maxZoom: 16,
        pitch: 0,
        bearing: 0
};

class Map extends Component {

    /**
    constructor(props) {
        super(props);
        this.state = {
            layers: [],
        };
    }
     **/

    /**
    componentDidMount() {
        const { dataZones, opacity, eta, etaView, colorScheme, selectedDataZone } = this.props;
        this.setState({
            layers: [
                new GeoJsonLayer({
                    id: 'eta',
                    data: dataZones,
                    opacity: opacity,
                    getLineWidth: f => this._matchesSelectedDataZone(f.id),
                    stroked: true,
                    filled: true,
                    lineWidthUnits: "pixels",
                    getFillColor: f => this._getColor(f.id),
                    getLineColor: [255, 255, 255],
                    onClick: (event, info) => {
                        info.handled = true;
                        this._handleGeoJsonLayerOnClick(event);
                    },
                    pickable: true,
                    onHover: this._handleMapOnHover,
                    updateTriggers: {
                        getFillColor: [eta, etaView, colorScheme],
                        getLineWidth: selectedDataZone,
                    },
                })
            ]
        });
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        const { clinics, destinationOverlay } = this.props;
        if (prevProps.destinationOverlay !== destinationOverlay) {
            // add dataset specific layers

            if (destinationOverlay === "Diabetes Clinics") {
                this.layers.push(
                    new GeoJsonLayer({
                        id: 'clinics',
                        data: clinics,
                        pointRadiusMinPixels: 5,
                        getFillColor: [235, 52, 52, 255],
                    })
                )
            }

        }
    }
    **/

    _getColor = (location) => {
        const { colorScheme, eta, etaView, } = this.props;
        const mapColorSchemeInterpolator = mapColorSchemeNameToInterpolator(colorScheme);
        const defaultColor = [128, 128, 128, 24];
        const inaccessibleColor = [128, 128, 128, 0];
        if(eta !== null) {
            // console.log(`loc: ${location} view: ${this.state.etaView} v: ${this.state.eta[this.state.etaView]["values"][location]}`);
            let view = etaView;
            if (location in eta[view]["values"]){
                let v = eta[view]["values"][location];
                let vmin = eta[view]["min"];
                let vmax = eta[view]["max"];

                let nv = (v - vmin) / Math.max((vmax - vmin), 1);
                let a = eta["avail"]["values"][location] * 255;
                let c = mapColorSchemeInterpolator(nv);
                c = color(c).copy({opacity: a})

                //return [c.r, c.g, c.b, c.opacity];
                return [c.r, c.g, c.b];
            } else {
                return inaccessibleColor;
            }
        } else {
            return defaultColor;
        }
    };

    _handleDeckGLOnClick = (event, info) => {
        const { destinationOverlay, resetETA } = this.props;
        if (!info.handled){
            // reset the eta values
            resetETA();
            setSelectedDataZone(null);

            // any dataset specific behaviour
            if (destinationOverlay === "Diabetes Clinics"){
                // do something special for clinic locations
            }
            console.log(`DeckGL handled`);
        }
    };

    _handleGeoJsonLayerOnClick = (event, info) => {
        const { destinationOverlay, getLocationDT, setSelectedDataZone } = this.props;

        console.log(`GeoJson handled, location ${event.object.id}`);
        getLocationDT(event.object.id); // get location destination-time data and compute stats

        setSelectedDataZone(event.object.id);
        // any dataset specific behaviour
        if (destinationOverlay === "Diabetes Clinics"){
            // do something special for clinic locations
            //console.log(`${ds} onclick handler`)
        }
    };

    _handleMapOnHover = (info, event) => {
        const { setMapTooltip } = this.props;
        if (event.target.id !== "map-legend"){
            setMapTooltip({
                showHover: true,
                x: info.x,
                y: info.y,
                hoveredObject: info.object});
        } else {
            setMapTooltip({showHover: false});
        }
    };

    _matchesSelectedDataZone = (datazone) => {
        const { selectedDataZone } = this.props;
        return (selectedDataZone === datazone) ? 2 : 0;
    };

    _onViewStateChange = vs => {
        const { setMapViewState } = this.props;
        setMapViewState(vs);
    };

    render() {
        const {
            classes, clinics, colorScheme, dataZones, destinationOverlay, eta,
            etaView, minValue, maxValue, opacity, selectedDataZone,
        } = this.props;
        const mapColorSchemeInterpolator = mapColorSchemeNameToInterpolator(colorScheme);

        const layers = [
            new GeoJsonLayer({
                id: 'eta',
                data: dataZones,
                opacity: opacity,
                getLineWidth: f => this._matchesSelectedDataZone(f.id),
                stroked: true,
                filled: true,
                lineWidthUnits: "pixels",
                getFillColor: f => this._getColor(f.id),
                getLineColor: [255, 255, 255],
                onClick: (event, info) => {
                    info.handled = true;
                    this._handleGeoJsonLayerOnClick(event);
                },
                pickable: true,
                onHover: this._handleMapOnHover,
                updateTriggers: {
                    getFillColor: [eta, etaView, colorScheme],
                    getLineWidth: selectedDataZone,
                },
            })
        ];

        return(
            <div className={classes.map}>
                <DeckGL
                    layers={layers}
                    initialViewState={INITIAL_VIEW_STATE}
                    controller={true}
                    onClick={ this._handleDeckGLOnClick }
                    onViewStateChange={ this._onViewStateChange }
                >
                    <StaticMap
                        reuseMaps
                        mapStyle={mapStyle}
                        preventStyleDiffing={true}
                        mapboxApiAccessToken={MAPBOX_TOKEN}
                    />
                    {
                        //valid ? (
                        (eta !== null) ? (
                            <MapLegend
                                minValue={minValue}
                                maxValue={maxValue}
                                mapColorSchemeInterpolator={mapColorSchemeInterpolator}
                                opacity={opacity}
                                etaView={etaView}
                            />) : null
                    }
                    <MapTooltip />
                    {/*props.renderMapTooltip()*/}
                </DeckGL>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        minValue: state.mapMinValue,
        maxValue: state.mapMaxValue,
        eta: state.eta,
        etaView: state.etaView,
        opacity: state.mapOpacity,
        colorScheme: state.mapColorScheme,
        destinationOverlay: state.destinationDataset,
        dataZones: state.dataZones,
        selectedDataZone: state.selectedDataZone,
        clinics: state.clinics,
        tooltip: state.mapTooltip,
    }
};

const mapDispatchToProps = (dispatch) => {
    return ({
        getLocationDT: (location) => { dispatch(getLocationDT(location)) },
        resetETA: () => { dispatch(resetETA()) },
        setMapTooltip: (mapTooltip) => { dispatch(setMapTooltip(mapTooltip)) },
        setMapViewState: (mapViewState) => { dispatch(setMapViewState(mapViewState)) },
        setSelectedDataZone: (selectedDataZone) => { dispatch(setSelectedDataZone(selectedDataZone)) },
    });
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withStyles(styles, {defaultTheme: theme})(Map));
