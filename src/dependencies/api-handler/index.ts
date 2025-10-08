import { NextApiHandler } from '@/common/infrastructure/api-handler/next';
import { validator } from '@/dependencies/validator';

export const apiHandler = new NextApiHandler(validator);
