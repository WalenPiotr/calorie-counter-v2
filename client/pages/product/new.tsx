import Router from "next/router";
import React from "react";
import Layout from "../../components/Layout";
import { AddProductWithUnitsComponent } from "../../graphql/generated/apollo";
import { FormController, FormView } from "../../components/product/Form";

class NewProductProps {}

class ProductNew extends React.PureComponent<NewProductProps> {
  render() {
    return (
      <Layout>
        <AddProductWithUnitsComponent>
          {(addProduct, { loading, error }) => (
            <FormController
              handleSubmit={async (values, setErrors) => {
                try {
                  const result = await addProduct({
                    variables: {
                      newProduct: values.product,
                      newUnits: values.units.map(u => ({
                        name: u.name,
                        energy: parseFloat(u.energy),
                      })),
                    },
                  });
                  if (!loading && result && result.data) {
                    Router.push("/product");
                  } else if (!loading && result && result.errors) {
                    const { errors } = result;
                    for (const gqlErr of errors) {
                      if (gqlErr.extensions!.code === "DUPLICATE_KEY_VALUE") {
                        setErrors({
                          product: {
                            name: ["product with given name already exists"],
                          },
                        });
                      }
                    }
                  } else {
                    Router.push("/error");
                  }
                } catch (e) {
                  Router.push("/error");
                }
              }}
            >
              {props => (
                <FormView
                  {...props}
                  titleText={"Add product"}
                  submitText={"Add product"}
                />
              )}
            </FormController>
          )}
        </AddProductWithUnitsComponent>
      </Layout>
    );
  }
}
export default ProductNew;
