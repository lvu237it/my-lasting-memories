import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default ({ mode }) => {
  // Load env file based on `mode` (development, production, etc.)
  const env = loadEnv(mode, process.cwd());

  // Add loaded env variables to `process.env`
  process.env = { ...process.env, ...env };

  return defineConfig({
    // You can access env variables in your code as `process.env.VAR_NAME`
    define: {
      'process.env': process.env,
    },
    plugins: [react()],
  });
};
