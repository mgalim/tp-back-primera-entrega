import { z } from 'zod';

export const productSchema = z.object({
  name: z.string({
    required_error: 'El nombre es requerido',
  }),
  price: z
    .number({
      required_error: 'El precio es requerido',
    })
    .positive('El precio debe ser positivo'),
  description: z.string().optional(),
  stock: z
    .number({
      required_error: 'El stock es requerido',
    })
    .min(0, 'El stock no puede ser negativo'),
  category: z.enum(['libro', 'revista', 'articulo'], {
    required_error: 'La categoría es requerida',
    invalid_type_error: 'Categoría inválida',
  }),
  supplier: z.string({
    required_error: 'El proveedor es requerido',
  }),
});

export const userSchema = z.object({
  name: z.string({
    required_error: 'El nombre es requerido',
  }),
  lastname: z.string({
    required_error: 'El apellido es requerido',
  }),
  email: z
    .string({
      required_error: 'El email es requerido',
    })
    .email('Email inválido'),
  password: z
    .string({
      required_error: 'La contraseña es requerida',
    })
    .min(6, 'La contraseña debe tener al menos 6 caracteres'),
  role: z.enum(['administrador', 'empleado', 'supervisor']).default('empleado'),
});

export const supplierSchema = z.object({
  name: z.string({
    required_error: 'El nombre es requerido',
  }),
  email: z
    .string({
      required_error: 'El email es requerido',
    })
    .email('Email inválido'),
  phone: z.string({
    required_error: 'El teléfono es requerido',
  }),
  address: z.string({
    required_error: 'La dirección es requerida',
  }),
});

export const saleProductSchema = z.object({
  product: z.string({
    required_error: 'El ID del producto es requerido',
  }),
  quantity: z
    .number({
      required_error: 'La cantidad es requerida',
    })
    .min(1, 'La cantidad debe ser al menos 1'),
  price: z
    .number({
      required_error: 'El precio es requerido',
    })
    .positive('El precio debe ser positivo'),
});

export const saleSchema = z.object({
  products: z
    .array(saleProductSchema)
    .nonempty('Debe incluir al menos un producto'),
  customer: z
    .object({
      name: z.string().optional(),
      email: z.string().email('Email inválido').optional(),
    })
    .optional(),
});
