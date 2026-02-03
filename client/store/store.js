import { toast } from 'react-hot-toast';
import { create } from 'zustand';

const CART_STORAGE_KEY = 'vapeclub-cart';
const THEME_STORAGE_KEY = 'vapeclub-theme';
const WISHLIST_STORAGE_KEY = 'vapeclub-wishlist';

function getBaseUrl() {
  const env = process.env.NEXT_PUBLIC_NEXT_LOCAL_URL || process.env.NEXT_LOCAL_URL || process.env.NEXT_PUBLIC_URL;
  const base = (env || '').toString().replace(/\/$/, '');
  if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
    return base || 'http://localhost:5001';
  }
  return base;
}

function loadCartFromStorage() {
  if (typeof window === 'undefined') return [];
  try {
    const saved = localStorage.getItem(CART_STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

function saveCartToStorage(cart) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  } catch {}
}

function loadWishlistFromStorage() {
  if (typeof window === 'undefined') return [];
  try {
    const saved = localStorage.getItem(WISHLIST_STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

function saveWishlistToStorage(wishlist) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(wishlist));
  } catch {}
}

function getThemeFromStorage() {
  if (typeof window === 'undefined') return 'light';
  try {
    return localStorage.getItem(THEME_STORAGE_KEY) || 'light';
  } catch {
    return 'light';
  }
}

function applyTheme(mode) {
  if (typeof window === 'undefined') return;
  const root = document.documentElement;
  if (mode === 'dark') {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }
  try {
    localStorage.setItem(THEME_STORAGE_KEY, mode);
  } catch {}
}

const useStore = create((set, get) => ({
  products: [],
  product: null,
  loading: false,
  error: null,
  productAdded: false,
  cart: [],
  wishlist: [],
  theme: 'light',
  setTheme: (mode) => {
    applyTheme(mode);
    set({ theme: mode });
  },
  hydrateTheme: () => {
    const stored = getThemeFromStorage();
    applyTheme(stored);
    set({ theme: stored });
  },
  hydrateCart: () => set((state) => {
    const saved = loadCartFromStorage();
    return saved.length ? { cart: saved } : {};
  }),
  hydrateWishlist: () => set((state) => {
    const saved = loadWishlistFromStorage();
    return saved.length ? { wishlist: saved } : {};
  }),

  setError: (errorMessage) => set({ error: errorMessage }),

  setLoading: (isLoading) => set({ loading: isLoading }),

  fetchProducts: async () => {
    set({ loading: true });
    const baseUrl = getBaseUrl();
    try {
      const response = await fetch(`${baseUrl}/api/productos`, {
        method: 'GET',
        // headers: {
        //   'Authorization': getToken(),
        // },
      });
      if (!response.ok) {
        throw new Error('Error al cargar los productos');
      }
      const data = await response.json();
      set({ products: data });
    } catch (error) {
      const msg = baseUrl ? error.message : 'URL del backend no configurada. Revisa .env.local (NEXT_PUBLIC_NEXT_LOCAL_URL) y reinicia el dev server.';
      set({ error: msg });
      console.error('Error al cargar los productos:', baseUrl ? error : 'baseUrl vacío', baseUrl ? '' : '→', baseUrl || '(vacío)');
    } finally {
      set({ loading: false });
    }
  },

  fetchProductById: async (id) => {
    set({ loading: true });
    const baseUrl = getBaseUrl();
    try {
      const response = await fetch(`${baseUrl}/api/productos/${id}`);
      if (!response.ok) {
        throw new Error('Error al obtener el producto');
      }
      const data = await response.json();
      set({ product: data });
    } catch (error) {
      set({ error: error.message });
    } finally {
      set({ loading: false });
    }
  },

  addProduct: async (productoAEnviar, imagenFile) => {
    set({ loading: true });
    const baseUrl = getBaseUrl();
    try {
      const response = await fetch(`${baseUrl}/api/productos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // 'Authorization': getToken(),
        },
        body: JSON.stringify(productoAEnviar),
      });
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error en la respuesta del servidor:', errorData);
        toast.error(`Error al agregar el producto: ${errorData.message || 'Error desconocido'}`);
        return;
      }
      const nuevoProducto = await response.json();
      if (imagenFile) {
        const formData = new FormData();
        formData.append('imagen', imagenFile);
        const imagenResponse = await fetch(`${baseUrl}/api/productos/${nuevoProducto._id}/imagen`, {
          method: 'POST',
          // headers: {
          //   'Authorization': getToken(),
          // },
          body: formData,
        });
        if (!imagenResponse.ok) {
          const imagenErrorData = await imagenResponse.json();
          toast.error(`Error al subir la imagen: ${imagenErrorData.message || 'Error desconocido'}`);
          return;
        }
      }
      set((state) => ({
        products: [...state.products, nuevoProducto],
        productAdded: true,
      }));
      toast.success('Producto agregado con éxito');
    } catch (error) {
      set({ error: error.message });
      console.error('Error al agregar el producto:', error);
      toast.error('Error al agregar el producto');
    } finally {
      set({ loading: false });
    }
  },

  editProduct: async (producto, newImage) => {
    const baseUrl = getBaseUrl();
    try {
      const response = await fetch(
        `${baseUrl}/api/productos/${producto._id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(producto),
        }
      );
      if (!response.ok) {
        throw new Error("Error al actualizar el producto");
      }
      toast.success("Producto actualizado con éxito");

      if (newImage) {
        const formData = new FormData();
        formData.append("image", newImage);

        const imageResponse = await fetch(
          `${baseUrl}/api/productos/${producto._id}/imagen`,
          {
            method: "PUT",
            body: formData,
          }
        );
        if (!imageResponse.ok) {
          throw new Error("Error al actualizar la imagen");
        }
        toast.success("Imagen actualizada con éxito");
      }

    } catch (error) {
      toast.error(error.message || "Error al actualizar el producto");
      console.error(error);
    }
  },

  registerUser: async (userData) => {
    set({ loading: true });
    const baseUrl = getBaseUrl();
    try {
      const response = await fetch(`${baseUrl}/api/user/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al registrar el usuario");
      }

      const data = await response.json();
      toast.success(data.message || "Usuario registrado exitosamente");
      return true;
    } catch (error) {
      set({ error: error.message });
      toast.error(error.message || "Error al registrar el usuario");
      return false;
    } finally {
      set({ loading: false });
    }
  },

  addToCart: (product) =>
    set((state) => {
      const existingProduct = state.cart.find((item) => item._id === product._id && item.sabor === product.sabor);
      const newCart = existingProduct
        ? state.cart.map((item) =>
            item._id === product._id && item.sabor === product.sabor
              ? { ...item, quantity: item.quantity + (product.quantity || 1) }
              : item
          )
        : [...state.cart, { ...product, quantity: product.quantity || 1 }];
      saveCartToStorage(newCart);
      return { cart: newCart };
    }),

  removeFromCart: (productId, sabor) =>
    set((state) => {
      const newCart = state.cart.filter((item) => !(item._id === productId && item.sabor === sabor));
      saveCartToStorage(newCart);
      return { cart: newCart };
    }),
  clearCart: () =>
    set(() => {
      saveCartToStorage([]);
      return { cart: [] };
    }),

  addToWishlist: (product) =>
    set((state) => {
      const exists = state.wishlist.some((item) => item._id === product._id);
      if (exists) return {};
      const newWishlist = [...state.wishlist, product];
      saveWishlistToStorage(newWishlist);
      return { wishlist: newWishlist };
    }),
  removeFromWishlist: (productId) =>
    set((state) => {
      const newWishlist = state.wishlist.filter((item) => item._id !== productId);
      saveWishlistToStorage(newWishlist);
      return { wishlist: newWishlist };
    }),
  toggleWishlist: (product) =>
    set((state) => {
      const exists = state.wishlist.some((item) => item._id === product._id);
      const newWishlist = exists
        ? state.wishlist.filter((item) => item._id !== product._id)
        : [...state.wishlist, product];
      saveWishlistToStorage(newWishlist);
      return { wishlist: newWishlist };
    }),
  isInWishlist: (productId) => {
    return get().wishlist.some((item) => item._id === productId);
  },

}));

export default useStore;