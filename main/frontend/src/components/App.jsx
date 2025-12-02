import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";

import Header from "./Header.jsx";
import Footer from "./Footer.jsx";

import Dashboard from "../pages/Dashboard.jsx";
import DataTablePage from "../pages/DataTablePage.jsx";
import Home from "../pages/Home.jsx";
import Chatbot from "./Chatbot.jsx";
import Profile from "../pages/Profile.jsx"; 

import Login from "./Login.jsx";
import Signup from "./signup.jsx";
import ProtectedRoute from "./ProtectedRoute.jsx";

export default function App() {
  const [data, setData] = useState([]);

  return (
    <BrowserRouter>
      <Routes>

        {/* AUTH ROUTES (NO HEADER/FOOTER) */}
        
        <Route path="/" element={<><Header/><Home /><Footer/></>} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* PROTECTED ROUTES */}
        
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <>
                <Header />
                <Dashboard data={data} setData={setData} />
                <Chatbot placesData={data} />
                <Footer />
              </>
            </ProtectedRoute>
          }
        />

        <Route
          path="/data-table"
          element={
            <ProtectedRoute>
              <>
                <Header />
                <DataTablePage rows={data} />
                <Chatbot placesData={data} />
                <Footer />
              </>
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <>
                <Header />
                <Profile />
                <Chatbot placesData={data} />
                <Footer />
              </>
            </ProtectedRoute>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}