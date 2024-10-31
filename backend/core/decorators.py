# decorators.py

from functools import wraps
from .utils import create_user_profile

def ensure_user_profile(func):
    @wraps(func)
    def wrapper(self, request, *args, **kwargs):
        # Obter o user_id do request
        user_id = request.data.get('user_id') or request.query_params.get('user_id') or kwargs.get('user_id')
        if not user_id:
            # Se não estiver no request, tentar obter do usuário autenticado
            user = getattr(request, 'user', None)
            user_id = getattr(user, 'user_id', None)
        
        if user_id:
            create_user_profile(user_id)
        else:
            print('User ID não fornecido na requisição.')
        return func(self, request, *args, **kwargs)
    return wrapper
