import { ApiResponse, ApiError } from '../types/api.types';

export const createSuccessResponse = <T>(data: T): ApiResponse<T> => ({
  success: true,
  data,
  timestamp: new Date().toISOString(),
});

export const createErrorResponse = (error: ApiError): ApiResponse => ({
  success: false,
  error,
  timestamp: new Date().toISOString(),
});

export const createApiError = (
  code: string,
  message: string,
  details?: Record<string, any>,
): ApiError => ({
  code,
  message,
  details,
});

export const commonErrors = {
  UNAUTHORIZED: createApiError('UNAUTHORIZED', 'Authentication required'),
  FORBIDDEN: createApiError('FORBIDDEN', 'Access denied'),
  NOT_FOUND: createApiError('NOT_FOUND', 'Resource not found'),
  VALIDATION_ERROR: createApiError('VALIDATION_ERROR', 'Invalid input data'),
  INTERNAL_ERROR: createApiError('INTERNAL_ERROR', 'Internal server error'),
  RATE_LIMITED: createApiError('RATE_LIMITED', 'Too many requests'),
};
