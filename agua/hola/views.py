from django.contrib.auth import authenticate, login, logout
from django.http import JsonResponse, HttpResponse
from django.shortcuts import render, redirect
from django.contrib import messages
from .models import Bitacora
from import_export.formats.base_formats import XLSX
from import_export.resources import ModelResource
from tablib import Dataset




class BitacoraResource(ModelResource):
    class Meta:
        model = Bitacora
    def exportar_bitacora_xlsx(request):
        recurso = BitacoraResource()
        dataset = recurso.export()
    
        response = HttpResponse(dataset.xlsx, content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
        response['Content-Disposition'] = 'attachment; filename="bitacora.xlsx"'
    
        return response


def importar_bitacora_xlsx(request):
    if request.method == "POST":
        archivo = request.FILES.get("archivo_excel")
        if archivo:
            dataset = Dataset()
            dataset.xlsx = archivo.read()
            recurso = BitacoraResource()
            resultado = recurso.import_data(dataset, dry_run=True)  # Prueba antes de importar

            if not resultado.has_errors():
                recurso.import_data(dataset, dry_run=False)  # Importa datos reales
                messages.success(request, "Datos importados correctamente.")
            else:
                messages.error(request, "Error al importar datos. Verifica el archivo.")
    
    return redirect("datos")

def index(request):
    if request.method == "POST":
        username = request.POST.get("username")
        password = request.POST.get("password")
        
        # Verifica las credenciales del usuario
        user = authenticate(request, username=username, password=password)
        
        if user is not None:
            login(request, user)  # Si el usuario es autenticado, inicias sesión
            return redirect('/datos/')  # Mostrar mensaje de bienvenida
        else:
            # En caso de error, muestra un mensaje de error
            return render(request, "hola/unam.html", {"error": "Credenciales incorrectas"})  # Mostrar mensaje de error
    
    # Si no es un POST, solo muestra la página de login
    return render(request, "hola/unam.html")


def datos(request):
    bitacoras = Bitacora.objects.all()  # Obtener todas las bitácoras
    return render(request, "hola/datos.html", {"bitacoras": bitacoras})

def logout_view(request):
    logout(request)
    return JsonResponse({"message": "Logout exitoso"}, status=200)
