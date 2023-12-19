import axios from "axios";

const apiLine = axios.create({
    baseURL: "https://api.line.me/v2",
});

const apiLineNotify = axios.create({
    baseURL: "https://notify-api.line.me/api",
});

export const getLineToken = (payload) =>
    apiLine.post(`/oauth/accessToken`, payload);
export const getLineProfile = (payload) => apiLine.get(`/profile`, payload);
export const getLineNotify = (payload) =>
    apiLineNotify.post(`/notify`, payload);
export const getLineNotifyStatus = (payload) =>
    apiLineNotify.get(`/status`, payload);
export const getLineNotifyRevoke = (payload) =>
    apiLineNotify.post(`/revoke`, payload);

const apiLineLift = axios.create({
    baseURL: "https://api.line.me/oauth2/v2.1/token",
});

export const getLineLiftToken = (payload) =>
    apiLineLift.post(`/accessToken`, payload);

const apiLineLiftProfile = axios.create({
    baseURL: "https://api.line.me/v2/profile",
});

export const getLineLiftProfile = (payload) =>
    apiLineLiftProfile.get(`/`, payload);
