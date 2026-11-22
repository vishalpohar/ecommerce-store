import { create } from "zustand";
import { toast } from "react-hot-toast";
import axios from "../api/axios";

export const useProductStore = create((set, get) => ({
  product: null,
  products: [],
  categoryProducts: [],
  featuredProducts: [],
  searchedProducts: [],
  recommendedProducts: [],
  ordersByPage: {},

  isFetchingSellerProducts: false,
  isFetchingProduct: false,
  loading: false,
  isFetchingCategory: false,
  isSearching: false,
  isFetchingOrders: false,
  isFetchingFeaturedProducts: false,
  isFetchingRecommedations: false,
  isUpdatingProduct: false,

  orders: [],
  total: null,
  totalPages: null,

  setProducts: (products) => set({ products }),

  createProduct: async (productData) => {
    set({ loading: true });
    try {
      const res = await axios.post("/products", productData);
      set((prevState) => ({
        products: [...prevState.products, res.data.product],
        loading: false,
      }));
      toast.success("Product created successfully!");
    } catch (error) {
      console.error("Create product error:", error);
      toast.error(error.response.data.error || "Something went wrong");
      set({ loading: false });
    }
  },
  fetchSellerProducts: async (page = 1, limit = 10) => {
    if (get().isFetchingSellerProducts) return;

    set({ isFetchingSellerProducts: true });
    try {
      const response = await axios.get(
        `/products/seller?page=${page}&limit=${limit}`,
      );
      set((prev) => ({
        products:
          page === 1
            ? response.data.products
            : [...prev.products, ...response.data.products],
        totalPages: response.data.totalPages,
      }));
    } catch (error) {
      set({ error: "Failed to fetch products" });
      toast.error(error?.response?.data?.error || "Failed to fetch products");
    } finally {
      set({ isFetchingSellerProducts: false });
    }
  },
  fetchProductById: async (productId) => {
    const { isFetchingProduct } = get();
    if (isFetchingProduct) return;

    set({ isFetchingProduct: true });
    try {
      const response = await axios.get(`/products/product/${productId}`);
      set({ product: response.data.product });
    } catch (error) {
      set({ error: "Failed to fetch product" });
      toast.error(error.response.data.error || "Failed to fetch product");
    } finally {
      set({ isFetchingProduct: false });
    }
  },
  fetchProductsByCategory: async (category, sortBy, page, append = false) => {
    const { isFetchingCategory } = get();
    if (isFetchingCategory) return;

    set({ isFetchingCategory: true });
    try {
      const limit = 10;
      const response = await axios.get(
        `/products/category?category=${category}&sort=${sortBy}&page=${page}&limit=${limit}`,
      );
      const { products, total, totalPages } = response.data;
      set((state) => ({
        categoryProducts: append
          ? [...state.categoryProducts, ...products]
          : products,
        total,
        totalPages,
      }));
    } catch (error) {
      set({ error: "Failed to fetch products" });
      toast.error(error?.response?.data?.error || "Failed to fetch products");
    } finally {
      set({ isFetchingCategory: false });
    }
  },

  updateProduct: async (productId, productData) => {
    set({ isUpdatingProduct: true });

    try {
      const response = await axios.patch(`/products/${productId}`, productData);

      const updatedProduct = response.data.product;

      // Update product in all relevant local collections.
      set((state) => ({
        product:
          state.product?._id === productId ? updatedProduct : state.product,

        products: state.products.map((product) =>
          product._id === productId ? updatedProduct : product,
        ),

        categoryProducts: state.categoryProducts.map((product) =>
          product._id === productId ? updatedProduct : product,
        ),

        searchedProducts: state.searchedProducts.map((product) =>
          product._id === productId ? updatedProduct : product,
        ),

        featuredProducts: updatedProduct.isFeatured
          ? state.featuredProducts.map((product) =>
              product._id === productId ? updatedProduct : product,
            )
          : state.featuredProducts.filter(
              (product) => product._id !== productId,
            ),
      }));

      toast.success(response.data?.message || "Product updated successfully!");

      return updatedProduct;
    } catch (error) {
      console.error("Update product error:", error);

      toast.error(error?.response?.data?.error || "Failed to update product");

      return null;
    } finally {
      set({ isUpdatingProduct: false });
    }
  },
  deleteProduct: async (productId) => {
    set({ loading: true });
    try {
      await axios.delete(`/products/${productId}`);
      set((prevProducts) => ({
        products: prevProducts.products.filter(
          (product) => product._id !== productId,
        ),
        loading: false,
      }));
    } catch (error) {
      set({ loading: false });
      toast.error(error.response.data.error || "Failed to delete product");
    }
  },
  fetchFeaturedProducts: async () => {
    const { featuredProducts, isFetchingFeaturedProducts } = get();
    if (featuredProducts.length || isFetchingFeaturedProducts) return;
    set({ isFetchingFeaturedProducts: true });
    try {
      const response = await axios.get("/products/featured");
      set({ featuredProducts: response.data });
    } catch (error) {
      set({ error: "Failed to fetch products" });
      console.log("Error fetching featured products", error);
    } finally {
      set({ isFetchingFeaturedProducts: false });
    }
  },
  toggleFeaturedProduct: async (productId) => {
    try {
      const response = await axios.patch(`/products/${productId}/featured`);
      const updatedFeaturedStatus = response.data?.isFeatured;

      const { products, featuredProducts } = get();

      set({
        products: products.map((p) =>
          p._id === productId ? { ...p, isFeatured: updatedFeaturedStatus } : p,
        ),
        featuredProducts: updatedFeaturedStatus
          ? [...featuredProducts, response.data]
          : featuredProducts.filter((p) => p._id !== productId),
      });
    } catch (error) {
      toast.error(error?.response?.data?.error || "Failed to update product");
    }
  },
  searchProducts: async (query, sortBy, page, append = false) => {
    const { isSearching } = get();
    if (isSearching) return;

    set({ isSearching: true });
    try {
      const limit = 10;
      const response = await axios.get(
        `/products/search?query=${query}&sort=${sortBy}&page=${page}&limit=${limit}`,
      );
      const { searchResult, total, totalPages } = response.data;
      set((state) => ({
        searchedProducts: append
          ? [...state.searchedProducts, ...searchResult]
          : searchResult,
        total,
        totalPages,
      }));
    } catch (error) {
      set({ error: "Failed to search products" });
      console.log("Error fetching products", error);
    } finally {
      set({ isSearching: false });
    }
  },
  clearSearchedProducts: () => {
    set({ searchedProducts: [] });
  },
  getMyOrders: async (page, limit = 5) => {
    const { ordersByPage, isFetchingOrders } = get();

    if (isFetchingOrders || ordersByPage[page]) return;

    set({ isFetchingOrders: true });
    try {
      const response = await axios.get(
        `/products/orders?page=${page}&limit=${limit}`,
      );

      const { orders, totalOrders, totalPages } = response.data;

      set((state) => ({
        ordersByPage: {
          ...state.ordersByPage,
          [page]: orders,
        },
        total: totalOrders,
        totalPages,
      }));
    } catch (error) {
      set({
        error: "Failed to get ordered products",
      });
      console.log("Error fetching products", error);
    } finally {
      set({ isFetchingOrders: false });
    }
  },
  fetchRecommendations: async () => {
    const { isFetchingRecommedations } = get();

    if (isFetchingRecommedations) return;

    set({ isFetchingRecommedations: true });
    try {
      const response = await axios.get("/products/recommendations");
      set({ recommendedProducts: response.data });
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "An error occurred while fetching recommendations",
      );
    } finally {
      set({ isFetchingRecommedations: false });
    }
  },
}));
