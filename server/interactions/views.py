import pandas as pd
from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from chat.models import Message, Chat
from .models import EventLog
from .serializers import EventLogSerializer
from rest_framework.response import Response
from django.http import HttpResponse
from rest_framework import status

class EventLogView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request, *args, **kwargs):
        user = self.request.user
        interaction_data = EventLog.objects.filter(user=user).values()
        chat_data = Message.objects.filter(user=user).values('id', 'request', 'response', 'chat__title', 'chat__page__label', 'created_at')   

        # Convert the data to a pandas DataFrame
        interaction_df = pd.DataFrame(list(interaction_data))
        interaction_df['created_at'] = interaction_df['created_at'].astype(str)
        
        chat_df = pd.DataFrame(list(chat_data))
        chat_df['created_at'] = chat_df['created_at'].astype(str)

        # Create an Excel file in memory
        response = HttpResponse(content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
        response['Content-Disposition'] = f'attachment; filename={user.username}_data.xlsx'

        with pd.ExcelWriter(response, engine='openpyxl') as writer:
            chat_df.to_excel(writer, index=False, sheet_name='ChatData')
            interaction_df.to_excel(writer, index=False, sheet_name='InteractionData')
    
        return response
    
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