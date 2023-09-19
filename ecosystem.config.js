module.exports = {
  apps: [
    {
      name: "nestjs-app",
      script: "npm",
      args: "run start:prod",
      env: {
        NODE_ENV: "production"
      },
      autorestart: true,
      watch: false,
      max_memory_restart: "1G",
      merge_logs: true
    }
  ]
};