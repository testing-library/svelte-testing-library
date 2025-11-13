export default {
  preset: 'conventionalcommits',
  branches: ['main', { name: 'next', prerelease: true }],
  plugins: [
    '@semantic-release/commit-analyzer',
    '@semantic-release/release-notes-generator',
    '@anolilab/semantic-release-pnpm',
    '@semantic-release/github',
  ],
}
