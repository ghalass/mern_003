export const BASE_URL = "http://localhost:4000";

// utilis/apiPaths.js
export const API_PATHS = {
    AUTH: {
        LOGIN: "/auth/login",
        REGISTER: "/auth/register",
        GET_USER_INFO: "/auth/getUserInfo",
    },
    DASHBOARD: {
        GET_DATA: "/dashboard/",
    },
    SITES: {
        GET_ALL_SITES: "/sites/get",
        ADD_SITE: "/sites/add",
        UPDATE_SITE: (siteId) => `/sites/${siteId}`,
        DELETE_SITE: (siteId) => `/sites/${siteId}`,
        DOWNLOAD_SITES: "/sites/downloadexcel",
    },
    IMAGE: {
        UPLOAD_IMAGE: "/auth/upload-image",
    },
};