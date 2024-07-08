from django.db.models import Q

def generateIncludeFilter(author, pages, labels, tags, includeUnlabeled, includeUntagged, type):
    if(type == "chat"):
        if(not includeUnlabeled):
            return Q(Q(user=author), Q(page__in=pages), Q(labels__in=labels), Q(page__tags__in=tags) | Q(page__tags=None))
        elif(not includeUntagged):
            return Q(Q(user=author), Q(page__in=pages), Q(labels__in=labels) | Q(labels=None), Q(page__tags__in=tags))
        elif(not includeUnlabeled and not includeUntagged):
            return Q(Q(user=author), Q(page__in=pages), Q(labels__in=labels), Q(page__tags__in=tags))
        else:
            return Q(Q(user=author), Q(page__in=pages), Q(labels__in=labels) | Q(labels=None), Q(page__tags__in=tags) | Q(page__tags=None))
    if(type == "message"):
        if(not includeUnlabeled):
            return Q(Q(user=author), Q(chat__page__in=pages), Q(chat__labels__in=labels), Q(chat__page__tags__in=tags) | Q(chat__page__tags=None))
        elif(not includeUntagged):
            return Q(Q(user=author), Q(chat__page__in=pages), Q(chat__labels__in=labels) | Q(chat__labels=None), Q(chat__page__tags__in=tags))
        elif(not includeUnlabeled and not includeUntagged):
            return Q(Q(user=author), Q(chat__page__in=pages), Q(chat__labels__in=labels), Q(chat__page__tags__in=tags))
        else:
            return Q(Q(user=author), Q(chat__page__in=pages), Q(chat__labels__in=labels) | Q(chat__labels=None), Q(chat__page__tags__in=tags) | Q(chat__page__tags=None))
    if(type == "label"):
        if(not includeUnlabeled):
            return Q(Q(user=author), Q(chats__page__in=pages), Q(id__in=labels), Q(chats__page__tags__in=tags) | Q(chats__page__tags=None))
        elif(not includeUntagged):
            return Q(Q(user=author), Q(chats__page__in=pages), Q(id__in=labels), Q(chats__page__tags__in=tags))
        elif(not includeUnlabeled and not includeUntagged):
            return Q(Q(user=author), Q(chats__page__in=pages), Q(id__in=labels), Q(chats__page__tags__in=tags))
        else:
            return Q(Q(user=author), Q(chats__page__in=pages), Q(id__in=labels), Q(chats__page__tags__in=tags) | Q(chats__page__tags=None))
    if(type == "tag"):
        if(not includeUnlabeled):
            return Q(Q(user=author), Q(pages__in=pages), Q(pages__chats__labels__in=labels), Q(id__in=tags))
        elif(not includeUntagged):
            return Q(Q(user=author), Q(pages__in=pages), Q(pages__chats__labels__in=labels) | Q(pages__chats__labels__in=None), Q(id__in=tags))
        elif(not includeUnlabeled and not includeUntagged):
            return Q(Q(user=author), Q(pages__in=pages), Q(pages__chats__labels__in=labels), Q(id__in=tags))
        else:
            return Q(Q(user=author), Q(pages__in=pages), Q(pages__chats__labels__in=labels) | Q(pages__chats__labels=None), Q(id__in=tags))
    if(type == "page"):
        if(not includeUnlabeled):
            return Q(Q(user=author), Q(id__in=pages), Q(chats__labels__in=labels), Q(tags__in=tags) | Q(tags=None))
        elif(not includeUntagged):
            return Q(Q(user=author), Q(id__in=pages), Q(chats__labels__in=labels) | Q(chats__labels=None), Q(tags__in=tags))
        elif(not includeUnlabeled and not includeUntagged):
            return Q(Q(user=author), Q(id__in=pages), Q(chats__labels__in=labels), Q(tags__in=tags))
        else:
            return Q(Q(user=author), Q(id__in=pages), Q(chats__labels__in=labels) | Q(chats__labels=None), Q(tags__in=tags) | Q(tags=None))
        
def generateExcludeFilter(includeUnlabeled, includeUntagged, type):
    if(type == "chat"):
        if(not includeUnlabeled):
            return Q(labels=None)
        elif(not includeUntagged):
            return Q(page__tags=None)
        elif(not includeUnlabeled and not includeUntagged):
            return Q(page__tags=None) | Q(labels=None)
        else:
            return Q()
    if(type == "message"):
        if(not includeUnlabeled):
            return Q(chat__labels=None)
        elif(not includeUntagged):
            return Q(chat__page__tags=None)
        elif(not includeUnlabeled and not includeUntagged):
            return Q(chat__page__tags=None) | Q(chat__labels=None)
        else:
            return Q()
    if(type == "label"):
        if(not includeUnlabeled):
            return Q()
        elif(not includeUntagged):
            return Q(chats__page__tags=None)
        elif(not includeUnlabeled and not includeUntagged):
            return Q(chats__page__tags=None)
        else:
            return Q()
    if(type == "tag"):
        if(not includeUnlabeled):
            return Q(pages__chats__labels=None)
        elif(not includeUntagged):
            return Q()
        elif(not includeUnlabeled and not includeUntagged):
            return Q(pages__chats__labels=None)
        else:
            return Q()
    if(type == "page"):
        if(not includeUnlabeled):
            return Q(chats__labels=None)
        elif(not includeUntagged):
            return Q(tags=None)
        elif(not includeUnlabeled and not includeUntagged):
            return Q(tags=None) | Q(chats__labels=None)
        else:
            return Q()
