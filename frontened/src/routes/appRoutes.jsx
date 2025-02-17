import React from 'react';
import { Route, BrowserRouter, Routes } from 'react-router-dom';
import SignUp from '../pages/signup';
import Login from '../pages/login';
import Home from '../pages/home';
import Project from '../pages/project';

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/login" element={<Login />} />
        <Route path="/signUp" element={<SignUp />} />
        <Route path="/project" element={<Project />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;