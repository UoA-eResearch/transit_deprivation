import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withStyles, createMuiTheme } from '@material-ui/core/styles';
import { Select, MenuItem, Typography} from '@material-ui/core';
import { setMapColorScheme } from "../store/actions";

const theme = createMuiTheme({
    palette: {
        type: "light",
    },
});

const styles = (theme) => ({
    mapColorSchemeSelector: {
        minWidth: "150px"
    },
});

class MapColorSchemeSelector extends Component {

    _handleMapColorSchemeChange = (event) => {
        const { setMapColorScheme } = this.props;
        setMapColorScheme(event.target.value);
     };

    render() {
        const { classes, colorScheme } = this.props;
        return (
            <div>
                <Typography gutterBottom>
                    Colour Scheme
                </Typography>
                <Select
                    className={classes.mapColorSchemeSelector}
                    value={colorScheme}
                    onChange={this._handleMapColorSchemeChange}
                >
                    <MenuItem value={"BlueGreen"}>BlueGreen</MenuItem>
                    <MenuItem value={"Viridis"}>Viridis</MenuItem>
                    <MenuItem value={"Turbo"}>Turbo</MenuItem>
                </Select>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        colorScheme: state.mapColorScheme,
    }
};

const mapDispatchToProps = (dispatch) => {
    return ({
        setMapColorScheme: (mapColorScheme) => { dispatch(setMapColorScheme(mapColorScheme)) },
    });
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withStyles(styles, {defaultTheme: theme})(MapColorSchemeSelector));