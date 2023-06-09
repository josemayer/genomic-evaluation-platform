FROM redis/redis-stack:latest

RUN mkdir -p /var/db/redis/store /var/db/redis/log
COPY ./conf/redis.conf /etc/redis/redis.conf

CMD redis-server /etc/redis/redis.conf --requirepass ${REDIS_PASSWORD} --loadmodule /opt/redis-stack/lib/redisearch.so --loadmodule /opt/redis-stack/lib/rejson.so
