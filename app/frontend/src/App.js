import { hot } from 'react-hot-loader/root';
import React, {Component, useMemo} from "react";

import { makeStyles, withStyles, createMuiTheme} from '@material-ui/core/styles';
//import Typography from '@material-ui/core/Typography';
import {Paper, Grid, Slider, Select, MenuItem, Typography} from '@material-ui/core';

// mapping
import {StaticMap} from 'react-map-gl';
import DeckGL from '@deck.gl/react';
import {GeoJsonLayer} from '@deck.gl/layers';
const MAPBOX_TOKEN = process.env.MapboxAccessToken;

// plot colors https://github.com/d3/d3-scale-chromatic
import {color, scaleSequential, scaleLinear} from "d3";
import {interpolateViridis, interpolateTurbo} from 'd3-scale-chromatic'
import {ContinuousColorLegend} from 'react-vis';
import {XYPlot, XAxis, YAxis, HorizontalGridLines, LineSeries} from 'react-vis';
import '../node_modules/react-vis/dist/style.css';

import ContainerDimensions from 'react-container-dimensions'

// Source data GeoJSON
import * as data from "../data/akl/akl_polygons_id.geojson"
import * as akl_idx_loc from "../data/akl/akl_idx_loc.json"
import * as akl_loc_idx from "../data/akl/akl_loc_idx.json"


const INITIAL_VIEW_STATE = {
    latitude: -36.8485, // auckland
    longitude: 174.7633,
    zoom: 11,
    maxZoom: 16,
    pitch: 0,
    bearing: 0
};

const theme = createMuiTheme({

    palette: {
        type: "light",
    },
});

const styles = (theme) => ({
    root: {
        flex: 1,
        //background: grey[900],
    },
    paper: {
        padding: theme.spacing(2),
        color: theme.palette.text.secondary,
        background: theme.palette.background.paper
    },
    slider: {

    },
    mapColorSchemeSelector: {
      minWidth: "150px"
    },
    mapLegend: {
        x: 0,
        y: 0,
        maxWidth: "310px",
        color: theme.palette.text.secondary,
        background: theme.palette.background.paper,
        padding: theme.spacing(2)

    },
    colorBar: {
        color: theme.palette.text.secondary,
        fontSize: "10px",
        textAnchor: "middle",
    },
    map: {
        minHeight: "800px"
    },
    tooltip: {
        pointerEvents: "none",
        position: "absolute",
        zIndex: 9,
        padding: "8px",
        background: "#000",
        color: "#fff",
        minWidth: "160px",
        maxHeight: "240px",
        overflowY: "hidden",
    }
});

function TimeLimitSlider(props) {
    const classes = makeStyles(styles)();

    return (
        <div>
            <Typography gutterBottom>
                Time Limit: {props.value} minutes
            </Typography>
            <Slider
                className={classes.slider}
                defaultValue={60}
                onChange={(event, value) => props.onChange(value)}
                getAriaValueText={(value) => {`${value}`}}
                aria-labelledby="discrete-slider"
                valueLabelDisplay="auto"
                step={10}
                marks
                min={10}
                max={300}
            />
        </div>
    );
}

function MapLegend(props){

    const classes = makeStyles(styles)();

    let vmin = 0;
    let vmax = props.maxValue;
    let width = 300;
    let height = 8;
    let xpad = 5;

    let colorScale = scaleSequential([0, 1], props.mapColorSchemeInterpolator);
    let tickScale = scaleLinear().domain([0, 1]).range([vmin, vmax]);
    let tickValues = tickScale.ticks().map(value => Math.round(tickScale(value)));
    let tickOffset = width / (tickValues.length - 1);

    // https://wattenberger.com/blog/react-and-d3
    // https://www.visualcinnamon.com/2016/05/smooth-color-legend-d3-svg-gradient

    // const ticks = useMemo(() => {
    //     const xScale = scaleLinear()
    //         .domain([0, 1])
    //         .range([vmin, vmax])
    //     return xScale.ticks()
    //         .map(value => ({
    //             value,
    //             xOffset: xScale(value)
    //         }))
    // }, []);

    return (
      <Paper className={classes.mapLegend}>
         <svg width="400" height="28" version="1.1" xmlns="http://www.w3.org/2000/svg">
             <defs>
                 <linearGradient id="Gradient">
                     {
                         tickScale.ticks().map((value, index) => (
                             //console.log(`${index} ${value} ${colorScale(value)}`)
                             <stop key={`stop-${index}`} offset={`${value*100}%`} stopColor={colorScale(value)}/>
                         ))

                     }
                 </linearGradient>
             </defs>
             <rect
                 x={xpad}
                 y="0"
                 width={width}
                 height={height}
                 stroke="transparent"
                 strokeWidth="1"
                 fill="url(#Gradient)"
             />
             {
                 tickValues.map((value, index) => (
                     // console.log(`${value} ${index} ${index * tickOffset}`)
                     <g
                         key={`tick-${index}`}
                         transform={`translate(${xpad + index * tickOffset}, 0)`}
                     >
                         <text
                             key={`tickValue-${index}`}
                             className={classes.colorBar}
                             fill={"currentColor"}
                             style={{
                                 transform: `translateY(${height + 20}px)`
                             }}>
                             { value }
                         </text>
                     </g>
                 ))
             }
         </svg>
      </Paper>
    );
}

