---
title: "The 'postmaster.pid' already exists"
description: "Remove the dead 'postmaster.pid' for PostgreSQL on macOS."
pubDate: "14 August 2024"
hide: false
tags:
  - homebrew
  - macos
  - postgresql
---

If you've encountered the following error message while working with PostgreSQL on an Apple M series machine using Homebrew, you're not alone:

```
2024-08-13 08:53:06.060 +03 [64564] FATAL:  lock file "postmaster.pid" already exists
2024-08-13 08:53:06.060 +03 [64564] HINT:  Is another postmaster (PID 773) running in data directory "/opt/homebrew/var/postgresql@16"?
```

This error typically indicates that there is a lock file named `postmaster.pid` already present in the data directory, potentially because another instance of PostgreSQL is running or because a previous instance was not shut down properly.

## Quick Fix

To resolve this issue, you can remove the existing lock file. Use the `rm` command to delete the `postmaster.pid` file.

```bash
rm /opt/homebrew/var/postgresql@16/postmaster.pid
```

After removing the lock file, you should be able to start PostgreSQL without encountering the "postmaster.pid" error.

## Why Does This Happen?

The `postmaster.pid` file is created by PostgreSQL to ensure that only one instance of the server is running at a time in a given data directory. If PostgreSQL crashes or is not shut down properly, this file may not be removed, leading to the error when you try to start PostgreSQL again.

Make sure that no other instance of PostgreSQL is running before doing removing the file, as it could lead to data corruption.
