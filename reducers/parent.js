import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  value: { token: null, email: null, firstname: null, lastname: null, username: null, id  : null, kids: [], userType: null, },
};

export const parentSlice = createSlice({
  name: 'parent',
  initialState,
  reducers: {
    login: (state, action) => {
      state.value = action.payload;
    },
    logout: (state) => {
      // state.value.token = null;
      state.value = initialState.value;
    },
    setUserTypeParent: (state, action) => {
      console.log('Updating user type:', action.payload);
      state.value.userType = action.payload;
    },
    updateEmail: (state, action) => {
      state.value.email = action.payload;
    },
    updateKidInfo: (state, action) => {
      const updatedKid = action.payload;
      const kidIndex = state.value.kids.findIndex((kid) => kid._id === updatedKid._id);
      if (kidIndex !== -1) {
        state.value.kids[kidIndex] = updatedKid;
      }
    },
  },
});

export const { login, logout, updateEmail, updateKidInfo, setUserTypeParent } = parentSlice.actions;
export default parentSlice.reducer;
