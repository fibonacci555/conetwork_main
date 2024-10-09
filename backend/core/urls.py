from django.urls import path
from .views import UserProfileView, FriendRequestView, AcceptFriendRequestView, KnowledgeView

urlpatterns = [
    path('users/', UserProfileView.as_view(), name='user_profile'),
    path('knowledges/', KnowledgeView.as_view(), name='knowledge'),
    path('friend-requests/', FriendRequestView.as_view(), name='friend_requests'),
    path('accept-friend-request/', AcceptFriendRequestView.as_view(), name='accept_friend_request'),
]
