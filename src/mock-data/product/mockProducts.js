// src/mock-data/product/mockProducts.js - Enhanced with categories and stock
export const mockProducts = [
  {
    "id": 1,
    "name": "Nike Special Running Shoes",
    "price": 120.00,
    "rating": 4.5,
    "stock": 15,
    "category": "Accessories",
    "description": "Lightweight performance running shoes with advanced cushioning technology",
    "image_url": "/assets/nike-shoes.png"
  },
  {
    "id": 2,
    "name": "Adidas Backpack",
    "price": 79.99,
    "rating": 4.3,
    "stock": 8,
    "category": "Accessories",
    "description": "Durable backpack with laptop compartment and multiple pockets",
    "image_url": "/assets/adidas-backpack.png"
  },
  {
    "id": 3,
    "name": "Apple AirPods Pro",
    "price": 249.99,
    "rating": 4.7,
    "stock": 5,
    "category": "Technology",
    "description": "Wireless earbuds with active noise cancellation and transparency mode",
    "image_url": "/assets/airpeds.png"
  },
  {
    "id": 4,
    "name": "Hydro Flask Water Bottle",
    "price": 44.95,
    "rating": 4.8,
    "stock": 20,
    "category": "Accessories",
    "description": "Double-wall vacuum insulated stainless steel water bottle that keeps beverages cold for 24 hours",
    "image_url": "/assets/flask.png"
  },
  {
    "id": 5,
    "name": "UNCC Niner Pride T-Shirt",
    "price": 24.99,
    "rating": 4.6,
    "stock": 25,
    "category": "School Spirit",
    "description": "Comfortable cotton t-shirt showing off your Niner pride",
    "image_url": "/assets/tshirt.png"
  },
  {
    "id": 6,
    "name": "Handmade Silver Earrings",
    "price": 35.50,
    "rating": 4.9,
    "stock": 7,
    "category": "Jewelry",
    "description": "Elegant silver earrings handcrafted by a UNCC student artisan",
    "image_url": "/assets/earrings.png"
  },
  {
    "id": 7,
    "name": "Charlotte Skyline Print",
    "price": 28.00,
    "rating": 4.4,
    "stock": 12,
    "category": "Prints",
    "description": "Beautiful digital art print of the Charlotte skyline at sunset",
    "image_url": "/assets/skyline.png"
  },
  {
    "id": 8,
    "name": "Handcrafted Wooden Pen",
    "price": 19.95,
    "rating": 4.7,
    "stock": 15,
    "category": "Art",
    "description": "Unique wooden pen handcrafted by a UNCC woodworking student",
    "image_url": "/assets/woodpen.png"
  },
  {
    "id": 9,
    "name": "Crochet Niner Scarf",
    "price": 32.00,
    "rating": 4.6,
    "stock": 9,
    "category": "Crochet",
    "description": "Handmade crochet scarf in UNCC green and gold colors",
    "image_url": "/assets/scarf.png"
  },
  {
    "id": 10,
    "name": "Custom Phone Case",
    "price": 18.50,
    "rating": 4.2,
    "stock": 0,
    "category": "Technology",
    "description": "Customizable phone case with UNCC-themed designs",
    "image_url": "/assets/phonecase.png"
  },
  {
    "id": 11,
    "name": "Handmade Beaded Bracelet",
    "price": 22.99,
    "rating": 4.5,
    "stock": 6,
    "category": "Jewelry",
    "description": "Colorful beaded bracelet made with semi-precious stones",
    "image_url": "/assets/bracelet.png"
  },
  {
    "id": 12,
    "name": "Campus Map Wall Art",
    "price": 39.99,
    "rating": 4.3,
    "stock": 3,
    "category": "Prints",
    "description": "Stylized artistic rendering of the UNCC campus map",
    "image_url": "/assets/campusmap.png"
  }
];
  
  
// Mock fetchProducts function
export function fetchMockProducts() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockProducts);
    }, 500); // simulate slight network delay
  });
}