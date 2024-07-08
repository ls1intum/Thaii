from django.shortcuts import render
from rest_framework import generics
from rest_framework.views import APIView
from .serializers import PageListSerializer, PageSerializer, TagSerializer, PageCreateSerializer
from .models import Page, Tag
from rest_framework.response import Response
from rest_framework import status
from chat.models import Chat
from rest_framework.permissions import IsAuthenticated

# Create your views here.
class PageListView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        try:
            author = self.request.user
            pages = Page.objects.filter(level=0, user=author)
        except Page.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        serializer = PageListSerializer(pages, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    def post(self, request):
        if request.data.get('parent_page_id') is not None:
            level = Page.objects.filter(id=request.data.get('parent_page_id')).values()[0]['level'] + 1 
        else:
            level = 0
        if level > 2:
            return Response("Max level of page depth is 3!", status=status.HTTP_405_METHOD_NOT_ALLOWED)
        data = {
            'label': request.data.get('label'), 
            'parent_page': request.data.get('parent_page_id'), 
            'level': level,
        }
        tags = Tag.objects.filter(id__in=request.data.get('tags'))
        serializer = PageCreateSerializer(data=data)
        if serializer.is_valid():
            page = serializer.save(user=self.request.user)
            page.tags.add(*tags)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class PageDetailView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request, pk):
        try:
            page = Page.objects.get(id=pk)
        except Page.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        serializer = PageSerializer(page)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    def put(self, request, pk, format=None):
        if request.data.get('parent_page_id') is not None:
            level = Page.objects.filter(id=request.data.get('parent_page_id')).values()[0]['level'] + 1 
        else:
            level = 0
        try:
            page = Page.objects.get(id=pk)
        except Page.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        data = {
            'label': request.data.get('label'), 
            'parent_page': request.data.get('parent_page_id'), 
        }
        tags = Tag.objects.filter(id__in=request.data.get('tags'))
        serializer = PageCreateSerializer(page, data=data)
        if serializer.is_valid():
            page = serializer.save(user=self.request.user)
            page.tags.clear()
            page.tags.add(*tags)
            return Response(serializer.data, status=status.HTTP_202_ACCEPTED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk, format=None):
        try:
            page = Page.objects.get(id=pk)
        except Page.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        page.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

class PageListFilterView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        try:
            author = self.request.user
            pages = Page.objects.filter(user=author)
        except Page.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        serializer = PageListSerializer(pages, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
class TagApiView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request, *args, **kwargs):
        author = self.request.user
        tags = Tag.objects.filter(user=author).order_by('label')
        serializer = TagSerializer(tags, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    def post(self, request, *args, **kwargs):
        data = {
            'label': request.data.get('label'), 
            'color': request.data.get('color')
        }
        serializer = TagSerializer(data=data)
        if serializer.is_valid():
            serializer.save(user=self.request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)