<template>
  <div>
    <img
      style="width: 728px; height: 1007px"
      :style="{
        backgroundColor: require('@/assets/Macaca_nigra_self-portrait_large.jpg?placeholder'),
      }"
      src="@/assets/Macaca_nigra_self-portrait_large.jpg"
    />
    <img
      :src="
        require('@/assets/Macaca_nigra_self-portrait_large.jpg?placeholder&size=original&format=base64&esModule=false')
      "
    />
  </div>

  <div class="blur-container">
    <h2 class="blur-title">Svg blur</h2>
    <div class="blur-grid">
      <div class="blur-grid-item">
        <img
          class="blur-grid-item__img"
          :style="{
            backgroundImage: require('@/assets/Macaca_nigra_self-portrait_large.jpg?placeholder&format=svg-blur&blurQuality=10'),
          }"
          src="@/assets/Macaca_nigra_self-portrait_large.jpg"
        />
        <span class="blur-grid-item__desc">Original</span>
      </div>

      <div class="blur-grid-item">
        <img
          class="blur-grid-item__img"
          src="@/assets/Macaca_nigra_self-portrait_large.jpg?placeholder&format=svg-blur&blurQuality=100"
        />
        <span class="blur-grid-item__desc">blurQuality=100</span>
      </div>

      <div class="blur-grid-item">
        <img
          class="blur-grid-item__img"
          src="@/assets/Macaca_nigra_self-portrait_large.jpg?placeholder&format=svg-blur&blurQuality=50"
        />
        <span class="blur-grid-item__desc">blurQuality=50</span>
      </div>

      <div class="blur-grid-item">
        <img
          class="blur-grid-item__img"
          src="@/assets/Macaca_nigra_self-portrait_large.jpg?placeholder&format=svg-blur&blurQuality=10"
        />
        <span class="blur-grid-item__desc">blurQuality=10</span>
      </div>

      <div class="blur-grid-item">
        <img
          class="blur-grid-item__img"
          src="@/assets/Macaca_nigra_self-portrait_large.jpg?placeholder&format=svg-blur&blurQuality=0.5"
        />
        <span class="blur-grid-item__desc">blurQuality=0.5</span>
      </div>
    </div>
  </div>
</template>

<style>
.blur-container {
  margin-top: 2rem;
}

.blur-title {
  margin-top: 0;
  margin-bottom: 1em;
  text-align: center;
}

.blur-grid {
  display: flex;
  justify-content: space-between;
}

.blur-grid-item {
  display: flex;
  flex-direction: column;
  width: calc(20% - 5px);
}

.blur-grid-item__desc {
  display: block;
  margin-top: 10px;
  font-size: 20px;
  font-weight: 500;
  text-align: center;
}

.blur-grid-item__img {
  display: block;
  width: 100%;
  height: auto;
}
</style>
