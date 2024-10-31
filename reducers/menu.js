import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    value: {menu:null},
};

export const menuSlice = createSlice({
    name: 'menu',
    initialState,
    reducers: {

        addMenu: (state, action) => {
            state.value.menu=action.payload;
        },
       

    },
});

export const { addMenu} = menuSlice.actions;
export default menuSlice.reducer;
