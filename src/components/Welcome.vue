<template>
  <div>
    <h3 class="bestTitle">{{welcomeText}}</h3>
    <button @click="test">testMan</button>
  </div>
</template>
<script>
export default {
  name: 'welcome',
  methods: {
    test () {
      this.$confirm('')
    }
  },
  data () {
    return {
      welcomeText: 'GEARLESS Chen'
    }
  }
}
</script>
<style lang="less" scoped>
  *{
    color: aliceblue;
  }
  .bestTitle{
    font-size: 180px;
  }
  button{
    color: black;
  }
</style>
