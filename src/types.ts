export type ParsedDataFailed = {
  exception: boolean;
  message: string;
  text: string;
};

export type ParsedField = Array<
  Array<{
    FieldName: string;
    Value?: string;
    ChildFields?: ParsedField;
  }>
>;

export type ExtendedMediaTrackCapabilities = MediaTrackCapabilities & { torch?: boolean; focusMode?: any };
