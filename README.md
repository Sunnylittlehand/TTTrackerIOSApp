# Table Tennis Club Attendance Tracker

A simple web app that can be installed on iOS devices to track attendance for your table tennis club. The app allows you to:

- Track attendance for 15 regular members
- Add up to 3 ad-hoc/guest players
- View attendance history
- Works offline
- Can be installed on your iPhone

## How to Use

### Installation on iPhone

1. Open Safari on your iPhone
2. Navigate to the URL where you've hosted this app
3. Tap the Share button (square with arrow) at the bottom of the screen
4. Scroll down and tap "Add to Home Screen"
5. Give it a name (or keep the default) and tap "Add"
6. The app will now appear on your home screen like a native app

### Using the App

1. **Taking Attendance**:
   - The app automatically shows the next Saturday's date
   - Tap on a member's name to mark them as present (turns green)
   - Tap again to mark them as absent
   - For ad-hoc members, enter their name and tap the card to mark them present
   - The counter at the bottom shows how many people are present

2. **Saving Attendance**:
   - Tap the "Save Attendance" button to store the current attendance
   - A confirmation message will appear when saved successfully

3. **Viewing History**:
   - Tap the "View History" button to see past attendance records
   - Records are sorted with the most recent at the top
   - Tap "View Details" to see exactly who was present on a specific date

4. **Navigating Dates**:
   - Use the left and right arrows to navigate between Saturdays
   - The current date is displayed in the header

## Customizing Member Names

When you first use the app, it will show generic player names (Player 1, Player 2, etc.). To customize:

1. Edit the JavaScript file (app.js)
2. Find the `regularMembers` array at the top
3. Replace the generic names with your club members' names
4. Save the file and refresh the app

## Technical Information

This is a Progressive Web App (PWA) built with:
- HTML5
- CSS3
- JavaScript
- LocalStorage for data persistence
- Service Worker for offline functionality

## Hosting the App

To make this app available on your iPhone, you need to host it on a web server. Some options:

1. **GitHub Pages**: Free and easy to set up
2. **Netlify**: Free hosting with simple deployment
3. **Vercel**: Free hosting with automatic deployment
4. **Any web hosting service**: Upload the files to your web hosting account

## Limitations

- Data is stored locally on your device (not in the cloud)
- If you clear your browser data, attendance history will be lost
- Works best when used on a single device

## Support

If you need help or have questions, please contact [your contact information].

---

Created with ❤️ for table tennis enthusiasts 