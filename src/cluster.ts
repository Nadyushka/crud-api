import cluster from 'node:cluster';
import os from 'node:os';
import http from 'node:http';
import { routesHandlers } from './routes/routesHandlers';
import { StatusCodeEnum } from './constants/enum';

const PORT = process.env.PORT ? Number(process.env.PORT) : 4000;
const numCPUs = os.cpus().length - 1; // left one CPU for main process

let currentWorkerIndex = 0;

// use Round Robin
const getPort = (port: number): number => {
  if (currentWorkerIndex === numCPUs) {
    currentWorkerIndex = 1;
  } else {
    currentWorkerIndex = currentWorkerIndex + 1;
  }
  return port + currentWorkerIndex;
};

export const startCluster = () => {
  if (cluster.isPrimary) {
    console.log(`Primary ${process.pid} is running`);

    for (let i = 0; i < numCPUs; i++) {
      cluster.fork();
    }

    cluster.on('exit', (worker) => {
      console.log(`Worker ${worker.process.pid} died. Forking another...`);
      cluster.fork();
    });

    const loadBalancer = http.createServer((req, res) => {
      const workerPort = getPort(PORT);

      const options = {
        hostname: 'localhost',
        port: workerPort,
        path: req.url,
        method: req.method,
        headers: req.headers,
      };

      const proxy = http.request(options, (workerRes) => {
        console.log('Finish request on worker');
        res.writeHead(workerRes.statusCode as number, workerRes.headers);
        workerRes.pipe(res);
      });

      proxy.on('error', (err) => {
        console.error(err);
        res.writeHead(StatusCodeEnum.SERVER_ERROR);
        res.end('Internal Server Error');
      });

      req.pipe(proxy);
    });

    loadBalancer.listen(PORT, () => {
      console.log(`Load balancer listening on port ${PORT}`);
    });
  } else if (cluster.isWorker) {
    // @ts-ignore
    const workerPort = PORT + cluster.worker.id;
    const workerServer = http.createServer((req, res) => {
      routesHandlers(req, res);
    });

    workerServer.listen(workerPort, () => {
      console.log(`Worker ${process.pid} started on port ${workerPort}`);
    });
  }
};
