![Python](https://img.shields.io/badge/Python-3.12-blue?logo=python)
![Django](https://img.shields.io/badge/Django-4.2.19-green?logo=django)
![Django REST](https://img.shields.io/badge/Django%20REST-3.16.0-ff1709?logo=django&logoColor=white&color=ff1709&labelColor=gray)
![JavaScript](https://img.shields.io/badge/JavaScript-yellow?logo=javascript)
![HTML](https://img.shields.io/badge/HTML-orange?logo=html5&logoColor=white)
![CSS](https://img.shields.io/badge/CSS-blue?logo=css3)



# NyShop

This is a very simple e-commerce website built with Django.

## Tech Stack

- **Frontend:** HTML, CSS, JavaScript  
- **Backend:** Django, Django REST, Python  
- **Database:** SQLite

## Features

1. **User Authentication:**  
   Users can create an account, log in, log out, update their profile, and view detailed account information.

2. **Admin Panel:**  
   Administrators have access to a management dashboard where they can add, update, or delete products, as well as manage user profiles.

3. **Book Browsing and Filtering:**  
   Users can browse the list of available books, filter them by genre, and view detailed information about each one.

4. **Book Reviews:**  
   Users can leave reviews for any book.

5. **Shopping Cart:**  
   Users can add books to their shopping cart.

6. **Cart Management:**  
   Users can remove items from their cart at any time if they change their mind.

7. **Order Placement:**  
   After finalizing their cart, users can place an order.

## Installation

Follow the steps below to get the project up and running on your local machine.

### Clone the Repository

```bash
git clone https://github.com/bobi759/Shop.git
cd Shop
python3 -m venv .venv
```
## For Windows
```bash
env\Scripts\activate
pip install -r requirements.txt
```
If conflict occur, run
```bash
python manage.py makemigrations
python manage.py migrate
```
Run local server
```bash
python manage.py runserver
```


## User Login
You can use already created account with the following credentials
```bash
Username : Ivanov@gmail.com
Password : SecurePass123
```
