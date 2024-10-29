import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    value: {classe: null , date: null ,description: null},
};

export const eventSlice = createSlice({
    name: 'event',
    initialState,
    reducers: {

        addEvent: (state, action) => {
            state.value.classe = action.payload;
            state.value.date = action.payload;
            state.value.description = action.payload;
          
        },
        removeEvent: (state, action) => {
            state.value.description = state.value.description.filter(e => e.name !== action.payload);
        },


    },
});

export const { addEvent, removeEvent } = eventSlice.actions;
export default eventSlice.reducer;
