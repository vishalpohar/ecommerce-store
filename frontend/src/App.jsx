import { Navigate, Route, Routes } from "react-router-dom";
import { lazy, Suspense, useEffect } from "react";
import { Toaster } from "react-hot-toast";

import { useUserStore } from "./stores/useUserStore";

import AuthLayout from "./layouts/AuthLayout";
import PublicLayout from "./layouts/PublicLayout";

import ProtectedRoute from "./routes/ProtectedRoute";

import LoadingSpinner, { ThreeDotsLoader } from "./components/LoadingSpinner";
import ScrollToTop from "./components/ScrollToTop";
import { useCartStore } from "./stores/useCartStore";

import "./index.css";

const SignUpPage = lazy(() => import("./pages/SignUpPage"));
const LoginPage = lazy(() => import("./pages/LoginPage"));
const ForgotPassword = lazy(
  () => import("./pages/ForgotPassword/ForgotPassword"),
);
const HomePage = lazy(() => import("./pages/HomePage"));
const DashboardPage = lazy(() => import("./pages/DashboardPage"));
const CategoryPage = lazy(() => import("./pages/category/CategoryPage"));
const CartPage = lazy(() => import("./pages/cart/CartPage"));
const SearchPage = lazy(() => import("./pages/search/SearchPage"));
const WishlistPage = lazy(() => import("./pages/wishlist/WishlistPage"));
const OrdersPage = lazy(() => import("./pages/orders/OrdersPage"));
const ProductDetailsPage = lazy(() => import("./pages/ProductDetailsPage"));
const PurchaseSuccessPage = lazy(() => import("./pages/PurchaseSuccessPage"));
const PurchaseCancelPage = lazy(() => import("./pages/PurchaseCancelPage"));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage"));

function App() {
  const { user, checkAuth, checkingAuth } = useUserStore();
  const { getCartItems } = useCartStore();

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (user) {
      getCartItems()
    }
  }, [user]);

  const PageLoader = () => (
    <div className="flex justify-center items-center">
      <ThreeDotsLoader height="90" />
    </div>
  );

  return (
    <>
      <ScrollToTop />
      <Routes>
        {/*------ AUTH ROUTES ------*/}
        <Route element={<AuthLayout />}>
          <Route
            path="/signup"
            element={
              <Suspense fallback={<PageLoader />}>
                {!user ? <SignUpPage /> : <Navigate to="/" />}
              </Suspense>
            }
          />
          <Route
            path="/login"
            element={
              <Suspense fallback={<PageLoader />}>
                {!user ? <LoginPage /> : <Navigate to="/" />}
              </Suspense>
            }
          />
          <Route
            path="/forgot-password"
            element={
              <Suspense fallback={<PageLoader />}>
                {!user ? <ForgotPassword /> : <Navigate to="/" />}
              </Suspense>
            }
          />
          <Route
            path="/not-found"
            element={
              <Suspense fallback={<PageLoader />}>
                <NotFoundPage />
              </Suspense>
            }
          />
        </Route>

        <Route element={<PublicLayout />}>
          <Route
            path="/"
            element={
              <Suspense fallback={<PageLoader />}>
                <HomePage />
              </Suspense>
            }
          />
          <Route
            path="/category/:category"
            element={
              <Suspense fallback={<PageLoader />}>
                <CategoryPage />
              </Suspense>
            }
          />
          <Route
            path="/search"
            element={
              <Suspense fallback={<PageLoader />}>
                <SearchPage />
              </Suspense>
            }
          />
          <Route
            path="/product-details/:id"
            element={
              <Suspense fallback={<PageLoader />}>
                <ProductDetailsPage />
              </Suspense>
            }
          />

          {/* PROTECTED */}
          <Route
            path="/cart"
            element={
              <ProtectedRoute>
                <Suspense fallback={<PageLoader />}>
                  <CartPage />
                </Suspense>
              </ProtectedRoute>
            }
          />
          <Route
            path="/wishlist"
            element={
              <ProtectedRoute>
                <Suspense fallback={<PageLoader />}>
                  <WishlistPage />
                </Suspense>
              </ProtectedRoute>
            }
          />
          <Route
            path="/orders"
            element={
              <ProtectedRoute>
                <Suspense fallback={<PageLoader />}>
                  <OrdersPage />
                </Suspense>
              </ProtectedRoute>
            }
          />
          <Route
            path="/purchase-success"
            element={
              <Suspense fallback={<PageLoader />}>
                <PurchaseSuccessPage />
              </Suspense>
            }
          />
          <Route
            path="/purchase-cancel"
            element={
              <Suspense fallback={<PageLoader />}>
                <PurchaseCancelPage />
              </Suspense>
            }
          />

          {/* ADMIN */}
          <Route
            path="/secret-dashboard"
            element={
              <ProtectedRoute sellerOnly>
                <Suspense fallback={<PageLoader />}>
                  <DashboardPage />
                </Suspense>
              </ProtectedRoute>
            }
          />
        </Route>
        <Route path="*" element={<Navigate to="/not-found" />} />
      </Routes>

      <Toaster />
    </>
  );
}

export default App;
