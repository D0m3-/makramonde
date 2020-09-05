const getProducts = ({
  allStripeProduct,
  allStripeSku,
  allContentfulUniqueProduct
}) => {
  const products = allStripeProduct.nodes
    .map(node => {
      const sku =
        allStripeSku &&
        allStripeSku.nodes.find(({ product }) => product.id === node.id)
      return {
        ...node,
        id: sku && sku.id,
        price: sku && sku.price,
        currency: sku && sku.currency,
        categories:
          node.metadata && node.metadata.category
            ? [node.metadata.category]
            : [],
        from: 'stripe'
      }
    })
    .concat(
      allContentfulUniqueProduct.nodes.map(
        ({
          contentful_id,
          title,
          description,
          createdAt,
          updatedAt,
          categories,
          images,
          price
        }) => ({
          id: contentful_id,
          name: title,
          created: new Date(createdAt).getTime(),
          updated: new Date(updatedAt).getTime(),
          categories: categories ? categories.map(({ name }) => name) : [],
          localImages: images && images.map(({ localFile }) => localFile),
          price: price * 100,
          currency: 'EUR',
          richDescription: description ? description.json : undefined,
          from: 'contentful'
        })
      )
    )
  products.sort((a, b) => b.updated - a.updated)
  return products
}

exports.getProducts = getProducts
