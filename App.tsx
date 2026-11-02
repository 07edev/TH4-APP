/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import {StatusBar, useColorScheme} from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {AppNavigator} from './src/navigation/AppNavigator';
import {AppDataProvider} from './src/context/AppDataContext';
import {SyncProvider} from './src/context/SyncContext';

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <SafeAreaProvider>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <SyncProvider>
        <AppDataProvider>
          <AppNavigator />
        </AppDataProvider>
      </SyncProvider>
    </SafeAreaProvider>
  );
}

export default App;
