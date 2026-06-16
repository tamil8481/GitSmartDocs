from django.contrib import admin
from django.urls import path, include
from rest_framework.response import Response
from rest_framework.decorators import api_view


@api_view(['GET'])
def root_view(request):
    return Response({
        "status": "ok",
        "message": "GitSmart Docs Backend API",
        "api_docs": "http://localhost:8000/api/webhook/"
    })


urlpatterns = [
    path('', root_view),
    path('admin/', admin.site.urls),
    path('api/webhook/', include('webhook.urls')),
]
