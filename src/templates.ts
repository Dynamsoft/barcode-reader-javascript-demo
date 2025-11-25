export default {
  ReadCommon1DAnd2D: {
    "GlobalParameter":
    {
      "IntraOpNumThreads": 2
    },
    "CaptureVisionTemplates": [
      {
        "Name": "ReadCommon1DAnd2D",
        "ImageROIProcessingNameArray": [
          "roi-read-barcodes"
        ],
        "Timeout": 1000,
        "MaxParallelTasks": 0
      },
      {
        "Name": "ReadCommon1DAnd2D_ReadRate",
        "ImageROIProcessingNameArray": [
          "roi-read-barcodes-read-rate"
        ],
        "Timeout": 10000,
        "MaxParallelTasks": 0
      }
    ],
    "TargetROIDefOptions": [
      {
        "Name": "roi-read-barcodes",
        "TaskSettingNameArray": [
          "task-read-barcodes"
        ]
      },
      {
        "Name": "roi-read-barcodes-read-rate",
        "TaskSettingNameArray": [
          "task-read-barcodes-read-rate"
        ]
      }
    ],
    "BarcodeReaderTaskSettingOptions": [
      {
        "Name": "task-read-barcodes",
        "ExpectedBarcodesCount": 1,
        "MaxThreadsInOneTask": 1,
        "BarcodeFormatIds": [
          "BF_DEFAULT"
        ],
        "SectionArray": [
          {
            "Section": "ST_BARCODE_LOCALIZATION",
            "ImageParameterName": "ip-read-barcodes",
            "StageArray": [
              {
                "Stage": "SST_LOCALIZE_CANDIDATE_BARCODES",
                "LocalizationModes": [
                  {
                    "Mode": "LM_CONNECTED_BLOCKS"
                  },
                  {
                    "Mode": "LM_SCAN_DIRECTLY"
                  }
                ]
              },
              {
                "Stage": "SST_LOCALIZE_BARCODES"
              }
            ]
          },
          {
            "Section": "ST_BARCODE_DECODING",
            "ImageParameterName": "ip-read-barcodes",
            "StageArray": [
              {
                "DeblurModes": [
                  {
                    "Mode": "DM_BASED_ON_LOC_BIN"
                  },
                  {
                    "Mode": "DM_THRESHOLD_BINARIZATION"
                  },
                  {
                    "Mode": "DM_NEURAL_NETWORK",
                    "ModelNameArray": [
                      "Code128Decoder",
                      "EAN13Decoder"
                    ]
                  },
                  {
                    "Mode": "DM_DEEP_ANALYSIS",
                    "Methods": ["OneDGeneral", "TwoDGeneral"]
                  }
                ],
                "Stage": "SST_DECODE_BARCODES"
              }
            ]
          }
        ]
      },
      {
        "Name": "task-read-barcodes-read-rate",
        "ExpectedBarcodesCount": 1,
        "MaxThreadsInOneTask": 1,
        "BarcodeFormatIds": [
          "BF_DEFAULT"
        ],
        "SectionArray": [
          {
            "Section": "ST_BARCODE_LOCALIZATION",
            "ImageParameterName": "ip-read-barcodes",
            "StageArray": [
              {
                "Stage": "SST_LOCALIZE_CANDIDATE_BARCODES",
                "LocalizationModes": [
                  {
                    "Mode": "LM_CONNECTED_BLOCKS"
                  },
                  {
                    "Mode": "LM_NEURAL_NETWORK"
                  }
                ]
              }
            ]
          },
          {
            "Section": "ST_BARCODE_DECODING",
            "ImageParameterName": "ip-read-barcodes",
            "StageArray": [
              {
                "Stage": "SST_DECODE_BARCODES",
                "DeblurModes": [
                  {
                    "Mode": "DM_BASED_ON_LOC_BIN"
                  },
                  {
                    "Mode": "DM_THRESHOLD_BINARIZATION"
                  },
                  {
                    "Mode": "DM_DIRECT_BINARIZATION"
                  },
                  {
                    "Mode": "DM_NEURAL_NETWORK"
                  },
                  {
                    "Mode": "DM_DEEP_ANALYSIS"
                  }
                ]
              },
              {
                "Stage": "SST_COMPLEMENT_BARCODE",
                "BarcodeComplementModes": [
                  {
                    "Mode": "BCM_GENERAL"
                  }
                ]
              },
              {
                "Stage": "SST_RESIST_DEFORMATION",
                "DeformationResistingModes": [
                  {
                    "Mode": "DRM_AUTO"
                  }
                ]
              }
            ]
          }
        ]
      }
    ],
    "ImageParameterOptions": [
      {
        "Name": "ip-read-barcodes",
        "ApplicableStages": [
          {
            "Stage": "SST_DETECT_TEXT_ZONES",
            "TextDetectionMode": {
              "Mode": "TTDM_LINE",
              "Direction": "UNKNOWN",
              "Sensitivity": 3
            }
          },
          {
            "Stage": "SST_REMOVE_TEXT_ZONES_FROM_BINARY",
            "IfEraseTextZone": 1
          },
          {
            "Stage": "SST_BINARIZE_IMAGE",
            "BinarizationModes": [
              {
                "Mode": "BM_LOCAL_BLOCK",
                "BlockSizeX": 27,
                "BlockSizeY": 27,
                "EnableFillBinaryVacancy": 0
              }
            ]
          },
          {
            "Stage": "SST_TRANSFORM_GRAYSCALE",
            "GrayscaleTransformationModes": [
              {
                "Mode": "GTM_ORIGINAL"
              },
              {
                "Mode": "GTM_INVERTED"
              }
            ]
          }
        ]
      }
    ]
  },
  ReadCommon2D: {
    "GlobalParameter":
    {
      "IntraOpNumThreads": 2
    },
    "CaptureVisionTemplates": [
      {
        "ImageROIProcessingNameArray": [
          "ROI_Common2D"
        ],
        "Name": "ReadCommon2D",
        "MaxParallelTasks": 0,
        "Timeout": 1000
      },
      {
        "ImageROIProcessingNameArray": [
          "ROI_Common2D_ReadRate"
        ],
        "Name": "ReadCommon2D_ReadRate",
        "MaxParallelTasks": 0,
        "Timeout": 10000
      }
    ],
    "TargetROIDefOptions": [
      {
        "Name": "ROI_Common2D",
        "TaskSettingNameArray": [
          "Task_Common2D"
        ]
      },
      {
        "Name": "ROI_Common2D_ReadRate",
        "TaskSettingNameArray": [
          "Task_Common2D_ReadRate"
        ]
      }
    ],
    "BarcodeReaderTaskSettingOptions": [
      {
        "Name": "Task_Common2D",
        "BarcodeFormatIds": ["BF_QR_CODE", "BF_DATAMATRIX", "BF_PDF417"],
        "ExpectedBarcodesCount": 1,
        "MaxThreadsInOneTask": 1,
        "SectionArray": [
          {
            "Section": "ST_BARCODE_LOCALIZATION",
            "ImageParameterName": "ip_include_inverted",
            "StageArray": [
              {
                "Stage": "SST_LOCALIZE_CANDIDATE_BARCODES",
                "LocalizationModes": [
                  {
                    "Mode": "LM_CONNECTED_BLOCKS"
                  },
                  {
                    "Mode": "LM_LINES"
                  },
                  {
                    "Mode": "LM_NEURAL_NETWORK",
                    "ModelNameArray": ["DataMatrixQRCodeLocalization"]
                  }
                ]
              }
            ]
          },
          {
            "Section": "ST_BARCODE_DECODING",
            "ImageParameterName": "ip_include_inverted",
            "StageArray": [
              {
                "Stage": "SST_DECODE_BARCODES",
                "DeblurModes": [
                  {
                    "Mode": "DM_BASED_ON_LOC_BIN"
                  },
                  {
                    "Mode": "DM_THRESHOLD_BINARIZATION"
                  },
                  {
                    "Mode": "DM_DEEP_ANALYSIS"
                  }
                ]
              },
              {
                "Stage": "SST_COMPLEMENT_BARCODE",
                "BarcodeComplementModes": [
                  {
                    "Mode": "BCM_GENERAL"
                  }
                ]
              },
              {
                "Stage": "SST_RESIST_DEFORMATION",
                "DeformationResistingModes": [
                  {
                    "Mode": "DRM_AUTO"
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        "Name": "Task_Common2D_ReadRate",
        "BarcodeFormatIds": ["BF_QR_CODE", "BF_DATAMATRIX", "BF_PDF417"],
        "ExpectedBarcodesCount": 1,
        "MaxThreadsInOneTask": 1,
        "SectionArray": [
          {
            "Section": "ST_BARCODE_LOCALIZATION",
            "ImageParameterName": "ip_include_inverted",
            "StageArray": [
              {
                "Stage": "SST_LOCALIZE_CANDIDATE_BARCODES",
                "LocalizationModes": [
                  {
                    "Mode": "LM_CONNECTED_BLOCKS"
                  },
                  {
                    "Mode": "LM_LINES"
                  },
                  {
                    "Mode": "LM_NEURAL_NETWORK",
                    "ModelNameArray": ["DataMatrixQRCodeLocalization"]
                  }
                ]
              }
            ]
          },
          {
            "Section": "ST_BARCODE_DECODING",
            "ImageParameterName": "ip_include_inverted",
            "StageArray": [
              {
                "Stage": "SST_DECODE_BARCODES",
                "DeblurModes": null
              },
              {
                "Stage": "SST_COMPLEMENT_BARCODE",
                "BarcodeComplementModes": [
                  {
                    "Mode": "BCM_GENERAL"
                  }
                ]
              },
              {
                "Stage": "SST_RESIST_DEFORMATION",
                "DeformationResistingModes": [
                  {
                    "Mode": "DRM_AUTO"
                  }
                ]
              }
            ]
          }
        ]
      }
    ],
    "ImageParameterOptions": [
      {
        "ApplicableStages": [
          {
            "ImageScaleSetting": {
              "EdgeLengthThreshold": 100000,
              "ScaleType": "ST_SCALE_DOWN"
            },
            "Stage": "SST_SCALE_IMAGE"
          },
          {
            "GrayscaleTransformationModes": [
              {
                "Mode": "GTM_ORIGINAL"
              },
              {
                "Mode": "GTM_INVERTED"
              }
            ],
            "Stage": "SST_TRANSFORM_GRAYSCALE"
          }
        ],
        "Name": "ip_include_inverted"
      }
    ]
  },
  ReadDataMatrix: {
    "GlobalParameter": {
      "IntraOpNumThreads": 2
    },
    "CaptureVisionTemplates": [
      {
        "ImageROIProcessingNameArray": [
          "ROI_DataMatrix"
        ],
        "Name": "ReadDataMatrix",
        "MaxParallelTasks": 0,
        "Timeout": 1000
      },
      {
        "ImageROIProcessingNameArray": [
          "ROI_DataMatrix_ReadRate"
        ],
        "Name": "ReadDataMatrix_ReadRate",
        "MaxParallelTasks": 0,
        "Timeout": 10000
      }
    ],
    "TargetROIDefOptions": [
      {
        "Name": "ROI_DataMatrix",
        "TaskSettingNameArray": [
          "Task_DataMatrix"
        ]
      },
      {
        "Name": "ROI_DataMatrix_ReadRate",
        "TaskSettingNameArray": [
          "Task_DataMatrix_ReadRate"
        ]
      }
    ],
    "BarcodeFormatSpecificationOptions": [
      {
        "BarcodeFormatIds": [
          "BF_DATAMATRIX"
        ],
        "EnableDataMatrixECC000-140": 1,
        "DataMatrixSizeOptions": [
          "DMS_ALL"
        ],
        "Name": "FS_0"
      }
    ],
    "BarcodeReaderTaskSettingOptions": [
      {
        "Name": "Task_DataMatrix",
        "BarcodeFormatIds": [
          "BF_DATAMATRIX"
        ],
        "BarcodeFormatSpecificationNameArray": [
          "FS_0"
        ],
        "ExpectedBarcodesCount": 1,
        "MaxThreadsInOneTask": 1,
        "SectionArray": [
          {
            "Section": "ST_BARCODE_LOCALIZATION",
            "ImageParameterName": "ip_include_inverted",
            "StageArray": [
              {
                "Stage": "SST_LOCALIZE_CANDIDATE_BARCODES",
                "LocalizationModes": [
                  {
                    "Mode": "LM_CONNECTED_BLOCKS"
                  },
                  {
                    "Mode": "LM_LINES"
                  },
                  {
                    "Mode": "LM_NEURAL_NETWORK",
                    "ModelNameArray": [
                      "DataMatrixQRCodeLocalization"
                    ]
                  }
                ]
              }
            ]
          },
          {
            "Section": "ST_BARCODE_DECODING",
            "ImageParameterName": "ip_include_inverted",
            "StageArray": [
              {
                "Stage": "SST_DECODE_BARCODES",
                "DeblurModes": [
                  {
                    "Mode": "DM_BASED_ON_LOC_BIN"
                  },
                  {
                    "Mode": "DM_THRESHOLD_BINARIZATION"
                  },
                  {
                    "Mode": "DM_DEEP_ANALYSIS"
                  }
                ]
              },
              {
                "Stage": "SST_RESIST_DEFORMATION",
                "DeformationResistingModes": [
                  {
                    "Mode": "DRM_AUTO"
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        "Name": "Task_DataMatrix_ReadRate",
        "BarcodeFormatIds": [
          "BF_DATAMATRIX"
        ],
        "BarcodeFormatSpecificationNameArray": [
          "FS_0"
        ],
        "ExpectedBarcodesCount": 1,
        "MaxThreadsInOneTask": 1,
        "SectionArray": [
          {
            "Section": "ST_BARCODE_LOCALIZATION",
            "ImageParameterName": "ip_include_inverted",
            "StageArray": [
              {
                "Stage": "SST_LOCALIZE_CANDIDATE_BARCODES",
                "LocalizationModes": [
                  {
                    "Mode": "LM_CONNECTED_BLOCKS"
                  },
                  {
                    "Mode": "LM_LINES"
                  },
                  {
                    "Mode": "LM_NEURAL_NETWORK",
                    "ModelNameArray": [
                      "DataMatrixQRCodeLocalization"
                    ]
                  }
                ]
              }
            ]
          },
          {
            "Section": "ST_BARCODE_DECODING",
            "ImageParameterName": "ip_include_inverted",
            "StageArray": [
              {
                "Stage": "SST_DECODE_BARCODES",
                "DeblurModes": null
              },
              {
                "Stage": "SST_RESIST_DEFORMATION",
                "DeformationResistingModes": [
                  {
                    "Mode": "DRM_AUTO"
                  }
                ]
              }
            ]
          }
        ]
      }
    ],
    "ImageParameterOptions": [
      {
        "ApplicableStages": [
          {
            "ImageScaleSetting": {
              "EdgeLengthThreshold": 100000,
              "ScaleType": "ST_SCALE_DOWN"
            },
            "Stage": "SST_SCALE_IMAGE"
          },
          {
            "GrayscaleTransformationModes": [
              {
                "Mode": "GTM_ORIGINAL"
              },
              {
                "Mode": "GTM_INVERTED"
              }
            ],
            "Stage": "SST_TRANSFORM_GRAYSCALE"
          }
        ],
        "Name": "ip_include_inverted"
      }
    ]
  },
  ReadDriversLicense: {
    "BarcodeReaderTaskSettingOptions": [
      {
        "Name": "task_pdf417_barcode",
        "MaxThreadsInOneTask": 1,
        "ExpectedBarcodesCount": 1,
        "BarcodeFormatIds": [
          "BF_PDF417"
        ],
        "SectionArray": [
          {
            "Section": "ST_BARCODE_LOCALIZATION",
            "ImageParameterName": "ip",
            "StageArray": [
              {
                "LocalizationModes": [
                  {
                    "Mode": "LM_CONNECTED_BLOCKS"
                  },
                  {
                    "Mode": "LM_SCAN_DIRECTLY"
                  }
                ],
                "Stage": "SST_LOCALIZE_CANDIDATE_BARCODES"
              },
              {
                "Stage": "SST_LOCALIZE_BARCODES"
              }
            ]
          },
          {
            "Section": "ST_BARCODE_DECODING",
            "ImageParameterName": "ip",
            "StageArray": [
              {
                "DeblurModes": [
                  {
                    "Mode": "DM_BASED_ON_LOC_BIN"
                  },
                  {
                    "Mode": "DM_THRESHOLD_BINARIZATION"
                  },
                  {
                    "Mode": "DM_DEEP_ANALYSIS",
                    "Methods": ["TwoDGeneral"]
                  }
                ],
                "Stage": "SST_DECODE_BARCODES"
              }
            ]
          }
        ]
      }
    ],
    "CaptureVisionTemplates": [
      {
        "Name": "ReadDriversLicense",
        "ImageROIProcessingNameArray": [
          "roi_pdf417_barcode"
        ]
      }
    ],
    "ImageParameterOptions": [
      {
        "Name": "ip",
        "ApplicableStages": [
          {
            "Stage": "SST_INPUT_COLOR_IMAGE"
          },
          {
            "ImageScaleSetting": {
              "EdgeLengthThreshold": 100000,
              "ScaleType": "ST_SCALE_DOWN"
            },
            "Stage": "SST_SCALE_IMAGE"
          },
          {
            "Stage": "SST_CONVERT_TO_GRAYSCALE"
          },
          {
            "Stage": "SST_TRANSFORM_GRAYSCALE",
            "GrayscaleTransformationModes": [
              {
                "Mode": "GTM_ORIGINAL"
              }
            ]
          },
          {
            "Stage": "SST_ENHANCE_GRAYSCALE"
          },
          {
            "Stage": "SST_BINARIZE_IMAGE"
          },
          {
            "Stage": "SST_DETECT_TEXTURE"
          },
          {
            "Stage": "SST_REMOVE_TEXTURE_FROM_GRAYSCALE"
          },
          {
            "Stage": "SST_BINARIZE_TEXTURE_REMOVED_GRAYSCALE"
          },
          {
            "Stage": "SST_FIND_CONTOURS"
          },
          {
            "Stage": "SST_DETECT_SHORTLINES"
          },
          {
            "Stage": "SST_ASSEMBLE_LINES"
          },
          {
            "Stage": "SST_DETECT_TEXT_ZONES"
          },
          {
            "Stage": "SST_REMOVE_TEXT_ZONES_FROM_BINARY"
          }
        ]
      }
    ],
    "TargetROIDefOptions": [
      {
        "Name": "roi_pdf417_barcode",
        "TaskSettingNameArray": [
          "task_pdf417_barcode"
        ]
      }
    ]
  },
  ReadDistantBarcodes: {
    "GlobalParameter":
    {
      "IntraOpNumThreads": 2
    },
    "BarcodeReaderTaskSettingOptions": [
      {
        "ExpectedBarcodesCount": 1,
        "Name": "task_read_distant_barcodes",
        "BarcodeFormatIds": [
          "BF_CODE_11",
          "BF_CODE_128",
          "BF_CODE_93",
          "BF_CODE_39",
          "BF_CODE_39_EXTENDED",
          "BF_EAN_8",
          "BF_CODABAR",
          "BF_EAN_13",
          "BF_INDUSTRIAL_25",
          "BF_UPC_A",
          "BF_UPC_E",
          "BF_ITF",
          "BF_MSI_CODE",
          "BF_QR_CODE",
          "BF_PDF417",
          "BF_DATAMATRIX"
        ],
        "SectionArray": [
          {
            "ImageParameterName": "ip_read_distant_barcodes",
            "Section": "ST_BARCODE_LOCALIZATION",
            "StageArray": [
              {
                "LocalizationModes": [
                  {
                    "Mode": "LM_CONNECTED_BLOCKS"
                  },
                  {
                    "Mode": "LM_NEURAL_NETWORK"
                  }
                ],
                "Stage": "SST_LOCALIZE_CANDIDATE_BARCODES"
              },
              {
                "Stage": "SST_LOCALIZE_BARCODES"
              }
            ]
          },
          {
            "ImageParameterName": "ip_read_distant_barcodes",
            "Section": "ST_BARCODE_DECODING",
            "StageArray": [
              {
                "Stage": "SST_RESIST_DEFORMATION"
              },
              {
                "Stage": "SST_COMPLEMENT_BARCODE"
              },
              {
                "BarcodeScaleModes": [
                  {
                    "Mode": "BSM_LINEAR_INTERPOLATION",
                    "ModuleSizeThreshold": 4,
                    "TargetModuleSize": 6
                  }
                ],
                "Stage": "SST_SCALE_BARCODE_IMAGE"
              },
              {
                "Stage": "SST_DECODE_BARCODES"
              }
            ]
          }
        ],
        "TextResultOrderModes": [
          {
            "Mode": "TROM_POSITION"
          },
          {
            "Mode": "TROM_FORMAT"
          },
          {
            "Mode": "TROM_CONFIDENCE"
          }
        ]
      }
    ],
    "CaptureVisionTemplates": [
      {
        "ImageROIProcessingNameArray": [
          "roi_read_distant_barcodes"
        ],
        "MaxParallelTasks": 0,
        "Name": "ReadDistantBarcodes",
        "Timeout": 5000
      }
    ],
    "ImageParameterOptions": [
      {
        "ApplicableStages": [
          {
            "Stage": "SST_INPUT_COLOR_IMAGE"
          },
          {
            "ImageScaleSetting": {
              "EdgeLengthThreshold": 10000,
              "ScaleType": "ST_SCALE_DOWN"
            },
            "Stage": "SST_SCALE_IMAGE"
          },
          {
            "Stage": "SST_CONVERT_TO_GRAYSCALE"
          },
          {
            "Stage": "SST_TRANSFORM_GRAYSCALE",
            "GrayscaleTransformationModes": [
              {
                "Mode": "GTM_ORIGINAL"
              },
              {
                "Mode": "GTM_INVERTED"
              }
            ]
          },
          {
            "Stage": "SST_ENHANCE_GRAYSCALE"
          },
          {
            "Stage": "SST_BINARIZE_IMAGE"
          },
          {
            "Stage": "SST_DETECT_TEXTURE"
          },
          {
            "Stage": "SST_REMOVE_TEXTURE_FROM_GRAYSCALE"
          },
          {
            "Stage": "SST_BINARIZE_TEXTURE_REMOVED_GRAYSCALE"
          },
          {
            "Stage": "SST_FIND_CONTOURS"
          },
          {
            "Stage": "SST_DETECT_SHORTLINES"
          },
          {
            "Stage": "SST_ASSEMBLE_LINES"
          },
          {
            "Stage": "SST_DETECT_TEXT_ZONES"
          },
          {
            "Stage": "SST_REMOVE_TEXT_ZONES_FROM_BINARY"
          }
        ],
        "Name": "ip_read_distant_barcodes"
      }
    ],
    "TargetROIDefOptions": [
      {
        "Name": "roi_read_distant_barcodes",
        "TaskSettingNameArray": [
          "task_read_distant_barcodes"
        ]
      }
    ],
    "CaptureVisionModelOptions": [
      {
        "Name": "OneDLocalization",
        "ModelArgs": {
          "ImageDimensionThreshold": 3000000
        }
      },
      {
        "Name": "DataMatrixQRCodeLocalization",
        "ModelArgs": {
          "ImageDimensionThreshold": 3000000
        }
      }
    ]
  },
  ReadOneDIndustrial: {
    "GlobalParameter":
    {
      "IntraOpNumThreads": 2
    },
    "CaptureVisionTemplates": [
      {
        "ImageROIProcessingNameArray": [
          "ROI_Industrial"
        ],
        "Name": "ReadOneDIndustrial",
        "MaxParallelTasks": 0,
        "Timeout": 1000
      },
      {
        "ImageROIProcessingNameArray": [
          "ROI_Industrial_ReadRate"
        ],
        "Name": "ReadOneDIndustrial_ReadRate",
        "MaxParallelTasks": 0,
        "Timeout": 10000
      }
    ],
    "TargetROIDefOptions": [
      {
        "Name": "ROI_Industrial",
        "TaskSettingNameArray": [
          "Task_Industrial"
        ]
      },
      {
        "Name": "ROI_Industrial_ReadRate",
        "TaskSettingNameArray": [
          "Task_Industrial_ReadRate"
        ]
      }
    ],
    "BarcodeReaderTaskSettingOptions": [
      {
        "Name": "Task_Industrial",
        "BarcodeFormatSpecificationNameArray": ["bfs1"],
        "BarcodeFormatIds": ["BF_CODE_128", "BF_CODE_39", "BF_ITF", "BF_CODABAR", "BF_MSI_CODE"],
        "ExpectedBarcodesCount": 1,
        "MaxThreadsInOneTask": 1,
        "SectionArray": [
          {
            "Section": "ST_BARCODE_LOCALIZATION",
            "ImageParameterName": "ip",
            "StageArray": [
              {
                "Stage": "SST_LOCALIZE_CANDIDATE_BARCODES",
                "LocalizationModes": [
                  {
                    "Mode": "LM_CONNECTED_BLOCKS"
                  },
                  {
                    "Mode": "LM_SCAN_DIRECTLY"
                  }
                ]
              }
            ]
          },
          {
            "Section": "ST_BARCODE_DECODING",
            "ImageParameterName": "ip",
            "StageArray": [
              {
                "Stage": "SST_DECODE_BARCODES",
                "DeblurModes": [
                  {
                    "Mode": "DM_DIRECT_BINARIZATION"
                  },
                  {
                    "Mode": "DM_NEURAL_NETWORK",
                    "ModelNameArray": ["Code128Decoder", "OneDDeblur"]
                  },
                  {
                    "Mode": "DM_DEEP_ANALYSIS"
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        "Name": "Task_Industrial_ReadRate",
        "BarcodeFormatSpecificationNameArray": ["bfs1"],
        "BarcodeFormatIds": ["BF_CODE_128", "BF_CODE_39", "BF_ITF", "BF_CODABAR", "BF_MSI_CODE"],
        "ExpectedBarcodesCount": 1,
        "MaxThreadsInOneTask": 1,
        "SectionArray": [
          {
            "Section": "ST_BARCODE_LOCALIZATION",
            "ImageParameterName": "ip",
            "StageArray": [
              {
                "Stage": "SST_LOCALIZE_CANDIDATE_BARCODES",
                "LocalizationModes": [
                  {
                    "Mode": "LM_CONNECTED_BLOCKS"
                  },
                  {
                    "Mode": "LM_SCAN_DIRECTLY"
                  },
                  {
                    "Mode": "LM_NEURAL_NETWORK"
                  }
                ]
              }
            ]
          },
          {
            "Section": "ST_BARCODE_DECODING",
            "ImageParameterName": "ip",
            "StageArray": [
              {
                "Stage": "SST_DECODE_BARCODES",
                "DeblurModes": null
              }
            ]
          }
        ]
      }
    ],
    "BarcodeFormatSpecificationOptions": [
      {
        "Name": "bfs1",
        "BarcodeZoneMinDistanceToImageBorders": 10,
        "MinQuietZoneWidth": 6
      }
    ],
    "ImageParameterOptions": [
      {
        "ApplicableStages": [
          {
            "ImageScaleSetting": {
              "EdgeLengthThreshold": 100000,
              "ScaleType": "ST_SCALE_DOWN"
            },
            "Stage": "SST_SCALE_IMAGE"
          },
          {
            "Stage": "SST_TRANSFORM_GRAYSCALE",
            "GrayscaleTransformationModes": [
              {
                "Mode": "GTM_ORIGINAL"
              },
              {
                "Mode": "GTM_INVERTED"
              }
            ]
          },
        ],
        "Name": "ip"
      }
    ]
  },
  ReadOneDRetail: {
    "GlobalParameter":
    {
      "IntraOpNumThreads": 2
    },
    "CaptureVisionTemplates": [
      {
        "ImageROIProcessingNameArray": [
          "ROI_OneDRetail"
        ],
        "Name": "ReadOneDRetail",
        "MaxParallelTasks": 0,
        "Timeout": 1000
      },
      {
        "ImageROIProcessingNameArray": [
          "ROI_OneDRetail_ReadRate"
        ],
        "Name": "ReadOneDRetail_ReadRate",
        "MaxParallelTasks": 0,
        "Timeout": 10000
      }
    ],
    "TargetROIDefOptions": [
      {
        "Name": "ROI_OneDRetail",
        "TaskSettingNameArray": [
          "Task_OneDRetail"
        ]
      },
      {
        "Name": "ROI_OneDRetail_ReadRate",
        "TaskSettingNameArray": [
          "Task_OneDRetail_ReadRate"
        ]
      }
    ],
    "BarcodeReaderTaskSettingOptions": [
      {
        "Name": "Task_OneDRetail",
        "BarcodeFormatIds": ["BF_EAN_13", "BF_EAN_8", "BF_UPC_A", "BF_UPC_E", "BF_GS1_DATABAR"],
        "ExpectedBarcodesCount": 1,
        "MaxThreadsInOneTask": 1,
        "SectionArray": [
          {
            "Section": "ST_BARCODE_LOCALIZATION",
            "ImageParameterName": "ip",
            "StageArray": [
              {
                "Stage": "SST_LOCALIZE_CANDIDATE_BARCODES",
                "LocalizationModes": [
                  {
                    "Mode": "LM_SCAN_DIRECTLY",
                    "ScanDirection": 2
                  },
                  {
                    "Mode": "LM_CONNECTED_BLOCKS"
                  }
                ]
              }
            ]
          },
          {
            "Section": "ST_BARCODE_DECODING",
            "ImageParameterName": "ip",
            "StageArray": [
              {
                "Stage": "SST_DECODE_BARCODES",
                "DeblurModes": [
                  {
                    "Mode": "DM_DIRECT_BINARIZATION"
                  },
                  {
                    "Mode": "DM_NEURAL_NETWORK",
                    "ModelNameArray": ["EAN13Decoder", "OneDDeblur"]
                  },
                  {
                    "Mode": "DM_DEEP_ANALYSIS"
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        "Name": "Task_OneDRetail_ReadRate",
        "BarcodeFormatIds": ["BF_EAN_13", "BF_EAN_8", "BF_UPC_A", "BF_UPC_E", "BF_GS1_DATABAR"],
        "ExpectedBarcodesCount": 1,
        "MaxThreadsInOneTask": 1,
        "SectionArray": [
          {
            "Section": "ST_BARCODE_LOCALIZATION",
            "ImageParameterName": "ip",
            "StageArray": [
              {
                "Stage": "SST_LOCALIZE_CANDIDATE_BARCODES",
                "LocalizationModes": [
                  {
                    "Mode": "LM_SCAN_DIRECTLY",
                    "ScanDirection": 2
                  },
                  {
                    "Mode": "LM_CONNECTED_BLOCKS"
                  },
                  {
                    "Mode": "LM_NEURAL_NETWORK"
                  }
                ]
              }
            ]
          },
          {
            "Section": "ST_BARCODE_DECODING",
            "ImageParameterName": "ip",
            "StageArray": [
              {
                "Stage": "SST_DECODE_BARCODES",
                "DeblurModes": null
              }
            ]
          }
        ]
      }
    ],
    "ImageParameterOptions": [
      {
        "ApplicableStages": [
          {
            "ImageScaleSetting": {
              "EdgeLengthThreshold": 100000,
              "ScaleType": "ST_SCALE_DOWN"
            },
            "Stage": "SST_SCALE_IMAGE"
          },
          {
            "Stage": "SST_TRANSFORM_GRAYSCALE",
            "GrayscaleTransformationModes": [
              {
                "Mode": "GTM_ORIGINAL"
              },
              {
                "Mode": "GTM_INVERTED"
              }
            ]
          }
        ],
        "Name": "ip"
      }
    ]
  },
  ReadQR: {
    "GlobalParameter": {
      "IntraOpNumThreads": 2
    },
    "CaptureVisionTemplates": [
      {
        "ImageROIProcessingNameArray": [
          "ROI_QR"
        ],
        "Name": "ReadQR",
        "MaxParallelTasks": 0,
        "Timeout": 1000
      },
      {
        "ImageROIProcessingNameArray": [
          "ROI_QR_ReadRate"
        ],
        "Name": "ReadQR_ReadRate",
        "MaxParallelTasks": 0,
        "Timeout": 10000
      }
    ],
    "TargetROIDefOptions": [
      {
        "Name": "ROI_QR",
        "TaskSettingNameArray": [
          "Task_QR"
        ]
      },
      {
        "Name": "ROI_QR_ReadRate",
        "TaskSettingNameArray": [
          "Task_QR_ReadRate"
        ]
      }
    ],
    "BarcodeFormatSpecificationOptions": [
      {
        "BarcodeFormatIds": [
          "BF_QR_CODE"
        ],
        "EnableQRCodeModel1": 1,
        "Name": "FS_0"
      }
    ],
    "BarcodeReaderTaskSettingOptions": [
      {
        "Name": "Task_QR",
        "BarcodeFormatIds": [
          "BF_QR_CODE"
        ],
        "BarcodeFormatSpecificationNameArray": [
          "FS_0"
        ],
        "ExpectedBarcodesCount": 1,
        "MaxThreadsInOneTask": 1,
        "SectionArray": [
          {
            "Section": "ST_BARCODE_LOCALIZATION",
            "ImageParameterName": "ip",
            "StageArray": [
              {
                "Stage": "SST_LOCALIZE_CANDIDATE_BARCODES",
                "LocalizationModes": [
                  {
                    "Mode": "LM_CONNECTED_BLOCKS"
                  }
                ]
              }
            ]
          },
          {
            "Section": "ST_BARCODE_DECODING",
            "ImageParameterName": "ip",
            "StageArray": [
              {
                "Stage": "SST_DECODE_BARCODES",
                "DeblurModes": [
                  {
                    "Mode": "DM_BASED_ON_LOC_BIN"
                  },
                  {
                    "Mode": "DM_DIRECT_BINARIZATION"
                  },
                  {
                    "Mode": "DM_DEEP_ANALYSIS"
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        "Name": "Task_QR_ReadRate",
        "BarcodeFormatIds": [
          "BF_QR_CODE"
        ],
        "BarcodeFormatSpecificationNameArray": [
          "FS_0"
        ],
        "ExpectedBarcodesCount": 1,
        "MaxThreadsInOneTask": 1,
        "SectionArray": [
          {
            "Section": "ST_BARCODE_LOCALIZATION",
            "ImageParameterName": "ip",
            "StageArray": [
              {
                "Stage": "SST_LOCALIZE_CANDIDATE_BARCODES",
                "LocalizationModes": [
                  {
                    "Mode": "LM_CONNECTED_BLOCKS"
                  },
                  {
                    "Mode": "LM_LINES"
                  },
                  {
                    "Mode": "LM_NEURAL_NETWORK"
                  }
                ]
              }
            ]
          },
          {
            "Section": "ST_BARCODE_DECODING",
            "ImageParameterName": "ip",
            "StageArray": [
              {
                "Stage": "SST_DECODE_BARCODES",
                "DeblurModes": null
              }
            ]
          }
        ]
      }
    ],
    "ImageParameterOptions": [
      {
        "ApplicableStages": [
          {
            "ImageScaleSetting": {
              "EdgeLengthThreshold": 100000,
              "ScaleType": "ST_SCALE_DOWN"
            },
            "Stage": "SST_SCALE_IMAGE"
          },
          {
            "Stage": "SST_TRANSFORM_GRAYSCALE",
            "GrayscaleTransformationModes": [
              {
                "Mode": "GTM_ORIGINAL"
              },
              {
                "Mode": "GTM_INVERTED"
              }
            ]
          }
        ],
        "Name": "ip"
      }
    ]
  },
  ReadVIN: {
    "BarcodeReaderTaskSettingOptions": [
      {
        "Name": "task_vin_barcode",
        "MaxThreadsInOneTask": 1,
        "ExpectedBarcodesCount": 1,
        "BarcodeFormatIds": [
          "BF_CODE_39",
          "BF_CODE_128",
          "BF_CODE_93",
          "BF_CODABAR",
          "BF_ITF",
          "BF_INDUSTRIAL_25",
          "BF_CODE_39_EXTENDED",
          "BF_QR_CODE",
          "BF_DATAMATRIX"
        ],
        "SectionArray": [
          {
            "Section": "ST_BARCODE_LOCALIZATION",
            "ImageParameterName": "ip",
            "StageArray": [
              {
                "LocalizationModes": [
                  {
                    "Mode": "LM_CONNECTED_BLOCKS"
                  },
                  {
                    "Mode": "LM_SCAN_DIRECTLY"
                  }
                ],
                "Stage": "SST_LOCALIZE_CANDIDATE_BARCODES"
              },
              {
                "Stage": "SST_LOCALIZE_BARCODES"
              }
            ]
          },
          {
            "Section": "ST_BARCODE_DECODING",
            "ImageParameterName": "ip",
            "StageArray": [
              {
                "DeblurModes": [
                  {
                    "Mode": "DM_BASED_ON_LOC_BIN"
                  },
                  {
                    "Mode": "DM_THRESHOLD_BINARIZATION"
                  },
                  {
                    "Mode": "DM_DEEP_ANALYSIS"
                  }
                ],
                "Stage": "SST_DECODE_BARCODES"
              }
            ]
          }
        ]
      }
    ],
    "CaptureVisionTemplates": [
      {
        "Name": "ReadVIN",
        "ImageROIProcessingNameArray": [
          "roi_vin_barcode"
        ]
      }
    ],
    "ImageParameterOptions": [
      {
        "Name": "ip",
        "ApplicableStages": [
          {
            "Stage": "SST_INPUT_COLOR_IMAGE"
          },
          {
            "ImageScaleSetting": {
              "EdgeLengthThreshold": 100000,
              "ScaleType": "ST_SCALE_DOWN"
            },
            "Stage": "SST_SCALE_IMAGE"
          },
          {
            "Stage": "SST_CONVERT_TO_GRAYSCALE"
          },
          {
            "Stage": "SST_TRANSFORM_GRAYSCALE",
            "GrayscaleTransformationModes": [
              {
                "Mode": "GTM_ORIGINAL"
              },
              {
                "Mode": "GTM_INVERTED"
              }
            ]
          },
          {
            "Stage": "SST_ENHANCE_GRAYSCALE"
          },
          {
            "Stage": "SST_BINARIZE_IMAGE"
          },
          {
            "Stage": "SST_DETECT_TEXTURE"
          },
          {
            "Stage": "SST_REMOVE_TEXTURE_FROM_GRAYSCALE"
          },
          {
            "Stage": "SST_BINARIZE_TEXTURE_REMOVED_GRAYSCALE"
          },
          {
            "Stage": "SST_FIND_CONTOURS"
          },
          {
            "Stage": "SST_DETECT_SHORTLINES"
          },
          {
            "Stage": "SST_ASSEMBLE_LINES"
          },
          {
            "Stage": "SST_DETECT_TEXT_ZONES"
          },
          {
            "Stage": "SST_REMOVE_TEXT_ZONES_FROM_BINARY"
          }
        ]
      }
    ],
    "TargetROIDefOptions": [
      {
        "Name": "roi_vin_barcode",
        "TaskSettingNameArray": [
          "task_vin_barcode"
        ]
      }
    ]
  }
}