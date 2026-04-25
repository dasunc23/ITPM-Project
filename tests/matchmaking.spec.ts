import { test, expect } from '@playwright/test';

test.describe('Game Room and Matchmaking', () => {
  test('Full Matchmaking Flow (Signup -> Create -> Join -> Start)', async ({ browser }) => {
    test.setTimeout(90000); 

    // ─── 1. HOST SETUP ───
    const hostContext = await browser.newContext();
    const hostPage = await hostContext.newPage();
    const hostEmail = `host_${Date.now()}@test.com`;
    // Names cannot contain numbers per Signup.jsx validation
    const uniqueHostName = 'HostTest' + Math.random().toString(36).replace(/[^a-z]/g, '').substring(0, 5);

    // Signup Host
    await hostPage.goto('http://localhost:3001/signup');
    await hostPage.fill('input[name="name"]', uniqueHostName);
    await hostPage.fill('input[name="email"]', hostEmail);
    await hostPage.fill('input[name="password"]', 'Pass123'); // Password needs letters and numbers
    await hostPage.fill('input[name="campus"]', 'Main Campus');
    await hostPage.selectOption('select[name="year"]', '3');
    await hostPage.click('button:has-text("SIGN UP")');
    
    try {
      await expect(hostPage).toHaveURL(/.*login/, { timeout: 10000 });
    } catch (e) {
      await hostPage.screenshot({ path: 'test-failure-host-signup.png' });
      const errorMsg = await hostPage.locator('div[class*="bg-red-900"], p.text-red-400').first().innerText().catch(() => 'No visible error');
      throw new Error(`Host Signup failed: ${errorMsg}. Screenshot: test-failure-host-signup.png`);
    }

    // Login Host
    await hostPage.fill('input[name="email"]', hostEmail);
    await hostPage.fill('input[name="password"]', 'Pass123');
    await hostPage.click('button:has-text("LOG IN")');
    // App.js redirects unknown routes like /home to the landing page (/)
    await expect(hostPage).toHaveURL(new RegExp('http://localhost:3001/(home|dashboard|)?$'));

    // Create Room
    await hostPage.goto('http://localhost:3001/create?game=typing&gameName=SQL%20Typing%20Race');
    await hostPage.fill('input[name="username"]', uniqueHostName);
    await hostPage.click('button:has-text("Create Room")');
    
    let roomCode = '';
    try {
      const roomCodeElement = hostPage.locator('p.text-5xl');
      await expect(roomCodeElement).toBeVisible({ timeout: 15000 });
      roomCode = await roomCodeElement.innerText();
      console.log(`Created Room Code: ${roomCode}`);
      await hostPage.click('button:has-text("Go to Lobby")');
    } catch (e) {
      await hostPage.screenshot({ path: 'test-failure-host-room.png' });
      const errorMsg = await hostPage.locator('div[class*="bg-red-900"], p.text-red-400').first().innerText().catch(() => 'No visible error');
      throw new Error(`Host Room Creation failed: ${errorMsg}. Screenshot: test-failure-host-room.png`);
    }

    // ─── 2. PLAYER SETUP ───
    const playerContext = await browser.newContext();
    const playerPage = await playerContext.newPage();
    const playerEmail = `player_${Date.now()}@test.com`;
    const uniquePlayerName = 'PlayerTest' + Math.random().toString(36).replace(/[^a-z]/g, '').substring(0, 5);

    // Signup Player
    await playerPage.goto('http://localhost:3001/signup');
    await playerPage.fill('input[name="name"]', uniquePlayerName);
    await playerPage.fill('input[name="email"]', playerEmail);
    await playerPage.fill('input[name="password"]', 'Pass123');
    await playerPage.fill('input[name="campus"]', 'SLIIT');
    await playerPage.selectOption('select[name="year"]', '3');
    await playerPage.click('button:has-text("SIGN UP")');
    
    try {
      await expect(playerPage).toHaveURL(/.*login/, { timeout: 10000 });
    } catch (e) {
      await playerPage.screenshot({ path: 'test-failure-player-signup.png' });
      const errorMsg = await playerPage.locator('div[class*="bg-red-900"], p.text-red-400').first().innerText().catch(() => 'No visible error');
      throw new Error(`Player Signup failed: ${errorMsg}. Screenshot: test-failure-player-signup.png`);
    }

    // Login Player
    await playerPage.fill('input[name="email"]', playerEmail);
    await playerPage.fill('input[name="password"]', 'Pass123');
    await playerPage.click('button:has-text("LOG IN")');
    await expect(playerPage).toHaveURL(new RegExp('http://localhost:3001/(home|dashboard|)?$'));

    // Join Room
    await playerPage.goto('http://localhost:3001/join');
    await playerPage.fill('input[name="username"]', uniquePlayerName);
    await playerPage.fill('input[name="roomCode"]', roomCode);
    await playerPage.click('button:has-text("Join Room")');

    // Verify Lobby Sync
    try {
      await expect(playerPage).toHaveURL(new RegExp(`.*/lobby/${roomCode}`), { timeout: 15000 });
      await expect(playerPage.locator(`text=${uniqueHostName}`)).toBeVisible();
      await expect(playerPage.locator(`text=${uniquePlayerName}`)).toBeVisible();
      await expect(hostPage.locator(`text=${uniquePlayerName}`)).toBeVisible();
    } catch (e) {
      await playerPage.screenshot({ path: 'test-failure-player-lobby.png' });
      const errorMsg = await playerPage.locator('div[class*="bg-red-900"], p.text-red-400').first().innerText().catch(() => 'No visible error');
      throw new Error(`Player Lobby failed: ${errorMsg}. Screenshot: test-failure-player-lobby.png`);
    }

    // ─── 3. START GAME ───
    await hostPage.click('button:has-text("Start Game")');

    // Final Sync Check
    await expect(hostPage).toHaveURL(/.*play\/typing/, { timeout: 10000 });
    await expect(playerPage).toHaveURL(/.*play\/typing/, { timeout: 10000 });

    await hostPage.close();
    await playerPage.close();
  });
});
