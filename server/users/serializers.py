from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Whitelist


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "password"]
        extra_kwargs = {"password": {"write_only": True}}

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user

class UserListSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "is_active", "is_staff", "date_joined"]
        
class WhitelistListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Whitelist
        fields = ["id", "email"]