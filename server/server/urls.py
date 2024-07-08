from django.contrib import admin
from django.urls import path, include
from users.views import CreateUserView, ActivateUserView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path('api/admin/', admin.site.urls),
    path("api/v1/user/register/", CreateUserView.as_view(), name="register"),
    path("api/v1/token/", TokenObtainPairView.as_view(), name="get_token"),
    path("api/v1/token/refresh/", TokenRefreshView.as_view(), name="refresh_token"),
    path("api/v1/user/activate/", ActivateUserView.as_view(), name="activate"),
    path("api/api-auth/", include("rest_framework.urls")),
    path("api/v1/", include("chat.urls")),
    path("api/v1/", include("pages.urls")),
    path("api/v1/", include("users.urls")),
    path("api/v1/", include("insights.urls")),
]
