// // pages/summary.js
// import { useEffect, useRef, useState } from "react";
// import Head from "next/head";
// import Link from "next/link";
// import { useRouter } from "next/router";

// export default function SummaryPage() {
//   const [orderItems, setOrderItems] = useState([]);
//   const [orderDetails, setOrderDetails] = useState({
//     orderNumber: "",
//     date: "",
//     total: 0,
//     tax: 0,
//     grandTotal: 0,
//   });
//   const billRef = useRef(null);
//   const router = useRouter();

//   useEffect(() => {
//     // Generate random order number
//     const orderNumber =
//       "HK" +
//       Math.floor(Math.random() * 10000)
//         .toString()
//         .padStart(4, "0");
//     const currentDate = new Date().toLocaleDateString("en-IN", {
//       year: "numeric",
//       month: "long",
//       day: "numeric",
//       hour: "2-digit",
//       minute: "2-digit",
//     });

//     // Dummy order items - will be used if no items in localStorage
//     const dummyItems = [
//       { name: "Hakka Noodles", quantity: 2, price: 180, type: "Veg" },
//       { name: "Chilli Chicken", quantity: 1, price: 250, type: "Non-Veg" },
//       { name: "Veg Spring Rolls", quantity: 3, price: 120, type: "Veg" },
//       { name: "Kung Pao Chicken", quantity: 1, price: 270, type: "Non-Veg" },
//       { name: "Honey Chilli Potato", quantity: 2, price: 150, type: "Veg" },
//     ];

//     // Get order items from localStorage or use dummy items
//     try {
//       let items = JSON.parse(localStorage.getItem("orderItems") || "[]");

//       // If no items in localStorage, use dummy items
//       if (items.length === 0) {
//         items = dummyItems;
//       }

//       setOrderItems(items);

//       // Calculate totals
//       const subtotal = items.reduce(
//         (sum, item) => sum + item.price * item.quantity,
//         0
//       );
//       const tax = Math.round(subtotal * 0.05); // 5% tax
//       const grandTotal = subtotal + tax;

//       setOrderDetails({
//         orderNumber,
//         date: currentDate,
//         total: subtotal,
//         tax,
//         grandTotal,
//       });
//     } catch (error) {
//       console.error("Error loading order items:", error);
//       // Use dummy items instead of redirecting
//       setOrderItems(dummyItems);

//       // Calculate totals for dummy items
//       const subtotal = dummyItems.reduce(
//         (sum, item) => sum + item.price * item.quantity,
//         0
//       );
//       const tax = Math.round(subtotal * 0.05);
//       const grandTotal = subtotal + tax;

//       setOrderDetails({
//         orderNumber,
//         date: currentDate,
//         total: subtotal,
//         tax,
//         grandTotal,
//       });
//     }
//   }, [router]);

//   const downloadPdf = () => {
//     // Generate PDF using browser's print functionality
//     if (typeof window === "undefined" || !billRef.current) return;

//     // Create a new window for printing
//     const printWindow = window.open("", "_blank", "width=800,height=600");

//     if (!printWindow) {
//       alert("Please allow pop-ups to generate the PDF");
//       return;
//     }

//     // Get the bill HTML content
//     const billContent = billRef.current.innerHTML;

//     // Add necessary styles
//     printWindow.document.write(`
//       <!DOCTYPE html>
//       <html>
//         <head>
//           <title>Hong's Kitchen - Order ${orderDetails.orderNumber}</title>
//           <style>
//             body {
//               font-family: Arial, sans-serif;
//               margin: 40px;
//               color: #333;
//             }
//             h1, h2 { color: #00b5ad; }
//             table {
//               width: 100%;
//               border-collapse: collapse;
//               margin: 20px 0;
//             }
//             th, td {
//               padding: 10px;
//               text-align: left;
//               border-bottom: 1px solid #ddd;
//             }
//             th { background-color: #f5f5f5; }
//             .veg {
//               background-color: #d4edda;
//               color: #155724;
//               border-radius: 12px;
//               padding: 4px 8px;
//               display: inline-block;
//               font-size: 12px;
//             }
//             .non-veg {
//               background-color: #f8d7da;
//               color: #721c24;
//               border-radius: 12px;
//               padding: 4px 8px;
//               display: inline-block;
//               font-size: 12px;
//             }
//             .bill-header {
//               display: flex;
//               justify-content: space-between;
//               align-items: center;
//               margin-bottom: 20px;
//             }
//             .grand-total {
//               font-size: 18px;
//               font-weight: bold;
//               color: #ef414b;
//             }
//             @media print {
//               body { margin: 0; padding: 20px; }
//               button { display: none; }
//             }
//           </style>
//         </head>
//         <body>
//           <div class="print-container">
//             ${billContent}
//           </div>
//           <div style="text-align: center; margin-top: 30px;">
//             <button onclick="window.print(); setTimeout(() => window.close(), 500);"
//                     style="background: #00b5ad; color: white; border: none; padding: 10px 20px;
//                           border-radius: 4px; cursor: pointer; font-weight: bold;">
//               Print as PDF
//             </button>
//           </div>
//           <script>
//             // Auto-open print dialog after a short delay
//             setTimeout(() => {
//               document.querySelector('button').style.display = 'none';
//               window.print();
//               setTimeout(() => window.close(), 500);
//             }, 1000);
//           </script>
//         </body>
//       </html>
//     `);

