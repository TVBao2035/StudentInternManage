import { createSlice } from "@reduxjs/toolkit";



const initialState = {
    email :null,
    name: null,
    roles: [],
    accessToken: null
}

export const user = createSlice({
    name: "user",
    initialState,
    reducers:{
        setData: (state, action) => {
            state.email = action.payload.email;
            state.name = action.payload.name;
            state.roles = action.payload.roles;
            state.accessToken = action.payload.accessToken;
        }
    }
})


export const { setData } = user.actions;

export default user.reducer;