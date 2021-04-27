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
    [BASEMAP_POPULATION]: {
        "property": "Census18_P",
        "info": "Census 2018 Population",
        "label": "Census 2018 Population"
    },
    [BASEMAP_DEPRIVATION]: {
        "property": "IMD18",
        "info": "A weighted aggregate of deprivation measures in employment, income, crime, housing, health, education and access to essential services",
        "label": "IMD Rank (lower is better)"
    },
    [BASEMAP_DEPRIVATION_EDUCATION]: {
        "property": "Education",
        "info": "Includes school leavers < 17 years old, school leavers without NCEA L2 and those not enrolling in tertiary studies, working age people without qualifications, youth not in education employment or training",
        "label": "IMD Education Rank (lower is better)"
    },
    [BASEMAP_DEPRIVATION_ACCESS]: {
        "property": "Access",
        "info": "Distance to 3 nearest: GPs or A&Ms, supermarkets, service stations, primary or intermediate schools, early childhood education centers",
        "label": "IMD Access Rank (lower is better)"
    },
    [BASEMAP_DEPRIVATION_CRIME]: {
        "property": "Crime",
        "info": "Victimisation rates for homicide and related offences, assault, sexual assault, abduction and kidnapping, robbery, extortion and related offences, unlawful entry with intent/burglary, breaking and entering, theft and related offences",
        "label": "IMD Crime Rank (lower is better)"
    },
    [BASEMAP_DEPRIVATION_EMPLOYMENT]: {
        "property": "Employment",
        "info": "Number of working age people receiving daily gross payments of < $45 for Jobseeker Support (excluding sole parents)",
        "label": "IMD Employment Rank (lower is better)"
    },
    [BASEMAP_DEPRIVATION_HEALTH]: {
        "property": "Health",
        "info": "Standardised mortality ratio, hospitalisations related to selected respiratory diseases, emergency hospital admissions, people registered as having selected cancers",
        "label": "IMD Health Rank (lower is better)"
    },
    [BASEMAP_DEPRIVATION_HOUSING]: {
        "property": "Housing",
        "info": "Number of persons living in households which are rented, overcrowded, damp or that do not have all the amenities listed on the census dwelling form",
        "label": "IMD Housing Rank (lower is better)"
    },
    [BASEMAP_DEPRIVATION_INCOME]: {
        "property": "Income",
        "info": "Dollars per 1000 population for Working for Families payments, income tested benefits including sole parents receiving Jobseeker Support with daily gross payments of $45 or more",
        "label": "IMD Income Rank (lower is better)"
    },
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