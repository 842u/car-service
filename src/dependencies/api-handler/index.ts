import { NextApiHandler } from '@/common/infrastructure/api-handler/next-api-handler';
import { validator } from '@/dependencies/validator';

export const apiHandler = new NextApiHandler(validator);
