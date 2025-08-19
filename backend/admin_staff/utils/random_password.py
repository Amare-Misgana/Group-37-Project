from django.utils.crypto import get_random_string


def random_password(
    length=8,
    add_upper_cases=False,
    add_lower_cases=True,
    add_numbers=False,
    add_symbols=False,
):
    upper_letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    lower_letters = "abcdefghijklmnopqrstuvwxyz"
    numbers = "1234567890"
    symbols = "./?@!$%*(+=-_)}{"
    password_allowed_characters = ""

    if add_upper_cases:
        password_allowed_characters += upper_letters
    if add_lower_cases:
        password_allowed_characters += lower_letters
    if add_numbers:
        password_allowed_characters += numbers
    if add_symbols:
        password_allowed_characters += symbols

    return get_random_string(length, allowed_chars=password_allowed_characters)
