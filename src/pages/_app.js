// i18n
// import 'src/locales/i18n';

// scrollbar
import 'simplebar-react/dist/simplebar.min.css';

// lightbox
import 'yet-another-react-lightbox/plugins/captions.css';
import 'yet-another-react-lightbox/plugins/thumbnails.css';
import 'yet-another-react-lightbox/styles.css';

// map
import 'mapbox-gl/dist/mapbox-gl.css';

// editor
import 'react-quill/dist/quill.snow.css';

// carousel
import 'slick-carousel/slick/slick-theme.css';
import 'slick-carousel/slick/slick.css';

// image
import 'react-lazy-load-image-component/src/effects/blur.css';
// theme
import ThemeProvider from 'src/theme';
// components
import MotionLazy from 'src/components/animate/motion-lazy';
import ProgressBar from 'src/components/progress-bar';
import { SettingsDrawer, SettingsProvider } from 'src/components/settings';
// auth
import { Provider } from 'react-redux';
import { AuthProvider } from 'src/auth/context/jwt';
// next
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { makeStore } from '@store';
import App from 'next/app';
//Dnd
const store = makeStore();

class MyApp extends App {
  static async getInitialProps({ Component, ctx }) {
    const pageProps = Component.getInitialProps ? await Component.getInitialProps(ctx) : {};
    return { pageProps };
  }

  render() {
    const { Component, pageProps } = this.props;
    const getLayout = Component.getLayout ?? ((page) => page);
    return (
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Provider store={store}>
          <AuthProvider>
            <SettingsProvider
              defaultSettings={{
                themeMode: 'light', // 'light' | 'dark'
                themeDirection: 'ltr', //  'rtl' | 'ltr'
                themeContrast: 'default', // 'default' | 'bold'
                themeLayout: 'vertical', // 'vertical' | 'horizontal' | 'mini'
                themeColorPresets: 'blue', // 'default' | 'cyan' | 'purple' | 'blue' | 'orange' | 'red'
                themeStretch: false,
              }}
            >
              <ThemeProvider>
                <MotionLazy>
                  <SettingsDrawer />
                  <ProgressBar />
                  <Component {...pageProps} />
                </MotionLazy>
              </ThemeProvider>
            </SettingsProvider>
          </AuthProvider>
        </Provider>
      </LocalizationProvider>
    );
  }
}

export default MyApp;
