import React from "react";
import { Outlet } from "react-router-dom";
import NavbarUserCompany from "../components/NavbarUserCompany";

const MainUserCompanyLayout = () => {
  return (
    <>
      <div className="w-full">
        <NavbarUserCompany></NavbarUserCompany>
      </div>
      <div className="w-full">
        <Outlet></Outlet>
      </div>
    </>
  );
};

export default MainUserCompanyLayout;
