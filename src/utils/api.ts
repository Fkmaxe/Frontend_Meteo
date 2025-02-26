const API_BASE_URL = "http://localhost:3000";
import { StationsService } from "./station_api";
import { UserService } from "./user_api";



export const api = {
    stations: StationsService(API_BASE_URL),
    users: UserService(API_BASE_URL),
};