from django.contrib.auth import authenticate, login, logout
from django.http import JsonResponse, HttpResponse
from django.shortcuts import render, redirect
from django.contrib import messages
from .models import Bitacora, Post, Evento, Portada, Galeria
from .resources import BitacoraResource  # ✅ Ahora se importa desde el archivo correcto
from import_export.formats.base_formats import XLSX
from tablib import Dataset
from django.contrib.auth.decorators import login_required
from django.views.decorators.http import require_POST
from django.views.decorators.csrf import csrf_exempt
import os
from django.conf import settings
from django.http import JsonResponse
from django.views.decorators.http import require_POST
from .models import Bitacora
import json
from django.shortcuts import render
from .models import Bitacora
from django.db.models.functions import ExtractYear, ExtractMonth
from django.shortcuts import render
from .models import Bitacora
from django.db.models.functions import ExtractYear, ExtractMonth
from django.http import JsonResponse

def bitacora_view(request):
    # Obtener parámetros de filtro
    year = request.GET.get('year')
    month = request.GET.get('month')
    
    # Consulta base
    registros = Bitacora.objects.all().order_by('-fecha')
    
    # Aplicar filtros
    if year:
        registros = registros.filter(fecha__year=year)
    if month:
        registros = registros.filter(fecha__month=month)
    
    # Obtener años y meses disponibles (para los selectores)
    years = Bitacora.objects.annotate(
        year=ExtractYear('fecha')
    ).values_list('year', flat=True).distinct().order_by('-year')
    
    months = Bitacora.objects.annotate(
        month=ExtractMonth('fecha')
    ).values_list('month', flat=True).distinct().order_by('month')
    
    # Si es una petición AJAX, devolver JSON
    if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
        data = {
            'registros': list(registros.values(
                'fecha', 'vol_g', 'vol_agregado_m3', 'v_total_m3', 'id'
            )),
            'years': list(years),
            'months': list(months)
        }
        return JsonResponse(data)
    
    # Para peticiones normales, renderizar plantilla
    context = {
        'bitacoras': registros,
        'years': years,
        'months': months,
    }
    return render(request, 'hola/datos.html', context)
@require_POST
def agregar_registro(request):
    try:
        data = json.loads(request.body)
        Bitacora.objects.create(
            fecha=data['fecha'],
            vol_g=float(data['vol_g']),
            vol_agregado_m3=float(data['vol_agregado']),
            v_total_m3=float(data['vol_total'])
        )
        return JsonResponse({'success': True})
    except Exception as e:
        return JsonResponse({'success': False, 'error': str(e)}, status=400)
def datos_bitacora(request):
    datos = list(Bitacora.objects.values('fecha', 'vol_g', 'vol_agregado_m3', 'v_total_m3'))
    return JsonResponse(datos, safe=False)

def importar_excel(request):
    if request.method == 'POST' and request.FILES.get('archivo_excel'):
        archivo = request.FILES['archivo_excel']
        ruta_archivo = os.path.join(settings.MEDIA_ROOT, archivo.name)
        with open(ruta_archivo, 'wb+') as destino:
            for chunk in archivo.chunks():
                destino.write(chunk)

        messages.success(request, "Archivo importado con éxito.")
        return redirect('datos')

    return render(request, 'datos.html')

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
            resultado = recurso.import_data(dataset, dry_run=True)

            if not resultado.has_errors():
                recurso.import_data(dataset, dry_run=False)
                messages.success(request, "Datos importados correctamente.")
            else:
                messages.error(request, "Error al importar datos. Verifica el archivo.")
    
    return redirect("datos")

def index(request):
    posts = Post.objects.all().order_by('-created_at')
    evento = Evento.objects.filter(activo=True).first()
    portada_activa = Portada.objects.filter(activa=True).last()
    galeria = Galeria.objects.filter(activo=True).order_by('-fecha_publicacion')[:12]

    if request.method == "POST":
        username = request.POST.get("username")
        password = request.POST.get("password")
        user = authenticate(request, username=username, password=password)
        
        if user is not None:
            login(request, user)
            return redirect('/datos/')
        else:
            return render(request, "hola/unam.html", {
                "error": "Credenciales incorrectas",
                "posts": posts,
                "evento": evento,
                "portada_activa": portada_activa,
                "galeria": galeria
            })
    
    return render(request, "hola/unam.html", {
        "posts": posts,
        "evento": evento,
        "portada_activa": portada_activa,
        "galeria": galeria
    })

@login_required
def datos(request):
    bitacoras = Bitacora.objects.all()
    return render(request, "hola/datos.html", {"bitacoras": bitacoras})

@require_POST
def logout_view(request):
    if request.user.is_authenticated:
        logout(request)
        return JsonResponse({"success": True, "message": "Sesión cerrada con éxito"}, status=200)
    else:
        return JsonResponse({"success": False, "message": "No hay sesión activa"}, status=400)
