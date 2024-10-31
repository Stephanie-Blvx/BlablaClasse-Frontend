import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    value: {menus: []},
};

export const menuSlice = createSlice({
    name: 'menu',
    initialState,
    reducers: {

        addMenu: (state, action) => {
            state.value.menus.push(action.payload);
        },
       

    },
});

export const { addMenu} = menuSlice.actions;
export default menuSlice.reducer;
