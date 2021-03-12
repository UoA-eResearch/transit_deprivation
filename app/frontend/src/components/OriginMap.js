import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withStyles, createMuiTheme } from '@material-ui/core/styles';
import { mapColorSchemeNameToInterpolator } from "../utils/colorScheme";
import {
    updateHover,
    setMapTooltip,
    setMapViewState, updateSelectedDataZone,
} from "../store/actions";
// mapping
import { StaticMap } from 'react-map-gl';
import DeckGL from '@deck.gl/react';
import { GeoJsonLayer } from '@deck.gl/layers';
import {MapboxLayer} from '@deck.gl/mapbox';
import MapTooltip  from './DestinationMapTooltip';
import MapLegend from './MapLegend';
import { color } from "d3";
import * as mapTheme from "./mapTheme";
import * as basemapTypes from "./basemapTypes";

const styles = (theme) => ({
    map: {
        minHeight: theme.mapHeight,
        position: "relative",
    },
});

// const mapStyle = 'mapbox://styles/mapbox/light-v9';
const mapStyle = 'mapbox://styles/sansari/ckl7ad592603t17mq3xljnbcb'
const MAPBOX_TOKEN = process.env.REACT_APP_MapboxAccessToken;

class OriginMap extends Component {

    // https://deck.gl/docs/api-reference/mapbox/overview
    // https://docs.mapbox.com/mapbox-gl-js/example/geojson-layer-in-stack/

    constructor(props) {
        super(props);
        this.state = {glContext: null};
        this.deckRef = React.createRef();
        this.mapRef = React.createRef();
        this.onMapLoad = this.onMapLoad.bind(this);
    }

    onMapLoad(){

        const map = this.mapRef.current.getMap();
        const deck = this.deckRef.current.deck;

        var layers = map.getStyle().layers;
        // Find the index of the first symbol layer in the map style
        var firstSymbolId = "";
        for (var i = 0; i < layers.length; i++) {
            // console.log(layers[i].id, layers[i].type);
            if (layers[i].type === 'symbol'){
                firstSymbolId = layers[i].id;
                break;
            }
        }

        // You must initialize an empty deck.gl layer to prevent flashing
        map.addLayer(
            new MapboxLayer({ id: "origin", deck }),
            firstSymbolId
        );
        map.addLayer(
            new MapboxLayer({ id: "destination", deck }),
            firstSymbolId
        );
        map.addLayer(
            new MapboxLayer({ id: "base", deck }),
            firstSymbolId
        );
    }

    handleGeoJsonLayerOnClick = (event, info) => {
        const { updateSelectedDataZone } = this.props;
        updateSelectedDataZone(event.object.id);
    };

     getInterpolatedColor(value, interpolator){
        let c = interpolator(value);
        c = color(c).copy({opacity: 255})
        return [c.r, c.g, c.b, c.opacity];
    }

    getColor = (v, vmin, vmax, colorScheme) => {

        const mapColorSchemeInterpolator = mapColorSchemeNameToInterpolator(colorScheme);
        const nv = (v - vmin) / Math.max((vmax - vmin), 1);
        return this.getInterpolatedColor(nv, mapColorSchemeInterpolator);

    };

    onViewStateChange = vs => {
        const { setMapViewState } = this.props;
        setMapViewState(vs);
    };

    render() {
        const { classes, dataZones, dataZoneStats, mapViewState, mapOpacity, selectedDataZone, selectedDestination,
            destinationColor, originColor, destinationLineWidth, originLineWidth, basemap } = this.props;

        const colorScheme = "BlueGreen";

        const property = basemapTypes.basemapToProperty[basemap].property;
        const label = basemapTypes.basemapToProperty[basemap].label;

        let vmin = 0;
        let vmax = 100;
        if (property !== null){
            vmin = dataZoneStats[property].min;
            vmax = dataZoneStats[property].max;
        }

        const layers = [
            new GeoJsonLayer({
                id: 'base',
                data: dataZones,
                opacity: mapOpacity,
                filled: true,
                getFillColor: (f) => {
                    return (property === null) ? [0, 0, 0, 0] : this.getColor(f.properties[property], vmin, vmax, colorScheme)
                },
                onClick: (event, info) => {
                    info.handled = true;
                    this.handleGeoJsonLayerOnClick(event);
                },
                getLineWidth: f => {return (f.id === selectedDataZone) ? originLineWidth : 0 },
                lineWidthUnits: "pixels",
                getLineColor: originColor,
                stroked: true,
                pickable: true,
                // onHover: this.handleMapOnHover,
                updateTriggers: {
                    getFillColor: [colorScheme, basemap],

                },
            }),
            new GeoJsonLayer({
                id: 'destination',
                data: dataZones,
                opacity: mapOpacity,
                filled: true,
                getFillColor: [0, 0, 0, 0],
                getLineWidth: f => {return (f.id === selectedDestination) ? destinationLineWidth : 0 },
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
                opacity: mapOpacity,
                filled: false,
                getLineWidth: f => {return (f.id === selectedDataZone) ? originLineWidth : 0 },
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
                    ref={this.deckRef}
                    onWebGLInitialized={(glContext)=>{this.setState({'glContext':glContext})}}
                    glOptions={{
                        /* To render vector tile polygons correctly */
                        stencil: true
                    }}
                    layers={layers}
                    initialViewState={mapViewState}
                    controller={true}
                    // onViewStateChange={ this.onViewStateChange }
                >
                    {this.state.glContext && (
                        /* This is important: Mapbox must be instantiated after the WebGLContext is available */
                        <StaticMap
                            ref={this.mapRef}
                            gl={this.state.glContext}
                            mapStyle={mapStyle}
                            mapboxApiAccessToken={MAPBOX_TOKEN}
                            onLoad={this.onMapLoad}
                            preventStyleDiffing={true}
                        />
                    )}
                    <MapTooltip />
                    {(property === null) ? null : <MapLegend vmin={vmin} vmax={vmax} label={label}
                                                             colorScheme={colorScheme} name={"origin"}/>}
                </DeckGL>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        mapViewState: state.mapViewState,
        mapOpacity: state.mapOpacity,
        dataZones: state.dataZones,
        dataZoneStats: state.dataZoneStats,
        selectedDataZone: state.selectedDataZone,
        basemap: state.originBasemap,
        tooltip: state.mapTooltip,
        locIdx: state.locIdx,
        selectedDestination: state.selectedDestination,
        destinationColor: state.destinationColor,
        originColor: state.originColor,
        destinationLineWidth: state.destinationLineWidth,
        originLineWidth: state.originLineWidth,
    }
};

const mapDispatchToProps = (dispatch) => {
    return ({
        setMapTooltip: (mapTooltip) => { dispatch(setMapTooltip(mapTooltip)) },
        setMapViewState: (mapViewState) => { dispatch(setMapViewState(mapViewState)) },
        updateSelectedDataZone: (selectedDataZone) => { dispatch(updateSelectedDataZone(selectedDataZone)) },
    });
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withStyles(styles, {defaultTheme: mapTheme.theme})(OriginMap));
