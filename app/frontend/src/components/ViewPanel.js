import React, {Component} from 'react';
import { connect } from 'react-redux';
import { withStyles, createTheme} from '@material-ui/core/styles';
import {Grid, Paper, Typography} from '@material-ui/core';
import TransitNetworkSwitch from "./TransitNetworkSwitch";
import OpacitySlider from "./OpacitySlider";
import OutboundHoverSwitch from "./OutboundHoverSwitch";

const theme = createTheme({
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
                        <OutboundHoverSwitch />
                    </Grid>
                    <Grid item>
                        <TransitNetworkSwitch />
                    </Grid>
                    <Grid item>
                        <OpacitySlider />
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