//     printWindow.document.close();
//   };

//   const downloadBill = () => {
//     const billHtml = billRef.current.innerHTML;
//     const blob = new Blob(
//       [
//         `
//       <html>
//         <head>
//           <title>Hong's Kitchen Bill</title>
//           <style>
//             body { font-family: Arial, sans-serif; margin: 40px; }
//             h1, h2 { color: #00b5ad; }
//             .bill-container { max-width: 800px; margin: 0 auto; padding: 20px; border: 1px solid #ccc; }
//             table { width: 100%; border-collapse: collapse; margin: 20px 0; }
//             th, td { padding: 10px; text-align: left; border-bottom: 1px solid #ddd; }
//             th { background-color: #f5f5f5; }
//             .total-row { font-weight: bold; }
//             .grand-total { font-size: 20px; font-weight: bold; color: #ef414b; }
//             .logo { max-width: 150px; height: auto; }
//           </style>
//         </head>
//         <body>
//           ${billHtml}
//         </body>
//       </html>
//     `,
//       ],
//       { type: "text/html" }
//     );

//     const url = URL.createObjectURL(blob);
//     const link = document.createElement("a");
//     link.href = url;
//     link.download = `HK_Order_${orderDetails.orderNumber}.html`;
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//   };

//   return (
//     <div className="min-h-screen flex flex-col bg-gray-50">
//       <Head>
//         <title>Order Summary | Hong's Kitchen</title>
//         <meta
//           name="description"
//           content="Order summary and bill from Hong's Kitchen"
//         />
//       </Head>

//       {/* Header with logo */}
//       <header className="py-4 px-4 md:px-10 flex justify-center items-center bg-white shadow-sm">
//         <Link href="/">
//           <div className="w-32 md:w-40 cursor-pointer">
//             <img
//               src="https://hongskitchen.in/jfl-discovery-ui/public/dist/default/images/global/loginLogoHK.svg"
//               alt="Hong's Kitchen Logo"
//               className="w-full"
//             />
//           </div>
//         </Link>
//       </header>

//       <main className="flex-grow container mx-auto px-4 py-8">
//         <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-6 md:p-8">
//           <div className="flex justify-between items-center mb-6">
//             <h1 className="text-2xl md:text-3xl font-bold text-teal-500">
//               Order Summary
//             </h1>
//             <div className="flex space-x-2">
//               {/* <button
//                 onClick={downloadBill}
//                 className="bg-teal-500 text-white py-2 px-4 rounded hover:bg-teal-600 transition-colors flex items-center"
//               >
//                 <svg
//                   xmlns="http://www.w3.org/2000/svg"
//                   className="h-5 w-5 mr-2"
//                   viewBox="0 0 20 20"
//                   fill="currentColor"
//                 >
//                   <path
//                     fillRule="evenodd"
//                     d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
//                     clipRule="evenodd"
//                   />
//                 </svg>
//                 HTML
//               </button> */}
//               <button
//                 onClick={downloadPdf}
//                 className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition-colors flex items-center"
//               >
//                 <svg
//                   xmlns="http://www.w3.org/2000/svg"
//                   className="h-5 w-5 mr-2"
//                   viewBox="0 0 20 20"
//                   fill="currentColor"
//                 >
//                   <path
//                     fillRule="evenodd"
//                     d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
//                     clipRule="evenodd"
//                   />
//                 </svg>
//                 PDF
//               </button>
//             </div>
//           </div>

