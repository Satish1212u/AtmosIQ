import { z } from 'zod';

/**
 * Generic Validation Middleware
 */
export const validate = (schema) => (req, res, next) => {
  try {
    schema.parse({
      body: req.body,
      query: req.query,
      params: req.params,
    });

    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: error.errors.map((err) => ({
          field: err.path.join('.'),
          message: err.message,
        })),
      });
    }

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Auth Validation Schemas
 */
export const authSchemas = {
  register: z.object({
    body: z.object({
      name: z.string().min(2),
      email: z.string().email(),
      password: z.string().min(6),
    }),
  }),

  login: z.object({
    body: z.object({
      email: z.string().email(),
      password: z.string().min(6),
    }),
  }),
};

/**
 * Weather Validation Schemas
 */
export const weatherSchemas = {
  getWeather: z.object({
    query: z.object({
      city: z.string().optional(),
      lat: z.string().optional(),
      lon: z.string().optional(),
    }).refine(
      (data) => data.city || (data.lat && data.lon),
      {
        message: 'Either (lat and lon) or city must be provided',
      }
    ),
  }),
};