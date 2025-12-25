# Building APK for Muxic App

This guide will help you build an APK file to test the app on your Android device.

## Prerequisites

1. **Expo Account** - Create a free account at [expo.dev](https://expo.dev)
2. **EAS CLI** - Will be installed automatically when you run the build command

## Building the APK

### Step 1: Login to Expo

```bash
npx eas-cli login
```

Enter your Expo account credentials.

### Step 2: Configure the Project

```bash
npx eas-cli build:configure
```

This will set up your project for EAS Build (already done - eas.json is created).

### Step 3: Build the APK

```bash
npx eas-cli build -p android --profile preview
```

**What this does:**

- Builds an APK (not AAB) for easy installation
- Uses the "preview" profile from eas.json
- Uploads to Expo servers and builds in the cloud
- Takes about 5-10 minutes

### Step 4: Download the APK

Once the build completes:

1. You'll get a download link in the terminal
2. Or visit [expo.dev/accounts/[your-username]/projects/muxic_app/builds](https://expo.dev)
3. Download the APK file to your computer

### Step 5: Install on Android Device

**Option 1: Direct Download**

- Open the download link on your Android device
- Install the APK directly

**Option 2: Transfer via USB**

- Connect your Android device to computer
- Copy the APK to your device
- Open the APK file on your device to install

**Option 3: Use ADB**

```bash
adb install path/to/your-app.apk
```

## Alternative: Local Build (Requires Android Studio)

If you have Android Studio and Android SDK installed:

```bash
npx expo run:android
```

This builds locally and installs directly on a connected device/emulator.

## Troubleshooting

### "Enable Unknown Sources"

- Go to Settings → Security → Unknown Sources
- Enable installation from unknown sources

### Build Fails

- Make sure you're logged in: `npx eas-cli whoami`
- Check your internet connection
- Review build logs on expo.dev

### Permission Issues on Device

- After installing, go to App Settings → Permissions
- Manually enable Storage/Media permissions if needed

## What's in the APK?

This APK includes:

- All 4 navigation screens (Home, Search, Library, Profile)
- Theme system (light/dark mode)
- Local music access with permissions
- Full media library integration

## Next Steps

After installing:

1. Open the app
2. Navigate to Library tab
3. Grant storage permission when prompted
4. Your local music should appear!

---

**Note:** The first build may take longer as Expo sets up your project. Subsequent builds are faster.
