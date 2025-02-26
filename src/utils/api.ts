const API_BASE_URL = "http://localhost:3000";
import { StationsService } from "./station_api";
import { UserService } from "./user_api";

const getToken = () => localStorage.getItem("jwtToken");

export const api = {
    stations: StationsService(API_BASE_URL, getToken),
    users: UserService(API_BASE_URL, getToken),
};