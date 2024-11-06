import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  value: { token: null, email: null, firstname: null, lastname: null, username: null, classes: [], id: null, isAdmin: null, userType: null}};

export const teacherSlice = createSlice({
  name: 'teacher',
  initialState,
  reducers: {
    login: (state, action) => {
      state.value = action.payload;

    },
    logout: (state) => {
        state.value = initialState.value; // Mettre à jour l 'état
    },
    setUserTypeTeacher: (state, action) => {
      console.log('Updating user type:', action.payload); 
      state.value.userType = action.payload;
    },
    updateEmail: (state, action) => {
      state.value.email = action.payload; // Mettre à jour l'email dans l'état
    },
  },
});

export const { login, logout, updateEmail, setUserTypeTeacher } = teacherSlice.actions;
export default teacherSlice.reducer;