import Router from "next/router";
import React from "react";
import AdminLayout from "../../../components/common/Layout";
import {
  FormController,
  FormView,
} from "../../../components/default/product/Form";
import {
  UpdateProductWithUnitsComponent,
  Role,
  GetProductDocument,
  GetProductQuery,
} from "../../../graphql/generated/apollo";
import { Context } from "../../../types/Context";
import { authorized, AuthData } from "../../../lib/nextjs/authorized";
import { parseString } from "../../../lib/nextjs/parseQueryString";
import { redirect } from "../../../lib/nextjs/redirect";

class ProductEditProps {
  data: GetProductQuery;
  authData: AuthData;
}

class ProductEdit extends React.PureComponent<ProductEditProps> {
  static async getInitialProps(props: Context) {
    const authData = await authorized(props, [Role.Admin]);
    if (!authData.isLoggedIn) {
      redirect(props, "/access-denied");
      return;
    }
    const id = parseString(props.query.id);
    const { apolloClient } = props;
    const { data, errors } = await apolloClient.query({
      query: GetProductDocument,
      variables: { id },
    });
    if (errors && errors.length > 0) {
      redirect(props, "/error");
      return;
    }
    return {
      data,
      authData,
    };
  }

  render() {
    return (
      <AdminLayout authData={this.props.authData}>
        <UpdateProductWithUnitsComponent>
          {(updateProduct, { loading, error }) => (
            <FormController
              initialValues={{
                product: { name: this.props.data.getProduct.name },
                units: this.props.data.getProduct.units.items.map(u => ({
                  energy: u.energy.toString(),
                  name: u.name,
                })),
              }}
              handleSubmit={async (values, setErrors) => {
                try {
                  const result = await updateProduct({
                    variables: {
                      id: this.props.data.getProduct.id,
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
                    // setErrors on form if necessary
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
                  submitText={"Update product"}
                  titleText={"Update product"}
                />
              )}
            </FormController>
          )}
        </UpdateProductWithUnitsComponent>
      </AdminLayout>
    );
  }
}
export default ProductEdit;
