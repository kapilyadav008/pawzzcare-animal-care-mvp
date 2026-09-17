import { Router } from 'express';
import { z } from 'zod';
import { validateBody } from '../middleware/validate.js';
import { analyzeCareRequest } from '../services/aiService.js';

const router = Router();

const AssistantQuerySchema = z.object({
  query: z.string({ required_error: 'Query string is required' }).min(2, 'Query must be at least 2 characters long')
});

router.post('/analyze', validateBody(AssistantQuerySchema), async (req, res, next) => {
  try {
    const { query } = req.body;
    const result = await analyzeCareRequest(query);
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
});

export default router;
