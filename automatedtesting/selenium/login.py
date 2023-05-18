# #!/usr/bin/env python
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options as ChromeOptions
from selenium.common.exceptions import NoSuchElementException
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from datetime import datetime

# Start the browser and login with standard_user

def login (user, password):
    print ('Starting the browser...')
    options = ChromeOptions()
    options.add_argument("--headless") 
    options.add_argument("--no-sandbox")
    options.add_argument("--disable-dev-shm-usage")
    driver = webdriver.Chrome(options=options)
    print ('Browser started successfully. Navigating to the demo page to login.')
    driver.get('https://www.saucedemo.com/')
    input_username = driver.find_element(By.ID, 'user-name')
    input_password = driver.find_element(By.ID, 'password')
    btn_login = driver.find_element(By.ID, 'login-button')

    input_username.send_keys(user)
    input_password.send_keys(password)
    btn_login.click()

    product_label = driver.find_element(By.XPATH, "//*[@id='header_container']/div[@class='header_secondary_container']/span[@class='title']")
    assert product_label.text == 'PRODUCTS'

    print('{}: Login with username {} and password {} successfully'.format(datetime.now(), user, password))

    return driver

def add_items_to_cart(driver, total_items):
    print ('Adding items to cart...')
    n_items = 0
    for i in range(total_items):
        try:
            cart_badge = driver.find_element(By.CLASS_NAME, "shopping_cart_badge").text
            n_items = int(cart_badge)
        except NoSuchElementException:
            print("Cart is empty.")


        product_link = driver.find_element(By.ID, "item_" + str(i) + "_title_link")
        product_name = product_link.find_element(By.CLASS_NAME, "inventory_item_name").text
        product_link.click()

        product_name_2 = driver.find_element(By.CLASS_NAME, "inventory_details_name").text
        assert product_name == product_name_2

        add_to_cart_button = driver.find_element(By.CLASS_NAME, "btn_inventory")
        add_to_cart_button.click()

        n_items += 1
        wait = WebDriverWait(driver, 10)
        new_cart_badge = wait.until(EC.text_to_be_present_in_element((By.CLASS_NAME, "shopping_cart_badge"), str(n_items)))

        print('{}: {} added to cart.'.format(datetime.now(), product_name))
        print('Number of items in the cart: {}.'.format(n_items))

        driver.find_element(By.ID, "back-to-products").click()

    print ('{} items added to cart.'.format(n_items))

def remove_items_from_cart(driver, total_items):
    print ('---------------------------')
    print ('Removing items from cart...')
    cart_badge = driver.find_element(By.CLASS_NAME, "shopping_cart_badge").text
    n_items = int(cart_badge)
    for i in range(total_items):
        product_link = driver.find_element(By.ID, "item_" + str(i) + "_title_link")
        product_name = product_link.find_element(By.CLASS_NAME, "inventory_item_name").text
        product_link.click()

        product_name_2 = driver.find_element(By.CLASS_NAME, "inventory_details_name").text
        assert product_name == product_name_2

        remove_button = driver.find_element(By.CLASS_NAME, "btn_inventory")
        remove_button.click()

        n_items -= 1
        wait = WebDriverWait(driver, 10)

        if n_items > 0:
            wait.until(EC.text_to_be_present_in_element((By.CLASS_NAME, "shopping_cart_badge"), str(n_items)))
        else:
            wait.until(EC.invisibility_of_element_located((By.CLASS_NAME, "shopping_cart_badge")))

        print('{}: {} removed from cart.'.format(datetime.now(), product_name))
        print('Number of items in the cart: {}.'.format(n_items))

        driver.find_element(By.ID, "back-to-products").click()


if __name__ == "__main__":
    total_items = 6
    driver = login('standard_user', 'secret_sauce')
    add_items_to_cart(driver, total_items)
    remove_items_from_cart(driver, total_items)
    driver.quit()
