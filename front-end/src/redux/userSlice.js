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
        setDataMain: (state, action) => {
            state.email = action.payload.email;
            state.name = action.payload.name;
            state.roles = action.payload.roles;
            state.accessToken = action.payload.accessToken;
        },

        resetDataMain: (state) => {
            state.email = null;
            state.name = null;
            state.roles = [];
            state.accessToken = null;
        }
    }
})


export const { setDataMain, resetDataMain } = user.actions;

export default user.reducer;