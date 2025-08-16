import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.salatcompanion.app',
  appName: 'رفيق الصلاة',
  webDir: 'dist/public',
  server: {
    androidScheme: 'https'
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: "#004d66",
      showSpinner: false,
    },
    StatusBar: {
      style: "dark",
      backgroundColor: "#004d66"
    }
  }
};

export default config;