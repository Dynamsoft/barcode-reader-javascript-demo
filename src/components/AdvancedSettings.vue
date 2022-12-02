<template>
  <div class="advanced-settings" ref="advanced">
    <header>
      <svg @click="sendData" t="1660802908998" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2351" width="200" height="200"><path d="M670.977781 808.954249c-5.300726 0-10.596336-2.045589-14.603603-6.126534L368.69006 509.86743c-7.818059-7.961322-7.818059-20.717857 0-28.67918l287.684118-292.960285c7.92039-8.065699 20.877493-8.182356 28.942169-0.26299 8.065699 7.919367 8.182356 20.877493 0.264013 28.942169L411.976936 495.526817l273.603425 278.620695c7.918343 8.064676 7.801686 21.022803-0.264013 28.942169C681.331593 807.002804 676.153664 808.954249 670.977781 808.954249z" p-id="2352"></path></svg>
    </header>
    <div class="settings">
      <div v-for="(setting, key, index) in globalSettingsCfg" :key="index">
        <div class="setting-title" :class="{toInline: setting.type === 'checkbox' || setting.type === 'obj'}" @click="()=>{showFurtherModes(setting.type)}">{{key}}</div>
        <div v-if="setting.type === 'slider'" class="slider-content">
          <input type="range" :min="setting.min" :max="setting.max" v-model.number="setting.default">
          <input type="text" v-model.number="setting.default" @blur="verifyInputValue">
        </div>
        <div v-if="setting.type === 'mode'" class="mode-content">
          <div v-for="(count, index) in setting.modeDisplayCount" :key="index">
            <select v-model.number="setting.value[index]">
              <option v-for="(value, key, optionIndex) in setting.options" :value="value.value" :key="optionIndex">{{key}}</option>
            </select>
            <div v-for="(value, key, i) in setting.options" :key="i" class="mode-child-content">
              <div v-if="value.args && value.value === setting.value[index]">
                <div v-for="(arg, key, argIndex) in value.args" :key="argIndex">
                  <span>{{key}}</span>
                  <div v-if="arg.type === 'slider'" class="arg-slider-content toInline">
                    <input type="range" :min="arg.min" :max="arg.max" v-model.number="arg.default[index]">
                    <input type="text" v-model.number="arg.default[index]" @blur="verifyInputValue">
                  </div>
                  <div v-if="arg.type === 'checkbox'" class="arg-checkbox-content toInline">
                    <input type="checkbox" v-model.number="arg.default[index]">
                  </div> 
                </div>
              </div>
            </div>
          </div>    
        </div>
        <div v-if="setting.type === 'checkbox'" class="checkbox-content">
          <input type="checkbox" v-model.number="setting.default">
        </div>
        <div v-if="setting.type === 'select'" class="select-content">
          <select v-model.number="setting.default">
            <option v-for="(option, key, index) in setting.options" :key="index" :value="option">{{key}}</option>
          </select>
        </div>
        <div v-if="setting.type === 'obj'" class="obj-content" @click="()=>{showFurtherModes(setting.type)}">
          <svg v-show="!isShowFurtherModes" t="1660816197273" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2352" width="30" height="30"><path d="M830.24 340.688l11.328 11.312a16 16 0 0 1 0 22.624L530.448 685.76a16 16 0 0 1-22.64 0L196.688 374.624a16 16 0 0 1 0-22.624l11.312-11.312a16 16 0 0 1 22.624 0l288.496 288.496 288.512-288.496a16 16 0 0 1 22.624 0z" p-id="2353"></path></svg>
          <svg v-show="isShowFurtherModes" t="1660873177513" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="6704" width="30" height="30"><path d="M830.24 685.76l11.328-11.312a16 16 0 0 0 0-22.64L530.448 340.688a16 16 0 0 0-22.64 0L196.688 651.808a16 16 0 0 0 0 22.64l11.312 11.312a16 16 0 0 0 22.624 0l288.496-288.512L807.632 685.76a16 16 0 0 0 22.624 0z" p-id="6705"></path></svg>
        </div>
        <div v-if="setting.type === 'obj' && isShowFurtherModes">
          <div v-for="(item, key, index) in setting.inside" :key="index">
            <div class="further-modes-title">{{key}}</div>
            <div v-if="item.type === 'mode'" class="mode-content">
              <div v-for="(count, index) in item.modeDisplayCount" :key="index">
                <select v-model.number="item.value[index]">
                  <option v-for="(value, key, optionIndex) in item.options" :value="value.value" :key="optionIndex">{{key}}</option>
                </select>
                <div v-for="(value, key, i) in item.options" :key="i" class="mode-child-content">
                  <div v-if="value.args && value.value === item.value[index]">
                    <div v-for="(arg, key, argIndex) in value.args" :key="argIndex">
                      <span>{{key}}</span>
                      <div v-if="arg.type === 'slider'" class="arg-slider-content toInline">
                        <input type="range" :min="arg.min" :max="arg.max" v-model.number="arg.default[index]">
                        <input type="text" v-model.number="arg.default[index]" @blur="verifyInputValue">
                      </div>
                      <div v-if="arg.type === 'checkbox'" class="arg-checkbox-content toInline">
                        <input type="checkbox" v-model.number="arg.default[index]">
                      </div>
                      <div v-if="arg.type === 'select'" class="arg-select-content toInline">
                        <select v-model.number="arg.default[index]">
                          <option v-for="(option, key, index) in arg.options" :key="index" :value="option">{{key}}</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
             
            </div>
            <div v-if="item.type === 'select'" class="select-content">
              <select v-model.number="item.default">
                <option v-for="(option, key, index) in item.options" :key="index" :value="option.value">{{key}}</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "AdvancedSettings",
  props: ["isShowAdvancedSettings"],
  data() {
    return {
      globalSettingsCfg: {
        barcodeZoneMinDistanceToImageBorders: {
          type: "slider", min: 0, max: 9999, default: 0
        },
        binarizationModes: {
          type: "mode",
          modeDisplayCount: 4,
          value: [2,0,0,0,0,0,0,0],
          options: {
            Skip: {value: 0},
            LocalBlock: {
              value: 2,
              args: {
                BlockSizeX: {
                  type: "slider",
                  min: 0,
                  max: 1000,
                  default: [0,0,0,0]
                },
                BlockSizeY: {
                  type: "slider",
                  min: 0,
                  max: 1000,
                  default: [0,0,0,0]
                },
                EnableFillBinaryVacancy: {
                  type: "checkbox",
                  options: [0, 1],
                  default: [1,1,1,1]
                },
                ImagePreprocessingModesIndex: {
                  type: "slider",
                  min: -1,
                  max: 3,
                  default: [-1,-1,-1,-1]
                },
                ThresholdCompensation: {
                  type: "slider",
                  min: -255,
                  max: 255,
                  default: [10,10,10,10]
                },
              },
            },
            Threshold: {
              value: 4,
              args: {
                BinarizationThreshold: {
                  type: "slider",
                  min: -1,
                  max: 255,
                  default: [-1,-1,-1,-1],
                },
                ImagePreprocessingModesIndex: { type: "slider", min: -1, max: 3, default: [-1,-1,-1,-1], },
              },
            },
          },
        },
        deblurLevel: {
          type: "slider",
          min: 0,
          max: 9,
          default: 9,
        },
        deblurModes: {
          type: "mode",
          modeDisplayCount: 8,
          value: [0,0,0,0,0,0,0,0,0,0],
          options: {
            Skip: {value: 0},
            DirectBinarization: {value: 1},
            ThresholdBinarization: {value: 2},
            GrayEqualization: {value: 4},
            Smoothing: {value: 8},
            Morphing: {value: 0x10},
            DeepAnalysis: {value: 0x20},
            Sharpening: {value: 0x40},
            BasedOnLocBin: {value: 0x80},
            SharpeningSmoothing: {value: 0x100},
          },
        },
        enableQRCodeModel1: {
          type: "select",
          default: 0,
          options: { disable: 0, enable: 1 },
        },
        expectedBarcodesCount: {
          type: "slider",
          min: 0,
          max: 999,
          default: 999,
        },
        localizationModes: {
          type: "mode",
          modeDisplayCount: 8,
          value: [2,16,4,8,0x20,0x40,0,0],
          options: {
            Skip: {value: 0},
            Centre: {
              value: 128,
              args: {
                ModuleSize: { type: "slider", min: 0, max: 99999, default: [0,0,0,0,0,0,0,0] },
              },
            },
            ConnectedBlocks: {value: 2},
            Lines: {value: 8},
            ScanDirectly: {
              value: 16,
              args: {
                ScanStride: {
                  type: "slider",
                  min: 0,
                  max: 999,
                  default: [0,0,0,0,0,0,0,0]
                },
              },
            },
            Statistics: {value: 4},
            StatisticsMarks: {value: 0x20},
            StatisticsPostalCode: {value: 0x40},
          }
        },
        maxAlgorithmThreadCount: {
          type: "slider",
          min: 1,
          max: 4,
          default: 4
        },
        minBarcodeTextLength: {
          type: "slider",
          min: 0,
          max: 999,
          default: 0
        },
        minResultConfidence: {
          type: "slider",
          min: 0,
          max: 100,
          default: 30
        },
        resultCoordinateType: {
          type: "select",
          default: 1,
          options: { Pixel: 1, Percentage: 2 },
        },
        returnBarcodeZoneClarity: {
          type: "select",
          default: 1,
          options: { notReturn: 0, return: 1 },
        },
        scaleDownThreshold: {
          type: "slider",
          min: 512,
          max: 99999,
          default: 2300,
        },
        scaleUpModes: {
          type: "mode",
          modeDisplayCount: 4,
          value: [1,0,0,0,0,0,0,0],
          options: {
            Skip: {value: 0},
            Auto: {value: 1},
            LinearInterpolation: {
              value: 2,
              args: {
                AcuteAngleWithXThreshold: {
                  type: "slider",
                  min: -1,
                  max: 90,
                  default: [-1,-1,-1,-1],
                },
                ModuleSizeThreshold: {
                  type: "slider",
                  min: 0,
                  max: 999,
                  default: [0,0,0,0],
                },
                TargetModuleSize: {
                  type: "slider",
                  min: 0,
                  max: 10,
                  default: [0,0,0,0],
                },
              },
            },
            NearestNeighbourInterpolation: {
              value: 4,
              args: {
                AcuteAngleWithXThreshold: {
                  type: "slider",
                  min: -1,
                  max: 90,
                  default: [-1,-1,-1,-1],
                },
                ModuleSizeThreshold: {
                  type: "slider",
                  min: 0,
                  max: 999,
                  default: [0,0,0,0],
                },
                TargetModuleSize: {
                  type: "slider",
                  min: 0,
                  max: 10,
                  default: [0,0,0,0],
                },
              },
            },
          },
        },
        textResultOrderModes: {
          type: "mode",
          modeDisplayCount: 4,
          value: [1,2,4,0,0,0,0,0],
          options: { Skip: {value: 0}, Confidence: {value: 1}, Position: {value: 2}, Format: {value: 4} },
        },
        timeout: {
          type: "slider",
          default: 10000,
          min: 100,
          max: 99999,
        },
        intermediateResultSavingMode: {
          type: "select",
          default: 0x01,
          options: { IRSM_MEMORY: 0x01, IRSM_FILESYSTEM: 0x02, IRSM_BOTH: 0x04, IRSM_REFERENCE_MEMORY: 0x08 },
        },
        intermediateResultTypes: {
          type: "select",
          default: 0x00,
          options: { 
            IRT_NO_RESULT: 0x00, 
            IRT_ORIGINAL_IMAGE: 0x01, 
            IRT_COLOUR_CLUSTERED_IMAGE: 0x02, 
            IRT_COLOUR_CONVERTED_GRAYSCALE_IMAGE: 0x04,
            IRT_TRANSFORMED_GRAYSCALE_IMAGE: 0x08,
            IRT_PREDETECTED_REGION: 0x10,
            IRT_PREPROCESSED_IMAGE: 0x20,
            IRT_BINARIZED_IMAGE: 0x40,
            IRT_TEXT_ZONE: 0x80,
            IRT_CONTOUR: 0x100,
            IRT_LINE_SEGMENT: 0x200,
            IRT_FORM: 0x400,
            IRT_SEGMENTATION_BLOCK: 0x800,
            IRT_TYPED_BARCODE_ZONE: 0x1000,
            IRT_PREDETECTED_QUADRILATERAL: 0x2000
          },
        },
        furtherModes: {
          type: "obj",
          inside: {
            barcodeColourModes: {
              type: "mode",
              modeDisplayCount: 4,
              value: [1,0,0,0,0,0,0,0],
              options: {
                Skip: {value: 0},
                DarkOnLight: {
                  value: 1,
                  args: {
                    LightReflection: {
                      type: "checkbox",
                      options: [0, 1],
                      default: [1,1,1,1],
                    },
                  },
                },
                LightOnDark: {
                  value: 2,
                  args: {
                    LightReflection: {
                      type: "checkbox",
                      options: [0, 1],
                      default: [1,1,1,1],
                    },
                  },
                },
                DarkOnDark: {
                  value: 4,
                  args: {
                    LightReflection: {
                      type: "checkbox",
                      options: [0, 1],
                      default: [1,1,1,1],
                    },
                  },
                },
                LightOnLight: {
                  value: 8,
                  args: {
                    LightReflection: {
                      type: "checkbox",
                      options: [0, 1],
                      default: [1,1,1,1],
                    },
                  },
                },
                DarkLightMixed: {
                  value: 0x10,
                  args: {
                    LightReflection: {
                      type: "checkbox",
                      options: [0, 1],
                      default: [1,1,1,1],
                    },
                  },
                },
                DarkOnLightDarkSurrounding: {
                  value: 0x20,
                  args: {
                    LightReflection: {
                      type: "checkbox",
                      options: [0, 1],
                      default: [1,1,1,1],
                    },
                  },
                },
              },
            },
            barcodeComplementModes: {
              type: "mode",
              modeDisplayCount: 4,
              value: [0,2,0,0,0,0,0,0],
              options: { Skip: {value: 0}, Auto: {value: 1}, General: {value: 2} },
            },
            colourClusteringModes: {
              type: "mode",
              modeDisplayCount: 4,
              value: [0,0,0,0,0,0,0,0],
              options: {
                Skip: {value: 0},
                Auto: {value: 1},
                GeneralHSV: {
                  value: 2,
                  args: {
                    Sensitivity: {
                      type: "slider",
                      min: 1,
                      max: 9,
                      default: [5,5,5,5],
                    },
                  },
                },
              },
            },
            colourConversionModes: {
              type: "mode",
              modeDisplayCount: 4,
              value: [1,0,0,0,0,0,0,0],
              options: {
                Skip: {value: 0},
                General: {
                  value: 1,
                  args: {
                    BlueChannelWeight: {
                      type: "slider",
                      min: -1,
                      max: 1000,
                      default: [-1,-1,-1,-1],
                    },
                    GreenChannelWeight: {
                      type: "slider",
                      min: -1,
                      max: 1000,
                      default: [-1,-1,-1,-1],
                    },
                    RedChannelWeight: {
                      type: "slider",
                      min: -1,
                      max: 1000,
                       default: [-1,-1,-1,-1],
                    },
                  },
                },
              },
            },
            dpmCodeReadingModes: {
              type: "mode",
              modeDisplayCount: 4,
              value: [0,0,0,0,0,0,0,0],
              options: { Skip: {value: 0}, Auto: {value: 1}, General: {value: 2} },
            },
            deformationResistingModes: {
              type: "mode",
              modeDisplayCount: 4,
              value: [2,0,0,0,0,0,0,0],
              options: {
                Skip: {value: 0},
                Auto: {value: 1},
                General: {
                  value: 2,
                  args: {
                    Level: { type: "slider", min: 1, max: 9,  default: [5,5,5,5], },
                  },
                },
                BroadWarp: 0x04,
                LocalReference: 0x08,
                Dewrinkle: 0x10,
              },
            },
            grayscaleTransformationModes: {
              type: "mode",
              modeDisplayCount: 4,
              value: [2,1,0,0,0,0,0,0],
              options: { Skip: {value: 0}, Inverted: {value: 1}, Original: {value: 2} },
            },
            imagePreprocessingModes: {
              type: "mode",
              modeDisplayCount: 4,
              value: [2,0,0,0,0,0,0,0],
              options: {
                Skip: {value: 0},
                Auto: {value: 1},
                General: {value: 2},
                GrayEqualize: {
                  value: 4,
                  args: {
                    Sensitivity: { type: "slider", min: 1, max: 9,  default: [5,5,5,5], },
                  },
                },
                GraySmooth: {
                  value: 8,
                  args: {
                    SmoothBlockSizeX: { type: "slider", min: 3, max: 1000, default: [3,3,3,3] },
                    SmoothBlockSizeY: { type: "slider", min: 3, max: 1000, default: [3,3,3,3] },
                  },
                },
                SharpenSmooth: {
                  value: 0x10,
                  args: {
                    SharpenBlockSizeX: { type: "slider", min: 3, max: 1000, default: [3,3,3,3] },
                    SharpenBlockSizeY: { type: "slider", min: 3, max: 1000, default: [3,3,3,3] },
                    SmoothBlockSizeX: { type: "slider", min: 3, max: 1000, default: [3,3,3,3] },
                    SmoothBlockSizeY: { type: "slider", min: 3, max: 1000, default: [3,3,3,3] },
                  },
                },
                Morphology: {
                  value: 0x20,
                  args: {
                    MorphOperation: {
                      type: "select",
                      default: ["Close","Close","Close","Close"],
                      options: {
                        Close: "Close",
                        Erode: "Erode",
                        Dilate: "Dilate",
                        Open: "Open",
                      },
                    },
                    MorphShape: {
                      type: "select",
                      default: ["Rectangle","Rectangle","Rectangle","Rectangle"],
                      options: {
                        Rectangle: "Rectangle",
                        Cross: "Cross",
                        Ellipse: "Ellipse",
                      },
                    },
                    MorphOperationKernelSizeX: {
                      type: "slider",
                      min: 0,
                      max: 1000,
                      default: [0,0,0,0],
                    },
                    MorphOperationKernelSizeY: {
                      type: "slider",
                      min: 0,
                      max: 1000,
                      default: [0,0,0,0],
                    },
                  },
                },
              },
            },
            regionPredetectionModes: {
              type: "mode",
              modeDisplayCount: 4,
              value: [2,0,0,0,0,0,0,0],
              options: {
                Skip: {value: 0},
                Auto: {value: 1},
                General: {value: 2},
                RGB: {
                  value: 4,
                  args: {
                    MinImageDimension: {
                      min: 262144,
                      max: 0x7fffffff,
                      default: [262144,262144,262144,262144],
                    },
                    Sensitivity: { type: "slider", min: 1, max: 9, default: 1 },
                    SpatialIndexBlockSize: {
                      type: "slider",
                      min: 1,
                      max: 32,
                      default: [5,5,5,5],
                    },
                    ForeAndBackgroundColours: { type: "string", default: "" },
                  },
                },
                Gray: {
                  value: 8,
                  args: {
                    MinImageDimension: {
                      min: 262144,
                      max: 0x7fffffff,
                      default: [262144,262144,262144,262144],
                    },
                    Sensitivity: { type: "slider", min: 1, max: 9, default: 1 },
                    SpatialIndexBlockSize: {
                      type: "slider",
                      min: 1,
                      max: 32,
                      default: [5,5,5,5],
                    },
                    ForeAndBackgroundColours: { type: "string", default: "" },
                  },
                },
                HSV: {
                  value: 0x10,
                  args: {
                    MinImageDimension: {
                      min: 262144,
                      max: 0x7fffffff,
                      default: [262144,262144,262144,262144],
                    },
                    Sensitivity: { type: "slider", min: 1, max: 9, default: 1 },
                    SpatialIndexBlockSize: {
                      type: "slider",
                      min: 1,
                      max: 32,
                      default: [5,5,5,5],
                    },
                    ForeAndBackgroundColours: { type: "string", default: "" },
                  },
                },
              },
            },
            textFilterModes: {
              type: "mode",
              modeDisplayCount: 4,
              value: [2,0,0,0,0,0,0,0],
              options: {
                Skip: {value: 0},
                Auto: {value: 1},
                GeneralContour: {
                  value: 2,
                  args: {
                    MinImageDimension: {
                      min: 65536,
                      max: 0x7fffffff,
                      default: [65536,65536,65536,65536],
                    },
                    Sensitivity: {
                      type: "slider",
                      min: 0,
                      max: 9,
                      default: [0,0,0,0],
                    },
                  },
                },
              },
            },
            textureDetectionModes: {
              type: "mode",
              modeDisplayCount: 4,
              value: [2,0,0,0,0,0,0,0],
              options: {
                Skip: {value: 0},
                Auto: {value: 1},
                GeneralWidthConcentration: {
                  value: 2,
                  args: {
                    Sensitivity: {
                      type: "slider",
                      min: 1,
                      max: 9,
                      default: [5,5,5,5],
                    },
                  },
                },
              },
            },
          },
        },
      },
      isShowFurtherModes: false,
      advancedSettings: {},
      modeArguments: [],
    };
  },
  methods: {
    showFurtherModes(type) {
      if(type === "obj") {
        this.isShowFurtherModes = !this.isShowFurtherModes;
      }
    },
    handleModeArgument(data) {
      const newData = {...data, ...data.furtherModes.inside};
      delete newData.FurtherModes;
      const modeArguments = [];
      for(let i in newData) {
        if(newData[i].type === "mode") {
          for(let j=0;j<newData[i].modeDisplayCount;j++) {
            if(newData[i].value[j] >=1) {
              for(let k in newData[i].options) {
                if(newData[i].options[k].args && newData[i].options[k].value === newData[i].value[j]) {
                  for(let arg in newData[i].options[k].args) {
                    let item = this.handleItem(i,j,arg,newData[i].options[k].args[arg].default[j]);
                    modeArguments.push(item);
                  }
                }
              }
            }  
          }
        }
      }
      return modeArguments;
    },
    handleItem(modesName, index, argumentName, argumentValue) {
      if(typeof argumentValue === "number") {
        argumentValue = argumentValue.toString();
      }
      return {
        modesName,
        index,
        argumentName,
        argumentValue
      }
    },
    sendData() {
      this.$emit("getAdvancedSettings", this.advancedSettings, this.modeArguments);
      this.$store.state.isShowAdvancedSettings = false;
    },
    verifyInputValue(e) {

    }
  },
  watch: {
    globalSettingsCfg: {
      handler(newVal) {
        console.log(newVal);
        this.$store.state.isChanged = true;
        const data = JSON.parse(JSON.stringify(newVal));
        this.advancedSettings = data;
        this.modeArguments = this.handleModeArgument(data);
      },
      deep: true,
    }
  }
};
</script>

