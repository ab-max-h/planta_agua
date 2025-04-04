from django.contrib.auth import authenticate, login, logout
from django.http import JsonResponse, HttpResponse
from django.shortcuts import render, redirect
from django.contrib import messages
from .models import Bitacora
from import_export.formats.base_formats import XLSX
from import_export.resources import ModelResource
from tablib import Dataset

import os
from django.conf import settings
from django.shortcuts import render, redirect
from .models import Bitacora
from django.contrib import messages
from tablib import Dataset
from django.shortcuts import render
from .models import Post
# En lugar de Announcement


from django.http import JsonResponse
from .models import Bitacora
from .models import Evento  # Importa el modelo Evento
from django.contrib.auth.decorators import login_required

def datos_bitacora(request):
    datos = list(Bitacora.objects.values('fecha_hora', 'nivel_agua', 'temperatura'))
    return JsonResponse(datos, safe=False)


def importar_excel(request):
    if request.method == 'POST' and request.FILES.get('archivo_excel'):
        archivo = request.FILES['archivo_excel']
        ruta_archivo = os.path.join(settings.MEDIA_ROOT, archivo.name)

        # Guardar el archivo en la carpeta media/
        with open(ruta_archivo, 'wb+') as destino:
            for chunk in archivo.chunks():
                destino.write(chunk)

        messages.success(request, "Archivo importado con éxito.")
        return redirect('nombre_de_tu_vista')

    return render(request, 'datos.html')



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

# views.py (corregido)
def index(request):
    posts = Post.objects.all().order_by('-created_at')  # Obtener posts
    evento = Evento.objects.filter(activo=True).first()  # Obtener evento activo

    if request.method == "POST":
        username = request.POST.get("username")
        password = request.POST.get("password")
        user = authenticate(request, username=username, password=password)
        
        if user is not None:
            login(request, user)
            return redirect('/datos/')
        else:
            # Renderiza con posts incluso en error
            return render(request, "hola/unam.html", {"error": "Credenciales incorrectas", "posts": posts , "evento": evento})
    
    # GET: Renderiza con posts
    return render(request, "hola/unam.html", {"posts": posts , "evento": evento})

@login_required
def datos(request):
    bitacoras = Bitacora.objects.all()  # Obtener todas las bitácoras
    return render(request, "hola/datos.html", {"bitacoras": bitacoras})

def logout_view(request):
    logout(request)
    return JsonResponse({"message": "Logout exitoso"}, status=200)
