import { gitTag } from './plugins/version-json' // Assuming test-git-tag.ts is in the root
import { execSync } from 'node:child_process'

console.log('--- Testing gitTag function ---')

// Test in the current repository
console.log('Output from gitTag():', gitTag())

// For comparison, direct output from git describe
try {
  const directGitOutput = execSync('git describe --tags --always', { stdio: 'pipe' })
    .toString()
    .trim()
  console.log("Direct output from 'git describe --tags --always':", directGitOutput)
} catch (e) {
  console.log("Direct 'git describe' command failed in this environment.")
}

console.log('--- End of Test ---')
