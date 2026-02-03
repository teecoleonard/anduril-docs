# Performance Modules - Quick Reference Guide

## Overview

Phase 3 Step 5 introduces 4 production-ready performance modules to optimize the Electron application.

---

## Module 1: Lazy Loader

**File**: `modules/lazy-loader.ts`  
**Purpose**: Dynamically load modules on-demand with caching

### Quick Usage

```typescript
import { lazyLoadModule, preloadModules } from './modules/lazy-loader';

// Load single module
const notifications = await lazyLoadModule('./modules/notifications');

// Preload multiple modules
await preloadModules([
  './modules/notifications',
  './modules/window-state',
]);

// Get cache info
const info = getCacheInfo();
console.log(`Modules cached: ${info.count}`);
```

### Key Functions

| Function | Purpose |
|----------|---------|
| `lazyLoadModule<T>(path)` | Load module dynamically with cache |
| `preloadModules(paths)` | Preload critical modules |
| `clearModuleCache()` | Clear all cached modules |
| `getCacheInfo()` | Get cache statistics |

### Benefits
- Reduces startup time
- Caches loaded modules
- Tracks load performance
- Non-blocking operation

---

## Module 2: Performance Monitor

**File**: `modules/performance-monitor.ts`  
**Purpose**: Collect and analyze application performance metrics

### Quick Usage

```typescript
import { getPerformanceMonitor } from './modules/performance-monitor';

const monitor = getPerformanceMonitor();

// Measure operations
monitor.startMeasure('backend-init');
await initializeBackend();
const duration = monitor.endMeasure('backend-init');
console.log(`Backend init took ${duration}ms`);

// Get memory stats
const memory = monitor.getMemoryStats();
console.log(`Heap: ${memory.heapUsed}`);

// Print full report
monitor.printReport();

// Get all metrics
const metrics = monitor.getAllMetrics();
```

### Key Functions

| Function | Purpose |
|----------|---------|
| `startMeasure(name, metadata?)` | Start measuring operation |
| `endMeasure(name)` | End measurement and return duration |
| `getDuration(name)` | Get duration of a measurement |
| `getMemoryStats()` | Get current memory usage |
| `getAllMetrics()` | Get all collected metrics |
| `printReport()` | Print formatted performance report |
| `getElapsedSinceStart()` | Get time since app start |

### Benefits
- Track operation performance
- Monitor memory usage
- Identify bottlenecks
- Generate reports

---

## Module 3: Startup Optimizer

**File**: `modules/startup-optimizer.ts`  
**Purpose**: Optimize startup with prioritized task execution

### Quick Usage

```typescript
import { getStartupOptimizer } from './modules/startup-optimizer';

const optimizer = getStartupOptimizer();

// Register critical tasks (priority 0-1, blocking)
optimizer.registerTask('init-logging', initializeLogging, 0);
optimizer.registerTask('init-backend', initializeBackend, 1);

// Register deferred tasks (priority 2-3, non-blocking)
optimizer.registerTask('init-notifications', initNotifications, 3);
optimizer.registerTask(
  'init-analytics',
  initAnalytics,
  3,
  5000 // 5 second delay
);

// Execute
await optimizer.executeCriticalTasks(); // Blocks startup
optimizer.executeDeferredTasks(); // Runs in background
```

### Priority Levels

| Level | Type | Example |
|-------|------|---------|
| 0 | Critical | Initialize logging, backend |
| 1 | High | Load config, setup database |
| 2 | Normal | Start services |
| 3 | Low | Analytics, telemetry |

### Key Functions

| Function | Purpose |
|----------|---------|
| `registerTask(name, task, priority, delay?)` | Register task |
| `executeCriticalTasks()` | Run blocking tasks |
| `executeDeferredTasks()` | Run non-blocking tasks |
| `getSummary()` | Get task statistics |
| `clear()` | Clear all tasks |
| `waitForDeferredTasks(timeout)` | Wait for background tasks |

### Utility Functions

```typescript
// Defer a function call
const result = await defer(() => expensiveOperation(), 1000);

// Execute with timeout
await executeWithTimeout(
  fetchData(),
  5000, // 5 second timeout
  new Error('Fetch timeout')
);
```

### Benefits
- Optimize startup time
- Prioritize critical operations
- Defer non-blocking work
- Timeout protection

---

## Module 4: Advanced Cache

**File**: `modules/advanced-cache.ts`  
**Purpose**: Multi-layer caching with LRU and TTL support

### Quick Usage

#### LRU Cache with TTL
```typescript
import { AdvancedCache } from './modules/advanced-cache';

const cache = new AdvancedCache<UserData>({
  maxSize: 100, // Max 100 items
  ttl: 60000, // Expire after 60 seconds
  onEvict: (key, value) => {
    console.log(`Evicted: ${key}`);
  },
});

// Set and get
cache.set('user-1', userData);
const user = cache.get('user-1');

// Check if exists (without counting as access)
if (cache.has('user-1')) {
  // ...
}

// Statistics
const stats = cache.getStats();
console.log(`Cache fill: ${stats.fillRate}`);

// Clear
cache.clear();
```

#### Lazy Cache
```typescript
import { LazyCache } from './modules/advanced-cache';

const lazyCache = new LazyCache<UserData>({
  maxSize: 50,
  ttl: 30000,
});

// Register loader
lazyCache.registerLoader('user-1', async () => {
  return await fetchUserFromAPI('user-1');
});

// Get (loads if not cached)
const user = await lazyCache.get('user-1');

// Preload all
await lazyCache.preloadAll();
```

#### Memoization
```typescript
import { memoize } from './modules/advanced-cache';

// Memoize expensive function
const getMemoizedFibonacci = memoize((n: number): number => {
  if (n <= 1) return n;
  return getMemoizedFibonacci(n - 1) + getMemoizedFibonacci(n - 2);
});

const result = getMemoizedFibonacci(30); // Cached result
```

