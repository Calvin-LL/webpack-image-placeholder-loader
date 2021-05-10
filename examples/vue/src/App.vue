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
      style="width: 728px; height: 1007px"
      :src="
        require('@/assets/Macaca_nigra_self-portrait_large.jpg?placeholder&size=original&format=base64&esModule=false')
      "
    />
    <img
      style="width: 728px; height: 1007px"
      :style="{
        backgroundImage: `url('${require('@/assets/Macaca_nigra_self-portrait_large.jpg?placeholder&format=blurred-svg&blurQuality=0.5')}')`,
      }"
      src="@/assets/Macaca_nigra_self-portrait_large.jpg"
    />

    <img
      style="width: 728px; height: 1007px"
      :src="
        require('@/assets/Macaca_nigra_self-portrait_large.jpg?placeholder&format=blurred-svg&blurQuality=0.5')
      "
    />
  </div>
</template>
