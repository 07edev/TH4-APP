This is a new [**React Native**](https://reactnative.dev) project, bootstrapped using [`@react-native-community/cli`](https://github.com/react-native-community/cli).

# Getting Started

> **Note**: Make sure you have completed the [Set Up Your Environment](https://reactnative.dev/docs/set-up-your-environment) guide before proceeding.

## Step 1: Start Metro

First, you will need to run **Metro**, the JavaScript build tool for React Native.

To start the Metro dev server, run the following command from the root of your React Native project:

```sh
# Using npm
npm start

# OR using Yarn
yarn start
```

## Step 2: Build and run your app

With Metro running, open a new terminal window/pane from the root of your React Native project, and use one of the following commands to build and run your Android or iOS app:

### Android

```sh
# Using npm
npm run android

# OR using Yarn
yarn android
```

### iOS

For iOS, remember to install CocoaPods dependencies (this only needs to be run on first clone or after updating native deps).

The first time you create a new project, run the Ruby bundler to install CocoaPods itself:

```sh
bundle install
```

Then, and every time you update your native dependencies, run:

```sh
bundle exec pod install
```

For more information, please visit [CocoaPods Getting Started guide](https://guides.cocoapods.org/using/getting-started.html).

```sh
# Using npm
npm run ios

# OR using Yarn
yarn ios
```

If everything is set up correctly, you should see your new app running in the Android Emulator, iOS Simulator, or your connected device.

This is one way to run your app — you can also build it directly from Android Studio or Xcode.

## Step 3: Modify your app

Now that you have successfully run the app, let's make changes!

Open `App.tsx` in your text editor of choice and make some changes. When you save, your app will automatically update and reflect these changes — this is powered by [Fast Refresh](https://reactnative.dev/docs/fast-refresh).

When you want to forcefully reload, for example to reset the state of your app, you can perform a full reload:

- **Android**: Press the <kbd>R</kbd> key twice or select **"Reload"** from the **Dev Menu**, accessed via <kbd>Ctrl</kbd> + <kbd>M</kbd> (Windows/Linux) or <kbd>Cmd ⌘</kbd> + <kbd>M</kbd> (macOS).
- **iOS**: Press <kbd>R</kbd> in iOS Simulator.

## Congratulations! :tada:

You've successfully run and modified your React Native App. :partying_face:

### Now what?

- If you want to add this new React Native code to an existing application, check out the [Integration guide](https://reactnative.dev/docs/integration-with-existing-apps).
- If you're curious to learn more about React Native, check out the [docs](https://reactnative.dev/docs/getting-started).

# Troubleshooting

If you're having issues getting the above steps to work, see the [Troubleshooting](https://reactnative.dev/docs/troubleshooting) page.

# Learn More

To learn more about React Native, take a look at the following resources:

- [React Native Website](https://reactnative.dev) - learn more about React Native.
- [Getting Started](https://reactnative.dev/docs/environment-setup) - an **overview** of React Native and how setup your environment.
- [Learn the Basics](https://reactnative.dev/docs/getting-started) - a **guided tour** of the React Native **basics**.
- [Blog](https://reactnative.dev/blog) - read the latest official React Native **Blog** posts.
- [`@facebook/react-native`](https://github.com/facebook/react-native) - the Open Source; GitHub **repository** for React Native.

## API and offline mode

The weekly implementation includes a local JSON Server API in `db.json`. Start
it from the project root with:

```powershell
npm run api
```

The Android emulator uses `http://10.0.2.2:3000`. Successful GET requests are
cached in AsyncStorage. When the device is offline, cached data remains
available and mutations are placed in an outbox. The outbox is replayed in
creation order when connectivity returns. If the server has a newer
`updatedAt` value than an offline mutation, server data wins to avoid
overwriting newer changes.

## Application features

- Five bottom tabs: overview, courses, schedule, assignments, and profile.
- Native stack detail screens for courses, schedule sessions, assignments, and grades.
- Each bottom-tab area has its own native stack, preserving tab-specific back history.
- Course search, assignment filtering/status updates, assignment creation, profile editing,
  GPA calculation, semester grade data, loading/error/empty states, and offline banner.
- Overview, courses, schedule, assignments, and profile data use the shared API/cache layer.
- Pull down on Overview, Schedule, and Profile to refresh their API data.
- Add a schedule session from the selected calendar date using the `+` button.

## API endpoints

The local server exposes:

```text
GET    /students/1
GET    /courses?_sort=id
GET    /sessions?_expand=course
POST   /sessions
GET    /assignments?_expand=course&_sort=dueDate
POST   /assignments
PATCH  /assignments/:id
GET    /grades?_expand=course
```

For Android Emulator, keep `npm run api` running and use `10.0.2.2` as the
host address. Test offline behavior by stopping the API, changing assignment
status or profile data, then starting it again. Pending operations appear as a
badge on the Bài tập tab and are replayed when connectivity returns.

## Validation checklist

1. Start API and confirm courses, profile, assignments, schedule, and grades load.
2. Open each detail screen from its API-backed list.
3. Pull to refresh Overview, Schedule, and Profile.
4. Stop API and confirm cached data remains visible.
5. Change assignment status offline and confirm it is queued.
6. Create an assignment offline and confirm it syncs after reconnecting.
7. Edit profile offline and confirm the newer server record wins on conflict.
