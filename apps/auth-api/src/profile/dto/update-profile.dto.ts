import { z } from 'zod';

export const updateProfileSchema = z.object({
  username: z
    .string()
    .min(1, 'Username is required')
    .max(30, 'Username must be 30 characters or less')
    .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers and underscores'),
  
  birthday: z
    .string()
    .min(1, 'Birthday is required')
    .datetime({ message: 'Birthday must be a valid ISO date string' }),
  
  gender: z
    .enum(['male', 'female', 'other', 'prefer_not_to_say'], {
      message: 'Gender must be male, female, other, or prefer_not_to_say'
    }),
  
  tennisLevel: z
    .enum(['1.0', '1.5', '2.0', '2.5', '3.0', '3.5', '4.0', '4.5', '5.0', '5.5', '6.0', '6.5', '7.0'], {
      message: 'Tennis level must be a valid NTRP rating (1.0-7.0)'
    })
});

export type UpdateProfileDto = z.infer<typeof updateProfileSchema>;