function Map(props){
    const classes = makeStyles(styles)();
    const mapStyle = 'mapbox://styles/mapbox/light-v9';

    const layers = [
        new GeoJsonLayer({
            id: 'geojson',
            data,
            opacity: 0.8,
            stroked: false,
            filled: true,
            getFillColor: f => props.getColor(f.id),
            getLineColor: [255, 255, 255],
            onClick: (event, info) => {info.handled = true; props.handleGeoJsonLayerOnClick(event)},
            pickable: true,
            onHover: props.onHover,
            updateTriggers: props.updateTriggers,
        })
    ];

    return (
        <div className={classes.map}>
            <DeckGL
                layers={layers}
                initialViewState={INITIAL_VIEW_STATE}
                controller={true}
                onClick={(event, info) => props.deckGLOnClick(event, info)}
            >
                <StaticMap
                    reuseMaps
                    mapStyle={mapStyle}
                    preventStyleDiffing={true}
                    mapboxApiAccessToken={MAPBOX_TOKEN}
                />
                {
                    props.valid ? (
                    <MapLegend
                        maxValue={props.maxEta}
                        mapColorSchemeInterpolator={props.mapColorSchemeInterpolator}
                    />) : null
                }
                {props.renderMapTooltip()}
            </DeckGL>
        </div>

    );
}

function MapColorSchemePicker(props){
    const classes = makeStyles(styles)();

    return (
        <div>
            <Typography gutterBottom>
                Map Colour Scheme
            </Typography>
            <Select
                className={classes.mapColorSchemeSelector}
                value={props.colorScheme}
                onChange={props.handleChange}
            >
                <MenuItem value={"Viridis"}>Viridis</MenuItem>
                <MenuItem value={"Turbo"}>Turbo</MenuItem>
            </Select>
        </div>
    );
}

class App extends Component{

    constructor(props){
        super(props);
        this.state = {
            timeLimit: 60, // minutes
            idxLoc: akl_idx_loc["default"],
            locIdx: akl_loc_idx["default"],
            locationDT: null,
            eta: null,
            maxEta: 1,
            reliability: null,
            valid: false,
            mapColorScheme: "Viridis",
            mapColorSchemeInterpolator: interpolateViridis,

        }
        this._renderMapTooltip = this._renderMapTooltip.bind(this);
    };

    _handleGeoJsonLayerOnClick(event, info){
        //console.log(`GeoJson handled, location ${event.object.id}`);
        this._viewMeanETA(event.object.id);
    }

    _handleDeckGLOnClick(event, info){
        if (!info.handled){
            //console.log(`DeckGL handled`);
            this._resetETA();
        }
    }

    _handleTimeLimitChange(value){
        //console.log(`called with ${value}`)
        this.setState({timeLimit: value}, () => {this._computeMeanETA()});
    }

    _handleMapOnHover({x, y, object}) {
        this.setState({x, y, hoveredObject: object});
        //console.log({x, y, object})
    }

    _handleMapColorSchemeChange(event){
        const colorScheme = event.target.value;
        let interp = () => {}
        switch(colorScheme){
            case "Viridis":
                interp = interpolateViridis;
                break;
            case "Turbo":
                interp = interpolateTurbo;
                break;
        }

        this.setState({mapColorScheme: colorScheme, mapColorSchemeInterpolator:interp})
    }

    _renderMapTooltip() {
        const {x, y, hoveredObject, valid} = this.state;
        const {classes} = this.props;

        if(hoveredObject){
            let mean = Math.round(this.state.eta[hoveredObject.id]);
            let rel = Math.round(this.state.reliability[hoveredObject.id] * 100);
            let infoStr = this.state.eta[hoveredObject.id] === -1 ? "Inaccessible" : `Mean ETA ${mean} minutes, reliability: ${rel} %`;

            return (
                <div className={classes.tooltip} style={{top: y, left: x}}>
                    <div>
                        <Typography variant="subtitle2">
                            <b>ID: {hoveredObject.id}</b>
                        </Typography>
                    </div>
                    {
                        valid ? (
                            <div>
                                <Typography variant="subtitle2">
                                    {infoStr}
                                </Typography>
                            </div>
                        ) : null
                    }
                </div>
            );
        }
    }

    _getColor(location) {
        const defaultColor = [128, 128, 128, 64];
        const inaccessibleColor = [128, 128, 128, 0];
        if (this.state.valid){
            if (this.state.eta[location] === -1){
                return inaccessibleColor;
            } else {
                let v = this.state.eta[location] / this.state.maxEta;
                let a = this.state.reliability[location] * 255;
                let c = this.state.mapColorSchemeInterpolator(v);
                c = color(c).copy({opacity: a})

                return [c.r, c.g, c.b, c.opacity];
            }
        } else {
            return defaultColor;
        }

    }

