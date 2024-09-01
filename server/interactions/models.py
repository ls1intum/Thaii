from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone

class EventLog(models.Model):
    location = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="eventlogs")
    
    def __str__(self):
        return self.location