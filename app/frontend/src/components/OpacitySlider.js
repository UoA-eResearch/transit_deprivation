import React, {Component} from 'react';
import { connect } from 'react-redux';
import { withStyles, createMuiTheme} from '@material-ui/core/styles';
import { Slider, Typography} from '@material-ui/core';
import { setMapOpacity } from "../store/actions";

const theme = createMuiTheme({
    palette: {
        type: "light",
    },
});

const styles = (theme) => ({
    mapOpacitySlider: {
        maxWidth: "300px"
    },
});

class OpacitySlider extends Component {

    handleOpacityChange = (event, value) => {
        const { setMapOpacity } = this.props;
        setMapOpacity(value);
    }

    render() {
        const { classes } = this.props;

        return (
            <div>
                <Typography gutterBottom>
                    Opacity
                </Typography>
                <Slider
                    className={classes.mapOpacitySlider}
                    defaultValue={0.8}
                    onChange={this.handleOpacityChange}
                    aria-labelledby="continuous-slider"
                    valueLabelDisplay="auto"
                    step={0.01}
                    min={0.0}
                    max={1.0}
                />
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {

    }

};

const mapDispatchToProps = (dispatch) => {
    return ({
        setMapOpacity: (mapOpacity) => { dispatch(setMapOpacity(mapOpacity)) },
    });
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withStyles(styles, {defaultTheme: theme})(OpacitySlider));
