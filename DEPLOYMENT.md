# VPS Deployment Guide

This guide walks you through deploying the Livana application to a VPS (Virtual Private Server).

## Prerequisites

- **VPS Requirements:**
  - Ubuntu 20.04+ or Debian 11+ (recommended)
  - Minimum 2GB RAM, 2 CPU cores
  - 20GB+ disk space
  - Root or sudo access
  - Public IP address or domain name

- **Domain (Optional but Recommended):**
  - A registered domain pointing to your VPS IP
  - Example: `livana.yourdomain.com` → `123.45.67.89`

## Step 1: Prepare Your VPS

### 1.1 Connect to VPS

```bash
ssh root@your-vps-ip
# or
ssh your-username@your-vps-ip
```

### 1.2 Update System

```bash
sudo apt update && sudo apt upgrade -y
```

### 1.3 Install Docker & Docker Compose

```bash
# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Install Docker Compose
sudo apt install docker-compose-plugin -y

# Verify installation
docker --version
docker compose version
```

### 1.4 Configure Firewall

```bash
# Allow SSH, HTTP, HTTPS
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

## Step 2: Upload Application to VPS

### Option A: Using Git (Recommended)

```bash
# Install git
sudo apt install git -y

# Clone your repository
cd /opt
sudo git clone https://github.com/yourusername/livana.git
cd livana/source
```

### Option B: Using SCP/SFTP

From your local machine:

```bash
# Compress the source directory
cd /path/to/livana
tar -czf livana-source.tar.gz source/

# Upload to VPS
scp livana-source.tar.gz root@your-vps-ip:/opt/

# On VPS, extract
cd /opt
tar -xzf livana-source.tar.gz
cd source
```

## Step 3: Configure Environment Variables

### 3.1 Create .env file

```bash
cd /opt/livana/source
cp .env.example .env
nano .env  # or vim .env
```

### 3.2 Update Required Values

**Critical values to change:**

```bash
# ─── Frontend & Backend URLs ────────────────────────────
# Replace with your domain or VPS IP
FRONTEND_URL=http://your-domain.com
VITE_API_URL=http://your-domain.com

# ─── JWT Secret ─────────────────────────────────────────
# Generate a secure random string (min 32 characters)
SPRING_JWT_SECRET_KEY=$(openssl rand -base64 32)

# ─── Email (Gmail) ──────────────────────────────────────
SUPPORT_EMAIL=your-email@gmail.com
APP_PASSWORD=your-gmail-app-password

# ─── Cloudinary ─────────────────────────────────────────
# Register at https://cloudinary.com
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# ─── VNPay ──────────────────────────────────────────────
# Register at https://sandbox.vnpayment.vn/devreg/
VNPAY_TMN_CODE=your-tmn-code
VNPAY_HASH_SECRET=your-hash-secret
VNPAY_RETURN_URL=http://your-domain.com/payment/vnpay/callback

# ─── RabbitMQ (Change default password) ────────────────
RABBITMQ_USERNAME=admin
RABBITMQ_PASSWORD=$(openssl rand -base64 16)
```

**How to get Gmail App Password:**
1. Go to Google Account → Security
2. Enable 2-Step Verification
3. Search "App passwords" → Generate new app password
4. Copy the 16-character password

## Step 4: Deploy with Docker Compose

### 4.1 Build and Start Services

```bash
cd /opt/livana/source

# For production deployment
docker compose -f docker-compose.prod.yml up -d --build

# Or use the regular docker-compose.yml (already configured)
# docker compose up -d --build
```

### 4.2 Verify Services are Running

```bash
# Check containers status
docker ps

# Expected output: 4 containers running
# - livana-fe (nginx)
# - livana-be (Spring Boot)
# - livana-db (PostgreSQL)
# - livana-rabbitmq (RabbitMQ)

# Check logs
docker logs livana-fe
docker logs livana-be
docker logs livana-db
docker logs livana-rabbitmq
```

### 4.3 Test Application

```bash
# Test backend health
curl http://localhost:8080/api/v1/health

# Test frontend
curl http://localhost
```

## Step 5: Configure Domain (Optional)

If you have a domain, point it to your VPS IP:

### DNS Configuration (at your domain registrar)

```
Type: A
Name: @ (or livana)
Value: your-vps-ip
TTL: 3600
```

Wait 5-60 minutes for DNS propagation, then test:

```bash
curl http://your-domain.com
```

## Step 6: Setup SSL/TLS (HTTPS) - Recommended

### Option A: Using Caddy (Easiest)

1. **Create Caddyfile:**

```bash
cat > /opt/livana/source/Caddyfile <<EOF
your-domain.com {
    reverse_proxy livana-fe:80
    encode gzip
}
EOF
```

2. **Update docker-compose.prod.yml to add Caddy:**

```yaml
services:
  # ... existing services ...

  caddy:
    image: caddy:2-alpine
    container_name: livana-caddy
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./Caddyfile:/etc/caddy/Caddyfile
      - caddy_data:/data
      - caddy_config:/config
    networks:
      - livana-network

