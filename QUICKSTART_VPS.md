# Quick Start: Deploy to VPS

This is a condensed guide for quickly deploying Livana to your VPS. For detailed instructions, see [DEPLOYMENT.md](DEPLOYMENT.md).

## Prerequisites
- VPS with Ubuntu/Debian
- Docker & Docker Compose installed
- Domain (optional but recommended)

## Quick Steps

### 1. Upload Code to VPS

```bash
# On your local machine
cd /path/to/livana
tar -czf livana.tar.gz source/
scp livana.tar.gz root@your-vps-ip:/opt/

# On VPS
ssh root@your-vps-ip
cd /opt
tar -xzf livana.tar.gz
cd source
```

### 2. Create and Configure .env

```bash
cp .env.example .env
nano .env
```

**Critical values to change:**

```bash
# Your domain or VPS IP (IMPORTANT!)
FRONTEND_URL=http://your-domain.com
VITE_API_URL=http://your-domain.com

# Security
SPRING_JWT_SECRET_KEY=$(openssl rand -base64 32)
RABBITMQ_USERNAME=admin
RABBITMQ_PASSWORD=$(openssl rand -base64 16)

# Email (Get app password from Google Account settings)
SUPPORT_EMAIL=your-email@gmail.com
APP_PASSWORD=your-gmail-app-password

# Cloudinary (Register at cloudinary.com)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# VNPay (Register at sandbox.vnpayment.vn/devreg/)
VNPAY_TMN_CODE=your-tmn-code
VNPAY_HASH_SECRET=your-hash-secret
VNPAY_RETURN_URL=http://your-domain.com/payment/vnpay/callback

# Optional
SEED_DEMO_DATA=false
```

### 3. Deploy

```bash
# Build and start
docker compose up -d --build

# Or use production config (recommended)
docker compose -f docker-compose.prod.yml up -d --build

# Check status
docker ps

# View logs
docker logs livana-be
docker logs livana-fe
```

### 4. Configure Firewall

```bash
sudo ufw allow 22/tcp   # SSH
sudo ufw allow 80/tcp   # HTTP
sudo ufw allow 443/tcp  # HTTPS
sudo ufw enable
```

### 5. Test

```bash
# Backend health
curl http://localhost:8080/api/v1/health

# Frontend
curl http://your-domain.com
```

## Done! 🎉

Your app is now running:
- **Frontend:** http://your-domain.com
- **Backend API:** http://your-domain.com/api/v1/
- **RabbitMQ UI:** http://your-domain.com:15672 (guest/guest)

## Essential Commands

```bash
# View logs
docker logs -f livana-be

# Restart services
docker compose restart

# Stop services
docker compose down

# Update and redeploy
git pull origin main
docker compose up -d --build

# Backup database
docker exec livana-db pg_dump -U livana-user livana > backup.sql
```

## Common Issues

### Port 80 already in use
```bash
# Check what's using port 80
sudo lsof -i :80
# Stop conflicting service (e.g., Apache)
sudo systemctl stop apache2
```

### Can't connect from browser
- Check firewall: `sudo ufw status`
- Check containers: `docker ps`
- Check if port is listening: `sudo netstat -tulpn | grep :80`

### Database connection error
```bash
# Check db is healthy
docker exec livana-db pg_isready -U livana-user -d livana
```

## Next Steps

1. **Add SSL/TLS (HTTPS)** - See DEPLOYMENT.md "Step 6: Setup SSL/TLS"
2. **Setup automatic backups** - Daily cron job for database backup
3. **Monitoring** - Set up uptime monitoring (Uptime Robot, Pingdom)
4. **Security** - Change all default passwords, use strong secrets

## Production Checklist

- [ ] FRONTEND_URL set to your domain
- [ ] VITE_API_URL set to your domain
- [ ] Strong JWT secret generated
- [ ] Gmail credentials configured
- [ ] Cloudinary configured
- [ ] VNPay configured
- [ ] Default passwords changed
- [ ] Firewall enabled
- [ ] SSL/TLS configured (HTTPS)
- [ ] Backups configured
- [ ] All features tested

## Support

- Full guide: [DEPLOYMENT.md](DEPLOYMENT.md)
- Checklist: [DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md)
- Architecture: [CLAUDE.md](CLAUDE.md)

---

**Need help?** Check [DEPLOYMENT.md](DEPLOYMENT.md) for troubleshooting and advanced configurations.
