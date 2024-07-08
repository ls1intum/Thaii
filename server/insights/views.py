from django.shortcuts import render
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from chat.models import Chat, Message, Label
from pages.models import Page, Tag
from django.db.models import DateField, Count, Q, Sum, F, Value, CharField, Avg, DurationField
from django.db.models.functions import Cast, Concat
from .services.arrayMerge import mergeByDate
from .services.keywordAnalyzer import handle_array_keyword
from .services.commonWordAnalyzer import handle_array_common_word
from .services.filterGenerator import generateIncludeFilter, generateExcludeFilter
from django.utils.timezone import now, timedelta
from django.db.models.functions import TruncDate, TruncMonth, TruncYear
from django.utils.dateparse import parse_datetime
from django.db.models import OuterRef, Subquery
from datetime import date
import datetime
from django.contrib.postgres.aggregates import StringAgg

now_ = now()

class TotalChatsView(APIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request, *args, **kwargs):
        author = self.request.user
        pages = request.data.get('pages')
        tags = request.data.get('tags')
        labels = request.data.get('labels')
        dateRange = request.data.get('dateRange')
        includeUnlabeled = request.data.get('includeUnlabeled')
        includeUntagged = request.data.get('includeUntagged')
        includeFilters = generateIncludeFilter(author, pages, labels, tags, includeUnlabeled, includeUntagged, "chat")
        excludeFilters = generateExcludeFilter(includeUnlabeled, includeUntagged, "chat")
        try:
            if(dateRange is None):
                totalChats = Chat.objects.filter(includeFilters).exclude(excludeFilters).distinct().count()
            else:
                startDate = parse_datetime(str(dateRange[0]))
                endDate = parse_datetime(str(dateRange[1]))
                newEndDate = endDate + datetime.timedelta(days=1)
                totalChats = Chat.objects.filter(includeFilters, created_at__range=[startDate, newEndDate]).exclude(excludeFilters).distinct().count()

        except Chat.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        return Response(totalChats, status=status.HTTP_200_OK)

class TotalMessagesView(APIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request, *args, **kwargs):
        author = self.request.user
        pages = request.data.get('pages')
        tags = request.data.get('tags')
        labels = request.data.get('labels')
        dateRange = request.data.get('dateRange')
        includeUnlabeled = request.data.get('includeUnlabeled')
        includeUntagged = request.data.get('includeUntagged')
        includeFilters = generateIncludeFilter(author, pages, labels, tags, includeUnlabeled, includeUntagged, "message")
        excludeFilters = generateExcludeFilter(includeUnlabeled, includeUntagged, "message")
        try:
            if(dateRange is None):
                totalMessages = Message.objects.filter(includeFilters).exclude(excludeFilters).distinct().count()
            else:
                startDate = parse_datetime(str(dateRange[0]))
                endDate = parse_datetime(str(dateRange[1]))
                newEndDate = endDate + datetime.timedelta(days=1)
                totalMessages = Message.objects.filter(includeFilters, created_at__range=[startDate, newEndDate]).exclude(excludeFilters).distinct().count()
        except Message.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        return Response(totalMessages, status=status.HTTP_200_OK)

class AverageConversationTimeView(APIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request, *args, **kwargs):
        author = self.request.user
        pages = request.data.get('pages')
        tags = request.data.get('tags')
        labels = request.data.get('labels')
        dateRange = request.data.get('dateRange')
        includeUnlabeled = request.data.get('includeUnlabeled')
        includeUntagged = request.data.get('includeUntagged')
        includeFilters = generateIncludeFilter(author, pages, labels, tags, includeUnlabeled, includeUntagged, "chat")
        excludeFilters = generateExcludeFilter(includeUnlabeled, includeUntagged, "chat")
        try:
            if(dateRange is None):
                newestMessage = Message.objects.filter(chat=OuterRef('pk')).values("created_at").order_by('-created_at')[:1]
                oldestMessage = Message.objects.filter(chat=OuterRef('pk')).values("created_at").order_by('created_at')[:1]
                totalChatsMessages = Chat.objects.filter(includeFilters).exclude(excludeFilters).annotate(conversation_duration=(Subquery(newestMessage.values('created_at'))-Subquery(oldestMessage.values('created_at')))).values("conversation_duration")
            else:
                startDate = parse_datetime(str(dateRange[0]))
                endDate = parse_datetime(str(dateRange[1]))
                newEndDate = endDate + datetime.timedelta(days=1)
                newestMessage = Message.objects.filter(chat=OuterRef('pk'), created_at__range=[startDate, newEndDate]).values("created_at").order_by('-created_at')[:1]
                oldestMessage = Message.objects.filter(chat=OuterRef('pk'), created_at__range=[startDate, newEndDate]).values("created_at").order_by('created_at')[:1]
                totalChatsMessages = Chat.objects.filter(includeFilters).exclude(excludeFilters).annotate(conversation_duration=(Subquery(newestMessage.values('created_at'))-Subquery(oldestMessage.values('created_at')))).values("conversation_duration")
        except Chat.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        if(len(totalChatsMessages) > 0):
            averageConversationTime =  (sum((c["conversation_duration"] if c["conversation_duration"] is not None else datetime.timedelta(seconds=0) for c in totalChatsMessages.values()), timedelta())/3600)/len(totalChatsMessages)
        else: 
            averageConversationTime = 0
        return Response(averageConversationTime, status=status.HTTP_200_OK)
    
