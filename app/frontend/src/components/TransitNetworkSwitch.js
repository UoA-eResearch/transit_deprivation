import React, {Component} from 'react';
import { connect } from 'react-redux';
import { withStyles, createMuiTheme} from '@material-ui/core/styles';
import { Grid, Switch, Typography} from '@material-ui/core';
import {setShowTransitNetwork, setTimeAtDestination} from "../store/actions";

const theme = createMuiTheme({
    palette: {
        type: "light",
    },
});

const styles = (theme) => ({

});

class TransitNetworkSwitch extends Component {

    handleChange = (event, value) => {
        const {setShowTransitNetwork} = this.props;
        setShowTransitNetwork(value);
        console.log(value);
    }

    render() {
        const { classes, show } = this.props;

        return (
            <Grid container direction="row" spacing={1} alignItems="center">
                <Grid item>
                    <Typography style={{paddingTop:0}}>
                        Show transit network
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
        show: state.showTransitNetwork
    }
};

const mapDispatchToProps = (dispatch) => {
    return ({
        setShowTransitNetwork: (show) => {dispatch(setShowTransitNetwork(show))},
    });
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withStyles(styles, {defaultTheme: theme})(TransitNetworkSwitch));