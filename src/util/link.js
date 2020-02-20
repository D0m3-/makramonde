const slug = require("slug")

exports.getProductUrl = ({ name, created }) =>
  `/products/${slug(name)}-${created}`
