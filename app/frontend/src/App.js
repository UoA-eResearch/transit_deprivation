import { hot } from 'react-hot-loader/root';
import { cold } from 'react-hot-loader';
import React, {Component, useMemo} from "react";

import { makeStyles, withStyles, createMuiTheme} from '@material-ui/core/styles';
//import Typography from '@material-ui/core/Typography';
import {Paper, Grid, Slider, Select, MenuItem, Typography} from '@material-ui/core';

// mapping
import {StaticMap} from 'react-map-gl';
import DeckGL from '@deck.gl/react';
import {GeoJsonLayer, ScatterplotLayer} from '@deck.gl/layers';
const MAPBOX_TOKEN = process.env.MapboxAccessToken;

// plot colors https://github.com/d3/d3-scale-chromatic
import {mean, deviation, max, min} from "d3";
import {color, scaleSequential, scaleLinear} from "d3";
import {interpolateViridis, interpolateTurbo} from 'd3-scale-chromatic'

// react vis
import {ContinuousColorLegend} from 'react-vis';
// import {XYPlot, XAxis, YAxis, LineSeries} from 'react-vis';
// import '../node_modules/react-vis/dist/style.css';

// timeseries
import { TimeSeries } from "pondjs";
import {
    Charts,
    ChartContainer,
    ChartRow,
    YAxis,
    LineChart,
    Resizable
} from "react-timeseries-charts";
const ColdResizable = cold(Resizable);
const ColdChartContainer = cold(ChartContainer);
const ColdChartRow = cold(ChartRow);
const ColdYAxis = cold(YAxis);
const ColdCharts = cold(Charts);
const ColdLineChart = cold(LineChart);

// color helpers
var tinycolor = require("tinycolor2");

import ContainerDimensions from 'react-container-dimensions'

// Data
import * as data from "../data/akl/akl_polygons_id.geojson"
import * as clinics from "../data/akl/akl_clinics.geojson"
import * as akl_idx_loc from "../data/akl/akl_idx_loc.json"
import * as akl_loc_idx from "../data/akl/akl_loc_idx.json"
import * as akl_idx_t from "../data/akl/akl_idx_t.json"

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
    timeLimitSlider: {
        maxWidth: "300px"
    },
    mapOpacitySlider: {
        maxWidth: "300px"
    },
    mapColorSchemeSelector: {
      minWidth: "150px"
    },
    mapLegend: {
        x: 0,
        y: 0,
        width: "320px",
        color: theme.palette.text.secondary,
        background: theme.palette.background.paper,
        padding: theme.spacing(2)

    },
    colorBar: {
        color: theme.palette.text.secondary,
        fontSize: "10px",
        textAnchor: "middle",
    },
    colorBarLabel: {
        color: theme.palette.text.secondary,
        fontSize: "14px",
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
        overflowY: "hidden",
    },
    datasetSelector: {},
    etaViewSelector: {}
});

