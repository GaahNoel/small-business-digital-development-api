import './config/module-alias';
import { env } from '@/main/config/env';
import { app } from '@/main/config/app';

export const listener = app.listen(env.port, () => {
  console.log(`Server running at http://localhost:${env.port}`);
});
