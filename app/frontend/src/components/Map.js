import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withStyles, createMuiTheme } from '@material-ui/core/styles';
import { mapColorSchemeNameToInterpolator } from "../utils/colorScheme";
import { setSelectedDataZone,
         updateHover,
         setMapTooltip,
         setMapViewState,
         getLocationDT,
         reset} from "../store/actions";
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
        //maxWidth: "550px",
        position: "relative",
    },
});

const mapStyle = 'mapbox://styles/mapbox/light-v9';
const MAPBOX_TOKEN = process.env.REACT_APP_MapboxAccessToken;
// console.log(MAPBOX_TOKEN);
const INITIAL_VIEW_STATE = {
    latitude: -36.8485, // auckland
        longitude: 174.7633,
        zoom: 11,
        maxZoom: 16,
        pitch: 0,
        bearing: 0
};

class Map extends Component {

     _getNormalisedValue(layer, index){
        let v = layer["values"][index];
        let vmin = layer["min"];
        let vmax = layer["max"];
        let nv = (v - vmin) / Math.max((vmax - vmin), 1);
        return nv;
    }

     _getInterpolatedColor(value, interpolator){
        let c = interpolator(value);
        c = color(c).copy({opacity: 255})
        return [c.r, c.g, c.b, c.opacity];
    }

    // new version
    _getColorAB = (location) => {

        const { colorScheme, AB, view, locIdx} = this.props;
        const mapColorSchemeInterpolator = mapColorSchemeNameToInterpolator(colorScheme);
        const defaultColor = [128, 128, 128, 24];
        const inaccessibleColor = [128, 128, 128, 0];

        if(AB !== null) {
            // console.log(`loc: ${location} view: ${this.state.etaView} v: ${this.state.eta[this.state.etaView]["values"][location]}`);

            let index = locIdx[location];
            let layerAB = AB[view];
            let nvAB = this._getNormalisedValue(layerAB, index);
            let cAB = this._getInterpolatedColor(nvAB, mapColorSchemeInterpolator);

            return cAB;

        } else {
            return defaultColor;
        }
    };

    _getColorBC = (location) => {

        const { BC, view, locIdx} = this.props;
        const colorScheme = "OrangeRed";
        const mapColorSchemeInterpolator = mapColorSchemeNameToInterpolator(colorScheme);
        const defaultColor = [128, 128, 128, 24];
        const inaccessibleColor = [128, 128, 128, 0];

        if(BC !== null) {

            let index = locIdx[location];
            let layerBC = BC[view];
            let nvBC = this._getNormalisedValue(layerBC, index);
            let cBC = this._getInterpolatedColor(nvBC, mapColorSchemeInterpolator);

            return cBC;

        } else {
            return defaultColor;
        }
    };

    // https://observablehq.com/@d3/bivariate-choropleth
    _getColorBivariate = () => {

    }

    _handleDeckGLOnClick = (event, info) => {
        const { destinationOverlay, reset } = this.props;
        if (!info.handled){
            // reset the eta values
            reset();

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
        const { setMapTooltip, updateHover } = this.props;
        if (event.target.id !== "map-legend"){
            setMapTooltip({
                showHover: true,
                x: info.x,
                y: info.y,
                hoveredObject: info.object});
            updateHover(info.object);
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
            classes, clinics, colorScheme, dataZones, destinationOverlay, AB, BC,
            view, opacity, selectedDataZone,
        } = this.props;
        // const mapColorSchemeInterpolator = mapColorSchemeNameToInterpolator(colorScheme);

        const layers = [
            new GeoJsonLayer({
                id: 'AB',
                data: dataZones,
                opacity: 0.5,
                getLineWidth: f => this._matchesSelectedDataZone(f.id),
                stroked: true,
                filled: true,
                lineWidthUnits: "pixels",
                getFillColor: f => this._getColorAB(f.id),
                getLineColor: [255, 255, 255],
                onClick: (event, info) => {
                    info.handled = true;
                    this._handleGeoJsonLayerOnClick(event);
                },
                pickable: true,
                onHover: this._handleMapOnHover,
                updateTriggers: {
                    getFillColor: [AB, BC, view, colorScheme],
                    getLineWidth: selectedDataZone,
                },
            })
        ];

        if (BC !== null){
            layers.push(
                new GeoJsonLayer({
                    id: 'BC',
                    data: dataZones,
                    opacity: 0.5,
                    getLineWidth: f => this._matchesSelectedDataZone(f.id),
                    stroked: true,
                    filled: true,
                    lineWidthUnits: "pixels",
                    getFillColor: f => this._getColorBC(f.id),
                    getLineColor: [255, 255, 255],
                    onClick: (event, info) => {
                        info.handled = true;
                        this._handleGeoJsonLayerOnClick(event);
                    },
                    pickable: true,
                    onHover: this._handleMapOnHover,
                    updateTriggers: {
                        getFillColor: [AB, BC, view, colorScheme],
                        getLineWidth: selectedDataZone,
                    },
                })
            )
        }

        if (destinationOverlay === "Diabetes Clinics"){
            layers.push(
                new GeoJsonLayer({
                    id: 'clinics',
                    data: clinics,
                    pointRadiusMinPixels: 5,
                    getFillColor: [235, 52, 52, 255],
                })
            )
        }


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
        minValue: state.mapMinValue,
        maxValue: state.mapMaxValue,
        AB: state.AB,
        BC: state.BC,
        view: state.view,
        opacity: state.mapOpacity,
        colorScheme: state.mapColorScheme,
        destinationOverlay: state.destinationDataset,
        dataZones: state.dataZones,
        selectedDataZone: state.selectedDataZone,
        clinics: state.clinics,
        tooltip: state.mapTooltip,
        locIdx: state.locIdx,
    }
};

const mapDispatchToProps = (dispatch) => {
    return ({
        getLocationDT: (location) => { dispatch(getLocationDT(location)) },
        reset: () => { dispatch(reset()) },
        setMapTooltip: (mapTooltip) => { dispatch(setMapTooltip(mapTooltip)) },
        setMapViewState: (mapViewState) => { dispatch(setMapViewState(mapViewState)) },
        setSelectedDataZone: (selectedDataZone) => { dispatch(setSelectedDataZone(selectedDataZone)) },
        updateHover: (hoveredDataZone) => { dispatch(updateHover(hoveredDataZone)) },
    });
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withStyles(styles, {defaultTheme: theme})(Map));
