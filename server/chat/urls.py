from django.urls import path
from . import views

urlpatterns= [
    path("chats/", views.ChatListView.as_view(), name="chat-list"),
    path("chats/count/", views.ChatCountDetailView.as_view(), name="chat-count"),
    path(
        "chats/<int:pk>/",
        views.ChatDetailView.as_view(),
        name="update",
    ),
     path(
        "chats/page/<int:fk>/",
        views.ChatByPageDetailView.as_view(),
        name="chats",
    ),
    path("messages/<int:fk>/", views.MessageDetailView.as_view(), name="message"),
    path("labels/", views.LabelApiView.as_view(), name="label-create"),
    path("labels/<int:pk>/", views.LabelApiView.as_view(), name="label-delete")
]