function TimeLimitSlider(props) {
    const classes = makeStyles(styles)();

    return (
        <div>
            <Typography gutterBottom>
                Time Limit: {props.value} minutes
            </Typography>
            <Slider
                className={classes.timeLimitSlider}
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

function OpacitySlider(props) {
    const classes = makeStyles(styles)();

    return (
        <div>
            <Typography gutterBottom>
                Opacity
            </Typography>
            <Slider
                className={classes.mapOpacitySlider}
                defaultValue={0.8}
                onChange={(event, value) => props.onChange(value)}
                getAriaValueText={(value) => {`${value}`}}
                aria-labelledby="continuous-slider"
                valueLabelDisplay="auto"
                step={0.01}
                min={0.0}
                max={1.0}
            />
        </div>
    );
}

function MapLegend(props){

    // TODO: this should only update when the selected location changes
    const classes = makeStyles(styles)();

    let vmin = props.minValue;
    let vmax = props.maxValue;
    let width = 300;
    let height = 8;
    let xpad = 5;

    let colorScale = scaleSequential([0, 1], props.mapColorSchemeInterpolator);
    let tickScale = scaleLinear().domain([0, 1]).range([vmin, vmax]);
    let tickValues = tickScale.ticks().map(value => Math.round(tickScale(value)));
    let tickOffset = width / (tickValues.length - 1);

    let label = "";
    switch (props.etaView){
        case "mean":
            label = "Mean Travel Time (minutes)"
            break;
        case "stdev":
            label = "Standard Deviation in Travel Time (minutes)"
            break;
    }

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
      <Paper
          id={"map-legend"}
          className={classes.mapLegend}
      >
          <svg id="map-legend" width="320" height="60" version="1.1" xmlns="http://www.w3.org/2000/svg">
              <defs>
                  <linearGradient id="Gradient">
                      {
                          tickScale.ticks().map((value, index) => (
                              // console.log(`${index} ${value} ${colorScale(value)}`)
                              <stop key={`stop-${index}`} offset={`${value*100}%`} stopColor={tinycolor(colorScale(value)).setAlpha(props.opacity)}/>
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
                              id="map-legend"
                              key={`tickValue-${index}`}
                              className={classes.colorBar}
                              fill={"currentColor"}
                              style={{transform: `translateY(${height + 20}px)`}}>
                              { value }
                          </text>
                      </g>
                  ))
              }
              <g
                  key={"label"}
                  transform={`translate(${xpad + width/2}, ${height + 50})`}
              >
                  <text
                      id="map-legend"
                      key={"label"}
                      className={classes.colorBarLabel}
                      fill={"currentColor"}
                  >{label}</text>
              </g>
          </svg>
      </Paper>
    );
}

function Map(props){
    const classes = makeStyles(styles)();
    const mapStyle = 'mapbox://styles/mapbox/light-v9';

    // default starting layer
    const layers = [
        new GeoJsonLayer({
            id: 'eta',
            data,
            opacity: props.opacity,
            stroked: false,
            filled: true,
            getFillColor: f => props.getColor(f.id),
            getLineColor: [0, 0, 0],
            onClick: (event, info) => {info.handled = true; props.handleGeoJsonLayerOnClick(event)},
            pickable: true,
            onHover: props.onHover,
            updateTriggers: props.updateTriggers,
        })
    ];

    // add dataset specific layers
    if (props.dataset === "Diabetes Clinics"){
        layers.push(
            new GeoJsonLayer({
                id: 'clinics',
                data: clinics,
                pointRadiusMinPixels: 5,
                getFillColor: [235, 52, 52, 255],
            })
        )
    }

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
                        minValue={props.minValue}
                        maxValue={props.maxValue}
                        mapColorSchemeInterpolator={props.mapColorSchemeInterpolator}
                        opacity={props.opacity}
                        etaView={props.etaView}
                    />) : null
                }
                {props.renderMapTooltip()}
            </DeckGL>
        </div>

    );
}

