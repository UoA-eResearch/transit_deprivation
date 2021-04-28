export const DESTINATION_NONE = "None";
export const DESTINATION_DIABETES_CLINICS = "Diabetes Clinics";
export const DESTINATION_PRIMARY_SCHOOLS = "Primary Schools";
export const DESTINATION_INTERMEDIATE_SCHOOLS = "Intermediate Schools";
export const DESTINATION_SECONDARY_SCHOOLS = "Secondary Schools";

export const destinationToProperty = {
    [DESTINATION_NONE]: {
        "info": "No destination dataset selected"
    },
    [DESTINATION_DIABETES_CLINICS]: {
        "info": "Clinics supporting diabetes outpatients",
    },
    [DESTINATION_PRIMARY_SCHOOLS]: {
        "info": "Primary schools",
    },
    [DESTINATION_INTERMEDIATE_SCHOOLS]: {
        "info": "Intermediate schools",
    },
    [DESTINATION_SECONDARY_SCHOOLS]: {
        "info": "Secondary schools",
    },

}