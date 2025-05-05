import axios  from "../configs/axios";

export const getAllRoles = async () => {
    return axios.get("/role");
}