from rest_framework import serializers
from .models import Page, Tag
from chat.models import Chat, Label

class LabelSerializer(serializers.ModelSerializer):
    class Meta: 
        model = Label
        fields = ["id", "label", "color"]
        extra_kwargs = {"user": {"read_only": True}}

class ChatSerializer(serializers.ModelSerializer):
    labels = LabelSerializer(source="labels.all", many=True)
    
    class Meta: 
        model = Chat
        fields = ["id", "title", "page", "labels", "created_at"]
        extra_kwargs = {"user": {"read_only": True}}

class TagSerializer(serializers.ModelSerializer):
    class Meta: 
        model = Tag
        fields = ["id", "label", "color"]
        extra_kwargs = {"user": {"read_only": True}}
        
class SubSubPageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Page
        fields = ('id', 'label', "level", "children", "parent_page", "read_only", "tags")

class SubPageSerializer(serializers.ModelSerializer):
    children = SubSubPageSerializer(source="children.all", many=True)
    tags = TagSerializer(source="tags.all", many=True)

    class Meta:
        model = Page
        fields = ('id', 'label', "level", "children", "parent_page", "read_only", "tags")

class PageListSerializer(serializers.ModelSerializer):
    children = SubPageSerializer(source="children.all", many=True)
    tags = TagSerializer(source="tags.all", many=True)
    
    class Meta: 
        model = Page
        fields = ["id", "label", "level", "children", "parent_page", "read_only", "tags"]
        extra_kwargs = {"user": {"read_only": True}}
        
class PageSerializer(serializers.ModelSerializer):  
    chats = ChatSerializer(source="chats.all", many=True)
    tags = TagSerializer(source="tags.all", many=True)
      
    class Meta: 
        model = Page
        fields = ["id", 'label', "chats", "level", "parent_page", "read_only", "tags", "created_at"]
        extra_kwargs = {"user": {"read_only": True}}
        
class PageCreateSerializer(serializers.ModelSerializer):  
    class Meta: 
        model = Page
        fields = ["id", "label", "level", "parent_page", "tags", "created_at"]
        extra_kwargs = {"user": {"read_only": True}}