from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework import generics
from rest_framework.views import APIView
from .serializers import UserSerializer, ChatSerializer, MessageSerializer, ChatCreateSerializer, ChatListSerializer, LabelSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import Chat, Message, Label
from .services.openai import generate_response 
from rest_framework.response import Response
from rest_framework import status

class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

class ChatListView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        author = self.request.user
        limit = request.GET.get('limit')
        if limit is not None:
            limit = int(limit)
        else:
            limit = 5             
        chats = Chat.objects.filter(user=author).order_by('-created_at')[:limit]
        serializer = ChatListSerializer(chats, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    def post(self, request, *args, **kwargs):
        data = {
            'title': request.data.get('title'), 
            'page': request.data.get('page'), 
        }
        labels = Label.objects.filter(id__in=request.data.get('labels'))
        serializer = ChatCreateSerializer(data=data)
        if serializer.is_valid():
            chat = serializer.save(user=self.request.user)
            chat.labels.add(*labels)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)   

class ChatDetailView(APIView):
    permission_classes = [IsAuthenticated] 
    
    def get(self, request, pk):
        try:
            chat = Chat.objects.get(id=pk)
        except Chat.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        serializer = ChatSerializer(chat)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    def put(self, request, pk, format=None):
        try:
            chat = Chat.objects.get(id=pk)
        except Chat.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        data = {
            'title': request.data.get('title'), 
            'page': request.data.get('page'), 
        }
        labels = Label.objects.filter(id__in=request.data.get('labels'))
        serializer = ChatCreateSerializer(chat, data=data)
        if serializer.is_valid():
            newChat = serializer.save(user=self.request.user)
            newChat.labels.clear()
            newChat.labels.add(*labels)
            return Response(serializer.data, status=status.HTTP_202_ACCEPTED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk, format=None):
        try:
            chat = Chat.objects.get(id=pk)
        except Chat.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        chat.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    
class MessageDetailView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request, fk):
        try:
            message = Message.objects.filter(chat=fk)
        except Message.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        serializer = MessageSerializer(message, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    def post(self, request, fk, *args, **kwargs):
        try:
            response = generate_response(request.data.get('request'))
        except Message.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        data = {
            'request': request.data.get('request'),
            'response': response.choices[0].message.content,  
            'input_tokens': response.usage.prompt_tokens,
            'output_tokens': response.usage.completion_tokens,
            'chat': fk,
        }
        serializer = MessageSerializer(data=data)
        if serializer.is_valid():
            serializer.save(user=self.request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)   

class LabelApiView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request, *args, **kwargs):
        author = self.request.user
        labels = Label.objects.filter(user=author).order_by('label')
        serializer = LabelSerializer(labels, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    def post(self, request, *args, **kwargs):
        data = {
            'label': request.data.get('label'), 
            'color': request.data.get('color')
        }
        serializer = LabelSerializer(data=data)
        if serializer.is_valid():
            serializer.save(user=self.request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def delete(self, request, pk, format=None):
        try:
            label = Label.objects.get(id=pk)
        except Label.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        label.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
           
class ChatByPageDetailView(APIView):
    permission_classes = [IsAuthenticated] 
    
    def get(self, request, fk):
        try:
            author = self.request.user
            chats = Chat.objects.filter(page=fk, user=author)
        except Chat.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        serializer = ChatSerializer(chats, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
class ChatCountDetailView(APIView):
    permission_classes = [IsAuthenticated] 
    
    def get(self, request):
        try:
            author = self.request.user
            chatCount = Chat.objects.filter(user=author).count()
        except Chat.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        return Response(chatCount, status=status.HTTP_200_OK)