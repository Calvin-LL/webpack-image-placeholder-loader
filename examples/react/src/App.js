import React from "react";

import image from "./assets/Macaca_nigra_self-portrait_large.jpg";
import imagePlaceholder from "./assets/Macaca_nigra_self-portrait_large.jpg?placeholder";
import './assets/example.css'

function App() {
  return (
    <div> 
      <div>
      <img
        style={{ width: 728, height: 1007, backgroundColor: imagePlaceholder }}
        src={image}
      />
      <img
        // you can also use require
        src={require("./assets/Macaca_nigra_self-portrait_large.jpg?placeholder&size=original&format=base64&esModule=false")}
      />
    </div>

      <div class="blur-container">
        <h2 class="blur-title">Svg blur</h2>
        <div class="blur-grid">
          <div class="blur-grid-item">
            <img
              class="blur-grid-item__img"
              style={{
                backgroundColor: require('./assets/Macaca_nigra_self-portrait_large.jpg?placeholder&format=svg-blur&blurQuality=10&esModule=false'),
              }}
              src={image}
            />
            <span class="blur-grid-item__desc">Original</span>
          </div>

          <div class="blur-grid-item">
            <img
              class="blur-grid-item__img"
              src={require('./assets/Macaca_nigra_self-portrait_large.jpg?placeholder&format=svg-blur&blurQuality=100&esModule=false')}
            />
            <span class="blur-grid-item__desc">blurQuality=100</span>
          </div>

          <div class="blur-grid-item">
            <img
              class="blur-grid-item__img"
              src={require('./assets/Macaca_nigra_self-portrait_large.jpg?placeholder&format=svg-blur&blurQuality=50&esModule=false')}
            />
            <span class="blur-grid-item__desc">blurQuality=50</span>
          </div>

          <div class="blur-grid-item">
            <img
              class="blur-grid-item__img"
              src={require('./assets/Macaca_nigra_self-portrait_large.jpg?placeholder&format=svg-blur&blurQuality=10&esModule=false')}
            />
            <span class="blur-grid-item__desc">blurQuality=10</span>
          </div>

          <div class="blur-grid-item">
            <img
              class="blur-grid-item__img"
              src={require('./assets/Macaca_nigra_self-portrait_large.jpg?placeholder&format=svg-blur&blurQuality=0.5&esModule=false')}
            />
            <span class="blur-grid-item__desc">blurQuality=0.5</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
