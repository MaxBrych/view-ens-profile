import React from "react";
import RegisterPage from "../components/Auth/RegisterPage";
import NavBar from "../components/NavBar";

export default function Register() {
  return (
    <div className="bg-white">
      <NavBar />

      <RegisterPage />
    </div>
  );
}
