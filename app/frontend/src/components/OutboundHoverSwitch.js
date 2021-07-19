import React, {Component} from 'react';
import { connect } from 'react-redux';
import { withStyles, createTheme} from '@material-ui/core/styles';
import { Grid, Switch, Typography} from '@material-ui/core';
import {setShowOutboundHover} from "../store/actions";

const theme = createTheme({
    palette: {
        type: "light",
    },
});

const styles = (theme) => ({

});

class OutboundHoverSwitch extends Component {

    handleChange = (event, value) => {
        const {setShowOutboundHover} = this.props;
        setShowOutboundHover(value);
    }

    render() {
        const { show } = this.props;

        return (
            <Grid container direction="row" spacing={1} alignItems="center">
                <Grid item>
                    <Typography style={{paddingTop:0}}>
                        Show outbound accessibility time series
                    </Typography>
                </Grid>
                <Grid item>
                    <Switch
                        checked={show}
                        color="primary"
                        onChange={this.handleChange}
                        inputProps={{ 'aria-label': 'secondary checkbox' }}
                    />
                </Grid>
            </Grid>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        show: state.showOutboundHover
    }
};

const mapDispatchToProps = (dispatch) => {
    return ({
        setShowOutboundHover: (show) => {dispatch(setShowOutboundHover(show))},
    });
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withStyles(styles, {defaultTheme: theme})(OutboundHoverSwitch));