// Import necessary components and functions from react-router-dom.

import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";
import { Layout } from "./pages/Layout";
import { Home } from "./pages/Home";
import { Single } from "./pages/Single";
import { Demo } from "./pages/Demo";
import { QuienesSomos } from "./pages/QuienesSomos";
import { PreguntasFrecuentes } from "./pages/PreguntasFrecuentes";
import { PoliticaPrivacidad } from "./pages/PoliticaPrivacidad";
import { TerminosCondiciones } from "./pages/TerminosCondiciones";
import { PoliticaCancelacion } from "./pages/PoliticaCancelacion";
import { Registro } from "./pages/Registro";
import { IniciarSesion } from "./pages/IniciarSesion";
import { RecuperarContraseña } from "./pages/RecuperarContraseña";
import { ActualizarPerfil } from "./pages/ActualizarPerfil";
import { VistaProducto } from "./pages/VistaProducto";
import { ConfirmacionCompra } from "./pages/ConfirmacionCompra";
import { OlvidoContraseña } from "./pages/OlvidoContraseña";
import { Cart } from "./pages/Cart";  

export const router = createBrowserRouter(
  createRoutesFromElements(
    // CreateRoutesFromElements function allows you to build route elements declaratively.
    // Create your routes here, if you want to keep the Navbar and Footer in all views, add your new routes inside the containing Route.
    // Root, on the contrary, create a sister Route, if you have doubts, try it!
    // Note: keep in mind that errorElement will be the default page when you don't get a route, customize that page to make your project more attractive.
    // Note: The child paths of the Layout element replace the Outlet component with the elements contained in the "element" attribute of these child paths.

    // Root Route: All navigation will start from here.
    <Route path="/" element={<Layout />} errorElement={<h1>Not found!</h1>}>
      {/* Nested Routes: Defines sub-routes within the BaseHome component. */}
      <Route path="/" element={<Home />} />
      <Route path="/single/:theId" element={<Single />} />{" "}
      {/* Dynamic route for single items */}
      <Route path="/demo" element={<Demo />} />
      <Route path="/registro" element={<Registro />} />
      <Route path="/iniciar-sesion" element={<IniciarSesion />} />
      <Route path="/olvido-su-contraseña" element={<OlvidoContraseña/>} />
      <Route path="/recuperar-contraseña" element={<RecuperarContraseña />} />
      <Route path="/actualizar-perfil" element={<ActualizarPerfil />} />
      <Route path="/quienes-somos" element={<QuienesSomos />} />
      <Route path="/preguntas-frecuentes" element={<PreguntasFrecuentes />} />
      <Route path="/politica-de-privacidad" element={<PoliticaPrivacidad />} />
      <Route path="/confirmacion-compra" element={<ConfirmacionCompra />} />

      <Route
        path="/politica-de-cancelacion"
        element={<PoliticaCancelacion />}
      />
      <Route path="/terminos-y-condiciones" element={<TerminosCondiciones />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/producto/:id" element={<VistaProducto />} />
      <Route path="/confirmacion" element={<ConfirmacionCompra />} />
    </Route>
  )
);
