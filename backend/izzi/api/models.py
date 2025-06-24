from django.db import models

class Ips(models.Model):
    id = models.AutoField(db_column='id', primary_key=True)
    city = models.CharField(max_length=100, blank=False, null=False)
    country = models.CharField(max_length=45, blank=False, null=False)
    country_flag = models.CharField(max_length=255, blank=True, null=False)
    ip = models.CharField(max_length=16, blank=False, null=False)
    latitude = models.CharField(max_length=25, blank=False, null=False)
    longitude = models.CharField(max_length=25, blank=False, null=False)
    type = models.CharField(max_length=25, blank=False, null=False)
    
    class Meta:
        managed = False
        db_table = 'ips'