<template>
  <div class="barcodeFormatBtn" @mouseenter="$store.state.curSystem === 'Windows' && $store.state.enableBtn && !$store.state.isShowBarcodeFormatPopover && $store.commit('switchBarcodeFormatPopover')" @click.stop="!($store.state.curSystem === 'Windows') && $store.state.enableBtn && $store.commit('switchBarcodeFormatPopover')">
    <a-popover :placement="popoverPlacement" trigger="click" :visible="$store.state.isShowBarcodeFormatPopover">
      <template slot="content">
        <div class="collapse" @click.stop="">
          <div class="collapsePanel collapsePanel1">
            <div class="collapsePanelHeader" @click="switchPanelBody('panel1')" :style="{color: $store.state.enableBtn ? '' : '#676767',}">
              <span class="headerLeft">
                <a-icon type="down" style="font-size: 12px; margin-right: 5px" :rotate="Panel1BodyHeight === '0' ? 180 : 0"/>
                <span>1D Barcodes </span>
              </span>
              <span class="headerRight" @click.stop="" :style="{display: $store.state.enableBtn ? '' : 'none'}">
                <label class="selectAllLabel selectAll1dLabel" for="selectAll1dCheckbox" :style="{ color: checkAll1dBarcode ? '#FE8E14' : '#999999' }">Select All</label>
                <a-checkbox id="selectAll1dCheckbox" @change.stop="onCheckAll1dBarcodeChange" :checked="checkAll1dBarcode" :indeterminate="indeterminate1d">
                </a-checkbox>
              </span>
            </div>
            <div class="collapsePanelBody" :style="{ height: Panel1BodyHeight, display: $store.state.enableBtn ? '' : 'none'}">
              <div class="selection1D barcodeSelection">
                <ul v-for="(column, index) in selection1DColumn" :key="index" class="selectionColumn">
                  <li v-for="item in column" :key="item.value" class="selectionItemContainer">
                    <label :class="{ selected: $store.getters.selectedBarcodes.includes(item.value)}">
                      <input type="checkbox" name="" :value="item.value" v-model="selected1dBarcodes"/>
                      {{ item.label }}
                    </label>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div class="collapsePanel collapsePanel2">
            <div class="collapsePanelHeader" @click="switchPanelBody('panel2')" :style="{color: $store.state.enableBtn ? '' : '#676767'}">
              <span class="headerLeft">
                <a-icon type="down" style="font-size: 12px; margin-right: 5px" :rotate="Panel2BodyHeight === '0' ? 180 : 0"/>
                <span>2D Barcodes</span>
              </span>
              <span class="headerRight" @click.stop="" :style="{display: $store.state.enableBtn ? '' : 'none'}">
                <label class="selectAllLabel selectAll2dLabel" for="selectAll2dCheckbox" :style="{ color: checkAll2dBarcode ? '#FE8E14' : '#999999' }">Select All</label>
                <a-checkbox id="selectAll2dCheckbox" @change.stop="onCheckAll2dBarcodeChange" :checked="checkAll2dBarcode" :indeterminate="indeterminate2d"></a-checkbox>
              </span>
            </div>
            <div class="collapsePanelBody" :style="{ height: Panel2BodyHeight, display: $store.state.enableBtn ? '' : 'none'}">
              <div class="selection2D barcodeSelection">
                <ul v-for="(column, index) in selection2DColumn" :key="index" class="selectionColumn">
                  <li v-for="item in column" :key="item.value" class="selectionItemContainer">
                    <label :class="{selected: $store.getters.selectedBarcodes.includes(item.value),}">
                      <input type="checkbox" name="" :value="item.value" v-model="selected2dBarcodes"/>
                      {{ item.label }}
                    </label>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div class="collapsePanel collapsePanel3">
            <div class="collapsePanelHeader" @click="switchPanelBody('panel3')" :style="{color: $store.state.enableBtn ? '' : '#676767'}">
              <span class="headerLeft">
                <a-icon type="down" style="font-size: 12px; margin-right: 5px" :rotate="Panel3BodyHeight === '0' ? 180 : 0"/>
                <span>Other</span>
              </span>
              <span class="headerRight" @click.stop="" :style="{display: $store.state.enableBtn ? '' : 'none'}">
                <label class="selectAllLabel selectAllOtherLabel" for="selectAllOtherCheckbox" :style="{color: checkAllOtherBarcode ? '#FE8E14' : '#999999',}">Select All</label>
                <a-checkbox id="selectAllOtherCheckbox" @change.stop="onCheckAllOtherBarcodeChange" :checked="checkAllOtherBarcode" :indeterminate="indeterminateOther"></a-checkbox>
              </span>
            </div>
            <div class="collapsePanelBody" :style="{height: Panel3BodyHeight, display: $store.state.enableBtn ? '' : 'none'}">
              <div class="selectionOther barcodeSelection">
                <ul v-for="(column, index) in selectionOtherColumn" :key="index" class="selectionColumn">
                  <li v-for="item in column" :key="item.value" class="selectionItemContainer">
                    <label :class="{selected: $store.getters.selectedBarcodes.includes(item.value)}">
                      <input type="checkbox" name="" :value="item.value" v-model="selectedOtherBarcodes"/>{{ item.label }}
                    </label>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </template>
      <div class="sidebarBtn" :style="{color: fontAndIconColor,backgroundColor: bgColor,cursor: $store.state.enableBtn ? '' : 'not-allowed'}">
        <img v-show="$store.state.enableBtn" src="../../assets/image/icon-web-barcodes.svg" alt="format">
        <img v-show="!$store.state.enableBtn" src="../../assets/image/icon-web-barcodes-disable.svg" alt="format-disable">
        <label :style="{cursor: $store.state.enableBtn ? '' : 'not-allowed', color: $store.state.enableBtn ? 'white' : '#676767'}" class="formatLabel">Barcode Format</label>
      </div>
    </a-popover>
  </div>
