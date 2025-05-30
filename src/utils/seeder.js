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
    ]);
    console.log('Base de datos limpiada exitosamente');

    // Crear proveedores
    const suppliers = await Supplier.create([
      {
        name: 'Editorial Planeta',
        email: 'contacto@planeta.com',
        phone: '123-456-7890',
        address: 'Av. Independencia 1234',
        _id: "682a5647aee16245150d9eb2"
      },
      {
        name: 'Penguin Random House',
        email: 'info@penguinrandom.com',
        phone: '098-765-4321',
        address: 'Calle Libertad 567',
      },
      {
        name: 'Accesorios Literarios SA',
        email: 'ventas@accesorios-literarios.com',
        phone: '555-123-4567',
        address: 'Calle de los Libros 789',
      },
    ]);
    console.log('Proveedores creados exitosamente');

    // Crear productos
    const products = await Product.create([
      {
        name: '1984',
        price: 2500,
        description: 'Novela distópica de George Orwell',
        stock: 50,
        category: 'libro',
        supplier: suppliers[0]._id,
        _id: "6827a020fb2f9a649f1d4be6"
      },
      {
        name: 'Cien años de soledad',
        price: 3000,
        description: 'Obra maestra de Gabriel García Márquez',
        stock: 45,
        category: 'libro',
        supplier: suppliers[1]._id,
      },
      {
        name: 'Revista Literaria Ñ',
        price: 1200,
        description: 'Revista semanal de literatura y cultura',
        stock: 100,
        category: 'revista',
        supplier: suppliers[1]._id,
      },
      {
        name: 'Marcapáginas Premium',
        price: 800,
        description: 'Marcapáginas de cuero genuino',
        stock: 150,
        category: 'articulo',
        supplier: suppliers[2]._id,
      },
      {
        name: 'Funda Protectora de Libros',
        price: 1500,
        description: 'Funda ajustable para libros de tapa dura',
        stock: 75,
        category: 'articulo',
        supplier: suppliers[2]._id,
      },
    ]);
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
        customer: {
          name: 'Juan Pérez',
          email: 'juan@email.com',
        },
        _id: "682a576baee16245150d9eea"
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
        password: 'admin123',
        role: 'administrador',
      },
      {
        name: 'Juan',
        lastname: 'Supervisor',
        email: 'supervisor@libreria.com',
        password: 'super123',
        role: 'supervisor',
      },
      {
        name: 'María',
        lastname: 'Empleada',
        email: 'empleada@libreria.com',
        password: 'emp123',
        role: 'empleado',
      },
    ]);
    console.log('Usuarios creados exitosamente');

    console.log('Base de datos sembrada exitosamente');
  } catch (error) {
    console.error('Error al sembrar la base de datos:', error);
    throw error;
  }
};
