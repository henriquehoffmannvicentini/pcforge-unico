import { test, expect } from '@playwright/test';

test.describe('CRUD Admin de produtos e categorias', () => {
  test('CRUD de categorias completa', async ({ page }) => {
    await page.goto('/admin');

    await page.route('**/categorias', (route) => {
      if (route.request().method() === 'GET') {
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify([]),
        });
        return;
      }
      if (route.request().method() === 'POST') {
        route.fulfill({
          status: 201,
          contentType: 'application/json',
          body: JSON.stringify({ id_categoria: 123, nome: 'Monitores', descricao: 'Monitores para gamers' }),
        });
        return;
      }
      if (route.request().method() === 'PUT') {
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ id_categoria: 123, nome: 'Monitores Atualizados', descricao: 'Monitores para jogos' }),
        });
        return;
      }
      if (route.request().method() === 'DELETE') {
        route.fulfill({ status: 204 });
        return;
      }
      route.continue();
    });

    await page.fill('input[name="nome"]', 'Monitores');
    await page.fill('textarea[name="descricao"]', 'Monitores para gamers');
    await page.click('button:has-text("Criar categoria")');

    await expect(page.locator('text=Categoria criada com sucesso.')).toBeVisible();
    await page.click('button:has-text("Editar")');
    await expect(page.locator('input[name="nome"][value="Monitores"]')).toBeVisible();

    await page.fill('input[name="nome"]', 'Monitores Atualizados');
    await page.fill('textarea[name="descricao"]', 'Monitores para jogos');
    await page.click('button:has-text("Salvar alterações")');

    await expect(page.locator('text=Categoria atualizada com sucesso.')).toBeVisible();
    await page.click('button:has-text("Excluir")');
    await expect(page.locator('text=Categoria excluída com sucesso.')).toBeVisible();
  });

  test('CRUD de produtos completo', async ({ page }) => {
    await page.goto('/admin');

    await page.route('**/categorias', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([{ id_categoria: 1, nome: 'Placas de vídeo' }]),
      });
    });

    const produtoId = 321;
    await page.route('**/produtos', async (route) => {
      const req = route.request();
      if (req.method() === 'GET') {
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify([]),
        });
        return;
      }
      if (req.method() === 'POST') {
        route.fulfill({
          status: 201,
          contentType: 'application/json',
          body: JSON.stringify({ id_produto: produtoId, nome: 'RTX 4070', descricao: 'Placa para jogos', preco: 4500, id_categoria: 1, estoque: 10, destaque: false }),
        });
        return;
      }
      route.continue();
    });

    await page.route('**/produtos/*', async (route) => {
      const req = route.request();
      if (req.method() === 'PUT') {
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ id_produto: produtoId, nome: 'RTX 4070 Super', descricao: 'Placa para jogos atualizada', preco: 4700, id_categoria: 1, estoque: 15, destaque: false }),
        });
        return;
      }
      if (req.method() === 'DELETE') {
        route.fulfill({ status: 204 });
        return;
      }
      route.continue();
    });

    await page.fill('input[name="nome"]', 'RTX 4070');
    await page.fill('textarea[name="descricao"]', 'Placa para jogos');
    await page.fill('input[name="preco"]', '4500');
    await page.selectOption('select[name="id_categoria"]', '1');
    await page.fill('input[name="estoque"]', '10');
    await page.click('button:has-text("Criar produto")');

    await expect(page.locator('text=Produto criado com sucesso.')).toBeVisible();
    await page.click('button:has-text("Editar")');
    await expect(page.locator('input[name="nome"][value="RTX 4070"]')).toBeVisible();

    await page.fill('input[name="nome"]', 'RTX 4070 Super');
    await page.fill('textarea[name="descricao"]', 'Placa para jogos atualizada');
    await page.click('button:has-text("Salvar alterações")');
    await expect(page.locator('text=Produto atualizado com sucesso.')).toBeVisible();

    await page.click('button:has-text("Excluir")');
    await expect(page.locator('text=Produto excluído com sucesso.')).toBeVisible();
  });
});
