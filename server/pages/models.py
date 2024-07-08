from django.db import models
from django.contrib.auth.models import User

# Create your models here.
class Tag(models.Model):
    label = models.CharField(max_length=100)
    color = models.CharField(max_length=7, default="#DDFFDE")
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="tags")
    
    def __str__(self):
        return self.label

class Page(models.Model):
    label = models.CharField(max_length=100)
    parent_page = models.ForeignKey('self', on_delete=models.CASCADE, related_name="children", blank=True, null=True)
    tags = models.ManyToManyField(Tag, blank=True, related_name="pages")
    level = models.IntegerField(default=0)
    read_only = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="pages")

    def __str__(self):
        return self.label
    