class AverageConversationTimeByItemView(APIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request, item, *args, **kwargs):
        author = self.request.user
        pages = request.data.get('pages')
        tags = request.data.get('tags')
        labels = request.data.get('labels')
        dateRange = request.data.get('dateRange')
        includeUnlabeled = request.data.get('includeUnlabeled')
        includeUntagged = request.data.get('includeUntagged')
        includeFilters = generateIncludeFilter(author, pages, labels, tags, includeUnlabeled, includeUntagged, "chat")
        excludeFilters = generateExcludeFilter(includeUnlabeled, includeUntagged, "chat")
        try:
            if(dateRange is None): 
                newestMessage = Message.objects.filter(chat=OuterRef('pk')).values("created_at").order_by('-created_at')[:1]
                oldestMessage = Message.objects.filter(chat=OuterRef('pk')).values("created_at").order_by('created_at')[:1]
                if(item == 0):
                    totalChatsMessages = Chat.objects.filter(includeFilters).exclude(excludeFilters).annotate(conversation_duration=(Subquery(newestMessage.values('created_at'))-Subquery(oldestMessage.values('created_at')))).values(object_label=F("page__label")).order_by("object_label").annotate(avg_conv_duration_sec = Avg("conversation_duration")).annotate(avg_conv_duration=Cast(F('avg_conv_duration_sec')/3600, output_field=DurationField())).order_by("-avg_conv_duration")[:10]
                if(item == 1):
                    totalChatsMessages = Chat.objects.filter(includeFilters).exclude(excludeFilters).annotate(conversation_duration=(Subquery(newestMessage.values('created_at'))-Subquery(oldestMessage.values('created_at')))).values(object_label=F("labels__label")).order_by("object_label").annotate(avg_conv_duration_sec = Avg("conversation_duration")).annotate(avg_conv_duration=Cast(F('avg_conv_duration_sec')/3600, output_field=DurationField())).order_by("-avg_conv_duration")[:10]
                if(item == 2):
                    totalChatsMessages = Chat.objects.filter(includeFilters).exclude(excludeFilters).annotate(conversation_duration=(Subquery(newestMessage.values('created_at'))-Subquery(oldestMessage.values('created_at')))).values(object_label=F("page__tags__label")).order_by("object_label").annotate(avg_conv_duration_sec = Avg("conversation_duration")).annotate(avg_conv_duration=Cast(F('avg_conv_duration_sec')/3600, output_field=DurationField())).order_by("-avg_conv_duration")[:10]
            else:
                startDate = parse_datetime(str(dateRange[0]))
                endDate = parse_datetime(str(dateRange[1]))
                newEndDate = endDate + datetime.timedelta(days=1)
                newestMessage = Message.objects.filter(chat=OuterRef('pk'), created_at__range=[startDate, newEndDate]).values("created_at").order_by('-created_at')[:1]
                oldestMessage = Message.objects.filter(chat=OuterRef('pk'), created_at__range=[startDate, newEndDate]).values("created_at").order_by('created_at')[:1]
                if(item == 0):
                    totalChatsMessages = Chat.objects.filter(includeFilters).exclude(excludeFilters).annotate(conversation_duration=(Subquery(newestMessage.values('created_at'))-Subquery(oldestMessage.values('created_at')))).values(object_label=F("page__label")).order_by("object_label").annotate(avg_conv_duration_sec = Avg("conversation_duration")).annotate(avg_conv_duration=Cast(F('avg_conv_duration_sec')/3600, output_field=DurationField())).order_by("-avg_conv_duration")[:10]
                if(item == 1):
                    totalChatsMessages = Chat.objects.filter(includeFilters).exclude(excludeFilters).annotate(conversation_duration=(Subquery(newestMessage.values('created_at'))-Subquery(oldestMessage.values('created_at')))).values(object_label=F("labels__label")).order_by("object_label").annotate(avg_conv_duration_sec = Avg("conversation_duration")).annotate(avg_conv_duration=Cast(F('avg_conv_duration_sec')/3600, output_field=DurationField())).order_by("-avg_conv_duration")[:10]
                if(item == 2):
                    totalChatsMessages = Chat.objects.filter(includeFilters).exclude(excludeFilters).annotate(conversation_duration=(Subquery(newestMessage.values('created_at'))-Subquery(oldestMessage.values('created_at')))).values(object_label=F("page__tags__label")).order_by("object_label").annotate(avg_conv_duration_sec = Avg("conversation_duration")).annotate(avg_conv_duration=Cast(F('avg_conv_duration_sec')/3600, output_field=DurationField())).order_by("-avg_conv_duration")[:10]
        except Chat.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        return Response(totalChatsMessages, status=status.HTTP_200_OK)
    
