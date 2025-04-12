import React from "react";
import Header from "../../Header";
import { Outlet } from "react-router-dom";

export default function MainLayout() {
    return (
        <div className="MainLayout">
            <Header isAuthenticated={true} />
            <div className="Main my-5 py-5">
                <Outlet />
            </div>
        </div>
    );
};