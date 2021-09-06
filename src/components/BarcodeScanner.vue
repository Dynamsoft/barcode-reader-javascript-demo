<template>
  <div class="barcodeScanner">
    <div
      v-once
      class="videoContainer"
      ref="videoContainer"
      style="
        width: 100%;
        height: 100%;
        min-width: 100px;
        min-height: 100px;
        background: #ddd;
        position: absolute;
      "
    >
      <svg
        class="dbrScanner-bg-loading"
        style="
          display: none;
          animation: 1s linear infinite dbrScanner-rotate;
          width: 40vmin;
          height: 40vmin;
          position: absolute;
          margin: auto;
          left: 0;
          top: 0;
          right: 0;
          bottom: 0;
          fill: #aaa;
        "
        viewBox="0 0 1792 1792"
      >
        <path
          d="M1760 896q0 176-68.5 336t-184 275.5-275.5 184-336 68.5-336-68.5-275.5-184-184-275.5-68.5-336q0-213 97-398.5t265-305.5 374-151v228q-221 45-366.5 221t-145.5 406q0 130 51 248.5t136.5 204 204 136.5 248.5 51 248.5-51 204-136.5 136.5-204 51-248.5q0-230-145.5-406t-366.5-221v-228q206 31 374 151t265 305.5 97 398.5z"
        />
      </svg>
      <svg
        class="dbrScanner-bg-camera"
        style="
          display: none;
          width: 40%;
          height: 40%;
          position: absolute;
          margin: auto;
          left: 0;
          top: 0;
          right: 0;
          bottom: 0;
          fill: #aaa;
        "
        viewBox="0 0 2048 1792"
      >
        <path
          d="M1024 672q119 0 203.5 84.5t84.5 203.5-84.5 203.5-203.5 84.5-203.5-84.5-84.5-203.5 84.5-203.5 203.5-84.5zm704-416q106 0 181 75t75 181v896q0 106-75 181t-181 75h-1408q-106 0-181-75t-75-181v-896q0-106 75-181t181-75h224l51-136q19-49 69.5-84.5t103.5-35.5h512q53 0 103.5 35.5t69.5 84.5l51 136h224zm-704 1152q185 0 316.5-131.5t131.5-316.5-131.5-316.5-316.5-131.5-316.5 131.5-131.5 316.5 131.5 316.5 316.5 131.5z"
        />
      </svg>
      <video
        class="dbrScanner-video"
        playsinline="true"
        style="
          width: 100%;
          height: 100%;
          position: absolute;
          left: 0;
          top: 0;
          object-fit: cover;
        "
      ></video>
      <canvas
        class="dbrScanner-cvs-drawarea"
        style="width: 100%; height: 100%; position: absolute; left: 0; top: 0"
      ></canvas>
      <div class="copyright">
        <span>Powered by Dynamsoft</span>
      </div>
    </div>
    <div class="cameraAndSoundsContainer">
      <div class="cameraDropdown" @click.stop="showCameraList">
        <div class="cameraIconContainer">
          <svg viewBox="0 0 29.308 17">
            <g transform="translate(-346.925 -627.702)">
              <g transform="translate(347.425 628.202)">
                <g>
                  <path
                    d="M365.791,644.2H348.656a1.231,1.231,0,0,1-1.231-1.231V629.433a1.231,1.231,0,0,1,1.231-1.231h16a1.231,1.231,0,0,1,1.231,1.231v14.733"
                    transform="translate(-347.425 -628.202)"
                    fill="none"
                    stroke="#aaa"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="1"
                  />
                  <path
                    d="M371.81,640.606a1.23,1.23,0,0,1-1.781,1.1l-4.923-2.462a1.229,1.229,0,0,1-.681-1.1v-4.633a1.232,1.232,0,0,1,.681-1.1l4.923-2.462a1.231,1.231,0,0,1,1.781,1.1Z"
                    transform="translate(-343.502 -627.828)"
                    fill="none"
                    stroke="#aaa"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="1"
                  />
                </g>
              </g>
            </g>
          </svg>
          <label>Camera</label>
        </div>
        <a-icon
          type="down"
          style="margin-right: 8px; font-size: 16px"
          :rotate="isShowCameraList ? 180 : 0"
        />
        <div class="cameraInfo">
          {{ this.cameraInfo }}
        </div>
      </div>
      <div
        class="soundEffects"
        @click="soundEffectsSwitch"
        :style="{
          backgroundColor: $store.state.soundEffectsOn
            ? 'rgba(110, 110, 110, .8)'
            : '',
        }"
      >
        <img :src="soundEffectsIconPath" />
      </div>
    </div>
    <div class="curUseCaseTip">
      {{ this.curUseCase }}
    </div>
    <ul class="resultContainer" v-show="selectedUseCase !== 'dl'">
      <li
        v-for="(value, name) in decodeRecords"
        :key="name"
        class="result"
        :data-clipboard-text="name.slice(name.indexOf('_dbrkey_') + 8)"
        v-show="value > 1"
      >
        <div class="barcodeFormat">
          {{ name.slice(0, name.indexOf("_dbrkey_")) }}
          <div class="break">:</div>
        </div>
        <div class="resultMain">
          <div class="resultText" @click="copyResult('.result')">
            {{ name.slice(name.indexOf("_dbrkey_") + 8) }}
          </div>
          <div class="break">-</div>
          <div class="copyBtn" @click="copyResult('.result')">Copy</div>
        </div>
        <div class="counter">
          {{ value + "x" }}
        </div>
      </li>
    </ul>
    <div class="dlResultContainer" v-show="isDLResultShow">
      <!-- <ul class="dlInfo" :data-clipboard-text="copiedDLInfo"> -->
      <ul class="dlInfo">
        <li v-for="(info, infoIndex) in dlInfo" :key="infoIndex">
          <span class="description"> {{ info.description }}: </span>
          <span class="value">
            {{ info.value }}
          </span>
        </li>
      </ul>
      <div class="footer">
        <div @click="copyDLInfo" class="copyBtn">Copy all</div>
        <div class="closeBtn" @click="closeDLResult">Close</div>
      </div>
    </div>
    <div
      class="scanArea"
      v-show="!isFullImageLocalization && selectedUseCase === 'general'"
    >
      <div class="scanLight"></div>
    </div>
    <canvas
      id="closeRegionMask"
      style="position: absolute"
      v-show="isShowCloseMask && !isResizing"
    ></canvas>
    <div
      class="torchContainer"
      :style="torchContainerStyle"
      v-show="!isResizing"
    >
      <a-icon
        v-show="isShowTorchIcon"
        type="funnel-plot"
        @click="flashlightSwitch"
        style="
          position: absolute;
          left: 50%;
          bottom: 0;
          font-size: 30px;
          color: rgb(254, 142, 20);
          transform: translateX(-50%);
        "
      />
    </div>
    <div class="driverLicenseTip" :style="driverLicenseTipStyle">
      <div class="tipImg">
        <svg viewBox="0 0 90 49" :style="tipImgStyle">
          <g transform="translate(-136 -293)">
            <g transform="translate(142.112 315.375)">
              <g transform="translate(3.888 0.125)">
                <rect width="3.162" height="1.778" fill="#fff" />
                <rect
                  width="0.395"
                  height="1.778"
                  transform="translate(3.557)"
                  fill="#fff"
                />
                <rect
                  width="0.395"
                  height="1.778"
                  transform="translate(4.347)"
                  fill="#fff"
                />
                <rect
                  width="0.395"
                  height="1.778"
                  transform="translate(5.138)"
                  fill="#fff"
                />
                <rect
                  width="1.976"
                  height="1.778"
                  transform="translate(6.718)"
                  fill="#fff"
                />
                <rect
                  width="0.395"
                  height="1.778"
                  transform="translate(9.09)"
                  fill="#fff"
                />
                <rect
                  width="0.395"
                  height="1.778"
                  transform="translate(9.88)"
                  fill="#fff"
                />
                <rect
                  width="1.976"
                  height="1.778"
                  transform="translate(10.671)"
                  fill="#fff"
                />
                <rect
                  width="0.79"
                  height="1.778"
                  transform="translate(13.437)"
                  fill="#fff"
                />
                <rect
                  width="0.395"
                  height="1.778"
                  transform="translate(14.623)"
                  fill="#fff"
                />
                <rect
                  width="0.79"
                  height="1.778"
                  transform="translate(15.413)"
                  fill="#fff"
                />
                <rect
                  width="1.186"
                  height="1.778"
                  transform="translate(17.389)"
                  fill="#fff"
                />
                <rect
                  width="1.186"
                  height="1.778"
                  transform="translate(20.155)"
                  fill="#fff"
                />
                <rect
                  width="0.395"
                  height="1.778"
                  transform="translate(22.922)"
                  fill="#fff"
                />
                <rect
                  width="0.395"
                  height="1.778"
                  transform="translate(23.712)"
                  fill="#fff"
                />
                <rect
                  width="1.186"
                  height="1.778"
                  transform="translate(25.293)"
                  fill="#fff"
                />
                <rect
                  width="0.395"
                  height="1.778"
                  transform="translate(26.874)"
                  fill="#fff"
                />
                <rect
                  width="0.395"
                  height="1.778"
                  transform="translate(28.06)"
                  fill="#fff"
                />
                <rect
                  width="0.79"
                  height="1.778"
                  transform="translate(29.245)"
                  fill="#fff"
                />
                <rect
                  width="0.79"
                  height="1.778"
                  transform="translate(31.616)"
                  fill="#fff"
                />
                <rect
                  width="1.976"
                  height="1.778"
                  transform="translate(33.592)"
                  fill="#fff"
                />
                <rect
                  width="0.395"
                  height="1.778"
                  transform="translate(35.964)"
                  fill="#fff"
                />
                <rect
                  width="0.395"
                  height="1.778"
                  transform="translate(36.754)"
                  fill="#fff"
                />
                <rect
                  width="1.976"
                  height="1.778"
                  transform="translate(37.544)"
                  fill="#fff"
                />
                <rect
                  width="2.766"
                  height="1.778"
                  transform="translate(40.311)"
                  fill="#fff"
                />
                <rect
                  width="0.395"
                  height="1.778"
                  transform="translate(43.472)"
                  fill="#fff"
                />
                <rect
                  width="0.395"
                  height="1.778"
                  transform="translate(45.053)"
                  fill="#fff"
                />
                <rect
                  width="0.395"
                  height="1.778"
                  transform="translate(45.844)"
                  fill="#fff"
                />
                <rect
                  width="0.395"
                  height="1.778"
                  transform="translate(47.029)"
                  fill="#fff"
                />
              </g>
              <g transform="translate(3.888 1.903)">
                <rect width="3.162" height="1.778" fill="#fff" />
                <rect
                  width="0.395"
                  height="1.778"
                  transform="translate(3.557)"
                  fill="#fff"
                />
                <rect
                  width="0.395"
                  height="1.778"
                  transform="translate(4.347)"
                  fill="#fff"
                />
                <rect
                  width="0.395"
                  height="1.778"
                  transform="translate(5.138)"
                  fill="#fff"
                />
                <rect
                  width="1.581"
                  height="1.778"
                  transform="translate(6.718)"
                  fill="#fff"
                />
                <rect
                  width="0.395"
                  height="1.778"
                  transform="translate(8.695)"
                  fill="#fff"
                />
                <rect
                  width="0.395"
                  height="1.778"
                  transform="translate(9.485)"
                  fill="#fff"
                />
                <rect
                  width="0.395"
                  height="1.778"
                  transform="translate(11.461)"
                  fill="#fff"
                />
                <rect
                  width="0.395"
                  height="1.778"
                  transform="translate(13.437)"
                  fill="#fff"
                />
                <rect
                  width="1.186"
                  height="1.778"
                  transform="translate(14.227)"
                  fill="#fff"
                />
                <rect
                  width="0.79"
                  height="1.778"
                  transform="translate(15.808)"
                  fill="#fff"
                />
                <rect
                  width="2.371"
                  height="1.778"
                  transform="translate(17.389)"
                  fill="#fff"
                />
                <rect
                  width="0.79"
                  height="1.778"
                  transform="translate(20.155)"
                  fill="#fff"
                />
                <rect
                  width="0.395"
                  height="1.778"
                  transform="translate(21.736)"
                  fill="#fff"
                />
                <rect
                  width="1.976"
                  height="1.778"
                  transform="translate(22.527)"
                  fill="#fff"
                />
                <rect
                  width="1.186"
                  height="1.778"
                  transform="translate(24.898)"
                  fill="#fff"
                />
                <rect
                  width="1.581"
                  height="1.778"
                  transform="translate(26.874)"
                  fill="#fff"
                />
                <rect
                  width="1.581"
                  height="1.778"
                  transform="translate(28.85)"
                  fill="#fff"
                />
                <rect
                  width="1.581"
                  height="1.778"
                  transform="translate(30.826)"
                  fill="#fff"
                />
                <rect
                  width="0.395"
                  height="1.778"
                  transform="translate(32.802)"
                  fill="#fff"
                />
                <rect
                  width="1.581"
                  height="1.778"
                  transform="translate(33.592)"
                  fill="#fff"
                />
                <rect
                  width="0.395"
                  height="1.778"
                  transform="translate(35.568)"
                  fill="#fff"
                />
                <rect
                  width="0.395"
                  height="1.778"
                  transform="translate(36.359)"
                  fill="#fff"
                />
                <rect
                  width="0.395"
                  height="1.778"
                  transform="translate(37.544)"
                  fill="#fff"
                />
                <rect
                  width="2.766"
                  height="1.778"
                  transform="translate(40.311)"
                  fill="#fff"
                />
                <rect
                  width="0.395"
                  height="1.778"
                  transform="translate(43.472)"
                  fill="#fff"
                />
                <rect
                  width="0.395"
                  height="1.778"
                  transform="translate(45.053)"
                  fill="#fff"
                />
                <rect
                  width="0.395"
                  height="1.778"
                  transform="translate(45.844)"
                  fill="#fff"
                />
                <rect
                  width="0.395"
                  height="1.778"
                  transform="translate(47.029)"
                  fill="#fff"
                />
              </g>
              <g transform="translate(3.888 3.681)">
                <rect width="3.162" height="1.778" fill="#fff" />
                <rect
                  width="0.395"
                  height="1.778"
                  transform="translate(3.557)"
                  fill="#fff"
                />
                <rect
                  width="0.395"
                  height="1.778"
                  transform="translate(4.347)"
                  fill="#fff"
                />
                <rect
                  width="0.395"
                  height="1.778"
                  transform="translate(5.138)"
                  fill="#fff"
                />
                <rect
                  width="0.395"
                  height="1.778"
                  transform="translate(6.718)"
                  fill="#fff"
                />
                <rect
                  width="0.395"
                  height="1.778"
                  transform="translate(7.509)"
                  fill="#fff"
                />
                <rect
                  width="0.395"
                  height="1.778"
                  transform="translate(8.299)"
                  fill="#fff"
                />
                <rect
                  width="1.581"
                  height="1.778"
                  transform="translate(9.485)"
                  fill="#fff"
                />
                <rect
                  width="0.79"
                  height="1.778"
                  transform="translate(13.437)"
                  fill="#fff"
                />
                <rect
                  width="1.976"
                  height="1.778"
                  transform="translate(15.018)"
                  fill="#fff"
                />
                <rect
                  width="0.79"
                  height="1.778"
                  transform="translate(17.389)"
                  fill="#fff"
                />
                <rect
                  width="0.79"
                  height="1.778"
                  transform="translate(18.575)"
                  fill="#fff"
                />
                <rect
                  width="0.395"
                  height="1.778"
                  transform="translate(20.155)"
                  fill="#fff"
                />
                <rect
                  width="2.371"
                  height="1.778"
                  transform="translate(20.946)"
                  fill="#fff"
                />
                <rect
                  width="1.186"
                  height="1.778"
                  transform="translate(24.108)"
                  fill="#fff"
                />
                <rect
                  width="0.395"
                  height="1.778"
                  transform="translate(25.688)"
                  fill="#fff"
                />
                <rect
                  width="2.371"
                  height="1.778"
                  transform="translate(26.874)"
                  fill="#fff"
                />
                <rect
                  width="0.395"
                  height="1.778"
                  transform="translate(29.64)"
                  fill="#fff"
                />
                <rect
                  width="0.79"
                  height="1.778"
                  transform="translate(31.221)"
                  fill="#fff"
                />
                <rect
                  width="0.395"
                  height="1.778"
                  transform="translate(32.407)"
                  fill="#fff"
                />
                <rect
                  width="0.395"
                  height="1.778"
                  transform="translate(33.592)"
                  fill="#fff"
                />
                <rect
                  width="0.395"
                  height="1.778"
                  transform="translate(34.383)"
                  fill="#fff"
                />
                <rect
                  width="0.395"
                  height="1.778"
                  transform="translate(35.173)"
                  fill="#fff"
                />
                <rect
                  width="1.581"
                  height="1.778"
                  transform="translate(37.149)"
                  fill="#fff"
                />
                <rect
                  width="2.766"
                  height="1.778"
                  transform="translate(40.311)"
                  fill="#fff"
                />
                <rect
                  width="0.395"
                  height="1.778"
                  transform="translate(43.472)"
                  fill="#fff"
                />
                <rect
                  width="0.395"
                  height="1.778"
                  transform="translate(45.053)"
                  fill="#fff"
                />
                <rect
                  width="0.395"
                  height="1.778"
                  transform="translate(45.844)"
                  fill="#fff"
                />
                <rect
                  width="0.395"
                  height="1.778"
                  transform="translate(47.029)"
                  fill="#fff"
                />
              </g>
              <g transform="translate(3.888 5.46)">
                <rect width="3.162" height="1.778" fill="#fff" />
                <rect
                  width="0.395"
                  height="1.778"
                  transform="translate(3.557)"
                  fill="#fff"
                />
                <rect
                  width="0.395"
                  height="1.778"
                  transform="translate(4.347)"
                  fill="#fff"
                />
                <rect
                  width="0.395"
                  height="1.778"
                  transform="translate(5.138)"
                  fill="#fff"
                />
                <rect
                  width="0.79"
                  height="1.778"
                  transform="translate(6.718)"
                  fill="#fff"
                />
                <rect
                  width="0.395"
                  height="1.778"
                  transform="translate(7.904)"
                  fill="#fff"
                />
                <rect
                  width="1.581"
                  height="1.778"
                  transform="translate(8.695)"
                  fill="#fff"
                />
                <rect
                  width="1.976"
                  height="1.778"
                  transform="translate(11.066)"
                  fill="#fff"
                />
                <rect
                  width="0.395"
                  height="1.778"
                  transform="translate(13.437)"
                  fill="#fff"
                />
                <rect
                  width="0.79"
                  height="1.778"
                  transform="translate(15.413)"
                  fill="#fff"
                />
                <rect
                  width="1.581"
                  height="1.778"
                  transform="translate(16.599)"
                  fill="#fff"
                />
                <rect
                  width="1.186"
                  height="1.778"
                  transform="translate(18.575)"
                  fill="#fff"
                />
                <rect
                  width="1.976"
                  height="1.778"
                  transform="translate(20.155)"
                  fill="#fff"
                />
                <rect
                  width="0.395"
                  height="1.778"
                  transform="translate(22.527)"
                  fill="#fff"
                />
                <rect
                  width="0.395"
                  height="1.778"
                  transform="translate(23.712)"
                  fill="#fff"
                />
                <rect
                  width="1.976"
                  height="1.778"
                  transform="translate(24.503)"
                  fill="#fff"
                />
                <rect
                  width="0.79"
                  height="1.778"
                  transform="translate(26.874)"
                  fill="#fff"
                />
                <rect
                  width="0.395"
                  height="1.778"
                  transform="translate(29.64)"
                  fill="#fff"
                />
                <rect
                  width="0.395"
                  height="1.778"
                  transform="translate(30.431)"
                  fill="#fff"
                />
                <rect
                  width="0.79"
                  height="1.778"
                  transform="translate(31.616)"
                  fill="#fff"
                />
                <rect
                  width="0.79"
                  height="1.778"
                  transform="translate(33.592)"
                  fill="#fff"
                />
                <rect
                  width="0.395"
                  height="1.778"
                  transform="translate(34.778)"
                  fill="#fff"
                />
                <rect
                  width="1.581"
                  height="1.778"
                  transform="translate(35.568)"
                  fill="#fff"
                />
                <rect
                  width="1.976"
                  height="1.778"
                  transform="translate(37.94)"
                  fill="#fff"
                />
                <rect
                  width="2.766"
                  height="1.778"
                  transform="translate(40.311)"
                  fill="#fff"
                />
                <rect
                  width="0.395"
                  height="1.778"
                  transform="translate(43.472)"
                  fill="#fff"
                />
                <rect
                  width="0.395"
                  height="1.778"
                  transform="translate(45.053)"
                  fill="#fff"
                />
                <rect
                  width="0.395"
                  height="1.778"
                  transform="translate(45.844)"
                  fill="#fff"
                />
                <rect
                  width="0.395"
                  height="1.778"
                  transform="translate(47.029)"
                  fill="#fff"
                />
              </g>
              <g transform="translate(3.888 7.238)">
                <rect width="3.162" height="1.778" fill="#fff" />
                <rect
                  width="0.395"
                  height="1.778"
                  transform="translate(3.557)"
                  fill="#fff"
                />
                <rect
                  width="0.395"
                  height="1.778"
                  transform="translate(4.347)"
                  fill="#fff"
                />
                <rect
                  width="0.395"
                  height="1.778"
                  transform="translate(5.138)"
                  fill="#fff"
                />
                <rect
                  width="0.79"
                  height="1.778"
                  transform="translate(6.718)"
                  fill="#fff"
                />
                <rect
                  width="0.395"
                  height="1.778"
                  transform="translate(7.904)"
                  fill="#fff"
                />
                <rect
                  width="1.186"
                  height="1.778"
                  transform="translate(8.695)"
                  fill="#fff"
                />
                <rect
                  width="0.395"
                  height="1.778"
                  transform="translate(11.856)"
                  fill="#fff"
                />
                <rect
                  width="0.395"
                  height="1.778"
                  transform="translate(13.437)"
                  fill="#fff"
                />
                <rect
                  width="0.395"
                  height="1.778"
                  transform="translate(14.227)"
                  fill="#fff"
                />
                <rect
                  width="1.976"
                  height="1.778"
                  transform="translate(15.018)"
                  fill="#fff"
                />
                <rect
                  width="0.79"
                  height="1.778"
                  transform="translate(17.389)"
                  fill="#fff"
                />
                <rect
                  width="1.186"
                  height="1.778"
                  transform="translate(20.155)"
                  fill="#fff"
                />
                <rect
                  width="1.186"
                  height="1.778"
                  transform="translate(22.131)"
                  fill="#fff"
                />
                <rect
                  width="1.581"
                  height="1.778"
                  transform="translate(24.108)"
                  fill="#fff"
                />
                <rect
                  width="0.395"
                  height="1.778"
                  transform="translate(26.084)"
                  fill="#fff"
                />
                <rect
                  width="0.395"
                  height="1.778"
                  transform="translate(26.874)"
                  fill="#fff"
                />
                <rect
                  width="0.79"
                  height="1.778"
                  transform="translate(28.455)"
                  fill="#fff"
                />
                <rect
                  width="0.395"
                  height="1.778"
                  transform="translate(30.036)"
                  fill="#fff"
                />
                <rect
                  width="2.371"
                  height="1.778"
                  transform="translate(30.826)"
                  fill="#fff"
                />
                <rect
                  width="1.581"
                  height="1.778"
                  transform="translate(33.592)"
                  fill="#fff"
                />
                <rect
                  width="0.395"
                  height="1.778"
                  transform="translate(35.568)"
                  fill="#fff"
                />
                <rect
                  width="1.186"
                  height="1.778"
                  transform="translate(36.359)"
                  fill="#fff"
                />
                <rect
                  width="1.186"
                  height="1.778"
                  transform="translate(38.335)"
                  fill="#fff"
                />
                <rect
                  width="2.766"
                  height="1.778"
                  transform="translate(40.311)"
                  fill="#fff"
                />
                <rect
                  width="0.395"
                  height="1.778"
                  transform="translate(43.472)"
                  fill="#fff"
                />
                <rect
                  width="0.395"
                  height="1.778"
                  transform="translate(45.053)"
                  fill="#fff"
                />
                <rect
                  width="0.395"
                  height="1.778"
                  transform="translate(45.844)"
                  fill="#fff"
                />
                <rect
                  width="0.395"
                  height="1.778"
                  transform="translate(47.029)"
                  fill="#fff"
                />
              </g>
              <g transform="translate(3.888 9.017)">
                <rect width="3.162" height="1.778" fill="#fff" />
                <rect
                  width="0.395"
                  height="1.778"
                  transform="translate(3.557)"
                  fill="#fff"
                />
                <rect
                  width="0.395"
                  height="1.778"
                  transform="translate(4.347)"
                  fill="#fff"
                />
                <rect
                  width="0.395"
                  height="1.778"
                  transform="translate(5.138)"
                  fill="#fff"
                />
                <rect
                  width="1.976"
                  height="1.778"
                  transform="translate(6.718)"
                  fill="#fff"
                />
                <rect
                  width="0.395"
                  height="1.778"
                  transform="translate(9.09)"
                  fill="#fff"
                />
                <rect
                  width="1.581"
                  height="1.778"
                  transform="translate(9.88)"
                  fill="#fff"
                />
                <rect
                  width="0.79"
                  height="1.778"
                  transform="translate(11.856)"
                  fill="#fff"
                />
                <rect
                  width="0.395"
                  height="1.778"
                  transform="translate(13.437)"
                  fill="#fff"
                />
                <rect
                  width="0.395"
                  height="1.778"
                  transform="translate(14.227)"
                  fill="#fff"
                />
                <rect
                  width="0.79"
                  height="1.778"
                  transform="translate(15.018)"
                  fill="#fff"
                />
                <rect
                  width="1.976"
                  height="1.778"
                  transform="translate(16.203)"
                  fill="#fff"
                />
                <rect
                  width="0.395"
                  height="1.778"
                  transform="translate(20.155)"
                  fill="#fff"
                />
                <rect
                  width="0.395"
                  height="1.778"
                  transform="translate(22.131)"
                  fill="#fff"
                />
                <rect
                  width="0.395"
                  height="1.778"
                  transform="translate(24.108)"
                  fill="#fff"
                />
                <rect
                  width="1.581"
                  height="1.778"
                  transform="translate(24.898)"
                  fill="#fff"
                />
                <rect
                  width="1.581"
                  height="1.778"
                  transform="translate(26.874)"
                  fill="#fff"
                />
                <rect
                  width="0.79"
                  height="1.778"
                  transform="translate(28.85)"
                  fill="#fff"
                />
                <rect
                  width="0.395"
                  height="1.778"
                  transform="translate(30.036)"
                  fill="#fff"
                />
                <rect
                  width="2.371"
                  height="1.778"
                  transform="translate(30.826)"
                  fill="#fff"
                />
                <rect
                  width="1.581"
                  height="1.778"
                  transform="translate(33.592)"
                  fill="#fff"
                />
                <rect
                  width="0.395"
                  height="1.778"
                  transform="translate(35.568)"
                  fill="#fff"
                />
                <rect
                  width="1.976"
                  height="1.778"
                  transform="translate(36.359)"
                  fill="#fff"
                />
                <rect
                  width="0.79"
                  height="1.778"
                  transform="translate(38.73)"
                  fill="#fff"
                />
                <rect
                  width="2.766"
                  height="1.778"
                  transform="translate(40.311)"
                  fill="#fff"
                />
                <rect
                  width="0.395"
                  height="1.778"
                  transform="translate(43.472)"
                  fill="#fff"
                />
                <rect
                  width="0.395"
                  height="1.778"
                  transform="translate(45.053)"
                  fill="#fff"
                />
                <rect
                  width="0.395"
                  height="1.778"
                  transform="translate(45.844)"
                  fill="#fff"
                />
                <rect
                  width="0.395"
                  height="1.778"
                  transform="translate(47.029)"
                  fill="#fff"
                />
              </g>
              <g transform="translate(3.888 10.795)">
                <rect width="3.162" height="1.778" fill="#fff" />
                <rect
                  width="0.395"
                  height="1.778"
                  transform="translate(3.557)"
                  fill="#fff"
                />
                <rect
                  width="0.395"
                  height="1.778"
                  transform="translate(4.347)"
                  fill="#fff"
                />
                <rect
                  width="0.395"
                  height="1.778"
                  transform="translate(5.138)"
                  fill="#fff"
                />
                <rect
                  width="1.186"
                  height="1.778"
                  transform="translate(6.718)"
                  fill="#fff"
                />
                <rect
                  width="0.395"
                  height="1.778"
                  transform="translate(8.299)"
                  fill="#fff"
                />
                <rect
                  width="1.186"
                  height="1.778"
                  transform="translate(9.485)"
                  fill="#fff"
                />
                <rect
                  width="1.976"
                  height="1.778"
                  transform="translate(11.066)"
                  fill="#fff"
                />
                <rect
                  width="0.395"
                  height="1.778"
                  transform="translate(13.437)"
                  fill="#fff"
                />
                <rect
                  width="0.79"
                  height="1.778"
                  transform="translate(15.413)"
                  fill="#fff"
                />
                <rect
                  width="0.79"
                  height="1.778"
                  transform="translate(17.389)"
                  fill="#fff"
                />
                <rect
                  width="0.395"
                  height="1.778"
                  transform="translate(18.97)"
                  fill="#fff"
                />
                <rect
                  width="0.395"
                  height="1.778"
                  transform="translate(20.155)"
                  fill="#fff"
                />
                <rect
                  width="0.395"
                  height="1.778"
                  transform="translate(21.736)"
                  fill="#fff"
                />
                <rect
                  width="0.395"
                  height="1.778"
                  transform="translate(23.712)"
                  fill="#fff"
                />
                <rect
                  width="0.395"
                  height="1.778"
                  transform="translate(25.688)"
                  fill="#fff"
                />
                <rect
                  width="0.395"
                  height="1.778"
                  transform="translate(26.874)"
                  fill="#fff"
                />
                <rect
                  width="0.395"
                  height="1.778"
                  transform="translate(29.245)"
                  fill="#fff"
                />
                <rect
                  width="1.186"
                  height="1.778"
                  transform="translate(30.036)"
                  fill="#fff"
                />
                <rect
                  width="1.186"
                  height="1.778"
                  transform="translate(31.616)"
                  fill="#fff"
                />
                <rect
                  width="1.186"
                  height="1.778"
                  transform="translate(33.592)"
                  fill="#fff"
                />
                <rect
                  width="0.395"
                  height="1.778"
                  transform="translate(35.173)"
                  fill="#fff"
                />
                <rect
                  width="1.186"
                  height="1.778"
                  transform="translate(36.359)"
                  fill="#fff"
                />
                <rect
                  width="1.976"
                  height="1.778"
                  transform="translate(37.94)"
                  fill="#fff"
                />
                <rect
                  width="2.766"
                  height="1.778"
                  transform="translate(40.311)"
                  fill="#fff"
                />
                <rect
                  width="0.395"
                  height="1.778"
                  transform="translate(43.472)"
                  fill="#fff"
                />
                <rect
                  width="0.395"
                  height="1.778"
                  transform="translate(45.053)"
                  fill="#fff"
                />
                <rect
                  width="0.395"
                  height="1.778"
                  transform="translate(45.844)"
                  fill="#fff"
                />
                <rect
                  width="0.395"
                  height="1.778"
                  transform="translate(47.029)"
                  fill="#fff"
                />
              </g>
              <g transform="translate(3.888 12.573)">
                <rect width="3.162" height="1.778" fill="#fff" />
                <rect
                  width="0.395"
                  height="1.778"
                  transform="translate(3.557)"
                  fill="#fff"
                />
                <rect
                  width="0.395"
                  height="1.778"
                  transform="translate(4.347)"
                  fill="#fff"
                />
                <rect
                  width="0.395"
                  height="1.778"
                  transform="translate(5.138)"
                  fill="#fff"
                />
                <rect
                  width="2.371"
                  height="1.778"
                  transform="translate(6.718)"
                  fill="#fff"
                />
                <rect
                  width="0.395"
                  height="1.778"
                  transform="translate(9.485)"
                  fill="#fff"
                />
                <rect
                  width="0.395"
                  height="1.778"
                  transform="translate(10.671)"
                  fill="#fff"
                />
                <rect
                  width="1.186"
                  height="1.778"
                  transform="translate(11.461)"
                  fill="#fff"
                />
                <rect
                  width="1.581"
                  height="1.778"
                  transform="translate(13.437)"
                  fill="#fff"
                />
                <rect
                  width="1.186"
                  height="1.778"
                  transform="translate(15.808)"
                  fill="#fff"
                />
                <rect
                  width="1.186"
                  height="1.778"
                  transform="translate(17.389)"
                  fill="#fff"
                />
                <rect
                  width="0.395"
                  height="1.778"
                  transform="translate(19.365)"
                  fill="#fff"
                />
                <rect
                  width="1.186"
                  height="1.778"
                  transform="translate(20.155)"
                  fill="#fff"
                />
                <rect
                  width="1.186"
                  height="1.778"
                  transform="translate(22.131)"
                  fill="#fff"
                />
                <rect
                  width="1.581"
                  height="1.778"
                  transform="translate(23.712)"
                  fill="#fff"
                />
                <rect
                  width="0.395"
                  height="1.778"
                  transform="translate(25.688)"
                  fill="#fff"
                />
                <rect
                  width="0.79"
                  height="1.778"
                  transform="translate(26.874)"
                  fill="#fff"
                />
                <rect
                  width="0.395"
                  height="1.778"
                  transform="translate(28.455)"
                  fill="#fff"
                />
                <rect
                  width="1.186"
                  height="1.778"
                  transform="translate(29.245)"
                  fill="#fff"
                />
                <rect
                  width="0.395"
                  height="1.778"
                  transform="translate(30.826)"
                  fill="#fff"
                />
                <rect
                  width="0.395"
                  height="1.778"
                  transform="translate(33.592)"
                  fill="#fff"
                />
                <rect
                  width="0.395"
                  height="1.778"
                  transform="translate(34.383)"
                  fill="#fff"
                />
                <rect
                  width="2.371"
                  height="1.778"
                  transform="translate(35.173)"
                  fill="#fff"
                />
                <rect
                  width="1.186"
                  height="1.778"
                  transform="translate(37.94)"
                  fill="#fff"
                />
                <rect
                  width="2.766"
                  height="1.778"
                  transform="translate(40.311)"
                  fill="#fff"
                />
                <rect
                  width="0.395"
                  height="1.778"
                  transform="translate(43.472)"
                  fill="#fff"
                />
                <rect
                  width="0.395"
                  height="1.778"
                  transform="translate(45.053)"
                  fill="#fff"
                />
                <rect
                  width="0.395"
                  height="1.778"
                  transform="translate(45.844)"
                  fill="#fff"
                />
                <rect
                  width="0.395"
                  height="1.778"
                  transform="translate(47.029)"
                  fill="#fff"
                />
              </g>
              <g transform="translate(3.888 14.352)">
                <rect width="3.162" height="1.778" fill="#fff" />
                <rect
                  width="0.395"
                  height="1.778"
                  transform="translate(3.557)"
                  fill="#fff"
                />
                <rect
                  width="0.395"
                  height="1.778"
                  transform="translate(4.347)"
                  fill="#fff"
                />
                <rect
                  width="0.395"
                  height="1.778"
                  transform="translate(5.138)"
                  fill="#fff"
                />
                <rect
                  width="2.371"
                  height="1.778"
                  transform="translate(6.718)"
                  fill="#fff"
                />
                <rect
                  width="0.395"
                  height="1.778"
                  transform="translate(9.485)"
                  fill="#fff"
                />
                <rect
                  width="0.79"
                  height="1.778"
                  transform="translate(10.671)"
                  fill="#fff"
                />
                <rect
                  width="0.395"
                  height="1.778"
                  transform="translate(12.251)"
                  fill="#fff"
                />
                <rect
                  width="0.395"
                  height="1.778"
                  transform="translate(13.437)"
                  fill="#fff"
                />
                <rect
                  width="1.976"
                  height="1.778"
                  transform="translate(14.623)"
                  fill="#fff"
                />
                <rect
                  width="0.79"
                  height="1.778"
                  transform="translate(16.994)"
                  fill="#fff"
                />
                <rect
                  width="0.395"
                  height="1.778"
                  transform="translate(19.365)"
                  fill="#fff"
                />
                <rect
                  width="0.79"
                  height="1.778"
                  transform="translate(20.155)"
                  fill="#fff"
                />
                <rect
                  width="2.371"
                  height="1.778"
                  transform="translate(21.736)"
                  fill="#fff"
                />
                <rect
                  width="0.79"
                  height="1.778"
                  transform="translate(24.503)"
                  fill="#fff"
                />
                <rect
                  width="0.395"
                  height="1.778"
                  transform="translate(25.688)"
                  fill="#fff"
                />
                <rect
                  width="0.395"
                  height="1.778"
                  transform="translate(26.874)"
                  fill="#fff"
                />
                <rect
                  width="0.395"
                  height="1.778"
                  transform="translate(28.455)"
                  fill="#fff"
                />
                <rect
                  width="0.395"
                  height="1.778"
                  transform="translate(29.245)"
                  fill="#fff"
                />
                <rect
                  width="1.581"
                  height="1.778"
                  transform="translate(30.826)"
                  fill="#fff"
                />
                <rect
                  width="1.976"
                  height="1.778"
                  transform="translate(33.592)"
                  fill="#fff"
                />
                <rect
                  width="0.395"
                  height="1.778"
                  transform="translate(35.964)"
                  fill="#fff"
                />
                <rect
                  width="1.186"
                  height="1.778"
                  transform="translate(37.149)"
                  fill="#fff"
                />
                <rect
                  width="0.395"
                  height="1.778"
                  transform="translate(38.73)"
                  fill="#fff"
                />
                <rect
                  width="2.766"
                  height="1.778"
                  transform="translate(40.311)"
                  fill="#fff"
                />
                <rect
                  width="0.395"
                  height="1.778"
                  transform="translate(43.472)"
                  fill="#fff"
                />
                <rect
                  width="0.395"
                  height="1.778"
                  transform="translate(45.053)"
                  fill="#fff"
                />
                <rect
                  width="0.395"
                  height="1.778"
                  transform="translate(45.844)"
                  fill="#fff"
                />
                <rect
                  width="0.395"
                  height="1.778"
                  transform="translate(47.029)"
                  fill="#fff"
                />
              </g>
            </g>
            <g
              transform="translate(136 293)"
              fill="none"
              stroke="#fff"
              stroke-width="1"
            >
              <rect width="90" height="49" stroke="none" />
              <rect x="0.5" y="0.5" width="89" height="48" fill="none" />
            </g>
            <rect
              width="70"
              height="1"
              transform="translate(146 303)"
              fill="#fff"
            />
            <rect
              width="70"
              height="1"
              transform="translate(146 307)"
              fill="#fff"
            />
            <rect
              width="15"
              height="1"
              transform="translate(201 320)"
              fill="#fff"
            />
            <rect
              width="15"
              height="1"
              transform="translate(201 324)"
              fill="#fff"
            />
          </g>
        </svg>
      </div>
      <div class="tipText">Scan barcode on the back of license</div>
    </div>
    <div class="loadingImg" v-show="isShowLoadingImg">
      <a-icon type="loading" />
    </div>
    <div class="loadingCameraImg" v-show="isLoadingCamera">
      <svg
        class="dbrScanner-bg-loading"
        style="
          animation: 1s linear infinite dbrScanner-rotate;
          width: 40vmin;
          height: 40vmin;
          position: absolute;
          margin: auto;
          left: 0;
          top: 0;
          right: 0;
          bottom: 0;
          fill: #aaa;
        "
        viewBox="0 0 1792 1792"
      >
        <path
          d="M1760 896q0 176-68.5 336t-184 275.5-275.5 184-336 68.5-336-68.5-275.5-184-184-275.5-68.5-336q0-213 97-398.5t265-305.5 374-151v228q-221 45-366.5 221t-145.5 406q0 130 51 248.5t136.5 204 204 136.5 248.5 51 248.5-51 204-136.5 136.5-204 51-248.5q0-230-145.5-406t-366.5-221v-228q206 31 374 151t265 305.5 97 398.5z"
        />
      </svg>
    </div>
    <ul class="cameraList" v-show="isShowCameraList">
      <li>
        <from-image />
      </li>
      <li
        v-for="(item, index) in cameraAndResolutionList"
        :key="index"
        @click="onChangeCameraAndResolution(item)"
        :class="{
          selected:
            item[0].deviceId == currentCamera.deviceId &&
            item[1].includes(currentResolution[0]),
        }"
      >
        <div
          class="cameraOption"
          :style="{
            color:
              item[0].deviceId == currentCamera.deviceId &&
              item[1].includes(currentResolution[0])
                ? '#fe8e14'
                : '#aaaaaa',
          }"
        >
          {{ item[0].label }}({{ item[1][1] === 720 ? "HD" : "FULL HD" }})
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import Vue from "vue";
import DBR from "../dbr";
import musicIcon from "../assets/image/music.svg";
import checkedMusicIcon from "../assets/image/music-check.svg";
import BarcodeFormatMap from "../assets/enum/BarcodeFormatMap.js";
import BarcodeFormatMap_2 from "../assets/enum/BarcodeFormatMap_2.js";
import DriverLicenseFields from "../assets/enum/DriverLicenseFields.js";
import FromImage from "./FromImage.vue";
import Clipboard from "clipboard";