//           <div ref={billRef} className="bill-container">
//             <div className="flex justify-between mb-6">
//               <div>
//                 <p className="text-gray-700">
//                   <span className="font-semibold">Order #:</span>{" "}
//                   {orderDetails.orderNumber}
//                 </p>
//                 <p className="text-gray-700">
//                   <span className="font-semibold">Date:</span>{" "}
//                   {orderDetails.date}
//                 </p>
//               </div>
//               <img
//                 src="https://hongskitchen.in/jfl-discovery-ui/public/dist/default/images/global/loginLogoHK.svg"
//                 alt="Hong's Kitchen Logo"
//                 className="w-24 object-contain logo"
//               />
//             </div>

//             <h2 className="text-xl font-semibold mb-4 text-teal-500">
//               Order Items
//             </h2>

//             {orderItems.length > 0 ? (
//               <table className="w-full text-gray-500">
//                 <thead>
//                   <tr className="border-b border-gray-200">
//                     <th className="text-left py-2">Item</th>
//                     <th className="text-left py-2">Type</th>
//                     <th className="text-center py-2">Qty</th>
//                     <th className="text-right py-2">Price</th>
//                     <th className="text-right py-2">Total</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {orderItems.map((item, index) => (
//                     <tr key={index} className="border-b border-gray-200">
//                       <td className="py-3">{item.name}</td>
//                       <td className="py-3">
//                         <span
//                           className={`inline-block px-2 py-1 text-xs rounded-full ${
//                             item.type === "Veg"
//                               ? "bg-green-100 text-green-800"
//                               : "bg-red-100 text-red-800"
//                           }`}
//                         >
//                           {item.type}
//                         </span>
//                       </td>
//                       <td className="py-3 text-center">{item.quantity}</td>
//                       <td className="py-3 text-right">
//                         ₹{item.price.toFixed(2)}
//                       </td>
//                       <td className="py-3 text-right">
//                         ₹{(item.quantity * item.price).toFixed(2)}
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//                 <tfoot>
//                   <tr className="border-b border-gray-200">
//                     <td colSpan="4" className="py-3 text-right font-semibold">
//                       Subtotal:
//                     </td>
//                     <td className="py-3 text-right font-semibold">
//                       ₹{orderDetails.total.toFixed(2)}
//                     </td>
//                   </tr>
//                   <tr className="border-b border-gray-200">
//                     <td colSpan="4" className="py-3 text-right font-semibold">
//                       Tax (5%):
//                     </td>
//                     <td className="py-3 text-right font-semibold">
//                       ₹{orderDetails.tax.toFixed(2)}
//                     </td>
//                   </tr>
//                   <tr>
//                     <td
//                       colSpan="4"
//                       className="py-4 text-right font-bold text-lg"
//                     >
//                       Grand Total:
//                     </td>
//                     <td className="py-4 text-right font-bold text-lg text-red-500">
//                       ₹{orderDetails.grandTotal.toFixed(2)}
//                     </td>
//                   </tr>
//                 </tfoot>
//               </table>
//             ) : (
//               <div className="text-center py-8">
//                 <p className="text-gray-500">No items in your order</p>
//               </div>
//             )}

//             <div className="mt-8 pt-6 border-t border-gray-200">
//               <p className="text-center text-gray-600">
//                 Thank you for ordering from Hong's Kitchen!
//               </p>
//               <p className="text-center text-gray-500 text-sm mt-2">
//                 Your food will be prepared with care and delivered soon.
//               </p>
//             </div>
//           </div>

//           <div className="mt-8 flex justify-between">
//             <Link href="/">
//               <button className="bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 px-6 rounded transition-colors">
//                 Back to Home
//               </button>
//             </Link>
//             <Link href="/place-order">
//               <button className="bg-red-500 hover:bg-red-600 text-white py-2 px-6 rounded transition-colors">
//                 New Order
//               </button>
//             </Link>
//           </div>
//         </div>
//       </main>

//       <footer className="py-4 px-4 bg-gray-100 text-center text-gray-600 border-t border-gray-200">
//         <p className="text-sm">
//           &copy; {new Date().getFullYear()} Hong's Kitchen. All rights reserved.
//         </p>
//       </footer>
//     </div>
//   );
// }

