import React from "react";

import image from "./assets/Macaca_nigra_self-portrait_large.jpg";
import imagePlaceholder from "./assets/Macaca_nigra_self-portrait_large.jpg?placeholder";
import imageBlurredPlaceholder from "./assets/Macaca_nigra_self-portrait_large.jpg?placeholder&format=blurred-svg&blurQuality=0.5";

function App() {
  return (
    <div>
      <img
        style={{
          width: 728,
          height: 1007,
          backgroundColor: imagePlaceholder,
        }}
        src={image}
      />

      <img
        // you can also use require
        style={{
          width: 728,
          height: 1007,
        }}
        src={require("./assets/Macaca_nigra_self-portrait_large.jpg?placeholder&size=original&format=base64&esModule=false")}
      />

      <img
        style={{
          width: 728,
          height: 1007,
          backgroundSize: "cover",
          backgroundImage: `url("${imageBlurredPlaceholder}")`,
        }}
        src={image}
      />

      <img
        style={{
          width: 728,
          height: 1007,
        }}
        src={imageBlurredPlaceholder}
      />
    </div>
  );
}

export default App;