function MapColorSchemeSelector(props){
    const classes = makeStyles(styles)();

    return (
        <div>
            <Typography gutterBottom>
                Colour Scheme
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

function DatasetSelector(props){
    const classes = makeStyles(styles)();

    let infoStr = {
        "None": "No destination dataset selected",
        "Diabetes Clinics": "This dataset contains the location diabetes treatment centers in the Auckland Region."
    }

    return (
        <Grid container direction="column" spacing={3}>
            <Grid item>
                <Typography variant="h5">Data</Typography>
            </Grid>
            <Grid container item direction="row" spacing={3} alignItems="center">
                <Grid item>
                    <Typography variant="subtitle1">Travel Time View</Typography>
                </Grid>
                <Grid item>
                     <Select
                         className={classes.etaViewSelector}
                         value={props.view}
                         onChange={props.viewHandleChange}
                     >
                         <MenuItem value={"mean"}>Mean</MenuItem>
                         <MenuItem value={"stdev"}>Standard Deviation</MenuItem>
                     </Select>
                </Grid>
            </Grid>
            <Grid container item direction="row" spacing={3} alignItems="center">
                <Grid item>
                    <Typography variant="subtitle1">Destinations</Typography>
                </Grid>
                <Grid item style={{marginLeft:32}}>
                    <Select
                        className={classes.datasetSelector}
                        value={props.dataset}
                        onChange={props.datasetHandleChange}
                    >
                        <MenuItem value={"None"}>None</MenuItem>
                        <MenuItem value={"Diabetes Clinics"}>Diabetes Clinics</MenuItem>
                    </Select>
                </Grid>
            </Grid>
            <Grid item>
                <Typography variant="body1" paragraph style={{whiteSpace: 'pre-line'}}>
                    {infoStr[props.dataset]}
                </Typography>
            </Grid>
        </Grid>
    );
}

function TravelTimePlot(props){

    const classes = makeStyles(styles)();
    const {data, query, locIdx, idxT, eta} = props;

    let points = [[0, 0]];
    if (eta != null && typeof query !== 'undefined' && query.id in eta){

        let idx = locIdx[query.id];
        let times = data[idx];
        points = Object.keys(times).map((key) => [idxT[key], times[key]]);
    }

    const series = new TimeSeries({
        name: "Travel Time",
        columns: ["time", "value"],
        points: points
    });

    let min = series.min();
    let max = series.max();
    min = Math.max(0, min - min * 0.1);
    max = max + max * 0.1;

    return (
        <ColdResizable>
            <ColdChartContainer
                title="Travel Time"
                titleStyle={{ fill: "#555", fontWeight: 500 }}
                timeRange={series.range()}
                format="%H:%M %p"
                timeAxisTickCount={5}
            >
                <ColdChartRow height="150">
                    <ColdYAxis
                        id="duration"
                        label="Duration (minutes)"
                        min={min}
                        max={max}
                        width="60"
                    />
                    <ColdCharts>
                        <ColdLineChart axis="duration" series={series} />
                    </ColdCharts>
                </ColdChartRow>
            </ColdChartContainer>
        </ColdResizable>
    );
}

class App extends Component{

    // TODO combine the map* variables into one object
    constructor(props){
        super(props);
        this.state = {
            timeLimit: 60, // minutes
            idxLoc: akl_idx_loc["default"],
            locIdx: akl_loc_idx["default"],
            idxT: akl_idx_t["default"],
            locationDT: null,
            etaView: "mean",
            eta: null,
            valid: false,
            mapOpacity: 0.7,
            mapColorScheme: "Viridis",
            mapColorSchemeInterpolator: interpolateViridis,
            dataset: "None",
            showHover: true

        }
        this._renderMapTooltip = this._renderMapTooltip.bind(this);
    };

    _handleGeoJsonLayerOnClick(event, info){
        //console.log(`GeoJson handled, location ${event.object.id}`);
        this._getLocationDT((event.object.id)); // get location destination-time data and compute stats

        // any dataset specific behaviour
        let ds = this.state.dataset
        if (ds === "Diabetes Clinics"){
            // do something special for clinic locations
            //console.log(`${ds} onclick handler`)
        }
    }

    _handleDeckGLOnClick(event, info){
        if (!info.handled){

            // reset the eta values
            this._resetETA();

            // any dataset specific behaviour
            let ds = this.state.dataset
            if (ds === "Diabetes Clinics"){
                // do something special for clinic locations
            }
            //console.log(`DeckGL handled`);

        }
    }

    _handleTimeLimitChange(value){
        //console.log(`called with ${value}`)
        this.setState({timeLimit: value}, () => {this._computeETA();});
    }

    _handleMapOpacityChange(value){
        //console.log(`called with ${value}`)
        this.setState({mapOpacity: value});
    }

    _handleMapOnHover(info, event) {
        if (event.target.id !== "map-legend"){
            this.setState({showHover: true, x: info.x, y: info.y, hoveredObject: info.object});
        } else {
            this.setState({showHover: false});
        }
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

    _handleDatasetChange(event){
        const dataset = event.target.value;
        this.setState({dataset: dataset}, this._initialiseView)
    }

    _handleViewChange(event){
        const view = event.target.value;
        this.setState({etaView: view}, this._initialiseView)
    }

    _initialiseView(){
        // default view initialisation
        // none

        // any dataset specific behaviour
        let ds = this.state.dataset
        if (ds === "Diabetes Clinics"){
            // special handling if required
        }
    }

    _renderMapTooltip() {
        const {x, y, showHover, hoveredObject, valid} = this.state;
        const {classes} = this.props;

        if(showHover && hoveredObject){

            var idInfo = (
                <div>
                    <Typography variant="subtitle2">
                        <b>ID: {hoveredObject.id}</b>
                    </Typography>
                </div>
            );

            if (valid) {
                let view = this.state.etaView;
                let accessible = hoveredObject.id in this.state.eta[view]["values"];

                let meanEta = Math.round(this.state.eta["mean"]["values"][hoveredObject.id]);
                let stdevEta = Math.round(this.state.eta["stdev"]["values"][hoveredObject.id]);
                let avail = Math.round(this.state.eta["avail"]["values"][hoveredObject.id] * 100);

                return (
                    <div className={classes.tooltip} style={{top: y, left: x, width: "210px",}}>
                        {idInfo}
                        {
                            accessible ?
                                (
                                    <div>
                                        <Typography variant="subtitle2">
                                            {`Mean: ${meanEta} minutes`}
                                        </Typography>
                                        <Typography variant="subtitle2">
                                            {`Standard deviation: ${stdevEta} minutes`}
                                        </Typography>
                                        <Typography variant="subtitle2">
                                            {`Availability: ${avail} %`}
                                        </Typography>
                                    </div>
                                ) :
                                (
                                    <div>
                                        <Typography variant="subtitle2">
                                            {"Inaccessible"}
                                        </Typography>
                                    </div>
                                )
                        }
                    </div>
                );
            } else {
                return (
                    <div className={classes.tooltip} style={{top: y, left: x, width:90}}>
                        {idInfo}
                    </div>
                );
            }


        }
    }

    _getColor(location) {
        const defaultColor = [128, 128, 128, 24];
        const inaccessibleColor = [128, 128, 128, 0];
        if (this.state.valid){
            // console.log(`loc: ${location} view: ${this.state.etaView} v: ${this.state.eta[this.state.etaView]["values"][location]}`);
            let view = this.state.etaView;
            if (location in this.state.eta[view]["values"]){
                let v = this.state.eta[view]["values"][location];
                let vmin = this.state.eta[view]["min"];
                let vmax = this.state.eta[view]["max"];

                let nv = (v - vmin) / Math.max((vmax - vmin), 1);
                let a = this.state.eta["avail"]["values"][location] * 255;
                let c = this.state.mapColorSchemeInterpolator(nv);
                c = color(c).copy({opacity: a})

                return [c.r, c.g, c.b, c.opacity];
            } else {
                return inaccessibleColor;
            }
        } else {
            return defaultColor;
        }

    }

    _getLocationDT(location) {

        let region = "akl";
        let url = `http://130.216.217.4:8081/transit?region=${region}&location=${location}`;
        fetch(url)
            .then(response => response.json())
            .then((data) => {
                this.setState({locationDT: data}, () => {this._computeETA()});
            })
            .catch((error) => {
                console.error(error)
            })

    }

    _resetETA(){
        this.setState({locationDT: null, eta: null, valid: false});
    }

    _computeETA() {

        const data = this.state.locationDT;
        if (data === null){
            return;
        }

        const nloc = data.length
        const ntimes = data[0].length

        let times = {}

        // find valid journeys given the time constraint
        let t = null
        for (let i = 0; i < nloc; i++) {
            times[i] = [];
            for (let j = 0; j < ntimes; j++) {
                t = data[i][j]
                if (t > -1 && t < this.state.timeLimit) {
                    times[i].push(t);
                }
            }
        }

        // compute stats from origin to each destinations
        let mean_ = {"values": {}, "min": 0, "max": 1};
        let stdev = {"values": {}, "min": 0, "max": 1};
        let avail = {"values": {}, "min": 0, "max": 1}; // ratio of trips that meet the time limit criteria

        let loc = null;
        for (let i = 0; i < nloc; i++) {
            loc = this.state.idxLoc[i]; // convert DT matrix index to datazone location id

            if (times[i].length > 0){

                // mean
                mean_["values"][loc] = mean(times[i]);

                // stdev
                if (times[i].length >= 2){
                    stdev["values"][loc] = deviation(times[i])
                }

                // avail
                avail["values"][loc] = times[i].length / ntimes;

            }
            //console.log(`${i}: ${loc}, mean: ${mean[loc]} stdev: ${stdev[loc]}`)
        }


        // calculate min, max required for normalisation
        mean_["max"] = max(Object.values(mean_["values"]));
        mean_["min"] = min(Object.values(mean_["values"]));

        stdev["max"] = max(Object.values(stdev["values"]));
        stdev["min"] = min(Object.values(stdev["values"]));

        avail["max"] = max(Object.values(avail["values"]));
        avail["min"] = min(Object.values(avail["values"]));

        let eta = {
            "avail": avail,
            "mean": mean_,
            "stdev": stdev,
        }

        this.setState({eta: eta, valid: true});
    }

    render(){

        const {classes} = this.props;

        return (
            <div className={classes.root}>
                <Grid container spacing={3}>
                    <Grid item container direction="column" xs={4} spacing={3}>
                        <Grid item>
                            <Paper className={classes.paper}>
                                <Typography variant="h4" gutterBottom>
                                    Transit & Deprivation
                                </Typography>
                                <Typography variant="body1" paragraph style={{whiteSpace: 'pre-line'}}>
                                    {"This tool will visualise the travel time between origins and destinations in the Auckland Region when using public transport. \n\n" +
                                    "Click on the map to view the travel time from there to the rest of Auckland. To clear the map, select an empty location, such as the ocean. \n\n" +
                                    "You can visualise how accessibility changes with the amount of time available by using the time limit slider in the control settings below."
                                    }
                                </Typography>
                            </Paper>
                        </Grid>
                        <Grid item>
                            <Paper className={classes.paper}>
                                <DatasetSelector
                                    dataset={this.state.dataset}
                                    datasetHandleChange={(event) => this._handleDatasetChange(event)}
                                    view={this.state.etaView}
                                    viewHandleChange={(event) => this._handleViewChange(event)}
                                />
                            </Paper>
                        </Grid>
                        <Grid item>
                            <Paper className={classes.paper}>
                                <Typography variant="h5" gutterBottom>Controls</Typography>
                                <TimeLimitSlider
                                    value={this.state.timeLimit}
                                    onChange={(value) => this._handleTimeLimitChange(value)}
                                ></TimeLimitSlider>
                                <OpacitySlider
                                    value={this.state.mapOpacity}
                                    onChange={(value) => this._handleMapOpacityChange(value)}
                                ></OpacitySlider>
                                <MapColorSchemeSelector
                                    colorScheme={this.state.mapColorScheme}
                                    handleChange={(event) => this._handleMapColorSchemeChange(event)}
                                ></MapColorSchemeSelector>
                            </Paper>
                        </Grid>
                    </Grid>
                    <Grid container item direction="column" xs={8}>
                        <Grid item>
                            <Paper className={classes.paper}>
                                <ContainerDimensions className={classes.map}>
                                    <Map
                                        deckGLOnClick={(event, info) => this._handleDeckGLOnClick(event, info)}
                                        handleGeoJsonLayerOnClick={(event, info) => this._handleGeoJsonLayerOnClick(event, info)}
                                        getColor={(location) => this._getColor(location)}
                                        onHover={(info, event) => this._handleMapOnHover(info, event)}
                                        renderMapTooltip={this._renderMapTooltip}
                                        updateTriggers={{getFillColor: [this.state.eta, this.state.etaView, this.state.mapColorScheme]}}
                                        valid={this.state.valid}
                                        mapColorSchemeInterpolator={this.state.mapColorSchemeInterpolator}
                                        dataset={this.state.dataset}
                                        opacity={this.state.mapOpacity}
                                        maxValue={this.state.valid ? this.state.eta[this.state.etaView]["max"] : 1}
                                        minValue={this.state.valid ? this.state.eta[this.state.etaView]["min"] : 0}
                                        etaView={this.state.etaView}
                                    >
                                    </Map>
                                </ContainerDimensions>
                            </Paper>
                        </Grid>
                        <Grid item>
                            <Paper className={classes.paper}>
                                <TravelTimePlot
                                    data={this.state.locationDT}
                                    query={this.state.hoveredObject}
                                    locIdx={this.state.locIdx}
                                    idxT={this.state.idxT}
                                    eta={this.state.valid ? this.state.eta[this.state.etaView]["values"] : null}
                                />
                            </Paper>
                        </Grid>
                    </Grid>
                </Grid>
            </div>
        );
    }
}

export default hot(withStyles(styles, {defaultTheme: theme})(App));