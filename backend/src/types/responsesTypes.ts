export interface OneDocumentResponse<T> {
  document: T;
}

export interface TokenDocumentResponse {
  token: String | undefined;
  userType?: String;
}