export default Vue.extend({
  name: "BarcodeScanner",
  components: {
    FromImage,
  },
  data() {
    return {
      soundEffectsIconPath: checkedMusicIcon,
      scanner: null,
      isDestroyed: false,
      resultsInfo: [],
      resolutionList: [
        [1280, 720],
        [1920, 1080],
      ],
      currentResolution: [],
      cameraList: [],
      currentCamera: null,
      cameraAndResolutionList: [],
      regionScale: 0.4,
      clientWidth: 0,
      clientHeight: 0,
      isShowCloseMask: false,
      maskCanvas: null,
      maskCanvasContext: null,
      isShowTorchIcon: false,
      flashlightOn: false,
      isShowCameraList: false,
      dlText: "",
      changeClientTimeoutId: null,
      changeRuntimeSettingsTimeoutId: null,
      isResizing: false,
      generalPresetRegion: [
        null,
        {
          regionLeft: 0,
          regionTop: 30,
          regionRight: 100,
          regionBottom: 70,
          regionMeasuredByPercentage: 1,
        },
        {
          regionLeft: 25,
          regionTop: 25,
          regionRight: 75,
          regionBottom: 75,
          regionMeasuredByPercentage: 1,
        },
        {
          regionLeft: 25,
          regionTop: 25,
          regionRight: 75,
          regionBottom: 75,
          regionMeasuredByPercentage: 1,
        },
      ],
      isShowTipImg: true,
      isShowLoadingImg: true,
      isLoadingCamera: false,
      startMainTime: 0,
      endMainTime: 0,
      mainPageTime: 0,
      startResolutionTime: 0,
      endResolutionTime: 0,
      resolutionUsedTime: {
        HD: 0,
        FULL_HD: 0,
      },
      scanSuccessfullyList: [],
      startUseCaseTime: 0,
      endUseCaseTime: 0,
      useCaseTime: {
        general: 0,
        vin: 0,
        dl: 0,
        dpm: 0,
      },
    };
  },

  async mounted() {
    // this.clientHeight = window.innerHeight;
    // this.clientWidth = window.innerWidth;
    this.clientHeight = document.body.clientHeight;
    this.clientWidth = document.body.clientWidth;
    this.maskCanvas = document.getElementById("closeRegionMask");
    this.maskCanvasContext = this.maskCanvas.getContext("2d");

    if (
      DBR.BarcodeScanner.browserInfo.OS == "Android" ||
      DBR.BarcodeScanner.browserInfo.OS == "iPhone"
    ) {
      this.isShowTorchIcon = true;
    } else {
      this.isShowTorchIcon = false;
    }
    // this.cvsDrawArea();
    window.onresize = () => {
      this.isResizing = true;
      this.changeClientTimeoutId && clearTimeout(this.changeClientTimeoutId);
      this.changeClientTimeoutId = setTimeout(() => {
        this.clientHeight = document.body.clientHeight;
        this.clientWidth = document.body.clientWidth;
        this.cvsDrawArea();
        this.isResizing = false;
      }, 1000);
    };
    document.addEventListener("click", () => {
      this.hideCameraList();
    });
    await this.showScanner();
    this.cameraList = await this.scanner.getAllCameras();
    this.currentCamera = await this.scanner.getCurrentCamera();
    for (let i of this.cameraList) {
      for (let j of this.resolutionList) {
        this.cameraAndResolutionList.push([i, j]);
      }
    }

    if (this.selectedUseCase === "dl") {
      this.isShowTipImg = true;
      setTimeout(() => {
        this.isShowTipImg = false;
      }, 5000);
    }
    if (
      (DBR.BarcodeScanner.browserInfo.OS === "Android" ||
        DBR.BarcodeScanner.browserInfo.OS === "iPhone") &&
      (this.selectedUseCase === "vin" || this.selectedUseCase === "dl") &&
      (window.orientation === 0 || window.orientation === 180)
    ) {
      let config = {};
      config.duration = 2;
      config.content = "Rotate your device.";
      config.icon = (
        <a-icon type="mobile" spin style={{ color: "#FE8E14" }}></a-icon>
      );
      this.$message.open(config);
    }
  },
  beforeDestroy() {
    this.isDestroyed = true;
    if (this.scanner) {
      this.scanner.destroy();
    }
  },
  methods: {
    closeDLResult() {
      this.dlText = "";
    },
    getDLInfo(txt) {
      let dlInfo = [];
      if (txt !== "") {
        let barcodeText = txt + "\n";
        for (let i = 0; i < DriverLicenseFields.length; i++) {
          let __item = DriverLicenseFields[i];
          let _fieldValue = this.getField(barcodeText, __item.abbreviation);
          if (_fieldValue != false) {
            dlInfo.push({
              description: __item.description,
              value: _fieldValue,
            });
          }
        }
      }
      return dlInfo;
    },
    getField(barcodeText, keyword) {
      let k = barcodeText.search("\n" + keyword);
      if (k == -1) return false;
      let m = barcodeText.indexOf("\n", k + 1);
      let subtext = barcodeText.substring(k + 4, m);
      return subtext;
    },
    showCameraList() {
      this.isShowCameraList = !this.isShowCameraList;
    },
    hideCameraList() {
      this.isShowCameraList = false;
    },
    copyResult(target) {
      let clipboard = new Clipboard(target);
      clipboard.on("success", () => {
        let config = {};
        config.content = "Copied!";
        config.duration = 1;
        config.icon = (
          <a-icon type="smile" style={{ color: "#FE8E14" }}></a-icon>
        );
        this.$message.open(config);
        clipboard.destroy();
      });
      clipboard.on("error", () => {
        let config = {};
        config.content = "Failed!";
        config.icon = (
          <a-icon type="frown" style={{ color: "#FE8E14" }}></a-icon>
        );
        this.$message.open(config);
        clipboard.destroy();
      });
    },
    copyDLInfo() {
      let clipboard = new Clipboard(".copyBtn", {
        text: () => {
          let copyContent = "";
          for (let i of this.dlInfo) {
            copyContent += i.description + ": " + i.value + "\n";
          }
          return copyContent;
        },
      });
      clipboard.on("success", () => {
        let config = {};
        config.content = "Copied!";
        config.duration = 1;
        config.icon = (
          <a-icon type="smile" style={{ color: "#FE8E14" }}></a-icon>
        );
        this.$message.open(config);
        clipboard.destroy();
      });
      clipboard.on("error", () => {
        let config = {};
        config.content = "Failed!";
        config.icon = (
          <a-icon type="frown" style={{ color: "#FE8E14" }}></a-icon>
        );
        this.$message.open(config);
        clipboard.destroy();
      });
    },
    async flashlightSwitch() {
      try {
        if (this.flashlightOn) {
          await this.scanner.turnOffTorch();
          this.flashlightOn = false;
        } else {
          await this.scanner.turnOnTorch();
          this.flashlightOn = true;
        }
      } catch (e) {
        let config = {};
        config.duration = 2;
        config.content = "Not supported.";
        config.icon = (
          <a-icon type="frown" style={{ color: "#FE8E14" }}></a-icon>
        );
        this.$message.open(config);
        this.isShowTorchIcon = false;
      }
    },
    soundEffectsSwitch() {
      if (this.$store.state.soundEffectsOn) {
        this.$store.commit("soundEffectsSwitch", "false");
      } else {
        this.$store.commit("soundEffectsSwitch", "true");
      }
    },
    async showScanner() {
      this.isLoadingCamera = true;
      try {
        this.scanner || (this.scanner = await DBR.BarcodeScanner.createInstance());
      } catch (e) {
        let config = {};
        config.content = e.message;
        config.duration = 0;
        this.$message.warning(config);
        return Promise.reject(e.message);
      }

      if (this.isDestroyed) {
        this.scanner.destroy();
        return;
      }

      try {
        if (this.scanner) {
          await this.scanner.setUIElement(this.$refs.videoContainer);

          // this.scanner.bPlaySoundOnSuccessfulRead = true;
          this.scanner.regionMaskLineWidth = 0;
          this.scanner.regionMaskStrokeStyle = "transparent";
          this.scanner.regionMaskFillStyle = "transparent";

          this.currentResolution = this.resolutionList[0];
          if (this.selectedUseCase === "vin" || this.selectedUseCase === "dl") {
            this.currentResolution = this.resolutionList[1];
          }
          await this.scanner.updateVideoSettings({
            video: {
              width: this.currentResolution[0],
              height: this.currentResolution[1],
              facingMode: "environment",
            },
          });
          this.scanner.onFrameRead = (results) => {
            for (let i = 0; i < results.length; i++) {
              let result = results[i];
              if (
                this.selectedUseCase === "dl" &&
                result.barcodeFormatString === "PDF417" &&
                result.barcodeFormatString_2.includes("No Barcode Format")
              ) {
                this.dlText = result.barcodeText;
              }
            }
          };

          this.scanner.onUnduplicatedRead = () => {
            if (!this.scanSuccessfullyList.includes(this.selectedUseCase)) {
              this.scanSuccessfullyList.push(this.selectedUseCase);
            }
          };
          await this.scanner.open();
          this.isLoadingCamera = false;
        }
      } catch (e) {
        let config = {};
        config.content = `Unable to connect to the camera, make sure it is not used by other apps and try again. Alternatively, you can click "From Image" in the "Camera" drop-down list to read barcodes from an existing image.`;
        config.duration = 0;
        this.$message.warning(config);
        return Promise.reject(e.message);
      }
    },
    async onChangeCameraAndResolution(item) {
      let config = {};
      this.isLoadingCamera = true;
      await this.scanner.setCurrentCamera(item[0].deviceId)
      await this.scanner.setResolution(item[1]);
      this.currentResolution = this.scanner.getResolution();
      this.currentCamera = await this.scanner.getCurrentCamera();
      if (this.currentCamera.deviceId !== item[0].deviceId) {
        config.icon = (
          <a-icon type="frown" style={{ color: "#FE8E14" }}></a-icon>
        );
        config.content = "Switch camera failed!";
      } else if (!this.currentResolution.includes(item[1][1])) {
        config.icon = (
          <a-icon type="meh" style={{ color: "#FE8E14" }}></a-icon>
        );
        config.content =
          "Switch resolution failed. " +
          (item[1].includes(720) ? "HD" : "FULL HD") +
          " might be unsupported in the camera.";
      } else {
        config.icon = (
          <a-icon type="smile" style={{ color: "#FE8E14" }}></a-icon>
        );
        config.content =
          "Switched to " + this.cameraInfo + " successfully!";
      }
      this.$message.open(config);
      this.isLoadingCamera = false;
    },
    cvsDrawArea() {
      this.maskCanvas.width = this.clientWidth;
      this.maskCanvas.height = this.clientHeight;
      // this.maskCanvasContext = this.maskCanvas.getContext("2d");

      this.maskCanvasContext.fillStyle = "rgba(0,0,0,.5)";
      this.maskCanvasContext.fillRect(
        0,
        0,
        this.maskCanvas.width,
        this.maskCanvas.height
      );
      this.maskCanvasContext.globalCompositeOperation = "destination-out";
      this.maskCanvasContext.fillStyle = "white";
      this.maskCanvasContext.fillRect(
        (this.regionLeft / 100) * this.maskCanvas.width,
        (this.regionTop / 100) * this.maskCanvas.height,
        ((100 - 2 * this.regionLeft) / 100) * this.maskCanvas.width,
        ((100 - 2 * this.regionTop) / 100) * this.maskCanvas.height
      );
      this.maskCanvasContext.globalCompositeOperation = "source-over";
      this.maskCanvasContext.lineWidth = 2;
      this.maskCanvasContext.strokeStyle = "rgb(254, 142, 20)";
      this.maskCanvasContext.rect(
        (this.regionLeft / 100) * this.maskCanvas.width,
        (this.regionTop / 100) * this.maskCanvas.height,
        ((100 - 2 * this.regionLeft) / 100) * this.maskCanvas.width,
        ((100 - 2 * this.regionTop) / 100) * this.maskCanvas.height
      );
      this.maskCanvasContext.stroke();
    },
  },
  asyncComputed: {
    runtimeSettings: {
      async get() {
        if (!this.scanner) {
          return null;
        }
        if (this.isLoadingCamera) {
          this.isShowLoadingImg = false;
        } else {
          this.isShowLoadingImg = true;
        }
        let runtimeSettings = null;
        this.changeRuntimeSettingsTimeoutId &&
          clearTimeout(this.changeRuntimeSettingsTimeoutId);
        this.changeRuntimeSettingsTimeoutId = setTimeout(async () => {
          // scan mode
          if (this.scanMode === "bestSpeed") {
            await this.scanner.updateRuntimeSettings("speed");
          } else if (this.scanMode === "balance") {
            await this.scanner.updateRuntimeSettings("balance");
          } else if (this.scanMOde === "bestCoverage") {
            await this.scanner.updateRuntimeSettings("coverage");
          }
          runtimeSettings = await this.scanner.getRuntimeSettings();
          // colour invert
          runtimeSettings.furtherModes.grayscaleTransformationModes = [
            this.invertColourOn
              ? DBR.EnumGrayscaleTransformationMode.GTM_INVERTED
              : DBR.EnumGrayscaleTransformationMode.GTM_ORIGINAL,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
          ];
          // sound effects
          this.scanner.bPlaySoundOnSuccessfulRead = this.soundEffectsOn;

          // set scan region
          if (this.isFullImageLocalization) {
            runtimeSettings.region = [null];
            this.isShowCloseMask = false;
          } else {
            if (this.selectedUseCase === "general") {
              runtimeSettings.region = JSON.parse(JSON.stringify(this.generalPresetRegion));
              this.isShowCloseMask = false;
            } else if (this.selectedUseCase === "vin") {
              runtimeSettings.region = JSON.parse(JSON.stringify(this.region));
              this.isShowCloseMask = true;
              this.cvsDrawArea();
            } else if (this.selectedUseCase === "dl") {
              runtimeSettings.region = JSON.parse(JSON.stringify(this.region));
              this.isShowCloseMask = true;
              this.cvsDrawArea();
            } else if (this.selectedUseCase === "dpm") {
              runtimeSettings.region = JSON.parse(JSON.stringify(this.region));
              this.isShowCloseMask = true;
              this.cvsDrawArea();
            }
          }
          // barcode format part
          runtimeSettings.barcodeFormatIds = 0;
          runtimeSettings.barcodeFormatIds_2 = 0;
          let newValue = this.selectedBarcodes;
          for (let i = 0; i < newValue.length; i++) {
            let n1 = BarcodeFormatMap.get(newValue[i]);
            let n2 = BarcodeFormatMap_2.get(newValue[i]);
            if (n1 !== undefined) {
              runtimeSettings.barcodeFormatIds |= n1;
            }
            if (n2 !== undefined) {
              runtimeSettings.barcodeFormatIds_2 |= n2;
            }
          }

          if (this.selectedUseCase === "vin") {
            runtimeSettings.localizationModes = [32, 8, 2, 0, 0, 0, 0, 0];
            runtimeSettings.deblurLevel = 9;
            runtimeSettings.scaleDownThreshold = 100000;
            runtimeSettings.furtherModes.barcodeColourModes = [
              1, 2, 32, 0, 0, 0, 0, 0,
            ];
          } else if (this.selectedUseCase === "dl") {
            runtimeSettings.localizationModes = [16, 8, 2, 0, 0, 0, 0, 0];
            runtimeSettings.deblurLevel = 5;
          } else if (this.selectedUseCase === "dpm") {
            runtimeSettings.furtherModes.dpmCodeReadingModes[0] =
              DBR.EnumDPMCodeReadingMode.DPMCRM_GENERAL;
            let locModes = runtimeSettings.localizationModes;
            for (let i in locModes) {
              if (locModes[i] == DBR.EnumLocalizationMode.LM_STATISTICS_MARKS) {
                break;
              }
              if (locModes[i] == 0) {
                locModes[i] = DBR.EnumLocalizationMode.LM_STATISTICS_MARKS;
                break;
              }
            }
          }

          // single or multiple
          this.singleOrMul === "single"
            ? (runtimeSettings.expectedBarcodesCount = 1)
            : (runtimeSettings.expectedBarcodesCount = 512);
          await this.scanner.updateRuntimeSettings(runtimeSettings);
          this.isShowLoadingImg = false;
          return runtimeSettings;
        }, 500);
      },
      watch: [
        "selectedBarcodes",
        "region",
        "singleOrMul",
        "scanMode",
        "invertColourOn",
        "soundEffectsOn",
        "isFullImageLocalization",
      ],
    },
  },
  computed: {
    driverLicenseTipStyle() {
      if (this.selectedUseCase !== "dl") {
        return {
          display: "none",
        };
      } else {
        let width = ((100 - 2 * this.regionLeft) / 100) * this.clientWidth;
        let height = ((100 - 2 * this.regionTop) / 100) * this.clientHeight;
        return {
          top: this.regionTop + "%",
          height: height + "px",
          width: width + "px",
        };
      }
    },
    tipImgStyle: {
      get() {
        if (this.selectedUseCase !== "dl") {
          return {};
        }
        if (!this.isShowTipImg) {
          return {
            display: "none",
          };
        }
        let height =
          ((100 - 2 * this.regionTop) / 100) * this.clientHeight * 0.278;
        return {
          marginTop: "54px",
          height: height + "px",
        };
      },
      set(newValue) {
        return newValue;
      },
    },
    cameraInfo() {
      if (this.currentCamera) {
        return (
          this.currentCamera.label +
          " " +
          (this.currentResolution.includes(720) ? "HD" : "FULL HD")
        );
      } else {
        return "";
      }
    },
    curUseCase() {
      switch (this.selectedUseCase) {
        case "general":
          return "General";
        case "vin":
          return "Vehicle Identification Number (VIN)";
        case "dl":
          return "USA/CAN Driver's License";
        case "dpm":
          return "DPM Codes";
        default:
          return "";
      }
    },
    isDLResultShow() {
      return this.selectedUseCase === "dl" && this.dlInfo.length !== 0;
    },
    dlInfo() {
      if (this.selectedUseCase === "dl") {
        return this.getDLInfo(this.dlText);
      } else {
        return [];
      }
    },
    copiedDLInfo() {
      let copiedDLInfo = "";
      for (let i of this.dlInfo) {
        copiedDLInfo += i.description + ": " + i.value + "\n";
      }
      return copiedDLInfo;
    },
    isDecodingFile() {
      return this.$store.state.isDecodingFile;
    },
    decodeRecords() {
      if (
        this.selectedUseCase !== "dl" &&
        this.scanner &&
        this.scanner.decodeRecords
      ) {
        return this.scanner.decodeRecords;
      } else {
        return {};
      }
    },
    selectedUseCase() {
      return this.$store.state.selectedUseCase;
    },
    selectedBarcodes() {
      return this.$store.getters.selectedBarcodes;
    },
    // scan modes part
    singleOrMul() {
      return this.$store.state.singleOrMul;
    },
    scanMode() {
      return this.$store.state.scanMode;
    },
    invertColourOn() {
      return this.$store.state.invertColourOn;
    },
    soundEffectsOn() {
      return this.$store.state.soundEffectsOn;
    },
    isFullImageLocalization() {
      return this.$store.state.isFullImageLocalization;
    },
    regionMaskEdgeLength() {
      let regionMaskEdgeLength =
        this.regionScale *
        Math.min(this.clientWidth, this.clientHeight);
      return Math.floor(regionMaskEdgeLength);
    },
    regionLeft() {
      let left =
        (this.clientWidth - this.regionMaskEdgeLength) /
        2 /
        this.clientWidth;
      if (this.selectedUseCase === "vin" || this.selectedUseCase === "dl") {
        if (this.clientWidth > this.clientHeight) {
          return Math.round(left * 100) - 25;
        } else {
          return Math.round(left * 100) - 20;
        }
      } else {
        return Math.round(left * 100);
      }
    },
    regionTop() {
      let top =
        (this.clientHeight - this.regionMaskEdgeLength) /
        2 /
        this.clientHeight;
      if (this.selectedUseCase === "vin") {
        if (this.clientWidth > this.clientHeight) {
          return Math.round(top * 100) + 5;
        } else {
          return Math.round(top * 100) + 5;
        }
      } else if (this.selectedUseCase === "dl") {
        if (this.clientWidth > this.clientHeight) {
          return Math.round(top * 100) - 5;
        } else {
          return Math.round(top * 100) - 5;
        }
      } else {
        return Math.round(top * 100);
      }
    },
    region() {
      let region = {
        regionLeft: this.regionLeft,
        regionRight: 100 - this.regionLeft,
        regionTop: this.regionTop,
        regionBottom: 100 - this.regionTop,
        regionMeasuredByPercentage: 1,
      };
      return region;
    },
    torchContainerStyle() {
      let left = this.regionLeft;
      let right = left;
      let top = this.regionTop;
      let bottom = this.regionTop;
      let style = {
        left: left + "%",
        right: right + "%",
        top: top + "%",
        bottom: bottom + "%",
      };
      return style;
    },
  },
  watch: {
    currentResolution(newValue, oldValue) {
      if (oldValue.length !== 0) {
        this.endResolutionTime = Date.now();
        if (oldValue.includes(720)) {
          this.resolutionUsedTime["HD"] +=
            this.endResolutionTime - this.startResolutionTime;
        } else if (oldValue.includes(1080)) {
          this.resolutionUsedTime["FULL_HD"] +=
            this.endResolutionTime - this.startResolutionTime;
        }
        this.startResolutionTime = Date.now();
      }
      console.log(newValue);
    },
    isDLResultShow(newValue) {
      if (!newValue) {
        this.dlText = "";
      }
    },
    async isDecodingFile(newValue) {
      if (this.scanner && newValue) {
        this.scanner.pauseScan();
      } else if (this.scanner && !newValue) {
        await this.scanner.resumeScan();
      }
    },
    soundEffectsOn(newValue) {
      this.soundEffectsIconPath = newValue ? checkedMusicIcon : musicIcon;
    },
    async selectedUseCase(newUseCase, oldUseCase) {
      if (oldUseCase !== "") {
        this.endUseCaseTime = Date.now();
        switch (oldUseCase) {
          case "general":
            this.useCaseTime["general"] +=
              this.endUseCaseTime - this.startUseCaseTime;
            break;
          case "vin":
            this.useCaseTime["vin"] +=
              this.endUseCaseTime - this.startUseCaseTime;
            break;
          case "dl":
            this.useCaseTime["dl"] +=
              this.endUseCaseTime - this.startUseCaseTime;
            break;
          case "dpm":
            this.useCaseTime["dpm"] +=
              this.endUseCaseTime - this.startUseCaseTime;
            break;
          default:
            break;
        }
        this.startUseCaseTime = Date.now();
      }
      if (newUseCase === "dl") {
        this.isShowTipImg = true;
        setTimeout(() => {
          this.isShowTipImg = false;
        }, 5000);
      }
      if (
        (newUseCase === "vin" || newUseCase === "dl") &&
        !this.currentResolution.includes(1080)
      ) {
        this.isLoadingCamera = true;
        await this.scanner.setResolution(this.resolutionList[1]);
        this.currentResolution = this.scanner.getResolution();
        this.isLoadingCamera = false;
      }
      if (
        (DBR.BarcodeScanner.browserInfo.OS === "Android" ||
          DBR.BarcodeScanner.browserInfo.OS === "iPhone") &&
        (newUseCase === "vin" || newUseCase === "dl") &&
        (window.orientation === 0 || window.orientation === 180)
      ) {
        let config = {};
        config.duration = 2;
        config.content = "Rotate your device.";
        config.icon = (
          <a-icon type="mobile" spin style={{ color: "#FE8E14" }}></a-icon>
        );
        this.$message.open(config);
      }
    },
  },
});
</script>

