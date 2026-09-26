import fs from 'fs';
import path from 'path';

const LARAVEL_DIR = '/Users/macminim2/Desktop/ecommerce/install';
const NEXT_DIR = '/Users/macminim2/Desktop/Huipper/e-commerce';

function walk(dir) {
  let results = [];
  if (!fs.existsSync(dir)) return results;
  fs.readdirSync(dir).forEach(f => {
    let p = path.join(dir, f);
    if (fs.statSync(p).isDirectory()) results.push(...walk(p));
    else results.push(p);
  });
  return results;
}

// 1. Check Seller views
const sellerViews = walk(path.join(LARAVEL_DIR, 'resources/views/seller'))
  .map(p => path.relative(path.join(LARAVEL_DIR, 'resources/views/seller'), p));

const nextSellerPages = walk(path.join(NEXT_DIR, 'src/app/seller'))
  .filter(p => p.endsWith('page.tsx'))
  .map(p => path.relative(path.join(NEXT_DIR, 'src/app/seller'), p));

// 2. Check Customer user views
const customerViews = walk(path.join(LARAVEL_DIR, 'resources/views/frontend/user'))
  .map(p => path.relative(path.join(LARAVEL_DIR, 'resources/views/frontend/user'), p));

const nextDashboardPages = walk(path.join(NEXT_DIR, 'src/app/dashboard'))
  .filter(p => p.endsWith('page.tsx'))
  .map(p => path.relative(path.join(NEXT_DIR, 'src/app/dashboard'), p));

// 3. Check Delivery Boy views
const deliveryViews = walk(path.join(LARAVEL_DIR, 'resources/views/delivery_boys'))
  .map(p => path.relative(path.join(LARAVEL_DIR, 'resources/views/delivery_boys'), p));

const nextDeliveryPages = walk(path.join(NEXT_DIR, 'src/app'))
  .filter(p => p.includes('delivery') && p.endsWith('page.tsx'))
  .map(p => path.relative(path.join(NEXT_DIR, 'src/app'), p));

// 4. Check Setup Configurations in Backend
const setupViews = walk(path.join(LARAVEL_DIR, 'resources/views/backend/setup_configurations'))
  .map(p => path.relative(path.join(LARAVEL_DIR, 'resources/views/backend/setup_configurations'), p));

// 5. Check Payment Methods in Laravel
const paymentControllers = fs.existsSync(path.join(LARAVEL_DIR, 'app/Http/Controllers/Payment'))
  ? fs.readdirSync(path.join(LARAVEL_DIR, 'app/Http/Controllers/Payment'))
  : [];

// 6. Check Courier Controllers in Laravel
const courierFiles = fs.readdirSync(path.join(LARAVEL_DIR, 'app/Http/Controllers'))
  .filter(f => f.toLowerCase().includes('pathao') || f.toLowerCase().includes('redx') || f.toLowerCase().includes('steadfast') || f.toLowerCase().includes('carrier') || f.toLowerCase().includes('shipping'));

const result = {
  seller: {
    laravelViewsCount: sellerViews.length,
    laravelViews: sellerViews,
    nextPagesCount: nextSellerPages.length,
    nextPages: nextSellerPages
  },
  customer: {
    laravelViewsCount: customerViews.length,
    laravelViews: customerViews,
    nextPagesCount: nextDashboardPages.length,
    nextPages: nextDashboardPages
  },
  delivery: {
    laravelViewsCount: deliveryViews.length,
    laravelViews: deliveryViews,
    nextDeliveryPages: nextDeliveryPages
  },
  setupConfigurations: {
    laravelCount: setupViews.length,
    laravelViews: setupViews
  },
  paymentGatewaysInLaravel: paymentControllers,
  couriersInLaravel: courierFiles
};

fs.writeFileSync(path.join(NEXT_DIR, 'scripts/deep-comparison-result.json'), JSON.stringify(result, null, 2));
console.log('Result written to scripts/deep-comparison-result.json');
