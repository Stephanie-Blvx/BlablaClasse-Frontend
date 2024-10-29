import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  value: { token: null, email: null },
};

export const parentSlice = createSlice({
  name: 'parent',
  initialState,
  reducers: {
    login: (state, action) => {
      state.value.token = action.payload.token;
      state.value.email = action.payload.email;
      state.value.kidsinfo = action.payload.kids;
    },
    logout: (state) => {
      state.value.token = null;
      state.value.email = null;
      state.value.kidsinfo = [];

    },
  },
});

export const { login, logout } = parentSlice.actions;
export default parentSlice.reducer;
