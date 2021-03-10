import React, {Component} from 'react';
import { connect } from 'react-redux';
import { withStyles, createMuiTheme} from '@material-ui/core/styles';
import {Grid, Paper, Switch, Typography} from '@material-ui/core';
import {setShowTransitNetwork, setTimeAtDestination} from "../store/actions";
import TransitNetworkSwitch from "./TransitNetworkSwitch";
import OpacitySlider from "./OpacitySlider";
import MapColorSchemeSelector from "./MapColorSchemeSelector";

const theme = createMuiTheme({
    palette: {
        type: "light",
    },
});

const styles = (theme) => ({
    paper: {
        padding: theme.spacing(2),
        color: theme.palette.text.secondary,
        background: theme.palette.background.paper
    },
});

class ViewPanel extends Component {

    render() {
        const { classes } = this.props;

        return (
            <Paper className={classes.paper}>
                <Grid container direction="column" spacing={1}>
                    <Grid item>
                        <Typography variant="h5" gutterBottom>View</Typography>
                    </Grid>
                    <Grid item>
                        <TransitNetworkSwitch />
                    </Grid>
                    <Grid item>
                        <OpacitySlider />
                    </Grid>
                    <Grid item>
                        <MapColorSchemeSelector />
                    </Grid>
                </Grid>
            </Paper>
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
)(withStyles(styles, {defaultTheme: theme})(ViewPanel));