</template>

<script>
import Vue from "vue";
import "../../assets/css/sidebarBtn.css";

export default Vue.extend({
  name: "BarcodeFormatBtn",
  components: {},
  data() {
    return {
      Panel1BodyHeight: "auto",
      Panel2BodyHeight: "auto",
      Panel3BodyHeight: "auto",
      indeterminate1d: false,
      indeterminate2d: false,
      indeterminateOther: false,
      checkAll1dBarcode: false,
      checkAll2dBarcode: false,
      checkAllOtherBarcode: false,
      popoverPlacement: document.body.clientWidth > 980 ? 'rightTop' : 'top',
      selection1DColumn: [
        [
          { value: "code11", label: "Code 11" },
          { value: "code39", label: "Code 39" },
          { value: "codabar", label: "Codabar" },
          { value: "upca", label: "UPC A" },
          { value: "msicode", label: "MSI Code" }
        ],
        [
          { value: "code128", label: "Code 128" },
          { value: "code39extended", label: "Code39 Extended" },
          { value: "ean13", label: "EAN 13" },
          { value: "upce", label: "UPC E" },
        ],
        [
          { value: "code93", label: "Code 93" },
          { value: "ean8", label: "EAN 8" },
          { value: "industrial25", label: "Industrial 25" },
          { value: "itf", label: "ITF" },
        ],
      ],
      selection2DColumn: [
        [{ value: "qrcode", label: "QR Code" }],
        [{ value: "pdf417", label: "PDF417" }],
        [{ value: "datamatrix", label: "Data Matrix" }],
      ],
      selectionOtherColumn: [
        [
          { value: "azteccode", label: "Aztec Code" },
          { value: "dotcode", label: "DotCode" },
          { value: "gs1composite", label: "GS1 Composite" },
          { value: "pharmacode", label: "Pharmacode" }
        ],
        [
          { value: "maxicode", label: "Maxicode" },
          { value: "postalcode", label: "Postal Code" },
          { value: "micropdf417", label: "Micro PDF417" },
        ],
        [
          { value: "patchcode", label: "Patch Code" },
          { value: "gs1databar", label: "GS1 Databar" },
          { value: "microqr", label: "Micro QR" },
        ],
      ],
    };
  },
  mounted() {
    this.$store.commit("getAll1dBarcodes", this.selection1DColumn);
    this.$store.commit("getAll2dBarcodes", this.selection2DColumn);
    this.$store.commit("getAllOtherBarcodes", this.selectionOtherColumn);
    document.addEventListener("click", () => {
      this.$store.commit("hideBarcodeFormatPopover");
    });
    window.addEventListener('resize', () => {
      if(document.body.clientWidth > 980) {
        this.popoverPlacement = 'rightTop';
      } else {
        this.popoverPlacement = 'top';
      }
    })
  },
  methods: {
    switchPanelBody(panel) {
      if (panel === "panel1") {
        this.Panel1BodyHeight == "auto" ? (this.Panel1BodyHeight = "0") : (this.Panel1BodyHeight = "auto");
      } else if (panel === "panel2") {
        this.Panel2BodyHeight == "auto" ? (this.Panel2BodyHeight = "0") : (this.Panel2BodyHeight = "auto");
      } else if (panel === "panel3") {
        this.Panel3BodyHeight == "auto" ? (this.Panel3BodyHeight = "0") : (this.Panel3BodyHeight = "auto");
      }
    },
    onCheckAll1dBarcodeChange() {
      this.checkAll1dBarcode = !this.checkAll1dBarcode;
      if (this.checkAll1dBarcode) {
        this.indeterminate1d = false;
        this.$store.commit("onCheckAll1dBarcodeChange", true);
      } else {
        this.$store.commit("onCheckAll1dBarcodeChange", false);
      }
    },
    onCheckAll2dBarcodeChange() {
      this.checkAll2dBarcode = !this.checkAll2dBarcode;
      if (this.checkAll2dBarcode) {
        this.indeterminate2d = false;
        this.$store.commit("onCheckAll2dBarcodeChange", true);
      } else {
        this.$store.commit("onCheckAll2dBarcodeChange", false);
      }
    },
    onCheckAllOtherBarcodeChange() {
      this.checkAllOtherBarcode = !this.checkAllOtherBarcode;
      if (this.checkAllOtherBarcode) {
        this.indeterminateOther = false;
        this.$store.commit("onCheckAllOtherBarcodeChange", true);
      } else {
        this.$store.commit("onCheckAllOtherBarcodeChange", false);
      }
    },
    onInvertColourChange(checked) {
      this.$store.commit("invertColourSwitch", checked);
    },
    onDPMChange(checked) {
      this.$store.commit("dpmSwitch", checked);
    },
  },
  computed: {
    invertColourOn() {
      return this.$store.state.invertColourOn;
    },
    dpmOn() {
      return this.$store.state.dpmOn;
    },
    selected1dBarcodes: {
      get() {
        return this.$store.state.selected1dBarcodes;
      },
      set(value) {
        this.$store.commit("onSelected1dBarcodesChange", value);
      },
    },
    selected2dBarcodes: {
      get() {
        return this.$store.state.selected2dBarcodes;
      },
      set(value) {
        this.$store.commit("onSelected2dBarcodesChange", value);
      },
    },
    selectedOtherBarcodes: {
      get() {
        return this.$store.state.selectedOtherBarcodes;
      },
      set(value) {
        this.$store.commit("onSelectedOtherBarcodesChange", value);
      },
    },
    bgColor() {
      if (!this.$store.state.enableBtn) {
        return "#4D4D4D";
      } else {
        if (this.$store.state.isShowBarcodeFormatPopover) {
          return "rgba(64,63,63,.8)";
        } else {
          return "";
        }
      }
    },
    fontAndIconColor() {
      if (!this.$store.state.enableBtn) {
        return "#676767";
      } else {
        if (this.$store.state.isShowBarcodeFormatPopover) {
          return "#fe8e14";
        } else {
          return "";
        }
      }
    },
  },
  watch: {
    selected1dBarcodes: function () {
      if (this.$store.state.selected1dBarcodes.length == 0) {
        this.indeterminate1d = false;
        this.checkAll1dBarcode = false;
      } else if (
        this.$store.state.selected1dBarcodes.length <
        this.$store.state.all1dBarcodes.size
      ) {
        this.indeterminate1d = true;
        this.checkAll1dBarcode = false;
      } else if (
        this.$store.state.selected1dBarcodes.length ===
        this.$store.state.all1dBarcodes.size
      ) {
        this.indeterminate1d = false;
        this.checkAll1dBarcode = true;
      }
    },
    selected2dBarcodes: function () {
      if (this.$store.state.selected2dBarcodes.length == 0) {
        this.indeterminate2d = false;
        this.checkAll2dBarcode = false;
      } else if (
        this.$store.state.selected2dBarcodes.length <
        this.$store.state.all2dBarcodes.size
      ) {
        this.indeterminate2d = true;
        this.checkAll2dBarcode = false;
      } else if (
        this.$store.state.selected2dBarcodes.length ===
        this.$store.state.all2dBarcodes.size
      ) {
        this.indeterminate2d = false;
        this.checkAll2dBarcode = true;
      }
    },
    selectedOtherBarcodes: function () {
      if (this.$store.state.selectedOtherBarcodes.length == 0) {
        this.indeterminateOther = false;
        this.checkAllOtherBarcode = false;
      } else if (
        this.$store.state.selectedOtherBarcodes.length <
        this.$store.state.allOtherBarcodes.size
      ) {
        this.indeterminateOther = true;
        this.checkAllOtherBarcode = false;
      } else if (
        this.$store.state.selectedOtherBarcodes.length ===
        this.$store.state.allOtherBarcodes.size
      ) {
        this.indeterminateOther = false;
        this.checkAllOtherBarcode = true;
      }
    },
  },
});
</script>

