export const linkTypeDefs = `
  extend type User {
    products: [Product]
  }

  extend type Product {
    createdBy: User
    updatedBy: User
  }
`;