class TotalChatsAndMessagesByDateView(APIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request, filter,  *args, **kwargs):
        author = self.request.user
        pages = request.data.get('pages')
        tags = request.data.get('tags')
        labels = request.data.get('labels')
        dateRange = request.data.get('dateRange')
        includeUnlabeled = request.data.get('includeUnlabeled')
        includeUntagged = request.data.get('includeUntagged')
        includeFiltersChat = generateIncludeFilter(author, pages, labels, tags, includeUnlabeled, includeUntagged, "chat")
        excludeFiltersChat = generateExcludeFilter(includeUnlabeled, includeUntagged, "chat")
        includeFiltersMsg = generateIncludeFilter(author, pages, labels, tags, includeUnlabeled, includeUntagged, "message")
        excludeFiltersMsg = generateExcludeFilter(includeUnlabeled, includeUntagged, "message")
        try:
            if(dateRange is None):
                if(filter == 0):
                    totalMessages = Message.objects.filter(includeFiltersMsg).exclude(excludeFiltersMsg).annotate(create_date=TruncDate('created_at')).values('create_date').annotate(message_count=Count("id", distinct=True))
                    totalChats = Chat.objects.filter(includeFiltersChat).exclude(excludeFiltersChat).annotate(create_date=TruncDate('created_at')).values('create_date').annotate(chat_count=Count("id", distinct=True))
                elif(filter == 1):
                    totalMessages = Message.objects.filter(includeFiltersMsg).exclude(excludeFiltersMsg).annotate(create_date=TruncMonth('created_at')).values('create_date').annotate(message_count=Count("id", distinct=True))
                    totalChats = Chat.objects.filter(includeFiltersChat).exclude(excludeFiltersChat).annotate(create_date=TruncMonth('created_at')).values('create_date').annotate(chat_count=Count("id", distinct=True))
                else:
                    totalMessages = Message.objects.filter(includeFiltersMsg).exclude(excludeFiltersMsg).annotate(create_date=TruncYear('created_at')).values('create_date').annotate(message_count=Count("id", distinct=True))
                    totalChats = Chat.objects.filter(includeFiltersChat).exclude(excludeFiltersChat).annotate(create_date=TruncYear('created_at')).values('create_date').annotate(chat_count=Count("id", distinct=True))
                daysSinceFirstChat = Chat.objects.filter(user=author).first().since
            else:
                startDate = parse_datetime(str(dateRange[0]))
                endDate = parse_datetime(str(dateRange[1]))
                newEndDate = endDate + datetime.timedelta(days=1)
                if(filter == 0):
                    totalMessages = Message.objects.filter(includeFiltersMsg, created_at__range=[startDate, newEndDate]).exclude(excludeFiltersMsg).annotate(create_date=TruncDate('created_at')).values('create_date').annotate(message_count=Count("id", distinct=True))
                    totalChats = Chat.objects.filter(includeFiltersChat, created_at__range=[startDate, newEndDate]).exclude(excludeFiltersChat).annotate(create_date=TruncDate('created_at')).values('create_date').annotate(chat_count=Count("id", distinct=True))
                elif(filter == 1):
                    totalMessages = Message.objects.filter(includeFiltersMsg, created_at__range=[startDate, newEndDate]).exclude(excludeFiltersMsg).exclude(excludeFiltersChat).annotate(create_date=TruncMonth('created_at')).values('create_date').annotate(message_count=Count("id", distinct=True))
                    totalChats = Chat.objects.filter(includeFiltersChat, created_at__range=[startDate, newEndDate]).exclude(excludeFiltersChat).annotate(create_date=TruncMonth('created_at')).values('create_date').annotate(chat_count=Count("id", distinct=True))
                else:
                    totalMessages = Message.objects.filter(includeFiltersMsg, created_at__range=[startDate, newEndDate]).exclude(excludeFiltersMsg).annotate(create_date=TruncYear('created_at')).values('create_date').annotate(message_count=Count("id", distinct=True))
                    totalChats = Chat.objects.filter(includeFiltersChat, created_at__range=[startDate, newEndDate]).exclude(excludeFiltersChat).annotate(create_date=TruncYear('created_at')).values('create_date').annotate(chat_count=Count("id", distinct=True))
                daysSinceFirstChat = (newEndDate - startDate).days
        except Chat.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        tempChats = { po['create_date']: po['chat_count'] for po in totalChats }
        tempMessages = { po['create_date']: po['message_count'] for po in totalMessages }
        if(filter == 0):
            if(dateRange is None):
                totalChatsResults = [
                {'create_date': (now_-timedelta(days=dy)).date(), 'chat_count': tempChats.setdefault((now_-timedelta(days=dy)).date(), 0)}
                for dy in range(daysSinceFirstChat+2)
                ]
                totalMessagesResults = [
                {'create_date': (now_-timedelta(days=dy)).date(), 'message_count': tempMessages.setdefault((now_-timedelta(days=dy)).date(), 0)}
                for dy in range(daysSinceFirstChat+2)
                ]
            else:
                totalChatsResults = [
                {'create_date': (newEndDate-timedelta(days=dy)).date(), 'chat_count': tempChats.setdefault((newEndDate-timedelta(days=dy)).date(), 0)}
                for dy in range(daysSinceFirstChat)
                ]
                totalMessagesResults = [
                {'create_date': (newEndDate-timedelta(days=dy)).date(), 'message_count': tempMessages.setdefault((newEndDate-timedelta(days=dy)).date(), 0)}
                for dy in range(daysSinceFirstChat)
                ]
        else:
            totalChatsResults = totalChats
            totalMessagesResults = totalMessages
        chatMessageCountByDate = mergeByDate(totalChatsResults, totalMessagesResults, 'create_date')
        return Response(chatMessageCountByDate, status=status.HTTP_200_OK)

