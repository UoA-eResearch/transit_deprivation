import React, {Component} from 'react';
import { connect } from 'react-redux';
import { withStyles, createMuiTheme} from '@material-ui/core/styles';
import { Slider, Typography} from '@material-ui/core';
import { computeETA, setTimeAtDestination } from "../store/actions";

const theme = createMuiTheme({
    palette: {
        type: "light",
    },
});

const styles = (theme) => ({
    destinationTimeSlider: {
        maxWidth: "300px"
    },
});

class DestinationTimeSlider extends Component {

    handleDestinationTimeChange = (event, value) => {
        const { computeETA, setTimeAtDestination } = this.props;
        setTimeAtDestination(value);
        computeETA();
    }

    render() {
        const { classes, timeAtDestination } = this.props;

        return (
            <div>
                <Typography gutterBottom style={{paddingTop:10}}>
                    Time at Destination: {timeAtDestination} minutes
                </Typography>
                <Slider
                    className={classes.destinationTimeSlider}
                    defaultValue={60}
                    onChange={this.handleDestinationTimeChange}
                    aria-labelledby="discrete-slider"
                    valueLabelDisplay="auto"
                    step={10}
                    marks
                    min={10}
                    max={300}
                />
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        timeAtDestination: state.timeAtDestination,
    }
};

const mapDispatchToProps = (dispatch) => {
    return ({
        computeETA: () => { dispatch(computeETA()) },
        setTimeAtDestination: (time) => { dispatch(setTimeAtDestination(time)) },
    });
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withStyles(styles, {defaultTheme: theme})(DestinationTimeSlider));