<style scoped>
.advanced-settings {position: absolute;top: 0;left: 0;right: 0;bottom: 0;width: 100%;height: 100%;background-color: rgba(0,0,0,0.5);z-index: 50;font-family: OpenSans-Regular;}
.advanced-settings header {display: flex;align-items: center;width: 100%;height: 50px;background-color: lightgray;}
.advanced-settings header svg {width: 30px;height: 30px;}
.advanced-settings .settings {height: calc(100% - 50px);padding: 10px 10px 0 10px;color: #fff;line-height: 30px;overflow: auto;}
.advanced-settings .setting-title, .advanced-settings .further-modes-title {margin-top: 10px;}
.advanced-settings .settings .slider-content span {margin-left: 10px;}
.advanced-settings .settings .mode-content select {color: black;display: block;}
.advanced-settings .settings .mode-content .mode-child-content {margin: 7px 0 7px 10px;}
.advanced-settings .settings .mode-content .mode-child-content input[type="range"] {margin: 0 10px;}
.advanced-settings .settings .select-content select {color: black;}
.advanced-settings .settings .checkbox-content {display: inline-block;}
.advanced-settings .settings .obj-content {filter: invert(1);display: inline-block;cursor: pointer;}
.advanced-settings .settings .obj-content svg {vertical-align: bottom;}

.toInline {display: inline-block;margin-right: 10px;}
.arg-select-content {margin-left: 10px;}

input[type="text"] {width: 50px;height: 20px;color: black;}
input[type="range"] {vertical-align: middle;}
input[type="checkbox"] {vertical-align: middle;margin-left: 10px;}
</style>