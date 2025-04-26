import { createSlice } from "@reduxjs/toolkit";

<<<<<<< HEAD
=======
const initialState = {
    email :null,
    name: null,
    roles: [],
    accessToken: null
}
>>>>>>> 60b50e783261d2ad655d5f95bdc012bab142f4cd

export const user = createSlice({
    name: "user",
    initialState: {
        name: ""
    },
    reducers:{
<<<<<<< HEAD
        updateName: (state, action) => {
            state.name = action.payload
=======
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
>>>>>>> 60b50e783261d2ad655d5f95bdc012bab142f4cd
        }
    }
})


<<<<<<< HEAD
export const {updateName} = user.actions;
=======
export const { setDataMain, resetDataMain } = user.actions;
>>>>>>> 60b50e783261d2ad655d5f95bdc012bab142f4cd

export default user.reducer;