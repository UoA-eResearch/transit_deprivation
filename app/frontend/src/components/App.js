import React, {Component} from 'react';
import { connect } from 'react-redux';
import { withStyles, createMuiTheme} from '@material-ui/core/styles';
import { Paper, Grid, Typography } from '@material-ui/core';
import DatasetSelector from "./DatasetSelector";
import TimeLimitSlider from "./TimeLimitSlider";
import OpacitySlider from "./OpacitySlider";
import Map from "./Map";
import MapColorSchemeSelector from "./MapColorSchemeSelector";
import TravelTimePlot from "./TravelTimePlot";
import ContainerDimensions from 'react-container-dimensions';

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
    map: {
        minHeight: "550px",
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
                            <Typography paragraph style={{whiteSpace: 'pre-line'}}>
                                {"This tool will visualise the travel time between origins and destinations in the Auckland Region when using public transport. \n\n" +
                                "Click on the map to view the travel time from there to the rest of Auckland. To clear the map, select an empty location, such as the ocean. \n\n" +
                                "You can visualise how accessibility changes with the amount of time available by using the time limit slider in the control settings below."
                                }
                            </Typography>
                        </Paper>
                    </Grid>
                    <Grid item>
                        <Paper className={classes.paper}>
                            <DatasetSelector />
                        </Paper>
                    </Grid>
                    <Grid item>
                        <Paper className={classes.paper}>
                            <Typography variant="h5" gutterBottom>Controls</Typography>
                            <TimeLimitSlider />
                            <OpacitySlider />
                            <MapColorSchemeSelector />
                        </Paper>
                    </Grid>
                </Grid>
                <Grid container item direction="column" xs={8} spacing={3}>
                    <Grid item>
                        <Paper className={classes.paper}>
                            <ContainerDimensions className={classes.map}>
                                <Map />
                            </ContainerDimensions>
                        </Paper>
                    </Grid>
                    <Grid item>
                        <Paper className={classes.paper}>
                            <TravelTimePlot />
                        </Paper>
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

/*}
            <div>
                <div>{etaView+","+destinationDataset+","+timeLimit+","+mapOpacity}</div>
                <DatasetSelector />
                <TimeLimitSlider />
                <OpacitySlider />
                <MapLegend />
                <TravelTimePlot />
                <ContainerDimensions className={classes.map}>
                    <Map />
                </ContainerDimensions>
            </div>
            */