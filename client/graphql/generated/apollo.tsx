import gql from "graphql-tag";
import * as ReactApollo from "react-apollo";
import * as React from "react";
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

export type Day = {
  __typename?: "Day";
  date: Scalars["DateTime"];
  mealCount: Scalars["Float"];
  total: Scalars["Float"];
};

export type DaysWithCount = {
  __typename?: "DaysWithCount";
  count: Scalars["Float"];
  items: Array<Day>;
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
  unit: Unit;
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
  unitId: Scalars["ID"];
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

export type GetProductInput = {
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
  updateEntry: Scalars["Boolean"];
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
  updateProductWithUnits: Scalars["Boolean"];
  updateMe: Scalars["Boolean"];
  updateUser: Scalars["Boolean"];
};

export type MutationAddEntryArgs = {
  data: AddEntryInput;
};

export type MutationUpdateEntryArgs = {
  data: UpdateEntryInput;
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

export type MutationUpdateProductWithUnitsArgs = {
  data: UpdateProductWithUnitsInput;
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
  getMyEnergyValue: Scalars["Float"];
  getDaysWithMyMeals: DaysWithCount;
  getMealsByDate: MealsWithCount;
  getMealsByCreatedById: MealsWithCount;
  getMealsByUpdatedById: MealsWithCount;
  getReports: ReportsWithCount;
  getReportsByCreatedById: ReportsWithCount;
  getUnitsByProductId: UnitsWithCount;
  getUnitsByCreatedById: UnitsWithCount;
  getUnitsByUpdatedById: UnitsWithCount;
  searchProducts: ProductsWithCount;
  getProduct: Product;
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

export type QueryGetDaysWithMyMealsArgs = {
  pagination?: Maybe<PaginationInput>;
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

export type QueryGetProductArgs = {
  data: GetProductInput;
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
  entries: EntriesWithCount;
  createdBy?: Maybe<User>;
  updatedBy?: Maybe<User>;
};

export type UnitEntriesArgs = {
  pagination?: Maybe<PaginationInput>;
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

export type UpdateEntryInput = {
  id: Scalars["ID"];
  newEntry: EntryInput;
};

export type UpdateMeInput = {
  me: MeInput;
};

export type UpdateProductInput = {
  id: Scalars["ID"];
  newProduct: ProductInput;
};

export type UpdateProductWithUnitsInput = {
  id: Scalars["ID"];
  newProduct: ProductInput;
  newUnits: Array<UnitInput>;
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

export type UserCreatedEntriesArgs = {
  pagination?: Maybe<PaginationInput>;
};

export type UserUpdatedEntriesArgs = {
  pagination?: Maybe<PaginationInput>;
};

export type UserCreatedMealsArgs = {
  pagination?: Maybe<PaginationInput>;
};

export type UserUpdatedMealsArgs = {
  pagination?: Maybe<PaginationInput>;
};

export type UserCreatedProductsArgs = {
  pagination?: Maybe<PaginationInput>;
};

export type UserUpdatedProductsArgs = {
  pagination?: Maybe<PaginationInput>;
};

export type UserCreatedReportsArgs = {
  pagination?: Maybe<PaginationInput>;
};

export type UserCreatedUnitsArgs = {
  pagination?: Maybe<PaginationInput>;
};

export type UserUpdatedUnitsArgs = {
  pagination?: Maybe<PaginationInput>;
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
export type AddEntryMutationVariables = {
  unitId: Scalars["ID"];
  mealId: Scalars["ID"];
  quantity: Scalars["Float"];
};

export type AddEntryMutation = { __typename?: "Mutation" } & {
  addEntry: { __typename?: "Entry" } & Pick<Entry, "id" | "quantity"> & {
      unit: { __typename?: "Unit" } & Pick<Unit, "id" | "name" | "energy"> & {
          product: { __typename?: "Product" } & Pick<Product, "id" | "name">;
        };
    };
};

export type RemoveEntryMutationVariables = {
  id: Scalars["ID"];
};

export type RemoveEntryMutation = { __typename?: "Mutation" } & Pick<
  Mutation,
  "removeEntry"
>;

export type UpdateEntryMutationVariables = {
  id: Scalars["ID"];
  newEntry: EntryInput;
};

export type UpdateEntryMutation = { __typename?: "Mutation" } & Pick<
  Mutation,
  "updateEntry"
>;

export type MeQueryVariables = {};

export type MeQuery = { __typename?: "Query" } & {
  me: Maybe<
    { __typename?: "User" } & Pick<
      User,
      "id" | "email" | "displayName" | "role"
    >
  >;
};

export type GetMealsByDateQueryVariables = {
  date: Scalars["DateTime"];
};

export type GetMealsByDateQuery = { __typename?: "Query" } & {
  getMealsByDate: { __typename?: "MealsWithCount" } & {
    items: Array<
      { __typename?: "Meal" } & Pick<Meal, "id" | "name" | "date"> & {
          entries: { __typename?: "EntriesWithCount" } & Pick<
            EntriesWithCount,
            "count"
          > & {
              items: Array<
                { __typename?: "Entry" } & Pick<Entry, "id" | "quantity"> & {
                    unit: { __typename?: "Unit" } & Pick<
                      Unit,
                      "id" | "name" | "energy"
                    > & {
                        product: { __typename?: "Product" } & Pick<
                          Product,
                          "id" | "name"
                        > & {
                            units: { __typename?: "UnitsWithCount" } & {
                              items: Array<
                                { __typename?: "Unit" } & Pick<
                                  Unit,
                                  "id" | "name" | "energy"
                                >
                              >;
                            };
                          };
                      };
                  }
              >;
            };
        }
    >;
  };
};

export type AddMealMutationVariables = {
  name: Scalars["String"];
  date: Scalars["DateTime"];
};

export type AddMealMutation = { __typename?: "Mutation" } & {
  addMeal: { __typename?: "Meal" } & Pick<Meal, "id" | "name" | "date">;
};

export type GetDaysWithMealsQueryVariables = {
  pagination?: Maybe<PaginationInput>;
};

export type GetDaysWithMealsQuery = { __typename?: "Query" } & {
  getDaysWithMyMeals: { __typename?: "DaysWithCount" } & Pick<
    DaysWithCount,
    "count"
  > & {
      items: Array<
        { __typename?: "Day" } & Pick<Day, "date" | "mealCount" | "total">
      >;
    };
};

export type GetMyEnergyValueQueryVariables = {};

export type GetMyEnergyValueQuery = { __typename?: "Query" } & Pick<
  Query,
  "getMyEnergyValue"
>;

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
            units: { __typename?: "UnitsWithCount" } & Pick<
              UnitsWithCount,
              "count"
            >;
          }
      >;
    };
};

export type SearchFoodsQueryVariables = {
  name: Scalars["String"];
  skip?: Maybe<Scalars["Int"]>;
  take?: Maybe<Scalars["Int"]>;
};

export type SearchFoodsQuery = { __typename?: "Query" } & {
  searchProducts: { __typename?: "ProductsWithCount" } & Pick<
    ProductsWithCount,
    "count"
  > & {
      items: Array<
        { __typename?: "Product" } & Pick<Product, "id" | "name"> & {
            units: { __typename?: "UnitsWithCount" } & Pick<
              UnitsWithCount,
              "count"
            > & {
                items: Array<
                  { __typename?: "Unit" } & Pick<Unit, "id" | "name" | "energy">
                >;
              };
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

export type GetProductQueryVariables = {
  id: Scalars["ID"];
  reportPagination?: Maybe<PaginationInput>;
  unitPagination?: Maybe<PaginationInput>;
};

export type GetProductQuery = { __typename?: "Query" } & {
  getProduct: { __typename?: "Product" } & Pick<
    Product,
    "id" | "name" | "createdAt"
  > & {
      createdBy: Maybe<
        { __typename?: "User" } & Pick<User, "id" | "displayName" | "email">
      >;
      reports: { __typename?: "ReportsWithCount" } & Pick<
        ReportsWithCount,
        "count"
      > & {
          items: Array<
            { __typename?: "Report" } & Pick<
              Report,
              "id" | "reason" | "message" | "status" | "createdAt"
            > & {
                createdBy: Maybe<
                  { __typename?: "User" } & Pick<
                    User,
                    "id" | "displayName" | "email"
                  >
                >;
              }
          >;
        };
      units: { __typename?: "UnitsWithCount" } & Pick<
        UnitsWithCount,
        "count"
      > & {
          items: Array<
            { __typename?: "Unit" } & Pick<Unit, "id" | "name" | "energy">
          >;
        };
    };
};

export type DeleteProductMutationVariables = {
  id: Scalars["ID"];
};

export type DeleteProductMutation = { __typename?: "Mutation" } & Pick<
  Mutation,
  "deleteProduct"
>;

export type UpdateProductWithUnitsMutationVariables = {
  id: Scalars["ID"];
  newUnits: Array<UnitInput>;
  newProduct: ProductInput;
};

export type UpdateProductWithUnitsMutation = { __typename?: "Mutation" } & Pick<
  Mutation,
  "updateProductWithUnits"
>;

export type ReportProductMutationVariables = {
  id: Scalars["ID"];
  message: Scalars["String"];
  reason: ReportReason;
};

export type ReportProductMutation = { __typename?: "Mutation" } & Pick<
  Mutation,
  "reportProduct"
>;

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

export type GetUserQueryVariables = {
  id: Scalars["ID"];
  productPagination?: Maybe<PaginationInput>;
  reportPagination?: Maybe<PaginationInput>;
};

export type GetUserQuery = { __typename?: "Query" } & {
  getUserById: { __typename?: "User" } & Pick<
    User,
    | "id"
    | "email"
    | "displayName"
    | "role"
    | "provider"
    | "status"
    | "createdAt"
    | "updatedAt"
  > & {
      createdProducts: Maybe<
        { __typename?: "ProductsWithCount" } & Pick<
          ProductsWithCount,
          "count"
        > & {
            items: Array<
              { __typename?: "Product" } & Pick<
                Product,
                "id" | "name" | "createdAt"
              > & {
                  units: { __typename?: "UnitsWithCount" } & Pick<
                    UnitsWithCount,
                    "count"
                  >;
                }
            >;
          }
      >;
      createdReports: Maybe<
        { __typename?: "ReportsWithCount" } & Pick<
          ReportsWithCount,
          "count"
        > & {
            items: Array<
              { __typename?: "Report" } & Pick<
                Report,
                "id" | "reason" | "message" | "status" | "createdAt"
              > & {
                  product: { __typename?: "Product" } & Pick<
                    Product,
                    "id" | "name"
                  >;
                }
            >;
          }
      >;
    };
};

export const AddEntryDocument = gql`
  mutation addEntry($unitId: ID!, $mealId: ID!, $quantity: Float!) {
    addEntry(
      data: {
        newEntry: { unitId: $unitId, mealId: $mealId, quantity: $quantity }
      }
    ) {
      id
      unit {
        id
        name
        energy
        product {
          id
          name
        }
      }
      quantity
    }
  }
`;
export type AddEntryMutationFn = ReactApollo.MutationFn<
  AddEntryMutation,
  AddEntryMutationVariables
>;
export type AddEntryComponentProps = Omit<
  ReactApollo.MutationProps<AddEntryMutation, AddEntryMutationVariables>,
  "mutation"
>;

export const AddEntryComponent = (props: AddEntryComponentProps) => (
  <ReactApollo.Mutation<AddEntryMutation, AddEntryMutationVariables>
    mutation={AddEntryDocument}
    {...props}
  />
);

export type AddEntryProps<TChildProps = {}> = Partial<
  ReactApollo.MutateProps<AddEntryMutation, AddEntryMutationVariables>
> &
  TChildProps;
export function withAddEntry<TProps, TChildProps = {}>(
  operationOptions?: ReactApollo.OperationOption<
    TProps,
    AddEntryMutation,
    AddEntryMutationVariables,
    AddEntryProps<TChildProps>
  >
) {
  return ReactApollo.withMutation<
    TProps,
    AddEntryMutation,
    AddEntryMutationVariables,
    AddEntryProps<TChildProps>
  >(AddEntryDocument, {
    alias: "withAddEntry",
    ...operationOptions
  });
}
export const RemoveEntryDocument = gql`
  mutation removeEntry($id: ID!) {
    removeEntry(data: { id: $id })
  }
`;
export type RemoveEntryMutationFn = ReactApollo.MutationFn<
  RemoveEntryMutation,
  RemoveEntryMutationVariables
>;
export type RemoveEntryComponentProps = Omit<
  ReactApollo.MutationProps<RemoveEntryMutation, RemoveEntryMutationVariables>,
  "mutation"
>;

export const RemoveEntryComponent = (props: RemoveEntryComponentProps) => (
  <ReactApollo.Mutation<RemoveEntryMutation, RemoveEntryMutationVariables>
    mutation={RemoveEntryDocument}
    {...props}
  />
);

export type RemoveEntryProps<TChildProps = {}> = Partial<
  ReactApollo.MutateProps<RemoveEntryMutation, RemoveEntryMutationVariables>
> &
  TChildProps;
export function withRemoveEntry<TProps, TChildProps = {}>(
  operationOptions?: ReactApollo.OperationOption<
    TProps,
    RemoveEntryMutation,
    RemoveEntryMutationVariables,
    RemoveEntryProps<TChildProps>
  >
) {
  return ReactApollo.withMutation<
    TProps,
    RemoveEntryMutation,
    RemoveEntryMutationVariables,
    RemoveEntryProps<TChildProps>
  >(RemoveEntryDocument, {
    alias: "withRemoveEntry",
    ...operationOptions
  });
}
export const UpdateEntryDocument = gql`
  mutation updateEntry($id: ID!, $newEntry: EntryInput!) {
    updateEntry(data: { id: $id, newEntry: $newEntry })
  }
`;
export type UpdateEntryMutationFn = ReactApollo.MutationFn<
  UpdateEntryMutation,
  UpdateEntryMutationVariables
>;
export type UpdateEntryComponentProps = Omit<
  ReactApollo.MutationProps<UpdateEntryMutation, UpdateEntryMutationVariables>,
  "mutation"
>;

export const UpdateEntryComponent = (props: UpdateEntryComponentProps) => (
  <ReactApollo.Mutation<UpdateEntryMutation, UpdateEntryMutationVariables>
    mutation={UpdateEntryDocument}
    {...props}
  />
);

export type UpdateEntryProps<TChildProps = {}> = Partial<
  ReactApollo.MutateProps<UpdateEntryMutation, UpdateEntryMutationVariables>
> &
  TChildProps;
export function withUpdateEntry<TProps, TChildProps = {}>(
  operationOptions?: ReactApollo.OperationOption<
    TProps,
    UpdateEntryMutation,
    UpdateEntryMutationVariables,
    UpdateEntryProps<TChildProps>
  >
) {
  return ReactApollo.withMutation<
    TProps,
    UpdateEntryMutation,
    UpdateEntryMutationVariables,
    UpdateEntryProps<TChildProps>
  >(UpdateEntryDocument, {
    alias: "withUpdateEntry",
    ...operationOptions
  });
}
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
export const GetMealsByDateDocument = gql`
  query getMealsByDate($date: DateTime!) {
    getMealsByDate(data: { date: $date }) {
      items {
        id
        name
        date
        entries {
          count
          items {
            id
            quantity
            unit {
              id
              name
              energy
              product {
                id
                name
                units {
                  items {
                    id
                    name
                    energy
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;
export type GetMealsByDateComponentProps = Omit<
  ReactApollo.QueryProps<GetMealsByDateQuery, GetMealsByDateQueryVariables>,
  "query"
> &
  ({ variables: GetMealsByDateQueryVariables; skip?: false } | { skip: true });

export const GetMealsByDateComponent = (
  props: GetMealsByDateComponentProps
) => (
  <ReactApollo.Query<GetMealsByDateQuery, GetMealsByDateQueryVariables>
    query={GetMealsByDateDocument}
    {...props}
  />
);

export type GetMealsByDateProps<TChildProps = {}> = Partial<
  ReactApollo.DataProps<GetMealsByDateQuery, GetMealsByDateQueryVariables>
> &
  TChildProps;
export function withGetMealsByDate<TProps, TChildProps = {}>(
  operationOptions?: ReactApollo.OperationOption<
    TProps,
    GetMealsByDateQuery,
    GetMealsByDateQueryVariables,
    GetMealsByDateProps<TChildProps>
  >
) {
  return ReactApollo.withQuery<
    TProps,
    GetMealsByDateQuery,
    GetMealsByDateQueryVariables,
    GetMealsByDateProps<TChildProps>
  >(GetMealsByDateDocument, {
    alias: "withGetMealsByDate",
    ...operationOptions
  });
}
export const AddMealDocument = gql`
  mutation addMeal($name: String!, $date: DateTime!) {
    addMeal(data: { newMeal: { name: $name, date: $date } }) {
      id
      name
      date
    }
  }
`;
export type AddMealMutationFn = ReactApollo.MutationFn<
  AddMealMutation,
  AddMealMutationVariables
>;
export type AddMealComponentProps = Omit<
  ReactApollo.MutationProps<AddMealMutation, AddMealMutationVariables>,
  "mutation"
>;

export const AddMealComponent = (props: AddMealComponentProps) => (
  <ReactApollo.Mutation<AddMealMutation, AddMealMutationVariables>
    mutation={AddMealDocument}
    {...props}
  />
);

export type AddMealProps<TChildProps = {}> = Partial<
  ReactApollo.MutateProps<AddMealMutation, AddMealMutationVariables>
> &
  TChildProps;
export function withAddMeal<TProps, TChildProps = {}>(
  operationOptions?: ReactApollo.OperationOption<
    TProps,
    AddMealMutation,
    AddMealMutationVariables,
    AddMealProps<TChildProps>
  >
) {
  return ReactApollo.withMutation<
    TProps,
    AddMealMutation,
    AddMealMutationVariables,
    AddMealProps<TChildProps>
  >(AddMealDocument, {
    alias: "withAddMeal",
    ...operationOptions
  });
}
export const GetDaysWithMealsDocument = gql`
  query getDaysWithMeals($pagination: PaginationInput) {
    getDaysWithMyMeals(pagination: $pagination) {
      count
      items {
        date
        mealCount
        total
      }
    }
  }
`;
export type GetDaysWithMealsComponentProps = Omit<
  ReactApollo.QueryProps<GetDaysWithMealsQuery, GetDaysWithMealsQueryVariables>,
  "query"
>;

export const GetDaysWithMealsComponent = (
  props: GetDaysWithMealsComponentProps
) => (
  <ReactApollo.Query<GetDaysWithMealsQuery, GetDaysWithMealsQueryVariables>
    query={GetDaysWithMealsDocument}
    {...props}
  />
);

export type GetDaysWithMealsProps<TChildProps = {}> = Partial<
  ReactApollo.DataProps<GetDaysWithMealsQuery, GetDaysWithMealsQueryVariables>
> &
  TChildProps;
export function withGetDaysWithMeals<TProps, TChildProps = {}>(
  operationOptions?: ReactApollo.OperationOption<
    TProps,
    GetDaysWithMealsQuery,
    GetDaysWithMealsQueryVariables,
    GetDaysWithMealsProps<TChildProps>
  >
) {
  return ReactApollo.withQuery<
    TProps,
    GetDaysWithMealsQuery,
    GetDaysWithMealsQueryVariables,
    GetDaysWithMealsProps<TChildProps>
  >(GetDaysWithMealsDocument, {
    alias: "withGetDaysWithMeals",
    ...operationOptions
  });
}
export const GetMyEnergyValueDocument = gql`
  query getMyEnergyValue {
    getMyEnergyValue
  }
`;
export type GetMyEnergyValueComponentProps = Omit<
  ReactApollo.QueryProps<GetMyEnergyValueQuery, GetMyEnergyValueQueryVariables>,
  "query"
>;

export const GetMyEnergyValueComponent = (
  props: GetMyEnergyValueComponentProps
) => (
  <ReactApollo.Query<GetMyEnergyValueQuery, GetMyEnergyValueQueryVariables>
    query={GetMyEnergyValueDocument}
    {...props}
  />
);

export type GetMyEnergyValueProps<TChildProps = {}> = Partial<
  ReactApollo.DataProps<GetMyEnergyValueQuery, GetMyEnergyValueQueryVariables>
> &
  TChildProps;
export function withGetMyEnergyValue<TProps, TChildProps = {}>(
  operationOptions?: ReactApollo.OperationOption<
    TProps,
    GetMyEnergyValueQuery,
    GetMyEnergyValueQueryVariables,
    GetMyEnergyValueProps<TChildProps>
  >
) {
  return ReactApollo.withQuery<
    TProps,
    GetMyEnergyValueQuery,
    GetMyEnergyValueQueryVariables,
    GetMyEnergyValueProps<TChildProps>
  >(GetMyEnergyValueDocument, {
    alias: "withGetMyEnergyValue",
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
        units {
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
export const SearchFoodsDocument = gql`
  query searchFoods($name: String!, $skip: Int, $take: Int) {
    searchProducts(
      data: { name: $name }
      pagination: { take: $take, skip: $skip }
    ) {
      count
      items {
        id
        name
        units {
          count
          items {
            id
            name
            energy
          }
        }
      }
    }
  }
`;
export type SearchFoodsComponentProps = Omit<
  ReactApollo.QueryProps<SearchFoodsQuery, SearchFoodsQueryVariables>,
  "query"
> &
  ({ variables: SearchFoodsQueryVariables; skip?: false } | { skip: true });

export const SearchFoodsComponent = (props: SearchFoodsComponentProps) => (
  <ReactApollo.Query<SearchFoodsQuery, SearchFoodsQueryVariables>
    query={SearchFoodsDocument}
    {...props}
  />
);

export type SearchFoodsProps<TChildProps = {}> = Partial<
  ReactApollo.DataProps<SearchFoodsQuery, SearchFoodsQueryVariables>
> &
  TChildProps;
export function withSearchFoods<TProps, TChildProps = {}>(
  operationOptions?: ReactApollo.OperationOption<
    TProps,
    SearchFoodsQuery,
    SearchFoodsQueryVariables,
    SearchFoodsProps<TChildProps>
  >
) {
  return ReactApollo.withQuery<
    TProps,
    SearchFoodsQuery,
    SearchFoodsQueryVariables,
    SearchFoodsProps<TChildProps>
  >(SearchFoodsDocument, {
    alias: "withSearchFoods",
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
export const GetProductDocument = gql`
  query getProduct(
    $id: ID!
    $reportPagination: PaginationInput
    $unitPagination: PaginationInput
  ) {
    getProduct(data: { id: $id }) {
      id
      name
      createdAt
      createdBy {
        id
        displayName
        email
      }
      reports(pagination: $reportPagination) {
        count
        items {
          id
          reason
          message
          status
          createdBy {
            id
            displayName
            email
          }
          createdAt
        }
      }
      units(pagination: $unitPagination) {
        count
        items {
          id
          name
          energy
        }
      }
    }
  }
`;
export type GetProductComponentProps = Omit<
  ReactApollo.QueryProps<GetProductQuery, GetProductQueryVariables>,
  "query"
> &
  ({ variables: GetProductQueryVariables; skip?: false } | { skip: true });

export const GetProductComponent = (props: GetProductComponentProps) => (
  <ReactApollo.Query<GetProductQuery, GetProductQueryVariables>
    query={GetProductDocument}
    {...props}
  />
);

export type GetProductProps<TChildProps = {}> = Partial<
  ReactApollo.DataProps<GetProductQuery, GetProductQueryVariables>
> &
  TChildProps;
export function withGetProduct<TProps, TChildProps = {}>(
  operationOptions?: ReactApollo.OperationOption<
    TProps,
    GetProductQuery,
    GetProductQueryVariables,
    GetProductProps<TChildProps>
  >
) {
  return ReactApollo.withQuery<
    TProps,
    GetProductQuery,
    GetProductQueryVariables,
    GetProductProps<TChildProps>
  >(GetProductDocument, {
    alias: "withGetProduct",
    ...operationOptions
  });
}
export const DeleteProductDocument = gql`
  mutation deleteProduct($id: ID!) {
    deleteProduct(data: { id: $id })
  }
`;
export type DeleteProductMutationFn = ReactApollo.MutationFn<
  DeleteProductMutation,
  DeleteProductMutationVariables
>;
export type DeleteProductComponentProps = Omit<
  ReactApollo.MutationProps<
    DeleteProductMutation,
    DeleteProductMutationVariables
  >,
  "mutation"
>;

export const DeleteProductComponent = (props: DeleteProductComponentProps) => (
  <ReactApollo.Mutation<DeleteProductMutation, DeleteProductMutationVariables>
    mutation={DeleteProductDocument}
    {...props}
  />
);

export type DeleteProductProps<TChildProps = {}> = Partial<
  ReactApollo.MutateProps<DeleteProductMutation, DeleteProductMutationVariables>
> &
  TChildProps;
export function withDeleteProduct<TProps, TChildProps = {}>(
  operationOptions?: ReactApollo.OperationOption<
    TProps,
    DeleteProductMutation,
    DeleteProductMutationVariables,
    DeleteProductProps<TChildProps>
  >
) {
  return ReactApollo.withMutation<
    TProps,
    DeleteProductMutation,
    DeleteProductMutationVariables,
    DeleteProductProps<TChildProps>
  >(DeleteProductDocument, {
    alias: "withDeleteProduct",
    ...operationOptions
  });
}
export const UpdateProductWithUnitsDocument = gql`
  mutation updateProductWithUnits(
    $id: ID!
    $newUnits: [UnitInput!]!
    $newProduct: ProductInput!
  ) {
    updateProductWithUnits(
      data: { id: $id, newProduct: $newProduct, newUnits: $newUnits }
    )
  }
`;
export type UpdateProductWithUnitsMutationFn = ReactApollo.MutationFn<
  UpdateProductWithUnitsMutation,
  UpdateProductWithUnitsMutationVariables
>;
export type UpdateProductWithUnitsComponentProps = Omit<
  ReactApollo.MutationProps<
    UpdateProductWithUnitsMutation,
    UpdateProductWithUnitsMutationVariables
  >,
  "mutation"
>;

export const UpdateProductWithUnitsComponent = (
  props: UpdateProductWithUnitsComponentProps
) => (
  <ReactApollo.Mutation<
    UpdateProductWithUnitsMutation,
    UpdateProductWithUnitsMutationVariables
  >
    mutation={UpdateProductWithUnitsDocument}
    {...props}
  />
);

export type UpdateProductWithUnitsProps<TChildProps = {}> = Partial<
  ReactApollo.MutateProps<
    UpdateProductWithUnitsMutation,
    UpdateProductWithUnitsMutationVariables
  >
> &
  TChildProps;
export function withUpdateProductWithUnits<TProps, TChildProps = {}>(
  operationOptions?: ReactApollo.OperationOption<
    TProps,
    UpdateProductWithUnitsMutation,
    UpdateProductWithUnitsMutationVariables,
    UpdateProductWithUnitsProps<TChildProps>
  >
) {
  return ReactApollo.withMutation<
    TProps,
    UpdateProductWithUnitsMutation,
    UpdateProductWithUnitsMutationVariables,
    UpdateProductWithUnitsProps<TChildProps>
  >(UpdateProductWithUnitsDocument, {
    alias: "withUpdateProductWithUnits",
    ...operationOptions
  });
}
export const ReportProductDocument = gql`
  mutation reportProduct($id: ID!, $message: String!, $reason: ReportReason!) {
    reportProduct(data: { productId: $id, message: $message, reason: $reason })
  }
`;
export type ReportProductMutationFn = ReactApollo.MutationFn<
  ReportProductMutation,
  ReportProductMutationVariables
>;
export type ReportProductComponentProps = Omit<
  ReactApollo.MutationProps<
    ReportProductMutation,
    ReportProductMutationVariables
  >,
  "mutation"
>;

export const ReportProductComponent = (props: ReportProductComponentProps) => (
  <ReactApollo.Mutation<ReportProductMutation, ReportProductMutationVariables>
    mutation={ReportProductDocument}
    {...props}
  />
);

export type ReportProductProps<TChildProps = {}> = Partial<
  ReactApollo.MutateProps<ReportProductMutation, ReportProductMutationVariables>
> &
  TChildProps;
export function withReportProduct<TProps, TChildProps = {}>(
  operationOptions?: ReactApollo.OperationOption<
    TProps,
    ReportProductMutation,
    ReportProductMutationVariables,
    ReportProductProps<TChildProps>
  >
) {
  return ReactApollo.withMutation<
    TProps,
    ReportProductMutation,
    ReportProductMutationVariables,
    ReportProductProps<TChildProps>
  >(ReportProductDocument, {
    alias: "withReportProduct",
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
export const GetUserDocument = gql`
  query getUser(
    $id: ID!
    $productPagination: PaginationInput
    $reportPagination: PaginationInput
  ) {
    getUserById(data: { id: $id }) {
      id
      email
      displayName
      role
      provider
      status
      createdAt
      updatedAt
      createdProducts(pagination: $productPagination) {
        count
        items {
          id
          name
          createdAt
          units {
            count
          }
        }
      }
      createdReports(pagination: $reportPagination) {
        count
        items {
          id
          reason
          message
          status
          createdAt
          product {
            id
            name
          }
        }
      }
    }
  }
`;
export type GetUserComponentProps = Omit<
  ReactApollo.QueryProps<GetUserQuery, GetUserQueryVariables>,
  "query"
> &
  ({ variables: GetUserQueryVariables; skip?: false } | { skip: true });

export const GetUserComponent = (props: GetUserComponentProps) => (
  <ReactApollo.Query<GetUserQuery, GetUserQueryVariables>
    query={GetUserDocument}
    {...props}
  />
);

export type GetUserProps<TChildProps = {}> = Partial<
  ReactApollo.DataProps<GetUserQuery, GetUserQueryVariables>
> &
  TChildProps;
export function withGetUser<TProps, TChildProps = {}>(
  operationOptions?: ReactApollo.OperationOption<
    TProps,
    GetUserQuery,
    GetUserQueryVariables,
    GetUserProps<TChildProps>
  >
) {
  return ReactApollo.withQuery<
    TProps,
    GetUserQuery,
    GetUserQueryVariables,
    GetUserProps<TChildProps>
  >(GetUserDocument, {
    alias: "withGetUser",
    ...operationOptions
  });
}
