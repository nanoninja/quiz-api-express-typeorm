import { resolve } from 'path';
import { config } from 'dotenv';

// config({ path: resolve(__dirname, '../../staging.env') });
config({ path: resolve(__dirname, '../../.env') });
