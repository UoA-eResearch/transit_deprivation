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
import pickle

app = dash.Dash(
    __name__, meta_tags=[{"name": "viewport", "content": "width=device-width"}]
)
server = app.server

# Plotly mapbox public token
mapbox_access_token = "pk.eyJ1IjoicGxvdGx5bWFwYm94IiwiYSI6ImNrOWJqb2F4djBnMjEzbG50amg0dnJieG4ifQ.Zme1-Uzoi75IaFbieBDl3A"

# load data
print(f"Loading data ...")
t_total_start = time.time()

# load shapefile points
t_start = time.time()
points = shapefile.Reader("data/akl_points.shp")
print(f" -- loaded shapefile with {len(points.records())} points ({time.time() - t_start:.3f} s)")

# load ploy geojson
#with open("data/sample.geojson") as f:
with open("data/akl_polygons_id.geojson") as f:
    t_start = time.time()
    polys = json.load(f)
    print(f" -- loaded polygon geojson ({time.time() - t_start:.3f} s)")

# load precomputed odt
with open("data/akl_odt.npy", 'rb') as f:
    t_start = time.time()
    odt = np.load(f)
    print(f" -- loaded odt cube with dimensions {odt.shape} ({time.time() - t_start:.3f} s)")

# load location index
with open("data/akl_loc_idx.pkl", 'rb') as f:
    t_start = time.time()
    loc_idx = pickle.load(f) # mapping from DataZone2018 field to point array index
    idx_loc = {v:k for k, v in loc_idx.items()} # mapping from point index to DataZone2018
    print(f" -- loaded location index with dimension {len(loc_idx)} ({time.time() - t_start:.3f} s)")

# load time index
with open("data/akl_t_idx.pkl", 'rb') as f:
    t_start = time.time()
    t_idx = pickle.load(f)
    print(f" -- loaded time index with dimension {len(t_idx)} ({time.time() - t_start:.3f} s)")

print(f" -- total time: {time.time() - t_total_start:.3f} s")

# extract lat lon from points
locations_lon, locations_lat = zip(*[p.points[0] for p in points.shapes()])

regions = {"auckland": (-36.8485, 174.7633)} # lat lon

# ui defaults
ui_defaults = dict(
    selection_map_opacity=0.2,
    selection_map_zoom=12,
    route_map_opacity=1.0)

def is_valid(a):
    return np.logical_not(np.isnan(a))


def plan(origin, cube, limit):

    #print(f"======================{origin}==============================")

    options = cube[origin, ...]  # vertical plane through cube
    valid = is_valid(options)

    # set time budget for each option
    t_budget = limit  # minutes

    t_remain = np.zeros_like(options)
    t_remain[valid] = t_budget

    # travel from origin to destination
    t_remain[valid] -= options[valid]
    t_remain[t_remain < 0] = 0

    # list of accessible locations and etas
    valid_loc = np.max(t_remain, axis=-1) > 0
    etas = np.nanmean(options[valid_loc], axis=-1)
    acc_idx = [i for i, v in enumerate(valid_loc) if v]

    return acc_idx, etas


