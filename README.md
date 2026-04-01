# claude-statusline

A status line for [Claude Code](https://claude.ai/code) that shows what matters while you work: context usage, rate limits with countdown to reset, and the current CLI version.

![screenshot](./screenshot.png)

## What it shows

- Current model and Claude Code version (e.g. `v2.1.89`)
- Context window usage, color coded from green to red as you fill it up
- Git branch with dirty state indicator
- Session duration
- Effort level setting
- Rate limit bars for 5-hour and 7-day windows, with time until reset
- Extra usage spending if enabled

## Install

```bash
npx @t34-dev/claude-statusline
```

This checks for dependencies (`jq`, `curl`, `git`), backs up your existing config, drops the script into `~/.claude/statusline.sh`, and updates `~/.claude/settings.json`.

Restart Claude Code after installing.

## Uninstall

```bash
npx @t34-dev/claude-statusline --uninstall
```

Restores your previous statusline if one was backed up.

## Requirements

You need [jq](https://jqlang.github.io/jq/), curl, and git.

macOS:
```bash
brew install jq
```

Ubuntu/Debian:
```bash
sudo apt install jq curl git
```

Windows (Git Bash):
```bash
choco install jq curl git
```

Or with [scoop](https://scoop.sh/):
```bash
scoop install jq curl git
```

## Platform support

| Platform | Shell | Status |
|----------|-------|--------|
| macOS | zsh, bash | Works |
| Linux | bash, zsh | Works |
| Windows | Git Bash | Works |
| Windows | WSL | Works |

The script handles BSD vs GNU differences for `date` and `stat` automatically. OAuth tokens come from macOS Keychain, Linux `secret-tool`, or the credentials file, whichever is available.

## Layout

```
~/path/to/project
Opus 4.6 (1M context) v2.1.89 │ ✍️ 12% │ main │ ⏱ 45m │ ● high
current ●○○○○○○○○○   1% ⟳ 3h 42m
weekly  ●○○○○○○○○○  15% ⟳ 1d 14h 22m
```

Usage colors shift by percentage:

| Range | Color |
|-------|-------|
| 0-49% | Green |
| 50-69% | Orange |
| 70-89% | Yellow |
| 90-100% | Red |

## How it works

The script reads JSON from Claude Code via stdin, pulls out model info, context usage, and session data with `jq`. Rate limits come from the Anthropic API using your OAuth token (auto-discovered from Keychain, credentials file, or env variable) and get cached for 60 seconds so you're not hitting the API on every refresh.

## Customization

The script lives at `~/.claude/statusline.sh`, edit it however you like.

Settings entry in `~/.claude/settings.json`:

```json
{
  "statusLine": {
    "type": "command",
    "command": "bash /path/to/home/.claude/statusline.sh"
  }
}
```

## Credits

Started from [kamranahmedse/claude-statusline](https://github.com/kamranahmedse/claude-statusline), then added countdown timers, CLI version display, working directory, and cross-platform support.

## License

MIT
