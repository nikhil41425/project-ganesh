# PWA Development vs Production

## Development Mode (Current)
```bash
npm run dev
```
- ✅ PWA components work
- ✅ Service worker registers
- ✅ Install prompts appear
- ✅ Manifest available
- ⚠️ Limited caching (for development speed)
- ⚠️ Offline support disabled

## Production Mode (Full PWA)
```bash
npm run build
npm start
```
- ✅ Full PWA functionality
- ✅ Complete offline support
- ✅ Advanced caching strategies
- ✅ All PWA features enabled

## Testing PWA Features

### In Development (localhost:3001)
- Test install prompts
- Test PWA components
- Test responsive design
- Test keyboard shortcuts

### In Production
- Test offline functionality
- Test caching strategies
- Test full app installation
- Run Lighthouse PWA audit

## Current Status
PWA is now enabled in development mode! You can test most features, but for full offline testing, use production build.
