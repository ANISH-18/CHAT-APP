export const commonRmqOptions = {
  urls: [process.env.RABBITMQ_URL],
  queueOptions: {
    durable: false,
    prefetch: 1,
  },
};

export const QUEUE = {
  AUTH: process.env.AUTH_QUEUE,
  MESSAGE: process.env.MESSAGE_QUEUE,
  NOTIFICATION: process.env.NOTIFICATION_QUEUE,
};

export const SERVICE = {
  AUTH: process.env.AUTH_SERVICE,
  MESSAGE: process.env.MESSAGE_SERVICE,
  NOTIFICATION: process.env.NOTIFICATION_SERVICE,
};
