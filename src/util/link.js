const slugify = require('slugify')

exports.getProductUrl = ({ name, created }) =>
  `/products/${slugify(name)}-${created}`
