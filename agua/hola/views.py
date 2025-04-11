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
from .models import Portada

from django.contrib.auth import logout
from django.shortcuts import redirect

from django.contrib.auth import logout
from django.http import JsonResponse
from django.views.decorators.http import require_POST
from django.views.decorators.csrf import csrf_exempt  
from .models import Galeria


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
    portada_activa = Portada.objects.filter(activa=True).last() 
    galeria = Galeria.objects.filter(activo=True).order_by('-fecha_publicacion')[:12]  # <- Aquí está lo nuevo

    if request.method == "POST":
        username = request.POST.get("username")
        password = request.POST.get("password")
        user = authenticate(request, username=username, password=password)
        
        if user is not None:
            login(request, user)
            return redirect('/datos/')
        else:
            # Renderiza con posts incluso en error
            return render(request, "hola/unam.html", {"error": "Credenciales incorrectas", "posts": posts , "evento": evento, "portada_activa": portada_activa,"galeria": galeria  })
    
    # GET: Renderiza con posts
    return render(request, "hola/unam.html", {"posts": posts , "evento": evento, "portada_activa": portada_activa,"galeria": galeria })

@login_required
def datos(request):
    bitacoras = Bitacora.objects.all()  # Obtener todas las bitácoras
    return render(request, "hola/datos.html", {"bitacoras": bitacoras})

@require_POST  # Asegura que solo se acepten peticiones POST
def logout_view(request):
    if request.user.is_authenticated:
        logout(request)  # Cierra la sesión
        return JsonResponse(
            {"success": True, "message": "Sesión cerrada con éxito"}, 
            status=200
        )
    else:
        return JsonResponse(
            {"success": False, "message": "No hay sesión activa"}, 
            status=400
        )