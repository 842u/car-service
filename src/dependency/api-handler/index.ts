import { NextApiHandler } from '@/common/infrastructure/api-handler/next';
import { validator } from '@/dependency/validator';

export const apiHandler = new NextApiHandler(validator);
