# Logs Command

View memory activity and access history.

## Usage

```
/logs [options]
```

## Options

- `--type` - Filter by action type (create, read, update, delete)
- `--since` - Show logs since a specific time
- `--limit` - Limit number of entries
- `--memory` - Filter by specific memory ID

## Examples

```
/logs --type create --limit 20
/logs --since "today"
/logs --memory mem_abc123
```
