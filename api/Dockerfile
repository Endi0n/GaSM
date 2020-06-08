FROM hayd/alpine-deno:1.0.5

# The port that your application listens to.
EXPOSE 5000

WORKDIR /app

USER deno

ADD . .

CMD ["run", "-c", "tsconfig.json", "--unstable", "--allow-net", "app.ts"]
