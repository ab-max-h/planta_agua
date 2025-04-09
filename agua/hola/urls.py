from django.contrib import admin
from django.urls import path
from hola import views  # Importamos las vistas de tu app "hola"
from .views import datos_bitacora, cerrar_sesion

urlpatterns = [
    path("admin/", admin.site.urls),  
    path("", views.index, name="index"),  # Página principal # Login
    path("logout/", views.logout_view, name="logout"),
    path("datos/", views.datos, name="datos"),  # Logout
    path("exportar-excel/", views.exportar_bitacora_xlsx, name="exportar_excel"),
    path("importar-excel/", views.importar_bitacora_xlsx, name="importar_excel"),
    path('api/datos-bitacora/', datos_bitacora, name='api-datos-bitacora'),
    
]
