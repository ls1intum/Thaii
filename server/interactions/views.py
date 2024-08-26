import pandas as pd
from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from .models import EventLog
from .serializers import EventLogSerializer
from rest_framework.response import Response
from django.http import HttpResponse
from rest_framework import status

class EventLogView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request, *args, **kwargs):
        user = self.request.user
        user_data = EventLog.objects.filter(user=user).values()

        # Convert the data to a pandas DataFrame
        df = pd.DataFrame(list(user_data))

        # Create an Excel file in memory
        response = HttpResponse(content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
        response['Content-Disposition'] = f'attachment; filename={user.username}_data.xlsx'

        with pd.ExcelWriter(response, engine='openpyxl') as writer:
            df.to_excel(writer, index=False, sheet_name='UserData')
    
        return Response(response, status=status.HTTP_200_OK)
    
    def post(self, request, *args, **kwargs):
        try:
            data = {
                'location': request.data.get('location'), 
            }
        except Exception:
            return Response(status=status.HTTP_400_BAD_REQUEST)
        serializer = EventLogSerializer(data=data)
        if serializer.is_valid():
            serializer.save(user=self.request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)   