from playwright.sync_api import sync_playwright, expect
import uuid
import re

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    context = browser.new_context()
    page = context.new_page()

    try:
        # Generate a unique email for the new user
        unique_email = f"testuser_{uuid.uuid4()}@example.com"
        password = "password123"

        # Navigate to the app
        page.goto("http://127.0.0.1:3000/")

        # Sign up a new user
        page.get_by_role("tab", name="Cadastrar").click()
        page.get_by_label("Nome completo").fill("Test User")
        page.get_by_label("Email").fill(unique_email)
        page.get_by_label("Senha").first.fill(password)
        page.get_by_label("Confirmar Senha").fill(password)
        page.get_by_role("button", name="Criar conta").click()

        # Directly navigate to the planning page
        page.goto("http://127.0.0.1:3000/planning")
        expect(page.get_by_role("heading", name="Planejamento")).to_be_visible(timeout=10000)

        # Create a cycle if none exists
        if page.get_by_text("Nenhum ciclo ativo").is_visible():
            page.get_by_role("button", name="Criar Primeiro Ciclo").click()
            page.get_by_label("Nome do Ciclo").fill("Ciclo de Teste")
            # Fill in the date fields. Assuming they are text inputs.
            page.get_by_label("Data de Início").fill("2025-09-01")
            page.get_by_label("Data de Fim").fill("2025-11-24")
            page.get_by_role("button", name="Criar Ciclo").click()
            expect(page.get_by_text("Ciclo de Teste")).to_be_visible()

        # Navigate to objectives page to create objectives
        page.get_by_role("link", name="Objetivos").click()
        expect(page).to_have_url(re.compile(r'.*/objectives'))

        # Create first objective
        page.get_by_role("button", name="Novo Objetivo").click()
        page.get_by_label("Título do Objetivo").fill("Objetivo Inicial")
        page.get_by_label("Descrição").fill("Descrição do objetivo inicial.")
        page.get_by_label("Métrica de Sucesso").fill("Concluir o teste.")
        page.get_by_label("Prazo Final").fill("2025-09-30")
        page.get_by_role("button", name="Criar Objetivo").click()
        expect(page.get_by_text("Objetivo Inicial")).to_be_visible()

        # Create second objective
        page.get_by_role("button", name="Novo Objetivo").click()
        page.get_by_label("Título do Objetivo").fill("Objetivo Final")
        page.get_by_label("Descrição").fill("Descrição do objetivo final.")
        page.get_by_label("Métrica de Sucesso").fill("Concluir o teste 2.")
        page.get_by_label("Prazo Final").fill("2025-10-31")
        page.get_by_role("button", name="Criar Objetivo").click()
        expect(page.get_by_text("Objetivo Final")).to_be_visible()

        # Navigate to planning page to create an action
        page.get_by_role("link", name="Planejamento").click()
        expect(page).to_have_url(re.compile(r'.*/planning'))


        # Create an action associated with the first objective
        page.get_by_role("button", name="Nova Ação").click()
        page.get_by_label("Título da Ação").fill("Ação de Teste")
        page.get_by_label("Objetivo").click()
        page.get_by_text("Objetivo Inicial").click()
        page.get_by_role("button", name="Criar Ação").click()
        expect(page.get_by_text("Ação de Teste")).to_be_visible()

        # Now, find the action and edit it
        action_card = page.locator("div:has-text('Ação de Teste')").filter(has_not_text="h4").first
        edit_button = action_card.get_by_role("button").nth(1)
        edit_button.click()

        # In the modal, change the objective to the second objective
        page.get_by_label("Objetivo").click()
        page.get_by_text("Objetivo Final").click()

        # Submit the form
        page.get_by_role("button", name="Atualizar Ação").click()

        # Verify that the "edit action" modal is gone.
        expect(page.get_by_role("dialog")).not_to_be_visible()

        # Go to the "Por Objetivo" tab to verify the move
        page.get_by_role("tab", name="Por Objetivo").click()

        # Take a screenshot
        page.screenshot(path="jules-scratch/verification/verification.png")

    finally:
        browser.close()

with sync_playwright() as playwright:
    run(playwright)
