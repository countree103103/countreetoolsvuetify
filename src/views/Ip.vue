<template>
  <v-container>
    <v-container class="d-flex flex-row justify-center align-start">
      <v-text-field
        v-model="ip"
        @keypress.enter="postIp"
        label="请输入要查询的ip"
        outlined
        dense
      ></v-text-field>
      <v-btn @click="postIp" class="ml-7">提交</v-btn>
    </v-container>
    <v-container>
      <v-textarea
        v-model="result"
        rows="13"
        readonly
        label="查询IP结果："
      ></v-textarea>
    </v-container>
  </v-container>
</template>

<script>
const { get } = require("axios");
// const request = require('request')
export default {
  data: function () {
    return {
      ip: "",
      result: null,
    };
  },
  methods: {
    postIp() {
      let that = this;
      console.log(that.ip);
      // this.$nextTick(() => {
      // })
      let pattern = /^[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}$/;

      if (pattern.test(that.ip)) {
        that.result = "加载中...";
        get(`http://ip-api.com/json/${that.ip}?lang=zh-CN `)
          .then((result) => {
            that.result = JSON.stringify(result.data, null, 2);
          })
          .catch((error) => {
            console.log(error);
            that.result = "网络异常!请检查网络。";
          });
      } else {
        that.result = "IP输入错误!";
      }
      // axios.get(`${that.ip}/json`).then(function(result){console.log(result)}).catch(function(error){console.log(error)})

      // request(`https://ipinfo.io/${that.ip}/json`,function(error, response, body){
      // console.log(body)
      // })
    },
  },
};
</script>

<style lang="scss" scoped>
#ip {
  width: 100%;
  height: 100%;
  // margin-top: 5%;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-direction: column;
  .wrap {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    #ipinput {
      // margin-bottom: 10%;
    }
    #ipresult {
      margin-top: 3vh;
      display: flex;
      justify-content: center;
      align-items: flex-start;
      flex-direction: column;
      textarea {
        width: 70vw;
        // margin-top: 5%;
        height: 50vh;
        // border: none;
      }
    }
  }
}
</style>
