from django.shortcuts import render
from django.contrib.auth.models import User
from .serializers import UserListSerializer, WhitelistListSerializer
from .models import Whitelist
from rest_framework.permissions import AllowAny, IsAdminUser, IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.template.loader import render_to_string
from django.utils.encoding import force_bytes, force_str 
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode 
from .services.token import generate_token
from django.core.mail import EmailMessage, send_mail  
from pages.serializers import PageCreateSerializer
from django.conf import settings
from exchangelib import Credentials, Account, Message, DELEGATE

class CreateUserView(APIView):
    permission_classes = [AllowAny] 
   
    def post(self, request, *args, **kwargs):
        username = request.data['username']
        email = request.data['username']
        password =  request.data['password']
        if User.objects.filter(username=username).exists():
            return Response("Email already registered!", status=status.HTTP_409_CONFLICT)
        try:
            Whitelist.objects.get(email=username)
        except Whitelist.DoesNotExist:
            return Response("Email is not whitelisted! The chair has to whitelist your email before you can register."
                            , status=status.HTTP_406_NOT_ACCEPTABLE)
        try: 
            newUser = User.objects.create_user(username, email, password)
            newUser.is_staff = False
            newUser.is_active = False
            newUser.save()
        except:
            return Response("An error occured while creating user! Please try again later.", status=status.HTTP_400_BAD_REQUEST)
        try: 
            mail_subject = "Activation link has been sent to your email"  
            domain = 'ma-mang.ase.cit.tum.de/register/activate'
            context = {  
                'domain': domain,  
                'uid': urlsafe_base64_encode(force_bytes(newUser.pk)),
                'token': generate_token.make_token(newUser),
            }
            message = render_to_string('account_activation_template.html', context)
            credentials = Credentials(username=settings.EMAIL_HOST_USER, password=settings.EMAIL_HOST_PASSWORD)
            account = Account(settings.DEFAULT_FROM_EMAIL, credentials=credentials, autodiscover=True, access_type=DELEGATE)
            to_email = email
            message = Message(
                account=account,
                folder=account.sent,
                subject=mail_subject,
                body=message,
                to_recipients=[to_email]
            )
            message.send()
            return Response(status=status.HTTP_201_CREATED)
        except Exception as e:
            print(e)
            return Response("Activation email could not be sent. Please contact the chair.", status=status.HTTP_400_BAD_REQUEST)

class ActivateUserView(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request):
        try:
            uidb64 = request.data['uidb64']
            token = request.data['token']        
            uid = force_str(urlsafe_base64_decode(uidb64))  
            user = User.objects.get(pk=uid)  
        except(TypeError, ValueError, OverflowError, User.DoesNotExist):  
            return Response('Activation link is invalid!', status=status.HTTP_406_NOT_ACCEPTABLE)
        if user is not None and generate_token.check_token(user, token):  
            user.is_active = True 
            user.save()
            data = {
                'label': 'Home', 
                'level': 0,
            }
            serializer = PageCreateSerializer(data=data)
            if serializer.is_valid():
                serializer.save(user=user)              
            return Response('Thank you for your email confirmation. Now you can login your account.')  
        else:
            return Response('Activation link is invalid!', status=status.HTTP_406_NOT_ACCEPTABLE)

class UserListView(APIView):
    permission_classes = [IsAdminUser]
    
    def get(self, request):
        try:
            users = User.objects.all()
        except User.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        serializer = UserListSerializer(users, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
class UserDetailView(APIView):
    permission_classes = [IsAdminUser]
    
    def put(self, request, pk, format=None):
        try:
            user = User.objects.get(id=pk)
        except User.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        try: 
            if(user.is_staff != request.data['is_staff']):
                user.is_staff = request.data['is_staff']
                user.save()
            if(user.is_active != request.data['is_active']):
                user.is_active = request.data['is_active']
                user.save()
            return Response(status=status.HTTP_202_ACCEPTED)
        except:     
            return Response("An error occured while updating user! Please try again later.", status=status.HTTP_400_BAD_REQUEST)
        
    
class WhitelistListView(APIView):
    permission_classes = [IsAdminUser]
    
    def get(self, request):
        try:
            emails = Whitelist.objects.all()
        except User.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        serializer = WhitelistListSerializer(emails, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    def post(self, request, *args, **kwargs):
        data = {
            'email': request.data.get('email'), 
        }
        serializer = WhitelistListSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
 
class WhitelistDetailView(APIView):
    permission_classes = [IsAdminUser]
        
    def delete(self, request, pk, format=None):
        try:
            whitelisted_email = Whitelist.objects.get(id=pk)
        except Whitelist.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        whitelisted_email.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    
class AdminDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            author_role = self.request.user.is_staff
        except User.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        return Response(author_role, status=status.HTTP_200_OK)
