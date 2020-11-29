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
</template>
