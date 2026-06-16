from django.urls import path
from .views import github_webhook, push_history, set_template, get_template
from .auth_views import register, login

urlpatterns = [
    path('github/', github_webhook),
    path('history/', push_history),
    path('template/', set_template),
    path('template/get/', get_template),
    path('auth/register/', register),
    path('auth/login/', login),
]
