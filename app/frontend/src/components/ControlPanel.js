import React, {Component} from 'react';
import { connect } from 'react-redux';
import { withStyles, createTheme} from '@material-ui/core/styles';
import {Paper, Typography} from '@material-ui/core';
import TimeLimitSlider from "./TimeLimitSlider";
import DestinationTimeSlider from "./DestinationTimeSlider";

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

class ControlPanel extends Component {

    render() {
        const { classes } = this.props;

        return (
            <Paper className={classes.paper}>
                <Typography variant="h5">Controls</Typography>
                <TimeLimitSlider />
                <DestinationTimeSlider />
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
)(withStyles(styles, {defaultTheme: theme})(ControlPanel));