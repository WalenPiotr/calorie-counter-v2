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

export type AddProductWithUnitsInput = {
  newProduct: ProductInput;
  newUnits: Array<UnitInput>;
};

export type AddUnitInput = {
  newUnit: UnitInput;
  productId: Scalars["ID"];
};

export type DeleteProductInput = {
  id: Scalars["ID"];
};

export type EntriesWithCount = {
  __typename?: "EntriesWithCount";
  items: Array<Entry>;
  count: Scalars["Float"];
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

export type GetEntriesByCreatedById = {
  id: Scalars["ID"];
};

export type GetEntriesByMealId = {
  mealId: Scalars["ID"];
};

export type GetEntriesByUpdatedById = {
  id: Scalars["ID"];
};

export type GetMealByDateArgs = {
  date: Scalars["DateTime"];
};

export type GetMealsByCreatedById = {
  id: Scalars["ID"];
};

export type GetMealsByUpdatedById = {
  id: Scalars["ID"];
};

export type GetProductsByCreatedById = {
  id: Scalars["ID"];
};

export type GetProductsByUpdatedById = {
  id: Scalars["ID"];
};

export type GetReportArgs = {
  productId?: Maybe<Scalars["Float"]>;
};

export type GetReportsByCreatedById = {
  id: Scalars["ID"];
};

export type GetUnitsByCreatedById = {
  id: Scalars["ID"];
};

export type GetUnitsByProductIdArgs = {
  productId: Scalars["ID"];
};

export type GetUnitsByUpdatedById = {
  id: Scalars["ID"];
};

export type GetUserInput = {
  id: Scalars["ID"];
};

export type Meal = {
  __typename?: "Meal";
  id: Scalars["ID"];
  name: Scalars["String"];
  date: Scalars["DateTime"];
  createdById: Scalars["ID"];
  createdAt: Scalars["DateTime"];
  updatedById: Scalars["ID"];
  updatedAt?: Maybe<Scalars["DateTime"]>;
  entries: EntriesWithCount;
  createdBy?: Maybe<User>;
  updatedBy?: Maybe<User>;
};

export type MealEntriesArgs = {
  pagination?: Maybe<PaginationInput>;
};

export type MealInput = {
  name: Scalars["String"];
  date: Scalars["DateTime"];
};

export type MealsWithCount = {
  __typename?: "MealsWithCount";
  items: Array<Meal>;
  count: Scalars["Float"];
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
  setReportStatus: Scalars["Boolean"];
  reportProduct: Scalars["Boolean"];
  addUnit: Unit;
  removeUnit: Scalars["Boolean"];
  addProduct: Product;
  addProductWithUnits: Product;
  deleteProduct: Scalars["Boolean"];
  updateProduct: Scalars["Boolean"];
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

export type MutationAddProductArgs = {
  data: AddProductInput;
};

export type MutationAddProductWithUnitsArgs = {
  data: AddProductWithUnitsInput;
};

export type MutationDeleteProductArgs = {
  data: DeleteProductInput;
};

export type MutationUpdateProductArgs = {
  data: UpdateProductInput;
};

export type MutationUpdateMeArgs = {
  data: UpdateMeInput;
};

export type MutationUpdateUserArgs = {
  data: UpdateUserInput;
};

export type PaginationInput = {
  skip?: Maybe<Scalars["Int"]>;
  take?: Maybe<Scalars["Int"]>;
};

export type Product = {
  __typename?: "Product";
  id: Scalars["ID"];
  name: Scalars["String"];
  createdById: Scalars["ID"];
  createdAt: Scalars["DateTime"];
  updatedById: Scalars["ID"];
  updatedAt?: Maybe<Scalars["DateTime"]>;
  units: UnitsWithCount;
  reports: ReportsWithCount;
  entries: EntriesWithCount;
  hasBeenReportedByMe: Scalars["Boolean"];
  createdBy?: Maybe<User>;
  updatedBy?: Maybe<User>;
};

export type ProductUnitsArgs = {
  pagination?: Maybe<PaginationInput>;
};

export type ProductReportsArgs = {
  pagination?: Maybe<PaginationInput>;
};

export type ProductEntriesArgs = {
  pagination?: Maybe<PaginationInput>;
};

export type ProductInput = {
  name: Scalars["String"];
};

export type ProductsWithCount = {
  __typename?: "ProductsWithCount";
  count: Scalars["Float"];
  items: Array<Product>;
};

export enum Provider {
  Google = "GOOGLE"
}

export type Query = {
  __typename?: "Query";
  getMyEntriesByMealId: EntriesWithCount;
  getEntriesByCreatedById: EntriesWithCount;
  getEntriesByUpdatedById: EntriesWithCount;
  getMealsByDate: Array<Meal>;
  getMealsByCreatedById: MealsWithCount;
  getMealsByUpdatedById: MealsWithCount;
  getReports: ReportsWithCount;
  getReportsByCreatedById: ReportsWithCount;
  getUnitsByProductId: UnitsWithCount;
  getUnitsByCreatedById: UnitsWithCount;
  getUnitsByUpdatedById: UnitsWithCount;
  searchProducts: ProductsWithCount;
  getProductsByCreatedById: ProductsWithCount;
  getProductsByUpdatedById: ProductsWithCount;
  me?: Maybe<User>;
  searchUser: UsersWithCount;
  getUserById: User;
};

export type QueryGetMyEntriesByMealIdArgs = {
  pagination?: Maybe<PaginationInput>;
  data: GetEntriesByMealId;
};

export type QueryGetEntriesByCreatedByIdArgs = {
  pagination?: Maybe<PaginationInput>;
  data: GetEntriesByCreatedById;
};

export type QueryGetEntriesByUpdatedByIdArgs = {
  pagination?: Maybe<PaginationInput>;
  data: GetEntriesByUpdatedById;
};

export type QueryGetMealsByDateArgs = {
  pagination?: Maybe<PaginationInput>;
  data: GetMealByDateArgs;
};

export type QueryGetMealsByCreatedByIdArgs = {
  pagination?: Maybe<PaginationInput>;
  data: GetMealsByCreatedById;
};

export type QueryGetMealsByUpdatedByIdArgs = {
  pagination?: Maybe<PaginationInput>;
  data: GetMealsByUpdatedById;
};

export type QueryGetReportsArgs = {
  pagination?: Maybe<PaginationInput>;
  data: GetReportArgs;
};

export type QueryGetReportsByCreatedByIdArgs = {
  pagination?: Maybe<PaginationInput>;
  data: GetReportsByCreatedById;
};

export type QueryGetUnitsByProductIdArgs = {
  pagination?: Maybe<PaginationInput>;
  data: GetUnitsByProductIdArgs;
};

export type QueryGetUnitsByCreatedByIdArgs = {
  pagination?: Maybe<PaginationInput>;
  data: GetUnitsByCreatedById;
};

export type QueryGetUnitsByUpdatedByIdArgs = {
  pagination?: Maybe<PaginationInput>;
  data: GetUnitsByUpdatedById;
};

export type QuerySearchProductsArgs = {
  pagination?: Maybe<PaginationInput>;
  data: SearchProductsInput;
};

export type QueryGetProductsByCreatedByIdArgs = {
  pagination?: Maybe<PaginationInput>;
  data: GetProductsByCreatedById;
};

export type QueryGetProductsByUpdatedByIdArgs = {
  pagination?: Maybe<PaginationInput>;
  data: GetProductsByUpdatedById;
};

export type QuerySearchUserArgs = {
  pagination?: Maybe<PaginationInput>;
  data: SearchUserInput;
};

export type QueryGetUserByIdArgs = {
  data: GetUserInput;
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

export type ReportsWithCount = {
  __typename?: "ReportsWithCount";
  items: Array<Report>;
  count: Scalars["Float"];
};

export enum Role {
  User = "USER",
  Admin = "ADMIN"
}

export type SearchProductsInput = {
  name: Scalars["String"];
};

export type SearchUserInput = {
  email: Scalars["String"];
};

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

export type UnitsWithCount = {
  __typename?: "UnitsWithCount";
  items: Array<Unit>;
  count: Scalars["Float"];
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
  createdEntries?: Maybe<EntriesWithCount>;
  updatedEntries?: Maybe<EntriesWithCount>;
  createdMeals?: Maybe<MealsWithCount>;
  updatedMeals?: Maybe<MealsWithCount>;
  createdProducts?: Maybe<ProductsWithCount>;
  updatedProducts?: Maybe<ProductsWithCount>;
  createdReports?: Maybe<ReportsWithCount>;
  createdUnits?: Maybe<UnitsWithCount>;
  updatedUnits?: Maybe<UnitsWithCount>;
};

export type UserInput = {
  displayName: Scalars["String"];
  status: Status;
  role: Role;
};

export type UsersWithCount = {
  __typename?: "UsersWithCount";
  items: Array<User>;
  count: Scalars["Float"];
};

export type ValidateReportInput = {
  id: Scalars["Float"];
  status: ReportStatus;
};
export type MeQueryVariables = {};

export type MeQuery = { __typename?: "Query" } & {
  me: Maybe<
    { __typename?: "User" } & Pick<
      User,
      "id" | "email" | "displayName" | "role"
    >
  >;
};

export type SearchProductsQueryVariables = {
  name: Scalars["String"];
  skip?: Maybe<Scalars["Int"]>;
  take?: Maybe<Scalars["Int"]>;
};

export type SearchProductsQuery = { __typename?: "Query" } & {
  searchProducts: { __typename?: "ProductsWithCount" } & Pick<
    ProductsWithCount,
    "count"
  > & {
      items: Array<
        { __typename?: "Product" } & Pick<
          Product,
          "id" | "name" | "createdAt" | "updatedAt"
        > & {
            createdBy: Maybe<
              { __typename?: "User" } & Pick<User, "id" | "displayName">
            >;
            updatedBy: Maybe<
              { __typename?: "User" } & Pick<User, "id" | "displayName">
            >;
            reports: { __typename?: "ReportsWithCount" } & Pick<
              ReportsWithCount,
              "count"
            >;
          }
      >;
    };
};

export type AddProductWithUnitsMutationVariables = {
  newUnits: Array<UnitInput>;
  newProduct: ProductInput;
};

export type AddProductWithUnitsMutation = { __typename?: "Mutation" } & {
  addProductWithUnits: { __typename?: "Product" } & Pick<Product, "id">;
};

export type SearchUserQueryVariables = {
  email: Scalars["String"];
};

export type SearchUserQuery = { __typename?: "Query" } & {
  searchUser: { __typename?: "UsersWithCount" } & Pick<
    UsersWithCount,
    "count"
  > & {
      items: Array<
        { __typename?: "User" } & Pick<
          User,
          | "id"
          | "email"
          | "displayName"
          | "role"
          | "provider"
          | "status"
          | "createdAt"
          | "updatedAt"
        >
      >;
    };
};

export const MeDocument = gql`
  query Me {
    me {
      id
      email
      displayName
      role
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
export const SearchProductsDocument = gql`
  query searchProducts($name: String!, $skip: Int, $take: Int) {
    searchProducts(
      data: { name: $name }
      pagination: { take: $take, skip: $skip }
    ) {
      count
      items {
        id
        name
        createdAt
        createdBy {
          id
          displayName
        }
        updatedAt
        updatedBy {
          id
          displayName
        }
        reports {
          count
        }
      }
    }
  }
`;
export type SearchProductsComponentProps = Omit<
  ReactApollo.QueryProps<SearchProductsQuery, SearchProductsQueryVariables>,
  "query"
> &
  ({ variables: SearchProductsQueryVariables; skip?: false } | { skip: true });

export const SearchProductsComponent = (
  props: SearchProductsComponentProps
) => (
  <ReactApollo.Query<SearchProductsQuery, SearchProductsQueryVariables>
    query={SearchProductsDocument}
    {...props}
  />
);

export type SearchProductsProps<TChildProps = {}> = Partial<
  ReactApollo.DataProps<SearchProductsQuery, SearchProductsQueryVariables>
> &
  TChildProps;
export function withSearchProducts<TProps, TChildProps = {}>(
  operationOptions?: ReactApollo.OperationOption<
    TProps,
    SearchProductsQuery,
    SearchProductsQueryVariables,
    SearchProductsProps<TChildProps>
  >
) {
  return ReactApollo.withQuery<
    TProps,
    SearchProductsQuery,
    SearchProductsQueryVariables,
    SearchProductsProps<TChildProps>
  >(SearchProductsDocument, {
    alias: "withSearchProducts",
    ...operationOptions
  });
}
export const AddProductWithUnitsDocument = gql`
  mutation addProductWithUnits(
    $newUnits: [UnitInput!]!
    $newProduct: ProductInput!
  ) {
    addProductWithUnits(
      data: { newUnits: $newUnits, newProduct: $newProduct }
    ) {
      id
    }
  }
`;
export type AddProductWithUnitsMutationFn = ReactApollo.MutationFn<
  AddProductWithUnitsMutation,
  AddProductWithUnitsMutationVariables
>;
export type AddProductWithUnitsComponentProps = Omit<
  ReactApollo.MutationProps<
    AddProductWithUnitsMutation,
    AddProductWithUnitsMutationVariables
  >,
  "mutation"
>;

export const AddProductWithUnitsComponent = (
  props: AddProductWithUnitsComponentProps
) => (
  <ReactApollo.Mutation<
    AddProductWithUnitsMutation,
    AddProductWithUnitsMutationVariables
  >
    mutation={AddProductWithUnitsDocument}
    {...props}
  />
);

export type AddProductWithUnitsProps<TChildProps = {}> = Partial<
  ReactApollo.MutateProps<
    AddProductWithUnitsMutation,
    AddProductWithUnitsMutationVariables
  >
> &
  TChildProps;
export function withAddProductWithUnits<TProps, TChildProps = {}>(
  operationOptions?: ReactApollo.OperationOption<
    TProps,
    AddProductWithUnitsMutation,
    AddProductWithUnitsMutationVariables,
    AddProductWithUnitsProps<TChildProps>
  >
) {
  return ReactApollo.withMutation<
    TProps,
    AddProductWithUnitsMutation,
    AddProductWithUnitsMutationVariables,
    AddProductWithUnitsProps<TChildProps>
  >(AddProductWithUnitsDocument, {
    alias: "withAddProductWithUnits",
    ...operationOptions
  });
}
export const SearchUserDocument = gql`
  query searchUser($email: String!) {
    searchUser(data: { email: $email }) {
      count
      items {
        id
        email
        displayName
        role
        provider
        status
        createdAt
        updatedAt
      }
    }
  }
`;
export type SearchUserComponentProps = Omit<
  ReactApollo.QueryProps<SearchUserQuery, SearchUserQueryVariables>,
  "query"
> &
  ({ variables: SearchUserQueryVariables; skip?: false } | { skip: true });

export const SearchUserComponent = (props: SearchUserComponentProps) => (
  <ReactApollo.Query<SearchUserQuery, SearchUserQueryVariables>
    query={SearchUserDocument}
    {...props}
  />
);

export type SearchUserProps<TChildProps = {}> = Partial<
  ReactApollo.DataProps<SearchUserQuery, SearchUserQueryVariables>
> &
  TChildProps;
export function withSearchUser<TProps, TChildProps = {}>(
  operationOptions?: ReactApollo.OperationOption<
    TProps,
    SearchUserQuery,
    SearchUserQueryVariables,
    SearchUserProps<TChildProps>
  >
) {
  return ReactApollo.withQuery<
    TProps,
    SearchUserQuery,
    SearchUserQueryVariables,
    SearchUserProps<TChildProps>
  >(SearchUserDocument, {
    alias: "withSearchUser",
    ...operationOptions
  });
}
