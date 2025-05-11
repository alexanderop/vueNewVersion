import { readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { execSync } from 'node:child_process'
import type { Plugin, ResolvedConfig } from 'vite'

interface Options {
  /** name of the emitted JSON file in dist/ (default: 'version.json') */
  output?: string
  /** whether to inject compile-time constants (default: true) */
  define?: boolean | 'minimal'
}

// run `git describe --tags --always` or fall back
export function gitTag(): string {
  try {
    return execSync('git describe --tags --always', { stdio: 'pipe' }).toString().trim()
  } catch {
    return 'untagged'
  }
}

// Get last git commit hash
export function gitCommitHash(): string {
  try {
    return execSync('git rev-parse HEAD', { stdio: 'pipe' }).toString().trim()
  } catch {
    return 'unknown'
  }
}

// Get last git commit timestamp (ISO 8601)
export function gitCommitTimestamp(): string {
  try {
    return execSync('git log -1 --format=%cI', { stdio: 'pipe' }).toString().trim()
  } catch {
    return 'unknown'
  }
}

export default function versionJson(opts: Options = {}): Plugin {
  const outFile = opts.output ?? 'version.json'
  const doDefine = opts.define !== false
  const minimal = opts.define === 'minimal'

  let cfg: ResolvedConfig
  let pkgName = ''
  let version = ''
  const tag = gitTag()
  const commit = gitCommitHash()
  const commitTime = gitCommitTimestamp()
  let created = ''

  return {
    name: 'my app',

    // ① read package.json and prepare version/tag
    configResolved(res) {
      cfg = res
      const pkg = JSON.parse(readFileSync(resolve(cfg.root, 'package.json'), 'utf-8'))
      pkgName = pkg.name || 'unknown'
      version = pkg.version || new Date().toISOString().replace(/[-:T]/g, '').slice(0, 15) // YYYYMMDDHHmmss
      created = new Date().toISOString()

      // inject compile-time constants if wanted
      if (doDefine) {
        if (cfg.define) {
          cfg.define['import.meta.env.APP_VERSION'] = JSON.stringify(version)
          if (!minimal) cfg.define['import.meta.env.APP_TAG'] = JSON.stringify(tag)
        }
      }
    },

    // Serve /version.json dynamically during dev
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.url === '/version.json') {
          const payload = JSON.stringify(
            { name: pkgName, version, tag, commit, commitTime, created },
            null,
            2,
          )
          res.setHeader('Content-Type', 'application/json')
          res.end(payload)
          return
        }
        next()
      })
    },

    // ② emit version.json after build
    closeBundle() {
      if (cfg.command !== 'build') return
      const now = new Date().toISOString()
      const payload = JSON.stringify(
        { name: pkgName, version, tag, commit, commitTime, created: now },
        null,
        2,
      )
      const outPath = resolve(cfg.root, cfg.build.outDir, outFile)
      writeFileSync(outPath, payload, 'utf-8')
      this.info(`📦  wrote ${cfg.build.outDir}/${outFile}`)
    },
  }
}
