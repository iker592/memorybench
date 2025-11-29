# Logs Command

View system logs and activity history.

## Usage

```
/logs [options]
```

## Options

- `--level` - Filter by log level (info, warn, error)
- `--since` - Show logs since a specific time
- `--limit` - Limit number of log entries

## Examples

```
/logs --level error --limit 50
/logs --since "1 hour ago"
```

