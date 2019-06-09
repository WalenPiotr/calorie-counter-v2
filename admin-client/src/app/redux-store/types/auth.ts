export enum AuthTypes {
  ME = "ME",
  ME_STARTED = "ME_STARTED",
  ME_SUCCESS = "ME_SUCCESS",
  ME_FAILURE = "ME_FAILURE",
}

export interface Me {
  id: number;
  role: string;
  email: string;
  displayName: string;
  externalId: string;
  provider: string;
  createdAt: string;
  updatedAt: string;
  status: string;
}
