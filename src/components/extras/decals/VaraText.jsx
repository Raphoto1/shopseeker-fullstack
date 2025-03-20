import { useEffect } from "react";
import Vara from "vara";

export default function VaraText({text}) {
    useEffect(() => {
        var vara = new Vara(
          "#vara-container",
          "https://raw.githubusercontent.com/akzhy/Vara/master/fonts/Pacifico/PacificoSLO.json",
          [
            {
              text: text,
              fontSize: 35,
                  strokeWidth: 1.5,
              color:"white",
            },
          ]
        );
      }, []);
    return (
        <div id="vara-container" className="z-[20]"></div>
    );
}