class TotalChatsAndMessagesByItemView(APIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request, item, *args, **kwargs):
        author = self.request.user
        pages = request.data.get('pages')
        tags = request.data.get('tags')
        labels = request.data.get('labels')
        dateRange = request.data.get('dateRange')
        includeUnlabeled = request.data.get('includeUnlabeled')
        includeUntagged = request.data.get('includeUntagged')
        includeFiltersPage = generateIncludeFilter(author, pages, labels, tags, includeUnlabeled, includeUntagged, "page")
        excludeFiltersPage = generateExcludeFilter(includeUnlabeled, includeUntagged, "page")
        includeFiltersLabel = generateIncludeFilter(author, pages, labels, tags, includeUnlabeled, includeUntagged, "label")
        excludeFiltersLabel = generateExcludeFilter(includeUnlabeled, includeUntagged, "label")
        includeFiltersTag = generateIncludeFilter(author, pages, labels, tags, includeUnlabeled, includeUntagged, "tag")
        excludeFiltersTag = generateExcludeFilter(includeUnlabeled, includeUntagged, "tag")
        try: 
            if(dateRange is None):
                if(item == 0):
                    totalChatsMessages = Page.objects.filter(includeFiltersPage).exclude(excludeFiltersPage).values("id").values("label").annotate(chat_count=Count("chats__id", distinct=True), message_count=Count('chats__messages', distinct=True)).order_by("-chat_count")[:10]
                if(item == 1):
                    totalChatsMessages = Label.objects.filter(includeFiltersLabel).exclude(excludeFiltersLabel).values("id").values("label").annotate(chat_count=Count("chats__id", distinct=True), message_count=Count('chats__messages', distinct=True)).order_by("-chat_count")[:10]
                if(item == 2):
                    totalChatsMessages = Tag.objects.filter(includeFiltersTag).exclude(excludeFiltersTag).values("id").values("label").annotate(chat_count=Count("pages__chats__id", distinct=True), message_count=Count('pages__chats__messages', distinct=True)).order_by("-chat_count")[:10]
            else: 
                startDate = parse_datetime(str(dateRange[0]))
                endDate = parse_datetime(str(dateRange[1]))
                newEndDate = endDate + datetime.timedelta(days=1)
                if(item == 0):
                    totalChatsMessages = Page.objects.filter(includeFiltersPage).exclude(excludeFiltersPage).values("id").values("label").annotate(chat_count=Count("chats__id", filter=Q(chats__created_at__range=[startDate, newEndDate]), distinct=True), message_count=Count('chats__messages', filter=Q(chats__messages__created_at__range=[startDate, newEndDate]), distinct=True)).order_by("-chat_count")[:10]
                if(item == 1):
                    totalChatsMessages = Label.objects.filter(includeFiltersLabel).exclude(excludeFiltersLabel).values("id").values("label").annotate(chat_count=Count("chats__id", filter=Q(chats__created_at__range=[startDate, newEndDate]), distinct=True), message_count=Count('chats__messages', filter=Q(chats__messages__created_at__range=[startDate, newEndDate]), distinct=True)).order_by("-chat_count")[:10]
                if(item == 2):
                    totalChatsMessages = Tag.objects.filter(includeFiltersTag).exclude(excludeFiltersTag).values("id").values("label").annotate(chat_count=Count("pages__chats__id", filter=Q(pages__chats__created_at__range=[startDate, newEndDate]), distinct=True), message_count=Count('pages__chats__messages', filter=Q(pages__chats__messages__created_at__range=[startDate, newEndDate]), distinct=True)).order_by("-chat_count")[:10]
        except Page.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        return Response(totalChatsMessages, status=status.HTTP_200_OK)
    