volumes:
  # ... existing volumes ...
  caddy_data:
  caddy_config:
```

3. **Update livana-fe to not expose port 80:**

```yaml
livana-fe:
  # Remove ports section
  # ports:
  #   - "80:80"
```

4. **Restart:**

```bash
docker compose -f docker-compose.prod.yml down
docker compose -f docker-compose.prod.yml up -d
```

### Option B: Using Let's Encrypt + Certbot

```bash
# Install certbot
sudo apt install certbot -y

# Obtain SSL certificate
sudo certbot certonly --standalone -d your-domain.com

# Update nginx.conf to use SSL (manual configuration needed)
```

## Step 7: Maintenance Commands

### View Logs

```bash
# All services
docker compose -f docker-compose.prod.yml logs -f

# Specific service
docker logs -f livana-be
```

### Restart Services

```bash
# Restart all
docker compose -f docker-compose.prod.yml restart

# Restart specific service
docker restart livana-be
```

### Update Application

```bash
cd /opt/livana/source

# Pull latest code (if using git)
git pull origin main

# Rebuild and restart
docker compose -f docker-compose.prod.yml up -d --build
```

### Backup Database

```bash
# Create backup
docker exec livana-db pg_dump -U livana-user livana > backup-$(date +%Y%m%d).sql

# Restore backup
docker exec -i livana-db psql -U livana-user livana < backup-20260225.sql
```

### Stop Services

```bash
# Stop all services
docker compose -f docker-compose.prod.yml down

# Stop and remove volumes (WARNING: deletes database)
docker compose -f docker-compose.prod.yml down -v
```

## Step 8: Monitoring & Security

### 8.1 Monitor Resource Usage

```bash
# Container stats
docker stats

# System resources
htop  # or top
df -h  # disk usage
```

### 8.2 Security Best Practices

1. **Change default passwords** in .env file
2. **Don't expose database ports** publicly (only within docker network)
3. **Set up automatic backups** (daily cron job)
4. **Enable firewall** (ufw) and only allow necessary ports
5. **Use HTTPS** (SSL/TLS) for production
6. **Keep system updated:** `sudo apt update && sudo apt upgrade`
7. **Monitor logs regularly** for suspicious activity
8. **Use strong JWT secret** (min 32 characters)

### 8.3 Automatic Backups (Cron Job)

```bash
# Create backup script
sudo nano /opt/backup-livana.sh
```

```bash
#!/bin/bash
BACKUP_DIR="/opt/livana-backups"
DATE=$(date +%Y%m%d-%H%M%S)

mkdir -p $BACKUP_DIR
docker exec livana-db pg_dump -U livana-user livana > $BACKUP_DIR/livana-$DATE.sql

# Keep only last 7 days of backups
find $BACKUP_DIR -name "livana-*.sql" -mtime +7 -delete
```

```bash
# Make executable
sudo chmod +x /opt/backup-livana.sh

# Add to crontab (daily at 2 AM)
sudo crontab -e
# Add line:
0 2 * * * /opt/backup-livana.sh
```

## Troubleshooting

### Container Won't Start

```bash
# Check logs
docker logs livana-be

# Check if port is already in use
sudo netstat -tulpn | grep :80
sudo netstat -tulpn | grep :8080
```

### Cannot Connect to Application

```bash
# Check if all containers are running
docker ps -a

# Check firewall
sudo ufw status

# Check if services are listening
sudo netstat -tulpn | grep :80
```

### Database Connection Error

```bash
# Check if db is healthy
docker exec livana-db pg_isready -U livana-user -d livana

# Check environment variables
docker exec livana-be env | grep SPRING_DATASOURCE
```

### Out of Memory

```bash
# Check memory usage
free -h
docker stats

# Increase swap space or upgrade VPS
```

## Performance Tuning

### For Low-Spec VPS (1GB RAM)

Add memory limits to docker-compose.prod.yml:

```yaml
services:
  livana-be:
    # ...
    mem_limit: 512m
    
  livana-fe:
    # ...
    mem_limit: 128m
```

### Enable Swap

```bash
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
```

## Support

- **GitHub Issues:** https://github.com/yourusername/livana/issues
- **Email:** your-email@domain.com

## Next Steps

1. ✅ Test all features (login, booking, payment, chat)
2. ✅ Set up monitoring (Uptime Robot, Pingdom, etc.)
3. ✅ Configure automatic backups
4. ✅ Set up SSL/TLS (HTTPS)
5. ✅ Optimize images and assets for production
6. ✅ Set up CDN for static files (optional)
7. ✅ Configure email alerts for system issues
8. ✅ Document any custom configurations

---

**Congratulations! Your Livana app is now deployed on VPS! 🚀**
