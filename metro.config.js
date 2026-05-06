const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Support WASM for expo-sqlite web (wa-sqlite)
config.resolver.assetExts.push('wasm');

module.exports = config;
