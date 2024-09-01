from django.urls import path
from . import views

urlpatterns = [
    path('event-logs/', views.EventLogView.as_view(), name='event_log'),
]
