from django.urls import path
from .views import github_webhook, push_history

urlpatterns = [
    path('github/', github_webhook),
    path('history/', push_history),
]
