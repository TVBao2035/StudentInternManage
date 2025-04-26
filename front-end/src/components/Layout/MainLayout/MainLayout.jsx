import React from "react";
import Header from "../../Header/Header";
import { Outlet, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { resetDataMain } from "../../../redux/userSlice";

export default function MainLayout() {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate("/login");
  };

  const handleLogoutClick = () => {
    document.cookie = `${process.env.REACT_APP_COOKIE_NAME}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    dispatch(resetDataMain());
    navigate("/login");
  };
  return (
    <>
      <Header
        isAuthenticated={!!user.email}
        userFullName={user.name || ""}
        userRoles={user.roles || []}
        onLoginClick={handleLoginClick}
        onLogoutClick={handleLogoutClick}
      />
      <main className="pt-6 min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Outlet />
        </div>
      </main>
    </>
    // <div className="MainLayout">
    //   <Header />
    //   <div className="Main my-5 py-5">
    //     <Outlet />
    //   </div>
    // </div>
  );
}
