import { hot } from 'react-hot-loader/root';
import React, { Component} from "react";

import { makeStyles, withStyles, createMuiTheme} from '@material-ui/core/styles';
//import purple from '@material-ui/core/colors/purple';
//import green from '@material-ui/core/colors/green';
import grey from '@material-ui/core/colors/grey';

import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Slider from '@material-ui/core/Slider';
import Typography from '@material-ui/core/Typography';

import {StaticMap} from 'react-map-gl';
import DeckGL from '@deck.gl/react';
import {GeoJsonLayer} from '@deck.gl/layers';
import {scaleThreshold} from 'd3-scale';
const MAPBOX_TOKEN = process.env.MapboxAccessToken;

import ContainerDimensions from 'react-container-dimensions'

// Source data GeoJSON
const DATA_URL =
    'https://raw.githubusercontent.com/UoA-eResearch/transit_deprivation/master/data/akl_polygons_id.geojson'

// TODO: There's probably a cleaner way to this color scale
function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

let viridis = ["#440154","#440256","#450457","#450559","#46075a","#46085c","#460a5d","#460b5e","#470d60","#470e61","#471063","#471164","#471365","#481467","#481668","#481769","#48186a","#481a6c","#481b6d","#481c6e","#481d6f","#481f70","#482071","#482173","#482374","#482475","#482576","#482677","#482878","#482979","#472a7a","#472c7a","#472d7b","#472e7c","#472f7d","#46307e","#46327e","#46337f","#463480","#453581","#453781","#453882","#443983","#443a83","#443b84","#433d84","#433e85","#423f85","#424086","#424186","#414287","#414487","#404588","#404688","#3f4788","#3f4889","#3e4989","#3e4a89","#3e4c8a","#3d4d8a","#3d4e8a","#3c4f8a","#3c508b","#3b518b","#3b528b","#3a538b","#3a548c","#39558c","#39568c","#38588c","#38598c","#375a8c","#375b8d","#365c8d","#365d8d","#355e8d","#355f8d","#34608d","#34618d","#33628d","#33638d","#32648e","#32658e","#31668e","#31678e","#31688e","#30698e","#306a8e","#2f6b8e","#2f6c8e","#2e6d8e","#2e6e8e","#2e6f8e","#2d708e","#2d718e","#2c718e","#2c728e","#2c738e","#2b748e","#2b758e","#2a768e","#2a778e","#2a788e","#29798e","#297a8e","#297b8e","#287c8e","#287d8e","#277e8e","#277f8e","#27808e","#26818e","#26828e","#26828e","#25838e","#25848e","#25858e","#24868e","#24878e","#23888e","#23898e","#238a8d","#228b8d","#228c8d","#228d8d","#218e8d","#218f8d","#21908d","#21918c","#20928c","#20928c","#20938c","#1f948c","#1f958b","#1f968b","#1f978b","#1f988b","#1f998a","#1f9a8a","#1e9b8a","#1e9c89","#1e9d89","#1f9e89","#1f9f88","#1fa088","#1fa188","#1fa187","#1fa287","#20a386","#20a486","#21a585","#21a685","#22a785","#22a884","#23a983","#24aa83","#25ab82","#25ac82","#26ad81","#27ad81","#28ae80","#29af7f","#2ab07f","#2cb17e","#2db27d","#2eb37c","#2fb47c","#31b57b","#32b67a","#34b679","#35b779","#37b878","#38b977","#3aba76","#3bbb75","#3dbc74","#3fbc73","#40bd72","#42be71","#44bf70","#46c06f","#48c16e","#4ac16d","#4cc26c","#4ec36b","#50c46a","#52c569","#54c568","#56c667","#58c765","#5ac864","#5cc863","#5ec962","#60ca60","#63cb5f","#65cb5e","#67cc5c","#69cd5b","#6ccd5a","#6ece58","#70cf57","#73d056","#75d054","#77d153","#7ad151","#7cd250","#7fd34e","#81d34d","#84d44b","#86d549","#89d548","#8bd646","#8ed645","#90d743","#93d741","#95d840","#98d83e","#9bd93c","#9dd93b","#a0da39","#a2da37","#a5db36","#a8db34","#aadc32","#addc30","#b0dd2f","#b2dd2d","#b5de2b","#b8de29","#bade28","#bddf26","#c0df25","#c2df23","#c5e021","#c8e020","#cae11f","#cde11d","#d0e11c","#d2e21b","#d5e21a","#d8e219","#dae319","#dde318","#dfe318","#e2e418","#e5e419","#e7e419","#eae51a","#ece51b","#efe51c","#f1e51d","#f4e61e","#f6e620","#f8e621","#fbe723","#fde725"];
let viridisRGB = []
let domain = [];
for (let i = 0; i < viridis.length; i++){
    domain.push(i == viridis.length - 1 ? 1.0 : i * 1/viridis.length);
    let c = hexToRgb(viridis[i]);
    viridisRGB.push([c.r, c.g, c.b, 255]);
}
export const COLOR_SCALE = scaleThreshold()
    .domain(domain)
    .range(viridisRGB);


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
        textAlign: "left",
        color: theme.palette.text.secondary,
        background: theme.palette.background.paper
    },
    slider: {
        textAlign: "center",
    },
    map: {
        minHeight: "800px"
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

function Map(props){
    const classes = makeStyles(styles)();
    const mapStyle = 'mapbox://styles/mapbox/light-v9';
    const data = DATA_URL;

    const layers = [
        new GeoJsonLayer({
            id: 'geojson',
            data,
            opacity: 0.8,
            stroked: false,
            filled: true,
            //getFillColor: f => this.getColor(f.id),
            getLineColor: [255, 255, 255],
            //onClick: (event, info) => {info.handled = true; this.viewMeanETA(event);},
            pickable: true,
            //onHover: this._onHover,
            // updateTriggers: {
            //     getFillColor: this.state.eta
            // }
        })
    ];

    return (
        <div className={classes.map}>
            <DeckGL
                layers={layers}
                initialViewState={INITIAL_VIEW_STATE}
                controller={true}
                // onClick={(event, info) => {
                //     if (!info.handled){
                //         //console.log(`DeckGL: ${info.handled}`);
                //         this.resetValues();
                //     }
                // }}
            >
                <StaticMap
                    reuseMaps
                    mapStyle={mapStyle}
                    preventStyleDiffing={true}
                    mapboxApiAccessToken={MAPBOX_TOKEN}
                />

                {/*{renderTooltip}*/}
            </DeckGL>
        </div>

    );
}

class App extends Component{

    constructor(props){
        super(props);
        this.state = {
            timeLimit: 60, // minutes
        }
    }

    _handleTimeLimitChange(value){
        //console.log(`called with ${value}`)
        this.setState({timeLimit: value});
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
                        </Grid>
                    </Grid>
                    <Grid item xs={8}>
                        <Paper className={classes.paper}>
                            <ContainerDimensions className={classes.map}>
                                <Map/>
                            </ContainerDimensions>
                        </Paper>
                    </Grid>
                </Grid>
            </div>
        );
    }
}
console.log(theme);
export default hot(withStyles(styles, {defaultTheme: theme})(App));