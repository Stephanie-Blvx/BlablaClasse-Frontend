import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  value: { token: null, firstname: null },
};

export const parentSlice = createSlice({
  name: 'parent',
  initialState,
  reducers: {
    login: (state, action) => {
      state.value.token = action.payload.token;
      state.value.firstname = action.payload.firstname;
    },
    logout: (state) => {
      state.value.token = null;
      state.value.firstname = null;
    },
  },
});

export const { login, logout } = parentSlice.actions;
export default parentSlice.reducer;
