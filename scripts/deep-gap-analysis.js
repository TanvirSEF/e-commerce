import fs from 'fs';
import path from 'path';

const LARAVEL_DIR = '/Users/macminim2/Desktop/ecommerce/install';
const NEXT_DIR = '/Users/macminim2/Desktop/Huipper/e-commerce';

function walk(dir, extFilter = null) {
  let results = [];
  if (!fs.existsSync(dir)) return results;
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(filePath, extFilter));
    } else {
      if (!extFilter || file.endsWith(extFilter)) {
        results.push(filePath);
      }
    }
  }
  return results;
}

// 1. Analyze routes in Laravel
const routeFiles = [
  'web.php', 'admin.php', 'seller.php', 'affiliate.php', 'auction.php',
  'club_points.php', 'delivery_boy.php', 'offline_payment.php', 'otp.php',
  'pos.php', 'preorder.php', 'refund_request.php', 'seller_package.php',
  'wholesale.php', 'pathao.php', 'redx.php', 'steadfast.php', 'uddoktapay.php'
];

const routeAnalysis = {};

routeFiles.forEach(rf => {
  const fullPath = path.join(LARAVEL_DIR, 'routes', rf);
  if (fs.existsSync(fullPath)) {
    const content = fs.readFileSync(fullPath, 'utf8');
    // Extract Route::get, post, etc.
    const matches = [...content.matchAll(/Route::(get|post|put|delete|any|resource)\s*\(\s*['"]([^'"]+)['"]/g)];
    routeAnalysis[rf] = {
      count: matches.length,
      routes: matches.map(m => ({ method: m[1], uri: m[2] }))
    };
  }
});

// 2. Next.js app pages list
const nextPages = walk(path.join(NEXT_DIR, 'src/app'), 'page.tsx')
  .map(p => path.relative(path.join(NEXT_DIR, 'src/app'), p).replace('/page.tsx', '').replace('page.tsx', '/'));

// 3. Breakdown of backend views
const backendViews = walk(path.join(LARAVEL_DIR, 'resources/views/backend'), '.blade.php')
  .map(p => path.relative(path.join(LARAVEL_DIR, 'resources/views/backend'), p));

const backendGroups = {};
backendViews.forEach(bv => {
  const parts = bv.split(path.sep);
  const group = parts.length > 1 ? parts[0] : 'root';
  if (!backendGroups[group]) backendGroups[group] = [];
  backendGroups[group].push(bv);
});

// 4. Breakdown of frontend views
const frontendViews = walk(path.join(LARAVEL_DIR, 'resources/views/frontend'), '.blade.php')
  .map(p => path.relative(path.join(LARAVEL_DIR, 'resources/views/frontend'), p));

const frontendGroups = {};
frontendViews.forEach(fv => {
  const parts = fv.split(path.sep);
  const group = parts.length > 1 ? parts[0] : 'root';
  if (!frontendGroups[group]) frontendGroups[group] = [];
  frontendGroups[group].push(fv);
});

// 5. Breakdown of seller views
const sellerViews = walk(path.join(LARAVEL_DIR, 'resources/views/seller'), '.blade.php')
  .map(p => path.relative(path.join(LARAVEL_DIR, 'resources/views/seller'), p));

// 6. Breakdown of delivery boy views
const deliveryViews = walk(path.join(LARAVEL_DIR, 'resources/views/delivery_boys'), '.blade.php')
  .map(p => path.relative(path.join(LARAVEL_DIR, 'resources/views/delivery_boys'), p));

// 7. Check Next.js admin routes
const nextAdminPages = nextPages.filter(p => p.startsWith('admin/'));
const nextSellerPages = nextPages.filter(p => p.startsWith('seller/'));
const nextCustomerPages = nextPages.filter(p => p.startsWith('dashboard/'));
const nextStorefrontPages = nextPages.filter(p => !p.startsWith('admin/') && !p.startsWith('seller/') && !p.startsWith('dashboard/'));

const analysisResult = {
  routeStats: Object.keys(routeAnalysis).map(k => ({ file: k, count: routeAnalysis[k].count })),
  laravelBackendGroups: Object.keys(backendGroups).map(k => ({ group: k, viewCount: backendGroups[k].length, views: backendGroups[k] })),
  laravelFrontendGroups: Object.keys(frontendGroups).map(k => ({ group: k, viewCount: frontendGroups[k].length, views: frontendGroups[k] })),
  laravelSellerViewCount: sellerViews.length,
  laravelSellerViews: sellerViews,
  laravelDeliveryViewCount: deliveryViews.length,
  laravelDeliveryViews: deliveryViews,
  nextPageCounts: {
    total: nextPages.length,
    admin: nextAdminPages.length,
    seller: nextSellerPages.length,
    customer: nextCustomerPages.length,
    storefront: nextStorefrontPages.length
  },
  nextAdminPages,
  nextSellerPages,
  nextCustomerPages,
  nextStorefrontPages
};

fs.writeFileSync(path.join(NEXT_DIR, 'scripts/deep-gap-analysis.json'), JSON.stringify(analysisResult, null, 2));
console.log('Deep gap analysis completed. Written to scripts/deep-gap-analysis.json');
