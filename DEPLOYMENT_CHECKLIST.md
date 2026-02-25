# VPS Deployment Checklist

## Pre-Deployment
- [ ] VPS provisioned and accessible via SSH
- [ ] Domain configured (optional but recommended)
- [ ] Docker and Docker Compose installed on VPS
- [ ] Firewall configured (ports 22, 80, 443)

## Configuration Files
- [ ] Created `.env` file from `.env.example` in `/source/`
- [ ] Updated `FRONTEND_URL` to VPS domain/IP
- [ ] Updated `VITE_API_URL` to VPS domain/IP
- [ ] Updated `VNPAY_RETURN_URL` to VPS domain/IP
- [ ] Generated secure `SPRING_JWT_SECRET_KEY` (min 32 chars)
- [ ] Configured Gmail credentials (`SUPPORT_EMAIL`, `APP_PASSWORD`)
- [ ] Configured Cloudinary credentials
- [ ] Configured VNPay credentials
- [ ] Changed default RabbitMQ password

## Security
- [ ] Changed all default passwords
- [ ] Generated strong JWT secret
- [ ] Removed or secured RabbitMQ management UI port (15672)
- [ ] Removed database port exposure (5432) in production
- [ ] Configured firewall rules
- [ ] SSL/TLS certificate configured (Caddy/Let's Encrypt)

## Deployment
- [ ] Uploaded source code to VPS (`/opt/livana/source/`)
- [ ] Verified all files present (docker-compose, .env, Dockerfiles)
- [ ] Built images: `docker compose -f docker-compose.prod.yml build`
- [ ] Started services: `docker compose -f docker-compose.prod.yml up -d`
- [ ] Verified all containers running: `docker ps`
- [ ] Checked backend logs: `docker logs livana-be`
- [ ] Checked frontend logs: `docker logs livana-fe`

## Testing
- [ ] Backend health check: `curl http://localhost:8080/api/v1/health`
- [ ] Frontend accessible via browser
- [ ] User registration works
- [ ] User login works
- [ ] Listing creation works
- [ ] Booking works
- [ ] Payment flow works (VNPay)
- [ ] Real-time chat works
- [ ] Notifications work
- [ ] File upload works (Cloudinary)
- [ ] Email sending works

## Post-Deployment
- [ ] Set up automatic backups (cron job)
- [ ] Configure monitoring (Uptime Robot, etc.)
- [ ] Set up log rotation
- [ ] Document any custom configurations
- [ ] Test disaster recovery (restore from backup)
- [ ] Set up alerts for system issues

## Monitoring
- [ ] Monitor CPU usage: `docker stats`
- [ ] Monitor disk space: `df -h`
- [ ] Monitor logs for errors: `docker logs -f livana-be`
- [ ] Set up uptime monitoring service
- [ ] Configure error tracking (Sentry, etc.)

## Backup Strategy
- [ ] Database backup script created
- [ ] Backup cron job configured (daily at 2 AM)
- [ ] Backup retention policy set (keep 7 days)
- [ ] Test backup restoration

## Optional Enhancements
- [ ] Configure CDN for static assets
- [ ] Set up staging environment
- [ ] Configure CI/CD pipeline
- [ ] Set up container orchestration (Kubernetes, Docker Swarm)
- [ ] Configure load balancer (if multiple servers)
- [ ] Set up APM (Application Performance Monitoring)

## Troubleshooting Commands

```bash
# Check container status
docker ps -a

# View logs
docker logs -f livana-be
docker logs -f livana-fe

# Restart services
docker compose -f docker-compose.prod.yml restart

# Check resource usage
docker stats

# Execute commands in container
docker exec -it livana-be bash
docker exec -it livana-db psql -U livana-user -d livana

# Check network connectivity
docker exec livana-be ping db
docker exec livana-be curl http://livana-fe

# Rebuild and restart
docker compose -f docker-compose.prod.yml up -d --build
```

## Emergency Procedures

### Rollback Deployment
```bash
cd /opt/livana/source
git checkout <previous-commit-hash>
docker compose -f docker-compose.prod.yml up -d --build
```

### Restore Database
```bash
docker exec -i livana-db psql -U livana-user livana < backup-YYYYMMDD.sql
```

### Full System Restart
```bash
docker compose -f docker-compose.prod.yml down
docker compose -f docker-compose.prod.yml up -d
```

---

**Status:** [ ] Development | [ ] Staging | [ ] Production

**Last Updated:** _________________

**Deployed By:** _________________