class TotalEmissionView(APIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request, *args, **kwargs):
        author = self.request.user
        pages = request.data.get('pages')
        tags = request.data.get('tags')
        labels = request.data.get('labels')
        dateRange = request.data.get('dateRange')
        includeUnlabeled = request.data.get('includeUnlabeled')
        includeUntagged = request.data.get('includeUntagged')
        includeFiltersMsg = generateIncludeFilter(author, pages, labels, tags, includeUnlabeled, includeUntagged, "message")
        excludeFiltersMsg = generateExcludeFilter(includeUnlabeled, includeUntagged, "message")
        try:
            if(dateRange is None):
                totalMessages = Message.objects.filter(includeFiltersMsg).exclude(excludeFiltersMsg).distinct().count()
            else:
                startDate = parse_datetime(str(dateRange[0]))
                endDate = parse_datetime(str(dateRange[1]))
                newEndDate = endDate + datetime.timedelta(days=1)
                totalMessages = Message.objects.filter(includeFiltersMsg, created_at__range=[startDate, newEndDate]).exclude(excludeFiltersMsg).distinct().count()
        except Message.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        totalEmisson = totalMessages*2.2
        return Response(totalEmisson, status=status.HTTP_200_OK)
    
class TotalWaterWasteView(APIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request, *args, **kwargs):
        author = self.request.user
        pages = request.data.get('pages')
        tags = request.data.get('tags')
        labels = request.data.get('labels')
        dateRange = request.data.get('dateRange')
        includeUnlabeled = request.data.get('includeUnlabeled')
        includeUntagged = request.data.get('includeUntagged')
        includeFiltersMsg = generateIncludeFilter(author, pages, labels, tags, includeUnlabeled, includeUntagged, "message")
        excludeFiltersMsg = generateExcludeFilter(includeUnlabeled, includeUntagged, "message")
        try:
            if(dateRange is None):
                totalMessages = Message.objects.filter(includeFiltersMsg).exclude(excludeFiltersMsg).distinct().count()
            else:
                startDate = parse_datetime(str(dateRange[0]))
                endDate = parse_datetime(str(dateRange[1]))
                newEndDate = endDate + datetime.timedelta(days=1)
                totalMessages = Message.objects.filter(includeFiltersMsg, created_at__range=[startDate, newEndDate]).exclude(excludeFiltersMsg).distinct().count()
        except Message.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        totalWaterWaste = totalMessages*16.2866
        return Response(totalWaterWaste, status=status.HTTP_200_OK)

class TotalMoneyView(APIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request, *args, **kwargs):
        author = self.request.user
        pages = request.data.get('pages')
        tags = request.data.get('tags')
        labels = request.data.get('labels')
        dateRange = request.data.get('dateRange')
        includeUnlabeled = request.data.get('includeUnlabeled')
        includeUntagged = request.data.get('includeUntagged')
        includeFiltersMsg = generateIncludeFilter(author, pages, labels, tags, includeUnlabeled, includeUntagged, "message")
        excludeFiltersMsg = generateExcludeFilter(includeUnlabeled, includeUntagged, "message")
        try:
            if(dateRange is None):
                totalMessages = Message.objects.filter(includeFiltersMsg).exclude(excludeFiltersMsg).distinct().annotate(total_cost = Sum("input_tokens")*0.0000005+Sum("output_tokens")*0.0000015).aggregate(Sum('total_cost'))
            else:
                startDate = parse_datetime(str(dateRange[0]))
                endDate = parse_datetime(str(dateRange[1]))
                newEndDate = endDate + datetime.timedelta(days=1)
                totalMessages = Message.objects.filter(includeFiltersMsg, created_at__range=[startDate, newEndDate]).exclude(excludeFiltersMsg).distinct().annotate(total_cost = Sum("input_tokens")*0.0000005+Sum("output_tokens")*0.0000015).aggregate(Sum('total_cost'))
        except Message.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        totalCostList = [totalMessages [i] for i in sorted(totalMessages.keys()) ]
        if(len(totalCostList) > 0):
            totalCost = totalCostList[0]
        else:
            totalCost = 0
        return Response(totalCost, status=status.HTTP_200_OK)
    
