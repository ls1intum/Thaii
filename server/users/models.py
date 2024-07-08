from django.db import models

class Whitelist(models.Model):
    email = models.CharField(max_length=50)
    
    def __str__(self):
        return self.email