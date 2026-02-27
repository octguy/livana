# CI/CD Guide for Livana

## Table of Contents

1. [What is CI/CD?](#1-what-is-cicd)
2. [Key Concepts](#2-key-concepts)
3. [How CI/CD Works (The Pipeline)](#3-how-cicd-works-the-pipeline)
4. [Tools Overview](#4-tools-overview)
5. [Applying CI/CD to Livana](#5-applying-cicd-to-livana)
6. [GitHub Actions Workflows](#6-github-actions-workflows)
   - [Backend Pipeline](#61-backend-pipeline-livana-be)
   - [Frontend Pipeline](#62-frontend-pipeline-livana-fe)
   - [Full Deployment Pipeline](#63-full-deployment-pipeline)
7. [Setting Up Secrets](#7-setting-up-secrets)
8. [Understanding the Workflow Files](#8-understanding-the-workflow-files)
9. [Common Pitfalls for Beginners](#9-common-pitfalls-for-beginners)

---

## 1. What is CI/CD?

**CI/CD** stands for **Continuous Integration / Continuous Delivery (or Deployment)**.

Think of it like an automated assembly line for your code:

- Every time you push code → the pipeline **automatically** builds it, tests it, and (optionally) deploys it.
- You stop manually running `./gradlew bootJar` or `npm run build` on a server. The machine does it for you.

| Term | What it means in plain language |
|------|--------------------------------|
| **Continuous Integration (CI)** | Every push is automatically built and tested. Problems are caught early. |
| **Continuous Delivery (CD)** | After passing CI, the artifact (JAR, Docker image) is ready to deploy at any time with one click. |
| **Continuous Deployment** | Goes one step further — passing CI automatically deploys to production with zero human intervention. |

---

## 2. Key Concepts

### Pipeline
A **pipeline** is the sequence of automated steps triggered by a code change. Each step is called a **job** or **stage**.

```
Push code → Build → Test → Package (Docker image) → Deploy
```

### Artifact
An **artifact** is the output of a build step that is passed to the next step. For Livana:
- Backend: a Spring Boot JAR file (`livana-be-0.0.1-SNAPSHOT.jar`)
- Frontend: a compiled `dist/` folder served by nginx
- Final form: Docker images stored in a container registry (e.g., Docker Hub, GitHub Container Registry)

### Runner
The machine (virtual or physical) that executes your pipeline jobs. GitHub Actions provides free cloud runners (Ubuntu, Windows, macOS).

### Trigger
The event that starts a pipeline, e.g.:
- `push` to the `main` branch
- Opening a Pull Request
- A scheduled cron job

---

## 3. How CI/CD Works (The Pipeline)

For **Livana**, here is the logical flow:

```
Developer pushes to GitHub
        │
        ▼
┌───────────────────────────────────────────────────────┐
│                    CI Stage                           │
│                                                       │
│  ┌─────────────┐   ┌─────────────┐                   │
│  │  Backend CI │   │ Frontend CI │  (run in parallel) │
│  │             │   │             │                   │
│  │ 1. Checkout │   │ 1. Checkout │                   │
│  │ 2. Build JAR│   │ 2. npm ci   │                   │
│  │ 3. Run tests│   │ 3. npm build│                   │
│  │ 4. Lint     │   │ 4. Lint     │                   │
│  └──────┬──────┘   └──────┬──────┘                   │
└─────────┼────────────────┼──────────────────────────┘
          │  Both pass?    │
          ▼                ▼
┌───────────────────────────────────────────────────────┐
│                  CD Stage                             │
│                                                       │
│  1. Build Docker image for backend                    │
│  2. Build Docker image for frontend                   │
│  3. Push images to registry                           │
│  4. SSH into server → docker compose pull + up        │
└───────────────────────────────────────────────────────┘
```

---

## 4. Tools Overview

This guide uses **GitHub Actions** because:
- It's built into GitHub (no extra sign-up needed)
- Free for public repos and generous free tier for private repos
- YAML-based, easy to read

Other popular tools you may encounter: Jenkins, GitLab CI, CircleCI, Travis CI.

---

## 5. Applying CI/CD to Livana

### Project Stack Recap

| Layer | Technology | Build command |
|-------|-----------|---------------|
| Backend | Java 25, Spring Boot 3.5.7, Gradle | `./gradlew bootJar -x test` |
| Frontend | React, TypeScript, Vite, Node 22 | `npm run build` |
| Containerization | Docker (multi-stage builds) | `docker build` |
| Orchestration | Docker Compose | `docker compose up -d` |
| Database | PostgreSQL 17 | — (infra, not built) |
| Messaging | RabbitMQ 4 | — (infra, not built) |

### What the Pipeline Will Do

**On every Pull Request (CI only):**
1. Build the Spring Boot backend and run unit tests
2. Build the React frontend and run linting

**On merge to `main` (CI + CD):**
1. All CI steps above
2. Build Docker images for both services
3. Push images to GitHub Container Registry (ghcr.io)
4. SSH into your VPS and run `docker compose pull && docker compose up -d`

---

## 6. GitHub Actions Workflows

Create the following directory structure in your repository:

```
.github/
└── workflows/
    ├── backend-ci.yml        # CI for backend
    ├── frontend-ci.yml       # CI for frontend
    └── deploy.yml            # Build images + deploy (runs after CI passes)
```

---

### 6.1 Backend Pipeline (`livana-be`)

Create `.github/workflows/backend-ci.yml`:

```yaml
name: Backend CI

# Trigger on pushes and PRs that touch backend code
on:
  push:
    branches: [ main, develop ]
    paths:
      - 'livana-be/**'
      - '.github/workflows/backend-ci.yml'
  pull_request:
    branches: [ main, develop ]
    paths:
      - 'livana-be/**'

jobs:
  build-and-test:
    name: Build & Test (Java)
    runs-on: ubuntu-latest          # GitHub-hosted runner

    steps:
      # 1. Check out your repository code
      - name: Checkout code
        uses: actions/checkout@v4

      # 2. Set up the correct Java version (must match build.gradle → Java 25)
      - name: Set up JDK 25
        uses: actions/setup-java@v4
        with:
          java-version: '25'
          distribution: 'temurin'   # Same JDK used in your Dockerfile

      # 3. Cache Gradle dependencies to speed up subsequent runs
      - name: Cache Gradle packages
        uses: actions/cache@v4
        with:
          path: |
            ~/.gradle/caches
            ~/.gradle/wrapper
          key: ${{ runner.os }}-gradle-${{ hashFiles('livana-be/**/*.gradle*', 'livana-be/gradle/wrapper/gradle-wrapper.properties') }}
          restore-keys: ${{ runner.os }}-gradle-

      # 4. Build the JAR and run tests
      - name: Build with Gradle
        working-directory: livana-be
        run: ./gradlew build --no-daemon

      # 5. (Optional) Upload the test report as an artifact for inspection
      - name: Upload test report
        if: always()                # Run even if tests failed so you can read reports
        uses: actions/upload-artifact@v4
        with:
          name: test-report
          path: livana-be/build/reports/tests/test/
```

---

### 6.2 Frontend Pipeline (`livana-fe`)

Create `.github/workflows/frontend-ci.yml`:

```yaml
name: Frontend CI

on:
  push:
    branches: [ main, develop ]
    paths:
      - 'livana-fe/**'
      - '.github/workflows/frontend-ci.yml'
  pull_request:
    branches: [ main, develop ]
    paths:
      - 'livana-fe/**'

jobs:
  build-and-lint:
    name: Build & Lint (React)
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      # Set up Node.js (must match the Node version in your Dockerfile — Node 22)
      - name: Set up Node.js 22
        uses: actions/setup-node@v4
        with:
          node-version: '22'
          cache: 'npm'
          cache-dependency-path: livana-fe/package-lock.json

      # Install exact versions from package-lock.json (reproducible installs)
      - name: Install dependencies
        working-directory: livana-fe
        run: npm ci

      # Run ESLint
      - name: Lint
        working-directory: livana-fe
        run: npm run lint

      # Type-check with TypeScript
      - name: Type check
        working-directory: livana-fe
        run: npx tsc --noEmit

      # Build the production bundle (VITE_API_URL is a dummy value for the build check)
      - name: Build
        working-directory: livana-fe
        env:
          VITE_API_URL: http://localhost:8080
        run: npm run build

      # Upload the built dist/ folder (useful for preview deployments)
      - name: Upload build artifact
        uses: actions/upload-artifact@v4
        with:
          name: frontend-dist
          path: livana-fe/dist/
          retention-days: 7
```

---

### 6.3 Full Deployment Pipeline

This workflow runs **only on pushes to `main`** after both CI workflows pass. It builds Docker images, pushes them to GitHub Container Registry, and deploys to your VPS.

Create `.github/workflows/deploy.yml`:

```yaml
name: Build & Deploy

on:
  push:
    branches: [ main ]

# Prevent multiple concurrent deployments
concurrency:
  group: production-deploy
  cancel-in-progress: false

jobs:
  # ────────────────────────────────────────────────────────────────────────────
  # Job 1: Run backend CI (re-using the same checks)
  # ────────────────────────────────────────────────────────────────────────────
  backend-ci:
    name: Backend CI
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-java@v4
        with:
          java-version: '25'
          distribution: 'temurin'
      - uses: actions/cache@v4
        with:
          path: |
            ~/.gradle/caches
            ~/.gradle/wrapper
          key: ${{ runner.os }}-gradle-${{ hashFiles('livana-be/**/*.gradle*') }}
      - name: Build & Test
        working-directory: livana-be
        run: ./gradlew build --no-daemon

  # ────────────────────────────────────────────────────────────────────────────
  # Job 2: Run frontend CI
  # ────────────────────────────────────────────────────────────────────────────
  frontend-ci:
    name: Frontend CI
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '22'
          cache: 'npm'
          cache-dependency-path: livana-fe/package-lock.json
      - run: npm ci
        working-directory: livana-fe
      - run: npm run lint
        working-directory: livana-fe
      - run: npm run build
        working-directory: livana-fe
        env:
          VITE_API_URL: http://localhost:8080

  # ────────────────────────────────────────────────────────────────────────────
  # Job 3: Build Docker images and push to GitHub Container Registry
  # Runs only after both CI jobs pass (needs: [...])
  # ────────────────────────────────────────────────────────────────────────────
  docker-build-push:
    name: Build & Push Docker Images
    runs-on: ubuntu-latest
    needs: [ backend-ci, frontend-ci ]   # Wait for both CI jobs to succeed

    permissions:
      contents: read
      packages: write                    # Required to push to ghcr.io

    steps:
      - uses: actions/checkout@v4

      # Log in to GitHub Container Registry using the auto-generated GITHUB_TOKEN
      - name: Log in to GitHub Container Registry
        uses: docker/login-action@v3
        with:
          registry: ghcr.io
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}

      # Enable Docker layer caching to make subsequent builds faster
      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v3

      # Build and push the backend image
      # Image will be tagged: ghcr.io/<your-github-username>/livana-be:latest
      - name: Build & Push Backend Image
        uses: docker/build-push-action@v6
        with:
          context: ./livana-be
          file: ./livana-be/Dockerfile
          push: true
          tags: ghcr.io/${{ github.repository_owner }}/livana-be:latest
          cache-from: type=gha
          cache-to: type=gha,mode=max

      # Build and push the frontend image
      - name: Build & Push Frontend Image
        uses: docker/build-push-action@v6
        with:
          context: ./livana-fe
          file: ./livana-fe/Dockerfile
          push: true
          tags: ghcr.io/${{ github.repository_owner }}/livana-fe:latest
          build-args: |
            VITE_API_URL=${{ secrets.VITE_API_URL }}
          cache-from: type=gha
          cache-to: type=gha,mode=max

  # ────────────────────────────────────────────────────────────────────────────
  # Job 4: Deploy to VPS
  # SSHes into your server and does: docker compose pull + up
  # ────────────────────────────────────────────────────────────────────────────
  deploy:
    name: Deploy to VPS
    runs-on: ubuntu-latest
    needs: [ docker-build-push ]

    steps:
      - name: Deploy via SSH
        uses: appleboy/ssh-action@v1
        with:
          host: ${{ secrets.VPS_HOST }}
          username: ${{ secrets.VPS_USER }}
          key: ${{ secrets.VPS_SSH_KEY }}
          script: |
            # Navigate to project directory on the server
            cd ~/livana

            # Log in to GitHub Container Registry on the server
            echo ${{ secrets.GITHUB_TOKEN }} | docker login ghcr.io \
              -u ${{ secrets.VPS_GITHUB_USER }} --password-stdin

            # Pull the latest images that were just built and pushed
            docker compose pull

            # Restart containers with zero-downtime (existing containers are
            # replaced one by one — good enough for a small project)
            docker compose up -d --remove-orphans

            # Clean up old images to free disk space
            docker image prune -f
```

---

## 7. Setting Up Secrets

GitHub Actions uses **Secrets** to store sensitive values (passwords, SSH keys, tokens). They are never exposed in logs.

Go to your GitHub repository → **Settings** → **Secrets and variables** → **Actions** → **New repository secret**.

| Secret Name | What it is | Where to get it |
|-------------|-----------|-----------------|
| `VPS_HOST` | IP address or domain of your server | Your VPS provider (e.g., DigitalOcean, AWS) |
| `VPS_USER` | SSH username on the server (usually `ubuntu` or `root`) | Your VPS setup |
| `VPS_SSH_KEY` | Private SSH key to authenticate with the server | `cat ~/.ssh/id_rsa` on your local machine |
| `VPS_GITHUB_USER` | Your GitHub username | Your GitHub profile |
| `VITE_API_URL` | Backend API URL for the frontend (e.g., `https://api.livana.com`) | Your domain |
| `GITHUB_TOKEN` | **Auto-provided by GitHub** — no setup needed | Automatically injected by GitHub Actions |

### Generating an SSH Key Pair (if you don't have one)

```bash
# Generate a new key pair specifically for CI/CD
ssh-keygen -t ed25519 -C "livana-cicd" -f ~/.ssh/livana_cicd

# Add the PUBLIC key to your server's authorized_keys
ssh-copy-id -i ~/.ssh/livana_cicd.pub your-user@your-server-ip

# Copy the PRIVATE key and paste it as the VPS_SSH_KEY secret
cat ~/.ssh/livana_cicd
```

---

## 8. Understanding the Workflow Files

Here is a breakdown of the key YAML keywords you'll see:

```yaml
name: Backend CI          # Display name in GitHub Actions UI

on:                       # TRIGGER — what event starts this pipeline
  push:
    branches: [ main ]    # Only run when pushing to main

jobs:                     # A pipeline has one or more jobs
  my-job:                 # Job name (you choose this)
    runs-on: ubuntu-latest  # Type of runner machine

    steps:                # Ordered list of steps within the job
      - name: Step label  # Human-readable step name
        uses: actions/checkout@v4   # Use a pre-built Action from the marketplace
        # OR
        run: ./gradlew build        # Run a shell command directly

      - name: Another step
        working-directory: livana-be  # Run commands from this subdirectory
        env:
          MY_VAR: value   # Environment variables for this step
        run: echo $MY_VAR
```

### How `needs` Creates Dependencies Between Jobs

```yaml
jobs:
  job-a:
    ...
  job-b:
    needs: job-a          # job-b won't start until job-a succeeds
    ...
  job-c:
    needs: [ job-a, job-b ]  # job-c waits for BOTH
```

This is how the pipeline ensures Docker images are only pushed when CI passes, and deployment only happens when images are pushed.

---

## 9. Common Pitfalls for Beginners

### 1. Forgetting `working-directory`
Since the repo has both `livana-be/` and `livana-fe/` at the root, you must specify `working-directory` or prefix your commands. Otherwise `./gradlew` won't be found.

### 2. Committing secrets in code
**Never** put API keys, passwords, or tokens directly in workflow YAML files. Always use `${{ secrets.SECRET_NAME }}`.

### 3. Java version mismatch
The workflow uses Java 25 (`temurin`) to match the `eclipse-temurin:25-jdk-noble` base image in the Dockerfile. Changing one without the other causes subtle build failures.

### 4. `npm ci` vs `npm install`
`npm ci` is used in CI/CD because it:
- Installs exact versions from `package-lock.json`
- Fails if `package-lock.json` is out of sync with `package.json`
- Is faster (skips the dependency resolution step)

### 5. Caching stops working
Cache keys are based on file hashes (e.g., `hashFiles('**/*.gradle*')`). If you change a dependency file but don't push it, the cache won't be invalidated. Always commit your lock files (`package-lock.json`, `gradle/wrapper/gradle-wrapper.properties`).

### 6. The first run is always slow
Caches are empty on the first run. Gradle will download all dependencies (~2-5 min). Subsequent runs use the cache and complete in ~30-60 seconds.

### 7. Docker image not updating on the server
If `docker compose up -d` didn't pull the new image, make sure `.env` on the server references the `:latest` tag (or use `docker compose pull` first, which the deploy job already does).

---

## Quick Start Checklist

- [ ] Push your code to a GitHub repository
- [ ] Create `.github/workflows/` directory
- [ ] Add `backend-ci.yml`, `frontend-ci.yml`, `deploy.yml`
- [ ] Add all secrets in GitHub repository settings
- [ ] On your VPS, clone the repo into `~/livana/` and create a `.env` file
- [ ] Make your VPS `docker-compose.yml` reference `ghcr.io/<your-username>/livana-be:latest` and `ghcr.io/<your-username>/livana-fe:latest` instead of `build:` directives
- [ ] Push a commit to `main` and watch the **Actions** tab on GitHub
