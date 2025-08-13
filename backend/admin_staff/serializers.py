from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth import authenticate
from rest_framework import exceptions


class EmailBasedTokenObtainPairSerializer(TokenObtainPairSerializer):
    username_field = "email"

    def validate(self, attrs):
        email = attrs.get("email")
        password = attrs.get("password")

        user = authenticate(email=email, password=password)
        if not user:
            raise exceptions.AuthenticationFailed("Invalid email or password.")

        if not user.is_active:
            raise exceptions.AuthenticationFailed("Account is inactive")

        data = super().validate(attrs)

        return data


