from django.urls import path
from . import views

urlpatterns= [
    path(
        "users/",
        views.UserListView.as_view(),
        name="list_users",
    ),
    path("users/<int:pk>/", views.UserDetailView.as_view()),
    path("users/whitelist/", views.WhitelistListView.as_view(), name="whitelisted_users"),
    path("users/whitelist/<int:pk>/", views.WhitelistDetailView.as_view(), name="whitelisted_users"),
    path("users/permissions/", views.AdminDetailView.as_view()),
]