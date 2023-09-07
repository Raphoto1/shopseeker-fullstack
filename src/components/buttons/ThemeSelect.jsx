"use client";
//imports de app
import { BsSun, BsMoon } from "react-icons/bs";

import { createContext, useEffect, useState } from "react";

export default function ThemeSelect() {
  const [themeSelect, setThemeSelect] = useState("dark");
  useEffect(() => {
    if (typeof document !== 'undefined') {
      let htmlToChange = document.querySelector("html");
      htmlToChange.setAttribute("data-theme", themeSelect);
    }
  }, [themeSelect]);

  const handleTheme = (e) => {
    if (e.target.checked) {
      setThemeSelect("light");
    } else {
      setThemeSelect("dark");
    }
  };

  return (
    <div>
      <BsMoon className='m-1' />
      <input type='checkbox' name='checkTheme' id='theme' className='toggle' onChange={handleTheme} />
      <BsSun className='m-1' />
    </div>
  );
}
