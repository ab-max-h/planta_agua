from django.contrib.auth import authenticate, login, logout
from django.http import JsonResponse
from django.urls import reverse
from django.shortcuts import render
import json
from django.contrib.auth import authenticate, login, logout
from django.shortcuts import render, redirect
from django.http import HttpResponse
from django.contrib.auth import authenticate, login
from django.shortcuts import render, redirect
from django.http import HttpResponse
from .models import Bitacora
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
