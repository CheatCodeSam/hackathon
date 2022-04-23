import os

from channels.auth import AuthMiddlewareStack
from channels.routing import ProtocolTypeRouter, URLRouter
from django.core.asgi import get_asgi_application
import apps.war.routing

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "devproject.settings")

application = ProtocolTypeRouter(
    {
        "http": get_asgi_application(),
        "websocket": AuthMiddlewareStack(
            URLRouter(apps.war.routing.websocket_urlpatterns)
        ),
    }
)
