import env from "../lib/env";
import cluster from "cluster";
import { cpus } from "os";

cluster.setupPrimary({
  exec: "src/http/listen.ts",
});

const clusterCount = env.AppClusters || cpus().length;
for (let i = 0; i < clusterCount; i++) {
  cluster.fork();
}

cluster.on('exit', worker => {
  console.log(`#${worker.process.pid} Worker died.`);
});