class TotalTradeoffIndicatorsByDateView(APIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request, filter,  *args, **kwargs):
        author = self.request.user
        pages = request.data.get('pages')
        tags = request.data.get('tags')
        labels = request.data.get('labels')
        dateRange = request.data.get('dateRange')
        includeUnlabeled = request.data.get('includeUnlabeled')
        includeUntagged = request.data.get('includeUntagged')
        includeFiltersMsg = generateIncludeFilter(author, pages, labels, tags, includeUnlabeled, includeUntagged, "message")
        excludeFiltersMsg = generateExcludeFilter(includeUnlabeled, includeUntagged, "message")
        try:
            if(dateRange is None):
                if(filter == 0):
                    totalTradeOff = Message.objects.filter(includeFiltersMsg).exclude(excludeFiltersMsg).annotate(create_date=TruncDate('created_at')).values('create_date').annotate(total_emission=Count("id")*4.32).annotate(total_water_waste=Count("id")*16.2866).annotate(total_cost = Sum("input_tokens")*0.0000005+Sum("output_tokens")*0.0000015)
                elif(filter == 1):
                    totalTradeOff = Message.objects.filter(includeFiltersMsg).exclude(excludeFiltersMsg).annotate(create_date=TruncMonth('created_at')).values('create_date').annotate(total_emission=Count("id")*4.32).annotate(total_water_waste=Count("id")*16.2866).annotate(total_cost = Sum("input_tokens")*0.0000005+Sum("output_tokens")*0.0000015)
                else:
                    totalTradeOff = Message.objects.filter(includeFiltersMsg).exclude(excludeFiltersMsg).annotate(create_date=TruncYear('created_at')).values('create_date').annotate(total_emission=Count("id")*4.32).annotate(total_water_waste=Count("id")*16.2866).annotate(total_cost = Sum("input_tokens")*0.0000005+Sum("output_tokens")*0.0000015)
                daysSinceFirstChat = Chat.objects.filter(user=author).first().since
            else:
                startDate = parse_datetime(str(dateRange[0]))
                endDate = parse_datetime(str(dateRange[1]))
                newEndDate = endDate + datetime.timedelta(days=1)
                if(filter == 0):
                    totalTradeOff = Message.objects.filter(includeFiltersMsg, created_at__range=[startDate, newEndDate]).exclude(excludeFiltersMsg).annotate(create_date=TruncDate('created_at')).values('create_date').annotate(total_emission=Count("id")*4.32).annotate(total_water_waste=Count("id")*16.2866).annotate(total_cost = Sum("input_tokens")*0.0000005+Sum("output_tokens")*0.0000015)
                elif(filter == 1):
                    totalTradeOff = Message.objects.filter(includeFiltersMsg, created_at__range=[startDate, newEndDate]).exclude(excludeFiltersMsg).annotate(create_date=TruncMonth('created_at')).values('create_date').annotate(total_emission=Count("id")*4.32).annotate(total_water_waste=Count("id")*16.2866).annotate(total_cost = Sum("input_tokens")*0.0000005+Sum("output_tokens")*0.0000015)
                else:
                    totalTradeOff = Message.objects.filter(includeFiltersMsg, created_at__range=[startDate, newEndDate]).exclude(excludeFiltersMsg).annotate(create_date=TruncYear('created_at')).values('create_date').annotate(total_emission=Count("id")*4.32).annotate(total_water_waste=Count("id")*16.2866).annotate(total_cost = Sum("input_tokens")*0.0000005+Sum("output_tokens")*0.0000015)
                daysSinceFirstChat = (newEndDate - startDate).days
        except Chat.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        
        tempEmission = { po['create_date']: po['total_emission'] for po in totalTradeOff }
        tempWater = { po['create_date']: po['total_water_waste'] for po in totalTradeOff }
        tempCost = { po['create_date']: po['total_cost'] for po in totalTradeOff }

        if(filter == 0):
            if(dateRange is None):
                totalEmissionResult = [
                {'create_date': (now_-timedelta(days=dy)).date(), 'total_emission': tempEmission.setdefault((now_-timedelta(days=dy)).date(), 0), 'total_water_waste': tempWater.setdefault((now_-timedelta(days=dy)).date(), 0), 'total_cost': tempCost.setdefault((now_-timedelta(days=dy)).date(), 0)}
                for dy in range(daysSinceFirstChat+2)
                ]
            else:
                totalEmissionResult = [
                {'create_date': (newEndDate-timedelta(days=dy)).date(), 'total_emission': tempEmission.setdefault((newEndDate-timedelta(days=dy)).date(), 0), 'total_water_waste': tempWater.setdefault((newEndDate-timedelta(days=dy)).date(), 0), 'total_cost': tempCost.setdefault((newEndDate-timedelta(days=dy)).date(), 0)}
                for dy in range(daysSinceFirstChat)
                ]
        else:
            totalEmissionResult = totalTradeOff
        return Response(totalEmissionResult, status=status.HTTP_200_OK)

