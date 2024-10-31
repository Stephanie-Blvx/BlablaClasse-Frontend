import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  value: { token: null, email: null, firstname: null, lastname: null, username: null, classes: [], id: null },
};

export const teacherSlice = createSlice({
  name: 'teacher',
  initialState,
  reducers: {
    login: (state, action) => {
      state.value.firstname = action.payload.firstname;
      state.value.lastname = action.payload.lastname;
      state.value.token = action.payload.token;
      state.value.email = action.payload.email;
      state.value.username= action.payload.username;
      state.value.classes= action.payload.classes;
      state.value.id= action.payload.id
    },
    logout: (state) => {
        state.value.firstname = null;
        state.value.lastname = null;
        state.value.token = null;
        state.value.email = null;
        state.value.username= null;
        state.value.classes= [];
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

export const { login, logout, updatePassword, updateEmail } = teacherSlice.actions;
export default teacherSlice.reducer;