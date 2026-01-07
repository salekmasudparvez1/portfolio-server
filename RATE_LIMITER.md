# Rate Limiter Documentation

## Overview

This project implements a Redis-backed rate limiter to protect API endpoints from abuse, DoS attacks, and excessive requests. The rate limiter tracks requests per IP address and enforces configurable limits.

---

## Packages Used

### 1. **express-rate-limit** (v7+)
- **Purpose**: Core middleware for implementing rate limiting in Express applications
- **Features**:
  - Configurable time windows and request limits
  - Standardized RateLimit headers (draft-7)
  - Pluggable store architecture
  - Custom error handling

### 2. **rate-limit-redis**
- **Purpose**: Redis store adapter for express-rate-limit
- **Features**:
  - Persistent rate limit data across server restarts
  - Distributed rate limiting (works across multiple server instances)
  - Automatic cleanup of expired entries
  - High performance with Redis in-memory storage

---

## Why These Packages?

### Why express-rate-limit?
1. **Industry Standard**: Most popular and well-maintained rate limiting solution for Express
2. **Flexible Configuration**: Easily adjust limits, windows, and behavior
3. **Header Standards**: Implements RFC draft-7 for RateLimit headers
4. **Extensible**: Supports custom stores, handlers, and key generators
5. **Production Ready**: Battle-tested in thousands of production applications

### Why Redis Store?
1. **Persistence**: Rate limit data survives server restarts
2. **Distributed Systems**: Share rate limits across multiple server instances
3. **High Performance**: In-memory storage provides fast read/write operations
4. **Automatic Expiry**: Redis TTL automatically cleans up old data
5. **Scalability**: Handles high-traffic applications efficiently

### Without Redis Store (Default Memory Store)
- ❌ Data lost on server restart
- ❌ Each server instance has independent limits
- ❌ Not suitable for load-balanced environments
- ❌ Memory leaks in long-running processes

### With Redis Store
- ✅ Persistent rate limit data
- ✅ Shared limits across all servers
- ✅ Perfect for load balancers/clusters
- ✅ Automatic memory management

---

## Configuration Explained

```typescript
const limiter = rateLimit({
  windowMs: 60 * 1000,        // Time window: 60 seconds
  limit: 60,                   // Max requests per window: 60 requests
  standardHeaders: "draft-7",  // Send RateLimit-* headers
  legacyHeaders: false,        // Disable old X-RateLimit-* headers
  store: new RedisStore({...}),// Use Redis for storage
  handler: customErrorHandler  // Custom error response
});
```

### Configuration Options

| Option | Value | Purpose |
|--------|-------|---------|
| `windowMs` | `60000` (60s) | Rolling time window for counting requests |
| `limit` | `60` | Maximum requests allowed per window |
| `standardHeaders` | `"draft-7"` | Modern RateLimit headers per RFC draft |
| `legacyHeaders` | `false` | Disable deprecated X-RateLimit headers |
| `store` | `RedisStore` | Persistent, distributed storage |
| `handler` | Custom function | Consistent error response format |

---

## Response Headers

When a request is made, the following headers are sent:

```http
RateLimit-Limit: 60
RateLimit-Remaining: 45
RateLimit-Reset: 1704672000
```

- **RateLimit-Limit**: Total requests allowed in window
- **RateLimit-Remaining**: Requests left in current window
- **RateLimit-Reset**: Unix timestamp when limit resets

---

## Custom Error Handling

### Why Custom Error Handler?

The default rate limit error response is generic. A custom handler provides:
1. **Consistent API Format**: Matches your application's error response structure
2. **Better Client Experience**: Clear, actionable error messages
3. **Integration**: Works with global error handling system
4. **Logging**: Can integrate with logging/monitoring systems

### Implementation

```typescript
handler: (req: Request, res: Response, next: NextFunction) => {
  const errorResponse = handleRateLimitError();
  res.status(errorResponse.statusCode).json({
    success: false,
    message: errorResponse?.message,
    errorSources: errorResponse?.errorSources,
  });
}
```

### Error Response Format

When rate limit is exceeded:

```json
{
  "success": false,
  "message": "Too many requests, please try again later.",
  "errorSources": [
    {
      "path": "",
      "message": "Rate limit exceeded. Please wait before making more requests."
    }
  ]
}
```

---

## How to Use

### 1. Global Application Rate Limiting

Apply to all routes in your Express app:

```typescript
import express from 'express';
import limiter from './app/middlewares/limiter';

const app = express();

// Apply to all routes
app.use(limiter);

app.use('/api/auth', authRouter);
app.use('/api/posts', postRouter);
```

**Result**: All endpoints limited to 60 requests per minute

---

### 2. Specific Route Protection

Apply to sensitive endpoints only:

```typescript
import limiter from '../middlewares/limiter';

// Protect login endpoint
router.post('/login', limiter, authController.login);

// Protect password reset
router.post('/forgot-password', limiter, authController.forgotPassword);
```

**Use Case**: Stricter limits on authentication endpoints

---

### 3. Custom Rate Limits for Specific Routes

Create specialized limiters:

```typescript
import { rateLimit } from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';
import { redis } from '../redis';

// Strict limiter for authentication (5 requests per 15 minutes)
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  store: new RedisStore({
    sendCommand: (...args: string[]) => redis.call(...args),
  }),
});

// Lenient limiter for public APIs (100 requests per minute)
export const publicLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 100,
  store: new RedisStore({
    sendCommand: (...args: string[]) => redis.call(...args),
  }),
});
```

**Usage:**
```typescript
router.post('/login', authLimiter, authController.login);
router.get('/public-data', publicLimiter, dataController.getPublic);
```

---

## Common Use Cases

### 1. Prevent Brute Force Attacks
```typescript
// Login: 5 attempts per 15 minutes
router.post('/login', authLimiter, authController.login);
```

### 2. Protect Expensive Operations
```typescript
// Image upload: 10 per hour
const uploadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 10,
  store: redisStore
});
router.post('/upload', uploadLimiter, uploadController.upload);
```

### 3. API Fair Usage
```typescript
// General API: 60 requests per minute
app.use('/api', limiter);
```

### 4. Email/SMS Rate Limiting
```typescript
// Send verification code: 3 per hour
const verificationLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 3,
  store: redisStore
});
router.post('/send-code', verificationLimiter, authController.sendCode);
```

---

## Redis Store Configuration

### Type Compatibility Issue

```typescript
store: new RedisStore({
  // @ts-expect-error - Known mismatch between ioredis types and rate-limit-redis
  sendCommand: (...args: string[]) => redis.call(...args),
})
```

**Why the `@ts-expect-error`?**
- `rate-limit-redis` expects a specific command interface
- `ioredis` (Redis client) has slightly different TypeScript types
- The code works correctly at runtime despite type mismatch
- This is a known issue in the package ecosystem

### Redis Connection

Ensure Redis is running and connected:

```typescript
// redis.ts
import Redis from 'ioredis';

export const redis = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  password: process.env.REDIS_PASSWORD,
});
```

---

## Testing the Rate Limiter

### Manual Testing

```bash
# Make 61 requests rapidly
for i in {1..61}; do
  curl -X POST http://localhost:3000/api/contact \
    -H "Content-Type: application/json" \
    -d '{"name":"Test","email":"test@test.com"}' \
  echo " - Request $i"
done
```

**Expected**: First 60 succeed, 61st returns 429 error

### Check Headers

```bash
curl -I http://localhost:3000/api/contact
```

**Response:**
```http
HTTP/1.1 200 OK
RateLimit-Limit: 60
RateLimit-Remaining: 59
RateLimit-Reset: 1704672060
```

---

## Best Practices

### 1. ✅ Use Redis in Production
```typescript
// Production: Use Redis
store: new RedisStore({...})

// Development: Can use memory store for simplicity
// store: new MemoryStore() // Not recommended for production
```

### 2. ✅ Different Limits for Different Endpoints
```typescript
app.use('/api/public', publicLimiter);    // Lenient
app.use('/api/auth', authLimiter);        // Strict
app.use('/api/admin', adminLimiter);      // Very strict
```

### 3. ✅ Inform Users in Error Messages
```json
{
  "message": "Too many requests. Please try again in 45 seconds.",
  "retryAfter": 45
}
```

### 4. ✅ Monitor Rate Limit Hits
```typescript
handler: (req, res) => {
  logger.warn(`Rate limit exceeded for IP: ${req.ip}`);
  // Send error response
}
```

### 5. ✅ Whitelist Trusted IPs (if needed)
```typescript
const limiter = rateLimit({
  skip: (req) => {
    const trustedIPs = ['127.0.0.1', '::1'];
    return trustedIPs.includes(req.ip);
  },
  // ... other config
});
```

---

## Troubleshooting

### Issue: Rate limiter not working
**Solution**: Ensure Redis is connected and middleware is applied before routes

### Issue: Limits not shared across servers
**Solution**: Verify all servers use the same Redis instance

### Issue: Rate limit headers not appearing
**Solution**: Check `standardHeaders: "draft-7"` is set

### Issue: Too restrictive in development
**Solution**: Increase limits or disable in dev environment

```typescript
const limiter = process.env.NODE_ENV === 'production'
  ? rateLimit({...})  // Strict in production
  : (req, res, next) => next();  // Bypass in development
```

---

## Environment Variables

```env
# Redis Configuration
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=your_password

# Rate Limiter Configuration (optional)
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX_REQUESTS=60
```

---

## Security Benefits

1. **DDoS Protection**: Prevents overwhelming the server
2. **Brute Force Prevention**: Limits login/password attempts
3. **Resource Conservation**: Prevents abuse of expensive operations
4. **Fair Usage**: Ensures equal access for all users
5. **Cost Control**: Limits API usage in paid services

---

## Performance Considerations

- **Redis Latency**: ~1ms overhead per request
- **Memory Usage**: ~100 bytes per IP in Redis
- **Scalability**: Handles millions of requests efficiently
- **TTL Cleanup**: Redis automatically removes expired entries

---

## Conclusion

This rate limiter implementation provides:
- ✅ Production-ready security
- ✅ Distributed system support
- ✅ Custom error handling
- ✅ Flexible configuration
- ✅ Standard-compliant headers
- ✅ High performance with Redis

Use it to protect your API endpoints and ensure fair, secure access to your application resources.