// pages/summary.js
// import { useEffect, useRef, useState } from "react";
// import Head from "next/head";
// import Link from "next/link";
// import { useRouter } from "next/router";

// export default function SummaryPage() {
//   const [orderItems, setOrderItems] = useState([]);
//   const [orderDetails, setOrderDetails] = useState({
//     orderNumber: "",
//     date: "",
//     total: 0,
//     tax: 0,
//     grandTotal: 0,
//   });
//   const billRef = useRef(null);
//   const router = useRouter();

//   useEffect(() => {
//     // Generate random order number
//     const orderNumber =
//       "HK" +
//       Math.floor(Math.random() * 10000)
//         .toString()
//         .padStart(4, "0");
//     const currentDate = new Date().toLocaleDateString("en-IN", {
//       year: "numeric",
//       month: "long",
//       day: "numeric",
//       hour: "2-digit",
//       minute: "2-digit",
//     });

//     // Example of new response format
//     const newResponseFormat = {
//       item_details: [
//         "1 serving for 2 people",
//         "2 Regular"
//       ],
//       ordered_items: [
//         "Chicken Hakka Noodles",
//         "Sprite"
//       ]
//     };

//     // Dummy pricing data (since the response doesn't include prices)
//     const menuPrices = {
//       "Chicken Hakka Noodles": 250,
//       "Sprite": 60,
//       // Add more items and prices as needed
//     };

//     // Get order items from localStorage or use new format
//     try {
//       let items = [];

//       // Try to get from localStorage first
//       const storedItems = localStorage.getItem("orderItems");

//       if (storedItems) {
//         items = JSON.parse(storedItems);
//       } else {
//         // Use the new response format
//         if (newResponseFormat.ordered_items && newResponseFormat.ordered_items.length > 0) {
//           items = newResponseFormat.ordered_items.map((name, index) => {
//             // Extract quantity from item_details if available
//             let quantity = 1;
//             let details = "";

//             if (newResponseFormat.item_details && newResponseFormat.item_details[index]) {
//               const detailText = newResponseFormat.item_details[index];
//               // Try to extract quantity from detail text
//               const qtyMatch = detailText.match(/(\d+)/);
//               if (qtyMatch) {
//                 quantity = parseInt(qtyMatch[0], 10);
//               }
//               details = detailText;
//             }

//             // Determine type (Veg/Non-Veg) based on item name
//             const type = name.toLowerCase().includes("chicken") ||
//                          name.toLowerCase().includes("mutton") ||
//                          name.toLowerCase().includes("fish") ||
//                          name.toLowerCase().includes("prawn") ? "Non-Veg" : "Veg";

//             return {
//               name: name,
//               quantity: quantity,
//               price: menuPrices[name] || 150, // Default price if not found
//               type: type,
//               details: details
//             };
//           });
//         }
//       }

//       setOrderItems(items);

//       // Calculate totals
//       const subtotal = items.reduce(
//         (sum, item) => sum + item.price * item.quantity,
//         0
//       );
//       const tax = Math.round(subtotal * 0.05); // 5% tax
//       const grandTotal = subtotal + tax;

//       setOrderDetails({
//         orderNumber,
//         date: currentDate,
//         total: subtotal,
//         tax,
//         grandTotal,
//       });
//     } catch (error) {
//       console.error("Error loading order items:", error);

//       // Fallback to new response format items
//       const fallbackItems = newResponseFormat.ordered_items.map((name, index) => {
//         let quantity = 1;
//         let details = "";

//         if (newResponseFormat.item_details && newResponseFormat.item_details[index]) {
//           const detailText = newResponseFormat.item_details[index];
//           const qtyMatch = detailText.match(/(\d+)/);
//           if (qtyMatch) {
//             quantity = parseInt(qtyMatch[0], 10);
//           }
//           details = detailText;
//         }

//         const type = name.toLowerCase().includes("chicken") ? "Non-Veg" : "Veg";

//         return {
//           name: name,
//           quantity: quantity,
//           price: menuPrices[name] || 150, // Default price if not found
//           type: type,
//           details: details
//         };
//       });

//       setOrderItems(fallbackItems);

//       // Calculate totals for fallback items
//       const subtotal = fallbackItems.reduce(
//         (sum, item) => sum + item.price * item.quantity,
//         0
//       );
//       const tax = Math.round(subtotal * 0.05);
//       const grandTotal = subtotal + tax;

