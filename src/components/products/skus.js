import React, { Component } from "react"
import { graphql, StaticQuery } from "gatsby"
import SkuCard from "./skuCard"

const containerStyles = {
  display: "flex",
  flexDirection: "row",
  flexWrap: "wrap",
  justifyContent: "space-between",
  padding: "1rem 0 1rem 0",
}

class Skus extends Component {
  render() {
    return (
      <StaticQuery
        query={graphql`
          query SkusForProduct {
            skus: allStripeSku {
              edges {
                node {
                  id
                  currency
                  price
                  attributes {
                    name
                  }
                }
              }
            }
          }
        `}
        render={({ skus }) => (
          <div style={containerStyles}>
            {skus.edges.map(({ node: sku }) => (
              <SkuCard
                key={sku.id}
                sku={sku}
                onAddToCart={this.props.onAddToCart}
              />
            ))}
          </div>
        )}
      />
    )
  }
}

export default Skus
