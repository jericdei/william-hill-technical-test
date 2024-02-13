## How to test this query

### SQLite

This repo contains the seeded `database.sqlite` file and you can use the CLI to run the query
```bash
sqlite3 database.sqlite < sqlite_query.sql
```

### MySQL/PostgreSQL (with database server)
```bash
# Create blank database
mysql -u <username> -p

> CREATE DATABASE top_10;
> exit

# Create the tables & seed data
mysql -u <username> -p top_10 < mysql_seeder.sql

# Execute the query
mysql -u <username> -p top_10 < mysql_query.sql
```

