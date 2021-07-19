import React, {Component} from 'react';
import { connect } from 'react-redux';
import { withStyles, createTheme} from '@material-ui/core/styles';
import { Paper, Grid, Typography } from '@material-ui/core';
import ViewPanel from "./ViewPanel";
import DataPanel from "./DataPanel";
import ControlPanel from "./ControlPanel";
import MapPanel from "./MapPanel";
import Footer from "./Footer";

const theme = createTheme({
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
    link: {
        textDecoration: 'none',
        color: theme.palette.text.secondary,
        fontWeight: 'bolder',
    }
});

class App extends Component {

    render() {
        const { classes } = this.props;
        return (
            <Grid className={classes.root} container spacing={3} justifyContent="center" alignItems="flex-start">
                <Grid item container direction="column" xs={4} spacing={3}>
                    <Grid item>
                        <Paper className={classes.paper}>
                            <Typography variant="h4">
                                Transit & Deprivation
                            </Typography>
                            <Typography variant="body1" style={{whiteSpace: 'pre-line', marginTop: theme.spacing(2)}}>
                                {
                                    "This tool visualises the impact of deprivation on accessibility via public transport in Auckland\n\n" +
                                    "Start by selecting a destination data set in the Data panel below. Then use the Destination panel to select a location of interest and the Origin panel to select a starting location\n\n" +
                                    "Basemap geometry and data sets are sourced from the "
                                }
                                <a className={classes.link} href={'https://www.fmhs.auckland.ac.nz/en/soph/about/our-departments/epidemiology-and-biostatistics/research/hgd/research-themes/imd18.html'}>
                                    2018 Index of Multiple Deprivation
                                </a>
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
                <Footer />
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
)(withStyles(styles, {defaultTheme: theme})(App));