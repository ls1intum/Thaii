from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Chat, Message, Label
from pages.models import Page
from pages.serializers import PageSerializer

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "password"]
        extra_kwargs = {"password": {"write_only": True}}

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user

class LabelSerializer(serializers.ModelSerializer):
    class Meta: 
        model = Label
        fields = ["id", "label", "color"]
        extra_kwargs = {"user": {"read_only": True}}

class ChatListSerializer(serializers.ModelSerializer):
    page = PageSerializer()
    
    class Meta: 
        model = Chat
        fields = ["id", "title", "page", "created_at"]
        extra_kwargs = {"user": {"read_only": True}}    

class ChatSerializer(serializers.ModelSerializer):
    page = PageSerializer()
    labels = LabelSerializer(source="labels.all", many=True)
    
    class Meta: 
        model = Chat
        fields = ["id", "title", "page", "labels", "created_at"]
        extra_kwargs = {"user": {"read_only": True}}

class ChatCreateSerializer(serializers.ModelSerializer):
    class Meta: 
        model = Chat
        fields = ["id", "title", "page", "created_at"]
        extra_kwargs = {"user": {"read_only": True}}
        
class MessageSerializer(serializers.ModelSerializer):
    class Meta: 
        model = Message
        fields = ["id", "input_tokens", "output_tokens", "request", "response", "chat", "created_at"]
        extra_kwargs = {"user": {"read_only": True}}