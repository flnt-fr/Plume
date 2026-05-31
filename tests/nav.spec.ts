import { expect, test } from '@playwright/test';

const MOBILE = { width: 375, height: 812 };
const DESKTOP = { width: 1280, height: 900 };

const NAV_LINKS = [
  { href: '/about', label: 'About' },
  { href: '/experiences', label: 'Experience' },
  { href: '/projects', label: 'Projects' },
  { href: '/watch', label: 'Watch' },
  { href: '/now', label: 'Now' },
];

test('desktop: inline nav is visible, hamburger is hidden', async ({ page }) => {
  await page.setViewportSize(DESKTOP);
  await page.goto('/');

  await expect(page.locator('header nav')).toBeVisible();
  await expect(page.locator('header details')).not.toBeVisible();
});

test('mobile: hamburger is visible, inline nav is hidden', async ({ page }) => {
  await page.setViewportSize(MOBILE);
  await page.goto('/');

  await expect(page.locator('header details')).toBeVisible();
  await expect(page.locator('header nav')).not.toBeVisible();
});

test('mobile: opening the hamburger exposes all nav links', async ({ page }) => {
  await page.setViewportSize(MOBILE);
  await page.goto('/');

  await page.locator('header details summary').click();

  const dropdown = page.locator('header details ul');
  await expect(dropdown).toBeVisible();

  for (const { href, label } of NAV_LINKS) {
    const link = dropdown.locator(`a[href="${href}"]`);
    await expect(link).toBeVisible();
    await expect(link).toHaveText(label);
  }
});

test('mobile: active page link has aria-current="page"', async ({ page }) => {
  await page.setViewportSize(MOBILE);
  await page.goto('/about');

  await page.locator('header details summary').click();

  const activeLink = page.locator('header details ul a[href="/about"]');
  await expect(activeLink).toHaveAttribute('aria-current', 'page');

  for (const { href } of NAV_LINKS.filter((l) => l.href !== '/about')) {
    const link = page.locator(`header details ul a[href="${href}"]`);
    await expect(link).not.toHaveAttribute('aria-current', 'page');
  }
});
