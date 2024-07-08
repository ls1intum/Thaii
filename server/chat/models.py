from django.db import models
from django.contrib.auth.models import User
from pages.models import Page
from django.utils import timezone

# Create your models here.
class Label(models.Model):
    label = models.CharField(max_length=100)
    color = models.CharField(max_length=7, default="#DDFFDE")
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="labels")
    
    def __str__(self):
        return self.label

class Chat(models.Model):
    title = models.CharField(max_length=100)
    page = models.ForeignKey(Page, on_delete=models.CASCADE, related_name="chats")
    labels = models.ManyToManyField(Label, blank=True, related_name="chats")
    created_at = models.DateTimeField(auto_now_add=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="chats")

    def __str__(self):
        return self.title
    
    @property
    def since(self):
      return (timezone.now() - self.created_at).days

class Message(models.Model):
    request = models.CharField(max_length=1000)
    response = models.CharField(max_length=10000)
    input_tokens = models.IntegerField(default=200)
    output_tokens = models.IntegerField(default=500)
    chat = models.ForeignKey(Chat, on_delete=models.CASCADE, related_name="messages")
    created_at = models.DateTimeField(auto_now_add=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="messages")
    
    
    def __str__(self):
        return self.request
    
