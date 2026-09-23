import React from "react";
import { Outlet } from "react-router-dom";
import NavbarUserJobSeeker from "../components/NavbarUserJobSeeker";

const MainUserJobSeekerLayout = () => {
  return (
    <>
      <div className="w-full">
        <NavbarUserJobSeeker></NavbarUserJobSeeker>
      </div>
      <div className="w-full">
        <Outlet></Outlet>
      </div>
    </>
  );
};

export default MainUserJobSeekerLayout;
