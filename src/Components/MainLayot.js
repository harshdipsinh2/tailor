import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../pages/Sidebar"; // Import the new Sidebar component

const MainLayout = () => {
  return (
    <div className="flex">
      <Sidebar />  {/* Sidebar for navigation */}
      <div className="content-area p-4 w-full">  {/* Main content area */}
        <Outlet />  {/* This renders the current route's content */}
      </div>
    </div>
  );
};

export default MainLayout;
