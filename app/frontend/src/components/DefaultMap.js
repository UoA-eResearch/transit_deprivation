import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withStyles, createMuiTheme } from '@material-ui/core/styles';
import { setMapViewState} from "../store/actions";
import { StaticMap } from 'react-map-gl';
import DeckGL from '@deck.gl/react';


const theme = createMuiTheme({
    palette: {
        type: "light",
    },
});

const styles = (theme) => ({
    map: {
        minHeight: "550px",
        position: "relative",
    },
});

const mapStyle = 'mapbox://styles/mapbox/light-v9';
const MAPBOX_TOKEN = process.env.REACT_APP_MapboxAccessToken;

class DefaultMap extends Component {

    onViewStateChange = vs => {
        const { setMapViewState } = this.props;
        setMapViewState(vs);
    };

    render() {
        const { classes, mapViewState } = this.props;
        console.log("default map render");
        return(
            <div className={classes.map}>
                <DeckGL
                    initialViewState={mapViewState}
                    controller={true}
                    // onViewStateChange={ this.onViewStateChange }
                >
                    <StaticMap
                        reuseMaps
                        mapStyle={mapStyle}
                        preventStyleDiffing={true}
                        mapboxApiAccessToken={MAPBOX_TOKEN}
                    />
                </DeckGL>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        mapViewState: state.mapViewState,
    }
};

const mapDispatchToProps = (dispatch) => {
    return ({
        setMapViewState: (mapViewState) => { dispatch(setMapViewState(mapViewState)) },
    });
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withStyles(styles, {defaultTheme: theme})(DefaultMap));
