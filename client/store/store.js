import { toast } from 'react-hot-toast';
import { create } from 'zustand';

const useStore = create((set) => ({
  products: [],
  product: null,
  loading: false,
  error: null,
  productAdded: false,

  fetchProducts: async () => {
    set({ loading: true });
    try {
      const response = await fetch("http://localhost:5000/api/productos", {
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

  addProduct: async (productoAEnviar, imagenFile) => {
    set({ loading: true });
    try {
      const response = await fetch("http://localhost:5000/api/productos", {
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
      set((state) => ({
        products: [...state.products, nuevoProducto],
        productAdded: true,
      }));
      if (imagenFile) {
        const formData = new FormData();
        formData.append('imagen', imagenFile);
        const imagenResponse = await fetch(`http://localhost:5000/api/productos/${nuevoProducto._id}/imagen`, {
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
        `http://localhost:5000/api/productos/${producto._id}`,
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
          `http://localhost:5000/api/productos/${producto._id}/imagen`,
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

}));

export default useStore;