import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  value: { token: null, email: null, firstname: null, lastname: null},
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
      state.value.kids= action.payload.kids;
      
    },
    logout: (state) => {
      state.value.token = null;
      state.value.email = null;
      state.value.kids = [];
    },
    updatePassword: (state, action) => {
      state.value.hashedPassword = action.payload; // Mettez à jour le mot de passe haché
      console.log("Mot de passe haché mis à jour dans l'état Redux");
    },
    updateEmail: (state, action) => {
      state.value.email = action.payload; // Mettre à jour l'email dans l'état
    },
  },
});

export const { login, logout, updatePassword, updateEmail } = parentSlice.actions;
export default parentSlice.reducer;