def selection_map(relayoutData):

    opacity = ui_defaults["selection_map_opacity"]
    locations = [f["id"] for f in polys["features"]]
    #loc = [7600033, 7600147]
    #locations = [l for l in loc]

    #values = [f["properties"]["Census_Pop"] for f in polys["features"]]
    #values = np.array([l in pids for l in locations], dtype=np.int)
    values = [0.75] * len(locations)

    try:
        lat = (relayoutData['mapbox.center']['lat'])
        lon = (relayoutData['mapbox.center']['lon'])
        zoom = (relayoutData['mapbox.zoom'])
    except:
        lat, lon = regions["auckland"]
        zoom=ui_defaults["selection_map_zoom"]

    data = [

        # Scattermapbox(
        #     #lat = [locations_lat[loc_idx[l]] for l in loc],
        #     #lon = [locations_lon[loc_idx[l]] for l in loc],
        #     lat=locations_lat,
        #     lon=locations_lon,
        #     mode="markers",
        #     hoverinfo="none",
        #     marker=dict(size=8, color="#ffa0a0"),
        # ),
        Choroplethmapbox(
            geojson=polys,
            featureidkey="id",
            locations=locations,
            z=values,
            colorscale="Greys",
            showscale=False,
            marker=dict(opacity=opacity, line=dict(width=1)),

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


def route_map(origin, cube, time_limit, map_opacity, relayoutData):

    # origin is DataZone2018 ID
    # origin_idx is the point array index
    origin_idx = loc_idx[origin]

    try:
        lat = (relayoutData['mapbox.center']['lat'])
        lon = (relayoutData['mapbox.center']['lon'])
        zoom = (relayoutData['mapbox.zoom'])
    except:
        lat, lon = locations_lat[origin_idx], locations_lon[origin_idx]
        zoom = ui_defaults["selection_map_zoom"]

    locations, etas = plan(origin_idx, cube, time_limit)
    locations = [idx_loc[l] for l in locations]
    values = etas

    data = [
        # Scattermapbox(
        #     #lat = [locations_lat[origin_idx]],
        #     #lon = [locations_lon[origin_idx]],
        #     lat=locations_lat,
        #     lon=locations_lon,
        #     mode="markers",
        #     hoverinfo="none",
        #     marker=dict(size=8, color="#ffa0a0"),
        # ),
        Choroplethmapbox(
            geojson=polys,
            featureidkey="id",
            locations=locations,
            z=values,
            colorscale="Viridis",
            showscale=True,
            colorbar=dict(
                    title="ETA",
                    xpad=15,
                    yanchor="middle",
                    y=0.775,
                    tickmode="linear",
                    dtick=10,
                    tick0=0,
                    tickfont=dict(color="#000000"),
                    titlefont=dict(color="#000000"),
                    thicknessmode="pixels",
                    len=0.4
            ),
            marker=dict(opacity=map_opacity, line=dict(width=1)),
            #selectedpoints=[origin_idx]
        ),

        # Plot of important locations on the map
        # Scattermapbox(
        #     lat=[locations_lat[i] for i in locations],
        #     lon=[locations_lon[i] for i in locations],
        #     mode="markers",
        #     hoverinfo="text",
        #     text=[f"{t:.0f}" for t in etas],
        #     marker=dict(
        #         size=8,
        #         color=etas,
        #         colorscale=[
        #             [0, "#F4EC15"],
        #             [0.04167, "#DAF017"],
        #             [0.0833, "#BBEC19"],
        #             [0.125, "#9DE81B"],
        #             [0.1667, "#80E41D"],
        #             [0.2083, "#66E01F"],
        #             [0.25, "#4CDC20"],
        #             [0.292, "#34D822"],
        #             [0.333, "#24D249"],
        #             [0.375, "#25D042"],
        #             [0.4167, "#26CC58"],
        #             [0.4583, "#28C86D"],
        #             [0.50, "#29C481"],
        #             [0.54167, "#2AC093"],
        #             [0.5833, "#2BBCA4"],
        #             [1.0, "#613099"],
        #         ],
        #         colorbar=dict(
        #                 title="ETA",
        #                 xpad=15,
        #                 yanchor="middle",
        #                 y=0.775,
        #                 tickmode="linear",
        #                 dtick=10,
        #                 tick0=0,
        #                 tickfont=dict(color="#000000"),
        #                 titlefont=dict(color="#000000"),
        #                 thicknessmode="pixels",
        #                 len=0.4
        #         ),
        #     ),
        # ),
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
                                html.Div(
                                    style={"margin-top": 10},
                                    children=[
                                        html.P(id="time-limit-value")
                                    ]
                                ),
                            ],
                        ),
                        html.Div(
                            style={"margin-top": 20},
                            id="opacity-slider-container",
                            children = [
                                html.P(children="Route map opacity"),
                                dcc.Slider(
                                    id="map-opacity-slider",
                                    min=0,
                                    max=100,
                                    step=1,
                                    value=int(ui_defaults["route_map_opacity"] * 100),
                                    marks={
                                        str(t): {
                                            "label": str(t),
                                            "style": {"color": "#7fafdf"},
                                        }
                                        for t in list(range(0, 100, 20)) + [100]
                                    },
                                    updatemode='mouseup',
                                ),
                            ]
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
                            figure=selection_map(None)
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
        Input("time-limit-slider", "value"),
        Input("map-opacity-slider", "value")
    ],
    [
        State("map-graph", "relayoutData")
    ]
)
def select_point(selectedData, time_limit, map_opacity, relayoutData):
    #print(selectedData)
    map_opacity /= 100

    if selectedData:
        origin = selectedData["points"][0]["location"]
        #origin_idx = selectedData["points"][0]["pointIndex"]
        figure = go.Figure(route_map(origin, odt, time_limit, map_opacity, relayoutData))
        selected_text = f"Selected location: {origin}"
    else:
        figure = go.Figure(selection_map(relayoutData))
        selected_text = f"Selected location: None"

    return selected_text, figure


if __name__ == "__main__":
    app.run_server(host="0.0.0.0", debug=True)
