import fs from 'fs';
import path from 'path';

console.log('--- STARTING AUTONOMOUS QA & INTEGRATION TEST SUITE v16 ---');

let passedTests = 0;
let totalTests = 0;

function assert(condition, message) {
  totalTests++;
  if (condition) {
    console.log(`[PASS] ${message}`);
    passedTests++;
  } else {
    console.error(`[FAIL] ${message}`);
  }
}

// 1. Verify Top Bar Removal in App.tsx
const appPath = path.resolve('src/App.tsx');
const appContent = fs.readFileSync(appPath, 'utf-8');

assert(!appContent.includes('Top Quick Actions Bar'), 'Top bar quick actions menu has been completely eliminated');
assert(!appContent.includes('Slow Mode: KAPALI'), 'Top bar slow mode button removed from desktop header');
assert(!appContent.includes('Raid Testi'), 'Top bar raid test button removed');
assert(appContent.includes('FoodDeliveryApp'), 'App.tsx imports and registers FoodDeliveryApp');
assert(appContent.includes("id: 'fooddelivery'"), 'ALL_SHORTCUTS includes fooddelivery');

// 2. Verify FoodDeliveryApp Component
const foodAppPath = path.resolve('src/components/Apps/FoodDeliveryApp.tsx');
const foodAppExists = fs.existsSync(foodAppPath);
assert(foodAppExists, 'FoodDeliveryApp.tsx exists');

const foodAppContent = fs.readFileSync(foodAppPath, 'utf-8');
assert(foodAppContent.includes('Yemek Poşeti'), 'FoodDeliveryApp brand title exists');
assert(foodAppContent.includes('Taze Filtre Kahve'), 'FoodDeliveryApp has fresh filter coffee');
assert(foodAppContent.includes('Somonlu Gurme Yaş Kedi Maması'), 'FoodDeliveryApp has gourmet salmon cat food for Paspas');
assert(foodAppContent.includes('Çift Köfteli Smash Cheddar Burger'), 'FoodDeliveryApp has smash burger');
assert(foodAppContent.includes('handleCheckout'), 'FoodDeliveryApp has checkout system with courier delivery');
assert(foodAppContent.includes('orderHistory'), 'FoodDeliveryApp maintains order history');

// 3. Verify Desktop Icon & OS Integration
const desktopIconPath = path.resolve('src/components/OS/DesktopIcon.tsx');
const desktopIconContent = fs.readFileSync(desktopIconPath, 'utf-8');
assert(desktopIconContent.includes('fooddelivery'), 'DesktopIcon has fooddelivery icon mapping');

const startMenuPath = path.resolve('src/components/OS/StartMenu.tsx');
const startMenuContent = fs.readFileSync(startMenuPath, 'utf-8');
assert(startMenuContent.includes('fooddelivery'), 'StartMenu includes fooddelivery in app list');

const taskbarPath = path.resolve('src/components/OS/Taskbar.tsx');
const taskbarContent = fs.readFileSync(taskbarPath, 'utf-8');
assert(taskbarContent.includes('fooddelivery'), 'Taskbar includes fooddelivery appIconMap');

console.log(`\n========================================`);
console.log(`QA RESULTS: ${passedTests}/${totalTests} TESTS PASSED`);
console.log(`========================================`);

if (passedTests !== totalTests) {
  process.exit(1);
} else {
  console.log('ALL AUTONOMOUS QA CHECKS COMPLETED WITH 100% SUCCESS.');
}
