---
title: "Show SQL on Ruby on Rails console"
description: "Update the ActiveRecord logger to show the SQL queries on the Rails console."
pubDate: "22 October 2024"
hide: false
tags:
  - active record
  - console
  - rails
  - sql
---

Time to time, I like to test my `ActiveRecord` queries on my apps’ consoles. Play it, tweak it. Quite straightforward to do it on a Rails console.

However, there is a slight problem with this method; you cannot see the generated SQL nor how many milliseconds were spent on this query. To solve it, you need to update the `ActiveRecord`’s logger to log the output on standard output:

```ruby
ActiveRecord::Base.logger = Logger.new(STDOUT)
```

This is really all you need. Now, when you run an `ActiveRecord` query, you will also get the SQL with load time.

If you really want to get this every time, which I don’t suggest, update your `irbrc` file like below:

```ruby
if defined?(Rails::Console)
  ActiveRecord::Base.logger = Logger.new(STDOUT)
end
```

FYI, the reason why I don’t suggest is, I don’t always need to see the SQL query while playing around with models. If that’s not the case for you, definitely go for it.