<style scoped>
.barcodeScanner {
  position: absolute;
  width: 100%;
  height: 100%;
  min-width: 100px;
  min-height: 100px;
  background: #d1d1d1;
}
.copyright {
  color: white;
  font-size: 12px;
  font-family: "Oswald-Light";
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  user-select: none;
}
.loadingImg {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
.loadingCameraImg {
  width: 100%;
  height: 100%;
  background: #ddd;
  position: absolute;
}
.cameraAndSoundsContainer {
  position: absolute;
  display: flex;
  flex-direction: row;
  align-items: center;
  top: 0;
  left: 0;
  cursor: pointer;
  z-index: 10;
  user-select: none;
}
.cameraAndSoundsContainer .cameraDropdown {
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  height: 100%;
  color: rgba(170, 170, 170);
  background-color: rgba(34, 34, 34);
}
.cameraDropdown .cameraIconContainer {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding-top: 5px;
  padding-right: 13px;
  height: 100%;
}
.cameraIconContainer label {
  font-size: 12px;
}
.cameraDropdown .cameraInfo {
  word-break: break-all;
}
.cameraAndSoundsContainer .soundEffects {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}
.curUseCaseTip {
  position: absolute;
  left: 50%;
  color: #fff;
  text-align: center;
  transform: translateX(-50%);
  z-index: 15;
  user-select: none;
}
.resultContainer {
  position: absolute;
  left: 50%;
  margin-bottom: 5px;
  max-height: 30%;
  font-family: "OpenSans-Regular";
  text-align: center;
  transform: translateX(-50%);
  overflow: auto;
  z-index: 20;
}
.resultContainer .result {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: 1px;
  padding: 5px 0;
  color: #dddddd;
  background-color: rgba(34, 34, 34, 0.42);
  border-left: none;
  border-right: none;
}
.result .barcodeFormat {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 25%;
  text-align: left;
  word-break: break-all;
}
.result .resultMain {
  display: flex;
  flex-direction: row;
  align-items: center;
  max-width: 60%;
  flex: 1 1 auto;
}
.result .resultMain .resultText {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  cursor: pointer;
}
.result .resultMain .copyBtn {
  color: #fe8e14;
  cursor: pointer;
}
.result .counter {
  width: 15%;
  border-left: none;
  border-right: none;
}
.dlResultContainer {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 85%;
  max-height: 70%;
  padding: 20px;
  color: #dddddd;
  background-color: rgba(34, 34, 34, 0.5);
  padding: 17px 25px 12px;
  transform: translate(-50%, -50%);
  overflow: auto;
  z-index: 20;
}
.dlResultContainer .dlInfo li {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
  padding-bottom: 2px;
}
.dlResultContainer .dlInfo li .description {
  width: 55%;
  color: #cccccc;
}
.dlResultContainer .dlInfo li .value {
  width: 40%;
  color: white;
}
.dlResultContainer .footer {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-top: 12px;
  color: #fe8e14;
  font-size: 16px;
}
.dlResultContainer .footer .copyBtn,
.dlResultContainer .footer .closeBtn {
  cursor: pointer;
}
.scanArea {
  width: 100%;
  height: 50%;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  user-select: none;
}
.scanLight {
  position: absolute;
  width: 100%;
  height: 3px;
  animation: 3s infinite dbrScanner-scanlight;
  border-radius: 50%;
  box-shadow: 0px 0px 2vw 1px #fe8e14;
  background: #fe8e14;
  user-select: none;
}
.torchContainer {
  position: absolute;
  user-select: none;
  transform: translateY(35px);
}
.driverLicenseTip {
  display: flex;
  position: absolute;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  left: 50%;
  font-family: "OpenSans-Regular";
  color: #fff;
  transform: translateX(-50%);
  user-select: none;
}

.cameraList {
  position: absolute;
  left: 0;
  background-color: rgba(34, 34, 34);
  z-index: 20;
}
.cameraList li .cameraOption {
  padding: 5px 12px;
  cursor: pointer;
  user-select: none;
}
@media (hover: hover) {
  .cameraList li:hover {
    background-color: rgba(50, 50, 52);
  }
}
.cameraList .selected {
  background-color: black !important;
}
@keyframes dbrScanner-rotate {
  from {
    transform: rotate(0turn);
  }

  to {
    transform: rotate(1turn);
  }
}

@keyframes dbrScanner-scanlight {
  from {
    top: 0;
  }

  to {
    top: 97%;
  }
}
@media (min-width: 981px),
  screen and (max-width: 980px) and (orientation: landscape) {
  .copyright {
    display: none;
  }
  .cameraAndSoundsContainer {
    height: 7.6%;
  }
  .cameraDropdown {
    padding-left: 43px;
  }
  .cameraDropdown .cameraIconContainer {
    margin-top: 0;
  }
  .cameraDropdown .cameraIconContainer svg {
    height: 42.2%;
  }
  .cameraDropdown .cameraIconContainer label {
    display: none;
  }
  .cameraDropdown .cameraInfo {
    margin-left: 14px;
    margin-right: 30px;
    width: 190px;
    font-size: 12px;
  }
  .cameraAndSoundsContainer .soundEffects {
    width: 90px;
  }
  .cameraAndSoundsContainer .soundEffects img {
    height: 50%;
  }
  .curUseCaseTip {
    top: 3.9vh;
    width: calc(100% - 911.6px);
    font-size: 20px;
    transform: translate(-50%, -50%);
  }
  .resultContainer {
    width: 47.7%;
    min-width: 700px;
    bottom: 13%;
    font-size: 20px;
    line-height: 22px;
  }
  .resultContainer .result {
    min-height: 60px;
  }
  .result .barcodeFormat {
    padding-left: 22px;
  }
  .result .resultMain {
    padding-left: 10px;
  }
  .result .resultMain .break {
    padding-left: 10px;
  }
  .result .resultMain .copyBtn {
    padding-left: 10px;
    font-size: 16px;
  }
  .result .counter {
    padding-right: 10px;
    padding-left: 10px;
  }
  .dlResultContainer {
    max-width: 500px;
  }
  .scanArea {
    width: 41.9%;
  }
  .driverLicenseTip .tipText {
    margin-bottom: 10px;
    font-size: 14px;
  }
  .loadingImg {
    font-size: 60px;
  }
  .cameraList {
    top: 7.6vh;
    font-size: 16px;
  }
}
@media screen and (max-width: 980px) and (orientation: landscape) {
  .copyright {
    display: block;
    font-size: 12px;
    bottom: 18%;
  }
  .cameraAndSoundsContainer {
    height: 10vh;
  }
  .cameraDropdown {
    padding-left: 10px;
  }
  .cameraDropdown .cameraIconContainer {
    margin-top: 5px;
  }
  .cameraDropdown .cameraIconContainer svg {
    height: auto;
  }
  .cameraDropdown .cameraIconContainer label {
    display: block;
  }
  .cameraDropdown .cameraInfo {
    display: none;
  }
  .cameraAndSoundsContainer .soundEffects {
    width: 60px;
  }
  .cameraAndSoundsContainer .soundEffects img {
    height: 50%;
  }
  .curUseCaseTip {
    top: 12vh;
    width: auto;
    font-size: 14px;
    transform: translateX(-50%);
  }
  .resultContainer {
    width: 73.9%;
    bottom: 22%;
    font-size: 12px;
  }
  .dlResultContainer {
    max-width: 70%;
    max-height: 60%;
  }
  .result .barcodeFormat {
    padding-left: 5px;
  }
  .result .resultMain {
    padding-left: 5px;
  }
  .result .resultMain .break {
    padding-left: 5px;
  }
  .result .resultMain .copyBtn {
    padding-left: 5px;
  }
  .result .counter {
    padding-right: 10px;
    padding-left: 10px;
  }
  .scanArea {
    width: 41.9%;
  }
  .driverLicenseTip .tipText {
    margin-bottom: 10px;
    font-size: 14px;
    transform: scale(0.7);
  }
  .loadingImg {
    font-size: 30px;
  }
  .cameraList {
    top: 10vh;
    font-size: 14px;
  }
}

/* mobile */
@media screen and (max-width: 980px) and (orientation: portrait) {
  .copyright {
    bottom: 11.7vh;
  }
  .cameraAndSoundsContainer {
    height: 6.9vh;
  }
  .cameraAndSoundsContainer .cameraDropdown {
    width: 76px;
  }
  .cameraDropdown .cameraInfo {
    display: none;
  }
  .curUseCaseTip {
    top: 8.5vh;
    font-size: 14px;
  }
  .resultContainer {
    width: 73.9%;
    bottom: 17.1%;
    font-size: 12px;
  }
  .result .barcodeFormat {
    padding-left: 5px;
  }
  .result .resultMain {
    padding-left: 5px;
  }
  .result .resultMain .break {
    padding-left: 5px;
  }
  .result .resultMain .copyBtn {
    padding-left: 5px;
  }
  .result .counter {
    padding-right: 5px;
    padding-left: 5px;
  }
  .driverLicenseTip .tipText {
    margin-bottom: 10px;
    font-size: 14px;
    transform: scale(0.7);
  }
  .loadingImg {
    font-size: 30px;
  }
  .cameraList {
    top: 6.9vh;
    font-size: 14px;
  }
  .cameraAndSoundsContainer .soundEffects {
    width: 60px;
  }
  .scanArea {
    width: 100%;
  }
}
</style>
