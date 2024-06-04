import {Router} from 'express';
import { fiscal_category_router } from './api/fiscalCategoryAPI';

export const fiscal_category_major_router = Router();

fiscal_category_major_router.use('/categorias_fiscais',fiscal_category_router);


