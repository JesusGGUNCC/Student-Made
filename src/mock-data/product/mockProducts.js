export const mockProducts = [
  {
    "name": "Nike Special Running Shoes",
    "price": 120.00,
    "rating": 4.5,
    "image_url": "/assets/nike-shoes.png"
  },
  {
    "name": "Adidas Backpack",
    "price": 79.99,
    "rating": 4.3,
    "image_url": "/assets/adidas-backpack.png"
  },
  {
    "name": "Apple AirPods Pro",
    "price": 249.99,
    "rating": 4.7,
    "image_url": "/assets/airpeds.png"
  },
  {
    "name": "Hydro Flask Water Bottle",
    "price": 44.95,
    "rating": 4.8,
    "image_url": "/assets/flask.png"
  }
]

  
  // Mock fetchProducts function
  export function fetchMockProducts() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockProducts);
      }, 500); // simulate slight network delay
    });
  }
  