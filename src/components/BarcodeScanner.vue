<template>
  <div>
    <div :class="{mask: true, maskHidden: isShowMask}"></div>
    <home />
    <sidebar :isUploadImage="isUploadImage" @getImages="getImages" />
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
        <div
          class="dce-video-container"
          style="position: absolute; left: 0; top: 0; width: 100%; height: 100%"
        ></div>
        <div
          ref="scanArea"
          class="dce-scanarea"
          style="position: absolute; left: 0; top: 0; width: 100%; height: 100%"
        >
          <div
            class="dce-scanlight"
            style="
              display: none;
              position: absolute;
              width: 100%;
              height: 3px;
              border-radius: 50%;
              box-shadow: 0px 0px 2vw 1px #fe8e14;
              background: #fe8e14;
              animation: 3s infinite dce-scanlight;
              user-select: none;
            "
          ></div>
        </div>
        <div class="copyright"><span>Powered by Dynamsoft</span></div>
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
        <div class="localImages">
          <from-image
            ref="fromimage"
            @showResults="showResults"
            :selectedUseCase="selectedUseCase"
            @clearResultsCvs="clearResultsCvs"
            @clearResultList="clearResultList"
            @removeDLResults="removeDLResults"
          />
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
          <img :src="soundEffectsIconPath" :class="{ musicSelected: soundEffectsOn, musicUnSelected: !soundEffectsOn }"/>
        </div>
      </div>
      <div class="curUseCaseTip">
        {{ this.curUseCase }}
      </div>
      <ul
        class="resultContainer"
        v-show="selectedUseCase !== 'dl' && !isUploadImage"
      >
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
              {{
                name.slice(0, name.indexOf("_dbrkey_")) ===
                  "PHARMACODE_ONE_TRACK" ||
                name.slice(0, name.indexOf("_dbrkey_")) === "PHARMACODE_TWO_TRACK"
                  ? pharmacodeResult
                  : name.slice(name.indexOf("_dbrkey_") + 8)
              }}
            </div>
            <div class="break">-</div>
            <div class="copyBtn" @click="copyResult('.result')">Copy</div>
          </div>
          <div class="counter">
            {{ value + "x" }}
          </div>
        </li>
      </ul>
      <div class="dlResultContainer" v-show="isDLResultShow && !isUploadImage">
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
        class="torchContainer"
        :style="torchContainerStyle"
        v-show="!isResizing && !isUploadImage"
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
        <svg class="dbrScanner-bg-loading" viewBox="0 0 1792 1792">
          <path
            d="M1760 896q0 176-68.5 336t-184 275.5-275.5 184-336 68.5-336-68.5-275.5-184-184-275.5-68.5-336q0-213 97-398.5t265-305.5 374-151v228q-221 45-366.5 221t-145.5 406q0 130 51 248.5t136.5 204 204 136.5 248.5 51 248.5-51 204-136.5 136.5-204 51-248.5q0-230-145.5-406t-366.5-221v-228q206 31 374 151t265 305.5 97 398.5z"
          />
        </svg>
        <div></div>
      </div>
      <div class="qrcode" v-show="!ifHasCamera">
        <div>
          <h2 style="margin-bottom: 50px">
            <a-icon type="warning" style="margin-right: 10px" />No camera detected
          </h2>
          <p class="scan-on-phone">Scan the QR code and try the demo on your phone</p>
          <div id="qrcode" ref="qrcode" style="margin-bottom: 50px"></div>
          <div>
            <p @click="triggerUploadImg" style="font-size: 18px" class="web-upload">OR Upload from local</p>
          </div>
          <button style="display: none" @click="triggerUploadImg">
            UPLOAD IMAGE FROM LOCAL
          </button>
        </div>
      </div>
      <div class="decodeRes" v-show="isUploadImage">
        <div class="resContainer">
          <div class="imgContainer" ref="imgContainer">
            <div class="resultsPanel" ref="resultsPanel"></div>
          </div>
          <div class="resList">
            <p style="font-size: 24px; margin-bottom: 15px">Results:</p>
            <ul v-for="(item, index) in results" :key="index">
              <li v-for="(result, i) in item.results" :key="i">
                <ul class="dlInfo" v-if="selectedUseCase === 'dl' && result.json">
                  {{
                    result.barcodeFormat + ": "
                  }}
                  <li
                    v-for="(info, infoIndex) in getDLInfo(result.json)"
                    :key="infoIndex"
                  >
                    <span class="description"> {{ info.description }}: </span>
                    <span class="value">{{ info.value }}</span>
                  </li>
                </ul>
                <template v-else>
                  {{ result.barcodeFormat + ": " + result.text }}
                </template>
                <a
                  href="javascript:void(0)"
                  v-show="!isCopied[i]"
                  @click="
                    copyResText(
                      selectedUseCase === 'dl'
                        ? copiedDLInfo(getDLInfo(result.json))
                        : result.text,
                      i
                    )
                  "
                >
                  Copy
                </a>
                <a
                  href="javascript:void(0)"
                  v-show="isCopied[i]"
                  class="orangeFont"
                  @click="
                    copyResText(
                      selectedUseCase === 'dl'
                        ? copiedDLInfo(getDLInfo(result.json))
                        : result.text,
                      i
                    )
                  "
                >
                  Copied
                </a>
              </li>
            </ul>
          </div>
          <div class="restartVideo">
            <button @click="hideResults">RESTART VIDEO</button>
            <a href="javascript:void(0)" @click="triggerUploadImg"
              >Upload Image from local</a
            >
          </div>
        </div>
      </div>
      <ul class="cameraList" v-show="isShowCameraList">
        <!-- <li>
          <from-image />
        </li> -->
        <li
          v-for="(item, index) in cameraAndResolutionList"
          :key="index"
          @click="onChangeCameraAndResolution(item)"
          :class="{
            selected:
              currentCamera &&
              item[0].deviceId == currentCamera.deviceId &&
              item[1] === judgeCurResolution(),
          }"
        >
          <div
            class="cameraOption"
            :style="{
              color:
                currentCamera &&
                item[0].deviceId == currentCamera.deviceId &&
                item[1] === judgeCurResolution()
                  ? '#fe8e14'
                  : '#aaaaaa',
            }"
          >
            {{ item[0].label }}({{ item[1] }})
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import {BarcodeScanner,EnumGrayscaleTransformationMode,EnumDPMCodeReadingMode,EnumLocalizationMode} from "dynamsoft-javascript-barcode";
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { CodeParser } from "dynamsoft-code-parser";
import musicIcon from "../assets/image/music-unselected.svg";
import checkedMusicIcon from "../assets/image/Music-selected.svg";
import BarcodeFormatMap from "../assets/enum/BarcodeFormatMap.js";
import BarcodeFormatMap_2 from "../assets/enum/BarcodeFormatMap_2.js";
// import DriverLicenseFields from "../assets/enum/DriverLicenseFields.js";
import CodeParserFields from "../assets/enum/CodeParserFields";
import FromImage from "./FromImage.vue";
import Home from "./Home.vue";
import Sidebar from "./Sidebar.vue";
import Clipboard from "clipboard";
// generate qr code
import QRCode from "qrcodejs2";

