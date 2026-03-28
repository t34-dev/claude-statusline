# claude-statusline

A rich status line for [Claude Code](https://claude.ai/code) with rate limit countdown timers, context window usage, git info, and session duration.

![screenshot](./screenshot.png)

## Features

- **Working directory** — full path with `~` shorthand
- **Model name** — current Claude model (Opus, Sonnet, Haiku)
- **Context usage** — percentage of context window used, color-coded (green → yellow → red)
- **Git branch** — current branch with dirty state indicator (`*`)
- **Session timer** — how long the current session has been active
- **Effort level** — current effort setting (low/medium/high/default)
- **Rate limit bars** — visual progress bars for 5-hour and 7-day usage limits
- **Countdown timers** — time remaining until rate limit resets (e.g., `3h 42m`, `1d 14h 22m`)
- **Extra usage tracking** — shows spending if extra usage is enabled

## Install

```bash
npx @t34-dev/claude-statusline
```

The installer will:
1. Check for required dependencies (`jq`, `curl`, `git`)
2. Back up any existing statusline configuration
3. Install the script to `~/.claude/statusline.sh`
4. Update `~/.claude/settings.json`

Then restart Claude Code to see the new status line.

## Uninstall

```bash
npx @t34-dev/claude-statusline --uninstall
```

Restores your previous statusline if one was backed up.

## Requirements

- [jq](https://jqlang.github.io/jq/) — JSON parsing
- curl — fetching rate limit data from Anthropic API
- git — branch and dirty state detection

### macOS

```bash
brew install jq
```

### Ubuntu / Debian

```bash
sudo apt install jq curl git
```

### Windows (Git Bash)

```bash
choco install jq curl git
```

Or use [scoop](https://scoop.sh/):

```bash
scoop install jq curl git
```

## Platform Support

| Platform | Shell | Status |
|----------|-------|--------|
| macOS | zsh, bash | Fully supported |
| Linux | bash, zsh | Fully supported |
| Windows | Git Bash | Supported |
| Windows | WSL | Fully supported |

The script handles platform differences automatically:
- BSD `date` (macOS) and GNU `date` (Linux/Windows) for time parsing
- macOS Keychain, Linux `secret-tool`, and credentials file for OAuth token resolution
- BSD `stat` and GNU `stat` for cache file age detection

## Display Layout

```
~/path/to/project
Opus 4.6 (1M context) │ ✍️ 12% │ my-project (main) │ ⏱ 45m │ ◑ default
current ●○○○○○○○○○   1% ⟳ 3h 42m
weekly  ●○○○○○○○○○  15% ⟳ 1d 14h 22m
```

### Color Coding

Context and rate limit usage is color-coded by percentage:

| Range | Color |
|-------|-------|
| 0-49% | Green |
| 50-69% | Orange |
| 70-89% | Yellow |
| 90-100% | Red |

## How It Works

The status line script receives JSON data from Claude Code via stdin. It parses model info, context window usage, and session data using `jq`. Rate limit data is fetched from the Anthropic API using your OAuth token (auto-discovered from Keychain, credentials file, or environment variable) and cached for 60 seconds.

## Configuration

The script is installed at `~/.claude/statusline.sh`. You can edit it directly to customize the display.

The settings entry in `~/.claude/settings.json`:

```json
{
  "statusLine": {
    "type": "command",
    "command": "bash /path/to/home/.claude/statusline.sh"
  }
}
```

## Credits

Inspired by [kamranahmedse/claude-statusline](https://github.com/kamranahmedse/claude-statusline). Extended with countdown timers, working directory display, and cross-platform support.

## License

MIT
