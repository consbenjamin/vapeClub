import { toast } from 'react-hot-toast';
import { create } from 'zustand';

const URL = process.env.NEXT_PUBLIC_URL;  

const useStore = create((set) => ({
  products: [],
  product: null,
  loading: false,
  error: null,
  productAdded: false,
  cart: [],

  setError: (errorMessage) => set({ error: errorMessage }),

  setLoading: (isLoading) => set({ loading: isLoading }),

  fetchProducts: async () => {
    set({ loading: true });
    try {
      const response = await fetch(`${URL}/api/productos`, {
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
      set({ error: error.message });
      console.error('Error al cargar los productos:', error);
    } finally {
      set({ loading: false });
    }
  },

  fetchProductById: async (id) => {
    set({ loading: true });
    try {
      const response = await fetch(`${URL}/api/productos/${id}`);
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
    try {
      const response = await fetch(`${URL}/api/productos`, {
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
        const imagenResponse = await fetch(`${URL}/api/productos/${nuevoProducto._id}/imagen`, {
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
    try {
      const response = await fetch(
        `${URL}/api/productos/${producto._id}`,
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
          `${URL}/api/productos/${producto._id}/imagen`,
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
    try {
      const response = await fetch(`${URL}/api/user/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
        credentials: "include",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al registrar el usuario");
      }

      const data = await response.json();
      toast.success(data.message || "Usuario registrado exitosamente");
    } catch (error) {
      set({ error: error.message });
      console.error("Error al registrar el usuario:", error);
      toast.error(error.message || "Error al registrar el usuario");
    } finally {
      set({ loading: false });
    }
  },

  addToCart: (product) =>
    set((state) => {
      const existingProduct = state.cart.find((item) => item._id === product._id && item.sabor === product.sabor);
      if (existingProduct) {
        return {
          cart: state.cart.map((item) =>
            item._id === product._id && item.sabor === product.sabor
              ? { ...item, quantity: item.quantity + (product.quantity || 1) }
              : item
          ),
        };
      }
      return { cart: [...state.cart, { ...product, quantity: product.quantity || 1 }] };
    }
  ),

  removeFromCart: (productId, sabor) =>
    set((state) => ({
      cart: state.cart.filter((item) => !(item._id === productId && item.sabor === sabor)),
    })
  ),
  clearCart: () =>
    set(() => ({
      cart: [],
    })
  ),

}));

export default useStore;