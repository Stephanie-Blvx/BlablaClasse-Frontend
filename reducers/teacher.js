import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  value: { token: null, email: null, firstname: null, lastname: null, username: null, classes: [], id: null, userType: null,  },
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
    setUserType: (state, action) => {
      console.log('Updating user type:', action.payload); 
      state.value.userType = action.payload;
    },
    updateEmail: (state, action) => {
      state.value.email = action.payload; // Mettre à jour l'email dans l'état
    },
  },
});

export const { login, logout, updateEmail, setUserType } = teacherSlice.actions;
export default teacherSlice.reducer;