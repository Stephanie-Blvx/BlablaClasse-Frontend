import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  value: { token: null, email: null, firstname: null, lastname: null, id  : null, kids: [], userType: 'parent', },
};

export const parentSlice = createSlice({
  name: 'parent',
  initialState,
  reducers: {
    login: (state, action) => {
      state.value.firstname = action.payload.firstname; // Mettre à jour le prénom
      state.value.lastname = action.payload.lastname; //  Mettre à jour le nom
      state.value.token = action.payload.token; // Mettre à jour le token
      state.value.email = action.payload.email; //  Mettre à jour l'email
      state.value.kids= action.payload.kids; // Mettre à jour les enfants
      state.value.id = action.payload.id; //  Mettre à jour l'id
      state.userType = action.payload.userType;   // Mettre à jour le type d'utilisateur
      
    },
    logout: (state) => {
      state.value.token = null; // Mettre à jour le token
      state.value.email = null; //    Mettre à jour l'email
      state.value.kids = []; // Mettre à jour les enfants
      state.value.userType = null; // Mettre à jour le type d'utilisateur
      state.value.firstname = null; // Mettre à jour le prénom
      state.value.lastname = null; //  Mettre à jour le nom
      state.value.id = null; //  Mettre à jour l'id
    },
    // updatePassword: (state, action) => {
    //   state.value.hashedPassword = action.payload; // Mettez à jour le mot de passe haché
    //   console.log("Mot de passe haché mis à jour dans l'état Redux"); // Pour le débogage
    // },
    updateEmail: (state, action) => {
      state.value.email = action.payload; // Mettre à jour l'email dans l'état
    },
    updateKidInfo: (state, action) => {
      const updatedKid = action.payload;
      const kidIndex = state.value.kids.findIndex((kid) => kid._id === updatedKid._id);
      if (kidIndex !== -1) {
        state.value.kids[kidIndex] = updatedKid; // Met à jour l'enfant dans l'état
      }
    },
  },
});

export const { login, logout, updatePassword, updateEmail, updateKidInfo } = parentSlice.actions;
export default parentSlice.reducer;
