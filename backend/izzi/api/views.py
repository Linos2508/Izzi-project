from django.views.decorators.csrf import csrf_exempt
from django.http.response import JsonResponse
from .serializers import IpsSerializer
from django.db import connection
from django.db.models import Q
from .models import Ips
import requests
import json
import os

@csrf_exempt
def ips(request):
    if request.method == 'POST':
        return checkIp(request)
    elif request.method == 'GET':
        return getIpsList(request)
    elif request.method == 'DELETE':
        return deleteIp(request)
    return JsonResponse({'message': 'Method not allowed'}, status=405)

def checkIp(request):
    try:
        data = json.loads(request.body)
        ip = data['ip']
        if ip == None:
            raise Exception
    except Exception as e:
        return JsonResponse({'message': 'missing parameters'}, status=400)
    try:
        ipExists = Ips.objects.get(ip=ip)
    except Ips.DoesNotExist:
        ipExists = None
    if not ipExists:
        apiKey = os.getenv('API_KEY')
        url = 'http://api.ipstack.com/{}?access_key={}'.format(ip,apiKey)
        ipInfoResponse = requests.request("GET", url)
        try:
            ipInfoResponse = ipInfoResponse.json()
        except Exception as e:
            return JsonResponse({'message': e}, status=500)
        newIp = {
            "city": ipInfoResponse['city'],
            "country": ipInfoResponse['country_name'],
            "country_flag": ipInfoResponse['location']['country_flag'],
            "ip": ip,
            "latitude": ipInfoResponse['latitude'],
            "longitude": ipInfoResponse['longitude'],
            "type": ipInfoResponse['type'],
        }
        serializer = IpsSerializer(data=newIp, many=False)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse({'message': 'Success', 'data': newIp})
    else:
        return JsonResponse({'message': 'ip already exists'}, status=400)

def getIpsList(request):
    order = request.GET.get('orderBy', 'id')
    search = request.GET.get('search', '')
    results = Ips.objects.filter(
        Q(city__icontains=search) 
        | Q(country__icontains=search) 
        | Q(country_flag__icontains=search)
        | Q(ip__icontains=search)
        | Q(latitude__icontains=search)
        | Q(longitude__icontains=search)
    ).order_by(order)
    return JsonResponse({
        'data': list(results.values()),
    }, safe=False)

def deleteIp(request):
    try:
        ipId = request.GET.get('ip')
        if ipId == None or ipId == '':
            raise Exception
    except:
        return JsonResponse({'message': 'missing parameters'}, status=400)
    Ips.objects.filter(pk=ipId).delete()
    return JsonResponse({'success': True, 'message': 'Data deleted successfully'})