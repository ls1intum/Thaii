from django.contrib.auth.models import User
from rest_framework import serializers
from .models import EventLog

class EventLogSerializer(serializers.ModelSerializer):
    class Meta: 
        model = EventLog
        fields = ["id", "location", "created_at"]
        extra_kwargs = {"user": {"read_only": True}}