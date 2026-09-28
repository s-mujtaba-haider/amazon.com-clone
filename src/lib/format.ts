export function money(n: number) {
  return n.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
}

/** Splits a price into the pieces used for the big superscript price display. */
export function priceParts(n: number) {
  const [whole, cents] = n.toFixed(2).split('.');
  return { whole: Number(whole).toLocaleString('en-US'), cents };
}

export function listPrice(price: number, discount: number) {
  return price / (1 - discount / 100);
}

export function deliveryDate(daysFromNow: number, from = new Date()) {
  const d = new Date(from);
  d.setDate(d.getDate() + daysFromNow);
  return d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
}

export const FREE_SHIPPING_MIN = 35;
