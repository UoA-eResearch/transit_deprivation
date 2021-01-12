import React, {Component} from 'react';
import { connect } from 'react-redux';
import { withStyles, createMuiTheme } from '@material-ui/core/styles';
// timeseries
import { TimeSeries } from "pondjs";
import {
    Charts,
    ChartContainer,
    ChartRow,
    YAxis,
    LineChart,
    Resizable
} from "react-timeseries-charts";

const theme = createMuiTheme({
    palette: {
        type: "light",
    },
});

const styles = (theme) => ({
});

class TravelTimePlot extends Component {
    render() {
        const { data, query, locIdx, idxT, fullEta, valid, etaView} = this.props;
        const eta = (valid && fullEta) ? fullEta[etaView]["values"] : null;

        let points = [[0, 0]];
        if (eta != null && typeof query !== 'undefined' && query.id in eta){

            let idx = locIdx[query.id];
            let times = data[idx];
            points = Object.keys(times).map((key) => [idxT[key], times[key]]); // timestamps should be ms

        }

        const series = new TimeSeries({
            name: "Travel Time",
            columns: ["time", "value"],
            points: points,
            // tz: "Pacific/Auckland"
        });

        let min = series.min();
        let max = series.max();
        min = Math.max(0, min - min * 0.1);
        max *= 1.1;

        // https://software.es.net/react-timeseries-charts/#/api/charts/YAxis
        return (
            <Resizable>
                <ChartContainer
                    title="Travel Time"
                    titleStyle={{ fill: "#555", fontWeight: 400, fontFamily: "Roboto" }}
                    timeRange={series.range()}
                    format="%H:%M %p"
                    //format={timeFormat("%H:%M %p")}
                    timeAxisTickCount={10}
                    timeAxisStyle={{
                        axis:{fontFamily: "Roboto", fontSize: 12},
                        ticks: {"font-family": "Roboto", "font-size": "12"},
                        values: {"font-family": "Roboto", "font-size": "12"},
                    }}
                    utc={true}
                    transition={0}
                >
                    <ChartRow height="170">
                        <YAxis
                            id="duration"
                            label="Minutes"
                            min={min}
                            max={max}
                            width="60"
                            style={{
                                label: {"font-family": "Roboto", "font-size": "14"},
                                axis: {"font-family": "Roboto", "font-size": "12"},
                                ticks: {"font-family": "Roboto", "font-size": "12"},
                                values: {"font-family": "Roboto", "font-size": "12"},
                            }}
                        />
                        <Charts>
                            <LineChart
                                axis="duration"
                                series={series}
                            />
                        </Charts>
                    </ChartRow>
                </ChartContainer>
            </Resizable>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        data: state.locationDT,
        query: state.mapTooltip.hoveredObject,
        locIdx: state.locIdx,
        idxT: state.idxT,
        valid: state.valid,
        fullEta: state.eta,
        etaView: state.etaView,
    }
};

const mapDispatchToProps = (dispatch) => {
    return ({
    });
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withStyles(styles, {defaultTheme: theme})(TravelTimePlot));
