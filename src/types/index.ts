export type JwtPayload = {
  emailID: string;
  userID: string;
};

export type JwtPayloadForOffBoardConfirmation = {
  ownerId: number;
  offBoardEmployeeId: number;
  offBoardEmployeeCompanyId: number;
};

export interface HttpSuccessResponse<T> {
  readonly data: T;
}

export interface FailResponse {
  readonly message: string;
  readonly code: number;
}

export interface HttpFailResponse {
  readonly error: FailResponse;
}

export type AddPropertyToObject<
  T,
  K extends string,
  V,
  K2 extends string = never,
  V2 = never,
> = Pick<T, Exclude<keyof T, K>> & Record<K, V> & Partial<Record<K2, V2>>;

export interface expiredDocumentDetailObject {
  companyEmail: string;
  companyName: string;
  expiryDate: string;
  type: string;
}

export type expiredDocumentObject = Record<
  string,
  expiredDocumentDetailObject[]
>;

export interface enquiryCreateSlackMessageObj {
  name: string;
  options: Record<string, any>;
  quantity: number;
  duration: number;
}
