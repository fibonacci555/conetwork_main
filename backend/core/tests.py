from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status

class ClerkAuthMiddlewareTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.valid_token = "Bearer <SEU_TOKEN_JWT>"  # Substitui pelo token válido para teste
        self.invalid_token = "Bearer invalid_token"

    def test_access_with_valid_token(self):
        # Configura o cabeçalho com o token válido
        self.client.credentials(HTTP_AUTHORIZATION=self.valid_token)
        response = self.client.get('/api/users/')  # Endereço da tua API protegida

        # Espera um status 200 se o token for válido
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_access_with_invalid_token(self):
        # Configura o cabeçalho com o token inválido
        self.client.credentials(HTTP_AUTHORIZATION=self.invalid_token)
        response = self.client.get('/api/users/')  # Endereço da tua API protegida

        # Espera um status 401 se o token for inválido
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
