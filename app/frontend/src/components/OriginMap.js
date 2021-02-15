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
import MapTooltip  from './MapTooltip';
import MapLegend from './MapLegend';
import { color } from "d3";
import * as mapTheme from "./mapTheme";

const styles = (theme) => ({
    map: {
        minHeight: theme.mapHeight,
        position: "relative",
    },
});

const mapStyle = 'mapbox://styles/mapbox/light-v9';
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
        var firstSymbolId;
        for (var i = 0; i < layers.length; i++) {
            // console.log(layers[i].id, layers[i].type);
            if (layers[i].type === 'symbol') {
                firstSymbolId = layers[i].id;
                break;
            }
        }

        // You must initialize an empty deck.gl layer to prevent flashing
        map.addLayer(
            new MapboxLayer({ id: "destination", deck }),
            firstSymbolId
        );
        map.addLayer(
            new MapboxLayer({ id: "origin", deck }),
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

    // new version
    getColor = (v) => {

        const { dataZoneStats } = this.props;
        const colorScheme = "BlueGreen";
        const mapColorSchemeInterpolator = mapColorSchemeNameToInterpolator(colorScheme);

        const vmin = dataZoneStats.IMD18.min;
        const vmax = dataZoneStats.IMD18.max;

        const nv = (v - vmin) / Math.max((vmax - vmin), 1);
        return this.getInterpolatedColor(nv, mapColorSchemeInterpolator);

    };

    onViewStateChange = vs => {
        const { setMapViewState } = this.props;
        setMapViewState(vs);
    };

    render() {
        const { classes, dataZones, mapViewState, selectedDataZone, selectedDestination,
            destinationColor, originColor } = this.props;

        const layers = [
            new GeoJsonLayer({
                id: 'origin',
                data: dataZones,
                opacity: 1,
                filled: true,
                getFillColor: f => this.getColor(f.properties.IMD18),
                onClick: (event, info) => {
                    info.handled = true;
                    this.handleGeoJsonLayerOnClick(event);
                },
                getLineWidth: f => {return (f.id === selectedDataZone) ? 2 : 0 },
                lineWidthUnits: "pixels",
                getLineColor: originColor,
                stroked: true,
                pickable: true,
                // onHover: this.handleMapOnHover,
                updateTriggers: {
                    getLineWidth: selectedDataZone,
                },
            }),
            new GeoJsonLayer({
                id: 'destination',
                data: dataZones,
                opacity: 1,
                filled: true,
                getFillColor: [0, 0, 0, 0],
                getLineWidth: f => {return (f.id === selectedDestination) ? 2 : 0 },
                lineWidthUnits: "pixels",
                getLineColor: destinationColor,
                stroked: true,
                updateTriggers: {
                    getLineWidth: selectedDestination,
                },
            })
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

                    {/*<StaticMap*/}
                    {/*    reuseMaps*/}
                    {/*    mapStyle={mapStyle}*/}
                    {/*    preventStyleDiffing={true}*/}
                    {/*    mapboxApiAccessToken={MAPBOX_TOKEN}*/}
                    {/*/>*/}
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
        selectedDestination: state.selectedDestination,
        destinationColor: state.destinationColor,
        originColor: state.originColor,
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
