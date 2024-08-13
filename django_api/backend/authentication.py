from django.contrib.auth.models import User
from rest_framework import authentication
from rest_framework import exceptions

class CustomUserAuthentication(authentication.BaseAuthentication):
    def authenticate(self, request):
        username = request.META.get('HTTP_X_USERNAME')
        password = request.META.get('HTTP_X_PASSWORD')

        if not username or not password:
            return None

        try:
            user = User.objects.get(username=username)
            if user.check_password(password):
                return (user, None)
        except User.DoesNotExist:
            raise exceptions.AuthenticationFailed('No such user')

        raise exceptions.AuthenticationFailed('Incorrect password')