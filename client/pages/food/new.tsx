import Router from "next/router";
import React from "react";
import Layout from "../../components/common/Layout";
import {
  AddProductWithUnitsComponent,
  Role,
} from "../../graphql/generated/apollo";
import {
  FormController,
  FormView,
} from "../../components/default/product/Form";
import { authorized, AuthData } from "../../lib/nextjs/authorized";
import { Context } from "../../types/Context";
import { redirect } from "../../lib/nextjs/redirect";

class NewProductProps {
  authData: AuthData;
}

class ProductNew extends React.PureComponent<NewProductProps> {
  async getInitialProps(props: Context) {
    const authData = await authorized(props, [Role.Admin]);
    if (!authData.isLoggedIn) {
      redirect(props, "/access-denied");
      return;
    }
    return { authData };
  }

  render() {
    const { authData } = this.props;
    return (
      <Layout authData={authData}>
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
                    Router.push("/admin/product");
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
