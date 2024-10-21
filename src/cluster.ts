import cluster from 'node:cluster';
import os from 'node:os';
import http from 'node:http';
import { routesHandlers } from './routes/routesHandlers';
import { StatusCodeEnum } from "./constants/enum";

const PORT = process.env.PORT ? Number(process.env.PORT) : 4000;
const numCPUs = os.cpus().length;

const workers: number[] = [];
let currentWorkerIndex = 0;

export const startCluster = () => {
  if (cluster.isPrimary) {
    console.log(`Primary ${process.pid} is running`);

    for (let i = 1; i < numCPUs; i++) {
      const worker = cluster.fork();
      workers.push(worker.process.pid as number);
      worker.send({ port: PORT + i });
    }

    cluster.on('exit', (worker) => {
      console.log(`Worker ${worker.process.pid} died. Forking another...`);
      const newWorker = cluster.fork();
      workers.push(newWorker.process.pid as number);
    });

    const loadBalancer = http.createServer((req, res) => {
      const workerPort = PORT + ((currentWorkerIndex++ % (numCPUs - 1)) + 1);

      const options = {
        hostname: 'localhost',
        port: workerPort,
        path: req.url,
        method: req.method,
        headers: req.headers,
      };

      const proxy = http.request(options, (workerRes) => {
        // @ts-ignore
        res.writeHead(workerRes.statusCode, workerRes.headers);
        workerRes.pipe(res, { end: true });
      });

      req.pipe(proxy, { end: true });

      proxy.on('error', (err) => {
        console.error(err)
        res.writeHead(StatusCodeEnum.SERVER_ERROR);
        res.end('Internal Server Error');
      });
    });

    loadBalancer.listen(PORT, () => {
      console.log(`Load balancer listening on port ${PORT}`);
    });
  } else {
    process.on('message', (msg) => {
      // @ts-ignore
      if (msg.port) {
        // @ts-ignore
        const port = msg.port;
        const server = http.createServer((req, res) => {
          routesHandlers(req, res);
        });

        server.listen(port, () => {
          console.log(`Worker ${process.pid} started on port ${port}`);
        });
      }
    });
  }
};
