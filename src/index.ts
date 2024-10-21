import { createServer } from 'node:http';
import { routesHandlers } from './routes/routesHandlers';
import * as dotenv from 'dotenv';
import { startCluster } from './cluster';


const args = process.argv.slice(2);
const isMultiMode = args.find((arg) => arg.startsWith('--multi-node'));

dotenv.config();

const PORT = process.env.PORT;

export const server = createServer((req, res) => {
  routesHandlers(req, res);
});

export const startServer = () => {
  server.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
  });
};

if (!isMultiMode) {
  startServer();
} else {
  startCluster();
}
