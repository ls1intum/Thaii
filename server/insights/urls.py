from django.urls import path
from . import views

urlpatterns= [
    path("insights/total-chats/", views.TotalChatsView.as_view(), name="total-chats"),
    path("insights/total-messages/", views.TotalMessagesView.as_view(), name="total-messages"),
    path("insights/messages-chats-by-time/<int:filter>/", views.TotalChatsAndMessagesByDateView.as_view(), name="total-messages-by-time"),  
    path("insights/messages-chats-by-item/<int:item>/", views.TotalChatsAndMessagesByItemView.as_view(), name="total-messages-by-page"), 
    path("insights/conversation-duration/", views.AverageConversationTimeView.as_view(), name="conversation_duration"),
    path("insights/conversation-duration-by-item/<int:item>/", views.AverageConversationTimeByItemView.as_view(), name="conversation_duration-by-item"),
    path("insights/total-emission/", views.TotalEmissionView.as_view(), name="total-emissions"),
    path("insights/total-water/", views.TotalWaterWasteView.as_view(), name="total-water"),
    path("insights/total-cost/", views.TotalMoneyView.as_view(), name="total-cost"),
    path("insights/tradeoff-by-time/<int:filter>/", views.TotalTradeoffIndicatorsByDateView.as_view(), name="tradeoff-by-time"),  
    path("insights/tradeoff-by-item/<int:item>/", views.TotalTradeoffIndicatorsByItemView.as_view(), name="tradeoff-by-item"),
    path("insights/keywords/", views.KeyWordsView.as_view(), name="keywords"),
    path("insights/common-nouns/", views.CommonNounsView.as_view(), name="common-nouns"),
    path("insights/common-verbs/", views.CommonVerbsView.as_view(), name="common-verbs"),
    path("insights/common-adjectives/", views.CommonAdjectivesView.as_view(), name="common-adjectives"),

]