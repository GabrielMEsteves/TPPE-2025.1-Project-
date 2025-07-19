import pytest
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from webdriver_manager.chrome import ChromeDriverManager
import time
import uuid
import tempfile
import os
from selenium.webdriver.common.keys import Keys

# Para ambiente Docker, use o nome do container
FRONTEND_URL = "http://frontend:5173" if os.environ.get('DOCKER_ENV') else "http://localhost:5173"

def create_visual_driver():
    """Cria driver para testes visuais"""
    chrome_options = Options()
    
    # No ambiente Docker, use headless
    if os.environ.get('DOCKER_ENV'):
        chrome_options.add_argument('--headless')
    
    chrome_options.add_argument('--no-sandbox')
    chrome_options.add_argument('--disable-dev-shm-usage')
    chrome_options.add_argument('--window-size=1920,1080')
    chrome_options.add_argument('--disable-gpu')
    chrome_options.add_argument('--disable-extensions')
    
    # Diretório temporário único para evitar conflitos
    temp_dir = tempfile.mkdtemp(prefix="chrome_")
    chrome_options.add_argument(f'--user-data-dir={temp_dir}')
    chrome_options.add_argument('--incognito')
    
    return webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=chrome_options)

@pytest.mark.selenium_visual
def test_frontend_homepage_visual():
    driver = create_visual_driver()
    wait = WebDriverWait(driver, 10)
    try:
        print("🌐 Acessando página inicial...")
        driver.get(FRONTEND_URL)
        time.sleep(3)
        print(f"📄 Título da página: '{driver.title}'")
        print(f"📏 Tamanho do conteúdo: {len(driver.page_source)} caracteres")
        
        # No ambiente Docker, não aguarda input
        if not os.environ.get('DOCKER_ENV'):
            input("⏸️  Pressione Enter para continuar...")
        
        assert driver.title != "" or "Vite" in driver.page_source or "React" in driver.page_source
        print("✅ Teste da página inicial passou!")
    finally:
        driver.quit()

@pytest.mark.selenium_visual
def test_user_registration_visual():
    driver = create_visual_driver()
    wait = WebDriverWait(driver, 10)
    try:
        print("📝 Testando cadastro de usuário...")
        driver.get(f"{FRONTEND_URL}/cadastro")
        time.sleep(3)
        print(f"📄 Página de cadastro carregada: '{driver.title}'")
        
        # Aguarda elementos estarem presentes
        nome_input = wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, 'input[type="text"]')))
        email_input = wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, 'input[type="email"]')))
        senha_input = wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, 'input[type="password"]')))
        
        unique_email = f"testuser_{uuid.uuid4().hex[:8]}@mail.com"
        print(f"📧 Email único gerado: {unique_email}")
        
        print("✍️  Preenchendo formulário...")
        nome_input.send_keys("Usuário Selenium")
        email_input.send_keys(unique_email)
        senha_input.send_keys("123456")
        
        # No ambiente Docker, não aguarda input
        if not os.environ.get('DOCKER_ENV'):
            print("⏸️  Pausa para você ver o formulário preenchido...")
            input("Pressione Enter para continuar...")
        
        submit_button = wait.until(EC.element_to_be_clickable((By.CSS_SELECTOR, 'button[type="submit"]')))
        print("🔄 Clicando no botão de cadastro...")
        submit_button.click()
        time.sleep(3)
        
        print("✅ Cadastro realizado!")
        
        # No ambiente Docker, não aguarda input
        if not os.environ.get('DOCKER_ENV'):
            input("Pressione Enter para continuar...")
        
    finally:
        driver.quit()

@pytest.mark.selenium_visual
def test_login_visual():
    driver = create_visual_driver()
    wait = WebDriverWait(driver, 10)
    try:
        print("🔐 Testando login de usuário...")
        driver.get(f"{FRONTEND_URL}/login")
        time.sleep(3)
        print(f"📄 Página de login carregada: '{driver.title}'")
        
        # Aguarda elementos do login
        email_input = wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, 'input[type="email"]')))
        senha_input = wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, 'input[type="password"]')))
        
        # Limpa os campos antes de preencher
        email_input.click()
        email_input.send_keys(Keys.CONTROL + "a")  # Seleciona todo o texto
        email_input.send_keys(Keys.DELETE)  # Deleta o texto selecionado
        # Limpa o campo de senha de forma mais robusta
        senha_input.click()
        senha_input.send_keys(Keys.CONTROL + "a")  # Seleciona todo o texto
        senha_input.send_keys(Keys.DELETE)  # Deleta o texto selecionado
        
        # Use um usuário já existente para o teste visual
        email_input.send_keys("gabrielesteves@outlook.com")
        senha_input.send_keys("123456")
        
        if not os.environ.get('DOCKER_ENV'):
            print("⏸️  Pausa para você ver o formulário de login preenchido...")
            input("Pressione Enter para continuar...")
        
        login_button = wait.until(EC.element_to_be_clickable((By.CSS_SELECTOR, 'button[type="submit"]')))
        print("🔄 Clicando no botão de login...")
        login_button.click()
        time.sleep(3)
        print("✅ Login realizado!")
        if not os.environ.get('DOCKER_ENV'):
            input("Pressione Enter para continuar...")
    finally:
        driver.quit()

@pytest.mark.selenium_visual
def test_busca_itinerario_visual():
    driver = create_visual_driver()
    wait = WebDriverWait(driver, 10)
    try:
        print("🔍 Testando busca de itinerário...")
        # Primeiro, login
        driver.get(f"{FRONTEND_URL}/login")
        time.sleep(3)
        email_input = wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, 'input[type="email"]')))
        senha_input = wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, 'input[type="password"]')))
        
        # Limpa os campos antes de preencher
        email_input.click()
        email_input.send_keys(Keys.CONTROL + "a")  # Seleciona todo o texto
        email_input.send_keys(Keys.DELETE)  # Deleta o texto selecionado
        # Limpa o campo de senha de forma mais robusta
        senha_input.click()
        senha_input.send_keys(Keys.CONTROL + "a")  # Seleciona todo o texto
        senha_input.send_keys(Keys.DELETE)  # Deleta o texto selecionado
        
        email_input.send_keys("gabrielesteves@outlook.com")
        senha_input.send_keys("123456")
        login_button = wait.until(EC.element_to_be_clickable((By.CSS_SELECTOR, 'button[type="submit"]')))
        login_button.click()
        time.sleep(3)
        # Agora, busca itinerário
        driver.get(f"{FRONTEND_URL}/busca-itinerario")
        time.sleep(3)
        buscar_button = wait.until(EC.element_to_be_clickable((By.CSS_SELECTOR, 'button[type="submit"]')))
        if not os.environ.get('DOCKER_ENV'):
            print("⏸️  Pausa para você ver o formulário de busca preenchido...")
            input("Pressione Enter para continuar...")
        print("🔄 Clicando no botão de buscar...")
        buscar_button.click()
        time.sleep(3)
        print("✅ Busca realizada!")
        if not os.environ.get('DOCKER_ENV'):
            input("Pressione Enter para continuar...")
    finally:
        driver.quit()

if __name__ == "__main__":
    print("🚀 Iniciando testes visuais do Selenium...")
    print("💡 Certifique-se de que o frontend está rodando em http://localhost:5173")
    print("🔍 Você verá o navegador abrindo e as ações sendo executadas!")
    test_frontend_homepage_visual()
    test_user_registration_visual()
    test_login_visual()
    test_busca_itinerario_visual() 