import dash
import dash_core_components as dcc
import dash_html_components as html
from dash.dependencies import Input, Output, State
from plotly import graph_objs as go
from plotly.graph_objs import *

from glob import glob
import os
from os.path import basename, splitext
import pandas as pd
from datetime import datetime
from pytz import timezone
import shapefile
import numpy as np
import json
import time

app = dash.Dash(
    __name__, meta_tags=[{"name": "viewport", "content": "width=device-width"}]
)
server = app.server

# Plotly mapbox public token
mapbox_access_token = "pk.eyJ1IjoicGxvdGx5bWFwYm94IiwiYSI6ImNrOWJqb2F4djBnMjEzbG50amg0dnJieG4ifQ.Zme1-Uzoi75IaFbieBDl3A"

# parameters
sf_path = "data/points_akl.shp"
odt_path = "odt.npy"
data_dir="results"
tz = timezone("Pacific/Auckland")

# data loading and sanity checking

# shapefile
points = shapefile.Reader(sf_path)
npt = len(points.records())
print(f"Loaded shapefile with {npt} points")

# odt spatial index
geoids = sorted([r[0] for r in points.records()])
loc_idx = {g: i for i, g in enumerate(geoids)}
assert len(loc_idx) == npt, "Shapefile may contain duplicate identifiers"

# extract lat lon from points
locations_lon, locations_lat = zip(*[p.points[0] for p in points.shapes()])

with open(odt_path, 'rb') as f:
    t_start = time.time()
    print(f"Loading data ...", end="")
    odt = np.load(f)
    print(f" {time.time() - t_start:.3f} s")

regions = {"auckland":(-36.8485, 174.7633)} # lat lon

def is_valid(a, threshold=0):
    """
    a: np.array
    return mask indicating columns in a that include values > threshold
    """
    return a.max(axis=-1) > threshold

def plan(origin, cube, limit):

    options = cube[origin, ...]  # vertical plane through cube
    valid = is_valid(options)

    # set time budget for each option
    t_budget = limit  # minutes

    t_remain = np.zeros_like(options)
    t_remain[valid] = t_budget

    # travel from origin to destination
    t_remain[valid] -= options[valid]
    t_remain[t_remain < 0] = 0

    # update valid routes
    valid = is_valid(t_remain)

    # list of accessible location indices
    acc_idx = [i for i, v in enumerate(valid) if v]

    return acc_idx

    # # debugging
    # result = []
    # for i, v in enumerate(range(800, 900)):
    #     if i < limit:
    #         result.append(v)
    # return result

def default_map(relayoutData):

    try:
        lat = (relayoutData['mapbox.center']['lat'])
        lon = (relayoutData['mapbox.center']['lon'])
        zoom = (relayoutData['mapbox.zoom'])
    except:
        lat, lon = regions["auckland"]
        zoom=12

    data = [

        # Plot of important locations on the map
        Scattermapbox(
            lat=locations_lat,
            lon=locations_lon,
            mode="markers",
            hoverinfo="none",
            marker=dict(size=8, color="#ffa0a0"),
        ),
    ]

    layout = dict(
        mapbox=dict(
            layers=[],
            accesstoken=mapbox_access_token,
            center=dict(lat=lat, lon=lon),
            zoom=zoom,
            style="carto-positron",
        ),
        hovermode="closest",
        margin=dict(r=0, l=0, t=0, b=0),
        dragmode="pan",
        clickmode="event+select"
    )

    return dict(data=data, layout=layout)


def route_map(origin, cube, limit, relayoutData):

    try:
        lat = (relayoutData['mapbox.center']['lat'])
        lon = (relayoutData['mapbox.center']['lon'])
        zoom = (relayoutData['mapbox.zoom'])
    except:
        lat, lon = locations_lat[origin], locations_lon[origin]
        zoom = 12

    locations = plan(origin, cube, limit)

    data = [

        # Plot of important locations on the map
        Scattermapbox(
            lat=[locations_lat[i] for i in locations],
            lon=[locations_lon[i] for i in locations],
            mode="markers",
            hoverinfo="none",
            marker=dict(size=8, color="#00ffff"),
        ),
    ]

    layout = dict(
        mapbox=dict(
            layers=[],
            accesstoken=mapbox_access_token,
            center=dict(lat=lat, lon=lon),
            zoom=zoom,
            style="carto-positron",
        ),
        hovermode="closest",
        margin=dict(r=0, l=0, t=0, b=0),
        dragmode="pan",
        clickmode="event"
    )

    return dict(data=data, layout=layout)


# Layout of Dash App
app.layout = html.Div(
    children=[
        html.Div(
            className="row",
            children=[
                # Column for user controls
                html.Div(
                    className="four columns div-user-controls",
                    children=[
                        html.Img(className="logo", src=app.get_asset_url("dash-logo-new.png")),
                        html.H2("Transit & Deprivation"),
                        html.P("Select a starting location from the map"),
                        html.P(id="selected-point"),
                        html.Div(
                            id="time-limit-slider-container",
                            children=[
                                html.P(
                                    id="time-limit-slider-text",
                                    children="Drag the slider to change the available travel time in minutes",
                                ),
                                dcc.Slider(
                                    id="time-limit-slider",
                                    min=1,
                                    max=240,
                                    step=1,
                                    value=60,
                                    marks={
                                        str(t): {
                                            "label": str(t),
                                            "style": {"color": "#7fafdf"},
                                        }
                                        for t in [1, 60, 120, 180, 240]
                                    },
                                    updatemode='mouseup',
                                ),
                                html.Div(id="time-limit-value", style={"margin-top": 20})
                            ],
                        ),

                    ],
                ),
                # Column for app graphs and plots
                html.Div(
                    id="map-container",
                    className="eight columns div-for-charts bg-grey",
                    children=[
                        dcc.Graph(
                            id="map-graph",
                            figure=default_map(None)
                        )
                    ],
                ),
            ],
        )
    ]
)

# callbacks should be defined after app.layout

@app.callback(
    Output("time-limit-value", "children"), [Input("time-limit-slider", "value")]
)
def update_time_limit_value(value):
    value_text = f"Available time: {value} minutes"
    return value_text



@app.callback(
    Output("map-graph", "selectedData"), [Input("map-container", "n_clicks")]
)
def reset_selectedData(n_clicks):
    return None


@app.callback(
    [
        Output("selected-point", "children"),
        Output("map-graph", "figure")
    ],
    [
        Input("map-graph", "selectedData"),
        Input("time-limit-slider", "value")
    ],
    [
        State("map-graph", "relayoutData")
    ]
)
def select_point(selectedData, value, relayoutData):
    if selectedData:
        origin = selectedData["points"][0]["pointIndex"]
        figure = go.Figure(route_map(origin, odt, value, relayoutData))
    else:
        origin = "None"
        figure = go.Figure(default_map(relayoutData))

    selected_text = f"Selected point: {origin}"
    return selected_text, figure


if __name__ == "__main__":
    app.run_server(debug=True)

# save odt, spatial and time indexes

# color code results
# do not display selected point, instead create another trace with a separate color/maker to highlight selection