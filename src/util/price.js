export const formatPrice = (amount, currency) => {
  let price = amount / 100
  let numberFormat = new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: currency,
    currencyDisplay: 'symbol',
    maximumFractionDigits: 0,
    minimumFractionDigits: 0
  })
  return numberFormat.format(price)
}
