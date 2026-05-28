import { createBdd } from 'playwright-bdd';
import { expect } from '@playwright/test';

const { Given, When, Then, Before } = createBdd();

const menuTestId: Record<string, string> = {
  '💯 Punkte eingeben': 'menu-score-input',
  '✋ Weisen': 'menu-claims',
  '💥 Match (257)': 'menu-match',
  '↩ Rückgängig': 'menu-undo',
  '🔄 Neues Spiel': 'menu-new-game',
  '⚙️ Einstellungen': 'menu-settings',
};

const actionTestId: Record<string, string> = {
  'Weiter': 'score-confirm',
  'Zurücksetzen': 'confirm-reset',
};

Before(async ({ page }) => {
  await page.goto('/');
  await page.waitForSelector('.board-surface');
});

Given('die App ist geöffnet', async () => {
  // Navigation bereits im Before-Hook erledigt
});

Given('das Ziel ist auf {int} Punkte gesetzt', async ({ page }, goal: number) => {
  await page.getByTestId('team-panel-1').click();
  await page.getByTestId('menu-settings').click();
  await page.getByTestId('settings-goal').fill(String(goal));
  await page.getByTestId('settings-save').click();
});

When('ich auf Team {int} tippe', async ({ page }, team: number) => {
  await page.getByTestId(`team-panel-${team}`).click();
});

When('ich {string} auswähle', async ({ page }, label: string) => {
  await page.getByTestId(menuTestId[label]).click();
});

When('ich {string} eintippe', async ({ page }, digits: string) => {
  for (const digit of digits) {
    await page.getByTestId(`digit-${digit}`).click();
  }
});

When('ich auf {string} tippe', async ({ page }, label: string) => {
  const testId = actionTestId[label];
  if (testId) {
    await page.getByTestId(testId).click();
  } else {
    await page.getByRole('button', { name: label }).click();
  }
});

When('ich {string} Punkte wähle', async ({ page }, pts: string) => {
  await page.getByTestId(`claim-${pts}`).click();
});

When('ich Multiplikator {string} wähle', async ({ page }, mult: string) => {
  const num = mult.replace('×', '');
  await page.getByTestId(`multiplier-${num}`).click();
});

Then('zeigt Team {int} {string} Punkte', async ({ page }, team: number, expected: string) => {
  await expect(page.getByTestId(`team-score-${team}`)).toHaveText(expected);
});

Then('wird {string} angezeigt', async ({ page }, text: string) => {
  await expect(page.getByText(text)).toBeVisible();
});

Then('der Gewinner ist {string}', async ({ page }, winner: string) => {
  await expect(page.getByTestId('result-winner')).toContainText(winner);
});
