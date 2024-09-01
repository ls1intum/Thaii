from django.contrib import admin
from .models import Chat, Message, Label
from django.contrib.auth.models import User
import csv
from django.http import HttpResponse
from django.contrib import admin

def export_as_csv(modeladmin, request, queryset):
    meta = modeladmin.model._meta
    field_names = [field.name for field in meta.fields]

    response = HttpResponse(content_type='text/csv')
    response['Content-Disposition'] = 'attachment; filename={}.csv'.format(meta)
    writer = csv.writer(response)

    writer.writerow(field_names)
    for obj in queryset:
        row = []
        for field in field_names:
            value = getattr(obj, field)
            if isinstance(value, User):  # Check if the field is a User instance
                value = value.id  # Replace the value with the user's ID
            row.append(value)
        writer.writerow(row)

    return response

export_as_csv.short_description = "Export Selected as CSV"

class ModelsChatActions(admin.ModelAdmin):
    list_display = [field.name for field in Chat._meta.fields]
    actions = [export_as_csv]
    search_fields = [field.name for field in Chat._meta.fields if field.name != 'id']  
    list_filter = [field.name for field in Chat._meta.fields if field.get_internal_type() in ('CharField', 'BooleanField', 'DateField', 'DateTimeField', 'ForeignKey', 'IntegerField')] 
    
class ModelsMessagesActions(admin.ModelAdmin):
    list_display = [field.name for field in Message._meta.fields]
    actions = [export_as_csv]
    search_fields = [field.name for field in Message._meta.fields if field.name != 'id']  
    list_filter = [field.name for field in Message._meta.fields if field.get_internal_type() in ('CharField', 'BooleanField', 'DateField', 'DateTimeField', 'ForeignKey', 'IntegerField')] 
    
class ModelsLabelsActions(admin.ModelAdmin):
    list_display = [field.name for field in Label._meta.fields]
    actions = [export_as_csv]
    search_fields = [field.name for field in Label._meta.fields if field.name != 'id']  
    list_filter = [field.name for field in Label._meta.fields if field.get_internal_type() in ('CharField', 'BooleanField', 'DateField', 'DateTimeField', 'ForeignKey', 'IntegerField')] 

# Register your models here.
admin.site.register(Chat, ModelsChatActions)
admin.site.register(Message, ModelsMessagesActions)
admin.site.register(Label, ModelsLabelsActions)
