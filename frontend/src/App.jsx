import React from 'react';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/auth/Login';
import Register from './pages/users/Register'; // Placeholder
import Header from "./pages/Header.jsx";
import {UserProvider} from "./components/UserContext.jsx"; // Placeholder

import Users from './pages/users/Users';
import Purchases from "./pages/purchases/Purchases.jsx";
import Games from './pages/games/Games.jsx'; // Placeholder

const App = () => {
    return (
        <BrowserRouter>
            <UserProvider>
            <Routes>
                <Route path="/" element={<Header />}>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/users" element={<Users />} />
                <Route path="/purchases" element={<Purchases />} />
                <Route path="/games" element={<Games />} />
                </Route>
            </Routes>
            </UserProvider>
        </BrowserRouter>
    );
};

export default App;
