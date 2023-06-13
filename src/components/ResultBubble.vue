<template>
  <div
    class="bubble"
    v-show="isShowBubble"
    :style="{
      left: bubbleLeft,
      top: bubbleTop,
      right: bubbleRight,
      maxWidth: bubbleMaxWidth + 'px',
      transform: bubbleTransform,
    }"
  >
    <div class="content">
      <span class="format">{{ resultFormat }}</span>
      <!-- Calculate the count of characters and wrap. -->
      <br v-if="(resultFormat + resultText).length > maxCharNumber" />
      <span class="text">{{ resultText }}</span>
    </div>
    <div
      class="arrow"
      :style="{ left: bubbleArrowLeft, right: bubbleArrowRight }"
    ></div>
  </div>
</template>

<script>
import Vue from "vue";

export default Vue.extend({
  name: "ResultBubble",
  props: {
    result: {
      type: Object,
      require: true,
    },
    scanner: {
      type: Object,
      require: true,
    },
  },
  data() {
    return {
      bubbleLeft: "",
      bubbleTop: "",
      bubbleRight: "",
      bubbleMaxWidth: 190, // unit: px
      bubbleTransform: "",
      bubbleArrowLeft: "",
      bubbleArrowRight: "",
      maxCharNumber: 22,
      isShowBubble: false
    };
  },
  mounted() {
    if (
      window.matchMedia("(min-width: 768px)").matches &&
      !window.matchMedia(
        "(min-width: 600px) and (max-height: 600px) and (orientation: landscape)"
      ).matches
    ) {
      this.bubbleMaxWidth = 300;
      this.maxCharNumber = 28;
    }
  },
  methods: {},
  computed: {
    resultFormat() {
      return this.result.barcodeFormatString;
    },
    resultText() {
      return this.result.barcodeText;
    },
  },
  watch: {
    result(newValue) {
      let p1, p2;
      {
        // Get the top-left corner point and bottom-right corner point.
        // And convert them from related to video to related to viewport.
        const localization = newValue.localizationResult;
        p1 = {
          x: Math.min(
            localization.x1,
            localization.x2,
            localization.x3,
            localization.x4
          ),
          y: Math.min(
            localization.y1,
            localization.y2,
            localization.y3,
            localization.y4
          ),
        };
        p2 = {
          x: Math.max(
            localization.x1,
            localization.x2,
            localization.x3,
            localization.x4
          ),
          y: Math.max(
            localization.y1,
            localization.y2,
            localization.y3,
            localization.y4
          ),
        };
        p1 = this.scanner.convertToClientCoordinates(p1);
        p2 = this.scanner.convertToClientCoordinates(p2);
      }

      this.bubbleTop = p1.y + "px";
      const center = { x: (p1.x + p2.x) / 2, y: (p1.y + p2.y) / 2 };
      if (center.x < this.bubbleMaxWidth / 2) {
        this.bubbleLeft = p1.x + "px";
        this.bubbleRight = "";
        this.bubbleTransform = "translateY(calc(-100% - 4px))";
        this.bubbleArrowLeft = "10px";
        this.bubbleArrowRight = "";
      } else if (
        document.documentElement.clientWidth - center.x <
        this.bubbleMaxWidth / 2
      ) {
        this.bubbleLeft = "";
        this.bubbleRight = document.documentElement.clientWidth - p2.x + "px";
        this.bubbleTransform = "translateY(calc(-100% - 4px))";
        this.bubbleArrowLeft = "";
        this.bubbleArrowRight = "10px";
      } else {
        this.bubbleLeft = center.x + "px";
        this.bubbleRight = "";
        this.bubbleTransform = "translate(-50%, calc(-100% - 4px))";
        this.bubbleArrowLeft = "calc(50% - 10px)";
        this.bubbleArrowRight = "";
      }
      this.isShowBubble = true;
    },
  },
});
</script>

<style scoped>
.bubble {
  position: absolute;
  padding: 7px 13px;
  width: max-content;
  min-width: 30px;
  font-family: "OpenSans-Regular";
  font-size: 12px;
  color: white;
  background: #222222;
  word-break: break-all;
}
.bubble > .content > .format::after {
  content: ":";
  margin-left: 4px;
  margin-right: 3px;
}
.bubble > .arrow {
  position: absolute;
  bottom: -8px;
  border-left: 10px solid transparent;
  border-top: 8px solid #222222;
  border-right: 10px solid transparent;
}

/* Extra small devices (phones, 600px and down) */
@media screen and (max-width: 600px) {
}
/* Small devices (portrait tablets and large phones, 600px and up) */
@media screen and (min-width: 600px) and (orientation: portrait) {
}
/* Medium devices (landscape tablets, 768px and up) */
@media screen and (min-width: 768px) {
  .bubble {
    font-size: 16px;
  }
}
/* Small devices (landscape phones, width > 600px and height < 600px) */
@media screen and (min-width: 600px) and (max-height: 600px) and (orientation: landscape) {
  .bubble {
    font-size: 12px;
  }
}
/* Large devices (laptops/desktops, 992px and up) */
@media screen and (min-width: 992px) {
}
/* Extra large devices (large laptops and desktops, 1200px and up) */
@media screen and (min-width: 1200px) {
}
</style>
