// pages/menu.js
import { useState } from "react";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";

export default function MenuPage() {
  const [activeCategory, setActiveCategory] = useState("all");

  // Menu categories
  const categories = [
    { id: "all", name: "All Items" },
    { id: "starters", name: "Starters" },
    { id: "main_course", name: "Main Course" },
    { id: "rice_noodles", name: "Rice & Noodles" },
    { id: "beverages", name: "Beverages" },
  ];

  // Menu items
  const menuItems = [
    {
      id: 1,
      name: "Crispy Chilli Babycorn",
      description: "Crispy babycorn tossed in spicy chilli sauce",
      price: 180,
      category: "starters",
      type: "Veg",
      image: "/noodle.jpg", // Replace with your actual image path
      bestseller: true,
    },
    {
      id: 2,
      name: "Veg Spring Rolls",
      description: "Crispy rolls filled with mixed vegetables",
      price: 120,
      category: "starters",
      type: "Veg",
      image: "/noodle.jpg", // Replace with your actual image path
      bestseller: false,
    },
    {
      id: 3,
      name: "Chilli Chicken",
      description: "Tender chicken pieces tossed in spicy chilli sauce",
      price: 250,
      category: "starters",
      type: "Non-Veg",
      image: "/noodle.jpg", // Replace with your actual image path
      bestseller: true,
    },
    {
      id: 4,
      name: "Kung Pao Chicken",
      description: "Chicken with peanuts, vegetables, and chilli peppers",
      price: 270,
      category: "main_course",
      type: "Non-Veg",
      image: "/noodle.jpg.jpg", // Replace with your actual image path
      bestseller: false,
    },
    {
      id: 5,
      name: "Mixed Vegetable in Hot Garlic Sauce",
      description: "Assorted vegetables in spicy garlic sauce",
      price: 220,
      category: "main_course",
      type: "Veg",
      image: "/noodle.jpg", // Replace with your actual image path
      bestseller: false,
    },
    {
      id: 6,
      name: "Hakka Noodles",
      description: "Stir-fried noodles with vegetables in soy sauce",
      price: 180,
      category: "rice_noodles",
      type: "Veg",
      image: "/noodle.jpg", // Replace with your actual image path
      bestseller: true,
    },
    {
      id: 7,
      name: "Chicken Fried Rice",
      description: "Stir-fried rice with chicken pieces and vegetables",
      price: 210,
      category: "rice_noodles",
      type: "Non-Veg",
      image: "/noodle.jpg.jpg", // Replace with your actual image path
      bestseller: false,
    },
    {
      id: 8,
      name: "Honey Chilli Potato",
      description: "Crispy potato strips tossed in honey chilli sauce",
      price: 150,
      category: "starters",
      type: "Veg",
      image: "/noodle.jpg.jpg", // Replace with your actual image path
      bestseller: true,
    },
    {
      id: 9,
      name: "Jasmine Tea",
      description: "Fragrant jasmine-infused green tea",
      price: 80,
      category: "beverages",
      type: "Veg",
      image: "/noodle.jpg", // Replace with your actual image path
      bestseller: false,
    },
    {
      id: 10,
      name: "Mango Smoothie",
      description: "Refreshing smoothie made with fresh mangoes",
      price: 120,
      category: "beverages",
      type: "Veg",
      image: "/noodle.jpg", // Replace with your actual image path
      bestseller: false,
    },
  ];

  // Filter menu items based on active category
  const filteredMenuItems =
    activeCategory === "all"
      ? menuItems
      : menuItems.filter((item) => item.category === activeCategory);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Head>
        <title>Our Menu | Hong's Kitchen</title>
        <meta
          name="description"
          content="Explore the delicious menu offerings at Hong's Kitchen"
        />
      </Head>

      {/* Header with logo */}
      <header className="py-4 px-4 md:px-10 flex justify-center items-center bg-white shadow-sm">
        <Link href="/">
          <div className="w-32 md:w-40 cursor-pointer">
            <img
              src="https://hongskitchen.in/jfl-discovery-ui/public/dist/default/images/global/loginLogoHK.svg"
              alt="Hong's Kitchen Logo"
              className="w-full"
            />
          </div>
        </Link>
      </header>

      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
            Our Menu
          </h1>
          <p className="text-gray-600 mt-2">
            Explore our delicious Chinese cuisine
          </p>
        </div>

        {/* Category tabs */}
        <div className="mb-8 overflow-x-auto">
          <div className="flex space-x-2 md:space-x-4 min-w-max md:justify-center pb-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`px-4 py-2 rounded-full transition-colors ${
                  activeCategory === category.id
                    ? "bg-teal-500 text-white"
                    : "bg-white text-gray-700 hover:bg-gray-100"
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Menu items grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMenuItems.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="relative h-48">
                {/* Replace with your actual image path or use placeholder */}
                <div className="w-full h-full bg-gray-200 relative">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                  {/* {item.bestseller && (
                    <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                      BESTSELLER
                    </div>
                  )} */}
                  <div
                    className={`absolute top-2 left-2 ${
                      item.type === "Veg"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    } text-xs font-medium px-2 py-1 rounded-full`}
                  >
                    {item.type}
                  </div>
                </div>
              </div>

              <div className="p-4">
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-semibold text-gray-800">
                    {item.name}
                  </h3>
                  <span className="font-bold text-red-500">₹{item.price}</span>
                </div>
                <p className="text-sm text-gray-600 mt-1">{item.description}</p>

                <div className="mt-4 flex justify-between items-center">
                  <span className="text-xs text-gray-500 capitalize">
                    {item.category.replace("_", " ")}
                  </span>
                  {/* <button
                    className="bg-teal-500 hover:bg-teal-600 text-white text-sm py-1 px-3 rounded transition-colors"
                    onClick={() => {
                      // Here you would normally add to cart functionality
                      alert(`Added ${item.name} to order`);
                    }}
                  >
                    Add to Order
                  </button> */}
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredMenuItems.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No items found in this category.</p>
          </div>
        )}

        {/* Order button */}
        <div className="mt-12 text-center">
          <Link href="/place-order">
            <button className="bg-red-500 hover:bg-red-600 text-white py-3 px-8 rounded-lg font-bold transition-colors shadow-md">
              Place Your Order Now
            </button>
          </Link>
        </div>
      </main>

      <footer className="py-4 px-4 bg-gray-100 text-center text-gray-600 border-t border-gray-200">
        <p className="text-sm">
          &copy; {new Date().getFullYear()} Hong's Kitchen. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
