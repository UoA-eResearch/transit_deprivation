import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import { mapColorSchemeNameToInterpolator } from "../utils/colorScheme";
import { setMapTooltip, setMapViewState } from "../store/actions";

// mapping
import { StaticMap } from 'react-map-gl';
import DeckGL from '@deck.gl/react';
import { GeoJsonLayer } from '@deck.gl/layers';
import {MapboxLayer} from '@deck.gl/mapbox';
import MapTooltip  from './DestinationMapTooltip';
import MapLegend from './MapLegend';
import {getInterpolatedColor, getNormalisedValue} from "../utils/mapUtil";
import * as mapTheme from "./mapTheme";

const styles = (theme) => ({
    map: {
        minHeight: theme.mapHeight,
        position: "relative",
    },
});


// const mapStyle = 'mapbox://styles/mapbox/light-v9';
const mapStyle = 'mapbox://styles/sansari/ckl7ad592603t17mq3xljnbcb'
const MAPBOX_TOKEN = process.env.REACT_APP_MapboxAccessToken;

class InboundAccessibilityMap extends Component {

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
            new MapboxLayer({ id: "inbound", deck }),
            firstSymbolId
        );
        map.addLayer(
            new MapboxLayer({ id: "destination", deck }),
            firstSymbolId
        );
        map.addLayer(
            new MapboxLayer({ id: "origin", deck }),
            firstSymbolId
        );
        map.addLayer(
            new MapboxLayer({ id: "routes", deck }),
            firstSymbolId
        );
    }

    getColor = (location, colorScheme) => {

        const { AB, locIdx, view } = this.props;
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
        const { classes, dataZones, routes, mapOpacity, mapViewState, AB, view, selectedDestination,
                selectedDataZone, destinationColor, originColor, destinationLineWidth, originLineWidth, showTransitNetwork,
            } = this.props;

        const colorScheme = "Viridis";

        const layers = [
            new GeoJsonLayer({
                id: 'inbound',
                data: dataZones,
                opacity: mapOpacity,
                filled: true,
                stroked: false,
                getFillColor: f => this.getColor(f.id, colorScheme),
                updateTriggers: {
                    getFillColor: [AB, view, colorScheme],
                }
            }),
            new GeoJsonLayer({
                id: 'destination',
                data: dataZones,
                opacity: mapOpacity,
                filled: false,
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
            new GeoJsonLayer({
                id: 'routes',
                data: routes,
                opacity: mapOpacity,
                getLineWidth: 2,
                lineWidthScale: 10,
                visible: showTransitNetwork,
                getLineColor: [164, 164, 164, 32],
                updateTriggers: {
                    getLineColor: showTransitNetwork
                }
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
                    { (AB !== null) ? <MapLegend vmin={0} vmax={100} label={"Percentage of trips"}
                                                 colorScheme={colorScheme} name={"inbound"}/> : null}
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
        tooltip: state.mapTooltip,
        locIdx: state.locIdx,
        AB: state.AB,
        view: state.view,
        selectedDestination: state.selectedDestination,
        destinationColor: state.destinationColor,
        originColor: state.originColor,
        destinationLineWidth: state.destinationLineWidth,
        originLineWidth: state.originLineWidth,
        routes: state.routes,
        showTransitNetwork: state.showTransitNetwork,
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
