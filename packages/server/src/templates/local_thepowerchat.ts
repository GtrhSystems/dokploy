
import { type CompleteTemplate } from "./github";

export const thePowerChatTemplate: CompleteTemplate = {
  metadata: {
    id: "thepowerchat",
    name: "ThePowerChat",
    description: "ThePowerChat - Customized Chatwoot Platform",
    version: "latest",
    logo: "https://avatars.githubusercontent.com/u/161623?s=200&v=4",
    links: {
      github: "https://github.com/GtrhSystems/teleya",
      website: "https://thepowerchat.com",
      docs: "https://chatwoot.com/docs"
    },
    tags: ["chat", "customer-support", "rails", "vue"]
  },
  variables: {
    domain: "app.thepowerchat.com",
    postgres_password: "${password:16}",
    redis_password: "${password:16}",
    secret_key_base: "${random:64}",
    postgres_user: "postgres",
    installation_name: "ThePowerChat"
  },
  config: {
    domains: [
      {
        serviceName: "rails",
        port: 3000,
        host: "${domain}",
        path: "/"
      }
    ],
    env: {
      NODE_ENV: "production",
      RAILS_ENV: "production",
      INSTALLATION_NAME: "${installation_name}",
      FORCE_SSL: "true",
      RAILS_MAX_THREADS: "5",
      POSTGRES_USER: "${postgres_user}",
      POSTGRES_PASSWORD: "${postgres_password}",
      REDIS_PASSWORD: "${redis_password}",
      SECRET_KEY_BASE: "${secret_key_base}",
      FRONTEND_URL: "https://${domain}",
      DOMAIN_NAME: "${domain}"
    },
    mounts: []
  }
};

export const thePowerChatCompose = `version: '3.8'

services:
  rails:
    build:
      context: https://github.com/GtrhSystems/teleya.git
      dockerfile: docker/Dockerfile
      args:
        BUNDLE_WITHOUT: 'development:test'
        RAILS_ENV: 'production'
    image: thepowerchat-rails:latest
    restart: always
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy
    environment:
      - NODE_ENV=production
      - RAILS_ENV=production
      - RAILS_LOG_TO_STDOUT=true
      - PORT=3000
      - INSTALLATION_NAME=\${INSTALLATION_NAME}
      - FORCE_SSL=\${FORCE_SSL}
      - RAILS_MAX_THREADS=\${RAILS_MAX_THREADS}
      - POSTGRES_HOST=postgres
      - POSTGRES_USERNAME=\${POSTGRES_USER}
      - POSTGRES_PASSWORD=\${POSTGRES_PASSWORD}
      - REDIS_URL=redis://:\${REDIS_PASSWORD}@redis:6379
      - SECRET_KEY_BASE=\${SECRET_KEY_BASE}
      - FRONTEND_URL=\${FRONTEND_URL}
    entrypoint: docker/entrypoints/rails.sh
    command: ["sh", "-c", "bundle exec rails db:chatwoot_prepare && bundle exec rails s -p 3000 -b 0.0.0.0"]
    networks:
      - dokploy-network

  sidekiq:
    build:
      context: https://github.com/GtrhSystems/teleya.git
      dockerfile: docker/Dockerfile
      args:
        BUNDLE_WITHOUT: 'development:test'
        RAILS_ENV: 'production'
    image: thepowerchat-sidekiq:latest
    restart: always
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy
    environment:
      - NODE_ENV=production
      - RAILS_ENV=production
      - RAILS_LOG_TO_STDOUT=true
      - POSTGRES_HOST=postgres
      - POSTGRES_USERNAME=\${POSTGRES_USER}
      - POSTGRES_PASSWORD=\${POSTGRES_PASSWORD}
      - REDIS_URL=redis://:\${REDIS_PASSWORD}@redis:6379
      - SECRET_KEY_BASE=\${SECRET_KEY_BASE}
    command: ["bundle", "exec", "sidekiq", "-C", "config/sidekiq.yml"]
    networks:
      - dokploy-network

  postgres:
    image: pgvector/pgvector:pg16
    restart: always
    volumes:
      - postgres_data:/var/lib/postgresql/data
    environment:
      - POSTGRES_DB=chatwoot_production
      - POSTGRES_USER=\${POSTGRES_USER}
      - POSTGRES_PASSWORD=\${POSTGRES_PASSWORD}
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U \${POSTGRES_USER}"]
      interval: 5s
      timeout: 5s
      retries: 5
    networks:
      - dokploy-network

  redis:
    image: redis:alpine
    restart: always
    command: ["sh", "-c", "redis-server --requirepass \"\${REDIS_PASSWORD}\""]
    volumes:
      - redis_data:/data
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 5s
      timeout: 5s
      retries: 5
    networks:
      - dokploy-network

networks:
  dokploy-network:
    external: true

volumes:
  postgres_data:
  redis_data:
`;
