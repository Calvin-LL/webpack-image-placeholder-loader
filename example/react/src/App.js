import React from "react";

import image from "./assets/Macaca_nigra_self-portrait_large.jpg";
import imagePlaceholder from "./assets/Macaca_nigra_self-portrait_large.jpg?placeholder";

function App() {
  return (
    <div className="App">
      <img
        style={{ width: 728, height: 1007, backgroundColor: imagePlaceholder }}
        src={image}
      />
      <img
        // you can also use require
        src={require("./assets/Macaca_nigra_self-portrait_large.jpg?placeholder&size=original&format=base64&esModule=false")}
      />
    </div>
  );
}

export default App;
