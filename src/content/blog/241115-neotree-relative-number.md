---
title: "Enable relativenumber for neo-tree"
description: "Enable relative line numbers for lazyvim users when the neo-tree buffer becomes active."
pubDate: "15 November 2024"
hide: false
tags:
  - lazyvim
  - neotree
  - neovim
---

If you are a lazyvim user and want to enable relative line numbers, first create a file for `neo-tree.nvim` if you don’t have already, under the `plugins` folder:

```lua
return {
  "nvim-neo-tree/neo-tree.nvim",
}
```

Next, we are going to update our config by addin an option with event handler to display relative line numbers when the `neo-tree` buffer becomes active:

```lua
return {
  "nvim-neo-tree/neo-tree.nvim",
  opts = {
    event_handlers = {
      {
        event = "neo_tree_buffer_enter",
        handler = function()
          vim.opt_local.number = true
          vim.opt_local.relativenumber = true
        end,
      },
    },
  },
}
```

Now, when you open the `neo-tree`, you should see the line numbers.
