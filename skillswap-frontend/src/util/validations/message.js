const { z } = require('zod');

export const messageValidator = z.object({
  id: z.string(),
  senderEmail: z.string(),
  text: z.string(),
  timestamp: z.number(),
});

export const messageArrayValidator = z.array(messageValidator);
