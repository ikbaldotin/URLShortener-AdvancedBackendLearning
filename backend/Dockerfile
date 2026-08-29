#STAGE 2 -BUILDER
FROM node:24-bookworm-slim AS builder

#Set the working  directory

WORKDIR /app

#Copy the dependency manifests first to maximize Docker cache useage
COPY package*.json ./

#Install all dependencies (including dev dependencies)

RUN npm ci

#Copy the remaining application source code
COPY . .

#Generate Prisma Client
RUN npx prisma generate

#Compile Typescript
RUN npm run build

#STAGE 2 - PRODUCTION
FROM node:24-bookworm-slim AS production 

#Set production  environment 
ENV NODE_ENV=prod

#Set the working directory
WORKDIR /app

#copy dependency  manifests
COPY package*.json ./

#Install only production dependency
RUN npm ci --omit=dev && npm cache clean --force

#Copy Compile application
COPY --from=builder  /app/dist ./dist

#Copy Prisma client and Schema
COPY --from=builder  /app/generated  ./generated
COPY --from=builder /app/prisma   ./prisma

#Run as  non-root user

USER node

#Document the application  part
EXPOSE 3000

#Start the application
CMD [ "node","dist/index.js" ]