//       setOrderDetails({
//         orderNumber,
//         date: currentDate,
//         total: subtotal,
//         tax,
//         grandTotal,
//       });
//     }
//   }, [router]);

//   const downloadPdf = () => {
//     // Generate PDF using browser's print functionality
//     if (typeof window === "undefined" || !billRef.current) return;

//     // Create a new window for printing
//     const printWindow = window.open("", "_blank", "width=800,height=600");

//     if (!printWindow) {
//       alert("Please allow pop-ups to generate the PDF");
//       return;
//     }

//     // Get the bill HTML content
//     const billContent = billRef.current.innerHTML;

//     // Add necessary styles
//     printWindow.document.write(`
//       <!DOCTYPE html>
//       <html>
//         <head>
//           <title>Hong's Kitchen - Order ${orderDetails.orderNumber}</title>
//           <style>
//             body {
//               font-family: Arial, sans-serif;
//               margin: 40px;
//               color: #333;
//             }
//             h1, h2 { color: #00b5ad; }
//             table {
//               width: 100%;
//               border-collapse: collapse;
//               margin: 20px 0;
//             }
//             th, td {
//               padding: 10px;
//               text-align: left;
//               border-bottom: 1px solid #ddd;
//             }
//             th { background-color: #f5f5f5; }
//             .veg {
//               background-color: #d4edda;
//               color: #155724;
//               border-radius: 12px;
//               padding: 4px 8px;
//               display: inline-block;
//               font-size: 12px;
//             }
//             .non-veg {
//               background-color: #f8d7da;
//               color: #721c24;
//               border-radius: 12px;
//               padding: 4px 8px;
//               display: inline-block;
//               font-size: 12px;
//             }
//             .bill-header {
//               display: flex;
//               justify-content: space-between;
//               align-items: center;
//               margin-bottom: 20px;
//             }
//             .grand-total {
//               font-size: 18px;
//               font-weight: bold;
//               color: #ef414b;
//             }
//             .item-details {
//               font-size: 12px;
//               color: #666;
//               font-style: italic;
//               display: block;
//               margin-top: 4px;
//             }
//             @media print {
//               body { margin: 0; padding: 20px; }
//               button { display: none; }
//             }
//           </style>
//         </head>
//         <body>
//           <div class="print-container">
//             ${billContent}
//           </div>
//           <div style="text-align: center; margin-top: 30px;">
//             <button onclick="window.print(); setTimeout(() => window.close(), 500);"
//                     style="background: #00b5ad; color: white; border: none; padding: 10px 20px;
//                           border-radius: 4px; cursor: pointer; font-weight: bold;">
//               Print as PDF
//             </button>
//           </div>
//           <script>
//             // Auto-open print dialog after a short delay
//             setTimeout(() => {
//               document.querySelector('button').style.display = 'none';
//               window.print();
//               setTimeout(() => window.close(), 500);
//             }, 1000);
//           </script>
//         </body>
//       </html>
//     `);

//     printWindow.document.close();
//   };

//   const downloadBill = () => {
//     const billHtml = billRef.current.innerHTML;
//     const blob = new Blob(
//       [
//         `
//       <html>
//         <head>
//           <title>Hong's Kitchen Bill</title>
//           <style>
//             body { font-family: Arial, sans-serif; margin: 40px; }
//             h1, h2 { color: #00b5ad; }
//             .bill-container { max-width: 800px; margin: 0 auto; padding: 20px; border: 1px solid #ccc; }
//             table { width: 100%; border-collapse: collapse; margin: 20px 0; }
//             th, td { padding: 10px; text-align: left; border-bottom: 1px solid #ddd; }
//             th { background-color: #f5f5f5; }
//             .total-row { font-weight: bold; }
//             .grand-total { font-size: 20px; font-weight: bold; color: #ef414b; }
//             .logo { max-width: 150px; height: auto; }
//             .item-details { font-size: 12px; color: #666; font-style: italic; display: block; margin-top: 4px; }
//           </style>
//         </head>
//         <body>
//           ${billHtml}
//         </body>
//       </html>
//     `,
//       ],
//       { type: "text/html" }
//     );

//     const url = URL.createObjectURL(blob);
//     const link = document.createElement("a");
//     link.href = url;
//     link.download = `HK_Order_${orderDetails.orderNumber}.html`;
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//   };

