exports.FRANCE_METRO = "france_metro"
exports.OTHER = "other"

exports.SHIPPING = {
  [this.FRANCE_METRO]: {
    amount: 1500,
    discountFrom: 10000,
    currency: "eur",
    description: "Livraison en France Metropolitaine",
    descriptionDiscount: "Livraison en France Metropolitaine PROMO",
  },
  [this.OTHER]: {
    amount: 3000,
    discountFrom: 20000,
    currency: "eur",
    description: "Livraison en dehors de la France Metropolitaine",
    descriptionDiscount:
      "Livraison en dehors de la France Metropolitaine PROMO",
  },
}

exports.SHIPPING_DISCOUNT_AMOUNT = 1
