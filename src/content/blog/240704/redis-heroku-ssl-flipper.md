---
title: "Fix SSL error using Heroku’s Redis for Flipper"
description: "Lorem ipsum dolor sit amet"
pubDate: "04 July 2024"
hide: false
tags:
  - flipper
  - heroku
  - redis
  - ssl
---

Hello **`Redis::CannotConnectError` 👋**, my old friend. I did not miss you at all.

Years later, I once again, got the SSL connection error while I was adding the Flipper gem to our project, which is hosted on Heroku and uses Heroku’s Redis. 

For a quick solution, check this:

```ruby
# frozen_string_literal: true
require 'flipper/adapters/redis'

Flipper.configure do |config|
  config.default do
    redis = Redis.new(
      url: ENV.fetch('REDIS_URL', nil),
      ssl_params: { verify_mode: OpenSSL::SSL::VERIFY_NONE }
    )

    adapter = Flipper::Adapters::Redis.new(redis)
    Flipper.new(adapter)
  end
end
```

If you want to dig deep and understand why it is **safe** to use “verify none”, you can check the [**How to solve the SSL error for Redis 6 on Heroku?**](How%20to%20solve%20the%20SSL%20error%20for%20Redis%206%20on%20Heroku%20736601888821433680378a1ca1fa96f9.md) article that I wrote years ago.

## Links

- https://www.flippercloud.io/docs/adapters/redis
- https://stackoverflow.com/questions/65834575/how-to-enable-tls-for-redis-6-on-sidekiq
