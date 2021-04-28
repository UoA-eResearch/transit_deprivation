import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import {getLocationDT, setMapViewState, setDestinationDataZone} from "../store/actions";
import { StaticMap } from 'react-map-gl';
import DeckGL from '@deck.gl/react';
import { GeoJsonLayer } from '@deck.gl/layers';
import {MapboxLayer} from '@deck.gl/mapbox';
import * as destinationTypes from './destinationTypes';
import * as mapTheme from "./mapTheme";
import DestinationMapTooltip from "./DestinationMapTooltip";
import * as basemapTypes from "../components/basemapTypes";
import {mapColorSchemeNameToInterpolator} from "../utils/colorScheme";
import {color} from "d3";
import MapLegend from "./MapLegend";

const styles = (theme) => ({
    map: {
        minHeight: theme.mapHeight,
        position: "relative",
    },
});


// const mapStyle = 'mapbox://styles/mapbox/light-v9';
const mapStyle = 'mapbox://styles/sansari/ckl7ad592603t17mq3xljnbcb'
const MAPBOX_TOKEN = process.env.REACT_APP_MapboxAccessToken;

class DestinationMap extends Component {

    constructor(props) {
        super(props);
        this.state = {
            glContext: null,
            hoverInfo: null,
        };
        this.deckRef = React.createRef();
        this.mapRef = React.createRef();
        this.onMapLoad = this.onMapLoad.bind(this);
    }

    onMapLoad(){

        const {destinationDataset} = this.props

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
            new MapboxLayer({ id: "destination", deck }),
            firstSymbolId
        );
        map.addLayer(
            new MapboxLayer({ id: "origin", deck }),
            firstSymbolId
        );
        if (destinationDataset !== destinationTypes.DESTINATION_NONE){
            map.addLayer(
                new MapboxLayer({ id: "points", deck }),
                firstSymbolId
            );
        }
    }

    handleGeoJsonLayerOnClick = (event, info) => {
        const { getLocationDT, setDestinationDataZone } = this.props;

        const location = event.object.properties.DZ2018
        setDestinationDataZone(location);
        getLocationDT(location); // get location destination-time data and compute stats
    };

    onViewStateChange = vs => {
        const { setMapViewState } = this.props;
        setMapViewState(vs);
    };

    getColor = (v, colorScheme, vmin, vmax) => {

        // const { } = this.props;
        const mapColorSchemeInterpolator = mapColorSchemeNameToInterpolator(colorScheme);

        const nv = (v - vmin) / Math.max((vmax - vmin), 1);
        return this.getInterpolatedColor(nv, mapColorSchemeInterpolator);

    };

    getInterpolatedColor(value, interpolator){
        let c = interpolator(value);
        c = color(c).copy({opacity: 255})
        return [c.r, c.g, c.b, c.opacity];
    }

    render() {

        const { classes, mapViewState, mapOpacity, dataZones, dataZoneStats, destinationDataset, destinations,
            selectedDestination, selectedDataZone, destinationColor, originColor, destinationLineWidth, originLineWidth,
            basemap } = this.props;

        const property = basemapTypes.basemapToProperty[basemap].property;
        const label = basemapTypes.basemapToProperty[basemap].label;

        const colorScheme = "Blues";
        let vmin = 0;
        let vmax = 100;

        if (property !== null){
            vmin = dataZoneStats[property].min;
            vmax = dataZoneStats[property].max;
        }

        const layers = [
            new GeoJsonLayer({
                id: 'destination',
                data: dataZones,
                opacity: mapOpacity,
                filled: true,
                getFillColor: (f) => {
                    return (property === null) ? [0, 0, 0, 0] : this.getColor(f.properties[property], colorScheme, vmin, vmax)
                },
                onClick: (event, info) => {
                    info.handled = true;
                    this.handleGeoJsonLayerOnClick(event);
                },
                getLineWidth: f => {return (f.id === selectedDestination) ? destinationLineWidth : 0 },
                lineWidthUnits: "pixels",
                getLineColor: destinationColor,
                stroked: true,
                pickable: true,
                updateTriggers: {
                    getLineWidth: selectedDestination,
                    getFillColor: basemap
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
        layers.push(
            new GeoJsonLayer({
                id: 'points',
                data: destinations[destinationDataset],
                pointRadiusMinPixels: 5,
                getFillColor: destinationColor,
                pickable: true,
                onHover: info => this.setState({hoverInfo: info}),
                onClick: (event, info) => {
                    info.handled = true;
                    this.handleGeoJsonLayerOnClick(event);
                },
            })
        )

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
                    <DestinationMapTooltip hoverInfo={this.state.hoverInfo}/>
                    {(property === null) ? null : <MapLegend vmin={vmin} vmax={vmax} label={label}
                                                             colorScheme={colorScheme} name={"destination"}/>}
                </DeckGL>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        dataZones: state.dataZones,
        dataZoneStats: state.dataZoneStats,
        mapOpacity: state.mapOpacity,
        mapViewState: state.mapViewState,
        destinations: state.destinations,
        destinationDataset: state.destinationDataset,
        basemap: state.destinationBasemap,
        selectedDestination: state.selectedDestination,
        selectedDataZone: state.selectedDataZone,
        destinationColor: state.destinationColor,
        originColor: state.originColor,
        destinationLineWidth: state.destinationLineWidth,
        originLineWidth: state.originLineWidth,
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