class TotalTradeoffIndicatorsByItemView(APIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request, item, *args, **kwargs):
        author = self.request.user
        pages = request.data.get('pages')
        tags = request.data.get('tags')
        labels = request.data.get('labels')
        dateRange = request.data.get('dateRange')
        includeUnlabeled = request.data.get('includeUnlabeled')
        includeUntagged = request.data.get('includeUntagged')
        includeFiltersPage = generateIncludeFilter(author, pages, labels, tags, includeUnlabeled, includeUntagged, "page")
        excludeFiltersPage = generateExcludeFilter(includeUnlabeled, includeUntagged, "page")
        includeFiltersLabel = generateIncludeFilter(author, pages, labels, tags, includeUnlabeled, includeUntagged, "label")
        excludeFiltersLabel = generateExcludeFilter(includeUnlabeled, includeUntagged, "label")
        includeFiltersTag = generateIncludeFilter(author, pages, labels, tags, includeUnlabeled, includeUntagged, "tag")
        excludeFiltersTag = generateExcludeFilter(includeUnlabeled, includeUntagged, "tag")
        try: 
            if(dateRange is None):
                if(item == 0):
                    totalTradeoff = Page.objects.filter(includeFiltersPage).exclude(excludeFiltersPage).values("id").values("label").annotate(total_emission=Count("chats__messages")*4.32).annotate(total_water_waste=Count("chats__messages")*16.2866).annotate(total_cost = Sum("chats__messages__input_tokens")*0.0000005+Sum("chats__messages__output_tokens")*0.0000015)[:10]
                if(item == 1):
                    totalTradeoff = Label.objects.filter(includeFiltersLabel).exclude(excludeFiltersLabel).values("id").values("label").annotate(total_emission=Count("chats__messages")*4.32).annotate(total_water_waste=Count("chats__messages")*16.2866).annotate(total_cost = Sum("chats__messages__input_tokens")*0.0000005+Sum("chats__messages__output_tokens")*0.0000015)[:10]
                if(item == 2):
                    totalTradeoff = Tag.objects.filter(includeFiltersTag).exclude(excludeFiltersTag).values("id").values("label").annotate(total_emission=Count("pages__chats__messages")*4.32).annotate(total_water_waste=Count("pages__chats__messages")*16.2866).annotate(total_cost = Sum("pages__chats__messages__input_tokens")*0.0000005+Sum("pages__chats__messages__output_tokens")*0.0000015)[:10]
            else: 
                startDate = parse_datetime(str(dateRange[0]))
                endDate = parse_datetime(str(dateRange[1]))
                newEndDate = endDate + datetime.timedelta(days=1)
                if(item == 0):
                    totalTradeoff = Page.objects.filter(includeFiltersPage).exclude(excludeFiltersPage).values("id").values("label").annotate(total_emission=Count("chats__messages")*4.32).annotate(total_water_waste=Count("chats__messages")*16.2866).annotate(total_cost = Sum("chats__messages__input_tokens")*0.0000005+Sum("chats__messages__output_tokens")*0.0000015)[:10]
                if(item == 1):
                    totalTradeoff = Label.objects.filter(includeFiltersLabel).exclude(excludeFiltersLabel).values("id").values("label").annotate(total_emission=Count("chats__messages")*4.32).annotate(total_water_waste=Count("chats__messages")*16.2866).annotate(total_cost = Sum("chats__messages__input_tokens")*0.0000005+Sum("chats__messages__output_tokens")*0.0000015)[:10]
                if(item == 2):
                    totalTradeoff = Tag.objects.filter(includeFiltersTag).exclude(excludeFiltersTag).values("id").values("label").annotate(total_emission=Count("pages__chats__messages")*4.32).annotate(total_water_waste=Count("pages__chats__messages")*16.2866).annotate(total_cost = Sum("pages__chats__messages__input_tokens")*0.0000005+Sum("pages__chats__messages__output_tokens")*0.0000015)[:10]
        except Page.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        return Response(totalTradeoff, status=status.HTTP_200_OK)
    
class KeyWordsView(APIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request,  *args, **kwargs):
        author = self.request.user
        pages = request.data.get('pages')
        tags = request.data.get('tags')
        labels = request.data.get('labels')
        dateRange = request.data.get('dateRange')
        includeUnlabeled = request.data.get('includeUnlabeled')
        includeUntagged = request.data.get('includeUntagged')
        includeFiltersMsg = generateIncludeFilter(author, pages, labels, tags, includeUnlabeled, includeUntagged, "message")
        excludeFiltersMsg = generateExcludeFilter(includeUnlabeled, includeUntagged, "message")
        try:
            if(dateRange is None):
                chatsWithMessages = Message.objects.filter(includeFiltersMsg).exclude(excludeFiltersMsg).values("chat").annotate(messageText=Concat('request', Value('. '), 'response')).values("messageText")
            else:
                startDate = parse_datetime(str(dateRange[0]))
                endDate = parse_datetime(str(dateRange[1]))
                newEndDate = endDate + datetime.timedelta(days=1)
                chatsWithMessages = Message.objects.filter(includeFiltersMsg, created_at__range=[startDate, newEndDate]).exclude(excludeFiltersMsg).values("chat").annotate(chatText=Concat('request', Value('. '), 'response')).annotate(messageText=StringAgg('chatText', delimiter='. ', default = ""))
        except Message.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        keywords = handle_array_keyword(chatsWithMessages)
        return Response(keywords, status=status.HTTP_200_OK)

