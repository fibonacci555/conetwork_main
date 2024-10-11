from django.urls import path
from .views import AddManualConnectView, UserConnectionsCountView, UserProfileView,  KnowledgeView, SendFriendRequestView, RespondToFriendRequestView, ListFriendRequestsView

urlpatterns = [
    path('users/', UserProfileView.as_view(), name='user_profile'),
    path('knowledges/', KnowledgeView.as_view(), name='knowledge'),
    
    path('send-friend-request/', SendFriendRequestView.as_view(), name='send_friend_request'),
    path('friend-request/<int:request_id>/', RespondToFriendRequestView.as_view(), name='respond_friend_request'),
    path('friend-requests/<str:user_id>/', ListFriendRequestsView.as_view(), name='list_friend_requests'),
    path('add-manual-connect/', AddManualConnectView.as_view(), name='add_manual_connect'),
    path('api/users/<str:user_id>/connections-count/', UserConnectionsCountView.as_view(), name='user_connections_count'),
]
