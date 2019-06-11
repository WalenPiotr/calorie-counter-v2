import gql from "graphql-tag";
import * as React from "react";
import * as ReactApollo from "react-apollo";
export type Maybe<T> = T | null;
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** The javascript `Date` as string. Type represents date and time as the ISO Date string. */
  DateTime: any;
};

export type AddEntryInput = {
  newEntry: EntryInput;
};

export type AddMealInput = {
  newMeal: MealInput;
};

export type AddProductInput = {
  newProduct: ProductInput;
};

export type AddUnitInput = {
  newUnit: UnitInput;
  productId: Scalars["ID"];
};

export type DeleteProductInput = {
  id: Scalars["ID"];
};

export type Entry = {
  __typename?: "Entry";
  id: Scalars["ID"];
  product: Product;
  quantity: Scalars["Float"];
  meal: Meal;
  createdById: Scalars["ID"];
  createdAt: Scalars["DateTime"];
  updatedById: Scalars["ID"];
  updatedAt?: Maybe<Scalars["DateTime"]>;
  createdBy?: Maybe<User>;
  updatedBy?: Maybe<User>;
};

export type EntryInput = {
  productId: Scalars["ID"];
  mealId: Scalars["ID"];
  quantity: Scalars["Float"];
};

export type Meal = {
  __typename?: "Meal";
  id: Scalars["ID"];
  name: Scalars["String"];
  entries: Array<Entry>;
  date: Scalars["DateTime"];
  createdById: Scalars["ID"];
  createdAt: Scalars["DateTime"];
  updatedById: Scalars["ID"];
  updatedAt?: Maybe<Scalars["DateTime"]>;
  createdBy?: Maybe<User>;
  updatedBy?: Maybe<User>;
};

export type MealInput = {
  name: Scalars["String"];
  date: Scalars["DateTime"];
};

export type MeInput = {
  displayName: Scalars["String"];
};

export type Mutation = {
  __typename?: "Mutation";
  addEntry: Entry;
  removeEntry: Scalars["Boolean"];
  addMeal: Meal;
  removeMeal: Scalars["Boolean"];
  addProduct: Product;
  deleteProduct: Scalars["Boolean"];
  updateProduct: Scalars["Boolean"];
  setReportStatus: Scalars["Boolean"];
  reportProduct: Scalars["Boolean"];
  addUnit: Unit;
  removeUnit: Scalars["Boolean"];
  updateMe: Scalars["Boolean"];
  updateUser: Scalars["Boolean"];
};

export type MutationAddEntryArgs = {
  data: AddEntryInput;
};

export type MutationRemoveEntryArgs = {
  data: RemoveEntryInput;
};

export type MutationAddMealArgs = {
  data: AddMealInput;
};

export type MutationRemoveMealArgs = {
  data: RemoveMealInput;
};

export type MutationAddProductArgs = {
  data: AddProductInput;
};

export type MutationDeleteProductArgs = {
  data: DeleteProductInput;
};

export type MutationUpdateProductArgs = {
  data: UpdateProductInput;
};

export type MutationSetReportStatusArgs = {
  data: ValidateReportInput;
};

export type MutationReportProductArgs = {
  data: ReportProductInput;
};

export type MutationAddUnitArgs = {
  data: AddUnitInput;
};

export type MutationRemoveUnitArgs = {
  data: RemoveUnitInput;
};

export type MutationUpdateMeArgs = {
  data: UpdateMeInput;
};

export type MutationUpdateUserArgs = {
  data: UpdateUserInput;
};

export type Product = {
  __typename?: "Product";
  id: Scalars["ID"];
  name: Scalars["String"];
  units: Array<Unit>;
  entries: Array<Entry>;
  createdById: Scalars["ID"];
  createdAt: Scalars["DateTime"];
  updatedById: Scalars["ID"];
  updatedAt?: Maybe<Scalars["DateTime"]>;
  reports?: Maybe<Array<Report>>;
  hasBeenReportedByMe: Scalars["Boolean"];
  createdBy?: Maybe<User>;
  updatedBy?: Maybe<User>;
};

export type ProductInput = {
  name: Scalars["String"];
};

export enum Provider {
  Google = "GOOGLE"
}

export type Query = {
  __typename?: "Query";
  getEntriesByMealId: Array<Entry>;
  getEntriesByCreatedById: Array<Entry>;
  getEntriesByUpdatedById: Array<Entry>;
  getMealsByDate: Array<Meal>;
  getMealsByCreatedById: Array<Meal>;
  getMealsByUpdatedById: Array<Meal>;
  searchProducts: Array<Product>;
  getProductsByCreatedById: Array<Product>;
  getProductsByUpdatedById: Array<Product>;
  getReports: Report;
  getReportsByCreatedById: Array<Report>;
  getUnitsByProductId: Array<Unit>;
  getUnitsByCreatedById: Array<Unit>;
  getUnitsByUpdatedById: Array<Unit>;
  me?: Maybe<User>;
  searchUser: User;
  getUserById: User;
};

export type QueryGetEntriesByMealIdArgs = {
  mealId: Scalars["ID"];
};

export type QueryGetEntriesByCreatedByIdArgs = {
  id: Scalars["ID"];
};

export type QueryGetEntriesByUpdatedByIdArgs = {
  id: Scalars["ID"];
};

export type QueryGetMealsByDateArgs = {
  date: Scalars["DateTime"];
};

export type QueryGetMealsByCreatedByIdArgs = {
  id: Scalars["ID"];
};

