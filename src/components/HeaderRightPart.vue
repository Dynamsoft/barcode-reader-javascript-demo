<script setup lang="ts">
</script>

<template>
  <div class="dbr-header-right-part">
    <a
      class="dbr-get-demo-code-btn"
      href="https://github.com/Dynamsoft/barcode-reader-javascript-demo"
      target="_blank"
    >
      GET DEMO CODE
      <svg data-v-8dc7cce2="" viewBox="0 0 18 18" class="dbr-download-code-icon">
        <g data-v-8dc7cce2="" transform="translate(-519 -1339)">
          <g data-v-8dc7cce2="" transform="translate(520 1340)">
            <path
              data-v-8dc7cce2=""
              d="M528,1356a8,8,0,1,0-8-8A8,8,0,0,0,528,1356Z"
              transform="translate(-520 -1340)"
              fill="none"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
            ></path>
            <path
              data-v-8dc7cce2=""
              d="M531,1352.274V1344.5"
              transform="translate(-523 -1340.387)"
              fill="none"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
            ></path>
            <path
              data-v-8dc7cce2=""
              d="M533.554,1352l-4.027,5.027L525.5,1352"
              transform="translate(-521.527 -1344.02)"
              fill="none"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
            ></path>
          </g>
        </g>
      </svg>
    </a>
    <a
      class="dbr-download-sdk-btn"
      href="https://www.dynamsoft.com/barcode-reader/downloads/#javascript"
      target="_blank"
    >
      DOWNLOAD SDK
    </a>
  </div>
</template>

<style scoped lang="less">
.dbr-header-right-part {
  position: absolute;
  height: 100%;
  right: 20px;
  display: flex;
  align-items: center;

  .dbr-get-demo-code-btn {
    display: flex;
    justify-content: center;
    align-items: center;
    color: rgb(254, 142, 20);
    margin-right: 25px;

    .dbr-download-code-icon {
      width: 16px;
      height: 16px;
      stroke: rgb(254, 142, 20);
      margin-left: 5px;

      @media (max-width: 980px) {
        stroke: #ffffff;
      }
    }

    &:hover {
      color: #ffae38;
      .dbr-download-code-icon {
        stroke: #ffae38;
      }
    }

    @media (max-width: 980px) {
      color: #ffffff;
      font-size: 14px;
      margin-right: 0;
    }
  }

  .dbr-download-sdk-btn {
    width: 160px;
    height: 65%;
    position: relative;
    background-color: rgb(254, 142, 20);
    display: flex;
    justify-content: center;
    align-items: center;
    color: #ffffff;

    &:hover {
      background-color: #ffae38;
    }

    @media (max-width: 980px) {
      display: none;
    }
  }

  @media (max-width: 980px) {
    right: 10px;
  }
}

a {
  text-decoration: none;
}
</style>
