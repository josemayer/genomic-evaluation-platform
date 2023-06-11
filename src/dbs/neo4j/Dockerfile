FROM neo4j:latest

COPY .env /startup/.env
COPY scripts/wrapper.sh /startup/wrapper.sh

RUN chmod +x /startup/wrapper.sh

ENTRYPOINT ["tini", "-g", "--", "/startup/wrapper.sh"]
CMD ["neo4j"]
