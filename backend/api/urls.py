from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TodoViewSet, NoteListCreate, NoteDelete

router = DefaultRouter()
router.register(r'todos', TodoViewSet)

urlpatterns = [
    path("notes/", NoteListCreate.as_view(), name="note-list"),
    path("notes/delete/<int:pk>/", NoteDelete.as_view(), name="delete-note"),
    path('', include(router.urls)),
]
