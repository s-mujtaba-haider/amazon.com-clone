// Normalises the DummyJSON catalog (https://dummyjson.com/products?limit=0) into data/products.json.
// Usage: curl -s "https://dummyjson.com/products?limit=0" -o data/raw.json && node scripts/build-catalog.mjs
import fs from 'node:fs';

const raw = JSON.parse(fs.readFileSync('data/raw.json', 'utf8')).products;
const products = raw.map(p => ({
  id: p.id,
  title: p.title,
  description: p.description,
  category: p.category,
  brand: p.brand ?? null,
  price: p.price,
  discountPercentage: p.discountPercentage,
  rating: p.rating,
  stock: p.stock,
  tags: p.tags,
  warranty: p.warrantyInformation,
  shipping: p.shippingInformation,
  availability: p.availabilityStatus,
  returnPolicy: p.returnPolicy,
  reviews: p.reviews.map(r => ({ rating: r.rating, comment: r.comment, date: r.date, name: r.reviewerName })),
  images: p.images,
  thumbnail: p.thumbnail,
}));
fs.writeFileSync('data/products.json', JSON.stringify(products));
console.log(`wrote ${products.length} products`);
