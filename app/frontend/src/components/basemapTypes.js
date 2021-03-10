export const BASEMAP_NONE = "None";
export const BASEMAP_POPULATION = "Population";
export const BASEMAP_DEPRIVATION = "Deprivation";
export const BASEMAP_DEPRIVATION_EDUCATION = "IMD - Education Rank";

export const basemapToProperty = {
    [BASEMAP_NONE]: {"property": null},
    [BASEMAP_POPULATION]: {"property": "Census18_P", "info": "Census 2018 Population", "label": "Census 2018 Population"},
    [BASEMAP_DEPRIVATION]: {"property": "IMD18", "info": "Index of Multiple Deprivation (IMD)", "label": "IMD Rank (lower is better)"},
    [BASEMAP_DEPRIVATION_EDUCATION]: {"property": "Education", "info": "IMD Education Rank", "label": "IMD Education Rank (lower is better)"},
}

// Access: 5721
// Census18_P: 1113
// Count_MB18: 10
// Crime: 3977
// DZ2018: 7600002
// Education: 4470
// Employment: 4503
// Health: 2954
// Housing: 1804
// IMD18: 3907
// Income: 3467
// decAccess: 10
// decCrime: 7
// decEduc: 8
// decEmploy: 8
// decHealth: 5
// decHousing: 3
// decIMD18: 7
// decIncome: 6
// dhb2015__1: 2
// dhb2015__2: "Waitemata"
// ged2020n_1: 18
// ged2020n_2: "Kaipara ki Mahurangi"
// regc2020_1: 2
// regc2020_2: "Auckland Region"
// ta2020co_1: 76
// ta2020na_1: "Auckland"