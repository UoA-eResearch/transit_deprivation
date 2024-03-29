import React, {Component} from 'react';
import { connect } from 'react-redux';
import { withStyles, createTheme} from '@material-ui/core/styles';
import { Slider, Typography} from '@material-ui/core';
import { computeAB, setTimeLimit } from "../store/actions";

const theme = createTheme({
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
        const { computeAB, setTimeLimit } = this.props;
        setTimeLimit(value);
        computeAB();
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
                    defaultValue={120}
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
        computeAB: () => { dispatch(computeAB()) },
        setTimeLimit: (timeLimit) => { dispatch(setTimeLimit(timeLimit)) },
    });
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withStyles(styles, {defaultTheme: theme})(TimeLimitSlider));