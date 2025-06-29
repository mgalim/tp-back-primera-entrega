import { Discount } from '../models/discount.js';
import { Product } from '../models/product.js';
import { Sale } from '../models/sale.js';
import { Supplier } from '../models/supplier.js';
import { User } from '../models/user.js';

export const seedDatabase = async () => {
  try {
    // Limpiar la base de datos
    await Promise.all([
      Product.deleteMany({}),
      Sale.deleteMany({}),
      Supplier.deleteMany({}),
      User.deleteMany({}),
      Discount.deleteMany({}),
    ]);
    console.log('Base de datos limpiada exitosamente');

    const products = await Product.create([
      {
        name: '1984',
        price: 2500,
        description: 'Novela distópica de George Orwell',
        stock: 50,
        category: 'libro',
        isbn: '978-84-380-0564-9',
        _id: '6827a020fb2f9a649f1d4be6',
      },
      {
        name: 'Cien años de soledad',
        price: 3000,
        description: 'Obra maestra de Gabriel García Márquez',
        stock: 45,
        category: 'libro',
        isbn: '978-84-380-0565-9',
        _id: '683b56650850eb18a35bdd5c',
      },
      {
        name: 'Revista Literaria Ñ',
        price: 1200,
        description: 'Revista semanal de literatura y cultura',
        stock: 100,
        category: 'revista',
        isbn: '978-84-380-0566-9',
      },
      {
        name: 'Marcapáginas Premium',
        price: 800,
        description: 'Marcapáginas de cuero genuino',
        stock: 150,
        category: 'articulo',
        isbn: '978-84-380-0567-9',
      },
      {
        name: 'Funda Protectora de Libros',
        price: 1500,
        description: 'Funda ajustable para libros de tapa dura',
        stock: 75,
        category: 'articulo',
        isbn: '978-84-380-0568-9',
      },
    ]);

    // Crear proveedores
    const suppliers = await Supplier.create([
      {
        name: 'Editorial Planeta',
        email: 'contacto@planeta.com',
        phone: '123-456-7890',
        address: 'Av. Independencia 1234',
        _id: '682a5647aee16245150d9eb2',
        products: [products[0]._id, products[1]._id],
      },
      {
        name: 'Penguin Random House',
        email: 'info@penguinrandom.com',
        phone: '098-765-4321',
        address: 'Calle Libertad 567',
        products: [products[0]._id, products[1]._id],
      },
      {
        name: 'Accesorios Literarios SA',
        email: 'ventas@accesorios-literarios.com',
        phone: '555-123-4567',
        address: 'Calle de los Libros 789',
        products: [products[0]._id, products[1]._id],
      },
    ]);
    console.log('Proveedores creados exitosamente');

    // Crear productos

    console.log('Productos creados exitosamente');

    // Crear ventas
    await Sale.create([
      {
        products: [
          {
            product: products[0]._id,
            quantity: 1,
            price: products[0].price,
          },
          {
            product: products[3]._id,
            quantity: 2,
            price: products[3].price,
          },
        ],
        total: 3000,
        customer: {
          name: 'Juan Pérez',
          email: 'juan@email.com',
        },
        _id: '682a576baee16245150d9eea',
      },
      {
        products: [
          {
            product: products[1]._id,
            quantity: 1,
            price: products[1].price,
          },
          {
            product: products[2]._id,
            quantity: 1,
            price: products[2].price,
          },
          {
            product: products[4]._id,
            quantity: 1,
            price: products[4].price,
          },
        ],
        total: 3700,
        customer: {
          name: 'María García',
          email: 'maria@email.com',
        },
      },
    ]);
    console.log('Ventas creadas exitosamente');

    // Crear usuarios
    await User.create([
      {
        name: 'Admin',
        lastname: 'Sistema',
        email: 'admin@libreria.com',
        password: '$2b$10$lY7nOP8Tw84wHSbUjKH6juKhFIIDZrKkPjk5F4HDzlQUTGR/ql6DK',
        role: 'administrador',
      },
      {
        name: 'User',
        lastname: 'Random',
        email: 'user@libreria.com',
        password: '$2b$10$lY7nOP8Tw84wHSbUjKH6juKhFIIDZrKkPjk5F4HDzlQUTGR/ql6DK',
        role: 'cliente',
      },
      {
        name: 'Catriel',
        lastname: 'Escobar',
        email: 'catriel.escobar@gmail.com',
        password: '$2b$10$lY7nOP8Tw84wHSbUjKH6juKhFIIDZrKkPjk5F4HDzlQUTGR/ql6DK',
        role: 'cliente',
        _id: '683a4f74d9cef30a6421c632',
      },
      {
        name: 'Marcelo',
        lastname: 'Galimberti',
        email: 'marcelo.galimberti@gmail.com',
        password: '$2b$10$lY7nOP8Tw84wHSbUjKH6juKhFIIDZrKkPjk5F4HDzlQUTGR/ql6DK',
        role: 'administrador',
      },
      {
        name: 'Gustavo',
        lastname: 'Baranda',
        email: 'gustavo.baranda@gmail.com',
        password: '$2b$10$lY7nOP8Tw84wHSbUjKH6juKhFIIDZrKkPjk5F4HDzlQUTGR/ql6DK',
        role: 'cliente',
      },
      {
        name: 'Eugenia',
        lastname: 'Bava',
        email: 'eugenia.bava@gmail.com',
        password: '$2b$10$lY7nOP8Tw84wHSbUjKH6juKhFIIDZrKkPjk5F4HDzlQUTGR/ql6DK',
        role: 'cliente',
      },
    ]);
    console.log('Usuarios creados exitosamente');

    console.log('Base de datos sembrada exitosamente');
  } catch (error) {
    console.error('Error al sembrar la base de datos:', error);
    throw error;
  }
};
