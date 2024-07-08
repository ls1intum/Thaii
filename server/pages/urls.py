from django.urls import path
from . import views

urlpatterns= [
    path(
        "pages/<int:pk>/",
        views.PageDetailView.as_view(),
        name="update",
    ),
    path("pages/", views.PageListView.as_view(), name="page-list"),
    path("pages/insights/", views.PageListFilterView.as_view(), name="page-list"),
    path("tags/", views.TagApiView.as_view(), name="tag-create")
]