export default Vue.extend({
  name: "BarcodeScanner",
  components: {
    FromImage,
    Home,
    Sidebar,
  },
  data() {
    return {
      soundEffectsIconPath: checkedMusicIcon,
      scanner: null,
      parser: null,
      isDestroyed: false,
      resultsInfo: [],
      resolutionList: ["HD", "FULL HD"],
      currentResolution: [],
      cameraList: [],
      currentCamera: null,
      cameraAndResolutionList: [],
      regionScale: 0.4,
      clientWidth: 0,
      clientHeight: 0,
      visibleRegionInPixels: null,
      maskCanvas: null,
      isShowTorchIcon: false,
      flashlightOn: false,
      isShowCameraList: false,
      dlText: "",
      changeClientTimeoutId: null,
      changeRuntimeSettingsTimeoutId: null,
      isResizing: true,
      ifHasCamera: true,
      isShowTipImg: true,
      isShowLoadingImg: true,
      isLoadingCamera: false,
      ifSaveImages: false,
      saveImagesCount: 0,
      results: [],
      curImg: null,
      isCopied: [],
      isUploadImage: false,
      pharmacodeResult: [],
      oriRes: [],
      downloadImg: [],
      isShowMask: false,
      dbrTemplate: ""
    };
  },

  async mounted() {
    let splitArr = location.pathname.split("/");
    let useCaseName = splitArr[splitArr.length - 1];
    this.$store.commit("startScanning", useCaseName.substring(0, useCaseName.indexOf(".")));
    this.clientHeight = document.body.clientHeight;
    this.clientWidth = document.body.clientWidth;
    if (
      BarcodeScanner.browserInfo.OS == "Android" ||
      BarcodeScanner.browserInfo.OS == "iPhone"
    ) {
      this.isShowTorchIcon = true;
    } else {
      this.isShowTorchIcon = false;
    }
    window.addEventListener("resize", ()=>{ this.resizeEvent(1000) });
    document.addEventListener("click", this.hideCameraList);
    await this.showScanner();
    if (this.scanner && this.scanner.isOpen()) {
      this.visibleRegionInPixels = this.getVisibleRegion();
    }
    try {
      this.cameraList = await this.scanner.getAllCameras();
      this.currentCamera = await this.scanner.getCurrentCamera();
    } catch (e) {
      let config = {};
      config.content = e.message;
      config.duration = 3;
      this.$message.warning(config);
    }
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
      (BarcodeScanner.browserInfo.OS === "Android" ||
        BarcodeScanner.browserInfo.OS === "iPhone") &&
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
      this.scanner.destroyContext();
    }
  },
  methods: {
    resizeEvent(delay) {
      if (this.isUploadImage) {
        this.drawResults();
        return;
      }
      if(!this.scanner) return;
      if (this.scanner.isOpen() && !this.scanner._bPauseScan) {
        this.scanner.pauseScan();
      }
      this.changeClientTimeoutId && clearTimeout(this.changeClientTimeoutId);
      this.scanner.ifShowScanRegionMask = false;
      this.$refs.scanArea.style.display = "none";
      this.changeClientTimeoutId = setTimeout(async () => {
        this.clientHeight = document.body.clientHeight;
        this.clientWidth = document.body.clientWidth;
        if (this.scanner && this.scanner.isOpen()) {
          this.currentResolution = this.scanner.getResolution();
          this.visibleRegionInPixels = this.getVisibleRegion();
          if(this.dlText.length === 0) {
            this.scanner.resumeScan();
          }
        }
        this.scanner.ifShowScanRegionMask = true;
        this.$refs.scanArea.style.display = "";
      }, delay);
      if(document.body.clientWidth > 980 && this.bDebug) {
        this.$refs.webScreenshot.style.display = "";
        this.$refs.screenshot.style.display = "none";
      } else if(document.body.clientWidth <= 980 && this.bDebug) {
        this.$refs.webScreenshot.style.display = "none";
        this.$refs.screenshot.style.display = "";
      }
    },
    closeDLResult() {
      this.dlText = "";
      this.scanner.resumeScan();
    },
    getDLInfo(txt) {
      let dlInfo = [];
      if (!txt) {
        return dlInfo;
      }
      const json = JSON.parse(txt);
      let originaInfo = {};
      if (json.resultInfo && json.resultInfo.AAMVADLInfo) {
        originaInfo = {
          ...json.basicPersonalInfo,
          ...json.resultInfo,
          ...json.resultInfo.AAMVADLInfo,
        };
        Reflect.deleteProperty(originaInfo, "AAMVADLInfo");
      } else {
        originaInfo = { ...json.basicPersonalInfo, ...json.resultInfo };
      }
      let abbrs = Object.keys(originaInfo);
      const dataDictionary = {
        issuedDay: {
          description: "Document Issue Date",
          value: ["issuedDay", "issuedMonth", "issuedYear"],
        },
        birthDay: {
          description: "Date of Birth",
          value: ["birthDay", "birthMonth", "birthYear"],
        },
        expirationDay: {
          description: "Document Expiration Date",
          value: ["expirationDay", "expirationMonth", "expirationYear"],
        },
      };
      abbrs.forEach((abbr) => {
        if (originaInfo[abbr]) {
          if (abbr in CodeParserFields) {
            dlInfo.push({
              description: CodeParserFields[abbr],
              value: originaInfo[abbr],
            });
          } else if (abbr in dataDictionary) {
            const value =
              this.toTwoDigit(originaInfo[dataDictionary[abbr].value[0]]) +
              "/" +
              this.toTwoDigit(originaInfo[dataDictionary[abbr].value[1]]) +
              "/" +
              originaInfo[dataDictionary[abbr].value[2]];
            dlInfo.push({
              description: dataDictionary[abbr].description,
              value,
            });
          }
        }
      });
      return dlInfo;
    },
    async getImages() {
      if(this.isUploadImage) return;
      this.isShowMask = true;
      this.scanner.pauseScan();
      this.$message.loading({content: "Capturing...", duration: 0});
      await this.saveImages();
      const zip = new JSZip();
      for(let i=0;i<this.downloadImg.length;i++) {
        zip.file(this.downloadImg[i].name, this.downloadImg[i].blob);
      }
      const content = await zip.generateAsync({type: "blob"});
      saveAs(content, `screenshot-${this.getDate()}.zip`);
      this.downloadImg = [];
      this.$message.destroy();
      this.isShowMask = false;
      this.scanner.resumeScan();
    },
    async saveImages() {
      return new Promise(async (rs,rj)=>{
        let index = 0;
        while(index < 8) {
          const cvs = this.scanner.dce.getFrame().toCanvas();
          if (cvs != null) {
            const blob = cvs.convertToBlob ? await cvs.convertToBlob() : await new Promise(resolve => {
              cvs.toBlob(blob => resolve(blob));
            });
            this.downloadImg.push({ name: "Screenshot - " + new Date().toISOString().replace(/\:/g, "-") + ".png", blob});
            index++;
          }
        }
        rs();
      })
    },
    getDate() {
      const date = new Date();
      return `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`;
    },
    handleString(str) {
      let strArr = str.split("");
      strArr[0] = strArr[0].toUpperCase();
      str = strArr.join("");
      return str;
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
          for (let i in this.dlInfo) {
            copyContent +=
              this.dlInfo[i].description + ": " + this.dlInfo[i].value + "\n";
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
    async initDcp() {
      this.parser || (this.parser = await CodeParser.createInstance());
    },
    async showScanner() {
      this.isLoadingCamera = true;
      try {
        this.scanner || (this.scanner = await BarcodeScanner.createInstance());
        this.scanner.bPlaySoundOnSuccessfulRead = this.soundEffectsOn;
        // this.scanner.intervalTime = 1000;
        this.scanner.setVideoFit("cover");
        if (this.selectedUseCase === "dl") {
          await this.initDcp();
        }
      } catch (e) {
        let config = {};
        config.content = e.message;
        config.duration = 0;
        this.$message.warning(config);
        return Promise.reject(e.message);
      }
      if (this.isDestroyed) {
        this.scanner.destroyContext();
        return;
      }

      try {
        if (this.scanner) {
          await this.scanner.setUIElement(this.$refs.videoContainer);
          this.scanner.ifSaveOriginalImageInACanvas = true;
          this.scanner.setResolution([1280, 720]);
          if (this.selectedUseCase === "vin" || this.selectedUseCase === "dl") {
            this.scanner.setResolution([1920, 1080]);
          }
          this.scanner.onFrameRead = async (results) => {
            for (let i = 0; i < results.length; i++) {
              let result = results[i];
              if (
                this.selectedUseCase === "dl" &&
                result.barcodeFormatString === "PDF417"
              ) {
                const data = await this.parser.parseData(result.barcodeBytes);
                this.dlText = JSON.stringify(data); // use stringify to avoid render ui everytime
                if(!JSON.parse(this.dlText).exception) {
                  this.scanner.pauseScan();
                }
              } else if (
                result.barcodeFormatString_2 === "PHARMACODE_ONE_TRACK"
              ) {
                if (
                  result.localizationResult.x1 < result.localizationResult.x2
                ) {
                  this.pharmacodeResult = result.barcodeText;
                } else if (
                  result.localizationResult.x1 > result.localizationResult.x2
                ) {
                  this.getPharmacodeResult(result);
                }
              } else if (
                result.barcodeFormatString_2 === "PHARMACODE_TWO_TRACK"
              ) {
                this.getPharmacodeResult(result);
              }
            }
          };
          let callBackInfo = await this.scanner.open();
          this.$store.state.currentResolution[0] = callBackInfo.width;
          this.$store.state.currentResolution[1] = callBackInfo.height;
          this.currentResolution = [callBackInfo.width, callBackInfo.height];
          this.isLoadingCamera = false;
          this.isResizing = false;
        }
      } catch (e) {
        let config = {};
        // config.content = `Unable to connect to the camera, make sure it is not used by other apps and try again. Alternatively, you can click "From Image" in the "Camera" drop-down list to read barcodes from an existing image.`;
        config.content = `Unable to connect to the camera, make sure it is not used by other apps and try again. Alternatively, you can read barcodes by uploading local images`;
        config.duration = 3;
        // show qrcode if no camera
        this.ifHasCamera = false;
        this.generateQRcode();
        this.$message.warning(config);

        return Promise.reject(e.message);
      }
    },

    getPharmacodeResult(result) {
      for (let i = 0; i < 2; i++) {
        let res = "";
        for (let j = 0; j < result.results[i].bytes.length; j++) {
          res += String.fromCharCode(result.results[i].bytes[j]);
        }
        if (res !== result.barcodeText) {
          this.pharmacodeResult = res;
          break;
        }
      }
    },

    async onChangeCameraAndResolution(item) {
      let config = {};
      this.isLoadingCamera = true;
      let resulution = item[1] === "HD" ? [1280, 720] : [1920, 1080];
      await this.scanner.setCurrentCamera(item[0].deviceId);
      await this.scanner.setResolution(resulution);
      this.currentResolution = this.scanner.getResolution();
      this.currentCamera = await this.scanner.getCurrentCamera();
      if (this.currentCamera.deviceId !== item[0].deviceId) {
        config.icon = (
          <a-icon type="frown" style={{ color: "#FE8E14" }}></a-icon>
        );
        config.content = "Switch camera failed!";
      } else if (this.judgeCurResolution() !== item[1]) {
        config.icon = <a-icon type="meh" style={{ color: "#FE8E14" }}></a-icon>;
        config.content =
          "Switch resolution failed. " +
          item[1] +
          " might be unsupported in the camera.";
      } else {
        config.icon = (
          <a-icon type="smile" style={{ color: "#FE8E14" }}></a-icon>
        );
        config.content = "Switched to " + this.cameraInfo + " successfully!";
        this.$store.state.currentResolution = this.scanner.dce.getResolution();
      }
      this.$message.open(config);
      this.$store.state.isShowSettings = false;
      this.isLoadingCamera = false;
    },

    //qrcode
    generateQRcode() {
      // eslint-disable-next-line no-unused-vars
      var qrcode = new QRCode(this.$refs.qrcode, {
        width: 160,
        height: 160,
        text: window.location.href,
        colorDark: "#000000",
        colorLight: "#ffffff",
        correctLevel: QRCode.CorrectLevel.H,
      });
    },

    // trigger upload images from local files
    triggerUploadImg() {
      this.$refs.fromimage.trigger();
    },

    clearResultsCvs() {
      this.$refs.resultsPanel.innerHTML = "";
    },

    clearResultList() {
      this.results = [];
      this.curImg = null;
    },

    // show decode results
    async showResults(results, image, oriRes) {
      this.$refs.imgContainer.appendChild(image);
      this.$refs.scanArea.style.display = "none";
      this.isCopied = [];
      this.isUploadImage = true;
      this.results = results;
      this.curImg = image;
      this.oriRes = oriRes;
      await this.scanner.close();
      Vue.nextTick(() => {
        this.drawResults();
      });
    },

    drawResults() {
      if (!this.curImg) return;
      this.clearResultsCvs();
      let widthZoom;
      let heightZoom;
      let oriWidth = this.curImg.width;
      let oriHeight = this.curImg.height;
      let oriWHRatio = oriWidth / oriHeight;
      let imgWidth = parseInt(getComputedStyle(this.curImg).width);
      let imgHeight = parseInt(getComputedStyle(this.curImg).height);
      let imgWHRatio = imgWidth / imgHeight;
      for (let i = 0; i < this.oriRes.length; i++) {
        let cvs = document.createElement("canvas");
        let ctx = cvs.getContext("2d");
        ctx.globalCompositeOperation = "destination-over";
        let loc = this.oriRes[i].localizationResult;
        let locXArr = [loc.x1, loc.x2, loc.x3, loc.x4];
        let locYArr = [loc.y1, loc.y2, loc.y3, loc.y4];
        let maxX = Math.max(loc.x1, loc.x2, loc.x3, loc.x4);
        let minX = Math.min(loc.x1, loc.x2, loc.x3, loc.x4);
        let maxY = Math.max(loc.y1, loc.y2, loc.y3, loc.y4);
        let minY = Math.min(loc.y1, loc.y2, loc.y3, loc.y4);
        let minXToY = locYArr[locXArr.indexOf(minX)];
        let minYToX = locXArr[locYArr.indexOf(minY)];
        let maxXToY = locYArr[locXArr.indexOf(maxX)];
        let maxYToX = locXArr[locYArr.indexOf(maxY)];

        if (oriWHRatio > imgWHRatio) {
          widthZoom = imgWidth / oriWidth;
          heightZoom = imgWidth / oriWHRatio / oriHeight;
          cvs.style.top =
            minY * heightZoom +
            (imgHeight - imgWidth / oriWHRatio) * 0.5 +
            "px";
          cvs.style.left = minX * widthZoom + "px";
          cvs.width = (maxX - minX) * widthZoom;
          cvs.height = (maxY - minY) * widthZoom;
          cvs.style.width = (maxX - minX) * widthZoom + "px";
          cvs.style.height = (maxY - minY) * widthZoom + "px";
        } else {
          heightZoom = imgHeight / oriHeight;
          widthZoom = (imgHeight * oriWHRatio) / oriWidth;
          cvs.style.top = minY * heightZoom + "px";
          cvs.style.left =
            minX * widthZoom + (imgWidth - imgHeight * oriWHRatio) * 0.5 + "px";
          cvs.width = (maxX - minX) * heightZoom;
          cvs.height = (maxY - minY) * heightZoom;
          cvs.style.width = (maxX - minX) * heightZoom + "px";
          cvs.style.height = (maxY - minY) * heightZoom + "px";
        }
        cvs.style.position = "absolute";
        if (this.oriRes[i].barcodeFormatString === "PatchCode") {
          ctx.fillStyle = "rgba(97, 189, 79, 0.2)";
          cvs.style.zIndex = 1;
        } else {
          ctx.fillStyle = "rgba(97, 189, 79, 0.5)";
          cvs.style.zIndex = 2;
        }
        let allowAngle = [358, 359, 0, 1, 268, 269, 270, 271, 272, 178, 179, 180, 181, 182, 88, 89, 90, 91, 92];
        if (!allowAngle.includes(loc.angle)) {
          ctx.moveTo(0, minXToY * heightZoom - minY * heightZoom);
          ctx.lineTo(minYToX * widthZoom - minX * widthZoom, 0);
          ctx.lineTo(cvs.width, maxXToY * heightZoom - minY * heightZoom);
          ctx.lineTo(maxYToX * widthZoom - minX * widthZoom, cvs.height);
          ctx.fill();
        } else {
          ctx.fillRect(0, 0, cvs.width, cvs.height);
        }
        cvs.title =
          this.oriRes[i].barcodeFormatString +
          " : " +
          this.oriRes[i].barcodeText;
        this.$refs.resultsPanel.appendChild(cvs);
      }
    },

    // hide decode results
    async hideResults() {
      this.isUploadImage = false;
      this.$store.commit("finishDecodingFile");
      this.isLoadingCamera = true;
      await this.scanner.open();
      this.scanner.pauseScan();
      this.isLoadingCamera = false;
      this.resizeEvent(0);
    },

    // copy decoded result
    copyResText(text, index) {
      navigator.clipboard.writeText(text);
      this.$set(this.isCopied, index, true);
    },

    judgeCurResolution() {
      let minValue = Math.min(
        this.currentResolution[0],
        this.currentResolution[1]
      );
      let maxValue = Math.max(
        this.currentResolution[0],
        this.currentResolution[1]
      );
      if (
        minValue > 480 &&
        minValue < 960 &&
        maxValue > 960 &&
        maxValue < 1440
      ) {
        return "HD";
      } else if (
        minValue > 900 &&
        minValue < 1440 &&
        maxValue > 1400 &&
        maxValue < 2160
      ) {
        return "FULL HD";
      }
    },

    // get visible region
    getVisibleRegion() {
      if (!this.scanner.isOpen()) return;
      let width, height;
      width = this.scanner.video.videoWidth;
      height = this.scanner.video.videoHeight;
      const getVisibleRegionInPixels = () => {
        const videoCSSWidth = parseFloat(
            window.getComputedStyle(this.scanner.video).width
          ),
          videoCSSHeight = parseFloat(
            window.getComputedStyle(this.scanner.video).height
          );
        const videoCSSRatio = videoCSSWidth / videoCSSHeight,
          videoRatio = width / height;
        let resizedRatio;
        let regionInPixels = {
          regionBottom: height,
          regionRight: width,
          regionLeft: 0,
          regionTop: 0,
          regionMeasuredByPercentage: false,
        };
        if (videoCSSRatio < videoRatio) {
          // a part of length is invisible
          resizedRatio = height / videoCSSHeight;
          regionInPixels.regionLeft = Math.floor(
            (width - resizedRatio * videoCSSWidth) / 2
          );
          regionInPixels.regionRight = Math.ceil(
            width - regionInPixels.regionLeft
          );
          regionInPixels.regionTop = 0;
          regionInPixels.regionBottom = height;
        } else {
          // a part of height is invisible
          resizedRatio = width / videoCSSWidth;
          regionInPixels.regionTop = Math.floor(
            (height - resizedRatio * videoCSSHeight) / 2
          );
          regionInPixels.regionBottom = Math.ceil(
            height - regionInPixels.regionTop
          );
          regionInPixels.regionLeft = 0;
          regionInPixels.regionRight = width;
        }
        return regionInPixels;
      };
      let visibleRegion = getVisibleRegionInPixels();
      return visibleRegion;
    },

    removeDLResults() {
      this.dlText = "";
    },

    // change runtimeSettings
    changeSettings() {
      if(this.isUploadImage) return null;
      if (!this.scanner) return null;
      if (!this.scanner.isOpen()) return null;
      this.$store.state.isShowSettings = false;
      this.isShowLoadingImg = true;
      if(!this.scanner._bPauseScan) {
        this.scanner.pauseScan();
      }
      this.$refs.scanArea.style.display = "none";
      this.scanner.ifShowScanRegionMask = false;
      let runtimeSettings = null;
      this.changeRuntimeSettingsTimeoutId &&
        clearTimeout(this.changeRuntimeSettingsTimeoutId);
      this.changeRuntimeSettingsTimeoutId = setTimeout(async () => {
        // scan mode
        if (this.scanMode === "bestSpeed") {
          await this.scanner.updateRuntimeSettings("speed");
        } else if (this.scanMode === "balance") {
          await this.scanner.updateRuntimeSettings("balance");
        } else if (this.scanMode === "bestCoverage") {
          await this.scanner.updateRuntimeSettings("coverage");
        }
        runtimeSettings = await this.scanner.getRuntimeSettings();
        // colour invert
        runtimeSettings.furtherModes.grayscaleTransformationModes = [
          this.invertColourOn
            ? EnumGrayscaleTransformationMode.GTM_INVERTED
            : EnumGrayscaleTransformationMode.GTM_ORIGINAL,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
        ];

        // set scan region
        if (this.isFullImageLocalization) {
          runtimeSettings.region = {
            regionLeft: 0,
            regionRight: 100,
            regionTop: 0,
            regionBottom: 100,
            regionMeasuredByPercentage: 1,
          };
        } else {
          this.$refs.scanArea.style.display = "";
          runtimeSettings.region = this.region;
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
          runtimeSettings.deblurLevel = 9;
          runtimeSettings.minResultConfidence = 0;
        } else if (this.selectedUseCase === "dpm") {
          runtimeSettings.furtherModes.dpmCodeReadingModes[0] =
            EnumDPMCodeReadingMode.DPMCRM_GENERAL;
          let locModes = runtimeSettings.localizationModes;
          for (let i in locModes) {
            if (locModes[i] == EnumLocalizationMode.LM_STATISTICS_MARKS) {
              break;
            }
            if (locModes[i] == 0) {
              locModes[i] = EnumLocalizationMode.LM_STATISTICS_MARKS;
              break;
            }
          }
        }

        // single or multiple
        this.singleOrMul === "single"
          ? (runtimeSettings.expectedBarcodesCount = 1)
          : (runtimeSettings.expectedBarcodesCount = 512);
        await this.scanner.updateRuntimeSettings(runtimeSettings);
        this.isShowTipImg = true;
        setTimeout(() => {
          this.isShowTipImg = false;
        }, 5000);
        this.isShowLoadingImg = false;
        if(this.dlText.length === 0) {
          this.scanner.resumeScan();
        }
        this.scanner.ifShowScanRegionMask = true;
        return runtimeSettings;
      }, 500);
    },
  },
  computed: {
    toTwoDigit() {
      return (num) => (num < 9 ? "0" + num : num);
    },
    driverLicenseTipStyle() {
      if (this.selectedUseCase !== "dl") return { display: "none" };
      if (!this.cssRegionLeft || !this.cssRegionTop) return { display: "none" };
      let width = ((100 - 2 * this.cssRegionLeft) / 100) * this.clientWidth;
      let height = ((100 - 2 * this.cssRegionTop) / 100) * this.clientHeight;
      return {
        top: this.cssRegionTop + "%",
        height: height + "px",
        width: width + "px",
      };
    },
    tipImgStyle: {
      get() {
        if (!this.cssRegionTop) return {};
        if (this.selectedUseCase !== "dl") return {};
        if (!this.isShowTipImg) return { display: "none" };
        let height =
          ((100 - 2 * this.cssRegionTop) / 100) * this.clientHeight * 0.278;
        return {
          marginTop: "50%",
          height: height + "px",
        };
      },
      set(newValue) {
        return newValue;
      },
    },
    cameraInfo() {
      const minValue = Math.min(
        this.currentResolution[0],
        this.currentResolution[1]
      );
      const maxValue = Math.max(
        this.currentResolution[0],
        this.currentResolution[1]
      );
      if (this.currentCamera) {
        return (
          this.currentCamera.label +
          " " +
          (minValue > 480 && minValue < 960 && maxValue > 960 && maxValue < 1440
            ? "HD"
            : "FULL HD")
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
      return (data) => {
        let copiedDLInfo = "";
        for (let i in data) {
          copiedDLInfo += data[i].description + ": " + data[i].value + "\n";
        }
        return copiedDLInfo;
      };
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
      // if(this.$store.state.selectedUseCase === "dl"){
      //   this.initDcp();
      // }

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
    regionEdgeLength() {
      if (!this.visibleRegionInPixels) return 0;
      if (!this.scanner || !this.scanner.isOpen()) return 0;
      const visibleRegionWidth =
        this.visibleRegionInPixels.regionRight -
        this.visibleRegionInPixels.regionLeft;
      const visibleRegionHeight =
        this.visibleRegionInPixels.regionBottom -
        this.visibleRegionInPixels.regionTop;
      let regionEdgeLength =
        this.regionScale * Math.min(visibleRegionWidth, visibleRegionHeight);
      return Math.round(regionEdgeLength);
    },
    regionLeft() {
      if (!this.visibleRegionInPixels) return 0;
      if (
        !this.scanner ||
        !this.scanner.isOpen() ||
        this.currentResolution.length != 2
      )
        return 0;
      const vw = this.currentResolution[0];
      const visibleRegionWidth =
        this.visibleRegionInPixels.regionRight -
        this.visibleRegionInPixels.regionLeft;
      let left = 0.5 - this.regionEdgeLength / vw / 2;
      if (this.selectedUseCase === "vin" || this.selectedUseCase === "dl") {
        if (this.clientWidth > this.clientHeight) {
          left = Math.round((left - (0.25 * visibleRegionWidth) / vw) * 100);
        } else {
          left = Math.round((left - (0.2 * visibleRegionWidth) / vw) * 100);
        }
      } else if (this.selectedUseCase === "general") {
        if (this.clientWidth > this.clientHeight) {
          left = Math.round((left - (0.1 * visibleRegionWidth) / vw) * 100);
        } else {
          left = Math.round((left - (0.2 * visibleRegionWidth) / vw) * 100);
        }
      } else {
        left = Math.round(left * 100);
      }
      left = left < 0 || left >= 50 ? 0 : left;
      return left;
    },
    regionTop() {
      if (!this.visibleRegionInPixels) return 0;
      if (
        !this.scanner ||
        !this.scanner.isOpen() ||
        this.currentResolution.length != 2
      )
        return 0;
      const vh = this.currentResolution[1];
      const visibleRegionHeight =
        this.visibleRegionInPixels.regionBottom -
        this.visibleRegionInPixels.regionTop;
      let top = 0.5 - this.regionEdgeLength / vh / 2;
      if (this.selectedUseCase === "vin") {
        if (this.clientWidth > this.clientHeight) {
          top = Math.round((top + (0.05 * visibleRegionHeight) / vh) * 100);
        } else {
          top = Math.round((top + (0.05 * visibleRegionHeight) / vh) * 100);
        }
      } else if (this.selectedUseCase === "dl") {
        if (this.clientWidth > this.clientHeight) {
          top = Math.round((top - (0.05 * visibleRegionHeight) / vh) * 100);
        } else {
          top = Math.round((top - (0.05 * visibleRegionHeight) / vh) * 100);
        }
      } else if (this.selectedUseCase === "general") {
        if (this.clientWidth > this.clientHeight) {
          top = Math.round((top - (0.1 * visibleRegionHeight) / vh) * 100);
        } else {
          top = Math.round((top - (0.1 * visibleRegionHeight) / vh) * 100);
        }
      } else {
        top = Math.round(top * 100);
      }
      top = top < 0 || top >= 50 ? 0 : top;
      return top;
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
    cssRegionLeft() {
      if (!this.visibleRegionInPixels) return 0;
      if (
        !this.scanner ||
        !this.scanner.isOpen() ||
        this.currentResolution.length != 2
      )
        return 0;
      const vw = this.currentResolution[0];
      const visibleRegionWidth =
        this.visibleRegionInPixels.regionRight -
        this.visibleRegionInPixels.regionLeft;
      let left =
        ((this.regionLeft / 100) * vw - this.visibleRegionInPixels.regionLeft) /
        visibleRegionWidth;
      left = Math.round(left * 100);
      return left;
    },
    cssRegionTop() {
      if (!this.visibleRegionInPixels) return 0;
      if (
        !this.scanner ||
        !this.scanner.isOpen() ||
        this.currentResolution.length != 2
      )
        return 0;
      const vh = this.currentResolution[1];
      const visibleRegionHeight =
        this.visibleRegionInPixels.regionBottom -
        this.visibleRegionInPixels.regionTop;
      let top =
        ((this.regionTop / 100) * vh - this.visibleRegionInPixels.regionTop) /
        visibleRegionHeight;
      top = Math.round(top * 100);
      return top;
    },
    torchContainerStyle() {
      let left = this.cssRegionLeft;
      let right = left;
      let top = this.cssRegionTop;
      let bottom = top;
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
      this.visibleRegionInPixels = this.getVisibleRegion();
    },
    isDLResultShow(newValue) {
      if (!newValue) {
        this.dlText = "";
      }
    },
    async isDecodingFile(newValue) {
      if (this.scanner && this.scanner.isOpen() && newValue) {
        this.scanner.pauseScan();
      } else if (this.scanner && this.scanner.isOpen() && !newValue) {
        await this.scanner.resumeScan();
      }
    },
    soundEffectsOn(newValue) {
      this.soundEffectsIconPath = newValue ? checkedMusicIcon : musicIcon;
      this.scanner.bPlaySoundOnSuccessfulRead = newValue;
    },
    async selectedUseCase(newUseCase, oldUseCase) {
      if(!this.scanner) return;

      if (
        (newUseCase === "vin" || newUseCase === "dl") &&
        this.judgeCurResolution() !== "FULL HD"
      ) {
        this.isLoadingCamera = true;
        await this.scanner.setResolution([1920, 1080]);
        this.currentResolution = this.scanner.getResolution();

        this.isLoadingCamera = false;
      }
      if (
        (newUseCase === "general" || newUseCase === "dpm") &&
        this.judgeCurResolution() !== "HD"
      ) {
        this.isLoadingCamera = true;
        await this.scanner.setResolution([1280, 720]);
        this.currentResolution = this.scanner.getResolution();

        this.isLoadingCamera = false;
      }
      if (
        (BarcodeScanner.browserInfo.OS === "Android" ||
          BarcodeScanner.browserInfo.OS === "iPhone") &&
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
      if (newUseCase === "dl") {
        await this.initDcp();
      }
    },
    selectedBarcodes() {
      this.changeSettings();
    },
    region() {
      this.changeSettings();
    },
    singleOrMul() {
      this.changeSettings();
    },
    invertColourOn() {
      this.changeSettings();
    },
    scanMode() {
      this.changeSettings();
    },
    isFullImageLocalization() {
      this.changeSettings();
    }
  },
});
</script>

<style scoped>
.orangeFont {
  color: #fe8e14 !important;
}

.mask {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0,0,0,0.3);
  z-index: 20;
  display: none;
}

.maskHidden {
  display: block;
}

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
.qrcode {
  width: 100%;
  height: 100%;
  background: #585757;
  position: absolute;
  color: white;
}

.qrcode p {
  font-size: 24px;
  text-align: center;
}

.qrcode div:first-child {
  height: 400px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  position: absolute;
  top: 42%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.qrcode p:last-child {
  cursor: pointer;
  color: #fe8e14;
}

.qrcode h2:first-child {
  width: 300px;
  height: 55px;
  padding: 10px 20px;
  background-color: #222222;
  color: white;
  text-align: center;
  font-size: 24px;
}

.qrcode #qrcode {
  background-color: white;
  padding: 44px;
}

.decodeRes {
  position: absolute;
  overflow: auto;
  width: 100%;
  height: 100%;
  background-color: #585757;
}

.decodeRes .resContainer {
  position: absolute;
  left: 50%;
  top: 19.5vh;
  transform: translateX(-50%);
  width: auto;
  display: flex;
  height: 40%;
  background-color: #464545;
}

.decodeRes .imgContainer {
  position: relative;
  width: 470px;
  background-color: #262626;
  /* padding: 30px; */
  display: flex;
  justify-content: center;
  align-items: center;
}

.decodeRes .imgContainer .resultsPanel {
  position: absolute;
  width: 100%;
  height: 100%;
}

.decodeRes .resList {
  width: 350px;
  min-width: 330px;
  max-width: 400px;
  padding: 24px;
  padding-left: 30px;
  overflow: auto;
  color: white;
}

.decodeRes .resList li {
  font-size: 16px;
  font-family: OpenSans-Regular;
  margin-bottom: 7px;
  overflow: auto;
}

.decodeRes .resList li a {
  font-size: 16px;
  color: #aaaaaa;
  float: right;
  font-family: Oswald-Regular;
}

.decodeRes .restartVideo {
  position: absolute;
  left: 50%;
  bottom: -35%;
  transform: translateX(-50%);
  height: 10vh;
}

.decodeRes .restartVideo button {
  background: #fe8e14;
  width: 166px;
  height: 50px;
  padding: 12px 20px;
  font-size: 18px;
  text-align: center;
  outline: none;
  border: none;
  color: white;
  margin-right: 17px;
  cursor: pointer;
}

.decodeRes .restartVideo a {
  font-size: 16px;
}

.localImages {
  width: 100px;
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
  width: 250px;
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
.cameraAndSoundsContainer .soundEffects, 
.cameraAndSoundsContainer .web-screenshot {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100px;
}
.cameraAndSoundsContainer .web-screenshot {
  border-right: 1px solid rgb(98, 96, 94);
  background-color: rgba(34, 34, 34);
}
.cameraAndSoundsContainer .web-screenshot img {
  height: 50%;
}
.cameraAndSoundsContainer .soundEffects .musicUnSelected {
  height: 50%;
  margin-top: 0;
}
.cameraAndSoundsContainer .soundEffects .musicSelected {
  height: 60%;
  margin-top: 7px;
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
  max-height: 65vh;
  padding: 20px;
  color: #dddddd;
  background-color: rgba(34, 34, 34, 0.5);
  padding: 17px 25px 13px;
  transform: translate(-50%, -50%);
  z-index: 20;
}
.dlResultContainer .dlInfo {
  height: 100%;
  max-height: calc(60vh - 25px);
  overflow: auto;
}
.dlResultContainer .dlInfo li,
.resContainer .dlInfo li {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
  padding-bottom: 2px;
  font-size: 14px;
}
.dlResultContainer .dlInfo li .description,
.resContainer .dlInfo li .description {
  width: 55%;
  color: #cccccc;
}
.dlResultContainer .dlInfo li .value,
.resContainer .dlInfo li .value {
  width: 40%;
  color: white;
}
.resContainer .dlInfo li .value {
  word-break: break-all;
}
.dlResultContainer .footer {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  color: #fe8e14;
  font-size: 16px;
}
.dlResultContainer .footer .copyBtn,
.dlResultContainer .footer .closeBtn {
  cursor: pointer;
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
  pointer-events: none;
}

.cameraList {
  position: absolute;
  left: 0;
  background-color: rgba(34, 34, 34);
  z-index: 50;
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

.dbrScanner-bg-loading {
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
}

@keyframes dbrScanner-scanlight {
  from {
    top: 0;
  }

  to {
    top: 97%;
  }
}

@media screen and (max-width: 1199px) {
  .cameraAndSoundsContainer .cameraDropdown {
    width: 210px;
  }

  .cameraAndSoundsContainer .cameraDropdown .cameraInfo {
    margin: 0;
  }

  .localImages,
  .cameraAndSoundsContainer .soundEffects {
    width: 75px;
  }

  .decodeRes .resContainer {
    width: 60%;
  }

  .decodeRes .resContainer .restartVideo {
    text-align: center;
    width: 100%;
  }
}
@media (max-width: 759px) {
  .decodeRes .resContainer {
    width: 90%;
  }
  #qrcode {
    display: none;
  }
  .qrcode .scan-on-phone {
    display: none;
  }
  .qrcode div:first-child {
    height: auto !important;
    top: 48%;
  }
}

@media (max-width: 572px) {
  .qrcode div:nth-child(3) {
    display: none;
  }
  .qrcode .web-upload {
    display: none;
  }
  .qrcode button {
    display: block !important;
    width: 200px;
    height: 46px;
    margin: 40px 0 0 0;
    background-color: #fe8e14;
    outline: none;
    border: none;
  }
  .decodeRes .resContainer {
    display: flex;
    flex-direction: column;
    height: 300px;
    width: 100%;
  }

  .decodeRes .resContainer .imgContainer,
  .decodeRes .resContainer .resList {
    width: 100%;
  }

  .decodeRes .resContainer .imgContainer {
    max-height: 150px;
  }

  .decodeRes .resContainer .resList {
    padding-top: 10px;
  }

  .decodeRes .resContainer .restartVideo button {
    width: 140px;
    font-size: 16px;
  }

  .decodeRes .resContainer .restartVideo a {
    width: auto;
    bottom: -35%;
  }
}

@media (min-width: 981px),
  screen and (max-width: 980px) and (orientation: landscape) {
  .copyright {
    display: none;
  }
  .cameraAndSoundsContainer {
    height: 7.7vh;
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
  .localImages {
    background-color: rgba(34, 34, 34);
    /* width: 100px; */
    height: 100%;
    border-left: 1px solid rgb(98, 96, 94);
  }

  /* .cameraAndSoundsContainer .soundEffects {
    width: 90px;
  } */
  /* .cameraAndSoundsContainer .soundEffects img {
    height: 50%;
  } */
  .curUseCaseTip {
    top: 3.9vh;
    /* width: calc(100% - 892px); */
    width: auto;
    font-size: 20px;
    transform: translate(-50%, -50%);
  }
  .resultContainer {
    width: 47.7%;
    /* min-width: 700px; */
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
@media screen and (max-width: 980px) {
  .screenshot {
    position: absolute;
    bottom: 10px;
    right: 10px;
    width: 50px;
    height: 50px;
    background-color: rgba(0,0,0,0.6);
    border-radius: 50%;
    color: #ffffff;
    cursor: pointer;
    font-size: 18px;
    z-index: 30;
  }

  .screenshotIcon {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 20px;
    height: 20px;
    fill: #fff;
    vertical-align: baseline;
  }
}
@media screen and (max-width: 980px) and (orientation: landscape) {
  .decodeRes .resContainer {
    width: 80%;
  }

  .copyright {
    display: block;
    font-size: 12px;
    bottom: 18%;
  }
  .cameraAndSoundsContainer {
    height: 10vh;
  }
  .cameraAndSoundsContainer .cameraDropdown {
    padding-left: 10px;
    width: 100px;
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
  /* .cameraAndSoundsContainer .soundEffects img {
    height: 50%;
  } */
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
/*   .dlResultContainer {
    max-width: 70%;
    max-height: 60%;
  } */
  .dlResultContainer {
    max-height: 55vh;
  }
  .dlResultContainer .dlInfo {
    max-height: calc(50vh - 25px);
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
  .localImages {
    background-color: rgba(34, 34, 34);
    width: 60px;
    height: 100%;
    border-left: 1px solid rgb(98, 96, 94);
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
}
@media screen and (max-width: 350px) {
  .localImages,
  .cameraAndSoundsContainer .soundEffects {
    width: 45px;
  }
}
</style>
