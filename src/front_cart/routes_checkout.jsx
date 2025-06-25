// src/front_cart/routes_checkout.jsx

import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";
import { Layout } from "../pages/Layout"; 
import { Home } from "../pages/Home";     
import Payment from "./pages/Payment";    
import Cart from "./pages/Cart";          

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />} errorElement={<h1>Not found!</h1>}>
      <Route path="/" element={<Home />} />
      <Route path="/carrito" element={<Cart />} />
      <Route path="/checkout/payment" element={<Payment />} />
    </Route>
  )
);
