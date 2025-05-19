import { seedDatabase } from './seeder.js';

// Función para inicializar la base de datos
export const initializeDatabase = async () => {
  try {
    console.log('Iniciando la carga de datos...');
    await seedDatabase();
    console.log('Base de datos inicializada exitosamente');
  } catch (error) {
    console.error('Error al inicializar la base de datos:', error);
    process.exit(1);
  }
};
