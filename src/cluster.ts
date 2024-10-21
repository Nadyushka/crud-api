import cluster from 'node:cluster';
import os from 'node:os';
import http from 'node:http';
import { startServer } from './index';

const numCPUs = os.cpus().length;

export const startCluster = () => {
  if (cluster.isMaster) {
    console.log(`Master ${process.pid} is running`);

    // Создание рабочих процессов
    for (let i = 0; i < numCPUs; i++) {
      cluster.fork();
    }

    cluster.on('exit', (worker) => {
      console.log(`Worker ${worker.process.pid} died. Forking another...`);
      cluster.fork();
    });
  } else {
    startServer();
  }
};

const loadBalancer = http.createServer((req, res) => {
  const workerId = Math.floor(Math.random() * numCPUs);
  const workerPort = 6000 + workerId;

  console.log(
    `Incoming request: ${req.method} ${req.url} -> Redirecting to Worker on port ${workerPort}`,
  );

  const options = {
    hostname: 'localhost',
    port: workerPort,
    path: req.url,
    method: req.method,
    headers: req.headers,
  };

  const proxy = http.request(options, (proxyRes) => {
    // @ts-ignore
    res.writeHead(proxyRes.statusCode, proxyRes.headers);
    proxyRes.pipe(res, { end: true });
  });

  req.pipe(proxy, { end: true });

  proxy.on('error', (err) => {
    console.error(err);
    res.statusCode = 500;
    res.end('Error communicating with worker');
  });
});

loadBalancer.listen(5000, () => {
  console.log(`Load balancer listening on port 5000`);
});
