import { test, expect } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  await page.goto('/')
})

test.describe('Todo management', () => {
  test('user can add a todo and see it in the list', async ({ page }) => {
    await page.getByPlaceholder('Add a new task...').fill('Buy milk')
    await page.getByRole('button', { name: 'Add' }).first().click()
    await expect(page.getByText('Buy milk')).toBeVisible()
  })

  test('user can mark a todo as complete', async ({ page }) => {
    await page.getByPlaceholder('Add a new task...').fill('Read a book')
    await page.getByRole('button', { name: 'Add' }).first().click()
    await page.locator('.rounded-full.border-2').click()
    await expect(page.locator('span.line-through')).toBeVisible()
  })

  test('user can delete a todo', async ({ page }) => {
    await page.getByPlaceholder('Add a new task...').fill('Temporary task')
    await page.getByRole('button', { name: 'Add' }).first().click()

    const item = page.locator('.group', { hasText: 'Temporary task' })
    await item.hover()
    await item.getByRole('button').last().click()

    await expect(page.getByText('Temporary task')).not.toBeVisible()
  })

  test('user can inline edit a todo by double-clicking', async ({ page }) => {
    await page.getByPlaceholder('Add a new task...').fill('Old text')
    await page.getByRole('button', { name: 'Add' }).first().click()

    await page.getByText('Old text').dblclick()
    await page.locator('.group input').fill('New text')
    await page.locator('.group input').press('Enter')

    await expect(page.getByText('New text')).toBeVisible()
    await expect(page.getByText('Old text')).not.toBeVisible()
  })
})

test.describe('Status filters', () => {
  test.beforeEach(async ({ page }) => {
    await page.getByPlaceholder('Add a new task...').fill('Active task')
    await page.getByRole('button', { name: 'Add' }).first().click()
    await page.getByPlaceholder('Add a new task...').fill('Completed task')
    await page.getByRole('button', { name: 'Add' }).first().click()
    await page.locator('.group', { hasText: 'Completed task' }).locator('.rounded-full.border-2').click()
  })

  test('Active filter shows only incomplete todos', async ({ page }) => {
    await page.getByRole('button', { name: 'Active' }).click()
    await expect(page.getByText('Active task')).toBeVisible()
    await expect(page.getByText('Completed task')).not.toBeVisible()
  })

  test('Done filter shows only completed todos', async ({ page }) => {
    await page.getByRole('button', { name: 'Done' }).click()
    await expect(page.getByText('Completed task')).toBeVisible()
    await expect(page.getByText('Active task')).not.toBeVisible()
  })

  test('All filter shows all todos', async ({ page }) => {
    await page.getByRole('button', { name: 'Done' }).click()
    await page.getByRole('button', { name: 'All', exact: true }).click()
    await expect(page.getByText('Active task')).toBeVisible()
    await expect(page.getByText('Completed task')).toBeVisible()
  })

  test('clear completed removes all done todos', async ({ page }) => {
    await page.getByRole('button', { name: 'Clear completed' }).click()
    await expect(page.getByText('Completed task')).not.toBeVisible()
    await expect(page.getByText('Active task')).toBeVisible()
  })
})

test.describe('Categories', () => {
  test('user can create a category and assign a todo to it', async ({ page }) => {
    await page.getByRole('button', { name: 'New Category' }).click()
    await page.locator('aside input').fill('Work')
    await page.locator('aside').getByRole('button', { name: 'Add' }).click()

    await page.getByRole('button', { name: 'Work' }).click()
    await page.getByPlaceholder('Add a new task...').fill('Work task')
    await page.getByRole('button', { name: 'Add' }).first().click()

    await expect(page.getByText('Work task')).toBeVisible()
  })

  test('todos in a category do not appear in another category', async ({ page }) => {
    await page.getByRole('button', { name: 'New Category' }).click()
    await page.locator('aside input').fill('Work')
    await page.locator('aside').getByRole('button', { name: 'Add' }).click()

    await page.locator('nav').getByRole('button', { name: 'Work' }).click()
    await page.getByPlaceholder('Add a new task...').fill('Work task')
    await page.getByRole('button', { name: 'Add' }).first().click()
    await expect(page.getByText('Work task')).toBeVisible()

    await page.locator('nav').getByRole('button', { name: 'All Tasks' }).click()
    await page.getByPlaceholder('Add a new task...').fill('Uncategorised task')
    await page.getByRole('button', { name: 'Add' }).first().click()
    await expect(page.getByText('Uncategorised task')).toBeVisible()

    await page.locator('nav').getByRole('button', { name: 'Work' }).click()
    await expect(page.getByText('Work task')).toBeVisible()
    await expect(page.getByText('Uncategorised task')).not.toBeVisible()
  })

  test('deleting a category moves its todos to All Tasks', async ({ page }) => {
    await page.getByRole('button', { name: 'New Category' }).click()
    await page.locator('aside input').fill('Temp')
    await page.locator('aside').getByRole('button', { name: 'Add' }).click()

    await page.locator('nav').getByRole('button', { name: 'Temp' }).click()
    await page.getByPlaceholder('Add a new task...').fill('Orphan task')
    await page.getByRole('button', { name: 'Add' }).first().click()
    await expect(page.getByText('Orphan task')).toBeVisible()

    // Delete the category — selectedCategoryId resets to null automatically
    await page.getByRole('button', { name: 'Delete' }).click()

    await expect(page.getByText('Orphan task')).toBeVisible()
  })
})
