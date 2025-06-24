from rest_framework import serializers
from .models import Ips

class IpsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ips
        fields = '__all__'