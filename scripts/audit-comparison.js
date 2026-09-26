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

console.log('=== 1. LARAVEL CODEBASE SCAN ===');
const laravelViews = walk(path.join(LARAVEL_DIR, 'resources/views'), '.blade.php');
console.log(`Total Blade Views: ${laravelViews.length}`);

const viewsByFolder = {};
laravelViews.forEach(v => {
  const rel = path.relative(path.join(LARAVEL_DIR, 'resources/views'), v);
  const topDir = rel.split(path.sep)[0];
  viewsByFolder[topDir] = (viewsByFolder[topDir] || 0) + 1;
});
console.log('Views by folder:', JSON.stringify(viewsByFolder, null, 2));

const laravelControllers = walk(path.join(LARAVEL_DIR, 'app/Http/Controllers'), '.php');
console.log(`Total Controllers: ${laravelControllers.length}`);

const laravelModels = walk(path.join(LARAVEL_DIR, 'app/Models'), '.php');
console.log(`Total Models: ${laravelModels.length}`);

const routeFiles = fs.existsSync(path.join(LARAVEL_DIR, 'routes')) 
  ? fs.readdirSync(path.join(LARAVEL_DIR, 'routes')) 
  : [];
console.log('Route files in Laravel:', routeFiles);

console.log('\n=== 2. NEXT.JS CODEBASE SCAN ===');
const nextPages = walk(path.join(NEXT_DIR, 'src/app'), 'page.tsx');
console.log(`Total Next.js Pages: ${nextPages.length}`);

const nextApiRoutes = walk(path.join(NEXT_DIR, 'src/app'), 'route.ts');
console.log(`Total Next.js API Routes: ${nextApiRoutes.length}`);

const nextComponents = walk(path.join(NEXT_DIR, 'src/components'), '.tsx');
console.log(`Total Next.js Global Components: ${nextComponents.length}`);

const nextServices = walk(path.join(NEXT_DIR, 'src/services'), '.ts');
console.log(`Total Next.js Services: ${nextServices.length}`);

const nextSchemas = walk(path.join(NEXT_DIR, 'src/db/schema'), '.ts');
console.log(`Total Next.js Schemas: ${nextSchemas.length}`);

console.log('\n=== 3. DETAILED ROUTE & PAGE AUDIT ===');
// Categorize Laravel views
const frontendViews = laravelViews.filter(v => v.includes('/views/frontend/')).map(v => path.relative(path.join(LARAVEL_DIR, 'resources/views/frontend'), v));
const backendViews = laravelViews.filter(v => v.includes('/views/backend/')).map(v => path.relative(path.join(LARAVEL_DIR, 'resources/views/backend'), v));
const sellerViews = laravelViews.filter(v => v.includes('/views/seller/')).map(v => path.relative(path.join(LARAVEL_DIR, 'resources/views/seller'), v));
const deliveryViews = laravelViews.filter(v => v.includes('/views/delivery_boys/')).map(v => path.relative(path.join(LARAVEL_DIR, 'resources/views/delivery_boys'), v));
const addonViews = laravelViews.filter(v => 
  v.includes('/views/affiliate/') || 
  v.includes('/views/auction/') || 
  v.includes('/views/club_points/') || 
  v.includes('/views/otp_systems/') || 
  v.includes('/views/preorder/') || 
  v.includes('/views/refund_request/') || 
  v.includes('/views/seller_packages/') || 
  v.includes('/views/wholesale/')
).map(v => path.relative(path.join(LARAVEL_DIR, 'resources/views'), v));

// Next.js pages categorized
const nextRelPages = nextPages.map(p => path.relative(path.join(NEXT_DIR, 'src/app'), p));

const summary = {
  counts: {
    laravel: {
      views: laravelViews.length,
      frontend: frontendViews.length,
      backend: backendViews.length,
      seller: sellerViews.length,
      delivery: deliveryViews.length,
      addons: addonViews.length,
      controllers: laravelControllers.length,
      models: laravelModels.length
    },
    nextjs: {
      pages: nextPages.length,
      routes: nextApiRoutes.length,
      components: nextComponents.length,
      services: nextServices.length,
      schemas: nextSchemas.length
    }
  },
  laravelFrontendViews: frontendViews,
  laravelBackendSubfolders: [...new Set(backendViews.map(v => v.split(path.sep)[0]))],
  laravelAddons: [...new Set(addonViews.map(v => v.split(path.sep)[0]))],
  nextPagesList: nextRelPages
};

fs.writeFileSync(path.join(NEXT_DIR, 'scripts/audit-report.json'), JSON.stringify(summary, null, 2));
console.log('Saved audit summary to scripts/audit-report.json');
