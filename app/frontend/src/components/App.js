import React, {Component} from 'react';
import { connect } from 'react-redux';
import { withStyles, createMuiTheme} from '@material-ui/core/styles';
import { Paper, Grid, Typography } from '@material-ui/core';
import MapTile from "./MapTile";
import * as mapTypes from "./mapTypes";
import ViewPanel from "./ViewPanel";
import DataPanel from "./DataPanel";
import ControlPanel from "./ControlPanel";
import MapPanel from "./MapPanel";

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
    footer: {
        color: theme.palette.text.secondary,
        marginTop: theme.spacing(2),
    }
});

class App extends Component {

    render() {
        const { classes } = this.props;
        return (
            <Grid className={classes.root} container spacing={3} justify="center" alignItems="flex-start">
                <Grid item container direction="column" xs={4} spacing={3}>
                    <Grid item>
                        <Paper className={classes.paper}>
                            <Typography variant="h4">
                                Transit & Deprivation
                            </Typography>
                            <Typography variant="body1" style={{whiteSpace: 'pre-line', marginTop: theme.spacing(2)}}>
                                {
                                    "This tool visualises the impact of deprivation on accessibility via public transport in Auckland\n\n" +
                                    "Start by selecting a destination data set in the Data panel below. Then use the Destination panel to select a location of interest and the Origin panel to select a starting location\n\n"
                                }
                            </Typography>
                        </Paper>
                    </Grid>
                    <Grid item>
                        <DataPanel />
                    </Grid>
                    <Grid item>
                        <ControlPanel />
                    </Grid>
                    <Grid item>
                        <ViewPanel />
                    </Grid>
                </Grid>
                <MapPanel />
                <Grid container item direction="column" spacing={3} alignItems="center" className={classes.footer}>
                    <Grid item container direction="row" spacing={3} justify="space-around">
                        <Grid item>
                            <Typography>University of Auckland</Typography>
                        </Grid>
                        <Grid item>
                            <Typography>Victoria University of Wellington</Typography>
                        </Grid>
                        <Grid item>
                            <Typography>University of Cantebury</Typography>
                        </Grid>
                        <Grid item>
                            <Typography>Ministry of Business, Innovation and Employment</Typography>
                        </Grid>
                    </Grid>
                    <Grid item>
                        <Typography>
                            Contact: xyz@auckland.ac.nz
                        </Typography>
                    </Grid>
                    <Grid item>
                        <Typography>
                            Favicon "route" by Viktor Fedyuk (Tim P) from the Noun Project
                        </Typography>
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