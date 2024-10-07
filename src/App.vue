<template>
  <!-- <a-config-provider 
    :theme ="{
       token:{
         colorPrimary:'#000000'
        }
      }"> -->
  <router-view/>
  <!-- </a-config-provider> -->
</template>

<style lang="less">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
body{
  margin: 0px;
}
.ant-btn-primary {
  background-color: #000000;
}
.ant-btn-primary:not(:disabled):hover {
  background-color: #000000;
}
</style>
