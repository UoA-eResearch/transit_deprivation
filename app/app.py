import dash
import dash_core_components as dcc
import dash_html_components as html
from dash.dependencies import Input, Output, State
from plotly import graph_objs as go
from plotly.graph_objs import *
from plotly.subplots import make_subplots

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
    idx_t = {v: k for k, v in t_idx.items()}  # mapping from t index to travel time
    print(f" -- loaded time index with dimension {len(t_idx)} ({time.time() - t_start:.3f} s)")

print(f" -- total time: {time.time() - t_total_start:.3f} s")

# extract lat lon from points
locations_lon, locations_lat = zip(*[p.points[0] for p in points.shapes()])

regions = {"auckland": (-36.8485, 174.7633)} # lat lon

# ui defaults
ui_defaults = dict(
    selection_map_opacity=0.2,
    selection_map_zoom=12,
    route_map_opacity=1.0,
    mapbox_style="carto-positron"
)

def is_valid(a):
    return np.logical_not(np.isnan(a))

def travel_time_accessibility(origin, cube, limit):

    options = cube[origin, ...]  # vertical plane through cube
    valid = is_valid(options)

    # set time budget for each option
    t_budget = limit  # minutes

    t_remain = np.zeros_like(options)
    t_remain[valid] = t_budget

    # travel from origin to destination
    t_remain[valid] -= options[valid]
    t_remain[t_remain < 0] = 0

    # data dims
    n_loc, n_t = t_remain.shape

    # mean eta for each location at least one route that meets the constraints
    valid_loc = np.max(t_remain, axis=-1) > 0
    etas = np.nanmean(options[valid_loc], axis=-1)
    acc_idx = [i for i, v in enumerate(valid_loc) if v]

    # proportion of time each destination is accessible from this location within the time limit
    acc_t_by_loc = np.nansum(t_remain[acc_idx] > 0, axis=1) / n_t

    return acc_idx, etas, acc_t_by_loc


def selection_map(relayoutData):

    opacity = ui_defaults["selection_map_opacity"]
    locations = [f["id"] for f in polys["features"]]
    values = [0.75] * len(locations)

    try:
        lat = (relayoutData['mapbox.center']['lat'])
        lon = (relayoutData['mapbox.center']['lon'])
        zoom = (relayoutData['mapbox.zoom'])
    except:
        lat, lon = regions["auckland"]
        zoom=ui_defaults["selection_map_zoom"]

    data = [
        Choroplethmapbox(
            geojson=polys,
            featureidkey="id",
            locations=locations,
            z=values,
            colorscale="Greys",
            showscale=False,
            marker=dict(opacity=opacity, line=dict(width=0.1)),
        ),
    ]

    layout = dict(
        mapbox=dict(
            layers=[],
            accesstoken=mapbox_access_token,
            center=dict(lat=lat, lon=lon),
            zoom=zoom,
            style=ui_defaults["mapbox_style"]
        ),
        hovermode="closest",
        margin=dict(r=0, l=0, t=0, b=0),
        dragmode="pan",
        clickmode="event+select"
    )

    return dict(data=data, layout=layout)

def route_map(origin_idx, locations, values, opacity, relayoutData):

    try:
        lat = (relayoutData['mapbox.center']['lat'])
        lon = (relayoutData['mapbox.center']['lon'])
        zoom = (relayoutData['mapbox.zoom'])
    except:
        lat, lon = locations_lat[origin_idx], locations_lon[origin_idx]
        zoom = ui_defaults["selection_map_zoom"]

    locations = [idx_loc[l] for l in locations]

    data = [
        Choroplethmapbox(
            geojson=polys,
            featureidkey="id",
            locations=locations,
            z=values,
            colorscale="Viridis",
            showscale=True,
            colorbar=dict(
                    title="Mean ETA",
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
            marker=dict(opacity=opacity, line=dict(width=0.0)),
        ),
    ]

    layout = dict(
        mapbox=dict(
            layers=[],
            accesstoken=mapbox_access_token,
            center=dict(lat=lat, lon=lon),
            zoom=zoom,
            style=ui_defaults["mapbox_style"]
        ),
        hovermode="closest",
        margin=dict(r=0, l=0, t=0, b=0),
        dragmode="pan",
        clickmode="event",
        autosize=True
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
                    ],
                ),
                html.Div(
                    id="plot-container",
                    className="eight columns div-for-charts bg-grey",
                    children=[
                        dcc.Loading(
                            type="default",
                            children=[
                                html.Div(
                                    id="map-container",
                                    children=[
                                        dcc.Graph(
                                            id="map-graph",
                                            className="single-plot",
                                            figure=selection_map(None)
                                        ),
                                    ]
                                ),
                            ]
                        ),
                    ],
                )

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
        Output("map-graph", "figure"),
    ],
    [
        Input("map-graph", "selectedData"),
        Input("time-limit-slider", "value"),
    ],
    [
        State("map-graph", "relayoutData")
    ]
)
def select_point(selectedData, time_limit, relayoutData):

    if selectedData:
        origin = selectedData["points"][0]["location"]
        origin_idx = loc_idx[origin]
        locations, values, opacity = travel_time_accessibility(origin_idx, odt, time_limit)
        figure = go.Figure(route_map(origin_idx, locations, values, opacity, relayoutData))
        selected_text = f"Selected location: {origin}"

    else:
        figure = go.Figure(selection_map(relayoutData))
        selected_text = f"Selected location: None"

    return selected_text, figure


if __name__ == "__main__":
    app.run_server(host="0.0.0.0", debug=True)
