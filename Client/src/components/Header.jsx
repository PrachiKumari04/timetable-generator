import React from "react";
import Container from "./Container";
import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { toggleTheme } from "../store/theme/themeSlice";

export default function Header() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const theme = useSelector((state) => state.theme.theme);

  const loginHandler = (e) => {
    e.preventDefault();
    navigate("/login");
  };

  const themeHandler = (e) => {
    e.preventDefault();
    dispatch(toggleTheme());
  };

  return (
    <header className="bg-background shadow">
      <Container className={`flex items-center px-4 py-0 sm:px-6 lg:px-8`}>
        <nav className="flex items-center justify-between h-16 w-full">
          <div className="flex shrink-0">
            <h1 className="text-2xl font-bold text-text">
              Time<span className="text-(--primary)">Table</span>
            </h1>
          </div>

          <div className="hidden md:block">
            <div className="flex items-center ml-10 space-x-4">
              <button
                onClick={(e) => themeHandler(e)}
                className="px-5 py-0.5 rounded bg-(--secondary)  hover:bg-(--primary) font-bold "
              >
                {theme === "light" ? "Dark" : "Light"}
              </button>
              <button
                onClick={(e) => loginHandler(e)}
                className="px-5 py-1 rounded-md bg-(--accent) hover:bg-(--primary) font-bold"
              >
                Login
              </button>
            </div>
          </div>
        </nav>
      </Container>
    </header>
  );
}
