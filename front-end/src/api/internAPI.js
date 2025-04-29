import axios from '../configs/axios';

export const getAllEmployee = async () => {
    return await axios.get("/employee");
}