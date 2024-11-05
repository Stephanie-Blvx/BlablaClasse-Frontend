import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  value: { token: null, email: null, firstname: null, lastname: null, username: null, id  : null, kids: [], userType: null, },
};

export const parentSlice = createSlice({
  name: 'parent',
  initialState,
  reducers: {
    login: (state, action) => {
      state.value.firstname = action.payload.firstname;
      state.value.lastname = action.payload.lastname;
      state.value.token = action.payload.token;
      state.value.email = action.payload.email;
      state.value.username = action.payload.username;
      state.value.kids = action.payload.kids;
      state.value.id = action.payload.id;
      state.value.userType = action.payload.userType;
    },
    logout: (state) => {
      state.value.token = null;
      state.value.email = null;
      state.value.kids = [];
      state.value.userType = null;
      state.value.firstname = null;
      state.value.lastname = null;
      state.value.username = null;
      state.value.id = null;
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
