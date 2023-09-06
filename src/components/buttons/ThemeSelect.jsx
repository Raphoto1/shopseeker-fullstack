"use client";
//imports de app
import { BsSun, BsMoon } from "react-icons/bs";

import { createContext, useEffect, useState } from "react";

export default function ThemeSelect() {
  const [themeSelect, setThemeSelect] = useState("dark");
  let htmlToChange = document.querySelector("html");
  htmlToChange.setAttribute("data-theme", themeSelect);
  const handleTheme = (e) => {
    if (e.target.checked) {
      setThemeSelect("light");
      htmlToChange.setAttribute("data-theme", themeSelect);
    } else {
      setThemeSelect("dark");
      htmlToChange.setAttribute("data-theme", themeSelect);
    }
  };

  return (
    <div>

      <BsMoon className="m-1"/>
      <input type='checkbox' name='checkTheme' id='theme' className='toggle' onChange={handleTheme} />
      <BsSun className="m-1" />
    </div>
  );
}
