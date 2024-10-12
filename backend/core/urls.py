from django.urls import path
from .views import AddManualConnectView, UserConnectionsCountView, UserConnectionsView, UserProfileView,  KnowledgeView, SendFriendRequestView, RespondToFriendRequestView, ListFriendRequestsView

urlpatterns = [
    path('users/', UserProfileView.as_view(), name='user_profile'),
    path('knowledges/', KnowledgeView.as_view(), name='knowledge'),
    
    path('send-friend-request/', SendFriendRequestView.as_view(), name='send_friend_request'),
    path('friend-request/<int:request_id>/', RespondToFriendRequestView.as_view(), name='respond_friend_request'),
    path('friend-requests/<str:user_id>/', ListFriendRequestsView.as_view(), name='list_friend_requests'),
    path('add-manual-connect/', AddManualConnectView.as_view(), name='add_manual_connect'),
    path('users/connections-count/<str:user_id>', UserConnectionsCountView.as_view(), name='user_connections_count'),
    path('users/connections/<str:user_id>', UserConnectionsView.as_view(), name='user_connections'),
    
    path('users/connections/<str:user_id>/<str:connection_id>/', UserConnectionsView.as_view(), name='user_connection_detail'),

]
