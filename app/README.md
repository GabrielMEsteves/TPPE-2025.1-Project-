## Configuração de E-mail (Confirmação de Compra)

Para que o sistema envie e-mails de confirmação de compra de passagem, configure as seguintes variáveis de ambiente no backend:

```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=seu_email@gmail.com
SMTP_PASS=sua_senha_de_aplicativo
```

Recomenda-se usar uma senha de aplicativo (Gmail) ou credenciais de um serviço SMTP confiável. 