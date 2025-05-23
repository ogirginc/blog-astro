---
title: "How to install multiple Postgresql versions on macOS?"
description: "Install different versions of Postgresql on your Mac with Homebrew."
pubDate: "05 January 2021"
hide: false
tags:
  - homebrew
  - macos
  - postgresql
---

So, you have decided to have multiple Postgresql versions on your Mac. Lucky for you, I have tried all options I was able to find and decided [Peter Eisentraut](https://github.com/petere)’s [Postgresql Common package](https://github.com/petere/postgresql-common), which is a Postgresql database cluster manager for Postgresql.

# **What is a database cluster?**

A database cluster is a bit of an ambiguous term. Its definition varies depending on the context. In this article, I am not going to explain what it means in production. On local machines, it is a collection of databases that are managed by a single database server. Clusters allow us to install multiple versions of Postgresql on our macOS. To manage these clusters, we will be using a package called Postgresql Common.

# **Postgresql Common with Homebrew**

First, we will install the Postgresql Common [formulae](https://github.com/petere/homebrew-postgresql):

```
brew install petere/postgresql/postgresql-common
```

With these formulae installed, we can have multiple versions of PostgreSQL in parallel. We should be able to install any version of Postgresql starting with version 8.3. If you do want to check the available versions, use the Homebrew’s `search`:

```
brew search petere/postgresql
```

Or you check the Github repo to see the available version on your browser: [https://github.com/petere/homebrew-postgresql](https://github.com/petere/homebrew-postgresql)

If I wanted to install the version 12, this is how I would do it:

```
brew install petere/postgresql/postgresql@12
```

This command will fetch the latest minor version of the provided major version. For example, if there are 4 minor versions available, we would have version 12.4 installed automatically. Depending on your internet speed, it should not take more than a couple of minutes to download. Same goes for installing it with the `make` command, which depends on how fast the computer is.

# **Creating a cluster for the first time**

To create a cluster, we will be using the `pg_createcluster` wrapper scripts. These scripts are just wrappers around `pg_ctl` and `initdb` to make managing easier. Now, let's create our first cluster. We will name this one as the `main` but you can choose whatever name you like.

```
pg_createcluster 12 main
```

We have created a new cluster named `main` which is version 12.4. If you like, we can check the status of the cluster with the `pg_lsclusters` wrapper script.

```
pg_lsclusters
```

This should list all the clusters, with some additional information, we have created in our machine.

```
Ver Cluster Port Status Owner    Data directory                        Log file
12  main    5432 down   ogirginc /usr/local/var/lib/postgresql/12/main /usr/local/var/log/postgresql/postgresql-12-main.log
```

Let's start our newly created cluster, we will be using `pg_ctlcluster`.

```
pg_ctlcluster 12 main start
```

Just to be sure, check the `Status` with `pg_lsclusters`. You should see the word `down` being replaced with `online`. Also, the output colour change might change depending on your theme. In my case, it was red turned to green.

```
Ver Cluster Port Status Owner    Data directory                        Log file
12  main    5432 online ogirginc /usr/local/var/lib/postgresql/12/main /usr/local/var/log/postgresql/postgresql-12-main.log
```

After starting your cluster, rest is the same with any Postgresql installation. Create a database with `created` command and list those with `psql -c '\l'` command to check if all is good. You should do something similar to this:

```
List of databases
   Name    |  Owner   | Encoding |   Collate   | Ctype |   Access privileges
-----------+----------+----------+-------------+-------+-----------------------
 ogirginc  | ogirginc | UTF8     | en_US.UTF-8 | UTF-8 |
 postgres  | ogirginc | UTF8     | en_US.UTF-8 | UTF-8 |
 template0 | ogirginc | UTF8     | en_US.UTF-8 | UTF-8 | =c/ogirginc          +
           |          |          |             |       | ogirginc=CTc/ogirginc
 template1 | ogirginc | UTF8     | en_US.UTF-8 | UTF-8 | =c/ogirginc          +
           |          |          |             |       | ogirginc=CTc/ogirginc
(4 rows)
```

That’s it! Now just repeat the process for each version you want to install, and it should work with a problem. If you do encounter any problems, check the Troubleshooting section below. If the problem still continues, feel free to open an issue and I would try my best to help!

---

# **Troubleshooting**

## **Authentication failed for user**

### **Why?**

The default Postgres configuration sets the client authentication method to `peer` or `md5`, which can prevent connection to the database.

### **Solution**

Run `psql -c 'show hba_file;'` to get `pg_hba.conf`’s path. The output should look like this:

```
hba_file
-----------------------------------------------
 /usr/local/etc/postgresql/12/main/pg_hba.conf
(1 row)
```

Open the `pg_hba.conf` file with your editor and go to the end of it, where we can see the preferred authentication methods. If you don’t have any sensitive data and your local database is not accessible through the internet, I would suggest changing the `METHOD` to `trust` for ease of use. This is how I use it:

```
# Database administrative login by Unix domain socket
local   all             ogirginc                                trust

# TYPE  DATABASE        USER            ADDRESS                 METHOD

# "local" is for Unix domain socket connections only
local   all             all                                     trust
# IPv4 local connections:
host    all             all             127.0.0.1/32            trust
# IPv6 local connections:
host    all             all             ::1/128                 trust
# Allow replication connections from localhost, by a user with the
# replication privilege.
local   replication     all                                     peer
host    replication     all             127.0.0.1/32            md5
host    replication     all             ::1/128                 md5
```

## **No such file or directory**

### **Why?**

When creating a cluster, `pg_ctl` fails to find `conf.d` because it is missing. It’s a known bug. Check [#45](https://github.com/petere/homebrew-postgresql/issues/45) and [#49](https://github.com/petere/homebrew-postgresql/issues/49) for additional details.

Example output of `pg_ctlcluster 12 main start`:

```
Error: /usr/local/opt/postgresql@12/bin/pg_ctl /usr/local/opt/postgresql@12/bin/pg_ctl start -D /usr/local/var/lib/postgresql/12/main -l /usr/local/var/log/postgresql/postgresql-12-main.log -s -o  -c config_file="/usr/local/etc/postgresql/12/main/postgresql.conf" -c external_pid_file="/usr/local/var/run/postgresql/12-main.pid"  exited with status 1:
2020-07-13 10:32:51.376 GMT [9841] LOG:  could not open configuration directory "/usr/local/etc/postgresql/12/main/conf.d": No such file or directory
2020-07-13 10:32:51.376 GMT [9841] FATAL:  configuration file "/usr/local/etc/postgresql/12/main/postgresql.conf" contains errors
pg_ctl: could not start server
Examine the log output.
```

### **Solution**

Create the `conf.d` with the `mkdir` command.

```
mkdir /usr/local/etc/postgresql/12/main/conf.d
```

### **Perl required**

## **Why?**

You get the error below because the required Perl files could not be found. Check [#44](https://github.com/petere/homebrew-postgresql/issues/44#issuecomment-570881749) for additional details.

```
configure: error: header file <perl.h> is required for Perl
```

### **Solution**

Try installing Xcode, which should install all necessary Perl files and specify the Xcode that you wish to use for command line developer tools like this:

```
sudo xcode-select --switch /Applications/Xcode.app/
```

## **LANG error**

### **Why?**

For some unknown reasons, the operating system’s locales are messed up.

### **Solution**

First export the desired language and then create the cluster. An example for `en_US` would be like this:

```
export LANG=en_US.UTF-8
pg_createcluster 12 main
```

However, I would highly recommend fixing the locales as it might cause additional non-database related problems.

## Different versions for `psql` and `server`

### **Why?**

You have installed multiple Postgresql versions with Homebrew and `psql` automatically picks the latest version.

### **Solution**

When trying to use `psql` with an earlier version of a Postgresql, a warning will be presented.

```
psql (13.0 (Homebrew petere/postgresql), server 12.4 (Homebrew petere/postgresql))
```

First of all, this is just a warning. Secondly, most, if not all things, should work in `psql`. However, tools like `pg_dump` might fail. To fix when you get this warning, export the desired Postgresql version to the path.

```
export PATH="/usr/local/opt/postgresql@12/bin:$PATH"
```

When retrying, there should not be any warning about version mismatch.

```
❯ psql
psql (12.4 (Homebrew petere/postgresql))
Type "help" for help.
ogirginc=*#*
```

## **Create a database with a different port**

### **Why?**

When you create a new cluster, Postgresql assigns the next available port number to this new cluster, which results in not being able to connect to the default 5432 port. An example of an error, while trying to run `psql` for the newly created second cluster:

```
psql: error: could not connect to server: could not connect to server: No such file or directory
	Is the server running locally and accepting
	connections on Unix domain socket "/tmp/.s.PGSQL.5432"?
```

### **Solution**

To fix this connection error, we have to specifically tell `psql` which port it should use to connect to the database by exporting the `PGPORT` environment variable. Check with the `pg_lsclusters` wrapper script to which port do you need to connect the database.

```
Ver Cluster Port Status Owner    Data directory                        Log file
12  main    5433 online ogirginc /usr/local/var/lib/postgresql/12/main /usr/local/var/log/postgresql/postgresql-12-main.log
13  main    5432 down   ogirginc /usr/local/var/lib/postgresql/13/main /usr/local/var/log/postgresql/postgresql-13-main.log
```

To use version 12, I need to set `PGPORT` to `5433`:

```
export PGPORT=5433
```

With this explicit port setting, we can use `psql` or any other Postgresql utilities without any problems.

```
psql (12.4 (Homebrew petere/postgresql))
Type "help" for help.
ogirginc=*#*
```

## **You call this simple?**

### **Why?**

I am fully aware it is not simple nor easy, but it gets the job done.

### **Solution**

Try your luck with [Postgres.app](https://postgresapp.com/). Maybe, it will work for you. :)
