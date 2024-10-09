from django.db import models

# Perfil do Utilizador
class UserProfile(models.Model):
    user_id = models.CharField(max_length=255, unique=True)  # O ID do utilizador Clerk
    first_name = models.CharField(max_length=255, blank=True, null=True)  # Made optional
    last_name = models.CharField(max_length=255, blank=True, null=True)   # Made optional
    phone = models.CharField(max_length=255, blank=True, null=True)
    knowledges = models.JSONField(default=list, blank=True, null=True)  # Campo para armazenar conhecimentos (array de strings)
    connects = models.ManyToManyField('self', symmetrical=False, related_name='connections', blank=True)

    @property
    def full_name(self):
        return f"{self.first_name or ''} {self.last_name or ''}".strip()

    def __str__(self):
        return self.full_name or self.user_id

# Pedido de Amizade (FriendRequest)
class FriendRequest(models.Model):
    from_user = models.ForeignKey(UserProfile, related_name='sent_requests', on_delete=models.CASCADE)
    to_user = models.ForeignKey(UserProfile, related_name='received_requests', on_delete=models.CASCADE)
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Friend request from {self.from_user.full_name} to {self.to_user.full_name}"
