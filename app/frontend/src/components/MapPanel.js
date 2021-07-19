import React, {Component} from 'react';
import { connect } from 'react-redux';
import { withStyles, createTheme} from '@material-ui/core/styles';
import {Grid} from '@material-ui/core';
import MapTile from "./MapTile";
import * as mapTypes from "./mapTypes";

const theme = createTheme({
    palette: {
        type: "light",
    },
    table: {

    }
});

const styles = (theme) => ({

});

class MapPanel extends Component {

    render() {

        return (
            <Grid container item direction="column" xs={8} spacing={3}>
                <Grid container item direction="row" spacing={3}>
                    <Grid item xs={6}>
                        <MapTile mapType={mapTypes.DESTINATION}/>
                    </Grid>
                    <Grid item xs={6}>
                        <MapTile mapType={mapTypes.INBOUND}/>
                    </Grid>
                </Grid>
                <Grid container item direction="row" spacing={3}>
                    <Grid item xs={6}>
                        <MapTile mapType={mapTypes.ORIGIN}/>
                    </Grid>
                    <Grid item xs={6}>
                        <MapTile mapType={mapTypes.OUTBOUND}/>
                    </Grid>
                </Grid>
            </Grid>
        );
    }
}

const mapStateToProps = (state) => {
    return {}
};

const mapDispatchToProps = (dispatch) => {
    return ({});
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withStyles(styles, {defaultTheme: theme})(MapPanel));