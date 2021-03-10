import React, {Component} from 'react';
import { connect } from 'react-redux';
import { withStyles, createMuiTheme} from '@material-ui/core/styles';
import { Divider, Paper, Grid, Typography } from '@material-ui/core';
import DatasetSelector from "./DatasetSelector";
import TimeLimitSlider from "./TimeLimitSlider";
import DestinationTimeSlider from "./DestinationTimeSlider";
import OpacitySlider from "./OpacitySlider";
import MapTile from "./MapTile";
import * as mapTypes from "./mapTypes";
import MapColorSchemeSelector from "./MapColorSchemeSelector";
import DestinationBasemapSelector from "./DestinationBasemapSelector";
import OriginBasemapSelector from "./OriginBasemapSelector";

const theme = createMuiTheme({
    palette: {
        type: "light",
    },
});

const styles = (theme) => ({
    root: {
        flexGrow: 1,
        //background: grey[900],
        // background: "black",
        marginTop: theme.spacing(2),
    },
    paper: {
        padding: theme.spacing(2),
        color: theme.palette.text.secondary,
        background: theme.palette.background.paper
    },
});

class App extends Component {

    render() {
        const { classes } = this.props;
        return (
            <Grid className={classes.root} container spacing={3} justify="center" alignItems="flex-start">
                <Grid item container direction="column" xs={4} spacing={3}>
                    <Grid item>
                        <Paper className={classes.paper}>
                            <Typography variant="h4" gutterBottom>
                                Transit & Deprivation
                            </Typography>
                            <Typography variant="body1" style={{whiteSpace: 'pre-line'}}>
                                {
                                    "This tool visualises the impact of deprivation on accessibility via public transport in Auckland\n\n" +
                                    "Start by selecting a destination data set in the Data panel below. Then use the Destination panel to select a location of interest and the Origin panel to select a starting location\n\n"
                                }
                            </Typography>
                        </Paper>
                    </Grid>
                    <Grid item>
                        <Paper className={classes.paper}>
                            <Grid container direction="column" spacing={2}>
                                <Grid item>
                                    <Typography variant="h5" gutterBottom>Data</Typography>
                                </Grid>
                                <Grid item>
                                    <DatasetSelector />
                                </Grid>
                                <Grid item>
                                    <Divider />
                                </Grid>
                                <Grid item>
                                    <DestinationBasemapSelector />
                                </Grid>
                                <Grid item>
                                    <Divider />
                                </Grid>
                                <Grid item>
                                    <OriginBasemapSelector />
                                </Grid>
                            </Grid>


                            <Divider />

                        </Paper>
                    </Grid>
                    <Grid item>
                        <Paper className={classes.paper}>
                            <Typography variant="h5" gutterBottom>Controls</Typography>
                            <TimeLimitSlider />
                            <DestinationTimeSlider />
                        </Paper>
                    </Grid>
                    <Grid item>
                        <Paper className={classes.paper}>
                            <Typography variant="h5" gutterBottom>View</Typography>
                            <OpacitySlider />
                            <MapColorSchemeSelector />
                        </Paper>
                    </Grid>
                </Grid>
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
            </Grid>
        );
    }
}

const mapStateToProps = (state) => {
    return {
    }
};

const mapDispatchToProps = (dispatch) => {
    return ({

    });
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withStyles(styles, {defaultTheme: theme})(App));