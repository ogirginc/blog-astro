---
title: "How to fix a mismatch between psql and server?"
description: "Fix running different versions of psql and the Postgresql."
pubDate: "22 February 2024"
hide: false
tags:
  - homebrew
  - postgresql
  - psql
---

You have installed a new Postgresql with Homebrew, but whenever you type `psql`, you get a warning like below:

```
> psql
psql (14.11 (Homebrew), server 16.2 (Homebrew))
WARNING: psql major version 14, server major version 16.
         Some psql features might not work.
Type "help" for help.
```

This happens because when you install a new version of Postgresql, Homebrew still uses the old version even after you have to stop the old version of Postgresql through the `brew services stop` command. We can confirm it like this:

```
> brew link postgresql@16
Linking /opt/homebrew/Cellar/postgresql@16/16.2...
Error: Could not symlink bin/clusterdb
Target /opt/homebrew/bin/clusterdb
is a symlink belonging to postgresql@14. You can unlink it:
  brew unlink postgresql@14

To force the link and overwrite all conflicting files:
  brew link --overwrite postgresql@16

To list all files that would be deleted:
  brew link --overwrite postgresql@16 --dry-run
```

To fix this, you need to explicitly tell Homebrew to stop using the old version and start using the new version.

First, use `unlink` to stop using the old version:

```
 > brew unlink postgresql@14
Unlinking /opt/homebrew/Cellar/postgresql@14/14.11... 334 symlinks removed.
```

Second, use `link` to start using the new version:

```
> brew link postgresql@16
Linking /opt/homebrew/Cellar/postgresql@16/16.2... 811 symlinks created.

If you need to have this software first in your PATH instead consider running:
  echo 'export PATH="/opt/homebrew/opt/postgresql@16/bin:$PATH"' >> ~/.zshrc
```

After these two, you can check to see if it’s fixed or not:

```
> psql --version
psql (PostgreSQL) 16.2 (Homebrew)
```

Fixed! 🎉
