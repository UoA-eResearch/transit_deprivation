export const BASEMAP_NONE = "None";
export const BASEMAP_POPULATION = "Population";
export const BASEMAP_DEPRIVATION = "Deprivation";
export const BASEMAP_DEPRIVATION_EDUCATION = "IMD - Education Rank";
export const BASEMAP_DEPRIVATION_ACCESS = "IMD - Access Rank";
export const BASEMAP_DEPRIVATION_CRIME = "IMD - Crime Rank";
export const BASEMAP_DEPRIVATION_EMPLOYMENT = "IMD - Employment Rank";
export const BASEMAP_DEPRIVATION_HEALTH = "IMD - Health Rank";
export const BASEMAP_DEPRIVATION_HOUSING = "IMD - Housing Rank";
export const BASEMAP_DEPRIVATION_INCOME = "IMD - Income Rank";

export const basemapToProperty = {
    [BASEMAP_NONE]: {"property": null},
    [BASEMAP_POPULATION]: {"property": "Census18_P", "info": "Census 2018 Population", "label": "Census 2018 Population"},
    [BASEMAP_DEPRIVATION]: {"property": "IMD18", "info": "Index of Multiple Deprivation (IMD)", "label": "IMD Rank (lower is better)"},
    [BASEMAP_DEPRIVATION_EDUCATION]: {"property": "Education", "info": "IMD Education Rank", "label": "IMD Education Rank (lower is better)"},
    [BASEMAP_DEPRIVATION_ACCESS]: {"property": "Access", "info": "IMD Access Rank", "label": "IMD Access Rank (lower is better)"},
    [BASEMAP_DEPRIVATION_CRIME]: {"property": "Crime", "info": "IMD Crime Rank", "label": "IMD Crime Rank (lower is better)"},
    [BASEMAP_DEPRIVATION_EMPLOYMENT]: {"property": "Employment", "info": "IMD Employment Rank", "label": "IMD Employment Rank (lower is better)"},
    [BASEMAP_DEPRIVATION_HEALTH]: {"property": "Health", "info": "IMD Health Rank", "label": "IMD Health Rank (lower is better)"},
    [BASEMAP_DEPRIVATION_HOUSING]: {"property": "Housing", "info": "IMD Housing Rank", "label": "IMD Housing Rank (lower is better)"},
    [BASEMAP_DEPRIVATION_INCOME]: {"property": "Income", "info": "IMD Income Rank", "label": "IMD Income Rank (lower is better)"},
}

// [x] Access: 5721
// [x] Census18_P: 1113
// Count_MB18: 10
// [x] Crime: 3977
// DZ2018: 7600002
// [x] Education: 4470
// [x] Employment: 4503
// [x] Health: 2954
// [x] Housing: 1804
// IMD18: 3907
// [x] Income: 3467
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