//   return (
//     <div className="min-h-screen flex flex-col bg-gray-50">
//       <Head>
//         <title>Order Summary | Hong's Kitchen</title>
//         <meta
//           name="description"
//           content="Order summary and bill from Hong's Kitchen"
//         />
//       </Head>

//       {/* Header with logo */}
//       <header className="py-4 px-4 md:px-10 flex justify-center items-center bg-white shadow-sm">
//         <Link href="/">
//           <div className="w-32 md:w-40 cursor-pointer">
//             <img
//               src="https://hongskitchen.in/jfl-discovery-ui/public/dist/default/images/global/loginLogoHK.svg"
//               alt="Hong's Kitchen Logo"
//               className="w-full"
//             />
//           </div>
//         </Link>
//       </header>

//       <main className="flex-grow container mx-auto px-4 py-8">
//         <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-6 md:p-8">
//           <div className="flex justify-between items-center mb-6">
//             <h1 className="text-2xl md:text-3xl font-bold text-teal-500">
//               Order Summary
//             </h1>
//             <div className="flex space-x-2">
//               <button
//                 onClick={downloadPdf}
//                 className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition-colors flex items-center"
//               >
//                 <svg
//                   xmlns="http://www.w3.org/2000/svg"
//                   className="h-5 w-5 mr-2"
//                   viewBox="0 0 20 20"
//                   fill="currentColor"
//                 >
//                   <path
//                     fillRule="evenodd"
//                     d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
//                     clipRule="evenodd"
//                   />
//                 </svg>
//                 PDF
//               </button>
//             </div>
//           </div>

//           <div ref={billRef} className="bill-container">
//             <div className="flex justify-between mb-6">
//               <div>
//                 <p className="text-gray-700">
//                   <span className="font-semibold">Order #:</span>{" "}
//                   {orderDetails.orderNumber}
//                 </p>
//                 <p className="text-gray-700">
//                   <span className="font-semibold">Date:</span>{" "}
//                   {orderDetails.date}
//                 </p>
//               </div>
//               <img
//                 src="https://hongskitchen.in/jfl-discovery-ui/public/dist/default/images/global/loginLogoHK.svg"
//                 alt="Hong's Kitchen Logo"
//                 className="w-24 object-contain logo"
//               />
//             </div>

//             <h2 className="text-xl font-semibold mb-4 text-teal-500">
//               Order Items
//             </h2>

//             {orderItems.length > 0 ? (
//               <table className="w-full text-gray-500">
//                 <thead>
//                   <tr className="border-b border-gray-200">
//                     <th className="text-left py-2">Item</th>
//                     <th className="text-left py-2">Type</th>
//                     <th className="text-center py-2">Qty</th>
//                     <th className="text-right py-2">Price</th>
//                     <th className="text-right py-2">Total</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {orderItems.map((item, index) => (
//                     <tr key={index} className="border-b border-gray-200">
//                       <td className="py-3">
//                         {item.name}
//                         {item.details && (
//                           <span className="item-details block text-xs text-gray-500 mt-1">
//                             {item.details}
//                           </span>
//                         )}
//                       </td>
//                       <td className="py-3">
//                         <span
//                           className={`inline-block px-2 py-1 text-xs rounded-full ${
//                             item.type === "Veg"
//                               ? "bg-green-100 text-green-800"
//                               : "bg-red-100 text-red-800"
//                           }`}
//                         >
//                           {item.type}
//                         </span>
//                       </td>
//                       <td className="py-3 text-center">{item.quantity}</td>
//                       <td className="py-3 text-right">
//                         ₹{item.price.toFixed(2)}
//                       </td>
//                       <td className="py-3 text-right">
//                         ₹{(item.quantity * item.price).toFixed(2)}
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//                 <tfoot>
//                   <tr className="border-b border-gray-200">
//                     <td colSpan="4" className="py-3 text-right font-semibold">
//                       Subtotal:
//                     </td>
//                     <td className="py-3 text-right font-semibold">
//                       ₹{orderDetails.total.toFixed(2)}
//                     </td>
//                   </tr>
//                   <tr className="border-b border-gray-200">
//                     <td colSpan="4" className="py-3 text-right font-semibold">
//                       Tax (5%):
//                     </td>
//                     <td className="py-3 text-right font-semibold">
//                       ₹{orderDetails.tax.toFixed(2)}
//                     </td>
//                   </tr>
//                   <tr>
//                     <td
//                       colSpan="4"
//                       className="py-4 text-right font-bold text-lg"
//                     >
//                       Grand Total:
//                     </td>
//                     <td className="py-4 text-right font-bold text-lg text-red-500">
//                       ₹{orderDetails.grandTotal.toFixed(2)}
//                     </td>
//                   </tr>
//                 </tfoot>
//               </table>
//             ) : (
//               <div className="text-center py-8">
//                 <p className="text-gray-500">No items in your order</p>
//               </div>
//             )}