class CommonNounsView(APIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request,  *args, **kwargs):
        author = self.request.user
        pages = request.data.get('pages')
        tags = request.data.get('tags')
        labels = request.data.get('labels')
        dateRange = request.data.get('dateRange')
        includeUnlabeled = request.data.get('includeUnlabeled')
        includeUntagged = request.data.get('includeUntagged')
        includeFiltersMsg = generateIncludeFilter(author, pages, labels, tags, includeUnlabeled, includeUntagged, "message")
        excludeFiltersMsg = generateExcludeFilter(includeUnlabeled, includeUntagged, "message")
        try:
            if(dateRange is None):
                concatMessages = Message.objects.filter(includeFiltersMsg).exclude(excludeFiltersMsg).values("chat").annotate(messageText=StringAgg('request', delimiter='. ', default = ""))
            else:
                startDate = parse_datetime(str(dateRange[0]))
                endDate = parse_datetime(str(dateRange[1]))
                newEndDate = endDate + datetime.timedelta(days=1)
                concatMessages = Message.objects.filter(includeFiltersMsg, created_at__range=[startDate, newEndDate]).exclude(excludeFiltersMsg).values("chat").annotate(messageText=StringAgg('request', delimiter='. ', default = ""))
        except Message.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        mostCommon = handle_array_common_word(concatMessages, 0)
        return Response(mostCommon, status=status.HTTP_200_OK)

class CommonVerbsView(APIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request,  *args, **kwargs):
        author = self.request.user
        pages = request.data.get('pages')
        tags = request.data.get('tags')
        labels = request.data.get('labels')
        dateRange = request.data.get('dateRange')
        includeUnlabeled = request.data.get('includeUnlabeled')
        includeUntagged = request.data.get('includeUntagged')
        includeFiltersMsg = generateIncludeFilter(author, pages, labels, tags, includeUnlabeled, includeUntagged, "message")
        excludeFiltersMsg = generateExcludeFilter(includeUnlabeled, includeUntagged, "message")
        try:
            if(dateRange is None):
                concatMessages = Message.objects.filter(includeFiltersMsg).exclude(excludeFiltersMsg).values("chat").annotate(messageText=StringAgg('request', delimiter='. ', default = ""))
            else:
                startDate = parse_datetime(str(dateRange[0]))
                endDate = parse_datetime(str(dateRange[1]))
                newEndDate = endDate + datetime.timedelta(days=1)
                concatMessages = Message.objects.filter(includeFiltersMsg, created_at__range=[startDate, newEndDate]).exclude(excludeFiltersMsg).values("chat").annotate(messageText=StringAgg('request', delimiter='. ', default = ""))
        except Message.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        mostCommon = handle_array_common_word(concatMessages, 1)
        return Response(mostCommon, status=status.HTTP_200_OK)
    
class CommonAdjectivesView(APIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request,  *args, **kwargs):
        author = self.request.user
        pages = request.data.get('pages')
        tags = request.data.get('tags')
        labels = request.data.get('labels')
        dateRange = request.data.get('dateRange')
        includeUnlabeled = request.data.get('includeUnlabeled')
        includeUntagged = request.data.get('includeUntagged')
        includeFiltersMsg = generateIncludeFilter(author, pages, labels, tags, includeUnlabeled, includeUntagged, "message")
        excludeFiltersMsg = generateExcludeFilter(includeUnlabeled, includeUntagged, "message")
        try:
            if(dateRange is None):
                concatMessages = Message.objects.filter(includeFiltersMsg).exclude(excludeFiltersMsg).values("chat").annotate(messageText=StringAgg('request', delimiter='. ', default = ""))
            else:
                startDate = parse_datetime(str(dateRange[0]))
                endDate = parse_datetime(str(dateRange[1]))
                newEndDate = endDate + datetime.timedelta(days=1)
                concatMessages = Message.objects.filter(includeFiltersMsg, created_at__range=[startDate, newEndDate]).exclude(excludeFiltersMsg).values("chat").annotate(messageText=StringAgg('request', delimiter='. ', default = ""))
        except Message.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        mostCommon = handle_array_common_word(concatMessages, 2)
        return Response(mostCommon, status=status.HTTP_200_OK)