#### Cache Factory
```typescript
import { getOrCreateCache } from './modules/advanced-cache';

// Get or create named cache
const userCache = getOrCreateCache<UserData>('users', {
  maxSize: 1000,
  ttl: 3600000, // 1 hour
});

userCache.set('user-1', userData);
```

### Key Functions

#### AdvancedCache<T>

| Function | Purpose |
|----------|---------|
| `set(key, value)` | Add to cache (evicts LRU if full) |
| `get(key)` | Get value (checks TTL) |
| `has(key)` | Check if exists (checks TTL) |
| `delete(key)` | Remove entry |
| `clear()` | Clear entire cache |
| `getStats()` | Get cache statistics |

#### LazyCache<T>

| Function | Purpose |
|----------|---------|
| `registerLoader(key, loader)` | Register data loader |
| `get(key)` | Get value (lazy-loads if needed) |
| `preloadAll()` | Preload all values |
| `clear()` | Clear cache |
| `getStats()` | Get statistics |

### Statistics Available

```typescript
const stats = cache.getStats();
// {
//   size: 45,
//   maxSize: 100,
//   fillRate: "45.0%",
//   averageAccessCount: 3.2,
//   totalAccess: 144
// }
```

### Benefits
- Bounded memory usage (LRU eviction)
- Time-based expiration (TTL)
- Lazy evaluation support
- Automatic memoization
- Performance statistics

---

## Integration Example

```typescript
import { getStartupOptimizer } from './modules/startup-optimizer';
import { getPerformanceMonitor } from './modules/performance-monitor';
import { preloadModules } from './modules/lazy-loader';
import { AdvancedCache } from './modules/advanced-cache';

export async function optimizedStartup() {
  const optimizer = getStartupOptimizer();
  const monitor = getPerformanceMonitor();

  // Setup caches
  const userCache = new AdvancedCache<User>({
    maxSize: 500,
    ttl: 3600000,
  });

  // Register critical tasks
  optimizer.registerTask('init-logging', initLogging, 0);
  optimizer.registerTask('init-config', initConfig, 1);
  optimizer.registerTask('init-backend', initBackend, 1);

  // Register deferred tasks
  optimizer.registerTask('preload-modules', () => {
    return preloadModules([
      './modules/notifications',
      './modules/window-state',
    ]);
  }, 2);

  optimizer.registerTask('init-analytics', initAnalytics, 3, 2000);

  // Execute startup
  monitor.startMeasure('startup');
  await optimizer.executeCriticalTasks();
  optimizer.executeDeferredTasks();
  monitor.endMeasure('startup');

  // Show results
  const memory = monitor.getMemoryStats();
  console.log(`Startup complete. Heap: ${memory.heapUsed}`);

  monitor.printReport();
}
```

---

## Performance Best Practices

### 1. Use Lazy Loading for Non-Critical Modules
```typescript
// DON'T: Import everything upfront
import * as analytics from './modules/analytics';

// DO: Load on demand
const analytics = await lazyLoadModule('./modules/analytics');
```

### 2. Prioritize Startup Tasks
```typescript
// DON'T: Wait for everything
await initLogging();
await initBackend();
await initAnalytics();

// DO: Separate critical from deferred
optimizer.registerTask('logging', initLogging, 0); // Critical
optimizer.registerTask('analytics', initAnalytics, 3); // Deferred
```

### 3. Cache Expensive Operations
```typescript
// DON'T: Fetch every time
const user = await fetchUser(id);

// DO: Cache with TTL
const cache = new AdvancedCache({ ttl: 60000 });
const user = cache.get(id) || await fetchUser(id);
```

### 4. Monitor Performance
```typescript
// DO: Track critical operations
monitor.startMeasure('database-init');
await initDatabase();
monitor.endMeasure('database-init');
```

---

## Configuration Reference

### AdvancedCache Options
```typescript
interface CacheOptions {
  maxSize?: number;        // Default: 100
  ttl?: number;           // Default: undefined (no expiration)
  onEvict?: (key, value) => void; // Eviction callback
}
```

### Task Priority Levels
```typescript
0 = Critical (blocks startup)
1 = High (blocks startup)
2 = Normal (non-blocking)
3 = Low (non-blocking, can be delayed)
```

### Performance Monitor Metrics
```typescript
{
  name: string;
  duration?: number;        // ms
  metadata?: object;
}
```

---

## Troubleshooting

### Cache not working
- Check TTL hasn't expired: `cache.has(key)`
- Check cache size limit: `cache.getStats().fillRate`
- Verify item was set: `cache.set(key, value)`

### Startup tasks not running
- Check priority level (0-1 are critical)
- Verify task is async-compatible
- Check for task registration errors in logs

### Performance slow
- Monitor startup: `monitor.printReport()`
- Check memory: `monitor.getMemoryStats()`
- Identify bottlenecks: `monitor.getAllMetrics()`

---

## Module Dependencies

```
lazy-loader.ts
  └── logger

performance-monitor.ts
  └── logger

startup-optimizer.ts
  ├── logger
  └── performance-monitor

advanced-cache.ts
  └── logger
```

---

## File Locations

```
electron/modules/
├── lazy-loader.ts           (107 lines)
├── performance-monitor.ts   (142 lines)
├── startup-optimizer.ts     (211 lines)
└── advanced-cache.ts        (286 lines)
```

---

## Testing

All modules are:
- ✅ TypeScript compiled
- ✅ ESLint validated
- ✅ Production-tested
- ✅ Documented with examples

---

*Phase 3, Step 5: Performance Optimization Complete*
*All modules ready for production use*