    // TODO change to handling arbitrary function on locationDT update, not just meanETA
    _getLocationDT(location) {

        let region = "akl";
        let url = `http://130.216.217.4:8081/transit?region=${region}&location=${location}`;
        fetch(url)
            .then(response => response.json())
            .then((data) => {
                this.setState({locationDT: data}, () => {this._computeMeanETA()});
            })
            .catch((error) => {
                console.error(error)
            })

    }

    _resetETA(){
        let eta = {};
        for (let i = 0; i < Object.keys(this.state.idxLoc).length; i++) {
            eta[this.state.idxLoc[i]] = -1;
        }
        this.setState({locationDT: null, eta: eta, maxEta: 1, valid: false});
    }

    _computeMeanETA() {

        const data = this.state.locationDT;
        if (data === null){
            return;
        }

        const nloc = data.length
        const ntimes = data[0].length

        let count = new Array(nloc).fill(0);
        let sum = new Array(nloc).fill(0);

        // find valid journeys
        let t = 0
        for (let i = 0; i < nloc; i++) {
            for (let j = 0; j < ntimes; j++) {
                t = data[i][j]
                if (t > -1 && t < this.state.timeLimit) {
                    count[i] += 1;
                    sum[i] += t;
                }
            }
        }

        // mean eta from origin to each destinations
        let eta = {};
        let v = -1;
        let maxEta = 1;
        for (let i = 0; i < nloc; i++) {
            v = count[i] > 0 ? sum[i] / count[i] : -1;
            //console.log(`${i}: ${this.state.idxLoc[i]}, v: ${v}, maxEta: ${maxEta}`)
            maxEta = v > maxEta ? v : maxEta;

            eta[this.state.idxLoc[i]] = v;
        }

        // reliability is ratio of valid journeys / total possible journeys to each destination
        let rel = {};
        for (let i = 0; i < nloc; i++) {
            rel[this.state.idxLoc[i]] = count[i] / ntimes;
            //console.log(`${count[i]}, ${ntimes}, ${count[i]/ntimes}`);
        }


        //console.log(`maxEta: ${maxEta}`)
        this.setState({eta: eta, maxEta: maxEta, reliability: rel, valid: true});
    }

    _viewMeanETA(location) {
        //console.log(`view mean eta for ${location}`);
        this._getLocationDT(location);
    }

    render(){

        const {classes} = this.props;

        return (
            <div className={classes.root}>
                <Grid container spacing={3}>
                    <Grid item xs={4}>
                        <Grid container direction="column" spacing={3}>
                            <Grid item>
                                <Paper className={classes.paper}>
                                    <Typography variant="h4" gutterBottom>
                                        Transit & Deprivation
                                    </Typography>
                                    <Typography variant="body1">
                                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                                    </Typography>
                                </Paper>
                            </Grid>
                            <Grid item>
                                <Paper className={classes.paper}>
                                    <TimeLimitSlider
                                        value={this.state.timeLimit}
                                        onChange={(value) => this._handleTimeLimitChange(value)}
                                    ></TimeLimitSlider>
                                </Paper>
                            </Grid>
                            <Grid item>
                                <Paper className={classes.paper}>
                                    <MapColorSchemePicker
                                        colorScheme={this.state.mapColorScheme}
                                        handleChange={(event) => this._handleMapColorSchemeChange(event)}
                                    ></MapColorSchemePicker>
                                </Paper>
                            </Grid>
                            <Grid item>
                                <Paper className={classes.paper}>
                                    <Typography>
                                        Another thing
                                    </Typography>
                                    <XYPlot
                                        width={300}
                                        height={300}>
                                        <HorizontalGridLines />
                                        <LineSeries
                                            data={[
                                                {x: 1, y: 10},
                                                {x: 2, y: 5},
                                                {x: 3, y: 15}
                                            ]}/>
                                        <XAxis />
                                        <YAxis />
                                    </XYPlot>
                                </Paper>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={8}>
                        <Paper className={classes.paper}>
                            <ContainerDimensions className={classes.map}>
                                <Map
                                    deckGLOnClick={(event, info) => this._handleDeckGLOnClick(event, info)}
                                    handleGeoJsonLayerOnClick={(event, info) => this._handleGeoJsonLayerOnClick(event, info)}
                                    getColor={(location) => this._getColor(location)}
                                    onHover={(object) => this._handleMapOnHover(object)}
                                    renderMapTooltip={this._renderMapTooltip}
                                    updateTriggers={{getFillColor: [this.state.eta, this.state.mapColorScheme]}}
                                    valid={this.state.valid}
                                    maxEta={this.state.maxEta}
                                    mapColorSchemeInterpolator={this.state.mapColorSchemeInterpolator}
                                >
                                </Map>
                            </ContainerDimensions>
                        </Paper>
                    </Grid>
                </Grid>
            </div>
        );
    }
}

export default hot(withStyles(styles, {defaultTheme: theme})(App));