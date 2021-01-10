import React, {Component} from 'react';
import { connect } from 'react-redux';
import { withStyles, createMuiTheme} from '@material-ui/core/styles';
import { Slider, Typography} from '@material-ui/core';
import { computeETA, setTimeLimit } from "../store/actions";

const theme = createMuiTheme({
    palette: {
        type: "light",
    },
});

const styles = (theme) => ({
    timeLimitSlider: {
        maxWidth: "300px"
    },
});

class TimeLimitSlider extends Component {

    handleTimeLimitChange = (event, value) => {
        const { computeETA, setTimeLimit } = this.props;
        setTimeLimit(value);
        computeETA();
    }

    render() {
        const { classes, timeLimit } = this.props;

        return (
            <div>
                <Typography gutterBottom style={{paddingTop:10}}>
                    Time Limit: {timeLimit} minutes
                </Typography>
                <Slider
                    className={classes.timeLimitSlider}
                    defaultValue={60}
                    onChange={this.handleTimeLimitChange}
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
        timeLimit: state.timeLimit,
    }
};

const mapDispatchToProps = (dispatch) => {
    return ({
        computeETA: () => { dispatch(computeETA()) },
        setTimeLimit: (timeLimit) => { dispatch(setTimeLimit(timeLimit)) },
    });
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withStyles(styles, {defaultTheme: theme})(TimeLimitSlider));