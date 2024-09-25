# Trade Runners

## Original concept

This is the initial prototype for a game idea I had for some time. It is somewhat based on drugwars and
the more modern interpretation, dopewars.

Play as Trade Runner: a wandering trader in an alternate timeline where escalating global conflicts
make people live underground for decades and just now reemerge.

Trade to pay a family debt with a local gang. Rake profits from strategic commerce. Or just steal and see
if you can get away with it.

## Development

### History

The game is implemented as an Angular 17 application, although, I'll admit it doesn't fully use all of it's features, neither does it use the features that it does consistently. The original version of this
was implemented in Vue, Vanilla JS and, more recently, older versions of Angular. This version is a revision of a mashup of the last 2-4 versions plus the core game classes that were implemented for a text-only initial prototype, which turned out way too complex to realistically become a game. I plan to refactor and write some proper unit tests in the future.

### Running

To run the development server, simply:

```bash
npm install
npm run start
```

The game will be available at `http://localhost:4200`. The initial screen is a simple, hopefully self-explanatory, main menu at `/menu`.

### Building for Desktop

To build the game as a desktop application using Electron, follow these steps:

1. **Install Dependencies**

   Make sure all dependencies are installed:

   ```bash
   npm install
   ```

2. **Build the Desktop Application**

   Run the following command to build the application for desktop platforms:

   ```bash
   npm run electron-build
   ```

   This command will:

   - Build the Angular app for production.
   - Package it with Electron using Electron Builder.

3. **Locate the Generated Files**

   After the build process is complete, you will find the installers in the `dist-electron` directory:

   - **Windows**: Look for the `.exe` installer file.
   - **macOS**: Look for the `.dmg` file.
   - **Linux**: Look for the `.AppImage` or .deb `files`.

4. **Install and Run the Application**

   - **Windows**:

     - Run the `.exe` installer.
     - Follow the installation instructions.
     - Start "Trade Runner" from the Start Menu or Desktop shortcut.

   - **macOS**:

     - Open the `.dmg` file.
     - Drag and drop the "Trade Runner" app into the Applications folder.
     - Start the app from the Applications folder or Dock.

   - **Linux**:

     - For `.AppImage`:

       ```bash
       chmod +x Trade\ Runner.AppImage
       ./Trade\ Runner.AppImage
       ```

     - For `.deb`:

       ```bash
       sudo dpkg -i trade-runner.deb
       ```

     - Launch "Trade Runner" from the application launcher.

5. **Development Mode with Electron**

   If you want to run the Electron app in development mode with automatic reload:

   ```bash
    npm run electron-dev
   ```

   This command will:

   - Start the Angular development server.
   - Launch the Electron app pointing to `http://localhost:4200`.

### Notes

- **Custom Icons**: The app includes custom icons for each platform, specified in the build configuration.

- **Build Configuration**: The build process is configured in the `package.json` file under the `build` section, using Electron Builder.

- **Environment Variables**: The build scripts use `NODE_ENV` to differentiate between development and production environments.

- **Electron Version**: Make sure that Electron and Electron Builder are installed as development dependencies in the project.