//             <div className="mt-8 pt-6 border-t border-gray-200">
//               <p className="text-center text-gray-600">
//                 Thank you for ordering from Hong's Kitchen!
//               </p>
//               <p className="text-center text-gray-500 text-sm mt-2">
//                 Your food will be prepared with care and delivered soon.
//               </p>
//             </div>
//           </div>

//           <div className="mt-8 flex justify-between">
//             <Link href="/">
//               <button className="bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 px-6 rounded transition-colors">
//                 Back to Home
//               </button>
//             </Link>
//             <Link href="/place-order">
//               <button className="bg-red-500 hover:bg-red-600 text-white py-2 px-6 rounded transition-colors">
//                 New Order
//               </button>
//             </Link>
//           </div>
//         </div>
//       </main>

//       <footer className="py-4 px-4 bg-gray-100 text-center text-gray-600 border-t border-gray-200">
//         <p className="text-sm">
//           &copy; {new Date().getFullYear()} Hong's Kitchen. All rights reserved.
//         </p>
//       </footer>
//     </div>
//   );
// }

// pages/summary.js
import { useEffect, useRef, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useOrder } from "@/context/OrderContext";

export default function SummaryPage() {
  const [orderItems, setOrderItems] = useState([]);
  const [orderDetails, setOrderDetails] = useState({
    orderNumber: "",
    date: "",
  });
  const billRef = useRef(null);
  const router = useRouter();
  const { orderDetailsAPI } = useOrder();

  const [responseData, setResponseData] = useState(null);
  // Response format
  // const responseData = {
  //   item_details: [
  //     "1 serving for 2 people",
  //     "2 Regular"
  //   ],
  //   ordered_items: [
  //     "Chicken Hakka Noodles",
  //     "Sprite"
  //   ]
  // };

  useEffect(() => {
    setResponseData(orderDetailsAPI);
    console.log("suuuu", orderDetailsAPI);
  }, [orderDetailsAPI]);

  useEffect(() => {
    // Generate random order number
    const orderNumber =
      "HK" +
      Math.floor(Math.random() * 10000)
        .toString()
        .padStart(4, "0");
    const currentDate = new Date().toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    try {
      // Process the response data
      const processedItems = [];

      if (
        orderDetailsAPI?.ordered_items &&
        orderDetailsAPI?.ordered_items.length > 0
      ) {
        orderDetailsAPI.ordered_items.forEach((name, index) => {
          // Get details if available
          const details =
            orderDetailsAPI.item_details && orderDetailsAPI.item_details[index]
              ? orderDetailsAPI.item_details[index]
              : "";

          // Determine type (Veg/Non-Veg) based on item name
          const type =
            name.toLowerCase().includes("chicken") ||
            name.toLowerCase().includes("mutton") ||
            name.toLowerCase().includes("fish") ||
            name.toLowerCase().includes("prawn")
              ? "Non-Veg"
              : "Veg";

          processedItems.push({
            name: name,
            details: details,
            type: type,
          });
        });
      }

      setOrderItems(processedItems);
      setOrderDetails({
        orderNumber,
        date: currentDate,
      });
    } catch (error) {
      console.error("Error processing order items:", error);
      setOrderItems([]);
      setOrderDetails({
        orderNumber,
        date: currentDate,
      });
    }
  }, [router, orderDetailsAPI]);

  const downloadPdf = () => {
    // Generate PDF using browser's print functionality
    if (typeof window === "undefined" || !billRef.current) return;

    // Create a new window for printing
    const printWindow = window.open("", "_blank", "width=800,height=600");

    if (!printWindow) {
      alert("Please allow pop-ups to generate the PDF");
      return;
    }

    // Get the bill HTML content
    const billContent = billRef.current.innerHTML;

    // Add necessary styles
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Hong's Kitchen - Order ${orderDetails.orderNumber}</title>
          <style>
            body { 
              font-family: Arial, sans-serif; 
              margin: 40px; 
              color: #333;
            }
            h1, h2 { color: #00b5ad; }
            table { 
              width: 100%; 
              border-collapse: collapse; 
              margin: 20px 0; 
            }
            th, td { 
              padding: 10px; 
              text-align: left; 
              border-bottom: 1px solid #ddd; 
            }
            th { background-color: #f5f5f5; }
            .veg { 
              background-color: #d4edda; 
              color: #155724; 
              border-radius: 12px;
              padding: 4px 8px;
              display: inline-block;
              font-size: 12px;
            }
            .non-veg { 
              background-color: #f8d7da; 
              color: #721c24; 
              border-radius: 12px;
              padding: 4px 8px;
              display: inline-block;
              font-size: 12px;
            }
            .bill-header {
              display: flex;
              justify-content: space-between;
              align-items: center;
              margin-bottom: 20px;
            }
            .item-details {
              font-size: 12px;
              color: #666;
              font-style: italic;
              display: block;
              margin-top: 4px;
            }
            @media print {
              body { margin: 0; padding: 20px; }
              button { display: none; }
            }
          </style>
        </head>
        <body>
          <div class="print-container">
            ${billContent}
          </div>
          <div style="text-align: center; margin-top: 30px;">
            <button onclick="window.print(); setTimeout(() => window.close(), 500);" 
                    style="background: #00b5ad; color: white; border: none; padding: 10px 20px; 
                          border-radius: 4px; cursor: pointer; font-weight: bold;">
              Print as PDF
            </button>
          </div>
          <script>
            // Auto-open print dialog after a short delay
            setTimeout(() => {
              document.querySelector('button').style.display = 'none';
              window.print();
              setTimeout(() => window.close(), 500);
            }, 1000);
          </script>
        </body>
      </html>
    `);

    printWindow.document.close();
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Head>
        <title>Order Summary | Hong's Kitchen</title>
        <meta
          name="description"
          content="Order summary and bill from Hong's Kitchen"
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
        <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-6 md:p-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl md:text-3xl font-bold text-teal-500">
              Order Summary
            </h1>
            <div className="flex space-x-2">
              <button
                onClick={downloadPdf}
                className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition-colors flex items-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
                PDF
              </button>
            </div>
          </div>

          <div ref={billRef} className="bill-container">
            <div className="flex justify-between mb-6">
              <div>
                <p className="text-gray-700">
                  <span className="font-semibold">Order #:</span>{" "}
                  {orderDetails.orderNumber}
                </p>
                <p className="text-gray-700">
                  <span className="font-semibold">Date:</span>{" "}
                  {orderDetails.date}
                </p>
              </div>
              <img
                src="https://hongskitchen.in/jfl-discovery-ui/public/dist/default/images/global/loginLogoHK.svg"
                alt="Hong's Kitchen Logo"
                className="w-24 object-contain logo"
              />
            </div>

            <h2 className="text-xl font-semibold mb-4 text-teal-500">
              Order Items
            </h2>

            {orderItems.length > 0 ? (
              <table className="w-full text-gray-500">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-2">Item</th>
                    <th className="text-left py-2">Details</th>
                    <th className="text-center py-2">Type</th>
                  </tr>
                </thead>
                <tbody>
                  {orderItems.map((item, index) => (
                    <tr key={index} className="border-b border-gray-200">
                      <td className="py-3">{item.name}</td>
                      <td className="py-3 text-gray-500 text-sm italic">
                        {item.details}
                      </td>
                      <td className="py-3 text-center">
                        <span
                          className={`inline-block px-2 py-1 text-xs rounded-full ${
                            item.type === "Veg"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {item.type}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">No items in your order</p>
              </div>
            )}

            <div className="mt-8 pt-6 border-t border-gray-200">
              <p className="text-center text-gray-600">
                Thank you for ordering from Hong's Kitchen!
              </p>
              <p className="text-center text-gray-500 text-sm mt-2">
                Your food will be prepared with care and delivered soon.
              </p>
            </div>
          </div>

          <div className="mt-8 flex justify-between">
            <Link href="/">
              <button className="bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 px-6 rounded transition-colors">
                Back to Home
              </button>
            </Link>
            <Link href="/place-order">
              <button className="bg-red-500 hover:bg-red-600 text-white py-2 px-6 rounded transition-colors">
                New Order
              </button>
            </Link>
          </div>
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
