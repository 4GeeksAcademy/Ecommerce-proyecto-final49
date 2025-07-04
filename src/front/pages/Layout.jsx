import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import ScrollToTop from "../components/ScrollToTop";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";



export const Layout = () => {

const [searchText, setSearchText] = useState("");
const handleSearch = (value) => {
  setSearchText(value);
};

  return (
    <ScrollToTop>
      <div className="d-flex flex-column min-vh-100">
        <Navbar
        onSearch={handleSearch}
        searchValue={searchText}
        />
        <main className="flex-fill">
          <Outlet context={{searchText, handleSearch}} />
        </main>
        <Footer />
      </div>
    </ScrollToTop>
  );
};