export type QueryGetMealsByUpdatedByIdArgs = {
  id: Scalars["ID"];
};

export type QuerySearchProductsArgs = {
  name: Scalars["String"];
};

export type QueryGetProductsByCreatedByIdArgs = {
  id: Scalars["ID"];
};

export type QueryGetProductsByUpdatedByIdArgs = {
  id: Scalars["ID"];
};

export type QueryGetReportsArgs = {
  productId?: Maybe<Scalars["Float"]>;
};

export type QueryGetReportsByCreatedByIdArgs = {
  id: Scalars["ID"];
};

export type QueryGetUnitsByProductIdArgs = {
  productId: Scalars["ID"];
};

export type QueryGetUnitsByCreatedByIdArgs = {
  id: Scalars["ID"];
};

export type QueryGetUnitsByUpdatedByIdArgs = {
  id: Scalars["ID"];
};

export type QuerySearchUserArgs = {
  email: Scalars["String"];
  displayName: Scalars["String"];
  status: Status;
  role: Role;
  provider: Provider;
  createdAt: Scalars["DateTime"];
  updatedAt: Scalars["DateTime"];
};

export type QueryGetUserByIdArgs = {
  id: Scalars["ID"];
};

export type RemoveEntryInput = {
  id: Scalars["ID"];
};

export type RemoveMealInput = {
  id: Scalars["ID"];
};

export type RemoveUnitInput = {
  id: Scalars["ID"];
};

export type Report = {
  __typename?: "Report";
  id: Scalars["ID"];
  reason: ReportReason;
  message: Scalars["String"];
  status: ReportStatus;
  createdById: Scalars["ID"];
  createdAt: Scalars["DateTime"];
  product: Product;
  createdBy?: Maybe<User>;
};

export type ReportProductInput = {
  productId: Scalars["ID"];
  reason: ReportReason;
  message: Scalars["String"];
};

export enum ReportReason {
  Spam = "SPAM",
  Vulgar = "VULGAR",
  Invalid = "INVALID",
  InvalidBase = "INVALID_BASE",
  InvalidUnit = "INVALID_UNIT"
}

export enum ReportStatus {
  Open = "OPEN",
  Closed = "CLOSED"
}

export enum Role {
  User = "USER",
  Admin = "ADMIN"
}

export enum Status {
  Ok = "OK",
  Banned = "BANNED"
}

export type Unit = {
  __typename?: "Unit";
  id: Scalars["ID"];
  name: Scalars["String"];
  product: Product;
  energy: Scalars["Float"];
  createdById: Scalars["ID"];
  createdAt: Scalars["DateTime"];
  updatedById: Scalars["ID"];
  updatedAt?: Maybe<Scalars["DateTime"]>;
  createdBy?: Maybe<User>;
  updatedBy?: Maybe<User>;
};

export type UnitInput = {
  name: Scalars["String"];
  energy: Scalars["Float"];
};

export type UpdateMeInput = {
  me: MeInput;
};

export type UpdateProductInput = {
  id: Scalars["ID"];
  newProduct: ProductInput;
};

export type UpdateUserInput = {
  user: UserInput;
  id: Scalars["ID"];
};

export type User = {
  __typename?: "User";
  id: Scalars["ID"];
  role: Role;
  email: Scalars["String"];
  displayName: Scalars["String"];
  provider: Provider;
  createdAt: Scalars["DateTime"];
  updatedAt: Scalars["DateTime"];
  status: Status;
  createdEntries?: Maybe<Array<Maybe<Entry>>>;
  updatedEntries?: Maybe<Array<Maybe<Entry>>>;
  createdMeals?: Maybe<Array<Maybe<Meal>>>;
  updatedMeals?: Maybe<Array<Maybe<Meal>>>;
  createdProducts?: Maybe<Array<Maybe<Product>>>;
  updatedProducts?: Maybe<Array<Maybe<Product>>>;
  createdReports?: Maybe<Array<Maybe<Report>>>;
  createdUnits?: Maybe<Array<Maybe<Unit>>>;
  updatedUnits?: Maybe<Array<Maybe<Unit>>>;
};

export type UserInput = {
  displayName: Scalars["String"];
  status: Status;
  role: Role;
};

export type ValidateReportInput = {
  id: Scalars["Float"];
  status: ReportStatus;
};
export type MeQueryVariables = {};

export type MeQuery = { __typename?: "Query" } & {
  me: Maybe<{ __typename?: "User" } & Pick<User, "id" | "email">>;
};

export const MeDocument = gql`
  query Me {
    me {
      id
      email
    }
  }
`;
export type MeComponentProps = Omit<
  ReactApollo.QueryProps<MeQuery, MeQueryVariables>,
  "query"
>;

export const MeComponent = (props: MeComponentProps) => (
  <ReactApollo.Query<MeQuery, MeQueryVariables> query={MeDocument} {...props} />
);

export type MeProps<TChildProps = {}> = Partial<
  ReactApollo.DataProps<MeQuery, MeQueryVariables>
> &
  TChildProps;
export function withMe<TProps, TChildProps = {}>(
  operationOptions?: ReactApollo.OperationOption<
    TProps,
    MeQuery,
    MeQueryVariables,
    MeProps<TChildProps>
  >
) {
  return ReactApollo.withQuery<
    TProps,
    MeQuery,
    MeQueryVariables,
    MeProps<TChildProps>
  >(MeDocument, {
    alias: "withMe",
    ...operationOptions
  });
}