<style scoped>
.barcodeFormatBtn {border-bottom: 1px solid #222222;font-family: "OpenSans-Regular";}
.sidebarBtn {height: 100%;}
.formatLabel {font-family: "OpenSans-Regular";}

.collapse {position: relative;margin: -12px -16px;padding: 8px 19px;background-color: rgba(50, 50, 52);overflow: auto;}
.collapse .collapsePanel {width: 100%;color: white;margin-bottom: 10px;}

.collapsePanel .collapsePanelHeader {display: flex;flex-direction: row;justify-content: space-between;align-items: center;padding-left: 5px;height: 36px;cursor: pointer;}
.collapsePanelHeader .headerLeft {display: flex;flex-direction: row;align-items: center;}
.collapsePanelHeader .headerRight .selectAllLabel {margin-right: 10px;cursor: pointer;}
.collapsePanel .collapsePanelBody {overflow: hidden;}

.barcodeSelection {display: flex;flex-direction: row;justify-content: space-between;/* align-items: center; */margin: 10px 0;}
.barcodeSelection .selectionColumn {display: flex;flex-direction: column;}
.barcodeSelection .selectionItemContainer {display: flex;position: relative;flex-direction: row;justify-content: flex-start;align-items: center;margin-bottom: 5px;}
.barcodeSelection .selectionItemContainer:last-of-type {margin-bottom: 0;}

.selectionItemContainer input {position: absolute;top: 0;left: 0;opacity: 0;}
.selectionItemContainer label {display: flex;flex-direction: row;justify-content: center;align-items: center;width: 200px;height: 40px;color: #888888;text-align: center;background-color: rgba(34, 34, 34);transition: all .3s;cursor: pointer;}
.selectionItemContainer .selected {color: white;background-color: #fe8e14;}

.extraSettings {display: flex;flex-direction: row;flex-wrap: wrap;justify-content: space-between;align-items: center;margin-top: 10px;color: white;}
.extraSettings .invertColourContainer label {cursor: pointer;}
.extraSettings .dpmSwitchContainer label {cursor: pointer;}

@media screen and (min-width: 980px) {
  .barcodeFormatBtn {height: 25%;}
  .formatLabel {margin-top: 5px;}
}

@media (min-width: 981px), screen and (max-width: 980px) and (orientation: landscape) {
  .sidebarBtn img {width: 28px;height: 28px;}

  .barcodeSelection {margin: 30px 0;justify-content: space-around;}

  .collapse {width:650px;height: 50vh;min-height: 400px;max-height: 600px;font-size: 16px;}
  .barcodeSelection .selectionItemContainer {margin-bottom: 30px;}
  .selectionItemContainer label {width: 165px;}
}

@media screen and (max-width: 980px) and (orientation: landscape) {
  .barcodeFormatBtn {width: 25%;}
  .barcodeSelection {margin: 18px 0;}
  .barcodeSelection .selectionItemContainer {margin-bottom: 10px;}

  .collapse {width: 500px;height: 220px;max-width: auto;min-width: auto;min-height: auto;max-height: auto;font-size: 12px;}
  .selectionItemContainer label {width: 120px;height: 30px;}
  .sidebarBtn img {/* width: 15.38px;height: 17px; */display: none;}
}

/* mobile */
@media screen and (max-width: 980px) and (orientation: portrait) {
  .barcodeFormatBtn {width: 25%;}
  .collapse {width: 300px;height: 400px;}
  .barcodeSelection .selectionItemContainer {margin-bottom: 10px;}
  .selectionItemContainer label {width: 80px;}
  .sidebarBtn img {width: 18px;height: 18px;}
}

@media screen and (max-width: 420px) {
  .formatLabel {font-family: "Oswald-Regular";}
}
</style>
