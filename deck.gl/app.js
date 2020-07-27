import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {render} from 'react-dom';
import {StaticMap} from 'react-map-gl';
import DeckGL from '@deck.gl/react';
import {GeoJsonLayer} from '@deck.gl/layers';
import {scaleThreshold} from 'd3-scale';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';

// Set your mapbox token here
const MAPBOX_TOKEN = process.env.MapboxAccessToken; // eslint-disable-line

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

const styles = withStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    paper: {
        padding: theme.spacing(2),
    },
}));

class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            hoveredObject: null,
            locIdx: null,
            idxLoc: null,
            eta: null,
            maxEta: 1,
            reliability: null,
            valid: false,
            locations: [7601217, 7600739],
            lastLocationIndex: 0
        };
        this._onHover = this._onHover.bind(this);
        this._renderTooltip = this._renderTooltip.bind(this);
    }

    componentDidMount() {

        // locIdx is a mapping from location ids to odt indices
        fetch(`https://raw.githubusercontent.com/UoA-eResearch/transit_deprivation/master/data/akl_loc_idx.json`)
            .then(res => res.json())
            .then(json => {
                let eta = {};
                for (const [k, v] of Object.entries(json)){
                    eta[k] = -1;
                }
                this.setState({locIdx: json, eta: eta });
            })
            .catch((error) => {console.error(error)});

        // idxLoc is a mapping from odt indices to location ids
        fetch(`https://raw.githubusercontent.com/UoA-eResearch/transit_deprivation/master/data/akl_idx_loc.json`)
            .then(res => res.json())
            .then(json => {
                this.setState({idxLoc: json});
            })
            .catch((error) => {console.error(error)});

        // TODO: Fetch one javascript object to avoid multiple calls to render()

    }

    _onHover({x, y, object}) {
        this.setState({x, y, hoveredObject: object});
    }

    _renderTooltip() {
        const {x, y, hoveredObject, valid} = this.state;

        if(hoveredObject){

            if (valid){
                return (
                    <div className="tooltip" style={{top: y, left: x}}>
                        <div>
                            <b>ID: {hoveredObject.id}</b>
                        </div>
                        <div>
                            <div>Mean ETA {Math.round(this.state.eta[hoveredObject.id])} minutes</div>
                        </div>
                    </div>
                );
            } else {
                return (
                    <div className="tooltip" style={{top: y, left: x}}>
                        <div>
                            <b>ID: {hoveredObject.id}</b>
                        </div>
                    </div>
                );
            }
        }
    }

    _renderLayers() {
        const {data = DATA_URL} = this.props;

        return [
            new GeoJsonLayer({
                id: 'geojson',
                data,
                opacity: 0.8,
                stroked: false,
                filled: true,
                getFillColor: f => this.getColor(f.id),
                getLineColor: [255, 255, 255],
                onClick: (event, info) => {info.handled = true; this.viewMeanETA(event);},
                //onClick: (event, info) => {info.handled = true; this.randomValues(event, info)},
                //onClick: (event, info) => {info.handled = true; console.log(`GeoJSON: ${info.handled}`)},
                pickable: true,
                onHover: this._onHover,
                updateTriggers: {
                    getFillColor: this.state.eta
                }
            })
        ];
    }

    render() {
        const {mapStyle = 'mapbox://styles/mapbox/light-v9'} = this.props;

        return (
            <DeckGL
                layers={this._renderLayers()}
                effects={this._effects}
                initialViewState={INITIAL_VIEW_STATE}
                controller={true}
                onClick={(event, info) => {
                    if (!info.handled){
                        //console.log(`DeckGL: ${info.handled}`);
                        this.resetValues();
                    }
                }}
            >
                <StaticMap
                    reuseMaps
                    mapStyle={mapStyle}
                    preventStyleDiffing={true}
                    mapboxApiAccessToken={MAPBOX_TOKEN}
                />
                {this._renderTooltip}
            </DeckGL>
        );
    }

    resetValues(){
        console.log("reset values");
        let eta = {};
        for (let i = 0; i < Object.keys(this.state.idxLoc).length; i++) {
            eta[this.state.idxLoc[i]] = -1;
        }
        this.setState({eta: eta, maxEta: -1, valid: false});
    }

    randomValues(){
        console.log(`setting random ${Object.keys(this.state.idxLoc).length} random values`);
        let eta = {};
        let rel = {};
        let maxEta = -1
        for (let i = 0; i < Object.keys(this.state.idxLoc).length; i++) {
            let v = Math.random() * 100;
            if ( v > maxEta){
                maxEta = v
            }
            eta[this.state.idxLoc[i]] = v;
            rel[this.state.idxLoc[i]] = Math.random();
            //console.log(`value: ${eta[this.state.idxLoc[i]]}, rel: ${rel[this.state.idxLoc[i]]}`)
        }
        this.setState({eta: eta, maxEta: maxEta, reliability: rel, valid: true});
    }

    computeMeanETA(data) {

        const nloc = data.length
        const ntimes = data[0].length

        let count = new Array(nloc).fill(0);
        let sum = new Array(nloc).fill(0);

        let t = 0
        for (let i = 0; i < nloc; i++) {
            for (let j = 0; j < ntimes; j++) {
                t = data[i][j]
                if (t > -1) {
                    count[i] += 1;
                    sum[i] += t;
                }
            }
        }

        // mean eta from origin to each destinations
        let eta = {};
        let v = -1;
        let maxEta = v;
        for (let i = 0; i < nloc; i++) {
            v = count[i] > 0 ? sum[i] / count[i] : -1;
            maxEta = v > maxEta ? v : maxEta;
            eta[this.state.idxLoc[i]] = v;
        }

        // reliability is ratio of valid journeys / total possible journeys to each destination
        let rel = {};
        for (let i = 0; i < nloc; i++) {
            rel[this.state.idxLoc[i]] = count[i] / ntimes;
            //console.log(`${count[i]}, ${ntimes}, ${count[i]/ntimes}`);
        }
        this.setState({eta: eta, maxEta: maxEta, reliability: rel, valid: true});
    }

    getLocationDT(location) {

        // fixed locations for debugging performance
        let idx = this.state.lastLocationIndex + 1;
        if (idx > this.state.locations.length - 1){
            idx = 0
        }
        this.setState({lastLocationIndex: idx})
        location = this.state.locations[idx];

        let url = `https://raw.githubusercontent.com/UoA-eResearch/transit_deprivation/master/data/${location}-dt.json`;
        fetch(url)
            .then(response => response.json())
            .then((json) => {
                this.computeMeanETA(json);
            })
            .catch((error) => {
                console.error(error)
            })
    }

    viewMeanETA(clickEvent) {
        //console.log(clickEvent);
        let location = clickEvent.object.id
        if (this.state.idxLoc !== null){
            this.getLocationDT(location)
        } else {
            console.log(`idxLoc is null`);
        }
    }

    getColor(location) {
        //console.log(`${location}: ${this.state.eta[location]}`)
        if (!this.state.valid || this.state.eta[location] === undefined || this.state.eta[location] === -1){
            return [128, 128, 128, 64];
        } else{
            let v = this.state.eta[location] / this.state.maxEta;
            let pv = Math.pow(v, 0.33);
            let a = Math.min(this.state.reliability[location] * 255, 255);
            let c = COLOR_SCALE(pv);
            c[3] = a
            //console.log(`${location}: ${v}, ${pv}, ${c}, ${a}`)
            return c;
        }
    }
}


//export default withStyles(styles)(App)
//ReactDOM.render(<App/>, document.getElementById("root"));
export function renderToDOM(container) {
    render(<App/>, container);
}
