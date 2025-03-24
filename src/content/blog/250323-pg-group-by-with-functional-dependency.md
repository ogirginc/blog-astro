---
title: "Using PRIMARY KEY in PostgreSQL's GROUP BY"
description: "Understand why having a primary key in the GROUP BY clause allows selecting non-aggregated columns without including them in the GROUP BY clause."
pubDate: "23 February 2025"
tags:
  - postgresql
  - sql
---
Have you noticed that in some cases, PostgreSQL does not ask you to include the selected column in the `GROUP BY` clause?

Until recently, I haven't spent time on understanding why this happens. Turns out, there is a simple explanation. Compared to the standard SQL, PostgreSQL actually has a special handling for the `GROUP BY` clause. So, what happens here is, when a `PRIMARY KEY` is included in a `GROUP BY` clause, it actually changes how the clause works, which allows selecting non-aggregated columns without including them in the `GROUP BY` clause.

Let's dive into this a bit more.

## The Standard SQL Expectation

In standard SQL, the rule is clear! If you're using a `GROUP BY` clause, every column in your `SELECT` statement must either:

1. Be included in the `GROUP BY` clause, or
2. Be used within an aggregate function (like `SUM`, `COUNT`, `MAX`, etc.)

And you know, this does make sense – if you're grouping rows together, the database needs to know which value to display for a column that might have different values within the group.

However, things are a bit different in the land of PostgreSQL.

# PostgreSQL's Special Handling

Check this simplified example of what I was working on recently:

```sql
SELECT
  users.id,
  users.full_name,
  users.time_zone,
  message_checkins.created_at::date AS checkin_date,
  COUNT(*) as check_count
FROM
  message_checkins
JOIN
  users ON message_checkins.user_id = users.id
GROUP BY
  users.id, users.full_name, checkin_date
```

Notice that I am selecting `users.time_zone`, but it's not in the `GROUP BY` clause. Turns out, in many database systems, this would cause an error. However, in PostgreSQL, this works perfectly fine.

OK, that's great, but why??

## Functional Dependencies to the Rescue

PostgreSQL implements a concept called "functional dependency", which is not a very self-explanatory name if you ask me. If you want to get even more confused, you can read the [official documentation](https://www.postgresql.org/docs/17/sql-select.html#SQL-GROUPBY) on this:

> When GROUP BY is present, or any aggregate functions are present, it is not valid for the SELECT list expressions to refer to ungrouped columns except within aggregate functions or when the ungrouped column is functionally dependent on the grouped columns, since there would otherwise be more than one possible value to return for an ungrouped column. A functional dependency exists if the grouped columns (or a subset thereof) are the primary key of the table containing the ungrouped column.

In my own simplified terms; if you have a `PRIMARY KEY` in your `GROUP BY` clause, you can `select` any column from the same table without including it in the `GROUP BY` clause.

To get back to my example above:

- `users.id` is the primary key for the `users` table.
- For any specific `users.id`, there is exactly one corresponding `users.time_zone` value.
- Therefore, `users.time_zone` is functionally dependent on `users.id`.

Since we're grouping by `users.id`, PostgreSQL knows that all rows with the same `users.id` will also have the same `users.time_zone`, so it doesn't require you to include it in the `GROUP BY`.

## Database Portability

Ha. Ha. When is the last time this was a real issue for you? Be honest.

## Performance Implications

Sure, taking advantage of PostgreSQL's functional dependency understanding can make queries more concise, especially for complex queries with many columns. However, it's worth noting that:

- The query optimizer needs to verify these functional dependencies.
- For very complex queries, explicitly listing all columns might help the query planner.

To conclude, unless you're working with very large datasets or very complex queries, you shouldn't notice a significant difference in performance – probably.
